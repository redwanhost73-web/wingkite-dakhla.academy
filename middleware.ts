import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Country code → locale mapping
// Only locales that exist under app/ may be used here: fr, en, es, ar.
// FR: France, Belgium, Switzerland (FR part), Morocco, Luxembourg, Senegal, Ivory Coast, etc.
// ES: Spain, Mexico, Argentina, Colombia, Chile, etc.
// EN: everything else
const COUNTRY_TO_LOCALE: Record<string, string> = {
  // French
  FR: 'fr', // France
  BE: 'fr', // Belgium (defaulting to French — NL speakers can switch)
  MA: 'fr', // Morocco
  LU: 'fr', // Luxembourg
  SN: 'fr', // Senegal
  CI: 'fr', // Ivory Coast
  CM: 'fr', // Cameroon
  TN: 'fr', // Tunisia
  DZ: 'fr', // Algeria
  CH: 'fr', // Switzerland
  MC: 'fr', // Monaco

  // Spanish
  ES: 'es', // Spain
  MX: 'es', // Mexico
  AR: 'es', // Argentina
  CO: 'es', // Colombia
  CL: 'es', // Chile
  PE: 'es', // Peru
  VE: 'es', // Venezuela
  EC: 'es', // Ecuador
  BO: 'es', // Bolivia
  PY: 'es', // Paraguay
  UY: 'es', // Uruguay
  CR: 'es', // Costa Rica
  PA: 'es', // Panama
  DO: 'es', // Dominican Republic
  GT: 'es', // Guatemala
  HN: 'es', // Honduras
  NI: 'es', // Nicaragua
  SV: 'es', // El Salvador
  CU: 'es', // Cuba

  // Arabic
  SA: 'ar', // Saudi Arabia
  AE: 'ar', // United Arab Emirates
  QA: 'ar', // Qatar
  KW: 'ar', // Kuwait
  BH: 'ar', // Bahrain
  OM: 'ar', // Oman
  JO: 'ar', // Jordan
  EG: 'ar', // Egypt
}

// Parse Accept-Language header for a best-match locale
function getLocaleFromAcceptLanguage(header: string | null): string {
  if (!header) return 'en'
  // Parse "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,nl;q=0.6"
  const langs = header
    .split(',')
    .map((l) => {
      const [lang, q] = l.trim().split(';q=')
      return { lang: lang.split('-')[0].toLowerCase(), q: q ? parseFloat(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)

  for (const { lang } of langs) {
    if (lang === 'fr') return 'fr'
    if (lang === 'es') return 'es'
    if (lang === 'ar') return 'ar'
    if (lang === 'en') return 'en'
  }
  return 'en'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only intercept the root path "/"
  if (pathname !== '/') return NextResponse.next()

  // 1. Try Vercel's geo header (production on Vercel)
  const country = request.headers.get('x-vercel-ip-country')?.toUpperCase()
  let locale = country ? (COUNTRY_TO_LOCALE[country] ?? null) : null

  // 2. Fallback: Accept-Language header (local dev or non-Vercel hosts)
  if (!locale) {
    locale = getLocaleFromAcceptLanguage(request.headers.get('accept-language'))
  }

  // 3. Final fallback: French (our default)
  if (!locale) locale = 'fr'

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/', '/((?!_next|_vercel|favicon|icon|apple-icon|.*\\..*).*)'],
}
