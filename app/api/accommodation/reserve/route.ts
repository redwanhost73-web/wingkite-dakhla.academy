import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'
import { recordAdminNotification } from '@/lib/admin/notify'
import { getHotel, getMealPlan, getRoom, nightsBetween } from '@/lib/accommodation'
import { pickLocale } from '@/lib/cms/types'

const bodySchema = z.object({
  hotelId: z.string().min(1),
  roomId: z.string().min(1),
  mealPlan: z.enum(['bb', 'hb', 'fb']),
  guests: z.number().int().min(1).max(20),
  arrival: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  departure: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  locale: z.string().max(8).optional(),
})

export async function POST(req: Request) {
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid fields', details: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const hotel = getHotel(data.hotelId)
  const room = getRoom(data.hotelId, data.roomId)
  if (!hotel || !room) {
    return NextResponse.json({ error: 'Unknown room' }, { status: 404 })
  }
  if (data.guests > room.maxGuests) {
    return NextResponse.json({ error: `Max ${room.maxGuests} guests for this room` }, { status: 400 })
  }

  const nights = nightsBetween(data.arrival, data.departure)
  if (nights < 1) {
    return NextResponse.json({ error: 'Departure must be after arrival' }, { status: 400 })
  }

  const meal = getMealPlan(room, data.mealPlan)
  if (!meal) {
    return NextResponse.json({ error: 'Invalid meal plan' }, { status: 400 })
  }

  const locale = data.locale || 'fr'
  const row = {
    hotel_id: hotel.id,
    hotel_name: pickLocale(hotel.name, locale),
    room_id: room.id,
    room_name: pickLocale(room.name, locale),
    meal_plan: meal.id,
    guests: data.guests,
    arrival_date: data.arrival,
    departure_date: data.departure,
    nights,
    price_per_night: meal.pricePerNight,
    total_estimate: Math.round(meal.pricePerNight * nights * 100) / 100,
    guest_name: data.name.trim(),
    guest_email: data.email.trim().toLowerCase(),
    guest_phone: data.phone?.trim() || null,
    notes: data.notes?.trim() || '',
    locale,
    status: 'new',
  }

  const service = createServiceClient()
  let supabase = service
  if (!supabase) {
    try {
      supabase = await createClient()
    } catch {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }
  }

  const { data: inserted, error } = await supabase
    .from('accommodation_reservations')
    .insert(row)
    .select('id')
    .single()

  if (error) {
    const missing =
      error.code === 'PGRST205' ||
      error.message.includes('schema cache') ||
      error.message.includes('does not exist')
    return NextResponse.json(
      {
        error: missing
          ? 'Reservations table not ready — run scripts/008_accommodation_reservations.sql'
          : error.message,
      },
      { status: missing ? 503 : 500 },
    )
  }

  if (service) {
    await recordAdminNotification(service, {
      type: 'system',
      title: `Stay request: ${row.room_name}`,
      body: `${row.guest_name} · ${row.arrival_date} → ${row.departure_date} · ${row.guests} guests`,
      meta: { href: '/admin/reservations', reservationId: inserted?.id },
    })
  }

  return NextResponse.json({ ok: true, id: inserted?.id })
}
