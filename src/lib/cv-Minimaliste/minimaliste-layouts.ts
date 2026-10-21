import { makeCircle, makeImage, makeLine, makeRect, makeText, type TemplateStyle } from '../cv-shared/builder'
import type { CvContent, CvElement } from '../cv-shared/types'
import { PAGE_HEIGHT, PAGE_WIDTH } from '../cv-shared/types'

export const MINIMALIST_LAYOUTS = [
  { key: 'bleu-blanc-photo', label: 'Bleu et blanc' },
  { key: 'etudiant-centre', label: 'Étudiant centré' },
  { key: 'editorial-simple', label: 'Éditorial simple' },
  { key: 'beige-colonne', label: 'Beige en colonne' },
  { key: 'turquoise-arrondi', label: 'Turquoise arrondi' },
  { key: 'beige-arrondi', label: 'Beige arrondi' },
  { key: 'noir-blanc-classique', label: 'Noir et blanc' },
  { key: 'rouge-colonne', label: 'Rouge en colonne' },
  { key: 'gris-marron', label: 'Gris et marron' },
  { key: 'noir-blanc-editorial', label: 'Éditorial noir et blanc' },
  { key: 'etudiant-bleu', label: 'Étudiant bleu' },
] as const

type LayoutKey = (typeof MINIMALIST_LAYOUTS)[number]['key']

const text = (els: CvElement[], value: string, x: number, y: number, w: number, style: TemplateStyle, opts: Partial<Parameters<typeof makeText>[0]> = {}) => {
  const requestedSize = opts.fontSize ?? 10.5
  const el = makeText({
    text: value,
    x,
    y,
    w,
    ...opts,
    fontFamily: opts.fontFamily ?? style.body,
    fontSize: requestedSize < 18 ? Math.max(12.5, requestedSize) : requestedSize,
    color: opts.color ?? style.text,
    lineHeight: opts.lineHeight ?? 1.4,
  })
  els.push(el)
  return el.h
}

const shape = (els: CvElement[], x: number, y: number, w: number, h: number, fill: string, radius = 0) => {
  els.push(makeRect({ x, y, w, h, fill, radius }))
}

function heading(els: CvElement[], value: string, x: number, y: number, w: number, s: TemplateStyle, color = s.text) {
  const h = text(els, value, x, y, w, s, { fontFamily: s.heading, fontSize: 21, fontWeight: 600, color, lineHeight: 1.15 })
  els.push(makeLine({ x, y: y + h + 7, w: Math.min(w, 250), stroke: s.primary, strokeWidth: 1 }))
  return y + h + 18
}

function experiences(els: CvElement[], c: CvContent, s: TemplateStyle, x: number, y: number, w: number, compact = false) {
  let cy = y
  c.experiences.forEach((item) => {
    cy += text(els, item.role, x, cy, w, s, { fontSize: 15, fontWeight: 700 })
    cy += text(els, `${item.company}  ·  ${item.period}`, x, cy + 3, w, s, { fontSize: 14, color: s.primary, fontWeight: 600 }) + 5
    cy += text(els, item.description, x, cy, w, s, { fontSize: 14, color: s.muted, lineHeight: 1.45 }) + (compact ? 12 : 16)
  })
  return cy
}

function education(els: CvElement[], c: CvContent, s: TemplateStyle, x: number, y: number, w: number) {
  let cy = y
  c.education.forEach((item) => {
    cy += text(els, item.degree, x, cy, w, s, { fontSize: 14.5, fontWeight: 700 })
    cy += text(els, `${item.school}  ·  ${item.period}`, x, cy + 3, w, s, { fontSize: 13.5, color: s.muted }) + 10
  })
  return cy
}

function list(els: CvElement[], values: string[], s: TemplateStyle, x: number, y: number, w: number, color = s.text, centered = false) {
  let cy = y
  values.forEach((value) => {
    cy += text(els, centered ? value : `•  ${value}`, x, cy, w, s, { fontSize: 14, color, align: centered ? 'center' : 'left' }) + 7
  })
  return cy
}

