'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Heart, Menu, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useHydrated, useLibrary } from '@/lib/store/library'
import { Logo } from './logo'

const LINKS = [
  { href: '/modeles', label: 'Modèles' },
  { href: '/mes-cv', label: 'Mes CV' },
  { href: '/cv-ia', label: 'CV avec IA' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const hydrated = useHydrated()
  const favCount = useLibrary((s) => s.favorites.length)

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 md:px-6">
        <Logo />
        <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold text-ink/70 transition-colors hover:bg-secondary hover:text-ink',
                pathname.startsWith(l.href) && 'bg-secondary text-ink',
              )}
            >
              {l.href === '/cv-ia' && <Sparkles className="mr-1.5 inline size-4 text-accent-pink" aria-hidden />}
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/favoris"
            aria-label={`Favoris${hydrated && favCount ? ` (${favCount})` : ''}`}
            className="relative grid size-10 place-items-center rounded-full text-ink/70 transition-colors hover:bg-secondary hover:text-ink"
          >
            <Heart className="size-5" aria-hidden />
            {hydrated && favCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-accent-pink px-1 text-[11px] font-bold text-surface">
                {favCount}
              </span>
            )}
          </Link>
          <Link
            href="/modeles"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-ink shadow-[0_6px_20px_-6px_rgba(92,175,231,0.8)] transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            Créer mon CV
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-full hover:bg-secondary md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Navigation mobile" className="border-t border-border bg-surface px-4 py-3 md:hidden">
          {[...LINKS, { href: '/favoris', label: 'Favoris' }].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 font-semibold text-ink hover:bg-secondary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
