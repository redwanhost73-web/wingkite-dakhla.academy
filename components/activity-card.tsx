'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Images, ArrowUpRight, ArrowRight, Clapperboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Activity, LocalizedText } from '@/lib/activities'
import { useActivityStory } from '@/components/activity-story'
import { useSiteConfig } from '@/hooks/use-site-config'
import {
  EditableImage,
  EditableText,
  useEditableImageSrc,
  useEditableTextValue,
} from '@/components/edit-mode/editable'
import { activityImageFieldKey } from '@/lib/cms/content-lists'
import type { Localized } from '@/lib/cms/types'

const AUTO_MS = 4200

type Props = {
  activity: Activity
  locale: string
  className?: string
  delay?: number
}

function asLocalized(text: LocalizedText): Localized {
  return { fr: text.fr, en: text.en, es: text.es, ar: text.ar }
}

const VIEW_PHOTOS: Localized = {
  fr: 'Voir toutes les photos',
  en: 'View all photos',
  es: 'Ver todas las fotos',
  ar: 'عرض كل الصور',
}

const VIEW_COURSE: Localized = {
  fr: 'Voir le cours',
  en: 'View course',
  es: 'Ver curso',
  ar: 'عرض الدورة',
}

export function ActivityCard({ activity, locale, className }: Props) {
  const { images, badge, badgeTone, title, desc, minHeight, large, id } = activity
  const story = useActivityStory()
  const { mediaPack, texts } = useSiteConfig()
  const multi = images.length > 1 && story !== null
  const mediaHref = `/${locale}/activities/${id}`
  const [slide, setSlide] = useState(0)
  const [hover, setHover] = useState(false)

  const titleKey = `home.activities.${id}.title`
  const label = useEditableTextValue(titleKey, asLocalized(title), texts[titleKey])

  useEffect(() => {
    if (!multi || hover) return
    const idTimer = setInterval(() => {
      setSlide((s) => (s + 1) % images.length)
    }, AUTO_MS)
    return () => clearInterval(idTimer)
  }, [multi, hover, images.length])

  const visibleIndexes = multi
    ? Array.from(new Set([slide, (slide + 1) % images.length]))
    : [0]

  const shellClass = cn(
    'group relative block h-full w-full overflow-hidden rounded-[28px] text-left',
    'shadow-[0_25px_60px_rgba(0,70,164,0.10)] transition-[transform,box-shadow] duration-450 ease-[cubic-bezier(0.16,1,0.3,1)]',
    'cursor-pointer hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_40px_90px_rgba(0,70,164,0.08)]',
    'focus-visible:-translate-y-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0046A4]',
    minHeight,
    className,
  )

  return (
    <Link
      href={mediaHref}
      prefetch={false}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={shellClass}
      aria-label={label}
    >
      {visibleIndexes.map((i) => (
        <ActivitySlide
          key={`${id}-${i}-${images[i]}`}
          activityId={id}
          index={i}
          src={images[i]}
          alt={`${label} ${i + 1}`}
          active={i === slide}
          zoom={i === slide && hover}
        />
      ))}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
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
                'h-0.5 flex-1 rounded-full transition-colors duration-500',
                i === slide ? 'bg-white' : 'bg-white/30',
              )}
            />
          ))}
        </div>
      )}

      <div className={cn('absolute bottom-0 z-10 w-full', large ? 'p-9 sm:p-12' : 'p-8 sm:p-9')}>
        <EditableText
          fieldKey={`home.activities.${id}.badge`}
          label={`${id} badge`}
          as="span"
          className={cn(
            'eyebrow inline-block rounded-full px-3.5 py-1.5 text-[0.7rem]',
            badgeTone === 'sand' ? 'bg-[#B8925A] text-white' : 'bg-[#0046A4] text-white',
          )}
          defaults={asLocalized(badge)}
          cms={texts[`home.activities.${id}.badge`]}
        />

        <EditableText
          fieldKey={titleKey}
          label={`${id} title`}
          as="h3"
          className={cn(
            'font-heading text-white mt-4',
            large ? 'text-display-sm' : 'text-card-title',
          )}
          defaults={asLocalized(title)}
          cms={texts[titleKey]}
        />

        <EditableText
          fieldKey={`home.activities.${id}.desc`}
          label={`${id} description`}
          as="p"
          className={cn(
            'text-white/75 mt-3',
            large ? 'text-body-lg max-w-lg' : 'text-small line-clamp-3',
          )}
          defaults={asLocalized(desc)}
          cms={texts[`home.activities.${id}.desc`]}
        />

        <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/25 bg-white/12 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-lg">
            <Clapperboard className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <EditableText
              fieldKey="pricing.mediaPack.short"
              label="Media pack short"
              as="span"
              className="truncate"
              defaults={mediaPack.short}
              cms={texts['pricing.mediaPack.short']}
            />
          </span>

          {multi ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                story?.openStory({ images, title: label, startIndex: slide })
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 transition-colors duration-450 hover:text-white"
            >
              <EditableText
                fieldKey="home.activities.viewPhotos"
                label="View all photos"
                defaults={VIEW_PHOTOS}
                cms={texts['home.activities.viewPhotos']}
              />
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 transition-colors duration-450 group-hover:text-white">
              <EditableText
                fieldKey="home.activities.viewCourse"
                label="View course"
                defaults={VIEW_COURSE}
                cms={texts['home.activities.viewCourse']}
              />
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-450 group-hover:translate-x-0.5" />
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function ActivitySlide({
  activityId,
  index,
  src,
  alt,
  active,
  zoom,
}: {
  activityId: string
  index: number
  src: string
  alt: string
  active: boolean
  zoom: boolean
}) {
  const fieldKey = activityImageFieldKey(activityId, index)
  const liveSrc = useEditableImageSrc(fieldKey, src)
  const remote = /^https?:\/\//.test(liveSrc)
  return (
    <EditableImage
      fieldKey={fieldKey}
      src={liveSrc}
      label={`${activityId} photo ${index + 1}`}
      className="absolute inset-0"
    >
      <Image
        src={liveSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        loading="lazy"
        quality={70}
        unoptimized={remote}
        className={cn(
          'object-cover transition-[opacity,transform] duration-900 ease-[cubic-bezier(0.16,1,0.3,1)]',
          active ? 'opacity-100' : 'opacity-0',
          active && zoom ? 'scale-[1.08]' : 'scale-100',
        )}
      />
    </EditableImage>
  )
}