function contact(els: CvElement[], c: CvContent, s: TemplateStyle, x: number, y: number, w: number, color = s.text) {
  return list(els, [c.phone, c.email, c.location, c.website].filter(Boolean), s, x, y, w, color)
}

function photo(els: CvElement[], c: CvContent, x: number, y: number, w: number, h: number, radius = 0) {
  if (c.photo) els.push(makeImage({ src: c.photo, x, y, w, h, radius, fit: 'cover' }))
}

function roundedEditorial(s: TemplateStyle, c: CvContent, variant: number): { background: string; elements: CvElement[] } {
  const els: CvElement[] = []
  const accent = variant % 2 ? s.primary : '#b99987'
  const paper = variant % 2 ? s.bg : '#f5efe6'
  shape(els, 28, 28, 738, 1067, paper, 54)
  shape(els, 28, 295, 246, 800, accent, 52)
  photo(els, c, 48, 48, 224, 250, 68)
  text(els, c.fullName, 310, 72, 420, s, { fontFamily: s.heading, fontSize: 39, lineHeight: 1.08 })
  text(els, c.title, 312, 166, 400, s, { fontSize: 16, color: s.primary, fontWeight: 600 })
  shape(els, 52, 326, 690, 176, '#f7f2eb', 42)
  const summaryHeight = text(els, c.summary, 78, 352, 270, s, { fontSize: 10.5, color: '#4a403a', lineHeight: 1.55 })
  contact(els, c, s, 390, 365, 310, '#443a34')
  let ly = heading(els, 'Compétences', 58, 545, 180, s, '#fffaf4')
  ly = list(els, c.skills.slice(0, 7), s, 60, ly, 180, '#fffaf4') + 18
  ly = heading(els, 'Langues', 58, ly, 180, s, '#fffaf4')
  list(els, c.languages, s, 60, ly, 180, '#fffaf4')
  let ry = heading(els, 'Expériences', 310, Math.max(536, 352 + summaryHeight + 18), 420, s)
  ry = experiences(els, c, s, 310, ry, 420, true)
  ry = heading(els, 'Formations', 310, Math.max(ry + 5, 925), 420, s)
  education(els, c, s, 310, ry, 420)
  return { background: s.bg, elements: els }
}

function monochromeColumn(s: TemplateStyle, c: CvContent, variant: number): { background: string; elements: CvElement[] } {
  const els: CvElement[] = []
  const side = variant % 2 ? '#e9e7e4' : '#efeeec'
  shape(els, 0, 0, 278, PAGE_HEIGHT, side)
  photo(els, c, 0, 0, 278, 300, 0)
  let y = 338
  y = heading(els, 'Coordonnées', 34, y, 210, s)
  y = contact(els, c, s, 36, y, 210) + 18
  y = heading(els, 'Compétences', 34, y, 210, s)
  y = list(els, c.skills, s, 36, y, 210) + 14
  y = heading(els, 'Centres d’intérêt', 34, y, 210, s)
  y = list(els, c.interests.slice(0, 3), s, 36, y, 210)
  y = heading(els, 'Langues', 34, y, 210, s)
  list(els, c.languages, s, 36, y, 210)
  text(els, c.fullName, 322, 54, 420, s, { fontFamily: s.heading, fontSize: 43, fontWeight: 700, lineHeight: 1.05 })
  text(els, c.title, 324, 112, 410, s, { fontSize: 17, color: s.primary })
  const summaryHeight = text(els, c.summary, 324, 158, 414, s, { fontSize: 11.5, color: s.muted, lineHeight: 1.55 })
  els.push(makeLine({ x: 322, y: 286, w: 420, stroke: '#222222', strokeWidth: 1.3 }))
  let ry = heading(els, 'Expérience professionnelle', 322, Math.max(310, 158 + summaryHeight + 20), 420, s)
  ry = experiences(els, c, s, 340, ry, 400)
  ry = heading(els, 'Formations', 322, ry + 8, 420, s)
  education(els, c, s, 340, ry, 400)
  return { background: '#ffffff', elements: els }
}

