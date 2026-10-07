'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowLeft, Check, Minus, PenLine, Plus } from 'lucide-react'
import { CvThumbnail } from '@/components/cv/cv-thumbnail'
import { FavoriteButton } from '@/components/site/favorite-button'
import { TemplateCard } from '@/components/site/template-card'
import { useOpenTemplate } from '@/hooks/use-open-template'
import { getTemplate } from '@/lib/cv/templates'

gsap.registerPlugin(useGSAP)

export default function Apercu({
  templateId,
  similarIds,
  thumbnails,
}: {
  templateId: string
  similarIds: string[]
  thumbnails: Record<string, string>
}) {
  const template = getTemplate(templateId)!
  const similar = similarIds.map((id) => getTemplate(id)!).filter(Boolean)
  const open = useOpenTemplate()
  const [zoom, setZoom] = useState(1)
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.apercu-paper', { y: 60, opacity: 0, rotate: -2, duration: 1, ease: 'expo.out' })
        gsap.from('.apercu-info > *', { x: 30, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out', delay: 0.15 })
      })
    },
    { scope: root },
  )

  const colors = Array.from(
    new Set(
      template.design.elements
        .flatMap((el) => [('fill' in el && el.fill) || '', ('color' in el && el.color) || ''])
        .filter((c) => c && c !== 'transparent'),
    ),
  ).slice(0, 5)

  return (
    <div ref={root} className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <Link href="/modeles" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-ink/70 hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden />
        Retour aux modèles
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <section aria-label="Aperçu du CV" className="relative flex flex-col items-center rounded-3xl bg-secondary/70 p-6 md:p-10">
          <div className="max-h-[78vh] w-full overflow-auto rounded-xl">
            <div className="mx-auto transition-[width] duration-300" style={{ width: `${Math.min(100, 62 * zoom)}%`, minWidth: 260 }}>
              <div className="apercu-paper overflow-hidden rounded-md bg-white shadow-[0_30px_70px_-25px_rgba(14,34,56,0.5)]">
                <CvThumbnail design={template.design} thumbnail={thumbnails[template.id]} alt={`CV ${template.name} en grand format`} />
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-border">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(1)))}
              aria-label="Dézoomer"
              className="grid size-9 place-items-center rounded-full hover:bg-muted"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-14 text-center text-sm font-bold tabular-nums">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.2).toFixed(1)))}
              aria-label="Zoomer"
              className="grid size-9 place-items-center rounded-full hover:bg-muted"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </section>

        <aside className="apercu-info flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <span className="w-fit rounded-full bg-accent-yellow px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">
            {template.category}
          </span>
          <div>
            <h1 className="mb-2 font-display text-4xl font-extrabold tracking-tight text-ink">{template.name}</h1>
            <p className="leading-relaxed text-muted-foreground">
              Un modèle {template.category.toLowerCase()} entièrement modifiable : textes, couleurs, polices, photo et
              mise en page. Format A4 prêt à imprimer.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => open(template)}
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-primary font-bold text-ink shadow-[0_10px_30px_-10px_rgba(92,175,231,0.9)] transition-transform hover:-translate-y-0.5"
            >
              <PenLine className="size-5" aria-hidden />
              Personnaliser ce modèle
            </button>
            <FavoriteButton templateId={template.id} name={template.name} withLabel className="h-13 w-full ring-border" />
          </div>

          {colors.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-bold text-ink">Palette</h2>
              <ul className="flex gap-2">
                {colors.map((c) => (
                  <li key={c} className="size-9 rounded-full ring-1 ring-black/10" style={{ background: c }} title={c}>
                    <span className="sr-only">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2 className="mb-3 text-sm font-bold text-ink">Inclus</h2>
            <ul className="flex flex-col gap-2 text-sm text-ink/80">
              {['Format A4 (210 × 297 mm)', 'Export PDF, PNG, JPG, SVG', 'Polices et couleurs modifiables', 'Compatible création par IA'].map(
                (f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="grid size-5 place-items-center rounded-full bg-primary/20">
                      <Check className="size-3.5 text-ink" aria-hidden />
                    </span>
                    {f}
                  </li>
                ),
              )}
            </ul>
          </div>

          {template.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Mots-clés">
              {template.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/modeles?q=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-ink/80 hover:bg-secondary"
                  >
                    #{tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {similar.length > 0 && (
        <section aria-labelledby="similar-title" className="mt-20">
          <h2 id="similar-title" className="mb-8 font-display text-2xl font-extrabold text-ink">
            Modèles similaires
          </h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
            {similar.map((t) => (
              <TemplateCard key={t.id} template={t} thumbnail={thumbnails[t.id]} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
