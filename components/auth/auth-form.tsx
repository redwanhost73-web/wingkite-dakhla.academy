'use client'

import Link from 'next/link'
import { FormEvent, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Building2, Compass, UserRound } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { postLoginPath, type SignupRole, type UserRole } from '@/lib/auth/roles'
import { TextField } from '@/components/ui/form-field'
import { PasswordInput } from '@/components/ui/password-input'
import { PhoneInput } from '@/components/ui/phone-input'
import { FormWizardNav, FormWizardSteps } from '@/components/ui/form-wizard'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Mode = 'login' | 'signup'

const SIGNUP_STEPS = [
  { id: 'type', label: 'Account' },
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
]

const ROLE_OPTIONS: {
  id: SignupRole
  title: string
  hint: string
  icon: typeof Building2
}[] = [
  {
    id: 'student',
    title: 'Student',
    hint: 'Book lessons and manage your profile.',
    icon: UserRound,
  },
  {
    id: 'business',
    title: 'Business',
    hint: 'Partners, hotels, and local agencies.',
    icon: Building2,
  },
  {
    id: 'tourist',
    title: 'Tourist',
    hint: 'Browse with a light optional account.',
    icon: Compass,
  },
]

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const params = useSearchParams()
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState<SignupRole>('student')
  const [fieldError, setFieldError] = useState('')
  const [error, setError] = useState(
    params.get('error') === 'forbidden'
      ? 'You do not have access to that area.'
      : params.get('error') === 'not_admin'
        ? 'Admin access required.'
        : '',
  )
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState('')

  const roleMeta = useMemo(
    () => ROLE_OPTIONS.find((r) => r.id === role) || ROLE_OPTIONS[0],
    [role],
  )

  const submitAuth = async () => {
    setLoading(true)
    setError('')
    setInfo('')

    const supabase = createClient()
    if (!supabase) {
      setError('Supabase is not configured yet.')
      setLoading(false)
      return
    }

    if (mode === 'signup') {
      const { data, error: signError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            full_name: fullName,
            phone,
            company_name: companyName,
          },
        },
      })
      if (signError) {
        setError(signError.message)
        setLoading(false)
        return
      }
      if (!data.session) {
        setInfo('Check your email to confirm your account, then sign in.')
        setLoading(false)
        return
      }
    } else {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      if (loginError) {
        setError(loginError.message)
        setLoading(false)
        return
      }
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setError('Could not load user session.')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    const nextRole = (profile?.role as UserRole) || 'tourist'
    router.replace(postLoginPath(nextRole))
    router.refresh()
  }

  const onLoginSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await submitAuth()
  }

  const validateStep = (index: number) => {
    setFieldError('')
    if (index === 1) {
      if (fullName.trim().length < 2) {
        setFieldError('Enter your full name.')
        return false
      }
      if (role === 'business' && companyName.trim().length < 2) {
        setFieldError('Company name is required for business accounts.')
        return false
      }
    }
    if (index === 2) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setFieldError('Enter a valid email address.')
        return false
      }
      if (password.length < 8) {
        setFieldError('Password must be at least 8 characters.')
        return false
      }
      if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        setFieldError('Password must include a letter and a number.')
        return false
      }
    }
    return true
  }

  const goNext = () => {
    if (!validateStep(step)) return
    setStep((s) => Math.min(s + 1, SIGNUP_STEPS.length - 1))
  }

  const onSignupSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateStep(2)) return
    await submitAuth()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,#0046A4_0%,#0B1F3B_55%)] px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white p-7 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#7A8AA3]">
          Wing Kite Dakhla
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-[#072A5A]">
          {mode === 'login' ? 'Welcome back' : 'Join the academy'}
        </h1>
        <p className="mt-2 text-sm text-[#3D4F6F]">
          Browsing never requires an account. Sign in for your dashboard or business tools.
        </p>

        <Tabs
          value={mode}
          onValueChange={(value) => {
            router.push(value === 'login' ? '/auth/login' : '/auth/signup')
          }}
          className="mt-5"
        >
          <TabsList className="grid h-11 w-full grid-cols-2 rounded-full bg-[#F0EBE3] p-1">
            <TabsTrigger
              value="login"
              className="rounded-full text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-[#072A5A] data-[state=active]:shadow-sm"
            >
              Sign in
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="rounded-full text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-[#072A5A] data-[state=active]:shadow-sm"
            >
              Create account
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        {info && (
          <p className="mt-4 rounded-2xl bg-sky-50 px-3.5 py-2.5 text-sm text-sky-800">{info}</p>
        )}
        {fieldError && (
          <p className="mt-4 rounded-2xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800" role="alert">
            {fieldError}
          </p>
        )}

        {mode === 'login' ? (
          <form onSubmit={onLoginSubmit} className="mt-5 space-y-4">
            <TextField
              label="Email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
            <PasswordInput
              label="Password"
              required
              minLength={6}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 w-full rounded-full bg-[#0B1F3B] text-sm font-bold text-white hover:bg-[#0046A4] disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        ) : (
          <form onSubmit={onSignupSubmit} className="mt-5">
            <FormWizardSteps steps={SIGNUP_STEPS} current={step} />

            {step === 0 && (
              <div className="mt-5 space-y-4">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#7A8AA3]">
                  Account type
                </p>
                <Tabs value={role} onValueChange={(v) => setRole(v as SignupRole)} className="gap-3">
                  <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-2xl bg-[#F0EBE3] p-1">
                    {ROLE_OPTIONS.map((opt) => (
                      <TabsTrigger
                        key={opt.id}
                        value={opt.id}
                        className="rounded-xl px-2 py-2.5 text-[0.7rem] font-bold data-[state=active]:bg-white data-[state=active]:text-[#072A5A] data-[state=active]:shadow-sm"
                      >
                        {opt.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                <div className="rounded-2xl border border-[#072A5A]/08 bg-[#FAF8F3] p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1F3B] text-white">
                      <roleMeta.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#072A5A]">{roleMeta.title} account</p>
                      <p className="mt-1 text-sm text-[#3D4F6F]">{roleMeta.hint}</p>
                      {role === 'business' && (
                        <p className="mt-2 text-xs font-semibold text-[#0046A4]">
                          Next: company details → secure login
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <FormWizardNav nextLabel="Continue" onNext={goNext} />
              </div>
            )}

            {step === 1 && (
              <div className="mt-5 space-y-4">
                <TextField
                  label="Full name"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                />
                {role === 'business' && (
                  <TextField
                    label="Company name"
                    required
                    autoComplete="organization"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Hotel, agency, school…"
                    hint="Shown on your business dashboard."
                  />
                )}
                <PhoneInput
                  label="Phone"
                  value={phone}
                  onChange={setPhone}
                  autoDetect
                  defaultCountry="MA"
                  hint={
                    role === 'business'
                      ? 'Preferred contact for partnership leads.'
                      : undefined
                  }
                />
                <FormWizardNav
                  onBack={() => {
                    setFieldError('')
                    setStep(0)
                  }}
                  nextLabel="Continue"
                  onNext={goNext}
                />
              </div>
            )}

            {step === 2 && (
              <div className="mt-5 space-y-4">
                <TextField
                  label="Email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                />
                <PasswordInput
                  label="Password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  showStrength
                  hint="Use 8+ characters with a letter and a number."
                />
                <FormWizardNav
                  onBack={() => {
                    setFieldError('')
                    setStep(1)
                  }}
                  nextLabel={loading ? 'Creating…' : 'Create account'}
                  nextType="submit"
                  loading={loading}
                />
              </div>
            )}
          </form>
        )}

        <Link
          href="/fr"
          className="mt-5 block text-center text-xs font-semibold text-[#0046A4] hover:underline"
        >
          ← Continue browsing without account
        </Link>
      </div>
    </div>
  )
}
