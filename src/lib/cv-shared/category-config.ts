import type { TemplateStyle } from './builder'

/**
 * # Leçon : définir l'identité visuelle d'une catégorie
 *
 * Chaque dossier `cv-*` fournit un objet conforme à cette interface. Les noms
 * sont les titres visibles des modèles, les palettes donnent leurs couleurs,
 * et les tags servent à les décrire. Les polices viennent de `F` pour
 * réutiliser les polices déjà chargées par l'application.
 */
export interface CategoryConfig {
  heading: string
  body: string
  upper: boolean
  headingVariant: TemplateStyle['headingVariant']
  names: string[]
  palettes: { primary: string; secondary: string; text?: string; bg?: string }[]
  tags: string[]
}

/** Noms des polices CSS préparées par le site. Choisis-les dans les catégories. */
export const FontName = {
  lato: 'var(--font-lato)',
  playfair: 'var(--font-playfair)',
  montserrat: 'var(--font-montserrat)',
  lora: 'var(--font-lora)',
  poppins: 'var(--font-poppins)',
  raleway: 'var(--font-raleway)',
  space: 'var(--font-space)',
  dmserif: 'var(--font-dmserif)',
  jakarta: 'var(--font-jakarta)',
}
