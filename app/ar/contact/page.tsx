import { PageLayout } from '@/components/page-layout'
import { ContactContent } from '@/components/contact-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'اتصل بنا | احجز دورات وينج فويل الداخلة',
  description: 'تواصل مع أكاديمية وينج كايت الداخلة لحجز دورات وينج فويل أو كايت سيرف في بحيرة الداخلة، المغرب. حجز معسكر وينج فويل وتأجير المعدات والتدريب الشخصي.',
  keywords: ['حجز وينج فويل الداخلة', 'اتصل مدرسة وينج فويل', 'رياضات مائية الداخلة'],
}

export default async function ContactPage() {
  const messages = await getMessages('ar')
  
  return (
    <PageLayout locale="ar" messages={messages}>
      <ContactContent />
    </PageLayout>
  )
}
