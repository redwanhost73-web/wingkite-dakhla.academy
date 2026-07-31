'use client'

import { useEffect } from 'react'

// Catches errors thrown by the root layout itself, which app/error.tsx cannot.
export default function GlobalError({
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
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #3DA5D9, #1E5AA8)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '24px',
        }}
      >
        <div
          style={{
            maxWidth: '32rem',
            width: '100%',
            background: '#fff',
            borderRadius: '24px',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#1a1a2e', marginTop: 0 }}>
            Oups, une erreur est survenue
          </h1>
          <p style={{ color: '#6b7280', lineHeight: 1.6, marginBottom: '32px' }}>
            Something went wrong while loading this page. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              background: '#1E5AA8',
              color: '#fff',
              fontWeight: 700,
              height: '48px',
              padding: '0 32px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Réessayer / Try again
          </button>
          {error.digest && (
            <p style={{ marginTop: '32px', fontSize: '12px', color: '#9ca3af' }}>
              Ref: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  )
}
