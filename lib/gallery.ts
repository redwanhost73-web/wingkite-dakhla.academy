import { ACTIVITIES, type LocalizedText } from '@/lib/activities'

export type GalleryCategory = 'school' | 'wingfoil' | 'kitesurf' | 'lagoon' | 'camp' | 'other'

export type GalleryItem = {
  id: string
  url: string
  title: LocalizedText
  caption: LocalizedText
  category: GalleryCategory
  sortOrder: number
  published: boolean
}

const emptyText = (): LocalizedText => ({ fr: '', en: '', es: '', ar: '' })

/** Fallback grid when Supabase gallery_items is empty. */
export const DEFAULT_GALLERY: GalleryItem[] = (() => {
  const items: GalleryItem[] = []
  let n = 0
  for (const activity of ACTIVITIES) {
    for (const url of activity.images) {
      n += 1
      items.push({
        id: `default-${activity.id}-${n}`,
        url,
        title: { ...activity.badge },
        caption: emptyText(),
        category: activity.id === 'kitesurf' ? 'kitesurf' : activity.id === 'wingfoil' ? 'wingfoil' : 'school',
        sortOrder: n,
        published: true,
      })
    }
  }
  return items
})()

export const GALLERY_CATEGORIES: Array<{ id: GalleryCategory; label: string }> = [
  { id: 'school', label: 'School' },
  { id: 'wingfoil', label: 'Wingfoil' },
  { id: 'kitesurf', label: 'Kitesurf' },
  { id: 'lagoon', label: 'Lagoon' },
  { id: 'camp', label: 'Camp' },
  { id: 'other', label: 'Other' },
]

export function mapGalleryRow(row: Record<string, unknown>): GalleryItem {
  return {
    id: String(row.id),
    url: String(row.url || ''),
    title: {
      fr: String(row.title_fr || ''),
      en: String(row.title_en || ''),
      es: String(row.title_es || ''),
      ar: String(row.title_ar || ''),
    },
    caption: {
      fr: String(row.caption_fr || ''),
      en: String(row.caption_en || ''),
      es: String(row.caption_es || ''),
      ar: String(row.caption_ar || ''),
    },
    category: (String(row.category || 'school') as GalleryCategory) || 'school',
    sortOrder: Number(row.sort_order || 0),
    published: row.published !== false,
  }
}
