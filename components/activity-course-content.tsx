'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  LifeBuoy,
  Radio,
  Shield,
  Ship,
  Wind,
  Sailboat,
} from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'
import { useSiteConfig } from '@/hooks/use-site-config'
import { DEFAULT_IMAGES } from '@/lib/site-config'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { CoursePricingTable } from '@/components/course-pricing-table'
import {
  EditableImage,
  EditableLink,
  EditableText,
  useEditableImageSrc,
} from '@/components/edit-mode/editable'
import type { Localized } from '@/lib/cms/types'
import { cn } from '@/lib/utils'

const loc = (fr: string, en: string, es: string, ar: string): Localized => ({ fr, en, es, ar })

export type ActivitySport = 'wingfoil' | 'kitesurf'

type Level = 'beginner' | 'intermediate'

const SPORT_META: Record<
  ActivitySport,
  {
    Icon: typeof Wind
    label: string
    heroKey: 'homeWing1' | 'homeKite1'
    panelImageKey: 'homeWing1' | 'homeKite1'
    other: ActivitySport
    gearDefaults: Localized
    heroEyebrow: Localized
    heroTitle: Localized
    heroSubtitle: Localized
    introTitle: Localized
    introBody: Localized[]
    whyTitle: Localized
    whyItems: { title: Localized; desc: Localized }[]
    beginner: { title: Localized; desc: Localized; learn: Localized[] }
    intermediate: { title: Localized; desc: Localized; learn: Localized[] }
  }
