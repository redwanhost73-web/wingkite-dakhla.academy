// Site configuration with localStorage persistence
// Default values that can be overridden via /control panel

export interface PricingRow {
  hours: string
  semiEur: number
  semiMad: number
  privEur: number
  privMad: number
  extra?: boolean
}

export interface SiteImages {
  // Home page
  homeHero: string
  homeWing1: string
  homeWing2: string
  homeKite1: string
  homeAction: string
  homeSunset: string
  homeCoach: string
  homeLagoon: string
  // About page
  aboutHero: string
  aboutStory: string
  aboutTeam: string
  aboutLocation: string
  aboutAction1: string
  aboutAction2: string
  aboutSunset: string
  // Contact page
  contactHero: string
  // Pricing page
  pricingHero: string
  pricingAction: string
}

export interface SiteConfig {
  images: SiteImages
  pricing: PricingRow[]
}

// Default images (current production values)
export const DEFAULT_IMAGES: SiteImages = {
  // Home page
  homeHero: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8044E789-98B4-47B7-BEBF-3C42CFFE279F-gP3fvRzzgbPm1DEkndcCFHd2y91Mcg.jpg',
  homeWing1: '/Activities/wingfoil-1.jpeg',
  homeWing2: '/Activities/wingfoil-3.jpeg',
  homeKite1: '/Activities/kitesurf-1.jpeg',
  homeAction: '/Activities/wingfoil-4.jpeg',
  homeSunset: '/Activities/wingfoil-6.jpeg',
  homeCoach: '/Activities/wingfoil-2.jpeg',
  homeLagoon: '/Activities/wingfoil-8.jpeg',
  // About page
  aboutHero: '/pages-cover/about.jpeg',
  aboutStory: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ca577150-7f3e-4303-8332-33ff3a8f5339.JPG-hEVCP8iIohmq5ONaJ8048CKcJEFEve.jpeg',
  aboutTeam: '/sections/team.jpeg',
  aboutLocation: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8044E789-98B4-47B7-BEBF-3C42CFFE279F-gP3fvRzzgbPm1DEkndcCFHd2y91Mcg.jpg',
  aboutAction1: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/07e6d850-397a-4a50-b73f-03889f4d6808.JPG-cQfrOgTyoNYORSDs65CrrKNVAHZgbf.jpeg',
  aboutAction2: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5339-w81lYn7nf4BLQp7C0ZQcETIIxJiaG6.jpg',
  aboutSunset: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_1936-eN0eozzW3oVm4Wafhmm5fM0ANlcdIt.jpg',
  // Contact page
  contactHero: '/pages-cover/contact.jpeg',
  // Pricing page
  pricingHero: '/pages-cover/pricing.jpeg',
  pricingAction: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/07e6d850-397a-4a50-b73f-03889f4d6808.JPG-cQfrOgTyoNYORSDs65CrrKNVAHZgbf.jpeg',
}

// Default pricing — matches the printed 2026 price list.
// Semi-private = 2–3 persons, private = 1 person. MAD = EUR x 11.
export const DEFAULT_PRICING: PricingRow[] = [
  { hours: '2h',  semiEur: 80,  semiMad: 880,  privEur: 110, privMad: 1210 },
  { hours: '4h',  semiEur: 150, semiMad: 1650, privEur: 210, privMad: 2310 },
  { hours: '6h',  semiEur: 215, semiMad: 2365, privEur: 315, privMad: 3465 },
  { hours: '8h',  semiEur: 280, semiMad: 3080, privEur: 390, privMad: 4290 },
  { hours: '10h', semiEur: 340, semiMad: 3740, privEur: 475, privMad: 5225 },
  { hours: '12h', semiEur: 400, semiMad: 4400, privEur: 565, privMad: 6215 },
  { hours: '+2h', semiEur: 70,  semiMad: 770,  privEur: 90,  privMad: 990,  extra: true },
]

const STORAGE_KEY = 'wingkite-site-config'

// Get config from localStorage (client-side only)
export function getStoredConfig(): SiteConfig | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to parse stored config:', e)
  }
  return null
}

// Save config to localStorage
export function saveConfig(config: Partial<SiteConfig>): void {
  if (typeof window === 'undefined') return
  try {
    const current = getStoredConfig() || { images: DEFAULT_IMAGES, pricing: DEFAULT_PRICING }
    const updated = {
      images: { ...current.images, ...config.images },
      pricing: config.pricing || current.pricing,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    // Dispatch event so other components can react
    window.dispatchEvent(new CustomEvent('site-config-updated', { detail: updated }))
  } catch (e) {
    console.error('Failed to save config:', e)
  }
}

// Reset config to defaults
export function resetConfig(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new CustomEvent('site-config-updated', { detail: null }))
}

// Get current images (with localStorage override)
export function getImages(): SiteImages {
  const stored = getStoredConfig()
  return stored?.images || DEFAULT_IMAGES
}

// Get current pricing (with localStorage override)
export function getPricing(): PricingRow[] {
  const stored = getStoredConfig()
  return stored?.pricing || DEFAULT_PRICING
}

// Human-readable labels for image keys
export const IMAGE_LABELS: Record<keyof SiteImages, string> = {
  homeHero: 'Accueil - Hero (fond bleu)',
  homeWing1: 'Accueil - Wingfoil Card',
  homeWing2: 'Accueil - Wingfoil 2',
  homeKite1: 'Accueil - Kitesurf Card',
  homeAction: 'Accueil - Coaching Card',
  homeSunset: 'Accueil - Coucher de soleil',
  homeCoach: 'Accueil - Coach',
  aboutHero: 'A propos - Hero',
  aboutStory: 'A propos - Histoire',
  aboutTeam: 'A propos - Equipe',
  aboutLocation: 'A propos - Location',
  aboutAction1: 'A propos - Action 1',
  aboutAction2: 'A propos - Action 2',
  aboutSunset: 'A propos - Coucher de soleil',
  contactHero: 'Contact - Hero',
  pricingHero: 'Tarifs - Hero',
  pricingAction: 'Tarifs - Action',
}
