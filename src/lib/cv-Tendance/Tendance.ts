import { FontName, type CategoryConfig } from '../cv-shared/category-config'

/**
 * # Catégorie « Tendance » : 10 CV façon Canva
 *
 * Blocs arrondis, motifs horizontaux / verticaux / points / quadrillage, grands
 * titres. Les motifs sont des rectangles dont le remplissage (`fill`) est un
 * dégradé CSS : ils restent déplaçables et modifiables dans l'éditeur
 * (voir COURS.md, section 4).
 *
 * Chaque modèle a sa propre paire de polices (`TENDANCE_FONTS`, dans le même
 * ordre que `names` et `palettes`).
 */
const TENDANCE: CategoryConfig = {
  heading: FontName.jakarta,
  body: FontName.lato,
  upper: false,
  headingVariant: 'plain',
  names: ['Bento', 'Néon', 'Arche', 'Capsule', 'Coucher de soleil', 'Papier quadrillé', 'Éditorial', 'Menthe', 'Rétro', 'Aurore'],
  tags: ['tendance', 'arrondi', 'motifs', 'canva'],
  palettes: [
    { primary: '#6C5CE7', secondary: '#EDE9FF', text: '#1F1B3A', bg: '#F6F4FF' },
    { primary: '#B6FF3B', secondary: '#1B1F2A', text: '#F4F6FA', bg: '#0E1118' },
    { primary: '#FF7A59', secondary: '#FFE9E1', text: '#2A1F1C', bg: '#FFFAF7' },
    { primary: '#0F766E', secondary: '#CCF3EC', text: '#10302D', bg: '#FFFFFF' },
    { primary: '#FF5E7E', secondary: '#FFB86B', text: '#2B1B2E', bg: '#FFF7F2' },
    { primary: '#2F5BFF', secondary: '#E3EAFF', text: '#0F1B3D', bg: '#FBFCFF' },
    { primary: '#111111', secondary: '#EDEDED', text: '#111111', bg: '#FFFFFF' },
    { primary: '#12B886', secondary: '#E6FCF5', text: '#0B3B2E', bg: '#F7FFFC' },
    { primary: '#E8590C', secondary: '#FFE8CC', text: '#2B1A0F', bg: '#FFF9F0' },
    { primary: '#7C3AED', secondary: '#E9D5FF', text: '#1E1033', bg: '#FAF5FF' },
  ],
}

/** Paires de polices (titres / texte) de chaque modèle, dans l'ordre de `names`. */
export const TENDANCE_FONTS = [
  { heading: 'var(--font-outfit)', body: 'var(--font-manrope)' },
  { heading: 'var(--font-space)', body: 'var(--font-jakarta)' },
  { heading: 'var(--font-dmserif)', body: 'var(--font-poppins)' },
  { heading: 'var(--font-urbanist)', body: 'var(--font-lato)' },
  { heading: 'var(--font-montserrat)', body: 'var(--font-poppins)' },
  { heading: 'var(--font-space)', body: 'var(--font-manrope)' },
  { heading: 'var(--font-playfair)', body: 'var(--font-jakarta)' },
  { heading: 'var(--font-outfit)', body: 'var(--font-urbanist)' },
  { heading: 'var(--font-dmserif)', body: 'var(--font-raleway)' },
  { heading: 'var(--font-manrope)', body: 'var(--font-outfit)' },
] as const

export default TENDANCE
