import { buildLayout, LAYOUTS } from '../cv-shared/builder'
import { makeImage, makeRect, makeText } from '../cv-shared/builder'
import type { TemplateStyle } from '../cv-shared/builder'
import type { CvContent, CvElement, TextElement } from '../cv-shared/types'
import { PAGE_HEIGHT, PAGE_WIDTH } from '../cv-shared/types'

export const CV_ETUDIANT_LAYOUTS = LAYOUTS

function blueWhiteYoussouf(content: CvContent, style: TemplateStyle) {
  const elements: CvElement[] = []
  const blue = '#dfe8fa'
  const lavender = '#eff0ff'
  const ink = '#414052'
  const muted = '#5a5969'
  const coral = '#424154'
  const leftWidth = 290
  const rightX = 335
  const rightWidth = PAGE_WIDTH - rightX - 35
  const text = (value: string, x: number, y: number, w: number, size = 11.5, options: Partial<TextElement> = {}) => {
    const element = makeText({
      text: value,
      x,
      y,
      w,
      fontFamily: style.body,
      fontSize: size,
      color: muted,
      lineHeight: 1.4,
      ...options,
    })
    elements.push(element)
    return element.h
  }
  const heading = (value: string, x: number, y: number, w: number, size = 16) => {
    text(value.toLocaleUpperCase('fr-FR'), x, y, w, size, { fontFamily: 'var(--font-jakarta)', fontWeight: 800, color: coral, lineHeight: 1.15 })
    return y + size * 1.65
  }
  const pill = (value: string, y: number, size = 12.5) => {
    const width = Math.min(rightWidth, Math.max(110, value.length * size * 0.55 + 12))
    const label = makeText({
      text: value, x: rightX + 4, y: y + 3, w: width - 8,
      fontFamily: style.body, fontSize: size, fontWeight: 700, color: '#ffffff', lineHeight: 1.3,
    })
    elements.push(makeRect({ x: rightX, y, w: width, h: label.h + 6, fill: ink, radius: 4 }))
    elements.push(label)
    return label.h + 12
  }

  elements.push(makeRect({ x: 0, y: 0, w: leftWidth, h: PAGE_HEIGHT, fill: '#ffffff', name: 'Colonne gauche blanche' }))
  elements.push(makeRect({ x: leftWidth, y: 0, w: PAGE_WIDTH - leftWidth, h: 316, fill: blue, name: 'En-tête bleu clair' }))
  elements.push(makeRect({ x: leftWidth, y: 316, w: PAGE_WIDTH - leftWidth, h: PAGE_HEIGHT - 316, fill: lavender, name: 'Colonne principale lavande' }))
  elements.push(makeRect({
    x: 522, y: 704, w: 272, h: 419, fill: '#ffffff', shape: 'wave', name: 'Vague décorative blanche',
    customPath: 'M 1000 0 C 760 0 610 84 520 230 C 420 396 560 500 505 650 C 448 802 186 830 0 1000 L 1000 1000 Z',
  }))
  if (content.photo) elements.push(makeImage({ src: content.photo, x: 0, y: 0, w: leftWidth, h: 316, fit: 'cover' }))

  text(content.fullName, rightX, 48, rightWidth, 35, { fontFamily: 'var(--font-jakarta)', fontWeight: 800, color: ink, lineHeight: 1.05 })
  heading('À propos', rightX, 143, rightWidth, 17)
  text(content.summary, rightX, 184, rightWidth, 12, { italic: true, color: muted, lineHeight: 1.5 })

  let leftY = heading('Coordonnées', 36, 351, 232, 16)
  ;[content.phone, content.location, content.email, content.website].filter(Boolean).forEach((value) => {
    const h = text(value, 40, leftY, 226, 11.5, { color: ink })
    leftY += Math.max(23, h + 5)
  })
  leftY += 14
  leftY = heading('Centres d’intérêt', 36, leftY, 232, 16)
  content.interests.slice(0, 5).forEach((value) => {
    const h = text(`•  ${value}`, 40, leftY, 226, 11.5)
    leftY += Math.max(21, h + 3)
  })
  leftY += 13
  leftY = heading('Compétences', 36, leftY, 232, 16)
  content.skills.slice(0, 7).forEach((value) => {
    const h = text(`•  ${value}`, 40, leftY, 226, 11.5)
    leftY += Math.max(21, h + 3)
  })
  leftY += 12
  leftY = heading('Langues', 36, leftY, 232, 16)
  content.languages.slice(0, 4).forEach((value) => {
    const h = text(`•  ${value}`, 40, leftY, 226, 11.5)
    leftY += Math.max(21, h + 3)
  })

  let rightY = heading('Formation', rightX, 352, rightWidth, 19)
  content.education.slice(0, 3).forEach((item) => {
    text(item.period, rightX, rightY, rightWidth, 11.5, { color: muted })
    rightY += 23
    rightY += pill(item.degree, rightY, 12.5)
    text(item.school, rightX, rightY, rightWidth, 11.5, { italic: true, color: muted })
    rightY += 35
  })

  rightY = heading('Expériences professionnelles', rightX, rightY + 9, rightWidth, 19)
  content.experiences.slice(0, 3).forEach((item) => {
    text(item.period, rightX, rightY, rightWidth, 11.5, { color: muted })
    rightY += 23
    rightY += pill(item.role, rightY, 12.5)
    text(item.company, rightX, rightY, rightWidth, 11.5, { italic: true, color: muted })
    rightY += 22
    const descriptionHeight = text(item.description, rightX, rightY, rightWidth, 11.5, { color: ink, lineHeight: 1.45 })
    rightY += descriptionHeight + 25
  })

  return { background: '#ffffff', elements }
}

