/**
 * # Leçon : les 10 CV « Organique »
 *
 * Les formes fluides sont des rectangles dont `customPath` est un chemin SVG
 * dessiné dans un repère 1000 × 1000 (il s'étire à la taille du bloc, voir
 * COURS.md section 4). Trois fabriques de chemins :
 *   - `smooth(points)`  : courbe lisse passant par des points (blob libre) ;
 *   - `radial(seed)`    : « galet » rond aux bords irréguliers ;
 *   - `squircle(seed)`  : rectangle très arrondi un peu irrégulier (carte organique) ;
 *   - `wavy(side, ...)` : bord ondulé (bandeau, pied de page, colonne).
 *
 * Pour un 11e modèle : écris une fonction de layout, ajoute-la à
 * `LAYOUT_FUNCTIONS` et `ORGANIQUE_LAYOUTS`, puis une entrée dans `names`,
 * `palettes` et `ORGANIQUE_FONTS` (Organique.ts).
 */
import { makeCircle, makeRect, measureText, type TemplateStyle } from '../cv-shared/builder'
import { mix } from '../cv-shared/color'
import type { CvContent, CvElement, ShapeElement } from '../cv-shared/types'
import { PAGE_HEIGHT as H, PAGE_WIDTH as W } from '../cv-shared/types'
import {
  bars, box, bullets, card, chip, chips, contacts, education, eduOf, expOf, experiences, iconRow, langsOf, photo, skillsOf, txt,
  type Ctx, type ExpColors,
} from '../cv-Tendance/builder'

export const ORGANIQUE_LAYOUTS = [
  { key: 'rose-poudre', label: 'Rose poudré' },
  { key: 'ocean-bulles', label: 'Océan à bulles' },
  { key: 'sauge-vague', label: 'Sauge et vague' },
  { key: 'nuit-lavande', label: 'Nuit lavande' },
  { key: 'soleil-vagues', label: 'Soleil et vagues' },
  { key: 'corail-degrade', label: 'Corail dégradé' },
  { key: 'encre-galets', label: 'Encre et galets' },
  { key: 'bleu-citron', label: 'Bleu et citron' },
  { key: 'bordeaux-arche', label: 'Bordeaux et arche' },
  { key: 'menthe-ruban', label: 'Menthe et ruban' },
] as const

/* ------------------------------------------------------------------ */
/* Fabriques de formes                                                 */
/* ------------------------------------------------------------------ */

type Pt = [number, number]
const f1 = (n: number) => Math.round(n * 10) / 10

/** Générateur pseudo-aléatoire déterministe : une même graine donne toujours la même forme. */
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Courbe fermée et lisse (Catmull-Rom) passant par tous les points. */
function smooth(p: Pt[], tension = 1) {
  const n = p.length
  let d = `M ${f1(p[0][0])} ${f1(p[0][1])}`
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n]
    const p1 = p[i]
    const p2 = p[(i + 1) % n]
    const p3 = p[(i + 2) % n]
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) / 6) * tension, p1[1] + ((p2[1] - p0[1]) / 6) * tension]
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) / 6) * tension, p2[1] - ((p3[1] - p1[1]) / 6) * tension]
    d += ` C ${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`
  }
  return `${d} Z`
}

/** Galet : cercle dont le rayon varie un peu d'un point à l'autre. */
function radial(seed: number, n = 9, jitter = 0.16) {
  const r = rng(seed)
  const pts: Pt[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const rad = 500 * (1 - jitter + r() * jitter * 2)
    pts.push([500 + Math.cos(a) * rad, 500 + Math.sin(a) * rad])
  }
  return smooth(pts)
}

/** Rectangle très arrondi, légèrement irrégulier : une carte organique. */
function squircle(seed: number, jitter = 18) {
  const r = rng(seed)
  const j = () => (r() - 0.5) * 2 * jitter
  const raw: Pt[] = [
    [150, 0], [500, 0], [850, 0], [1000, 150], [1000, 500], [1000, 850],
    [850, 1000], [500, 1000], [150, 1000], [0, 850], [0, 500], [0, 150],
  ]
  const pts = raw.map(([x, y]): Pt => {
    const dx = x === 0 ? Math.abs(j()) : x === 1000 ? -Math.abs(j()) : j()
    const dy = y === 0 ? Math.abs(j()) : y === 1000 ? -Math.abs(j()) : j()
    return [x + dx, y + dy]
  })
  return smooth(pts)
}

/**
 * Forme dont un côté est ondulé : `side` est le côté ondulé ; `base` sa position
 * moyenne (0-1000), `amp` l'amplitude, `count` le nombre de vagues.
 */
