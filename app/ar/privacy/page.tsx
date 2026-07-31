import { PageLayout } from '@/components/page-layout'
import { PrivacyContent } from '@/components/privacy-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'سياسة الخصوصية | Wing Kite Dakhla Academy',
  description: 'سياسة الخصوصية لأكاديمية وينج كايت الداخلة. كيف نجمع بياناتك الشخصية ونستخدمها ونحميها.',
}

export default async function PrivacyPage() {
  const messages = await getMessages('ar')
  return (
    <PageLayout locale="ar" messages={messages}>
      <PrivacyContent />
    </PageLayout>
  )
}
