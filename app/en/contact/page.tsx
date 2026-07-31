import { PageLayout } from '@/components/page-layout'
import { ContactContent } from '@/components/contact-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Contact | Book Wingfoil Lessons Dakhla',
  description: 'Contact Wing Kite Dakhla Academy to book your wingfoil or kitesurf lessons in Dakhla lagoon, Morocco. Book your wingfoil camp, equipment rental and personal coaching.',
  keywords: ['book wingfoil Dakhla', 'contact wingfoil school', 'wingfoil lagoon Dakhla', 'water sports Dakhla'],
}

export default async function ContactPage() {
  const messages = await getMessages('en')
  
  return (
    <PageLayout locale="en" messages={messages}>
      <ContactContent />
    </PageLayout>
  )
}