function cleanTwoColumn(s: TemplateStyle, c: CvContent, variant: number): { background: string; elements: CvElement[] } {
  const els: CvElement[] = []
  const tint = variant % 2 ? '#f1efeb' : '#f2eee8'
  shape(els, 0, 0, PAGE_WIDTH, 250, tint)
  text(els, c.fullName, 58, 46, 680, s, { fontFamily: s.heading, fontSize: 42, fontWeight: 600 })
  text(els, c.title, 60, 105, 650, s, { fontSize: 16, color: s.primary })
  text(els, [c.email, c.phone, c.location].join('     ·     '), 60, 148, 670, s, { fontSize: 9.5, color: s.muted })
  text(els, c.summary, 60, 180, 665, s, { fontSize: 10.5, color: s.text, lineHeight: 1.4 })
  let ly = heading(els, 'Compétences', 58, 292, 245, s)
  ly = list(els, c.skills, s, 58, ly, 245) + 20
  ly = heading(els, 'Langues', 58, ly, 245, s)
  list(els, c.languages, s, 58, ly, 245)
  let ry = heading(els, 'Expériences', 345, 292, 390, s)
  ry = experiences(els, c, s, 345, ry, 390, true)
  ry = heading(els, 'Formations', 345, ry + 10, 390, s)
  education(els, c, s, 345, ry, 390)
  return { background: s.bg, elements: els }
}

function centeredMinimal(s: TemplateStyle, c: CvContent, variant: number): { background: string; elements: CvElement[] } {
  const els: CvElement[] = []
  const centerX = PAGE_WIDTH / 2
  if (variant % 2 === 0) shape(els, 44, 44, 706, 1035, '#fbf9f5', 28)
  text(els, c.fullName, 92, 62, 610, s, { fontFamily: s.heading, fontSize: 36, align: 'center', letterSpacing: 1 })
  text(els, c.title, 120, 116, 554, s, { fontSize: 12, align: 'center', letterSpacing: 2, color: s.primary, uppercase: true })
  els.push(makeLine({ x: centerX - 28, y: 150, w: 56, stroke: s.primary, strokeWidth: 2 }))
  text(els, [c.email, c.phone, c.location].join('   ·   '), 100, 172, 594, s, { fontSize: 9.5, align: 'center', color: s.muted })
  let y = heading(els, 'Profil', 130, 228, 534, s)
  y += text(els, c.summary, 130, y, 534, s, { fontSize: 10.5, align: 'center', color: s.muted, lineHeight: 1.5 }) + 28
  y = heading(els, 'Expériences', 130, y, 534, s)
  y = experiences(els, c, s, 130, y, 534, true) + 8
  y = heading(els, 'Formations', 130, y, 534, s)
  y = education(els, c, s, 130, y, 534)
  y = heading(els, 'Compétences', 130, y + 10, 534, s)
  list(els, c.skills, s, 130, y, 534, s.text, true)
  return { background: s.bg, elements: els }
}

