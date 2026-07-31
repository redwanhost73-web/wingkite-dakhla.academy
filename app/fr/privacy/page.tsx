import { PageLayout } from '@/components/page-layout'
import { PrivacyContent } from '@/components/privacy-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Politique de confidentialité | Wing Kite Dakhla Academy',
  description: 'Politique de confidentialité de Wing Kite Dakhla Academy. Comment nous collectons, utilisons et protégeons vos données personnelles.',
}

export default async function PrivacyPage() {
  const messages = await getMessages('fr')
  return (
    <PageLayout locale="fr" messages={messages}>
      <PrivacyContent />
    </PageLayout>
  )
}
