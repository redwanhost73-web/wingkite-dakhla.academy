import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const COUNTRY_TO_LOCALE: Record<string, string> = {
  FR: 'fr',
  BE: 'fr',
  MA: 'fr',
  LU: 'fr',
  SN: 'fr',
  CI: 'fr',
  CM: 'fr',
  TN: 'fr',
  DZ: 'fr',
  CH: 'fr',
  MC: 'fr',
  ES: 'es',
  MX: 'es',
  AR: 'es',
  CO: 'es',
  CL: 'es',
  PE: 'es',
  VE: 'es',
  EC: 'es',
  BO: 'es',
  PY: 'es',
  UY: 'es',
  CR: 'es',
  PA: 'es',
  DO: 'es',
  GT: 'es',
  HN: 'es',
  NI: 'es',
  SV: 'es',
  CU: 'es',
  SA: 'ar',
  AE: 'ar',
  QA: 'ar',
  KW: 'ar',
  BH: 'ar',
  OM: 'ar',
  JO: 'ar',
  EG: 'ar',
}

function getLocaleFromAcceptLanguage(header: string | null): string {
  if (!header) return 'en'
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

async function refreshSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return response

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  // Fail-open quickly on network/auth provider hiccups so public routes
  // (especially /auth/login) are never blocked for 20s+ by retries.
  try {
    await Promise.race([
      supabase.auth.getUser(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('supabase auth timeout')), 1500),
      ),
    ])
  } catch {
    // Keep request flowing; downstream pages can still render.
  }
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublicAuthPage = pathname === '/auth/login' || pathname === '/auth/signup'

  // Keep admin / dashboard sessions fresh whenever Supabase is configured
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/admin') ||
    (pathname.startsWith('/auth') && !isPublicAuthPage) ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/business')
  ) {
    return refreshSupabaseSession(request)
  }

  if (pathname !== '/') return NextResponse.next()

  const country = request.headers.get('x-vercel-ip-country')?.toUpperCase()
  let locale = country ? (COUNTRY_TO_LOCALE[country] ?? null) : null
  if (!locale) {
    locale = getLocaleFromAcceptLanguage(request.headers.get('accept-language'))
  }
  if (!locale) locale = 'fr'

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/', '/admin/:path*', '/api/admin/:path*', '/auth/:path*', '/account/:path*', '/profile/:path*', '/business/:path*'],
}
