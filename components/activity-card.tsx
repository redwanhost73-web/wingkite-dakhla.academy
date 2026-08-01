'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Images, ArrowUpRight, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Activity, LocalizedText } from '@/lib/activities'
import { useActivityStory } from '@/components/activity-story'

const AUTO_MS = 4200

type Props = {
  activity: Activity
  locale: string
  className?: string
  delay?: number
}

function tr(text: LocalizedText, locale: string) {
  if (locale === 'fr') return text.fr
  if (locale === 'es') return text.es
  if (locale === 'ar') return text.ar
  return text.en
}

function viewPhotosLabel(locale: string) {
  if (locale === 'fr') return 'Voir toutes les photos'
  if (locale === 'es') return 'Ver todas las fotos'
  if (locale === 'ar') return 'عرض كل الصور'
  return 'View all photos'
}

function viewPricingLabel(locale: string) {
  if (locale === 'fr') return 'Voir les tarifs'
  if (locale === 'es') return 'Ver precios'
  if (locale === 'ar') return 'عرض الأسعار'
  return 'View pricing'
}

export function ActivityCard({ activity, locale, className }: Props) {
  const { images, badge, badgeTone, title, desc, minHeight, large } = activity
  const story = useActivityStory()
  const multi = images.length > 1 && story !== null
  const pricingHref = `/${locale}/pricing`
  const [slide, setSlide] = useState(0)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    if (!multi || hover) return
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % images.length)
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [multi, hover, images.length])

  const label = tr(title, locale)
  // Only decode the active frame (+ next for a soft crossfade). Story mode
  // loads the full set when the user actually opens it.
  const visibleIndexes = multi
    ? Array.from(new Set([slide, (slide + 1) % images.length]))
    : [0]

  const shellClass = cn(
    // `block` matters for the single-image variant: it renders as an <a>, which
    // is inline by default and would collapse the card and its fill images.
    'group relative block h-full w-full overflow-hidden rounded-[28px] text-left',
    'shadow-[0_25px_60px_rgba(0,70,164,0.10)] transition-[transform,box-shadow] duration-450 ease-[cubic-bezier(0.16,1,0.3,1)]',
    'cursor-pointer hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_40px_90px_rgba(0,70,164,0.08)]',
    'focus-visible:-translate-y-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0046A4]',
    minHeight,
    className,
  )

  const body = (
    <>
      {visibleIndexes.map((i) => (
        <Image
          key={images[i]}
          src={images[i]}
          alt={`${label} ${i + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
          quality={70}
          className={cn(
            'object-cover transition-[opacity,transform] duration-900 ease-[cubic-bezier(0.16,1,0.3,1)]',
            i === slide ? 'opacity-100' : 'opacity-0',
            i === slide && hover ? 'scale-[1.08]' : 'scale-100',
          )}
        />
      ))}

      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: large
            ? 'linear-gradient(to top, rgba(7,42,90,.92), rgba(0,70,164,.28) 52%, rgba(7,42,90,.12))'
            : 'linear-gradient(to top, rgba(7,42,90,.88), rgba(0,70,164,.22) 58%, transparent)',
        }}
      />

      {multi && (
        <span className="absolute top-5 right-5 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-[20px] backdrop-saturate-150">
          <Images className="h-3.5 w-3.5" />
          {images.length}
        </span>
      )}

      {multi && (
        <div className="absolute top-5 left-5 right-16 z-10 flex gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-[2px] flex-1 rounded-full transition-colors duration-500',
                i === slide ? 'bg-white' : 'bg-white/30',
              )}
            />
          ))}
        </div>
      )}

      <div className={cn('absolute bottom-0 z-10 w-full', large ? 'p-9 sm:p-12' : 'p-8 sm:p-9')}>
        <span
          className={cn(
            'eyebrow inline-block rounded-full px-3.5 py-1.5 text-[0.7rem]',
            badgeTone === 'sand' ? 'bg-[#B8925A] text-white' : 'bg-[#0046A4] text-white',
          )}
        >
          {tr(badge, locale)}
        </span>

        <h3
          className={cn(
            'font-heading text-white mt-4',
            large ? 'text-display-sm' : 'text-card-title',
          )}
        >
          {label}
        </h3>

        <p
          className={cn(
            'text-white/75 mt-3',
            large ? 'text-body-lg max-w-lg' : 'text-small line-clamp-3',
          )}
        >
          {tr(desc, locale)}
        </p>

        <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-white/60 transition-colors duration-450 group-hover:text-white">
          {multi ? viewPhotosLabel(locale) : viewPricingLabel(locale)}
          {multi ? (
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-450 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          ) : (
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-450 group-hover:translate-x-0.5" />
          )}
        </span>
      </div>
    </>
  )

  if (multi) {
    return (
      <button
        type="button"
        onClick={() => story?.openStory({ images, title: label, startIndex: slide })}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={shellClass}
        aria-label={`${label} — ${images.length} photos`}
      >
        {body}
      </button>
    )
  }

  return (
    <Link
      href={pricingHref}
      prefetch={false}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={shellClass}
      aria-label={`${label} — ${viewPricingLabel(locale)}`}
    >
      {body}
    </Link>
  )
}
