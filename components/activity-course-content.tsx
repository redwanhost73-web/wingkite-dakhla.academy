'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Images } from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'
import { useSiteConfig } from '@/hooks/use-site-config'
import { ACTIVITIES } from '@/lib/activities'
import { activityImageFieldKey } from '@/lib/cms/content-lists'
import { DEFAULT_IMAGES } from '@/lib/site-config'
import { Reveal } from '@/components/reveal'
import { CoursePricingTable } from '@/components/course-pricing-table'
import { ActivityStoryProvider, useActivityStory } from '@/components/activity-story'
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
    label: string
    panelImageKey: 'homeWing1' | 'homeKite1'
    other: ActivitySport
    gearDefaults: Localized
    coverEyebrow: Localized
    coverTitle: Localized
    coverLead: Localized
    introTitle: Localized
    introBody: Localized
    why: Localized[]
    beginner: { title: Localized; desc: Localized }
    intermediate: { title: Localized; desc: Localized }
  }
> = {
  wingfoil: {
    label: 'Wingfoil',
    panelImageKey: 'homeWing1',
    other: 'kitesurf',
    gearDefaults: loc(
      'Aile · Planche · Foil · Combi · Sécu',
      'Wing · Board · Foil · Wetsuit · Safety',
      'Ala · Tabla · Foil · Traje · Seguridad',
      'جناح · لوح · فويل · بدلة · أمان',
    ),
    coverEyebrow: loc('Volez au-dessus de l’eau', 'Fly above the water', 'Vuela sobre el agua', 'حلّق فوق الماء'),
    coverTitle: loc('Wingfoil', 'Wingfoil', 'Wingfoil', 'وينج فويل'),
    coverLead: loc(
      'Du premier waterstart aux premières envolées sur le lagon de Dakhla.',
      'From your first waterstart to early flights on Dakhla lagoon.',
      'Desde el primer waterstart hasta los primeros vuelos en la laguna de Dakhla.',
      'من أول انطلاقة مائية إلى أولى الطلعات على بحيرة الداخلة.',
    ),
    introTitle: loc(
      'Décollez, planez, vivez l’instant',
      'Lift off, glide, live the moment',
      'Despega, planea, vive el instante',
      'أقلع، انزلق، عِش اللحظة',
    ),
    introBody: loc(
      'Porté par une wing et soulevé par un foil, vous glissez au-dessus de l’eau. Nos instructeurs vous guident pas à pas — matériel récent, vent régulier, eau plate.',
      'Carried by a wing and lifted by a foil, you glide above the water. Coaches guide you step by step — fresh gear, steady wind, flat water.',
      'Con un ala y un foil, deslizas sobre el agua. Instructores te guían paso a paso — material reciente, viento regular, agua plana.',
      'بجناح وفويل تنزلق فوق الماء. مدربون يرشدونك خطوة بخطوة — معدات حديثة وريح منتظمة وماء مسطح.',
    ),
    why: [
      loc('Instructeurs spécialisés wingfoil', 'Specialist wingfoil coaches', 'Instructores de wingfoil', 'مدربون متخصصون'),
      loc('Matériel dernière génération', 'Latest-gen gear', 'Material de última generación', 'معدات حديثة'),
      loc('Lagon d’eau plate', 'Flat-water lagoon', 'Laguna de agua plana', 'بحيرة ماء مسطح'),
      loc('Progression rapide', 'Fast progression', 'Progresión rápida', 'تقدم سريع'),
    ],
    beginner: {
      title: loc('Cours Débutant', 'Beginner course', 'Curso principiante', 'دورة المبتدئين'),
      desc: loc(
        'Apprenez les bases : setup, contrôle de l’aile, waterstart et premiers mètres en foil.',
        'Learn the basics: setup, wing control, waterstart and first meters on foil.',
        'Aprende lo básico: montaje, control del ala, waterstart y primeros metros en foil.',
        'تعلّم الأساسيات: التجهيز، التحكم بالجناح، الانطلاقة المائية وأولى الأمتار على الفويل.',
      ),
    },
    intermediate: {
      title: loc('Cours Intermédiaire', 'Intermediate course', 'Curso intermedio', 'دورة متوسطة'),
      desc: loc(
        'Affinez transitions, upwind et contrôle du foil sur des sessions plus longues.',
        'Refine transitions, upwind and foil control on longer sessions.',
        'Afina transiciones, ceñida y control del foil en sesiones más largas.',
        'طوّر الانتقالات والإبحار ضد الريح والتحكم بالفويل في جلسات أطول.',
      ),
    },
  },
  kitesurf: {
    label: 'Kitesurf',
    panelImageKey: 'homeKite1',
    other: 'wingfoil',
    gearDefaults: loc(
      'Aile · Planche · Harnais · Combi · Sécu',
      'Kite · Board · Harness · Wetsuit · Safety',
      'Cometa · Tabla · Arnés · Traje · Seguridad',
      'كايت · لوح · حزام · بدلة · أمان',
    ),
    coverEyebrow: loc('Domptez le vent', 'Master the wind', 'Domina el viento', 'سيطر على الريح'),
    coverTitle: loc('Kitesurf', 'Kitesurf', 'Kitesurf', 'كايت سيرف'),
    coverLead: loc(
      'Des cours débutants aux sessions avancées sur le lagon d’eau plate de Dakhla.',
      'From beginner lessons to advanced sessions on Dakhla’s flat lagoon.',
      'De clases principiantes a sesiones avanzadas en la laguna plana de Dakhla.',
      'من دروس المبتدئين إلى الجلسات المتقدمة على بحيرة الداخلة المسطحة.',
    ),
    introTitle: loc(
      'Ressentez l’adrénaline, domptez le vent',
      'Feel the adrenaline, master the wind',
      'Siente la adrenalina, domina el viento',
      'اشعر بالأدرينالين وسيطر على الريح',
    ),
    introBody: loc(
      'Alizés réguliers, eau plate, moniteurs IKO. Cours privés ou semi-privés adaptés à votre niveau — progression garantie.',
      'Steady trade winds, flat water, IKO coaches. Private or semi-private lessons matched to your level — progression guaranteed.',
      'Alisios regulares, agua plana, monitores IKO. Clases privadas o semi-privadas según tu nivel — progresión garantizada.',
      'رياح منتظمة وماء مسطح ومدربون IKO. دروس خاصة أو شبه خاصة حسب مستواك — تقدم مضمون.',
    ),
    why: [
      loc('Moniteurs certifiés IKO (FR/EN)', 'IKO-certified coaches (FR/EN)', 'Monitores IKO (FR/EN)', 'مدربون IKO معتمدون'),
      loc('Bateau de sécurité inclus', 'Safety boat included', 'Barco de seguridad incluido', 'قارب أمان مشمول'),
      loc('Casques radio', 'Radio helmets', 'Cascos con radio', 'خوذات لاسلكية'),
      loc('Spot d’eau plate idéal', 'Ideal flat-water spot', 'Spot ideal de agua plana', 'موقع ماء مسطح مثالي'),
    ],
    beginner: {
      title: loc('Cours Débutant', 'Beginner course', 'Curso principiante', 'دورة المبتدئين'),
      desc: loc(
        'Apprenez de zéro : setup, pilotage à terre, nage tractée puis waterstart.',
        'Learn from scratch: setup, land flying, body drag, then waterstart.',
        'Aprende desde cero: montaje, piloto en tierra, body drag y waterstart.',
        'تعلّم من الصفر: التجهيز، الطيران على البر، السحب بالجسم ثم الانطلاقة المائية.',
      ),
    },
    intermediate: {
      title: loc('Cours Intermédiaire', 'Intermediate course', 'Curso intermedio', 'دورة متوسطة'),
      desc: loc(
        'Perfectionnez rides, transitions et remonter au vent.',
        'Refine rides, transitions and upwind.',
        'Perfecciona rides, transiciones y ceñida.',
        'طوّر الركوب والانتقالات والإبحار ضد الريح.',
      ),
    },
  },
}

