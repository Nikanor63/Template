import Link from 'next/link'
import { Logo } from './logo'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="text-sm text-muted-foreground uppercase font-extrabold">Des CV qui vous ressemblent, en quelques minutes.</p>
        </div>
        <nav aria-label="Liens du pied de page" className="flex flex-wrap gap-x-6 gap-y-2 text-sm uppercase font-extrabold text-ink/70">
          <Link href="/modeles" className="hover:text-ink">Modèles</Link>
          <Link href="/favoris" className="hover:text-ink">Favoris</Link>
          <Link href="/mes-cv" className="hover:text-ink">Mes CV</Link>
          <Link href="/cv-ia" className="hover:text-ink">CV avec IA</Link>
        </nav>
      </div>
    </footer>
  )
}
