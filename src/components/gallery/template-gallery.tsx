'use client'

import { useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Heart, Plus, Search, SlidersHorizontal, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CATEGORIES, TEMPLATES } from '@/lib/cv/templates'
import type { CvTemplate, TemplateCategory } from '@/lib/cv/types'
import { useHydrated, useLibrary } from '@/lib/store/library'
import { TemplateCard } from '@/components/site/template-card'

gsap.registerPlugin(useGSAP)

type Sort = 'popular' | 'recent' | 'az' | 'za'
const SORTS: { value: Sort; label: string }[] = [
  { value: 'popular', label: 'Les plus populaires' },
  { value: 'recent', label: 'Les plus récents' },
  { value: 'az', label: 'Nom (A → Z)' },
  { value: 'za', label: 'Nom (Z → A)' },
]

function normalize(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export function filterTemplates(list: CvTemplate[], query: string, category: TemplateCategory | 'Tous', sort: Sort) {
  const q = normalize(query.trim())
  const out = list.filter((t) => {
    if (category !== 'Tous' && t.category !== category) return false
    if (!q) return true
    return normalize([t.name, t.category, ...t.tags].join(' ')).includes(q)
  })
  return out.sort((a, b) => {
    if (sort === 'popular') return b.popularity - a.popularity
    if (sort === 'recent') return b.createdAt - a.createdAt
    if (sort === 'az') return a.name.localeCompare(b.name, 'fr')
    return b.name.localeCompare(a.name, 'fr')
  })
}

export function TemplateGallery({
  thumbnails,
  initialCategory,
  initialQuery,
}: {
  thumbnails: Record<string, string>
  initialCategory: TemplateCategory | 'Tous'
  initialQuery: string
}) {
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState<TemplateCategory | 'Tous'>(initialCategory)
  const [sort, setSort] = useState<Sort>('popular')
  const [onlyFav, setOnlyFav] = useState(false)
  const hydrated = useHydrated()
  const favorites = useLibrary((s) => s.favorites)
  const createBlank = useLibrary((s) => s.createBlank)
  const router = useRouter()
  const gridRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const base = onlyFav && hydrated ? TEMPLATES.filter((t) => favorites.includes(t.id)) : TEMPLATES
    return filterTemplates([...base], query, category, sort)
  }, [query, category, sort, onlyFav, favorites, hydrated])

  const resultKey = results.map((r) => r.id).join(',')
  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.template-card', { y: 30, opacity: 0, duration: 0.5, stagger: 0.03, ease: 'power2.out' })
      })
    },
    { scope: gridRef, dependencies: [resultKey] },
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">Modèles de CV</h1>
        <p className="text-lg text-muted-foreground">
          {TEMPLATES.length} modèles personnalisables. Survolez un modèle pour l&apos;utiliser ou voir plus de détails.
        </p>
      </div>

      <div className="sticky top-16 z-30 -mx-4 mb-8 flex flex-col gap-4 border-b border-border bg-surface/95 px-4 py-4 backdrop-blur md:-mx-6 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Rechercher un modèle</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher : marketing, épuré, photo, sombre…"
              className="h-12 w-full rounded-full border border-border bg-white pl-12 pr-11 text-ink shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Effacer la recherche"
                className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            )}
          </label>
          <div className="flex gap-3">
            <label className="relative">
              <span className="sr-only">Trier par</span>
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-12 appearance-none rounded-full border border-border bg-white pl-10 pr-6 font-semibold text-ink shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              aria-pressed={onlyFav}
              onClick={() => setOnlyFav((v) => !v)}
              className={cn(
                'inline-flex h-12 items-center gap-2 rounded-full border px-5 font-semibold shadow-sm transition-colors',
                onlyFav ? 'border-accent-pink bg-accent-pink text-white' : 'border-border bg-white text-ink hover:bg-muted',
              )}
            >
              <Heart className={cn('size-4', onlyFav && 'fill-white')} aria-hidden />
              Favoris
            </button>
          </div>
        </div>
        <div role="radiogroup" aria-label="Catégorie" className="flex gap-2 overflow-x-auto pb-1">
          {(['Tous', ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors',
                category === c ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-border hover:bg-secondary',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-6 text-sm font-semibold text-muted-foreground" aria-live="polite">
        {results.length} modèle{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
      </p>

      <div ref={gridRef} className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {category === 'Tous' && !query && !onlyFav && (
          <button
            type="button"
            onClick={() => router.push(`/editeur/${createBlank()}`)}
            className="template-card flex aspect-[794/1123] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/60 bg-secondary/60 font-bold text-ink transition-colors hover:bg-secondary"
          >
            <span className="grid size-14 place-items-center rounded-full bg-primary">
              <Plus className="size-7" aria-hidden />
            </span>
            Page vierge
          </button>
        )}
        {results.map((t) => (
          <TemplateCard key={t.id} template={t} thumbnail={thumbnails[t.id]} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-lg font-bold text-ink">Aucun modèle ne correspond.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setCategory('Tous')
              setOnlyFav(false)
            }}
            className="rounded-full bg-primary px-5 py-2.5 font-bold text-ink"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  )
}
