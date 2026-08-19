'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'
import { Reveal } from '@/components/reveal'
import { EditableImage, useEditableImageSrc } from '@/components/edit-mode/editable'
import { IMAGE_LABELS, type SiteImages } from '@/lib/site-config'

type Props = {
  image: string
  /** When set, enables Edit Mode image editing for this hero. */
  imageKey?: keyof SiteImages
  /** Small label above the title. */
  eyebrow?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  children?: ReactNode
}

/**
 * Shared cinematic plate for inner pages. Shorter than the home hero so the
 * page's own content starts above the fold, but the same overlay recipe and
 * slow push-in keep the two reading as one system.
 */
export function PageHero({ image, imageKey, eyebrow, title, subtitle, children }: Props) {
  const liveSrc = useEditableImageSrc(imageKey || '', image)
  const src = imageKey ? liveSrc : image

  const media = (
    <Image
      src={src}
      alt=""
      aria-hidden
      fill
      priority
      fetchPriority="high"
      sizes="100vw"
      quality={70}
      className="object-cover"
    />
  )

  return (
    <section className="relative flex min-h-[72svh] items-end overflow-hidden bg-[#0B1F3B]" data-nav-theme="dark">
      <div className="absolute inset-0 animate-ken-burns">
        {imageKey ? (
          <EditableImage
            fieldKey={imageKey}
            src={src}
            label={IMAGE_LABELS[imageKey]}
            className="absolute inset-0"
          >
            {media}
          </EditableImage>
        ) : (
          media
        )}
      </div>

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(7,42,90,.70), rgba(7,42,90,.30) 35%, rgba(0,70,164,.15) 65%, transparent)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, transparent 30%, rgba(7,42,90,.35) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-45"
        style={{
          background:
            'radial-gradient(circle at top right, rgba(90,168,255,.28), transparent 55%)',
        }}
      />

      <div className="container-editorial relative z-10 pt-40 pb-16 sm:pb-20">
        <div className="max-w-3xl">
          {eyebrow && (
            <Reveal delay={100} duration={800}>
              <div className="eyebrow text-[#C9A66B]">{eyebrow}</div>
            </Reveal>
          )}
          <Reveal delay={200} duration={900}>
            <h1 className="font-heading text-display text-white mt-6 text-balance">{title}</h1>
          </Reveal>
          {subtitle && (
            <Reveal delay={320} duration={900}>
              <div className="text-body-lg text-white/80 max-w-xl mt-7">{subtitle}</div>
            </Reveal>
          )}
          {children && (
            <Reveal delay={440} duration={900}>
              <div className="mt-10">{children}</div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
