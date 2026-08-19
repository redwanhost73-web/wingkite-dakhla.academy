import type { ContentDraft, DraftMap } from '@/lib/edit-mode/types'
import { draftId } from '@/lib/edit-mode/types'

const STORAGE_KEY = 'wkda-edit-drafts-v1'

export function loadDrafts(): DraftMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as DraftMap
  } catch {
    return {}
  }
}

export function saveDrafts(drafts: DraftMap) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
  } catch {
    // quota / private mode
  }
}

export function clearDraftsStorage() {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function upsertDraft(map: DraftMap, draft: ContentDraft): DraftMap {
  const next = { ...map, [draftId(draft.type, draft.key)]: draft }
  saveDrafts(next)
  return next
}

export function removeDraft(map: DraftMap, type: ContentDraft['type'], key: string): DraftMap {
  const next = { ...map }
  delete next[draftId(type, key)]
  saveDrafts(next)
  return next
}

export function draftsList(map: DraftMap): ContentDraft[] {
  return Object.values(map)
}
