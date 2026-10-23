/**
 * # Leçon : la finition automatique d'un modèle
 *
 * Les layouts dessinent des CV avec de petites polices. Cette étape agrandit les
 * textes (tailles de lecture), puis re-pose les blocs pour qu'ils ne se
 * chevauchent pas.
 *
 * Règle importante : un texte n'est jamais déplacé seul. Les décorations qui lui
 * appartiennent (pastille derrière un mot, jauge de compétence, filet sous un
 * titre, puce ou icône à gauche, point d'une chronologie) sont rattachées à ce
 * texte et le suivent. Sans cela, les pastilles et les filets restent en place
 * pendant que les textes descendent, et le CV paraît cassé.
 *
 * Le fichier suit cet ordre :
 *   1. `analyseAttachments` repère quelle décoration appartient à quel texte ;
 *   2. les polices et les tailles sont appliquées ;
 *   3. les blocs (texte + décorations) sont re-posés de haut en bas ;
 *   4. le contenu est étiré si le bas de page reste vide ;
 *   5. `ensureReadableText` corrige les textes illisibles (blanc sur blanc...).
 */
import { measureText } from './builder'
import { mix, readableOn } from './color'
import type { CvElement, ShapeElement } from './types'

type TextEl = Extract<CvElement, { type: 'text' }>
type Box = { x: number; y: number; w: number; h: number }

export interface FinishOptions {
  /** Polices de titre et de texte courant propres à ce modèle. */
  pair: { heading: string; body: string }
  /** Taille du nom (varie légèrement d'un modèle à l'autre). */
  nameSize: number
  pageHeight: number
  /** Couleur de fond de la page, utilisée pour contrôler la lisibilité. */
  pageBackground: string
  /** Nom et titre du profil, pour reconnaître ces deux textes. */
  fullName: string
  title: string
}

/* ------------------------------------------------------------------ */
/* Petits outils                                                       */
/* ------------------------------------------------------------------ */

const isText = (el: CvElement): el is TextEl => el.type === 'text'
const isShape = (el: CvElement): el is ShapeElement => el.type === 'rect' || el.type === 'circle'
/** Grand aplat (fond de colonne, bandeau) : il ne bouge jamais. */
const isBackdrop = (el: CvElement) => isShape(el) && el.w * el.h > 12_000
/** Bandeau fin (barre de contact) : il contient des textes et se déplace avec eux. */
const isBand = (el: CvElement) => isShape(el) && el.w * el.h > 12_000 && el.h <= 60 && el.w >= 300
const isDecoration = (el: CvElement) => !isText(el) && el.type !== 'image' && (!isBackdrop(el) || isBand(el))
const overlapX = (a: Box, b: Box) => Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)
const bottom = (b: Box) => b.y + b.h

function normalizeLabel(value: string) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/gi, '').toLocaleLowerCase()
}

const SECTION_TITLES = new Set([
  'profil', 'apropos', 'presentation', 'coordonnees', 'contact', 'competences', 'competencescles',
  'qualites', 'centresinteret', 'loisirs', 'langues', 'formation', 'formations', 'education',
  'experiences', 'experience', 'experiencesprofessionnelles', 'experienceprofessionnelle',
  'workexperience', 'professionalexperience', 'skills', 'profile', 'interests', 'projects', 'projets',
  'references', 'portfolio', 'certifications', 'parcours', 'parcoursacademique',
  'parcoursprofessionnel', 'atouts', 'projetsacademiques', 'profilprofessionnel',
])

/* ------------------------------------------------------------------ */
/* 1. Quelle décoration appartient à quel texte ?                      */
/* ------------------------------------------------------------------ */

/** Décoration posée par rapport à un texte (décalage vertical conservé). */
interface Attachment {
  text: string
  /** `offset` : y = y du texte + décalage ; `below` : y = bas du texte + espace. */
  mode: 'offset' | 'below'
  value: number
  /** Puce/icône : on garde son centre aligné sur la première ligne du texte. */
  centerOnFirstLine?: boolean
}

