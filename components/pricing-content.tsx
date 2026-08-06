'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Check, ArrowRight, Wind, Sailboat, Backpack, Waves, Clapperboard } from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'
import { useSiteConfig } from '@/hooks/use-site-config'
import { PackagesSection } from '@/components/packages-section'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'
import { MEDIA_PACK, mediaTr } from '@/lib/media-pack'

import { DEFAULT_IMAGES } from '@/lib/site-config'

type Sport = 'wingfoil' | 'kitesurf'
type Formula = 'private' | 'semi'

export function PricingContent() {
  const { t, locale } = useTranslations()
  const { pricing: rows, images } = useSiteConfig()
  const [sport, setSport] = useState<Sport>('wingfoil')
  const [formula, setFormula] = useState<Formula>('private')
  const heroBg = images.pricingHero || DEFAULT_IMAGES.pricingHero
  const ctaImg = images.pricingAction || DEFAULT_IMAGES.pricingAction
  const getText = (frText: string, enText: string, esText?: string, arText?: string) => {
    if (locale === 'fr') return frText
    if (locale === 'es') return esText || enText
    if (locale === 'ar') return arText || enText
    return enText
  }

  const sports: {
    id: Sport
    label: string
    Icon: typeof Wind
    image: string
    title: string
    desc: string
    gear: string
  }[] = [
    {
      id: 'wingfoil',
      label: 'Wingfoil',
      Icon: Wind,
      image: images.homeWing1 || DEFAULT_IMAGES.homeWing1,
      title: getText('Cours de Wingfoil', 'Wingfoil Lessons', 'Clases de Wingfoil', 'دروس الوينج فويل'),
      desc: getText(
        'Apprentissage progressif encadré, du premier vol au riding autonome. Tout le matériel est inclus.',
        'Progressive coaching from your first flight to independent riding. All equipment included.',
        'Aprendizaje progresivo guiado, desde el primer vuelo hasta el riding autónomo. Todo el material incluido.',
        'تعلم تدريجي بإشراف، من أول طيران إلى الركوب المستقل. جميع المعدات مشمولة.'
      ),
      gear: getText(
        'Wing · Planche · Combinaison · Gilet',
        'Wing · Board · Wetsuit · Vest',
        'Wing · Tabla · Neopreno · Chaleco',
        'وينج · لوح · بدلة · سترة'
      ),
    },
    {
      id: 'kitesurf',
      label: 'Kitesurf',
      Icon: Sailboat,
      image: images.homeKite1 || DEFAULT_IMAGES.homeKite1,
      title: getText('Cours de Kitesurf', 'Kitesurf Lessons', 'Clases de Kitesurf', 'دروس الكايت سيرف'),
      desc: getText(
        'De la prise en main du kite au riding en autonomie, avec un encadrement sécurisé adapté à votre niveau.',
        'From kite handling to independent riding, with safe coaching adapted to your level.',
        'Desde el manejo del kite hasta el riding autónomo, con entrenamiento seguro adaptado a tu nivel.',
        'من التحكم في الكايت إلى الركوب المستقل، مع تدريب آمن مكيف لمستواك.'
      ),
      gear: getText(
        'Kite · Planche · Harnais · Combinaison · Sécu',
        'Kite · Board · Harness · Wetsuit · Safety',
        'Kite · Tabla · Arnés · Neopreno · Seguridad',
        'كايت · لوح · حزام · بدلة · أمان'
      ),
    },
  ]

  const active = sports.find((s) => s.id === sport) ?? sports[0]

  return (
    <div className="overflow-hidden">

      {/* ══ HERO ══ */}
      <PageHero
        image={heroBg}
        eyebrow="Wing Kite Dakhla Academy"
        title={getText('Nos Tarifs', 'Our Pricing', 'Nuestros Precios', 'أسعارنا')}
        subtitle={getText(
          'Tarifs valables selon les saisons',
          'Prices valid by season',
          'Precios válidos según temporada',
          'الأسعار صالحة حسب الموسم'
        )}
      />

      {/* ══ PRICING ══ Tabbed editorial panel */}
      <section id="courses" className="surface-noise relative overflow-hidden bg-[#F6F1E8] section-y scroll-mt-28" data-nav-theme="light">
        <span aria-hidden className="blob -top-32 -left-24 h-112 w-md bg-[#0046A4]/8" />

        <div className="container-narrow relative z-10">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-section text-[#072A5A] text-balance">
                {getText('Cours Wingfoil & Kitesurf', 'Wingfoil & Kitesurf Courses', 'Cursos Wingfoil & Kitesurf', 'دروس وينج فويل وكايت سيرف')}
              </h2>
              <p className="text-body-lg text-[#3D4F6F] mt-6">
                {getText(
                  'Choisissez votre discipline, puis la formule Privé ou Semi-privé.',
                  'Choose your sport, then Private or Semi-private.',
                  'Elige tu disciplina y luego la fórmula Privado o Semi-privado.',
                  'اختر رياضتك ثم الصيغة الخاصة أو شبه الخاصة.'
                )}
              </p>
            </div>
          </Reveal>

          {/* Sport tabs — Dakhla Camp–style segmented control */}
          <Reveal delay={80}>
            <div
              role="tablist"
              aria-label={getText('Discipline', 'Sport', 'Disciplina', 'الرياضة')}
              className="mt-12 flex justify-center"
            >
              <div className="inline-flex gap-2 rounded-full border border-[#072A5A]/8 bg-white/70 p-1.5 shadow-[0_10px_30px_rgba(0,70,164,0.08)] backdrop-blur-md">
                {sports.map(({ id, label, Icon }) => {
                  const selected = sport === id
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      id={`sport-tab-${id}`}
                      aria-controls="pricing-panel"
                      onClick={() => setSport(id)}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-small font-bold transition-all duration-450 ease-[cubic-bezier(0.16,1,0.3,1)] sm:gap-2.5 sm:px-6 sm:py-3',
                        selected
                          ? 'bg-[#0B1F3B] text-white shadow-[0_10px_30px_rgba(11,31,59,0.25)]'
                          : 'text-[#3D4F6F] hover:bg-black/4 hover:text-[#072A5A]',
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          </Reveal>

          {/* Editorial pricing card */}
          <Reveal delay={140}>
            <div
              id="pricing-panel"
              role="tabpanel"
              aria-labelledby={`sport-tab-${sport}`}
              className="mt-10 overflow-hidden rounded-[28px] border border-[#072A5A]/6 bg-[#FAF8F3] shadow-[0_25px_60px_rgba(0,70,164,0.08)]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                {/* Image with soft right fade into the card */}
                <div className="relative min-h-72 lg:min-h-full">
                  <Image
                    key={active.image}
                    src={active.image}
                    alt={active.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    loading="lazy"
                    quality={75}
                    className="object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 lg:hidden"
                    style={{
                      background:
                        'linear-gradient(to top, #FAF8F3 0%, transparent 40%)',
                    }}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 lg:block"
                    style={{
                      background:
                        'linear-gradient(to right, transparent, #FAF8F3)',
                    }}
                  />
                </div>

                {/* Content */}
                <div className="relative flex flex-col px-5 py-7 sm:px-9 sm:py-10 lg:ps-4 lg:pe-10">
                  <div className="mb-5 flex flex-col gap-2 border-b border-[#072A5A]/8 pb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
                    <p className="eyebrow text-[#7A8AA3]">
                      {getText('Tous niveaux', 'All levels', 'Todos los niveles', 'جميع المستويات')}
                    </p>
                    <p className="text-xs leading-relaxed text-[#7A8AA3] sm:text-[0.8125rem] sm:font-bold sm:uppercase sm:tracking-[0.18em] sm:leading-none">
                      {active.gear}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-heading text-card-title text-[#072A5A]">
                      {active.title}
                    </h3>
                    <span className="eyebrow rounded-full bg-[#0B1F3B] px-3.5 py-1.5 text-[0.65rem] text-white">
                      {active.label}
                    </span>
                  </div>
                  <p className="text-small text-[#3D4F6F] mt-4 max-w-lg">{active.desc}</p>

                  {/* Mobile: one formula at a time so the list stays scannable */}
                  <div className="mt-8 md:hidden">
                    <div
                      role="tablist"
                      aria-label={getText('Formule', 'Formula', 'Fórmula', 'الصيغة')}
                      className="flex gap-2 rounded-full border border-[#072A5A]/8 bg-white/80 p-1"
                    >
                      {(
                        [
                          {
                            id: 'private' as const,
                            label: getText('Privé', 'Private', 'Privado', 'خاص'),
                            hint: getText('1 pers.', '1 pax', '1 pers.', '1 شخص'),
                          },
                          {
                            id: 'semi' as const,
                            label: getText('Semi-privé', 'Semi-private', 'Semi-privado', 'شبه خاص'),
                            hint: getText('2–3 pers.', '2–3 pax', '2–3 pers.', '2–3 أشخاص'),
                          },
                        ] as const
                      ).map((opt) => {
                        const selected = formula === opt.id
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            onClick={() => setFormula(opt.id)}
                            className={cn(
                              'flex flex-1 flex-col items-center rounded-full px-3 py-2.5 transition-all duration-450',
                              selected
                                ? 'bg-[#0B1F3B] text-white shadow-[0_8px_20px_rgba(11,31,59,0.22)]'
                                : 'text-[#3D4F6F]',
                            )}
                          >
                            <span className="text-xs font-bold">{opt.label}</span>
                            <span
                              className={cn(
                                'mt-0.5 text-[0.65rem] font-medium',
                                selected ? 'text-white/55' : 'text-[#7A8AA3]',
                              )}
                            >
                              {opt.hint}
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    <ul className="mt-4 overflow-hidden rounded-[18px] border border-[#072A5A]/8">
                      {rows
                        .filter((row) =>
                          formula === 'private' ? row.privEur > 0 : row.semiEur > 0,
                        )
                        .map((row) => {
                        const eur = formula === 'private' ? row.privEur : row.semiEur
                        const mad = formula === 'private' ? row.privMad : row.semiMad
                        return (
                          <li
                            key={`m-${sport}-${formula}-${row.hours}`}
                            className={cn(
                              'flex items-center justify-between gap-4 border-t border-[#072A5A]/6 px-5 py-4 first:border-t-0',
                              row.extra ? 'bg-[#C9A66B]/18' : 'bg-white/70',
                            )}
                          >
                            <div className="min-w-0">
                              <p className="font-heading text-base font-bold text-[#072A5A]">
                                {row.hours}
                              </p>
                              {row.extra && (
                                <p className="mt-0.5 text-xs italic text-[#7A8AA3]">
                                  {getText('heure suppl.', 'extra hour', 'hora extra', 'ساعة إضافية')}
                                </p>
                              )}
                            </div>
                            <div className="shrink-0 text-end">
                              <p className="font-heading text-xl font-extrabold tracking-tight text-[#072A5A]">
                                {eur}€
                              </p>
                              <p className="mt-0.5 text-xs font-semibold text-[#B8925A]">
                                {mad} MAD
                              </p>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  {/* Desktop: both formulas side by side */}
                  <div className="mt-8 hidden overflow-hidden rounded-[18px] border border-[#072A5A]/8 md:block">
                    <table className="w-full border-collapse text-start">
                      <thead>
                        <tr className="bg-[#0B1F3B] text-white">
                          <th className="eyebrow px-5 py-3.5 text-start font-bold text-white/80">
                            {getText('Durée', 'Duration', 'Duración', 'المدة')}
                          </th>
                          <th className="eyebrow px-5 py-3.5 text-end font-bold text-white/80">
                            {getText('Privé', 'Private', 'Privado', 'خاص')}
                            <span className="mt-0.5 block text-[0.6rem] font-semibold normal-case tracking-normal text-white/45">
                              {getText('1 pers.', '1 pax', '1 pers.', '1 شخص')}
                            </span>
                          </th>
                          <th className="eyebrow px-5 py-3.5 text-end font-bold text-white/80">
                            {getText('Semi-privé', 'Semi-private', 'Semi-privado', 'شبه خاص')}
                            <span className="mt-0.5 block text-[0.6rem] font-semibold normal-case tracking-normal text-white/45">
                              {getText('2–3 pers.', '2–3 pax', '2–3 pers.', '2–3 أشخاص')}
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => (
                          <tr
                            key={`${sport}-${row.hours}`}
                            className={cn(
                              'border-t border-[#072A5A]/6',
                              row.extra ? 'bg-[#C9A66B]/18' : 'bg-white/60',
                            )}
                          >
                            <td className="px-5 py-3.5">
                              <span className="font-heading text-small font-bold text-[#072A5A]">
                                {row.hours}
                              </span>
                              {row.extra && (
                                <span className="ms-2 text-xs italic text-[#7A8AA3]">
                                  {getText('heure suppl.', 'extra hour', 'hora extra', 'ساعة إضافية')}
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-end">
                              <span className="font-heading text-lg font-extrabold text-[#072A5A]">
                                {row.privEur}€
                              </span>
                              <span className="mt-0.5 block text-[0.7rem] font-semibold text-[#B8925A]">
                                {row.privMad} MAD
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-end">
                              {row.semiEur > 0 ? (
                                <>
                                  <span className="font-heading text-lg font-extrabold text-[#072A5A]">
                                    {row.semiEur}€
                                  </span>
                                  <span className="mt-0.5 block text-[0.7rem] font-semibold text-[#B8925A]">
                                    {row.semiMad} MAD
                                  </span>
                                </>
                              ) : (
                                <span className="text-small text-[#7A8AA3]">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/${locale}/contact`}
                      className="btn-pill-sm bg-[#0B1F3B] text-small text-white hover:bg-[#0057D1]"
                    >
                      {getText('Réserver ce cours', 'Book this course', 'Reservar este curso', 'احجز هذا الدرس')}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <p className="text-xs text-[#7A8AA3]">
                      {getText(
                        'Même grille pour Wingfoil et Kitesurf.',
                        'Same rate card for Wingfoil and Kitesurf.',
                        'Misma tarifa para Wingfoil y Kitesurf.',
                        'نفس الأسعار للوينج فويل والكايت سيرف.'
                      )}
                    </p>
                  </div>

                  {/* Media pack option on each activity / sport */}
                  <a
                    href="#media-pack"
                    className="mt-6 flex items-center gap-3 rounded-[18px] border border-dashed border-[#0046A4]/25 bg-[#0046A4]/5 px-4 py-3.5 transition-colors hover:border-[#0046A4]/45 hover:bg-[#0046A4]/8"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#072A5A] text-white">
                      <Clapperboard className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-small font-bold text-[#072A5A]">
                        {mediaTr(MEDIA_PACK.short, locale)}
                      </p>
                      <p className="text-xs text-[#7A8AA3] mt-0.5 line-clamp-1">
                        {mediaTr(MEDIA_PACK.desc, locale)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#072A5A] px-3 py-1 text-xs font-bold text-white">
                      {MEDIA_PACK.priceLabel}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Custom Media Pack card */}
          <Reveal delay={80}>
            <article
              id="media-pack"
              className="card-premium relative mt-8 overflow-hidden scroll-mt-28"
            >
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(120deg, rgba(7,42,90,.06) 0%, rgba(0,70,164,.10) 45%, rgba(201,166,107,.12) 100%)',
                }}
              />
              <div className="relative grid grid-cols-1 gap-8 p-7 sm:p-9 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12">
                <div>
                  <p className="eyebrow text-[#0046A4]">
                    {getText('Option session', 'Session option', 'Opción de sesión', 'خيار الجلسة')}
                  </p>
                  <h3 className="font-heading text-card-title text-[#072A5A] mt-3">
                    {mediaTr(MEDIA_PACK.title, locale)}
                  </h3>
                  <p className="text-small text-[#3D4F6F] mt-3 max-w-xl">
                    {mediaTr(MEDIA_PACK.desc, locale)}{' '}
                    {mediaTr(MEDIA_PACK.availableOn, locale)}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {MEDIA_PACK.features.map((f) => (
                      <li key={f.en} className="flex items-start gap-3 text-small text-[#072A5A]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0046A4]" aria-hidden />
                        {mediaTr(f, locale)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col items-stretch gap-4 rounded-[22px] border border-[#072A5A]/8 bg-white/80 p-6 text-center sm:items-center lg:p-8">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#072A5A] text-white shadow-[0_12px_30px_rgba(7,42,90,0.25)]">
                    <Clapperboard className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <p className="font-heading text-4xl font-extrabold tracking-tight text-[#072A5A]">
                      {MEDIA_PACK.priceLabel}
                    </p>
                    <p className="text-xs font-semibold text-[#7A8AA3] mt-1">
                      {getText('par session', 'per session', 'por sesión', 'لكل جلسة')}
                    </p>
                  </div>
                  <Link
                    href={`/${locale}/contact`}
                    className="btn-pill-sm w-full justify-center bg-[#0B1F3B] text-small text-white hover:bg-[#0057D1] sm:w-auto"
                  >
                    {mediaTr(MEDIA_PACK.cta, locale)}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>

          {/* Additional Services */}
          <div id="extras" className="mt-8 grid scroll-mt-28 grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                Icon: Backpack,
                title: getText('Si vous utilisez votre équipement', 'If you use your own gear', 'Si usas tu propio equipo', 'إذا كنت تستخدم معداتك الخاصة'),
                desc: getText('Réduction de 15% sur tous les cours', '15% discount on all courses', '15% descuento en todos los cursos', 'خصم 15% على جميع الدروس'),
                badge: '-15%',
                badgeColor: '#25D366',
                iconColor: '#25D366',
              },
              {
                Icon: Waves,
                title: getText('Coaching Freestyle', 'Freestyle Coaching', 'Coaching Freestyle', 'Freestyle Coaching'),
                desc: getText('Session de coaching avancé', 'Advanced coaching session', 'Sesión de coaching avanzado', 'جلسة تدريب متقدمة'),
                badge: '€120',
                badgeColor: '#C9A66B',
                iconColor: '#B8925A',
              },
              {
                Icon: Wind,
                title: 'Down wind',
                desc: getText('Devis sur mesure selon votre niveau', 'Custom quote by level', 'Presupuesto personalizado', 'عرض سعر مخصص حسب مستواك'),
                badge: getText('Devis', 'Quote', 'Presupuesto', 'عرض سعر'),
                badgeColor: '#0046A4',
                iconColor: '#0046A4',
              },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 110}>
                <div className="card-premium card-lift flex h-full items-start gap-4 p-7">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px]"
                    style={{ backgroundColor: `${s.iconColor}14`, color: s.iconColor }}
                  >
                    <s.Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h3 className="text-small font-bold text-[#072A5A]">{s.title}</h3>
                      <span
                        className="shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white"
                        style={{ backgroundColor: s.badgeColor }}
                      >
                        {s.badge}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#7A8AA3]">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Note */}
          <Reveal delay={120}>
            <div id="inclusions" className="card-premium mt-6 scroll-mt-28 p-8">
              <div className="mb-5 flex items-center gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0046A4]/8">
                  <Check className="h-4 w-4 text-[#0046A4]" />
                </span>
                <span className="text-small font-bold text-[#072A5A]">
                  {getText('Inclus pour tous les cours', 'Included in all courses', 'Incluido en todos los cursos', 'مشمول في جميع الدروس')}
                </span>
              </div>
              <ul className="space-y-2.5 text-small text-[#3D4F6F] ps-12">
                <li>{getText('Kite ou wing, planche, combinaison, gilet de sécurité, casque et walkie-talkie.', 'Kite or wing, board, wetsuit, safety vest, helmet and walkie-talkie.', 'Kite o wing, tabla, traje de neopreno, chaleco de seguridad, casco y walkie-talkie.', 'كايت أو وينج، لوح، بدلة غوص، سترة نجاة، خوذة وجهاز لاسلكي.')}</li>
                <li>{getText('Tarifs variables selon les saisons.', 'Prices vary by season.', 'Precios variables según temporada.', 'الأسعار متغيرة حسب المواسم.')}</li>
                <li>{getText('Contactez-nous pour les packages groupes et séjours.', 'Contact us for group packages and stays.', 'Contáctenos para paquetes grupales y estancias.', 'تواصل معنا للباقات الجماعية والإقامات.')}</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ STAY PACKAGES ══ */}
      <PackagesSection />

      {/* ══ DARK CTA ══ */}
      <section className="surface-noise relative overflow-hidden bg-[#0B1F3B] section-y" data-nav-theme="dark">
        <div className="absolute inset-0 z-0">
          <Image
            src={ctaImg}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            loading="lazy"
            quality={72}
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(11,31,59,.90), rgba(7,42,90,.82) 55%, rgba(11,31,59,.92))',
            }}
          />
        </div>

        <div className="container-editorial relative z-10">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-section text-white text-balance">
                {t('pricing.cta.title')}
              </h2>
              <p className="text-body-lg text-white/75 mt-6">{t('pricing.cta.subtitle')}</p>
              <div className="mt-11 flex justify-center">
                <Link
                  href={`/${locale}/contact`}
                  className="group btn-pill bg-[#C9A66B] text-[#0B1F3B] hover:bg-[#C9A66B]"
                >
                  {t('pricing.cta.button')}
                  <ArrowRight className="h-5 w-5 transition-transform duration-400 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
