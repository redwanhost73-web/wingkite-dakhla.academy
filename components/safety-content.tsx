'use client'

import Image from 'next/image'
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
import {
  EditableImage,
  EditableLink,
  EditableText,
  useEditableImageSrc,
} from '@/components/edit-mode/editable'
import type { Localized } from '@/lib/cms/types'

const loc = (fr: string, en: string, es: string, ar: string): Localized => ({ fr, en, es, ar })

export function SafetyContent() {
  const { locale } = useTranslations()
  const { images, texts } = useSiteConfig()
  const hero = images.aboutHero || DEFAULT_IMAGES.aboutHero
  const gearImg = images.aboutAction1 || DEFAULT_IMAGES.aboutAction1
  const spotImg = images.aboutLocation || DEFAULT_IMAGES.aboutLocation
  const gearSrc = useEditableImageSrc('aboutAction1', gearImg)
  const spotSrc = useEditableImageSrc('aboutLocation', spotImg)

  const protocols = [
    {
      id: 'iko',
      icon: BadgeCheck,
      title: loc('Moniteurs certifiés IKO', 'IKO-certified instructors', 'Monitores certificados IKO', 'مدربون معتمدون IKO'),
      desc: loc(
        'Encadrement professionnel et standards internationaux pour progresser en confiance.',
        'Professional coaching and international standards so you progress with confidence.',
        'Entrenamiento profesional y estándares internacionales para progresar con confianza.',
        'تدريب احترافي ومعايير دولية لتتقدم بثقة.',
      ),
    },
    {
      id: 'radio',
      icon: Radio,
      title: loc('Casque et walkie-talkie', 'Helmet & walkie-talkie', 'Casco y walkie-talkie', 'خوذة وجهاز لاسلكي'),
      desc: loc(
        "Coaching en temps réel sur l'eau : corrections immédiates, contact permanent.",
        'Real-time coaching on the water: instant corrections, constant contact.',
        'Coaching en tiempo real en el agua: correcciones inmediatas, contacto permanente.',
        'تدريب فوري على الماء: تصحيحات مباشرة واتصال دائم.',
      ),
    },
    {
      id: 'boat',
      icon: Ship,
      title: loc('Bateau de sécurité', 'Safety boat', 'Barco de seguridad', 'قارب الأمان'),
      desc: loc(
        'Assistance rapide pendant vos sessions pour une pratique sereine.',
        'Fast assistance during your sessions for peace of mind.',
        'Asistencia rápida durante tus sesiones para practicar con tranquilidad.',
        'مساعدة سريعة أثناء جلساتك لممارسة مطمئنة.',
      ),
    },
    {
      id: 'vest',
      icon: LifeBuoy,
      title: loc('Équipement de protection', 'Protective gear', 'Equipo de protección', 'معدات الحماية'),
      desc: loc(
        'Gilet de sécurité, casque et protocoles stricts sur chaque cours.',
        'Safety vest, helmet and strict protocols on every lesson.',
        'Chaleco de seguridad, casco y protocolos estrictos en cada clase.',
        'سترة نجاة وخوذة وبروتوكولات صارمة في كل درس.',
      ),
    },
  ]

  const materials = [
    {
      id: 'premium',
      icon: Sparkles,
      title: loc('Matériel haut de gamme', 'Premium equipment', 'Material de alta gama', 'معدات فاخرة'),
      desc: loc(
        'Wings, kites et planches récents, entretenus et adaptés à votre niveau.',
        'Recent wings, kites and boards — maintained and matched to your level.',
        'Wings, kites y tablas recientes, mantenidos y adaptados a tu nivel.',
        'أجنحة وكايت وألواح حديثة ومعتنى بها ومكيفة لمستواك.',
      ),
    },
    {
      id: 'radioHelmet',
      icon: HardHat,
      title: loc('Casques radio', 'Radio helmets', 'Cascos con radio', 'خوذات راديو'),
      desc: loc(
        'Communication claire instructeur ↔ élève, même au large.',
        'Clear instructor ↔ student communication, even farther out.',
        'Comunicación clara instructor ↔ alumno, incluso lejos de la orilla.',
        'تواصل واضح بين المدرب والطالب حتى بعيدًا عن الشاطئ.',
      ),
    },
    {
      id: 'spot',
      icon: Waves,
      title: loc('Spot facile et eau plate', 'Easy spot & flat water', 'Spot fácil y agua plana', 'موقع سهل وماء مسطح'),
      desc: loc(
        'Lagon de Dakhla : conditions idéales pour débuter et monter en niveau.',
        'Dakhla lagoon: ideal conditions to start and progress.',
        'Laguna de Dakhla: condiciones ideales para empezar y progresar.',
        'بحيرة الداخلة: ظروف مثالية للبداية وتطوير المستوى.',
      ),
    },
    {
      id: 'transfer',
      icon: Car,
      title: loc('Transfert aller et retour', 'Round-trip transfer', 'Traslado de ida y vuelta', 'نقل ذهاب وإياب'),
      desc: loc(
        'Prise en charge confortable vers le spot et retour inclus.',
        'Comfortable pickup to the spot and return included.',
        'Recogida cómoda hacia el spot y vuelta incluida.',
        'توصيل مريح إلى الموقع والعودة مشمولة.',
      ),
    },
  ]

  const jumpLinks = [
    {
      href: '#security',
      key: 'protocols',
      label: loc('Protocoles', 'Protocols', 'Protocolos', 'البروتوكولات'),
    },
    {
      href: '#equipment',
      key: 'equipment',
      label: loc('Matériel', 'Equipment', 'Material', 'المعدات'),
    },
    {
      href: '#spot',
      key: 'spot',
      label: loc('Spot', 'Spot', 'Spot', 'الموقع'),
    },
  ]

  return (
    <div className="overflow-hidden">
      <PageHero
        image={hero}
        imageKey="aboutHero"
        eyebrow={
          <EditableText
            fieldKey="safety.hero.eyebrow"
            label="Safety hero eyebrow"
            defaults={loc('Sécurité & matériel', 'Safety & gear', 'Seguridad y material', 'السلامة والمعدات')}
            cms={texts['safety.hero.eyebrow']}
          />
        }
        title={
          <EditableText
            fieldKey="safety.hero.title"
            label="Safety hero title"
            defaults={loc(
              "Sécurité et matériels d'exception",
              'Exceptional safety and equipment',
              'Seguridad y material excepcional',
              'سلامة ومعدات استثنائية',
            )}
            cms={texts['safety.hero.title']}
          />
        }
        subtitle={
          <EditableText
            fieldKey="safety.hero.subtitle"
            label="Safety hero subtitle"
            defaults={loc(
              'Découvrez les protocoles, le bateau de sécurité et le matériel premium de Wing Kite Dakhla Academy.',
              'Explore the protocols, safety boat and premium gear at Wing Kite Dakhla Academy.',
              'Descubre los protocolos, el barco de seguridad y el material premium de Wing Kite Dakhla Academy.',
              'اكتشف البروتوكولات وقارب الأمان والمعدات الفاخرة في Wing Kite Dakhla Academy.',
            )}
            cms={texts['safety.hero.subtitle']}
          />
        }
      />

      <section className="border-b border-[#072A5A]/8 bg-[#FAF8F3] py-4" data-nav-theme="light">
        <div className="container-editorial flex flex-wrap gap-2 sm:gap-3">
          {jumpLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full border border-[#072A5A]/10 bg-white px-4 py-2 text-xs font-bold text-[#072A5A] transition-colors hover:border-[#0046A4]/30 hover:text-[#0046A4]"
            >
              <EditableText
                fieldKey={`safety.jump.${item.key}`}
                label={`Safety jump — ${item.key}`}
                as="span"
                defaults={item.label}
                cms={texts[`safety.jump.${item.key}`]}
              />
            </a>
          ))}
        </div>
      </section>

      <section id="security" className="surface-noise relative overflow-hidden bg-white section-y scroll-mt-28" data-nav-theme="light">
        <span aria-hidden className="blob -top-24 -right-24 h-104 w-104 bg-[#0046A4]/8" />
        <div className="container-editorial relative z-10">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0046A4]/10 text-[#0046A4]">
                <Shield className="h-5 w-5" aria-hidden />
              </span>
              <EditableText
                fieldKey="safety.protocols.eyebrow"
                label="Protocols eyebrow"
                as="p"
                className="eyebrow text-[#0046A4] mt-5"
                defaults={loc('Priorité absolue', 'Top priority', 'Prioridad absoluta', 'أولوية قصوى')}
                cms={texts['safety.protocols.eyebrow']}
              />
              <EditableText
                fieldKey="safety.protocols.title"
                label="Protocols title"
                as="h2"
                className="font-heading text-section text-[#072A5A] mt-4 text-balance"
                defaults={loc('Protocoles de sécurité', 'Safety protocols', 'Protocolos de seguridad', 'بروتوكولات السلامة')}
                cms={texts['safety.protocols.title']}
              />
              <EditableText
                fieldKey="safety.protocols.intro"
                label="Protocols intro"
                as="p"
                className="text-body-lg text-[#3D4F6F] mt-5"
                defaults={loc(
                  'Chaque cours suit des standards stricts pour que vous progressiez en confiance.',
                  'Every lesson follows strict standards so you progress with confidence.',
                  'Cada clase sigue estándares estrictos para que progreses con confianza.',
                  'كل درس يتبع معايير صارمة لتتقدم بثقة.',
                )}
                cms={texts['safety.protocols.intro']}
              />
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
            {protocols.map(({ id, icon: Icon, title, desc }, i) => (
              <Reveal key={id} delay={i * 90}>
                <article id={id} className="group card-premium card-lift h-full p-7 scroll-mt-28">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B1F3B] text-white transition-transform duration-450 group-hover:scale-105">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <EditableText
                    fieldKey={`safety.protocols.${id}.title`}
                    label={`Protocol ${id} title`}
                    as="h3"
                    className="font-heading text-lg font-bold text-[#072A5A] mt-5"
                    defaults={title}
                    cms={texts[`safety.protocols.${id}.title`]}
                  />
                  <EditableText
                    fieldKey={`safety.protocols.${id}.desc`}
                    label={`Protocol ${id} description`}
                    as="p"
                    className="text-small text-[#3D4F6F] mt-2 leading-relaxed"
                    defaults={desc}
                    cms={texts[`safety.protocols.${id}.desc`]}
                  />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="equipment"
        className="surface-noise relative overflow-hidden bg-[#F6F1E8] section-y scroll-mt-28"
        data-nav-theme="light"
      >
        <div className="container-editorial relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal direction="right">
              <div className="relative aspect-4/3 overflow-hidden rounded-[28px] shadow-[0_40px_90px_rgba(0,70,164,0.08)]">
                <EditableImage fieldKey="aboutAction1" src={gearSrc} label="Safety — Gear" className="absolute inset-0">
                  <Image
                    src={gearSrc}
                    alt="Premium gear"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    loading="lazy"
                    quality={75}
                    className="object-cover"
                  />
                </EditableImage>
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
                <EditableText
                  fieldKey="safety.gear.eyebrow"
                  label="Gear eyebrow"
                  as="p"
                  className="eyebrow text-[#0046A4]"
                  defaults={loc('Matériel inclus', 'Gear included', 'Material incluido', 'المعدات مشمولة')}
                  cms={texts['safety.gear.eyebrow']}
                />
                <EditableText
                  fieldKey="safety.gear.title"
                  label="Gear title"
                  as="h2"
                  className="font-heading text-section text-[#072A5A] mt-4 text-balance"
                  defaults={loc(
                    'Du matériel haut de gamme, adapté à votre niveau',
                    'Premium gear matched to your level',
                    'Material de alta gama adaptado a tu nivel',
                    'معدات فاخرة مكيفة لمستواك',
                  )}
                  cms={texts['safety.gear.title']}
                />
                <EditableText
                  fieldKey="safety.gear.intro"
                  label="Gear intro"
                  as="p"
                  className="text-body-lg text-[#3D4F6F] mt-5"
                  defaults={loc(
                    'Kite ou wing, planche, combinaison, gilet, casque et walkie-talkie — tout est prévu pour votre session.',
                    'Kite or wing, board, wetsuit, vest, helmet and walkie-talkie — everything ready for your session.',
                    'Kite o wing, tabla, neopreno, chaleco, casco y walkie-talkie — todo listo para tu sesión.',
                    'كايت أو وينج، لوح، بدلة، سترة، خوذة وجهاز لاسلكي — كل شيء جاهز لجلستك.',
                  )}
                  cms={texts['safety.gear.intro']}
                />
              </Reveal>

              <div className="mt-8 space-y-4">
                {materials.slice(0, 2).map(({ id, icon: Icon, title, desc }, i) => (
                  <Reveal key={id} delay={i * 100}>
                    <div className="flex gap-4 rounded-[20px] bg-white/70 p-5 border border-[#072A5A]/6">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#C9A66B] text-[#0B1F3B]">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div>
                        <EditableText
                          fieldKey={`safety.gear.${id}.title`}
                          label={`Gear ${id} title`}
                          as="p"
                          className="font-heading text-base font-bold text-[#072A5A]"
                          defaults={title}
                          cms={texts[`safety.gear.${id}.title`]}
                        />
                        <EditableText
                          fieldKey={`safety.gear.${id}.desc`}
                          label={`Gear ${id} description`}
                          as="p"
                          className="text-small text-[#3D4F6F] mt-1"
                          defaults={desc}
                          cms={texts[`safety.gear.${id}.desc`]}
                        />
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="spot" className="relative overflow-hidden bg-[#0B1F3B] section-y scroll-mt-28" data-nav-theme="dark">
        <div className="absolute inset-0 z-0">
          <EditableImage fieldKey="aboutLocation" src={spotSrc} label="Safety — Spot" className="absolute inset-0">
            <Image
              src={spotSrc}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              loading="lazy"
              quality={70}
              className="object-cover opacity-40"
            />
          </EditableImage>
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
              <EditableText
                fieldKey="safety.spot.eyebrow"
                label="Spot eyebrow"
                as="p"
                className="eyebrow text-[#5AA8FF]"
                defaults={loc('Lagon de Dakhla', 'Dakhla Lagoon', 'Laguna de Dakhla', 'بحيرة الداخلة')}
                cms={texts['safety.spot.eyebrow']}
              />
              <EditableText
                fieldKey="safety.spot.title"
                label="Spot title"
                as="h2"
                className="font-heading text-section text-white mt-4 text-balance"
                defaults={loc(
                  'Spot sûr et conditions idéales',
                  'Safe spot & ideal conditions',
                  'Spot seguro y condiciones ideales',
                  'موقع آمن وظروف مثالية',
                )}
                cms={texts['safety.spot.title']}
              />
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {materials.slice(2).map(({ id, icon: Icon, title, desc }, i) => (
              <Reveal key={id} delay={i * 110}>
                <article className="rounded-[24px] border border-white/12 bg-white/8 p-7 backdrop-blur-md">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A66B] text-[#0B1F3B]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <EditableText
                    fieldKey={`safety.gear.${id}.title`}
                    label={`Spot card ${id} title`}
                    as="h3"
                    className="font-heading text-lg font-bold text-white mt-5"
                    defaults={title}
                    cms={texts[`safety.gear.${id}.title`]}
                  />
                  <EditableText
                    fieldKey={`safety.gear.${id}.desc`}
                    label={`Spot card ${id} description`}
                    as="p"
                    className="text-small text-white/65 mt-2 leading-relaxed"
                    defaults={desc}
                    cms={texts[`safety.gear.${id}.desc`]}
                  />
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={280}>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <EditableLink
                fieldKey="safety.cta.pricing"
                label="Safety CTA pricing"
                href={`/${locale}/pricing`}
                className="group btn-pill bg-[#C9A66B] text-[#0B1F3B] hover:bg-[#C9A66B]"
                defaults={loc('Voir les tarifs', 'View pricing', 'Ver precios', 'عرض الأسعار')}
                cms={texts['safety.cta.pricing']}
                after={
                  <ArrowRight className="h-5 w-5 transition-transform duration-400 group-hover:translate-x-1" />
                }
              />
              <EditableLink
                fieldKey="safety.cta.contact"
                label="Safety CTA contact"
                href={`/${locale}/contact`}
                className="btn-pill border border-white/25 bg-white/10 text-white hover:bg-white/15"
                defaults={loc('Nous contacter', 'Contact us', 'Contáctanos', 'تواصل معنا')}
                cms={texts['safety.cta.contact']}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
