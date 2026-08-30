import { notFound } from 'next/navigation'
import { PageLayout } from '@/components/page-layout'
import { AccommodationRoomContent } from '@/components/accommodation-room-content'
import { getHotel, getRoom, HOTELS } from '@/lib/accommodation'
import { getMessages } from '@/lib/i18n'
import { pickLocale } from '@/lib/cms/types'

type Props = { params: Promise<{ hotel: string; room: string }> }

export function generateStaticParams() {
  return HOTELS.flatMap((hotel) =>
    hotel.rooms.map((room) => ({ hotel: hotel.id, room: room.id })),
  )
}

export async function generateMetadata({ params }: Props) {
  const { hotel: hotelId, room: roomId } = await params
  const hotel = getHotel(hotelId)
  const room = getRoom(hotelId, roomId)
  if (!hotel || !room) return { title: 'Habitación' }
  return {
    title: `${pickLocale(room.name, 'es')} — ${pickLocale(hotel.name, 'es')} | Alojamiento`,
    description: pickLocale(room.desc, 'es'),
  }
}

export default async function AccommodationRoomPage({ params }: Props) {
  const { hotel: hotelId, room: roomId } = await params
  if (!getHotel(hotelId) || !getRoom(hotelId, roomId)) notFound()
  const messages = await getMessages('es')
  return (
    <PageLayout locale="es" messages={messages}>
      <AccommodationRoomContent hotelId={hotelId} roomId={roomId} />
    </PageLayout>
  )
}