function wavy(side: 'bottom' | 'top' | 'right' | 'left', base: number, amp: number, count: number, phase = 0) {
  const steps = 80
  const edge: Pt[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const off = base + amp * Math.sin(t * Math.PI * 2 * count + phase)
    edge.push(side === 'bottom' || side === 'top' ? [t * 1000, off] : [off, t * 1000])
  }
  const list = edge.map(([x, y]) => `${f1(x)} ${f1(y)}`)
  if (side === 'bottom') return `M 0 0 L 1000 0 L ${list.slice().reverse().join(' L ')} Z`
  if (side === 'top') return `M 0 1000 L 1000 1000 L ${list.slice().reverse().join(' L ')} Z`
  if (side === 'right') return `M 0 0 L ${list.join(' L ')} L 0 1000 Z`
  return `M 1000 0 L ${list.join(' L ')} L 1000 1000 Z`
}

/** Ruban ondulé horizontal : deux bords ondulés séparés par `thickness`. */
function ribbon(top: number, thickness: number, amp: number, count: number, phase = 0) {
  const steps = 80
  const up: string[] = []
  const down: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const y = top + amp * Math.sin(t * Math.PI * 2 * count + phase)
    up.push(`${f1(t * 1000)} ${f1(y)}`)
    down.push(`${f1(t * 1000)} ${f1(y + thickness)}`)
  }
  return `M ${up.join(' L ')} L ${down.reverse().join(' L ')} Z`
}

/** Pose une forme organique. */
function blob(k: Ctx, path: string, x: number, y: number, w: number, h: number, fill: string, o: Partial<ShapeElement> = {}) {
  k.els.push(makeRect({ x, y, w, h, fill, shape: 'wave', customPath: path, name: 'Forme organique', ...o }))
}

/** Carte organique qui s'adapte à son contenu (même principe que `card`). */
function pebbleCard(
  k: Ctx, x: number, y: number, w: number, fill: string, seed: number,
  draw: (k: Ctx, x: number, y: number, w: number) => number,
  o: { pad?: number; stroke?: string; minH?: number } = {},
) {
  const pad = o.pad ?? 30
  const scratch: Ctx = { els: [], s: k.s, c: k.c }
  const bottom = draw(scratch, x + pad, y + pad, w - pad * 2)
  const h = Math.max(o.minH ?? 0, Math.ceil(bottom - y + pad - 6))
  blob(k, squircle(seed), x, y, w, h, fill, { stroke: o.stroke ?? 'transparent', strokeWidth: o.stroke ? 3 : 0, name: 'Carte organique' })
  draw(k, x + pad, y + pad, w - pad * 2)
  return y + h
}

/* ------------------------------------------------------------------ */
/* Petits outils de texte                                              */
/* ------------------------------------------------------------------ */

type Align = 'left' | 'center' | 'right'
type Built = { background: string; elements: CvElement[] }

/** Titre de rubrique en police de titre. Renvoie le y du dessous. */
function title(k: Ctx, label: string, x: number, y: number, w: number, color: string, size = 26, align: Align = 'left') {
  txt(k, label, x, y, w, { size, font: k.s.heading, color, lh: 1.15, align })
  return y + Math.ceil(size * 1.15) + 10
}

/** Nom (grande police de titre). Renvoie le y du dessous. */
function name(k: Ctx, x: number, y: number, w: number, color: string, size = 48, align: Align = 'left', weight = 700) {
  const h = txt(k, k.c.fullName, x, y, w, { size, weight, font: k.s.heading, color, lh: 1.08, align })
  return y + h + 4
}

function jobTitle(k: Ctx, x: number, y: number, w: number, color: string, size = 17, align: Align = 'left') {
  return y + txt(k, k.c.title, x, y, w, { size, weight: 500, font: k.s.heading, color, align, lh: 1.25 }) + 6
}

/** Liste numérotée (1. 2. 3.) comme dans le modèle d'origine. */
function numbered(k: Ctx, items: string[], x: number, y: number, w: number, numColor: string, color: string, size = 14) {
  let cy = y
  items.forEach((item, i) => {
    txt(k, `${i + 1}.`, x, cy, 24, { size, color: numColor, weight: 700 })
    cy += Math.max(txt(k, item, x + 24, cy, w - 24, { size, color }), 20) + 5
  })
  return cy
}

/** Pastille de titre : fond arrondi plein et texte. */
function pillTitle(k: Ctx, label: string, x: number, y: number, fill: string, color: string) {
  const w = Math.ceil(label.length * 9.4 + 34)
  box(k, x, y, w, 30, fill, 15)
  txt(k, label, x, y + 4, w, { size: 15, font: k.s.heading, color, align: 'center', lh: 1.2 })
  return y + 30 + 14
}

