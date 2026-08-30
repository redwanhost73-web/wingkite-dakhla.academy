'use client'

import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { AdminPageHeader } from '@/components/admin/admin-ui'
import { cn } from '@/lib/utils'

type Status = 'new' | 'contacted' | 'confirmed' | 'cancelled'

type Reservation = {
  id: string
  hotel_name: string
  room_name: string
  meal_plan: string
  guests: number
  arrival_date: string
  departure_date: string
  nights: number
  price_per_night: number | null
  total_estimate: number | null
  guest_name: string
  guest_email: string
  guest_phone: string | null
  notes: string
  locale: string | null
  status: Status
  created_at: string
}

const STATUS_STYLE: Record<Status, string> = {
  new: 'bg-amber-50 text-amber-800',
  contacted: 'bg-sky-50 text-sky-800',
  confirmed: 'bg-emerald-50 text-emerald-800',
  cancelled: 'bg-red-50 text-red-700',
}

const MEAL_LABEL: Record<string, string> = {
  bb: 'Bed & Breakfast',
  hb: 'Half Board',
  fb: 'Full Board',
}

export function ReservationsManager() {
  const [rows, setRows] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [setupRequired, setSetupRequired] = useState(false)
  const [filter, setFilter] = useState<'all' | Status>('all')

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }
    let q = supabase
      .from('accommodation_reservations')
      .select('*')
      .order('created_at', { ascending: false })
    if (filter !== 'all') q = q.eq('status', filter)

    const { data, error } = await q
    if (error) {
      if (
        error.code === 'PGRST205' ||
        error.message.includes('schema cache') ||
        error.message.includes('does not exist')
      ) {
        setSetupRequired(true)
      } else {
        toast.error(error.message)
      }
      setRows([])
    } else {
      setRows((data as Reservation[]) || [])
      setSetupRequired(false)
    }
    setLoading(false)
  }, [filter])

  useEffect(() => {
    load()
  }, [load])

  const setStatus = async (id: string, status: Status) => {
    const supabase = createClient()
    if (!supabase) return
    const { error } = await supabase
      .from('accommodation_reservations')
      .update({ status })
      .eq('id', id)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(`Marked ${status}`)
    load()
  }

  return (
    <div>
      <Toaster position="top-right" richColors />
      <AdminPageHeader
        title="Stay reservations"
        description="Requests from the Hébergement booking flow. Confirm availability with the guest by email or phone."
        backHref="/admin"
        backLabel="Dashboard"
        actions={
          <button
            type="button"
            onClick={() => load()}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-[#072A5A]/10 bg-white px-3 text-xs font-bold text-[#072A5A] hover:bg-[#F5F7FA]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        }
      />

      {setupRequired && (
        <p className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Table missing. Run{' '}
          <code className="rounded bg-white px-1">scripts/008_accommodation_reservations.sql</code> in
          Supabase, then refresh.
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'new', 'contacted', 'confirmed', 'cancelled'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-bold capitalize',
              filter === s ? 'bg-[#0B1F3B] text-white' : 'bg-white text-[#3D4F6F] ring-1 ring-[#072A5A]/10',
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#072A5A]/8 bg-white">
        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-[#7A8AA3]">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-[#7A8AA3]">No reservation requests yet.</p>
        ) : (
          <ul className="divide-y divide-[#072A5A]/6">
            {rows.map((r) => (
              <li key={r.id} className="px-5 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide',
                          STATUS_STYLE[r.status],
                        )}
                      >
                        {r.status}
                      </span>
                      <p className="font-heading text-lg font-bold text-[#072A5A]">
                        {r.room_name}
                        <span className="font-semibold text-[#7A8AA3]"> · {r.hotel_name}</span>
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-[#3D4F6F]">
                      {r.arrival_date} → {r.departure_date} · {r.nights} night{r.nights === 1 ? '' : 's'} ·{' '}
                      {r.guests} guest{r.guests === 1 ? '' : 's'} · {MEAL_LABEL[r.meal_plan] || r.meal_plan}
                      {r.total_estimate != null ? ` · ≈ €${Number(r.total_estimate).toFixed(2)}` : ''}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#072A5A]">
                      {r.guest_name}{' '}
                      <a className="font-medium text-[#0046A4] hover:underline" href={`mailto:${r.guest_email}`}>
                        {r.guest_email}
                      </a>
                      {r.guest_phone ? (
                        <>
                          {' · '}
                          <a className="font-medium text-[#0046A4] hover:underline" href={`tel:${r.guest_phone}`}>
                            {r.guest_phone}
                          </a>
                        </>
                      ) : null}
                    </p>
                    {r.notes ? <p className="mt-2 text-sm text-[#5A6B85]">{r.notes}</p> : null}
                    <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-wider text-[#7A8AA3]">
                      {new Date(r.created_at).toLocaleString()} · locale {r.locale || '—'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(['contacted', 'confirmed', 'cancelled'] as Status[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={r.status === s}
                        onClick={() => setStatus(r.id, s)}
                        className="rounded-full px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wide text-[#072A5A] ring-1 ring-[#072A5A]/12 hover:bg-[#F5F7FA] disabled:opacity-40"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
