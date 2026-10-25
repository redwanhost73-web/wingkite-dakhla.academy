'use client'

import type React from 'react'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'
import { useSiteConfig } from '@/hooks/use-site-config'
import { EditableLink, EditableText } from '@/components/edit-mode/editable'
import {
  AddPricingRowButton,
  EditablePricingRow,
  useEditablePricingRows,
} from '@/components/edit-mode/editable-pricing'
import type { Localized } from '@/lib/cms/types'
import { pricingForSport } from '@/lib/site-config'
import type { PricingRow } from '@/lib/site-config'
import { cn } from '@/lib/utils'

const loc = (fr: string, en: string, es: string, ar: string): Localized => ({ fr, en, es, ar })

type Formula = 'private' | 'semi'

type Props = {
  /** Optional id prefix so multiple tables on a page stay unique for a11y */
  idPrefix?: string
  className?: string
  showBookCta?: boolean
  showRateNote?: boolean
  /** Activity pages use sky-blue chrome */
  tone?: 'default' | 'sky'
  sport?: 'wingfoil' | 'kitesurf'
}

/**
 * Shared Privé / Semi-privé hour grid — CMS + Edit Mode wired like pricing page.
 */
export function CoursePricingTable({
  idPrefix = 'course',
  className,
  showBookCta = true,
  showRateNote = true,
  tone = 'default',
  sport = 'wingfoil',
}: Props) {
  const { locale } = useTranslations()
  const { pricing: cmsPricing, texts } = useSiteConfig()
  const cmsRows = useEditablePricingRows(cmsPricing)
  const rows = pricingForSport(sport, cmsRows)
  const cmsEditable = sport === 'wingfoil'
  const [formula, setFormula] = useState<Formula>('private')
  const sky = tone === 'sky'

  const RowWrap = ({
    row,
    className: rowClass,
    as,
    children,
  }: {
    row: PricingRow
    className?: string
    as: 'tr' | 'li'
    children: React.ReactNode
  }) =>
    cmsEditable ? (
      <EditablePricingRow row={row} allRows={cmsRows} className={rowClass} as={as}>
        {children}
      </EditablePricingRow>
    ) : as === 'tr' ? (
      <tr className={rowClass}>{children}</tr>
    ) : (
      <li className={rowClass}>{children}</li>
    )

  const privateLabel = (
    <EditableText
      fieldKey="pricing.table.private"
      label="Table — Private"
      defaults={loc('Privé', 'Private', 'Privado', 'خاص')}
      cms={texts['pricing.table.private']}
    />
  )
  const privateHint = (
    <EditableText
      fieldKey="pricing.table.privateHint"
      label="Table — Private hint"
      defaults={loc('1 pers.', '1 pax', '1 pers.', '1 شخص')}
      cms={texts['pricing.table.privateHint']}
    />
  )
  const semiLabel = (
    <EditableText
      fieldKey="pricing.table.semi"
      label="Table — Semi-private"
      defaults={loc('Semi-privé', 'Semi-private', 'Semi-privado', 'شبه خاص')}
      cms={texts['pricing.table.semi']}
    />
  )
  const semiHint = (
    <EditableText
      fieldKey="pricing.table.semiHint"
      label="Table — Semi hint"
      defaults={loc('2–3 pers.', '2–3 pax', '2–3 pers.', '2–3 أشخاص')}
      cms={texts['pricing.table.semiHint']}
    />
  )

  const getText = (fr: string, en: string, es: string, ar: string) => {
    if (locale === 'fr') return fr
    if (locale === 'es') return es
    if (locale === 'ar') return ar
    return en
  }

  return (
    <div className={cn(className)}>
      {/* Mobile: one formula at a time */}
      <div className="md:hidden">
        <div
          role="tablist"
          aria-label={getText('Formule', 'Formula', 'Fórmula', 'الصيغة')}
          className={cn(
            'flex gap-2 rounded-full border p-1',
            sky ? 'border-[#5AA8FF]/25 bg-white/90' : 'border-[#072A5A]/8 bg-white/80',
          )}
        >
          {(
            [
              { id: 'private' as const, label: privateLabel, hint: privateHint },
              { id: 'semi' as const, label: semiLabel, hint: semiHint },
            ] as const
          ).map((opt) => {
            const selected = formula === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={selected}
                id={`${idPrefix}-formula-${opt.id}`}
                onClick={() => setFormula(opt.id)}
                className={cn(
                  'flex flex-1 flex-col items-center rounded-full px-3 py-2.5 transition-all duration-450',
                  selected
                    ? sky
                      ? 'bg-[#5AA8FF] text-white shadow-[0_8px_20px_rgba(90,168,255,0.35)]'
                      : 'bg-[#0B1F3B] text-white shadow-[0_8px_20px_rgba(11,31,59,0.22)]'
                    : 'text-[#3D4F6F]',
                )}
              >
                <span className="text-xs font-bold">{opt.label}</span>
                <span
                  className={cn(
                    'mt-0.5 text-[0.65rem] font-medium',
                    selected ? 'text-white/55' : 'text-[#7A8AA3]',
                  )}
                >
                  {opt.hint}
                </span>
              </button>
            )
          })}
        </div>

        <ul
          className={cn(
            'mt-4 overflow-hidden rounded-[18px] border',
            sky ? 'border-[#5AA8FF]/20' : 'border-[#072A5A]/8',
          )}
        >
          {rows
            .filter((row) => (formula === 'private' ? row.privEur > 0 : row.semiEur > 0))
            .map((row) => {
              const eur = formula === 'private' ? row.privEur : row.semiEur
              const mad = formula === 'private' ? row.privMad : row.semiMad
              return (
                <RowWrap
                  key={`m-${idPrefix}-${formula}-${row.id || row.hours}`}
                  as="li"
                  row={row}
                  className={cn(
                    'flex items-center justify-between gap-4 border-t px-5 py-4 first:border-t-0',
                    sky ? 'border-[#5AA8FF]/12' : 'border-[#072A5A]/6',
                    row.extra
                      ? sky
                        ? 'bg-[#5AA8FF]/12'
                        : 'bg-[#C9A66B]/18'
                      : 'bg-white/70',
                  )}
                >
                  <div className="min-w-0">
                    <p className="font-heading text-base font-bold text-[#072A5A]">{row.hours}</p>
                    {row.extra && (
                      <p className="mt-0.5 text-xs italic text-[#7A8AA3]">
                        <EditableText
                          fieldKey="pricing.row.extraLabel"
                          label="Extra hour label"
                          defaults={loc('heure suppl.', 'extra hour', 'hora extra', 'ساعة إضافية')}
                          cms={texts['pricing.row.extraLabel']}
                        />
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-end">
                    <p className="font-heading text-xl font-extrabold tracking-tight text-[#072A5A]">
                      {eur}€
                    </p>
                    <p className={cn('mt-0.5 text-xs font-semibold', sky ? 'text-[#5AA8FF]' : 'text-[#B8925A]')}>
                      {mad} MAD
                    </p>
                  </div>
                </RowWrap>
              )
            })}
        </ul>
        {cmsEditable && <AddPricingRowButton allRows={cmsRows} />}
      </div>

      {/* Desktop: both formulas */}
      <div
        className={cn(
          'hidden overflow-hidden rounded-[18px] border md:block',
          sky ? 'border-[#5AA8FF]/20' : 'border-[#072A5A]/8',
        )}
      >
        <table className="w-full border-collapse text-start">
          <thead>
            <tr className={cn('text-white', sky ? 'bg-[#5AA8FF]' : 'bg-[#0B1F3B]')}>
              <th className="eyebrow px-5 py-3.5 text-start font-bold text-white/80">
                <EditableText
                  fieldKey="pricing.table.duration"
                  label="Table — Duration"
                  defaults={loc('Durée', 'Duration', 'Duración', 'المدة')}
                  cms={texts['pricing.table.duration']}
                />
              </th>
              <th className="eyebrow px-5 py-3.5 text-end font-bold text-white/80">
                {privateLabel}
                <span className="mt-0.5 block text-[0.6rem] font-semibold normal-case tracking-normal text-white/45">
                  {privateHint}
                </span>
              </th>
              <th className="eyebrow px-5 py-3.5 text-end font-bold text-white/80">
                {semiLabel}
                <span className="mt-0.5 block text-[0.6rem] font-semibold normal-case tracking-normal text-white/45">
                  {semiHint}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <RowWrap
                key={`${idPrefix}-${row.id || row.hours}`}
                as="tr"
                row={row}
                className={cn(
                  'border-t',
                  sky ? 'border-[#5AA8FF]/12' : 'border-[#072A5A]/6',
                  row.extra
                    ? sky
                      ? 'bg-[#5AA8FF]/12'
                      : 'bg-[#C9A66B]/18'
                    : 'bg-white/60',
                )}
              >
                <td className="px-5 py-3.5">
                  <span className="font-heading text-small font-bold text-[#072A5A]">{row.hours}</span>
                  {row.extra && (
                    <span className="ms-2 text-xs italic text-[#7A8AA3]">
                      <EditableText
                        fieldKey="pricing.row.extraLabel"
                        label="Extra hour label"
                        defaults={loc('heure suppl.', 'extra hour', 'hora extra', 'ساعة إضافية')}
                        cms={texts['pricing.row.extraLabel']}
                      />
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-end">
                  <span className="font-heading text-lg font-extrabold text-[#072A5A]">
                    {row.privEur}€
                  </span>
                  <span
                    className={cn(
                      'mt-0.5 block text-[0.7rem] font-semibold',
                      sky ? 'text-[#5AA8FF]' : 'text-[#B8925A]',
                    )}
                  >
                    {row.privMad} MAD
                  </span>
                </td>
                <td className="px-5 py-3.5 text-end">
                  {row.semiEur > 0 ? (
                    <>
                      <span className="font-heading text-lg font-extrabold text-[#072A5A]">
                        {row.semiEur}€
                      </span>
                      <span
                        className={cn(
                          'mt-0.5 block text-[0.7rem] font-semibold',
                          sky ? 'text-[#5AA8FF]' : 'text-[#B8925A]',
                        )}
                      >
                        {row.semiMad} MAD
                      </span>
                    </>
                  ) : (
                    <span className="text-small text-[#7A8AA3]">—</span>
                  )}
                </td>
              </RowWrap>
            ))}
          </tbody>
        </table>
        {cmsEditable && (
          <div className={cn('border-t p-3', sky ? 'border-[#5AA8FF]/15' : 'border-[#072A5A]/8')}>
            <AddPricingRowButton allRows={cmsRows} />
          </div>
        )}
      </div>

      {(showBookCta || showRateNote) && (
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {showBookCta && (
            <EditableLink
              fieldKey="pricing.panel.bookCta"
              label="Book this course CTA"
              href={`/${locale}/contact`}
              className={cn(
                'btn-pill-sm text-small text-white',
                sky ? 'bg-[#5AA8FF] hover:bg-[#2D7FF9]' : 'bg-[#0B1F3B] hover:bg-[#0057D1]',
              )}
              defaults={loc(
                'Réserver ce cours',
                'Book this course',
                'Reservar este curso',
                'احجز هذا الدرس',
              )}
              cms={texts['pricing.panel.bookCta']}
              after={<ArrowRight className="h-4 w-4" />}
            />
          )}
          {showRateNote && (
            <EditableText
              fieldKey="pricing.panel.rateNote"
              label="Same rate card note"
              as="p"
              className="text-xs text-[#7A8AA3]"
              defaults={loc(
                'Même grille pour Wingfoil et Kitesurf. Matériel inclus.',
                'Same rate card for Wingfoil and Kitesurf. Gear included.',
                'Misma tarifa para Wingfoil y Kitesurf. Material incluido.',
                'نفس الأسعار للوينج فويل والكايت سيرف. المعدات مشمولة.',
              )}
              cms={texts['pricing.panel.rateNote']}
            />
          )}
        </div>
      )}
    </div>
  )
}