function portraitSplit(s: TemplateStyle, c: CvContent, variant: number): { background: string; elements: CvElement[] } {
  const els: CvElement[] = []
  const leftWidth = variant % 2 ? 312 : 286
  const tint = variant % 2 ? '#eee8df' : '#e9e7e4'
  shape(els, 0, 0, leftWidth, PAGE_HEIGHT, tint)
  photo(els, c, 26, 34, leftWidth - 52, 300, 18)
  text(els, c.fullName, leftWidth + 42, 54, PAGE_WIDTH - leftWidth - 80, s, { fontFamily: s.heading, fontSize: 38, fontWeight: 600 })
  text(els, c.title, leftWidth + 44, 110, PAGE_WIDTH - leftWidth - 84, s, { fontSize: 15, color: s.primary })
  let ly = heading(els, 'Contact', 34, 366, leftWidth - 68, s)
  ly = contact(els, c, s, 36, ly, leftWidth - 72) + 20
  ly = heading(els, 'Compétences', 34, ly, leftWidth - 68, s)
  ly = list(els, c.skills, s, 36, ly, leftWidth - 72) + 18
  ly = heading(els, 'Langues', 34, ly, leftWidth - 68, s)
  list(els, c.languages, s, 36, ly, leftWidth - 72)
  let ry = heading(els, 'Profil', leftWidth + 42, 166, PAGE_WIDTH - leftWidth - 84, s)
  ry += text(els, c.summary, leftWidth + 42, ry, PAGE_WIDTH - leftWidth - 84, s, { fontSize: 10, color: s.muted, lineHeight: 1.45 }) + 25
  ry = heading(els, 'Expériences', leftWidth + 42, ry, PAGE_WIDTH - leftWidth - 84, s)
  ry = experiences(els, c, s, leftWidth + 42, ry, PAGE_WIDTH - leftWidth - 84, true) + 10
  ry = heading(els, 'Formations', leftWidth + 42, ry, PAGE_WIDTH - leftWidth - 84, s)
  education(els, c, s, leftWidth + 42, ry, PAGE_WIDTH - leftWidth - 84)
  return { background: s.bg, elements: els }
}

function blueWhite(s: TemplateStyle, c: CvContent) {
  const els: CvElement[] = []
  const blue = '#e8f1fb'
  shape(els, 0, 0, 290, PAGE_HEIGHT, blue)
  photo(els, c, 0, 0, 290, 275)
  text(els, 'COORDONNÉES', 24, 298, 250, s, { fontSize: 11, fontWeight: 700, letterSpacing: 1.2 })
  let y = contact(els, c, s, 25, 326, 245)
  y = heading(els, 'Qualités', 25, Math.max(432, y + 18), 245, s)
  y = list(els, c.interests.slice(0, 4), s, 25, y, 245) + 10
  y = heading(els, 'Compétences', 25, y, 245, s)
  list(els, c.skills.slice(0, 6), s, 25, y, 245)
  text(els, c.fullName, 330, 42, 430, s, { fontSize: 34, fontWeight: 800 })
  let ry = heading(els, 'À propos', 330, 104, 410, s)
  ry += text(els, c.summary, 330, ry, 410, s, { fontSize: 10, color: s.muted }) + 24
  ry = heading(els, 'Formation', 330, ry, 410, s)
  ry = education(els, c, s, 330, ry, 410) + 18
  ry = heading(els, 'Expériences professionnelles', 330, ry, 410, s)
  experiences(els, c, s, 330, ry, 410, true)
  shape(els, 650, 780, 240, 240, blue, 120)
  return { background: '#ffffff', elements: els }
}

function studentCentered(s: TemplateStyle, c: CvContent) {
  const els: CvElement[] = []
  photo(els, c, 46, 38, 160, 160, 999)
  text(els, c.fullName.toUpperCase(), 230, 64, 500, s, { fontSize: 28, fontWeight: 800, letterSpacing: 1.2 })
  text(els, c.title.toUpperCase(), 232, 122, 470, s, { fontSize: 10, color: s.muted, letterSpacing: 1.2 })
  text(els, c.summary, 232, 151, 490, s, { fontSize: 9, color: s.muted })
  shape(els, 52, 214, 690, 54, '#22252b', 18)
  text(els, [c.phone, c.email, c.location].join('     •     '), 76, 233, 645, s, { fontSize: 9, color: '#ffffff', align: 'center' })
  let ly = heading(els, 'Langues', 58, 318, 280, s)
  ly = list(els, c.languages, s, 58, ly, 280) + 10
  ly = heading(els, 'Formation', 58, ly, 280, s)
  ly = education(els, c, s, 58, ly, 280) + 10
  ly = heading(els, 'Compétences', 58, ly, 280, s)
  ly = list(els, c.skills, s, 58, ly, 280) + 10
  ly = heading(els, 'Centres d’intérêt', 58, ly, 280, s)
  list(els, c.interests, s, 58, ly, 280)
  let ry = heading(els, 'Expérience', 390, 318, 340, s)
  ry = experiences(els, c, s, 390, ry, 340, true) + 14
  ry = heading(els, 'Projets', 390, ry, 340, s)
  list(els, c.interests.slice(0, 3), s, 390, ry, 340)
  return { background: '#ffffff', elements: els }
}

