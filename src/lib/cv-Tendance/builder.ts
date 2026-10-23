/**
 * # Leçon : les 10 CV « Tendance »
 *
 * Ce fichier contient une petite boîte à outils (texte, carte arrondie, motif,
 * pastille, puces, expériences...) puis les 10 layouts. Les cartes se
 * dimensionnent toutes seules : `card()` mesure son contenu avant de dessiner
 * le fond, donc un texte plus long agrandit la carte au lieu de déborder.
 *
 * Pour créer un 11e modèle : copie un layout, change les coordonnées et les
 * couleurs, ajoute-le à `TENDANCE_LAYOUTS` et une entrée dans `names`,
 * `palettes` et `TENDANCE_FONTS` (fichier Tendance.ts).
 */
import { makeCircle, makeIcon, makeImage, makeRect, makeText, measureText, type TemplateStyle } from '../cv-shared/builder'
import { mix } from '../cv-shared/color'
import type { CvContent, CvElement, ShapeElement } from '../cv-shared/types'
import { PAGE_HEIGHT as H, PAGE_WIDTH as W } from '../cv-shared/types'

export const TENDANCE_LAYOUTS = [
  { key: 'bento-pastel', label: 'Bento pastel' },
  { key: 'neon-sombre', label: 'Néon sombre' },
  { key: 'arche-douce', label: 'Arche douce' },
  { key: 'capsule-timeline', label: 'Capsule et chronologie' },
  { key: 'degrade-sunset', label: 'Dégradé coucher de soleil' },
  { key: 'papier-quadrille', label: 'Papier quadrillé' },
  { key: 'editorial-pilules', label: 'Éditorial à pilules' },
  { key: 'cartes-menthe', label: 'Cartes menthe' },
  { key: 'bandeau-retro', label: 'Bandeau rétro' },
  { key: 'aurore-centree', label: 'Aurore centrée' },
] as const

/* ------------------------------------------------------------------ */
/* Boîte à outils                                                      */
/* ------------------------------------------------------------------ */

export interface Ctx {
  els: CvElement[]
  s: TemplateStyle
  c: CvContent
}

interface TextOptions {
  size?: number
  weight?: number
  color?: string
  font?: string
  lh?: number
  ls?: number
  align?: 'left' | 'center' | 'right'
  italic?: boolean
  upper?: boolean
}

/** Ajoute un texte et renvoie sa hauteur. */
function txt(k: Ctx, value: string, x: number, y: number, w: number, o: TextOptions = {}) {
  const shown = o.upper ? value.toLocaleUpperCase('fr-FR') : value
  const size = o.size ?? 14
  const lh = o.lh ?? 1.45
  const el = makeText({
    text: shown,
    x,
    y,
    w,
    // Hauteur prudente : on mesure sur 7 % de largeur en moins, car les polices réelles
    // sont parfois plus larges que l'estimation. Les cartes gardent ainsi un peu d'air.
    h: measureText(shown, w * 0.93, size, lh, o.ls ?? 0, o.font ?? k.s.body),
    fontFamily: o.font ?? k.s.body,
    fontSize: o.size ?? 14,
    fontWeight: o.weight ?? 400,
    color: o.color ?? k.s.text,
    lineHeight: o.lh ?? 1.45,
    letterSpacing: o.ls ?? 0,
    align: o.align ?? 'left',
    italic: o.italic,
  })
  k.els.push(el)
  return el.h
}

/** Rectangle arrondi (carte, bloc, bandeau). */
function box(k: Ctx, x: number, y: number, w: number, h: number, fill: string, radius = 28, o: Partial<ShapeElement> = {}) {
  k.els.push(makeRect({ x, y, w, h, fill, radius, ...o }))
}

type MotifKind = 'h' | 'v' | 'dots' | 'grid' | 'diag'

/**
 * Motif décoratif : un seul rectangle dont le remplissage est un dégradé CSS.
 * `h` = rayures horizontales, `v` = rayures verticales, `dots` = points,
 * `grid` = quadrillage, `diag` = rayures obliques.
 */
function motif(k: Ctx, kind: MotifKind, x: number, y: number, w: number, h: number, color: string, radius = 0, gap = 10) {
  const fills: Record<MotifKind, string> = {
    h: `repeating-linear-gradient(180deg, ${color} 0px, ${color} 3px, transparent 3px, transparent ${gap}px)`,
    v: `repeating-linear-gradient(90deg, ${color} 0px, ${color} 3px, transparent 3px, transparent ${gap}px)`,
    dots: `radial-gradient(circle, ${color} 2px, transparent 2.6px) 0 0 / ${gap + 6}px ${gap + 6}px`,
    grid: `linear-gradient(${color} 1px, transparent 1px) 0 0 / 24px 24px, linear-gradient(90deg, ${color} 1px, transparent 1px) 0 0 / 24px 24px`,
    diag: `repeating-linear-gradient(45deg, ${color} 0px, ${color} 2px, transparent 2px, transparent ${gap}px)`,
  }
  box(k, x, y, w, h, fills[kind], radius, { name: `Motif ${kind}` })
}

