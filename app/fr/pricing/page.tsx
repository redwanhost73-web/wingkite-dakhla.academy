import { PageLayout } from '@/components/page-layout'
import { PricingContent } from '@/components/pricing-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Tarifs Cours Wingfoil Dakhla | Prix Location & Stages',
  description: 'Tarifs cours wingfoil Dakhla - Wing foil course débutant, coaching avancé et location de matériel. Wingfoil camp et stages kitesurf au meilleur prix dans le lagon de Dakhla, Maroc.',
  keywords: ['wing foil course Dakhla', 'wingfoil rental Dakhla', 'wingfoil camp Morocco', 'cours wingfoil prix'],
}

export default async function PricingPage() {
  const messages = await getMessages('fr')
  return (
    <PageLayout locale="fr" messages={messages}>
      <PricingContent />
    </PageLayout>
  )
}
