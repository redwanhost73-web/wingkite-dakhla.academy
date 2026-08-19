'use client'

import { useCallback, useMemo, useRef, useState, type DragEvent } from 'react'
import {
  Check,
  Copy,
  ImageIcon,
  Link2,
  Loader2,
  Replace,
  Upload,
} from 'lucide-react'
import { toast } from 'sonner'
import { useSiteConfig } from '@/hooks/use-site-config'
import { emptyLocalized, type Localized } from '@/lib/cms/types'
import {
  SITE_IMAGE_SLOTS,
  buildImageLibrary,
  type SiteImageSlot,
} from '@/lib/edit-mode/image-slots'
import { cn } from '@/lib/utils'

const LOCALES: Array<keyof Localized> = ['fr', 'en', 'es', 'ar']

type TabId = 'replace' | 'library' | 'details'

type ImageEditorProps = {
  fieldKey: string
  url: string
  label?: string
  alts?: Localized
  onChange: (next: { url: string; alts?: Localized }) => void
}

export function ImageEditor({ fieldKey, url, label, alts, onChange }: ImageEditorProps) {
  const { images } = useSiteConfig()
  const [tab, setTab] = useState<TabId>('replace')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [altLocale, setAltLocale] = useState<keyof Localized>('en')
  const [pageFilter, setPageFilter] = useState<'all' | SiteImageSlot['page']>('all')
  const inputRef = useRef<HTMLInputElement>(null)

  const liveAlts = alts || emptyLocalized()
  const slotMeta = SITE_IMAGE_SLOTS.find((s) => s.key === fieldKey)

  const library = useMemo(() => buildImageLibrary(images), [images])
  const slots = useMemo(() => {
    if (pageFilter === 'all') return SITE_IMAGE_SLOTS
    return SITE_IMAGE_SLOTS.filter((s) => s.page === pageFilter)
  }, [pageFilter])

  const applyUrl = useCallback(
    (nextUrl: string) => {
      if (!nextUrl.trim()) return
      onChange({ url: nextUrl.trim(), alts: liveAlts })
      toast.success('Image updated (draft)')
    },
    [liveAlts, onChange],
  )

  const uploadFile = async (file: File) => {
    setUploading(true)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      applyUrl(data.url)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith('image/')) void uploadFile(file)
  }

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.message('URL copied')
    } catch {
      toast.error('Could not copy URL')
    }
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-[#072A5A]/10 bg-[#0B1F3B]">
        <div className="relative aspect-[16/10] bg-[#072A5A]/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-3 py-2.5">
            <p className="truncate text-[0.65rem] font-bold uppercase tracking-wider text-white/55">
              {slotMeta?.page || 'site'} · {label || fieldKey}
            </p>
            <p className="truncate text-xs text-white/90">{fieldKey}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 rounded-xl bg-[#F0EBE3] p-1">
        {(
          [
            { id: 'replace' as const, label: 'Replace', icon: Replace },
            { id: 'library' as const, label: 'Library', icon: ImageIcon },
            { id: 'details' as const, label: 'Alt text', icon: Link2 },
          ] as const
        ).map(({ id, label: tabLabel, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              'inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[0.65rem] font-bold',
              tab === id ? 'bg-white text-[#072A5A] shadow-sm' : 'text-[#7A8AA3]',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {tabLabel}
          </button>
        ))}
      </div>

      {tab === 'replace' && (
        <div className="space-y-3">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-7 transition-colors',
              dragOver
                ? 'border-[#0046A4] bg-[#0046A4]/8'
                : 'border-[#072A5A]/20 bg-[#FAF8F3]',
            )}
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-[#0046A4]" />
            ) : (
              <Upload className="h-6 w-6 text-[#0046A4]" />
            )}
            <p className="text-center text-xs font-semibold text-[#072A5A]">
              {uploading ? 'Uploading…' : 'Drop an image here'}
            </p>
            <p className="text-center text-[0.65rem] text-[#7A8AA3]">JPEG, PNG, WebP · max 8MB</p>
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="mt-1 inline-flex h-9 items-center gap-2 rounded-full bg-[#0B1F3B] px-4 text-xs font-bold text-white hover:bg-[#0046A4] disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" />
              Browse files
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void uploadFile(file)
                e.target.value = ''
              }}
            />
          </div>

          <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-[#7A8AA3]">
            Or paste image URL
            <div className="mt-1.5 flex gap-2">
              <input
                value={url}
                onChange={(e) => onChange({ url: e.target.value, alts: liveAlts })}
                placeholder="https://…"
                className="min-w-0 flex-1 rounded-xl border border-[#072A5A]/12 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0046A4]/40"
              />
              <button
                type="button"
                onClick={copyUrl}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#072A5A]/12 bg-white text-[#072A5A] hover:bg-[#FAF8F3]"
                aria-label="Copy URL"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </label>
        </div>
      )}

      {tab === 'library' && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {(['all', 'home', 'about', 'pricing', 'contact'] as const).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setPageFilter(page)}
                className={cn(
                  'rounded-full px-2.5 py-1 text-[0.65rem] font-bold capitalize',
                  pageFilter === page
                    ? 'bg-[#0B1F3B] text-white'
                    : 'bg-white text-[#7A8AA3] ring-1 ring-[#072A5A]/10',
                )}
              >
                {page}
              </button>
            ))}
          </div>

          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#7A8AA3]">
            Site slots
          </p>
          <div className="grid max-h-44 grid-cols-3 gap-2 overflow-y-auto pr-0.5">
            {slots.map((slot) => {
              const slotUrl = images[slot.key] || slot.defaultUrl
              const active = slotUrl === url
              return (
                <button
                  key={slot.key}
                  type="button"
                  title={slot.label}
                  onClick={() => applyUrl(slotUrl)}
                  className={cn(
                    'group relative aspect-square overflow-hidden rounded-lg border bg-[#FAF8F3]',
                    active ? 'border-[#0046A4] ring-2 ring-[#0046A4]/35' : 'border-[#072A5A]/10',
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slotUrl} alt="" className="h-full w-full object-cover" />
                  {active && (
                    <span className="absolute right-1 top-1 rounded-full bg-[#0046A4] p-0.5 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <span className="absolute inset-x-0 bottom-0 truncate bg-black/55 px-1 py-0.5 text-[0.55rem] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {slot.key}
                  </span>
                </button>
              )
            })}
          </div>

          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#7A8AA3]">
            Unique files in use
          </p>
          <div className="grid max-h-36 grid-cols-3 gap-2 overflow-y-auto">
            {library.map((item) => {
              const active = item.url === url
              return (
                <button
                  key={item.url}
                  type="button"
                  title={item.label}
                  onClick={() => applyUrl(item.url)}
                  className={cn(
                    'relative aspect-square overflow-hidden rounded-lg border',
                    active ? 'border-[#0046A4] ring-2 ring-[#0046A4]/35' : 'border-[#072A5A]/10',
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt="" className="h-full w-full object-cover" />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'details' && (
        <div className="space-y-3">
          <p className="text-[0.65rem] text-[#7A8AA3]">
            Alt text improves accessibility and SEO. Leave empty to keep defaults.
          </p>
          <div className="flex gap-1 rounded-xl bg-[#F0EBE3] p-1">
            {LOCALES.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setAltLocale(loc)}
                className={cn(
                  'flex-1 rounded-lg py-1.5 text-[0.65rem] font-bold uppercase',
                  altLocale === loc ? 'bg-white text-[#072A5A] shadow-sm' : 'text-[#7A8AA3]',
                )}
              >
                {loc}
              </button>
            ))}
          </div>
          <textarea
            value={liveAlts[altLocale] || ''}
            onChange={(e) =>
              onChange({
                url,
                alts: { ...liveAlts, [altLocale]: e.target.value },
              })
            }
            rows={3}
            placeholder={`Alt text (${altLocale.toUpperCase()})`}
            className="w-full rounded-xl border border-[#072A5A]/12 bg-[#FAF8F3] px-3 py-2.5 text-sm outline-none focus:border-[#0046A4]/40"
          />
        </div>
      )}
    </div>
  )
}
