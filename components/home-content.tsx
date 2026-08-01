'use client'

import { useTranslations } from '@/lib/i18n-context'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Wind, Waves, Star, Shield, Users, MapPin } from 'lucide-react'
import { useSiteConfig } from '@/hooks/use-site-config'
import { PackagesSection } from '@/components/packages-section'
import { LogoMarquee } from '@/components/logo-marquee'
import { ActivityCard } from '@/components/activity-card'
import { ActivityStoryProvider } from '@/components/activity-story'
import { Reveal } from '@/components/reveal'
import { ACTIVITIES } from '@/lib/activities'
import { DEFAULT_IMAGES } from '@/lib/site-config'

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
    color: '#0046A4',
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
    color: '#C9A66B',
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
    color: '#0046A4',
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
    color: '#C9A66B',
  },
]

export function HomeContent() {
  const { locale } = useTranslations()
  const { images, texts } = useSiteConfig()

  // Map config images to component usage
  const IMGS = {
    hero: images.homeHero || DEFAULT_IMAGES.homeHero,
    wing1: images.homeWing1 || DEFAULT_IMAGES.homeWing1,
    kite1: images.homeKite1 || DEFAULT_IMAGES.homeKite1,
    action: images.homeAction || DEFAULT_IMAGES.homeAction,
    sunset: images.homeSunset || DEFAULT_IMAGES.homeSunset,
    group: '/sections/why-choose-us.jpeg',
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
    <ActivityStoryProvider>
    <div className="overflow-hidden">

      {/* ══ HERO ══ Cinematic full-viewport plate */}
      <section className="relative min-h-svh flex flex-col justify-end overflow-hidden bg-[#0B1F3B]" data-nav-theme="dark">
        {/* Wrapper carries the drift so object-cover stays intact */}
        <div className="absolute inset-0 animate-ken-burns">
          <Image
            src={IMGS.hero}
            alt={getText('Lagon de Dakhla', 'Dakhla lagoon', 'Laguna de Dakhla', 'بحيرة الداخلة')}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={70}
            className="object-cover"
          />
        </div>

        {/* Overlay 1 — blue atmospheric ramp */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(7,42,90,.70), rgba(7,42,90,.30) 35%, rgba(0,70,164,.15) 65%, transparent)',
          }}
        />
        {/* Overlay 2 — soft sky vignette */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at center, transparent 30%, rgba(7,42,90,.35) 100%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(circle at top right, rgba(90,168,255,.25), transparent 55%)',
          }}
        />

        <div className="container-editorial relative z-10 pt-36 pb-16 sm:pb-20">
          <div className="max-w-3xl">
            <Reveal delay={100} duration={800}>
              <p className="glass-panel eyebrow inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-white/90">
                <MapPin className="h-3.5 w-3.5 text-[#C9A66B]" />
                {getText('Dakhla, Maroc', 'Dakhla, Morocco', 'Dakhla, Marruecos', 'الداخلة، المغرب')}
              </p>
            </Reveal>

            <Reveal delay={220} duration={900}>
              <h1 className="font-heading text-display text-white mt-8 text-balance">
                {getText('Apprenez le Wingfoil.', 'Learn to Wingfoil.', 'Aprende Wingfoil.', 'تعلّم الوينج فويل.')}
                <br />
                <span className="text-white/55">
                  {getText('Vivez le lagon.', 'Live the lagoon.', 'Vive la laguna.', 'عِش تجربة البحيرة.')}
                </span>
              </h1>
            </Reveal>

            <Reveal delay={340} duration={900}>
              <p className="text-body-lg text-white/80 max-w-xl mt-8">
                {getText(
                  'Cours de wingfoil et de kitesurf pour tous les niveaux, encadrés par des instructeurs certifiés IKO, dans l\'un des meilleurs spots au monde.',
                  'Wingfoil and kitesurf lessons for all levels, taught by IKO-certified instructors, at one of the best spots in the world.',
                  'Clases de wingfoil y kitesurf para todos los niveles, con instructores certificados IKO, en uno de los mejores spots del mundo.',
                  'دروس الوينج فويل والكايت سيرف لجميع المستويات، مع مدربين معتمدين من IKO، في أحد أفضل المواقع في العالم.'
                )}
              </p>
            </Reveal>

            <Reveal delay={460} duration={900}>
              <div className="flex flex-wrap items-center gap-4 mt-11">
                <Link
                  href={`/${locale}/pricing`}
                  className="group btn-pill bg-white text-[#0B1F3B] hover:bg-white"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0046A4]" />
                  {getText('Explorer nos cours', 'Explore our lessons', 'Explora nuestros cursos', 'استكشف دروسنا')}
                  <ArrowRight className="h-4 w-4 transition-transform duration-400 group-hover:translate-x-1" />
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="btn-pill btn-outline-light shadow-none"
                >
                  {getText('Nous contacter', 'Get in touch', 'Contáctanos', 'اتصل بنا')}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Scroll affordance */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 z-10 hidden sm:block"
        >
          <span className="block h-14 w-px overflow-hidden bg-white/20">
            <span className="block h-full w-full animate-scroll-hint bg-linear-to-b from-transparent via-white to-transparent" />
          </span>
        </div>
      </section>

      {/* ══ PARTNERS ══ */}
      <LogoMarquee />

      {/* ══ OFFERS ══ */}
      <PackagesSection />

      {/* ══ ACTIVITIES ══ Editorial bento */}
      <section className="surface-noise relative bg-[#F6F1E8] section-y" data-nav-theme="light">
        <span aria-hidden className="blob -top-24 -left-32 h-104 w-104 bg-[#0046A4]/8" />
        <span aria-hidden className="blob top-1/3 -right-40 h-120 w-120 bg-[#5AA8FF]/8" />

        <div className="container-editorial relative z-10">
          <div className="max-w-3xl">
            <Reveal>
              <p className="eyebrow text-[#0046A4]">
                {getText('Nos activités', 'Our Activities', 'Nuestras Actividades', 'أنشطتنا')}
              </p>
            </Reveal>
            <Reveal delay={90}>
              <h2 className="font-heading text-section text-[#0046A4] mt-6 text-balance">
                Wingfoil, Kitesurf
                <br />
                <span className="text-[#0057D1]">{getText('& Plus encore', '& More', '& Más', '& المزيد')}</span>
              </h2>
            </Reveal>
            <Reveal delay={170}>
              <p className="text-body-lg text-[#3D4F6F] mt-7">
                {getText(
                  'Des cours adaptés à tous les niveaux. Des conseils pour choisir votre hébergement. Des conseils pour vous préparer physiquement. Des photos, des activités... Un séjour de rêve !',
                  'Courses adapted to all levels. Tips for choosing your accommodation. Advice to prepare yourself physically. Photos, activities... A dream stay!',
                  'Cursos adaptados a todos los niveles. Consejos para elegir tu alojamiento. Consejos para prepararte físicamente. Fotos, actividades... ¡Una estancia de ensueño!',
                  'دروس مكيفة لجميع المستويات. نصائح لاختيار إقامتك. نصائح للاستعداد البدني. صور، أنشطة... إقامة الأحلام!'
                )}
              </p>
            </Reveal>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 mt-16 lg:mt-20">
            {ACTIVITIES.map((activity, i) => (
              <Reveal key={activity.id} className={activity.className} delay={i * 110}>
                <ActivityCard activity={activity} locale={locale} />
              </Reveal>
            ))}

            {/* Course Coaching Card */}
            <Reveal className="md:col-span-6" delay={300}>
              <Link
                href={`/${locale}/pricing`}
                prefetch
                className="group card-lift relative block h-85 overflow-hidden rounded-[28px] shadow-[0_25px_60px_rgba(0,70,164,0.10)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0046A4]"
              >
                <Image
                  src={IMGS.action}
                  alt="Advanced Coaching"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  quality={72}
                  className="img-zoom object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(7,42,90,.88), rgba(0,70,164,.25) 55%, transparent)',
                  }}
                />
                <div className="absolute bottom-0 w-full p-8 sm:p-10">
                  <span className="eyebrow rounded-full bg-[#B8925A] px-3.5 py-1.5 text-[0.7rem] text-white">
                    {getText('Coaching', 'Coaching', 'Entrenamiento', 'تدريب')}
                  </span>
                  <h3 className="font-heading text-card-title text-white mt-4">
                    {getText('Coaching Avancé', 'Advanced Coaching', 'Coaching Avanzado', 'تدريب متقدم')}
                  </h3>
                  <p className="text-small text-white/75 mt-2.5 line-clamp-4">
                    {texts['home.activities.coaching.desc']
                      ? texts['home.activities.coaching.desc'][locale as 'fr' | 'en' | 'es' | 'ar'] || texts['home.activities.coaching.desc'].fr
                      : getText(
                        'L\'école propose également des coachings avancés pour les pratiquants souhaitant se perfectionner. Un suivi personnalisé est assuré directement avec un instructeur en Wingfoil et en kitesurf sur l\'eau pour progresser plus vite.',
                        'The school also offers advanced coaching for practitioners looking to improve. Personalized follow-up is provided directly with a Wingfoil and kitesurf instructor on the water to progress faster.',
                        'La escuela también ofrece coaching avanzado para practicantes que desean mejorar. Se proporciona un seguimiento personalizado directamente con un instructor de Wingfoil y kitesurf en el agua para progresar más rápido.',
                        'تقدم المدرسة أيضاً تدريباً متقدماً للممارسين الذين يرغبون في التحسن. يتم توفير متابعة شخصية مباشرة مع مدرب وينج فويل وكايت سيرف على الماء للتقدم بشكل أسرع.'
                      )}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-white/60 transition-colors duration-[450ms] group-hover:text-white">
                    {getText('Voir les tarifs', 'View pricing', 'Ver precios', 'عرض الأسعار')}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-[450ms] group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>

            {/* ══ LARGE IMAGE ══ Lagoon, full width */}
            <Reveal className="md:col-span-12" delay={380}>
              <div className="group relative h-115 sm:h-130 overflow-hidden rounded-[28px] shadow-[0_40px_90px_rgba(0,70,164,0.08)]">
                <Image
                  src={IMGS.lagoon}
                  alt="Dakhla Lagoon"
                  fill
                  sizes="100vw"
                  loading="lazy"
                  quality={78}
                  className="img-zoom object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(7,42,90,.78), rgba(0,70,164,.12) 45%, rgba(7,42,90,.40))',
                  }}
                />

                {/* Left Bottom Content */}
                <div className="absolute bottom-0 left-0 p-9 md:p-14 max-w-xl">
                  <p className="eyebrow text-white/65">
                    {getText('Le spot parfait', 'The Perfect Spot', 'El Mejor Spot', 'الموقع المثالي')}
                  </p>
                  <h3 className="font-heading text-display-sm text-white mt-4">
                    {getText('Le Lagon de Dakhla', 'Dakhla Lagoon', 'Laguna de Dakhla', 'بحيرة الداخلة')}
                  </h3>
                  <p className="text-body-lg text-white/80 mt-4">
                    {getText('Eaux plates, vent constant, soleil presque toute l\'année.', 'Flat water, constant wind, sunshine almost year-round.', 'Agua plana, viento constante, sol casi todo el año.', 'مياه هادئة ورياح مستمرة وشمس معظم أيام السنة.')}
                  </p>
                </div>

                {/* Top Right Description Card */}
                <div className="absolute top-0 right-0 m-6 md:m-9 max-w-sm rounded-3xl border border-white/18 bg-white/10 p-7 backdrop-blur-[20px] backdrop-saturate-150 shadow-[0_25px_60px_rgba(0,70,164,0.10)] hidden sm:block">
                  <p className="text-small leading-relaxed text-white/90">
                    {getText(
                      'Le lagon offre des conditions idéales pour progresser : un plan d\'eau calme et une orientation de vent particulièrement favorable. Les statistiques de vent sont excellentes durant plusieurs mois de l\'année.',
                      'The lagoon offers ideal conditions for progression: calm flat water and a particularly favorable wind direction. Wind statistics are excellent for several months.',
                      'La laguna ofrece condiciones ideales para progresar: aguas planas y tranquilas con orientación del viento especialmente favorable. Las estadísticas de viento son excelentes durante varios meses.',
                      'توفر البحيرة ظروفاً مثالية للتقدم: مياه هادئة وسلسة واتجاه رياح مواتي بشكل خاص. إحصائيات الرياح ممتازة لعدة أشهر من السنة.'
                    )}
                  </p>
                </div>

                {/* Same copy, stacked below the heading on phones */}
                <div className="sm:hidden absolute inset-x-0 top-0 p-8">
                  <p className="text-small leading-relaxed text-white/85 rounded-[20px] border border-white/18 bg-white/10 p-5 backdrop-blur-[20px]">
                    {getText(
                      'Le lagon offre des conditions idéales pour progresser : un plan d\'eau calme et une orientation de vent particulièrement favorable.',
                      'The lagoon offers ideal conditions for progression: calm flat water and a particularly favorable wind direction.',
                      'La laguna ofrece condiciones ideales para progresar: aguas planas y tranquilas con orientación del viento especialmente favorable.',
                      'توفر البحيرة ظروفاً مثالية للتقدم: مياه هادئة وسلسة واتجاه رياح مواتي بشكل خاص.'
                    )}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ TEXT / IMAGE SPLIT ══ Why choose us */}
      <section className="relative bg-white section-y" data-nav-theme="light">
        <div className="container-editorial">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center">
            {/* Left: Images */}
            <Reveal direction="right">
              <div className="relative">
                <div className="overflow-hidden rounded-[28px] shadow-[0_40px_90px_rgba(0,70,164,0.08)]">
                  <Image
                    src={IMGS.group}
                    alt={getText('Pourquoi nous choisir', 'Why choose us', 'Por qué elegirnos', 'لماذا تختارنا')}
                    width={600}
                    height={400}
                    sizes="(max-width: 1024px) 100vw, 600px"
                    loading="lazy"
                    quality={75}
                    className="h-auto w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-10 -right-8 hidden h-52 w-52 overflow-hidden rounded-3xl border-[6px] border-white shadow-[0_25px_60px_rgba(0,70,164,0.10)] md:block animate-float-slow">
                  <Image
                    src={IMGS.action}
                    alt="Kite action"
                    width={240}
                    height={240}
                    sizes="240px"
                    loading="lazy"
                    quality={72}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>

            {/* Right: Content */}
            <div>
              <Reveal>
                <p className="eyebrow text-[#0046A4]">
                  {getText('Pourquoi nous choisir', 'Why Choose Us', '¿Por qué elegirnos?', 'لماذا تختارنا')}
                </p>
                <h2 className="font-heading text-section text-[#072A5A] mt-6 text-balance">
                  {getText('L\'excellence au coeur de Dakhla', 'Excellence in the Heart of Dakhla', 'Excelencia en el Corazón de Dakhla', 'التميز في قلب الداخلة')}
                </h2>
              </Reveal>

              <div className="mt-12 space-y-2">
                {[
                  {
                    icon: Shield,
                    title: getText('Instructeurs Certifiés', 'Certified Instructors', 'Instructores Certificados', 'مدربون معتمدون'),
                    desc: getText('Notre équipe passionnée d\'instructeurs certifiés vous accompagne dans votre progression en toute sécurité : nous utilisons des radios pour rester en contact permanent pendant les cours.', 'Our passionate team of certified instructors guides your progress safely: we use radios to stay in constant contact during lessons.', 'Nuestro equipo apasionado de instructores certificados te guía con seguridad: usamos radios para mantenernos en contacto permanente durante las clases.', 'فريقنا الشغوف من المدربين المعتمدين يرشدك بأمان: نستخدم أجهزة راديو للبقاء على اتصال دائم أثناء الدروس.'),
                    color: '#0046A4',
                  },
                  {
                    icon: Wind,
                    title: getText('Vent Constant', 'Constant Wind', 'Viento Constante', 'الرياح المستمرة'),
                    desc: getText('Vent régulier presque toute l\'année avec des conditions idéales pour l\'apprentissage.', 'Steady wind almost year-round with ideal learning conditions.', 'Viento constante casi todo el año con condiciones ideales para aprender.', 'رياح منتظمة طوال معظم أيام السنة مع ظروف مثالية للتعلم.'),
                    color: '#C9A66B',
                  },
                  {
                    icon: Waves,
                    title: getText('Lagon Parfait', 'Perfect Lagoon', 'Laguna Perfecta', 'البحيرة المثالية'),
                    desc: getText('Eaux peu profondes et calmes, parfaites pour les débutants comme les experts.', 'Shallow, calm waters perfect for beginners and experts alike.', 'Aguas poco profundas y tranquilas, perfectas para principiantes y expertos.', 'مياه ضحلة وهادئة مثالية للمبتدئين والخبراء.'),
                    color: '#0046A4',
                  },
                  {
                    icon: Users,
                    title: getText('Petits Groupes', 'Small Groups', 'Grupos Pequeños', 'مجموعات صغيرة'),
                    desc: getText('Attention personnalisée pour une progression optimale et un apprentissage efficace.', 'Personal attention for optimal progress and effective learning.', 'Atención personalizada para un progreso óptimo y aprendizaje efectivo.', 'انتباه شخصي لتقدم أمثل وتعليم فعال.'),
                    color: '#C9A66B',
                  },
                ].map(({ icon: Icon, title, desc, color }, i) => (
                  <Reveal key={title} delay={i * 110}>
                    <div className="group flex items-start gap-5 rounded-[20px] px-4 py-5 transition-colors duration-450 hover:bg-[#FAF8F3]">
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] shadow-[0_10px_30px_rgba(0,70,164,0.08)] transition-transform duration-450 group-hover:-translate-y-1 group-hover:scale-105"
                        style={{ backgroundColor: color }}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="pt-1">
                        <p className="font-heading text-lg font-bold text-[#072A5A]">{title}</p>
                        <p className="text-small text-[#3D4F6F] mt-1.5">{desc}</p>
                      </div>
                    </div>
                    {i < 3 && <hr className="hairline mx-4" />}
                  </Reveal>
                ))}
              </div>

              <Reveal delay={420}>
                <Link
                  href={`/${locale}/pricing`}
                  className="group btn-pill mt-12 bg-[#0046A4] text-white hover:bg-[#0057D1] shadow-[0_10px_30px_rgba(0,70,164,0.25)]"
                >
                  {getText('Réserver un cours', 'Book a Lesson', 'Reservar una clase', 'احجز درساً')}
                  <ArrowRight className="h-5 w-5 transition-transform duration-400 group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══ DARK SECTION ══ Testimonials */}
      <section className="surface-noise relative overflow-hidden bg-[#0B1F3B] section-y" data-nav-theme="dark">
        <span aria-hidden className="blob -top-32 left-1/4 h-128 w-128 bg-[#0046A4]/25" />
        <span aria-hidden className="blob -bottom-40 right-0 h-112 w-112 bg-[#5AA8FF]/12" />

        <div className="container-editorial relative z-10">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <div className="glass-panel mb-8 inline-flex items-center gap-3 rounded-full px-6 py-3">
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-small font-semibold text-white">Google Reviews</span>
                <span aria-hidden className="h-4 w-px bg-white/20" />
                <span className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#C9A66B] text-[#C9A66B]" />
                  ))}
                </span>
              </div>
              <h2 className="font-heading text-section text-white text-balance">
                {getText('Ce que disent nos élèves', 'What Our Students Say', 'Qué dicen nuestros estudiantes', 'ما يقوله طلابنا')}
              </h2>
              <p className="text-body-lg text-white/65 mt-6">
                {getText('Découvrez les avis authentiques de nos élèves sur Google.', 'Discover authentic reviews from our students on Google.', 'Descubre las reseñas auténticas de nuestros estudiantes en Google.', 'اكتشف التعليقات الأصلية من طلابنا على Google.')}
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {googleReviews.map((review, i) => (
              <Reveal key={review.name} delay={i * 110}>
                <figure className="card-premium-dark card-lift flex h-full flex-col p-7">
                  <span className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-[#C9A66B] text-[#C9A66B]" />
                    ))}
                  </span>
                  <blockquote className="text-small flex-1 leading-relaxed text-white/80 mt-5">
                    “{locale === 'fr' || locale === 'es' ? (locale === 'es' ? review.text.en : review.text.fr) : review.text.en}”
                  </blockquote>
                  <hr className="hairline-light my-6" />
                  <figcaption className="flex items-center gap-3.5">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-full text-base font-bold text-white"
                      style={{ backgroundColor: review.color }}
                    >
                      {review.avatar}
                    </span>
                    <span>
                      <span className="block font-semibold text-white">{review.name}</span>
                      <span className="block text-xs text-white/45">{review.date}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal delay={480}>
            <div className="mt-14 text-center">
              <a
                href="https://g.page/r/CYv3UKOLHTcQEBM/review"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill btn-outline-light text-small shadow-none"
              >
                <Star className="h-4 w-4 text-[#C9A66B]" />
                {getText('Laisser un avis sur Google', 'Leave a Google Review', 'Dejar una reseña en Google', 'Laat een Google-review achter')}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ CLOSING CTA ══ */}
      <section className="relative overflow-hidden bg-[#FAF8F3] section-y-sm" data-nav-theme="light">
        <div className="container-editorial">
          <Reveal>
            <div className="group relative overflow-hidden rounded-[28px] shadow-[0_40px_90px_rgba(0,70,164,0.08)]">
              <Image
                src={IMGS.sunset}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 1440px) 100vw, 1440px"
                loading="lazy"
                quality={75}
                className="img-zoom object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(105deg, rgba(7,42,90,.86), rgba(0,70,164,.55) 55%, rgba(90,168,255,.18))',
                }}
              />
              <div className="relative z-10 px-8 py-16 sm:px-14 sm:py-24 lg:px-20">
                <div className="max-w-2xl">
                  <p className="eyebrow text-[#C9A66B]">
                    {getText('Prêt à décoller', 'Ready to fly', 'Listo para despegar', 'مستعد للانطلاق')}
                  </p>
                  <h2 className="font-heading text-display-sm text-white mt-6 text-balance">
                    {getText('Votre première session vous attend.', 'Your first session is waiting.', 'Tu primera sesión te espera.', 'جلستك الأولى تنتظرك.')}
                  </h2>
                  <div className="mt-10 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/${locale}/contact`}
                      className="group/cta btn-pill bg-white text-[#0B1F3B] hover:bg-white"
                    >
                      {getText('Nous contacter', 'Get in touch', 'Contáctanos', 'اتصل بنا')}
                      <ArrowRight className="h-4 w-4 transition-transform duration-400 group-hover/cta:translate-x-1" />
                    </Link>
                    <Link href={`/${locale}/pricing`} className="btn-pill btn-outline-light shadow-none">
                      {getText('Voir les tarifs', 'View pricing', 'Ver precios', 'عرض الأسعار')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
    </ActivityStoryProvider>
  )
}
