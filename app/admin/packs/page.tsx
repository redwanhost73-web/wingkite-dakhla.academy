'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PACKAGES } from '@/lib/packages'
import { Upload } from 'lucide-react'
import { AdminPageHeader, ContentSubnav } from '@/components/admin/admin-ui'

type PackRow = {
  id: string
  category: string
  title: string
  image_url: string
  sort_order: number
  published: boolean
}

export default function AdminPacksPage() {
  const [rows, setRows] = useState<PackRow[]>([])
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState<string | null>(null)

  const load = async () => {
    const supabase = createClient()
    if (!supabase) return
    const { data } = await supabase.from('stay_packages').select('*').order('sort_order')
    if (!data?.length) {
      setRows(
        PACKAGES.map((p, i) => ({
          id: p.id,
          category: p.category,
          title: p.title,
          image_url: p.image,
          sort_order: i + 1,
          published: true,
        })),
      )
      setStatus('Showing code defaults — run SQL 006 + seed to persist')
      return
    }
    setRows(
      data.map((r: Record<string, unknown>) => ({
        id: String(r.id),
        category: String(r.category),
        title: String(r.title),
        image_url: String(r.image_url || ''),
        sort_order: Number(r.sort_order || 0),
        published: r.published !== false,
      })),
    )
    setStatus('')
  }

  useEffect(() => {
    load()
  }, [])

  const save = async (row: PackRow) => {
    const supabase = createClient()
    if (!supabase) return
    setStatus('Saving…')
    const { error } = await supabase.from('stay_packages').upsert(
      {
        id: row.id,
        category: row.category,
        title: row.title,
        image_url: row.image_url,
        sort_order: row.sort_order,
        published: row.published,
      },
      { onConflict: 'id' },
    )
    setStatus(error ? error.message : `Saved ${row.id}`)
  }

  const upload = async (id: string, file: File) => {
    setBusy(id)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Upload failed')
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, image_url: json.url } : r)))
      const row = rows.find((r) => r.id === id)
      if (row) await save({ ...row, image_url: json.url })
      setStatus(`Uploaded ${id}`)
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Stay packs"
        description="Cover images for offer packs. Edit package copy on-site via Edit Mode."
        status={status}
      />
      <ContentSubnav />

      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((row) => (
          <article key={row.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#072A5A]/6">
            <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-[#FAF8F3]">
              {row.image_url ? (
                <Image src={row.image_url} alt={row.title} fill className="object-cover" sizes="400px" />
              ) : null}
            </div>
            <p className="mt-3 font-heading text-lg font-bold text-[#072A5A]">{row.title}</p>
            <p className="text-xs text-[#7A8AA3]">
              {row.id} · {row.category}
            </p>
            <input
              className="mt-3 w-full rounded-lg border border-[#072A5A]/10 px-3 py-2 text-xs"
              value={row.image_url}
              onChange={(e) =>
                setRows((prev) =>
                  prev.map((r) => (r.id === row.id ? { ...r, image_url: e.target.value } : r)),
                )
              }
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#072A5A]/10 px-3 py-1.5 text-xs font-bold">
                <Upload className="h-3.5 w-3.5" />
                {busy === row.id ? 'Uploading…' : 'Upload'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) upload(row.id, f)
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => save(row)}
                className="rounded-full bg-[#0B1F3B] px-4 py-1.5 text-xs font-bold text-white"
              >
                Save
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
