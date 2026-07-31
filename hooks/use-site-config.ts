'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_IMAGES, DEFAULT_PRICING, PricingRow, SiteImages } from '@/lib/site-config'

interface SiteImage {
  id: number
  key: string
  url: string
  page: string
  description: string
}

interface SitePricing {
  id: number
  hours: string
  semi_eur: number
  semi_mad: number
  priv_eur: number
  priv_mad: number
  is_extra: boolean
}

interface SiteText {
  id: number
  key: string
  value_fr: string
  value_en: string
  value_es: string
  value_ar: string
  section: string
  label: string
}

export interface SiteTexts {
  [key: string]: {
    fr: string
    en: string
    es: string
    ar: string
  }
}

export function useSiteConfig() {
  const [images, setImages] = useState<SiteImages>(DEFAULT_IMAGES)
  const [pricing, setPricing] = useState<PricingRow[]>(DEFAULT_PRICING)
  const [texts, setTexts] = useState<SiteTexts>({})
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    const supabase = createClient()
    
    async function fetchConfig() {
      try {
        const [imagesRes, pricingRes, textsRes] = await Promise.all([
          supabase.from('site_images').select('*'),
          supabase.from('site_pricing').select('*').order('id'),
          supabase.from('site_texts').select('*')
        ])
        
        if (imagesRes.data && imagesRes.data.length > 0) {
          const imageMap: Partial<SiteImages> = {}
          imagesRes.data.forEach((img: SiteImage) => {
            imageMap[img.key as keyof SiteImages] = img.url
          })
          setImages({ ...DEFAULT_IMAGES, ...imageMap })
        }
        
        if (pricingRes.data && pricingRes.data.length > 0) {
          const pricingRows: PricingRow[] = pricingRes.data.map((row: SitePricing) => ({
            hours: row.hours,
            semiEur: Number(row.semi_eur),
            semiMad: Number(row.semi_mad),
            privEur: Number(row.priv_eur),
            privMad: Number(row.priv_mad),
            extra: row.is_extra
          }))
          setPricing(pricingRows)
        }
        
        if (textsRes.data && textsRes.data.length > 0) {
          const textMap: SiteTexts = {}
          textsRes.data.forEach((text: SiteText) => {
            textMap[text.key] = {
              fr: text.value_fr,
              en: text.value_en,
              es: text.value_es,
              ar: text.value_ar
            }
          })
          setTexts(textMap)
        }
      } catch (err) {
        console.error('Error fetching site config:', err)
      }
      setIsLoaded(true)
    }
    
    fetchConfig()
  }, [])
  
  return { images, pricing, texts, isLoaded }
}
