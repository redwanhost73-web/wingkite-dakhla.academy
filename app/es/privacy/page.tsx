import { PageLayout } from '@/components/page-layout'
import { PrivacyContent } from '@/components/privacy-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Política de privacidad | Wing Kite Dakhla Academy',
  description: 'Política de privacidad de Wing Kite Dakhla Academy. Cómo recopilamos, usamos y protegemos sus datos personales.',
}

export default async function PrivacyPage() {
  const messages = await getMessages('es')
  return (
    <PageLayout locale="es" messages={messages}>
      <PrivacyContent />
    </PageLayout>
  )
}
