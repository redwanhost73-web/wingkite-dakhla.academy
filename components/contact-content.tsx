'use client'

import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, MessageCircle, Star, ExternalLink, Plane, Car, BusFront } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { useTranslations } from '@/lib/i18n-context'
import { useSiteConfig } from '@/hooks/use-site-config'
import { DEFAULT_IMAGES } from '@/lib/site-config'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { LocationMapLazy } from '@/components/location-map-lazy'
import { GOOGLE_MAPS_URL, SCHOOL_NAME } from '@/lib/location'

const GOOGLE_REVIEW_URL = 'https://g.page/r/CYv3UKOLHTcQEBM/review'
const WHATSAPP_NUMBER = '+212766910203'

export function ContactContent() {
  const { locale } = useTranslations()
  const { images } = useSiteConfig()
  const heroImage = images.contactHero || DEFAULT_IMAGES.contactHero

  // Helper to get localized text for all 4 languages
  const getText = (frText: string, enText: string, esText?: string, arText?: string): string => {
    if (locale === 'fr') return frText
    if (locale === 'es') return esText || enText
    if (locale === 'ar') return arText || enText
    return enText
  }

  const contactInfo = [
    {
      icon: MapPin,
      label: getText('Adresse', 'Address', 'Dirección', 'Adres'),
      value: 'Lagon de Dakhla, Dakhla, Maroc',
      href: GOOGLE_MAPS_URL,
      external: true
    },
    {
      icon: Phone,
      label: getText('Téléphone', 'Phone', 'Teléfono', 'Telefoon'),
      value: '+212 766 910 203',
      href: `tel:${WHATSAPP_NUMBER}`
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'wingkitedakhla@gmail.com',
      href: 'mailto:wingkitedakhla@gmail.com'
    },
    {
      icon: Clock,
      label: getText('Horaires', 'Hours', 'Horarios', 'ساعات العمل'),
      value: getText('Tous les jours: 8h - 18h', 'Every day: 8am - 6pm', 'Todos los días: 8h - 18h', 'كل يوم: 8 صباحاً - 6 مساءً')
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/wingkitedakhla', label: 'Facebook', color: '#1877F2' },
    { icon: Instagram, href: 'https://www.instagram.com/wing_kite_dakhla_academy', label: 'Instagram', color: '#E4405F' },
    { icon: Youtube, href: 'https://youtube.com/@wingkitedakhla', label: 'YouTube', color: '#FF0000' },
    { icon: MessageCircle, href: 'https://wa.me/212766910203', label: 'WhatsApp', color: '#25D366' },
  ]

  return (
    <main className="overflow-hidden">
      {/* ══ HERO ══ */}
      <PageHero
        image={heroImage}
        eyebrow={getText('Contact', 'Contact', 'Contacto', 'اتصل')}
        title={getText('Contactez-nous', 'Contact Us', 'Contáctanos', 'اتصل بنا')}
        subtitle={getText('Nous sommes là pour répondre à toutes vos questions', 'We are here to answer all your questions', 'Estamos aquí para responder todas tus preguntas', 'نحن هنا للإجابة على جميع أسئلتك')}
      />

      {/* ══ FORM + DETAILS ══ */}
      <section className="bg-white section-y" data-nav-theme="light">
        <div className="container-narrow">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">

            {/* Contact Form - Takes 3 columns */}
            <Reveal className="lg:col-span-3" direction="right">
              <div className="card-premium h-full p-8 sm:p-10">
                <h2 className="font-heading text-card-title text-[#072A5A]">
                  {getText('Envoyez-nous un message', 'Send us a message', 'Envíanos un mensaje', 'أرسل لنا رسالة')}
                </h2>
                <p className="text-small text-[#3D4F6F] mt-3 mb-9">
                  {getText('Nous vous répondrons dans les plus brefs délais.', 'We will get back to you as soon as possible.', 'Te responderemos lo antes posible.', 'سنرد عليك في أقرب وقت ممكن.')}
                </p>
                <ContactForm />
              </div>
            </Reveal>

            {/* Contact Info - Takes 2 columns */}
            <div className="space-y-6 lg:col-span-2">
              {/* Contact Details Card */}
              <Reveal delay={110} direction="left">
                <div className="rounded-[24px] border border-[#072A5A]/6 bg-[#FAF8F3] p-7">
                  <h3 className="eyebrow text-[#7A8AA3]">
                    {getText('Informations de contact', 'Contact Information', 'Información de contacto', 'معلومات الاتصال')}
                  </h3>
                  <div className="mt-7 space-y-6">
                    {contactInfo.map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#0046A4]/8 text-[#0046A4]">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#7A8AA3]">
                            {item.label}
                          </p>
                          {item.href ? (
                            <a
                              href={item.href}
                              target={item.external ? '_blank' : undefined}
                              rel={item.external ? 'noopener noreferrer' : undefined}
                              className="text-small mt-1 inline-block font-semibold text-[#072A5A] transition-colors duration-[450ms] hover:text-[#0046A4]"
                            >
                              {item.value}
                              {item.external && <ExternalLink className="inline h-3 w-3 ms-1.5" />}
                            </a>
                          ) : (
                            <p className="text-small mt-1 font-semibold text-[#072A5A]">{item.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Social Links Card */}
              <Reveal delay={200} direction="left">
                <div className="rounded-[24px] border border-[#072A5A]/6 bg-[#FAF8F3] p-7">
                  <h3 className="eyebrow text-[#7A8AA3]">
                    {getText('Suivez-nous', 'Follow Us', 'Síguenos', 'تابعنا')}
                  </h3>
                  <div className="mt-5 flex gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-[450ms] hover:-translate-y-1"
                        style={{ backgroundColor: social.color + '14', color: social.color }}
                        aria-label={social.label}
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Google Review Card */}
              <Reveal delay={290} direction="left">
                <div className="relative overflow-hidden rounded-[24px] bg-[#0046A4] p-7 text-white shadow-[0_25px_60px_rgba(0,70,164,0.28)]">
                  <span aria-hidden className="blob -top-20 -right-12 h-60 w-60 bg-white/12" />
                  <div className="relative z-10">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#C9A66B] text-[#C9A66B]" />
                      ))}
                    </div>
                    <h3 className="font-heading text-lg font-bold mt-4">
                      {getText('Vous avez aimé votre expérience?', 'Did you enjoy your experience?', '¿Te gustó tu experiencia?', 'هل أعجبتك تجربتك؟')}
                    </h3>
                    <p className="text-small text-white/75 mt-2">
                      {getText('Laissez-nous un avis sur Google!', 'Leave us a review on Google!', '¡Déjanos una reseña en Google!', 'اترك لنا تقييماً على Google!')}
                    </p>
                    <a
                      href={GOOGLE_REVIEW_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pill-sm mt-6 w-full bg-white text-small text-[#0046A4] hover:bg-white"
                    >
                      {getText('Laisser un avis', 'Leave a Review', 'Dejar una reseña', 'اترك تقييماً')}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </Reveal>

              {/* WhatsApp Quick Contact */}
              <Reveal delay={380} direction="left">
                <a
                  href={`https://wa.me/212766910203?text=${encodeURIComponent(getText('Bonjour, je souhaite réserver un cours de wingfoil.', 'Hello, I would like to book a wingfoil lesson.', 'Hola, me gustaría reservar una clase de wingfoil.', 'مرحباً، أود حجز درس وينج فويل.'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-[24px] bg-[#25D366] p-6 text-white shadow-[0_10px_30px_rgba(37,211,102,0.28)] transition-all duration-[450ms] hover:-translate-y-1 hover:bg-[#20bd5a] hover:shadow-[0_25px_60px_rgba(37,211,102,0.28)]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform duration-[450ms] group-hover:scale-110">
                    <MessageCircle className="h-6 w-6" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold">
                      {getText('Contactez-nous sur WhatsApp', 'Contact us on WhatsApp', 'Contáctanos en WhatsApp', 'تواصل معنا عبر واتساب')}
                    </span>
                    <span className="block text-small text-white/80">
                      {getText('Réponse rapide garantie', 'Quick response guaranteed', 'Respuesta rápida garantizada', 'رد سريع مضمون')}
                    </span>
                  </span>
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MAP ══ */}
      <section className="surface-noise relative overflow-hidden bg-[#F6F1E8] section-y" data-nav-theme="light">
        <span aria-hidden className="blob -bottom-32 right-1/4 h-104 w-104 bg-[#5AA8FF]/8" />

        <div className="container-narrow relative z-10">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-section text-[#072A5A] text-balance">
                {getText('Où nous trouver', 'Where to find us', 'Dónde encontrarnos', 'أين تجدنا')}
              </h2>
              <p className="text-body-lg text-[#3D4F6F] mt-6">
                {getText('Situé sur le magnifique lagon de Dakhla, Maroc', 'Located on the beautiful Dakhla lagoon, Morocco', 'Ubicado en la hermosa laguna de Dakhla, Marruecos', 'تقع على بحيرة الداخلة الجميلة، المغرب')}
              </p>
            </div>
          </Reveal>

          {/* Map Container */}
          <Reveal delay={120}>
            <div className="relative mt-14 overflow-hidden rounded-[28px] bg-white shadow-[0_40px_90px_rgba(0,70,164,0.08)]">
              <div className="relative aspect-video md:aspect-21/9">
                <LocationMapLazy className="absolute inset-0 h-full w-full" />
              </div>

              {/* Overlay Card */}
              <div className="absolute bottom-4 left-4 right-4 z-10 md:bottom-7 md:left-7 md:right-auto md:max-w-sm">
                <div className="rounded-[20px] border border-white/40 bg-white/85 p-5 shadow-[0_25px_60px_rgba(0,70,164,0.10)] backdrop-blur-[20px] backdrop-saturate-150">
                  <div className="flex items-start gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#0046A4]">
                      <MapPin className="h-5 w-5 text-white" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-[#072A5A]">{SCHOOL_NAME}</h3>
                      <p className="text-small text-[#3D4F6F] mt-0.5">
                        {getText('Lagon de Dakhla, Dakhla, Maroc', 'Dakhla Lagoon, Dakhla, Morocco', 'Laguna de Dakhla, Dakhla, Marruecos', 'بحيرة الداخلة، الداخلة، المغرب')}
                      </p>
                      <p className="mt-1 text-xs text-[#7A8AA3]">23°54′53.6″N 15°46′28.4″W</p>
                      <a
                        href={GOOGLE_MAPS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-small font-semibold text-[#0046A4] hover:underline"
                      >
                        {getText('Ouvrir dans Google Maps', 'Open in Google Maps', 'Abrir en Google Maps', 'فتح في خرائط Google')}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Directions Info */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                Icon: Plane,
                title: getText('Par avion', 'By plane', 'Por avión', 'بالطائرة'),
                desc: getText('Aéroport de Dakhla (VIL) - 15 min en voiture', 'Dakhla Airport (VIL) - 15 min by car', 'Aeropuerto de Dakhla (VIL) - 15 min en coche', 'مطار الداخلة (VIL) - 15 دقيقة بالسيارة')
              },
              {
                Icon: Car,
                title: getText('Par la route', 'By car', 'Por la carretera', 'بالسيارة'),
                desc: getText('Depuis le centre-ville de Dakhla - 20 min', 'From Dakhla city center - 20 min', 'Desde el centro de la ciudad de Dakhla - 20 min', 'من وسط مدينة الداخلة - 20 دقيقة')
              },
              {
                Icon: BusFront,
                title: getText('Transfert', 'Transfer', 'Transferencia', 'خدمة النقل'),
                desc: getText('Service de transfert disponible sur demande', 'Transfer service available on request', 'Servicio de transferencia disponible bajo solicitud', 'خدمة النقل متوفرة عند الطلب')
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 110}>
                <div className="card-premium card-lift h-full p-7 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#0046A4]/8 text-[#0046A4]">
                    <item.Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="font-heading font-bold text-[#072A5A] mt-5">{item.title}</h3>
                  <p className="text-small text-[#3D4F6F] mt-2">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="bg-white section-y-sm" data-nav-theme="light">
        <div className="container-narrow">
          <Reveal>
            <h2 className="font-heading text-section text-[#072A5A] mx-auto max-w-2xl text-center text-balance">
              {getText('Questions fréquentes', 'Frequently Asked Questions', 'Preguntas frecuentes', 'الأسئلة الشائعة')}
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {[
              {
                q: getText('Proposez-vous des cours pour débutants?', 'Do you offer courses for beginners?', '¿Ofrecen cursos para principiantes?', 'هل تقدمون دروساً للمبتدئين؟'),
                a: getText('Oui! Nous avons des cours spécialement conçus pour les débutants avec du matériel adapté.', 'Yes! We have courses specifically designed for beginners with adapted equipment.', '¡Sí! Tenemos cursos especialmente diseñados para principiantes con equipamiento adaptado.', 'نعم! لدينا دروس مصممة خصيصاً للمبتدئين مع معدات مناسبة.')
              },
              {
                q: getText('Fournissez-vous l\'équipement?', 'Do you provide equipment?', '¿Proporcionan equipamiento?', 'هل توفرون المعدات؟'),
                a: getText('Tout l\'équipement est inclus dans nos cours: wing, planche, combinaison et gilet.', 'All equipment is included in our courses: wing, board, wetsuit and vest.', 'Todo el equipamiento está incluido en nuestros cursos: ala, tabla, traje de neopreno y chaleco.', 'جميع المعدات مشمولة في دروسنا: وينج، لوح، بدلة غوص وسترة.')
              },
              {
                q: getText('Quelle est la meilleure saison?', 'What is the best season?', '¿Cuál es la mejor temporada?', 'ما هو أفضل موسم؟'),
                a: getText('Dakhla offre d\'excellentes conditions de vent presque toute l\'année.', 'Dakhla offers excellent wind conditions almost year-round.', 'Dakhla ofrece excelentes condiciones de viento casi todo el año.', 'توفر الداخلة ظروف رياح ممتازة على مدار معظم أيام السنة.')
              },
              {
                q: getText('Comment réserver?', 'How to book?', '¿Cómo reservar?', 'كيف أحجز؟'),
                a: getText('Contactez-nous par téléphone, WhatsApp, email ou via ce formulaire.', 'Contact us by phone, WhatsApp, email or through this form.', 'Contáctanos por teléfono, WhatsApp, correo electrónico o a través de este formulario.', 'تواصل معنا عبر الهاتف، واتساب، البريد الإلكتروني أو هذا النموذج.')
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 110}>
                <div className="h-full rounded-[24px] border border-[#072A5A]/6 bg-[#FAF8F3] p-7">
                  <h3 className="font-heading font-bold text-[#072A5A]">{item.q}</h3>
                  <p className="text-small text-[#3D4F6F] mt-3">{item.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