function tLoc(locale: string, fr: string, en: string, es: string, ar: string) {
  if (locale === 'fr') return fr
  if (locale === 'es') return es
  if (locale === 'ar') return ar
  return en
}

function PhotoThumb({
  activityId,
  index,
  src,
  alt,
  onOpen,
  className,
}: {
  activityId: string
  index: number
  src: string
  alt: string
  onOpen: () => void
  className?: string
}) {
  const fieldKey = activityImageFieldKey(activityId, index)
  const liveSrc = useEditableImageSrc(fieldKey, src)
  const remote = /^https?:\/\//.test(liveSrc)

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'group relative shrink-0 overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0046A4]',
        className,
      )}
    >
      <EditableImage fieldKey={fieldKey} src={liveSrc} label={`${activityId} ${index + 1}`} className="absolute inset-0">
        <Image
          src={liveSrc}
          alt={alt}
          fill
          sizes="280px"
          loading="lazy"
          quality={70}
          unoptimized={remote}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </EditableImage>
    </button>
  )
}

export function ActivityCourseContent({ sport }: { sport: ActivitySport }) {
  return (
    <ActivityStoryProvider>
      <ActivityCourseInner sport={sport} />
    </ActivityStoryProvider>
  )
}

function ActivityCourseInner({ sport }: { sport: ActivitySport }) {
  const { locale } = useTranslations()
  const { images, texts, activities } = useSiteConfig()
  const meta = SPORT_META[sport]
  const [level, setLevel] = useState<Level>('beginner')
  const course = level === 'beginner' ? meta.beginner : meta.intermediate
  const story = useActivityStory()

  const activity =
    activities.find((a) => a.id === sport) || ACTIVITIES.find((a) => a.id === sport)
  const photoUrls =
    activity?.images?.length
      ? activity.images
      : ACTIVITIES.find((a) => a.id === sport)?.images || []

  const panelFallback =
    photoUrls[0] ||
    (sport === 'wingfoil'
      ? images.homeWing1 || DEFAULT_IMAGES.homeWing1
      : images.homeKite1 || DEFAULT_IMAGES.homeKite1)
  const panelSrc = useEditableImageSrc(meta.panelImageKey, panelFallback)

  const contactHref = `/${locale}/contact`
  const otherHref = `/${locale}/activities/${meta.other}`
  const rentalHref = `/${locale}/activities/equipment-rental`
  const safetyHref = `/${locale}/safety`
  const pricingHref = `/${locale}/pricing`

  const openPhotos = (index = 0) => {
    if (!photoUrls.length) return
    story?.openStory({ images: photoUrls, title: meta.label, startIndex: index })
  }

  return (
    <div className="bg-[#FAF8F3]" data-nav-theme="light">
      {/* —— Simple light cover (no cinematic hero) —— */}
      <header className="container-editorial pt-32 pb-10 sm:pt-36 sm:pb-12">
        <Reveal>
          <EditableText
            fieldKey={`activities.${sport}.cover.eyebrow`}
            label={`${meta.label} cover eyebrow`}
            as="p"
            className="eyebrow text-[#0046A4]"
            defaults={meta.coverEyebrow}
            cms={texts[`activities.${sport}.cover.eyebrow`]}
          />
          <EditableText
            fieldKey={`activities.${sport}.cover.title`}
            label={`${meta.label} cover title`}
            as="h1"
            className="font-heading mt-4 text-[clamp(2.75rem,8vw,5.5rem)] font-extrabold leading-[0.95] tracking-tight text-[#0B1F3B] text-balance"
            defaults={meta.coverTitle}
            cms={texts[`activities.${sport}.cover.title`]}
          />
          <EditableText
            fieldKey={`activities.${sport}.cover.lead`}
            label={`${meta.label} cover lead`}
            as="p"
            className="mt-6 max-w-lg text-body-lg text-[#3D4F6F]"
            defaults={meta.coverLead}
            cms={texts[`activities.${sport}.cover.lead`]}
          />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <EditableLink
              fieldKey={`activities.${sport}.cover.cta`}
              label={`${meta.label} cover CTA`}
              href={contactHref}
              className="btn-pill bg-[#0B1F3B] text-white hover:bg-[#0057D1]"
              defaults={loc(
                'Réserver un cours',
                'Book a lesson',
                'Reservar una clase',
                'احجز درساً',
              )}
              cms={texts[`activities.${sport}.cover.cta`]}
              after={<ArrowRight className="h-4 w-4" />}
            />
            <Link
              href={pricingHref}
              className="btn-pill border border-[#0B1F3B]/12 bg-white text-[#0B1F3B] hover:bg-white/80"
            >
              {tLoc(locale, 'Packages', 'Packages', 'Paquetes', 'الباقات')}
            </Link>
          </div>
        </Reveal>
      </header>

      {/* —— Course panel —— */}
      <section className="container-editorial pb-16 sm:pb-20">
        <Reveal delay={60}>
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-small font-semibold text-[#7A8AA3]">
              {tLoc(
                locale,
                'Choisissez votre niveau',
                'Choose your level',
                'Elige tu nivel',
                'اختر مستواك',
              )}
            </p>
            <div
              role="tablist"
              aria-label={tLoc(locale, 'Niveau', 'Level', 'Nivel', 'المستوى')}
              className="inline-flex gap-1 rounded-full bg-[#E8E0D4] p-1"
            >
              {(
                [
                  { id: 'beginner' as const, label: meta.beginner.title },
                  { id: 'intermediate' as const, label: meta.intermediate.title },
                ] as const
              ).map((tab) => {
                const active = level === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setLevel(tab.id)}
                    className={cn(
                      'rounded-full px-4 py-2 text-small font-bold transition-colors sm:px-5',
                      active
                        ? 'bg-[#0B1F3B] text-white shadow-sm'
                        : 'text-[#3D4F6F] hover:text-[#0B1F3B]',
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

          {/* Split cover card */}
          <div className="overflow-hidden rounded-[28px] bg-[#EFE8DC]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[520px]">
                <EditableImage
                  fieldKey={meta.panelImageKey}
                  src={panelSrc}
                  label={`${meta.label} course photo`}
                  className="absolute inset-0"
                >
                  <Image
                    src={panelSrc}
                    alt={meta.label}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={75}
                    className="object-cover"
                  />
                </EditableImage>
              </div>

              <div className="flex flex-col justify-center px-6 py-8 sm:px-9 sm:py-10 lg:px-10 lg:py-12">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-[#0B1F3B]/10 pb-4">
                  <p className="eyebrow text-[#7A8AA3]">
                    {level === 'beginner'
                      ? tLoc(locale, 'Niveau I', 'Level I', 'Nivel I', 'المستوى I')
                      : tLoc(locale, 'Niveau II', 'Level II', 'Nivel II', 'المستوى II')}
                  </p>
                  <EditableText
                    fieldKey={`pricing.${sport}.gear`}
                    label={`${meta.label} gear`}
                    as="p"
                    className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#7A8AA3]"
                    defaults={meta.gearDefaults}
                    cms={texts[`pricing.${sport}.gear`]}
                  />
                </div>

                <EditableText
                  fieldKey={`activities.${sport}.${level}.title`}
                  label={`${meta.label} ${level} title`}
                  as="h2"
                  className="font-heading text-card-title text-[#0B1F3B]"
                  defaults={course.title}
                  cms={texts[`activities.${sport}.${level}.title`]}
                />

                <EditableText
                  fieldKey={`activities.${sport}.${level}.desc`}
                  label={`${meta.label} ${level} desc`}
                  as="p"
                  className="mt-4 max-w-md text-small text-[#3D4F6F]"
                  defaults={course.desc}
                  cms={texts[`activities.${sport}.${level}.desc`]}
                />

                <CoursePricingTable
                  idPrefix={`${sport}-${level}`}
                  className="mt-8"
                  showBookCta
                  showRateNote={false}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* —— Short intro —— */}
      <section className="border-t border-[#0B1F3B]/6 bg-white">
        <div className="container-editorial section-y-sm">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <EditableText
                  fieldKey={`activities.${sport}.intro.title`}
                  label={`${meta.label} intro title`}
                  as="h2"
                  className="font-heading text-section text-[#0B1F3B] text-balance"
                  defaults={meta.introTitle}
                  cms={texts[`activities.${sport}.intro.title`]}
                />
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={80}>
                <EditableText
                  fieldKey={`activities.${sport}.intro.body`}
                  label={`${meta.label} intro body`}
                  as="p"
                  className="text-body-lg text-[#3D4F6F]"
                  defaults={meta.introBody}
                  cms={texts[`activities.${sport}.intro.body`]}
                />
                <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {meta.why.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-small font-semibold text-[#0B1F3B]"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0046A4]" />
                      <EditableText
                        fieldKey={`activities.${sport}.why.${i}`}
                        label={`${meta.label} why ${i}`}
                        defaults={item}
                        cms={texts[`activities.${sport}.why.${i}`]}
                      />
                    </li>
                  ))}
                </ul>
                <Link
                  href={safetyHref}
                  className="mt-8 inline-flex items-center gap-2 text-small font-bold text-[#0046A4]"
                >
                  {tLoc(locale, 'Sécurité & protocoles', 'Safety & protocols', 'Seguridad y protocolos', 'الأمان والبروتوكولات')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* —— Simple photo strip —— */}
      {photoUrls.length > 1 && (
        <section className="bg-[#FAF8F3] pb-16 pt-4 sm:pb-20">
          <div className="container-editorial">
            <Reveal>
              <div className="mb-6 flex items-center justify-between gap-4">
                <p className="eyebrow text-[#0046A4]">
                  {tLoc(locale, 'En images', 'In pictures', 'En imágenes', 'بالصور')}
                </p>
                <button
                  type="button"
                  onClick={() => openPhotos(0)}
                  className="inline-flex items-center gap-2 text-small font-bold text-[#0B1F3B]"
                >
                  <Images className="h-4 w-4" />
                  {tLoc(locale, 'Tout voir', 'View all', 'Ver todo', 'عرض الكل')}
                </button>
              </div>
            </Reveal>
            <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
              {photoUrls.map((src, i) => (
                <PhotoThumb
                  key={`${sport}-strip-${i}`}
                  activityId={sport}
                  index={i}
                  src={src}
                  alt={`${meta.label} ${i + 1}`}
                  onOpen={() => openPhotos(i)}
                  className="h-44 w-36 sm:h-56 sm:w-44"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* —— Minimal cross-links —— */}
      <section className="border-t border-[#0B1F3B]/6 bg-white">
        <div className="container-editorial py-12 sm:py-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p className="text-small text-[#7A8AA3]">
              {tLoc(locale, 'Continuer', 'Explore more', 'Explorar más', 'المزيد')}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={otherHref}
                className="rounded-full bg-[#EFE8DC] px-4 py-2 text-small font-bold text-[#0B1F3B] hover:bg-[#E8E0D4]"
              >
                {tLoc(
                  locale,
                  `Voir ${SPORT_META[meta.other].label}`,
                  `See ${SPORT_META[meta.other].label}`,
                  `Ver ${SPORT_META[meta.other].label}`,
                  `عرض ${SPORT_META[meta.other].label}`,
                )}
              </Link>
              <Link
                href={rentalHref}
                className="rounded-full bg-[#EFE8DC] px-4 py-2 text-small font-bold text-[#0B1F3B] hover:bg-[#E8E0D4]"
              >
                {tLoc(locale, 'Location de matériel', 'Equipment rental', 'Alquiler de material', 'تأجير المعدات')}
              </Link>
              <Link
                href={pricingHref}
                className="rounded-full bg-[#EFE8DC] px-4 py-2 text-small font-bold text-[#0B1F3B] hover:bg-[#E8E0D4]"
              >
                {tLoc(locale, 'Packages & tarifs', 'Packages & pricing', 'Paquetes y tarifas', 'الباقات والأسعار')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
