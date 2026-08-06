import type { LocalizedText } from '@/lib/activities'

/** Shared copy for the €60 media pack add-on (photos / videos / editing). */
export const MEDIA_PACK = {
  priceEur: 60,
  priceLabel: '€60',
  title: {
    fr: 'Media pack',
    en: 'Media pack',
    es: 'Media pack',
    ar: 'Media pack',
  } as LocalizedText,
  short: {
    fr: 'Option · Media pack 60€',
    en: 'Option · Media pack €60',
    es: 'Opción · Media pack 60€',
    ar: 'خيار · Media pack 60€',
  } as LocalizedText,
  desc: {
    fr: 'Photos, vidéos et montage vidéo de votre session.',
    en: 'Photos, videos and video editing of your session.',
    es: 'Fotos, videos y montaje de video de tu sesión.',
    ar: 'صور وفيديوهات ومونتاج فيديو لجلستك.',
  } as LocalizedText,
  features: [
    {
      fr: 'Photos haute qualité pendant votre session',
      en: 'High-quality photos during your session',
      es: 'Fotos de alta calidad durante tu sesión',
      ar: 'صور عالية الجودة أثناء جلستك',
    },
    {
      fr: 'Vidéos de vos rides et progressions',
      en: 'Videos of your rides and progress',
      es: 'Videos de tus rides y progresión',
      ar: 'فيديوهات لركوبك وتقدمك',
    },
    {
      fr: 'Montage vidéo inclus',
      en: 'Video editing included',
      es: 'Montaje de video incluido',
      ar: 'مونتاج فيديو مشمول',
    },
  ] as LocalizedText[],
  cta: {
    fr: 'Réserver le Media pack',
    en: 'Book the Media pack',
    es: 'Reservar el Media pack',
    ar: 'احجز Media pack',
  } as LocalizedText,
  availableOn: {
    fr: 'Disponible avec tous les cours Wingfoil, Kitesurf et Coaching',
    en: 'Available with every Wingfoil, Kitesurf and Coaching course',
    es: 'Disponible con todos los cursos de Wingfoil, Kitesurf y Coaching',
    ar: 'متاح مع جميع دروس الوينج فويل والكايت سيرف والتدريب',
  } as LocalizedText,
}

export function mediaTr(text: LocalizedText, locale: string) {
  if (locale === 'fr') return text.fr
  if (locale === 'es') return text.es
  if (locale === 'ar') return text.ar
  return text.en
}