function editorialSimple(s: TemplateStyle, c: CvContent) {
  const els: CvElement[] = []
  text(els, c.email, 52, 44, 400, s, { fontSize: 9, color: s.muted })
  text(els, c.fullName, 52, 74, 650, s, { fontSize: 30, fontWeight: 700 })
  text(els, c.title.toUpperCase(), 54, 118, 500, s, { fontSize: 10, color: s.primary, letterSpacing: 1.4 })
  text(els, c.summary, 54, 176, 682, s, { fontSize: 10, color: s.muted, lineHeight: 1.55 })
  let y = heading(els, 'EXPÉRIENCES PROFESSIONNELLES', 54, 284, 682, s)
  y = experiences(els, c, s, 54, y, 682, true) + 12
  y = heading(els, 'FORMATIONS', 54, y, 682, s)
  y = education(els, c, s, 54, y, 682) + 16
  shape(els, 54, y, 682, 1, '#d4d1cd')
  let ly = heading(els, 'COMPÉTENCES', 54, y + 20, 310, s)
  ly = list(els, c.skills.slice(0, 4), s, 54, ly, 310)
  let ry = heading(els, 'LANGUES', 390, y + 20, 310, s)
  list(els, c.languages, s, 390, ry, 310)
  return { background: '#ffffff', elements: els }
}

function beigeColumn(s: TemplateStyle, c: CvContent) {
  const els: CvElement[] = []
  shape(els, 0, 0, 284, PAGE_HEIGHT, '#e6d6c4')
  photo(els, c, 0, 0, 284, 290)
  text(els, c.fullName, 326, 42, 400, s, { fontSize: 37, fontWeight: 700 })
  text(els, c.title, 328, 96, 390, s, { fontSize: 19, color: '#8b6250' })
  let y = heading(els, 'Profil', 328, 166, 400, s)
  y += text(els, c.summary, 328, y, 400, s, { fontSize: 10, color: s.muted }) + 28
  y = heading(els, 'Formation', 328, y, 400, s)
  y = education(els, c, s, 328, y, 400) + 22
  y = heading(els, 'Expérience professionnelle', 328, y, 400, s)
  experiences(els, c, s, 328, y, 400, true)
  let ly = heading(els, 'Coordonnées', 28, 324, 230, s)
  ly = contact(els, c, s, 30, ly, 225) + 20
  ly = heading(els, 'Compétences', 28, ly, 230, s)
  ly = list(els, c.skills, s, 30, ly, 225) + 16
  ly = heading(els, 'Langues', 28, ly, 230, s)
  list(els, c.languages, s, 30, ly, 225)
  return { background: '#fffdfa', elements: els }
}

function turquoiseRounded(s: TemplateStyle, c: CvContent) {
  const els: CvElement[] = []
  shape(els, 34, 34, 726, 1050, '#37d0d2', 42)
  shape(els, 34, 34, 255, 1050, '#24aeb4', 42)
  photo(els, c, 54, 52, 210, 235, 72)
  text(els, c.fullName, 315, 72, 410, s, { fontFamily: s.heading, fontSize: 44, lineHeight: 1 })
  text(els, c.title, 320, 166, 400, s, { fontSize: 15 })
  text(els, c.summary, 56, 330, 210, s, { fontSize: 10, color: '#173b3b' })
  contact(els, c, s, 330, 325, 385)
  let ly = heading(els, 'Compétences', 58, 626, 190, s, '#ffffff')
  ly = list(els, c.skills.slice(0, 5), s, 60, ly, 190, '#ffffff') + 16
  ly = heading(els, 'Langues', 58, ly, 190, s, '#ffffff')
  list(els, c.languages, s, 60, ly, 190, '#ffffff')
  let ry = heading(els, 'Expériences', 320, 518, 395, s)
  ry = experiences(els, c, s, 320, ry, 395, true) + 8
  ry = heading(els, 'Formations', 320, ry, 395, s)
  education(els, c, s, 320, ry, 395)
  return { background: '#ffffff', elements: els }
}

