'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const OFFSETS: Record<Direction, string> = {
  up: 'translate3d(0, 40px, 0)',
  down: 'translate3d(0, -40px, 0)',
  left: 'translate3d(40px, 0, 0)',
  right: 'translate3d(-40px, 0, 0)',
  none: 'none',
}

type Props = {
  children: ReactNode
  className?: string
  /** Stagger in ms. Multiply by index when revealing a list. */
  delay?: number
  duration?: number
  direction?: Direction
  /** Reveal again when scrolled back into view. Off by default so the page settles. */
  repeat?: boolean
  as?: ElementType
}

/**
 * Scroll-triggered fade + travel. IntersectionObserver plus a CSS transition
 * keeps this off the main thread and out of the JS bundle budget, which matters
 * more here than a full animation library would buy us.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  duration = 900,
  direction = 'up',
  repeat = false,
  as: Tag = 'div',
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [instant, setInstant] = useState(false)

  // Inline styles can't be overridden by the global reduced-motion rules, so the
  // preference is resolved here and the content is shown without any travel.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setInstant(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Anything already on screen at mount should not wait for a scroll event.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (!repeat) observer.disconnect()
        } else if (repeat) {
          setVisible(false)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [repeat])

  const shown = visible || instant

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : OFFSETS[direction],
        filter: shown ? 'blur(0)' : 'blur(6px)',
        transition: instant
          ? 'none'
          : `opacity ${duration}ms var(--ease-premium) ${delay}ms, transform ${duration}ms var(--ease-premium) ${delay}ms, filter ${duration}ms var(--ease-premium) ${delay}ms`,
        willChange: shown ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  )
}
