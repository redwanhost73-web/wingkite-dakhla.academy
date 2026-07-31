import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-linear-to-br from-[#3DA5D9] via-[#2B8FBC] to-[#1E5AA8]">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
        <p className="text-6xl font-black text-[#E5A423] mb-4">404</p>
        <h1 className="text-2xl font-black text-[#1a1a2e] mb-4">
          Page introuvable / Page not found
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/fr"
          className="bg-[#1E5AA8] hover:bg-[#164a8a] text-white font-bold h-12 px-8 rounded-full inline-flex items-center transition-colors"
        >
          Accueil / Home
        </Link>
      </div>
    </div>
  )
}
