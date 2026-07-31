import { PageLayout } from '@/components/page-layout'
import { ContactContent } from '@/components/contact-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'Contact | Réserver Cours Wingfoil Dakhla',
  description: 'Contactez Wing Kite Dakhla Academy pour réserver vos cours wingfoil ou kitesurf dans le lagon de Dakhla, Maroc. Réservation wingfoil camp, location matériel et coaching personnalisé.',
  keywords: ['réserver wingfoil Dakhla', 'contact école wingfoil', 'wingfoil lagoon Dakhla', 'water sports Dakhla'],
}

export default async function ContactPage() {
  const messages = await getMessages('fr')
  
  return (
    <PageLayout locale="fr" messages={messages}>
      <ContactContent />
    </PageLayout>
  )
}
