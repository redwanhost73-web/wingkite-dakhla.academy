'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'
import { useLocale } from '@/lib/i18n-context'

const STORY_MS = 4500

type StoryRequest = {
  images: string[]
  title: string
  startIndex?: number
}

type StoryContextValue = {
  openStory: (request: StoryRequest) => void
}

const StoryContext = createContext<StoryContextValue | null>(null)

/**
 * Renders a single story viewer for the whole page. Cards only request a story;
 * keeping the overlay here avoids one modal per card and keeps its state out of
 * the card's render path.
 */
export function ActivityStoryProvider({ children }: { children: ReactNode }) {
  const [story, setStory] = useState<StoryRequest | null>(null)

  const openStory = useCallback((request: StoryRequest) => {
    setStory(request)
  }, [])

  const close = useCallback(() => setStory(null), [])

  return (
    <StoryContext.Provider value={{ openStory }}>
      {children}
      {story && (
        <ActivityStory
          images={story.images}
          title={story.title}
          startIndex={story.startIndex ?? 0}
          onClose={close}
        />
      )}
    </StoryContext.Provider>
  )
}

export function useActivityStory() {
  return useContext(StoryContext)
}

type Props = {
  images: string[]
  title: string
  startIndex: number
  onClose: () => void
}

function bookLabel(locale: string) {
  if (locale === 'fr') return 'Réserver'
  if (locale === 'es') return 'Reservar'
  if (locale === 'ar') return 'احجز'
  return 'Book Now'
}

function ActivityStory({ images, title, startIndex, onClose }: Props) {
  const locale = useLocale()
  const [index, setIndex] = useState(startIndex)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isLast = index >= images.length - 1

  const goNext = useCallback(() => {
    if (isLast) {
      // Stay on the last frame so the Book CTA remains available.
      setProgress(100)
      return
    }
    setIndex(index + 1)
    setProgress(0)
  }, [index, isLast])

  const goPrev = useCallback(() => {
    if (index === 0) return
    setIndex(index - 1)
    setProgress(0)
  }, [index])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.setAttribute('data-story-open', 'true')
    return () => {
      document.body.style.overflow = prev
      document.body.removeAttribute('data-story-open')
    }
  }, [])

  // Progress bar + auto-advance (pause on last slide so Book stays visible)
  useEffect(() => {
    if (paused || isLast) return
    const started = performance.now()
    let raf = requestAnimationFrame(function tick(now) {
      const elapsed = now - started
      setProgress(Math.min(100, (elapsed / STORY_MS) * 100))
      if (elapsed >= STORY_MS) {
        goNext()
        return
      }
      raf = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(raf)
  }, [paused, index, goNext, isLast])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, goNext, goPrev])

  const onHoldStart = () => {
    holdTimer.current = setTimeout(() => setPaused(true), 120)
  }
  const onHoldEnd = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    setPaused(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-100 bg-black flex items-center justify-center"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX
        onHoldStart()
      }}
      onTouchEnd={(e) => {
        onHoldEnd()
        if (touchStartX.current == null) return
        const dx = e.changedTouches[0].clientX - touchStartX.current
        touchStartX.current = null
        if (Math.abs(dx) < 50) return
        if (dx < 0) goNext()
        else goPrev()
      }}
      onMouseDown={onHoldStart}
      onMouseUp={onHoldEnd}
      onMouseLeave={onHoldEnd}
    >
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-3 pt-3">
        {images.map((src, i) => (
          <div key={src} className="h-0.5 flex-1 rounded-full bg-white/30 overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{
                width: i < index ? '100%' : i === index ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-5 left-0 right-0 z-20 flex items-center justify-between px-4 pt-2">
        <p className="text-white font-bold text-sm drop-shadow">{title}</p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          aria-label="Close"
          className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative w-full h-full max-w-lg mx-auto">
        <Image
          src={images[index]}
          alt={`${title} ${index + 1}/${images.length}`}
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-contain"
        />

        {/* Tap zones: left third goes back, right two thirds go forward */}
        <button
          type="button"
          aria-label="Previous photo"
          className="absolute inset-y-0 left-0 w-1/3 z-10"
          onClick={(e) => {
            e.stopPropagation()
            goPrev()
          }}
        />
        <button
          type="button"
          aria-label="Next photo"
          className="absolute inset-y-0 right-0 w-2/3 z-10"
          onClick={(e) => {
            e.stopPropagation()
            goNext()
          }}
        />
      </div>

      {/* Book CTA — always reachable from story mode */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex flex-col items-center gap-3 px-6">
        <p className="text-center text-white/70 text-xs font-medium">
          {index + 1} / {images.length}
        </p>
        <Link
          href={`/${locale}/contact`}
          prefetch
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="btn-pill-sm bg-[#0046A4] text-white shadow-[0_12px_32px_rgba(0,70,164,0.35)] hover:bg-[#0057D1]"
        >
          {bookLabel(locale)}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