interface Analysis {
  attachments: Map<string, Attachment>
  /** Texte placé dans une pastille ou une barre : il suit le texte « chef de file ». */
  followers: Map<string, { lead: string; offset: number }>
  /** Textes dans une pastille : leur police est conservée pour rester dans la forme. */
  badgeTexts: Set<string>
  /** Filets verticaux (chronologie) : étirés entre deux textes. */
  verticalRules: Map<string, { top: { text: string; offset: number }; end: { text: string; offset: number } }>
}

export function analyseAttachments(elements: CvElement[]): Analysis {
  const texts = elements.filter(isText)
  const attachments = new Map<string, Attachment>()
  const followers = new Map<string, { lead: string; offset: number }>()
  const badgeTexts = new Set<string>()
  const verticalRules: Analysis['verticalRules'] = new Map()
  const firstLine = (t: TextEl) => Math.min(t.h, t.fontSize * t.lineHeight)

  for (const d of elements.filter(isDecoration)) {
    // Filet vertical (chronologie) : traité à part.
    if (isShape(d) && d.w <= 3 && d.h > 30 && d.h <= 400) {
      const beside = texts
        .filter((t) => t.x >= d.x - 2 && t.x - d.x <= 60 && t.y <= d.y + d.h + 30 && bottom(t) >= d.y - 16)
        .sort((a, b) => a.y - b.y)
      if (beside.length >= 2) {
        const top = beside[0]
        const end = [...beside].filter((t) => t.y <= d.y + d.h).sort((a, b) => bottom(b) - bottom(a))[0] ?? beside[beside.length - 1]
        verticalRules.set(d.id, {
          top: { text: top.id, offset: d.y - top.y },
          end: { text: end.id, offset: d.y + d.h - bottom(end) },
        })
      }
      continue
    }
    if (d.h > 300) continue

    // a. Pastille ou barre qui contient un ou plusieurs textes.
    const enclosed = texts
      .filter((t) => t.x >= d.x - 4 && t.x + t.w <= d.x + d.w + 4 && t.y >= d.y - 8 && bottom(t) <= bottom(d) + 8)
      .sort((a, b) => a.y - b.y || a.x - b.x)
    if (enclosed.length > 0 && isShape(d)) {
      const lead = enclosed[0]
      attachments.set(d.id, { text: lead.id, mode: 'offset', value: d.y - lead.y })
      for (const t of enclosed) {
        // Dans une pastille, la police est conservée pour rester dans la forme ; dans un bandeau, elle grandit.
        if (!isBand(d)) badgeTexts.add(t.id)
        if (t.id !== lead.id && !followers.has(t.id)) followers.set(t.id, { lead: lead.id, offset: t.y - lead.y })
      }
      continue
    }

    // b. Puce, point ou icône à côté d'une ligne de texte.
    if (d.w <= 26 && d.h <= 26) {
      const cy = d.y + d.h / 2
      const side = texts
        .filter((t) => {
          if (cy < t.y - 3 || cy > t.y + firstLine(t) + 3) return false
          const gapLeft = t.x - (d.x + d.w)
          const gapRight = d.x - (t.x + t.w)
          return (gapLeft >= -2 && gapLeft <= 34) || (gapRight >= -2 && gapRight <= 34)
        })
        .sort((a, b) => Math.abs(a.x - d.x) - Math.abs(b.x - d.x))[0]
      if (side) {
        attachments.set(d.id, { text: side.id, mode: 'offset', value: d.y - side.y, centerOnFirstLine: true })
        continue
      }
    }

    // c. Filet, barre d'accent ou jauge (fine et horizontale).
    if (d.h <= 10 && d.w >= 16) {
      const above = texts
        .filter((t) => overlapX(d, t) >= Math.min(d.w, t.w) * 0.3 && bottom(t) <= d.y + 4 && d.y - bottom(t) <= 60)
        .sort((a, b) => bottom(b) - bottom(a))[0]
      const below = texts
        .filter((t) => overlapX(d, t) >= Math.min(d.w, t.w) * 0.3 && t.y >= bottom(d) - 4 && t.y - bottom(d) <= 24)
        .sort((a, b) => a.y - b.y)[0]
      const gapAbove = above ? d.y - bottom(above) : Infinity
      const gapBelow = below ? below.y - bottom(d) : Infinity
      // Une petite barre d'accent se pose au-dessus de son titre ; les autres filets sous leur texte.
      const preferBelow = d.w <= 48 ? gapBelow !== Infinity : gapBelow < gapAbove
      if (preferBelow && below) {
        attachments.set(d.id, { text: below.id, mode: 'offset', value: d.y - below.y })
      } else if (above) {
        attachments.set(d.id, { text: above.id, mode: 'below', value: gapAbove })
      }
    }
  }
  return { attachments, followers, badgeTexts, verticalRules }
}

