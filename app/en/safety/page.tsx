import { PageLayout } from '@/components/page-layout'
import { SafetyContent } from '@/components/safety-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Safety & Equipment | Wing Kite Dakhla Academy',
  description:
    'Safety protocols, rescue boat, radio helmets, IKO instructors and premium gear in Dakhla.',
}

export default async function SafetyPage() {
  const messages = await getMessages('en')
  return (
    <PageLayout locale="en" messages={messages}>
      <SafetyContent />
    </PageLayout>
  )
}
