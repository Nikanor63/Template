'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Copy, FileText, Plus, Trash2 } from 'lucide-react'
import { CvThumbnail } from '@/components/cv/cv-thumbnail'
import { useHydrated, useLibrary } from '@/lib/store/library'

const dateFmt = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })

export function MyDesigns() {
  const hydrated = useHydrated()
  const designs = useLibrary((s) => s.designs)
  const { removeDesign, duplicateDesign, createBlank } = useLibrary.getState()
  const router = useRouter()
  const list = hydrated ? Object.values(designs).sort((a, b) => b.updatedAt - a.updatedAt) : []

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">Mes CV</h1>
          <p className="text-lg text-muted-foreground">Vos créations sont enregistrées automatiquement dans ce navigateur.</p>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/editeur/${createBlank()}`)}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-bold text-ink"
        >
          <Plus className="size-5" aria-hidden />
          Nouveau CV vierge
        </button>
      </div>

      {hydrated && list.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-secondary/60 px-6 py-20 text-center">
          <FileText className="size-12 text-primary" aria-hidden />
          <p className="text-lg font-bold text-ink">Vous n&apos;avez encore créé aucun CV</p>
          <Link href="/modeles" className="rounded-full bg-primary px-6 py-3 font-bold text-ink">
            Choisir un modèle
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {list.map((d) => (
            <li key={d.id} className="group flex flex-col gap-3">
              <Link
                href={`/editeur/${d.id}`}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all group-hover:-translate-y-1 group-hover:shadow-xl"
              >
                <CvThumbnail design={d} alt={`Ouvrir ${d.name}`} />
              </Link>
              <div className="flex items-start justify-between gap-2 px-1">
                <div className="min-w-0">
                  <p className="truncate font-bold text-ink">{d.name}</p>
                  <p className="text-xs text-muted-foreground">Modifié le {dateFmt.format(d.updatedAt)}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    aria-label={`Dupliquer ${d.name}`}
                    onClick={() => duplicateDesign(d.id)}
                    className="grid size-8 place-items-center rounded-full hover:bg-muted"
                  >
                    <Copy className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Supprimer ${d.name}`}
                    onClick={() => {
                      if (confirm(`Supprimer « ${d.name} » ?`)) removeDesign(d.id)
                    }}
                    className="grid size-8 place-items-center rounded-full text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
