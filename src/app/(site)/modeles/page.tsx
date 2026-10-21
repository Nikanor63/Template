import type { Metadata } from 'next'
import { TemplateGallery } from '@/components/gallery/template-gallery'
import { CATEGORIES, TEMPLATES } from '@/lib/cv-shared/templates'
import { getTemplatesWithPhotos, getThumbnailMap } from '@/lib/cv-shared/thumbnails'
import type { TemplateCategory } from '@/lib/cv-shared/types'

export const metadata: Metadata = {
  title: 'Modèles de CV — Bara_CV',
  description: `Recherchez et triez parmi ${TEMPLATES.length} modèles de CV.`,
}

export default async function ModelesPage({ searchParams }: { searchParams: Promise<{ categorie?: string; q?: string }> }) {
  const { categorie, q } = await searchParams
  const initialCategory = CATEGORIES.includes(categorie as TemplateCategory) ? (categorie as TemplateCategory) : 'Tous'
  return <TemplateGallery templates={getTemplatesWithPhotos()} thumbnails={getThumbnailMap()} initialCategory={initialCategory} initialQuery={q ?? ''} />
}
