'use client'

import { useEffect, useState, useCallback } from 'react'
import { emptyCmsBundle, fetchCmsBundle, type CmsBundle, type SiteTexts } from '@/lib/cms/client-fetch'
import type { PricingRow, SiteImages } from '@/lib/site-config'
import type { Activity } from '@/lib/activities'
import type { Pack } from '@/lib/packages'

export type { SiteTexts }

export function useSiteConfig() {
  const [bundle, setBundle] = useState<CmsBundle>(() => emptyCmsBundle(false))

  const refresh = useCallback(() => {
    fetchCmsBundle().then(setBundle)
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchCmsBundle().then((data) => {
      if (!cancelled) setBundle(data)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const onRefresh = () => refresh()
    window.addEventListener('cms:refresh', onRefresh)
    return () => window.removeEventListener('cms:refresh', onRefresh)
  }, [refresh])

  return {
    images: bundle.images as SiteImages,
    pricing: bundle.pricing as PricingRow[],
    texts: bundle.texts,
    mediaPack: bundle.mediaPack,
    whyChoose: bundle.whyChoose,
    activities: bundle.activities as Activity[],
    packages: bundle.packages as Pack[],
    isLoaded: bundle.loaded,
    cmsConfigured: bundle.configured,
    refresh,
  }
}
