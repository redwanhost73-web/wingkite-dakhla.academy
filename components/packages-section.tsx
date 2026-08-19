'use client'

import Image from 'next/image'
import { ArrowRight, Check, Moon, UtensilsCrossed, Home } from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'
import { useSiteConfig } from '@/hooks/use-site-config'
import { Reveal } from '@/components/reveal'
import {
  EditableImage,
  EditableLink,
  EditableText,
  useEditableImageSrc,
} from '@/components/edit-mode/editable'
import { PACKAGES_COPY, type LocalizedText, type PackFeatureIcon } from '@/lib/packages'
import { packCoverFieldKey } from '@/lib/cms/content-lists'
import type { Localized } from '@/lib/cms/types'

const FEATURE_ICONS: Record<PackFeatureIcon, typeof Moon> = {
  nights: Moon,
  board: UtensilsCrossed,
  bungalow: Home,
}

const CATEGORY_ORDER = ['wingfoil', 'kitesurf'] as const

function asLocalized(text: LocalizedText): Localized {
  return { fr: text.fr, en: text.en, es: text.es, ar: text.ar }
}

function PackCover({ packId, title, image }: { packId: string; title: string; image: string }) {
  const fieldKey = packCoverFieldKey(packId)
  const src = useEditableImageSrc(fieldKey, image)
  const remote = /^https?:\/\//.test(src)
  return (
    <EditableImage fieldKey={fieldKey} src={src} label={`${title} cover`} className="absolute inset-0">
      <Image
        src={src}
        alt={title}
        fill
        sizes="(max-width: 1024px) 100vw, 260px"
        loading="lazy"
        quality={72}
        unoptimized={remote}
        className="img-zoom object-cover"
      />
    </EditableImage>
  )
}

