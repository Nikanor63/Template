import { HomeHero } from '@/components/home/home-hero'
import { HomeCategories } from '@/components/home/home-categories'
import { HomeShowcase } from '@/components/home/home-showcase'
import { HomeFeatures } from '@/components/home/home-features'
import { HomeCta } from '@/components/home/home-cta'
import { TEMPLATES } from '@/lib/cv/templates'
import { getThumbnailMap } from '@/lib/cv/thumbnails'

export default function HomePage() {
  const thumbnails = getThumbnailMap()
  const featured = [...TEMPLATES].sort((a, b) => b.popularity - a.popularity).slice(0, 8)
  const heroIds = [featured[0].id, featured[1].id, featured[2].id]
  return (
    <>
      <HomeHero templateIds={heroIds} />
      <HomeCategories />
      <HomeShowcase templateIds={featured.map((t) => t.id)} thumbnails={thumbnails} />
      <HomeFeatures />
      <HomeCta />
    </>
  )
}
