'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { Play } from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'
import { useSiteConfig } from '@/hooks/use-site-config'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { ActivityStoryProvider, useActivityStory } from '@/components/activity-story'
import { GALLERY_CATEGORIES, type GalleryCategory, type GalleryItem } from '@/lib/gallery'
import { cn } from '@/lib/utils'
import type { Localized } from '@/lib/cms/types'

function pick(text: Localized | undefined, locale: string) {
  if (!text) return ''
  if (locale === 'fr') return text.fr || text.en
  if (locale === 'es') return text.es || text.en
  if (locale === 'ar') return text.ar || text.en
  return text.en || text.fr
}

function isRemote(src: string) {
  return src.startsWith('http://') || src.startsWith('https://')
}

function categoryLabel(id: GalleryCategory, locale: string) {
  const map: Record<GalleryCategory, Localized> = {
    school: { fr: 'École', en: 'School', es: 'Escuela', ar: 'المدرسة' },
    wingfoil: { fr: 'Wingfoil', en: 'Wingfoil', es: 'Wingfoil', ar: 'وينج فويل' },
    kitesurf: { fr: 'Kitesurf', en: 'Kitesurf', es: 'Kitesurf', ar: 'كايت سيرف' },
    lagoon: { fr: 'Lagon', en: 'Lagoon', es: 'Laguna', ar: 'البحيرة' },
    camp: { fr: 'Camp', en: 'Camp', es: 'Campamento', ar: 'المخيم' },
    other: { fr: 'Autre', en: 'Other', es: 'Otro', ar: 'أخرى' },
  }
  return pick(map[id], locale)
}

function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const { locale } = useTranslations()
  const story = useActivityStory()
  const [filter, setFilter] = useState<GalleryCategory | 'all'>('all')

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.category === filter)),
    [filter, items],
  )

  const urls = filtered.map((i) => i.url)
  const usedCategories = useMemo(() => {
    const set = new Set(items.map((i) => i.category))
    return GALLERY_CATEGORIES.filter((c) => set.has(c.id))
  }, [items])

  const openAt = (index: number) => {
    if (!story || !urls.length) return
    const item = filtered[index]
    story.openStory({
      images: urls,
      title: pick(item?.title, locale) || pick(
        { fr: 'Galerie', en: 'Gallery', es: 'Galería', ar: 'المعرض' },
        locale,
      ),
      startIndex: index,
      showBookCta: false,
    })
  }

  return (
    <section className="container-editorial py-16 lg:py-24">
      <Reveal>
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A66B]">
              {pick({ fr: 'En images', en: 'In pictures', es: 'En imágenes', ar: 'بالصور' }, locale)}
            </p>
            <h2 className="mt-3 font-heading text-section font-bold tracking-tight text-[#072A5A]">
              {pick(
                {
                  fr: 'L’école, le lagon, les sensations',
                  en: 'The school, the lagoon, the feeling',
                  es: 'La escuela, la laguna, la sensación',
                  ar: 'المدرسة والبحيرة والإحساس',
                },
                locale,
              )}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5A6B85]">
              {pick(
                {
                  fr: 'Ouvrez le mode story pour parcourir les photos comme sur Instagram.',
                  en: 'Open story mode to swipe through photos like Instagram.',
                  es: 'Abre el modo historia para deslizar las fotos como en Instagram.',
                  ar: 'افتح وضع القصة لتصفح الصور كما في إنستغرام.',
                },
                locale,
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={cn(
                'rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors',
                filter === 'all'
                  ? 'bg-[#072A5A] text-white'
                  : 'bg-[#F0EBE3] text-[#072A5A] hover:bg-[#E5DED3]',
              )}
            >
              {pick({ fr: 'Tout', en: 'All', es: 'Todo', ar: 'الكل' }, locale)}
            </button>
            {usedCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                className={cn(
                  'rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors',
                  filter === c.id
                    ? 'bg-[#072A5A] text-white'
                    : 'bg-[#F0EBE3] text-[#072A5A] hover:bg-[#E5DED3]',
                )}
              >
                {categoryLabel(c.id, locale)}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-[#5A6B85]">
          {pick(
            {
              fr: 'Aucune photo dans cette catégorie pour le moment.',
              en: 'No photos in this category yet.',
              es: 'Aún no hay fotos en esta categoría.',
              ar: 'لا توجد صور في هذه الفئة بعد.',
            },
            locale,
          )}
        </p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((item, index) => {
            const title = pick(item.title, locale)
            const caption = pick(item.caption, locale)
            return (
              <Reveal key={item.id} className="mb-4 break-inside-avoid">
                <button
                  type="button"
                  onClick={() => openAt(index)}
                  className="group relative block w-full overflow-hidden rounded-sm bg-[#0B1F3B] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0046A4]"
                >
                  <div className="relative aspect-4/5 w-full overflow-hidden">
                    <Image
                      src={item.url}
                      alt={title || 'Gallery photo'}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={75}
                      unoptimized={isRemote(item.url)}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#0B1F3B]/80 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
                    <span className="absolute left-3 top-3 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      {categoryLabel(item.category, locale)}
                    </span>
                    <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#072A5A] opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-90">
                      <Play className="h-4 w-4 fill-current" />
                    </span>
                    {(title || caption) && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        {title ? (
                          <p className="font-heading text-sm font-bold tracking-tight">{title}</p>
                        ) : null}
                        {caption ? (
                          <p className="mt-0.5 line-clamp-2 text-xs text-white/75">{caption}</p>
                        ) : null}
                      </div>
                    )}
                  </div>
                </button>
              </Reveal>
            )
          })}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => openAt(0)}
            className="inline-flex items-center gap-2 rounded-full bg-[#0046A4] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_32px_rgba(0,70,164,0.28)] transition-colors hover:bg-[#0057D1]"
          >
            <Play className="h-4 w-4 fill-current" />
            {pick(
              {
                fr: 'Lancer le mode story',
                en: 'Start story mode',
                es: 'Iniciar modo historia',
                ar: 'تشغيل وضع القصة',
              },
              locale,
            )}
          </button>
        </div>
      ) : null}
    </section>
  )
}

export function GalleryContent() {
  const { locale } = useTranslations()
  const { images, gallery } = useSiteConfig()
  const hero = images.homeLagoon || images.homeHero
  const published = gallery.filter((g) => g.published && g.url)

  return (
    <ActivityStoryProvider>
      <main className="overflow-hidden bg-[#FAF8F3]">
        <PageHero
          image={hero}
          eyebrow={
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/80">
              Wing Kite Dakhla
            </span>
          }
          title={pick(
            {
              fr: 'Galerie',
              en: 'Gallery',
              es: 'Galería',
              ar: 'المعرض',
            },
            locale,
          )}
          subtitle={pick(
            {
              fr: 'Moments de wingfoil, kitesurf et vie à l’école sur le lagon de Dakhla.',
              en: 'Wingfoil, kitesurf, and school life on the Dakhla lagoon.',
              es: 'Wingfoil, kitesurf y vida en la escuela en la laguna de Dakhla.',
              ar: 'لحظات الوينج فويل والكايت سيرف وحياة المدرسة على بحيرة الداخلة.',
            },
            locale,
          )}
        />
        <GalleryGrid items={published} />
      </main>
    </ActivityStoryProvider>
  )
}
