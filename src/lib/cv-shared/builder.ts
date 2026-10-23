/**
 * # Lecon : dessiner un CV avec des elements
 *
 * Le builder transforme un contenu et un style en elements places sur une page.
 * Chaque element porte x/y (position) et w/h (taille). Les fonctions makeText,
 * makeRect, etc. fabriquent les briques ; createColumn les empile ; les fonctions
 * de layout composent colonnes, titres, photo et decorations.
 *
 * Pour creer une variante, copie une fonction de layout, ajuste ses coordonnees,
 * puis ajoute sa cle et son nom dans LAYOUTS. Le fichier cv-Minimaliste montre
 * comment fournir une liste de layouts differente pour une categorie.
 */
import { mix, readableOn } from './color'
import type {
  CvContent,
  CvElement,
  IconElement,
  ImageElement,
  LineElement,
  ShapeElement,
  TextElement,
} from './types'
import { PAGE_HEIGHT, PAGE_WIDTH } from './types'

/** Polices et couleurs communiquées à chaque fonction de layout. */
export interface TemplateStyle {
  heading: string
  body: string
  primary: string
  secondary: string
  text: string
  muted: string
  bg: string
  upper: boolean
  headingVariant: HeadingVariant
}

/** Forme décorative du titre d'une rubrique. */
type HeadingVariant = 'underline' | 'bar' | 'plain' | 'dot'

interface Colors {
  text: string
  muted: string
  accent: string
}

/** Compteur utilisé pour éviter les identifiants d'éléments identiques. */
let counter = 0

