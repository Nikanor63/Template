'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { CvThumbnail } from '@/components/cv/cv-thumbnail'
import { useOpenTemplate } from '@/hooks/use-open-template'
import type { CvTemplate } from '@/lib/cv/types'
import { FavoriteButton } from './favorite-button'

export function TemplateCard({ template, thumbnail }: { template: CvTemplate; thumbnail?: string }) {
  const open = useOpenTemplate()
  return (
    <article className="template-card group flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_-2px_rgba(14,34,56,0.12)] ring-1 ring-black/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_-14px_rgba(14,34,56,0.35)]">
        <CvThumbnail design={template.design} thumbnail={thumbnail} alt={`Aperçu du modèle ${template.name}`} />
        <div className="absolute inset-x-0 bottom-0 flex translate-y-2 gap-2 bg-gradient-to-t from-ink/70 to-transparent p-3 pt-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => open(template)}
            className="flex-1 rounded-full bg-primary py-2.5 text-sm font-bold text-ink transition-colors hover:bg-primary-light"
          >
            Créer
          </button>
          <Link
            href={`/apercu/${template.id}`}
            className="flex-1 rounded-full bg-white py-2.5 text-center text-sm font-bold text-ink transition-colors hover:bg-surface"
          >
            Voir plus
          </Link>
        </div>
        <FavoriteButton templateId={template.id} name={template.name} className="absolute right-3 top-3" />
      </div>
      <div className="flex items-start justify-between gap-2 px-1">
        <div className="min-w-0">
          <h3 className="truncate font-bold text-ink">{template.name}</h3>
          <p className="text-sm text-muted-foreground">{template.category}</p>
        </div>
        <Link
          href={`/apercu/${template.id}`}
          className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:text-ink"
        >
          Voir plus
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  )
}
