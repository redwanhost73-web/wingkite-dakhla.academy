'use client'

import type { MouseEvent, ReactNode } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { useEditMode } from '@/components/edit-mode/edit-mode-provider'
import { createPricingRow, toPricingListItems } from '@/lib/edit-mode/list-helpers'
import { draftId } from '@/lib/edit-mode/types'
import type { PricingRow } from '@/lib/site-config'
import { pricingRowId } from '@/lib/site-config'
import { cn } from '@/lib/utils'

/** Live pricing rows with draft overlay. */
export function useEditablePricingRows(cmsRows: PricingRow[]) {
  const { getListDraft } = useEditMode()
  const draft = getListDraft('pricing')
  const base = toPricingListItems(cmsRows)
  return draft?.items?.length ? draft.items : base
}

type EditablePricingRowProps = {
  row: PricingRow
  allRows: PricingRow[]
  className?: string
  children: ReactNode
  as?: 'tr' | 'li' | 'div'
}

/** Makes a table/list row clickable in Edit Mode. */
export function EditablePricingRow({
  row,
  allRows,
  className,
  children,
  as = 'tr',
}: EditablePricingRowProps) {
  const { enabled, selectedId, getListDraft, openPricingEditor } = useEditMode()
  const id = pricingRowId(row)
  const listDraft = getListDraft('pricing')
  const listOpen = enabled && selectedId === draftId('list', 'pricing')
  const selected = listOpen && listDraft?.selectedItemId === id

  if (!enabled) {
    if (as === 'tr') return <tr className={className}>{children}</tr>
    if (as === 'li') return <li className={className}>{children}</li>
    return <div className={className}>{children}</div>
  }

  const onClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    openPricingEditor(toPricingListItems(allRows), id)
  }

  const chrome = cn(
    className,
    'group/row relative cursor-pointer outline-none transition-[box-shadow,background-color]',
    'hover:ring-2 hover:ring-inset hover:ring-[#0046A4]/35',
    selected &&
      'z-[1] bg-[#0046A4]/12 shadow-[inset_3px_0_0_0_#0046A4] ring-2 ring-inset ring-[#0046A4]',
  )

  const badge = (
    <span
      className={cn(
        'pointer-events-none absolute right-2 top-1/2 z-[1] -translate-y-1/2 rounded-full bg-[#0B1F3B] p-1 text-white shadow-md transition-opacity',
        selected ? 'opacity-100' : 'opacity-0 group-hover/row:opacity-100',
      )}
    >
      <Pencil className="h-3 w-3" />
    </span>
  )

  if (as === 'li') {
    return (
      <li
        className={chrome}
        data-editable="list"
        data-editable-key="pricing"
        data-selected={selected || undefined}
        onClick={onClick}
      >
        {children}
        {badge}
      </li>
    )
  }

  if (as === 'div') {
    return (
      <div
        className={chrome}
        data-editable="list"
        data-editable-key="pricing"
        data-selected={selected || undefined}
        onClick={onClick}
      >
        {children}
        {badge}
      </div>
    )
  }

  return (
    <tr
      className={chrome}
      data-editable="list"
      data-editable-key="pricing"
      data-selected={selected || undefined}
      onClick={onClick}
    >
      {children}
      <td className="relative w-0 p-0">
        <span
          className={cn(
            'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-[#0B1F3B] p-1 text-white shadow-md transition-opacity',
            selected ? 'opacity-100' : 'opacity-0 group-hover/row:opacity-100',
          )}
        >
          <Pencil className="h-3 w-3" />
        </span>
      </td>
    </tr>
  )
}

/** Dashed “Add row” control under pricing tables while Edit Mode is on. */
export function AddPricingRowButton({ allRows }: { allRows: PricingRow[] }) {
  const { enabled, openPricingEditor } = useEditMode()
  if (!enabled) return null

  return (
    <button
      type="button"
      onClick={() => {
        const items = toPricingListItems(allRows)
        const row = createPricingRow({ hours: 'Nh' })
        openPricingEditor([...items, row], row.id)
      }}
      className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[18px] border border-dashed border-[#0046A4]/45 bg-[#0046A4]/5 text-xs font-bold text-[#0046A4] hover:bg-[#0046A4]/10"
    >
      <Plus className="h-3.5 w-3.5" />
      Add pricing row
    </button>
  )
}
