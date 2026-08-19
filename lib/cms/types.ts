export type LocaleCode = 'fr' | 'en' | 'es' | 'ar'

export type Localized = {
  fr: string
  en: string
  es: string
  ar: string
}

export function emptyLocalized(fallback = ''): Localized {
  return { fr: fallback, en: fallback, es: fallback, ar: fallback }
}

export function pickLocale(text: Localized | undefined, locale: string, fallback = ''): string {
  if (!text) return fallback
  if (locale === 'fr') return text.fr || fallback
  if (locale === 'es') return text.es || text.en || fallback
  if (locale === 'ar') return text.ar || text.en || fallback
  return text.en || fallback
}

export function fromColumns(
  row: Record<string, unknown>,
  prefix: string,
): Localized {
  return {
    fr: String(row[`${prefix}_fr`] ?? ''),
    en: String(row[`${prefix}_en`] ?? ''),
    es: String(row[`${prefix}_es`] ?? ''),
    ar: String(row[`${prefix}_ar`] ?? ''),
  }
}
