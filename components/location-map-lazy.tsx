'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const LocationMap = dynamic(
  () => import('@/components/location-map').then((m) => m.LocationMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-[#DCEEFF]/40 text-small font-semibold text-[#072A5A]/60">
        Loading map…
      </div>
    ),
  },
)

type Props = {
  className?: string
}

/**
 * Only pull Leaflet + tiles once the map section is near the viewport,
 * so contact page first paint stays light.
 */
export function LocationMapLazy({ className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || visible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [visible])

  return (
    <div ref={ref} className={className}>
      {visible ? (
        <LocationMap className="absolute inset-0 h-full w-full" />
      ) : (
        <div className="absolute inset-0 bg-[#DCEEFF]/35" aria-hidden />
      )}
    </div>
  )
}
