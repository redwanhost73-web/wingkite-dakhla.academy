'use client'

import Image from 'next/image'

const LOGOS = [
  { src: '/Logo/Logo.png', alt: 'Wing Kite Dakhla Academy', width: 190, height: 70 },
  { src: '/Logo/iko-logo.svg', alt: 'IKO', width: 112, height: 45 },
] as const

// Three pairs × two loop copies is enough for ultrawide without 16 DOM images.
const STRIP = Array.from({ length: 3 }, () => LOGOS).flat()

export function LogoMarquee() {
  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-14" aria-label="Partners" data-nav-theme="light">
      {/* Thin separators instead of a boxed-in border */}
      <hr className="hairline absolute inset-x-0 top-0" />
      <hr className="hairline absolute inset-x-0 bottom-0" />

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-white to-transparent sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-white to-transparent sm:w-40" />

        <div className="flex w-max animate-logo-marquee items-center gap-16 px-10 sm:gap-24">
          {/* Second copy for seamless loop without doubling React work further */}
          {[...STRIP, ...STRIP].map((logo, i) => (
            <div
              key={`${logo.src}-${i}`}
              className="relative h-9 shrink-0 opacity-40 grayscale transition-[opacity,filter] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-100 hover:grayscale-0 sm:h-11"
              style={{ width: logo.width }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                sizes="120px"
                loading="lazy"
                quality={60}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
