'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BedDouble, MapPin, Users } from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'
import { HOTELS, formatEuro, type Hotel, type RoomType } from '@/lib/accommodation'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { EditableLink, EditableText } from '@/components/edit-mode/editable'
import type { Localized } from '@/lib/cms/types'
import { pickLocale } from '@/lib/cms/types'
import { useSiteConfig } from '@/hooks/use-site-config'

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

function RoomCard({
  hotel,
  room,
  index,
}: {
  hotel: Hotel
  room: RoomType
  index: number
}) {
  const { locale } = useTranslations()
  const getText = useLoc()
  const href = `/${locale}/accommodation/${hotel.id}/${room.id}`
  const reserveHref = `/${locale}/accommodation/${hotel.id}/${room.id}/reserve`
  const fromPrice = room.mealPlans[0]?.pricePerNight

  return (
    <Reveal delay={60 + index * 50}>
      <article className="group flex h-full flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_16px_40px_rgba(90,168,255,0.10)] ring-1 ring-[#5AA8FF]/15">
        <Link href={href} className="relative aspect-[16/11] overflow-hidden">
          <Image
            src={room.image}
            alt={pickLocale(room.name, locale)}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
            quality={75}
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#0046A4]">
            {String(index + 1).padStart(2, '0')}
          </span>
        </Link>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="font-heading text-xl font-bold text-[#0046A4]">
            {pickLocale(room.name, locale)}
          </h3>
          <p className="mt-2 flex-1 text-small text-[#3D5A80]">{pickLocale(room.desc, locale)}</p>
          <ul className="mt-4 space-y-2 text-xs font-semibold text-[#0046A4]">
            <li className="flex items-center gap-2">
              <BedDouble className="h-3.5 w-3.5 text-[#5AA8FF]" aria-hidden />
              {pickLocale(room.beds, locale)}
            </li>
            <li className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-[#5AA8FF]" aria-hidden />
              {pickLocale(room.capacity, locale)}
            </li>
          </ul>
          {fromPrice != null && (
            <p className="mt-3 text-small font-bold tabular-nums text-[#0046A4]">
              {getText('Dès', 'From', 'Desde', 'من')} {formatEuro(fromPrice, locale)}
              <span className="font-semibold text-[#5A7AA3]">
                {' '}
                {getText('/ nuit', '/ night', '/ noche', '/ ليلة')}
              </span>
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href={href} className="inline-flex items-center gap-2 text-small font-bold text-[#5AA8FF]">
              {getText('Découvrir', 'Discover', 'Descubrir', 'اكتشف')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href={reserveHref} className="text-small font-bold text-[#0046A4] underline-offset-2 hover:underline">
              {getText('Réserver', 'Book', 'Reservar', 'احجز')}
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  )
}

function HotelBlock({ hotel, index }: { hotel: Hotel; index: number }) {
  const { locale } = useTranslations()
  const getText = useLoc()

  return (
    <section
      id={hotel.id}
      className="scroll-mt-28 border-t border-[#5AA8FF]/15 py-14 sm:py-16 first:border-t-0 first:pt-0"
    >
      <Reveal delay={index * 40}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] lg:col-span-5 lg:aspect-auto lg:min-h-64">
            <Image
              src={hotel.cover}
              alt={pickLocale(hotel.name, locale)}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              quality={75}
            />
          </div>
          <div className="lg:col-span-7">
            <p className="eyebrow text-[#5AA8FF]">
              {getText('Partenaire', 'Partner', 'Partner', 'شريك')}
            </p>
            <h2 className="font-heading mt-3 text-section text-[#0046A4] text-balance">
              {pickLocale(hotel.name, locale)}
            </h2>
            <p className="mt-2 flex items-center gap-2 text-small font-semibold text-[#5A7AA3]">
              <MapPin className="h-4 w-4 text-[#5AA8FF]" aria-hidden />
              {pickLocale(hotel.location, locale)}
            </p>
            <p className="mt-4 max-w-2xl text-body-lg text-[#3D5A80]">
              {pickLocale(hotel.desc, locale)}
            </p>
            <p className="mt-2 text-small font-semibold text-[#0046A4]">
              {pickLocale(hotel.tagline, locale)}
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-10">
        <p className="mb-5 text-small font-semibold text-[#5A7AA3]">
          {getText(
            `${hotel.rooms.length} types de chambres`,
            `${hotel.rooms.length} room types`,
            `${hotel.rooms.length} tipos de habitación`,
            `${hotel.rooms.length} أنواع غرف`,
          )}
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {hotel.rooms.map((room, i) => (
            <RoomCard key={room.id} hotel={hotel} room={room} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function AccommodationContent() {
  const { locale } = useTranslations()
  const { texts } = useSiteConfig()
  const getText = useLoc()
  const contactHref = `/${locale}/contact`
  const hero = HOTELS[0]?.cover || '/Accommodation/dakhla-camp/room-1.webp'

  return (
    <div
      className="bg-[#EAF4FF]"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(90,168,255,0.28), transparent 60%)',
      }}
    >
      <PageHero
        image={hero}
        eyebrow={
          <EditableText
            fieldKey="accommodation.hero.eyebrow"
            label="Accommodation eyebrow"
            defaults={loc('Hébergement', 'Accommodation', 'Alojamiento', 'الإقامة')}
            cms={texts['accommodation.hero.eyebrow']}
          />
        }
        title={
          <EditableText
            fieldKey="accommodation.hero.title"
            label="Accommodation title"
            defaults={loc(
              'Où dormir à Dakhla',
              'Where to stay in Dakhla',
              'Dónde dormir en Dakhla',
              'أين تقيم في الداخلة',
            )}
            cms={texts['accommodation.hero.title']}
          />
        }
        subtitle={
          <EditableText
            fieldKey="accommodation.hero.subtitle"
            label="Accommodation subtitle"
            defaults={loc(
              'Hôtels et camps partenaires — chaque établissement liste ses types de chambres.',
              'Partner hotels and camps — each property lists its room types.',
              'Hoteles y camps partners — cada establecimiento lista sus tipos de habitación.',
              'فنادق ومخيمات شريكة — كل منشأة تعرض أنواع غرفها.',
            )}
            cms={texts['accommodation.hero.subtitle']}
          />
        }
      >
        <div className="mt-8">
          <EditableLink
            fieldKey="accommodation.hero.cta"
            label="Accommodation CTA"
            href={contactHref}
            className="btn-pill bg-[#5AA8FF] text-white hover:bg-[#2D7FF9]"
            defaults={loc(
              'Réserver un séjour',
              'Book a stay',
              'Reservar una estancia',
              'احجز إقامة',
            )}
            cms={texts['accommodation.hero.cta']}
            after={<ArrowRight className="h-4 w-4" />}
          />
        </div>
      </PageHero>

      <div className="container-editorial section-y" data-nav-theme="light">
        <Reveal>
          <p className="eyebrow text-[#5AA8FF]">
            {getText('Nos partenaires', 'Our partners', 'Nuestros partners', 'شركاؤنا')}
          </p>
          <h2 className="font-heading mt-3 max-w-xl text-section text-[#0046A4] text-balance">
            {getText(
              'Hôtels & camps recommandés',
              'Recommended hotels & camps',
              'Hoteles y camps recomendados',
              'فنادق ومخيمات موصى بها',
            )}
          </h2>
        </Reveal>

        {HOTELS.map((hotel, i) => (
          <HotelBlock key={hotel.id} hotel={hotel} index={i} />
        ))}
      </div>

      <section className="border-t border-[#5AA8FF]/15 bg-white" data-nav-theme="light">
        <div className="container-editorial py-14 sm:py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow text-[#5AA8FF]">
                {getText('Besoin d’aide ?', 'Need help?', '¿Necesitas ayuda?', 'تحتاج مساعدة؟')}
              </p>
              <p className="mt-3 max-w-lg text-body-lg text-[#3D5A80]">
                {getText(
                  'On vous oriente vers l’hébergement adapté à votre niveau et à votre budget.',
                  'We’ll point you to lodging that fits your level and budget.',
                  'Te orientamos al alojamiento adecuado a tu nivel y presupuesto.',
                  'نوجّهك للإقامة المناسبة لمستواك وميزانيتك.',
                )}
              </p>
            </div>
            <Link
              href={contactHref}
              className="btn-pill shrink-0 bg-[#5AA8FF] text-white hover:bg-[#2D7FF9]"
            >
              {getText('Nous contacter', 'Contact us', 'Contáctanos', 'تواصل معنا')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