function redColumn(s: TemplateStyle, c: CvContent) {
  const els: CvElement[] = []
  shape(els, 0, 0, 276, PAGE_HEIGHT, '#8f343c')
  photo(els, c, 35, 36, 206, 206, 999)
  text(els, c.fullName.toUpperCase(), 32, 258, 212, s, { fontSize: 23, fontWeight: 700, align: 'center', color: '#ffffff' })
  text(els, c.title.toUpperCase(), 32, 298, 212, s, { fontSize: 9, align: 'center', color: '#f2d9d9' })
  let ly = heading(els, 'Coordonnées', 34, 354, 205, s, '#ffffff')
  ly = contact(els, c, s, 36, ly, 202, '#fff4f4') + 12
  ly = heading(els, 'Compétences', 34, ly, 205, s, '#ffffff')
  ly = list(els, c.skills, s, 36, ly, 202, '#fff4f4') + 12
  ly = heading(els, 'Langues', 34, ly, 205, s, '#ffffff')
  list(els, c.languages, s, 36, ly, 202, '#fff4f4')
  let ry = heading(els, 'Profil', 316, 54, 424, s)
  ry += text(els, c.summary, 316, ry, 424, s, { fontSize: 10, color: s.muted }) + 28
  ry = heading(els, 'Expérience', 316, ry, 424, s)
  ry = experiences(els, c, s, 316, ry, 424, true) + 14
  ry = heading(els, 'Formation', 316, ry, 424, s)
  education(els, c, s, 316, ry, 424)
  return { background: '#ffffff', elements: els }
}

function grayBrown(s: TemplateStyle, c: CvContent) {
  const els: CvElement[] = []
  shape(els, 0, 0, PAGE_WIDTH, 265, '#f0eeeb')
  photo(els, c, 44, 40, 160, 192, 70)
  text(els, c.fullName, 228, 65, 445, s, { fontSize: 38, fontWeight: 700 })
  text(els, c.title, 230, 128, 420, s, { fontSize: 16, color: '#8a6958' })
  text(els, [c.phone, c.email, c.location].join('   ·   '), 230, 166, 470, s, { fontSize: 9, color: s.muted })
  let ly = heading(els, 'À propos', 52, 302, 300, s)
  ly += text(els, c.summary, 52, ly, 300, s, { fontSize: 9.5, color: s.muted }) + 22
  ly = heading(els, 'Formation', 52, ly, 300, s)
  ly = education(els, c, s, 52, ly, 300) + 16
  ly = heading(els, 'Compétences', 52, ly, 300, s)
  list(els, c.skills, s, 52, ly, 300)
  let ry = heading(els, 'Expériences professionnelles', 390, 302, 350, s)
  ry = experiences(els, c, s, 390, ry, 350, true) + 12
  ry = heading(els, 'Langues', 390, ry, 350, s)
  list(els, c.languages, s, 390, ry, 350)
  return { background: '#ffffff', elements: els }
}

function cleanProfessional(s: TemplateStyle, c: CvContent) {
  const els: CvElement[] = []
  photo(els, c, 0, 0, 270, 250)
  shape(els, 286, 28, 458, 212, '#f0efed', 26)
  text(els, c.fullName.toUpperCase(), 324, 68, 390, s, { fontSize: 26, fontWeight: 700, letterSpacing: 2 })
  text(els, 'CONTACT', 326, 124, 340, s, { fontSize: 9, fontWeight: 700, letterSpacing: 1.5 })
  contact(els, c, s, 326, 148, 380)
  let ly = heading(els, 'À propos', 42, 292, 256, s)
  ly += text(els, c.summary, 42, ly, 256, s, { fontSize: 9, color: s.muted }) + 18
  ly = heading(els, 'Formation', 42, ly, 256, s)
  ly = education(els, c, s, 42, ly, 256) + 12
  ly = heading(els, 'Compétences', 42, ly, 256, s)
  list(els, c.skills, s, 42, ly, 256)
  let ry = heading(els, 'Expériences professionnelles', 342, 292, 398, s)
  ry = experiences(els, c, s, 342, ry, 398, true) + 20
  ry = heading(els, 'Langues', 342, ry, 398, s)
  list(els, c.languages, s, 342, ry, 398)
  return { background: '#ffffff', elements: els }
}

