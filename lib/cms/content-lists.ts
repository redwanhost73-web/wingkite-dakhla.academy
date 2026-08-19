import type { Activity } from '@/lib/activities'
import type { Pack, PackFeatureIcon, PackTier } from '@/lib/packages'
import { fromColumns, type Localized } from '@/lib/cms/types'
import { ACTIVITIES } from '@/lib/activities'
import { PACKAGES } from '@/lib/packages'

export type CmsActivity = Activity

export type CmsPack = Pack

function locFrom(row: Record<string, unknown>, prefix: string): Localized {
  return fromColumns(row, prefix)
}

export function mapActivityRow(
  row: Record<string, unknown>,
  mediaUrls: string[],
): CmsActivity {
  const tone = String(row.badge_tone || 'brand')
  return {
    id: String(row.id),
    images: mediaUrls.length ? mediaUrls : ['/Activities/wingfoil-1.jpeg'],
    badge: locFrom(row, 'badge'),
    badgeTone: tone === 'sand' ? 'sand' : 'brand',
    title: locFrom(row, 'title'),
    desc: locFrom(row, 'desc'),
    className: String(row.layout_class || ''),
    minHeight: String(row.min_height || ''),
    large: Boolean(row.is_large),
  }
}

export function mapPackRow(row: Record<string, unknown>): CmsPack {
  const featuresRaw = (row.features as Pack['features']) || []
  const tiersRaw = (row.tiers as PackTier[]) || []
  const perksRaw = (row.perks as Localized[]) || []
  return {
    id: String(row.id),
    category: row.category === 'kitesurf' ? 'kitesurf' : 'wingfoil',
    image: String(row.image_url || row.image || ''),
    badge: locFrom(row, 'badge'),
    title: String(row.title || ''),
    desc: locFrom(row, 'desc'),
    features: featuresRaw.map((f) => ({
      icon: (f.icon || 'board') as PackFeatureIcon,
      text: f.text,
    })),
    tiers: tiersRaw,
    perks: perksRaw,
  }
}

/** Seed rows for activities table */
export function seedActivityRows() {
  return ACTIVITIES.map((a, i) => ({
    id: a.id,
    badge_tone: a.badgeTone,
    layout_class: a.className,
    min_height: a.minHeight,
    is_large: Boolean(a.large),
    sort_order: i + 1,
    badge_fr: a.badge.fr,
    badge_en: a.badge.en,
    badge_es: a.badge.es,
    badge_ar: a.badge.ar,
    title_fr: a.title.fr,
    title_en: a.title.en,
    title_es: a.title.es,
    title_ar: a.title.ar,
    desc_fr: a.desc.fr,
    desc_en: a.desc.en,
    desc_es: a.desc.es,
    desc_ar: a.desc.ar,
    published: true,
  }))
}

export function seedActivityMediaRows() {
  const rows: Array<{
    activity_id: string
    media_type: 'image'
    url: string
    sort_order: number
  }> = []
  for (const a of ACTIVITIES) {
    a.images.forEach((url, i) => {
      rows.push({
        activity_id: a.id,
        media_type: 'image',
        url,
        sort_order: i + 1,
      })
    })
  }
  return rows
}

export function seedStayPackageRows() {
  return PACKAGES.map((p, i) => ({
    id: p.id,
    category: p.category,
    image_url: p.image,
    title: p.title,
    badge_fr: p.badge.fr,
    badge_en: p.badge.en,
    badge_es: p.badge.es,
    badge_ar: p.badge.ar,
    desc_fr: p.desc.fr,
    desc_en: p.desc.en,
    desc_es: p.desc.es,
    desc_ar: p.desc.ar,
    features: p.features,
    tiers: p.tiers,
    perks: p.perks,
    sort_order: i + 1,
    published: true,
  }))
}

export function activityImageFieldKey(activityId: string, index: number) {
  return `activities.${activityId}.${index}`
}

export function packCoverFieldKey(packId: string) {
  return `packages.${packId}.cover`
}

export function parseActivityImageKey(key: string): { activityId: string; index: number } | null {
  const m = /^activities\.([^.]+)\.(\d+)$/.exec(key)
  if (!m) return null
  return { activityId: m[1], index: Number(m[2]) }
}

export function parsePackCoverKey(key: string): string | null {
  const m = /^packages\.([^.]+)\.cover$/.exec(key)
  return m ? m[1] : null
}
