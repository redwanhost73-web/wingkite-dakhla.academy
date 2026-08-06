import { PageLayout } from '@/components/page-layout'
import { SafetyContent } from '@/components/safety-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Sécurité & Matériel | Wing Kite Dakhla Academy',
  description:
    'Protocoles de sécurité, bateau de secours, casques radio, moniteurs IKO et matériel haut de gamme à Dakhla.',
}

export default async function SafetyPage() {
  const messages = await getMessages('fr')
  return (
    <PageLayout locale="fr" messages={messages}>
      <SafetyContent />
    </PageLayout>
  )
}
