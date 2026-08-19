'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ACTIVITIES } from '@/lib/activities'
import { Plus, Trash2, Upload } from 'lucide-react'
import { AdminPageHeader, ContentSubnav } from '@/components/admin/admin-ui'

type MediaRow = { id?: string; url: string; sort_order: number }
type ActivityRow = {
  id: string
  title_en: string
  badge_tone: string
  layout_class: string
  min_height: string
  is_large: boolean
  sort_order: number
  published: boolean
  media: MediaRow[]
}

export default function AdminActivitiesPage() {
  const [rows, setRows] = useState<ActivityRow[]>([])
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState<string | null>(null)

  const load = async () => {
    const supabase = createClient()
    if (!supabase) return
    const [{ data: acts }, { data: media }] = await Promise.all([
      supabase.from('activities').select('*').order('sort_order'),
      supabase.from('activity_media').select('*').order('sort_order'),
    ])

    if (!acts?.length) {
      setRows(
        ACTIVITIES.map((a, i) => ({
          id: a.id,
          title_en: a.title.en,
          badge_tone: a.badgeTone,
          layout_class: a.className,
          min_height: a.minHeight,
          is_large: Boolean(a.large),
          sort_order: i + 1,
          published: true,
          media: a.images.map((url, j) => ({ url, sort_order: j + 1 })),
        })),
      )
      setStatus('Showing code defaults — seed to persist in Supabase')
      return
    }

    const byAct = new Map<string, MediaRow[]>()
    for (const m of media || []) {
      const list = byAct.get(m.activity_id) || []
      list.push({ id: m.id, url: m.url, sort_order: m.sort_order })
      byAct.set(m.activity_id, list)
    }

    setRows(
      acts.map((a: Record<string, unknown>) => ({
        id: String(a.id),
        title_en: String(a.title_en || a.id),
        badge_tone: String(a.badge_tone || 'brand'),
        layout_class: String(a.layout_class || ''),
        min_height: String(a.min_height || ''),
        is_large: Boolean(a.is_large),
        sort_order: Number(a.sort_order || 0),
        published: a.published !== false,
        media: byAct.get(String(a.id)) || [],
      })),
    )
    setStatus('')
  }

  useEffect(() => {
    load()
  }, [])

  const upload = async (activityId: string, index: number, file: File) => {
    setBusy(`${activityId}:${index}`)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Upload failed')

      setRows((prev) =>
        prev.map((row) => {
          if (row.id !== activityId) return row
          const media = [...row.media]
          if (media[index]) media[index] = { ...media[index], url: json.url }
          else media.push({ url: json.url, sort_order: index + 1 })
          return { ...row, media }
        }),
      )
      setStatus(`Uploaded → ${activityId}[${index}]`)
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setBusy(null)
    }
  }

  const saveActivity = async (row: ActivityRow) => {
    const supabase = createClient()
    if (!supabase) return
    setStatus('Saving…')

    const { error } = await supabase.from('activities').upsert(
      {
        id: row.id,
        badge_tone: row.badge_tone,
        layout_class: row.layout_class,
        min_height: row.min_height,
        is_large: row.is_large,
        sort_order: row.sort_order,
        published: row.published,
        title_en: row.title_en,
      },
      { onConflict: 'id' },
    )
    if (error) {
      setStatus(error.message)
      return
    }

    await supabase.from('activity_media').delete().eq('activity_id', row.id)
    if (row.media.length) {
      const { error: mediaErr } = await supabase.from('activity_media').insert(
        row.media.map((m, i) => ({
          activity_id: row.id,
          media_type: 'image',
          url: m.url,
          sort_order: i + 1,
        })),
      )
      if (mediaErr) {
        setStatus(mediaErr.message)
        return
      }
    }
    setStatus(`Saved ${row.id}`)
    await load()
  }

  const addImageSlot = (activityId: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === activityId
          ? {
              ...row,
              media: [...row.media, { url: '/Activities/wingfoil-1.jpeg', sort_order: row.media.length + 1 }],
            }
          : row,
      ),
    )
  }

  const removeImage = (activityId: string, index: number) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === activityId
          ? { ...row, media: row.media.filter((_, i) => i !== index) }
          : row,
      ),
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Activities"
        description="Galleries for home activity cards. Upload to Blob or paste a URL, then Save."
        status={status}
      />
      <ContentSubnav />

      <div className="space-y-6">
        {rows.map((row) => (
          <section key={row.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#072A5A]/6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-xl font-bold text-[#072A5A]">{row.id}</h2>
                <p className="text-xs text-[#7A8AA3]">{row.title_en}</p>
              </div>
              <button
                type="button"
                onClick={() => saveActivity(row)}
                className="rounded-full bg-[#0B1F3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#0046A4]"
              >
                Save gallery
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {row.media.map((m, i) => (
                <div key={`${row.id}-${i}`} className="rounded-xl border border-[#072A5A]/8 p-2">
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-[#FAF8F3]">
                    {m.url ? (
                      <Image src={m.url} alt="" fill className="object-cover" sizes="280px" />
                    ) : null}
                  </div>
                  <input
                    className="mt-2 w-full rounded-lg border border-[#072A5A]/10 px-2 py-1.5 text-xs"
                    value={m.url}
                    onChange={(e) =>
                      setRows((prev) =>
                        prev.map((r) => {
                          if (r.id !== row.id) return r
                          const media = [...r.media]
                          media[i] = { ...media[i], url: e.target.value }
                          return { ...r, media }
                        }),
                      )
                    }
                  />
                  <div className="mt-2 flex gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#072A5A]/10 px-2.5 py-1 text-[10px] font-bold text-[#072A5A]">
                      <Upload className="h-3 w-3" />
                      {busy === `${row.id}:${i}` ? '…' : 'Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) upload(row.id, i, f)
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeImage(row.id, i)}
                      className="inline-flex items-center gap-1 rounded-full border border-red-200 px-2.5 py-1 text-[10px] font-bold text-red-700"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addImageSlot(row.id)}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#0046A4]"
            >
              <Plus className="h-3.5 w-3.5" /> Add photo
            </button>
          </section>
        ))}
      </div>
    </div>
  )
}
