'use client'

import Link from 'next/link'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { CATEGORIES, TEMPLATES } from '@/lib/cv/templates'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const COLORS = ['bg-secondary', 'bg-accent-yellow/60', 'bg-accent-pink/20', 'bg-primary-light/40', 'bg-muted', 'bg-accent-yellow/30']

export function HomeCategories() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.cat-pill', {
          y: 30,
          opacity: 0,
          stagger: 0.06,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: root.current, start: 'top 85%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="cat-title" className="border-y border-border bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:px-6">
        <h2 id="cat-title" className="shrink-0 font-display text-lg font-bold text-ink">
          Explorer par style
        </h2>
        <ul className="flex flex-wrap gap-3">
          {CATEGORIES.map((c, i) => (
            <li key={c} className="cat-pill">
              <Link
                href={`/modeles?categorie=${encodeURIComponent(c)}`}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-ink transition-transform hover:-translate-y-0.5 ${COLORS[i % COLORS.length]}`}
              >
                {c}
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-bold">
                  {TEMPLATES.filter((t) => t.category === c).length}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
