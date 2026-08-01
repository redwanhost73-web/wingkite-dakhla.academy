'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'
import { cn } from '@/lib/utils'

const logoUrl = '/Logo/Logo.png'

const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '/Languages-ico-images/France.png' },
  { code: 'en', label: 'English', flag: '/Languages-ico-images/Us.png' },
  { code: 'es', label: 'Español', flag: '/Languages-ico-images/Spain.webp' },
  { code: 'ar', label: 'العربية', flag: '/Languages-ico-images/Arabic.webp' },
] as const

// Logo art is a single blue tone on transparency — invert for dark plates,
// leave natural for light plates so it reads as brand blue / deep navy.
const LOGO_FILTER = {
  white: 'brightness(0) invert(1)',
  navy: 'brightness(0) saturate(100%) invert(12%) sepia(40%) saturate(2500%) hue-rotate(195deg) brightness(0.85)',
} as const

function FlagIcon({
  src,
  label,
  size = 22,
  ring = 'ring-white/25',
}: {
  src: string
  label: string
  size?: number
  ring?: string
}) {
  return (
    <span
      className={cn('relative inline-block shrink-0 overflow-hidden rounded-full ring-1', ring)}
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={label} fill sizes={`${size}px`} className="object-cover" loading="lazy" />
    </span>
  )
}

/**
 * Reads whichever [data-nav-theme] plate currently sits under the floating
 * navbar band. Intersection alone is noisy when sections are short, so we
 * sample the vertical midpoint of the bar on scroll/resize instead.
 */
