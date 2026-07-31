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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="h-16 w-16 text-primary mb-4" />
        <p className="text-lg font-medium text-foreground">
          {t('contact.form.success')}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('contact.form.name')}</Label>
          <Input
            id="name"
            {...register('name')}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">{t('contact.form.email')}</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">{t('contact.form.phone')}</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subject">{t('contact.form.subject')}</Label>
          <Select onValueChange={(value) => setValue('subject', value)}>
            <SelectTrigger className={errors.subject ? 'border-destructive' : ''}>
              <SelectValue placeholder={t('contact.form.subject')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="booking">{t('contact.form.subjects.booking')}</SelectItem>
              <SelectItem value="info">{t('contact.form.subjects.info')}</SelectItem>
              <SelectItem value="other">{t('contact.form.subjects.other')}</SelectItem>
            </SelectContent>
          </Select>
          {errors.subject && (
            <p className="text-sm text-destructive">{errors.subject.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">{t('contact.form.message')}</Label>
        <Textarea
          id="message"
          rows={5}
          {...register('message')}
          className={errors.message ? 'border-destructive' : ''}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            {t('contact.form.submit')}
          </>
        )}
      </Button>
    </form>
  )
}
