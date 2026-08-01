'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, Moon, UtensilsCrossed, Home } from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'
import { Reveal } from '@/components/reveal'
import { PACKAGES, PACKAGES_COPY, type LocalizedText, type PackFeatureIcon } from '@/lib/packages'

const FEATURE_ICONS: Record<PackFeatureIcon, typeof Moon> = {
  nights: Moon,
  board: UtensilsCrossed,
  bungalow: Home,
}

const CATEGORY_ORDER = ['kitesurf', 'wingfoil'] as const

export function PackagesSection() {
  const { locale } = useTranslations()
  const lang = (['fr', 'en', 'es', 'ar'].includes(locale) ? locale : 'en') as keyof LocalizedText
  const tr = (text: LocalizedText) => text[lang]

  return (
    <section className="relative overflow-hidden section-y" data-nav-theme="light" style={{ background: "linear-gradient(180deg, #DCEEFF 0%, #FAF8F3 45%, #F6F1E8 100%)" }}>
      <span aria-hidden className="blob -top-32 right-0 h-md w-md bg-[#C9A66B]/10" />

      <div className="container-narrow relative z-10">
        <div className="max-w-2xl">
          <Reveal>
            <p className="eyebrow text-[#0046A4]">{tr(PACKAGES_COPY.eyebrow)}</p>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="font-heading text-section text-[#072A5A] mt-6 text-balance">
              {tr(PACKAGES_COPY.title)}
            </h2>
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
              {PACKAGES.filter((p) => p.category === category).map((pack, i) => (
                <Reveal key={pack.id} delay={i * 110 + ci * 40}>
                  <article className="group card-premium card-lift p-5 sm:p-8">
                    <div className="grid grid-cols-1 gap-7 lg:grid-cols-[260px_1fr_auto] lg:gap-10">
                      {/* Image + badge */}
                      <div className="relative h-56 min-h-48 overflow-hidden rounded-[20px] lg:h-full">
                        <Image
                          src={pack.image}
                          alt={pack.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 260px"
                          loading="lazy"
                          quality={72}
                          className="img-zoom object-cover"
                        />
                        <div
                          aria-hidden
                          className="absolute inset-0"
                          style={{
                            background:
                              'linear-gradient(to top, rgba(7,42,90,.40), transparent 60%)',
                          }}
                        />
                        <span className="eyebrow absolute top-3.5 left-3.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[0.62rem] text-white backdrop-blur-[20px] backdrop-saturate-150">
                          {tr(pack.badge)}
                        </span>
                      </div>

                      {/* Title + description + features */}
                      <div className="min-w-0 lg:py-3">
                        <h3 className="font-heading text-card-title text-[#072A5A]">
                          {pack.title}
                        </h3>
                        <p className="text-small text-[#3D4F6F] mt-3 max-w-md">{tr(pack.desc)}</p>
                        <ul className="mt-6 space-y-2.5">
                          {pack.features.map((feature) => {
                            const Icon = FEATURE_ICONS[feature.icon]
                            return (
                              <li
                                key={feature.icon + tr(feature.text)}
                                className="flex items-center gap-3 text-small font-semibold text-[#072A5A]"
                              >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C9A66B]/12">
                                  <Icon className="h-4 w-4 text-[#B8925A]" />
                                </span>
                                {tr(feature.text)}
                              </li>
                            )
                          })}
                        </ul>
                      </div>

                      {/* Tiers + CTA */}
                      <div className="shrink-0 lg:w-80 lg:border-l lg:border-[#072A5A]/8 lg:pl-10 lg:py-3">
                        <div className="grid grid-cols-2 gap-6">
                          {pack.tiers.map((tier) => (
                            <div key={tr(tier.name)}>
                              <p className="eyebrow text-[0.65rem] text-[#7A8AA3]">
                                {tr(tier.name)}
                              </p>
                              <p className="font-heading text-[1.75rem] font-extrabold tracking-tight text-[#072A5A] mt-2">
                                {tier.price}
                              </p>
                              {tier.perPerson && (
                                <p className="text-xs font-semibold text-[#5AA8FF]">
                                  {tier.perPerson} {tr(PACKAGES_COPY.perPerson)}
                                </p>
                              )}
                              <ul className="mt-3 space-y-1.5">
                                {tier.lines.map((line) => (
                                  <li
                                    key={tr(line)}
                                    className="flex items-start gap-1.5 text-xs leading-relaxed text-[#7A8AA3]"
                                  >
                                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-[#0046A4]" />
                                    {tr(line)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        <Link
                          href={`/${locale}/contact`}
                          className="btn-pill-sm mt-7 w-full bg-[#0B1F3B] text-small text-white hover:bg-[#0057D1]"
                        >
                          {tr(PACKAGES_COPY.book)}
                          <ArrowRight className="h-4 w-4 transition-transform duration-400 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>

                    {/* Perks */}
                    <div className="mt-6 pt-5">
                      <hr className="hairline mb-5" />
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5">
                        {pack.perks.map((perk) => (
                          <span
                            key={tr(perk)}
                            className="flex items-center gap-2 text-xs font-medium text-[#7A8AA3]"
                          >
                            <span className="h-1 w-1 rounded-full bg-[#C9A66B]" />
                            {tr(perk)}
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
