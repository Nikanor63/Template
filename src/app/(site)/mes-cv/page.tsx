import type { Metadata } from 'next'
import { MyDesigns } from '@/components/gallery/my-designs'

export const metadata: Metadata = { title: 'Mes CV — Bara_CV' }

export default function MesCvPage() {
  return <MyDesigns />
}
