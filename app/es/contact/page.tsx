import { PageLayout } from '@/components/page-layout'
import { ContactContent } from '@/components/contact-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Contacto | Reservar Clases Wingfoil Dakhla',
  description: 'Contacta con Wing Kite Dakhla Academy para reservar tus clases de wingfoil o kitesurf en la laguna de Dakhla, Marruecos.',
}

export default async function ContactPage() {
  const messages = await getMessages('es')
  return (
    <PageLayout locale="es" messages={messages}>
      <ContactContent />
    </PageLayout>
  )
}
