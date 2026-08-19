'use client'

import dynamic from 'next/dynamic'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Star,
  ExternalLink,
  Plane,
  Car,
  BusFront,
} from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'
import { useSiteConfig } from '@/hooks/use-site-config'
import { DEFAULT_IMAGES } from '@/lib/site-config'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { LocationMapLazy } from '@/components/location-map-lazy'
import { GOOGLE_MAPS_URL, SCHOOL_NAME } from '@/lib/location'
import { EditableLink, EditableText, useEditableTextValue } from '@/components/edit-mode/editable'
import type { Localized } from '@/lib/cms/types'

const ContactForm = dynamic(
  () => import('@/components/contact-form').then((m) => m.ContactForm),
  {
    loading: () => (
      <div className="h-80 animate-pulse rounded-[20px] bg-[#072A5A]/5" aria-hidden />
    ),
  },
)

const GOOGLE_REVIEW_URL = 'https://g.page/r/CYv3UKOLHTcQEBM/review'
const WHATSAPP_NUMBER = '+212766910203'

const loc = (fr: string, en: string, es: string, ar: string): Localized => ({ fr, en, es, ar })

export function ContactContent() {
  const { locale } = useTranslations()
  const { images, texts } = useSiteConfig()
  const heroImage = images.contactHero || DEFAULT_IMAGES.contactHero

  const whatsappPrefill = useEditableTextValue(
    'contact.whatsapp.prefill',
    loc(
      'Bonjour, je souhaite réserver un cours de wingfoil.',
      'Hello, I would like to book a wingfoil lesson.',
      'Hola, me gustaría reservar una clase de wingfoil.',
      'مرحباً، أود حجز درس وينج فويل.',
    ),
    texts['contact.whatsapp.prefill'],
  )

  const contactInfo = [
    {
      id: 'address',
      icon: MapPin,
      label: loc('Adresse', 'Address', 'Dirección', 'العنوان'),
      value: loc(
        'Lagon de Dakhla, Dakhla, Maroc',
        'Dakhla Lagoon, Dakhla, Morocco',
        'Laguna de Dakhla, Dakhla, Marruecos',
        'بحيرة الداخلة، الداخلة، المغرب',
      ),
      href: GOOGLE_MAPS_URL,
      external: true,
    },
    {
      id: 'phone',
      icon: Phone,
      label: loc('Téléphone', 'Phone', 'Teléfono', 'الهاتف'),
      value: loc('+212 766 910 203', '+212 766 910 203', '+212 766 910 203', '+212 766 910 203'),
      href: `tel:${WHATSAPP_NUMBER}`,
      external: false,
    },
    {
      id: 'email',
      icon: Mail,
      label: loc('Email', 'Email', 'Email', 'البريد'),
      value: loc(
        'wingkitedakhla@gmail.com',
        'wingkitedakhla@gmail.com',
        'wingkitedakhla@gmail.com',
        'wingkitedakhla@gmail.com',
      ),
      href: 'mailto:wingkitedakhla@gmail.com',
      external: false,
    },
    {
      id: 'hours',
      icon: Clock,
      label: loc('Horaires', 'Hours', 'Horarios', 'ساعات العمل'),
      value: loc(
        'Tous les jours: 8h - 18h',
        'Every day: 8am - 6pm',
        'Todos los días: 8h - 18h',
        'كل يوم: 8 صباحاً - 6 مساءً',
      ),
      href: undefined as string | undefined,
      external: false,
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/wingkitedakhla', label: 'Facebook', color: '#1877F2' },
    { icon: Instagram, href: 'https://www.instagram.com/wing_kite_dakhla_academy', label: 'Instagram', color: '#E4405F' },
    { icon: Youtube, href: 'https://youtube.com/@wingkitedakhla', label: 'YouTube', color: '#FF0000' },
    { icon: MessageCircle, href: 'https://wa.me/212766910203', label: 'WhatsApp', color: '#25D366' },
  ]

  const directions = [
    {
      id: 'plane',
      Icon: Plane,
      title: loc('Par avion', 'By plane', 'Por avión', 'بالطائرة'),
      desc: loc(
        'Aéroport de Dakhla (VIL) - 15 min en voiture',
        'Dakhla Airport (VIL) - 15 min by car',
        'Aeropuerto de Dakhla (VIL) - 15 min en coche',
        'مطار الداخلة (VIL) - 15 دقيقة بالسيارة',
      ),
    },
    {
      id: 'car',
      Icon: Car,
      title: loc('Par la route', 'By car', 'Por la carretera', 'بالسيارة'),
      desc: loc(
        'Depuis le centre-ville de Dakhla - 20 min',
        'From Dakhla city center - 20 min',
        'Desde el centro de la ciudad de Dakhla - 20 min',
        'من وسط مدينة الداخلة - 20 دقيقة',
      ),
    },
    {
      id: 'transfer',
      Icon: BusFront,
      title: loc('Transfert', 'Transfer', 'Transferencia', 'خدمة النقل'),
      desc: loc(
        'Service de transfert disponible sur demande',
        'Transfer service available on request',
        'Servicio de transferencia disponible bajo solicitud',
        'خدمة النقل متوفرة عند الطلب',
      ),
    },
  ]

  const faqs = [
    {
      id: 'beginners',
      q: loc(
        'Proposez-vous des cours pour débutants?',
        'Do you offer courses for beginners?',
        '¿Ofrecen cursos para principiantes?',
        'هل تقدمون دروساً للمبتدئين؟',
      ),
      a: loc(
        'Oui! Nous avons des cours spécialement conçus pour les débutants avec du matériel adapté.',
        'Yes! We have courses specifically designed for beginners with adapted equipment.',
        '¡Sí! Tenemos cursos especialmente diseñados para principiantes con equipamiento adaptado.',
        'نعم! لدينا دروس مصممة خصيصاً للمبتدئين مع معدات مناسبة.',
      ),
    },
    {
      id: 'equipment',
      q: loc(
        "Fournissez-vous l'équipement?",
        'Do you provide equipment?',
        '¿Proporcionan equipamiento?',
        'هل توفرون المعدات؟',
      ),
      a: loc(
        "Tout l'équipement est inclus dans nos cours: wing, planche, combinaison et gilet.",
        'All equipment is included in our courses: wing, board, wetsuit and vest.',
        'Todo el equipamiento está incluido en nuestros cursos: ala, tabla, traje de neopreno y chaleco.',
        'جميع المعدات مشمولة في دروسنا: وينج، لوح، بدلة غوص وسترة.',
      ),
    },
    {
      id: 'season',
      q: loc(
        'Quelle est la meilleure saison?',
        'What is the best season?',
        '¿Cuál es la mejor temporada?',
        'ما هو أفضل موسم؟',
      ),
      a: loc(
        "Dakhla offre d'excellentes conditions de vent presque toute l'année.",
        'Dakhla offers excellent wind conditions almost year-round.',
        'Dakhla ofrece excelentes condiciones de viento casi todo el año.',
        'توفر الداخلة ظروف رياح ممتازة على مدار معظم أيام السنة.',
      ),
    },
    {
      id: 'book',
      q: loc('Comment réserver?', 'How to book?', '¿Cómo reservar?', 'كيف أحجز؟'),
      a: loc(
        'Contactez-nous par téléphone, WhatsApp, email ou via ce formulaire.',
        'Contact us by phone, WhatsApp, email or through this form.',
        'Contáctanos por teléfono, WhatsApp, correo electrónico o a través de este formulario.',
        'تواصل معنا عبر الهاتف، واتساب، البريد الإلكتروني أو هذا النموذج.',
      ),
    },
  ]

  return (
    <main className="overflow-hidden">
      <PageHero
        image={heroImage}
        imageKey="contactHero"
        eyebrow={
          <EditableText
            fieldKey="contact.hero.eyebrow"
            label="Contact hero eyebrow"
            defaults={loc('Contact', 'Contact', 'Contacto', 'اتصل')}
            cms={texts['contact.hero.eyebrow']}
          />
        }
        title={
          <EditableText
            fieldKey="contact.hero.title"
            label="Contact hero title"
            defaults={loc('Contactez-nous', 'Contact Us', 'Contáctanos', 'اتصل بنا')}
            cms={texts['contact.hero.title']}
          />
        }
        subtitle={
          <EditableText
            fieldKey="contact.hero.subtitle"
            label="Contact hero subtitle"
            defaults={loc(
              'Nous sommes là pour répondre à toutes vos questions',
              'We are here to answer all your questions',
              'Estamos aquí para responder todas tus preguntas',
              'نحن هنا للإجابة على جميع أسئلتك',
            )}
            cms={texts['contact.hero.subtitle']}
          />
        }
      />

      <section className="bg-white section-y" data-nav-theme="light">
        <div className="container-narrow">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
            <Reveal className="lg:col-span-3" direction="right">
              <div className="card-premium h-full p-8 sm:p-10">
                <EditableText
                  fieldKey="contact.form.title"
                  label="Contact form title"
                  as="h2"
                  className="font-heading text-card-title text-[#072A5A]"
                  defaults={loc(
                    'Réservez en quelques étapes',
                    'Book in a few steps',
                    'Reserva en unos pasos',
                    'احجز في خطوات بسيطة',
                  )}
                  cms={texts['contact.form.title']}
                />
                <EditableText
                  fieldKey="contact.form.subtitle"
                  label="Contact form subtitle"
                  as="p"
                  className="text-small text-[#3D4F6F] mt-3 mb-9"
                  defaults={loc(
                    'Dites-nous ce dont vous avez besoin — on s’occupe du reste.',
                    'Tell us what you need — we’ll take care of the rest.',
                    'Dinos lo que necesitas — nosotros nos ocupamos del resto.',
                    'أخبرنا بما تحتاجه — ونتولى الباقي.',
                  )}
                  cms={texts['contact.form.subtitle']}
                />
                <ContactForm />
              </div>
            </Reveal>

            <div className="space-y-6 lg:col-span-2">
              <Reveal delay={110} direction="left">
                <div className="rounded-[24px] border border-[#072A5A]/6 bg-[#FAF8F3] p-7">
                  <EditableText
                    fieldKey="contact.info.title"
                    label="Contact info title"
                    as="h3"
                    className="eyebrow text-[#7A8AA3]"
                    defaults={loc(
                      'Informations de contact',
                      'Contact Information',
                      'Información de contacto',
                      'معلومات الاتصال',
                    )}
                    cms={texts['contact.info.title']}
                  />
                  <div className="mt-7 space-y-6">
                    {contactInfo.map((item) => (
                      <div key={item.id} className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#0046A4]/8 text-[#0046A4]">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <EditableText
                            fieldKey={`contact.info.${item.id}.label`}
                            label={`Contact ${item.id} label`}
                            as="p"
                            className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#7A8AA3]"
                            defaults={item.label}
                            cms={texts[`contact.info.${item.id}.label`]}
                          />
                          {item.href ? (
                            <a
                              href={item.href}
                              target={item.external ? '_blank' : undefined}
                              rel={item.external ? 'noopener noreferrer' : undefined}
                              className="text-small mt-1 inline-flex items-center font-semibold text-[#072A5A] transition-colors duration-[450ms] hover:text-[#0046A4]"
                            >
                              <EditableText
                                fieldKey={`contact.info.${item.id}.value`}
                                label={`Contact ${item.id} value`}
                                defaults={item.value}
                                cms={texts[`contact.info.${item.id}.value`]}
                              />
                              {item.external && <ExternalLink className="inline h-3 w-3 ms-1.5" />}
                            </a>
                          ) : (
                            <EditableText
                              fieldKey={`contact.info.${item.id}.value`}
                              label={`Contact ${item.id} value`}
                              as="p"
                              className="text-small mt-1 font-semibold text-[#072A5A]"
                              defaults={item.value}
                              cms={texts[`contact.info.${item.id}.value`]}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={200} direction="left">
                <div className="rounded-[24px] border border-[#072A5A]/6 bg-[#FAF8F3] p-7">
                  <EditableText
                    fieldKey="contact.social.title"
                    label="Follow us title"
                    as="h3"
                    className="eyebrow text-[#7A8AA3]"
                    defaults={loc('Suivez-nous', 'Follow Us', 'Síguenos', 'تابعنا')}
                    cms={texts['contact.social.title']}
                  />
                  <div className="mt-5 flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
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

              <Reveal delay={290} direction="left">
                <div className="relative overflow-hidden rounded-[24px] bg-[#0046A4] p-7 text-white shadow-[0_25px_60px_rgba(0,70,164,0.28)]">
                  <span aria-hidden className="blob -top-20 -right-12 h-60 w-60 bg-white/12" />
                  <div className="relative z-10">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#C9A66B] text-[#C9A66B]" />
                      ))}
                    </div>
                    <EditableText
                      fieldKey="contact.review.title"
                      label="Google review title"
                      as="h3"
                      className="font-heading text-lg font-bold mt-4"
                      defaults={loc(
                        'Vous avez aimé votre expérience?',
                        'Did you enjoy your experience?',
                        '¿Te gustó tu experiencia?',
                        'هل أعجبتك تجربتك؟',
                      )}
                      cms={texts['contact.review.title']}
                    />
                    <EditableText
                      fieldKey="contact.review.subtitle"
                      label="Google review subtitle"
                      as="p"
                      className="text-small text-white/75 mt-2"
                      defaults={loc(
                        'Laissez-nous un avis sur Google!',
                        'Leave us a review on Google!',
                        '¡Déjanos una reseña en Google!',
                        'اترك لنا تقييماً على Google!',
                      )}
                      cms={texts['contact.review.subtitle']}
                    />
                    <EditableLink
                      fieldKey="contact.review.cta"
                      label="Leave a review CTA"
                      href={GOOGLE_REVIEW_URL}
                      className="btn-pill-sm mt-6 w-full bg-white text-small text-[#0046A4] hover:bg-white"
                      defaults={loc(
                        'Laisser un avis',
                        'Leave a Review',
                        'Dejar una reseña',
                        'اترك تقييماً',
                      )}
                      cms={texts['contact.review.cta']}
                      after={<ExternalLink className="h-4 w-4" />}
                    />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={380} direction="left">
                <a
                  href={`https://wa.me/212766910203?text=${encodeURIComponent(whatsappPrefill)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-[24px] bg-[#25D366] p-6 text-white shadow-[0_10px_30px_rgba(37,211,102,0.28)] transition-all duration-[450ms] hover:-translate-y-1 hover:bg-[#20bd5a] hover:shadow-[0_25px_60px_rgba(37,211,102,0.28)]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform duration-[450ms] group-hover:scale-110">
                    <MessageCircle className="h-6 w-6" />
                  </span>
                  <span className="min-w-0">
                    <EditableText
                      fieldKey="contact.whatsapp.title"
                      label="WhatsApp title"
                      as="span"
                      className="block font-bold"
                      defaults={loc(
                        'Contactez-nous sur WhatsApp',
                        'Contact us on WhatsApp',
                        'Contáctanos en WhatsApp',
                        'تواصل معنا عبر واتساب',
                      )}
                      cms={texts['contact.whatsapp.title']}
                    />
                    <EditableText
                      fieldKey="contact.whatsapp.subtitle"
                      label="WhatsApp subtitle"
                      as="span"
                      className="block text-small text-white/80"
                      defaults={loc(
                        'Réponse rapide garantie',
                        'Quick response guaranteed',
                        'Respuesta rápida garantizada',
                        'رد سريع مضمون',
                      )}
                      cms={texts['contact.whatsapp.subtitle']}
                    />
                  </span>
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-noise relative overflow-hidden bg-[#F6F1E8] section-y" data-nav-theme="light">
        <span aria-hidden className="blob -bottom-32 right-1/4 h-104 w-104 bg-[#5AA8FF]/8" />

        <div className="container-narrow relative z-10">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <EditableText
                fieldKey="contact.map.title"
                label="Map section title"
                as="h2"
                className="font-heading text-section text-[#072A5A] text-balance"
                defaults={loc(
                  'Où nous trouver',
                  'Where to find us',
                  'Dónde encontrarnos',
                  'أين تجدنا',
                )}
                cms={texts['contact.map.title']}
              />
              <EditableText
                fieldKey="contact.map.subtitle"
                label="Map section subtitle"
                as="p"
                className="text-body-lg text-[#3D4F6F] mt-6"
                defaults={loc(
                  'Situé sur le magnifique lagon de Dakhla, Maroc',
                  'Located on the beautiful Dakhla lagoon, Morocco',
                  'Ubicado en la hermosa laguna de Dakhla, Marruecos',
                  'تقع على بحيرة الداخلة الجميلة، المغرب',
                )}
                cms={texts['contact.map.subtitle']}
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px] lg:gap-6 lg:items-stretch">
              <div className="relative min-h-100 overflow-hidden rounded-[28px] bg-white shadow-[0_40px_90px_rgba(0,70,164,0.08)] sm:min-h-115 md:min-h-0 md:aspect-21/9">
                <LocationMapLazy className="absolute inset-0 h-full w-full" />
              </div>

              <div className="flex flex-col justify-center rounded-[28px] border border-[#072A5A]/6 bg-white p-6 shadow-[0_25px_60px_rgba(0,70,164,0.08)] sm:p-7">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#0046A4]">
                    <MapPin className="h-5 w-5 text-white" />
                  </span>
                  <div className="min-w-0">
                    <EditableText
                      fieldKey="contact.map.schoolName"
                      label="School name on map card"
                      as="h3"
                      className="font-heading font-bold text-[#072A5A]"
                      defaults={loc(SCHOOL_NAME, SCHOOL_NAME, SCHOOL_NAME, SCHOOL_NAME)}
                      cms={texts['contact.map.schoolName']}
                    />
                    <EditableText
                      fieldKey="contact.map.address"
                      label="Map card address"
                      as="p"
                      className="text-small text-[#3D4F6F] mt-0.5"
                      defaults={loc(
                        'Lagon de Dakhla, Dakhla, Maroc',
                        'Dakhla Lagoon, Dakhla, Morocco',
                        'Laguna de Dakhla, Dakhla, Marruecos',
                        'بحيرة الداخلة، الداخلة، المغرب',
                      )}
                      cms={texts['contact.map.address']}
                    />
                    <EditableText
                      fieldKey="contact.map.coords"
                      label="Map coordinates"
                      as="p"
                      className="mt-1 text-xs text-[#7A8AA3]"
                      defaults={loc(
                        '23°54′53.6″N 15°46′28.4″W',
                        '23°54′53.6″N 15°46′28.4″W',
                        '23°54′53.6″N 15°46′28.4″W',
                        '23°54′53.6″N 15°46′28.4″W',
                      )}
                      cms={texts['contact.map.coords']}
                    />
                    <EditableLink
                      fieldKey="contact.map.mapsCta"
                      label="Open in Google Maps"
                      href={GOOGLE_MAPS_URL}
                      className="mt-4 inline-flex items-center gap-1.5 text-small font-semibold text-[#0046A4] hover:underline"
                      defaults={loc(
                        'Ouvrir dans Google Maps',
                        'Open in Google Maps',
                        'Abrir en Google Maps',
                        'فتح في خرائط Google',
                      )}
                      cms={texts['contact.map.mapsCta']}
                      after={<ExternalLink className="h-3 w-3" />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {directions.map((item, i) => (
              <Reveal key={item.id} delay={i * 110}>
                <div className="card-premium card-lift h-full p-7 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#0046A4]/8 text-[#0046A4]">
                    <item.Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <EditableText
                    fieldKey={`contact.directions.${item.id}.title`}
                    label={`Directions ${item.id} title`}
                    as="h3"
                    className="font-heading font-bold text-[#072A5A] mt-5"
                    defaults={item.title}
                    cms={texts[`contact.directions.${item.id}.title`]}
                  />
                  <EditableText
                    fieldKey={`contact.directions.${item.id}.desc`}
                    label={`Directions ${item.id} description`}
                    as="p"
                    className="text-small text-[#3D4F6F] mt-2"
                    defaults={item.desc}
                    cms={texts[`contact.directions.${item.id}.desc`]}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white section-y-sm" data-nav-theme="light">
        <div className="container-narrow">
          <Reveal>
            <EditableText
              fieldKey="contact.faq.title"
              label="FAQ title"
              as="h2"
              className="font-heading text-section text-[#072A5A] mx-auto max-w-2xl text-center text-balance"
              defaults={loc(
                'Questions fréquentes',
                'Frequently Asked Questions',
                'Preguntas frecuentes',
                'الأسئلة الشائعة',
              )}
              cms={texts['contact.faq.title']}
            />
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {faqs.map((item, i) => (
              <Reveal key={item.id} delay={i * 110}>
                <div className="h-full rounded-[24px] border border-[#072A5A]/6 bg-[#FAF8F3] p-7">
                  <EditableText
                    fieldKey={`contact.faq.${item.id}.q`}
                    label={`FAQ ${item.id} question`}
                    as="h3"
                    className="font-heading font-bold text-[#072A5A]"
                    defaults={item.q}
                    cms={texts[`contact.faq.${item.id}.q`]}
                  />
                  <EditableText
                    fieldKey={`contact.faq.${item.id}.a`}
                    label={`FAQ ${item.id} answer`}
                    as="p"
                    className="text-small text-[#3D4F6F] mt-3"
                    defaults={item.a}
                    cms={texts[`contact.faq.${item.id}.a`]}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