/** Photo ou, à défaut, un emplacement de la couleur du modèle. */
function photo(k: Ctx, x: number, y: number, w: number, h: number, radius: number, stroke = 'transparent', sw = 0) {
  if (k.c.photo) {
    k.els.push(makeImage({ src: k.c.photo, x, y, w, h, radius, fit: 'cover', stroke, strokeWidth: sw }))
  } else {
    box(k, x, y, w, h, mix(k.s.primary, '#ffffff', 0.55), radius, { stroke, strokeWidth: sw, name: 'Emplacement photo' })
  }
}

/** Hauteur estimée du nom (taille maximale possible : 50 px). */
function nameHeight(k: Ctx, w: number) {
  return measureText(k.c.fullName, w, 50, 1.1, 0, k.s.heading) + 15
}

/**
 * Nom + titre. Si `centerY` est donné (centre d'une photo placée à côté), le bloc
 * est centré verticalement sur cette valeur ; sinon il commence à `y`.
 */
function nameAndTitle(k: Ctx, x: number, y: number, w: number, nameColor: string, titleColor: string, align: 'left' | 'center' = 'left', centerY?: number) {
  if (centerY !== undefined) y = Math.round(centerY - (nameHeight(k, w) + 32) / 2)
  txt(k, k.c.fullName, x, y, w, { size: 46, weight: 800, font: k.s.heading, color: nameColor, lh: 1.1, align })
  const h = nameHeight(k, w)
  txt(k, k.c.title, x, y + h + 6, w, { size: 16, weight: 600, font: k.s.heading, color: titleColor, align })
  return y + h + 6 + 26
}

/** Pastille (fond arrondi + texte). Renvoie sa largeur. */
function chip(k: Ctx, label: string, x: number, y: number, fill: string, color: string, size = 12.5, stroke = 'transparent', maxW = 400) {
  const w = Math.min(maxW, Math.ceil(label.length * size * 0.6 + 26))
  const h = Math.ceil(size * 1.4) + 12
  box(k, x, y, w, h, fill, Math.floor(h / 2), { stroke, strokeWidth: stroke === 'transparent' ? 0 : 1.5 })
  txt(k, label, x, y + 6, w, { size, weight: 700, color, align: 'center', lh: 1.4 })
  return w
}

/** Pastilles qui passent à la ligne. Renvoie le y du bas. */
function chips(k: Ctx, items: string[], x: number, y: number, w: number, fill: string, color: string, size = 12.5, stroke = 'transparent') {
  const rowH = Math.ceil(size * 1.4) + 12
  let px = x
  let py = y
  for (const item of items) {
    const pw = Math.min(w, Math.ceil(item.length * size * 0.6 + 26))
    if (px > x && px + pw > x + w) {
      px = x
      py += rowH + 8
    }
    chip(k, item, px, py, fill, color, size, stroke, w)
    px += pw + 8
  }
  return py + rowH
}

/** Ligne « icône + texte ». */
function iconRow(k: Ctx, icon: string, value: string, x: number, y: number, w: number, iconColor: string, color: string) {
  k.els.push(makeIcon({ icon, x, y: y + 3, w: 14, h: 14, color: iconColor }))
  const h = txt(k, value, x + 24, y, w - 24, { color })
  return Math.max(h, 20) + 6
}

function contacts(k: Ctx, x: number, y: number, w: number, iconColor: string, color: string) {
  const rows: [string, string][] = [['mail', k.c.email], ['phone', k.c.phone], ['map-pin', k.c.location], ['globe', k.c.website]]
  let cy = y
  for (const [icon, value] of rows) if (value) cy += iconRow(k, icon, value, x, cy, w, iconColor, color)
  return cy
}

/** Liste à puces rondes. */
function bullets(k: Ctx, items: string[], x: number, y: number, w: number, dot: string, color: string) {
  let cy = y
  for (const item of items) {
    k.els.push(makeCircle({ x, y: cy + 7, w: 7, h: 7, fill: dot }))
    cy += Math.max(txt(k, item, x + 18, cy, w - 18, { color }), 20) + 4
  }
  return cy
}

/** Compétences en jauges arrondies. */
function bars(k: Ctx, items: string[], x: number, y: number, w: number, track: string, fill: string, color: string) {
  const levels = [0.92, 0.84, 0.76, 0.88, 0.7, 0.64, 0.8, 0.72]
  let cy = y
  items.forEach((item, i) => {
    cy += txt(k, item, x, cy, w, { color, weight: 600 }) + 3
    box(k, x, cy, w, 7, track, 4)
    box(k, x, cy, Math.round(w * levels[i % levels.length]), 7, fill, 4)
    cy += 17
  })
  return cy
}

