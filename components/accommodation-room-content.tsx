'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BedDouble, Check, ChevronLeft, ChevronRight, MapPin, Users } from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'
import {
  formatEuro,
  getHotel,
  getRoom,
  HOUSE_RULES,
  type Hotel,
  type RoomType,
} from '@/lib/accommodation'
import { Reveal } from '@/components/reveal'
import { pickLocale } from '@/lib/cms/types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { ActivityStoryProvider, useActivityStory } from '@/components/activity-story'
import { cn } from '@/lib/utils'

function useLoc() {
  const { locale } = useTranslations()
  return (fr: string, en: string, es: string, ar: string) => {
    if (locale === 'fr') return fr
    if (locale === 'es') return es
    if (locale === 'ar') return ar
    return en
  }
}

export function AccommodationRoomContent({
  hotelId,
  roomId,
}: {
  hotelId: string
  roomId: string
}) {
  return (
    <ActivityStoryProvider>
      <AccommodationRoomInner hotelId={hotelId} roomId={roomId} />
    </ActivityStoryProvider>
  )
}

function AccommodationRoomInner({
  hotelId,
  roomId,
}: {
  hotelId: string
  roomId: string
}) {
  const { locale } = useTranslations()
  const getText = useLoc()
  const hotel = getHotel(hotelId)
  const room = getRoom(hotelId, roomId)

  if (!hotel || !room) return null

  const gallery = room.gallery.length ? room.gallery : [room.image]
  const listHref = `/${locale}/accommodation#${hotel.id}`
  const reserveHref = `/${locale}/accommodation/${hotel.id}/${room.id}/reserve`
  const fromPrice = room.mealPlans[0]?.pricePerNight

  return (
    <div
      className="bg-[#EAF4FF]"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(90,168,255,0.28), transparent 60%)',
      }}
    >
      <div className="container-editorial pt-28 pb-10 sm:pt-32 sm:pb-12" data-nav-theme="light">
        <Reveal>
          <Link
            href={listHref}
            className="inline-flex items-center gap-2 text-small font-semibold text-[#5A7AA3] transition-colors hover:text-[#0046A4]"
          >
            <ArrowLeft className="h-4 w-4" />
            {pickLocale(hotel.name, locale)}
          </Link>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <RoomGallery
                images={gallery}
                alt={pickLocale(room.name, locale)}
                title={pickLocale(room.name, locale)}
              />
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={60}>
              <p className="eyebrow text-[#5AA8FF]">{pickLocale(hotel.name, locale)}</p>
              <h1 className="font-heading mt-3 text-hero text-[#0046A4] text-balance">
                {pickLocale(room.name, locale)}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-small font-semibold text-[#5A7AA3]">
                <MapPin className="h-4 w-4 text-[#5AA8FF]" aria-hidden />
                {pickLocale(hotel.location, locale)}
              </p>
              <p className="mt-5 text-body-lg text-[#3D5A80]">{pickLocale(room.desc, locale)}</p>

              <ul className="mt-8 space-y-3">
                <li className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-small font-semibold text-[#0046A4] ring-1 ring-[#5AA8FF]/15">
                  <BedDouble className="h-4 w-4 shrink-0 text-[#5AA8FF]" aria-hidden />
                  {pickLocale(room.beds, locale)}
                </li>
                <li className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-small font-semibold text-[#0046A4] ring-1 ring-[#5AA8FF]/15">
                  <Users className="h-4 w-4 shrink-0 text-[#5AA8FF]" aria-hidden />
                  {pickLocale(room.capacity, locale)}
                </li>
              </ul>

              {room.amenities.length > 0 && (
                <ul className="mt-6 space-y-2">
                  {room.amenities.map((a) => (
                    <li
                      key={pickLocale(a, locale)}
                      className="flex items-start gap-2 text-small text-[#3D5A80]"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#5AA8FF]" aria-hidden />
                      {pickLocale(a, locale)}
                    </li>
                  ))}
                </ul>
              )}

              {fromPrice != null && (
                <p className="mt-6 text-small font-semibold text-[#0046A4]">
                  {getText('À partir de', 'From', 'Desde', 'من')}{' '}
                  <span className="text-xl font-bold tabular-nums">
                    {formatEuro(fromPrice, locale)}
                  </span>
                  <span className="text-[#5A7AA3]">
                    {' '}
                    {getText('/ nuit · BB', '/ night · BB', '/ noche · BB', '/ ليلة · إفطار')}
                  </span>
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={reserveHref}
                  className="btn-pill bg-[#5AA8FF] text-white hover:bg-[#2D7FF9]"
                >
                  {getText('Réserver cette chambre', 'Book this room', 'Reservar esta habitación', 'احجز هذه الغرفة')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={listHref}
                  className="btn-pill bg-white text-[#0046A4] ring-1 ring-[#5AA8FF]/25 hover:bg-[#EAF4FF]"
                >
                  {getText('Toutes les chambres', 'All rooms', 'Todas las habitaciones', 'كل الغرف')}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <MealPlansSection room={room} reserveHref={reserveHref} />
      <HouseRulesSection />
      <OtherRooms hotel={hotel} currentRoomId={room.id} />
    </div>
  )
}

function RoomGallery({
  images,
  alt,
  title,
}: {
  images: string[]
  alt: string
  title: string
}) {
  const getText = useLoc()
  const story = useActivityStory()
  const [api, setApi] = useState<CarouselApi>()
  const [index, setIndex] = useState(0)
  const multi = images.length > 1

  const onSelect = useCallback((embla: CarouselApi) => {
    if (!embla) return
    setIndex(embla.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on('select', onSelect)
    api.on('reInit', onSelect)
    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api, onSelect])

  const openFullscreen = (startIndex: number) => {
    story?.openStory({
      images,
      title,
      startIndex,
      showBookCta: false,
    })
  }

  if (!multi) {
    return (
      <button
        type="button"
        onClick={() => openFullscreen(0)}
        className="relative aspect-[16/11] w-full overflow-hidden rounded-3xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5AA8FF]"
      >
        <Image
          src={images[0]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
          quality={78}
        />
      </button>
    )
  }

  return (
    <div className="space-y-3">
      <Carousel
        opts={{ loop: true, align: 'start' }}
        setApi={setApi}
        className="overflow-hidden rounded-3xl"
      >
        <CarouselContent className="-ml-0">
          {images.map((src, i) => (
            <CarouselItem key={src} className="pl-0 basis-full">
              <button
                type="button"
                onClick={() => openFullscreen(i)}
                className="relative aspect-[16/11] w-full overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#5AA8FF]"
                aria-label={getText(
                  `Voir la photo ${i + 1} en grand`,
                  `View photo ${i + 1} fullscreen`,
                  `Ver foto ${i + 1} a pantalla completa`,
                  `عرض الصورة ${i + 1} بملء الشاشة`,
                )}
              >
                <Image
                  src={src}
                  alt={i === 0 ? alt : ''}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  quality={78}
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-between px-3">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#0046A4] shadow-md backdrop-blur-sm transition hover:bg-white"
            aria-label={getText('Photo précédente', 'Previous photo', 'Foto anterior', 'الصورة السابقة')}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#0046A4] shadow-md backdrop-blur-sm transition hover:bg-white"
            aria-label={getText('Photo suivante', 'Next photo', 'Foto siguiente', 'الصورة التالية')}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <span className="absolute bottom-3 right-3 z-10 rounded-full bg-[#0B1F3B]/70 px-3 py-1 text-[0.65rem] font-bold tabular-nums text-white backdrop-blur-sm">
          {index + 1} / {images.length}
        </span>
      </Carousel>

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.map((src, i) => {
          const active = i === index
          return (
            <button
              key={src}
              type="button"
              onClick={() => api?.scrollTo(i)}
              className={cn(
                'relative h-16 w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition sm:h-[4.5rem] sm:w-24',
                active
                  ? 'ring-[#5AA8FF] opacity-100'
                  : 'ring-transparent opacity-70 hover:opacity-100',
              )}
              aria-label={getText(
                `Aller à la photo ${i + 1}`,
                `Go to photo ${i + 1}`,
                `Ir a la foto ${i + 1}`,
                `الانتقال إلى الصورة ${i + 1}`,
              )}
              aria-current={active}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
                loading="lazy"
                quality={70}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MealPlansSection({ room, reserveHref }: { room: RoomType; reserveHref: string }) {
  const { locale } = useTranslations()
  const getText = useLoc()

  return (
    <section className="border-t border-[#5AA8FF]/15" data-nav-theme="light">
      <div className="container-editorial py-14 sm:py-16">
        <Reveal>
          <p className="eyebrow text-[#5AA8FF]">
            {getText('Tarifs / nuit', 'Rates / night', 'Tarifas / noche', 'الأسعار / ليلة')}
          </p>
          <h2 className="font-heading mt-3 text-section text-[#0046A4]">
            {getText('Formules repas', 'Meal plans', 'Pensiones', 'خطط الوجبات')}
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {room.mealPlans.map((plan, i) => (
            <Reveal key={plan.id} delay={40 + i * 40}>
              <div className="flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-[#5AA8FF]/15">
                <p className="font-heading text-lg font-bold text-[#0046A4]">
                  {pickLocale(plan.name, locale)}
                </p>
                <p className="mt-1 text-xs text-[#5A7AA3]">{pickLocale(plan.includes, locale)}</p>
                <p className="mt-4 text-2xl font-bold tabular-nums text-[#0046A4]">
                  {formatEuro(plan.pricePerNight, locale)}
                </p>
                <Link
                  href={reserveHref}
                  className="mt-5 inline-flex items-center gap-2 text-small font-bold text-[#5AA8FF]"
                >
                  {getText('Réserver', 'Book', 'Reservar', 'احجز')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function HouseRulesSection() {
  const { locale } = useTranslations()
  const getText = useLoc()

  return (
    <section className="border-t border-[#5AA8FF]/15 bg-white" data-nav-theme="light">
      <div className="container-editorial py-14 sm:py-16">
        <Reveal>
          <p className="eyebrow text-[#5AA8FF]">
            {getText('Règlement', 'House rules', 'Normas de la casa', 'قواعد المنزل')}
          </p>
          <h2 className="font-heading mt-3 text-section text-[#0046A4]">
            {getText('Pour un séjour agréable', 'For a pleasant stay', 'Para una estancia agradable', 'لإقامة ممتعة')}
          </h2>
        </Reveal>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOUSE_RULES.map((rule, i) => (
            <Reveal key={pickLocale(rule.label, locale)} delay={30 + i * 30}>
              <li className="rounded-2xl bg-[#EAF4FF] px-5 py-4">
                <p className="text-small font-bold text-[#0046A4]">
                  {pickLocale(rule.label, locale)}
                </p>
                <p className="mt-1 text-xs text-[#3D5A80]">{pickLocale(rule.detail, locale)}</p>
              </li>
            </Reveal>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-small text-[#5A7AA3]">
          {getText(
            'Merci de respecter l’espace et les autres voyageurs. Nous sommes là pour rendre votre séjour aussi agréable que possible.',
            'Thank you for respecting our space and other guests. We are here to make your stay as pleasant as possible.',
            'Gracias por respetar el espacio y a los demás huéspedes. Estamos aquí para hacer tu estancia lo más agradable posible.',
            'شكراً لاحترام المكان والضيوف الآخرين. نحن هنا لجعل إقامتك ممتعة قدر الإمكان.',
          )}
        </p>
      </div>
    </section>
  )
}

function OtherRooms({ hotel, currentRoomId }: { hotel: Hotel; currentRoomId: string }) {
  const { locale } = useTranslations()
  const getText = useLoc()
  const others = hotel.rooms.filter((r) => r.id !== currentRoomId)
  if (others.length === 0) return null

  return (
    <section className="border-t border-[#5AA8FF]/15 bg-[#EAF4FF]" data-nav-theme="light">
      <div className="container-editorial py-14 sm:py-16">
        <Reveal>
          <p className="eyebrow text-[#5AA8FF]">
            {getText('Aussi au camp', 'Also at the camp', 'También en el camp', 'أيضاً في المخيم')}
          </p>
          <h2 className="font-heading mt-3 text-section text-[#0046A4]">
            {getText('Autres types de chambres', 'Other room types', 'Otros tipos de habitación', 'أنواع غرف أخرى')}
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {others.map((room: RoomType, i) => (
            <Reveal key={room.id} delay={40 + i * 40}>
              <Link
                href={`/${locale}/accommodation/${hotel.id}/${room.id}`}
                className="group block overflow-hidden rounded-3xl bg-white ring-1 ring-[#5AA8FF]/15"
              >
                <div className="relative aspect-[16/11] overflow-hidden">
                  <Image
                    src={room.image}
                    alt={pickLocale(room.name, locale)}
                    fill
                    sizes="33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                    quality={70}
                  />
                </div>
                <div className="p-4">
                  <p className="font-heading text-lg font-bold text-[#0046A4]">
                    {pickLocale(room.name, locale)}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#5A7AA3]">
                    {pickLocale(room.capacity, locale)}
                    {room.mealPlans[0]
                      ? ` · ${formatEuro(room.mealPlans[0].pricePerNight, locale)}`
                      : ''}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
