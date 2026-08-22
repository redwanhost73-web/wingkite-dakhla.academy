'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'
import { useSiteConfig } from '@/hooks/use-site-config'
import {
  EQUIPMENT_RENTAL_ITEMS,
  RENTAL_IMAGES,
  RENTAL_NOTES,
} from '@/lib/equipment-rental'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { EditableLink, EditableText } from '@/components/edit-mode/editable'
import type { Localized } from '@/lib/cms/types'
import { pickLocale } from '@/lib/cms/types'

const loc = (fr: string, en: string, es: string, ar: string): Localized => ({ fr, en, es, ar })

function useLoc() {
  const { locale } = useTranslations()
  return (fr: string, en: string, es: string, ar: string) => {
    if (locale === 'fr') return fr
    if (locale === 'es') return es
    if (locale === 'ar') return ar
    return en
  }
}

export function EquipmentRentalContent() {
  const { locale } = useTranslations()
  const { texts } = useSiteConfig()
  const getText = useLoc()
  const contactHref = `/${locale}/contact`

  return (
    <>
      <PageHero
        image={RENTAL_IMAGES.hero}
        eyebrow={
          <EditableText
            fieldKey="activities.rental.hero.eyebrow"
            label="Rental hero eyebrow"
            defaults={loc(
              'Location de matériel',
              'Equipment rental',
              'Alquiler de material',
              'تأجير المعدات',
            )}
            cms={texts['activities.rental.hero.eyebrow']}
          />
        }
        title={
          <EditableText
            fieldKey="activities.rental.hero.title"
            label="Rental hero title"
            defaults={loc(
              'Équipez-vous et partez',
              'Gear up and go',
              'Equípate y sal',
              'جهّز نفسك وانطلق',
            )}
            cms={texts['activities.rental.hero.title']}
          />
        }
        subtitle={
          <EditableText
            fieldKey="activities.rental.hero.subtitle"
            label="Rental hero subtitle"
            defaults={loc(
              'Kites, planches, ailes, foils et combinaisons — matériel premium entretenu, à la demi-journée ou à la journée.',
              'Kites, boards, wings, foils and wetsuits — premium gear maintained, half-day or full day.',
              'Kites, tablas, alas, foils y trajes — material premium mantenido, media jornada o día.',
              'كايت وألواح وأجنحة وفويلات وبدلات — معدات فاخرة معتنى بها، نصف يوم أو يوم كامل.',
            )}
            cms={texts['activities.rental.hero.subtitle']}
          />
        }
      >
        <div className="mt-8">
          <EditableLink
            fieldKey="activities.rental.hero.cta"
            label="Rental hero CTA"
            href={contactHref}
            className="btn-pill bg-white text-[#072A5A] hover:bg-white/90"
            defaults={loc(
              'Réserver du matériel',
              'Book equipment',
              'Reservar material',
              'احجز معدات',
            )}
            cms={texts['activities.rental.hero.cta']}
            after={<ArrowRight className="h-4 w-4" />}
          />
        </div>
      </PageHero>

      <section className="section-y bg-[#FAF8F3]" data-nav-theme="light">
        <div className="container-editorial">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-6">
              <Reveal>
                <p className="eyebrow text-[#0046A4]">
                  {getText('Parc matériel', 'Gear fleet', 'Parque de material', 'أسطول المعدات')}
                </p>
                <EditableText
                  fieldKey="activities.rental.intro.title"
                  label="Rental intro title"
                  as="h2"
                  className="font-heading text-section text-[#072A5A] mt-4 text-balance"
                  defaults={loc(
                    'Du matériel pro, prêt à rider',
                    'Pro gear, ready to ride',
                    'Material pro, listo para salir',
                    'معدات احترافية جاهزة للركوب',
                  )}
                  cms={texts['activities.rental.intro.title']}
                />
                <EditableText
                  fieldKey="activities.rental.intro.body1"
                  label="Rental intro body 1"
                  as="p"
                  className="text-body-lg text-[#3D4F6F] mt-6"
                  defaults={loc(
                    'Pas besoin de voyager avec tout votre matériel. Nous mettons à disposition un parc d’équipements premium, entretenu quotidiennement et renouvelé chaque saison.',
                    'No need to travel with all your gear. We offer a premium fleet, maintained daily and refreshed each season.',
                    'No hace falta viajar con todo el material. Ofrecemos un parque premium, mantenido a diario y renovado cada temporada.',
                    'لا حاجة للسفر بكل معداتك. نوفر أسطولاً فاخراً يُعتنى به يومياً ويُجدَّد كل موسم.',
                  )}
                  cms={texts['activities.rental.intro.body1']}
                />
                <EditableText
                  fieldKey="activities.rental.intro.body2"
                  label="Rental intro body 2"
                  as="p"
                  className="text-body-lg text-[#3D4F6F] mt-4"
                  defaults={loc(
                    'Notre équipe vous aide à choisir le setup parfait selon votre niveau et les conditions du jour.',
                    'Our team helps you pick the perfect setup for your level and the day’s conditions.',
                    'Nuestro equipo te ayuda a elegir el setup ideal según tu nivel y las condiciones del día.',
                    'فريقنا يساعدك على اختيار الإعداد المثالي حسب مستواك وظروف اليوم.',
                  )}
                  cms={texts['activities.rental.intro.body2']}
                />
              </Reveal>
              <Reveal delay={100}>
                <ul className="mt-8 space-y-3">
                  {[
                    loc(
                      'Matériel premium (Duotone, North, Naish, F-One)',
                      'Premium gear (Duotone, North, Naish, F-One)',
                      'Material premium (Duotone, North, Naish, F-One)',
                      'معدات فاخرة (Duotone, North, Naish, F-One)',
                    ),
                    loc(
                      'Conseils personnalisés sur le choix du matériel',
                      'Personal advice on gear choice',
                      'Consejos personalizados sobre el material',
                      'نصائح شخصية لاختيار المعدات',
                    ),
                    loc(
                      'Location flexible (demi-journée / jour)',
                      'Flexible rental (half-day / day)',
                      'Alquiler flexible (media jornada / día)',
                      'تأجير مرن (نصف يوم / يوم)',
                    ),
                    loc(
                      'Combinaisons et accessoires sur demande',
                      'Wetsuits and accessories on request',
                      'Trajes y accesorios bajo petición',
                      'بدلات وإكسسوارات حسب الطلب',
                    ),
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-small text-[#3D4F6F]">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0046A4]/12 text-[#0046A4]">
                        <Check className="h-3 w-3" aria-hidden />
                      </span>
                      <EditableText
                        fieldKey={`activities.rental.perk${i + 1}`}
                        label={`Rental perk ${i + 1}`}
                        defaults={item}
                        cms={texts[`activities.rental.perk${i + 1}`]}
                      />
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <div className="lg:col-span-6">
              <Reveal delay={80}>
                <div className="grid grid-cols-2 gap-3">
                  {RENTAL_IMAGES.gallery.slice(0, 4).map((src, i) => (
                    <div
                      key={src}
                      className={`relative overflow-hidden rounded-[22px] ${i === 0 ? 'col-span-2 min-h-56' : 'min-h-40'}`}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes={i === 0 ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 25vw'}
                        className="object-cover"
                        loading="lazy"
                        quality={75}
                      />
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-white" data-nav-theme="light">
        <div className="container-editorial">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-[#0046A4]">
                {getText('Tarifs location', 'Rental rates', 'Tarifas alquiler', 'أسعار التأجير')}
              </p>
              <EditableText
                fieldKey="activities.rental.table.title"
                label="Rental table title"
                as="h2"
                className="font-heading text-section text-[#072A5A] mt-4 text-balance"
                defaults={loc(
                  'Location d’équipement',
                  'Equipment rental',
                  'Alquiler de equipo',
                  'تأجير المعدات',
                )}
                cms={texts['activities.rental.table.title']}
              />
              <EditableText
                fieldKey="activities.rental.table.subtitle"
                label="Rental table subtitle"
                as="p"
                className="text-body-lg text-[#3D4F6F] mt-5"
                defaults={loc(
                  'Tout l’équipement nécessaire pour vos sessions, du set complet aux planches seules.',
                  'Everything you need for your sessions — from full sets to boards only.',
                  'Todo el equipo para tus sesiones, del set completo a tablas sueltas.',
                  'كل ما تحتاجه لجلساتك — من الأطقم الكاملة إلى الألواح فقط.',
                )}
                cms={texts['activities.rental.table.subtitle']}
              />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-[22px] border border-[#072A5A]/8 shadow-[0_20px_50px_rgba(0,70,164,0.08)]">
              <table className="w-full border-collapse text-start">
                <thead>
                  <tr className="bg-[#0B1F3B] text-white">
                    <th className="eyebrow px-5 py-3.5 text-start font-bold text-white/80">
                      {getText('Matériel', 'Equipment', 'Material', 'المعدات')}
                    </th>
                    <th className="eyebrow px-5 py-3.5 text-end font-bold text-white/80">
                      {getText('½ Jour', '½ Day', '½ Día', 'نصف يوم')}
                    </th>
                    <th className="eyebrow px-5 py-3.5 text-end font-bold text-white/80">
                      {getText('1 Jour', '1 Day', '1 Día', 'يوم واحد')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {EQUIPMENT_RENTAL_ITEMS.map((item, i) => (
                    <tr
                      key={item.id}
                      className={
                        i % 2 === 0
                          ? 'border-t border-[#072A5A]/6 bg-white'
                          : 'border-t border-[#072A5A]/6 bg-[#FAF8F3]'
                      }
                    >
                      <td className="px-5 py-3.5 font-heading text-small font-bold text-[#072A5A]">
                        {pickLocale(item.name, locale)}
                      </td>
                      <td className="px-5 py-3.5 text-end font-heading text-lg font-extrabold text-[#072A5A]">
                        {item.halfDayEur}€
                      </td>
                      <td className="px-5 py-3.5 text-end font-heading text-lg font-extrabold text-[#072A5A]">
                        {item.dayEur}€
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <ul className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3">
              {RENTAL_NOTES.map((note, i) => (
                <li
                  key={i}
                  className="rounded-full border border-[#072A5A]/10 bg-[#FAF8F3] px-4 py-2 text-xs font-semibold text-[#3D4F6F]"
                >
                  {pickLocale(note, locale)}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={contactHref}
                className="btn-pill bg-[#0B1F3B] text-white hover:bg-[#0057D1]"
              >
                {getText('Demander une location', 'Request a rental', 'Solicitar alquiler', 'اطلب تأجيراً')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/${locale}/activities/wingfoil`}
                className="btn-pill border border-[#072A5A]/15 bg-white text-[#072A5A] hover:bg-[#FAF8F3]"
              >
                {getText('Cours Wingfoil', 'Wingfoil lessons', 'Clases Wingfoil', 'دروس وينج فويل')}
              </Link>
              <Link
                href={`/${locale}/activities/kitesurf`}
                className="btn-pill border border-[#072A5A]/15 bg-white text-[#072A5A] hover:bg-[#FAF8F3]"
              >
                {getText('Cours Kitesurf', 'Kitesurf lessons', 'Clases Kitesurf', 'دروس كايت سيرف')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
