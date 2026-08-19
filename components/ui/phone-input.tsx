'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import {
  AsYouType,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js'
import { Check, ChevronDown, Search } from 'lucide-react'
import {
  detectCountryFromBrowser,
  findCountry,
  getPhoneCountries,
  type PhoneCountry,
} from '@/lib/phone/countries'
import { FormField, formControlClassName } from '@/components/ui/form-field'
import { cn } from '@/lib/utils'

type PhoneInputProps = {
  label?: string
  hint?: string
  error?: string
  value: string
  onChange: (e164: string) => void
  /** Fallback when detection fails (school default). */
  defaultCountry?: CountryCode
  /** Detect via IP geo + browser locale/timezone. */
  autoDetect?: boolean
  required?: boolean
  disabled?: boolean
  id?: string
  name?: string
  className?: string
  placeholder?: string
}

function nationalDigits(value: string, country: CountryCode) {
  if (!value) return ''
  const parsed = parsePhoneNumberFromString(value)
  if (parsed) return parsed.formatNational().replace(/[^\d\s()-]/g, '').trim()
  // Strip leading dial code if pasted as national-ish
  try {
    return new AsYouType(country).input(value.replace(/[^\d+]/g, ''))
  } catch {
    return value.replace(/[^\d]/g, '')
  }
}

