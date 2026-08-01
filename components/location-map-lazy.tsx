'use client'

import dynamic from 'next/dynamic'

export const LocationMapLazy = dynamic(
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
