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
import type { CategoryConfig } from './category-config'
import { measureText } from './builder'
import { SAMPLE_CONTENTS } from './sample'
import type { CvContent, CvElement, CvTemplate, TemplateCategory } from './types'
import { PAGE_HEIGHT, PAGE_WIDTH } from './types'

/** Ordre d'affichage des familles de CV dans les pages de galerie. */
export const CATEGORIES: TemplateCategory[] = [
  'Minimaliste',
  'Professionnel',
  'Moderne',
  'Créatif',
  'Élégant',
  'Étudiant',
]

/** Réglages de style : chaque catégorie pointe vers son propre fichier. */
const CONFIG: Record<TemplateCategory, CategoryConfig> = {
  Minimaliste: MINIMALISTE_TEMPLATE,
  Professionnel: PROFESSIONNEL_TEMPLATE,
  Moderne: MODERNE_TEMPLATE,
  Créatif: CREATIF_TEMPLATE,
  Élégant: ELEGANT_TEMPLATE,
  Étudiant: ETUDIANT_TEMPLATE,
}

/** Layouts et fonctions de construction propres à chaque catégorie. */
const CATEGORY_MODULES = {
  Minimaliste: { layouts: CV_MINIMALISTE_LAYOUTS, build: buildCvMinimaliste },
  Professionnel: { layouts: CV_PROFESSIONNEL_LAYOUTS, build: buildCvProfessionnel },
  Moderne: { layouts: CV_MODERNE_LAYOUTS, build: buildCvModerne },
  Créatif: { layouts: CV_CREATIF_LAYOUTS, build: buildCvCreatif },
  Élégant: { layouts: CV_ELEGANT_LAYOUTS, build: buildCvElegant },
  Étudiant: { layouts: CV_ETUDIANT_LAYOUTS, build: buildCvEtudiant },
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
  return FONT_PAIRS[hash(slug) % FONT_PAIRS.length]
}

function normalizeLabel(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '').toLocaleLowerCase()
}

const SECTION_TITLES = new Set([
  'profil', 'apropos', 'presentation', 'coordonnees', 'contact', 'competences', 'competencescles',
  'qualites', 'centresinteret', 'loisirs', 'langues', 'formation', 'formations', 'education',
  'experiences', 'experience', 'experiencesprofessionnelles', 'experienceprofessionnelle',
  'workexperience', 'professionalexperience', 'skills', 'profile', 'interests', 'projects', 'projets',
  'references', 'portfolio', 'certifications', 'parcours', 'parcoursacademique',
  'parcoursprofessionnel', 'atouts', 'projetsacademiques', 'profilprofessionnel',
])