const colors = (k: Ctx, accent: string, ink = k.s.text): ExpColors => ({ title: ink, accent, muted: mix(ink, k.s.bg, 0.3) })
const hh = (k: Ctx, text: string, w: number, size: number, lh: number) => measureText(text, w * 0.93, size, lh, 0, k.s.body)

/* ------------------------------------------------------------------ */
/* Les 10 layouts                                                      */
/* ------------------------------------------------------------------ */

/** 1. Rose poudré : hommage au modèle d'origine (blobs roses, photo ronde, colonne claire). */
function rosePoudre(k: Ctx): Built {
  const { s } = k
  const ink = s.text
  const head = '#C4616F'
  const sumH = hh(k, k.c.summary, 262, 14, 1.65)
  const blobBottom = Math.max(560, 392 + sumH + 56)

  blob(k, smooth([[40, 170], [280, 100], [560, 70], [850, 0], [900, 130], [790, 320], [930, 540], [800, 800], [520, 970], [260, 900], [60, 680], [0, 420]]), -40, 44, 470, blobBottom - 44, s.secondary)
  blob(k, smooth([[260, 120], [540, 0], [900, -50], [1000, 200], [980, 600], [780, 800], [480, 900], [220, 780], [40, 520], [100, 260]]), 372, -34, 480, 420, s.primary)
  photo(k, 56, 66, 252, 252, 126)

  const ny = name(k, 440, 138, 280, '#ffffff', 46, 'right', 500)
  txt(k, k.c.title, 440, ny + 4, 280, { size: 22, font: k.s.heading, color: '#FBEAEC', align: 'right', lh: 1.2 })

  title(k, 'Profil', 40, 338, 280, head, 32, 'center')
  txt(k, k.c.summary, 56, 392, 262, { size: 14, color: ink, align: 'center', lh: 1.65 })

  let ly = title(k, 'Compétences clés', 60, blobBottom + 12, 300, head, 28)
  ly = numbered(k, skillsOf(k, 4), 72, ly + 2, 250, head, ink, 13.5)

  const cy = Math.min(Math.max(ly + 20, 820), 868)
  blob(k, smooth([[0, 170], [160, 40], [520, 0], [860, 250], [960, 600], [1000, 1000], [0, 1000]]), -30, cy, 390, H - cy + 70, s.secondary)
  title(k, 'Coordonnées', 52, cy + 64, 300, head, 34)
  let py = cy + 122
  for (const v of [k.c.phone, k.c.location, k.c.email, k.c.website]) if (v) py += txt(k, v, 52, py, 290, { size: 14.5, color: ink }) + 8

  const col = colors(k, head, ink)
  let ry = title(k, 'Expériences', 410, 408, 340, head, 30)
  for (const e of expOf(k, 2)) {
    ry += txt(k, `${e.role} – ${e.company}`, 410, ry, 340, { weight: 700, color: ink, size: 13.5 }) + 1
    ry += txt(k, e.period, 410, ry, 340, { size: 13, color: col.muted }) + 3
    ry += txt(k, e.description, 410, ry, 340, { size: 13.5, color: col.muted }) + 16
  }
  ry = title(k, 'Formations', 410, ry + 4, 340, head, 30)
  ry = education(k, eduOf(k, 2), 410, ry, 340, ink, col.muted) + 6
  ry = title(k, 'Langues', 410, ry, 340, head, 30)
  for (const l of langsOf(k, 3)) ry += txt(k, l, 410, ry, 340, { color: col.muted }) + 4
  if (k.c.interests.length && ry < 1010) {
    ry = title(k, 'Centres d’intérêt', 410, ry + 8, 340, head, 30)
    txt(k, k.c.interests.slice(0, 4).join(', '), 410, ry, 340, { color: col.muted })
  }
  return { background: s.bg, elements: k.els }
}

