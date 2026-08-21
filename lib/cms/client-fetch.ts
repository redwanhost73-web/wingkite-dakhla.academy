import { DEFAULT_IMAGES, DEFAULT_PRICING, type PricingRow, type SiteImages } from '@/lib/site-config'
import { MEDIA_PACK } from '@/lib/media-pack'
import { fromColumns, type Localized } from '@/lib/cms/types'
import { createClient } from '@/lib/supabase/client'
import { ACTIVITIES, type Activity, type LocalizedText } from '@/lib/activities'
import { PACKAGES, type Pack } from '@/lib/packages'
import { mapActivityRow, mapPackRow } from '@/lib/cms/content-lists'
import { packCoverFieldKey } from '@/lib/cms/content-lists'
import { DEFAULT_GALLERY, mapGalleryRow, type GalleryItem } from '@/lib/gallery'

export type SiteTexts = Record<string, Localized>

export type MediaPackRow = {
  priceEur: number
  title: Localized
  short: Localized
  desc: Localized
  cta: Localized
  availableOn: Localized
  features: Localized[]
}

export type WhyChooseItem = {
  id: string
  icon: string
  title: Localized
  desc: Localized
}

export type CmsBundle = {
  images: SiteImages
  pricing: PricingRow[]
  texts: SiteTexts
  mediaPack: MediaPackRow
  whyChoose: WhyChooseItem[]
  activities: Activity[]
  packages: Pack[]
  gallery: GalleryItem[]
  configured: boolean
  loaded: boolean
}

function defaultMediaPack(): MediaPackRow {
  return {
    priceEur: MEDIA_PACK.priceEur,
    title: MEDIA_PACK.title,
    short: MEDIA_PACK.short,
    desc: MEDIA_PACK.desc,
    cta: MEDIA_PACK.cta,
    availableOn: MEDIA_PACK.availableOn,
    features: MEDIA_PACK.features as LocalizedText[],
  }
}

export function emptyCmsBundle(loaded = false): CmsBundle {
  return {
    images: DEFAULT_IMAGES,
    pricing: DEFAULT_PRICING,
    texts: {},
    mediaPack: defaultMediaPack(),
    whyChoose: [],
    activities: ACTIVITIES,
    packages: PACKAGES,
    gallery: DEFAULT_GALLERY,
    configured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
    loaded,
  }
}

/** Browser-side fetch; falls back to code defaults when offline / empty. */
export async function fetchCmsBundle(): Promise<CmsBundle> {
  const base = emptyCmsBundle(true)
  const supabase = createClient()
  if (!supabase) return base
  const imageByKey: Record<string, string> = {}

  try {
    const [
      imagesRes,
      pricingRes,
      textsRes,
      packRes,
      featsRes,
      whyRes,
      activitiesRes,
      activityMediaRes,
      stayPacksRes,
      galleryRes,
    ] = await Promise.all([
      supabase.from('site_images').select('*'),
      supabase.from('site_pricing').select('*').order('sort_order'),
      supabase.from('site_texts').select('*'),
      supabase.from('media_packs').select('*').eq('id', 'default').maybeSingle(),
      supabase.from('media_pack_features').select('*').eq('pack_id', 'default').order('sort_order'),
      supabase.from('why_choose_items').select('*').eq('published', true).order('sort_order'),
      supabase.from('activities').select('*').eq('published', true).order('sort_order'),
      supabase.from('activity_media').select('*').order('sort_order'),
      supabase.from('stay_packages').select('*').eq('published', true).order('sort_order'),
      supabase.from('gallery_items').select('*').eq('published', true).order('sort_order'),
    ])

    if (imagesRes.data?.length) {
      const map: Partial<SiteImages> = {}
      for (const row of imagesRes.data as { key?: string; id?: string; url: string }[]) {
        const k = (row.key || row.id) as string | undefined
        if (k && row.url) imageByKey[k] = row.url
        const defaultKey = k as keyof SiteImages | undefined
        if (defaultKey && row.url && defaultKey in DEFAULT_IMAGES) map[defaultKey] = row.url
      }
      base.images = { ...DEFAULT_IMAGES, ...map }
    }

    if (pricingRes.data?.length) {
      base.pricing = (pricingRes.data as {
        id?: string
        hours: string
        semi_eur: number
        semi_mad: number
        priv_eur: number
        priv_mad: number
        is_extra?: boolean
      }[]).map((row) => ({
        id: row.id || `row_${String(row.hours).replace('+', 'extra_')}`,
        hours: row.hours,
        semiEur: Number(row.semi_eur),
        semiMad: Number(row.semi_mad),
        privEur: Number(row.priv_eur),
        privMad: Number(row.priv_mad),
        extra: Boolean(row.is_extra),
      }))
    }

    if (textsRes.data?.length) {
      const texts: SiteTexts = {}
      for (const row of textsRes.data as {
        key: string
        value_fr: string
        value_en: string
        value_es: string
        value_ar: string
      }[]) {
        texts[row.key] = {
          fr: row.value_fr,
          en: row.value_en,
          es: row.value_es,
          ar: row.value_ar,
        }
      }
      base.texts = texts
    }

    if (packRes.data) {
      const p = packRes.data as Record<string, unknown>
      base.mediaPack = {
        priceEur: Number(p.price_eur ?? 60),
        title: fromColumns(p, 'title'),
        short: fromColumns(p, 'short'),
        desc: fromColumns(p, 'desc'),
        cta: fromColumns(p, 'cta'),
        availableOn: fromColumns(p, 'available_on'),
        features: (featsRes.data || []).map((f) => fromColumns(f as Record<string, unknown>, 'text')),
      }
      if (!base.mediaPack.features.length) {
        base.mediaPack.features = defaultMediaPack().features
      }
    }

    if (whyRes.data?.length) {
      base.whyChoose = (whyRes.data as Record<string, unknown>[]).map((row) => ({
        id: String(row.id),
        icon: String(row.icon || 'Star'),
        title: fromColumns(row, 'title'),
        desc: fromColumns(row, 'desc'),
      }))
    }

    if (activitiesRes.data?.length) {
      const mediaByActivity = new Map<string, string[]>()
      for (const m of (activityMediaRes.data || []) as {
        activity_id: string
        url: string
        media_type?: string
      }[]) {
        if (m.media_type && m.media_type !== 'image') continue
        const list = mediaByActivity.get(m.activity_id) || []
        list.push(m.url)
        mediaByActivity.set(m.activity_id, list)
      }
      base.activities = (activitiesRes.data as Record<string, unknown>[]).map((row) =>
        mapActivityRow(row, mediaByActivity.get(String(row.id)) || []),
      )
    }

    if (stayPacksRes.data?.length) {
      base.packages = (stayPacksRes.data as Record<string, unknown>[]).map((row) => {
        const id = String(row.id || '')
        const coverKey = packCoverFieldKey(id)
        const coverFromImages = imageByKey[coverKey]
        return mapPackRow(coverFromImages ? { ...row, image_url: coverFromImages } : row)
      })
    }

    // Always apply per-pack cover overrides from site_images, even if stay_packages
    // is empty and we are using code fallbacks.
    base.packages = base.packages.map((pack) => {
      const cover = imageByKey[packCoverFieldKey(pack.id)]
      return cover ? { ...pack, image: cover } : pack
    })

    // Ignore missing-table errors until 007_gallery_items.sql is applied.
    if (!galleryRes.error && galleryRes.data?.length) {
      base.gallery = (galleryRes.data as Record<string, unknown>[]).map(mapGalleryRow)
    }
  } catch (err) {
    console.error('CMS fetch failed, using defaults:', err)
  }

  return base
}
