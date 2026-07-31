import { PageLayout } from '@/components/page-layout'
import { AboutContent } from '@/components/about-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'من نحن | أكاديمية وينج فويل الداخلة - مدرستنا',
  description: 'أكاديمية وينج كايت الداخلة - مدرستك لتعليم وينج فويل وكايت سيرف في بحيرة الداخلة، المغرب. تدريب احترافي ومدربون معتمدون لعطلتك المائية في المغرب.',
  keywords: ['أكاديمية وينج فويل', 'مدرسة وينج فويل الداخلة', 'رياضات مائية الداخلة'],
}

export default async function AboutPage() {
  const messages = await getMessages('ar')
  
  return (
    <PageLayout locale="ar" messages={messages}>
      <AboutContent />
    </PageLayout>
  )
}
