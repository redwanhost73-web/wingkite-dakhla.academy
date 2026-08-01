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
  // Home page — local files so /_next/image never waits on a slow remote blob.
  homeHero: '/heroes/home-hero.jpg',
  homeWing1: '/Activities/wingfoil-1.jpeg',
  homeWing2: '/Activities/wingfoil-3.jpeg',
  homeKite1: '/Activities/kitesurf-1.jpeg',
  homeAction: '/Activities/wingfoil-4.jpeg',
  homeSunset: '/Activities/wingfoil-6.jpeg',
  homeCoach: '/Activities/wingfoil-2.jpeg',
  homeLagoon: '/Activities/wingfoil-8.jpeg',
  // About page
  aboutHero: '/pages-cover/about.jpeg',
  aboutStory: '/sections/why-choose-us.jpeg',
  aboutTeam: '/sections/team.jpeg',
  aboutLocation: '/heroes/home-hero.jpg',
  aboutAction1: '/heroes/about-action.jpg',
  aboutAction2: '/Activities/wingfoil-5.jpeg',
  aboutSunset: '/Activities/wingfoil-6.jpeg',
  // Contact page
  contactHero: '/pages-cover/contact.jpeg',
  // Pricing page
  pricingHero: '/pages-cover/pricing.jpeg',
  pricingAction: '/heroes/about-action.jpg',
}

// Default pricing — from current academy rate cards (private + semi-private).
// Semi-private = 2–3 persons, private = 1 person. MAD values match the printed list.
export const DEFAULT_PRICING: PricingRow[] = [
  { hours: '2h',  semiEur: 90,  semiMad: 990,  privEur: 120,  privMad: 1320 },
  { hours: '4h',  semiEur: 170, semiMad: 1870, privEur: 235,  privMad: 2585 },
  { hours: '6h',  semiEur: 240, semiMad: 2640, privEur: 350,  privMad: 3850 },
  { hours: '8h',  semiEur: 320, semiMad: 3520, privEur: 450,  privMad: 4950 },
  { hours: '10h', semiEur: 395, semiMad: 4345, privEur: 560,  privMad: 6160 },
  { hours: '12h', semiEur: 460, semiMad: 5060, privEur: 670,  privMad: 7370 },
  { hours: '+2h', semiEur: 70,  semiMad: 770,  privEur: 90,   privMad: 990,  extra: true },
  // Private-only pack — semi is 0 so the semi-private list skips this row.
  { hours: '20h', semiEur: 0,   semiMad: 0,    privEur: 1000, privMad: 11000, extra: true },
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
