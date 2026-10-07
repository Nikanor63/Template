'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useHydrated, useLibrary } from '@/lib/store/library'

export function FavoriteButton({
  templateId,
  name,
  className,
  withLabel = false,
}: {
  templateId: string
  name: string
  className?: string
  withLabel?: boolean
}) {
  const hydrated = useHydrated()
  const isFav = useLibrary((s) => s.favorites.includes(templateId))
  const toggle = useLibrary((s) => s.toggleFavorite)
  const iconRef = useRef<SVGSVGElement>(null)
  const active = hydrated && isFav

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Retirer ${name} des favoris` : `Ajouter ${name} aux favoris`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(templateId)
        if (iconRef.current) {
          gsap.fromTo(iconRef.current, { scale: 0.6 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' })
        }
      }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full bg-white/95 text-ink shadow-sm ring-1 ring-black/5 transition-colors hover:bg-white',
        withLabel ? 'h-11 px-5 text-sm font-bold' : 'size-9',
        className,
      )}
    >
      <Heart
        ref={iconRef}
        className={cn('size-[18px] transition-colors', active ? 'fill-accent-pink text-accent-pink' : 'text-ink/70')}
        aria-hidden
      />
      {withLabel && (active ? 'Dans vos favoris' : 'Ajouter aux favoris')}
    </button>
  )
}