function sageOrganicPrisca(content: CvContent, style: TemplateStyle) {
  const elements: CvElement[] = []
  const mint = '#bfded5'
  const paper = '#f7f6f2'
  const ink = '#272729'
  const muted = '#414143'
  const leftX = 36
  const leftWidth = 280
  const rightX = 365
  const rightWidth = PAGE_WIDTH - rightX - 32
  const text = (value: string, x: number, y: number, w: number, size = 11.5, options: Partial<TextElement> = {}) => {
    const element = makeText({
      text: value,
      x,
      y,
      w,
      fontFamily: style.body,
      fontSize: size,
      color: muted,
      lineHeight: 1.4,
      ...options,
    })
    elements.push(element)
    return element.h
  }
  const heading = (value: string, x: number, y: number, w: number, size = 19) => {
    text(value, x, y, w, size, { fontFamily: 'var(--font-dmserif)', fontWeight: 700, color: ink, lineHeight: 1.12 })
    return y + size * 1.55
  }

  elements.push(makeRect({ x: 0, y: 0, w: PAGE_WIDTH, h: PAGE_HEIGHT, fill: paper, name: 'Fond ivoire' }))
  elements.push(makeRect({
    x: 0, y: 0, w: 390, h: PAGE_HEIGHT, fill: mint, shape: 'wave', name: 'Grand bloc vert organique',
    customPath: 'M 0 0 L 700 0 C 835 110 1000 270 990 445 C 980 600 800 702 755 835 C 710 960 850 1050 905 1000 L 0 1000 Z',
  }))
  if (content.photo) elements.push(makeImage({ src: content.photo, x: 39, y: 58, w: 292, h: 292, radius: 9999, fit: 'cover' }))

  text(content.fullName, rightX, 61, rightWidth, 48, {
    fontFamily: 'var(--font-dmserif)', fontWeight: 700, color: ink, lineHeight: 1.05,
  })
  text(content.title.toLocaleUpperCase('fr-FR'), rightX + 5, 125, rightWidth - 5, 14, {
    fontFamily: 'var(--font-jakarta)', fontWeight: 500, letterSpacing: 2.5, color: ink,
  })
  let rightY = heading('Présentation', rightX, 204, rightWidth, 23)
  rightY += text(content.summary, rightX, rightY, rightWidth, 12.5, { color: ink, lineHeight: 1.52 }) + 32
  rightY = heading('Expériences', rightX, rightY, rightWidth, 23)
  content.experiences.slice(0, 3).forEach((item) => {
    text(item.role.toLocaleUpperCase('fr-FR'), rightX, rightY, rightWidth, 12, {
      fontFamily: 'var(--font-jakarta)', fontWeight: 600, letterSpacing: 0.5, color: ink,
    })
    rightY += 22
    text(item.company, rightX, rightY, rightWidth, 12, { color: muted })
    rightY += 20
    text(item.period, rightX, rightY, rightWidth, 11.5, { color: muted })
    rightY += 23
    const descriptionHeight = text(item.description, rightX, rightY, rightWidth, 11.5, { color: muted, lineHeight: 1.45 })
    rightY += descriptionHeight + 24
  })
  rightY = heading('Formations', rightX, rightY + 10, rightWidth, 23)
  content.education.slice(0, 3).forEach((item) => {
    text(item.degree.toLocaleUpperCase('fr-FR'), rightX, rightY, rightWidth, 12, {
      fontFamily: 'var(--font-jakarta)', fontWeight: 600, color: ink,
    })
    rightY += 23
    text(item.school, rightX, rightY, rightWidth, 11.5, { color: muted })
    rightY += 18
    text(item.period, rightX, rightY, rightWidth, 11.5, { color: muted })
    rightY += 31
  })

  let leftY = heading('Coordonnées', leftX, 386, leftWidth, 20)
  ;[content.phone, content.email, content.location, content.website].filter(Boolean).forEach((value) => {
    const h = text(value, leftX + 5, leftY, leftWidth - 5, 11.5, { color: ink })
    leftY += Math.max(23, h + 5)
  })
  leftY += 17
  leftY = heading('Compétences', leftX, leftY, leftWidth, 21)
  content.skills.slice(0, 7).forEach((value) => {
    const h = text(`•  ${value}`, leftX + 3, leftY, leftWidth - 5, 11.5, { color: ink })
    leftY += Math.max(22, h + 3)
  })
  leftY += 15
  leftY = heading('Loisirs', leftX, leftY, leftWidth, 21)
  content.interests.slice(0, 6).forEach((value) => {
    const h = text(`•  ${value}`, leftX + 3, leftY, leftWidth - 5, 11.5, { color: ink })
    leftY += Math.max(22, h + 3)
  })
  leftY += 12
  leftY = heading('Langues', leftX, leftY, leftWidth, 21)
  content.languages.slice(0, 5).forEach((value) => {
    const h = text(value, leftX, leftY, leftWidth, 11.5, { color: ink })
    leftY += Math.max(22, h + 3)
  })

  return { background: paper, elements }
}