/** 2. Océan à bulles : grande colonne organique à droite, bulles translucides à gauche. */
function oceanBulles(k: Ctx): Built {
  const { s } = k
  const ink = s.text
  const white = '#ffffff'

  blob(k, smooth([[60, 0], [140, 180], [20, 380], [110, 600], [10, 820], [90, 1000], [1000, 1000], [1000, 0]]), 462, -30, 480, H + 60, s.primary)
  blob(k, radial(7, 9, 0.14), -90, 930, 300, 280, s.secondary, { opacity: 0.8 })
  blob(k, radial(11, 8, 0.12), 20, 1010, 150, 140, s.primary, { opacity: 0.25 })
  blob(k, radial(3, 9, 0.12), 360, 880, 120, 112, s.secondary, { opacity: 0.9 })
  k.els.push(makeCircle({ x: 330, y: 1040, w: 46, h: 46, fill: s.secondary }))
  k.els.push(makeCircle({ x: -34, y: 330, w: 70, h: 70, fill: s.secondary, opacity: 0.7 }))

  photo(k, 568, 56, 178, 178, 89, white, 6)
  let sy = 266
  sy = title(k, 'Contact', 566, sy, 190, white, 24)
  sy = contacts(k, 566, sy, 190, s.secondary, white) + 14
  sy = title(k, 'Compétences', 566, sy, 190, white, 24)
  const shortSkills = skillsOf(k, 12).filter((v) => v.length <= 22).slice(0, 5)
  sy = shortSkills.length >= 3
    ? chips(k, shortSkills, 566, sy, 190, 'rgba(255,255,255,0.18)', white, 12, 'rgba(255,255,255,0.55)') + 18
    : bullets(k, skillsOf(k, 4), 566, sy, 190, s.secondary, white) + 14
  sy = title(k, 'Langues', 566, sy, 190, white, 24)
  bullets(k, langsOf(k, 3), 566, sy, 190, s.secondary, white)

  const ny = name(k, 44, 66, 400, ink, 48, 'left', 700)
  let y = jobTitle(k, 44, ny, 400, s.primary, 18) + 20
  blob(k, radial(21, 8, 0.1), 44, y, 62, 56, s.secondary)
  y = title(k, 'Profil', 44, y + 70, 400, s.primary, 24)
  y += txt(k, k.c.summary, 44, y, 400, { color: ink }) + 22
  y = title(k, 'Expériences', 44, y, 400, s.primary, 24)
  y = experiences(k, expOf(k, 3), 44, y, 400, colors(k, s.primary, ink), 16) + 6
  y = title(k, 'Formation', 44, y, 400, s.primary, 24)
  education(k, eduOf(k, 2), 44, y, 400, ink, mix(ink, '#ffffff', 0.35))
  return { background: s.bg, elements: k.els }
}

/** 3. Sauge et vague : colonne verte au bord ondulé, petites feuilles en haut à droite. */
function saugeVague(k: Ctx): Built {
  const { s } = k
  const ink = s.text
  const cream = '#FBF7EA'

  blob(k, radial(5, 9, 0.15), 560, -100, 330, 280, s.secondary)
  blob(k, radial(9, 8, 0.12), 690, 40, 150, 130, s.primary, { opacity: 0.45 })
  blob(k, radial(14, 9, 0.14), 590, 960, 300, 250, s.secondary)
  blob(k, wavy('right', 880, 55, 3.5, 0.6), 0, 0, 310, H, s.primary)

  photo(k, 52, 48, 180, 180, 90, cream, 5)
  let sy = title(k, 'Contact', 40, 258, 220, cream, 24)
  sy = contacts(k, 40, sy, 214, cream, cream) + 12
  sy = title(k, 'Compétences', 40, sy, 220, cream, 24)
  sy = bullets(k, skillsOf(k, 6), 42, sy, 206, cream, cream) + 12
  sy = title(k, 'Langues', 40, sy, 220, cream, 24)
  sy = bullets(k, langsOf(k, 3), 42, sy, 206, cream, cream) + 12
  if (k.c.interests.length && sy < 960) {
    sy = title(k, 'Loisirs', 40, sy, 220, cream, 24)
    txt(k, k.c.interests.slice(0, 3).join(' · '), 40, sy, 206, { color: cream })
  }

  const x = 350
  const w = 404
  const ny = name(k, x, 64, 340, ink, 50, 'left', 700)
  let y = jobTitle(k, x, ny, w, s.primary, 19) + 16
  y = title(k, 'Profil', x, y, w, s.primary, 26)
  y += txt(k, k.c.summary, x, y, w, { color: ink }) + 22
  y = title(k, 'Expériences', x, y, w, s.primary, 26)
  y = experiences(k, expOf(k, 3), x, y, w, colors(k, s.primary, ink), 16) + 6
  y = title(k, 'Formation', x, y, w, s.primary, 26)
  education(k, eduOf(k, 2), x, y, w, ink, mix(ink, '#ffffff', 0.35))
  return { background: s.bg, elements: k.els }
}

