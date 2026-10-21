import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Apercu from '@/components/Apercu'
import { TEMPLATES, getTemplate } from '@/lib/cv-shared/templates'
import { getTemplatesWithPhotos, getThumbnailMap } from '@/lib/cv-shared/thumbnails'

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ id: t.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const t = getTemplate(id)
  return { title: t ? `${t.name} — Aperçu du modèle | Bara_CV` : 'Modèle introuvable' }
}

export default async function ApercuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const templates = getTemplatesWithPhotos()
  const template = templates.find((t) => t.id === id)
  if (!template) notFound()
  const categoryTemplates = templates.filter((t) => t.category === template.category)
  const similar = categoryTemplates.filter((t) => t.id !== template.id).slice(0, 4)
  return <Apercu template={template} similar={similar} categoryTemplates={categoryTemplates} thumbnails={getThumbnailMap()} />
}
