import { FontName, type CategoryConfig } from '../cv-shared/category-config'

/**
 * # Catégorie « Organique » : 10 CV à formes fluides
 *
 * Inspirés d'un modèle à « blobs » : grandes taches arrondies, arches, vagues,
 * bulles et galets. Chaque modèle a sa propre structure de formes, sa propre
 * palette et sa propre paire de polices (`ORGANIQUE_FONTS`, même ordre que `names`).
 */
const ORGANIQUE: CategoryConfig = {
  heading: FontName.dmserif,
  body: FontName.lora,
  upper: false,
  headingVariant: 'plain',
  names: ['Rose poudré', 'Océan', 'Sauge', 'Nuit lavande', 'Soleil', 'Corail', 'Encre', 'Bleu et citron', 'Bordeaux', 'Menthe et lilas'],
  tags: ['organique', 'blobs', 'formes', 'canva'],
  palettes: [
    { primary: '#CE9296', secondary: '#EFD3D9', text: '#4A3B3D', bg: '#FFFFFF' },
    { primary: '#0E7C9B', secondary: '#BDEBF4', text: '#0B2F3F', bg: '#F3FBFD' },
    { primary: '#6F8F72', secondary: '#DCE6D3', text: '#2E3A2F', bg: '#F7F3E8' },
    { primary: '#B79CFF', secondary: '#2A2650', text: '#ECE8FF', bg: '#17142E' },
    { primary: '#F2B31F', secondary: '#D96C3F', text: '#3A2417', bg: '#FFF8EA' },
    { primary: '#E8543F', secondary: '#FFD9C7', text: '#3B1F1E', bg: '#FFF4EE' },
    { primary: '#111111', secondary: '#E6E1D6', text: '#1A1A1A', bg: '#F4F1EA' },
    { primary: '#2B3AF7', secondary: '#FFE14D', text: '#101648', bg: '#FFFFFF' },
    { primary: '#6D1F3A', secondary: '#F1DFCF', text: '#3A1A25', bg: '#FBF5EE' },
    { primary: '#4FB896', secondary: '#CDB8F0', text: '#2D2A4A', bg: '#FBFAFF' },
  ],
}

/** Paires de polices (titres / texte) de chaque modèle, dans l'ordre de `names`. */
export const ORGANIQUE_FONTS = [
  { heading: 'var(--font-dmserif)', body: 'var(--font-lora)' },
  { heading: 'var(--font-outfit)', body: 'var(--font-manrope)' },
  { heading: 'var(--font-lora)', body: 'var(--font-jakarta)' },
  { heading: 'var(--font-space)', body: 'var(--font-urbanist)' },
  { heading: 'var(--font-montserrat)', body: 'var(--font-lato)' },
  { heading: 'var(--font-poppins)', body: 'var(--font-raleway)' },
  { heading: 'var(--font-playfair)', body: 'var(--font-jakarta)' },
  { heading: 'var(--font-urbanist)', body: 'var(--font-poppins)' },
  { heading: 'var(--font-dmserif)', body: 'var(--font-raleway)' },
  { heading: 'var(--font-manrope)', body: 'var(--font-outfit)' },
] as const

export default ORGANIQUE
