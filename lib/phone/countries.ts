import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from 'libphonenumber-js'

export type PhoneCountry = {
  iso: CountryCode
  dial: string
  name: string
  flag: string
}

/** Priority countries for Wing Kite Dakhla (tourism + partners). */
export const PRIORITY_COUNTRIES: CountryCode[] = [
  'MA',
  'FR',
  'ES',
  'DE',
  'GB',
  'BE',
  'NL',
  'IT',
  'CH',
  'PT',
  'US',
  'CA',
  'AE',
  'SA',
  'QA',
  'TN',
  'DZ',
  'SN',
]

export function flagEmoji(iso: string) {
  const code = iso.toUpperCase()
  if (!/^[A-Z]{2}$/.test(code)) return '🌐'
  return String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt(0)))
}

function countryName(iso: CountryCode, locale = 'en') {
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(iso) || iso
  } catch {
    return iso
  }
}

let cached: PhoneCountry[] | null = null

export function getPhoneCountries(locale = 'en'): PhoneCountry[] {
  if (cached && locale === 'en') return cached

  const all = getCountries().map((iso) => ({
    iso,
    dial: `+${getCountryCallingCode(iso)}`,
    name: countryName(iso, locale),
    flag: flagEmoji(iso),
  }))

  const priority = new Set(PRIORITY_COUNTRIES)
  all.sort((a, b) => {
    const ap = priority.has(a.iso) ? PRIORITY_COUNTRIES.indexOf(a.iso) : 999
    const bp = priority.has(b.iso) ? PRIORITY_COUNTRIES.indexOf(b.iso) : 999
    if (ap !== bp) return ap - bp
    return a.name.localeCompare(b.name)
  })

  if (locale === 'en') cached = all
  return all
}

export function findCountry(iso: string | null | undefined): PhoneCountry | undefined {
  if (!iso) return undefined
  return getPhoneCountries().find((c) => c.iso === iso.toUpperCase())
}

/** Map common timezones → ISO country (best-effort client fallback). */
export const TIMEZONE_COUNTRY: Record<string, CountryCode> = {
  'Africa/Casablanca': 'MA',
  'Africa/El_Aaiun': 'MA',
  'Europe/Paris': 'FR',
  'Europe/Madrid': 'ES',
  'Europe/Berlin': 'DE',
  'Europe/London': 'GB',
  'Europe/Brussels': 'BE',
  'Europe/Amsterdam': 'NL',
  'Europe/Rome': 'IT',
  'Europe/Zurich': 'CH',
  'Europe/Lisbon': 'PT',
  'America/New_York': 'US',
  'America/Los_Angeles': 'US',
  'America/Toronto': 'CA',
  'Asia/Dubai': 'AE',
  'Asia/Riyadh': 'SA',
  'Asia/Qatar': 'QA',
  'Africa/Tunis': 'TN',
  'Africa/Algiers': 'DZ',
  'Africa/Dakar': 'SN',
}

export function detectCountryFromBrowser(): CountryCode | null {
  if (typeof window === 'undefined') return null

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (tz && TIMEZONE_COUNTRY[tz]) return TIMEZONE_COUNTRY[tz]
  } catch {
    // ignore
  }

  const langs = [navigator.language, ...(navigator.languages || [])]
  for (const lang of langs) {
    const region = lang.split('-')[1]?.toUpperCase()
    if (region && /^[A-Z]{2}$/.test(region)) {
      const match = getCountries().find((c) => c === region)
      if (match) return match
    }
    const primary = lang.split('-')[0]?.toLowerCase()
    if (primary === 'fr') return 'FR'
    if (primary === 'es') return 'ES'
    if (primary === 'ar') return 'MA'
    if (primary === 'de') return 'DE'
    if (primary === 'en') return 'GB'
  }

  return null
}
