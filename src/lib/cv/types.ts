export type ElementType = 'text' | 'rect' | 'circle' | 'line' | 'image' | 'icon'

export type TextAlign = 'left' | 'center' | 'right' | 'justify'

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

export interface ShapeElement extends BaseElement {
  type: 'rect' | 'circle'
  fill: string
  stroke: string
  strokeWidth: number
  radius: number
}

export interface LineElement extends BaseElement {
  type: 'line'
  stroke: string
  strokeWidth: number
  dashed?: boolean
}

export interface ImageElement extends BaseElement {
  type: 'image'
  src: string
  radius: number
  fit: 'cover' | 'contain'
  stroke: string
  strokeWidth: number
}

export interface IconElement extends BaseElement {
  type: 'icon'
  icon: string
  color: string
}

export type CvElement = TextElement | ShapeElement | LineElement | ImageElement | IconElement

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

export type TemplateCategory =
  | 'Minimaliste'
  | 'Professionnel'
  | 'Moderne'
  | 'Créatif'
  | 'Élégant'
  | 'Étudiant'

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

export const PAGE_WIDTH = 794
export const PAGE_HEIGHT = 1123
