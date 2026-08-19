import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata = {
  title: 'Sign up',
  robots: { index: false, follow: false },
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0B1F3B] text-white">
          Loading…
        </div>
      }
    >
      <AuthForm mode="signup" />
    </Suspense>
  )
}
