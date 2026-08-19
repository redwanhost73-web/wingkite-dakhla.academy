'use client'

import { cn } from '@/lib/utils'

type FormWizardProps = {
  steps: { id: string; label: string }[]
  current: number
  className?: string
}

export function FormWizardSteps({ steps, current, className }: FormWizardProps) {
  return (
    <ol className={cn('flex items-center gap-1.5', className)} aria-label="Form progress">
      {steps.map((step, index) => {
        const active = index === current
        const done = index < current
        return (
          <li key={step.id} className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-bold transition-colors',
                  done && 'bg-[#0046A4] text-white',
                  active && 'bg-[#0B1F3B] text-white',
                  !done && !active && 'bg-[#E8EEF6] text-[#7A8AA3]',
                )}
              >
                {done ? '✓' : index + 1}
              </span>
              <span
                className={cn(
                  'hidden truncate text-[0.7rem] font-bold sm:inline',
                  active || done ? 'text-[#072A5A]' : 'text-[#7A8AA3]',
                )}
              >
                {step.label}
              </span>
            </div>
            <div
              className={cn(
                'h-1 rounded-full transition-colors',
                done || active ? 'bg-[#0046A4]' : 'bg-[#E8EEF6]',
              )}
            />
          </li>
        )
      })}
    </ol>
  )
}

type FormWizardNavProps = {
  onBack?: () => void
  backLabel?: string
  nextLabel: string
  nextType?: 'button' | 'submit'
  onNext?: () => void
  loading?: boolean
  disabled?: boolean
}

export function FormWizardNav({
  onBack,
  backLabel = 'Back',
  nextLabel,
  nextType = 'button',
  onNext,
  loading,
  disabled,
}: FormWizardNavProps) {
  return (
    <div className={cn('mt-6 flex gap-2', onBack ? 'justify-between' : 'justify-end')}>
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="h-11 rounded-full border border-[#072A5A]/15 px-5 text-sm font-bold text-[#072A5A] hover:bg-[#FAF8F3]"
        >
          {backLabel}
        </button>
      ) : (
        <span />
      )}
      <button
        type={nextType}
        onClick={onNext}
        disabled={loading || disabled}
        className="h-11 min-w-[8.5rem] rounded-full bg-[#0B1F3B] px-5 text-sm font-bold text-white hover:bg-[#0046A4] disabled:opacity-60"
      >
        {loading ? 'Please wait…' : nextLabel}
      </button>
    </div>
  )
}
