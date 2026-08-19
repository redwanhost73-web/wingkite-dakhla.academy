import type { LocaleCode, Localized } from '@/lib/cms/types'

const LOCALES: LocaleCode[] = ['fr', 'en', 'es', 'ar']

const LOCALE_NAMES: Record<LocaleCode, string> = {
  fr: 'French',
  en: 'English',
  es: 'Spanish',
  ar: 'Arabic',
}

/** Prefer explicit source, else first non-empty locale in FR→EN→ES→AR. */
export function pickSourceLocale(
  values: Localized,
  preferred?: string | null,
): LocaleCode | null {
  if (preferred && LOCALES.includes(preferred as LocaleCode)) {
    const key = preferred as LocaleCode
    if (values[key]?.trim()) return key
  }
  for (const loc of LOCALES) {
    if (values[loc]?.trim()) return loc
  }
  return null
}

export function localesToFill(source: LocaleCode): LocaleCode[] {
  return LOCALES.filter((l) => l !== source)
}

export function buildTranslatePrompt(params: {
  source: LocaleCode
  text: string
  targets: LocaleCode[]
  page: string
  section: string
  fieldKey: string
}) {
  const targetList = params.targets
    .map((l) => `${l} (${LOCALE_NAMES[l]})`)
    .join(', ')

  return {
    system: `You are a professional website copytranslator for Wing Kite Dakhla Academy, a wingfoil/kitesurf school in Dakhla, Morocco.
Return ONLY valid JSON with keys for each target locale. Keep CTA buttons short. Preserve brand names (Wingfoil, Kitesurf, IKO, Dakhla, Wing Kite Dakhla Academy). Match tone of the source.`,
    user: `Translate this ${LOCALE_NAMES[params.source]} website text into: ${targetList}.

Page: ${params.page}
Section: ${params.section}
Field: ${params.fieldKey}

Source (${params.source}):
"""
${params.text}
"""

Respond with JSON only, example shape:
{${params.targets.map((l) => `"${l}":"..."`).join(',')}}`,
  }
}

export function buildRecommendPrompt(params: {
  page: string
  section: string
  fieldKey: string
  fieldType: 'text' | 'image'
  currentText?: string
  currentValues?: Localized
  currentUrl?: string
}) {
  return {
    system: `You are a conversion-focused content advisor for Wing Kite Dakhla Academy (wingfoil & kitesurf school in Dakhla, Morocco).
Suggest 2–3 concise alternatives for the selected field. Return ONLY valid JSON:
{"recommendations":[{"id":"1","title":"...","rationale":"...","values":{"fr":"...","en":"...","es":"...","ar":"..."}}]}
For image fields, omit values and include "url" only if you have a concrete public URL; otherwise give title/rationale about imagery direction without a url.`,
    user: `Page: ${params.page}
Section: ${params.section}
Field: ${params.fieldKey}
Type: ${params.fieldType}
Current text: ${params.currentText || ''}
Current values: ${JSON.stringify(params.currentValues || {})}
Current image URL: ${params.currentUrl || ''}`,
  }
}

export function parseJsonObject(raw: string): Record<string, unknown> | null {
  const trimmed = raw.trim()
  try {
    return JSON.parse(trimmed) as Record<string, unknown>
  } catch {
    const start = trimmed.indexOf('{')
    const end = trimmed.lastIndexOf('}')
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1)) as Record<string, unknown>
      } catch {
        return null
      }
    }
    return null
  }
}

export { LOCALES, LOCALE_NAMES }
