import { PageLayout } from '@/components/page-layout'
import { PricingContent } from '@/components/pricing-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'أسعار دورات وينج فويل الداخلة | الأسعار والتأجير',
  description: 'أسعار دورات وينج فويل الداخلة - دورات للمبتدئين، تدريب متقدم وتأجير المعدات. معسكر وينج فويل ودورات كايت سيرف بأفضل الأسعار في بحيرة الداخلة، المغرب.',
  keywords: ['أسعار وينج فويل الداخلة', 'تأجير وينج فويل', 'معسكر وينج فويل المغرب'],
}

export default async function PricingPage() {
  const messages = await getMessages('ar')
  return (
    <PageLayout locale="ar" messages={messages}>
      <PricingContent />
    </PageLayout>
  )
}
