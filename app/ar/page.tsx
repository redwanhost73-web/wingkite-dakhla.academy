import { PageLayout } from '@/components/page-layout'
import { HomeContent } from '@/components/home-content'
import { getMessages } from '@/lib/i18n'

export const metadata = {
  title: 'مدرسة وينج فويل الداخلة | دورات ركوب الأمواج والكايت سيرف المغرب',
  description: 'وينج فويل الداخلة - مدرسة لتعليم ركوب الأمواج والكايت سيرف في بحيرة الداخلة، المغرب. دورات للمبتدئين والمحترفين وتأجير المعدات. أفضل معسكر وينج فويل في المغرب.',
  keywords: ['وينج فويل الداخلة', 'مدرسة وينج فويل', 'كايت سيرف الداخلة', 'رياضات مائية المغرب'],
}

export default async function HomePage() {
  const messages = await getMessages('ar')
  
  return (
    <PageLayout locale="ar" messages={messages}>
      <HomeContent />
    </PageLayout>
  )
}
