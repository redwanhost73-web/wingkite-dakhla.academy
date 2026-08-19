'use client'

import {
  createElement,
  useMemo,
  type CSSProperties,
  type ElementType,
  type MouseEvent,
  type ReactNode,
} from 'react'
import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { useEditMode } from '@/components/edit-mode/edit-mode-provider'
import { useTranslations } from '@/lib/i18n-context'
import type { Localized } from '@/lib/cms/types'
import { pickLocale } from '@/lib/cms/types'
import { draftId } from '@/lib/edit-mode/types'
import { cn } from '@/lib/utils'

type EditableTextProps = {
  fieldKey: string
  defaults: Localized
  /** Optional live CMS override (from useSiteConfig texts). */
  cms?: Localized | undefined
  label?: string
  as?: ElementType
  className?: string
  style?: CSSProperties
  children?: never
}

/**
 * Generic editable text. Zero DOM/behavior cost when Edit Mode is off —
 * renders a plain element with the resolved string.
 */
export function EditableText({
  fieldKey,
  defaults,
  cms,
  label,
  as = 'span',
  className,
  style,
}: EditableTextProps) {
  const { locale } = useTranslations()
  const { enabled, selectedId, select, getTextDraft, setTextDraft } = useEditMode()

  const draft = getTextDraft(fieldKey)
  const values = draft?.values || cms || defaults
  const text = pickLocale(values, locale, pickLocale(defaults, locale))

  const id = draftId('text', fieldKey)
  const selected = enabled && selectedId === id

  if (!enabled) {
    return createElement(as, { className, style }, text)
  }

  return createElement(
    as,
    {
      className: cn(
        className,
        'group/editable relative cursor-pointer outline-none transition-[box-shadow,background-color]',
        'hover:ring-2 hover:ring-[#0046A4]/45 hover:ring-offset-2 hover:ring-offset-transparent',
        selected && 'ring-2 ring-[#0046A4] ring-offset-2 ring-offset-transparent',
      ),
      style,
      'data-editable': 'text',
      'data-editable-key': fieldKey,
      onClick: (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        // Seed draft from current resolved values on first open
        if (!draft) setTextDraft(fieldKey, values, label || fieldKey)
        select('text', fieldKey)
      },
    },
    <>
      {text}
      <span
        className="pointer-events-none absolute -right-1 -top-1 rounded-full bg-[#0B1F3B] p-1 text-white opacity-0 shadow-md transition-opacity group-hover/editable:opacity-100"
        aria-hidden
      >
        <Pencil className="h-3 w-3" />
      </span>
    </>,
  )
}

type EditableImageProps = {
  fieldKey: string
  src: string
  label?: string
  className?: string
  children: ReactNode
}

/** Wraps an image region; click-to-edit when Edit Mode is on. */
export function EditableImage({ fieldKey, src, label, className, children }: EditableImageProps) {
  const { enabled, selectedId, select, getImageDraft, setImageDraft } = useEditMode()
  const draft = getImageDraft(fieldKey)
  const liveSrc = draft?.url || src
  const id = draftId('image', fieldKey)
  const selected = enabled && selectedId === id

  // Clone children is hard; re-render strategy: parent should use resolved src.
  // This wrapper only adds chrome — parent passes children already using liveSrc via hook.
  if (!enabled) {
    return <>{children}</>
  }

  return (
    <div
      className={cn(
        'group/editable relative',
        selected && 'z-[5]',
        className,
      )}
      data-editable="image"
      data-editable-key={fieldKey}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!draft) setImageDraft(fieldKey, liveSrc, label || fieldKey)
        select('image', fieldKey)
      }}
    >
      {children}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 transition-[box-shadow]',
          'group-hover/editable:shadow-[inset_0_0_0_2px_rgba(0,70,164,0.55)]',
          selected && 'shadow-[inset_0_0_0_2px_#0046A4]',
        )}
      />
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-[#0B1F3B]/90 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white opacity-0 shadow-md transition-opacity group-hover/editable:opacity-100">
        Edit image
      </span>
    </div>
  )
}

/** Resolve image URL with draft overlay for the current field. */
export function useEditableImageSrc(fieldKey: string, src: string) {
  const { getImageDraft } = useEditMode()
  const draft = fieldKey ? getImageDraft(fieldKey) : undefined
  return useMemo(() => draft?.url || src, [draft?.url, src])
}

/** Resolve localized string with draft/CMS/default cascade. */
export function useEditableTextValue(
  fieldKey: string,
  defaults: Localized,
  cms?: Localized,
) {
  const { locale } = useTranslations()
  const { getTextDraft } = useEditMode()
  const draft = getTextDraft(fieldKey)
  const values = draft?.values || cms || defaults
  return pickLocale(values, locale, pickLocale(defaults, locale))
}

type EditableLinkProps = {
  fieldKey: string
  href: string
  defaults: Localized
  cms?: Localized | undefined
  label?: string
  className?: string
  /** Optional content before the label (icon, dot, etc.). */
  before?: ReactNode
  /** Optional content after the label. */
  after?: ReactNode
}

/**
 * Editable CTA / button-link. When Edit Mode is on, navigation is blocked and
 * the label opens the text inspector like any other editable field.
 */
export function EditableLink({
  fieldKey,
  href,
  defaults,
  cms,
  label,
  className,
  before,
  after,
}: EditableLinkProps) {
  const { locale } = useTranslations()
  const { enabled, selectedId, select, getTextDraft, setTextDraft } = useEditMode()

  const draft = getTextDraft(fieldKey)
  const values = draft?.values || cms || defaults
  const text = pickLocale(values, locale, pickLocale(defaults, locale))
  const id = draftId('text', fieldKey)
  const selected = enabled && selectedId === id

  const open = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!draft) setTextDraft(fieldKey, values, label || fieldKey)
    select('text', fieldKey)
  }

  const body = (
    <>
      {before}
      <span>{text}</span>
      {after}
    </>
  )

  if (!enabled) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={cn(
        className,
        'group/editable relative cursor-pointer outline-none',
        'hover:ring-2 hover:ring-[#0046A4]/45 hover:ring-offset-2 hover:ring-offset-transparent',
        selected && 'ring-2 ring-[#0046A4] ring-offset-2 ring-offset-transparent',
      )}
      data-editable="text"
      data-editable-key={fieldKey}
      aria-label={`Edit ${label || fieldKey}`}
      onClick={open}
    >
      {body}
      <span
        className="pointer-events-none absolute -right-1 -top-1 rounded-full bg-[#0B1F3B] p-1 text-white opacity-0 shadow-md transition-opacity group-hover/editable:opacity-100"
        aria-hidden
      >
        <Pencil className="h-3 w-3" />
      </span>
    </button>
  )
}
