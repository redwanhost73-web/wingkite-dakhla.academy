'use client'

import { useEffect, useMemo, useState } from 'react'
import { Languages, Sparkles, X } from 'lucide-react'
import { toast } from 'sonner'
import { useEditMode } from '@/components/edit-mode/edit-mode-provider'
import { ImageEditor } from '@/components/edit-mode/image-editor'
import { PricingListInspector } from '@/components/edit-mode/pricing-list-inspector'
import { EDIT_AI_ACTIONS, getDefaultEditAiProvider } from '@/lib/edit-mode/ai-actions'
import { formatFieldContextLabel, parseFieldContext } from '@/lib/edit-mode/context'
import type { EditAiRecommendation } from '@/lib/edit-mode/types'
import type { Localized } from '@/lib/cms/types'
import { emptyLocalized } from '@/lib/cms/types'
import { useTranslations } from '@/lib/i18n-context'
import { cn } from '@/lib/utils'

const LOCALES: Array<keyof Localized> = ['fr', 'en', 'es', 'ar']

export function EditInspector() {
  const {
    enabled,
    selectedId,
    clearSelection,
    drafts,
    setTextDraft,
    setImageDraft,
    discardOne,
  } = useEditMode()
  const { locale } = useTranslations()
  const [sourceLocale, setSourceLocale] = useState<keyof Localized>(
    (LOCALES.includes(locale as keyof Localized) ? locale : 'en') as keyof Localized,
  )

  const draft = selectedId ? drafts[selectedId] : undefined

  useEffect(() => {
    if (LOCALES.includes(locale as keyof Localized)) {
      setSourceLocale(locale as keyof Localized)
    }
  }, [selectedId, locale])

  if (!enabled || !selectedId || !draft) return null

  const ctx = parseFieldContext(draft.key)

  return (
    <aside
      data-edit-chrome
      className={cn(
        'fixed bottom-24 right-4 z-[90] flex flex-col overflow-hidden rounded-2xl border border-[#072A5A]/10 bg-white text-[#072A5A] shadow-[0_25px_60px_rgba(11,31,59,0.25)] sm:bottom-8',
        draft.type === 'image' || draft.type === 'list'
          ? 'w-[min(26rem,calc(100vw-2rem))]'
          : 'w-[min(22rem,calc(100vw-2rem))]',
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-[#072A5A]/8 bg-[#0B1F3B] px-4 py-3 text-white">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/45">
            Edit {draft.type === 'list' ? 'table' : draft.type} ·{' '}
            {draft.type === 'list' ? draft.key : formatFieldContextLabel(ctx)}
          </p>
          <p className="truncate text-sm font-semibold">{draft.label || draft.key}</p>
        </div>
        <button
          type="button"
          onClick={clearSelection}
          className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Close inspector"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[min(60vh,28rem)] space-y-4 overflow-y-auto overscroll-contain p-4">
        {draft.type === 'text' ? (
          <TextInspector
            fieldKey={draft.key}
            values={draft.values}
            label={draft.label}
            activeLocale={sourceLocale}
            onActiveLocaleChange={setSourceLocale}
            onChange={(values) => setTextDraft(draft.key, values, draft.label)}
          />
        ) : draft.type === 'image' ? (
          <ImageEditor
            fieldKey={draft.key}
            url={draft.url}
            label={draft.label}
            alts={draft.alts}
            onChange={({ url, alts }) =>
              setImageDraft(draft.key, url, draft.label, alts)
            }
          />
        ) : (
          <PricingListInspector draft={draft} />
        )}

        {draft.type !== 'list' && (
          <AiActionsPanel
            fieldType={draft.type}
            fieldKey={draft.key}
            label={draft.label}
            sourceLocale={sourceLocale}
          />
        )}

        <button
          type="button"
          onClick={() => {
            discardOne(draft.type, draft.key)
            clearSelection()
            toast.message('Draft cleared for this field')
          }}
          className="w-full rounded-full border border-[#072A5A]/15 py-2 text-xs font-bold text-[#3D4F6F] hover:bg-[#FAF8F3]"
        >
          Revert this field
        </button>
      </div>
    </aside>
  )
}

function TextInspector({
  fieldKey,
  values,
  label,
  activeLocale,
  onActiveLocaleChange,
  onChange,
}: {
  fieldKey: string
  values: Localized
  label?: string
  activeLocale: keyof Localized
  onActiveLocaleChange: (locale: keyof Localized) => void
  onChange: (values: Localized) => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#7A8AA3]">
        {label || fieldKey}
      </p>
      <div className="flex gap-1 rounded-xl bg-[#F0EBE3] p-1">
        {LOCALES.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => onActiveLocaleChange(loc)}
            className={cn(
              'flex-1 rounded-lg py-1.5 text-[0.65rem] font-bold uppercase',
              activeLocale === loc ? 'bg-white text-[#072A5A] shadow-sm' : 'text-[#7A8AA3]',
            )}
          >
            {loc}
          </button>
        ))}
      </div>
      <textarea
        value={values[activeLocale] || ''}
        onChange={(e) => onChange({ ...values, [activeLocale]: e.target.value })}
        rows={fieldKey.includes('cta') || fieldKey.includes('eyebrow') ? 2 : 5}
        className="w-full rounded-xl border border-[#072A5A]/12 bg-[#FAF8F3] px-3 py-2.5 text-sm outline-none focus:border-[#0046A4]/40 focus:ring-[3px] focus:ring-[#0046A4]/12"
      />
      <p className="text-[0.65rem] text-[#7A8AA3]">
        Translate uses the <span className="font-bold uppercase text-[#3D4F6F]">{activeLocale}</span> tab as the source.
      </p>
    </div>
  )
}

