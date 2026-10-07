import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Apercu from '@/components/Apercu'
import { TEMPLATES, getTemplate } from '@/lib/cv/templates'
import { getThumbnailMap } from '@/lib/cv/thumbnails'

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
  const template = getTemplate(id)
  if (!template) notFound()
  const similar = TEMPLATES.filter((t) => t.category === template.category && t.id !== template.id).slice(0, 4)
  return <Apercu templateId={template.id} similarIds={similar.map((s) => s.id)} thumbnails={getThumbnailMap()} />
}