/** 4. Nuit lavande : fond sombre, blobs translucides qui se chevauchent, cartes-galets. */
function nuitLavande(k: Ctx): Built {
  const { s } = k
  const ink = s.text
  const muted = mix(ink, s.bg, 0.3)
  const pink = '#FF8FD0'

  blob(k, radial(2, 9, 0.14), -130, -150, 560, 480, s.primary, { opacity: 0.3 })
  blob(k, radial(8, 9, 0.14), 400, -110, 540, 440, pink, { opacity: 0.2 })
  blob(k, radial(4, 9, 0.1), 170, -70, 460, 380, s.secondary)
  blob(k, radial(15, 9, 0.12), 520, 900, 380, 330, s.primary, { opacity: 0.18 })
  photo(k, 312, 54, 170, 170, 85, s.primary, 5)
  let ny = name(k, 77, 246, 640, ink, 46, 'center', 600)
  ny = jobTitle(k, 77, ny, 640, s.primary, 18, 'center')

  const stroke = mix(s.primary, s.bg, 0.55)
  const sec = s.secondary
  const left = pebbleCard(k, 28, 392, 262, sec, 31, (kk, x, y, w) => {
    let cy = title(kk, 'Contact', x, y, w, s.primary, 22)
    cy = contacts(kk, x, cy, w, s.primary, ink) + 10
    cy = title(kk, 'Compétences', x, cy, w, s.primary, 22)
    cy = chips(kk, skillsOf(kk, 6), x, cy, w, mix(s.primary, sec, 0.8), ink, 12) + 12
    cy = title(kk, 'Langues', x, cy, w, s.primary, 22)
    return bullets(kk, langsOf(kk, 3), x, cy, w, s.primary, ink)
  }, { stroke, pad: 28 })
  void left
  const col: ExpColors = { title: ink, accent: s.primary, muted }
  let ry = pebbleCard(k, 312, 392, 454, sec, 17, (kk, x, y, w) => {
    const cy = title(kk, 'Profil', x, y, w, s.primary, 22)
    return cy + txt(kk, kk.c.summary, x, cy, w, { color: muted, size: 13.5 })
  }, { stroke, pad: 28 }) + 14
  ry = pebbleCard(k, 312, ry, 454, sec, 23, (kk, x, y, w) => {
    const cy = title(kk, 'Expériences', x, y, w, s.primary, 22)
    return experiences(kk, expOf(kk, 2), x, cy, w, col, 12)
  }, { stroke, pad: 28 }) + 14
  pebbleCard(k, 312, ry, 454, sec, 29, (kk, x, y, w) => {
    const cy = title(kk, 'Formation', x, y, w, s.primary, 22)
    return education(kk, eduOf(kk, 1), x, cy, w, ink, muted)
  }, { stroke, pad: 28 })
  return { background: s.bg, elements: k.els }
}

/** 5. Soleil et vagues : bandeau jaune à bord ondulé, photo à cheval, pied de page ondulé. */
function soleilVagues(k: Ctx): Built {
  const { s } = k
  const ink = s.text
  const terra = s.secondary

  blob(k, wavy('top', 120, 70, 2.5, 1.2), 0, 1040, W, 83, terra)
  blob(k, wavy('bottom', 780, 70, 2.2, 0.4), 0, 0, W, 410, s.primary)
  blob(k, radial(6, 9, 0.14), 560, -130, 380, 330, terra, { opacity: 0.9 })
  blob(k, radial(12, 8, 0.1), 690, 150, 110, 100, '#ffffff', { opacity: 0.35 })
  photo(k, 50, 240, 194, 194, 97, s.bg, 8)

  const ny = name(k, 272, 56, 330, ink, 48, 'left', 800)
  const ty = jobTitle(k, 272, ny, 330, '#7A3410', 17)
  let cy = ty + 10
  for (const [icon, v] of [['mail', k.c.email], ['phone', k.c.phone], ['map-pin', k.c.location]] as [string, string][]) {
    if (v) cy += iconRow(k, icon, v, 272, cy, 340, ink, ink) - 2
  }

  let ly = 474
  ly = pillTitle(k, 'Compétences', 40, ly, terra, '#ffffff')
  ly = bullets(k, skillsOf(k, 6), 42, ly, 200, terra, ink) + 12
  ly = pillTitle(k, 'Langues', 40, ly, terra, '#ffffff')
  ly = bullets(k, langsOf(k, 3), 42, ly, 200, terra, ink) + 12
  if (k.c.website) {
    ly = pillTitle(k, 'Web', 40, ly, terra, '#ffffff')
    txt(k, k.c.website, 42, ly, 200, { color: ink })
  }

  const x = 290
  const w = 464
  let y = 462
  y = pillTitle(k, 'Profil', x, y, terra, '#ffffff')
  y += txt(k, k.c.summary, x, y, w, { color: ink }) + 16
  y = pillTitle(k, 'Expériences', x, y, terra, '#ffffff')
  y = experiences(k, expOf(k, 2), x, y, w, colors(k, '#B4501F', ink), 12)
  y = pillTitle(k, 'Formation', x, y + 2, terra, '#ffffff')
  education(k, eduOf(k, 1), x, y, w, ink, mix(ink, '#ffffff', 0.3))
  return { background: s.bg, elements: k.els }
}

