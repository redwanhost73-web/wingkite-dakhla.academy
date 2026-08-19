/** Derive page / section context from a CMS field key for AI recommendations. */

export type FieldContext = {
  page: string
  section: string
  field: string
}

/**
 * Examples:
 * - `home.hero.ctaPrimary` → page home, section home.hero
 * - `homeHero` → page home, section home
 * - `pricing.title` → page pricing, section pricing
 */
export function parseFieldContext(fieldKey: string): FieldContext {
  const parts = fieldKey.split('.').filter(Boolean)
  if (parts.length >= 2) {
    return {
      page: parts[0],
      section: parts.slice(0, -1).join('.'),
      field: parts[parts.length - 1],
    }
  }

  const camel = fieldKey.match(/^(home|about|pricing|contact|media|gallery|wing|kite)/i)
  const page = (camel?.[1] || 'site').toLowerCase()
  return { page, section: page, field: fieldKey }
}

export function formatFieldContextLabel(ctx: FieldContext) {
  return `${ctx.page} · ${ctx.section}`
}
