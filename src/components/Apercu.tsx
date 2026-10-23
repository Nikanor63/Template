'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowLeft, Check, Minus, PenLine, Plus } from 'lucide-react'
import { CvThumbnail } from '@/components/cv/cv-thumbnail'
import { FavoriteButton } from '@/components/site/favorite-button'
import { TemplateCard } from '@/components/site/template-card'
import { useOpenTemplate } from '@/hooks/use-open-template'
import type { CvDesign, CvElement, CvTemplate } from '@/lib/cv-shared/types'

export default function Apercu({
  template: modele,
  similar: modelesSimilaires,
  categoryTemplates: modelesCategorie,
  thumbnails: miniatures,
}: {
  template: CvTemplate
  similar: CvTemplate[]
  categoryTemplates: CvTemplate[]
  thumbnails: Record<string, string>
}) {
  const ouvrirModele = useOpenTemplate()
  const [grossissement, setGrossissement] = useState(1)
  const [couleurChoisie, setCouleurChoisie] = useState(modele.accent)

  const couleurs = Array.from(new Set(modelesCategorie.map((modeleListe) => modeleListe.accent)))
  const apercuDesign = useMemo(() => {
    const remplacerCouleur = (valeur: string) => valeur.toLowerCase() === modele.accent.toLowerCase() ? couleurChoisie : valeur
    const elements = modele.design.elements.map((element) => {
      if (element.type === 'text' || element.type === 'icon') return { ...element, color: remplacerCouleur(element.color) }
      if (element.type === 'rect' || element.type === 'circle') return { ...element, fill: remplacerCouleur(element.fill), stroke: remplacerCouleur(element.stroke) }
      if (element.type === 'line' || element.type === 'image') return { ...element, stroke: remplacerCouleur(element.stroke) }
      return element
    }) as CvElement[]
    return { ...modele.design, elements } as CvDesign
  }, [couleurChoisie, modele])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <Link href="/modeles" className="mb-6 inline-flex items-center gap-2 text-sm font-extrabold uppercase hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden />
        Retour aux modèles
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <section aria-label="Aperçu du CV" className="relative flex flex-col items-center rounded-3xl bg-secondary/70 p-6 md:p-10">
          <div className="max-h-[78vh] w-full overflow-auto rounded-xl">
            <div className="mx-auto transition-[width] duration-300" style={{ width: `${Math.min(100, 62 * grossissement)}%`, minWidth: 260 }}>
              <div className="overflow-hidden rounded-md bg-white shadow-cv">
                <CvThumbnail design={apercuDesign} alt={`CV ${modele.name} en grand format`} />
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-border">
            <button
              type="button"
              onClick={() => setGrossissement((niveau) => Math.max(0.6, +(niveau - 0.2).toFixed(1)))}
              aria-label="Dégrossissementer"
              className="grid size-9 place-items-center rounded-full hover:bg-muted"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-14 text-center text-sm font-bold tabular-nums">{Math.round(grossissement * 100)}%</span>
            <button
              type="button"
              onClick={() => setGrossissement((niveau) => Math.min(1.6, +(niveau + 0.2).toFixed(1)))}
              aria-label="Agrandir"
              className="grid size-9 place-items-center rounded-full hover:bg-muted"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </section>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <span className="w-fit rounded-full bg-accent-yellow px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">
            {modele.category}
          </span>
          <div>
            <h1 className="mb-2 font-display text-4xl font-extrabold uppercase tracking-tight text-ink">{modele.name}</h1>
            <p className="leading-relaxed text-muted-foreground uppercase font-extrabold">
              Un modèle {modele.category.toLowerCase()} entièrement modifiable : textes, couleurs, polices, photo et
              mise en page. Format A4 prêt à imprimer.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => ouvrirModele(modele)}
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-primary uppercase font-extrabold text-ink shadow-primary transition-transform hover:-translate-y-0.5"
            >
              <PenLine className="size-5" aria-hidden />
              Personnaliser ce modèle
            </button>
            <FavoriteButton templateId={modele.id} name={modele.name} withLabel className="h-13 w-full ring-border" />
          </div>

          {couleurs.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-extrabold uppercase text-ink">Palette</h2>
              <ul className="flex flex-wrap gap-2">
                {couleurs.map((couleur) => (
                  <li key={couleur}>
                    <button
                      type="button"
                      onClick={() => setCouleurChoisie(couleur)}
                      aria-label={`Appliquer la couleur ${couleur} à l’aperçu`}
                      aria-pressed={(couleurChoisie ?? modele.accent) === couleur}
                      className={`grid size-9 place-items-center rounded-full transition-transform uppercase hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                        (couleurChoisie ?? modele.accent) === couleur ? 'ring-2 ring-ink ring-offset-2' : 'ring-1 ring-black/10'
                      }`}
                      style={{ background: couleur }}
                      title={`Appliquer ${couleur}`}
                    >
                      <span className="sr-only">{couleur}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2 className="mb-3 text-sm font-extrabold uppercase text-ink">Inclus</h2>
            <ul className="flex flex-col gap-2 text-sm uppercase font-extrabold text-ink/80">
              {['Format A4 (210 × 297 mm)', 'Export PDF, PNG, JPG, SVG', 'Polices et couleurs modifiables', 'Compatible création par IA'].map(
                (fonctionnalite) => (
                  <li key={fonctionnalite} className="flex items-center gap-2">
                    <span className="grid size-5 place-items-center rounded-full bg-primary/20">
                      <Check className="size-3.5 text-ink font-extrabold" aria-hidden />
                    </span>
                    {fonctionnalite}
                  </li>
                ),
              )}
            </ul>
          </div>

          {modele.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Mots-clés">
              {modele.tags.map((motCle) => (
                <li key={motCle}>
                  <Link
                    href={`/modeles?q=${encodeURIComponent(motCle)}`}
                    className="rounded-full bg-muted px-3 py-1 text-xl font-extrabold text-ink/80 hover:bg-secondary"
                  >
                    #{motCle}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {modelesSimilaires.length > 0 && (
        <section aria-labelledby="similar-title" className="mt-20">
          <h2 id="similar-title" className="mb-8 font-display text-2xl font-extrabold uppercase text-ink">
            Modèles similaires
          </h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
            {modelesSimilaires.map((modeleSimilaire) => (
              <TemplateCard key={modeleSimilaire.id} template={modeleSimilaire} thumbnail={miniatures[modeleSimilaire.id]} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