export function PhoneInput({
  label = 'Phone',
  hint,
  error,
  value,
  onChange,
  defaultCountry = 'MA',
  autoDetect = true,
  required,
  disabled,
  id,
  name,
  className,
  placeholder,
}: PhoneInputProps) {
  const countries = React.useMemo(() => getPhoneCountries(), [])
  const [country, setCountry] = React.useState<CountryCode>(() => {
    const parsed = value ? parsePhoneNumberFromString(value) : undefined
    return (parsed?.country as CountryCode) || defaultCountry
  })
  const [national, setNational] = React.useState(() =>
    nationalDigits(
      value,
      (parsePhoneNumberFromString(value)?.country as CountryCode) || defaultCountry,
    ),
  )
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [detectedLabel, setDetectedLabel] = React.useState<string | null>(null)
  const [menuPos, setMenuPos] = React.useState<{
    top: number
    left: number
    width: number
    maxHeight: number
  } | null>(null)
  const detectDone = React.useRef(false)
  const lastEmitted = React.useRef(value)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const fieldId = id || name || 'phone'

  const selected = findCountry(country) || countries[0]

  const updateMenuPos = React.useCallback(() => {
    const el = triggerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const gap = 6
    const spaceBelow = window.innerHeight - rect.bottom - gap - 12
    const spaceAbove = rect.top - gap - 12
    const preferBelow = spaceBelow >= 180 || spaceBelow >= spaceAbove
    const maxHeight = Math.min(280, Math.max(140, preferBelow ? spaceBelow : spaceAbove))
    const top = preferBelow
      ? rect.bottom + gap
      : Math.max(12, rect.top - gap - maxHeight)
    setMenuPos({
      top,
      left: rect.left,
      width: rect.width,
      maxHeight,
    })
  }, [])

  React.useEffect(() => {
    if (!open) {
      setMenuPos(null)
      return
    }
    updateMenuPos()
    const onReposition = () => updateMenuPos()
    window.addEventListener('resize', onReposition)
    // Capture scroll on any ancestor (dialog / admin main)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open, updateMenuPos])

  // Sync from parent when value changes externally (e.g. edit dialog open)
  React.useEffect(() => {
    if (value === lastEmitted.current) return
    lastEmitted.current = value
    if (!value) {
      setNational('')
      return
    }
    const parsed = parsePhoneNumberFromString(value)
    if (parsed?.country) setCountry(parsed.country)
    if (parsed) setNational(parsed.formatNational())
  }, [value])

  // Auto-detect once when empty
  React.useEffect(() => {
    if (!autoDetect || detectDone.current || value) return
    detectDone.current = true

    let cancelled = false
    ;(async () => {
      let next: CountryCode | null = null
      let source: string | null = null

      try {
        const res = await fetch('/api/geo/country')
        if (res.ok) {
          const data = (await res.json()) as { country?: string | null }
          if (data.country && findCountry(data.country)) {
            next = data.country as CountryCode
            source = 'location'
          }
        }
      } catch {
        // offline / blocked
      }

      if (!next) {
        const browser = detectCountryFromBrowser()
        if (browser) {
          next = browser
          source = 'device'
        }
      }

      if (!next) {
        next = defaultCountry
        source = 'default'
      }

      if (cancelled) return
      setCountry(next)
      if (source === 'location') setDetectedLabel('Detected from your location')
      else if (source === 'device') setDetectedLabel('Detected from your device')
      else setDetectedLabel(null)
    })()

    return () => {
      cancelled = true
    }
  }, [autoDetect, value, defaultCountry])

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node
      if (rootRef.current?.contains(target)) return
      if ((target as Element).closest?.('[data-phone-country-menu]')) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return countries
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.iso.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.dial.replace('+', '').includes(q),
    )
  }, [countries, query])

  const emit = (iso: CountryCode, digits: string) => {
    const cleaned = digits.replace(/[^\d]/g, '')
    if (!cleaned) {
      lastEmitted.current = ''
      setNational('')
      onChange('')
      return
    }
    const formatter = new AsYouType(iso)
    const formatted = formatter.input(cleaned)
    setNational(formatted)

    const parsed = parsePhoneNumberFromString(cleaned, iso)
    const next =
      parsed?.format('E.164') ||
      `+${getDial(iso)}${cleaned}`
    lastEmitted.current = next
    onChange(next)
  }

  const pickCountry = (c: PhoneCountry) => {
    setCountry(c.iso)
    setDetectedLabel(null)
    setOpen(false)
    setQuery('')
    emit(c.iso, national.replace(/[^\d]/g, ''))
  }

  return (
    <FormField
      label={label}
      htmlFor={fieldId}
      hint={hint || detectedLabel || undefined}
      error={error}
      required={required}
      className={className}
    >
      <div ref={rootRef}>
        <div
          ref={triggerRef}
          className={cn(
            formControlClassName,
            'flex items-stretch gap-0 overflow-hidden p-0',
            error && 'border-red-300 focus-within:border-red-400 focus-within:ring-red-200',
            disabled && 'opacity-60',
          )}
        >
          <button
            type="button"
            disabled={disabled}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex shrink-0 items-center gap-1 border-r border-[#072A5A]/10 bg-[#F0EBE3]/70 px-2.5 text-sm font-semibold text-[#072A5A] hover:bg-[#E8EEF6]"
            aria-label="Select country"
            aria-expanded={open}
          >
            <span className="text-base leading-none" aria-hidden>
              {selected.flag}
            </span>
            <span className="tabular-nums text-xs">{selected.dial}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#7A8AA3]" />
          </button>
          <input
            id={fieldId}
            name={name}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            required={required}
            disabled={disabled}
            value={national}
            placeholder={placeholder || 'Phone number'}
            onChange={(e) => emit(country, e.target.value)}
            className="min-w-0 flex-1 bg-transparent px-3 text-sm text-[#072A5A] outline-none placeholder:text-[#7A8AA3]/80"
          />
        </div>

        {open &&
          menuPos &&
          typeof document !== 'undefined' &&
          createPortal(
            <div
              data-phone-country-menu
              className="fixed z-[80] overflow-hidden rounded-2xl border border-[#072A5A]/10 bg-white shadow-[0_20px_50px_rgba(11,31,59,0.18)]"
              style={{
                top: menuPos.top,
                left: menuPos.left,
                width: menuPos.width,
                maxHeight: menuPos.maxHeight,
              }}
            >
              <div className="border-b border-[#072A5A]/8 p-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8AA3]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search country or code…"
                    className="h-10 w-full rounded-xl bg-[#FAF8F3] pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#0046A4]/20"
                    autoFocus
                  />
                </div>
              </div>
              <ul
                className="overflow-y-auto overscroll-contain py-1"
                style={{ maxHeight: Math.max(96, menuPos.maxHeight - 58) }}
                role="listbox"
              >
                {filtered.length === 0 ? (
                  <li className="px-4 py-6 text-center text-sm text-[#7A8AA3]">No countries found</li>
                ) : (
                  filtered.map((c) => {
                    const active = c.iso === country
                    return (
                      <li key={c.iso}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => pickCountry(c)}
                          className={cn(
                            'flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-[#FAF8F3]',
                            active && 'bg-[#0046A4]/6',
                          )}
                        >
                          <span className="text-base" aria-hidden>
                            {c.flag}
                          </span>
                          <span className="min-w-0 flex-1 truncate font-medium text-[#072A5A]">
                            {c.name}
                          </span>
                          <span className="tabular-nums text-[#7A8AA3]">{c.dial}</span>
                          {active && <Check className="h-4 w-4 text-[#0046A4]" />}
                        </button>
                      </li>
                    )
                  })
                )}
              </ul>
            </div>,
            document.body,
          )}
      </div>
    </FormField>
  )
}

function getDial(iso: CountryCode) {
  return findCountry(iso)?.dial.replace('+', '') || '212'
}
