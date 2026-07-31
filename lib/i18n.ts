export const locales = ['fr', 'en', 'es', 'ar'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'fr'

export function getMessages(locale: Locale) {
  return import(`@/messages/${locale}.json`).then((m) => m.default)
}
