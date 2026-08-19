import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0B1F3B] text-white">
          Loading…
        </div>
      }
    >
      <AuthForm mode="login" />
    </Suspense>
  )
}
