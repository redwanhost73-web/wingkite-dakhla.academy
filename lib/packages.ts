export type LocalizedText = {
  fr: string
  en: string
  es: string
  ar: string
}

export type PackFeatureIcon = 'nights' | 'board' | 'bungalow'

export type PackTier = {
  name: LocalizedText
  price: string
  perPerson?: string
  lines: LocalizedText[]
}

export type Pack = {
  id: string
  category: 'kitesurf' | 'wingfoil'
  image: string
  badge: LocalizedText
  title: string
  desc: LocalizedText
  features: { icon: PackFeatureIcon; text: LocalizedText }[]
  tiers: PackTier[]
  perks: LocalizedText[]
}

const SOLO_BADGE: LocalizedText = {
  fr: 'Séjour Solo',
  en: 'Solo Stay',
  es: 'Estancia Solo',
  ar: 'إقامة فردية',
}

const DUO_BADGE: LocalizedText = {
  fr: 'Pour Deux',
  en: 'For Two',
  es: 'Para Dos',
  ar: 'لشخصين',
}

const NIGHTS: LocalizedText = { fr: '7 Nuits', en: '7 Nights', es: '7 Noches', ar: '7 ليالٍ' }
const FULL_BOARD: LocalizedText = {
  fr: 'Pension Complète',
  en: 'Full Board',
  es: 'Pensión Completa',
  ar: 'إقامة كاملة',
}
const PRIVATE_BUNGALOW: LocalizedText = {
  fr: 'Bungalow Privé',
  en: 'Private Bungalow',
  es: 'Bungalow Privado',
  ar: 'بنغالو خاص',
}

const CHILL: LocalizedText = { fr: 'Chill', en: 'Chill', es: 'Chill', ar: 'هادئ' }
const INTENSE: LocalizedText = { fr: 'Intense', en: 'Intense', es: 'Intenso', ar: 'مكثف' }

const ONE_SESSION: LocalizedText = {
  fr: '1 session / jour',
  en: '1 session / day',
  es: '1 sesión / día',
  ar: 'حصة واحدة / يوم',
}
const TWO_SESSIONS: LocalizedText = {
  fr: '2 sessions / jour',
  en: '2 sessions / day',
  es: '2 sesiones / día',
  ar: 'حصتان / يوم',
}
const TEN_HOURS: LocalizedText = {
  fr: '10h de cours',
  en: '10h of lessons',
  es: '10h de clases',
  ar: '10 ساعات دروس',
}
const TWENTY_HOURS: LocalizedText = {
  fr: '20h de cours',
  en: '20h of lessons',
  es: '20h de clases',
  ar: '20 ساعة دروس',
}

const PERK_LODGING: LocalizedText = {
  fr: '-30% hébergement',
  en: '-30% lodging',
  es: '-30% alojamiento',
  ar: 'خصم 30% على الإقامة',
}
const PERK_PRIVATE: LocalizedText = {
  fr: '-17% cours privés',
  en: '-17% private lessons',
  es: '-17% clases privadas',
  ar: 'خصم 17% على الدروس الخاصة',
}
const PERK_SEMI: LocalizedText = {
  fr: '-17% semi-privés',
  en: '-17% semi-private',
  es: '-17% semi-privadas',
  ar: 'خصم 17% على الدروس شبه الخاصة',
}
const PERK_GEAR_INCLUDED: LocalizedText = {
  fr: 'Matériel inclus',
  en: 'Gear included',
  es: 'Material incluido',
  ar: 'المعدات مشمولة',
}
const PERK_GEAR_X2: LocalizedText = {
  fr: 'Matériel × 2',
  en: 'Gear × 2',
  es: 'Material × 2',
  ar: 'معدات × 2',
}

