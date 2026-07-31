import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

// Safety-net: middleware handles this for real requests.
// This only runs if middleware is bypassed (e.g. direct RSC fetch).
export default async function RootPage() {
  const headersList = await headers()

  // Vercel geo detection
  const country = headersList.get('x-vercel-ip-country')?.toUpperCase()
  const countryToLocale: Record<string, string> = {
    FR: 'fr', BE: 'fr', MA: 'fr', LU: 'fr', CH: 'fr', MC: 'fr',
    SN: 'fr', CI: 'fr', CM: 'fr', TN: 'fr', DZ: 'fr',
    ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es',
    SA: 'ar', AE: 'ar', QA: 'ar', KW: 'ar', BH: 'ar', OM: 'ar', JO: 'ar', EG: 'ar',
  }
  const locale = (country && countryToLocale[country]) ??
    (() => {
      const al = headersList.get('accept-language') ?? ''
      if (al.startsWith('fr')) return 'fr'
      if (al.startsWith('es')) return 'es'
      if (al.startsWith('ar')) return 'ar'
      return 'en'
    })()

  redirect(`/${locale}`)
}