/** Applique les tailles de lecture et la paire typographique propre à chaque CV. */
function applyCvTypography(elements: CvTemplate['design']['elements'], content: CvContent, slug: string) {
  const pair = fontsForTemplate(slug)
  const normalizedName = normalizeLabel(content.fullName)
  const normalizedTitle = normalizeLabel(content.title)
  let positioned: CvElement[] = elements.map((element) => {
    if (element.type !== 'text') return element
    const label = normalizeLabel(element.text)
    const isName = label === normalizedName
    const isRole = label === normalizedTitle
    const isSection = SECTION_TITLES.has(label) || (element.fontWeight >= 700 && (element.uppercase || element.text === element.text.toLocaleUpperCase('fr-FR')) && element.text.length <= 38)
    const fontSize = isName ? 40 + (hash(slug) % 11) : isRole || isSection ? 16 : 14
    const fontFamily = isName || isRole || isSection ? pair.heading : pair.body
    const h = measureText(element.text, element.w, fontSize, element.lineHeight, element.letterSpacing) + (isName ? Math.ceil(fontSize * 0.3) : 0)
    return { ...element, fontSize, fontFamily, h }
  })

  const nameIndex = positioned.findIndex((element) => element.type === 'text' && normalizeLabel(element.text) === normalizedName)
  const titleIndex = positioned.findIndex((element) => element.type === 'text' && normalizeLabel(element.text) === normalizedTitle)
  const nameElement = positioned[nameIndex]
  if (nameElement?.type === 'text' && nameElement.y < 320) {
    const photo = positioned
      .filter((element) => element.type === 'image' && element.y < 360)
      .map((element) => ({ element, rightGap: nameElement.x - (element.x + element.w), leftGap: element.x - (nameElement.x + nameElement.w) }))
      .filter(({ rightGap, leftGap }) => (rightGap >= 0 && rightGap <= 170) || (leftGap >= 0 && leftGap <= 170))
      .sort((a, b) => Math.min(a.rightGap >= 0 ? a.rightGap : Infinity, a.leftGap >= 0 ? a.leftGap : Infinity) - Math.min(b.rightGap >= 0 ? b.rightGap : Infinity, b.leftGap >= 0 ? b.leftGap : Infinity))[0]?.element
    if (photo?.type === 'image') {
      const nameY = Math.round(photo.y + (photo.h - nameElement.h) / 2)
      const titleY = titleIndex >= 0 && positioned[titleIndex].type === 'text'
        ? Math.max(positioned[titleIndex].y, nameY + nameElement.h + 8)
        : nameY + nameElement.h + 8
      positioned = positioned.map((element, index) => {
        if (index === nameIndex) return { ...element, y: nameY }
        if (element.type === 'text') {
          const sharesColumn = element.x < nameElement.x + nameElement.w - 8 && element.x + element.w > nameElement.x + 8
          if (!sharesColumn) return element
          if (index === titleIndex) return { ...element, y: titleY }
          if (element.y >= nameElement.y && element.y < nameY + nameElement.h) {
            return { ...element, y: Math.max(element.y, titleY + (titleIndex >= 0 ? 22 : 0)) }
          }
        }
        return element
      })
    }
  }

  // Reposition overflowing text boxes while preserving independent columns.
  const textElements = positioned.filter((element) => element.type === 'text').sort((a, b) => a.y - b.y || a.x - b.x)
  const placed: typeof textElements = []
  for (const element of textElements) {
    let y = element.y
    let attempts = 0
    while (attempts++ < textElements.length) {
      const imageCollisions = positioned.filter((other) => other.type === 'image' && other.x < element.x + element.w - 8 && other.x + other.w > element.x + 8 && y < other.y + other.h + 2 && y + element.h > other.y)
      if (imageCollisions.length > 0) {
        y = Math.max(...imageCollisions.map((image) => image.y + image.h + 12))
        continue
      }
      const collisions = placed.filter((other) => other.x < element.x + element.w - 8 && other.x + other.w > element.x + 8 && y < other.y + other.h + 3 && y + element.h > other.y)
      if (collisions.length === 0) break
      y = Math.max(...collisions.map((other) => other.y + other.h + 3))
    }
    const moved = { ...element, y }
    placed.push(moved)
  }
  const movedById = new Map(placed.map((element) => [element.id, element]))
  let settled = positioned.map((element) => element.type === 'text' ? movedById.get(element.id)! : element)
  const isSeparator = (element: CvElement) => element.type === 'line'
    || ((element.type === 'rect' || element.type === 'circle') && ((element.h <= 3 && element.w > 30) || (element.w <= 3 && element.h > 30)))

  // Give rules a clear gap from the text they underline or separate.
  for (let pass = 0; pass < 2; pass++) {
    settled = settled.map((separator) => {
      if (!isSeparator(separator)) return separator
      const above = settled.filter((element) => element.type === 'text'
        && element.x < separator.x + separator.w - 3
        && element.x + element.w > separator.x + 3
        && element.y <= separator.y + separator.h
        && element.y + element.h >= separator.y - 8)
      if (above.length === 0) return separator
      const nextY = Math.max(separator.y, ...above.map((element) => element.y + element.h + 6))
      return { ...separator, y: nextY } as CvElement
    })

    const rules = settled.filter(isSeparator)
    const orderedText = settled.filter((element) => element.type === 'text').sort((a, b) => a.y - b.y || a.x - b.x)
    const reflowed: typeof orderedText = []
    for (const element of orderedText) {
      let y = element.y
      for (let attempt = 0; attempt < orderedText.length; attempt++) {
        const textCollisions = reflowed.filter((other) => other.x < element.x + element.w - 8 && other.x + other.w > element.x + 8 && y < other.y + other.h + 3 && y + element.h > other.y)
        const ruleCollisions = rules.filter((rule) => rule.x < element.x + element.w - 3 && rule.x + rule.w > element.x + 3 && y < rule.y + rule.h + 6 && y + element.h > rule.y - 6)
        const imageCollisions = settled.filter((other) => other.type === 'image' && other.x < element.x + element.w - 8 && other.x + other.w > element.x + 8 && y < other.y + other.h + 6 && y + element.h > other.y - 6)
        const blockers = [...textCollisions, ...ruleCollisions, ...imageCollisions]
        if (blockers.length === 0) break
        y = Math.max(...blockers.map((blocker) => blocker.y + blocker.h + 6))
      }
      reflowed.push({ ...element, y })
    }
    const reflowedById = new Map(reflowed.map((element) => [element.id, element]))
    settled = settled.map((element) => element.type === 'text' ? reflowedById.get(element.id)! : element)
  }

  // Contact icons are inserted immediately before their label; keep the pair together
  // after a longer name or heading has pushed the label down.
  return settled.map((element, index) => {
    if (element.type !== 'icon') return element
    const label = settled[index + 1]
    if (label?.type !== 'text' || label.x < element.x + element.w - 2 || label.x - (element.x + element.w) > 22) return element
    return { ...element, y: label.y + Math.max(0, Math.round((label.h - element.h) / 2)) }
  })
}

