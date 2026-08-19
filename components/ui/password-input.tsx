'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { FormField, formControlClassName } from '@/components/ui/form-field'
import { cn } from '@/lib/utils'

type PasswordInputProps = Omit<React.ComponentProps<'input'>, 'type' | 'className'> & {
  label?: string
  hint?: string
  error?: string
  className?: string
  inputClassName?: string
  /** Show strength hints under the field while typing */
  showStrength?: boolean
}

function strengthOf(password: string) {
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  if (score <= 1) return { label: 'Weak', tone: 'bg-red-400', width: 'w-1/4' }
  if (score <= 2) return { label: 'Fair', tone: 'bg-amber-400', width: 'w-2/4' }
  if (score <= 3) return { label: 'Good', tone: 'bg-sky-500', width: 'w-3/4' }
  return { label: 'Strong', tone: 'bg-emerald-500', width: 'w-full' }
}

export function PasswordInput({
  label = 'Password',
  hint,
  error,
  id,
  className,
  inputClassName,
  showStrength,
  required,
  value,
  onChange,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false)
  const fieldId = id || props.name || 'password'
  const passwordValue = typeof value === 'string' ? value : ''
  const strength = showStrength && passwordValue ? strengthOf(passwordValue) : null

  return (
    <FormField
      label={label}
      htmlFor={fieldId}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <div className="relative">
        <input
          id={fieldId}
          type={visible ? 'text' : 'password'}
          required={required}
          value={value}
          onChange={onChange}
          autoComplete={props.autoComplete || 'current-password'}
          className={cn(
            formControlClassName,
            'pr-12',
            error && 'border-red-300 focus:border-red-400 focus:ring-red-200',
            inputClassName,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-[#7A8AA3] transition-colors hover:bg-[#0B1F3B]/6 hover:text-[#072A5A]"
          aria-label={visible ? 'Hide password' : 'Show password'}
          tabIndex={0}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {strength && (
        <div className="mt-2">
          <div className="h-1.5 overflow-hidden rounded-full bg-[#E8EEF6]">
            <div className={cn('h-full rounded-full transition-all duration-300', strength.tone, strength.width)} />
          </div>
          <p className="mt-1 text-[0.65rem] font-semibold text-[#7A8AA3]">{strength.label}</p>
        </div>
      )}
    </FormField>
  )
}