/* ------------------------------------------------------------------ */
/* 2. Fond réel sous un texte (pour le contrôle de contraste)          */
/* ------------------------------------------------------------------ */

/** Transforme un chemin SVG (M, L, C, Z absolus) en polygone dans le cadre de l'élément. */
function pathToPolygon(path: string, el: Box): [number, number][] | null {
  const tokens = path.match(/[MLCZ]|-?\d*\.?\d+/g)
  if (!tokens) return null
  const pts: [number, number][] = []
  let i = 0
  let cmd = ''
  let cur: [number, number] = [0, 0]
  const num = () => Number(tokens[i++])
  while (i < tokens.length) {
    if (/[MLCZ]/.test(tokens[i])) cmd = tokens[i++]
    if (cmd === 'Z') continue
    if (cmd === 'M' || cmd === 'L') {
      cur = [num(), num()]
      pts.push(cur)
    } else if (cmd === 'C') {
      const [x1, y1, x2, y2, x3, y3] = [num(), num(), num(), num(), num(), num()]
      const [x0, y0] = cur
      for (let s = 1; s <= 12; s++) {
        const t = s / 12
        const u = 1 - t
        pts.push([
          u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
          u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3,
        ])
      }
      cur = [x3, y3]
    } else {
      return null
    }
  }
  return pts.map(([px, py]) => [el.x + (px / 1000) * el.w, el.y + (py / 1000) * el.h])
}

function inPolygon(x: number, y: number, poly: [number, number][]) {
  let inside = false
  for (let a = 0, b = poly.length - 1; a < poly.length; b = a++) {
    const [xa, ya] = poly[a]
    const [xb, yb] = poly[b]
    if (ya > y !== yb > y && x < ((xb - xa) * (y - ya)) / (yb - ya) + xa) inside = !inside
  }
  return inside
}

function shapeContains(el: CvElement, x: number, y: number) {
  if (!isShape(el) || el.rotation) return false
  if (el.type === 'rect' && el.customPath) {
    const poly = pathToPolygon(el.customPath, el)
    return poly ? inPolygon(x, y, poly) : x >= el.x && x <= el.x + el.w && y >= el.y && y <= el.y + el.h
  }
  if (el.type === 'circle' || el.radius >= 9999) {
    const rx = el.w / 2
    const ry = el.h / 2
    return ((x - el.x - rx) / rx) ** 2 + ((y - el.y - ry) / ry) ** 2 <= 1
  }
  return x >= el.x && x <= el.x + el.w && y >= el.y && y <= el.y + el.h
}

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

/** Couleur visible au point (x, y) parmi les éléments situés sous `below` ; `null` si une photo s'y trouve. */
function backgroundAt(elements: CvElement[], below: number, x: number, y: number, page: string): string | null {
  for (let i = below - 1; i >= 0; i--) {
    const el = elements[i]
    if (el.hidden) continue
    if (el.type === 'image') {
      if (x >= el.x && x <= el.x + el.w && y >= el.y && y <= el.y + el.h) return null
      continue
    }
    if (!isShape(el) || el.opacity < 0.6 || !shapeContains(el, x, y)) continue
    if (HEX.test(el.fill)) return el.fill
    return null
  }
  return page
}