/** Crée un identifiant unique pour un élément généré ou ajouté dans l'éditeur. */
export function uid(prefix = 'el') {
  counter += 1
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}_${Math.random().toString(36).slice(2, 6)}`
}

/** Largeur moyenne d'un caractère selon la police (1 = police de référence, un peu plus étroite que Poppins). */
const WIDTH_FACTOR: Record<string, number> = {
  montserrat: 1.15, poppins: 1.1, space: 1.08, manrope: 1.08, jakarta: 1.06, raleway: 1.02,
  playfair: 1.02, outfit: 1, lora: 1, dmserif: 0.98, lato: 0.96, urbanist: 0.96,
}

/**
 * Estime la hauteur d'un texte afin de placer le bloc suivant en dessous.
 * `fontFamily` (facultatif) affine la largeur des lettres : Montserrat est bien
 * plus large que Lato. Les textes tout en majuscules sont aussi plus larges.
 */
export function measureText(text: string, w: number, fontSize: number, lineHeight: number, letterSpacing = 0, fontFamily = '') {
  const family = /--font-(\w+)/.exec(fontFamily)?.[1] ?? ''
  const isCaps = text === text.toLocaleUpperCase('fr-FR') && /\p{L}/u.test(text)
  const charW = fontSize * 0.52 * (WIDTH_FACTOR[family] ?? 1) * (isCaps ? 1.15 : 1) + letterSpacing
  const perLine = Math.max(1, Math.floor(w / charW))
  const lines = text.split('\n').reduce((sum, p) => sum + Math.max(1, Math.ceil(p.length / perLine)), 0)
  return Math.ceil(lines * fontSize * lineHeight) + 2
}

/** Crée un texte en complétant les propriétés visuelles laissées de côté. */
export function makeText(partial: Partial<TextElement> & { text: string; x: number; y: number; w: number }): TextElement {
  const fontSize = partial.fontSize ?? 12
  const lineHeight = partial.lineHeight ?? 1.4
  const letterSpacing = partial.letterSpacing ?? 0
  const text = partial.uppercase ? partial.text.toUpperCase() : partial.text
  return {
    id: uid('txt'),
    type: 'text',
    rotation: 0,
    opacity: 1,
    fontFamily: 'var(--font-lato)',
    fontWeight: 400,
    color: '#14202e',
    align: 'left',
    lineHeight,
    letterSpacing,
    fontSize,
    h: partial.h ?? measureText(text, partial.w, fontSize, lineHeight, letterSpacing, partial.fontFamily),
    ...partial,
  }
}

/** Crée un rectangle à la position et à la taille données. */
export function makeRect(partial: Partial<ShapeElement> & { x: number; y: number; w: number; h: number }): ShapeElement {
  return {
    id: uid('shp'),
    type: 'rect',
    rotation: 0,
    opacity: 1,
    fill: '#5CAFE7',
    stroke: 'transparent',
    strokeWidth: 0,
    radius: 0,
    ...partial,
  }
}

/** Crée un cercle en utilisant le même type de forme qu'un rectangle. */
export function makeCircle(partial: Partial<ShapeElement> & { x: number; y: number; w: number; h: number }) {
  return makeRect({ ...partial, type: 'circle', radius: 9999 })
}

/** Crée une ligne de séparation horizontale. */
export function makeLine(partial: Partial<LineElement> & { x: number; y: number; w: number }): LineElement {
  return {
    id: uid('ln'),
    type: 'line',
    h: 2,
    rotation: 0,
    opacity: 1,
    stroke: '#d6dde4',
    strokeWidth: 1,
    ...partial,
  }
}

/** Crée une image, par exemple un portrait placé dans le CV. */
export function makeImage(partial: Partial<ImageElement> & { src: string; x: number; y: number; w: number; h: number }): ImageElement {
  return {
    id: uid('img'),
    type: 'image',
    rotation: 0,
    opacity: 1,
    radius: 0,
    fit: 'cover',
    stroke: 'transparent',
    strokeWidth: 0,
    ...partial,
  }
}

/** Crée une icône dont le nom doit exister dans `icons.ts`. */
export function makeIcon(partial: Partial<IconElement> & { icon: string; x: number; y: number }): IconElement {
  return {
    id: uid('ico'),
    type: 'icon',
    w: 14,
    h: 14,
    rotation: 0,
    opacity: 1,
    color: '#5CAFE7',
    ...partial,
  }
}

const SKILL_LEVELS = [0.92, 0.84, 0.76, 0.88, 0.7, 0.64, 0.8, 0.72]

/**
 * Crée une colonne de mise en page. Chaque méthode ajoute ses éléments dans
 * `els`, puis avance la position verticale. Ainsi `heading(...).para(...)`
 * empile naturellement un titre puis son paragraphe sans recalculer leur y.
 */
function createColumn(els: CvElement[], s: TemplateStyle, x: number, y: number, w: number, c: Colors) {
  let cy = y
  const push = <T extends CvElement>(el: T) => {
    els.push(el)
    return el
  }
  const label = (t: string) => (s.upper ? t.toUpperCase() : t)

  const api = {
    /** Position verticale actuelle ; utile pour démarrer une autre colonne. */
    get y() {
      return cy
    },
    set y(v: number) {
      cy = v
    },
    /** Décale le prochain élément vers le bas sans ajouter de forme. */
    gap(n: number) {
      cy += n
      return api
    },
    /** Ajoute un titre de rubrique avec son style (ligne, barre, point ou texte). */
    heading(title: string, variant: HeadingVariant = s.headingVariant, align: 'left' | 'center' = 'left') {
      if (variant === 'bar') {
        push(makeRect({ x: align === 'center' ? x + w / 2 - 14 : x, y: cy, w: 28, h: 4, fill: c.accent, radius: 2 }))
        cy += 12
      }
      let tx = x
      let tw = w
      if (variant === 'dot') {
        push(makeCircle({ x, y: cy + 4, w: 9, h: 9, fill: c.accent }))
        tx = x + 18
        tw = w - 18
      }
      const t = push(
        makeText({
          text: label(title),
          x: tx,
          y: cy,
          w: tw,
          fontFamily: s.heading,
          fontSize: s.upper ? 13 : 17,
          fontWeight: 700,
          letterSpacing: s.upper ? 2 : 0,
          color: variant === 'plain' ? c.accent : c.text,
          align,
          lineHeight: 1.2,
        }),
      )
      cy += t.h + 6
      if (variant === 'underline') {
        push(makeLine({ x, y: cy, w, stroke: c.accent, strokeWidth: 1.5 }))
        cy += 12
      } else {
        cy += 4
      }
      return api
    },
    /** Ajoute un paragraphe et calcule sa hauteur avant de continuer la colonne. */
    para(text: string, opts: Partial<TextElement> = {}) {
      const t = push(
        makeText({ text, x, y: cy, w, fontFamily: s.body, fontSize: 12, color: c.muted, lineHeight: 1.5, ...opts }),
      )
      cy += t.h + 4
      return api
    },
    /** Affiche poste, entreprise, dates et description pour chaque expérience. */
    experiences(items: CvContent['experiences']) {
      for (const e of items) {
        const r = push(
          makeText({ text: e.role, x, y: cy, w, fontFamily: s.heading, fontSize: 14, fontWeight: 700, color: c.text }),
        )
        cy += r.h
        const m = push(
          makeText({
            text: `${e.company}  ·  ${e.period}`,
            x,
            y: cy,
            w,
            fontFamily: s.body,
            fontSize: 11.5,
            fontWeight: 600,
            color: c.accent,
          }),
        )
        cy += m.h + 2
        const d = push(
          makeText({ text: e.description, x, y: cy, w, fontFamily: s.body, fontSize: 11.5, color: c.muted, lineHeight: 1.45 }),
        )
        cy += d.h + 12
      }
      return api
    },
    /** Affiche les expériences avec une ligne verticale et des points. */
    timeline(items: CvContent['experiences']) {
      const startY = cy
      const lineX = x
      const inner = x + 22
      const innerW = w - 22
      const dots: CvElement[] = []
      for (const e of items) {
        dots.push(makeCircle({ x: lineX - 5, y: cy + 3, w: 12, h: 12, fill: c.accent, stroke: '#ffffff', strokeWidth: 2 }))
        const r = push(
          makeText({ text: e.role, x: inner, y: cy, w: innerW, fontFamily: s.heading, fontSize: 14, fontWeight: 700, color: c.text }),
        )
        cy += r.h
        const m = push(
          makeText({ text: `${e.company}  ·  ${e.period}`, x: inner, y: cy, w: innerW, fontFamily: s.body, fontSize: 11.5, fontWeight: 600, color: c.accent }),
        )
        cy += m.h + 2
        const d = push(
          makeText({ text: e.description, x: inner, y: cy, w: innerW, fontFamily: s.body, fontSize: 11.5, color: c.muted, lineHeight: 1.45 }),
        )
        cy += d.h + 14
      }
      els.push(makeRect({ x: lineX, y: startY + 6, w: 2, h: cy - startY - 20, fill: mix(c.accent, '#ffffff', 0.5) }))
      els.push(...dots)
      return api
    },
    /** Affiche les diplômes, établissements et périodes. */
    education(items: CvContent['education']) {
      for (const e of items) {
        const r = push(
          makeText({ text: e.degree, x, y: cy, w, fontFamily: s.heading, fontSize: 13, fontWeight: 700, color: c.text }),
        )
        cy += r.h
        const m = push(
          makeText({ text: `${e.school}  ·  ${e.period}`, x, y: cy, w, fontFamily: s.body, fontSize: 11.5, color: c.muted }),
        )
        cy += m.h + 10
      }
      return api
    },
    /** Affiche une liste à puces, pratique pour compétences et langues. */
    list(items: string[], opts: Partial<TextElement> = {}) {
      const t = push(
        makeText({
          text: items.map((i) => `•  ${i}`).join('\n'),
          x,
          y: cy,
          w,
          fontFamily: s.body,
          fontSize: 12,
          color: c.muted,
          lineHeight: 1.75,
          ...opts,
        }),
      )
      cy += t.h + 6
      return api
    },
    /** Affiche plusieurs valeurs sur une seule ligne, séparées par des points. */
    inline(items: string[], opts: Partial<TextElement> = {}) {
      const t = push(
        makeText({ text: items.join('   ·   '), x, y: cy, w, fontFamily: s.body, fontSize: 12, color: c.muted, lineHeight: 1.5, ...opts }),
      )
      cy += t.h + 6
      return api
    },
    /** Affiche chaque valeur dans une pastille colorée (une pastille trop longue passe sur plusieurs lignes). */
    pills(items: string[], fill: string, color: string) {
      let px = x
      let rowH = 0
      for (const item of items) {
        const natural = Math.ceil(item.length * 11.5 * 0.56 + 24)
        const pw = Math.min(natural, w)
        const lines = Math.max(1, Math.ceil(natural / w))
        const ph = lines > 1 ? Math.ceil(lines * 11.5 * 1.4) + 10 : 26
        if (px > x && px + pw > x + w) {
          px = x
          cy += rowH + 8
          rowH = 0
        }
        push(makeRect({ x: px, y: cy, w: pw, h: ph, fill, radius: lines > 1 ? 10 : 13 }))
        push(
          makeText({ text: item, x: px, y: cy + 4, w: pw, h: ph - 8, fontFamily: s.body, fontSize: 11.5, fontWeight: 600, color, align: 'center', lineHeight: 1.4 }),
        )
        rowH = Math.max(rowH, ph)
        px += pw + 8
      }
      cy += rowH + 14
      return api
    },
    /** Affiche les compétences avec une jauge horizontale. */
    bars(items: string[], track: string) {
      items.forEach((item, i) => {
        const t = push(makeText({ text: item, x, y: cy, w, fontFamily: s.body, fontSize: 12, fontWeight: 500, color: c.text }))
        cy += t.h + 3
        push(makeRect({ x, y: cy, w, h: 5, fill: track, radius: 3 }))
        push(makeRect({ x, y: cy, w: Math.round(w * SKILL_LEVELS[i % SKILL_LEVELS.length]), h: 5, fill: c.accent, radius: 3 }))
        cy += 15
      })
      cy += 4
      return api
    },
    /** Affiche les coordonnées accompagnées de leurs icônes. */
    contacts(content: CvContent, iconColor = c.accent) {
      const rows: [string, string][] = [
        ['mail', content.email],
        ['phone', content.phone],
        ['map-pin', content.location],
        ['globe', content.website],
      ]
      for (const [icon, value] of rows) {
        if (!value) continue
        push(makeIcon({ icon, x, y: cy + 1, w: 13, h: 13, color: iconColor }))
        const t = push(makeText({ text: value, x: x + 22, y: cy, w: w - 22, fontFamily: s.body, fontSize: 11.5, color: c.text }))
        cy += Math.max(t.h, 16) + 6
      }
      cy += 6
      return api
    },
  }
  return api
}

/** Contrat commun : style + contenu donnent le fond et les éléments d'une page. */
type LayoutFn = (s: TemplateStyle, c: CvContent) => { background: string; elements: CvElement[] }

/** Barre latérale gauche pour les contacts et compétences ; parcours à droite. */
const sidebarLeft: LayoutFn = (s, c) => {
  const els: CvElement[] = []
  const onSide = readableOn(s.secondary)
  const sideMuted = mix(onSide, s.secondary, 0.25)
  els.push(makeRect({ x: 0, y: 0, w: 270, h: PAGE_HEIGHT, fill: s.secondary, name: 'Barre latérale' }))
  if (c.photo) {
    els.push(makeCircle({ x: 38, y: 23, w: 194, h: 194, fill: s.bg, stroke: s.primary, strokeWidth: 3, name: 'Cadre du portrait' }))
    els.push(makeImage({ src: c.photo, x: 44, y: 29, w: 182, h: 182, radius: 9999, stroke: s.primary, strokeWidth: 3 }))
  }
  const side = createColumn(els, s, 32, c.photo ? 240 : 60, 206, { text: onSide, muted: sideMuted, accent: s.primary })
  side.heading('Contact').contacts(c).heading('Compétences').list(c.skills, { color: sideMuted }).gap(4)
  side.heading('Langues').list(c.languages, { color: sideMuted }).gap(4).heading('Intérêts').list(c.interests, { color: sideMuted })
  const main = createColumn(els, s, 310, 60, 440, { text: s.text, muted: s.muted, accent: s.primary })
  main.para(c.fullName, { fontFamily: s.heading, fontSize: 34, fontWeight: 800, color: s.text, lineHeight: 1.1 })
  main.para(c.title, { fontSize: 13, fontWeight: 600, color: s.primary, uppercase: true, letterSpacing: 3 }).gap(22)
  main.heading('Profil').para(c.summary).gap(10).heading('Expérience').experiences(c.experiences).gap(4)
  main.heading('Formation').education(c.education)
  return { background: s.bg, elements: els }
}

/** Colonne pâle à droite pour les infos secondaires et le portrait. */
const sidebarRight: LayoutFn = (s, c) => {
  const els: CvElement[] = []
  const tint = mix(s.primary, '#ffffff', 0.88)
  els.push(makeRect({ x: 530, y: 0, w: 264, h: PAGE_HEIGHT, fill: tint, name: 'Barre latérale' }))
  const main = createColumn(els, s, 50, 60, 440, { text: s.text, muted: s.muted, accent: s.primary })
  main.para(c.fullName, { fontFamily: s.heading, fontSize: 36, fontWeight: 800, color: s.text, lineHeight: 1.1 })
  main.para(c.title, { fontSize: 14, fontWeight: 500, color: s.muted }).gap(10)
  els.push(makeRect({ x: 50, y: main.y, w: 60, h: 5, fill: s.primary, radius: 3 }))
  main.gap(30).heading('Profil').para(c.summary).gap(10).heading('Expérience').experiences(c.experiences).gap(4)
  main.heading('Formation').education(c.education)
  if (c.photo) {
    els.push(makeRect({ x: 558, y: 28, w: 222, h: 236, fill: s.bg, radius: 24, stroke: s.primary, strokeWidth: 2, name: 'Cadre du portrait' }))
    els.push(makeImage({ src: c.photo, x: 568, y: 38, w: 202, h: 216, radius: 18, stroke: '#ffffff', strokeWidth: 4 }))
  }
  const side = createColumn(els, s, 562, c.photo ? 286 : 60, 200, { text: s.text, muted: s.muted, accent: s.primary })
  side.heading('Contact').contacts(c).heading('Compétences').pills(c.skills, '#ffffff', s.text)
  side.heading('Langues').list(c.languages).heading('Intérêts').list(c.interests)
  return { background: s.bg, elements: els }
}

/** Grand bandeau coloré en haut, puis contenu principal en deux colonnes. */
const headerBand: LayoutFn = (s, c) => {
  const els: CvElement[] = []
  const on = readableOn(s.primary)
  els.push(makeRect({ x: 0, y: 0, w: PAGE_WIDTH, h: 220, fill: s.primary, name: 'Bandeau' }))
  if (c.photo) {
    els.push(makeCircle({ x: 26, y: 16, w: 190, h: 190, fill: s.bg, stroke: '#ffffff', strokeWidth: 3, name: 'Cadre du portrait' }))
    els.push(makeImage({ src: c.photo, x: 32, y: 22, w: 178, h: 178, radius: 9999, stroke: '#ffffff', strokeWidth: 4 }))
  }
  const hx = c.photo ? 232 : 50
  const head = createColumn(els, s, hx, 72, PAGE_WIDTH - hx - 50, { text: on, muted: on, accent: on })
  head.para(c.fullName, { fontFamily: s.heading, fontSize: 38, fontWeight: 800, color: on, lineHeight: 1.1 })
  head.para(c.title, { fontSize: 14, fontWeight: 500, color: on, uppercase: true, letterSpacing: 3 })
  const left = createColumn(els, s, 50, 260, 220, { text: s.text, muted: s.muted, accent: s.primary })
  left.heading('Contact').contacts(c).heading('Compétences').pills(c.skills, mix(s.primary, '#ffffff', 0.85), s.text)
  left.heading('Langues').list(c.languages)
  els.push(makeRect({ x: 300, y: 260, w: 1, h: 800, fill: '#e2e8ee' }))
  const right = createColumn(els, s, 330, 260, 414, { text: s.text, muted: s.muted, accent: s.primary })
  right.heading('Profil').para(c.summary).gap(10).heading('Expérience').experiences(c.experiences).heading('Formation').education(c.education)
  return { background: s.bg, elements: els }
}

/** Composition classique centrée avec coordonnées puis deux listes en bas. */
const classic: LayoutFn = (s, c) => {
  const els: CvElement[] = []
  const col = createColumn(els, s, 80, 64, 634, { text: s.text, muted: s.muted, accent: s.primary })
  col.para(c.fullName, { fontFamily: s.heading, fontSize: 40, fontWeight: 700, color: s.text, align: 'center', lineHeight: 1.1 })
  col.para(c.title, { fontSize: 14, color: s.primary, align: 'center', uppercase: true, letterSpacing: 3, fontWeight: 600 })
  col.para([c.email, c.phone, c.location].join('   ·   '), { align: 'center', fontSize: 10.5 }).gap(8)
  els.push(makeLine({ x: 80, y: col.y, w: 634, stroke: s.text, strokeWidth: 1.5 }))
  col.gap(24).heading('Profil').para(c.summary).gap(8).heading('Expérience').experiences(c.experiences)
  col.heading('Formation').education(c.education).gap(4)
  const y = col.y
  const a = createColumn(els, s, 80, y, 300, { text: s.text, muted: s.muted, accent: s.primary })
  a.heading('Compétences').list(c.skills)
  const b = createColumn(els, s, 414, y, 300, { text: s.text, muted: s.muted, accent: s.primary })
  b.heading('Langues').list(c.languages)
  return { background: s.bg, elements: els }
}

/** En-tête horizontal, compétences dans la colonne gauche, récit à droite. */
const twoColumn: LayoutFn = (s, c) => {
  const els: CvElement[] = []
  const head = createColumn(els, s, 50, 56, 420, { text: s.text, muted: s.muted, accent: s.primary })
  head.para(c.fullName, { fontFamily: s.heading, fontSize: 42, fontWeight: 800, color: s.text, lineHeight: 1.05 })
  head.para(c.title, { fontSize: 14, color: s.primary, fontWeight: 600 })
  const contact = createColumn(els, s, 520, 62, 224, { text: s.text, muted: s.muted, accent: s.primary })
  contact.contacts(c)
  const ruleY = Math.max(head.y, contact.y) + 10
  els.push(makeRect({ x: 50, y: ruleY, w: 694, h: 3, fill: s.primary }))
  const left = createColumn(els, s, 50, ruleY + 34, 220, { text: s.text, muted: s.muted, accent: s.primary })
  left.heading('Compétences').bars(c.skills, '#e7edf2').heading('Langues').list(c.languages).heading('Intérêts').list(c.interests)
  const right = createColumn(els, s, 310, ruleY + 34, 434, { text: s.text, muted: s.muted, accent: s.primary })
  right.heading('Profil').para(c.summary).gap(10).heading('Expérience').experiences(c.experiences).heading('Formation').education(c.education)
  return { background: s.bg, elements: els }
}

/** Ligne chronologique pour rendre la progression professionnelle visible. */
const timeline: LayoutFn = (s, c) => {
  const els: CvElement[] = []
  const tint = mix(s.primary, '#ffffff', 0.9)
  els.push(makeRect({ x: 546, y: 0, w: 248, h: PAGE_HEIGHT, fill: tint }))
  const head = createColumn(els, s, 50, 60, 460, { text: s.text, muted: s.muted, accent: s.primary })
  head.para(c.fullName, { fontFamily: s.heading, fontSize: 36, fontWeight: 800, color: s.text, lineHeight: 1.1 })
  head.para(c.title, { fontSize: 14, color: s.primary, fontWeight: 600 }).gap(10).para(c.summary).gap(20)
  head.heading('Parcours')
  const tl = createColumn(els, s, 56, head.y, 454, { text: s.text, muted: s.muted, accent: s.primary })
  tl.timeline(c.experiences).gap(6)
  const edu = createColumn(els, s, 50, tl.y, 460, { text: s.text, muted: s.muted, accent: s.primary })
  edu.heading('Formation').education(c.education)
  if (c.photo) {
    els.push(makeCircle({ x: 572, y: 30, w: 194, h: 194, fill: s.bg, stroke: s.primary, strokeWidth: 3, name: 'Cadre du portrait' }))
    els.push(makeImage({ src: c.photo, x: 578, y: 36, w: 182, h: 182, radius: 9999, stroke: '#ffffff', strokeWidth: 3 }))
  }
  const side = createColumn(els, s, 574, c.photo ? 242 : 60, 196, { text: s.text, muted: s.muted, accent: s.primary })
  side.heading('Contact').contacts(c).heading('Compétences').list(c.skills).heading('Langues').list(c.languages)
  return { background: s.bg, elements: els }
}

/** Gros bandeau contrasté pour un CV plus graphique et expressif. */
const bold: LayoutFn = (s, c) => {
  const els: CvElement[] = []
  const on = readableOn(s.primary)
  els.push(makeRect({ x: 0, y: 0, w: PAGE_WIDTH, h: 300, fill: s.primary, name: 'Bloc titre' }))
  els.push(makeCircle({ x: 560, y: -90, w: 300, h: 300, fill: s.secondary, opacity: 0.9, name: 'Forme décorative' }))
  els.push(makeCircle({ x: 690, y: 170, w: 70, h: 70, fill: mix(s.secondary, '#ffffff', 0.4), opacity: 0.9 }))
  const head = createColumn(els, s, 50, 60, 520, { text: on, muted: on, accent: on })
  head.para(c.fullName, { fontFamily: s.heading, fontSize: 52, fontWeight: 800, color: on, uppercase: true, lineHeight: 1, letterSpacing: 1 })
  head.para(c.title, { fontSize: 15, fontWeight: 600, color: on, letterSpacing: 2, uppercase: true }).gap(6)
  head.inline([c.email, c.phone, c.location], { color: on, fontSize: 10.5 })
  const left = createColumn(els, s, 50, 344, 350, { text: s.text, muted: s.muted, accent: s.primary })
  left.heading('Expérience').experiences(c.experiences)
  const right = createColumn(els, s, 440, 344, 304, { text: s.text, muted: s.muted, accent: s.primary })
  right.heading('Profil').para(c.summary).gap(8).heading('Formation').education(c.education)
  right.heading('Compétences').pills(c.skills, s.secondary, readableOn(s.secondary)).heading('Langues').list(c.languages)
  return { background: s.bg, elements: els }
}

/** Présentation sobre centrée sur la typographie et les espaces blancs. */
const minimalCentered: LayoutFn = (s, c) => {
  const els: CvElement[] = []
  const col = createColumn(els, s, 137, 70, 520, { text: s.text, muted: s.muted, accent: s.primary })
  col.para(c.fullName, { fontFamily: s.heading, fontSize: 30, fontWeight: 300, letterSpacing: 8, uppercase: true, color: s.text, align: 'center' })
  col.para(c.title, { fontSize: 11.5, letterSpacing: 4, uppercase: true, align: 'center', color: s.muted }).gap(6)
  els.push(makeRect({ x: 377, y: col.y, w: 40, h: 2, fill: s.primary }))
  col.gap(18).para([c.email, c.phone, c.location].join('   ·   '), { align: 'center', fontSize: 10 }).gap(20)
  col.heading('Profil', 'plain', 'center').para(c.summary, { align: 'center' }).gap(14)
  col.heading('Expérience', 'plain', 'center').experiences(c.experiences).gap(4)
  col.heading('Formation', 'plain', 'center').education(c.education).gap(4)
  col.heading('Compétences', 'plain', 'center').inline(c.skills, { align: 'center' })
  return { background: s.bg, elements: els }
}

/** Grande zone portrait à gauche, puis ruban de coordonnées sous l'en-tête. */
const splitTop: LayoutFn = (s, c) => {
  const els: CvElement[] = []
  const on = readableOn(s.primary)
  if (c.photo) {
    els.push(makeRect({ x: 0, y: 0, w: 300, h: 340, fill: s.secondary, name: 'Cadre du portrait' }))
    els.push(makeImage({ src: c.photo, x: 0, y: 0, w: 300, h: 340, stroke: '#ffffff', strokeWidth: 3 }))
  }
  else els.push(makeRect({ x: 0, y: 0, w: 300, h: 340, fill: s.secondary }))
  const head = createColumn(els, s, 340, 70, 410, { text: s.text, muted: s.muted, accent: s.primary })
  head.para(c.fullName, { fontFamily: s.heading, fontSize: 38, fontWeight: 800, color: s.text, lineHeight: 1.08 })
  head.para(c.title, { fontSize: 14, color: s.primary, fontWeight: 600, uppercase: true, letterSpacing: 2 }).gap(12).para(c.summary)
  els.push(makeRect({ x: 0, y: 340, w: PAGE_WIDTH, h: 50, fill: s.primary, name: 'Bande contact' }))
  const items = [c.email, c.phone, c.location]
  items.forEach((v, i) => {
    els.push(makeText({ text: v, x: 30 + i * 250, y: 357, w: 240, fontFamily: s.body, fontSize: 10.5, fontWeight: 600, color: on, align: 'center' }))
  })
  const left = createColumn(els, s, 50, 430, 280, { text: s.text, muted: s.muted, accent: s.primary })
  left.heading('Formation').education(c.education).heading('Compétences').bars(c.skills, '#e7edf2').heading('Langues').list(c.languages)
  const right = createColumn(els, s, 370, 430, 374, { text: s.text, muted: s.muted, accent: s.primary })
  right.heading('Expérience').experiences(c.experiences).heading('Intérêts').list(c.interests)
  return { background: s.bg, elements: els }
}

/** Barre latérale avec compétences mesurées par des barres décoratives. */
const skillBars: LayoutFn = (s, c) => {
  const els: CvElement[] = []
  const onSide = readableOn(s.secondary)
  const sideMuted = mix(onSide, s.secondary, 0.25)
  els.push(makeRect({ x: 290, y: 0, w: 504, h: 170, fill: mix(s.primary, '#ffffff', 0.86) }))
  els.push(makeRect({ x: 0, y: 0, w: 290, h: PAGE_HEIGHT, fill: s.secondary, name: 'Barre latérale' }))
  if (c.photo) {
    els.push(makeRect({ x: 44, y: 30, w: 202, h: 202, fill: s.bg, radius: 30, stroke: s.primary, strokeWidth: 3, name: 'Cadre du portrait' }))
    els.push(makeImage({ src: c.photo, x: 52, y: 38, w: 186, h: 186, radius: 24, stroke: '#ffffff', strokeWidth: 3 }))
  }
  const side = createColumn(els, s, 36, c.photo ? 258 : 60, 218, { text: onSide, muted: sideMuted, accent: s.primary })
  side.heading('Contact').contacts(c).heading('Compétences').bars(c.skills, mix(onSide, s.secondary, 0.8))
  side.heading('Langues').list(c.languages, { color: sideMuted })
  const head = createColumn(els, s, 330, 50, 414, { text: s.text, muted: s.muted, accent: s.primary })
  head.para(c.fullName, { fontFamily: s.heading, fontSize: 34, fontWeight: 800, color: s.text, lineHeight: 1.1 })
  head.para(c.title, { fontSize: 13.5, color: s.primary, fontWeight: 700, uppercase: true, letterSpacing: 2 })
  const main = createColumn(els, s, 330, 205, 414, { text: s.text, muted: s.muted, accent: s.primary })
  main.heading('Profil').para(c.summary).gap(10).heading('Expérience').experiences(c.experiences).heading('Formation').education(c.education)
  main.heading('Intérêts').pills(c.interests, mix(s.primary, '#ffffff', 0.85), s.text)
  return { background: s.bg, elements: els }
}

/** En-tête éditorial avec portrait, récit à gauche et listes à droite. */
const editorialPhoto: LayoutFn = (s, c) => {
  const els: CvElement[] = []
  const side = mix(s.primary, '#ffffff', 0.92)
  els.push(makeRect({ x: 0, y: 0, w: PAGE_WIDTH, h: 250, fill: side, name: 'En-tête éditorial' }))
  els.push(makeRect({ x: 0, y: 0, w: 14, h: 250, fill: s.primary }))
  if (c.photo) {
    els.push(makeRect({ x: 548, y: 18, w: 194, h: 220, fill: s.bg, radius: 22, stroke: s.primary, strokeWidth: 2, name: 'Cadre du portrait' }))
    els.push(makeImage({ src: c.photo, x: 556, y: 26, w: 178, h: 204, radius: 16, stroke: '#ffffff', strokeWidth: 4 }))
  }
  const head = createColumn(els, s, 54, 48, 470, { text: s.text, muted: s.muted, accent: s.primary })
  head.para(c.fullName, { fontFamily: s.heading, fontSize: 36, fontWeight: 800, color: s.text, lineHeight: 1.08 })
  head.para(c.title, { fontSize: 13, color: s.primary, fontWeight: 700, uppercase: true, letterSpacing: 2 }).gap(8)
  head.para([c.email, c.phone, c.location].join('  ·  '), { fontSize: 9.5 })
  const main = createColumn(els, s, 54, 286, 430, { text: s.text, muted: s.muted, accent: s.primary })
  main.heading('Profil').para(c.summary).gap(8).heading('Expérience').experiences(c.experiences).heading('Formation').education(c.education)
  const aside = createColumn(els, s, 540, 286, 204, { text: s.text, muted: s.muted, accent: s.primary })
  aside.heading('Compétences').pills(c.skills, side, s.text).heading('Langues').list(c.languages).heading('Intérêts').list(c.interests)
  return { background: s.bg, elements: els }
}

/** Colonne colorée dédiée au portrait, aux contacts et aux compétences. */
const photoColumn: LayoutFn = (s, c) => {
  const els: CvElement[] = []
  const on = readableOn(s.primary)
  els.push(makeRect({ x: 0, y: 0, w: 276, h: PAGE_HEIGHT, fill: s.primary, name: 'Colonne portrait' }))
  if (c.photo) {
    els.push(makeCircle({ x: 33, y: 37, w: 210, h: 210, fill: s.bg, stroke: '#ffffff', strokeWidth: 3, name: 'Cadre du portrait' }))
    els.push(makeImage({ src: c.photo, x: 40, y: 44, w: 196, h: 196, radius: 9999, stroke: '#ffffff', strokeWidth: 4 }))
  }
  const profile = createColumn(els, s, 34, c.photo ? 260 : 66, 208, { text: on, muted: on, accent: on })
  profile.para(c.fullName, { fontFamily: s.heading, fontSize: 24, fontWeight: 800, color: on, align: 'center', lineHeight: 1.1 })
  profile.para(c.title, { fontSize: 11, color: on, align: 'center', uppercase: true, letterSpacing: 1.5 }).gap(14)
  profile.heading('Contact').contacts(c, on).heading('Compétences').list(c.skills, { color: on }).heading('Langues').list(c.languages, { color: on })
  const main = createColumn(els, s, 320, 64, 424, { text: s.text, muted: s.muted, accent: s.primary })
  main.heading('À propos').para(c.summary).gap(14).heading('Expérience').experiences(c.experiences).gap(4).heading('Formation').education(c.education)
  main.heading('Centres d’intérêt').inline(c.interests)
  return { background: s.bg, elements: els }
}

/** Bandeau supérieur avec portrait et deux colonnes sous celui-ci. */
const topPortrait: LayoutFn = (s, c) => {
  const els: CvElement[] = []
  const tint = mix(s.primary, '#ffffff', 0.9)
  els.push(makeRect({ x: 0, y: 0, w: PAGE_WIDTH, h: 270, fill: s.primary, name: 'Bandeau portrait' }))
  if (c.photo) {
    els.push(makeRect({ x: 34, y: 24, w: 190, h: 220, fill: s.bg, radius: 24, stroke: '#ffffff', strokeWidth: 2, name: 'Cadre du portrait' }))
    els.push(makeImage({ src: c.photo, x: 40, y: 30, w: 178, h: 208, radius: 18, stroke: '#ffffff', strokeWidth: 4 }))
  }
  const on = readableOn(s.primary)
  const head = createColumn(els, s, c.photo ? 238 : 54, 64, c.photo ? 500 : 686, { text: on, muted: on, accent: on })
  head.para(c.fullName, { fontFamily: s.heading, fontSize: 40, fontWeight: 800, color: on, lineHeight: 1.08 })
  head.para(c.title, { fontSize: 14, color: on, uppercase: true, letterSpacing: 2 }).gap(8)
  head.para([c.email, c.phone, c.location].join('   ·   '), { fontSize: 10, color: on })
  const main = createColumn(els, s, 54, 310, 410, { text: s.text, muted: s.muted, accent: s.primary })
  main.heading('Expérience').experiences(c.experiences).heading('Formation').education(c.education)
  const aside = createColumn(els, s, 508, 310, 236, { text: s.text, muted: s.muted, accent: s.primary })
  aside.heading('Profil').para(c.summary).gap(8).heading('Compétences').list(c.skills).heading('Langues').list(c.languages).heading('Intérêts').list(c.interests)
  return { background: s.bg, elements: els }
}

/** Catalogue des layouts accessibles aux catégories utilisant le builder commun. */
export const LAYOUTS: { key: string; label: string; fn: LayoutFn }[] = [
  { key: 'sidebar-left', label: 'Barre latérale', fn: sidebarLeft },
  { key: 'header-band', label: 'Bandeau', fn: headerBand },
  { key: 'two-column', label: 'Deux colonnes', fn: twoColumn },
  { key: 'classic', label: 'Classique', fn: classic },
  { key: 'timeline', label: 'Chronologie', fn: timeline },
  { key: 'bold', label: 'Audacieux', fn: bold },
  { key: 'minimal-centered', label: 'Centré', fn: minimalCentered },
  { key: 'split-top', label: 'Portrait', fn: splitTop },
  { key: 'sidebar-right', label: 'Colonne droite', fn: sidebarRight },
  { key: 'skill-bars', label: 'Compétences', fn: skillBars },
  { key: 'editorial-photo', label: 'Éditorial photo', fn: editorialPhoto },
  { key: 'photo-column', label: 'Colonne portrait', fn: photoColumn },
  { key: 'top-portrait', label: 'Bandeau portrait', fn: topPortrait },
]

/** Construit le layout demandé ; choisit le premier si la clé est inconnue. */
export function buildLayout(layoutKey: string, style: TemplateStyle, content: CvContent) {
  const layout = LAYOUTS.find((l) => l.key === layoutKey) ?? LAYOUTS[0]
  return layout.fn(style, content)
}
