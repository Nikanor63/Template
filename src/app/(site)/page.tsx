import { HomeHero } from '@/components/home/Bloc1'
import { HomeCategories } from '@/components/home/Choi_Cartegorie'
import { HomeShowcase } from '@/components/home/bloc2'
import { HomeFeatures } from '@/components/home/Bloc3_'
import { HomeCta } from '@/components/home/Bloc4_start'
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
