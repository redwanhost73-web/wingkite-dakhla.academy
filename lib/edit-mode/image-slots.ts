import {
  DEFAULT_IMAGES,
  IMAGE_LABELS,
  type SiteImages,
} from '@/lib/site-config'

export type SiteImageSlot = {
  key: keyof SiteImages
  label: string
  page: 'home' | 'about' | 'contact' | 'pricing'
  defaultUrl: string
}

function pageForKey(key: keyof SiteImages): SiteImageSlot['page'] {
  if (key.startsWith('about')) return 'about'
  if (key.startsWith('pricing')) return 'pricing'
  if (key.startsWith('contact')) return 'contact'
  return 'home'
}

export const SITE_IMAGE_SLOTS: SiteImageSlot[] = (
  Object.keys(DEFAULT_IMAGES) as (keyof SiteImages)[]
).map((key) => ({
  key,
  label: IMAGE_LABELS[key] || key,
  page: pageForKey(key),
  defaultUrl: DEFAULT_IMAGES[key],
}))

export function siteImagePage(key: string): string {
  const slot = SITE_IMAGE_SLOTS.find((s) => s.key === key)
  if (slot) return slot.page
  if (key.startsWith('packages.')) return 'pricing'
  if (key.startsWith('activities.')) return 'home'
  if (key.startsWith('about')) return 'about'
  if (key.startsWith('pricing') || key.startsWith('safety')) return key.startsWith('pricing') ? 'pricing' : 'about'
  if (key.startsWith('contact')) return 'contact'
  return 'home'
}

/** Unique library URLs from live CMS map + defaults. */
export function buildImageLibrary(
  live: Partial<SiteImages> | Record<string, string>,
): Array<{ url: string; keys: string[]; label: string }> {
  const byUrl = new Map<string, { keys: string[]; label: string }>()

  for (const slot of SITE_IMAGE_SLOTS) {
    const url = (live as Record<string, string>)[slot.key] || slot.defaultUrl
    if (!url) continue
    const existing = byUrl.get(url)
    if (existing) {
      existing.keys.push(slot.key)
    } else {
      byUrl.set(url, { keys: [slot.key], label: slot.label })
    }
  }

  return [...byUrl.entries()].map(([url, meta]) => ({
    url,
    keys: meta.keys,
    label: meta.label,
  }))
}