/** Titre de rubrique. `plain` : texte coloré ; `bar` : petite barre au-dessus. */
function head(k: Ctx, label: string, x: number, y: number, w: number, color: string, kind: 'plain' | 'bar' = 'plain', barColor = color) {
  if (kind === 'bar') {
    box(k, x, y, 40, 5, barColor, 3)
    txt(k, label, x, y + 14, w, { size: 16, weight: 800, font: k.s.heading, color, upper: true, ls: 1.5, lh: 1.2 })
    return y + 14 + 30
  }
  txt(k, label, x, y, w, { size: 16, weight: 800, font: k.s.heading, color, lh: 1.2 })
  return y + 32
}

export interface ExpColors {
  title: string
  accent: string
  muted: string
}

/** Expériences empilées simplement. */
function experiences(k: Ctx, items: CvContent['experiences'], x: number, y: number, w: number, col: ExpColors, gap = 16) {
  let cy = y
  for (const e of items) {
    cy += txt(k, e.role, x, cy, w, { weight: 700, color: col.title }) + 1
    cy += txt(k, `${e.company}  ·  ${e.period}`, x, cy, w, { size: 13, weight: 600, color: col.accent }) + 3
    cy += txt(k, e.description, x, cy, w, { color: col.muted }) + gap
  }
  return cy
}

/** Chronologie : points reliés par un trait vertical (un segment par expérience). */
function timeline(k: Ctx, items: CvContent['experiences'], x: number, y: number, w: number, col: ExpColors, line: string, dot: string) {
  let cy = y
  items.forEach((e, i) => {
    const top = cy
    cy += txt(k, e.role, x, cy, w, { weight: 700, color: col.title }) + 1
    cy += txt(k, `${e.company}  ·  ${e.period}`, x, cy, w, { size: 13, weight: 600, color: col.accent }) + 3
    cy += txt(k, e.description, x, cy, w, { color: col.muted }) + 18
    if (i < items.length - 1) box(k, x - 15, top + 18, 2, cy - top - 8, line, 1)
    k.els.push(makeCircle({ x: x - 21, y: top + 4, w: 14, h: 14, fill: dot, stroke: k.s.bg, strokeWidth: 3 }))
  })
  return cy
}

/** Chaque expérience dans sa propre carte arrondie. */
function expCards(k: Ctx, items: CvContent['experiences'], x: number, y: number, w: number, fill: string, stroke: string, col: ExpColors, radius = 26) {
  let cy = y
  for (const e of items) {
    cy = card(k, x, cy, w, fill, radius, (kk, cx, c0, cw) => experiences(kk, [e], cx, c0, cw, col, 0), { pad: 18, stroke }) + 14
  }
  return cy
}

function education(k: Ctx, items: CvContent['education'], x: number, y: number, w: number, title: string, muted: string) {
  let cy = y
  for (const e of items) {
    cy += txt(k, e.degree, x, cy, w, { weight: 700, color: title }) + 1
    cy += txt(k, `${e.school}  ·  ${e.period}`, x, cy, w, { size: 13, color: muted }) + 12
  }
  return cy
}

/**
 * Carte arrondie qui s'adapte à son contenu : `draw` est exécuté une première
 * fois « à blanc » pour mesurer, puis pour de vrai par-dessus le fond.
 */
function card(
  k: Ctx,
  x: number,
  y: number,
  w: number,
  fill: string,
  radius: number,
  draw: (k: Ctx, x: number, y: number, w: number) => number,
  o: { pad?: number; stroke?: string; minH?: number } = {},
) {
  const pad = o.pad ?? 22
  const scratch: Ctx = { els: [], s: k.s, c: k.c }
  const bottomY = draw(scratch, x + pad, y + pad, w - pad * 2)
  const h = Math.max(o.minH ?? 0, Math.ceil(bottomY - y + pad - 6))
  box(k, x, y, w, h, fill, radius, { stroke: o.stroke ?? 'transparent', strokeWidth: o.stroke ? 2 : 0 })
  draw(k, x + pad, y + pad, w - pad * 2)
  return y + h
}

const skillsOf = (k: Ctx, n = 7) => k.c.skills.slice(0, n)
const langsOf = (k: Ctx, n = 4) => k.c.languages.slice(0, n)
const expOf = (k: Ctx, n = 3) => k.c.experiences.slice(0, n)
const eduOf = (k: Ctx, n = 2) => k.c.education.slice(0, n)
const summary = (k: Ctx, x: number, y: number, w: number, color: string) => y + txt(k, k.c.summary, x, y, w, { color })

