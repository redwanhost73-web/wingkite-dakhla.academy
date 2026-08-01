'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, type ReactNode } from 'react'

const WhatsAppBubble = dynamic(
  () => import('./whatsapp-bubble').then((m) => m.WhatsAppBubble),
  { ssr: false },
)

/**
 * Defer the WhatsApp chunk until the browser is idle (or after a short
 * timeout) so it never competes with LCP / hydration on first paint.
 */
export function WhatsAppBubbleLazy() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    let idleId: number | undefined
    let timer: ReturnType<typeof setTimeout> | undefined

    const enable = () => {
      if (!cancelled) setReady(true)
    }

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(enable, { timeout: 3500 })
    } else {
      timer = setTimeout(enable, 2800)
    }

    return () => {
      cancelled = true
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId)
      }
      if (timer) clearTimeout(timer)
    }
  }, [])

  if (!ready) return null as ReactNode
  return <WhatsAppBubble />
}
