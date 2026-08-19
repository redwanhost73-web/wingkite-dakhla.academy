import type { PricingRow } from '@/lib/site-config'
import { pricingRowId } from '@/lib/site-config'
import type { PricingListItem } from '@/lib/edit-mode/types'

export function toPricingListItems(rows: PricingRow[]): PricingListItem[] {
  return rows.map((row) => ({
    ...row,
    id: pricingRowId(row),
  }))
}

export function createPricingRow(partial?: Partial<PricingListItem>): PricingListItem {
  const hours = partial?.hours || 'Nh'
  const id = partial?.id || `row_${Date.now()}`
  return {
    id,
    hours,
    semiEur: partial?.semiEur ?? 0,
    semiMad: partial?.semiMad ?? 0,
    privEur: partial?.privEur ?? 0,
    privMad: partial?.privMad ?? 0,
    extra: partial?.extra ?? false,
  }
}

export function moveListItem<T>(items: T[], from: number, to: number): T[] {
  if (from < 0 || to < 0 || from >= items.length || to >= items.length) return items
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}