export const PACKAGES: Pack[] = [
  {
    id: 'kitesurf-solo',
    category: 'kitesurf',
    image: '/Packs/kitesurf-solo.jpeg',
    badge: SOLO_BADGE,
    title: 'Kitesurf Solo',
    desc: {
      fr: 'Votre progression kitesurf 100% privée. Bungalow, coach dédié et équipement premium. Zéro stress, glisse maximale.',
      en: 'Your kitesurf progression, 100% private. Bungalow, dedicated coach and premium equipment. Zero stress, maximum riding.',
      es: 'Tu progresión en kitesurf 100% privada. Bungalow, coach dedicado y equipo premium. Cero estrés, máximo deslizamiento.',
      ar: 'تقدمك في الكايت سيرف بشكل خاص 100%. بنغالو ومدرب مخصص ومعدات متميزة. بلا توتر، أقصى استمتاع.',
    },
    features: [
      { icon: 'nights', text: NIGHTS },
      { icon: 'board', text: FULL_BOARD },
      { icon: 'bungalow', text: PRIVATE_BUNGALOW },
    ],
    tiers: [
      { name: CHILL, price: '929€', lines: [ONE_SESSION, TEN_HOURS] },
      { name: INTENSE, price: '1,317€', lines: [TWO_SESSIONS, TWENTY_HOURS] },
    ],
    perks: [PERK_LODGING, PERK_PRIVATE, PERK_GEAR_INCLUDED],
  },
  {
    id: 'kitesurf-duo',
    category: 'kitesurf',
    image: '/Packs/kitesurf-duo.jpeg',
    badge: DUO_BADGE,
    title: 'Kitesurf Duo',
    desc: {
      fr: "Partagez l'aventure. Coaching semi-privé, bungalow partagé et tarifs combinés imbattables. Progresser est mieux à deux.",
      en: 'Share the adventure. Semi-private coaching, shared bungalow and unbeatable combined rates. Progress is better together.',
      es: 'Comparte la aventura. Coaching semi-privado, bungalow compartido y tarifas combinadas inmejorables. Progresar es mejor en pareja.',
      ar: 'شارك المغامرة. تدريب شبه خاص وبنغالو مشترك وأسعار مجمعة لا تُقاوم. التقدم أفضل معاً.',
    },
    features: [
      { icon: 'nights', text: NIGHTS },
      { icon: 'board', text: FULL_BOARD },
      { icon: 'bungalow', text: PRIVATE_BUNGALOW },
    ],
    tiers: [
      { name: CHILL, price: '1,314€', perPerson: '657€', lines: [ONE_SESSION, TEN_HOURS] },
      { name: INTENSE, price: '1,804€', perPerson: '902€', lines: [TWO_SESSIONS, TWENTY_HOURS] },
    ],
    perks: [PERK_LODGING, PERK_SEMI, PERK_GEAR_X2],
  },
  {
    id: 'wingfoil-solo',
    category: 'wingfoil',
    image: '/Packs/wingfoil-solo.webp',
    badge: SOLO_BADGE,
    title: 'Wingfoil Solo',
    desc: {
      fr: 'Bungalow privé, 7 nuits en pension complète, 1 moniteur pour 2 élèves. Décollez sur la lagune dans les meilleures conditions.',
      en: 'Private bungalow, 7 nights full board, 1 instructor per 2 students. Take off over the lagoon in the best conditions.',
      es: 'Bungalow privado, 7 noches en pensión completa, 1 monitor por 2 alumnos. Despega sobre la laguna en las mejores condiciones.',
      ar: 'بنغالو خاص، 7 ليالٍ بإقامة كاملة، مدرب واحد لكل طالبين. انطلق فوق البحيرة في أفضل الظروف.',
    },
    features: [
      { icon: 'bungalow', text: PRIVATE_BUNGALOW },
      { icon: 'nights', text: NIGHTS },
      { icon: 'board', text: FULL_BOARD },
    ],
    tiers: [
      { name: CHILL, price: '882€', lines: [ONE_SESSION, TEN_HOURS] },
      { name: INTENSE, price: '1,240€', lines: [TWO_SESSIONS, TWENTY_HOURS] },
    ],
    perks: [PERK_LODGING, PERK_PRIVATE, PERK_GEAR_INCLUDED],
  },
  {
    id: 'wingfoil-duo',
    category: 'wingfoil',
    image: '/Packs/wingfoil-duo.jpeg',
    badge: DUO_BADGE,
    title: 'Wingfoil Duo',
    desc: {
      fr: 'Réservez à deux et économisez. Bungalow partagé, pension complète et moniteur dédié pour une progression optimale en duo.',
      en: 'Book as a pair and save. Shared bungalow, full board and a dedicated instructor for optimal progress together.',
      es: 'Reserva en pareja y ahorra. Bungalow compartido, pensión completa y monitor dedicado para una progresión óptima en dúo.',
      ar: 'احجز لشخصين ووفّر. بنغالو مشترك وإقامة كاملة ومدرب مخصص لتقدم مثالي معاً.',
    },
    features: [
      { icon: 'bungalow', text: PRIVATE_BUNGALOW },
      { icon: 'nights', text: NIGHTS },
      { icon: 'board', text: FULL_BOARD },
    ],
    tiers: [
      { name: CHILL, price: '1,380€', perPerson: '690€', lines: [ONE_SESSION, TEN_HOURS] },
      { name: INTENSE, price: '2,100€', perPerson: '1,050€', lines: [TWO_SESSIONS, TWENTY_HOURS] },
    ],
    perks: [PERK_LODGING, PERK_SEMI, PERK_GEAR_X2],
  },
]

export const PACKAGES_COPY = {
  eyebrow: {
    fr: 'Offres Limitées',
    en: 'Limited Offers',
    es: 'Ofertas Limitadas',
    ar: 'عروض محدودة',
  } as LocalizedText,
  title: {
    fr: 'Packages de Séjour Exclusifs',
    en: 'Exclusive Stay Packages',
    es: 'Paquetes de Estancia Exclusivos',
    ar: 'باقات إقامة حصرية',
  } as LocalizedText,
  book: {
    fr: 'Réserver',
    en: 'Book now',
    es: 'Reservar',
    ar: 'احجز',
  } as LocalizedText,
  perPerson: {
    fr: '/pers',
    en: '/person',
    es: '/pers',
    ar: '/للفرد',
  } as LocalizedText,
}