> = {
  wingfoil: {
    Icon: Wind,
    label: 'Wingfoil',
    heroKey: 'homeWing1',
    panelImageKey: 'homeWing1',
    other: 'kitesurf',
    gearDefaults: loc(
      'Aile · Planche · Foil · Combi · Sécu',
      'Wing · Board · Foil · Wetsuit · Safety',
      'Ala · Tabla · Foil · Traje · Seguridad',
      'جناح · لوح · فويل · بدلة · أمان',
    ),
    heroEyebrow: loc('Cours de Wingfoil', 'Wingfoil lessons', 'Clases de Wingfoil', 'دروس الوينج فويل'),
    heroTitle: loc('Wingfoil', 'Wingfoil', 'Wingfoil', 'وينج فويل'),
    heroSubtitle: loc(
      'Glissez au-dessus du lagon turquoise, soulevé par un hydrofoil. Du premier waterstart aux premières envolées.',
      'Glide above the turquoise lagoon on a hydrofoil — from your first waterstart to early flights.',
      'Deslízate sobre la laguna turquesa con un hydrofoil, desde el primer waterstart hasta los primeros vuelos.',
      'انزلق فوق البحيرة التركوازية على الهيدروفويل — من أول انطلاقة مائية إلى أولى الطلعات.',
    ),
    introTitle: loc(
      'Volez au-dessus de l’eau',
      'Fly above the water',
      'Vuela sobre el agua',
      'حلّق فوق الماء',
    ),
    introBody: [
      loc(
        'Le wingfoil est la sensation du moment : porté par une wing gonflable et soulevé par un foil, vous glissez littéralement au-dessus de l’eau du lagon de Dakhla.',
        'Wingfoil is the feeling of the moment: carried by an inflatable wing and lifted by a foil, you literally glide above Dakhla lagoon.',
        'El wingfoil es la sensación del momento: con un ala inflable y un foil, deslizas literalmente sobre la laguna de Dakhla.',
        'الوينج فويل إحساس اللحظة: بجناح قابل للنفخ وفويل، تنزلق حرفياً فوق بحيرة الداخلة.',
      ),
      loc(
        'Nos instructeurs spécialisés vous guident pas à pas. Matériel récent, vent régulier et eau plate : la progression est rapide et les sensations uniques.',
        'Specialist coaches guide you step by step. Fresh gear, steady wind and flat water — progress is fast and the feeling is unique.',
        'Instructores especializados te guían paso a paso. Material reciente, viento regular y agua plana: progresas rápido con sensaciones únicas.',
        'مدربون متخصصون يرشدونك خطوة بخطوة. معدات حديثة وريح منتظمة وماء مسطح — تقدم سريع وإحساس فريد.',
      ),
    ],
    whyTitle: loc(
      'Pourquoi le wingfoil chez nous',
      'Why wingfoil with us',
      'Por qué wingfoil con nosotros',
      'لماذا الوينج فويل معنا',
    ),
    whyItems: [
      {
        title: loc('Instructeurs spécialisés', 'Specialist coaches', 'Instructores especializados', 'مدربون متخصصون'),
        desc: loc(
          'Encadrement adapté au wingfoil, du débutant au rider confirmé.',
          'Coaching tailored to wingfoil, from beginner to confident rider.',
          'Entrenamiento adaptado al wingfoil, de principiante a rider seguro.',
          'تدريب مخصص للوينج فويل من المبتدئ إلى الراكب الواثق.',
        ),
      },
      {
        title: loc('Matériel dernière génération', 'Latest-gen gear', 'Material de última generación', 'معدات حديثة'),
        desc: loc(
          'Wings, planches et foils entretenus et adaptés à votre niveau.',
          'Wings, boards and foils maintained and matched to your level.',
          'Alas, tablas y foils mantenidos y adaptados a tu nivel.',
          'أجنحة وألواح وفويلات معتنى بها ومكيفة لمستواك.',
        ),
      },
      {
        title: loc('Lagon d’eau plate', 'Flat-water lagoon', 'Laguna de agua plana', 'بحيرة ماء مسطح'),
        desc: loc(
          'Conditions idéales pour décoller en douceur et progresser vite.',
          'Ideal conditions to lift off gently and progress fast.',
          'Condiciones ideales para despegar con suavidad y progresar rápido.',
          'ظروف مثالية للإقلاع بسلاسة والتقدم بسرعة.',
        ),
      },
    ],
    beginner: {
      title: loc('Cours Débutant', 'Beginner course', 'Curso principiante', 'دورة المبتدئين'),
      desc: loc(
        'Apprenez les bases : setup, contrôle de l’aile sur la plage, puis waterstart et premiers mètres en foil.',
        'Learn the basics: setup, wing control on the beach, then waterstart and your first meters on foil.',
        'Aprende lo básico: montaje, control del ala en la playa, waterstart y primeros metros en foil.',
        'تعلّم الأساسيات: التجهيز، التحكم بالجناح على الشاطئ، ثم الانطلاقة المائية وأولى الأمتار على الفويل.',
      ),
      learn: [
        loc('Préparation et sécurité du matériel', 'Gear setup & safety', 'Preparación y seguridad del material', 'تجهيز المعدات والأمان'),
        loc('Pilotage de l’aile à terre', 'Wing handling on land', 'Manejo del ala en tierra', 'التحكم بالجناح على البر'),
        loc('Waterstart et premiers vols', 'Waterstart & first flights', 'Waterstart y primeros vuelos', 'الانطلاقة المائية وأولى الطلعات'),
      ],
    },
    intermediate: {
      title: loc('Cours Intermédiaire', 'Intermediate course', 'Curso intermedio', 'دورة متوسطة'),
      desc: loc(
        'Affinez votre technique : transitions, upwind, contrôle du foil et sessions plus longues dans le lagon.',
        'Refine your technique: transitions, upwind, foil control and longer lagoon sessions.',
        'Afina tu técnica: transiciones, ceñida, control del foil y sesiones más largas en la laguna.',
        'طوّر تقنيتك: الانتقالات، الإبحار ضد الريح، التحكم بالفويل وجلسات أطول في البحيرة.',
      ),
      learn: [
        loc('Transitions et jibes', 'Transitions & jibes', 'Transiciones y jibes', 'الانتقالات والجييب'),
        loc('Remonter au vent', 'Riding upwind', 'Ceñir al viento', 'الإبحار ضد الريح'),
        loc('Contrôle du foil et trajectoires', 'Foil control & lines', 'Control del foil y trayectorias', 'التحكم بالفويل والمسارات'),
      ],
    },
  },
  kitesurf: {
    Icon: Sailboat,
    label: 'Kitesurf',
    heroKey: 'homeKite1',
    panelImageKey: 'homeKite1',
    other: 'wingfoil',
    gearDefaults: loc(
      'Aile · Planche · Harnais · Combi · Sécu',
      'Kite · Board · Harness · Wetsuit · Safety',
      'Cometa · Tabla · Arnés · Traje · Seguridad',
      'كايت · لوح · حزام · بدلة · أمان',
    ),
    heroEyebrow: loc('Cours de Kitesurf', 'Kitesurf lessons', 'Clases de Kitesurf', 'دروس الكايت سيرف'),
    heroTitle: loc('Kitesurf', 'Kitesurf', 'Kitesurf', 'كايت سيرف'),
    heroSubtitle: loc(
      'Domptez les alizés de Dakhla sur un lagon d’eau plate — du débutant au rider confirmé.',
      'Master Dakhla’s trade winds on flat lagoon water — from beginner to confident rider.',
      'Domina los alisios de Dakhla en agua plana — de principiante a rider seguro.',
      'سيطر على رياح الداخلة على ماء البحيرة المسطح — من المبتدئ إلى الراكب الواثق.',
    ),
    introTitle: loc(
      'Ressentez l’adrénaline, domptez le vent',
      'Feel the adrenaline, master the wind',
      'Siente la adrenalina, domina el viento',
      'اشعر بالأدرينالين وسيطر على الريح',
    ),
    introBody: [
      loc(
        'Grâce aux alizés réguliers et au lagon d’eau plate, Dakhla est l’un des meilleurs spots kite au monde pour apprendre et progresser.',
        'With steady trade winds and flat lagoon water, Dakhla is one of the world’s best kite spots to learn and progress.',
        'Con alisios regulares y agua plana, Dakhla es uno de los mejores spots de kite del mundo para aprender y progresar.',
        'بفضل الرياح المنتظمة والماء المسطح، الداخلة من أفضل مواقع الكايت في العالم للتعلم والتقدم.',
      ),
      loc(
        'Nos moniteurs certifiés IKO adaptent chaque session à votre niveau : cours privés ou semi-privés, progression garantie.',
        'IKO-certified coaches adapt every session to your level — private or semi-private, with guaranteed progression.',
        'Monitores certificados IKO adaptan cada sesión a tu nivel: privado o semi-privado, con progresión garantizada.',
        'مدربون معتمدون IKO يكيّفون كل جلسة لمستواك: خاص أو شبه خاص مع تقدم مضمون.',
      ),
    ],
    whyTitle: loc(
      'Pourquoi notre école de kite',
      'Why our kite school',
      'Por qué nuestra escuela de kite',
      'لماذا مدرسة الكايت لدينا',
    ),
    whyItems: [
      {
        title: loc('Moniteurs certifiés IKO', 'IKO-certified instructors', 'Monitores certificados IKO', 'مدربون معتمدون IKO'),
        desc: loc(
          'Encadrement FR / EN, standards internationaux.',
          'FR / EN coaching, international standards.',
          'Entrenamiento FR / EN, estándares internacionales.',
          'تدريب بالفرنسية والإنجليزية وفق معايير دولية.',
        ),
      },
      {
        title: loc('Bateau de sécurité', 'Safety boat', 'Barco de seguridad', 'قارب الأمان'),
        desc: loc(
          'Assistance sur l’eau pour une pratique sereine.',
          'On-water assistance for peace of mind.',
          'Asistencia en el agua para practicar con tranquilidad.',
          'مساعدة على الماء لممارسة مطمئنة.',
        ),
      },
      {
        title: loc('Casques radio', 'Radio helmets', 'Cascos con radio', 'خوذات لاسلكية'),
        desc: loc(
          'Coaching en temps réel pendant vos sessions.',
          'Real-time coaching during your sessions.',
          'Coaching en tiempo real durante tus sesiones.',
          'تدريب فوري أثناء جلساتك.',
        ),
      },
    ],
    beginner: {
      title: loc('Cours Débutant', 'Beginner course', 'Curso principiante', 'دورة المبتدئين'),
      desc: loc(
        'Apprenez tout de zéro : préparer le matériel, piloter l’aile sur la plage, puis la contrôler dans l’eau avec la nage tractée.',
        'Learn from scratch: set up the gear, fly the kite on the beach, then control it in the water with body dragging.',
        'Aprende desde cero: preparar el material, pilotar el ala en la playa y controlarla en el agua con el body drag.',
        'تعلّم من الصفر: تجهيز المعدات، قيادة الجناح على الشاطئ، ثم التحكم به في الماء مع السحب بالجسم.',
      ),
      learn: [
        loc('Setup et sécurité kite', 'Kite setup & safety', 'Montaje y seguridad del kite', 'تجهيز الكايت والأمان'),
        loc('Pilotage à terre', 'Land flying', 'Piloto en tierra', 'الطيران على البر'),
        loc('Nage tractée et waterstart', 'Body drag & waterstart', 'Body drag y waterstart', 'السحب بالجسم والانطلاقة المائية'),
      ],
    },
    intermediate: {
      title: loc('Cours Intermédiaire', 'Intermediate course', 'Curso intermedio', 'دورة متوسطة'),
      desc: loc(
        'Perfectionnez rides, transitions et remonter au vent. Objectifs sur mesure pour riders déjà autonomes.',
        'Refine rides, transitions and upwind. Tailored goals for riders who already ride independently.',
        'Perfecciona rides, transiciones y ceñida. Objetivos a medida para riders ya autónomos.',
        'طوّر الركوب والانتقالات والإبحار ضد الريح. أهداف مخصصة للراكبين المستقلين.',
      ),
      learn: [
        loc('Transitions et jibes', 'Transitions & jibes', 'Transiciones y jibes', 'الانتقالات والجييب'),
        loc('Remonter au vent', 'Riding upwind', 'Ceñir al viento', 'الإبحار ضد الريح'),
        loc('Contrôle en conditions variables', 'Control in changing conditions', 'Control en condiciones variables', 'التحكم في ظروف متغيرة'),
      ],
    },
  },
}

