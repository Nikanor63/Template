/**
 * # Leçon : assembler les modèles de CV
 *
 * Ce fichier relie les catégories à leurs réglages (`template.ts`), layouts
 * (`builder.ts`) et contenus d'exemple. Le parcours : choisir style et palette,
 * dessiner le layout avec le contenu, puis enregistrer le résultat dans
 * `TEMPLATES` pour que la galerie puisse l'afficher.
 *
 * Pour ajouter une catégorie : ajoute son nom dans `types.ts`, importe ses
 * modules `cv-*`, puis inscris-la dans `CATEGORIES`, `CONFIG` et
 * `CATEGORY_MODULES`. Ajoute aussi sa règle d'images dans `thumbnails.ts`.
 */
import type { TemplateStyle } from './builder'
import { MINIMALISTE_TEMPLATE } from '../cv-Minimaliste/template'
import { CV_MINIMALISTE_LAYOUTS, buildCvMinimaliste } from '../cv-Minimaliste/builder'
import { PROFESSIONNEL_TEMPLATE } from '../cv-Professionnel/template'
import { CV_PROFESSIONNEL_LAYOUTS, buildCvProfessionnel } from '../cv-Professionnel/builder'
import { MODERNE_TEMPLATE } from '../cv-Moderne/template'
import { CV_MODERNE_LAYOUTS, buildCvModerne } from '../cv-Moderne/builder'
import { CREATIF_TEMPLATE } from '../cv-Créatif/template'
import { CV_CREATIF_LAYOUTS, buildCvCreatif } from '../cv-Créatif/builder'
import { ELEGANT_TEMPLATE } from '../cv-Élégant/template'
import { CV_ELEGANT_LAYOUTS, buildCvElegant } from '../cv-Élégant/builder'
import { ETUDIANT_TEMPLATE } from '../cv-Étudiant/template'
import { STUDENT_CONTENTS } from '../cv-Étudiant/Etudiant'
import { CV_ETUDIANT_LAYOUTS, buildCvEtudiant } from '../cv-Étudiant/builder'
import { TENDANCE_TEMPLATE, TENDANCE_FONTS } from '../cv-Tendance/template'
import { CV_TENDANCE_LAYOUTS, buildCvTendance } from '../cv-Tendance/builder'
import { ORGANIQUE_TEMPLATE, ORGANIQUE_FONTS } from '../cv-Organique/template'
import { CV_ORGANIQUE_LAYOUTS, buildCvOrganique } from '../cv-Organique/builder'
import type { CategoryConfig } from './category-config'
import { finishLayout } from './postprocess'
import { SAMPLE_CONTENTS, TENDANCE_SAMPLE_CONTENTS, ORGANIQUE_SAMPLE_CONTENTS } from './sample'
import type { CvContent, CvElement, CvTemplate, TemplateCategory } from './types'
import { PAGE_HEIGHT, PAGE_WIDTH } from './types'

/** Ordre d'affichage des familles de CV dans les pages de galerie. */
export const CATEGORIES: TemplateCategory[] = [
  'Motif',
  'Minimaliste',
  'Professionnel',
  'Moderne',
  'Créatif',
  'Élégant',
  'Étudiant',
  'Tendance',
]

/** Réglages de style : chaque catégorie pointe vers son propre fichier. */
const CONFIG: Record<TemplateCategory, CategoryConfig> = {
  Minimaliste: MINIMALISTE_TEMPLATE,
  Professionnel: PROFESSIONNEL_TEMPLATE,
  Moderne: MODERNE_TEMPLATE,
  Créatif: CREATIF_TEMPLATE,
  Élégant: ELEGANT_TEMPLATE,
  Étudiant: ETUDIANT_TEMPLATE,
  Tendance: TENDANCE_TEMPLATE,
  Motif: ORGANIQUE_TEMPLATE,
}

/** Layouts et fonctions de construction propres à chaque catégorie. */
const CATEGORY_MODULES = {
  Minimaliste: { layouts: CV_MINIMALISTE_LAYOUTS, build: buildCvMinimaliste },
  Professionnel: { layouts: CV_PROFESSIONNEL_LAYOUTS, build: buildCvProfessionnel },
  Moderne: { layouts: CV_MODERNE_LAYOUTS, build: buildCvModerne },
  Créatif: { layouts: CV_CREATIF_LAYOUTS, build: buildCvCreatif },
  Élégant: { layouts: CV_ELEGANT_LAYOUTS, build: buildCvElegant },
  Étudiant: { layouts: CV_ETUDIANT_LAYOUTS, build: buildCvEtudiant },
  Tendance: { layouts: CV_TENDANCE_LAYOUTS, build: buildCvTendance },
  Motif: { layouts: CV_ORGANIQUE_LAYOUTS, build: buildCvOrganique },
} satisfies Record<TemplateCategory, { layouts: readonly { key: string; label: string }[]; build: (key: string, style: TemplateStyle, content: CvContent) => { background: string; elements: CvTemplate['design']['elements'] } }>

