import { Navigation } from './navigation'
import { Footer } from './footer'
import { WhatsAppBubble } from './whatsapp-bubble'
import { I18nProvider } from '@/lib/i18n-context'
import type { Locale } from '@/lib/i18n'

interface PageLayoutProps {
  children: React.ReactNode
  locale: Locale
  messages: Record<string, unknown>
}

export function PageLayout({ children, locale, messages }: PageLayoutProps) {
  const isArabic = locale === 'ar'
  
  return (
    <I18nProvider locale={locale} messages={messages}>
      <div 
        className={`flex min-h-screen flex-col ${isArabic ? 'font-cairo' : 'font-sans'}`}
        dir={isArabic ? 'rtl' : 'ltr'}
        lang={locale}
      >
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <WhatsAppBubble />
    </I18nProvider>
  )
}
