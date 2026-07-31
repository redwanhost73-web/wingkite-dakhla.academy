'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Globe, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/lib/i18n-context'
import { cn } from '@/lib/utils'

const logoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uwpe0OmA74QLewcU70kbpwjkiMDyfe.png'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { t, locale } = useTranslations()
  
  const otherLocale = locale === 'fr' ? 'en' : 'fr'
  const currentPath = pathname.replace(`/${locale}`, '') || '/'
  
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

  // Instant language switch with prefetch
  const switchLanguage = useCallback((newLocale: string) => {
    const newPath = `/${newLocale}${currentPath}`
    router.push(newPath)
    setLangOpen(false)
  }, [currentPath, router])

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex h-24 items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center shrink-0" prefetch>
          <Image 
            src={logoUrl}
            alt="Wing Kite Dakhla Academy"
            width={320}
            height={110}
            className="h-16 md:h-20 w-auto object-contain"
            priority
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className={cn(
                'text-sm font-semibold transition-colors relative py-2',
                isActive(link.href) 
                  ? 'text-[#1E5AA8]' 
                  : 'text-gray-700 hover:text-[#1E5AA8]'
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E5AA8] rounded-full" />
              )}
            </Link>
          ))}
        </nav>
        
        {/* Right Side - Desktop */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Language Switcher - Custom Dropdown for instant switch */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
            >
              <Globe className="h-4 w-4" />
              {locale.toUpperCase()}
              <ChevronDown className={cn("h-4 w-4 transition-transform", langOpen && "rotate-180")} />
            </button>
            
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 min-w-[120px]">
                  {[
                    { code: 'fr', flag: '🇫🇷', label: 'Français' },
                    { code: 'en', flag: '🇬🇧', label: 'English' },
                    { code: 'es', flag: '🇪🇸', label: 'Español' },
                    { code: 'ar', flag: '🇸🇦', label: 'العربية' },
                  ].map(({ code, flag, label }) => (
                    <button
                      key={code}
                      onClick={() => switchLanguage(code)}
                      className={cn(
                        "w-full px-4 py-3 text-left text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2",
                        locale === code && "text-[#1E5AA8] bg-blue-50"
                      )}
                    >
                      <span className="text-lg">{flag}</span> {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <Button 
            asChild 
            className="bg-[#1E5AA8] hover:bg-[#1E5AA8]/90 text-white font-bold px-6 rounded-xl h-11"
          >
            <Link href={`/${locale}/contact`} prefetch>
              {t('nav.book')}
            </Link>
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t bg-white shadow-lg">
          <nav className="max-w-7xl mx-auto flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                onClick={() => setIsOpen(false)}
                className={cn(
                  'text-base font-semibold py-3 px-4 rounded-xl transition-colors',
                  isActive(link.href) 
                    ? 'text-[#1E5AA8] bg-blue-50' 
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Language Switch */}
            <div className="grid grid-cols-2 gap-2 pt-4 mt-2 border-t">
              {[
                { code: 'fr', flag: '🇫🇷', label: 'Français' },
                { code: 'en', flag: '🇬🇧', label: 'English' },
                { code: 'es', flag: '🇪🇸', label: 'Español' },
                { code: 'ar', flag: '🇸🇦', label: 'العربية' },
              ].map(({ code, flag, label }) => (
                <button
                  key={code}
                  onClick={() => { switchLanguage(code); setIsOpen(false) }}
                  className={cn(
                    "py-3 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2",
                    locale === code ? "bg-[#1E5AA8] text-white" : "bg-gray-100 text-gray-700"
                  )}
                >
                  {flag} {label}
                </button>
              ))}
            </div>
            
            <Button 
              asChild 
              className="mt-4 bg-[#1E5AA8] hover:bg-[#1E5AA8]/90 text-white font-bold rounded-xl h-12"
            >
              <Link href={`/${locale}/contact`} prefetch onClick={() => setIsOpen(false)}>
                {t('nav.book')}
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
