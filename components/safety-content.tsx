'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Shield,
  Radio,
  BadgeCheck,
  Ship,
  Sparkles,
  Waves,
  Car,
  HardHat,
  LifeBuoy,
} from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'
import { useSiteConfig } from '@/hooks/use-site-config'
import { DEFAULT_IMAGES } from '@/lib/site-config'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'

export function SafetyContent() {
  const { locale } = useTranslations()
  const { images } = useSiteConfig()
  const hero = images.aboutHero || DEFAULT_IMAGES.aboutHero
  const gearImg = images.aboutAction1 || DEFAULT_IMAGES.aboutAction1
  const spotImg = images.aboutLocation || DEFAULT_IMAGES.aboutLocation

  const getText = (fr: string, en: string, es?: string, ar?: string) => {
    if (locale === 'fr') return fr
    if (locale === 'es') return es || en
    if (locale === 'ar') return ar || en
    return en
  }

  const protocols = [
    {
      id: 'iko',
      icon: BadgeCheck,
      title: getText('Moniteurs certifiés IKO', 'IKO-certified instructors', 'Monitores certificados IKO', 'مدربون معتمدون IKO'),
      desc: getText(
        'Encadrement professionnel et standards internationaux pour progresser en confiance.',
        'Professional coaching and international standards so you progress with confidence.',
        'Entrenamiento profesional y estándares internacionales para progresar con confianza.',
        'تدريب احترافي ومعايير دولية لتتقدم بثقة.'
      ),
    },
    {
      id: 'radio',
      icon: Radio,
      title: getText('Casque et walkie-talkie', 'Helmet & walkie-talkie', 'Casco y walkie-talkie', 'خوذة وجهاز لاسلكي'),
      desc: getText(
        'Coaching en temps réel sur l\'eau : corrections immédiates, contact permanent.',
        'Real-time coaching on the water: instant corrections, constant contact.',
        'Coaching en tiempo real en el agua: correcciones inmediatas, contacto permanente.',
        'تدريب فوري على الماء: تصحيحات مباشرة واتصال دائم.'
      ),
    },
    {
      id: 'boat',
      icon: Ship,
      title: getText('Bateau de sécurité', 'Safety boat', 'Barco de seguridad', 'قارب الأمان'),
      desc: getText(
        'Assistance rapide pendant vos sessions pour une pratique sereine.',
        'Fast assistance during your sessions for peace of mind.',
        'Asistencia rápida durante tus sesiones para practicar con tranquilidad.',
        'مساعدة سريعة أثناء جلساتك لممارسة مطمئنة.'
      ),
    },
    {
      id: 'vest',
      icon: LifeBuoy,
      title: getText('Équipement de protection', 'Protective gear', 'Equipo de protección', 'معدات الحماية'),
      desc: getText(
        'Gilet de sécurité, casque et protocoles stricts sur chaque cours.',
        'Safety vest, helmet and strict protocols on every lesson.',
        'Chaleco de seguridad, casco y protocolos estrictos en cada clase.',
        'سترة نجاة وخوذة وبروتوكولات صارمة في كل درس.'
      ),
    },
  ]

  const materials = [
    {
      icon: Sparkles,
      title: getText('Matériel haut de gamme', 'Premium equipment', 'Material de alta gama', 'معدات فاخرة'),
      desc: getText(
        'Wings, kites et planches récents, entretenus et adaptés à votre niveau.',
        'Recent wings, kites and boards — maintained and matched to your level.',
        'Wings, kites y tablas recientes, mantenidos y adaptados a tu nivel.',
        'أجنحة وكايت وألواح حديثة ومعتنى بها ومكيفة لمستواك.'
      ),
    },
    {
      icon: HardHat,
      title: getText('Casques radio', 'Radio helmets', 'Cascos con radio', 'خوذات راديو'),
      desc: getText(
        'Communication claire instructeur ↔ élève, même au large.',
        'Clear instructor ↔ student communication, even farther out.',
        'Comunicación clara instructor ↔ alumno, incluso lejos de la orilla.',
        'تواصل واضح بين المدرب والطالب حتى بعيدًا عن الشاطئ.'
      ),
    },
    {
      icon: Waves,
      title: getText('Spot facile et eau plate', 'Easy spot & flat water', 'Spot fácil y agua plana', 'موقع سهل وماء مسطح'),
      desc: getText(
        'Lagon de Dakhla : conditions idéales pour débuter et monter en niveau.',
        'Dakhla lagoon: ideal conditions to start and progress.',
        'Laguna de Dakhla: condiciones ideales para empezar y progresar.',
        'بحيرة الداخلة: ظروف مثالية للبداية وتطوير المستوى.'
      ),
    },
    {
      icon: Car,
      title: getText('Transfert aller et retour', 'Round-trip transfer', 'Traslado de ida y vuelta', 'نقل ذهاب وإياب'),
      desc: getText(
        'Prise en charge confortable vers le spot et retour inclus.',
        'Comfortable pickup to the spot and return included.',
        'Recogida cómoda hacia el spot y vuelta incluida.',
        'توصيل مريح إلى الموقع والعودة مشمولة.'
      ),
    },
  ]

  return (
    <div className="overflow-hidden">
      <PageHero
        image={hero}
        eyebrow={getText('Sécurité & matériel', 'Safety & gear', 'Seguridad y material', 'السلامة والمعدات')}
        title={getText(
          'Sécurité et matériels d\'exception',
          'Exceptional safety and equipment',
          'Seguridad y material excepcional',
          'سلامة ومعدات استثنائية'
        )}
        subtitle={getText(
          'Découvrez les protocoles, le bateau de sécurité et le matériel premium de Wing Kite Dakhla Academy.',
          'Explore the protocols, safety boat and premium gear at Wing Kite Dakhla Academy.',
          'Descubre los protocolos, el barco de seguridad y el material premium de Wing Kite Dakhla Academy.',
          'اكتشف البروتوكولات وقارب الأمان والمعدات الفاخرة في Wing Kite Dakhla Academy.'
        )}
      />

      {/* Jump links for client review */}
      <section className="border-b border-[#072A5A]/8 bg-[#FAF8F3] py-4" data-nav-theme="light">
        <div className="container-editorial flex flex-wrap gap-2 sm:gap-3">
          {[
            { href: '#security', label: getText('Protocoles', 'Protocols', 'Protocolos', 'البروتوكولات') },
            { href: '#equipment', label: getText('Matériel', 'Equipment', 'Material', 'المعدات') },
            { href: '#spot', label: getText('Spot', 'Spot', 'Spot', 'الموقع') },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full border border-[#072A5A]/10 bg-white px-4 py-2 text-xs font-bold text-[#072A5A] transition-colors hover:border-[#0046A4]/30 hover:text-[#0046A4]"
            >
              {item.label}
            </a>
          ))}
        </div>
      </section>

      {/* ══ SECURITY ══ */}
      <section id="security" className="surface-noise relative overflow-hidden bg-white section-y scroll-mt-28" data-nav-theme="light">
        <span aria-hidden className="blob -top-24 -right-24 h-104 w-104 bg-[#0046A4]/8" />
        <div className="container-editorial relative z-10">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0046A4]/10 text-[#0046A4]">
                <Shield className="h-5 w-5" aria-hidden />
              </span>
              <p className="eyebrow text-[#0046A4] mt-5">
                {getText('Priorité absolue', 'Top priority', 'Prioridad absoluta', 'أولوية قصوى')}
              </p>
              <h2 className="font-heading text-section text-[#072A5A] mt-4 text-balance">
                {getText('Protocoles de sécurité', 'Safety protocols', 'Protocolos de seguridad', 'بروتوكولات السلامة')}
              </h2>
              <p className="text-body-lg text-[#3D4F6F] mt-5">
                {getText(
                  'Chaque cours suit des standards stricts pour que vous progressiez en confiance.',
                  'Every lesson follows strict standards so you progress with confidence.',
                  'Cada clase sigue estándares estrictos para que progreses con confianza.',
                  'كل درس يتبع معايير صارمة لتتقدم بثقة.'
                )}
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
            {protocols.map(({ id, icon: Icon, title, desc }, i) => (
              <Reveal key={id} delay={i * 90}>
                <article
                  id={id}
                  className="group card-premium card-lift h-full p-7 scroll-mt-28"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B1F3B] text-white transition-transform duration-450 group-hover:scale-105">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-heading text-lg font-bold text-[#072A5A] mt-5">{title}</h3>
                  <p className="text-small text-[#3D4F6F] mt-2 leading-relaxed">{desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EQUIPMENT ══ */}
      <section
        id="equipment"
        className="surface-noise relative overflow-hidden bg-[#F6F1E8] section-y scroll-mt-28"
        data-nav-theme="light"
      >
        <div className="container-editorial relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal direction="right">
              <div className="relative aspect-4/3 overflow-hidden rounded-[28px] shadow-[0_40px_90px_rgba(0,70,164,0.08)]">
                <Image
                  src={gearImg}
                  alt={getText('Matériel premium', 'Premium gear', 'Material premium', 'معدات فاخرة')}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  loading="lazy"
                  quality={75}
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(7,42,90,.35), transparent 55%)',
                  }}
                />
              </div>
            </Reveal>

            <div>
              <Reveal>
                <p className="eyebrow text-[#0046A4]">
                  {getText('Matériel inclus', 'Gear included', 'Material incluido', 'المعدات مشمولة')}
                </p>
                <h2 className="font-heading text-section text-[#072A5A] mt-4 text-balance">
                  {getText(
                    'Du matériel haut de gamme, adapté à votre niveau',
                    'Premium gear matched to your level',
                    'Material de alta gama adaptado a tu nivel',
                    'معدات فاخرة مكيفة لمستواك'
                  )}
                </h2>
                <p className="text-body-lg text-[#3D4F6F] mt-5">
                  {getText(
                    'Kite ou wing, planche, combinaison, gilet, casque et walkie-talkie — tout est prévu pour votre session.',
                    'Kite or wing, board, wetsuit, vest, helmet and walkie-talkie — everything ready for your session.',
                    'Kite o wing, tabla, neopreno, chaleco, casco y walkie-talkie — todo listo para tu sesión.',
                    'كايت أو وينج، لوح، بدلة، سترة، خوذة وجهاز لاسلكي — كل شيء جاهز لجلستك.'
                  )}
                </p>
              </Reveal>

              <div className="mt-8 space-y-4">
                {materials.slice(0, 2).map(({ icon: Icon, title, desc }, i) => (
                  <Reveal key={title} delay={i * 100}>
                    <div className="flex gap-4 rounded-[20px] bg-white/70 p-5 border border-[#072A5A]/6">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#C9A66B] text-[#0B1F3B]">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div>
                        <p className="font-heading text-base font-bold text-[#072A5A]">{title}</p>
                        <p className="text-small text-[#3D4F6F] mt-1">{desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SPOT & LOGISTICS ══ */}
      <section id="spot" className="relative overflow-hidden bg-[#0B1F3B] section-y scroll-mt-28" data-nav-theme="dark">
        <div className="absolute inset-0 z-0">
          <Image
            src={spotImg}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            loading="lazy"
            quality={70}
            className="object-cover opacity-40"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(7,42,90,.92) 0%, rgba(0,70,164,.78) 50%, rgba(11,31,59,.94) 100%)',
            }}
          />
        </div>

        <div className="container-editorial relative z-10">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-[#5AA8FF]">
                {getText('Lagon de Dakhla', 'Dakhla Lagoon', 'Laguna de Dakhla', 'بحيرة الداخلة')}
              </p>
              <h2 className="font-heading text-section text-white mt-4 text-balance">
                {getText('Spot sûr et conditions idéales', 'Safe spot & ideal conditions', 'Spot seguro y condiciones ideales', 'موقع آمن وظروف مثالية')}
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {materials.slice(2).map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 110}>
                <article className="rounded-[24px] border border-white/12 bg-white/8 p-7 backdrop-blur-md">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A66B] text-[#0B1F3B]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-heading text-lg font-bold text-white mt-5">{title}</h3>
                  <p className="text-small text-white/65 mt-2 leading-relaxed">{desc}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={280}>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <Link
                href={`/${locale}/pricing`}
                className="group btn-pill bg-[#C9A66B] text-[#0B1F3B] hover:bg-[#C9A66B]"
              >
                {getText('Voir les tarifs', 'View pricing', 'Ver precios', 'عرض الأسعار')}
                <ArrowRight className="h-5 w-5 transition-transform duration-400 group-hover:translate-x-1" />
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="btn-pill border border-white/25 bg-white/10 text-white hover:bg-white/15"
              >
                {getText('Nous contacter', 'Contact us', 'Contáctanos', 'تواصل معنا')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
