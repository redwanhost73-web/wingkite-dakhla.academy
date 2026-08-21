'use client'

import Image from 'next/image'
import { useTranslations } from '@/lib/i18n-context'
import { useSiteConfig } from '@/hooks/use-site-config'
import { Reveal } from '@/components/reveal'
import { EditableImage, EditableText, useEditableImageSrc } from '@/components/edit-mode/editable'
import { DEFAULT_IMAGES } from '@/lib/site-config'
import type { Localized } from '@/lib/cms/types'

const loc = (fr: string, en: string, es: string, ar: string): Localized => ({ fr, en, es, ar })

const STEPS: Array<{
  n: string
  title: Localized
  desc: Localized
  titleKey: string
  descKey: string
}> = [
  {
    n: '01',
    titleKey: 'home.path.step1.title',
    descKey: 'home.path.step1.desc',
    title: loc('Choisissez votre offre', 'Pick your offer', 'Elige tu oferta', 'اختر عرضك'),
    desc: loc(
      'Pack séjour ou heures de cours — wingfoil ou kitesurf, selon votre niveau.',
      'Stay pack or lesson hours — wingfoil or kitesurf, matched to your level.',
      'Pack de estancia o horas de clase — wingfoil o kitesurf, según tu nivel.',
      'باقة إقامة أو ساعات دروس — وينج فويل أو كايت سيرف حسب مستواك.',
    ),
  },
  {
    n: '02',
    titleKey: 'home.path.step2.title',
    descKey: 'home.path.step2.desc',
    title: loc('Apprenez sur le lagon', 'Learn on the lagoon', 'Aprende en la laguna', 'تعلّم على البحيرة'),
    desc: loc(
      'Coaching IKO, casques radio et bateau de sécurité pour progresser vite et sereinement.',
      'IKO coaching, radio helmets and a safety boat so you progress fast and safely.',
      'Coaching IKO, cascos con radio y barco de seguridad para progresar rápido y seguro.',
      'تدريب IKO وخوذات راديو وقارب أمان لتتقدم بسرعة وبأمان.',
    ),
  },
  {
    n: '03',
    titleKey: 'home.path.step3.title',
    descKey: 'home.path.step3.desc',
    title: loc('Ridez en liberté', 'Ride with freedom', 'Ride con libertad', 'انطلق بحرية'),
    desc: loc(
      'Sessions flat water, vent régulier et sensations uniques au cœur de Dakhla.',
      'Flat-water sessions, steady wind, and unique feelings in the heart of Dakhla.',
      'Sesiones en agua plana, viento constante y sensaciones únicas en Dakhla.',
      'جلسات على ماء مسطح ورياح ثابتة وأحاسيس فريدة في قلب الداخلة.',
    ),
  },
]

/** Editorial “how it works” strip — keeps the home page organized after packs. */
export function HomePathSection() {
  const { locale } = useTranslations()
  const { images, texts } = useSiteConfig()
  const img = images.homeAction || DEFAULT_IMAGES.homeAction
  const src = useEditableImageSrc('homeAction', img)

  return (
    <section
      id="path"
      className="relative overflow-hidden bg-white section-y scroll-mt-28"
      data-nav-theme="light"
    >
      <div className="container-editorial">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="relative aspect-4/5 overflow-hidden rounded-[28px] bg-[#0B1F3B]">
                <EditableImage fieldKey="homeAction" src={src} label="Home path image" className="absolute inset-0">
                  <Image
                    src={src}
                    alt={
                      locale === 'fr'
                        ? 'Session wingfoil'
                        : locale === 'es'
                          ? 'Sesión de wingfoil'
                          : locale === 'ar'
                            ? 'جلسة وينج فويل'
                            : 'Wingfoil session'
                    }
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    quality={75}
                    className="object-cover"
                  />
                </EditableImage>
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-[#0B1F3B]/50 via-transparent to-transparent"
                />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <EditableText
                fieldKey="home.path.eyebrow"
                label="Home path eyebrow"
                as="p"
                className="eyebrow text-[#0046A4]"
                defaults={loc('Votre séjour', 'Your stay', 'Tu estancia', 'إقامتك')}
                cms={texts['home.path.eyebrow']}
              />
            </Reveal>
            <Reveal delay={80}>
              <EditableText
                fieldKey="home.path.title"
                label="Home path title"
                as="h2"
                className="font-heading text-section text-[#072A5A] mt-6 text-balance"
                defaults={loc(
                  'Simple, clair, orienté progression',
                  'Simple, clear, built for progress',
                  'Simple, claro, pensado para progresar',
                  'بسيط وواضح ومصمم للتقدم',
                )}
                cms={texts['home.path.title']}
              />
            </Reveal>

            <ol className="mt-10 space-y-0">
              {STEPS.map((step, i) => (
                <Reveal key={step.n} delay={120 + i * 70}>
                  <li className="grid grid-cols-[auto_1fr] gap-5 border-t border-[#E8E1D6] py-7 first:border-t-0 first:pt-2">
                    <span className="font-heading text-2xl font-bold tracking-tight text-[#C9A66B]">
                      {step.n}
                    </span>
                    <div>
                      <EditableText
                        fieldKey={step.titleKey}
                        label={`Path step ${step.n} title`}
                        as="h3"
                        className="font-heading text-xl font-bold tracking-tight text-[#072A5A]"
                        defaults={step.title}
                        cms={texts[step.titleKey]}
                      />
                      <EditableText
                        fieldKey={step.descKey}
                        label={`Path step ${step.n} desc`}
                        as="p"
                        className="mt-2 max-w-lg text-sm leading-relaxed text-[#5A6B85]"
                        defaults={step.desc}
                        cms={texts[step.descKey]}
                      />
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