function studentBlue(s: TemplateStyle, c: CvContent) {
  const els: CvElement[] = []
  shape(els, 0, 0, 272, PAGE_HEIGHT, '#e7f0fa')
  photo(els, c, 35, 40, 202, 202, 999)
  text(els, c.fullName, 16, 265, 240, s, { fontSize: 22, fontWeight: 800, align: 'center' })
  text(els, c.title.toUpperCase(), 16, 304, 240, s, { fontSize: 9, color: s.primary, align: 'center', letterSpacing: 1 })
  let ly = heading(els, 'Contact', 34, 365, 204, s)
  ly = contact(els, c, s, 36, ly, 200) + 12
  ly = heading(els, 'Compétences', 34, ly, 204, s)
  ly = list(els, c.skills, s, 36, ly, 200) + 10
  ly = heading(els, 'Langues', 34, ly, 204, s)
  list(els, c.languages, s, 36, ly, 200)
  let ry = heading(els, 'Profil', 310, 54, 430, s)
  ry += text(els, c.summary, 310, ry, 430, s, { fontSize: 10, color: s.muted }) + 20
  ry = heading(els, 'Expérience professionnelle', 310, ry, 430, s)
  ry = experiences(els, c, s, 310, ry, 430, true) + 12
  ry = heading(els, 'Formation', 310, ry, 430, s)
  education(els, c, s, 310, ry, 430)
  return { background: '#ffffff', elements: els }
}