const SAFETY_HIGHLIGHTS = [
  {
    Icon: BadgeCheck,
    title: loc('Moniteurs IKO', 'IKO instructors', 'Monitores IKO', 'مدربون IKO'),
  },
  {
    Icon: Ship,
    title: loc('Bateau de sécurité', 'Safety boat', 'Barco de seguridad', 'قارب الأمان'),
  },
  {
    Icon: Radio,
    title: loc('Casques radio', 'Radio helmets', 'Cascos radio', 'خوذات لاسلكية'),
  },
  {
    Icon: LifeBuoy,
    title: loc('Équipement inclus', 'Gear included', 'Material incluido', 'معدات مشمولة'),
  },
]

export function ActivityCourseContent({ sport }: { sport: ActivitySport }) {
  const { locale } = useTranslations()
  const { images, texts } = useSiteConfig()
  const meta = SPORT_META[sport]
  const [level, setLevel] = useState<Level>('beginner')
  const course = level === 'beginner' ? meta.beginner : meta.intermediate

  const heroFallback =
    sport === 'wingfoil'
      ? images.homeWing1 || DEFAULT_IMAGES.homeWing1
      : images.homeKite1 || DEFAULT_IMAGES.homeKite1
  const panelSrc = useEditableImageSrc(meta.panelImageKey, heroFallback)

  const otherHref = `/${locale}/activities/${meta.other}`
  const rentalHref = `/${locale}/activities/equipment-rental`
  const safetyHref = `/${locale}/safety`
  const pricingHref = `/${locale}/pricing`
  const contactHref = `/${locale}/contact`

  const getText = (fr: string, en: string, es: string, ar: string) => {
    if (locale === 'fr') return fr
    if (locale === 'es') return es
    if (locale === 'ar') return ar
    return en
  }

  return (
    <>
      <PageHero
        image={heroFallback}
        imageKey={meta.heroKey}
        eyebrow={
          <EditableText
            fieldKey={`activities.${sport}.hero.eyebrow`}
            label={`${meta.label} hero eyebrow`}
            defaults={meta.heroEyebrow}
            cms={texts[`activities.${sport}.hero.eyebrow`]}
          />
        }
        title={
          <EditableText
            fieldKey={`activities.${sport}.hero.title`}
            label={`${meta.label} hero title`}
            defaults={meta.heroTitle}
            cms={texts[`activities.${sport}.hero.title`]}
          />
        }
        subtitle={
          <EditableText
            fieldKey={`activities.${sport}.hero.subtitle`}
            label={`${meta.label} hero subtitle`}
            defaults={meta.heroSubtitle}
            cms={texts[`activities.${sport}.hero.subtitle`]}
          />
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <EditableLink
            fieldKey={`activities.${sport}.hero.cta`}
            label={`${meta.label} hero CTA`}
            href={contactHref}
            className="btn-pill bg-white text-[#072A5A] hover:bg-white/90"
            defaults={loc(
              'Réserver un cours',
              'Book a lesson',
              'Reservar una clase',
              'احجز درساً',
            )}
            cms={texts[`activities.${sport}.hero.cta`]}
            after={<ArrowRight className="h-4 w-4" />}
          />
          <Link
            href={pricingHref}
            className="btn-pill border border-white/35 bg-white/10 text-white backdrop-blur-md hover:bg-white/18"
          >
            {getText('Voir les tarifs', 'See rates', 'Ver tarifas', 'عرض الأسعار')}
          </Link>
        </div>
      </PageHero>

      {/* Intro */}
      <section className="section-y bg-[#FAF8F3]" data-nav-theme="light">
        <div className="container-editorial">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow text-[#0046A4]">
                  {getText('À propos', 'About', 'Sobre', 'حول')}
                </p>
                <EditableText
                  fieldKey={`activities.${sport}.intro.title`}
                  label={`${meta.label} intro title`}
                  as="h2"
                  className="font-heading text-section text-[#072A5A] mt-4 text-balance"
                  defaults={meta.introTitle}
                  cms={texts[`activities.${sport}.intro.title`]}
                />
              </Reveal>
            </div>
            <div className="lg:col-span-7 space-y-5">
              {meta.introBody.map((body, i) => (
                <Reveal key={i} delay={80 + i * 60}>
                  <EditableText
                    fieldKey={`activities.${sport}.intro.body${i + 1}`}
                    label={`${meta.label} intro body ${i + 1}`}
                    as="p"
                    className="text-body-lg text-[#3D4F6F]"
                    defaults={body}
                    cms={texts[`activities.${sport}.intro.body${i + 1}`]}
                  />
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={120}>
            <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {meta.whyItems.map((item, i) => (
                <div
                  key={i}
                  className="rounded-[22px] border border-[#072A5A]/8 bg-white/70 p-6 shadow-[0_12px_40px_rgba(0,70,164,0.06)]"
                >
                  <EditableText
                    fieldKey={`activities.${sport}.why.${i}.title`}
                    label={`${meta.label} why ${i} title`}
                    as="h3"
                    className="font-heading text-base font-bold text-[#072A5A]"
                    defaults={item.title}
                    cms={texts[`activities.${sport}.why.${i}.title`]}
                  />
                  <EditableText
                    fieldKey={`activities.${sport}.why.${i}.desc`}
                    label={`${meta.label} why ${i} desc`}
                    as="p"
                    className="text-small text-[#3D4F6F] mt-2"
                    defaults={item.desc}
                    cms={texts[`activities.${sport}.why.${i}.desc`]}
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Courses + prices */}
      <section className="section-y relative overflow-hidden bg-white" data-nav-theme="light">
        <span aria-hidden className="blob -top-32 right-0 h-96 w-96 bg-[#5AA8FF]/12" />
        <div className="container-editorial relative">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-[#0046A4]">
                {getText('Cours à la carte', 'À la carte lessons', 'Clases a la carta', 'دروس حسب الطلب')}
              </p>
              <h2 className="font-heading text-section text-[#072A5A] mt-4 text-balance">
                {getText(
                  'Des cours adaptés à votre niveau',
                  'Lessons matched to your level',
                  'Clases adaptadas a tu nivel',
                  'دروس مكيفة لمستواك',
                )}
              </h2>
              <p className="text-body-lg text-[#3D4F6F] mt-5">
                {getText(
                  'Matériel inclus. Choisissez débutant ou intermédiaire, puis consultez la grille Privé / Semi-privé.',
                  'Gear included. Pick beginner or intermediate, then see Private / Semi-private rates.',
                  'Material incluido. Elige principiante o intermedio y consulta Privado / Semi-privado.',
                  'المعدات مشمولة. اختر مبتدئ أو متوسط ثم اطّلع على الأسعار الخاصة / شبه الخاصة.',
                )}
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div
              role="tablist"
              aria-label={getText('Niveau', 'Level', 'Nivel', 'المستوى')}
              className="mt-10 flex justify-center"
            >
              <div className="inline-flex gap-2 rounded-full border border-[#072A5A]/8 bg-[#FAF8F3] p-1.5 shadow-[0_10px_30px_rgba(0,70,164,0.06)]">
                {(
                  [
                    { id: 'beginner' as const, label: meta.beginner.title },
                    { id: 'intermediate' as const, label: meta.intermediate.title },
                  ] as const
                ).map((tab) => {
                  const selected = level === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setLevel(tab.id)}
                      className={cn(
                        'rounded-full px-5 py-2.5 text-small font-bold transition-all duration-450 sm:px-6',
                        selected
                          ? 'bg-[#0B1F3B] text-white shadow-[0_10px_30px_rgba(11,31,59,0.25)]'
                          : 'text-[#3D4F6F] hover:bg-black/4 hover:text-[#072A5A]',
                      )}
                    >
                      <EditableText
                        fieldKey={`activities.${sport}.${tab.id}.tab`}
                        label={`${meta.label} ${tab.id} tab`}
                        defaults={tab.label}
                        cms={texts[`activities.${sport}.${tab.id}.tab`]}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-10 overflow-hidden rounded-[28px] border border-[#072A5A]/6 bg-[#FAF8F3] shadow-[0_25px_60px_rgba(0,70,164,0.08)]">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="relative min-h-72 lg:min-h-full">
                  <EditableImage
                    fieldKey={meta.panelImageKey}
                    src={panelSrc}
                    label={`${meta.label} course panel`}
                    className="absolute inset-0"
                  >
                    <Image
                      src={panelSrc}
                      alt={meta.label}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      loading="lazy"
                      quality={75}
                      className="object-cover"
                    />
                  </EditableImage>
                  <div
                    aria-hidden
                    className="absolute inset-0 lg:hidden"
                    style={{ background: 'linear-gradient(to top, #FAF8F3 0%, transparent 40%)' }}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 lg:block"
                    style={{ background: 'linear-gradient(to right, transparent, #FAF8F3)' }}
                  />
                </div>

                <div className="relative flex flex-col px-5 py-7 sm:px-9 sm:py-10 lg:ps-4 lg:pe-10">
                  <div className="mb-5 flex flex-col gap-2 border-b border-[#072A5A]/8 pb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
                    <p className="eyebrow text-[#7A8AA3]">
                      {level === 'beginner'
                        ? getText('Niveau I', 'Level I', 'Nivel I', 'المستوى I')
                        : getText('Niveau II', 'Level II', 'Nivel II', 'المستوى II')}
                    </p>
                    <EditableText
                      fieldKey={`pricing.${sport}.gear`}
                      label={`${meta.label} gear`}
                      as="p"
                      className="text-xs leading-relaxed text-[#7A8AA3] sm:text-[0.8125rem] sm:font-bold sm:uppercase sm:tracking-[0.18em] sm:leading-none"
                      defaults={meta.gearDefaults}
                      cms={texts[`pricing.${sport}.gear`]}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <EditableText
                      fieldKey={`activities.${sport}.${level}.title`}
                      label={`${meta.label} ${level} title`}
                      as="h3"
                      className="font-heading text-card-title text-[#072A5A]"
                      defaults={course.title}
                      cms={texts[`activities.${sport}.${level}.title`]}
                    />
                    <span className="eyebrow rounded-full bg-[#0B1F3B] px-3.5 py-1.5 text-[0.65rem] text-white">
                      {meta.label}
                    </span>
                  </div>

                  <EditableText
                    fieldKey={`activities.${sport}.${level}.desc`}
                    label={`${meta.label} ${level} desc`}
                    as="p"
                    className="text-small text-[#3D4F6F] mt-4 max-w-lg"
                    defaults={course.desc}
                    cms={texts[`activities.${sport}.${level}.desc`]}
                  />

                  <ul className="mt-5 space-y-2">
                    {course.learn.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-small text-[#3D4F6F]">
                        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#0046A4]" aria-hidden />
                        <EditableText
                          fieldKey={`activities.${sport}.${level}.learn${i + 1}`}
                          label={`${meta.label} ${level} learn ${i + 1}`}
                          defaults={item}
                          cms={texts[`activities.${sport}.${level}.learn${i + 1}`]}
                        />
                      </li>
                    ))}
                  </ul>

                  <CoursePricingTable idPrefix={`${sport}-${level}`} className="mt-8" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Safety strip */}
      <section className="section-y bg-[#0B1F3B] text-white" data-nav-theme="dark">
        <div className="container-editorial">
          <Reveal>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <p className="eyebrow text-[#C9A66B]">
                  {getText('Sécurité', 'Safety', 'Seguridad', 'الأمان')}
                </p>
                <h2 className="font-heading text-section text-white mt-4 text-balance">
                  {getText(
                    'Progresser en confiance',
                    'Progress with confidence',
                    'Progresa con confianza',
                    'تقدّم بثقة',
                  )}
                </h2>
              </div>
              <Link
                href={safetyHref}
                className="btn-pill-sm inline-flex items-center gap-2 border border-white/25 bg-white/10 text-white hover:bg-white/18"
              >
                {getText('Voir nos protocoles', 'See our protocols', 'Ver protocolos', 'عرض البروتوكولات')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {SAFETY_HIGHLIGHTS.map(({ Icon, title }, i) => (
              <Reveal key={i} delay={60 + i * 50}>
                <div className="rounded-[20px] border border-white/12 bg-white/6 p-5 backdrop-blur-sm">
                  <Icon className="h-5 w-5 text-[#C9A66B]" aria-hidden />
                  <EditableText
                    fieldKey={`activities.safety.highlight${i + 1}`}
                    label={`Safety highlight ${i + 1}`}
                    as="p"
                    className="mt-3 text-small font-bold text-white"
                    defaults={title}
                    cms={texts[`activities.safety.highlight${i + 1}`]}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cross links */}
      <section className="section-y bg-[#FAF8F3]" data-nav-theme="light">
        <div className="container-editorial">
          <Reveal>
            <p className="eyebrow text-[#0046A4]">
              {getText('Continuer', 'Explore more', 'Explorar más', 'استكشف المزيد')}
            </p>
            <h2 className="font-heading text-section text-[#072A5A] mt-4 max-w-xl text-balance">
              {getText(
                'Autres activités & tarifs',
                'More activities & rates',
                'Más actividades y tarifas',
                'المزيد من الأنشطة والأسعار',
              )}
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                href: otherHref,
                title:
                  meta.other === 'wingfoil'
                    ? loc('Cours Wingfoil', 'Wingfoil lessons', 'Clases Wingfoil', 'دروس وينج فويل')
                    : loc('Cours Kitesurf', 'Kitesurf lessons', 'Clases Kitesurf', 'دروس كايت سيرف'),
                desc: loc(
                  'Découvrir l’autre discipline',
                  'Discover the other sport',
                  'Descubre la otra disciplina',
                  'اكتشف الرياضة الأخرى',
                ),
              },
              {
                href: rentalHref,
                title: loc(
                  'Location de matériel',
                  'Equipment rental',
                  'Alquiler de material',
                  'تأجير المعدات',
                ),
                desc: loc(
                  'Sets complets à la demi-journée ou à la journée',
                  'Full sets half-day or full day',
                  'Sets completos media jornada o día',
                  'أطقم كاملة لنصف يوم أو يوم كامل',
                ),
              },
              {
                href: pricingHref,
                title: loc('Packages & tarifs', 'Packages & rates', 'Paquetes y tarifas', 'الباقات والأسعار'),
                desc: loc(
                  'Séjours, packs et Media pack',
                  'Stays, packs and Media pack',
                  'Estancias, packs y Media pack',
                  'الإقامات والباقات وMedia pack',
                ),
              },
            ].map((card, i) => (
              <Reveal key={card.href} delay={80 + i * 60}>
                <Link
                  href={card.href}
                  className="group flex h-full flex-col rounded-[24px] border border-[#072A5A]/8 bg-white p-7 shadow-[0_12px_40px_rgba(0,70,164,0.06)] transition-transform duration-450 hover:-translate-y-1"
                >
                  <EditableText
                    fieldKey={`activities.cross.${i}.title`}
                    label={`Cross link ${i} title`}
                    as="h3"
                    className="font-heading text-card-title text-[#072A5A]"
                    defaults={card.title}
                    cms={texts[`activities.cross.${i}.title`]}
                  />
                  <EditableText
                    fieldKey={`activities.cross.${i}.desc`}
                    label={`Cross link ${i} desc`}
                    as="p"
                    className="text-small text-[#3D4F6F] mt-2 flex-1"
                    defaults={card.desc}
                    cms={texts[`activities.cross.${i}.desc`]}
                  />
                  <span className="mt-5 inline-flex items-center gap-2 text-small font-bold text-[#0046A4]">
                    {getText('Découvrir', 'Explore', 'Descubrir', 'اكتشف')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
