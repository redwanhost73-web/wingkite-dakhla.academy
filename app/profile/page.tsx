'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Toaster } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { fetchMyProfile } from '@/lib/auth/session'
import type { Profile } from '@/lib/auth/roles'
import { roleLabel } from '@/lib/auth/roles'
import { TextField } from '@/components/ui/form-field'
import { PhoneInput } from '@/components/ui/phone-input'

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchMyProfile().then((p) => {
      setProfile(p)
      setFullName(p?.full_name || '')
      setPhone(p?.phone || '')
      setLoading(false)
    })
  }, [])

  const onSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!profile) return
    const supabase = createClient()
    if (!supabase) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim(), phone })
      .eq('id', profile.id)
    setSaving(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Profile updated')
    setProfile({ ...profile, full_name: fullName.trim(), phone })
  }

  if (loading) {
    return <p className="text-sm text-[#7A8AA3]">Loading…</p>
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-right" richColors />
      <div>
        <h1 className="font-heading text-3xl font-bold">Your profile</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#3D4F6F]">
          Manage your details as a {profile ? roleLabel(profile.role).toLowerCase() : 'member'}.
          You can keep browsing the public site anytime — this page is only for your account.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/fr/pricing"
          className="rounded-2xl border border-[#072A5A]/8 bg-white p-5 transition-colors hover:border-[#0046A4]/30"
        >
          <p className="font-heading text-lg font-bold">Browse courses</p>
          <p className="mt-1 text-sm text-[#7A8AA3]">Public pricing & packages</p>
        </Link>
        <Link
          href="/fr/contact"
          className="rounded-2xl border border-[#072A5A]/8 bg-white p-5 transition-colors hover:border-[#0046A4]/30"
        >
          <p className="font-heading text-lg font-bold">Contact school</p>
          <p className="mt-1 text-sm text-[#7A8AA3]">Ask about lessons or stays</p>
        </Link>
        <Link
          href="/profile/bookings"
          className="rounded-2xl border border-[#072A5A]/8 bg-white p-5 transition-colors hover:border-[#0046A4]/30"
        >
          <p className="font-heading text-lg font-bold">My bookings</p>
          <p className="mt-1 text-sm text-[#7A8AA3]">Requests & status</p>
        </Link>
      </div>

      <form
        onSubmit={onSave}
        className="space-y-4 rounded-2xl border border-[#072A5A]/8 bg-white p-6 shadow-[0_10px_30px_rgba(11,31,59,0.04)] sm:p-8"
      >
        <h2 className="font-heading text-xl font-bold">Account details</h2>
        <TextField label="Email" value={profile?.email || ''} disabled hint="Contact the school to change email." />
        <TextField
          label="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <PhoneInput
          label="Phone"
          value={phone}
          onChange={setPhone}
          autoDetect={!phone}
          defaultCountry="MA"
        />
        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-xs text-[#7A8AA3]">
            Role: <strong className="text-[#072A5A]">{profile ? roleLabel(profile.role) : '—'}</strong>
          </p>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[#0B1F3B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0046A4] disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
