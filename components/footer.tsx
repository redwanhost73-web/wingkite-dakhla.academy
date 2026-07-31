'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Star } from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'

const logoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uwpe0OmA74QLewcU70kbpwjkiMDyfe.png'

export function Footer() {
  const { t, locale } = useTranslations()
  const fr = locale === 'fr'
  const ar = locale === 'ar'
  
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

  return (
    <footer className="bg-[#1a1a2e] text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl p-3 inline-block">
              <Image 
                src={logoUrl}
                alt="Wing Kite Dakhla Academy"
                width={180}
                height={60}
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
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
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-4 py-2"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#E5A423] text-[#E5A423]" />
                ))}
              </div>
              <span className="text-sm font-medium">Google Reviews</span>
            </a>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-5">{getText('Liens rapides', 'Quick Links', 'Enlaces rápidos', 'روابط سريعة')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-5">{getText('Contact', 'Contact', 'Contacto', 'اتصل بنا')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="h-5 w-5 mt-0.5 shrink-0 text-[#E5A423]" />
                <span className="text-sm">{getText('Lagon de Dakhla, Dakhla, Maroc', 'Dakhla Lagoon, Dakhla, Morocco', 'Laguna de Dakhla, Dakhla, Marruecos', 'بحيرة الداخلة، الداخلة، المغرب')}</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Phone className="h-5 w-5 shrink-0 text-[#E5A423]" />
                <a href="tel:+212766910203" className="text-sm hover:text-white transition-colors">+212 766 910 203</a>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Mail className="h-5 w-5 shrink-0 text-[#E5A423]" />
                <span className="text-sm">contact@wingkitedakhla.com</span>
              </li>
            </ul>
          </div>
          
          {/* Social + Google */}
          <div>
            <h3 className="font-bold text-lg mb-5">{getText('Suivez-nous', 'Follow Us', 'Síguenos', 'تابعنا')}</h3>
            <div className="flex gap-3 mb-6">
              <a 
                href="#" 
                className="p-3 rounded-xl bg-white/10 hover:bg-[#1E5AA8] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-3 rounded-xl bg-white/10 hover:bg-[#1E5AA8] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-3 rounded-xl bg-white/10 hover:bg-[#1E5AA8] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <a
              href="https://www.google.com/maps/place/Wing+Kite+Dakhla+Academy/@22.6807513,-14.5526684,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <MapPin className="h-4 w-4" />
              {getText('Voir sur Google Maps', 'View on Google Maps', 'Ver en Google Maps', 'عرض على خرائط Google')}
            </a>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8">
          <p className="text-sm text-white/50 text-center">
            {currentYear} Wing Kite Dakhla Academy - Free Wing Dakhla. {getText('Tous droits réservés.', 'All rights reserved.', 'Todos los derechos reservados.', 'جميع الحقوق محفوظة.')}
          </p>
        </div>
      </div>
    </footer>
  )
}