function grayGridStudent(content: CvContent, style: TemplateStyle) {
  const elements: CvElement[] = []
  const ink = '#5f6266'
  const muted = '#74777b'
  const line = '#e1e2e3'
  const header = '#f7f7f7'
  const leftX = 66
  const leftWidth = 390
  const rightX = 536
  const rightWidth = 220
  const dividerX = 497
  const text = (value: string, x: number, y: number, w: number, size = 11.5, options: Partial<TextElement> = {}) => {
    const element = makeText({
      text: value,
      x,
      y,
      w,
      fontFamily: style.body,
      fontSize: size,
      color: muted,
      lineHeight: 1.42,
      ...options,
    })
    elements.push(element)
    return element.h
  }
  const rule = (x: number, y: number, w: number) => {
    elements.push(makeRect({ x, y, w, h: 2, fill: line, name: 'Séparateur' }))
  }
  const heading = (value: string, x: number, y: number, w: number) => {
    text(value.toLocaleUpperCase('fr-FR'), x, y, w, 16, {
      fontFamily: 'var(--font-jakarta)', fontWeight: 800, color: ink, letterSpacing: 3.4, lineHeight: 1.2,
    })
    if (x === rightX) rule(dividerX, y + 35, PAGE_WIDTH - dividerX)
    else rule(0, y + 35, dividerX)
    return y + 55
  }

  elements.push(makeRect({ x: 0, y: 0, w: PAGE_WIDTH, h: 270, fill: header, name: 'Bandeau gris clair' }))
  elements.push(makeRect({ x: dividerX, y: 0, w: 2, h: PAGE_HEIGHT, fill: line, name: 'Séparation verticale' }))
  text(content.fullName.toLocaleUpperCase('fr-FR').replace(' ', '\n'), leftX, 55, leftWidth, 36, {
    fontFamily: 'var(--font-jakarta)', fontWeight: 400, color: ink, letterSpacing: 3.4, lineHeight: 1.22,
  })
  text(content.title.toLocaleUpperCase('fr-FR'), leftX, 160, leftWidth, 12.5, {
    fontFamily: 'var(--font-jakarta)', fontWeight: 500, color: ink, letterSpacing: 3,
  })
  ;[content.phone, content.email, content.location, content.website].filter(Boolean).forEach((value, index) => {
    text(value, rightX, 68 + index * 31, rightWidth, 11.5, { color: muted })
  })

  let leftY = heading('Profil', leftX, 292, leftWidth)
  leftY += text(content.summary, leftX, leftY, leftWidth, 11.5, { color: muted, lineHeight: 1.5 }) + 18
  leftY = heading('Expérience professionnelle', leftX, Math.max(475, leftY), leftWidth)
  content.experiences.slice(0, 3).forEach((item) => {
    text(item.period, leftX + 22, leftY, leftWidth - 22, 11.5, { fontWeight: 700, color: ink })
    elements.push(makeRect({ x: leftX + 1, y: leftY + 3, w: 7, h: 7, fill: ink }))
    elements.push(makeRect({ x: leftX + 4, y: leftY + 12, w: 1.5, h: 140, fill: line }))
    leftY += 21
    text(item.company, leftX + 22, leftY, leftWidth - 22, 11.5, { color: muted })
    leftY += 21
    text(item.role, leftX + 22, leftY, leftWidth - 22, 12.5, { fontWeight: 700, color: ink })
    leftY += 27
    const descriptionHeight = text(`•  ${item.description}`, leftX + 22, leftY, leftWidth - 22, 11.5, { color: muted, lineHeight: 1.48 })
    leftY += descriptionHeight + 35
  })
  leftY = heading('Centres d’intérêt', leftX, Math.max(925, leftY), leftWidth)
  text(content.interests.map((interest) => `•  ${interest}`).join('\n'), leftX + 22, leftY, leftWidth - 22, 11.5, { color: muted, lineHeight: 1.6 })

  let rightY = heading('Formation', rightX, 292, rightWidth)
  content.education.slice(0, 3).forEach((item) => {
    text(item.period, rightX, rightY, rightWidth, 11.5, { fontWeight: 700, color: ink, letterSpacing: 1.2 })
    rightY += 22
    text(item.school.toLocaleUpperCase('fr-FR'), rightX, rightY, rightWidth, 11.5, { fontWeight: 700, color: ink })
    rightY += 24
    text(`•  ${item.degree}`, rightX + 4, rightY, rightWidth - 4, 11.5, { color: muted })
    rightY += 52
  })
  rightY = heading('Compétences', rightX, Math.max(535, rightY + 4), rightWidth)
  content.skills.slice(0, 8).forEach((skill) => {
    const height = text(`•  ${skill}`, rightX - 3, rightY, rightWidth, 11.5, { color: muted })
    rightY += Math.max(24, height + 5)
  })
  rightY = heading('Langues', rightX, Math.max(850, rightY + 12), rightWidth)
  content.languages.slice(0, 5).forEach((language) => {
    const height = text(`•  ${language}`, rightX - 3, rightY, rightWidth, 11.5, { color: muted })
    rightY += Math.max(24, height + 5)
  })

  return { background: '#ffffff', elements }
}

export const buildCvEtudiant = (key: string, style: TemplateStyle, content: CvContent) => {
  if (key === 'two-column') {
    const built = buildLayout(key, style, content)
    const headerFrame = makeRect({ x: 34, y: 38, w: 456, h: 116, fill: '#f5f8fc', radius: 18, stroke: style.primary, strokeWidth: 2, name: 'Cadre du nom et du titre' })
    return { ...built, elements: [headerFrame, ...built.elements] }
  }
  if (key === 'photo-column' && content.fullName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes('Diomande Youssouf')) {
    return blueWhiteYoussouf(content, style)
  }
  if (key === 'top-portrait' && content.fullName === 'Aka Prisca') {
    return sageOrganicPrisca(content, style)
  }
  if (key === 'minimal-centered') {
    return grayGridStudent(content, style)
  }
  return buildLayout(key, style, content)
}