/** Donne la liste des variantes de mise en page d'une catégorie. */
function layoutsFor(category: TemplateCategory) {
  return CATEGORY_MODULES[category].layouts
}

/** Produit un nombre stable pour varier les métadonnées des modèles. */
function hash(str: string) {
  let h = 0
  for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h
}

const FONT_PAIRS = [
  { heading: 'var(--font-montserrat)', body: 'var(--font-lato)' },
  { heading: 'var(--font-playfair)', body: 'var(--font-jakarta)' },
  { heading: 'var(--font-dmserif)', body: 'var(--font-poppins)' },
  { heading: 'var(--font-space)', body: 'var(--font-raleway)' },
  { heading: 'var(--font-lora)', body: 'var(--font-montserrat)' },
  { heading: 'var(--font-poppins)', body: 'var(--font-lato)' },
  { heading: 'var(--font-jakarta)', body: 'var(--font-space)' },
  { heading: 'var(--font-raleway)', body: 'var(--font-poppins)' },
  { heading: 'var(--font-lato)', body: 'var(--font-lora)' },
  { heading: 'var(--font-montserrat)', body: 'var(--font-space)' },
  { heading: 'var(--font-manrope)', body: 'var(--font-outfit)' },
  { heading: 'var(--font-urbanist)', body: 'var(--font-lato)' },
] as const

function fontsForTemplate(slug: string) {
  const tendance = /^tendance-(\d+)$/.exec(slug)
  if (tendance) return TENDANCE_FONTS[(Number(tendance[1]) - 1) % TENDANCE_FONTS.length]
  const motif = /^motif-(\d+)$/.exec(slug)
  if (motif) return ORGANIQUE_FONTS[(Number(motif[1]) - 1) % ORGANIQUE_FONTS.length]
  return FONT_PAIRS[hash(slug) % FONT_PAIRS.length]
}

/** Choisit un profil stable pour que les variantes gardent leur identité. */
function sampleForTemplate(category: TemplateCategory, layoutIndex: number) {
  if (category === 'Tendance') return TENDANCE_SAMPLE_CONTENTS[layoutIndex]
  if (category === 'Motif') return ORGANIQUE_SAMPLE_CONTENTS[layoutIndex]
  const categoryIndex = CATEGORIES.indexOf(category)
  const offset = CATEGORIES.slice(0, categoryIndex)
    .filter((item) => item !== 'Étudiant' && item !== 'Tendance' && item !== 'Motif')
    .reduce((total, item) => total + layoutsFor(item).length, 0)
  return SAMPLE_CONTENTS[offset + layoutIndex]
}

function studentForTemplate(layoutIndex: number) {
  return STUDENT_CONTENTS[layoutIndex]
}

