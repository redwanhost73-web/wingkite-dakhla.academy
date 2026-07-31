import { PageLayout } from '@/components/page-layout'
import { PrivacyContent } from '@/components/privacy-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Privacy Policy | Wing Kite Dakhla Academy',
  description: 'Privacy Policy of Wing Kite Dakhla Academy. How we collect, use and protect your personal data.',
}

export default async function PrivacyPage() {
  const messages = await getMessages('en')
  return (
    <PageLayout locale="en" messages={messages}>
      <PrivacyContent />
    </PageLayout>
  )
}
