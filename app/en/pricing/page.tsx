import { PageLayout } from '@/components/page-layout'
import { PricingContent } from '@/components/pricing-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Wingfoil Lessons Dakhla Prices | Course & Rental Rates',
  description: 'Wing foil course Dakhla prices - Wingfoil lessons beginner to advanced, coaching and equipment rental. Best wingfoil camp Morocco rates in Dakhla lagoon.',
  keywords: ['wing foil course Dakhla', 'wingfoil lessons Dakhla', 'wingfoil rental Dakhla', 'wingfoil camp Morocco'],
}

export default async function PricingPage() {
  const messages = await getMessages('en')
  return (
    <PageLayout locale="en" messages={messages}>
      <PricingContent />
    </PageLayout>
  )
}
