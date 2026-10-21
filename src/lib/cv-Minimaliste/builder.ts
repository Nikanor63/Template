import { buildMinimalisteLayout, MINIMALIST_LAYOUTS } from './minimaliste-layouts'
import type { TemplateStyle } from '../cv-shared/builder'
import type { CvContent } from '../cv-shared/types'

export const CV_MINIMALISTE_LAYOUTS = MINIMALIST_LAYOUTS
export function buildCvMinimaliste(layoutKey: string, style: TemplateStyle, content: CvContent) {
  return buildMinimalisteLayout(layoutKey as (typeof MINIMALIST_LAYOUTS)[number]['key'], style, content)
}
