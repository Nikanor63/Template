'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Download, Heart, MousePointer2, Search, Sparkles, Type } from 'lucide-react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const FEATURES = [
  { icon: MousePointer2, title: 'Éditeur glisser-déposer', text: 'Déplacez, redimensionnez, faites pivoter et alignez chaque élément comme sur Canva.', tone: 'bg-primary' },
  { icon: Sparkles, title: 'Rédaction par IA', text: 'Décrivez votre parcours, l’IA structure et rédige un CV percutant.', tone: 'bg-accent-pink' },
  { icon: Type, title: 'Typographie riche', text: '9 polices, tailles, graisses, interlignage et espacement à volonté.', tone: 'bg-accent-yellow' },
  { icon: Search, title: 'Recherche & tri', text: 'Trouvez le bon modèle par mot-clé, style, popularité ou nouveauté.', tone: 'bg-primary-light' },
  { icon: Heart, title: 'Favoris', text: 'Gardez sous la main les modèles qui vous plaisent pour les comparer.', tone: 'bg-accent-pink' },
  { icon: Download, title: 'Export multi-format', text: 'Téléchargez en PDF, PNG, JPG ou SVG en haute définition.', tone: 'bg-accent-yellow' },
]

export function HomeFeatures() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.feature-card', {
          y: 50,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 75%' },
        })
      })
    },
    { scope: root },
  )
  return (
    <section ref={root} aria-labelledby="features-title" className="bg-ink py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 id="features-title" className="mb-12 max-w-2xl font-display text-4xl font-extrabold tracking-tight text-balance">
          Tout ce qu&apos;il faut pour un CV <span className="text-primary-light">irrésistible</span>.
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <li key={f.title} className="feature-card rounded-3xl bg-white/[0.06] p-7 shadow-panel ring-1 ring-white/10 transition-transform hover:-translate-y-1">
              <span className={`mb-5 grid size-12 place-items-center rounded-2xl text-ink ${f.tone}`}>
                <f.icon className="size-6" aria-hidden />
              </span>
              <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
              <p className="leading-relaxed text-white/70">{f.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
