'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, MessageCircle, Star, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContactForm } from '@/components/contact-form'
import { useTranslations } from '@/lib/i18n-context'
import { useSiteConfig } from '@/hooks/use-site-config'
import { DEFAULT_IMAGES } from '@/lib/site-config'

const GOOGLE_MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30125.5!2d-14.5526684!3d22.6807513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x64f9beb3edd86dfb%3A0x10371d8ba350f78b!2sWing%20Kite%20Dakhla%20Academy!5e0!3m2!1sen!2sma!4v1710000000000!5m2!1sen!2sma'
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/place/Wing+Kite+Dakhla+Academy/@22.6807513,-14.5526684,17z'
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
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px]">
        <Image
          src={heroImage}
          alt="Contact Wing Kite Dakhla"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              {getText('Contactez-nous', 'Contact Us', 'Contáctanos', 'اتصل بنا')}
            </h1>
            <p className="text-xl text-white/90 max-w-xl mx-auto">
              {getText('Nous sommes là pour répondre à toutes vos questions', 'We are here to answer all your questions', 'Estamos aquí para responder todas tus preguntas', 'نحن هنا للإجابة على جميع أسئلتك')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            
            {/* Contact Form - Takes 3 columns */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">
                  {getText('Envoyez-nous un message', 'Send us a message', 'Envíanos un mensaje', 'أرسل لنا رسالة')}
                </h2>
                <p className="text-gray-600 mb-8">
                  {getText('Nous vous répondrons dans les plus brefs délais.', 'We will get back to you as soon as possible.', 'Te responderemos lo antes posible.', 'سنرد عليك في أقرب وقت ممكن.')}
                </p>
                <ContactForm />
              </div>
            </div>

            {/* Contact Info - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Details Card */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-[#1a1a2e] mb-6">
                  {getText('Informations de contact', 'Contact Information', 'Información de contacto', 'معلومات الاتصال')}
                </h3>
                <div className="space-y-5">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#1E5AA8]/10 text-[#1E5AA8] shrink-0">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{item.label}</p>
                        {item.href ? (
                          <a 
                            href={item.href}
                            target={item.external ? '_blank' : undefined}
                            rel={item.external ? 'noopener noreferrer' : undefined}
                            className="font-medium text-[#1a1a2e] hover:text-[#1E5AA8] transition-colors"
                          >
                            {item.value}
                            {item.external && <ExternalLink className="inline h-3 w-3 ml-1" />}
                          </a>
                        ) : (
                          <p className="font-medium text-[#1a1a2e]">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links Card */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-[#1a1a2e] mb-4">
                  {getText('Suivez-nous', 'Follow Us', 'Síguenos', 'تابعنا')}
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 hover:scale-110"
                      style={{ backgroundColor: social.color + '15', color: social.color }}
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Google Review Card */}
              <div className="bg-gradient-to-br from-[#1E5AA8] to-[#0f3a5f] rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-[#E5A423] text-[#E5A423]" />
                    ))}
                  </div>
                  <span className="font-bold">5.0</span>
                </div>
                <h3 className="text-lg font-bold mb-2">
                  {getText('Vous avez aimé votre expérience?', 'Did you enjoy your experience?', '¿Te gustó tu experiencia?', 'هل أعجبتك تجربتك؟')}
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  {getText('Laissez-nous un avis sur Google!', 'Leave us a review on Google!', '¡Déjanos una reseña en Google!', 'اترك لنا تقييماً على Google!')}
                </p>
                <Button
                  asChild
                  className="w-full bg-white text-[#1E5AA8] hover:bg-white/90 font-bold rounded-xl"
                >
                  <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer">
                    {getText('Laisser un avis', 'Leave a Review', 'Dejar una reseña', 'اترك تقييماً')}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>

              {/* WhatsApp Quick Contact */}
              <a
                href={`https://wa.me/212766910203?text=${encodeURIComponent(getText('Bonjour, je souhaite réserver un cours de wingfoil.', 'Hello, I would like to book a wingfoil lesson.', 'Hola, me gustaría reservar una clase de wingfoil.', 'مرحباً، أود حجز درس وينج فويل.'))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-[#25D366] rounded-2xl p-5 text-white hover:bg-[#20bd5a] transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold">{getText('Contactez-nous sur WhatsApp', 'Contact us on WhatsApp', 'Contáctanos en WhatsApp', 'تواصل معنا عبر واتساب')}</p>
                  <p className="text-sm text-white/80">{getText('Réponse rapide garantie', 'Quick response guaranteed', 'Respuesta rápida garantizada', 'رد سريع مضمون')}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-2">
              {getText('Où nous trouver', 'Where to find us', 'Dónde encontrarnos', 'أين تجدنا')}
            </h2>
            <p className="text-gray-600">
              {getText('Situé sur le magnifique lagon de Dakhla, Maroc', 'Located on the beautiful Dakhla lagoon, Morocco', 'Ubicado en la hermosa laguna de Dakhla, Marruecos', 'تقع على بحيرة الداخلة الجميلة، المغرب')}
            </p>
          </div>
          
          {/* Map Container */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white">
            <div className="aspect-[16/9] md:aspect-[21/9]">
              <iframe
                src={GOOGLE_MAPS_EMBED}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Wing Kite Dakhla Academy Location"
                className="absolute inset-0"
              />
            </div>
            
            {/* Overlay Card */}
            <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:max-w-sm">
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1E5AA8] flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a1a2e]">Wing Kite Dakhla Academy</h3>
                    <p className="text-sm text-gray-600 mb-3">Lagon de Dakhla, Dakhla, Maroc</p>
                    <a
                      href={GOOGLE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-[#1E5AA8] hover:underline"
                    >
                      {getText('Ouvrir dans Google Maps', 'Open in Google Maps', 'Abrir en Google Maps', 'فتح في خرائط Google')}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Directions Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[
              {
                icon: '✈️',
                title: getText('Par avion', 'By plane', 'Por avión', 'بالطائرة'),
                desc: getText('Aéroport de Dakhla (VIL) - 15 min en voiture', 'Dakhla Airport (VIL) - 15 min by car', 'Aeropuerto de Dakhla (VIL) - 15 min en coche', 'مطار الداخلة (VIL) - 15 دقيقة بالسيارة')
              },
              {
                icon: '🚗',
                title: getText('Par la route', 'By car', 'Por la carretera', 'بالسيارة'),
                desc: getText('Depuis le centre-ville de Dakhla - 20 min', 'From Dakhla city center - 20 min', 'Desde el centro de la ciudad de Dakhla - 20 min', 'من وسط مدينة الداخلة - 20 دقيقة')
              },
              {
                icon: '🚐',
                title: getText('Transfert', 'Transfer', 'Transferencia', 'خدمة النقل'),
                desc: getText('Service de transfert disponible sur demande', 'Transfer service available on request', 'Servicio de transferencia disponible bajo solicitud', 'خدمة النقل متوفرة عند الطلب')
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-md text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-[#1a1a2e] mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Quick Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">
            {getText('Questions fréquentes', 'Frequently Asked Questions', 'Preguntas frecuentes', 'الأسئلة الشائعة')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
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
                a: getText('Dakhla offre d\'excellentes conditions toute l\'année avec 300+ jours de vent.', 'Dakhla offers excellent conditions year-round with 300+ days of wind.', 'Dakhla ofrece excelentes condiciones todo el año con 300+ días de viento.', 'توفر الداخلة ظروفاً ممتازة على مدار السنة مع أكثر من 300 يوم رياح.')
              },
              {
                q: getText('Comment réserver?', 'How to book?', '¿Cómo reservar?', 'كيف أحجز؟'),
                a: getText('Contactez-nous par téléphone, WhatsApp, email ou via ce formulaire.', 'Contact us by phone, WhatsApp, email or through this form.', 'Contáctanos por teléfono, WhatsApp, correo electrónico o a través de este formulario.', 'تواصل معنا عبر الهاتف، واتساب، البريد الإلكتروني أو هذا النموذج.')
              },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-5">
                <h3 className="font-bold text-[#1a1a2e] mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