export function PackagesSection() {
  const { locale } = useTranslations()
  const { texts, packages } = useSiteConfig()

  return (
    <section
      id="packages"
      className="relative overflow-hidden section-y scroll-mt-28"
      data-nav-theme="light"
      style={{ background: 'linear-gradient(180deg, #DCEEFF 0%, #FAF8F3 45%, #F6F1E8 100%)' }}
    >
      <span aria-hidden className="blob -top-32 right-0 h-md w-md bg-[#C9A66B]/10" />

      <div className="container-narrow relative z-10">
        <div className="max-w-2xl">
          <Reveal>
            <EditableText
              fieldKey="pricing.packages.eyebrow"
              label="Packages eyebrow"
              as="p"
              className="eyebrow text-[#0046A4]"
              defaults={asLocalized(PACKAGES_COPY.eyebrow)}
              cms={texts['pricing.packages.eyebrow']}
            />
          </Reveal>
          <Reveal delay={90}>
            <EditableText
              fieldKey="pricing.packages.title"
              label="Packages title"
              as="h2"
              className="font-heading text-section text-[#072A5A] mt-6 text-balance"
              defaults={asLocalized(PACKAGES_COPY.title)}
              cms={texts['pricing.packages.title']}
            />
          </Reveal>
        </div>

        {CATEGORY_ORDER.map((category, ci) => (
          <div key={category} className="mt-16 first:mt-14 lg:mt-24">
            <Reveal>
              <div className="flex items-center gap-5">
                <span className="eyebrow rounded-full bg-[#0B1F3B] px-4 py-2 text-[0.7rem] text-white">
                  {category}
                </span>
                <hr className="hairline flex-1" />
              </div>
            </Reveal>

            <div className="mt-9 space-y-7 lg:space-y-8">
              {packages.filter((p) => p.category === category).map((pack, i) => (
                <Reveal key={pack.id} delay={i * 110 + ci * 40}>
                  <article className="group card-premium card-lift p-5 sm:p-8">
                    <div className="grid grid-cols-1 gap-7 lg:grid-cols-[260px_1fr_auto] lg:gap-10">
                      <div className="relative h-56 min-h-48 overflow-hidden rounded-[20px] lg:h-full">
                        <PackCover packId={pack.id} title={pack.title} image={pack.image} />
                        <div
                          aria-hidden
                          className="absolute inset-0"
                          style={{
                            background:
                              'linear-gradient(to top, rgba(7,42,90,.40), transparent 60%)',
                          }}
                        />
                        <EditableText
                          fieldKey={`pricing.packages.${pack.id}.badge`}
                          label={`${pack.title} badge`}
                          as="span"
                          className="eyebrow absolute top-3.5 left-3.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[0.62rem] text-white backdrop-blur-[20px] backdrop-saturate-150"
                          defaults={asLocalized(pack.badge)}
                          cms={texts[`pricing.packages.${pack.id}.badge`]}
                        />
                      </div>

                      <div className="min-w-0 lg:py-3">
                        <EditableText
                          fieldKey={`pricing.packages.${pack.id}.title`}
                          label={`${pack.title} title`}
                          as="h3"
                          className="font-heading text-card-title text-[#072A5A]"
                          defaults={{
                            fr: pack.title,
                            en: pack.title,
                            es: pack.title,
                            ar: pack.title,
                          }}
                          cms={texts[`pricing.packages.${pack.id}.title`]}
                        />
                        <EditableText
                          fieldKey={`pricing.packages.${pack.id}.desc`}
                          label={`${pack.title} description`}
                          as="p"
                          className="text-small text-[#3D4F6F] mt-3 max-w-md"
                          defaults={asLocalized(pack.desc)}
                          cms={texts[`pricing.packages.${pack.id}.desc`]}
                        />
                        <ul className="mt-6 space-y-2.5">
                          {pack.features.map((feature, fi) => {
                            const Icon = FEATURE_ICONS[feature.icon]
                            return (
                              <li
                                key={`${pack.id}-${feature.icon}-${fi}`}
                                className="flex items-center gap-3 text-small font-semibold text-[#072A5A]"
                              >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C9A66B]/12">
                                  <Icon className="h-4 w-4 text-[#B8925A]" />
                                </span>
                                <EditableText
                                  fieldKey={`pricing.packages.${pack.id}.feature.${fi}`}
                                  label={`${pack.title} feature ${fi + 1}`}
                                  defaults={asLocalized(feature.text)}
                                  cms={texts[`pricing.packages.${pack.id}.feature.${fi}`]}
                                />
                              </li>
                            )
                          })}
                        </ul>
                      </div>

                      <div className="shrink-0 lg:w-80 lg:border-l lg:border-[#072A5A]/8 lg:pl-10 lg:py-3">
                        <div className="grid grid-cols-2 gap-6">
                          {pack.tiers.map((tier, ti) => (
                            <div key={`${pack.id}-tier-${ti}`}>
                              <EditableText
                                fieldKey={`pricing.packages.${pack.id}.tier.${ti}.name`}
                                label={`${pack.title} tier ${ti + 1} name`}
                                as="p"
                                className="eyebrow text-[0.65rem] text-[#7A8AA3]"
                                defaults={asLocalized(tier.name)}
                                cms={texts[`pricing.packages.${pack.id}.tier.${ti}.name`]}
                              />
                              <EditableText
                                fieldKey={`pricing.packages.${pack.id}.tier.${ti}.price`}
                                label={`${pack.title} tier ${ti + 1} price`}
                                as="p"
                                className="font-heading text-[1.75rem] font-extrabold tracking-tight text-[#072A5A] mt-2"
                                defaults={{
                                  fr: tier.price,
                                  en: tier.price,
                                  es: tier.price,
                                  ar: tier.price,
                                }}
                                cms={texts[`pricing.packages.${pack.id}.tier.${ti}.price`]}
                              />
                              {tier.perPerson && (
                                <p className="text-xs font-semibold text-[#5AA8FF]">
                                  <EditableText
                                    fieldKey={`pricing.packages.${pack.id}.tier.${ti}.perPerson`}
                                    label={`${pack.title} tier ${ti + 1} per person`}
                                    defaults={{
                                      fr: tier.perPerson,
                                      en: tier.perPerson,
                                      es: tier.perPerson,
                                      ar: tier.perPerson,
                                    }}
                                    cms={texts[`pricing.packages.${pack.id}.tier.${ti}.perPerson`]}
                                  />{' '}
                                  <EditableText
                                    fieldKey="pricing.packages.perPerson"
                                    label="Packages per person suffix"
                                    defaults={asLocalized(PACKAGES_COPY.perPerson)}
                                    cms={texts['pricing.packages.perPerson']}
                                  />
                                </p>
                              )}
                              <ul className="mt-3 space-y-1.5">
                                {tier.lines.map((line, li) => (
                                  <li
                                    key={`${pack.id}-tier-${ti}-line-${li}`}
                                    className="flex items-start gap-1.5 text-xs leading-relaxed text-[#7A8AA3]"
                                  >
                                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-[#0046A4]" />
                                    <EditableText
                                      fieldKey={`pricing.packages.${pack.id}.tier.${ti}.line.${li}`}
                                      label={`${pack.title} tier line`}
                                      defaults={asLocalized(line)}
                                      cms={
                                        texts[
                                          `pricing.packages.${pack.id}.tier.${ti}.line.${li}`
                                        ]
                                      }
                                    />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        <EditableLink
                          fieldKey="pricing.packages.book"
                          label="Packages book CTA"
                          href={`/${locale}/contact`}
                          className="btn-pill-sm mt-7 w-full bg-[#0B1F3B] text-small text-white hover:bg-[#0057D1]"
                          defaults={asLocalized(PACKAGES_COPY.book)}
                          cms={texts['pricing.packages.book']}
                          after={
                            <ArrowRight className="h-4 w-4 transition-transform duration-400 group-hover:translate-x-1" />
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-6 pt-5">
                      <hr className="hairline mb-5" />
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5">
                        {pack.perks.map((perk, pi) => (
                          <span
                            key={`${pack.id}-perk-${pi}`}
                            className="flex items-center gap-2 text-xs font-medium text-[#7A8AA3]"
                          >
                            <span className="h-1 w-1 rounded-full bg-[#C9A66B]" />
                            <EditableText
                              fieldKey={`pricing.packages.${pack.id}.perk.${pi}`}
                              label={`${pack.title} perk ${pi + 1}`}
                              defaults={asLocalized(perk)}
                              cms={texts[`pricing.packages.${pack.id}.perk.${pi}`]}
                            />
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
