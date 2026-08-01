export type LocalizedText = {
  fr: string
  en: string
  es: string
  ar: string
}

export type Activity = {
  id: string
  images: string[]
  badge: LocalizedText
  badgeTone: 'sand' | 'brand'
  title: LocalizedText
  desc: LocalizedText
  /** Bento grid span classes */
  className: string
  minHeight: string
  large?: boolean
}

export const ACTIVITIES: Activity[] = [
  {
    id: 'wingfoil',
    images: [
      '/Activities/wingfoil-1.jpeg',
      '/Activities/wingfoil-2.jpeg',
      '/Activities/wingfoil-3.jpeg',
      '/Activities/wingfoil-4.jpeg',
      '/Activities/wingfoil-5.jpeg',
      '/Activities/wingfoil-6.jpeg',
      '/Activities/wingfoil-7.jpeg',
      '/Activities/wingfoil-8.jpeg',
    ],
    badge: { fr: 'Wingfoil', en: 'Wingfoil', es: 'Wingfoil', ar: 'وينج فويل' },
    badgeTone: 'sand',
    title: {
      fr: 'Cours de Wingfoil',
      en: 'Wingfoil Lessons',
      es: 'Clases de Wingfoil',
      ar: 'دروس الوينج فويل',
    },
    desc: {
      fr: "Le wing foil est un sport de glisse accessible qui procure rapidement des sensations uniques. L'apprentissage se fait progressivement avec un encadrement adapté aux débutants. En quelques séances, on découvre le plaisir de voler au-dessus de l'eau.",
      en: 'Wing foil is an accessible gliding sport that quickly provides unique sensations. Learning is progressive with coaching adapted for beginners. In just a few sessions, you discover the joy of flying above the water.',
      es: 'El wing foil es un deporte de deslizamiento accesible que proporciona sensaciones únicas rápidamente. El aprendizaje es progresivo con entrenamiento adaptado para principiantes.',
      ar: 'وينج فويل رياضة انزلاق سهلة تمنحك أحاسيس فريدة بسرعة. التعلم تدريجي مع تدريب مكيف للمبتدئين.',
    },
    className: 'md:col-span-6 md:row-span-2',
    minHeight: 'min-h-140',
    large: true,
  },
  {
    id: 'kitesurf',
    images: ['/Activities/kitesurf-1.jpeg'],
    badge: { fr: 'Kitesurf', en: 'Kitesurf', es: 'Kitesurf', ar: 'كايت سيرف' },
    badgeTone: 'brand',
    title: {
      fr: 'Cours de Kitesurf',
      en: 'Kitesurf Lessons',
      es: 'Clases de Kitesurf',
      ar: 'دروس الكايت سيرف',
    },
    desc: {
      fr: "Le kitesurf est un sport de glisse fun et accessible. L'apprentissage se fait étape par étape avec un encadrement sécurisé, adapté aux différents niveaux.",
      en: 'Kitesurfing is a fun and accessible gliding sport. Learning happens step by step with safe coaching adapted to different levels.',
      es: 'El kitesurf es un deporte de deslizamiento divertido y accesible. El aprendizaje se realiza paso a paso con un entrenamiento seguro.',
      ar: 'الكايت سيرف رياضة انزلاق ممتعة وسهلة. التعلم يتم خطوة بخطوة مع تدريب آمن.',
    },
    className: 'md:col-span-6',
    minHeight: 'h-85',
  },
]
