import { PageLayout } from '@/components/page-layout'
import { SafetyContent } from '@/components/safety-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'السلامة والمعدات | Wing Kite Dakhla Academy',
  description:
    'بروتوكولات السلامة وقارب الإنقاذ وخوذات الراديو ومدربو IKO ومعدات فاخرة في الداخلة.',
}

export default async function SafetyPage() {
  const messages = await getMessages('ar')
  return (
    <PageLayout locale="ar" messages={messages}>
      <SafetyContent />
    </PageLayout>
  )
}
