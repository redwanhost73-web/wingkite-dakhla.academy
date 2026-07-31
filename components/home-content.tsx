'use client'

import { useTranslations } from '@/lib/i18n-context'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Wind, Waves, Star, Shield, Users, ChevronDown, Play, MapPin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSiteConfig } from '@/hooks/use-site-config'
import { DEFAULT_IMAGES } from '@/lib/site-config'

// Scroll animation hook
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

// Animated section wrapper
function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation()
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// Real Google Reviews data
const googleReviews = [
  {
    name: 'Cecile Castilla',
    rating: 5,
    date: '2 days ago',
    text: {
      fr: "J'ai pris des cours de wingfoil avec Radouan pendant six jours. J'étais débutante et grâce à lui j'ai pu progresser chaque jour. J'ai commencé par comprendre les bases du vent et comment tacker sur la plage avant d'aller sur l'eau.",
      en: "I took wingfoil lessons with Radouan for six days. I was a beginner, and thanks to him I was able to improve every day. I started by understanding the basics of the wind and how to tack on the beach before going out onto the water.",
    },
    avatar: 'C',
    color: '#1E5AA8',
  },
  {
    name: 'Hedi Benkirane',
    rating: 5,
    date: '2 days ago',
    text: {
      fr: "Redwan est la raison principale pour laquelle je suis passé de novice à rider en quelques semaines. Il y a beaucoup de kitesurfeurs et d'instructeurs mais très peu qui savent expliquer d'une manière compréhensible pour un débutant.",
      en: "Redwan is the main reason I went from rookie to rider in a few weeks. There's a lot of kite surfers out there and many instructors but very few who can explain how to kite surf in a way that makes sense to a beginner.",
    },
    avatar: 'H',
    color: '#E5A423',
  },
  {
    name: 'Noureddine Bouchait',
    rating: 5,
    date: '3 days ago',
    text: {
      fr: "Expérience incroyable à Wing Kite Dakhla Academy ! Un grand merci au Coach Redoine qui est un excellent instructeur — très professionnel, patient et motivant. Il explique tout clairement et rend l'apprentissage du wing foil facile et fun.",
      en: "Amazing experience at Wing Kite Dakhla Academy! A special thanks to Coach Redoine who is an excellent instructor — very professional, patient, and motivating. He explains everything clearly and makes learning wing foiling easy and fun.",
    },
    avatar: 'N',
    color: '#1E5AA8',
  },
  {
    name: 'Luc Deseze',
    rating: 5,
    date: '13 hours ago',
    text: {
      fr: "Merci Darouan pour cette super semaine. Merci pour tes conseils qui m'ont permis de rapidement prendre le feeling du foil. A bientôt !",
      en: "Thanks Darouan for this great week. Thanks for your advice, which allowed me to quickly get a feel for foiling. See you soon!",
    },
    avatar: 'L',
    color: '#E5A423',
  },
]

