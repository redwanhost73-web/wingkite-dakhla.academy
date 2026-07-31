'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/lib/i18n-context'

interface HeroSectionProps {
  backgroundImage: string
  title: string
  subtitle: string
  showCta?: boolean
  ctaText?: string
  ctaHref?: string
  ctaSecondaryText?: string
  ctaSecondaryHref?: string
  overlay?: boolean
}

export function HeroSection({
  backgroundImage,
  title,
  subtitle,
  showCta = true,
  ctaText,
  ctaHref,
  ctaSecondaryText,
  ctaSecondaryHref,
  overlay = true,
}: HeroSectionProps) {
  const { locale } = useTranslations()
  
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover"
          priority
        />
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/60" />
        )}
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center text-background">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
          {title}
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-background/90 leading-relaxed text-pretty">
          {subtitle}
        </p>
        
        {showCta && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {ctaText && ctaHref && (
              <Button 
                asChild 
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8"
              >
                <Link href={ctaHref}>{ctaText}</Link>
              </Button>
            )}
            {ctaSecondaryText && ctaSecondaryHref && (
              <Button 
                asChild 
                size="lg"
                style={{ backgroundColor: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.85)' }}
                className="text-base px-8 font-semibold hover:bg-white/15 transition-colors"
              >
                <Link href={ctaSecondaryHref}>{ctaSecondaryText}</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
