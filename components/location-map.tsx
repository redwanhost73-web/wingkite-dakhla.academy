'use client'

import { useEffect, useRef } from 'react'
import { SCHOOL_LAT, SCHOOL_LNG, SCHOOL_NAME } from '@/lib/location'

type Props = {
  className?: string
}

/**
 * Interactive map pinned on the school, with the academy name floating
 * above the marker so the spot reads clearly without opening Google Maps.
 * Leaflet is loaded only in the browser (it touches `window` at import time).
 */
export function LocationMap({ className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<{ remove: () => void } | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el || mapRef.current) return

    let cancelled = false
    let resize: (() => void) | null = null
    let observer: ResizeObserver | null = null
    let frame = 0

    ;(async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')
      if (cancelled || !containerRef.current || mapRef.current) return

      const map = L.map(el, {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView([SCHOOL_LAT, SCHOOL_LNG], 15)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      const icon = L.divIcon({
        className: 'school-map-marker',
        html: `
          <div class="school-map-pin">
            <span class="school-map-label">${SCHOOL_NAME}</span>
            <span class="school-map-stem" aria-hidden="true"></span>
            <span class="school-map-dot" aria-hidden="true"></span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      })

      L.marker([SCHOOL_LAT, SCHOOL_LNG], { icon, interactive: false }).addTo(map)
      mapRef.current = map

      // The container grows as the reveal animation settles and as breakpoints
      // change its min-height; without re-measuring, Leaflet leaves the newly
      // exposed area as blank grey tiles.
      resize = () => map.invalidateSize()
      frame = window.requestAnimationFrame(resize)
      window.addEventListener('resize', resize)

      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(() => map.invalidateSize())
        observer.observe(el)
      }
    })()

    return () => {
      cancelled = true
      if (frame) window.cancelAnimationFrame(frame)
      if (resize) window.removeEventListener('resize', resize)
      observer?.disconnect()
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label={`${SCHOOL_NAME} — 23°54′53.6″N 15°46′28.4″W`}
    />
  )
}
