'use client'

import { useMemo } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useEditMode } from '@/components/edit-mode/edit-mode-provider'
import type { ListDraft, PricingListItem } from '@/lib/edit-mode/types'
import { createPricingRow, moveListItem } from '@/lib/edit-mode/list-helpers'
import { cn } from '@/lib/utils'

export function PricingListInspector({ draft }: { draft: ListDraft }) {
  const { setListDraft, clearSelection, discardOne } = useEditMode()
  const selected =
    draft.items.find((r) => r.id === draft.selectedItemId) || draft.items[0]

  const updateItems = (items: PricingListItem[], selectedItemId?: string | null) => {
    setListDraft({
      ...draft,
      items,
      selectedItemId:
        selectedItemId === undefined ? draft.selectedItemId : selectedItemId,
    })
  }

  const patchSelected = (patch: Partial<PricingListItem>) => {
    if (!selected) return
    updateItems(
      draft.items.map((row) => (row.id === selected.id ? { ...row, ...patch } : row)),
      selected.id,
    )
  }

  const selectedIndex = useMemo(
    () => draft.items.findIndex((r) => r.id === selected?.id),
    [draft.items, selected?.id],
  )

  if (!selected) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-[#7A8AA3]">No pricing rows yet.</p>
        <button
          type="button"
          onClick={() => {
            const row = createPricingRow({ hours: '2h' })
            updateItems([row], row.id)
          }}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#0B1F3B] text-xs font-bold text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          Add first row
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#7A8AA3]">
          Rows ({draft.items.length})
        </p>
        <div className="mt-2 flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
          {draft.items.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => updateItems(draft.items, row.id)}
              className={cn(
                'rounded-full px-2.5 py-1 text-[0.65rem] font-bold',
                row.id === selected.id
                  ? 'bg-[#0B1F3B] text-white'
                  : 'bg-[#F0EBE3] text-[#3D4F6F]',
              )}
            >
              {row.hours || '—'}
            </button>
          ))}
        </div>
      </div>

      <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-[#7A8AA3]">
        Duration label
        <input
          value={selected.hours}
          onChange={(e) => patchSelected({ hours: e.target.value })}
          className="mt-1.5 w-full rounded-xl border border-[#072A5A]/12 bg-[#FAF8F3] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0046A4]/40"
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        {(
          [
            ['privEur', 'Private €'],
            ['privMad', 'Private MAD'],
            ['semiEur', 'Semi €'],
            ['semiMad', 'Semi MAD'],
          ] as const
        ).map(([key, label]) => (
          <label
            key={key}
            className="block text-[0.65rem] font-bold uppercase tracking-wider text-[#7A8AA3]"
          >
            {label}
            <input
              type="number"
              min={0}
              value={selected[key]}
              onChange={(e) =>
                patchSelected({ [key]: Number(e.target.value) || 0 } as Partial<PricingListItem>)
              }
              className="mt-1.5 w-full rounded-xl border border-[#072A5A]/12 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0046A4]/40"
            />
          </label>
        ))}
      </div>

      <label className="flex items-center gap-2 text-xs font-semibold text-[#3D4F6F]">
        <input
          type="checkbox"
          checked={Boolean(selected.extra)}
          onChange={(e) => patchSelected({ extra: e.target.checked })}
          className="rounded border-[#072A5A]/20"
        />
        Extra / special row (highlighted)
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={selectedIndex <= 0}
          onClick={() =>
            updateItems(moveListItem(draft.items, selectedIndex, selectedIndex - 1), selected.id)
          }
          className="inline-flex h-9 items-center gap-1 rounded-full border border-[#072A5A]/12 px-3 text-xs font-bold disabled:opacity-40"
        >
          <ArrowUp className="h-3.5 w-3.5" />
          Up
        </button>
        <button
          type="button"
          disabled={selectedIndex < 0 || selectedIndex >= draft.items.length - 1}
          onClick={() =>
            updateItems(moveListItem(draft.items, selectedIndex, selectedIndex + 1), selected.id)
          }
          className="inline-flex h-9 items-center gap-1 rounded-full border border-[#072A5A]/12 px-3 text-xs font-bold disabled:opacity-40"
        >
          <ArrowDown className="h-3.5 w-3.5" />
          Down
        </button>
        <button
          type="button"
          onClick={() => {
            const row = createPricingRow({ hours: 'Nh' })
            updateItems([...draft.items, row], row.id)
            toast.message('Row added (draft)')
          }}
          className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-full bg-[#0B1F3B] px-3 text-xs font-bold text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          Add row
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          const next = draft.items.filter((r) => r.id !== selected.id)
          if (!next.length) {
            discardOne('list', 'pricing')
            clearSelection()
            toast.message('Pricing draft cleared')
            return
          }
          updateItems(next, next[Math.max(0, selectedIndex - 1)]?.id)
          toast.message('Row removed (draft)')
        }}
        className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete this row
      </button>
    </div>
  )
}
