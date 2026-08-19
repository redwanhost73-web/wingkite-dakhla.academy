import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/cms/require-admin'
import { emptyLocalized, type Localized } from '@/lib/cms/types'
import { deepseekChat, isDeepseekConfigured } from '@/lib/edit-mode/deepseek'
import {
  buildRecommendPrompt,
  buildTranslatePrompt,
  localesToFill,
  parseJsonObject,
  pickSourceLocale,
} from '@/lib/edit-mode/ai-prompts'
import type {
  EditAiActionId,
  EditAiActionResult,
  EditAiRecommendation,
  EditableFieldType,
} from '@/lib/edit-mode/types'

type Body = {
  action?: EditAiActionId
  fieldType?: EditableFieldType
  fieldKey?: string
  locale?: string
  sourceLocale?: string
  page?: string
  section?: string
  currentText?: string
  currentValues?: Partial<Localized>
  currentUrl?: string
  instruction?: string
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (admin.error || !admin.user) return admin.error!

  if (!isDeepseekConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'DEEPSEEK_API_KEY is not configured on the server' },
      { status: 503 },
    )
  }

  let body: Body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const action = body.action
  if (action !== 'translate' && action !== 'recommend') {
    return NextResponse.json({ ok: false, error: 'Unknown action' }, { status: 400 })
  }

  const fieldKey = body.fieldKey || 'field'
  const page = body.page || 'site'
  const section = body.section || page
  const fieldType = body.fieldType === 'image' ? 'image' : 'text'
  const values: Localized = {
    ...emptyLocalized(),
    ...(body.currentValues || {}),
  }

  if (action === 'translate') {
    const result = await runTranslate({
      values,
      sourceLocale: body.sourceLocale || body.locale,
      page,
      section,
      fieldKey,
    })
    return NextResponse.json(result, { status: result.ok ? 200 : 422 })
  }

  const result = await runRecommend({
    values,
    fieldType,
    fieldKey,
    page,
    section,
    currentText: body.currentText,
    currentUrl: body.currentUrl,
  })
  return NextResponse.json(result, { status: result.ok ? 200 : 422 })
}

async function runTranslate(params: {
  values: Localized
  sourceLocale?: string | null
  page: string
  section: string
  fieldKey: string
}): Promise<EditAiActionResult> {
  const source = pickSourceLocale(params.values, params.sourceLocale)
  if (!source) {
    return { ok: false, error: 'Edit one language first, then Translate' }
  }

  const text = params.values[source].trim()
  const targets = localesToFill(source)
  const prompt = buildTranslatePrompt({
    source,
    text,
    targets,
    page: params.page,
    section: params.section,
    fieldKey: params.fieldKey,
  })

  const chat = await deepseekChat({
    messages: [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ],
    temperature: 0.2,
  })

  if (!chat.ok) return { ok: false, error: chat.error }

  const parsed = parseJsonObject(chat.content)
  if (!parsed) {
    return { ok: false, error: 'Could not parse DeepSeek translation JSON' }
  }

  const next: Localized = { ...params.values }
  next[source] = text

  for (const loc of targets) {
    const v = parsed[loc]
    if (typeof v === 'string' && v.trim()) {
      next[loc] = v.trim()
    }
  }

  const filled = targets.filter((l) => next[l]?.trim())
  if (!filled.length) {
    return { ok: false, error: 'DeepSeek returned no translations' }
  }

  return { ok: true, values: next }
}

async function runRecommend(params: {
  values: Localized
  fieldType: 'text' | 'image'
  fieldKey: string
  page: string
  section: string
  currentText?: string
  currentUrl?: string
}): Promise<EditAiActionResult> {
  const prompt = buildRecommendPrompt({
    page: params.page,
    section: params.section,
    fieldKey: params.fieldKey,
    fieldType: params.fieldType,
    currentText: params.currentText,
    currentValues: params.values,
    currentUrl: params.currentUrl,
  })

  const chat = await deepseekChat({
    messages: [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ],
    temperature: 0.6,
  })

  if (!chat.ok) return { ok: false, error: chat.error }

  const parsed = parseJsonObject(chat.content)
  if (!parsed) {
    return { ok: false, error: 'Could not parse DeepSeek recommendations' }
  }

  const rawList = Array.isArray(parsed.recommendations)
    ? parsed.recommendations
    : Array.isArray(parsed.suggestions)
      ? parsed.suggestions
      : []

  const recommendations: EditAiRecommendation[] = rawList
    .map((item, index): EditAiRecommendation | null => {
      if (!item || typeof item !== 'object') return null
      const row = item as Record<string, unknown>
      const title = String(row.title || `Suggestion ${index + 1}`)
      const rationale = String(row.rationale || row.reason || '')
      const values =
        row.values && typeof row.values === 'object'
          ? (row.values as Partial<Localized>)
          : undefined
      const url = typeof row.url === 'string' ? row.url : undefined
      return {
        id: String(row.id || index + 1),
        title,
        rationale,
        values,
        url,
      }
    })
    .filter((r): r is EditAiRecommendation => Boolean(r))

  if (!recommendations.length) {
    return { ok: false, error: 'No recommendations returned' }
  }

  return { ok: true, recommendations }
}
