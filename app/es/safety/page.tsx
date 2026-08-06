import { PageLayout } from '@/components/page-layout'
import { SafetyContent } from '@/components/safety-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Seguridad y Material | Wing Kite Dakhla Academy',
  description:
    'Protocolos de seguridad, barco de rescate, cascos con radio, monitores IKO y material premium en Dakhla.',
}

export default async function SafetyPage() {
  const messages = await getMessages('es')
  return (
    <PageLayout locale="es" messages={messages}>
      <SafetyContent />
    </PageLayout>
  )
}
