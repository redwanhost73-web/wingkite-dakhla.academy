'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Shield, Heart, TrendingUp, Leaf, Award, Users, ArrowRight } from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'
import { useSiteConfig } from '@/hooks/use-site-config'
import { DEFAULT_IMAGES } from '@/lib/site-config'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'

export function AboutContent() {
  const { locale } = useTranslations()
  const { images: siteImages } = useSiteConfig()

  // Map config images to component usage
  const images = {
    hero: siteImages.aboutHero || DEFAULT_IMAGES.aboutHero,
    story: siteImages.aboutStory || DEFAULT_IMAGES.aboutStory,
    team: siteImages.aboutTeam || DEFAULT_IMAGES.aboutTeam,
    location: siteImages.aboutLocation || DEFAULT_IMAGES.aboutLocation,
    action1: siteImages.aboutAction1 || DEFAULT_IMAGES.aboutAction1,
    action2: siteImages.aboutAction2 || DEFAULT_IMAGES.aboutAction2,
    sunset: siteImages.aboutSunset || DEFAULT_IMAGES.aboutSunset,
  }

  // Helper to get localized text
  const getText = (frText: string, enText: string, esText?: string, arText?: string): string => {
    if (locale === 'fr') return frText
    if (locale === 'es') return esText || enText
    if (locale === 'ar') return arText || enText
    return enText
  }

  const values = [
    {
      icon: Shield,
      title: getText('Sécurité', 'Safety', 'Seguridad', 'Veiligheid'),
      description: getText('Votre sécurité est notre priorité absolue. Équipements certifiés et protocoles stricts : nous utilisons des radios pour rester en contact permanent pendant les cours.', 'Your safety is our top priority. Certified equipment and strict protocols: we use radios to stay in constant contact during lessons.', 'Tu seguridad es nuestra prioridad. Equipo certificado y protocolos estrictos: usamos radios para mantenernos en contacto permanente durante las clases.', 'سلامتك هي أولويتنا القصوى. معدات معتمدة وبروتوكولات صارمة: نستخدم أجهزة راديو للبقاء على اتصال دائم أثناء الدروس.'),
      color: '#0046A4'
    },
    {
      icon: Heart,
      title: getText('Aide à l\'organisation du séjour', 'Trip Organization Help', 'Ayuda con la organización del viaje', 'مساعدة في تنظيم الرحلة'),
      description: getText('Nous pouvons vous conseiller et vous recommander des hébergements selon vos critères, vous aider à organiser votre séjour, location de voiture, activités et photographe.', 'We can advise and recommend accommodations based on your criteria, help you organize your stay, car rental, activities and photographer.', 'Podemos asesorarte y recomendarte alojamientos según tus criterios, ayudarte a organizar tu estancia, alquiler de coche, actividades y fotógrafo.', 'يمكننا تقديم النصائح والتوصية بالإقامة وفقًا لمعاييرك، ومساعدتك في تنظيم إقامتك وتأجير السيارات والأنشطة والمصور.'),
      color: '#C9A66B'
    },
    {
      icon: TrendingUp,
      title: getText('Progression', 'Progress', 'Progreso', 'Voortgang'),
      description: getText('Méthodes pédagogiques éprouvées pour une progression rapide et durable.', 'Proven teaching methods for fast and lasting progress.', 'Métodos de enseñanza probados para un progreso rápido y duradero.', 'طرق تدريس مثبتة للتقدم السريع والدائم.'),
      color: '#0046A4'
    },
    {
      icon: Leaf,
      title: getText('Respect', 'Respect', 'Respeto', 'Respect'),
      description: getText('Respect de l\'environnement et des autres pratiquants sur le spot.', 'Respect for the environment and fellow riders on the spot.', 'Respeto por el medio ambiente y otros practicantes en el spot.', 'احترام البيئة والدراجين الآخرين في الموقع.'),
      color: '#C9A66B'
    },
  ]

  return (
    <main className="overflow-hidden">
      {/* ══ HERO ══ */}
      <PageHero
        image={images.hero}
        eyebrow={getText('À propos', 'About us', 'Sobre nosotros', 'من نحن')}
        title={getText('Notre Histoire', 'Our Story', 'Nuestra Historia', 'قصتنا')}
        subtitle={getText('Passion, expertise et dévouement pour le wingfoil et le kitesurf', 'Passion, expertise and dedication for wingfoil and kitesurf', 'Pasión, experiencia y dedicación por el wingfoil y el kitesurf', 'الشغف والخبرة والتفاني في الوينج فويل والكايت سيرف')}
      />

      {/* ══ TEXT / IMAGE SPLIT ══ Story */}
      <section className="bg-white section-y" data-nav-theme="light">
        <div className="container-narrow">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal direction="right">
              <div className="relative">
                <div className="group relative aspect-4/3 overflow-hidden rounded-[28px] shadow-[0_40px_90px_rgba(0,70,164,0.08)]">
                  <Image
                    src={images.story}
                    alt="Coach Radouan"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                    quality={75}
                    className="img-zoom object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 -right-6 hidden rounded-[24px] bg-[#C9A66B] p-6 text-[#0B1F3B] shadow-[0_25px_60px_rgba(0,70,164,0.10)] md:block animate-float-slow">
                  <Award className="mb-2 h-7 w-7" />
                  <p className="text-small font-bold">
                    {getText('Certifié IKO/VDWS', 'IKO/VDWS Certified', 'Certificado IKO/VDWS', 'معتمد IKO/VDWS')}
                  </p>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <p className="eyebrow text-[#0046A4]">
                  {getText('Notre Mission', 'Our Mission', 'Nuestra Misión', 'مهمتنا')}
                </p>
                <h2 className="font-heading text-section text-[#072A5A] mt-6 text-balance">
                  {getText('Partager notre passion pour le wingfoil et le kitesurf', 'Share our passion for wingfoil and kitesurf', 'Compartir nuestra pasión por el wingfoil y el kitesurf', 'شارك شغفنا بالوينج فويل والكايت سيرف')}
                </h2>
              </Reveal>

              <div className="mt-8 space-y-6 text-body-lg text-[#3D4F6F]">
                <Reveal delay={80}>
                  <p>
                    {getText(
                      'Fondée par Radouan, Wing Kite Dakhla Academy est née d\'une passion profonde pour les sports nautiques et d\'un amour pour le lagon de Dakhla, l\'un des meilleurs spots au monde.',
                      'Founded by Radouan, Wing Kite Dakhla Academy was born from a deep passion for water sports and a love for the Dakhla lagoon, one of the best spots in the world.',
                      'Fundada por Radouan, Wing Kite Dakhla Academy nació de una profunda pasión por los deportes acuáticos y un amor por la laguna de Dakhla, uno de los mejores spots del mundo.',
                      'تأسست من قبل ريدوان، أكاديمية وينج كايت الداخلة من شغف عميق بالرياضات المائية وحب لبحيرة الداخلة، أحد أفضل المواقع في العالم.'
                    )}
                  </p>
                </Reveal>
                <Reveal delay={160}>
                  <p>
                    {getText(
                      'Après des années d\'expérience en tant qu\'instructeur certifié, Radouan a décidé de créer une école qui met l\'accent sur la qualité, la sécurité et surtout le plaisir d\'apprendre.',
                      'After years of experience as a certified instructor, Radouan decided to create a school that emphasizes quality, safety and above all the joy of learning.',
                      'Después de años de experiencia como instructor certificado, Radouan decidió crear una escuela que enfatiza la calidad, la seguridad y sobre todo la alegría de aprender.',
                      'بعد سنوات من الخبرة كمدرب معتمد، قرر ريدوان إنشاء مدرسة تركز على الجودة والسلامة وقبل كل شيء على متعة التعلم.'
                    )}
                  </p>
                </Reveal>
                <Reveal delay={240}>
                  <p>
                    {getText(
                      'Notre équipe partage cette même passion et s\'engage à vous offrir une expérience inoubliable, que vous soyez débutant ou rider confirmé cherchant à progresser.',
                      'Our team shares this same passion and is committed to providing you with an unforgettable experience, whether you are a beginner or an experienced rider looking to progress.',
                      'Nuestro equipo comparte esta misma pasión y se compromete a brindarte una experiencia inolvidable, ya sea principiante o rider experimentado buscando progresar.',
                      'فريقنا يشاركك نفس الشغف والتزام بتقديم تجربة لا تنسى، سواء كنت مبتدئ أو فارس متمرس يسعى للتقدم.'
                    )}
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CARDS ══ Values */}
      <section className="surface-noise relative overflow-hidden bg-[#F6F1E8] section-y" data-nav-theme="light">
        <span aria-hidden className="blob -top-24 left-1/4 h-104 w-104 bg-[#0046A4]/8" />

        <div className="container-narrow relative z-10">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-[#0046A4]">
                {getText('Nos Valeurs', 'Our Values', 'Nuestros Valores', 'قيمنا')}
              </p>
              <h2 className="font-heading text-section text-[#072A5A] mt-6 text-balance">
                {getText('Ce qui nous définit', 'What defines us', 'Qué nos define', 'ما يعرفنا')}
              </h2>
            </div>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {values.map((value, index) => (
              <Reveal key={index} delay={index * 110}>
                <div className="card-premium card-lift h-full p-7">
                  <div
                    className="mb-6 flex h-14 w-14 items-center justify-center rounded-[18px]"
                    style={{ backgroundColor: value.color + '14' }}
                  >
                    <value.icon className="h-6 w-6" style={{ color: value.color }} />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#072A5A]">{value.title}</h3>
                  <p className="text-small text-[#3D4F6F] mt-3">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TEXT / IMAGE SPLIT ══ Team */}
      <section className="bg-white section-y" data-nav-theme="light">
        <div className="container-narrow">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="order-2 lg:order-1">
              <Reveal>
                <p className="eyebrow text-[#0046A4]">
                  {getText('Notre Équipe', 'Our Team', 'Nuestro Equipo', 'فريقنا')}
                </p>
                <h2 className="font-heading text-section text-[#072A5A] mt-6 text-balance">
                  {getText('Des instructeurs passionnés et certifiés', 'Passionate and certified instructors', 'Instructores apasionados y certificados', 'مدربون شغوفون ومعتمدون')}
                </h2>
              </Reveal>

              <div className="mt-8 space-y-6 text-body-lg text-[#3D4F6F]">
                <Reveal delay={80}>
                  <p>
                    {getText(
                      'Notre équipe est composée d\'instructeurs certifiés IKO et VDWS avec plus de 10 ans d\'expérience. Nous parlons français, anglais, espagnol et arabe.',
                      'Our team consists of IKO and VDWS certified instructors with over 10 years of experience. We speak French, English, Spanish and Arabic.',
                      'Nuestro equipo está compuesto por instructores certificados IKO y VDWS con más de 10 años de experiencia. Hablamos francés, inglés, español y árabe.',
                      'يتكون فريقنا من مدربين معتمدين IKO و VDWS بخبرة تزيد عن 10 سنوات. نتحدث الفرنسية والإنجليزية والإسبانية والعربية.'
                    )}
                  </p>
                </Reveal>
                <Reveal delay={160}>
                  <p>
                    {getText(
                      'Chaque instructeur est sélectionné non seulement pour ses compétences techniques, mais aussi pour sa capacité à transmettre sa passion et à créer une atmosphère détendue et conviviale.',
                      'Each instructor is selected not only for their technical skills, but also for their ability to share their passion and create a relaxed and friendly atmosphere.',
                      'Cada instructor es seleccionado no solo por sus habilidades técnicas, sino también por su capacidad de compartir su pasión y crear una atmósfera relajada y amigable.',
                      'يتم اختيار كل مدرب ليس فقط لمهاراته الفنية، بل أيضا لقدرته على مشاركة شغفه وخلق أجواء هادئة وودية.'
                    )}
                  </p>
                </Reveal>
              </div>

              <Reveal delay={240}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <span className="flex items-center gap-2.5 rounded-full border border-[#072A5A]/8 bg-[#FAF8F3] px-5 py-3">
                    <Users className="h-4 w-4 text-[#0046A4]" />
                    <span className="text-small font-semibold text-[#072A5A]">
                      {getText('Petits groupes', 'Small groups', 'Grupos pequeños', 'مجموعات صغيرة')}
                    </span>
                  </span>
                  <span className="flex items-center gap-2.5 rounded-full border border-[#072A5A]/8 bg-[#FAF8F3] px-5 py-3">
                    <Award className="h-4 w-4 text-[#0046A4]" />
                    <span className="text-small font-semibold text-[#072A5A]">
                      {getText('Certifiés IKO/VDWS', 'IKO/VDWS Certified', 'Certificados IKO/VDWS', 'معتمد IKO/VDWS')}
                    </span>
                  </span>
                </div>
              </Reveal>
            </div>

            <Reveal className="order-1 lg:order-2" direction="left">
              <div className="group relative aspect-4/3 overflow-hidden rounded-[28px] shadow-[0_40px_90px_rgba(0,70,164,0.08)]">
                <Image
                  src={images.team}
                  alt="Team"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  quality={75}
                  className="img-zoom object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ CLOSING CTA ══ */}
      <section className="relative overflow-hidden bg-[#FAF8F3] section-y-sm" data-nav-theme="light">
        <div className="container-editorial">
          <Reveal>
            <div className="group relative overflow-hidden rounded-[28px] shadow-[0_40px_90px_rgba(0,70,164,0.08)]">
              <Image
                src={images.action2}
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
                    'linear-gradient(105deg, rgba(7,42,90,.88), rgba(0,70,164,.60) 55%, rgba(90,168,255,.20))',
                }}
              />
              <div className="relative z-10 px-8 py-16 text-center sm:px-14 sm:py-24">
                <div className="mx-auto max-w-2xl">
                  <h2 className="font-heading text-display-sm text-white text-balance">
                    {getText('Prêt à nous rejoindre?', 'Ready to join us?', '¿Listo para unirnos?', 'هل أنت مستعد للانضمام إلينا؟')}
                  </h2>
                  <p className="text-body-lg text-white/80 mt-6">
                    {getText('Réservez votre cours et vivez une expérience inoubliable à Dakhla.', 'Book your lesson and live an unforgettable experience in Dakhla.', 'Reserva tu clase y vive una experiencia inolvidable en Dakhla.', 'احجز درسك واعيش تجربة لا تنسى في الداخلة.')}
                  </p>
                  <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                      href={`/${locale}/pricing`}
                      className="group/cta btn-pill w-full bg-[#C9A66B] text-[#0B1F3B] hover:bg-[#C9A66B] sm:w-auto"
                    >
                      {getText('Voir les tarifs', 'View pricing', 'Ver precios', 'عرض الأسعار')}
                      <ArrowRight className="h-4 w-4 transition-transform duration-400 group-hover/cta:translate-x-1" />
                    </Link>
                    <Link
                      href={`/${locale}/contact`}
                      className="btn-pill btn-outline-light w-full shadow-none sm:w-auto"
                    >
                      {getText('Nous contacter', 'Contact us', 'Contáctanos', 'اتصل بنا')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