function useNavTheme() {
  const pathname = usePathname()
  const [onDark, setOnDark] = useState(true)

  useEffect(() => {
    let frame = 0

    const sample = () => {
      frame = 0
      const probeY = Math.min(88, Math.round(window.innerHeight * 0.09))
      const nodes = document.querySelectorAll<HTMLElement>('[data-nav-theme]')
      let theme: 'dark' | 'light' | null = null
      let bestOverlap = -1

      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect()
        // Must cover the probe line that runs through the floating pill.
        if (rect.top > probeY || rect.bottom < probeY) return
        const overlap = Math.min(rect.bottom, probeY + 40) - Math.max(rect.top, probeY - 40)
        if (overlap > bestOverlap) {
          bestOverlap = overlap
          const value = node.getAttribute('data-nav-theme')
          theme = value === 'light' ? 'light' : 'dark'
        }
      })

      // Heroes always open dark; fall back there if nothing is tagged yet.
      setOnDark(theme !== 'light')
    }

    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(sample)
    }

    sample()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [pathname])

  return onDark
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [storyOpen, setStoryOpen] = useState(false)
  const onDark = useNavTheme()
  const pathname = usePathname()
  const router = useRouter()
  const { t, locale } = useTranslations()

  const currentPath = pathname.replace(`/${locale}`, '') || '/'
  const currentLanguage = LANGUAGES.find((l) => l.code === locale)

  // The mobile sheet is a white panel that slides under the fixed bar, so the
  // bar has to drop its dark-plate treatment or the logo and close icon vanish.
  const barDark = onDark && !isOpen
  const hideBar = isOpen || storyOpen

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Story mode marks the body — hide the floating bar so it doesn't sit on top.
  useEffect(() => {
    const sync = () => setStoryOpen(document.body.hasAttribute('data-story-open'))
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-story-open'] })
    return () => observer.disconnect()
  }, [])

  // A fixed bar over an open sheet would let the page scroll behind it.
  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  // Soft navigations and language switches must always dismiss the sheet.
  useEffect(() => {
    setIsOpen(false)
    setLangOpen(false)
  }, [pathname])

  const closeMenu = useCallback(() => setIsOpen(false), [])

  const navLinks = [
    { href: `/${locale}`, label: t('nav.home') },
    { href: `/${locale}/about`, label: t('nav.about') },
    { href: `/${locale}/pricing`, label: t('nav.pricing') },
    { href: `/${locale}/contact`, label: t('nav.contact') },
  ]

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`
    }
    return pathname.startsWith(href)
  }

  const switchLanguage = useCallback(
    (newLocale: string) => {
      router.push(`/${newLocale}${currentPath}`)
      setLangOpen(false)
    },
    [currentPath, router],
  )

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 z-50 w-full',
          scrolled ? 'top-2 sm:top-3' : 'top-4 sm:top-6',
          // Tuck the floating bar away while the mobile sheet or story is open
          // so taps land on the overlay instead of fighting the pill.
          hideBar && 'pointer-events-none opacity-0 -translate-y-4',
        )}
        style={{
          transition:
            'top 400ms var(--ease-premium), opacity 300ms var(--ease-premium), transform 300ms var(--ease-premium)',
        }}
        data-nav-on={onDark ? 'dark' : 'light'}
        aria-hidden={hideBar || undefined}
      >
        <div className="container-editorial">
          <div
            className={cn(
              'relative flex items-center justify-between gap-3 rounded-full',
              scrolled ? 'h-16 px-3 sm:px-4' : 'h-20 sm:h-24 px-4 sm:px-6',
              // Glass recipe flips with the plate behind the bar.
              isOpen
                ? 'border border-transparent bg-transparent shadow-none'
                : barDark
                  ? scrolled
                    ? 'border border-[rgba(90,168,255,0.22)] bg-white/10 shadow-[0_12px_32px_rgba(0,70,164,0.12)] backdrop-blur-[22px] backdrop-saturate-150'
                    : 'border border-transparent bg-transparent'
                  : 'border border-[rgba(90,168,255,0.20)] bg-white/72 shadow-[0_12px_32px_rgba(0,70,164,0.08)] backdrop-blur-[22px] backdrop-saturate-150',
            )}
            style={{
              transition:
                'height 400ms var(--ease-premium), padding 400ms var(--ease-premium), background-color 450ms var(--ease-premium), border-color 450ms var(--ease-premium), box-shadow 450ms var(--ease-premium), backdrop-filter 450ms var(--ease-premium), color 450ms var(--ease-premium)',
            }}
          >
            {/* Logo */}
            <Link
              href={`/${locale}`}
              className={cn(
                'flex items-center shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4',
                barDark ? 'focus-visible:outline-white/60' : 'focus-visible:outline-[#0046A4]/40',
              )}
              prefetch
            >
              <Image
                src={logoUrl}
                alt="Wing Kite Dakhla Academy"
                width={826}
                height={302}
                priority
                sizes="(max-width: 768px) 150px, 190px"
                className={cn('w-auto object-contain', scrolled ? 'h-9 md:h-10' : 'h-11 md:h-14')}
                style={{
                  filter: barDark ? LOGO_FILTER.white : LOGO_FILTER.navy,
                  transition: 'height 400ms var(--ease-premium), filter 450ms var(--ease-premium)',
                }}
              />
            </Link>

            {/* Centred link rail */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch
                  className={cn(
                    'relative rounded-full px-4 py-2.5 text-small font-semibold transition-colors duration-450',
                    barDark
                      ? isActive(link.href)
                        ? 'text-white'
                        : 'text-white/70 hover:text-white'
                      : isActive(link.href)
                        ? 'text-[#072A5A]'
                        : 'text-[#072A5A]/70 hover:text-[#072A5A]',
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden
                    className={cn(
                      'absolute bottom-1 left-1/2 h-0.75 w-0.75 -translate-x-1/2 rounded-full transition-opacity duration-300',
                      barDark ? 'bg-[#C9A66B]' : 'bg-[#5AA8FF]',
                      isActive(link.href) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  aria-label="Change language"
                  aria-expanded={langOpen}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full py-1.5 pr-2 pl-1.5 transition-colors duration-450',
                    barDark ? 'hover:bg-white/12' : 'hover:bg-[#DCEEFF]/70',
                  )}
                >
                  {currentLanguage && (
                    <FlagIcon
                      src={currentLanguage.flag}
                      label={currentLanguage.label}
                      size={24}
                      ring={barDark ? 'ring-white/25' : 'ring-[#0046A4]/15'}
                    />
                  )}
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 transition-all duration-450',
                      langOpen && 'rotate-180',
                      barDark ? 'text-white/75' : 'text-[#072A5A]/70',
                    )}
                  />
                </button>

                {langOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                    <div className="absolute top-full right-0 z-50 mt-3 min-w-44 overflow-hidden rounded-[20px] border border-[rgba(90,168,255,0.20)] bg-white/95 shadow-[0_20px_60px_rgba(0,70,164,0.10)] backdrop-blur-xl">
                      {LANGUAGES.map(({ code, flag, label }) => (
                        <button
                          key={code}
                          onClick={() => switchLanguage(code)}
                          className={cn(
                            'flex w-full items-center gap-3 px-4 py-3 text-left text-small font-semibold transition-colors hover:bg-[#DCEEFF]/50',
                            locale === code ? 'text-[#0046A4]' : 'text-[#3D4F6F]',
                          )}
                        >
                          <FlagIcon src={flag} label={label} ring="ring-[#0046A4]/15" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Book CTA — white on dark plates, brand blue on light plates */}
              <Link
                href={`/${locale}/contact`}
                prefetch
                className={cn(
                  'group hidden sm:inline-flex btn-pill-sm text-small',
                  scrolled ? 'h-11 px-6' : 'h-12 px-7',
                  barDark
                    ? 'bg-white text-[#072A5A] hover:bg-white'
                    : 'bg-[#0046A4] text-white hover:bg-[#0057D1] shadow-[0_12px_32px_rgba(0,70,164,0.22)]',
                )}
              >
                {t('nav.book')}
                <ArrowRight className="h-4 w-4 transition-transform duration-400 group-hover:translate-x-1" />
              </Link>

              <button
                className={cn(
                  'lg:hidden rounded-full p-2.5 transition-colors duration-450',
                  barDark ? 'text-white hover:bg-white/12' : 'text-[#072A5A] hover:bg-[#DCEEFF]/70',
                )}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        className={cn(
          'fixed inset-0 z-60 lg:hidden',
          isOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!isOpen}
      >
        <div
          onClick={closeMenu}
          className="absolute inset-0 bg-[#0B1F3B]/60 backdrop-blur-sm"
          style={{
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 400ms var(--ease-premium)',
          }}
        />
        <nav
          className="absolute inset-x-3 top-3 rounded-[28px] border border-[rgba(90,168,255,0.20)] bg-white/95 p-5 shadow-[0_30px_90px_rgba(0,70,164,0.08)] backdrop-blur-xl"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-16px) scale(0.98)',
            transition: 'opacity 400ms var(--ease-premium), transform 400ms var(--ease-premium)',
          }}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <Link
              href={`/${locale}`}
              prefetch
              onClick={closeMenu}
              className="flex items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0046A4]/40"
            >
              <Image
                src={logoUrl}
                alt="Wing Kite Dakhla Academy"
                width={826}
                height={302}
                sizes="140px"
                className="h-10 w-auto object-contain"
                style={{ filter: LOGO_FILTER.navy }}
              />
            </Link>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="rounded-full p-2.5 text-[#072A5A] transition-colors hover:bg-[#DCEEFF]/70"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                onClick={closeMenu}
                className={cn(
                  'rounded-2xl px-4 py-3.5 text-lg font-semibold transition-colors',
                  isActive(link.href)
                    ? 'bg-[#0046A4]/8 text-[#0046A4]'
                    : 'text-[#072A5A] hover:bg-[#DCEEFF]/50',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <hr className="hairline my-5" />

          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map(({ code, flag, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  closeMenu()
                  switchLanguage(code)
                }}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-small font-semibold transition-colors',
                  locale === code
                    ? 'bg-[#0046A4] text-white'
                    : 'bg-[#F6F1E8] text-[#3D4F6F] hover:bg-[#EFE7DA]',
                )}
              >
                <FlagIcon src={flag} label={label} size={20} ring="ring-[#0046A4]/15" />
                {label}
              </button>
            ))}
          </div>

          <Link
            href={`/${locale}/contact`}
            prefetch
            onClick={closeMenu}
            className="btn-pill mt-5 w-full bg-[#0046A4] text-white hover:bg-[#0057D1]"
          >
            {t('nav.book')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </>
  )
}
