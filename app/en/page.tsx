import { PageLayout } from '@/components/page-layout'
import { HomeContent } from '@/components/home-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Wingfoil School Dakhla | Wing Foil Lessons & Kitesurf Morocco',
  description: 'Wing foil Dakhla school - Learn wingfoil in Dakhla lagoon, Morocco. Wingfoil lessons for beginners, coaching & rental. Best wingfoil camp and water sports holiday in Dakhla.',
  keywords: ['wing foil Dakhla', 'wingfoil Dakhla school', 'wingfoil lessons Dakhla', 'learn wingfoil Dakhla', 'wingfoil camp Morocco', 'kitesurf wingfoil Dakhla'],
}

export default async function HomePage() {
  const messages = await getMessages('en')
  
  return (
    <PageLayout locale="en" messages={messages}>
      <HomeContent />
    </PageLayout>
  )
}
