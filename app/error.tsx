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
    <div className="min-h-screen flex items-center justify-center px-6 bg-linear-to-br from-[#3DA5D9] via-[#2B8FBC] to-[#1E5AA8]">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
        <h1 className="text-3xl font-black text-[#1a1a2e] mb-4">
          Oups, une erreur est survenue
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Something went wrong while loading this page. Please try again.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-[#1E5AA8] hover:bg-[#164a8a] text-white font-bold h-12 px-8 rounded-full transition-colors"
          >
            Réessayer / Try again
          </button>
          <a
            href="/fr"
            className="bg-gray-100 hover:bg-gray-200 text-[#1a1a2e] font-bold h-12 px-8 rounded-full inline-flex items-center transition-colors"
          >
            Accueil / Home
          </a>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-gray-400">Ref: {error.digest}</p>
        )}
      </div>
    </div>
  )
}
