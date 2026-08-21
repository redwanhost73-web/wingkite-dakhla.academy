'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'
import { useSiteConfig } from '@/hooks/use-site-config'
import { Reveal } from '@/components/reveal'
import { EditableLink, EditableText } from '@/components/edit-mode/editable'
import { useEditablePricingRows } from '@/components/edit-mode/editable-pricing'
import type { Localized } from '@/lib/cms/types'

const loc = (fr: string, en: string, es: string, ar: string): Localized => ({ fr, en, es, ar })

/** Compact lesson-rate preview for the home page — not the full pricing page. */
export function HomePricingPreview() {
  const { locale } = useTranslations()
  const { pricing: cmsPricing, texts } = useSiteConfig()
  const allRows = useEditablePricingRows(cmsPricing)
  const rows = allRows.filter((r) => !r.extra).slice(0, 5)

  return (
    <section
      id="pricing-preview"
      className="surface-noise relative overflow-hidden section-y scroll-mt-28"
      data-nav-theme="light"
      style={{ background: 'linear-gradient(180deg, #FAF8F3 0%, #EEF5FC 50%, #FAF8F3 100%)' }}
    >
      <span aria-hidden className="blob -bottom-24 -left-20 h-104 w-104 bg-[#0046A4]/8" />

      <div className="container-editorial relative z-10">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <EditableText
                fieldKey="home.pricing.eyebrow"
                label="Home pricing eyebrow"
                as="p"
                className="eyebrow text-[#0046A4]"
                defaults={loc('Tarifs des cours', 'Lesson rates', 'Tarifas de clases', 'أسعار الدروس')}
                cms={texts['home.pricing.eyebrow']}
              />
            </Reveal>
            <Reveal delay={80}>
              <EditableText
                fieldKey="home.pricing.title"
                label="Home pricing title"
                as="h2"
                className="font-heading text-section text-[#072A5A] mt-6 text-balance"
                defaults={loc(
                  'Des forfaits clairs pour progresser',
                  'Clear packages to progress',
                  'Paquetes claros para progresar',
                  'باقات واضحة للتقدم',
                )}
                cms={texts['home.pricing.title']}
              />
            </Reveal>
            <Reveal delay={140}>
              <EditableText
                fieldKey="home.pricing.subtitle"
                label="Home pricing subtitle"
                as="p"
                className="mt-5 max-w-md text-body text-[#5A6B85]"
                defaults={loc(
                  'Privé (1 personne) ou semi-privé (2–3). Matériel et coaching inclus. Voir la page tarifs pour le détail complet.',
                  'Private (1 person) or semi-private (2–3). Gear and coaching included. See the full pricing page for every option.',
                  'Privado (1 persona) o semi-privado (2–3). Material y coaching incluidos. Consulta la página de precios para el detalle.',
                  'خاص (شخص واحد) أو شبه خاص (2–3). المعدات والتدريب مشمولان. راجع صفحة الأسعار للتفاصيل الكاملة.',
                )}
                cms={texts['home.pricing.subtitle']}
              />
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-8 flex flex-wrap gap-3">
                <EditableLink
                  fieldKey="home.pricing.cta"
                  label="Home pricing CTA"
                  href={`/${locale}/pricing`}
                  className="group btn-pill bg-[#0046A4] text-white hover:bg-[#0057D1]"
                  defaults={loc('Voir tous les tarifs', 'View full pricing', 'Ver todos los precios', 'عرض كل الأسعار')}
                  cms={texts['home.pricing.cta']}
                  after={
                    <ArrowRight className="h-4 w-4 transition-transform duration-400 group-hover:translate-x-1" />
                  }
                />
                <Link
                  href={`/${locale}/contact`}
                  className="btn-pill border border-[#072A5A]/15 bg-white/70 text-[#072A5A] hover:bg-white"
                >
                  {locale === 'fr'
                    ? 'Réserver'
                    : locale === 'es'
                      ? 'Reservar'
                      : locale === 'ar'
                        ? 'احجز'
                        : 'Book'}
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={120}>
              <div className="overflow-hidden rounded-3xl border border-[#0046A4]/10 bg-white/80 shadow-[0_24px_60px_rgba(7,42,90,0.06)] backdrop-blur-sm">
                <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 border-b border-[#E8E1D6] px-5 py-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8A97AB] sm:px-7">
                  <span>
                    {locale === 'fr' ? 'Heures' : locale === 'es' ? 'Horas' : locale === 'ar' ? 'ساعات' : 'Hours'}
                  </span>
                  <span className="text-right">
                    {locale === 'fr' ? 'Privé' : locale === 'es' ? 'Privado' : locale === 'ar' ? 'خاص' : 'Private'}
                  </span>
                  <span className="text-right">
                    {locale === 'fr'
                      ? 'Semi-privé'
                      : locale === 'es'
                        ? 'Semi-privado'
                        : locale === 'ar'
                          ? 'شبه خاص'
                          : 'Semi-private'}
                  </span>
                </div>
                <ul className="divide-y divide-[#EFE8DC]">
                  {rows.map((row) => (
                    <li
                      key={row.id || row.hours}
                      className="grid grid-cols-[1fr_1fr_1fr] items-baseline gap-2 px-5 py-4 sm:px-7"
                    >
                      <span className="font-heading text-lg font-bold tracking-tight text-[#072A5A]">
                        {row.hours}
                      </span>
                      <span className="text-right font-semibold text-[#0046A4]">
                        {row.privEur > 0 ? (
                          <>
                            {row.privEur}€
                            <span className="mt-0.5 block text-[11px] font-medium text-[#8A97AB]">
                              {row.privMad} MAD
                            </span>
                          </>
                        ) : (
                          '—'
                        )}
                      </span>
                      <span className="text-right font-semibold text-[#072A5A]">
                        {row.semiEur > 0 ? (
                          <>
                            {row.semiEur}€
                            <span className="mt-0.5 block text-[11px] font-medium text-[#8A97AB]">
                              {row.semiMad} MAD
                            </span>
                          </>
                        ) : (
                          '—'
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-[#E8E1D6] bg-[#F7F3EC]/70 px-5 py-3 text-xs text-[#5A6B85] sm:px-7">
                  {locale === 'fr'
                    ? 'Wingfoil & kitesurf — mêmes grilles horaires. Packs séjour ci-dessus.'
                    : locale === 'es'
                      ? 'Wingfoil y kitesurf — mismas franjas. Packs de estancia arriba.'
                      : locale === 'ar'
                        ? 'وينج فويل وكايت سيرف — نفس الشبكات. باقات الإقامة أعلاه.'
                        : 'Wingfoil & kitesurf — same hour packs. Stay packages above.'}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
