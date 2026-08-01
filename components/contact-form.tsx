'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Loader2,
  Send,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  Info,
  MessageSquare,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useTranslations } from '@/lib/i18n-context'
import { cn } from '@/lib/utils'

const FIELD =
  'h-13 rounded-[16px] border-[#072A5A]/10 bg-white px-4 text-[#072A5A] shadow-none transition-[border-color,box-shadow] duration-300 focus-visible:border-[#0046A4]/40 focus-visible:ring-[3px] focus-visible:ring-[#0046A4]/12'
const LABEL = 'text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#7A8AA3]'
const ERROR = 'text-xs font-medium text-destructive'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>
type Step = 0 | 1 | 2

const TOTAL_STEPS = 3

export function ContactForm() {
  const { t, locale } = useTranslations()
  const [step, setStep] = useState<Step>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const getText = (fr: string, en: string, es?: string, ar?: string) => {
    if (locale === 'fr') return fr
    if (locale === 'es') return es || en
    if (locale === 'ar') return ar || en
    return en
  }

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
    mode: 'onTouched',
  })

  const subject = watch('subject')

  const subjects = [
    {
      value: 'booking',
      Icon: CalendarDays,
      label: t('contact.form.subjects.booking'),
      hint: getText(
        'Réserver un cours ou un pack',
        'Book a lesson or package',
        'Reservar una clase o pack',
        'احجز درساً أو باقة',
      ),
    },
    {
      value: 'info',
      Icon: Info,
      label: t('contact.form.subjects.info'),
      hint: getText(
        'Questions sur les tarifs ou le spot',
        'Questions about prices or the spot',
        'Preguntas sobre precios o el spot',
        'أسئلة عن الأسعار أو الموقع',
      ),
    },
    {
      value: 'other',
      Icon: MessageSquare,
      label: t('contact.form.subjects.other'),
      hint: getText(
        'Autre demande',
        'Anything else',
        'Otra consulta',
        'طلب آخر',
      ),
    },
  ]

  const stepTitles = [
    getText('Que souhaitez-vous ?', 'What do you need?', '¿Qué necesitas?', 'ماذا تحتاج؟'),
    getText('Vos coordonnées', 'Your details', 'Tus datos', 'بياناتك'),
    getText('Votre message', 'Your message', 'Tu mensaje', 'رسالتك'),
  ]

  const onSubmit = async (_data: ContactFormData) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)
    reset()
    setStep(0)
    setTimeout(() => setIsSuccess(false), 5000)
  }

  const goNext = async () => {
    if (step === 0) {
      const ok = await trigger('subject')
      if (!ok || !getValues('subject')) {
        await trigger('subject')
        return
      }
      setStep(1)
      return
    }
    if (step === 1) {
      const ok = await trigger(['name', 'email'])
      if (!ok) return
      setStep(2)
    }
  }

  const goBack = () => {
    if (step === 0) return
    setStep((s) => (s - 1) as Step)
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0046A4]/8">
          <CheckCircle className="h-8 w-8 text-[#0046A4]" />
        </span>
        <p className="text-body-lg font-semibold text-[#072A5A] mt-6">
          {t('contact.form.success')}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-small font-semibold text-[#072A5A]">{stepTitles[step]}</p>
          <p className="text-xs font-bold tabular-nums text-[#7A8AA3]">
            {step + 1}/{TOTAL_STEPS}
          </p>
        </div>
        <div className="flex gap-2" aria-hidden>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors duration-450',
                i <= step ? 'bg-[#0046A4]' : 'bg-[#072A5A]/10',
              )}
            />
          ))}
        </div>
      </div>

      {/* Step 1 — intent */}
      {step === 0 && (
        <div className="space-y-3">
          {subjects.map(({ value, Icon, label, hint }) => {
            const selected = subject === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setValue('subject', value, { shouldValidate: true })
                }}
                className={cn(
                  'flex w-full items-start gap-4 rounded-[20px] border px-4 py-4 text-start transition-all duration-450',
                  selected
                    ? 'border-[#0046A4]/35 bg-[#DCEEFF]/55 shadow-[0_10px_30px_rgba(0,70,164,0.08)]'
                    : 'border-[#072A5A]/8 bg-white hover:border-[#0046A4]/20 hover:bg-[#FAF8F3]',
                )}
              >
                <span
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]',
                    selected ? 'bg-[#0046A4] text-white' : 'bg-[#0046A4]/8 text-[#0046A4]',
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className="block text-small font-bold text-[#072A5A]">{label}</span>
                  <span className="mt-1 block text-xs text-[#7A8AA3]">{hint}</span>
                </span>
              </button>
            )
          })}
          {errors.subject && <p className={ERROR}>{errors.subject.message}</p>}
        </div>
      )}

      {/* Step 2 — details */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="space-y-2.5">
            <Label htmlFor="name" className={LABEL}>
              {t('contact.form.name')}
            </Label>
            <Input
              id="name"
              {...register('name')}
              className={`${FIELD} ${errors.name ? 'border-destructive' : ''}`}
            />
            {errors.name && <p className={ERROR}>{errors.name.message}</p>}
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="email" className={LABEL}>
              {t('contact.form.email')}
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={`${FIELD} ${errors.email ? 'border-destructive' : ''}`}
            />
            {errors.email && <p className={ERROR}>{errors.email.message}</p>}
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="phone" className={LABEL}>
              {t('contact.form.phone')}
            </Label>
            <Input id="phone" type="tel" {...register('phone')} className={FIELD} />
          </div>
        </div>
      )}

      {/* Step 3 — message */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="rounded-[18px] border border-[#072A5A]/8 bg-[#FAF8F3] px-4 py-3.5">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#7A8AA3]">
              {t('contact.form.subject')}
            </p>
            <p className="text-small font-semibold text-[#072A5A] mt-1">
              {subjects.find((s) => s.value === subject)?.label}
            </p>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="message" className={LABEL}>
              {t('contact.form.message')}
            </Label>
            <Textarea
              id="message"
              rows={5}
              {...register('message')}
              placeholder={getText(
                'Dates, niveau, nombre de personnes…',
                'Dates, level, number of people…',
                'Fechas, nivel, número de personas…',
                'التواريخ، المستوى، عدد الأشخاص…',
              )}
              className={`rounded-[16px] border-[#072A5A]/10 bg-white p-4 text-[#072A5A] shadow-none transition-[border-color,box-shadow] duration-300 focus-visible:border-[#0046A4]/40 focus-visible:ring-[3px] focus-visible:ring-[#0046A4]/12 ${
                errors.message ? 'border-destructive' : ''
              }`}
            />
            {errors.message && <p className={ERROR}>{errors.message.message}</p>}
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="flex gap-3 pt-1">
        {step > 0 && (
          <button
            type="button"
            onClick={goBack}
            className="btn-pill-sm flex-1 border border-[#072A5A]/12 bg-white text-[#072A5A] hover:bg-[#DCEEFF]/50"
          >
            <ArrowLeft className="h-4 w-4" />
            {getText('Retour', 'Back', 'Atrás', 'رجوع')}
          </button>
        )}

        {step < 2 ? (
          <button
            type="button"
            onClick={goNext}
            className="btn-pill-sm flex-[1.4] bg-[#0046A4] text-white shadow-[0_10px_30px_rgba(0,70,164,0.22)] hover:bg-[#0057D1]"
          >
            {getText('Continuer', 'Continue', 'Continuar', 'متابعة')}
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-pill-sm flex-[1.4] bg-[#0046A4] text-white shadow-[0_10px_30px_rgba(0,70,164,0.25)] hover:bg-[#0057D1] disabled:pointer-events-none disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {getText('Envoi…', 'Sending…', 'Enviando…', 'جاري الإرسال…')}
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t('contact.form.submit')}
              </>
            )}
          </button>
        )}
      </div>
    </form>
  )
}
