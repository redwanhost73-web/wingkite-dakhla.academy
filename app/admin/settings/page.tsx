'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminPageHeader } from '@/components/admin/admin-ui'

type Settings = Record<string, string | number>

const FIELDS: { key: string; label: string; type?: 'text' | 'number' }[] = [
  { key: 'school_name', label: 'School name' },
  { key: 'phone', label: 'Phone' },
  { key: 'whatsapp', label: 'WhatsApp (digits)' },
  { key: 'email_public', label: 'Public email' },
  { key: 'email_booking', label: 'Booking email' },
  { key: 'hours_fr', label: 'Hours FR' },
  { key: 'hours_en', label: 'Hours EN' },
  { key: 'hours_es', label: 'Hours ES' },
  { key: 'hours_ar', label: 'Hours AR' },
  { key: 'address_fr', label: 'Address FR' },
  { key: 'address_en', label: 'Address EN' },
  { key: 'address_es', label: 'Address ES' },
  { key: 'address_ar', label: 'Address AR' },
  { key: 'facebook_url', label: 'Facebook URL' },
  { key: 'instagram_url', label: 'Instagram URL' },
  { key: 'youtube_url', label: 'YouTube URL' },
  { key: 'google_review_url', label: 'Google review URL' },
  { key: 'google_maps_url', label: 'Google Maps URL' },
  { key: 'lat', label: 'Latitude', type: 'number' },
  { key: 'lng', label: 'Longitude', type: 'number' },
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [status, setStatus] = useState('')

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
      if (data) setSettings(data as Settings)
    }
    run()
  }, [])

  const save = async () => {
    const supabase = createClient()
    if (!supabase) return
    setStatus('Saving…')
    const payload = { ...settings, id: 1 }
    const { error } = await supabase.from('site_settings').upsert(payload, { onConflict: 'id' })
    setStatus(error ? error.message : 'Settings saved')
  }

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="Settings"
        description="Contact details, hours, social links, map."
        status={status}
        backHref="/admin"
        backLabel="Dashboard"
        actions={
          <button
            type="button"
            onClick={save}
            className="rounded-full bg-[#0B1F3B] px-5 py-2.5 text-sm font-bold text-white"
          >
            Save
          </button>
        }
      />

      <div className="grid gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#072A5A]/6 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <label key={field.key} className="block text-xs font-bold text-[#072A5A]">
            {field.label}
            <input
              type={field.type || 'text'}
              value={settings[field.key] ?? ''}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  [field.key]:
                    field.type === 'number' ? Number(e.target.value) : e.target.value,
                }))
              }
              className="mt-1.5 w-full rounded-xl border border-[#072A5A]/12 bg-[#FAF8F3] px-3 py-2 text-sm font-normal"
            />
          </label>
        ))}
      </div>
    </div>
  )
}
