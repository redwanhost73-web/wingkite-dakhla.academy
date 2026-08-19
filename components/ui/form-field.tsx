'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/** Shared brand field styles used across auth + admin forms */
export const formControlClassName =
  'h-12 w-full rounded-2xl border border-[#072A5A]/12 bg-[#FAF8F3] px-4 text-sm text-[#072A5A] shadow-none outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[#7A8AA3]/80 focus:border-[#0046A4]/45 focus:bg-white focus:ring-[3px] focus:ring-[#0046A4]/12 disabled:cursor-not-allowed disabled:opacity-60'

export const formLabelClassName =
  'block text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#7A8AA3]'

export const formHintClassName = 'mt-1.5 text-xs text-[#7A8AA3]'

export const formErrorClassName = 'mt-1.5 text-xs font-medium text-red-600'

type FormFieldProps = {
  label: string
  htmlFor?: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-0', className)}>
      <label htmlFor={htmlFor} className={formLabelClassName}>
        {label}
        {required ? <span className="ml-0.5 text-[#0046A4]">*</span> : null}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p className={formErrorClassName} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className={formHintClassName}>{hint}</p>
      ) : null}
    </div>
  )
}

type TextFieldProps = Omit<React.ComponentProps<'input'>, 'className'> & {
  label: string
  hint?: string
  error?: string
  className?: string
  inputClassName?: string
}

export function TextField({
  label,
  hint,
  error,
  id,
  className,
  inputClassName,
  required,
  ...props
}: TextFieldProps) {
  const fieldId = id || props.name || label.replace(/\s+/g, '-').toLowerCase()
  return (
    <FormField
      label={label}
      htmlFor={fieldId}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <input
        id={fieldId}
        required={required}
        className={cn(formControlClassName, error && 'border-red-300 focus:border-red-400 focus:ring-red-200', inputClassName)}
        {...props}
      />
    </FormField>
  )
}

type SelectFieldProps = Omit<React.ComponentProps<'select'>, 'className'> & {
  label: string
  hint?: string
  error?: string
  className?: string
  selectClassName?: string
}

export function SelectField({
  label,
  hint,
  error,
  id,
  className,
  selectClassName,
  required,
  children,
  ...props
}: SelectFieldProps) {
  const fieldId = id || props.name || label.replace(/\s+/g, '-').toLowerCase()
  return (
    <FormField
      label={label}
      htmlFor={fieldId}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <select
        id={fieldId}
        required={required}
        className={cn(formControlClassName, 'pr-9', selectClassName)}
        {...props}
      >
        {children}
      </select>
    </FormField>
  )
}
