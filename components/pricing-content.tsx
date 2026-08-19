'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, ArrowRight, Wind, Sailboat, Backpack, Waves, Clapperboard } from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'
import { useSiteConfig } from '@/hooks/use-site-config'
import { PackagesSection } from '@/components/packages-section'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

import { DEFAULT_IMAGES } from '@/lib/site-config'
import type { Localized } from '@/lib/cms/types'
import { EditableImage, EditableLink, EditableText, useEditableImageSrc, useEditableTextValue } from '@/components/edit-mode/editable'
import {
  AddPricingRowButton,
  EditablePricingRow,
  useEditablePricingRows,
} from '@/components/edit-mode/editable-pricing'

type Sport = 'wingfoil' | 'kitesurf'
type Formula = 'private' | 'semi'

const loc = (fr: string, en: string, es: string, ar: string): Localized => ({ fr, en, es, ar })

export function PricingContent() {
  const { locale } = useTranslations()
  const { pricing: cmsPricing, images, mediaPack, texts } = useSiteConfig()
  const rows = useEditablePricingRows(cmsPricing)
  const pack = {
    priceLabel: `€${mediaPack.priceEur}`,
    title: mediaPack.title,
    short: mediaPack.short,
    desc: mediaPack.desc,
    availableOn: mediaPack.availableOn,
    cta: mediaPack.cta,
    features: mediaPack.features,
  }
  const [sport, setSport] = useState<Sport>('wingfoil')
  const [formula, setFormula] = useState<Formula>('private')
  const heroBg = images.pricingHero || DEFAULT_IMAGES.pricingHero
  const ctaImg = images.pricingAction || DEFAULT_IMAGES.pricingAction
  const ctaSrc = useEditableImageSrc('pricingAction', ctaImg)
  const wingPanelSrc = useEditableImageSrc(
    'homeWing1',
    images.homeWing1 || DEFAULT_IMAGES.homeWing1,
  )
  const kitePanelSrc = useEditableImageSrc(
    'homeKite1',
    images.homeKite1 || DEFAULT_IMAGES.homeKite1,
  )

  const wingTitle = useEditableTextValue(
    'pricing.wingfoil.title',
    loc('Cours de Wingfoil', 'Wingfoil Lessons', 'Clases de Wingfoil', 'دروس الوينج فويل'),
    texts['pricing.wingfoil.title'],
  )
  const kiteTitle = useEditableTextValue(
    'pricing.kitesurf.title',
    loc('Cours de Kitesurf', 'Kitesurf Lessons', 'Clases de Kitesurf', 'دروس الكايت سيرف'),
    texts['pricing.kitesurf.title'],
  )

  const sports: {
    id: Sport
    label: string
    Icon: typeof Wind
    image: string
    titleKey: string
    titleDefaults: Localized
    descDefaults: Localized
    gearDefaults: Localized
    resolvedTitle: string
  }[] = [
    {
      id: 'wingfoil',
      label: 'Wingfoil',
      Icon: Wind,
      image: wingPanelSrc,
      titleKey: 'pricing.wingfoil.title',
      titleDefaults: loc('Cours de Wingfoil', 'Wingfoil Lessons', 'Clases de Wingfoil', 'دروس الوينج فويل'),
      descDefaults: loc(
        'Apprentissage progressif encadré, du premier vol au riding autonome. Tout le matériel est inclus.',
        'Progressive coaching from your first flight to independent riding. All equipment included.',
        'Aprendizaje progresivo guiado, desde el primer vuelo hasta el riding autónomo. Todo el material incluido.',
        'تعلم تدريجي بإشراف، من أول طيران إلى الركوب المستقل. جميع المعدات مشمولة.',
      ),
      gearDefaults: loc(
        'Wing · Planche · Combinaison · Gilet',
        'Wing · Board · Wetsuit · Vest',
        'Wing · Tabla · Neopreno · Chaleco',
        'وينج · لوح · بدلة · سترة',
      ),
      resolvedTitle: wingTitle,
    },
    {
      id: 'kitesurf',
      label: 'Kitesurf',
      Icon: Sailboat,
      image: kitePanelSrc,
      titleKey: 'pricing.kitesurf.title',
      titleDefaults: loc('Cours de Kitesurf', 'Kitesurf Lessons', 'Clases de Kitesurf', 'دروس الكايت سيرف'),
      descDefaults: loc(
        'De la prise en main du kite au riding en autonomie, avec un encadrement sécurisé adapté à votre niveau.',
        'From kite handling to independent riding, with safe coaching adapted to your level.',
        'Desde el manejo del kite hasta el riding autónomo, con entrenamiento seguro adaptado a tu nivel.',
        'من التحكم في الكايت إلى الركوب المستقل، مع تدريب آمن مكيف لمستواك.',
      ),
      gearDefaults: loc(
        'Kite · Planche · Harnais · Combinaison · Sécu',
        'Kite · Board · Harness · Wetsuit · Safety',
        'Kite · Tabla · Arnés · Neopreno · Seguridad',
        'كايت · لوح · حزام · بدلة · أمان',
      ),
      resolvedTitle: kiteTitle,
    },
  ]

  const active = sports.find((s) => s.id === sport) ?? sports[0]

  const privateLabel = useEditableTextValue(
    'pricing.table.private',
    loc('Privé', 'Private', 'Privado', 'خاص'),
    texts['pricing.table.private'],
  )
  const privateHint = useEditableTextValue(
    'pricing.table.privateHint',
    loc('1 pers.', '1 pax', '1 pers.', '1 شخص'),
    texts['pricing.table.privateHint'],
  )
  const semiLabel = useEditableTextValue(
    'pricing.table.semi',
    loc('Semi-privé', 'Semi-private', 'Semi-privado', 'شبه خاص'),
    texts['pricing.table.semi'],
  )
  const semiHint = useEditableTextValue(
    'pricing.table.semiHint',
    loc('2–3 pers.', '2–3 pax', '2–3 pers.', '2–3 أشخاص'),
    texts['pricing.table.semiHint'],
  )

  const getText = (frText: string, enText: string, esText?: string, arText?: string) => {
    if (locale === 'fr') return frText
    if (locale === 'es') return esText || enText
    if (locale === 'ar') return arText || enText
    return enText
  }

  return (
    <div className="overflow-hidden">

      {/* ══ HERO ══ */}
      <PageHero
        image={heroBg}
        imageKey="pricingHero"
        eyebrow={
          <EditableText
            fieldKey="pricing.hero.eyebrow"
            label="Pricing hero eyebrow"
            defaults={loc(
              'Wing Kite Dakhla Academy',
              'Wing Kite Dakhla Academy',
              'Wing Kite Dakhla Academy',
              'Wing Kite Dakhla Academy',
            )}
            cms={texts['pricing.hero.eyebrow']}
          />
        }
        title={
          <EditableText
            fieldKey="pricing.hero.title"
            label="Pricing hero title"
            defaults={loc('Nos Tarifs', 'Our Pricing', 'Nuestros Precios', 'أسعارنا')}
            cms={texts['pricing.hero.title']}
          />
        }
        subtitle={
          <EditableText
            fieldKey="pricing.hero.subtitle"
            label="Pricing hero subtitle"
            defaults={loc(
              'Tarifs valables selon les saisons',
              'Prices valid by season',
              'Precios válidos según temporada',
              'الأسعار صالحة حسب الموسم',
            )}
            cms={texts['pricing.hero.subtitle']}
          />
        }
      />

      {/* ══ PRICING ══ Tabbed editorial panel */}
      <section id="courses" className="surface-noise relative overflow-hidden bg-[#F6F1E8] section-y scroll-mt-28" data-nav-theme="light">
        <span aria-hidden className="blob -top-32 -left-24 h-112 w-md bg-[#0046A4]/8" />

        <div className="container-narrow relative z-10">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <EditableText
                fieldKey="pricing.courses.title"
                label="Courses section title"
                as="h2"
                className="font-heading text-section text-[#072A5A] text-balance"
                defaults={loc(
                  'Cours Wingfoil & Kitesurf',
                  'Wingfoil & Kitesurf Courses',
                  'Cursos Wingfoil & Kitesurf',
                  'دروس وينج فويل وكايت سيرف',
                )}
                cms={texts['pricing.courses.title']}
              />
              <EditableText
                fieldKey="pricing.courses.subtitle"
                label="Courses section subtitle"
                as="p"
                className="text-body-lg text-[#3D4F6F] mt-6"
                defaults={loc(
                  'Choisissez votre discipline, puis la formule Privé ou Semi-privé.',
                  'Choose your sport, then Private or Semi-private.',
                  'Elige tu disciplina y luego la fórmula Privado o Semi-privado.',
                  'اختر رياضتك ثم الصيغة الخاصة أو شبه الخاصة.',
                )}
                cms={texts['pricing.courses.subtitle']}
              />
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
                  <EditableImage
                    fieldKey={sport === 'wingfoil' ? 'homeWing1' : 'homeKite1'}
                    src={active.image}
                    label={sport === 'wingfoil' ? 'Pricing — Wingfoil panel' : 'Pricing — Kitesurf panel'}
                    className="absolute inset-0"
                  >
                    <Image
                      key={active.image}
                      src={active.image}
                      alt={active.resolvedTitle}
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
                    <EditableText
                      fieldKey="pricing.panel.levels"
                      label="Pricing panel — levels"
                      as="p"
                      className="eyebrow text-[#7A8AA3]"
                      defaults={loc('Tous niveaux', 'All levels', 'Todos los niveles', 'جميع المستويات')}
                      cms={texts['pricing.panel.levels']}
                    />
                    <EditableText
                      fieldKey={`pricing.${sport}.gear`}
                      label={`${active.label} gear`}
                      as="p"
                      className="text-xs leading-relaxed text-[#7A8AA3] sm:text-[0.8125rem] sm:font-bold sm:uppercase sm:tracking-[0.18em] sm:leading-none"
                      defaults={active.gearDefaults}
                      cms={texts[`pricing.${sport}.gear`]}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <EditableText
                      fieldKey={active.titleKey}
                      label={`${active.label} title`}
                      as="h3"
                      className="font-heading text-card-title text-[#072A5A]"
                      defaults={active.titleDefaults}
                      cms={texts[active.titleKey]}
                    />
                    <span className="eyebrow rounded-full bg-[#0B1F3B] px-3.5 py-1.5 text-[0.65rem] text-white">
                      {active.label}
                    </span>
                  </div>
                  <EditableText
                    fieldKey={`pricing.${sport}.desc`}
                    label={`${active.label} description`}
                    as="p"
                    className="text-small text-[#3D4F6F] mt-4 max-w-lg"
                    defaults={active.descDefaults}
                    cms={texts[`pricing.${sport}.desc`]}
                  />

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
                            label: privateLabel,
                            hint: privateHint,
                          },
                          {
                            id: 'semi' as const,
                            label: semiLabel,
                            hint: semiHint,
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
                          <EditablePricingRow
                            key={`m-${sport}-${formula}-${row.id || row.hours}`}
                            as="li"
                            row={row}
                            allRows={rows}
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
                                  <EditableText
                                    fieldKey="pricing.row.extraLabel"
                                    label="Extra hour label"
                                    defaults={loc('heure suppl.', 'extra hour', 'hora extra', 'ساعة إضافية')}
                                    cms={texts['pricing.row.extraLabel']}
                                  />
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
                          </EditablePricingRow>
                        )
                      })}
                    </ul>
                    <AddPricingRowButton allRows={rows} />
                  </div>

                  {/* Desktop: both formulas side by side */}
                  <div className="mt-8 hidden overflow-hidden rounded-[18px] border border-[#072A5A]/8 md:block">
                    <table className="w-full border-collapse text-start">
                      <thead>
                        <tr className="bg-[#0B1F3B] text-white">
                          <th className="eyebrow px-5 py-3.5 text-start font-bold text-white/80">
                            <EditableText
                              fieldKey="pricing.table.duration"
                              label="Table — Duration"
                              defaults={loc('Durée', 'Duration', 'Duración', 'المدة')}
                              cms={texts['pricing.table.duration']}
                            />
                          </th>
                          <th className="eyebrow px-5 py-3.5 text-end font-bold text-white/80">
                            <EditableText
                              fieldKey="pricing.table.private"
                              label="Table — Private"
                              defaults={loc('Privé', 'Private', 'Privado', 'خاص')}
                              cms={texts['pricing.table.private']}
                            />
                            <span className="mt-0.5 block text-[0.6rem] font-semibold normal-case tracking-normal text-white/45">
                              <EditableText
                                fieldKey="pricing.table.privateHint"
                                label="Table — Private hint"
                                defaults={loc('1 pers.', '1 pax', '1 pers.', '1 شخص')}
                                cms={texts['pricing.table.privateHint']}
                              />
                            </span>
                          </th>
                          <th className="eyebrow px-5 py-3.5 text-end font-bold text-white/80">
                            <EditableText
                              fieldKey="pricing.table.semi"
                              label="Table — Semi-private"
                              defaults={loc('Semi-privé', 'Semi-private', 'Semi-privado', 'شبه خاص')}
                              cms={texts['pricing.table.semi']}
                            />
                            <span className="mt-0.5 block text-[0.6rem] font-semibold normal-case tracking-normal text-white/45">
                              <EditableText
                                fieldKey="pricing.table.semiHint"
                                label="Table — Semi hint"
                                defaults={loc('2–3 pers.', '2–3 pax', '2–3 pers.', '2–3 أشخاص')}
                                cms={texts['pricing.table.semiHint']}
                              />
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => (
                          <EditablePricingRow
                            key={`${sport}-${row.id || row.hours}`}
                            as="tr"
                            row={row}
                            allRows={rows}
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
                                  <EditableText
                                    fieldKey="pricing.row.extraLabel"
                                    label="Extra hour label"
                                    defaults={loc('heure suppl.', 'extra hour', 'hora extra', 'ساعة إضافية')}
                                    cms={texts['pricing.row.extraLabel']}
                                  />
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
                          </EditablePricingRow>
                        ))}
                      </tbody>
                    </table>
                    <div className="border-t border-[#072A5A]/8 p-3 md:block">
                      <AddPricingRowButton allRows={rows} />
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <EditableLink
                      fieldKey="pricing.panel.bookCta"
                      label="Book this course CTA"
                      href={`/${locale}/contact`}
                      className="btn-pill-sm bg-[#0B1F3B] text-small text-white hover:bg-[#0057D1]"
                      defaults={loc(
                        'Réserver ce cours',
                        'Book this course',
                        'Reservar este curso',
                        'احجز هذا الدرس',
                      )}
                      cms={texts['pricing.panel.bookCta']}
                      after={<ArrowRight className="h-4 w-4" />}
                    />
                    <EditableText
                      fieldKey="pricing.panel.rateNote"
                      label="Same rate card note"
                      as="p"
                      className="text-xs text-[#7A8AA3]"
                      defaults={loc(
                        'Même grille pour Wingfoil et Kitesurf.',
                        'Same rate card for Wingfoil and Kitesurf.',
                        'Misma tarifa para Wingfoil y Kitesurf.',
                        'نفس الأسعار للوينج فويل والكايت سيرف.',
                      )}
                      cms={texts['pricing.panel.rateNote']}
                    />
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
                      <EditableText
                        fieldKey="pricing.mediaPack.short"
                        label="Media pack short"
                        as="p"
                        className="text-small font-bold text-[#072A5A]"
                        defaults={pack.short}
                        cms={texts['pricing.mediaPack.short']}
                      />
                      <EditableText
                        fieldKey="pricing.mediaPack.desc"
                        label="Media pack description"
                        as="p"
                        className="text-xs text-[#7A8AA3] mt-0.5 line-clamp-1"
                        defaults={pack.desc}
                        cms={texts['pricing.mediaPack.desc']}
                      />
                    </div>
                    <EditableText
                      fieldKey="pricing.mediaPack.priceLabel"
                      label="Media pack price"
                      as="span"
                      className="shrink-0 rounded-full bg-[#072A5A] px-3 py-1 text-xs font-bold text-white"
                      defaults={loc(pack.priceLabel, pack.priceLabel, pack.priceLabel, pack.priceLabel)}
                      cms={texts['pricing.mediaPack.priceLabel']}
                    />
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
                  <EditableText
                    fieldKey="pricing.mediaPack.eyebrow"
                    label="Media pack eyebrow"
                    as="p"
                    className="eyebrow text-[#0046A4]"
                    defaults={loc('Option session', 'Session option', 'Opción de sesión', 'خيار الجلسة')}
                    cms={texts['pricing.mediaPack.eyebrow']}
                  />
                  <EditableText
                    fieldKey="pricing.mediaPack.title"
                    label="Media pack title"
                    as="h3"
                    className="font-heading text-card-title text-[#072A5A] mt-3"
                    defaults={pack.title}
                    cms={texts['pricing.mediaPack.title']}
                  />
                  <p className="text-small text-[#3D4F6F] mt-3 max-w-xl">
                    <EditableText
                      fieldKey="pricing.mediaPack.desc"
                      label="Media pack description"
                      defaults={pack.desc}
                      cms={texts['pricing.mediaPack.desc']}
                    />{' '}
                    <EditableText
                      fieldKey="pricing.mediaPack.availableOn"
                      label="Media pack available on"
                      defaults={pack.availableOn}
                      cms={texts['pricing.mediaPack.availableOn']}
                    />
                  </p>
                  <ul className="mt-6 space-y-3">
                    {pack.features.map((f, i) => (
                      <li key={f.en || f.fr || i} className="flex items-start gap-3 text-small text-[#072A5A]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0046A4]" aria-hidden />
                        <EditableText
                          fieldKey={`pricing.mediaPack.feature.${i}`}
                          label={`Media pack feature ${i + 1}`}
                          defaults={f}
                          cms={texts[`pricing.mediaPack.feature.${i}`]}
                        />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col items-stretch gap-4 rounded-[22px] border border-[#072A5A]/8 bg-white/80 p-6 text-center sm:items-center lg:p-8">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#072A5A] text-white shadow-[0_12px_30px_rgba(7,42,90,0.25)]">
                    <Clapperboard className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <EditableText
                      fieldKey="pricing.mediaPack.priceLabel"
                      label="Media pack price"
                      as="p"
                      className="font-heading text-4xl font-extrabold tracking-tight text-[#072A5A]"
                      defaults={loc(pack.priceLabel, pack.priceLabel, pack.priceLabel, pack.priceLabel)}
                      cms={texts['pricing.mediaPack.priceLabel']}
                    />
                    <EditableText
                      fieldKey="pricing.mediaPack.perSession"
                      label="Per session label"
                      as="p"
                      className="text-xs font-semibold text-[#7A8AA3] mt-1"
                      defaults={loc('par session', 'per session', 'por sesión', 'لكل جلسة')}
                      cms={texts['pricing.mediaPack.perSession']}
                    />
                  </div>
                  <EditableLink
                    fieldKey="pricing.mediaPack.cta"
                    label="Media pack CTA"
                    href={`/${locale}/contact`}
                    className="btn-pill-sm w-full justify-center bg-[#0B1F3B] text-small text-white hover:bg-[#0057D1] sm:w-auto"
                    defaults={pack.cta}
                    cms={texts['pricing.mediaPack.cta']}
                    after={<ArrowRight className="h-4 w-4" />}
                  />
                </div>
              </div>
            </article>
          </Reveal>

          {/* Additional Services */}
          <div id="extras" className="mt-8 grid scroll-mt-28 grid-cols-1 gap-6 md:grid-cols-3">
            {(
              [
                {
                  id: 'ownGear',
                  Icon: Backpack,
                  title: loc(
                    'Si vous utilisez votre équipement',
                    'If you use your own gear',
                    'Si usas tu propio equipo',
                    'إذا كنت تستخدم معداتك الخاصة',
                  ),
                  desc: loc(
                    'Réduction de 15% sur tous les cours',
                    '15% discount on all courses',
                    '15% descuento en todos los cursos',
                    'خصم 15% على جميع الدروس',
                  ),
                  badge: loc('-15%', '-15%', '-15%', '-15%'),
                  badgeColor: '#25D366',
                  iconColor: '#25D366',
                },
                {
                  id: 'freestyle',
                  Icon: Waves,
                  title: loc(
                    'Coaching Freestyle',
                    'Freestyle Coaching',
                    'Coaching Freestyle',
                    'Freestyle Coaching',
                  ),
                  desc: loc(
                    'Session de coaching avancé',
                    'Advanced coaching session',
                    'Sesión de coaching avanzado',
                    'جلسة تدريب متقدمة',
                  ),
                  badge: loc('€120', '€120', '€120', '€120'),
                  badgeColor: '#C9A66B',
                  iconColor: '#B8925A',
                },
                {
                  id: 'downwind',
                  Icon: Wind,
                  title: loc('Down wind', 'Down wind', 'Down wind', 'Down wind'),
                  desc: loc(
                    'Devis sur mesure selon votre niveau',
                    'Custom quote by level',
                    'Presupuesto personalizado',
                    'عرض سعر مخصص حسب مستواك',
                  ),
                  badge: loc('Devis', 'Quote', 'Presupuesto', 'عرض سعر'),
                  badgeColor: '#0046A4',
                  iconColor: '#0046A4',
                },
              ] as const
            ).map((s, i) => (
              <Reveal key={s.id} delay={i * 110}>
                <div className="card-premium card-lift flex h-full items-start gap-4 p-7">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px]"
                    style={{ backgroundColor: `${s.iconColor}14`, color: s.iconColor }}
                  >
                    <s.Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <EditableText
                        fieldKey={`pricing.extras.${s.id}.title`}
                        label={`Extra — ${s.id} title`}
                        as="h3"
                        className="text-small font-bold text-[#072A5A]"
                        defaults={s.title}
                        cms={texts[`pricing.extras.${s.id}.title`]}
                      />
                      <EditableText
                        fieldKey={`pricing.extras.${s.id}.badge`}
                        label={`Extra — ${s.id} badge`}
                        as="span"
                        className="shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white"
                        style={{ backgroundColor: s.badgeColor }}
                        defaults={s.badge}
                        cms={texts[`pricing.extras.${s.id}.badge`]}
                      />
                    </div>
                    <EditableText
                      fieldKey={`pricing.extras.${s.id}.desc`}
                      label={`Extra — ${s.id} description`}
                      as="p"
                      className="text-xs leading-relaxed text-[#7A8AA3]"
                      defaults={s.desc}
                      cms={texts[`pricing.extras.${s.id}.desc`]}
                    />
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
                <EditableText
                  fieldKey="pricing.inclusions.title"
                  label="Inclusions title"
                  as="span"
                  className="text-small font-bold text-[#072A5A]"
                  defaults={loc(
                    'Inclus pour tous les cours',
                    'Included in all courses',
                    'Incluido en todos los cursos',
                    'مشمول في جميع الدروس',
                  )}
                  cms={texts['pricing.inclusions.title']}
                />
              </div>
              <ul className="space-y-2.5 text-small text-[#3D4F6F] ps-12">
                {(
                  [
                    {
                      key: 'gear',
                      defaults: loc(
                        'Kite ou wing, planche, combinaison, gilet de sécurité, casque et walkie-talkie.',
                        'Kite or wing, board, wetsuit, safety vest, helmet and walkie-talkie.',
                        'Kite o wing, tabla, traje de neopreno, chaleco de seguridad, casco y walkie-talkie.',
                        'كايت أو وينج، لوح، بدلة غوص، سترة نجاة، خوذة وجهاز لاسلكي.',
                      ),
                    },
                    {
                      key: 'seasons',
                      defaults: loc(
                        'Tarifs variables selon les saisons.',
                        'Prices vary by season.',
                        'Precios variables según temporada.',
                        'الأسعار متغيرة حسب المواسم.',
                      ),
                    },
                    {
                      key: 'groups',
                      defaults: loc(
                        'Contactez-nous pour les packages groupes et séjours.',
                        'Contact us for group packages and stays.',
                        'Contáctenos para paquetes grupales y estancias.',
                        'تواصل معنا للباقات الجماعية والإقامات.',
                      ),
                    },
                  ] as const
                ).map((item) => (
                  <li key={item.key}>
                    <EditableText
                      fieldKey={`pricing.inclusions.${item.key}`}
                      label={`Inclusion — ${item.key}`}
                      defaults={item.defaults}
                      cms={texts[`pricing.inclusions.${item.key}`]}
                    />
                  </li>
                ))}
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
          <EditableImage fieldKey="pricingAction" src={ctaSrc} label="Pricing — CTA background" className="absolute inset-0">
            <Image
              src={ctaSrc}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              loading="lazy"
              quality={72}
              className="object-cover"
            />
          </EditableImage>
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
              <EditableText
                fieldKey="pricing.cta.title"
                label="Pricing CTA title"
                as="h2"
                className="font-heading text-section text-white text-balance"
                defaults={loc(
                  'Une question sur nos tarifs ?',
                  'Questions about pricing?',
                  '¿Preguntas sobre nuestros precios?',
                  'هل لديك سؤال عن الأسعار؟',
                )}
                cms={texts['pricing.cta.title']}
              />
              <EditableText
                fieldKey="pricing.cta.subtitle"
                label="Pricing CTA subtitle"
                as="p"
                className="text-body-lg text-white/75 mt-6"
                defaults={loc(
                  'Contactez-nous pour un devis personnalisé',
                  'Contact us for a personalized quote',
                  'Contáctanos para un presupuesto personalizado',
                  'تواصل معنا للحصول على عرض مخصص',
                )}
                cms={texts['pricing.cta.subtitle']}
              />
              <div className="mt-11 flex justify-center">
                <EditableLink
                  fieldKey="pricing.cta.button"
                  label="Pricing CTA button"
                  href={`/${locale}/contact`}
                  className="group btn-pill bg-[#C9A66B] text-[#0B1F3B] hover:bg-[#C9A66B]"
                  defaults={loc('Nous contacter', 'Contact Us', 'Contáctanos', 'تواصل معنا')}
                  cms={texts['pricing.cta.button']}
                  after={
                    <ArrowRight className="h-5 w-5 transition-transform duration-400 group-hover:translate-x-1" />
                  }
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
