/**
 * # Le vocabulaire du générateur de CV
 *
 * Un modèle est une feuille composée d'éléments simples : du texte, des formes,
 * des images et des icônes. Les interfaces de ce fichier décrivent exactement
 * les données que l'éditeur et le moteur de rendu savent manipuler.
 * Si tu ajoutes un nouveau type d'élément, pense aussi à le gérer dans le rendu
 * et dans l'éditeur, sinon TypeScript le connaîtra mais l'application ne saura
 * pas l'afficher correctement.
 */

/** Forme d'un élément graphique compris par l'application. */
export type ElementType = 'text' | 'rect' | 'circle' | 'line' | 'image' | 'icon'

/** Alignement horizontal permis pour un bloc de texte. */
export type TextAlign = 'left' | 'center' | 'right' | 'justify'

/**
 * Propriétés communes à tout élément placé sur la page.
 * x/y donnent le coin supérieur gauche ; w/h donnent sa taille, en pixels.
 */
export interface BaseElement {
  id: string
  type: ElementType
  name?: string
  x: number
  y: number
  w: number
  h: number
  rotation: number
  opacity: number
  locked?: boolean
  hidden?: boolean
}

/** Un bloc de texte : nom, titre, expérience, contact, etc. */
export interface TextElement extends BaseElement {
  type: 'text'
  text: string
  fontFamily: string
  fontSize: number
  fontWeight: number
  italic?: boolean
  underline?: boolean
  uppercase?: boolean
  color: string
  align: TextAlign
  lineHeight: number
  letterSpacing: number
}

/** Un rectangle ou un cercle décoratif. */
export interface ShapeElement extends BaseElement {
  type: 'rect' | 'circle'
  shape?: 'rectangle' | 'circle' | 'wave'
  /** Chemin SVG personnalisé dans un viewBox 1000 × 1000 pour les formes organiques. */
  customPath?: string
  waveAmplitude?: number
  waveCount?: number
  wavePhase?: number
  deformTop?: number
  deformRight?: number
  deformBottom?: number
  deformLeft?: number
  fill: string
  stroke: string
  strokeWidth: number
  radius: number
}

/** Une ligne de séparation ou de chronologie. */
export interface LineElement extends BaseElement {
  type: 'line'
  stroke: string
  strokeWidth: number
  dashed?: boolean
}

/** Une photo ou une image intégrée au CV. */
export interface ImageElement extends BaseElement {
  type: 'image'
  src: string
  radius: number
  fit: 'cover' | 'contain'
  stroke: string
  strokeWidth: number
  cropX?: number
  cropY?: number
  cropScale?: number
  /** Image is already attached to a shape and should move as a single framed element. */
  isShapeFill?: boolean
}

/** Une icône nommée dans le catalogue de `icons.ts`. */
export interface IconElement extends BaseElement {
  type: 'icon'
  icon: string
  color: string
}

/** Union : chaque élément du tableau du design doit être l'un de ces types. */
export type CvElement = TextElement | ShapeElement | LineElement | ImageElement | IconElement

/**
 * Le CV enregistré dans la bibliothèque de l'utilisateur.
 * Un template fournit un design de départ ; le design enregistré reçoit ensuite
 * son propre id et sa date de mise à jour.
 */
export interface CvDesign {
  id: string
  name: string
  templateId?: string
  width: number
  height: number
  background: string
  elements: CvElement[]
  updatedAt: number
}

/** Catégories montrées dans la galerie et associées aux dossiers `cv-*`. */
export type TemplateCategory =
  | 'Minimaliste'
  | 'Professionnel'
  | 'Moderne'
  | 'Créatif'
  | 'Élégant'
  | 'Étudiant'
  | 'Tendance'
  | 'Motif'

/** Métadonnées d'un modèle et design prêt à être montré dans la galerie. */
export interface CvTemplate {
  id: string
  slug: string
  name: string
  category: TemplateCategory
  tags: string[]
  popularity: number
  createdAt: number
  accent: string
  thumbnail?: string
  design: Omit<CvDesign, 'id' | 'updatedAt'>
}

/**
 * Contenu textuel utilisé pour construire un CV.
 * Pour créer un CV de démonstration, pars de cette structure et remplace les
 * exemples dans `sample.ts` ou dans la configuration propre à ta catégorie.
 */
export interface CvContent {
  fullName: string
  title: string
  summary: string
  email: string
  phone: string
  location: string
  website: string
  photo?: string
  experiences: { role: string; company: string; period: string; description: string }[]
  education: { degree: string; school: string; period: string }[]
  skills: string[]
  languages: string[]
  interests: string[]
}

/**
 * Dimensions de la feuille de travail. Les layouts placent leurs éléments dans
 * ce repère ; garde la même proportion si tu changes ces valeurs.
 */
export const PAGE_WIDTH = 794
export const PAGE_HEIGHT = 1123
