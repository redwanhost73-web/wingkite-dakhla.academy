import { PageLayout } from '@/components/page-layout'
import { AboutContent } from '@/components/about-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'A propos | Wingfoil Academy Dakhla - Notre École',
  description: 'Wing Kite Dakhla Academy - Votre école de wingfoil et kitesurf dans le lagon de Dakhla, Maroc. Coaching professionnel, instructeurs certifiés pour votre wingfoil holiday au Maroc.',
  keywords: ['wingfoil academy', 'école wingfoil Dakhla', 'water sports Dakhla', 'wingfoil coaching Dakhla'],
}

export default async function AboutPage() {
  const messages = await getMessages('fr')
  
  return (
    <PageLayout locale="fr" messages={messages}>
      <AboutContent />
    </PageLayout>
  )
}
