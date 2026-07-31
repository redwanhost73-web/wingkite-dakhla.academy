'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Shield, Heart, TrendingUp, Leaf, Award, Users, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/lib/i18n-context'
import { useSiteConfig } from '@/hooks/use-site-config'
import { DEFAULT_IMAGES } from '@/lib/site-config'

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
      color: '#1E5AA8'
    },
    { 
      icon: Heart, 
      title: getText('Aide à l\'organisation du séjour', 'Trip Organization Help', 'Ayuda con la organización del viaje', 'مساعدة في تنظيم الرحلة'),
      description: getText('Nous pouvons vous conseiller et vous recommander des hébergements selon vos critères, vous aider à organiser votre séjour, location de voiture, activités et photographe.', 'We can advise and recommend accommodations based on your criteria, help you organize your stay, car rental, activities and photographer.', 'Podemos asesorarte y recomendarte alojamientos según tus criterios, ayudarte a organizar tu estancia, alquiler de coche, actividades y fotógrafo.', 'يمكننا تقديم النصائح والتوصية بالإقامة وفقًا لمعاييرك، ومساعدتك في تنظيم إقامتك وتأجير السيارات والأنشطة والمصور.'),
      color: '#E5A423'
    },
    { 
      icon: TrendingUp, 
      title: getText('Progression', 'Progress', 'Progreso', 'Voortgang'),
      description: getText('Méthodes pédagogiques éprouvées pour une progression rapide et durable.', 'Proven teaching methods for fast and lasting progress.', 'Métodos de enseñanza probados para un progreso rápido y duradero.', 'طرق تدريس مثبتة للتقدم السريع والدائم.'),
      color: '#1E5AA8'
    },
    { 
      icon: Leaf, 
      title: getText('Respect', 'Respect', 'Respeto', 'Respect'),
      description: getText('Respect de l\'environnement et des autres pratiquants sur le spot.', 'Respect for the environment and fellow riders on the spot.', 'Respeto por el medio ambiente y otros practicantes en el spot.', 'احترام البيئة والدراجين الآخرين في الموقع.'),
      color: '#E5A423'
    },
  ]

  const stats = [
    { value: '10+', label: getText('Années d\'expérience', 'Years Experience', 'Años Experiencia', 'سنوات الخبرة') },
    { value: '500+', label: getText('Élèves formés', 'Students Trained', 'Estudiantes Formados', 'الطلاب المتدربون') },
    { value: '98%', label: getText('Satisfaction client', 'Client Satisfaction', 'Satisfacción del Cliente', 'رضا العملاء') },
    { value: '5.0', label: getText('Note Google', 'Google Rating', 'Calificación Google', 'تقييم جوجل') },
  ]

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px]">
        <Image
          src={images.hero}
          alt="Wing Kite Dakhla Academy"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              {getText('Notre Histoire', 'Our Story', 'Nuestra Historia', 'قصتنا')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              {getText('Passion, expertise et dévouement depuis plus de 10 ans', 'Passion, expertise and dedication for over 10 years', 'Pasión, experiencia y dedicación durante más de 10 años', 'الشغف والخبرة والتفاني منذ أكثر من 10 سنوات')}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="bg-[#1E5AA8] py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-white mb-1">{stat.value}</div>
                <p className="text-white/80 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image src={images.story} alt="Coach Radouan" fill className="object-cover" />
              </div>
                <div className="absolute -bottom-6 -right-6 bg-[#E5A423] text-white p-6 rounded-2xl shadow-xl hidden md:block">
                <Award className="h-8 w-8 mb-2" />
                <p className="font-bold">{getText('Certifié IKO/VDWS', 'IKO/VDWS Certified', 'Certificado IKO/VDWS', 'معتمد IKO/VDWS')}</p>
              </div>
            </div>
            <div>
              <span className="text-[#E5A423] font-bold text-sm uppercase tracking-wider">
                {getText('Notre Mission', 'Our Mission', 'Nuestra Misión', 'مهمتنا')}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#1a1a2e] mt-2 mb-6">
                {getText('Partager notre passion pour le wingfoil et le kitesurf', 'Share our passion for wingfoil and kitesurf', 'Compartir nuestra pasión por el wingfoil y el kitesurf', 'شارك شغفنا بالوينج فويل والكايت سيرف')}
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  {getText(
              'Fondée par Radouan, Wing Kite Dakhla Academy est née d\'une passion profonde pour les sports nautiques et d\'un amour pour le lagon de Dakhla, l\'un des meilleurs spots au monde.',
              'Founded by Radouan, Wing Kite Dakhla Academy was born from a deep passion for water sports and a love for the Dakhla lagoon, one of the best spots in the world.',
              'Fundada por Radouan, Wing Kite Dakhla Academy nació de una profunda pasión por los deportes acuáticos y un amor por la laguna de Dakhla, uno de los mejores spots del mundo.',
                    'تأسست من قبل ريدوان، أكاديمية وينج كايت الداخلة من شغف عميق بالرياضات المائية وحب لبحيرة الداخلة، أحد أفضل المواقع في العالم.'
                  )}
                </p>
                <p>
                  {getText(
              'Après des années d\'expérience en tant qu\'instructeur certifié, Radouan a décidé de créer une école qui met l\'accent sur la qualité, la sécurité et surtout le plaisir d\'apprendre.',
              'After years of experience as a certified instructor, Radouan decided to create a school that emphasizes quality, safety and above all the joy of learning.',
              'Después de años de experiencia como instructor certificado, Radouan decidió crear una escuela que enfatiza la calidad, la seguridad y sobre todo la alegría de aprender.',
                    'بعد سنوات من الخبرة كمدرب معتمد، ��رر ريدوان إنشاء مدرسة ��ركز على الجودة والسلامة وقبل كل شيء على متعة التعلم.'
                  )}
                </p>
                <p>
                  {getText(
                    'Notre équipe partage cette même passion et s\'engage à vous offrir une expérience inoubliable, que vous soyez débutant ou rider confirmé cherchant à progresser.',
                    'Our team shares this same passion and is committed to providing you with an unforgettable experience, whether you are a beginner or an experienced rider looking to progress.',
                    'Nuestro equipo comparte esta misma pasión y se compromete a brindarte una experiencia inolvidable, ya sea principiante o rider experimentado buscando progresar.',
                    'فريقنا يشاركك نفس الشغف والتزام بتقديم تجربة لا تنسى، سواء كنت مبتدئ أو فارس متمرس يسعى للتقدم.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#E5A423] font-bold text-sm uppercase tracking-wider">
              {getText('Nos Valeurs', 'Our Values', 'Nuestros Valores', 'قيمنا')}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1a1a2e] mt-2">
              {getText('Ce qui nous définit', 'What defines us', 'Qué nos define', 'ما يعرفنا')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: value.color + '15' }}
                >
                  <value.icon className="h-7 w-7" style={{ color: value.color }} />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-[#E5A423] font-bold text-sm uppercase tracking-wider">
                {getText('Notre Équipe', 'Our Team', 'Nuestro Equipo', 'فريقنا')}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#1a1a2e] mt-2 mb-6">
                {getText('Des instructeurs passionnés et certifiés', 'Passionate and certified instructors', 'Instructores apasionados y certificados', 'مدربون شغوفون ومعتمدون')}
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed mb-8">
                <p>
                  {getText(
                    'Notre équipe est composée d\'instructeurs certifiés IKO et VDWS avec plus de 10 ans d\'expérience. Nous parlons français, anglais, espagnol et arabe.',
                    'Our team consists of IKO and VDWS certified instructors with over 10 years of experience. We speak French, English, Spanish and Arabic.',
                    'Nuestro equipo está compuesto por instructores certificados IKO y VDWS con más de 10 años de experiencia. Hablamos francés, inglés, español y árabe.',
                    'يتكون فريقنا من مدربين معتمدين IKO و VDWS بخبرة تزيد عن 10 سنوات. نتحدث الفرنسية والإنجليزية والإسبانية والعربية.'
                  )}
                </p>
                <p>
                  {getText(
                    'Chaque instructeur est sélectionné non seulement pour ses compétences techniques, mais aussi pour sa capacité à transmettre sa passion et à créer une atmosphère détendue et conviviale.',
                    'Each instructor is selected not only for their technical skills, but also for their ability to share their passion and create a relaxed and friendly atmosphere.',
                    'Cada instructor es seleccionado no solo por sus habilidades técnicas, sino también por su capacidad de compartir su pasión y crear una atmósfera relajada y amigable.',
                    'يتم اختيار كل مدرب ليس فقط لمهاراته الفنية، بل أيضا لقدرته على مشاركة شغفه وخلق أجواء هادئة وودية.'
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
                  <Users className="h-5 w-5 text-[#1E5AA8]" />
                  <span className="text-sm font-medium">{getText('Petits groupes', 'Small groups', 'Grupos pequeños', 'مجموعات صغيرة')}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
                  <Award className="h-5 w-5 text-[#1E5AA8]" />
                  <span className="text-sm font-medium">{getText('Certifiés IKO/VDWS', 'IKO/VDWS Certified', 'Certificados IKO/VDWS', 'معتمد IKO/VDWS')}</span>
                </div>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image src={images.team} alt="Team" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <Image src={images.action2} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-[#1E5AA8]/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            {getText('Prêt à nous rejoindre?', 'Ready to join us?', '¿Listo para unirnos?', 'هل أنت مستعد للانضمام إلينا؟')}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {getText('Réservez votre cours et vivez une expérience inoubliable à Dakhla.', 'Book your lesson and live an unforgettable experience in Dakhla.', 'Reserva tu clase y vive una experiencia inolvidable en Dakhla.', '��حجز درسك واعيش تجربة لا تنسى في الداخلة.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#E5A423] hover:bg-[#E5A423]/90 text-white font-bold h-14 px-8 rounded-xl"
            >
              <Link href={`/${locale}/pricing`}>
                {getText('Voir les tarifs', 'View pricing', 'Ver precios', 'عرض الأسعار')} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-white text-[#1E5AA8] hover:bg-white/90 font-bold h-14 px-8 rounded-xl"
            >
              <Link href={`/${locale}/contact`}>
                {getText('Nous contacter', 'Contact us', 'Contáctanos', 'اتصل بنا')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
