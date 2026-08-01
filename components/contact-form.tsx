'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslations } from '@/lib/i18n-context'

// Shared field styling: 16px radius and a 52px target height, per the design system.
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

export function ContactForm() {
  const { t } = useTranslations()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })
  
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)
    reset()
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSuccess(false), 5000)
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="name" className={LABEL}>{t('contact.form.name')}</Label>
          <Input
            id="name"
            {...register('name')}
            className={`${FIELD} ${errors.name ? 'border-destructive' : ''}`}
          />
          {errors.name && <p className={ERROR}>{errors.name.message}</p>}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="email" className={LABEL}>{t('contact.form.email')}</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={`${FIELD} ${errors.email ? 'border-destructive' : ''}`}
          />
          {errors.email && <p className={ERROR}>{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="phone" className={LABEL}>{t('contact.form.phone')}</Label>
          <Input id="phone" type="tel" {...register('phone')} className={FIELD} />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="subject" className={LABEL}>{t('contact.form.subject')}</Label>
          <Select onValueChange={(value) => setValue('subject', value)}>
            <SelectTrigger
              className={`${FIELD} w-full ${errors.subject ? 'border-destructive' : ''}`}
            >
              <SelectValue placeholder={t('contact.form.subject')} />
            </SelectTrigger>
            <SelectContent className="rounded-[16px]">
              <SelectItem value="booking">{t('contact.form.subjects.booking')}</SelectItem>
              <SelectItem value="info">{t('contact.form.subjects.info')}</SelectItem>
              <SelectItem value="other">{t('contact.form.subjects.other')}</SelectItem>
            </SelectContent>
          </Select>
          {errors.subject && <p className={ERROR}>{errors.subject.message}</p>}
        </div>
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="message" className={LABEL}>{t('contact.form.message')}</Label>
        <Textarea
          id="message"
          rows={5}
          {...register('message')}
          className={`rounded-[16px] border-[#072A5A]/10 bg-white p-4 text-[#072A5A] shadow-none transition-[border-color,box-shadow] duration-300 focus-visible:border-[#0046A4]/40 focus-visible:ring-[3px] focus-visible:ring-[#0046A4]/12 ${
            errors.message ? 'border-destructive' : ''
          }`}
        />
        {errors.message && <p className={ERROR}>{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-pill w-full bg-[#0046A4] text-white shadow-[0_10px_30px_rgba(0,70,164,0.25)] hover:bg-[#0057D1] disabled:pointer-events-none disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            {t('contact.form.submit')}
          </>
        )}
      </button>
    </form>
  )
}
