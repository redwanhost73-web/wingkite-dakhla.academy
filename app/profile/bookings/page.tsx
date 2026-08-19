'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { toast, Toaster } from 'sonner'
import { CalendarPlus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { TextField, SelectField, FormField, formControlClassName } from '@/components/ui/form-field'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { cn } from '@/lib/utils'

type Booking = {
  id: string
  status: 'requested' | 'confirmed' | 'cancelled' | 'completed'
  activity: string
  preferred_date: string | null
  people: number
  notes: string
  created_at: string
}

const STATUS_STYLE: Record<Booking['status'], string> = {
  requested: 'bg-amber-50 text-amber-800',
  confirmed: 'bg-emerald-50 text-emerald-800',
  cancelled: 'bg-red-50 text-red-700',
  completed: 'bg-[#E8EEF6] text-[#072A5A]',
}

export default function ProfileBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [setupRequired, setSetupRequired] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [activity, setActivity] = useState('Wingfoil lesson')
  const [preferredDate, setPreferredDate] = useState('')
  const [people, setPeople] = useState('1')
  const [notes, setNotes] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('schema cache')) {
        setSetupRequired(true)
      } else {
        toast.error(error.message)
      }
      setBookings([])
    } else {
      setBookings((data as Booking[]) || [])
      setSetupRequired(false)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const createBooking = async (e: FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    if (!supabase) return
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    setBusy(true)
    const { error } = await supabase.from('bookings').insert({
      user_id: user.id,
      activity,
      preferred_date: preferredDate || null,
      people: Math.max(1, Number(people) || 1),
      notes: notes.trim(),
      status: 'requested',
    })
    setBusy(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Booking request sent')
    setOpenForm(false)
    setNotes('')
    setPreferredDate('')
    load()
  }

  const cancelBooking = async () => {
    if (!deleteId) return
    const supabase = createClient()
    if (!supabase) return
    setBusy(true)
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', deleteId)
    setBusy(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Booking cancelled')
    setDeleteId(null)
    load()
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" richColors />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Bookings</h1>
          <p className="mt-2 text-sm text-[#3D4F6F]">
            Request lessons from your profile. The school will confirm dates with you.
          </p>
        </div>
        {!setupRequired && (
          <button
            type="button"
            onClick={() => setOpenForm((v) => !v)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0B1F3B] px-4 text-xs font-bold text-white hover:bg-[#0046A4]"
          >
            <CalendarPlus className="h-3.5 w-3.5" />
            {openForm ? 'Close form' : 'New request'}
          </button>
        )}
      </div>

      {setupRequired && (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Bookings table is not ready yet. Ask an admin to run{' '}
          <code className="rounded bg-white px-1">scripts/005_student_role_and_bookings.sql</code> in
          Supabase. You can still{' '}
          <Link href="/fr/contact" className="font-semibold underline">
            contact the school
          </Link>
          .
        </p>
      )}

      {openForm && !setupRequired && (
        <form
          onSubmit={createBooking}
          className="space-y-4 rounded-2xl border border-[#072A5A]/8 bg-white p-6"
        >
          <SelectField
            label="Activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          >
            <option>Wingfoil lesson</option>
            <option>Kitesurf lesson</option>
            <option>Coaching session</option>
            <option>Media pack</option>
            <option>Other</option>
          </SelectField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Preferred date">
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className={formControlClassName}
              />
            </FormField>
            <TextField
              label="People"
              type="number"
              min={1}
              max={20}
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            />
          </div>
          <FormField label="Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Level, dates flexibility, hotel…"
              className={cn(formControlClassName, 'h-auto min-h-[6rem] py-3')}
            />
          </FormField>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-[#0B1F3B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0046A4] disabled:opacity-60"
          >
            {busy ? 'Sending…' : 'Submit request'}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#072A5A]/8 bg-white">
        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-[#7A8AA3]">Loading bookings…</p>
        ) : bookings.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-[#7A8AA3]">
            No booking requests yet. Start one above or{' '}
            <Link href="/fr/contact" className="font-semibold text-[#0046A4]">
              message the school
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-[#072A5A]/8">
            {bookings.map((b) => (
              <li key={b.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{b.activity}</p>
                    <span
                      className={cn(
                        'rounded-md px-2 py-0.5 text-[0.65rem] font-bold capitalize',
                        STATUS_STYLE[b.status],
                      )}
                    >
                      {b.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#7A8AA3]">
                    {b.preferred_date
                      ? `Preferred ${new Date(b.preferred_date).toLocaleDateString()}`
                      : 'Date flexible'}
                    {' · '}
                    {b.people} {b.people === 1 ? 'person' : 'people'}
                  </p>
                  {b.notes && <p className="mt-1 text-sm text-[#3D4F6F]">{b.notes}</p>}
                </div>
                {b.status === 'requested' && (
                  <button
                    type="button"
                    onClick={() => setDeleteId(b.id)}
                    className="inline-flex h-9 items-center gap-1.5 self-start rounded-full border border-red-200 px-3 text-xs font-bold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Cancel
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Cancel this request?"
        description="The school will no longer see this as an open booking request."
        confirmLabel="Cancel request"
        tone="danger"
        loading={busy}
        onConfirm={cancelBooking}
      />
    </div>
  )
}