/** Choisit un profil stable pour que les variantes gardent leur identité. */
function sampleForTemplate(category: TemplateCategory, layoutIndex: number) {
  const categoryIndex = CATEGORIES.indexOf(category)
  const offset = CATEGORIES.slice(0, categoryIndex)
    .filter((item) => item !== 'Étudiant')
    .reduce((total, item) => total + layoutsFor(item).length, 0)
  return SAMPLE_CONTENTS[offset + layoutIndex]
}

function studentForTemplate(layoutIndex: number) {
  return STUDENT_CONTENTS[layoutIndex]
}

/** Répartit les sections dans la page quand un layout laisserait un grand vide en bas. */
function balanceContent(elements: CvElement[], pageHeight: number) {
  const flowStart = 285
  const targetBottom = pageHeight - 170
  const textBottom = Math.max(...elements.filter((element) => element.type === 'text').map((element) => element.y + element.h))
  if (!Number.isFinite(textBottom) || textBottom >= targetBottom || textBottom <= flowStart) return elements
  const factor = Math.min(2.1, (targetBottom - flowStart) / (textBottom - flowStart))
  return elements.map((element) => {
    const isLargeBackdrop = (element.type === 'rect' || element.type === 'circle') && element.w * element.h > 12_000
    if (isLargeBackdrop || element.y < flowStart) return element
    return { ...element, y: Math.round(flowStart + (element.y - flowStart) * factor) } as CvElement
  })
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

/**
 * Crée chaque modèle à partir d'une palette, d'un layout et d'un contenu.
 * Chaque élément reçoit ensuite un identifiant unique à ce modèle.
 */
function buildTemplates(): CvTemplate[] {
  const list: CvTemplate[] = []
  CATEGORIES.forEach((category, ci) => {
    const cfg = CONFIG[category]
    const categoryModule = CATEGORY_MODULES[category]
    layoutsFor(category).forEach((layout, li) => {
      const palette = cfg.palettes[li % cfg.palettes.length]
      const name = cfg.names[li] ?? layout.label
      const slug = `${slugify(category)}-${String(li + 1).padStart(2, '0')}`
      const fontPair = fontsForTemplate(slug)
      const style: TemplateStyle = {
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
      const base = category === 'Étudiant' ? studentForTemplate(li) : sampleForTemplate(category, li)
      const content: CvContent = {
        ...base,
      }
      const { background, elements: initialElements } = categoryModule.build(layout.key, style, content)
      let elements = initialElements
      // Prisme garde ses accents organiques dans l'en-tête : ses deux formes
      // deviennent des vagues asymétriques plutôt que des blocs géométriques.
      if (category === 'Moderne' && li === 5) {
        elements = elements.map((element) => {
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
      const typedElements = applyCvTypography(elements, content, slug)
      const balancedElements = balanceContent(typedElements, PAGE_HEIGHT)
      const h = hash(slug)
      const template: CvTemplate = {
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
          background,
          elements: balancedElements.map((el, i) => ({ ...el, id: `${slug}-${i}` })),
        },
      }
      list.push(template)
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
  const supportsPhoto = template.category === 'Minimaliste'
    ? li !== 2
    : ['sidebar-left', 'header-band', 'timeline', 'split-top', 'sidebar-right', 'skill-bars', 'editorial-photo', 'photo-column', 'top-portrait'].includes(layout.key)
      || (template.category === 'Créatif' && layout.key === 'bold')
  if (!supportsPhoto) {
    return template
  }
  const cfg = CONFIG[template.category]
  const palette = cfg.palettes[li % cfg.palettes.length]
  const fontPair = fontsForTemplate(template.id)
  const style: TemplateStyle = {
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
  const base = template.category === 'Étudiant' ? studentForTemplate(li) : sampleForTemplate(template.category, li)
  const { background, elements } = CATEGORY_MODULES[template.category].build(layout.key, style, { ...base, photo })
  return {
    ...template,
    tags: template.tags.includes('photo') ? template.tags : [...template.tags, 'photo'],
    design: {
      ...template.design,
      background,
      elements: balanceContent(applyCvTypography(elements, { ...base, photo }, template.id), PAGE_HEIGHT).map((el, i) => ({ ...el, id: `${template.id}-${i}` })),
    },
  }
}

/** Retrouve un modèle par identifiant, par exemple `moderne-01`. */
export function getTemplate(id: string) {
  return TEMPLATES.find((t) => t.id === id)
}