/* ------------------------------------------------------------------ */
/* Les 10 layouts                                                      */
/* ------------------------------------------------------------------ */

type Built = { background: string; elements: CvElement[] }

/** 1. Bento pastel : une grille de cartes arrondies de couleurs douces. */
function bentoPastel(k: Ctx): Built {
  const { s } = k
  const ink = s.text
  const muted = mix(ink, '#ffffff', 0.35)
  const peach = '#FFE8D6'
  const mint = '#D9F5EC'
  const col: ExpColors = { title: ink, accent: s.primary, muted }

  box(k, 28, 28, 738, 180, s.primary, 40)
  motif(k, 'dots', 596, 28, 170, 180, '#ffffff', 40, 8)
  photo(k, 50, 50, 136, 136, 36, '#ffffff', 4)
  nameAndTitle(k, 212, 62, 390, '#ffffff', '#ffffff', 'left', 118)

  const y2 = 224
  const a = card(k, 28, y2, 250, '#ffffff', 32, (kk, x, y, w) => contacts(kk, x, head(kk, 'Contact', x, y, w, s.primary), w, s.primary, ink))
  const b = card(k, 294, y2, 472, s.secondary, 32, (kk, x, y, w) => summary(kk, x, head(kk, 'Profil', x, y, w, s.primary), w, ink), { minH: a - y2 })
  const y3 = Math.max(a, b) + 16

  const left = card(k, 28, y3, 470, '#ffffff', 32, (kk, x, y, w) => experiences(kk, expOf(kk), x, head(kk, 'Expériences', x, y, w, s.primary), w, col, 18)) + 16
  card(k, 28, left, 470, s.secondary, 32, (kk, x, y, w) => education(kk, eduOf(kk), x, head(kk, 'Formation', x, y, w, s.primary), w, ink, muted))
  const ry = card(k, 514, y3, 252, peach, 32, (kk, x, y, w) => bullets(kk, skillsOf(kk, 6), x, head(kk, 'Compétences', x, y, w, s.primary), w, s.primary, ink)) + 16
  card(k, 514, ry, 252, mint, 32, (kk, x, y, w) => bullets(kk, langsOf(kk, 3), x, head(kk, 'Langues', x, y, w, s.primary), w, s.primary, ink))
  return { background: s.bg, elements: k.els }
}

/** 2. Néon sombre : fond noir, colonne arrondie et rayures verticales fluo. */
function neonSombre(k: Ctx): Built {
  const { s } = k
  const side = s.secondary
  const muted = mix(s.text, '#000000', 0.3)
  const col: ExpColors = { title: '#ffffff', accent: s.primary, muted }

  box(k, 24, 24, 254, 1075, side, 40)
  photo(k, 52, 52, 198, 198, 99, s.primary, 4)
  let y = 276
  chip(k, 'CONTACT', 48, y, s.primary, '#0E1118', 12)
  y = contacts(k, 48, y + 44, 206, s.primary, s.text) + 14
  chip(k, 'COMPÉTENCES', 48, y, s.primary, '#0E1118', 12)
  y = bullets(k, skillsOf(k, 5), 52, y + 44, 200, s.primary, s.text) + 12
  chip(k, 'LANGUES', 48, y, s.primary, '#0E1118', 12)
  bullets(k, langsOf(k, 2), 52, y + 44, 200, s.primary, s.text)
  motif(k, 'v', 48, 1030, 206, 44, s.primary, 16, 9)

  nameAndTitle(k, 312, 48, 446, '#ffffff', s.primary, 'left', 151)
  motif(k, 'h', 312, 262, 446, 24, s.primary, 12, 8)
  let ry = 306
  ry = summary(k, 312, head(k, 'Profil', 312, ry, 446, s.primary), 446, s.text) + 14
  ry = timeline(k, expOf(k), 340, head(k, 'Expériences', 312, ry, 446, s.primary) + 6, 418, col, mix(s.primary, '#0E1118', 0.5), s.primary) + 6
  head(k, 'Formation', 312, ry, 446, s.primary)
  let ex = 312
  ry += 34
  for (const e of eduOf(k, 2)) {
    const bottom = card(k, ex, ry, 215, side, 26, (kk, x, y, w) => education(kk, [e], x, y, w, '#ffffff', muted), { pad: 16 })
    ex += 231
    if (bottom > H) break
  }
  return { background: s.bg, elements: k.els }
}