function AiActionsPanel({
  fieldType,
  fieldKey,
  label,
  sourceLocale,
}: {
  fieldType: 'text' | 'image'
  fieldKey: string
  label?: string
  sourceLocale: keyof Localized
}) {
  const { locale } = useTranslations()
  const ctx = useMemo(() => parseFieldContext(fieldKey), [fieldKey])
  const actions = useMemo(
    () => EDIT_AI_ACTIONS.filter((a) => a.appliesTo.includes(fieldType)),
    [fieldType],
  )
  const { setTextDraft, getTextDraft, setImageDraft, getImageDraft } = useEditMode()
  const [busy, setBusy] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<EditAiRecommendation[]>([])

  useEffect(() => {
    setRecommendations([])
  }, [fieldKey])

  const run = async (actionId: (typeof actions)[number]['id']) => {
    const provider = getDefaultEditAiProvider()
    if (!provider) return
    setBusy(actionId)
    const textDraft = getTextDraft(fieldKey)
    const imageDraft = getImageDraft(fieldKey)
    const values = textDraft?.values || emptyLocalized()
    const result = await provider.run({
      action: actionId,
      fieldType,
      fieldKey,
      locale,
      sourceLocale,
      page: ctx.page,
      section: ctx.section,
      currentValues: values,
      currentText: values[sourceLocale] || values.en || values.fr,
      currentUrl: imageDraft?.url,
      instruction: label,
    })
    setBusy(null)
    if (!result.ok) {
      toast.error(result.error || 'AI action unavailable')
      return
    }
    if (result.values) {
      setTextDraft(
        fieldKey,
        { ...values, ...result.values },
        textDraft?.label || label,
      )
      toast.success(
        actionId === 'translate'
          ? `Translated from ${sourceLocale.toUpperCase()} into the other languages`
          : 'AI draft applied',
      )
    }
    if (result.url && imageDraft) {
      setImageDraft(fieldKey, result.url, imageDraft.label)
      toast.success('Image suggestion applied')
    }
    if (result.recommendations?.length) {
      setRecommendations(result.recommendations)
      toast.success(`${result.recommendations.length} recommendations ready`)
    }
  }

  const applyRecommendation = (rec: EditAiRecommendation) => {
    if (fieldType === 'text' && rec.values) {
      const draft = getTextDraft(fieldKey)
      if (!draft) return
      setTextDraft(fieldKey, { ...draft.values, ...rec.values }, draft.label)
      toast.success(`Applied: ${rec.title}`)
      return
    }
    if (fieldType === 'image' && rec.url) {
      const draft = getImageDraft(fieldKey)
      setImageDraft(fieldKey, rec.url, draft?.label || label)
      toast.success(`Applied: ${rec.title}`)
    }
  }

  if (!actions.length) return null

  return (
    <div className="space-y-3 rounded-xl border border-dashed border-[#072A5A]/15 bg-[#FAF8F3] p-3">
      <div>
        <p className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-[#7A8AA3]">
          <Sparkles className="h-3.5 w-3.5 text-[#0046A4]" />
          AI for this selection
        </p>
        <p className="mt-1 text-[0.7rem] text-[#7A8AA3]">
          Context: <span className="font-semibold text-[#3D4F6F]">{formatFieldContextLabel(ctx)}</span>
        </p>
      </div>

      <div className="grid gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            title={action.description}
            disabled={busy === action.id}
            onClick={() => run(action.id)}
            className={cn(
              'inline-flex h-10 items-center justify-center gap-2 rounded-full text-xs font-bold transition-colors disabled:opacity-50',
              action.id === 'translate'
                ? 'bg-[#0B1F3B] text-white hover:bg-[#0046A4]'
                : 'border border-[#0046A4]/25 bg-white text-[#072A5A] hover:border-[#0046A4]/50',
            )}
          >
            {action.id === 'translate' ? (
              <Languages className="h-3.5 w-3.5" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-[#0046A4]" />
            )}
            {busy === action.id ? 'Working…' : action.label}
          </button>
        ))}
      </div>

      {recommendations.length > 0 && (
        <ul className="space-y-2">
          {recommendations.map((rec) => (
            <li
              key={rec.id}
              className="rounded-xl border border-[#072A5A]/10 bg-white p-3"
            >
              <p className="text-xs font-bold text-[#072A5A]">{rec.title}</p>
              <p className="mt-1 text-[0.7rem] leading-relaxed text-[#7A8AA3]">{rec.rationale}</p>
              <button
                type="button"
                onClick={() => applyRecommendation(rec)}
                className="mt-2 text-[0.7rem] font-bold text-[#0046A4] hover:underline"
              >
                Apply suggestion
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-[0.65rem] text-[#7A8AA3]">
        Powered by DeepSeek. Translate fills other locales from the active language tab; Magic recommend uses this page/section.
      </p>
    </div>
  )
}

/** Escape closes selection; capture-phase click blocks all in-page navigation while editing. */
export function EditModeClickAway() {
  const { enabled, selectedId, clearSelection } = useEditMode()

  useEffect(() => {
    if (!enabled) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') clearSelection()
    }

    const onClickCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      if (target.closest('[data-edit-chrome]')) return
      if (target.closest('[data-editable]')) return

      const anchor = target.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return
      // Keep editing on the same page — no redirects while Edit Mode is on
      e.preventDefault()
      e.stopPropagation()
      toast.message('Navigation paused while Edit Mode is on')
    }

    window.addEventListener('keydown', onKey)
    document.addEventListener('click', onClickCapture, true)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClickCapture, true)
    }
  }, [enabled, selectedId, clearSelection])

  return null
}
