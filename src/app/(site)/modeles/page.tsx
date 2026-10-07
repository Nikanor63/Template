import type { Metadata } from 'next'
import { TemplateGallery } from '@/components/gallery/template-gallery'
import { CATEGORIES } from '@/lib/cv/templates'
import { getThumbnailMap } from '@/lib/cv/thumbnails'
import type { TemplateCategory } from '@/lib/cv/types'

export const metadata: Metadata = {
  title: 'Modèles de CV — Cvéa',
  description: 'Recherchez et triez parmi 60 modèles de CV : minimaliste, professionnel, moderne, créatif, élégant, étudiant.',
}

export default async function ModelesPage({ searchParams }: { searchParams: Promise<{ categorie?: string; q?: string }> }) {
  const { categorie, q } = await searchParams
  const initialCategory = CATEGORIES.includes(categorie as TemplateCategory) ? (categorie as TemplateCategory) : 'Tous'
  return <TemplateGallery thumbnails={getThumbnailMap()} initialCategory={initialCategory} initialQuery={q ?? ''} />
}
