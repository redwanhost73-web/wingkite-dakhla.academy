import type { Localized } from '@/lib/cms/types'

export type MealPlanId = 'bb' | 'hb' | 'fb'

export type MealPlan = {
  id: MealPlanId
  name: Localized
  includes: Localized
  /** Price per night in EUR (double occupancy rates from Dakhla Camp) */
  pricePerNight: number
}

export type RoomType = {
  id: string
  name: Localized
  desc: Localized
  beds: Localized
  capacity: Localized
  maxGuests: number
  amenities: Localized[]
  image: string
  gallery: string[]
  mealPlans: MealPlan[]
}

export type Hotel = {
  id: string
  name: Localized
  location: Localized
  tagline: Localized
  desc: Localized
  cover: string
  website?: string
  rooms: RoomType[]
}

const loc = (fr: string, en: string, es: string, ar: string): Localized => ({ fr, en, es, ar })

export const HOUSE_RULES: { label: Localized; detail: Localized }[] = [
  {
    label: loc('Check-in', 'Check-in', 'Check-in', 'تسجيل الوصول'),
    detail: loc('à partir de 15h00', 'from 3:00 PM', 'desde las 15:00', 'من الساعة 15:00'),
  },
  {
    label: loc('Check-out', 'Check-out', 'Check-out', 'تسجيل المغادرة'),
    detail: loc('avant 11h00', 'before 11:00 AM', 'antes de las 11:00', 'قبل الساعة 11:00'),
  },
  {
    label: loc('Non-fumeur', 'No smoking', 'No fumar', 'ممنوع التدخين'),
    detail: loc(
      'à l’intérieur des chambres',
      'inside the rooms',
      'dentro de las habitaciones',
      'داخل الغرف',
    ),
  },
  {
    label: loc('Animaux', 'Pets', 'Mascotas', 'حيوانات أليفة'),
    detail: loc(
      'autorisés dans certaines chambres — merci de nous prévenir à l’avance',
      'allowed in certain rooms — please notify us in advance',
      'permitidos en ciertas habitaciones — avísanos con antelación',
      'مسموح في بعض الغرف — يرجى إبلاغنا مسبقاً',
    ),
  },
  {
    label: loc('Dommages', 'Damages', 'Daños', 'أضرار'),
    detail: loc(
      'tout objet endommagé ou manquant peut être facturé',
      'any damage or missing objects may be charged',
      'cualquier daño u objeto faltante puede cobrarse',
      'قد تُحتسب أي أضرار أو أشياء مفقودة',
    ),
  },
]

const MEAL_BB = (price: number): MealPlan => ({
  id: 'bb',
  name: loc('Bed & Breakfast', 'Bed & Breakfast', 'Bed & Breakfast', 'إفطار'),
  includes: loc(
    'Petit-déjeuner inclus',
    'Breakfast included',
    'Desayuno incluido',
    'الإفطار مشمول',
  ),
  pricePerNight: price,
})

const MEAL_HB = (price: number): MealPlan => ({
  id: 'hb',
  name: loc('Demi-pension', 'Half Board', 'Media pensión', 'نصف إقامة'),
  includes: loc(
    'Petit-déjeuner + dîner',
    'Breakfast + Dinner',
    'Desayuno + cena',
    'إفطار + عشاء',
  ),
  pricePerNight: price,
})

const MEAL_FB = (price: number): MealPlan => ({
  id: 'fb',
  name: loc('Pension complète', 'Full Board', 'Pensión completa', 'إقامة كاملة'),
  includes: loc(
    'Petit-déjeuner + déjeuner + dîner',
    'Breakfast + Lunch + Dinner',
    'Desayuno + almuerzo + cena',
    'إفطار + غداء + عشاء',
  ),
  pricePerNight: price,
})

function gallery(slug: string, count: number) {
  return Array.from({ length: count }, (_, i) => `/Accommodation/dakhla-camp/${slug}/gallery-${i + 1}.webp`)
}

