'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Star, ArrowUpRight } from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'
import { GOOGLE_MAPS_URL } from '@/lib/location'

const logoUrl = '/Logo/Logo.png'

export function Footer() {
  const { t, locale } = useTranslations()

  const getText = (frText: string, enText: string, esText: string, arText?: string): string => {
    if (locale === 'fr') return frText
    if (locale === 'es') return esText
    if (locale === 'ar') return arText || enText
    return enText
  }

  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { href: `/${locale}`, label: t('nav.home') },
    { href: `/${locale}/about`, label: t('nav.about') },
    { href: `/${locale}/pricing`, label: t('nav.pricing') },
    { href: `/${locale}/contact`, label: t('nav.contact') },
    { href: `/${locale}/privacy`, label: getText('Politique de confidentialité', 'Privacy Policy', 'Política de privacidad', 'سياسة الخصوصية') },
  ]

  const socials = [
    { href: 'https://facebook.com/wingkitedakhla', label: 'Facebook', Icon: Facebook },
    { href: 'https://www.instagram.com/wing_kite_dakhla_academy', label: 'Instagram', Icon: Instagram },
    { href: 'https://youtube.com/@wingkitedakhla', label: 'YouTube', Icon: Youtube },
  ]

  return (
    <footer className="surface-noise relative overflow-hidden bg-[#0B1F3B] text-white" data-nav-theme="dark">
      <span aria-hidden className="blob -top-40 left-1/3 h-120 w-120 bg-[#0046A4]/25" />

      <div className="container-editorial relative z-10 pt-24 pb-12 lg:pt-32">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-5 lg:pr-10">
            <Image
              src={logoUrl}
              alt="Wing Kite Dakhla Academy"
              width={400}
              height={146}
              sizes="280px"
              className="h-16 w-auto object-contain sm:h-20"
              loading="lazy"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <p className="text-small text-white/60 mt-7 max-w-md">
              {getText(
                'École de wingfoil et kitesurf à Dakhla, Maroc. Apprenez avec des professionnels passionnés dans l\'un des meilleurs spots au monde.',
                'Wingfoil and kitesurf school in Dakhla, Morocco. Learn with passionate professionals at one of the best spots in the world.',
                'Escuela de wingfoil y kitesurf en Dakhla, Marruecos. Aprende con profesionales apasionados en uno de los mejores spots del mundo.',
                'مدرسة وينج فويل وكايت سيرف في الداخلة، المغرب. تعلم مع محترفين شغوفين في واحدة من أفضل المواقع في العالم.'
              )}
            </p>

            {/* Google Reviews Badge */}
            <a
              href="https://g.page/r/CYv3UKOLHTcQEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel mt-8 inline-flex items-center gap-3 rounded-full px-5 py-3 transition-colors duration-[450ms] hover:bg-white/15"
            >
              <span className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#C9A66B] text-[#C9A66B]" />
                ))}
              </span>
              <span className="text-small font-semibold">Google Reviews</span>
            </a>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h3 className="eyebrow text-white/40">
              {getText('Liens rapides', 'Quick Links', 'Enlaces rápidos', 'روابط سريعة')}
            </h3>
            <ul className="mt-7 space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group text-small inline-flex items-center gap-2 text-white/65 transition-colors duration-[450ms] hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-[450ms] group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="eyebrow text-white/40">
              {getText('Contact', 'Contact', 'Contacto', 'اتصل بنا')}
            </h3>
            <ul className="mt-7 space-y-5">
              <li className="flex items-start gap-3.5 text-small text-white/65">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A66B]" />
                <span>
                  {getText('Lagon de Dakhla, Dakhla, Maroc', 'Dakhla Lagoon, Dakhla, Morocco', 'Laguna de Dakhla, Dakhla, Marruecos', 'بحيرة الداخلة، الداخلة، المغرب')}
                </span>
              </li>
              <li className="flex items-center gap-3.5 text-small text-white/65">
                <Phone className="h-4 w-4 shrink-0 text-[#C9A66B]" />
                <a href="tel:+212766910203" className="transition-colors duration-[450ms] hover:text-white">
                  +212 766 910 203
                </a>
              </li>
              <li className="flex items-center gap-3.5 text-small text-white/65">
                <Mail className="h-4 w-4 shrink-0 text-[#C9A66B]" />
                <span>contact@wingkitedakhla.com</span>
              </li>
            </ul>

            <h3 className="eyebrow text-white/40 mt-10">
              {getText('Suivez-nous', 'Follow Us', 'Síguenos', 'تابعنا')}
            </h3>
            <div className="mt-5 flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white/80 transition-all duration-[450ms] hover:-translate-y-1 hover:border-transparent hover:bg-[#0057D1] hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2 text-small text-white/55 transition-colors duration-[450ms] hover:text-white"
            >
              <MapPin className="h-4 w-4" />
              {getText('Voir sur Google Maps', 'View on Google Maps', 'Ver en Google Maps', 'عرض على خرائط Google')}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-[450ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        <hr className="hairline-light mt-20" />

        <p className="text-xs text-white/40 mt-8 text-center">
          {currentYear} Wing Kite Dakhla Academy - Free Wing Dakhla.{' '}
          {getText('Tous droits réservés.', 'All rights reserved.', 'Todos los derechos reservados.', 'جميع الحقوق محفوظة.')}
        </p>
      </div>
    </footer>
  )
}
