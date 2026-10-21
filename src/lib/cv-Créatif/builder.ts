import { buildLayout, LAYOUTS } from '../cv-shared/builder'
import { makeImage, makeRect } from '../cv-shared/builder'
import type { TemplateStyle } from '../cv-shared/builder'
import type { CvContent } from '../cv-shared/types'

export const CV_CREATIF_LAYOUTS = LAYOUTS
export const buildCvCreatif = (key: string, style: TemplateStyle, content: CvContent) => {
  const built = buildLayout(key, style, content)
  if (key !== 'bold' || !content.photo) return built

  const frame = makeRect({ x: 590, y: 38, w: 166, h: 204, fill: style.bg, radius: 20, stroke: '#ffffff', strokeWidth: 3, name: 'Cadre du portrait' })
  const portrait = makeImage({ src: content.photo, x: 598, y: 46, w: 150, h: 188, radius: 16, stroke: '#ffffff', strokeWidth: 3 })
  return {
    ...built,
    elements: [...built.elements.slice(0, 3), frame, portrait, ...built.elements.slice(3)],
  }
}