/** Partner hotels — Dakhla Camp rooms + nightly meal-plan rates from dakhlacamp.com */
export const HOTELS: Hotel[] = [
  {
    id: 'dakhla-camp',
    name: loc('Dakhla Camp', 'Dakhla Camp', 'Dakhla Camp', 'داخلة كامب'),
    location: loc(
      'Lagon de Dakhla, Maroc',
      'Dakhla Lagoon, Morocco',
      'Laguna de Dakhla, Marruecos',
      'بحيرة الداخلة، المغرب',
    ),
    tagline: loc(
      'Où le style rencontre le repos',
      'Where style meets rest',
      'Donde el estilo encuentra el descanso',
      'حيث يلتقي الأناقة بالراحة',
    ),
    desc: loc(
      'Bungalows et suites face au spot — conçus pour se détendre après une journée sur l’eau.',
      'Bungalows and suites by the spot — designed to unwind after a day on the water.',
      'Bungalows y suites junto al spot — pensados para descansar tras un día en el agua.',
      'أكواخ وأجنحة بجانب الموقع — مصممة للاسترخاء بعد يوم على الماء.',
    ),
    cover: '/Accommodation/dakhla-camp/room-1.webp',
    website: 'https://www.dakhlacamp.com/rooms',
    rooms: [
      {
        id: 'bungalow-vue-sur-mer',
        name: loc(
          'Bungalow Vue sur Mer',
          'Ocean View Bungalow',
          'Bungalow con vista al mar',
          'كوخ بإطلالة على البحر',
        ),
        desc: loc(
          'Réveillez-vous face à l’océan. Vue panoramique sur l’Atlantique depuis votre terrasse privée.',
          'Wake up facing the ocean. Panoramic Atlantic views from your private terrace.',
          'Despierta frente al océano. Vistas panorámicas al Atlántico desde tu terraza privada.',
          'استيقظ أمام المحيط. إطلالة بانورامية على الأطلسي من شرفتك الخاصة.',
        ),
        beds: loc(
          '1 lit double ou 2 lits séparés',
          '1 double bed or 2 separate beds',
          '1 cama doble o 2 individuales',
          'سرير مزدوج أو سريران منفصلان',
        ),
        capacity: loc('2 pers. max', 'Max 2 guests', '2 pers. máx.', 'شخصان كحد أقصى'),
        maxGuests: 2,
        amenities: [
          loc('Terrasse privée', 'Private terrace', 'Terraza privada', 'شرفة خاصة'),
          loc('Salle de bain moderne', 'Modern bathroom', 'Baño moderno', 'حمام عصري'),
        ],
        image: '/Accommodation/dakhla-camp/bungalow-vue-sur-mer/gallery-1.webp',
        gallery: gallery('bungalow-vue-sur-mer', 8),
        mealPlans: [MEAL_BB(98.13), MEAL_HB(116.82), MEAL_FB(130.84)],
      },
      {
        id: 'bungalow-deluxe',
        name: loc('Bungalow Deluxe', 'Deluxe Bungalow', 'Bungalow Deluxe', 'كوخ ديلوكس'),
        desc: loc(
          'Spacieux et convivial, idéal pour les groupes d’amis ou les familles à la recherche d’espace.',
          'Spacious and welcoming, perfectly suited for groups of friends or families seeking ample room.',
          'Espacioso y acogedor, ideal para grupos de amigos o familias que buscan espacio.',
          'واسع وودود، مثالي لمجموعات الأصدقاء أو العائلات التي تبحث عن مساحة.',
        ),
        beds: loc('3 lits simples', '3 single beds', '3 camas individuales', '3 أسرة فردية'),
        capacity: loc('3+ pers.', '3+ guests', '3+ pers.', '3+ أشخاص'),
        maxGuests: 3,
        amenities: [
          loc('Terrasse privée', 'Private terrace', 'Terraza privada', 'شرفة خاصة'),
          loc('Salle de bain moderne', 'Modern bathroom', 'Baño moderno', 'حمام عصري'),
        ],
        image: '/Accommodation/dakhla-camp/bungalow-deluxe/gallery-1.webp',
        gallery: gallery('bungalow-deluxe', 8),
        mealPlans: [MEAL_BB(140.19), MEAL_HB(149.53), MEAL_FB(168.22)],
      },
      {
        id: 'bungalow-standard',
        name: loc('Bungalow Standard', 'Standard Bungalow', 'Bungalow Standard', 'كوخ ستاندرد'),
        desc: loc(
          'L’essentiel du confort dans un cadre épuré. Parfait pour un séjour en duo, simple et authentique.',
          'Essential comfort in a clean setting. Perfect for a simple, authentic getaway for two.',
          'Lo esencial del confort en un entorno limpio. Ideal para una escapada en duo, simple y auténtica.',
          'أساسيات الراحة في إطار بسيط. مثالي لإقامة ثنائية بسيطة وأصيلة.',
        ),
        beds: loc(
          '1 lit double ou 2 lits séparés',
          '1 double bed or 2 separate beds',
          '1 cama doble o 2 individuales',
          'سرير مزدوج أو سريران منفصلان',
        ),
        capacity: loc('2 pers.', '2 guests', '2 pers.', 'شخصان'),
        maxGuests: 2,
        amenities: [
          loc('Terrasse privée', 'Private terrace', 'Terraza privada', 'شرفة خاصة'),
          loc('Salle de bain moderne', 'Modern bathroom', 'Baño moderno', 'حمام عصري'),
        ],
        image: '/Accommodation/dakhla-camp/bungalow-standard/gallery-1.webp',
        gallery: gallery('bungalow-standard', 6),
        mealPlans: [MEAL_BB(84.11), MEAL_HB(102.8), MEAL_FB(121.5)],
      },
      {
        id: 'suite-deluxe',
        name: loc('Suite Deluxe', 'Deluxe Suite', 'Suite Deluxe', 'جناح ديلوكس'),
        desc: loc(
          'Notre hébergement le plus raffiné. Salon séparé, literie premium et finitions soignées.',
          'Our finest accommodation. A separate living room, premium bedding, and refined luxury.',
          'Nuestro alojamiento más refinado. Salón separado, ropa de cama premium y acabados cuidados.',
          'إقامتنا الأرقى. صالة منفصلة وفرش فاخر وتشطيبات أنيقة.',
        ),
        beds: loc(
          '1 grand lit + canapé-lit',
          '1 large bed + sofa bed',
          '1 cama grande + sofá cama',
          'سرير كبير + أريكة سرير',
        ),
        capacity: loc('2 pers.', '2 guests', '2 pers.', 'شخصان'),
        maxGuests: 2,
        amenities: [
          loc('Terrasse privée', 'Private terrace', 'Terraza privada', 'شرفة خاصة'),
          loc('Salle de bain moderne', 'Modern bathroom', 'Baño moderno', 'حمام عصري'),
        ],
        image: '/Accommodation/dakhla-camp/suite-deluxe/gallery-1.webp',
        gallery: gallery('suite-deluxe', 8),
        mealPlans: [MEAL_BB(126.17), MEAL_HB(149.53), MEAL_FB(168.22)],
      },
    ],
  },
]

export function getHotel(hotelId: string) {
  return HOTELS.find((h) => h.id === hotelId)
}

export function getRoom(hotelId: string, roomId: string) {
  const hotel = getHotel(hotelId)
  return hotel?.rooms.find((r) => r.id === roomId)
}

export function getMealPlan(room: RoomType, mealPlanId: string) {
  return room.mealPlans.find((m) => m.id === mealPlanId)
}

export function nightsBetween(arrival: string, departure: string): number {
  const a = new Date(`${arrival}T12:00:00`)
  const d = new Date(`${departure}T12:00:00`)
  const ms = d.getTime() - a.getTime()
  if (!Number.isFinite(ms) || ms <= 0) return 0
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

export function formatEuro(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-FR' : locale === 'es' ? 'es-ES' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}
