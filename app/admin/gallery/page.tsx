'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { Library, Plus, Trash2, Upload, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AdminPageHeader, ContentSubnav } from '@/components/admin/admin-ui'
import { refreshNotificationsEvent } from '@/components/admin/notification-center'
import {
  DEFAULT_GALLERY,
  GALLERY_CATEGORIES,
  type GalleryCategory,
  type GalleryItem,
} from '@/lib/gallery'
import { cn } from '@/lib/utils'

type DraftItem = {
  id?: string
  url: string
  title_en: string
  title_fr: string
  caption_en: string
  category: GalleryCategory
  sort_order: number
  published: boolean
}

type LibraryEntry = { url: string; label: string; source: string }

function isRemote(src: string) {
  return src.startsWith('http://') || src.startsWith('https://')
}

function fromGalleryItem(g: GalleryItem): DraftItem {
  return {
    id: g.id.startsWith('default-') ? undefined : g.id,
    url: g.url,
    title_en: g.title.en,
    title_fr: g.title.fr,
    caption_en: g.caption.en,
    category: g.category,
    sort_order: g.sortOrder,
    published: g.published,
  }
}

function emptyDraft(sort: number): DraftItem {
  return {
    url: '',
    title_en: '',
    title_fr: '',
    caption_en: '',
    category: 'school',
    sort_order: sort,
    published: true,
  }
}