/** 3. Arche douce : en-tête en arche, photo à cheval, contacts en pastilles. */
function archeDouce(k: Ctx): Built {
  const { s } = k
  const ink = s.text
  const muted = mix(ink, '#ffffff', 0.35)
  const col: ExpColors = { title: ink, accent: s.primary, muted }

  box(k, -60, -190, 914, 440, s.primary, 220)
  motif(k, 'dots', 36, 40, 150, 100, '#ffffff', 30, 8)
  motif(k, 'dots', 608, 40, 150, 100, '#ffffff', 30, 8)
  photo(k, 309, 138, 176, 176, 88, '#ffffff', 8)
  nameAndTitle(k, 97, 328, 600, ink, s.primary, 'center')

  const rows: [string, string][] = [['mail', k.c.email], ['phone', k.c.phone], ['map-pin', k.c.location], ['globe', k.c.website]]
  const present = rows.filter(([, v]) => v)
  present.forEach(([icon, value], i) => {
    const x = 40 + (i % 2) * 358
    const y = 452 + Math.floor(i / 2) * 48
    box(k, x, y, 346, 40, s.secondary, 20)
    iconRow(k, icon, value, x + 18, y + 8, 320, s.primary, ink)
  })
  const top = 452 + Math.ceil(present.length / 2) * 48 + 12

  let ly = card(k, 40, top, 310, s.secondary, 28, (kk, x, y, w) => summary(kk, x, head(kk, 'Profil', x, y, w, s.primary), w, ink)) + 16
  card(k, 40, ly, 310, '#ffffff', 28, (kk, x, y, w) => chips(kk, skillsOf(kk, 6), x, head(kk, 'Compétences', x, y, w, s.primary), w, s.secondary, ink), { stroke: s.secondary })

  let ry = head(k, 'Expériences', 382, top + 4, 372, s.primary)
  ry = experiences(k, expOf(k, 2), 382, ry, 372, col, 16)
  ry = head(k, 'Formation', 382, ry + 4, 372, s.primary)
  ry = education(k, eduOf(k, 1), 382, ry, 372, ink, muted)
  chips(k, langsOf(k, 3), 382, head(k, 'Langues', 382, ry + 2, 372, s.primary), 372, s.secondary, ink)
  return { background: s.bg, elements: k.els }
}

/** 4. Capsule : grande colonne ovale, chronologie et rayures verticales. */
function capsuleTimeline(k: Ctx): Built {
  const { s } = k
  const ink = s.text
  const muted = mix(ink, '#ffffff', 0.35)
  const col: ExpColors = { title: ink, accent: s.primary, muted }
  const onSide = '#ffffff'

  box(k, 28, 28, 262, 1067, s.primary, 131)
  photo(k, 60, 76, 198, 198, 99, '#ffffff', 6)
  let y = 304
  y = contacts(k, 66, head(k, 'Contact', 66, y, 190, onSide), 200, onSide, onSide) + 6
  y = bullets(k, skillsOf(k, 5), 66, head(k, 'Compétences', 66, y, 190, onSide), 200, onSide, onSide) + 6
  bullets(k, langsOf(k, 3), 66, head(k, 'Langues', 66, y, 190, onSide), 200, onSide, onSide)
  motif(k, 'h', 66, 996, 186, 60, mix(s.primary, '#ffffff', 0.5), 18, 9)

  motif(k, 'v', 690, 28, 76, 116, s.primary, 22, 9)
  nameAndTitle(k, 330, 52, 340, ink, s.primary, 'left', 175)
  let ry = 296
  ry = summary(k, 330, head(k, 'Profil', 330, ry, 424, s.primary, 'bar'), 424, muted) + 10
  ry = timeline(k, expOf(k), 358, head(k, 'Expériences', 330, ry, 424, s.primary, 'bar') + 4, 396, col, s.secondary, s.primary) + 8
  ry = head(k, 'Formation', 330, ry, 424, s.primary, 'bar')
  let ex = 330
  for (const e of eduOf(k, 2)) {
    card(k, ex, ry, 205, s.secondary, 26, (kk, x, y, w) => education(kk, [e], x, y, w, ink, muted), { pad: 16 })
    ex += 219
  }
  return { background: s.bg, elements: k.els }
}

