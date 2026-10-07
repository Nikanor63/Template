import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function HomeCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-primary px-8 py-14 shadow-primary md:px-16">
        <div className="absolute -right-10 -top-10 size-48 rounded-full bg-accent-yellow" aria-hidden />
        <div className="absolute -bottom-16 right-32 size-40 rounded-full bg-accent-pink/80" aria-hidden />
        <div className="relative max-w-xl">
          <h2 className="mb-4 font-display text-4xl font-extrabold tracking-tight text-ink text-balance">
            Votre prochain poste commence par une page blanche.
          </h2>
          <p className="mb-8 text-lg text-ink/80">Partez d&apos;un modèle ou d&apos;une page vierge : c&apos;est gratuit.</p>
          <Link
            href="/modeles"
            className="inline-flex h-13 items-center gap-2 rounded-full bg-ink px-7 font-extrabold text-white transition-transform hover:-translate-y-0.5"
          >
            Commencer maintenant
            <ArrowRight className="size-5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
