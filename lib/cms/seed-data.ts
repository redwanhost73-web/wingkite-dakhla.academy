import { DEFAULT_IMAGES, DEFAULT_PRICING, IMAGE_LABELS, type SiteImages } from '@/lib/site-config'
import { MEDIA_PACK } from '@/lib/media-pack'
import {
  seedActivityMediaRows,
  seedActivityRows,
  seedStayPackageRows,
} from '@/lib/cms/content-lists'

const PAGE_FOR_KEY: Record<keyof SiteImages, string> = {
  homeHero: 'home',
  homeWing1: 'home',
  homeWing2: 'home',
  homeKite1: 'home',
  homeAction: 'home',
  homeSunset: 'home',
  homeCoach: 'home',
  homeLagoon: 'home',
  aboutHero: 'about',
  aboutStory: 'about',
  aboutTeam: 'about',
  aboutLocation: 'about',
  aboutAction1: 'about',
  aboutAction2: 'about',
  aboutSunset: 'about',
  contactHero: 'contact',
  pricingHero: 'pricing',
  pricingAction: 'pricing',
}

/** Payload used by /api/admin/seed — mirrors live site defaults. */
export function buildSeedPayload() {
  const images = (Object.keys(DEFAULT_IMAGES) as (keyof SiteImages)[]).map((key) => ({
    key,
    url: DEFAULT_IMAGES[key],
    label: IMAGE_LABELS[key] || key,
    page: PAGE_FOR_KEY[key] || 'home',
    alt_fr: '',
    alt_en: '',
    alt_es: '',
    alt_ar: '',
  }))

  const pricing = DEFAULT_PRICING.map((row, i) => ({
    id: `row_${row.hours.replace('+', 'extra_')}`,
    hours: row.hours,
    semi_eur: row.semiEur,
    semi_mad: row.semiMad,
    priv_eur: row.privEur,
    priv_mad: row.privMad,
    is_extra: Boolean(row.extra),
    sort_order: i + 1,
  }))

  const mediaPack = {
    id: 'default',
    price_eur: MEDIA_PACK.priceEur,
    title_fr: MEDIA_PACK.title.fr,
    title_en: MEDIA_PACK.title.en,
    title_es: MEDIA_PACK.title.es,
    title_ar: MEDIA_PACK.title.ar,
    short_fr: MEDIA_PACK.short.fr,
    short_en: MEDIA_PACK.short.en,
    short_es: MEDIA_PACK.short.es,
    short_ar: MEDIA_PACK.short.ar,
    desc_fr: MEDIA_PACK.desc.fr,
    desc_en: MEDIA_PACK.desc.en,
    desc_es: MEDIA_PACK.desc.es,
    desc_ar: MEDIA_PACK.desc.ar,
    cta_fr: MEDIA_PACK.cta.fr,
    cta_en: MEDIA_PACK.cta.en,
    cta_es: MEDIA_PACK.cta.es,
    cta_ar: MEDIA_PACK.cta.ar,
    available_on_fr: MEDIA_PACK.availableOn.fr,
    available_on_en: MEDIA_PACK.availableOn.en,
    available_on_es: MEDIA_PACK.availableOn.es,
    available_on_ar: MEDIA_PACK.availableOn.ar,
  }

  const mediaPackFeatures = MEDIA_PACK.features.map((f, i) => ({
    pack_id: 'default',
    text_fr: f.fr,
    text_en: f.en,
    text_es: f.es,
    text_ar: f.ar,
    sort_order: i + 1,
  }))

  const whyChoose = [
    {
      id: 'transfer',
      icon: 'Car',
      title_fr: 'Transfert aller et retour',
      title_en: 'Round-trip transfer',
      title_es: 'Traslado de ida y vuelta',
      title_ar: 'نقل ذهاب وإياب',
      desc_fr: 'Prise en charge confortable vers le spot et retour.',
      desc_en: 'Comfortable pickup to the spot and back.',
      desc_es: 'Recogida cómoda hacia el spot y vuelta.',
      desc_ar: 'توصيل مريح إلى الموقع والعودة.',
      sort_order: 1,
      published: true,
    },
    {
      id: 'helmets',
      icon: 'HardHat',
      title_fr: 'Casques radio',
      title_en: 'Radio helmets',
      title_es: 'Cascos con radio',
      title_ar: 'خوذات راديو',
      desc_fr: 'Coaching en temps réel avec casque et walkie-talkie.',
      desc_en: 'Real-time coaching with helmet and walkie-talkie.',
      desc_es: 'Coaching en tiempo real con casco y walkie-talkie.',
      desc_ar: 'تدريب فوري بخوذة وجهاز لاسلكي.',
      sort_order: 2,
      published: true,
    },
    {
      id: 'iko',
      icon: 'BadgeCheck',
      title_fr: 'Moniteurs certifiés IKO',
      title_en: 'IKO-certified instructors',
      title_es: 'Monitores certificados IKO',
      title_ar: 'مدربون معتمدون IKO',
      desc_fr: 'Une équipe qualifiée pour progresser en toute confiance.',
      desc_en: 'A qualified team so you progress with confidence.',
      desc_es: 'Un equipo cualificado para progresar con confianza.',
      desc_ar: 'فريق مؤهل لتتقدم بثقة.',
      sort_order: 3,
      published: true,
    },
    {
      id: 'boat',
      icon: 'Ship',
      title_fr: 'Bateau de sécurité',
      title_en: 'Safety boat',
      title_es: 'Barco de seguridad',
      title_ar: 'قارب الأمان',
      desc_fr: "Assistance rapide sur l'eau pendant vos sessions.",
      desc_en: 'Fast on-water assistance during your sessions.',
      desc_es: 'Asistencia rápida en el agua durante tus sesiones.',
      desc_ar: 'مساعدة سريعة على الماء أثناء جلساتك.',
      sort_order: 4,
      published: true,
    },
    {
      id: 'gear',
      icon: 'Award',
      title_fr: 'Matériel haut de gamme',
      title_en: 'Premium equipment',
      title_es: 'Material de alta gama',
      title_ar: 'معدات فاخرة',
      desc_fr: 'Wings, kites et planches récents et bien entretenus.',
      desc_en: 'Recent, well-maintained wings, kites and boards.',
      desc_es: 'Wings, kites y tablas recientes y bien mantenidos.',
      desc_ar: 'أجنحة وكايت وألواح حديثة ومعتنى بها.',
      sort_order: 5,
      published: true,
    },
    {
      id: 'spot',
      icon: 'Waves',
      title_fr: 'Spot facile et eau plate',
      title_en: 'Easy spot & flat water',
      title_es: 'Spot fácil y agua plana',
      title_ar: 'موقع سهل وماء مسطح',
      desc_fr: 'Lagon idéal pour débuter et monter en niveau.',
      desc_en: 'Ideal lagoon for beginners and progressing riders.',
      desc_es: 'Laguna ideal para empezar y subir de nivel.',
      desc_ar: 'بحيرة مثالية للمبتدئين وتطوير المستوى.',
      sort_order: 6,
      published: true,
    },
  ]

  const extras = [
    {
      key: 'own_gear',
      title_fr: 'Si vous utilisez votre équipement',
      title_en: 'If you use your own gear',
      title_es: 'Si usas tu propio equipo',
      title_ar: 'إذا كنت تستخدم معداتك الخاصة',
      desc_fr: 'Réduction de 15% sur tous les cours',
      desc_en: '15% discount on all courses',
      desc_es: '15% descuento en todos los cursos',
      desc_ar: 'خصم 15% على جميع الدروس',
      badge: '-15%',
      icon: 'Backpack',
      sort_order: 1,
      published: true,
    },
    {
      key: 'freestyle',
      title_fr: 'Coaching Freestyle',
      title_en: 'Freestyle Coaching',
      title_es: 'Coaching Freestyle',
      title_ar: 'Freestyle Coaching',
      desc_fr: 'Session de coaching avancé',
      desc_en: 'Advanced coaching session',
      desc_es: 'Sesión de coaching avanzado',
      desc_ar: 'جلسة تدريب متقدمة',
      badge: '€120',
      icon: 'Waves',
      sort_order: 2,
      published: true,
    },
    {
      key: 'downwind',
      title_fr: 'Down wind',
      title_en: 'Down wind',
      title_es: 'Down wind',
      title_ar: 'Down wind',
      desc_fr: 'Devis sur mesure selon votre niveau',
      desc_en: 'Custom quote by level',
      desc_es: 'Presupuesto personalizado',
      desc_ar: 'عرض سعر مخصص حسب مستواك',
      badge: 'Devis',
      icon: 'Wind',
      sort_order: 3,
      published: true,
    },
  ]

  const inclusions = [
    {
      text_fr: 'Kite ou wing, planche, combinaison, gilet de sécurité, casque et walkie-talkie.',
      text_en: 'Kite or wing, board, wetsuit, safety vest, helmet and walkie-talkie.',
      text_es: 'Kite o wing, tabla, traje de neopreno, chaleco de seguridad, casco y walkie-talkie.',
      text_ar: 'كايت أو وينج، لوح، بدلة غوص، سترة نجاة، خوذة وجهاز لاسلكي.',
      sort_order: 1,
    },
    {
      text_fr: 'Tarifs variables selon les saisons.',
      text_en: 'Prices vary by season.',
      text_es: 'Precios variables según temporada.',
      text_ar: 'الأسعار متغيرة حسب المواسم.',
      sort_order: 2,
    },
    {
      text_fr: 'Contactez-nous pour les packages groupes et séjours.',
      text_en: 'Contact us for group packages and stays.',
      text_es: 'Contáctenos para paquetes grupales y estancias.',
      text_ar: 'تواصل معنا للباقات الجماعية والإقامات.',
      sort_order: 3,
    },
  ]

  const texts = [
    {
      key: 'home.activities.coaching.desc',
      section: 'home',
      label: 'Home — Coaching description',
      value_fr:
        "L'école propose également des coachings avancés pour les pratiquants souhaitant se perfectionner. Un suivi personnalisé est assuré directement avec un instructeur en Wingfoil et en kitesurf sur l'eau pour progresser plus vite.",
      value_en:
        'The school also offers advanced coaching for practitioners looking to improve. Personalized follow-up is provided directly with a Wingfoil and kitesurf instructor on the water to progress faster.',
      value_es:
        'La escuela también ofrece coaching avanzado para practicantes que desean mejorar. Se proporciona un seguimiento personalizado directamente con un instructor de Wingfoil y kitesurf en el agua para progresar más rápido.',
      value_ar:
        'تقدم المدرسة أيضاً تدريباً متقدماً للممارسين الذين يرغبون في التحسن. يتم توفير متابعة شخصية مباشرة مع مدرب وينج فويل وكايت سيرف على الماء للتقدم بشكل أسرع.',
    },
  ]

  const activities = seedActivityRows()
  const activityMedia = seedActivityMediaRows()
  const stayPackages = seedStayPackageRows()

  return {
    images,
    pricing,
    mediaPack,
    mediaPackFeatures,
    whyChoose,
    extras,
    inclusions,
    texts,
    activities,
    activityMedia,
    stayPackages,
  }
}