/** 5. Dégradé coucher de soleil : bandeau en dégradé, pastilles de contact. */
function degradeSunset(k: Ctx): Built {
  const { s } = k
  const ink = s.text
  const muted = mix(ink, '#ffffff', 0.35)
  const col: ExpColors = { title: ink, accent: s.primary, muted }

  box(k, 24, 24, 746, 292, `linear-gradient(125deg, ${s.primary} 0%, ${s.secondary} 100%)`, 48)
  motif(k, 'dots', 440, 24, 190, 110, '#ffffff', 30, 8)
  photo(k, 590, 52, 150, 150, 75, '#ffffff', 6)
  nameAndTitle(k, 52, 52, 510, ink, ink, 'left', 130)
  let cx = 52
  let cy = 238
  for (const value of [k.c.email, k.c.phone, k.c.location].filter(Boolean)) {
    const w = Math.ceil(value.length * 7.6 + 30)
    if (cx + w > 744) {
      cx = 52
      cy += 38
    }
    box(k, cx, cy, w, 32, '#ffffff', 16, { opacity: 0.9 })
    txt(k, value, cx, cy + 6, w, { size: 13, weight: 600, color: ink, align: 'center', lh: 1.3 })
    cx += w + 10
  }

  const top = 340
  let ly = card(k, 24, top, 252, '#ffffff', 34, (kk, x, y, w) => chips(kk, skillsOf(kk, 6), x, head(kk, 'Compétences', x, y, w, s.primary), w, s.secondary, ink, 12), { stroke: s.secondary }) + 16
  ly = card(k, 24, ly, 252, s.secondary, 34, (kk, x, y, w) => bullets(kk, langsOf(kk, 3), x, head(kk, 'Langues', x, y, w, ink), w, s.primary, ink), { stroke: 'transparent' }) + 16
  card(k, 24, ly, 252, '#ffffff', 34, (kk, x, y, w) => education(kk, eduOf(kk), x, head(kk, 'Formation', x, y, w, s.primary), w, ink, muted), { stroke: s.secondary })

  let ry = card(k, 292, top, 478, '#ffffff', 34, (kk, x, y, w) => summary(kk, x, head(kk, 'Profil', x, y, w, s.primary), w, ink), { stroke: s.secondary }) + 16
  card(k, 292, ry, 478, '#ffffff', 34, (kk, x, y, w) => experiences(kk, expOf(kk), x, head(kk, 'Expériences', x, y, w, s.primary), w, col, 16), { stroke: s.secondary })
  return { background: s.bg, elements: k.els }
}

/** 6. Papier quadrillé : en-tête sur quadrillage, contours épais arrondis. */
function papierQuadrille(k: Ctx): Built {
  const { s } = k
  const ink = s.text
  const muted = mix(ink, '#ffffff', 0.35)
  const col: ExpColors = { title: ink, accent: s.primary, muted }

  motif(k, 'grid', 0, 0, W, 300, mix(s.primary, '#ffffff', 0.78))
  box(k, 40, 50, 520, 170, '#ffffff', 32, { stroke: ink, strokeWidth: 3 })
  nameAndTitle(k, 66, 68, 470, ink, s.primary, 'left', 135)
  photo(k, 590, 44, 164, 190, 32, ink, 3)
  const w = chip(k, k.c.location || k.c.email, 40, 244, s.primary, '#ffffff', 13, 'transparent', 360)
  if (k.c.phone) chip(k, k.c.phone, 40 + w + 10, 244, s.secondary, ink, 13, ink, 300)

  const top = 316
  let ly = card(k, 40, top, 250, '#ffffff', 28, (kk, x, y, w2) => {
    const rows: [string, string][] = [['mail', kk.c.email], ['globe', kk.c.website]]
    let cy = head(kk, 'Contact', x, y, w2, s.primary)
    for (const [icon, v] of rows) if (v) cy += iconRow(kk, icon, v, x, cy, w2, s.primary, ink)
    return cy
  }, { stroke: ink }) + 16
  ly = card(k, 40, ly, 250, s.secondary, 28, (kk, x, y, w2) => bullets(kk, skillsOf(kk, 6), x, head(kk, 'Compétences', x, y, w2, s.primary), w2, s.primary, ink), { stroke: ink }) + 16
  card(k, 40, ly, 250, '#ffffff', 28, (kk, x, y, w2) => bullets(kk, langsOf(kk, 3), x, head(kk, 'Langues', x, y, w2, s.primary), w2, s.primary, ink), { stroke: ink })

  let ry = card(k, 306, top, 448, '#ffffff', 28, (kk, x, y, w2) => summary(kk, x, head(kk, 'Profil', x, y, w2, s.primary), w2, ink), { stroke: ink }) + 16
  ry = card(k, 306, ry, 448, '#ffffff', 28, (kk, x, y, w2) => experiences(kk, expOf(kk), x, head(kk, 'Expériences', x, y, w2, s.primary), w2, col, 16), { stroke: ink }) + 16
  card(k, 306, ry, 448, s.secondary, 28, (kk, x, y, w2) => education(kk, eduOf(kk), x, head(kk, 'Formation', x, y, w2, s.primary), w2, ink, muted), { stroke: ink })
  return { background: s.bg, elements: k.els }
}

