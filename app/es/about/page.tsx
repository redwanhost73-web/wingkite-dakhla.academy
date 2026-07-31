import { PageLayout } from '@/components/page-layout'
import { AboutContent } from '@/components/about-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Acerca de | Escuela Wingfoil Dakhla',
  description: 'Wing Kite Dakhla Academy - Tu escuela de wingfoil y kitesurf en la laguna de Dakhla, Marruecos. Coaching profesional e instructores certificados.',
}

export default async function AboutPage() {
  const messages = await getMessages('es')
  return (
    <PageLayout locale="es" messages={messages}>
      <AboutContent />
    </PageLayout>
  )
}
