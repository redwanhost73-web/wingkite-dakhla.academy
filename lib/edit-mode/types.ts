import type { Localized } from '@/lib/cms/types'
import type { PricingRow } from '@/lib/site-config'

export type EditableFieldType = 'text' | 'image' | 'list'

export type TextDraft = {
  type: 'text'
  key: string
  values: Localized
  label?: string
}

export type ImageDraft = {
  type: 'image'
  key: string
  url: string
  label?: string
  alts?: Localized
}

/** Supported structured lists for Edit Mode (extend as more tables go live). */
export type EditableListKey = 'pricing'

export type PricingListItem = PricingRow & { id: string }

export type ListDraft = {
  type: 'list'
  key: EditableListKey
  label?: string
  items: PricingListItem[]
  /** Currently focused row inside the list inspector. */
  selectedItemId?: string | null
}

export type ContentDraft = TextDraft | ImageDraft | ListDraft

export type DraftMap = Record<string, ContentDraft>

export function draftId(type: EditableFieldType, key: string) {
  return `${type}:${key}`
}

export type PublishPayload = {
  changes: ContentDraft[]
}

/**
 * Provider-agnostic AI actions.
 * Primary product focus: translate + contextual magic recommendations.
 */
export type EditAiActionId = 'translate' | 'recommend'

export type EditAiActionRequest = {
  action: EditAiActionId
  fieldType: 'text' | 'image'
  fieldKey: string
  locale: string
  sourceLocale?: string
  page: string
  section: string
  currentText?: string
  currentValues?: Localized
  currentUrl?: string
  instruction?: string
}

export type EditAiRecommendation = {
  id: string
  title: string
  rationale: string
  values?: Partial<Localized>
  text?: string
  url?: string
}

export type EditAiActionResult = {
  ok: boolean
  values?: Partial<Localized>
  text?: string
  url?: string
  recommendations?: EditAiRecommendation[]
  error?: string
}

export type EditAiProvider = {
  id: string
  label: string
  run: (req: EditAiActionRequest) => Promise<EditAiActionResult>
}