/** 7. Éditorial à pilules : noir, blanc et jaune, titres en pilules. */
function editorialPilules(k: Ctx): Built {
  const { s } = k
  const yellow = '#FFD60A'
  const muted = '#4a4a4a'
  const col: ExpColors = { title: '#111111', accent: '#111111', muted }

  motif(k, 'v', 752, 0, 42, H, '#111111', 0, 7)
  photo(k, 560, 40, 170, 170, 85, '#111111', 4)
  nameAndTitle(k, 40, 52, 500, '#111111', '#111111', 'left', 125)
  const tw = Math.min(500, Math.ceil(k.c.title.length * 9.6 + 30))
  box(k, 40, 226, tw, 4, yellow, 2)

  const pill = (label: string, x: number, y: number) => chip(k, label, x, y, '#111111', '#ffffff', 12.5)
  let y = 252
  pill('PROFIL', 40, y)
  y = summary(k, 40, y + 44, 420, '#222222') + 18
  pill('EXPÉRIENCES', 40, y)
  y = experiences(k, expOf(k), 40, y + 44, 420, col, 18)
  pill('FORMATION', 40, y + 2)
  education(k, eduOf(k), 40, y + 46, 420, '#111111', muted)

  box(k, 490, 252, 240, 760, '#F3F3F3', 34)
  let ry = 276
  pill('CONTACT', 512, ry)
  ry = contacts(k, 512, ry + 44, 200, '#111111', '#111111') + 10
  pill('COMPÉTENCES', 512, ry)
  ry = chips(k, skillsOf(k, 5), 512, ry + 44, 200, yellow, '#111111', 12) + 14
  pill('LANGUES', 512, ry)
  bullets(k, langsOf(k, 3), 514, ry + 44, 196, '#111111', '#111111')
  return { background: s.bg, elements: k.els }
}

/** 8. Cartes menthe : chaque expérience dans sa carte, jauges arrondies. */
function cartesMenthe(k: Ctx): Built {
  const { s } = k
  const ink = s.text
  const muted = mix(ink, '#ffffff', 0.35)
  const col: ExpColors = { title: ink, accent: s.primary, muted }

  motif(k, 'v', 0, 0, 24, H, s.primary, 0, 8)
  photo(k, 56, 44, 150, 150, 44, s.primary, 4)
  nameAndTitle(k, 232, 56, 520, ink, s.primary, 'left', 119)
  motif(k, 'dots', 560, 150, 190, 60, s.primary, 16, 8)

  const lx = 56
  let ly = 226
  ly = card(k, lx, ly, 250, s.secondary, 30, (kk, x, y, w) => contacts(kk, x, head(kk, 'Contact', x, y, w, s.primary), w, s.primary, ink)) + 16
  ly = card(k, lx, ly, 250, s.secondary, 30, (kk, x, y, w) => bars(kk, skillsOf(kk, 5), x, head(kk, 'Compétences', x, y, w, s.primary), w, '#ffffff', s.primary, ink)) + 16
  card(k, lx, ly, 250, s.secondary, 30, (kk, x, y, w) => bullets(kk, langsOf(kk, 3), x, head(kk, 'Langues', x, y, w, s.primary), w, s.primary, ink))

  let ry = 226
  ry = card(k, 326, ry, 428, '#ffffff', 30, (kk, x, y, w) => summary(kk, x, head(kk, 'Profil', x, y, w, s.primary), w, ink), { stroke: s.secondary }) + 14
  ry = expCards(k, expOf(k), 326, ry, 428, '#ffffff', s.secondary, col, 30)
  card(k, 326, ry, 428, s.secondary, 30, (kk, x, y, w) => education(kk, eduOf(kk), x, head(kk, 'Formation', x, y, w, s.primary), w, ink, muted))
  return { background: s.bg, elements: k.els }
}

/** 9. Bandeau rétro : bandeau orange rayé façon années 70, cartes arrondies. */
function bandeauRetro(k: Ctx): Built {
  const { s } = k
  const ink = s.text
  const muted = mix(ink, '#ffffff', 0.3)
  const col: ExpColors = { title: ink, accent: s.primary, muted }

  box(k, 0, 0, W, 232, s.primary, 0)
  const stripes = ['#FFB703', '#FF8FA3', '#FFE8CC']
  stripes.forEach((color, i) => box(k, 0, 232 + i * 14, W, 14, color, 0, { name: 'Motif bande' }))
  motif(k, 'diag', 520, 0, 274, 232, '#ffffff', 0, 14)
  photo(k, 590, 44, 150, 150, 40, '#ffffff', 6)
  nameAndTitle(k, 44, 48, 520, '#ffffff', '#FFE8CC', 'left', 119)

  const top = 290
  let ly = card(k, 28, top, 250, s.secondary, 30, (kk, x, y, w) => contacts(kk, x, head(kk, 'Contact', x, y, w, s.primary, 'bar'), w, s.primary, ink)) + 16
  ly = card(k, 28, ly, 250, '#ffffff', 30, (kk, x, y, w) => chips(kk, skillsOf(kk, 6), x, head(kk, 'Compétences', x, y, w, s.primary, 'bar'), w, s.secondary, ink, 12), { stroke: s.secondary }) + 16
  card(k, 28, ly, 250, s.secondary, 30, (kk, x, y, w) => bullets(kk, langsOf(kk, 3), x, head(kk, 'Langues', x, y, w, s.primary, 'bar'), w, s.primary, ink))

  let ry = card(k, 294, top, 472, '#ffffff', 30, (kk, x, y, w) => summary(kk, x, head(kk, 'Profil', x, y, w, s.primary, 'bar'), w, ink), { stroke: s.secondary }) + 16
  ry = card(k, 294, ry, 472, '#ffffff', 30, (kk, x, y, w) => experiences(kk, expOf(kk), x, head(kk, 'Expériences', x, y, w, s.primary, 'bar'), w, col, 16), { stroke: s.secondary }) + 16
  card(k, 294, ry, 472, s.secondary, 30, (kk, x, y, w) => education(kk, eduOf(kk), x, head(kk, 'Formation', x, y, w, s.primary, 'bar'), w, ink, muted))
  return { background: s.bg, elements: k.els }
}

