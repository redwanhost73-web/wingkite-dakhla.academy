'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_IMAGES, IMAGE_LABELS, type SiteImages } from '@/lib/site-config'
import { AdminPageHeader, ContentSubnav } from '@/components/admin/admin-ui'

type Row = { key: string; url: string; label: string; page: string }

export default function AdminImagesPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [status, setStatus] = useState('')
  const [uploading, setUploading] = useState<string | null>(null)

  const load = async () => {
    const supabase = createClient()
    if (!supabase) return
    const { data } = await supabase.from('site_images').select('*').order('page')
    if (data?.length) {
      setRows(
        data.map((r: { key: string; url: string; label: string; page: string }) => ({
          key: r.key,
          url: r.url,
          label: r.label,
          page: r.page,
        })),
      )
      return
    }
    // Empty DB → show defaults for editing before seed
    setRows(
      (Object.keys(DEFAULT_IMAGES) as (keyof SiteImages)[]).map((key) => ({
        key,
        url: DEFAULT_IMAGES[key],
        label: IMAGE_LABELS[key] || key,
        page: key.startsWith('about')
          ? 'about'
          : key.startsWith('pricing')
            ? 'pricing'
            : key.startsWith('contact')
              ? 'contact'
              : 'home',
      })),
    )
  }

  useEffect(() => {
    load()
  }, [])

  const saveRow = async (row: Row) => {
    const supabase = createClient()
    if (!supabase) return
    setStatus('Saving…')
    const { error } = await supabase.from('site_images').upsert(
      {
        key: row.key,
        url: row.url,
        label: row.label,
        page: row.page,
      },
      { onConflict: 'key' },
    )
    setStatus(error ? error.message : `Saved ${row.key}`)
  }

  const upload = async (key: string, file: File) => {
    setUploading(key)
    setStatus('')
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Upload failed')
      setRows((prev) => prev.map((r) => (r.key === key ? { ...r, url: json.url } : r)))
      const row = rows.find((r) => r.key === key)
      if (row) await saveRow({ ...row, url: json.url })
      setStatus(`Uploaded ${key}`)
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Page images"
        description="Heroes and section backgrounds. Upload needs Blob token, or paste a public URL."
        status={status}
      />
      <ContentSubnav />

      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.key}
            className="grid gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#072A5A]/6 sm:grid-cols-[120px_1fr]"
          >
            <div className="relative h-24 overflow-hidden rounded-xl bg-[#FAF8F3]">
              {row.url && (
                <Image src={row.url} alt={row.label} fill className="object-cover" sizes="120px" unoptimized />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#0B1F3B] px-2.5 py-1 text-[0.65rem] font-bold text-white">
                  {row.key}
                </span>
                <span className="text-xs text-[#7A8AA3]">{row.label}</span>
              </div>
              <input
                value={row.url}
                onChange={(e) =>
                  setRows((prev) =>
                    prev.map((r) => (r.key === row.key ? { ...r, url: e.target.value } : r)),
                  )
                }
                className="w-full rounded-xl border border-[#072A5A]/12 bg-[#FAF8F3] px-3 py-2 text-xs"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => saveRow(row)}
                  className="rounded-full bg-[#0B1F3B] px-4 py-1.5 text-xs font-bold text-white"
                >
                  Save
                </button>
                <label className="cursor-pointer rounded-full border border-[#072A5A]/15 px-4 py-1.5 text-xs font-bold">
                  {uploading === row.key ? 'Uploading…' : 'Upload file'}
                  <input
                    type="file"
                    accept="image/*,video/mp4,video/webm"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) upload(row.key, f)
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