/** Transforme un nom en identifiant d'URL sans accents ni espaces. */
function slugify(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Style (polices, couleurs) d'un modèle : le même pour la galerie et pour l'ajout d'une photo. */
function styleFor(category: TemplateCategory, layoutIndex: number, slug: string): TemplateStyle {
  const cfg = CONFIG[category]
  const palette = cfg.palettes[layoutIndex % cfg.palettes.length]
  const fontPair = fontsForTemplate(slug)
  return {
    heading: fontPair.heading,
    body: fontPair.body,
    primary: palette.primary,
    secondary: palette.secondary,
    text: palette.text ?? '#14202e',
    muted: '#4b5a6a',
    bg: palette.bg ?? '#ffffff',
    upper: cfg.upper,
    headingVariant: cfg.headingVariant,
  }
}

/**
 * Retouches propres à un modèle précis. Elles doivent s'appliquer à chaque
 * reconstruction (galerie ET ajout de photo), sinon le modèle change d'aspect
 * dès que l'utilisateur met sa photo.
 */
function applyTemplateOverrides(category: TemplateCategory, layoutIndex: number, elements: CvElement[]): CvElement[] {
  // Prisme garde ses accents organiques dans l'en-tête : ses deux formes
  // deviennent des vagues asymétriques plutôt que des blocs géométriques.
  if (category !== 'Moderne' || layoutIndex !== 5) return elements
  return elements.map((element) => {
    if (element.type !== 'rect' && element.type !== 'circle') return element
    if (element.name === 'Bloc titre') return {
      ...element,
      shape: 'wave' as const,
      customPath: 'M 0 0 L 1000 0 L 1000 780 C 850 900 700 830 560 900 C 380 1000 180 850 0 900 Z',
    }
    if (element.x === 560 && element.y === -90) return {
      ...element,
      shape: 'wave' as const,
      customPath: 'M 430 0 C 720 30 1000 180 930 470 C 900 760 650 1000 380 860 C 100 720 0 470 120 210 C 200 40 300 0 430 0 Z',
    }
    return element
  })
}

/** Construit le design final d'un modèle : layout, retouches, puis finition automatique. */
function buildDesign(category: TemplateCategory, layoutIndex: number, slug: string, content: CvContent) {
  const layout = layoutsFor(category)[layoutIndex]
  const style = styleFor(category, layoutIndex, slug)
  const built = CATEGORY_MODULES[category].build(layout.key, style, content)
  const elements = applyTemplateOverrides(category, layoutIndex, built.elements)
  const finished = finishLayout(elements, {
    pair: fontsForTemplate(slug),
    nameSize: 40 + (hash(slug) % 11),
    pageHeight: PAGE_HEIGHT,
    pageBackground: built.background,
    fullName: content.fullName,
    title: content.title,
  })
  // Les layouts ajoutent parfois les fonds de cartes après leur contenu.
  // Fixe les couches ici pour que les aplats restent derrière les photos,
  // et que toutes les informations restent lisibles au premier plan.
  const layer = (el: CvElement) => {
    if (el.type === 'text') return 3
    if (el.type === 'icon') return 2
    if (el.type === 'image') return 1
    return 0
  }
  const layered = finished
    .map((el, index) => ({ el, index }))
    .sort((a, b) => layer(a.el) - layer(b.el) || a.index - b.index)
    .map(({ el }) => el)
  return { background: built.background, elements: layered.map((el, i) => ({ ...el, id: `${slug}-${i}` })) }
}

/**
 * Crée chaque modèle à partir d'une palette, d'un layout et d'un contenu.
 * Chaque élément reçoit ensuite un identifiant unique à ce modèle.
 */
function buildTemplates(): CvTemplate[] {
  const list: CvTemplate[] = []
  CATEGORIES.forEach((category) => {
    const cfg = CONFIG[category]
    layoutsFor(category).forEach((layout, li) => {
      const palette = cfg.palettes[li % cfg.palettes.length]
      const name = cfg.names[li] ?? layout.label
      const slug = `${slugify(category)}-${String(li + 1).padStart(2, '0')}`
      const content: CvContent = category === 'Étudiant' ? studentForTemplate(li) : sampleForTemplate(category, li)
      const design = buildDesign(category, li, slug, content)
      const h = hash(slug)
      list.push({
        id: slug,
        slug,
        name: `${name}`,
        category,
        tags: [...cfg.tags, layout.label.toLowerCase()],
        popularity: 40 + (h % 960),
        createdAt: Date.UTC(2025, h % 12, (h % 27) + 1),
        accent: palette.primary,
        design: {
          name: `CV ${name}`,
          templateId: slug,
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT,
          background: design.background,
          elements: design.elements,
        },
      })
    })
  })
  return list
}

/** Collection finale consommée par l'accueil, la galerie et l'aperçu. */
export const TEMPLATES: CvTemplate[] = buildTemplates()

/** Reconstruit le modèle avec une photo si son layout accepte les portraits. */
export function withTemplatePhoto(template: CvTemplate, photo?: string): CvTemplate {
  if (!photo) return template
  const li = Number(template.id.split('-').at(-1)) - 1
  const ci = CATEGORIES.indexOf(template.category)
  const layout = layoutsFor(template.category)[li]
  if (!layout || ci < 0) return template
  const supportsPhoto = template.category === 'Tendance' || template.category === 'Motif' || (template.category === 'Minimaliste'
    ? li !== 2
    : ['sidebar-left', 'header-band', 'timeline', 'split-top', 'sidebar-right', 'skill-bars', 'editorial-photo', 'photo-column', 'top-portrait'].includes(layout.key)
      || (template.category === 'Créatif' && layout.key === 'bold'))
  if (!supportsPhoto) {
    return template
  }
  const base = template.category === 'Étudiant' ? studentForTemplate(li) : sampleForTemplate(template.category, li)
  const design = buildDesign(template.category, li, template.id, { ...base, photo })
  return {
    ...template,
    tags: template.tags.includes('photo') ? template.tags : [...template.tags, 'photo'],
    design: { ...template.design, background: design.background, elements: design.elements },
  }
}

/** Retrouve un modèle par identifiant, par exemple `moderne-01`. */
export function getTemplate(id: string) {
  return TEMPLATES.find((t) => t.id === id)
}