/** 6. Corail dégradé : grand blob en dégradé en haut à gauche, coin en bas à droite. */
function corailDegrade(k: Ctx): Built {
  const { s } = k
  const ink = s.text
  const grad = 'linear-gradient(135deg, #D93F5C 0%, #FF8A5B 100%)'

  blob(k, smooth([[240, 60], [560, 0], [900, 110], [1000, 380], [880, 700], [560, 900], [250, 960], [40, 800], [0, 480], [60, 220]]), -110, -150, 700, 560, grad)
  blob(k, radial(19, 9, 0.12), 590, 990, 300, 250, 'linear-gradient(135deg, #FF8A5B 0%, #D93F5C 100%)', { opacity: 0.92 })
  blob(k, radial(22, 8, 0.1), 600, 70, 120, 110, s.secondary)
  photo(k, 44, 52, 196, 196, 98, '#ffffff', 6)
  const ny = name(k, 272, 82, 250, '#ffffff', 40, 'left', 700)
  jobTitle(k, 272, ny + 2, 250, '#FFF0E8', 17)

  const dot = (x: number, y: number) => blob(k, radial(x + y, 8, 0.1), x, y, 22, 20, 'linear-gradient(135deg, #D93F5C 0%, #FF8A5B 100%)')
  const head = (label: string, x: number, y: number, w: number) => {
    dot(x, y + 5)
    return title(k, label, x + 32, y, w - 32, '#D93F5C', 24)
  }
  let ly = 408
  ly = head('Contact', 40, ly, 240)
  ly = contacts(k, 40, ly, 230, '#D93F5C', ink) + 10
  ly = head('Compétences', 40, ly, 240)
  ly = bars(k, skillsOf(k, 5), 40, ly, 222, s.secondary, '#E8543F', ink) + 4
  ly = head('Langues', 40, ly, 240)
  bullets(k, langsOf(k, 3), 42, ly, 220, '#E8543F', ink)

  const x = 312
  const w = 442
  let y = head('Profil', x - 32, 408, w + 32)
  y += txt(k, k.c.summary, x, y, w, { color: ink }) + 18
  y = head('Expériences', x - 32, y, w + 32)
  y = experiences(k, expOf(k, 2), x, y, w, colors(k, '#D93F5C', ink), 14) + 4
  y = head('Formation', x - 32, y, w + 32)
  education(k, eduOf(k, 1), x, y, w, ink, mix(ink, '#ffffff', 0.3))
  return { background: s.bg, elements: k.els }
}

/** 7. Encre et galets : deux blobs noirs, grande photo ronde, titres en capsules. */
function encreGalets(k: Ctx): Built {
  const { s } = k
  const ink = s.text
  const paper = s.bg
  const sand = s.secondary

  blob(k, smooth([[230, 70], [560, 0], [860, 130], [1000, 420], [900, 760], [600, 960], [250, 940], [40, 700], [0, 380], [80, 170]]), -130, -110, 720, 560, '#111111')
  blob(k, smooth([[100, 200], [400, 40], [760, 0], [1000, 300], [1000, 1000], [0, 1000]]), 456, 860, 400, 330, '#111111')
  blob(k, radial(33, 8, 0.1), 486, 410, 60, 56, sand)
  photo(k, 516, 120, 232, 232, 116, paper, 9)

  const ny = name(k, 46, 96, 420, paper, 54, 'left', 700)
  jobTitle(k, 46, ny + 6, 420, sand, 20)
  let cy = 262
  for (const [icon, v] of [['mail', k.c.email], ['phone', k.c.phone], ['map-pin', k.c.location]] as [string, string][]) {
    if (v) cy += iconRow(k, icon, v, 46, cy, 380, sand, paper) - 3
  }

  const x = 46
  const w = 410
  let y = 474
  y = pillTitle(k, 'Profil', x, y, '#111111', paper)
  y += txt(k, k.c.summary, x, y, w, { color: ink }) + 16
  y = pillTitle(k, 'Expériences', x, y, '#111111', paper)
  y = experiences(k, expOf(k, 2), x, y, w, colors(k, '#111111', ink), 14)
  y = pillTitle(k, 'Formation', x, y + 2, '#111111', paper)
  education(k, eduOf(k, 1), x, y, w, ink, mix(ink, paper, 0.4))

  const rx = 520
  const rw = 232
  let ry = 394
  ry = pillTitle(k, 'Compétences', rx, ry, '#111111', paper)
  ry = chips(k, skillsOf(k, 5), rx, ry, rw, sand, ink, 12) + 16
  ry = pillTitle(k, 'Langues', rx, ry, '#111111', paper)
  for (const l of langsOf(k, 3)) ry += txt(k, l, rx, ry, rw, { color: ink }) + 4
  if (k.c.website) {
    ry = pillTitle(k, 'Web', rx, ry + 10, '#111111', paper)
    txt(k, k.c.website, rx, ry, rw, { color: ink })
  }
  return { background: s.bg, elements: k.els }
}

