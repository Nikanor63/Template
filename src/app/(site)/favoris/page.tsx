import type { Metadata } from 'next'
import { FavoritesList } from '@/components/gallery/favorites-list'
import { getThumbnailMap } from '@/lib/cv/thumbnails'

export const metadata: Metadata = { title: 'Mes favoris — Bara_CV' }

export default function FavorisPage() {
  return <FavoritesList thumbnails={getThumbnailMap()} />
}
