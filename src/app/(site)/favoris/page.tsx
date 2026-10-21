import type { Metadata } from 'next'
import { FavoritesList } from '@/components/gallery/favorites-list'
import { getTemplatesWithPhotos } from '@/lib/cv-shared/thumbnails'

export const metadata: Metadata = { title: 'Mes favoris — Bara_CV' }

export default function FavorisPage() {
  return <FavoritesList templates={getTemplatesWithPhotos()} />
}
