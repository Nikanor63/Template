'use client'

import Link from 'next/link'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight } from 'lucide-react'
import { TemplateCard } from '@/components/site/template-card'
import { getTemplate } from '@/lib/cv/templates'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function HomeShowcase({ templateIds, thumbnails }: { templateIds: string[]; thumbnails: Record<string, string> }) {
  const root = useRef<HTMLElement>(null)
  const templates = templateIds.map((id) => getTemplate(id)!).filter(Boolean)

  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.template-card', {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.showcase-grid', start: 'top 80%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="showcase-title" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-accent-pink">Les plus populaires</p>
          <h2 id="showcase-title" className="font-display text-4xl font-extrabold tracking-tight text-ink text-balance">
            Des modèles conçus pour être remarqués
          </h2>
        </div>
        <Link href="/modeles" className="inline-flex items-center gap-2 font-bold text-ink hover:text-primary">
          Voir les 60 modèles
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      <div className="showcase-grid grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {templates.map((t) => (
          <TemplateCard key={t.id} template={t} thumbnail={thumbnails[t.id]} />
        ))}
      </div>
    </section>
  )
}
