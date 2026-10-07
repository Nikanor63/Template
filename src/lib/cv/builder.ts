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

type HeadingVariant = 'underline' | 'bar' | 'plain' | 'dot'

interface Colors {
  text: string
  muted: string
  accent: string
}

let counter = 0
export function uid(prefix = 'el') {
  counter += 1
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}_${Math.random().toString(36).slice(2, 6)}`
}

export function measureText(text: string, w: number, fontSize: number, lineHeight: number, letterSpacing = 0) {
  const charW = fontSize * 0.52 + letterSpacing
  const perLine = Math.max(1, Math.floor(w / charW))
  const lines = text.split('\n').reduce((sum, p) => sum + Math.max(1, Math.ceil(p.length / perLine)), 0)
  return Math.ceil(lines * fontSize * lineHeight) + 2
}

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
    fontFamily: 'var(--font-inter)',
    fontWeight: 400,
    color: '#14202e',
    align: 'left',
    lineHeight,
    letterSpacing,
    fontSize,
    h: partial.h ?? measureText(text, partial.w, fontSize, lineHeight, letterSpacing),
    ...partial,
  }
}

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

export function makeCircle(partial: Partial<ShapeElement> & { x: number; y: number; w: number; h: number }) {
  return makeRect({ ...partial, type: 'circle', radius: 9999 })
}

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

function createColumn(els: CvElement[], s: TemplateStyle, x: number, y: number, w: number, c: Colors) {
  let cy = y
  const push = <T extends CvElement>(el: T) => {
    els.push(el)
    return el
  }
  const label = (t: string) => (s.upper ? t.toUpperCase() : t)

  const api = {
    get y() {
      return cy
    },
    set y(v: number) {
      cy = v
    },
    gap(n: number) {
      cy += n
      return api
    },
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
          fontSize: s.upper ? 12.5 : 16,
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
    para(text: string, opts: Partial<TextElement> = {}) {
      const t = push(
        makeText({ text, x, y: cy, w, fontFamily: s.body, fontSize: 10.5, color: c.muted, lineHeight: 1.55, ...opts }),
      )
      cy += t.h + 4
      return api
    },
    experiences(items: CvContent['experiences']) {
      for (const e of items) {
        const r = push(
          makeText({ text: e.role, x, y: cy, w, fontFamily: s.heading, fontSize: 12.5, fontWeight: 700, color: c.text }),
        )
        cy += r.h
        const m = push(
          makeText({
            text: `${e.company}  ·  ${e.period}`,
            x,
            y: cy,
            w,
            fontFamily: s.body,
            fontSize: 10,
            fontWeight: 600,
            color: c.accent,
          }),
        )
        cy += m.h + 2
        const d = push(
          makeText({ text: e.description, x, y: cy, w, fontFamily: s.body, fontSize: 10, color: c.muted, lineHeight: 1.5 }),
        )
        cy += d.h + 12
      }
      return api
    },
    timeline(items: CvContent['experiences']) {
      const startY = cy
      const lineX = x
      const inner = x + 22
      const innerW = w - 22
      const dots: CvElement[] = []
      for (const e of items) {
        dots.push(makeCircle({ x: lineX - 5, y: cy + 3, w: 12, h: 12, fill: c.accent, stroke: '#ffffff', strokeWidth: 2 }))
        const r = push(
          makeText({ text: e.role, x: inner, y: cy, w: innerW, fontFamily: s.heading, fontSize: 12.5, fontWeight: 700, color: c.text }),
        )
        cy += r.h
        const m = push(
          makeText({ text: `${e.company}  ·  ${e.period}`, x: inner, y: cy, w: innerW, fontFamily: s.body, fontSize: 10, fontWeight: 600, color: c.accent }),
        )
        cy += m.h + 2
        const d = push(
          makeText({ text: e.description, x: inner, y: cy, w: innerW, fontFamily: s.body, fontSize: 10, color: c.muted, lineHeight: 1.5 }),
        )
        cy += d.h + 14
      }
      els.push(makeRect({ x: lineX, y: startY + 6, w: 2, h: cy - startY - 20, fill: mix(c.accent, '#ffffff', 0.5) }))
      els.push(...dots)
      return api
    },
    education(items: CvContent['education']) {
      for (const e of items) {
        const r = push(
          makeText({ text: e.degree, x, y: cy, w, fontFamily: s.heading, fontSize: 12, fontWeight: 700, color: c.text }),
        )
        cy += r.h
        const m = push(
          makeText({ text: `${e.school}  ·  ${e.period}`, x, y: cy, w, fontFamily: s.body, fontSize: 10, color: c.muted }),
        )
        cy += m.h + 10
      }
      return api
    },
    list(items: string[], opts: Partial<TextElement> = {}) {
      const t = push(
        makeText({
          text: items.map((i) => `•  ${i}`).join('\n'),
          x,
          y: cy,
          w,
          fontFamily: s.body,
          fontSize: 10.5,
          color: c.muted,
          lineHeight: 1.75,
          ...opts,
        }),
      )
      cy += t.h + 6
      return api
    },
    inline(items: string[], opts: Partial<TextElement> = {}) {
      const t = push(
        makeText({ text: items.join('   ·   '), x, y: cy, w, fontFamily: s.body, fontSize: 10.5, color: c.muted, lineHeight: 1.6, ...opts }),
      )
      cy += t.h + 6
      return api
    },
    pills(items: string[], fill: string, color: string) {
      let px = x
      const ph = 24
      for (const item of items) {
        const pw = Math.ceil(item.length * 10 * 0.56 + 22)
        if (px + pw > x + w) {
          px = x
          cy += ph + 8
        }
        push(makeRect({ x: px, y: cy, w: pw, h: ph, fill, radius: 12 }))
        push(
          makeText({ text: item, x: px, y: cy + 5, w: pw, h: 16, fontFamily: s.body, fontSize: 10, fontWeight: 600, color, align: 'center', lineHeight: 1.4 }),
        )
        px += pw + 8
      }
      cy += ph + 14
      return api
    },
    bars(items: string[], track: string) {
      items.forEach((item, i) => {
        const t = push(makeText({ text: item, x, y: cy, w, fontFamily: s.body, fontSize: 10.5, fontWeight: 500, color: c.text }))
        cy += t.h + 3
        push(makeRect({ x, y: cy, w, h: 5, fill: track, radius: 3 }))
        push(makeRect({ x, y: cy, w: Math.round(w * SKILL_LEVELS[i % SKILL_LEVELS.length]), h: 5, fill: c.accent, radius: 3 }))
        cy += 15
      })
      cy += 4
      return api
    },
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
        const t = push(makeText({ text: value, x: x + 22, y: cy, w: w - 22, fontFamily: s.body, fontSize: 10.5, color: c.text }))
        cy += Math.max(t.h, 16) + 6
      }
      cy += 6
      return api
    },
  }
  return api
}

type LayoutFn = (s: TemplateStyle, c: CvContent) => { background: string; elements: CvElement[] }

const sidebarLeft: LayoutFn = (s, c) => {
  const els: CvElement[] = []
  const onSide = readableOn(s.secondary)
  const sideMuted = mix(onSide, s.secondary, 0.25)
  els.push(makeRect({ x: 0, y: 0, w: 270, h: PAGE_HEIGHT, fill: s.secondary, name: 'Barre latérale' }))
  if (c.photo) els.push(makeImage({ src: c.photo, x: 65, y: 50, w: 140, h: 140, radius: 9999, stroke: s.primary, strokeWidth: 4 }))
  const side = createColumn(els, s, 32, c.photo ? 225 : 60, 206, { text: onSide, muted: sideMuted, accent: s.primary })
  side.heading('Contact').contacts(c).heading('Compétences').list(c.skills, { color: sideMuted }).gap(4)
  side.heading('Langues').list(c.languages, { color: sideMuted }).gap(4).heading('Intérêts').list(c.interests, { color: sideMuted })
  const main = createColumn(els, s, 310, 60, 440, { text: s.text, muted: s.muted, accent: s.primary })
  main.para(c.fullName, { fontFamily: s.heading, fontSize: 34, fontWeight: 800, color: s.text, lineHeight: 1.1 })
  main.para(c.title, { fontSize: 13, fontWeight: 600, color: s.primary, uppercase: true, letterSpacing: 3 }).gap(22)
  main.heading('Profil').para(c.summary).gap(10).heading('Expérience').experiences(c.experiences).gap(4)
  main.heading('Formation').education(c.education)
  return { background: s.bg, elements: els }
}

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
  if (c.photo) els.push(makeImage({ src: c.photo, x: 572, y: 60, w: 180, h: 200, radius: 18 }))
  const side = createColumn(els, s, 562, c.photo ? 295 : 60, 200, { text: s.text, muted: s.muted, accent: s.primary })
  side.heading('Contact').contacts(c).heading('Compétences').pills(c.skills, '#ffffff', s.text)
  side.heading('Langues').list(c.languages).heading('Intérêts').list(c.interests)
  return { background: s.bg, elements: els }
}

const headerBand: LayoutFn = (s, c) => {
  const els: CvElement[] = []
  const on = readableOn(s.primary)
  els.push(makeRect({ x: 0, y: 0, w: PAGE_WIDTH, h: 220, fill: s.primary, name: 'Bandeau' }))
  if (c.photo) els.push(makeImage({ src: c.photo, x: 50, y: 40, w: 140, h: 140, radius: 9999, stroke: '#ffffff', strokeWidth: 4 }))
  const hx = c.photo ? 225 : 50
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
  if (c.photo) els.push(makeImage({ src: c.photo, x: 600, y: 60, w: 140, h: 140, radius: 9999 }))
  const side = createColumn(els, s, 574, c.photo ? 230 : 60, 196, { text: s.text, muted: s.muted, accent: s.primary })
  side.heading('Contact').contacts(c).heading('Compétences').list(c.skills).heading('Langues').list(c.languages)
  return { background: s.bg, elements: els }
}

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

const splitTop: LayoutFn = (s, c) => {
  const els: CvElement[] = []
  const on = readableOn(s.primary)
  if (c.photo) els.push(makeImage({ src: c.photo, x: 0, y: 0, w: 300, h: 340 }))
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

const skillBars: LayoutFn = (s, c) => {
  const els: CvElement[] = []
  const onSide = readableOn(s.secondary)
  const sideMuted = mix(onSide, s.secondary, 0.25)
  els.push(makeRect({ x: 290, y: 0, w: 504, h: 170, fill: mix(s.primary, '#ffffff', 0.86) }))
  els.push(makeRect({ x: 0, y: 0, w: 290, h: PAGE_HEIGHT, fill: s.secondary, name: 'Barre latérale' }))
  if (c.photo) els.push(makeImage({ src: c.photo, x: 60, y: 50, w: 170, h: 170, radius: 24 }))
  const side = createColumn(els, s, 36, c.photo ? 256 : 60, 218, { text: onSide, muted: sideMuted, accent: s.primary })
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
]

export function buildLayout(layoutKey: string, style: TemplateStyle, content: CvContent) {
  const layout = LAYOUTS.find((l) => l.key === layoutKey) ?? LAYOUTS[0]
  return layout.fn(style, content)
}
