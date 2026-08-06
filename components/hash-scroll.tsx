'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/** Smooth-scroll to `location.hash` on load and soft navigations (fixed nav offset via CSS). */
export function HashScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.replace(/^#/, '')
      if (!hash) return
      const el = document.getElementById(hash)
      if (!el) return
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const t = window.setTimeout(scrollToHash, 80)
    window.addEventListener('hashchange', scrollToHash)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('hashchange', scrollToHash)
    }
  }, [pathname])

  return null
}
