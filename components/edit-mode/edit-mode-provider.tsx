'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Localized } from '@/lib/cms/types'
import type {
  ContentDraft,
  DraftMap,
  EditableFieldType,
  EditableListKey,
  ImageDraft,
  ListDraft,
  PricingListItem,
  TextDraft,
} from '@/lib/edit-mode/types'
import { draftId } from '@/lib/edit-mode/types'
import {
  clearDraftsStorage,
  draftsList,
  loadDrafts,
  removeDraft,
  upsertDraft,
} from '@/lib/edit-mode/draft-store'
import { toast } from 'sonner'

type EditModeContextValue = {
  isAdmin: boolean
  adminReady: boolean
  enabled: boolean
  setEnabled: (on: boolean) => void
  selectedId: string | null
  select: (type: EditableFieldType, key: string) => void
  clearSelection: () => void
  drafts: DraftMap
  draftCount: number
  getTextDraft: (key: string) => TextDraft | undefined
  getImageDraft: (key: string) => ImageDraft | undefined
  getListDraft: (key: EditableListKey) => ListDraft | undefined
  setTextDraft: (key: string, values: Localized, label?: string) => void
  setImageDraft: (
    key: string,
    url: string,
    label?: string,
    alts?: Localized,
  ) => void
  setListDraft: (draft: ListDraft) => void
  openPricingEditor: (items: PricingListItem[], selectedItemId?: string) => void
  discardAll: () => void
  discardOne: (type: EditableFieldType, key: string) => void
  openImageSlot: (key: string, url: string, label?: string) => void
  publish: () => Promise<boolean>
  publishing: boolean
}

const EditModeContext = createContext<EditModeContextValue | null>(null)

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminReady, setAdminReady] = useState(false)
  const [enabled, setEnabledState] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<DraftMap>({})
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    setDrafts(loadDrafts())
  }, [])

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      setAdminReady(true)
      return
    }

    let cancelled = false
    supabase.auth.getUser().then(async ({ data }) => {
      if (cancelled) return
      if (!data.user) {
        setIsAdmin(false)
        setAdminReady(true)
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle()
      const admin = profile?.role === 'admin'
      setIsAdmin(admin)
      setAdminReady(true)
      if (!admin) {
        setEnabledState(false)
        setSelectedId(null)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      supabase.auth.getUser().then(async ({ data }) => {
        if (!data.user) {
          setIsAdmin(false)
          setEnabledState(false)
          return
        }
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle()
        const admin = profile?.role === 'admin'
        setIsAdmin(admin)
        if (!admin) setEnabledState(false)
      })
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const setEnabled = useCallback(
    (on: boolean) => {
      if (!isAdmin) return
      setEnabledState(on)
      if (!on) setSelectedId(null)
    },
    [isAdmin],
  )

  const select = useCallback(
    (type: EditableFieldType, key: string) => {
      if (!enabled) return
      setSelectedId(draftId(type, key))
    },
    [enabled],
  )

  const clearSelection = useCallback(() => setSelectedId(null), [])

  const setTextDraft = useCallback((key: string, values: Localized, label?: string) => {
    setDrafts((prev) =>
      upsertDraft(prev, { type: 'text', key, values, label }),
    )
  }, [])

  const setImageDraft = useCallback(
    (key: string, url: string, label?: string, alts?: Localized) => {
      setDrafts((prev) => {
        const existing = prev[`image:${key}`]
        const prevAlts =
          existing?.type === 'image' ? existing.alts : undefined
        return upsertDraft(prev, {
          type: 'image',
          key,
          url,
          label,
          alts: alts ?? prevAlts,
        })
      })
    },
    [],
  )

  const setListDraft = useCallback((draft: ListDraft) => {
    setDrafts((prev) => upsertDraft(prev, draft))
  }, [])

  const openPricingEditor = useCallback(
    (items: PricingListItem[], selectedItemId?: string) => {
      if (!isAdmin) return
      setEnabledState(true)
      setDrafts((prev) =>
        upsertDraft(prev, {
          type: 'list',
          key: 'pricing',
          label: 'Pricing table',
          items,
          selectedItemId: selectedItemId || items[0]?.id || null,
        }),
      )
      setSelectedId(draftId('list', 'pricing'))
    },
    [isAdmin],
  )

  const discardAll = useCallback(() => {
    clearDraftsStorage()
    setDrafts({})
    toast.message('Drafts discarded')
  }, [])

  const discardOne = useCallback((type: EditableFieldType, key: string) => {
    setDrafts((prev) => removeDraft(prev, type, key))
  }, [])

  const openImageSlot = useCallback(
    (key: string, url: string, label?: string) => {
      if (!isAdmin) return
      setEnabledState(true)
      setDrafts((prev) => {
        const existing = prev[draftId('image', key)]
        if (existing?.type === 'image') {
          return upsertDraft(prev, {
            ...existing,
            label: label || existing.label,
          })
        }
        return upsertDraft(prev, { type: 'image', key, url, label })
      })
      setSelectedId(draftId('image', key))
    },
    [isAdmin],
  )

  const publish = useCallback(async () => {
    const changes = draftsList(drafts)
    if (!changes.length) {
      toast.message('Nothing to publish')
      return false
    }
    setPublishing(true)
    try {
      const res = await fetch('/api/admin/content/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Publish failed')
      clearDraftsStorage()
      setDrafts({})
      setSelectedId(null)
      toast.success(`Published ${changes.length} change${changes.length === 1 ? '' : 's'}`)
      window.dispatchEvent(new Event('cms:refresh'))
      return true
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Publish failed')
      return false
    } finally {
      setPublishing(false)
    }
  }, [drafts])

  const value = useMemo<EditModeContextValue>(
    () => ({
      isAdmin,
      adminReady,
      enabled: enabled && isAdmin,
      setEnabled,
      selectedId,
      select,
      clearSelection,
      drafts,
      draftCount: Object.keys(drafts).length,
      getTextDraft: (key) => {
        const d = drafts[draftId('text', key)]
        return d?.type === 'text' ? d : undefined
      },
      getImageDraft: (key) => {
        const d = drafts[draftId('image', key)]
        return d?.type === 'image' ? d : undefined
      },
      getListDraft: (key) => {
        const d = drafts[draftId('list', key)]
        return d?.type === 'list' ? d : undefined
      },
      setTextDraft,
      setImageDraft,
      setListDraft,
      openPricingEditor,
      discardAll,
      discardOne,
      openImageSlot,
      publish,
      publishing,
    }),
    [
      isAdmin,
      adminReady,
      enabled,
      setEnabled,
      selectedId,
      select,
      clearSelection,
      drafts,
      setTextDraft,
      setImageDraft,
      setListDraft,
      openPricingEditor,
      discardAll,
      discardOne,
      openImageSlot,
      publish,
      publishing,
    ],
  )

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>
}

export function useEditMode() {
  const ctx = useContext(EditModeContext)
  if (!ctx) {
    return {
      isAdmin: false,
      adminReady: true,
      enabled: false,
      setEnabled: () => {},
      selectedId: null,
      select: () => {},
      clearSelection: () => {},
      drafts: {} as DraftMap,
      draftCount: 0,
      getTextDraft: () => undefined,
      getImageDraft: () => undefined,
      getListDraft: () => undefined,
      setTextDraft: () => {},
      setImageDraft: () => {},
      setListDraft: () => {},
      openPricingEditor: () => {},
      discardAll: () => {},
      discardOne: () => {},
      openImageSlot: () => {},
      publish: async () => false,
      publishing: false,
    } satisfies EditModeContextValue
  }
  return ctx
}