function luminance(hex: string) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const channel = (offset: number) => {
    const v = Number.parseInt(full.slice(offset, offset + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4)
}

function contrast(a: string, b: string) {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/**
 * Corrige uniquement les textes réellement illisibles (contraste < 2) : par
 * exemple un texte blanc resté sur un fond blanc. La teinte d'origine est
 * conservée autant que possible (on assombrit ou on éclaircit la couleur).
 */
export function ensureReadableText(elements: CvElement[], pageBackground: string): CvElement[] {
  return elements.map((el, index) => {
    if (!isText(el) || el.hidden || !HEX.test(el.color)) return el
    const longest = Math.max(...el.text.split('\n').map((line) => line.length))
    const estimated = Math.min(el.w, Math.max(8, longest * (el.fontSize * 0.52 + el.letterSpacing)))
    const start = el.align === 'center' ? el.x + (el.w - estimated) / 2 : el.align === 'right' ? el.x + el.w - estimated : el.x
    const rows = [el.y + (el.fontSize * el.lineHeight) / 2, el.y + Math.max(el.h - (el.fontSize * el.lineHeight) / 2, 0)]
    const backgrounds: string[] = []
    for (const py of rows) {
      for (const f of [0.05, 0.3, 0.5, 0.7, 0.95]) {
        const bg = backgroundAt(elements, index, start + estimated * f, py, pageBackground)
        if (bg && HEX.test(bg)) backgrounds.push(bg)
      }
    }
    if (backgrounds.length === 0) return el
    const worst = (color: string) => Math.min(...backgrounds.map((bg) => contrast(color, bg)))
    if (worst(el.color) >= 2) return el
    const candidates = [
      ...[0.25, 0.45, 0.65, 0.85].map((t) => mix(el.color, '#14202e', t)),
      ...[0.25, 0.45, 0.65, 0.85].map((t) => mix(el.color, '#ffffff', t)),
      '#14202e',
      '#ffffff',
    ]
    const good = candidates.find((color) => worst(color) >= 3)
    if (good) return { ...el, color: good }
    const best = candidates.sort((a, b) => worst(b) - worst(a))[0]
    return { ...el, color: worst(best) > worst(el.color) ? best : readableOn(backgrounds[0]) }
  })
}

/* ------------------------------------------------------------------ */
/* 3. Finition complète                                                */
/* ------------------------------------------------------------------ */

interface Item {
  lead: TextEl
  y: number
  /** Étendue verticale du bloc par rapport au y du texte chef de file. */
  top: number
  end: number
  left: number
  right: number
}

export function finishLayout(elements: CvElement[], options: FinishOptions): CvElement[] {
  // Taille de lecture idéale d'abord ; si le contenu déborde de la page, on réduit un peu.
  let result: CvElement[] = []
  // En dernier recours, on resserre aussi les espaces entre les blocs.
  const attempts: [number, number][] = [[14, 1], [13, 1], [12.5, 1], [12.5, 0.92], [12.5, 0.85], [12.5, 0.78]]
  for (const [bodySize, compress] of attempts) {
    result = layoutPass(elements, options, bodySize, compress)
    const lowest = Math.max(...result.filter(isText).map((el) => el.y + el.h))
    if (lowest <= options.pageHeight - 24) break
  }
  return result
}

function layoutPass(elements: CvElement[], options: FinishOptions, bodySize: number, compress: number): CvElement[] {
  const { pair, nameSize, pageHeight, pageBackground } = options
  const normalizedName = normalizeLabel(options.fullName)
  const normalizedTitle = normalizeLabel(options.title)
  const analysis = analyseAttachments(elements)
  const originalById = new Map(elements.map((el) => [el.id, el]))

  /* --- Polices et tailles de lecture --------------------------------- */
  let typed: CvElement[] = elements.map((el) => {
    if (!isText(el) || analysis.badgeTexts.has(el.id)) return el
    const label = normalizeLabel(el.text)
    const isName = label === normalizedName
    const isRole = label === normalizedTitle
    const isSection =
      SECTION_TITLES.has(label) ||
      (el.fontWeight >= 700 && (el.uppercase || el.text === el.text.toLocaleUpperCase('fr-FR')) && el.text.length <= 38)
    const fontSize = isName ? nameSize : isRole || isSection ? 16 : bodySize
    const fontFamily = isName || isRole || isSection ? pair.heading : pair.body
    const shown = el.uppercase ? el.text.toLocaleUpperCase('fr-FR') : el.text
    const h =
      measureText(shown, el.w, fontSize, el.lineHeight, el.letterSpacing, fontFamily) +
      (isName ? Math.ceil(fontSize * 0.3) : 0)
    return { ...el, fontSize, fontFamily, h }
  })

  /* --- Nom à côté d'une photo : on le centre sur la photo ------------- */
  const nameIndex = typed.findIndex((el) => isText(el) && normalizeLabel(el.text) === normalizedName)
  const titleIndex = typed.findIndex((el) => isText(el) && normalizeLabel(el.text) === normalizedTitle)
  const nameElement = typed[nameIndex]
  if (nameElement && isText(nameElement) && nameElement.y < 320) {
    const gap = (image: CvElement) => {
      const right = nameElement.x - (image.x + image.w)
      const left = image.x - (nameElement.x + nameElement.w)
      return Math.min(right >= 0 ? right : Infinity, left >= 0 ? left : Infinity)
    }
    const photo = typed
      .filter((el) => el.type === 'image' && el.y < 360 && el.h <= 220 && gap(el) <= 170)
      .sort((a, b) => gap(a) - gap(b))[0]
    if (photo) {
      const nameY = Math.round(photo.y + (photo.h - nameElement.h) / 2)
      const titleEl = titleIndex >= 0 ? typed[titleIndex] : undefined
      const titleY = titleEl && isText(titleEl) ? Math.max(titleEl.y, nameY + nameElement.h + 8) : nameY + nameElement.h + 8
      typed = typed.map((el, index) => {
        if (index === nameIndex) return { ...el, y: nameY }
        if (!isText(el)) return el
        const sharesColumn = el.x < nameElement.x + nameElement.w - 8 && el.x + el.w > nameElement.x + 8
        if (!sharesColumn) return el
        if (index === titleIndex) return { ...el, y: titleY }
        if (el.y >= nameElement.y && el.y < nameY + nameElement.h) {
          return { ...el, y: Math.max(el.y, titleY + (titleIndex >= 0 ? 22 : 0)) }
        }
        return el
      })
    }
  }

  const typedById = new Map(typed.map((el) => [el.id, el]))
  const typedText = (id: string) => typedById.get(id) as TextEl

  /* --- Position de chaque élément par rapport à son texte chef de file - */
  const leadOf = (id: string) => analysis.followers.get(id)?.lead ?? id
  const rel = new Map<string, number>() // y relatif au chef de file
  const leadFor = new Map<string, string>()
  for (const el of typed) {
    if (!isText(el)) continue
    const follower = analysis.followers.get(el.id)
    rel.set(el.id, follower ? follower.offset : 0)
    leadFor.set(el.id, leadOf(el.id))
  }
  for (const [decoId, att] of analysis.attachments) {
    const anchor = typedText(att.text)
    const original = originalById.get(att.text) as TextEl
    if (!anchor || !original) continue
    let local = att.value
    if (att.mode === 'below') local = anchor.h + Math.max(att.value, 2)
    if (att.centerOnFirstLine) local += (anchor.fontSize * anchor.lineHeight - original.fontSize * original.lineHeight) / 2
    rel.set(decoId, (rel.get(anchor.id) ?? 0) + local)
    leadFor.set(decoId, leadFor.get(anchor.id) ?? anchor.id)
  }

  /* --- Blocs : un texte + tout ce qui lui est rattaché ---------------- */
  const items = new Map<string, Item>()
  for (const el of typed) {
    if (!isText(el) || leadFor.get(el.id) !== el.id) continue
    items.set(el.id, { lead: el, y: el.y, top: 0, end: el.h, left: el.x, right: el.x + el.w })
  }
  for (const el of typed) {
    const leadId = leadFor.get(el.id)
    const r = rel.get(el.id)
    const item = leadId ? items.get(leadId) : undefined
    if (!item || r === undefined) continue
    item.top = Math.min(item.top, r)
    item.end = Math.max(item.end, r + el.h)
    item.left = Math.min(item.left, el.x)
    item.right = Math.max(item.right, el.x + el.w)
  }

  /* --- Re-pose de haut en bas, sans chevauchement --------------------- */
  const attachedIds = new Set([...analysis.attachments.keys(), ...analysis.verticalRules.keys()])
  const separators = typed.filter(
    (el) =>
      !attachedIds.has(el.id) &&
      (el.type === 'line' || (isShape(el) && ((el.h <= 3 && el.w > 30) || (el.w <= 3 && el.h > 30)))),
  )
  const images = typed.filter((el) => el.type === 'image')
  if (compress < 1) {
    for (const item of items.values()) {
      if (item.y + item.top >= 285) item.y = Math.round(285 + (item.y - 285) * compress)
    }
  }
  const documentY = (item: Item) => (originalById.get(item.lead.id) as TextEl).y
  const ordered = [...items.values()].sort((a, b) => documentY(a) - documentY(b) || a.left - b.left)
  const placed: Item[] = []
  for (const item of ordered) {
    let y = item.y
    for (let attempt = 0; attempt < ordered.length + 4; attempt++) {
      const box = { x: item.left, w: item.right - item.left, y: y + item.top, h: item.end - item.top }
      const blockers: number[] = []
      for (const other of placed) {
        const o = { x: other.left, w: other.right - other.left, y: other.y + other.top, h: other.end - other.top }
        if (overlapX(box, o) > 8 && box.y < bottom(o) + 3 && bottom(box) > o.y) blockers.push(bottom(o) + 3)
      }
      for (const img of images) {
        if (overlapX(box, img) > 8 && box.y < bottom(img) + 6 && bottom(box) > img.y - 6) blockers.push(bottom(img) + 6)
      }
      for (const rule of separators) {
        if (overlapX(box, rule) > 3 && box.y < bottom(rule) + 6 && bottom(box) > rule.y - 6) blockers.push(bottom(rule) + 6)
      }
      if (blockers.length === 0) break
      y = Math.max(...blockers) - item.top
    }
    item.y = y
    placed.push(item)
  }

  /* --- Étirement si le bas de la page reste vide ---------------------- */
  const flowStart = 285
  const targetBottom = pageHeight - 170
  const textBottom = Math.max(...placed.map((item) => item.y + item.end))
  if (Number.isFinite(textBottom) && textBottom < targetBottom && textBottom > flowStart) {
    const factor = Math.min(2.1, (targetBottom - flowStart) / (textBottom - flowStart))
    for (const item of placed) {
      if (item.y + item.top >= flowStart) item.y = Math.round(flowStart + (item.y - flowStart) * factor)
    }
    // Les éléments sans texte de rattachement (ornements, filets libres) suivent le même étirement.
    typed = typed.map((el) => {
      if (isText(el) || el.type === 'image' || isBackdrop(el) || attachedIds.has(el.id) || el.y < flowStart) return el
      return { ...el, y: Math.round(flowStart + (el.y - flowStart) * factor) } as CvElement
    })
  }

  /* --- Application des positions -------------------------------------- */
  const finalY = new Map<string, number>()
  const finalH = new Map<string, number>()
  for (const el of typed) {
    const leadId = leadFor.get(el.id)
    const r = rel.get(el.id)
    const item = leadId ? items.get(leadId) : undefined
    if (item && r !== undefined) finalY.set(el.id, Math.round(item.y + r))
  }
  for (const [ruleId, link] of analysis.verticalRules) {
    const rule = typedById.get(ruleId)
    const top = typedText(link.top.text)
    const end = typedText(link.end.text)
    if (!rule || !top || !end || !finalY.has(top.id) || !finalY.has(end.id)) continue
    const y1 = finalY.get(top.id)! + link.top.offset
    const y2 = finalY.get(end.id)! + end.h + link.end.offset
    finalY.set(ruleId, Math.round(y1))
    finalH.set(ruleId, Math.max(8, Math.round(y2 - y1)))
  }
  const settled = typed.map((el) => {
    const y = finalY.get(el.id)
    const h = finalH.get(el.id)
    if (y === undefined && h === undefined) return el
    return { ...el, y: y ?? el.y, h: h ?? el.h } as CvElement
  })

  return ensureReadableText(settled, pageBackground)
}