export function HomeContent() {
  const { t, locale } = useTranslations()
  const { images, texts } = useSiteConfig()
  
  // Map config images to component usage
  const IMGS = {
    hero: images.homeHero || DEFAULT_IMAGES.homeHero,
    wing1: images.homeWing1 || DEFAULT_IMAGES.homeWing1,
    kite1: images.homeKite1 || DEFAULT_IMAGES.homeKite1,
    action: images.homeAction || DEFAULT_IMAGES.homeAction,
    sunset: images.homeSunset || DEFAULT_IMAGES.homeSunset,
    group: images.aboutTeam || DEFAULT_IMAGES.aboutTeam,
    lagoon: images.homeLagoon || DEFAULT_IMAGES.homeLagoon,
  }
  
  // Helper to get localized text
  const getText = (frText: string, enText: string, esText?: string, arText?: string): string => {
    if (locale === 'fr') return frText
    if (locale === 'es') return esText || enText
    if (locale === 'ar') return arText || enText
    return enText
  }

  return (
    <div className="overflow-hidden">

      {/* HERO - Blue gradient with bright, clean design */}
      <section className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-[#3DA5D9] via-[#2B8FBC] to-[#1E5AA8]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <p className="inline-flex items-center gap-2 bg-[#E5A423] text-black text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
                <MapPin className="h-3.5 w-3.5" />
                {getText('Dakhla, Maroc', 'Dakhla, Morocco', 'Dakhla, Marruecos', 'الداخلة، المغرب')}
              </p>
              
              <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                {getText('Apprenez le', 'Learn', 'Aprende', 'تعلم')}
                <br />
                <span className="text-[#E5A423]">Wingfoil</span>
                <br />
                {getText('& Kitesurf', '& Kitesurf', '& Kitesurf', 'و كايت سيرف')}
              </h1>

              <p className="text-white/90 text-lg mb-10 leading-relaxed">
                {getText(
                  'Vivez l\'expérience des sports nautiques à Dakhla. Dans l\'un des meilleurs spots au monde, nous proposons des cours de wingfoil et de kitesurf pour tous les niveaux. Apprenez, progressez et profitez de conditions exceptionnelles dans le lagon.',
                  'Experience water sports in Dakhla. At one of the best spots in the world, we offer wingfoil and kitesurf lessons for all levels. Learn, progress and enjoy exceptional conditions in the lagoon.',
                  'Vive la experiencia de los deportes acuáticos en Dakhla. En uno de los mejores spots del mundo, ofrecemos clases de wingfoil y kitesurf para todos los niveles. Aprende, progresa y disfruta de condiciones excepcionales en la laguna.',
                  'عش تجربة الرياضات المائية في الداخلة. في أحد أفضل الأماكن في العالم، نقدم دروس الوينج فويل والكايت سيرف لجميع المستويات. تعلم وتقدم واستمتع بظروف استثنائية في البحيرة.'
                )}
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#E5A423] hover:bg-[#d4941f] text-black font-bold text-base h-14 px-8 rounded-full shadow-lg transition-all hover:scale-105"
                >
                  <Link href={`/${locale}/pricing`}>
                    {getText('Voir les tarifs', 'View Pricing', 'Ver precios', 'عرض الأسعار')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  className="bg-white/20 backdrop-blur-md text-white font-semibold text-base h-14 px-8 rounded-full border-2 border-white/40 hover:bg-white/30 transition-all hover:scale-105"
                >
                  <Link href={`/${locale}/about`}>
                    {getText('En savoir plus', 'Learn More', 'Saber más', 'تعرف على المزيد')}
                  </Link>
                </Button>
              </div>

              {/* Rating Badge */}
              <div className="mt-10 inline-flex items-center gap-4 bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/25">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#E5A423] text-[#E5A423]" />
                  ))}
                </div>
                <span className="text-white font-bold text-sm">5.0</span>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-96 lg:h-full rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={IMGS.kite1}
                alt="Kitesurf action in Dakhla"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#1E5AA8] py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#E5A423] rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          {[
            { v: '500+', l: getText('Élèves formés', 'Students Trained', 'Estudiantes Formados', 'الطلاب المتدربون') },
            { v: '5.0', l: 'Google Rating' },
            { v: '10+', l: getText('Ans d\'expérience', 'Years Experience', 'Años Experiencia', 'سنوات الخبرة') },
            { v: '300+', l: getText('Jours de vent/an', 'Wind Days/Year', 'Días de viento/año', 'أيام الرياح/السنة') },
          ].map((s, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <div className="text-5xl font-black text-white">{s.v}</div>
              <div className="text-white/70 text-sm mt-2">{s.l}</div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ACTIVITIES - Dynamic Bento Grid */}
      <section className="bg-[#f8f9fb] py-24 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-[#E5A423] font-bold uppercase tracking-widest text-sm mb-4">
              {getText('Nos activités', 'Our Activities', 'Nuestras Actividades', 'أنشطتنا')}
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1a1a2e] mb-6 leading-tight">
              Wingfoil, Kitesurf
              <br />
                <span className="text-[#1E5AA8]">{getText('& Plus encore', '& More', '& Más', '& المزيد')}</span>
            </h2>
            <p className="text-gray-500 text-lg mb-16 max-w-xl">
              {getText(
                'Des cours adaptés à tous les niveaux. Des conseils pour choisir votre hébergement. Des conseils pour vous préparer physiquement. Des photos, des activités... Un séjour de rêve !',
                'Courses adapted to all levels. Tips for choosing your accommodation. Advice to prepare yourself physically. Photos, activities... A dream stay!',
                'Cursos adaptados a todos los niveles. Consejos para elegir tu alojamiento. Consejos para prepararte físicamente. Fotos, actividades... ¡Una estancia de ensueño!',
                'دروس مكيفة لجميع المستويات. نصائح لاختيار إقامتك. نصائح للاستعداد البدني. صور، أنشطة... إقامة الأحلام!'
              )}
            </p>
          </AnimatedSection>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Large Wingfoil Card */}
            <AnimatedSection className="md:col-span-6 md:row-span-2" delay={100}>
              <div className="group relative rounded-3xl overflow-hidden h-full min-h-[500px] cursor-pointer">
                <Image src={IMGS.wing1} alt="Wingfoil Dakhla" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-8">
                  <span className="bg-[#E5A423] text-black text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">Wingfoil</span>
                  <h3 className="text-white text-3xl sm:text-4xl font-black mt-4 mb-3">{t('home.services.wingfoil.title')}</h3>
                  <p className="text-white/80 text-sm leading-relaxed max-w-md">
                    {texts['home.activities.wingfoil.desc'] 
                      ? texts['home.activities.wingfoil.desc'][locale as 'fr' | 'en' | 'es' | 'ar'] || texts['home.activities.wingfoil.desc'].fr
                      : getText(
                        'Le wing foil est un sport de glisse accessible qui procure rapidement des sensations uniques. L\'apprentissage se fait progressivement avec un encadrement adapté aux débutants. En quelques séances, on découvre le plaisir de voler au-dessus de l\'eau. Vous pourrez aussi apprendre à réaliser vos premiers jibes et vos premiers tacks pour gagner en fluidité et en autonomie. Une activité ludique et conviviale, idéale pour apprendre et se faire plaisir sur l\'eau.',
                        'Wing foil is an accessible gliding sport that quickly provides unique sensations. Learning is progressive with coaching adapted for beginners. In just a few sessions, you\'ll discover the joy of flying above the water. You can also learn to perform your first jibes and tacks to gain fluidity and autonomy. A fun and friendly activity, ideal for learning and enjoying the water.',
                        'El wing foil es un deporte de deslizamiento accesible que proporciona sensaciones únicas rápidamente. El aprendizaje es progresivo con entrenamiento adaptado para principiantes. En pocas sesiones, descubrirás el placer de volar sobre el agua. También aprenderás a realizar tus primeros jibes y tacks para ganar fluidez y autonomía. Una actividad divertida y amigable, ideal para aprender y disfrutar del agua.',
                        'وينج فويل رياضة انزلاق سهلة تمنحك أحاسيس فريدة بسرعة. التعلم تدريجي مع تدريب مكيف للمبتدئين. في جلسات قليلة، ستكتشف متعة الطيران فوق الماء. ستتعلم أيضاً تنفيذ أول جايبات وتاكات لاكتساب السلاسة والاستقلالية. نشاط ممتع ومريح، مثالي للتعلم والاستمتاع على الماء.'
                      )}
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Kitesurf Card */}
            <AnimatedSection className="md:col-span-6" delay={200}>
              <div className="group relative rounded-3xl overflow-hidden h-[300px] cursor-pointer">
                <Image src={IMGS.kite1} alt="Kitesurf Dakhla" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-6 w-full">
                  <span className="bg-[#1E5AA8] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">Kitesurf</span>
                  <h3 className="text-white text-2xl font-black mt-3">{t('home.services.kitesurf.title')}</h3>
                  <p className="text-white/80 text-sm leading-relaxed mt-2">
                    {texts['home.activities.kitesurf.desc']
                      ? texts['home.activities.kitesurf.desc'][locale as 'fr' | 'en' | 'es' | 'ar'] || texts['home.activities.kitesurf.desc'].fr
                      : getText(
                        'Le kitesurf est un sport de glisse fun et accessible qui permet de profiter pleinement du vent et de l\'océan. L\'apprentissage se fait étape par étape avec un encadrement sécurisé, adapté aux différents niveaux. En quelques séances, vous pourrez évoluer sur l\'eau en toute confiance. Vous apprendrez aussi à réaliser vos premières transitions, vos premiers sauts, vos perfectionnements en freestyle. Une activité idéale pour se dépasser et se faire plaisir sur l\'eau.',
                        'Kitesurfing is a fun and accessible gliding sport that lets you fully enjoy the wind and ocean. Learning happens step by step with safe coaching adapted to different levels. In just a few sessions, you\'ll be able to ride confidently on the water. You\'ll also learn your first transitions, your first jumps, and improve your freestyle skills. An ideal activity to push yourself and have fun on the water.',
                        'El kitesurf es un deporte de deslizamiento divertido y accesible que te permite disfrutar plenamente del viento y el océano. El aprendizaje se realiza paso a paso con un entrenamiento seguro adaptado a diferentes niveles. En pocas sesiones, podrás navegar con confianza. También aprenderás tus primeras transiciones, tus primeros saltos y mejorarás en freestyle. Una actividad ideal para superarte y disfrutar del agua.',
                        'الكايت سيرف رياضة انزلاق ممتعة وسهلة تتيح لك الاستمتاع الكامل بالرياح والمحيط. التعلم يتم خطوة بخطوة مع تدريب آمن مكيف لمختلف المستويات. في جلسات قليلة، ستتمكن من الركوب بثقة على الماء. ستتعلم أيضاً أول انتقالاتك وقفزاتك وتحسين مهاراتك في الفريستايل. نشاط مثالي لتجاوز حدودك والاستمتاع على الماء.'
                      )}
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Course Coaching Card */}
            <AnimatedSection className="md:col-span-6" delay={300}>
              <div className="group relative rounded-3xl overflow-hidden h-[300px] cursor-pointer">
                <Image src={IMGS.action} alt="Advanced Coaching" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-6 w-full">
                  <span className="bg-[#E5A423] text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">{getText('Coaching', 'Coaching', 'Entrenamiento', 'تدريب')}</span>
                  <h3 className="text-white text-2xl font-black mt-3">{getText('Coaching Avancé', 'Advanced Coaching', 'Coaching Avanzado', 'تدريب متقدم')}</h3>
                  <p className="text-white/80 text-sm leading-relaxed mt-2">
                    {texts['home.activities.coaching.desc']
                      ? texts['home.activities.coaching.desc'][locale as 'fr' | 'en' | 'es' | 'ar'] || texts['home.activities.coaching.desc'].fr
                      : getText(
                        'L\'école propose également des coachings avancés pour les pratiquants souhaitant se perfectionner. Un suivi personnalisé est assuré directement avec un instructeur en Wingfoil et en kitesurf sur l\'eau pour progresser plus vite.',
                        'The school also offers advanced coaching for practitioners looking to improve. Personalized follow-up is provided directly with a Wingfoil and kitesurf instructor on the water to progress faster.',
                        'La escuela también ofrece coaching avanzado para practicantes que desean mejorar. Se proporciona un seguimiento personalizado directamente con un instructor de Wingfoil y kitesurf en el agua para progresar más rápido.',
                        'تقدم المدرسة أيضاً تدريباً متقدماً للممارسين الذين يرغبون في التحسن. يتم توفير متابعة شخصية مباشرة مع مدرب وينج فويل وكايت سيرف على الماء للتقدم بشكل أسرع.'
                      )}
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Lagoon Wide */}
            <AnimatedSection className="md:col-span-12" delay={400}>
              <div className="group relative rounded-3xl overflow-hidden h-[400px] cursor-pointer">
                <Image src={IMGS.lagoon} alt="Dakhla Lagoon" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />
                
                {/* Left Bottom Content */}
                <div className="absolute bottom-0 left-0 p-8 md:p-12">
                  <p className="text-white/70 text-sm mb-2 uppercase tracking-widest">{getText('Le spot parfait', 'The Perfect Spot', 'El Mejor Spot', 'الموقع المثالي')}</p>
                  <h3 className="text-white text-3xl sm:text-4xl font-black">
                    {getText('Le Lagon de Dakhla', 'Dakhla Lagoon', 'Laguna de Dakhla', 'بحيرة الداخلة')}
                  </h3>
                  <p className="text-white/80 mt-3 max-w-md text-sm sm:text-base">
                    {getText('Eaux plates, vent constant, soleil 300 jours par an.', 'Flat water, constant wind, sunshine 300 days a year.', 'Agua plana, viento constante, sol 300 días al año.', 'المياه الهادئة والرياح المستمرة والشمس 300 يوم في السنة.')}
                  </p>
                </div>

                {/* Top Right Description Card */}
                <div className="absolute top-0 right-0 m-6 md:m-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-sm shadow-lg">
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    {getText(
                      'Le lagon offre des conditions idéales pour progresser : un plan d\'eau calme et une orientation de vent particulièrement favorable. Les statistiques de vent sont excellentes durant plusieurs mois de l\'année.',
                      'The lagoon offers ideal conditions for progression: calm flat water and a particularly favorable wind direction. Wind statistics are excellent for several months.',
                      'La laguna ofrece condiciones ideales para progresar: aguas planas y tranquilas con orientación del viento especialmente favorable. Las estadísticas de viento son excelentes durante varios meses.',
                      'توفر البحيرة ظروفاً مثالية للتقدم: مياه هادئة وسلسة واتجاه رياح مواتي بشكل خاص. إحصائيات الرياح ممتازة لعدة أشهر من السنة.'
                    )}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-white py-24 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Images */}
            <AnimatedSection>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <Image src={IMGS.group} alt="Wing Kite instructors" width={600} height={400} className="w-full h-auto object-cover" />
                </div>
                <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white hidden md:block">
                  <Image src={IMGS.action} alt="Kite action" width={200} height={200} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-6 -left-6 bg-[#E5A423] text-black font-black text-4xl p-6 rounded-2xl shadow-xl hidden md:block">
                  10+
                  <span className="block text-sm font-normal">{getText('ans', 'years', 'años', 'سنوات')}</span>
                </div>
              </div>
            </AnimatedSection>

            {/* Right: Content */}
            <div>
              <AnimatedSection>
                <p className="text-[#E5A423] font-bold uppercase tracking-widest text-sm mb-4">
                  {getText('Pourquoi nous choisir', 'Why Choose Us', '¿Por qué elegirnos?', 'لماذا تختارنا')}
                </p>
                <h2 className="text-4xl sm:text-5xl font-black text-[#1a1a2e] mb-8 leading-tight">
                  {getText('L\'excellence au coeur de Dakhla', 'Excellence in the Heart of Dakhla', 'Excelencia en el Corazón de Dakhla', 'التميز في قلب الداخلة')}
                </h2>
              </AnimatedSection>

              <div className="space-y-6">
                {[
                  { 
                    icon: Shield, 
                    title: getText('Instructeurs Certifiés', 'Certified Instructors', 'Instructores Certificados', 'مدربون معتمدون'),
                    desc: getText('Notre équipe passionnée avec 10+ ans d\'expérience vous accompagne dans votre progression en toute sécurité : nous utilisons des radios pour rester en contact permanent pendant les cours.', 'Our passionate team with 10+ years of experience guides your progress safely: we use radios to stay in constant contact during lessons.', 'Nuestro equipo apasionado con 10+ años de experiencia te guía con seguridad: usamos radios para mantenernos en contacto permanente durante las clases.', 'فريقنا الشغوف ذو الخبرة 10+ سنة يرشدك بأمان: نستخدم أجهزة راديو للبقاء على اتصال دائم أثناء الدروس.'),
                    color: '#1E5AA8',
                  },
                  { 
                    icon: Wind, 
                    title: getText('Vent Constant', 'Constant Wind', 'Viento Constante', 'الرياح المستمرة'),
                    desc: getText('300+ jours de vent par an avec des conditions idéales pour l\'apprentissage.', '300+ days of wind per year with ideal learning conditions.', '300+ días de viento al año con condiciones ideales para aprender.', '300+ يوم رياح سنوياً مع ظروف مثالية للتعلم.'),
                    color: '#E5A423',
                  },
                  { 
                    icon: Waves, 
                    title: getText('Lagon Parfait', 'Perfect Lagoon', 'Laguna Perfecta', 'البحيرة المثالية'),
                    desc: getText('Eaux peu profondes et calmes, parfaites pour les débutants comme les experts.', 'Shallow, calm waters perfect for beginners and experts alike.', 'Aguas poco profundas y tranquilas, perfectas para principiantes y expertos.', 'مياه ضحلة وهادئة مثالية للمبتدئين والخبراء.'),
                    color: '#1E5AA8',
                  },
                  { 
                    icon: Users, 
                    title: getText('Petits Groupes', 'Small Groups', 'Grupos Pequeños', 'مجموعات صغيرة'),
                    desc: getText('Attention personnalisée pour une progression optimale et un apprentissage efficace.', 'Personal attention for optimal progress and effective learning.', 'Atención personalizada para un progreso óptimo y aprendizaje efectivo.', 'انتباه شخصي لتقدم أمثل وتعليم فعال.'),
                    color: '#E5A423',
                  },
                ].map(({ icon: Icon, title, desc, color }, i) => (
                  <AnimatedSection key={title} delay={i * 100}>
                    <div className="flex gap-5 items-start group">
                      <div 
                        className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3"
                        style={{ backgroundColor: color }}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-[#1a1a2e] mb-1">{title}</p>
                        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>

              <AnimatedSection delay={400}>
                <Button
                  asChild
                  size="lg"
                  className="mt-10 bg-[#1E5AA8] hover:bg-[#164a8a] text-white font-bold h-14 px-8 rounded-full shadow-lg transition-all hover:scale-105"
                >
                  <Link href={`/${locale}/pricing`}>
                    {getText('Réserver un cours', 'Book a Lesson', 'Reservar una clase', 'احجز درساً')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* GOOGLE REVIEWS */}
      <section className="bg-[#f8f9fb] py-24 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-sm mb-6">
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-bold text-[#1a1a2e]">Google Reviews</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#E5A423] text-[#E5A423]" />
                  ))}
                </div>
                <span className="font-bold">5.0</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-[#1a1a2e] mb-4">
                {getText('Ce que disent nos élèves', 'What Our Students Say', 'Qué dicen nuestros estudiantes', 'ما يقوله طلابنا')}
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                {getText('Découvrez les avis authentiques de nos élèves sur Google.', 'Discover authentic reviews from our students on Google.', 'Descubre las reseñas auténticas de nuestros estudiantes en Google.', 'اكتشف التعليقات الأصلية من طلابنا على Google.')}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {googleReviews.map((review, i) => (
              <AnimatedSection key={review.name} delay={i * 100}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: review.color }}
                    >
                      {review.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-[#1a1a2e]">{review.name}</p>
                      <p className="text-gray-400 text-xs">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-[#E5A423] text-[#E5A423]" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">
                    "{locale === 'fr' || locale === 'es' ? (locale === 'es' ? review.text.en : review.text.fr) : review.text.en}"
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={500}>
            <div className="text-center mt-12">
              <a
                href="https://g.page/r/CYv3UKOLHTcQEBM/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#1a1a2e] font-bold px-8 py-4 rounded-full shadow-sm border border-gray-200 transition-all hover:scale-105"
              >
                <Star className="h-5 w-5 text-[#E5A423]" />
                {getText('Laisser un avis sur Google', 'Leave a Google Review', 'Dejar una reseña en Google', 'Laat een Google-review achter')}
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
