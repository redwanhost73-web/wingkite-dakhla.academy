import type { Localized } from '@/lib/cms/types'

export type RentalItem = {
  id: string
  name: Localized
  halfDayEur: number
  dayEur: number
}

/** Catalog seeded from Dakhla Camp equipment-rental reference (client request). */
export const EQUIPMENT_RENTAL_ITEMS: RentalItem[] = [
  {
    id: 'kite-set',
    name: {
      fr: 'Set complet Kitesurf',
      en: 'Full Kitesurf set',
      es: 'Set completo Kitesurf',
      ar: 'طقم كايت سيرف كامل',
    },
    halfDayEur: 60,
    dayEur: 80,
  },
  {
    id: 'wing-set',
    name: {
      fr: 'Set complet Wingfoil',
      en: 'Full Wingfoil set',
      es: 'Set completo Wingfoil',
      ar: 'طقم وينج فويل كامل',
    },
    halfDayEur: 70,
    dayEur: 95,
  },
  {
    id: 'kite-wing-bar',
    name: {
      fr: 'Ailes & Barres (Kite)',
      en: 'Kite wings & bars',
      es: 'Alas y barras (Kite)',
      ar: 'أجنحة وقضبان الكايت',
    },
    halfDayEur: 55,
    dayEur: 60,
  },
  {
    id: 'twintip',
    name: {
      fr: 'Planches Twintip',
      en: 'Twintip boards',
      es: 'Tablas Twintip',
      ar: 'ألواح توين تيب',
    },
    halfDayEur: 25,
    dayEur: 30,
  },
  {
    id: 'wing',
    name: {
      fr: 'Ailes (Wing)',
      en: 'Wings',
      es: 'Alas (Wing)',
      ar: 'أجنحة الوينج',
    },
    halfDayEur: 50,
    dayEur: 60,
  },
  {
    id: 'wing-board',
    name: {
      fr: 'Planches Wingfoil',
      en: 'Wingfoil boards',
      es: 'Tablas Wingfoil',
      ar: 'ألواح وينج فويل',
    },
    halfDayEur: 45,
    dayEur: 55,
  },
  {
    id: 'surf',
    name: {
      fr: 'Planches de surf',
      en: 'Surfboards',
      es: 'Tablas de surf',
      ar: 'ألواح ركوب الأمواج',
    },
    halfDayEur: 30,
    dayEur: 45,
  },
]

export const RENTAL_IMAGES = {
  /** Landscape action — hero cover */
  hero: '/Activities/rental/rental-05.jpg',
  gallery: [
    '/Activities/rental/rental-01.jpg',
    '/Activities/rental/rental-02.jpg',
    '/Activities/rental/rental-03.jpg',
    '/Activities/rental/rental-04.jpg',
    '/Activities/rental/rental-05.jpg',
  ],
} as const

export const RENTAL_NOTES: Localized[] = [
  {
    fr: 'Jusqu’à −20% multi-jours',
    en: 'Up to −20% multi-day',
    es: 'Hasta −20% multi-días',
    ar: 'خصم حتى 20٪ لعدة أيام',
  },
  {
    fr: 'Combis & harnais sur demande',
    en: 'Wetsuits & harnesses on request',
    es: 'Trajes y arneses bajo petición',
    ar: 'بدلات وأحزمة حسب الطلب',
  },
]
