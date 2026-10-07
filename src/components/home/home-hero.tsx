'use client'

import Link from 'next/link'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { CvThumbnail } from '@/components/cv/cv-thumbnail'
import { getTemplate } from '@/lib/cv/templates'

gsap.registerPlugin(useGSAP)

export function HomeHero({ templateIds }: { templateIds: string[] }) {
  const root = useRef<HTMLElement>(null)
  const templates = templateIds.map((id) => getTemplate(id)!).filter(Boolean)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.6 })
          .from('.hero-line', { yPercent: 110, duration: 0.9, stagger: 0.12 }, '-=0.3')
          .from('.hero-sub', { y: 20, opacity: 0, duration: 0.7 }, '-=0.5')
          .from('.hero-cta', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
          .from('.hero-card', { y: 120, opacity: 0, rotate: 0, duration: 1.1, stagger: 0.15, ease: 'expo.out' }, 0.3)
          .from('.hero-blob', { scale: 0, duration: 1.2, stagger: 0.1, ease: 'elastic.out(1, 0.6)' }, 0.4)

        gsap.to('.hero-card-1', { y: -14, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.4 })
        gsap.to('.hero-card-2', { y: 12, duration: 3.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.4 })
        gsap.to('.hero-card-3', { y: -10, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.4 })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 md:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-20">
        <div className="relative z-10 flex flex-col items-start gap-6">
          <span className="hero-badge inline-flex items-center gap-2 rounded-full bg-accent-yellow px-4 py-1.5 text-sm font-bold text-ink">
            <Sparkles className="size-4" aria-hidden />
            60 modèles + création par IA
          </span>
          <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-ink text-balance md:text-6xl lg:text-7xl">
            <span className="block overflow-hidden pb-1">
              <span className="hero-line block">Le CV qui vous</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="hero-line block">
                ouvre des <span className="relative inline-block text-primary">portes<svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" aria-hidden><path d="M2 9 C 50 2, 150 2, 198 9" stroke="var(--accent-pink)" strokeWidth="5" fill="none" strokeLinecap="round" /></svg></span>.
              </span>
            </span>
          </h1>
          <p className="hero-sub max-w-xl text-lg leading-relaxed text-ink/70 text-pretty">
            Choisissez un modèle, personnalisez chaque détail dans un éditeur glisser-déposer, ou laissez l&apos;IA
            rédiger pour vous. Exportez en PDF, PNG, JPG ou SVG.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/modeles"
              className="hero-cta inline-flex h-13 items-center gap-2 rounded-full bg-primary px-7 font-bold text-ink shadow-[0_10px_30px_-10px_rgba(92,175,231,0.9)] transition-transform hover:-translate-y-0.5"
            >
              Parcourir les modèles
              <ArrowRight className="size-5" aria-hidden />
            </Link>
            <Link
              href="/cv-ia"
              className="hero-cta inline-flex h-13 items-center gap-2 rounded-full bg-ink px-7 font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              <Sparkles className="size-5 text-accent-yellow" aria-hidden />
              Créer avec l&apos;IA
            </Link>
          </div>
          <dl className="hero-sub mt-4 flex gap-8">
            {[
              ['60', 'modèles'],
              ['6', 'styles'],
              ['4', 'formats d’export'],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-3xl font-extrabold text-ink">{n}</dd>
                <dd className="text-sm font-medium text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto h-[440px] w-full max-w-[560px] sm:h-[520px]" aria-hidden>
          <div className="hero-blob absolute left-[8%] top-[6%] size-56 rounded-full bg-primary-light/50 blur-2xl" />
          <div className="hero-blob absolute bottom-[4%] right-[4%] size-48 rounded-full bg-accent-pink/30 blur-2xl" />
          <div className="hero-blob absolute right-[18%] top-[2%] size-20 rounded-full bg-accent-yellow" />
          {templates[1] && (
            <div className="hero-card hero-card-2 absolute left-0 top-16 w-[44%] -rotate-6 overflow-hidden rounded-xl shadow-2xl ring-1 ring-black/5">
              <CvThumbnail design={templates[1].design} alt="" />
            </div>
          )}
          {templates[2] && (
            <div className="hero-card hero-card-3 absolute right-0 top-24 w-[44%] rotate-6 overflow-hidden rounded-xl shadow-2xl ring-1 ring-black/5">
              <CvThumbnail design={templates[2].design} alt="" />
            </div>
          )}
          {templates[0] && (
            <div className="hero-card hero-card-1 absolute left-1/2 top-0 w-[52%] -translate-x-1/2 overflow-hidden rounded-xl shadow-[0_30px_60px_-20px_rgba(14,34,56,0.45)] ring-1 ring-black/5">
              <CvThumbnail design={templates[0].design} alt="" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
