'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="surface-noise relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B1F3B] px-6">
      <span aria-hidden className="blob -top-40 left-1/4 h-120 w-120 bg-[#0046A4]/30" />

      <div className="relative z-10 w-full max-w-lg rounded-[28px] border border-white/12 bg-white/8 p-10 text-center shadow-[0_40px_90px_rgba(0,70,164,0.08)] backdrop-blur-[20px] backdrop-saturate-150 sm:p-12">
        <h1 className="font-heading text-card-title text-white">
          Oups, une erreur est survenue
        </h1>
        <p className="text-small text-white/65 mt-4">
          Something went wrong while loading this page. Please try again.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="btn-pill bg-white text-[#0B1F3B] hover:bg-white">
            Réessayer / Try again
          </button>
          <a href="/fr" className="btn-pill btn-outline-light shadow-none">
            Accueil / Home
          </a>
        </div>

        {error.digest && <p className="mt-8 text-xs text-white/35">Ref: {error.digest}</p>}
      </div>
    </div>
  )
}