/** 10. Aurore centrée : en-tête dégradé, photo ronde à cheval, deux colonnes. */
function auroreCentree(k: Ctx): Built {
  const { s } = k
  const ink = s.text
  const muted = mix(ink, '#ffffff', 0.35)
  const col: ExpColors = { title: ink, accent: s.primary, muted }

  box(k, 24, 24, 746, 196, `linear-gradient(135deg, ${s.primary} 0%, #3B82F6 100%)`, 54)
  motif(k, 'dots', 52, 52, 160, 90, '#ffffff', 24, 8)
  motif(k, 'h', 584, 52, 156, 78, '#ffffff', 24, 9)
  photo(k, 317, 104, 160, 160, 80, '#ffffff', 8)
  nameAndTitle(k, 97, 280, 600, ink, s.primary, 'center')

  const present = [k.c.email, k.c.phone, k.c.location].filter(Boolean)
  let cx = 0
  const widths = present.map((v) => Math.ceil(v.length * 7.6 + 30))
  const total = widths.reduce((a, b) => a + b, 0) + (present.length - 1) * 10
  cx = Math.max(30, (W - total) / 2)
  present.forEach((value, i) => {
    box(k, cx, 406, widths[i], 34, s.secondary, 17)
    txt(k, value, cx, 413, widths[i], { size: 13, weight: 600, color: ink, align: 'center', lh: 1.3 })
    cx += widths[i] + 10
  })

  const band = card(k, 40, 454, 714, '#ffffff', 28, (kk, x, y, w) => chips(kk, skillsOf(kk, 6), x, y, w, s.secondary, ink, 12), { pad: 16, stroke: s.secondary })
  const top = band + 16
  const left = card(k, 40, top, 300, s.secondary, 30, (kk, x, y, w) => summary(kk, x, head(kk, 'Profil', x, y, w, s.primary), w, ink)) + 16
  card(k, 40, left, 300, '#ffffff', 30, (kk, x, y, w) => bullets(kk, langsOf(kk, 3), x, head(kk, 'Langues', x, y, w, s.primary), w, s.primary, ink), { stroke: s.secondary })

  const ry = card(k, 356, top, 398, '#ffffff', 30, (kk, x, y, w) => experiences(kk, expOf(kk, 2), x, head(kk, 'Expériences', x, y, w, s.primary), w, col, 14), { stroke: s.secondary }) + 16
  card(k, 356, ry, 398, s.secondary, 30, (kk, x, y, w) => education(kk, eduOf(kk, 1), x, head(kk, 'Formation', x, y, w, s.primary), w, ink, muted))
  return { background: s.bg, elements: k.els }
}

const LAYOUT_FUNCTIONS: Record<(typeof TENDANCE_LAYOUTS)[number]['key'], (k: Ctx) => Built> = {
  'bento-pastel': bentoPastel,
  'neon-sombre': neonSombre,
  'arche-douce': archeDouce,
  'capsule-timeline': capsuleTimeline,
  'degrade-sunset': degradeSunset,
  'papier-quadrille': papierQuadrille,
  'editorial-pilules': editorialPilules,
  'cartes-menthe': cartesMenthe,
  'bandeau-retro': bandeauRetro,
  'aurore-centree': auroreCentree,
}

export const CV_TENDANCE_LAYOUTS = TENDANCE_LAYOUTS
export function buildCvTendance(key: string, style: TemplateStyle, content: CvContent): Built {
  const layout = LAYOUT_FUNCTIONS[key as keyof typeof LAYOUT_FUNCTIONS] ?? bentoPastel
  return layout({ els: [], s: style, c: content })
}

/** Fonctions communes réutilisées par les mises en page Organique. */
export { txt, box, photo, chip, chips, iconRow, contacts, bullets, bars, head, experiences, timeline, education, card, skillsOf, langsOf, expOf, eduOf, summary, nameHeight }
