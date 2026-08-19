'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminPageHeader, ContentSubnav } from '@/components/admin/admin-ui'

type Row = {
  key: string
  label: string
  section: string
  value_fr: string
  value_en: string
  value_es: string
  value_ar: string
}

const LANGS = ['fr', 'en', 'es', 'ar'] as const

export default function AdminTextsPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase.from('site_texts').select('*').order('section')
      setRows((data as Row[]) || [])
    }
    run()
  }, [])

  const save = async (row: Row) => {
    const supabase = createClient()
    if (!supabase) return
    const { error } = await supabase.from('site_texts').upsert(row, { onConflict: 'key' })
    setStatus(error ? error.message : `Saved ${row.key}`)
  }

  const add = () => {
    const key = window.prompt('Text key (e.g. home.hero.subtitle)')
    if (!key) return
    setRows((r) => [
      ...r,
      {
        key,
        label: key,
        section: key.split('.')[0] || 'general',
        value_fr: '',
        value_en: '',
        value_es: '',
        value_ar: '',
      },
    ])
  }

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        title="Texts"
        description="Keyed multilang strings used across the site."
        status={status}
        actions={
          <button
            type="button"
            onClick={add}
            className="rounded-full bg-[#0B1F3B] px-5 py-2.5 text-sm font-bold text-white"
          >
            Add key
          </button>
        }
      />
      <ContentSubnav />

      {rows.length === 0 && (
        <p className="rounded-2xl border border-dashed border-[#072A5A]/20 bg-white p-6 text-sm text-[#7A8AA3]">
          No texts yet. Run Seed on the dashboard, or add a key.
        </p>
      )}

      <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.key} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#072A5A]/6">
          <p className="text-xs font-bold text-[#072A5A]">{row.key}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {LANGS.map((lang) => {
              const field = `value_${lang}` as keyof Row
              return (
                <label key={lang} className="block text-[0.65rem] font-bold text-[#7A8AA3]">
                  {lang.toUpperCase()}
                  <textarea
                    value={String(row[field])}
                    onChange={(e) =>
                      setRows((prev) =>
                        prev.map((r) => (r.key === row.key ? { ...r, [field]: e.target.value } : r)),
                      )
                    }
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-[#072A5A]/12 bg-[#FAF8F3] px-3 py-2 text-sm font-normal text-[#072A5A]"
                  />
                </label>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => save(row)}
            className="mt-3 rounded-full bg-[#0B1F3B] px-4 py-1.5 text-xs font-bold text-white"
          >
            Save
          </button>
        </div>
      ))}
      </div>
    </div>
  )
}
