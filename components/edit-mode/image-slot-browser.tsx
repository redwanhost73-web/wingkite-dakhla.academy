'use client'

import { useMemo, useState } from 'react'
import { ImageIcon, Layers3, X } from 'lucide-react'
import { useEditMode } from '@/components/edit-mode/edit-mode-provider'
import { useSiteConfig } from '@/hooks/use-site-config'
import { SITE_IMAGE_SLOTS, type SiteImageSlot } from '@/lib/edit-mode/image-slots'
import { activityImageFieldKey, packCoverFieldKey } from '@/lib/cms/content-lists'
import { cn } from '@/lib/utils'

/** Browse every site image slot and open the special Image Editor. */
export function ImageSlotBrowser({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { openImageSlot } = useEditMode()
  const { images, activities, packages } = useSiteConfig()
  const [pageFilter, setPageFilter] = useState<'all' | SiteImageSlot['page']>('all')
  const [groupFilter, setGroupFilter] = useState<'all' | 'page' | 'activities' | 'packs'>('all')

  const siteSlots = useMemo(() => {
    if (pageFilter === 'all') return SITE_IMAGE_SLOTS
    return SITE_IMAGE_SLOTS.filter((s) => s.page === pageFilter)
  }, [pageFilter])

  const activitySlots = useMemo(() => {
    return activities.flatMap((activity) =>
      activity.images.map((url, idx) => ({
        key: activityImageFieldKey(activity.id, idx),
        label: `${activity.title.en || activity.id} · Photo ${idx + 1}`,
        group: `Activity · ${activity.title.en || activity.id}`,
        groupType: 'activities' as const,
        url,
      })),
    )
  }, [activities])

  const packSlots = useMemo(() => {
    return packages.map((pack) => ({
      key: packCoverFieldKey(pack.id),
      label: `${pack.title} · Cover`,
      group: `Offer packs · ${pack.category}`,
      groupType: 'packs' as const,
      url: pack.image,
    }))
  }, [packages])

  const allItems = useMemo<BrowserItem[]>(() => {
    const pageItems: BrowserItem[] = siteSlots.map((slot) => ({
      key: slot.key,
      label: slot.label,
      group: `Page · ${slot.page}`,
      groupType: 'page',
      url: images[slot.key] || slot.defaultUrl,
    }))
    return [...pageItems, ...activitySlots, ...packSlots]
  }, [siteSlots, images, activitySlots, packSlots])

  const filteredItems = useMemo(() => {
    if (groupFilter === 'all') return allItems
    return allItems.filter((item) => item.groupType === groupFilter)
  }, [allItems, groupFilter])

  const groupedItems = useMemo(() => {
    const map = new Map<string, BrowserItem[]>()
    for (const item of filteredItems) {
      const list = map.get(item.group) || []
      list.push(item)
      map.set(item.group, list)
    }
    return [...map.entries()]
  }, [filteredItems])

  if (!open) return null

  return (
    <div
      data-edit-chrome
      className="fixed inset-0 z-[95] flex items-end justify-center bg-[#0B1F3B]/45 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[min(84vh,44rem)] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(11,31,59,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#072A5A]/8 bg-[#0B1F3B] px-4 py-3 text-white">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/45">
              Image library
            </p>
            <p className="text-sm font-semibold">Manage site images</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid max-h-[calc(min(84vh,44rem)-3.25rem)] grid-cols-1 lg:grid-cols-[1fr_18rem]">
          <div className="min-h-0 overflow-y-auto p-4">
            {groupedItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#072A5A]/20 bg-[#FAF8F3] p-8 text-center text-sm text-[#7A8AA3]">
                No images found for this filter.
              </div>
            ) : (
              <div className="space-y-4">
                {groupedItems.map(([group, items]) => (
                  <SectionGrid
                    key={group}
                    title={group}
                    items={items}
                    onPick={(key, url, label) => {
                      openImageSlot(key, url, label)
                      onClose()
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <aside className="border-t border-[#072A5A]/8 bg-[#F8FAFD] p-4 lg:border-l lg:border-t-0">
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#7A8AA3]">
                  Group
                </p>
                <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-1">
                  {(
                    [
                      { id: 'all', label: 'All images' },
                      { id: 'page', label: 'Page slots' },
                      { id: 'activities', label: 'Activities' },
                      { id: 'packs', label: 'Offer packs' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setGroupFilter(opt.id)}
                      className={cn(
                        'rounded-lg px-2.5 py-2 text-left text-xs font-semibold',
                        groupFilter === opt.id
                          ? 'bg-[#0B1F3B] text-white'
                          : 'bg-white text-[#3D4F6F] ring-1 ring-[#072A5A]/10',
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#7A8AA3]">
                  Page filter (slots)
                </p>
                <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-1">
                  {(['all', 'home', 'about', 'pricing', 'contact'] as const).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setPageFilter(page)}
                      className={cn(
                        'rounded-lg px-2.5 py-2 text-left text-xs font-semibold capitalize',
                        pageFilter === page
                          ? 'bg-[#0046A4] text-white'
                          : 'bg-white text-[#3D4F6F] ring-1 ring-[#072A5A]/10',
                      )}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-white p-3 ring-1 ring-[#072A5A]/10">
                <div className="mb-1 inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#7A8AA3]">
                  <Layers3 className="h-3.5 w-3.5" />
                  Summary
                </div>
                <p className="text-xs text-[#3D4F6F]">
                  {filteredItems.length} image{filteredItems.length === 1 ? '' : 's'} in view
                </p>
                <p className="mt-1 text-[0.7rem] text-[#7A8AA3]">
                  Tip: select “Activities” to manage each gallery together.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

type BrowserItem = {
  key: string
  label: string
  group: string
  groupType: 'page' | 'activities' | 'packs'
  url: string
}

function SectionGrid({
  title,
  items,
  onPick,
}: {
  title: string
  items: BrowserItem[]
  onPick: (key: string, url: string, label: string) => void
}) {
  if (!items.length) return null
  return (
    <div className="space-y-2">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#7A8AA3]">{title}</p>
      <div className="grid max-h-[min(28vh,15rem)] grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onPick(item.key, item.url, item.label)}
            className="group overflow-hidden rounded-xl border border-[#072A5A]/10 bg-[#FAF8F3] text-start hover:border-[#0046A4]/40"
          >
            <div className="relative aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" className="h-full w-full object-cover" />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0B1F3B]/0 opacity-0 transition-all group-hover:bg-[#0B1F3B]/35 group-hover:opacity-100">
                <ImageIcon className="h-5 w-5 text-white" />
              </span>
            </div>
            <div className="px-2.5 py-2">
              <p className="truncate text-[0.65rem] font-bold text-[#072A5A]">{item.label}</p>
              <p className="truncate text-[0.6rem] text-[#7A8AA3]">{item.group}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