export default function AdminGalleryPage() {
  const [rows, setRows] = useState<DraftItem[]>([])
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [library, setLibrary] = useState<LibraryEntry[]>([])
  const [pickForIndex, setPickForIndex] = useState<number | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/gallery', { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load gallery')

      const items = (json.items || []) as GalleryItem[]
      if (!items.length) {
        setRows(DEFAULT_GALLERY.map(fromGalleryItem))
        setStatus('No saved photos yet — upload or pick from library, then they save automatically')
        return
      }
      setRows(items.map(fromGalleryItem))
      setStatus('')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Failed to load')
      setRows(DEFAULT_GALLERY.map(fromGalleryItem))
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const loadLibrary = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) return
    const entries: LibraryEntry[] = []
    const seen = new Set<string>()

    const add = (url: string, label: string, source: string) => {
      if (!url || seen.has(url)) return
      seen.add(url)
      entries.push({ url, label, source })
    }

    const [{ data: images }, { data: media }, { data: packs }, { data: gallery }] =
      await Promise.all([
        supabase.from('site_images').select('key, url, label, page'),
        supabase.from('activity_media').select('url, activity_id'),
        supabase.from('stay_packages').select('id, image_url, title'),
        supabase.from('gallery_items').select('url, title_en'),
      ])

    for (const row of images || []) {
      add(String(row.url || ''), String(row.label || row.key || 'Page slot'), `Page · ${row.page || 'site'}`)
    }
    for (const row of media || []) {
      add(String(row.url || ''), String(row.activity_id || 'Activity'), 'Activities')
    }
    for (const row of packs || []) {
      add(String(row.image_url || ''), String(row.title || row.id || 'Pack'), 'Stay packs')
    }
    for (const row of gallery || []) {
      add(String(row.url || ''), String(row.title_en || 'Gallery'), 'Gallery')
    }
    for (const g of DEFAULT_GALLERY) {
      add(g.url, g.title.en || 'Default', 'Site defaults')
    }

    setLibrary(entries)
  }, [])

  const openLibrary = async (index: number | null) => {
    setPickForIndex(index)
    setLibraryOpen(true)
    await loadLibrary()
  }

  const persistItem = async (item: DraftItem) => {
    const res = await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item: {
          id: item.id,
          url: item.url,
          title_en: item.title_en,
          title_fr: item.title_fr || item.title_en,
          caption_en: item.caption_en,
          category: item.category,
          sort_order: item.sort_order,
          published: item.published,
        },
      }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Save failed')
    refreshNotificationsEvent()
    return fromGalleryItem(json.item as GalleryItem)
  }

  const applyLibraryUrl = async (url: string) => {
    setBusy(true)
    try {
      if (pickForIndex == null) {
        const saved = await persistItem({
          ...emptyDraft(rows.length + 1),
          url,
          title_en: 'Gallery',
        })
        setRows((prev) => [...prev, saved])
        setStatus('Added from library')
      } else {
        const current = rows[pickForIndex]
        const saved = await persistItem({ ...current, url })
        setRows((prev) => prev.map((row, i) => (i === pickForIndex ? saved : row)))
        setStatus('Image updated from library')
      }
      setLibraryOpen(false)
      setPickForIndex(null)
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Library add failed')
    } finally {
      setBusy(false)
    }
  }

  const uploadFile = async (file: File, opts?: { index?: number; base?: DraftItem }) => {
    setBusy(true)
    setStatus('Uploading…')
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Upload failed')

      const draft: DraftItem = {
        ...(opts?.base || emptyDraft((opts?.index ?? rows.length) + 1)),
        url: json.url as string,
      }
      const saved = await persistItem(draft)
      setRows((prev) => {
        if (typeof opts?.index === 'number' && opts.index < prev.length) {
          return prev.map((row, i) => (i === opts.index ? saved : row))
        }
        return [...prev, saved]
      })
      setStatus('Uploaded and saved')
      return saved
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Upload failed')
      return null
    } finally {
      setBusy(false)
    }
  }

  const uploadAt = async (index: number, file: File) => {
    await uploadFile(file, { index, base: rows[index] })
  }

  const deleteAt = async (index: number) => {
    const row = rows[index]
    if (!row) return

    if (!row.id) {
      setRows((prev) => prev.filter((_, i) => i !== index))
      setStatus('Removed')
      return
    }

    if (!window.confirm('Delete this gallery photo permanently?')) return

    setBusy(true)
    try {
      const res = await fetch(`/api/admin/gallery?id=${encodeURIComponent(row.id)}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Delete failed')
      setRows((prev) => prev.filter((_, i) => i !== index))
      setStatus('Deleted')
      refreshNotificationsEvent()
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  const saveAll = async () => {
    setBusy(true)
    setStatus('Saving…')
    try {
      const valid = rows.filter((r) => r.url.trim())
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: valid.map((row, i) => ({
            id: row.id,
            url: row.url,
            title_en: row.title_en,
            title_fr: row.title_fr || row.title_en,
            caption_en: row.caption_en,
            category: row.category,
            sort_order: i + 1,
            published: row.published,
          })),
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      setRows(((json.items || []) as GalleryItem[]).map(fromGalleryItem))
      setStatus(`Saved ${valid.length} gallery photos`)
      refreshNotificationsEvent()
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <AdminPageHeader
        title="Gallery"
        description="Upload or pick site images. Upload and delete save immediately; use Save all to reorder titles/categories."
        status={status}
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => openLibrary(null)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D8D0C4] bg-white px-4 py-2 text-xs font-bold text-[#072A5A] hover:bg-[#F7F3EC]"
            >
              <Library className="h-3.5 w-3.5" />
              Add from library
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setRows((prev) => [...prev, emptyDraft(prev.length + 1)])}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D8D0C4] bg-white px-4 py-2 text-xs font-bold text-[#072A5A] hover:bg-[#F7F3EC]"
            >
              <Plus className="h-3.5 w-3.5" />
              Empty slot
            </button>
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#D8D0C4] bg-white px-4 py-2 text-xs font-bold text-[#072A5A] hover:bg-[#F7F3EC]">
              <Upload className="h-3.5 w-3.5" />
              Upload new
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={busy}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void uploadFile(file)
                  e.target.value = ''
                }}
              />
            </label>
            <button
              type="button"
              disabled={busy}
              onClick={saveAll}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0046A4] px-4 py-2 text-xs font-bold text-white hover:bg-[#0057D1] disabled:opacity-60"
            >
              Save all
            </button>
          </div>
        }
      />
      <ContentSubnav />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row, index) => (
          <div
            key={row.id || `local-${index}`}
            className="overflow-hidden rounded-xl border border-[#E8E1D6] bg-white shadow-sm"
          >
            <div className="relative aspect-4/5 bg-[#0B1F3B]">
              {row.url ? (
                <Image
                  src={row.url}
                  alt={row.title_en || 'Gallery'}
                  fill
                  sizes="320px"
                  unoptimized={isRemote(row.url)}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-white/50">
                  No image
                </div>
              )}
            </div>
            <div className="space-y-2 p-3">
              <input
                value={row.title_en}
                onChange={(e) =>
                  setRows((prev) =>
                    prev.map((r, i) => (i === index ? { ...r, title_en: e.target.value } : r)),
                  )
                }
                placeholder="Title (EN)"
                className="w-full rounded-lg border border-[#E8E1D6] px-2.5 py-1.5 text-sm"
              />
              <select
                value={row.category}
                onChange={(e) =>
                  setRows((prev) =>
                    prev.map((r, i) =>
                      i === index ? { ...r, category: e.target.value as GalleryCategory } : r,
                    ),
                  )
                }
                className="w-full rounded-lg border border-[#E8E1D6] px-2.5 py-1.5 text-sm"
              >
                {GALLERY_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-xs text-[#5A6B85]">
                <input
                  type="checkbox"
                  checked={row.published}
                  onChange={(e) =>
                    setRows((prev) =>
                      prev.map((r, i) =>
                        i === index ? { ...r, published: e.target.checked } : r,
                      ),
                    )
                  }
                />
                Published
              </label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <label className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[#F0EBE3] px-2.5 py-1 text-[11px] font-bold text-[#072A5A]">
                  <Upload className="h-3 w-3" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={busy}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) uploadAt(index, file)
                      e.target.value = ''
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => openLibrary(index)}
                  className="inline-flex items-center gap-1 rounded-full bg-[#F0EBE3] px-2.5 py-1 text-[11px] font-bold text-[#072A5A]"
                >
                  <Library className="h-3 w-3" />
                  Library
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => deleteAt(index)}
                  className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700 disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {libraryOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8E1D6] px-4 py-3">
              <div>
                <p className="font-heading text-lg font-bold text-[#072A5A]">Site image library</p>
                <p className="text-xs text-[#5A6B85]">
                  Pick a photo already used on pages, activities, packs, or gallery
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLibraryOpen(false)}
                className="rounded-full p-2 hover:bg-[#F0EBE3]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-2 overflow-y-auto p-4 sm:grid-cols-3 md:grid-cols-4">
              {library.map((entry) => (
                <button
                  key={entry.url}
                  type="button"
                  disabled={busy}
                  onClick={() => applyLibraryUrl(entry.url)}
                  className={cn(
                    'group overflow-hidden rounded-lg border border-[#E8E1D6] text-left transition hover:border-[#0046A4]',
                  )}
                >
                  <div className="relative aspect-square bg-[#0B1F3B]">
                    <Image
                      src={entry.url}
                      alt={entry.label}
                      fill
                      sizes="160px"
                      unoptimized={isRemote(entry.url)}
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="truncate text-[11px] font-semibold text-[#072A5A]">{entry.label}</p>
                    <p className="truncate text-[10px] text-[#8A97AB]">{entry.source}</p>
                  </div>
                </button>
              ))}
              {!library.length ? (
                <p className="col-span-full py-10 text-center text-sm text-[#5A6B85]">
                  No images found yet
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
