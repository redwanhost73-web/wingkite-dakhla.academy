'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/lib/i18n-context'
import { useSiteConfig } from '@/hooks/use-site-config'

import { DEFAULT_IMAGES } from '@/lib/site-config'

export function PricingContent() {
  const { t, locale } = useTranslations()
  const { pricing: rows, images } = useSiteConfig()
  const heroBg = images.pricingHero || DEFAULT_IMAGES.pricingHero
  const ctaImg = images.pricingAction || DEFAULT_IMAGES.pricingAction
  const fr = locale === 'fr'
  const getText = (frText: string, enText: string, esText?: string, arText?: string) => {
    if (locale === 'fr') return frText
    if (locale === 'es') return esText || enText
    if (locale === 'ar') return arText || enText
    return enText
  }

  return (
    <div className="overflow-hidden">

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative h-72 sm:h-96 flex items-end">
        <Image src={heroBg} alt="Dakhla lagoon wingfoil" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="relative z-10 px-6 sm:px-12 lg:px-20 pb-14 max-w-7xl w-full mx-auto">
          <p className="text-[#E5A423] text-xs font-bold uppercase tracking-widest mb-2">
            Wing Kite Dakhla Academy
          </p>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">
            {getText('Nos Tarifs', 'Our Pricing', 'Nuestros Precios', 'أسعارنا')}
          </h1>
          <p className="text-white/70 mt-3 text-lg max-w-lg">
            {getText(
              'Tarifs valables selon les saisons',
              'Prices valid by season',
              'Precios válidos según temporada',
              'الأسعار صالحة حسب الموسم'
            )}
          </p>
        </div>
      </section>

      {/* ─── PRICING CARDS ────────────────────────────────────────────────── */}
      <section className="bg-[#f7f8fa] py-20 px-6 sm:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a1a2e] mb-3">
              {getText('Cours Wingfoil & Kitesurf', 'Wingfoil & Kitesurf Courses', 'Cursos Wingfoil & Kitesurf', 'دروس وينج فويل وكايت سيرف')}
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              {getText(
                'Choisissez votre formule. Tout le matériel est inclus.',
                'Choose your package. All equipment included.',
                'Elige tu paquete. Todo el material incluido.',
                'اختر باقتك. جميع المعدات مشمولة.'
              )}
            </p>
          </div>

          {/* Two pricing cards side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

            {/* Semi-Private Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-black text-[#1a1a2e]">
                    {getText('Cours Semi privé', 'Semi-Private Lessons', 'Clases Semi privadas', 'دروس شبه خاصة')}
                  </h3>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#1E5AA8] bg-blue-50 px-3 py-1 rounded-full">
                    {getText('Max. 3 pers.', 'Max. 3 pax', 'Máx. 3 pers.', 'Max. 3 pers.')}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">
                  {getText(
                    'Partagez l\'expérience en petit groupe',
                    'Share the experience in a small group',
                    'Comparte la experiencia en grupo reducido',
                    'شارك التجربة في مجموعة صغيرة'
                  )}
                </p>
              </div>
              <div className="px-8 py-4">
                {rows.map((row) => (
                  <div
                    key={`semi-${row.hours}`}
                    className={`flex items-center justify-between py-3.5 ${row.extra ? 'border-t border-dashed border-gray-200 mt-1' : 'border-b border-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${row.extra ? 'bg-gray-100 text-gray-500' : 'bg-[#EFF4FC] text-[#1E5AA8]'}`}>
                        {row.hours}
                      </span>
                      {row.extra && (
                        <span className="text-xs text-gray-400 italic">
                          {getText('heure suppl.', 'extra hour', 'hora extra', 'ساعة إضافية')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-black text-[#1E5AA8]">{row.semiEur} €</span>
                      <span className="text-sm font-semibold text-[#E5A423] bg-amber-50 px-2.5 py-1 rounded-lg">
                        {row.semiMad} MAD
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Private Card */}
            <div className="bg-[#1E5AA8] rounded-3xl shadow-xl overflow-hidden relative">
              <div className="absolute top-5 right-5">
                <span className="bg-[#E5A423] text-black text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full">
                  {getText('Recommandé', 'Recommended', 'Recomendado', 'موصى به')}
                </span>
              </div>
              <div className="px-8 pt-8 pb-6 border-b border-white/10">
                <h3 className="text-xl font-black text-white mb-1">
                  {getText('Cours Privé', 'Private Lessons', 'Clases Privadas', 'دروس خاصة')}
                </h3>
                <p className="text-white/60 text-sm">
                  {getText(
                    'Attention exclusive de votre instructeur',
                    'Exclusive attention from your instructor',
                    'Atención exclusiva de tu instructor',
                    'اهتمام حصري من مدربك'
                  )}
                </p>
              </div>
              <div className="px-8 py-4">
                {rows.map((row) => (
                  <div
                    key={`priv-${row.hours}`}
                    className={`flex items-center justify-between py-3.5 ${row.extra ? 'border-t border-dashed border-white/10 mt-1' : 'border-b border-white/5'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${row.extra ? 'bg-white/10 text-white/50' : 'bg-white/15 text-white'}`}>
                        {row.hours}
                      </span>
                      {row.extra && (
                        <span className="text-xs text-white/40 italic">
                          {getText('heure suppl.', 'extra hour', 'hora extra', 'ساعة إضافية')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-black text-white">{row.privEur} €</span>
                      <span className="text-sm font-semibold text-[#E5A423] bg-white/10 px-2.5 py-1 rounded-lg">
                        {row.privMad} MAD
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              {
                icon: '🎒',
                title: getText('Si vous utilisez votre équipement', 'If you use your own gear', 'Si usas tu propio equipo', 'إذا كنت تستخدم معداتك الخاصة'),
                desc: getText('Réduction de 15% sur tous les cours', '15% discount on all courses', '15% descuento en todos los cursos', 'خصم 15% على جميع الدروس'),
                badge: '-15%',
                badgeColor: '#25D366',
              },
              {
                icon: '🏄',
                title: getText('Coaching Freestyle', 'Freestyle Coaching', 'Coaching Freestyle', 'Freestyle Coaching'),
                desc: getText('Session de coaching avancé', 'Advanced coaching session', 'Sesión de coaching avanzado', 'جلسة تدريب متقدمة'),
                badge: '€120',
                badgeColor: '#E5A423',
              },
              {
                icon: '🌊',
                title: 'Down wind',
                desc: getText('Devis sur mesure selon votre niveau', 'Custom quote by level', 'Presupuesto personalizado', 'عرض سعر مخصص حسب مستواك'),
                badge: getText('Devis', 'Quote', 'Presupuesto', 'عرض سعر'),
                badgeColor: '#1E5AA8',
              },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
                <span className="text-2xl">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-[#1a1a2e] text-sm">{s.title}</h3>
                    <span className="shrink-0 px-2.5 py-0.5 rounded-full text-white font-bold text-xs" style={{ backgroundColor: s.badgeColor }}>
                      {s.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="bg-white border border-blue-100 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-[#EFF4FC] flex items-center justify-center">
                <Check className="h-4 w-4 text-[#1E5AA8]" />
              </span>
              <span className="font-bold text-[#1a1a2e] text-sm">
                {getText('Inclus pour tous les cours', 'Included in all courses', 'Incluido en todos los cursos', 'مشمول في جميع الدروس')}
              </span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 pl-11">
              <li>{getText('Kite ou wing, planche, combinaison, gilet de sécurité.', 'Kite or wing, board, wetsuit, safety vest.', 'Kite o wing, tabla, traje de neopreno, chaleco de seguridad.', 'كايت أو وينج، لوح، بدلة غوص، سترة نجاة.')}</li>
              <li>{getText('Tarifs variables selon les saisons.', 'Prices vary by season.', 'Precios variables según temporada.', 'الأسعار متغيرة حسب المواسم.')}</li>
              <li>{getText('Contactez-nous pour les packages groupes et séjours.', 'Contact us for group packages and stays.', 'Contáctenos para paquetes grupales y estancias.', 'تواصل معنا للباقات الجماعية والإقامات.')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src={ctaImg} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#1a1a2e]/80" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5">
            {t('pricing.cta.title')}
          </h2>
          <p className="text-white/75 text-lg mb-10 max-w-xl mx-auto">
            {t('pricing.cta.subtitle')}
          </p>
          <Button
            asChild
            size="lg"
            style={{ backgroundColor: '#E5A423', color: '#1a1a1a' }}
            className="font-bold text-base h-14 px-10 rounded-xl hover:opacity-90 transition-opacity shadow-xl"
          >
            <Link href={`/${locale}/contact`}>
              {t('pricing.cta.button')} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
