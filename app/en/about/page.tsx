import { PageLayout } from '@/components/page-layout'
import { AboutContent } from '@/components/about-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'About | Wingfoil Academy Dakhla - Our School',
  description: 'Wing Kite Dakhla Academy - Your wingfoil and kitesurf school in Dakhla lagoon, Morocco. Professional wingfoil coaching, certified instructors for your wingfoil holiday Morocco.',
  keywords: ['wingfoil academy', 'wingfoil Dakhla school', 'water sports Dakhla', 'wingfoil coaching Dakhla'],
}

export default async function AboutPage() {
  const messages = await getMessages('en')
  
  return (
    <PageLayout locale="en" messages={messages}>
      <AboutContent />
    </PageLayout>
  )
}
