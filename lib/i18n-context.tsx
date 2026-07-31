'use client'

import { createContext, useContext, ReactNode } from 'react'
import type { Locale } from './i18n'

type Messages = Record<string, unknown>
type TranslationValue = string | string[]

interface I18nContextType {
  locale: Locale
  messages: Messages
  t: (key: string) => string
  tArray: (key: string) => string[]
}

const I18nContext = createContext<I18nContextType | null>(null)

function getNestedValue(obj: Record<string, unknown>, path: string): TranslationValue {
  const keys = path.split('.')
  let current: unknown = obj
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path
    }
  }
  
  if (typeof current === 'string') return current
  if (Array.isArray(current)) return current as string[]
  return path
}

export function I18nProvider({ 
  children, 
  locale, 
  messages 
}: { 
  children: ReactNode
  locale: Locale
  messages: Messages 
}) {
  const t = (key: string): string => {
    const value = getNestedValue(messages, key)
    return typeof value === 'string' ? value : key
  }
  
  const tArray = (key: string): string[] => {
    const value = getNestedValue(messages, key)
    return Array.isArray(value) ? value : []
  }
  
  return (
    <I18nContext.Provider value={{ locale, messages, t, tArray }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslations() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslations must be used within an I18nProvider')
  }
  return context
}

export function useLocale() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useLocale must be used within an I18nProvider')
  }
  return context.locale
}
