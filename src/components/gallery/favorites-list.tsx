'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { TemplateCard } from '@/components/site/template-card'
import { TEMPLATES } from '@/lib/cv/templates'
import { useHydrated, useLibrary } from '@/lib/store/library'

export function FavoritesList({ thumbnails }: { thumbnails: Record<string, string> }) {
  const hydrated = useHydrated()
  const favorites = useLibrary((s) => s.favorites)
  const list = hydrated ? TEMPLATES.filter((t) => favorites.includes(t.id)) : []

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="mb-2 font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">Mes favoris</h1>
      <p className="mb-10 text-lg text-muted-foreground">Les modèles que vous avez mis de côté.</p>
      {hydrated && list.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-secondary/60 px-6 py-20 text-center shadow-card">
          <span className="grid size-16 place-items-center rounded-full bg-accent-pink/20">
            <Heart className="size-8 text-accent-pink" aria-hidden />
          </span>
          <p className="text-lg font-bold text-ink">Aucun favori pour l&apos;instant</p>
          <p className="max-w-sm text-muted-foreground">Cliquez sur le cœur d&apos;un modèle pour le retrouver ici.</p>
          <Link href="/modeles" className="rounded-full bg-primary px-6 py-3 font-bold text-ink">
            Explorer les modèles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {list.map((t) => (
            <TemplateCard key={t.id} template={t} thumbnail={thumbnails[t.id]} />
          ))}
        </div>
      )}
    </div>
  )
}
