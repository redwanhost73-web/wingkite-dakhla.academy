import { PageLayout } from '@/components/page-layout'
import { HomeContent } from '@/components/home-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'École Wingfoil Dakhla | Cours Wing Foil & Kitesurf Maroc',
  description: 'Wing foil Dakhla - École de wingfoil et kitesurf dans le lagon de Dakhla, Maroc. Cours wingfoil débutant, coaching et location de matériel. Le meilleur wingfoil camp au Maroc.',
  keywords: ['wing foil Dakhla', 'école wingfoil Dakhla', 'cours wingfoil Dakhla', 'kitesurf Dakhla', 'wingfoil lagon Dakhla', 'apprendre wingfoil Maroc'],
}

export default async function HomePage() {
  const messages = await getMessages('fr')
  
  return (
    <PageLayout locale="fr" messages={messages}>
      <HomeContent />
    </PageLayout>
  )
}