/** Variante rose à deux colonnes inspirée de la référence fournie. */
function roseOrganique(s: TemplateStyle, c: CvContent) {
  const els: CvElement[] = []
  const blush = '#efd6da'
  const rose = '#cb9198'
  const coral = '#d66d76'
  const ink = '#765653'
  const muted = '#766d69'

  // Colonne gauche et formes rondes qui donnent le mouvement de la référence.
  els.push(makeRect({
    x: 0, y: 0, w: 410, h: PAGE_HEIGHT, fill: blush, shape: 'wave',
    customPath: 'M 0 0 C 360 0 520 40 1000 0 L 1000 270 C 850 350 790 430 720 505 C 620 615 690 690 620 790 C 540 900 760 1000 1000 1000 L 0 1000 Z',
  }))
  els.push(makeRect({
    x: 354, y: -82, w: 440, h: 460, fill: rose, shape: 'wave',
    customPath: 'M 720 0 C 470 0 350 80 280 190 C 200 315 300 470 470 560 C 650 655 860 600 1000 510 L 1000 0 Z',
  }))

  if (c.photo) {
    els.push(makeCircle({ x: 36, y: 69, w: 288, h: 288, fill: '#f7f6f2', stroke: '#ffffff', strokeWidth: 3, name: 'Cadre du portrait' }))
    els.push(makeImage({ src: c.photo, x: 45, y: 78, w: 270, h: 270, radius: 999, fit: 'cover', stroke: '#ffffff', strokeWidth: 4 }))
  }
  text(els, c.fullName.replace(/\s+/, '\n'), 445, 122, 300, s, {
    fontFamily: s.heading, fontSize: 35, fontWeight: 400, color: '#fffaf8', align: 'center', lineHeight: 1.05,
  })
  text(els, c.title, 420, 224, 340, s, {
    fontFamily: s.heading, fontSize: 19, color: '#fff4f1', align: 'center', lineHeight: 1.15,
  })
  text(els, c.title.toLocaleUpperCase('fr-FR'), 440, 254, 300, s, {
    fontSize: 11, fontWeight: 700, color: '#e4b6aa', align: 'center', letterSpacing: 2.2,
  })

  const section = (label: string, x: number, y: number, w: number, size = 21) => {
    text(els, label, x, y, w, s, { fontFamily: s.heading, fontSize: size, color: coral, lineHeight: 1.12 })
    return y + size * 1.45
  }
  const paragraph = (value: string, x: number, y: number, w: number, size = 12, color = muted, lineHeight = 1.45) =>
    text(els, value, x, y, w, s, { fontSize: size, color, lineHeight })

  let ly = section('Profil', 44, 372, 270, 23)
  const summaryHeight = paragraph(c.summary, 44, ly, 270, 12, ink, 1.55)
  ly = section('Compétences clés', 44, Math.max(566, ly + summaryHeight + 22), 280, 21)
  c.skills.slice(0, 7).forEach((skill) => {
    const height = paragraph(`${c.skills.indexOf(skill) + 1}. ${skill}`, 54, ly, 255, 11.5, muted, 1.35)
    ly += Math.max(24, height + 5)
  })
  ly = section('Coordonnées', 44, Math.max(798, ly + 20), 270, 25)
  ;[c.phone, c.location, c.email, c.website].filter(Boolean).forEach((value) => {
    const height = paragraph(value, 46, ly, 265, 11.5, ink, 1.3)
    ly += Math.max(25, height + 5)
  })

  const rx = 397
  const rw = 355
  let ry = section('Expériences professionnelles', rx, 388, rw, 21)
  c.experiences.slice(0, 3).forEach((item) => {
    text(els, item.role, rx, ry, rw, s, { fontSize: 12.5, fontWeight: 700, color: '#554c47', lineHeight: 1.3 })
    ry += 21
    text(els, `${item.company}  ·  ${item.period}`, rx, ry, rw, s, { fontSize: 11.5, color: muted, lineHeight: 1.3 })
    ry += 20
    paragraph(item.description, rx, ry, rw, 11.5, muted, 1.42)
    ry += Math.max(48, Math.ceil(item.description.length / 50) * 16) + 12
  })

  ry = section('Formations', rx, ry + 4, rw, 21)
  c.education.slice(0, 3).forEach((item) => {
    text(els, item.degree, rx, ry, rw, s, { fontSize: 12, fontWeight: 700, color: '#554c47', lineHeight: 1.3 })
    ry += 19
    text(els, `${item.school}  ·  ${item.period}`, rx, ry, rw, s, { fontSize: 11, color: muted, lineHeight: 1.3 })
    ry += 28
  })
  ry = section('Langues', rx, ry + 3, rw, 20)
  c.languages.slice(0, 3).forEach((language, index) => paragraph(language, rx, ry + index * 19, rw, 11.5))
  ry += c.languages.slice(0, 3).length * 19 + 12
  ry = section('Centres d’intérêt', rx, ry, rw, 20)
  paragraph(c.interests.slice(0, 4).join(' · '), rx, ry, rw, 11.5, muted, 1.45)

  return { background: '#ffffff', elements: els }
}

export function buildMinimalisteLayout(key: LayoutKey, style: TemplateStyle, content: CvContent) {
  const variant = MINIMALIST_LAYOUTS.findIndex((layout) => layout.key === key)
  switch (variant) {
    case 0: return blueWhite(style, content)
    case 1: return studentCentered(style, content)
    case 2: return editorialSimple(style, content)
    case 3: return beigeColumn(style, content)
    case 4: return turquoiseRounded(style, content)
    case 5: return roundedEditorial(style, content, variant)
    case 6: return monochromeColumn(style, content, variant)
    case 7: return redColumn(style, content)
    case 8: return grayBrown(style, content)
    case 9: return cleanProfessional(style, content)
    case 10: return roseOrganique(style, content)
    default: return cleanTwoColumn(style, content, variant)
  }
}