/** 8. Bleu et citron : bulles en haut à droite, cartes-galets de tailles différentes. */
function bleuCitron(k: Ctx): Built {
  const { s } = k
  const ink = s.text
  const blue = s.primary
  const lemon = s.secondary
  const tint = '#E8EAFF'
  const col: ExpColors = { title: ink, accent: blue, muted: mix(ink, '#ffffff', 0.3) }

  k.els.push(makeCircle({ x: 520, y: -170, w: 340, h: 340, fill: blue }))
  k.els.push(makeCircle({ x: 484, y: 18, w: 120, h: 120, fill: lemon }))
  k.els.push(makeCircle({ x: 730, y: 150, w: 64, h: 64, fill: lemon }))
  k.els.push(makeCircle({ x: 672, y: 196, w: 30, h: 30, fill: blue }))
  photo(k, 560, 52, 176, 176, 88, lemon, 8)

  const ny = name(k, 40, 64, 440, ink, 52, 'left', 800)
  jobTitle(k, 40, ny + 2, 440, blue, 20)

  const top = 262
  const profil = pebbleCard(k, 28, top, 488, lemon, 41, (kk, x, y, w) => {
    const cy = title(kk, 'Profil', x, y, w, ink, 22)
    return cy + txt(kk, kk.c.summary, x, cy, w, { color: ink, size: 13.5 })
  }, { pad: 28 })
  const contact = pebbleCard(k, 532, top, 234, tint, 43, (kk, x, y, w) => {
    const cy = title(kk, 'Contact', x, y, w, blue, 22)
    return contacts(kk, x, cy, w, blue, ink)
  }, { pad: 24, minH: profil - top })
  const left = pebbleCard(k, 28, Math.max(profil, contact) + 16, 488, '#ffffff', 47, (kk, x, y, w) => {
    const cy = title(kk, 'Expériences', x, y, w, blue, 22)
    return experiences(kk, expOf(kk, 2), x, cy, w, col, 14)
  }, { pad: 28, stroke: blue })
  const skills = pebbleCard(k, 532, Math.max(profil, contact) + 16, 234, blue, 53, (kk, x, y, w) => {
    const cy = title(kk, 'Compétences', x, y, w, '#ffffff', 21)
    return bullets(kk, skillsOf(kk, 6), x, cy, w, lemon, '#ffffff')
  }, { pad: 26 })
  const lang = pebbleCard(k, 532, skills + 16, 234, lemon, 59, (kk, x, y, w) => {
    const cy = title(kk, 'Langues', x, y, w, ink, 21)
    return bullets(kk, langsOf(kk, 3), x, cy, w, blue, ink)
  }, { pad: 26 })
  void lang
  pebbleCard(k, 28, left + 16, 488, tint, 61, (kk, x, y, w) => {
    const cy = title(kk, 'Formation', x, y, w, blue, 22)
    return education(kk, eduOf(kk, 2), x, cy, w, ink, col.muted)
  }, { pad: 28 })
  return { background: s.bg, elements: k.els }
}

/** 9. Bordeaux et arche : arche pleine à droite, courbes dorées en contour à gauche. */
function bordeauxArche(k: Ctx): Built {
  const { s } = k
  const ink = s.text
  const gold = '#C9A15B'
  const champ = s.secondary

  blob(k, radial(51, 9, 0.1), -150, 880, 400, 380, 'transparent', { stroke: gold, strokeWidth: 2, name: 'Courbe dorée' })
  blob(k, radial(57, 9, 0.12), -90, 940, 300, 300, 'transparent', { stroke: gold, strokeWidth: 2, name: 'Courbe dorée' })
  blob(k, radial(63, 9, 0.12), 300, -120, 230, 220, champ)
  blob(k, 'M 0 1000 L 0 500 C 0 224 224 0 500 0 C 776 0 1000 224 1000 500 L 1000 1000 Z', 494, 36, 264, 1051, s.primary, { name: 'Arche' })

  photo(k, 540, 104, 172, 172, 86, gold, 4)
  const ny = name(k, 514, 296, 224, champ, 32, 'center', 400)
  jobTitle(k, 514, ny, 224, gold, 15, 'center')

  let sy = 436
  const rows: [string, string][] = [['mail', k.c.email], ['phone', k.c.phone], ['map-pin', k.c.location]]
  for (const [icon, v] of rows) if (v) sy += iconRow(k, icon, v, 520, sy, 214, gold, champ)
  sy = title(k, 'Compétences', 520, sy + 10, 220, champ, 22)
  sy = bullets(k, skillsOf(k, 6), 522, sy, 206, gold, champ) + 10
  sy = title(k, 'Langues', 520, sy, 220, champ, 22)
  bullets(k, langsOf(k, 3), 522, sy, 206, gold, champ)

  const x = 52
  const w = 410
  const col = colors(k, s.primary, ink)
  const head = (label: string, y: number) => {
    const ny2 = title(k, label, x, y, w, s.primary, 28)
    box(k, x, ny2 - 6, 54, 3, gold, 2)
    return ny2 + 8
  }
  let y = head('Profil', 66)
  y += txt(k, k.c.summary, x, y, w, { color: ink }) + 20
  y = head('Expériences', y)
  y = experiences(k, expOf(k, 3), x, y, w, col, 14) + 4
  y = head('Formation', y)
  education(k, eduOf(k, 2), x, y, w, ink, col.muted)
  return { background: s.bg, elements: k.els }
}

