'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'
import { Reveal } from '@/components/reveal'

type Props = {
  image: string
  /** Small label above the title. */
  eyebrow?: string
  title: ReactNode
  subtitle?: string
  children?: ReactNode
}

/**
 * Shared cinematic plate for inner pages. Shorter than the home hero so the
 * page's own content starts above the fold, but the same overlay recipe and
 * slow push-in keep the two reading as one system.
 */
export function PageHero({ image, eyebrow, title, subtitle, children }: Props) {
  return (
    <section className="relative flex min-h-[72svh] items-end overflow-hidden bg-[#0B1F3B]" data-nav-theme="dark">
      <div className="absolute inset-0 animate-ken-burns">
        <Image
          src={image}
          alt=""
          aria-hidden
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={70}
          className="object-cover"
        />
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
              <p className="eyebrow text-[#C9A66B]">{eyebrow}</p>
            </Reveal>
          )}
          <Reveal delay={200} duration={900}>
            <h1 className="font-heading text-display text-white mt-6 text-balance">{title}</h1>
          </Reveal>
          {subtitle && (
            <Reveal delay={320} duration={900}>
              <p className="text-body-lg text-white/80 max-w-xl mt-7">{subtitle}</p>
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
