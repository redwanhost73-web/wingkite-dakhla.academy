import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="surface-noise relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B1F3B] px-6">
      <span aria-hidden className="blob -top-40 left-1/4 h-120 w-120 bg-[#0046A4]/30" />
      <span aria-hidden className="blob -bottom-40 right-1/4 h-104 w-104 bg-[#5AA8FF]/12" />

      <div className="relative z-10 w-full max-w-lg rounded-[28px] border border-white/12 bg-white/8 p-10 text-center shadow-[0_40px_90px_rgba(0,70,164,0.08)] backdrop-blur-[20px] backdrop-saturate-150 sm:p-12">
        <p className="font-heading text-display-sm text-[#C9A66B]">404</p>
        <h1 className="font-heading text-card-title text-white mt-4">
          Page introuvable / Page not found
        </h1>
        <p className="text-small text-white/65 mt-4">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Link href="/fr" className="btn-pill mt-10 bg-white text-[#0B1F3B] hover:bg-white">
          Accueil / Home
        </Link>
      </div>
    </div>
  )
}