/** 10. Menthe et ruban : ruban ondulé horizontal qui porte les compétences. */
function menteRuban(k: Ctx): Built {
  const { s } = k
  const ink = s.text
  const lilac = s.secondary
  const mint = s.primary
  const muted = mix(ink, '#ffffff', 0.35)

  blob(k, ribbon(250, 560, 100, 1.4, 1.2), -10, 458, W + 20, 300, lilac, { opacity: 0.75 })
  blob(k, ribbon(200, 520, 90, 1.5, 0.5), -10, 440, W + 20, 300, mint)
  blob(k, radial(71, 9, 0.14), 640, -90, 300, 270, lilac)
  blob(k, radial(77, 8, 0.12), 700, 30, 110, 100, mint, { opacity: 0.6 })

  photo(k, 48, 58, 206, 206, 103, lilac, 8)
  const ny = name(k, 282, 66, 400, ink, 50, 'left', 700)
  let y = jobTitle(k, 282, ny, 440, mint === s.primary ? '#2E8F72' : mint, 19) + 6
  y += txt(k, k.c.summary, 282, y, 460, { color: ink, size: 13.5 }) + 14
  let cx = 48
  for (const v of [k.c.email, k.c.phone, k.c.location].filter(Boolean)) {
    const w = chip(k, v, cx, 304 > y ? Math.max(y, 296) : y, lilac, ink, 12)
    cx += w + 8
    if (cx > 600) break
  }

  const skills = skillsOf(k, 6)
  let px = 56
  let py = 536
  for (const item of skills) {
    const pw = Math.ceil(item.length * 7.4 + 28)
    if (px + pw > W - 56) { px = 56; py += 40 }
    chip(k, item, px, py, '#ffffff', ink, 12.5)
    px += pw + 10
  }

  const col = colors(k, '#2E8F72', ink)
  let ly = title(k, 'Expériences', 48, 712, 340, '#2E8F72', 26)
  ly = experiences(k, expOf(k, 2), 48, ly, 340, col, 14)
  let ry = title(k, 'Formation', 418, 712, 330, '#2E8F72', 26)
  ry = education(k, eduOf(k, 2), 418, ry, 330, ink, muted) + 6
  ry = title(k, 'Langues', 418, ry, 330, '#2E8F72', 26)
  ry = chips(k, langsOf(k, 3), 418, ry, 330, lilac, ink, 12.5) + 14
  if (k.c.interests.length) {
    ry = title(k, 'Centres d’intérêt', 418, ry, 330, '#2E8F72', 26)
    txt(k, k.c.interests.slice(0, 4).join(', '), 418, ry, 330, { color: muted })
  }
  void H
  void card
  void bars
  return { background: s.bg, elements: k.els }
}

const LAYOUT_FUNCTIONS: Record<(typeof ORGANIQUE_LAYOUTS)[number]['key'], (k: Ctx) => Built> = {
  'rose-poudre': rosePoudre,
  'ocean-bulles': oceanBulles,
  'sauge-vague': saugeVague,
  'nuit-lavande': nuitLavande,
  'soleil-vagues': soleilVagues,
  'corail-degrade': corailDegrade,
  'encre-galets': encreGalets,
  'bleu-citron': bleuCitron,
  'bordeaux-arche': bordeauxArche,
  'menthe-ruban': menteRuban,
}

export const CV_ORGANIQUE_LAYOUTS = ORGANIQUE_LAYOUTS
export function buildCvOrganique(key: string, style: TemplateStyle, content: CvContent): Built {
  const layout = LAYOUT_FUNCTIONS[key as keyof typeof LAYOUT_FUNCTIONS] ?? rosePoudre
  return layout({ els: [], s: style, c: content })
}
