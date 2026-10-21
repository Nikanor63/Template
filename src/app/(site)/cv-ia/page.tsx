import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function CvIaPage() {
  return (
    <section className="mx-auto flex min-h-[60dvh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center md:px-6">
      <span className="mb-5 grid size-14 place-items-center rounded-full bg-accent-yellow text-ink">
        <Sparkles className="size-7" aria-hidden />
      </span>
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">La création par IA arrive bientôt</h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        En attendant, choisissez un modèle et personnalisez votre CV dans l’éditeur.
      </p>
      <Link href="/modeles" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 font-extrabold text-ink shadow-primary transition-transform hover:-translate-y-0.5">
        Parcourir les modèles
      </Link>
    </section>
  )
}
