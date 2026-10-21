import { buildLayout, LAYOUTS } from '../cv-shared/builder'
import type { TemplateStyle } from '../cv-shared/builder'
import type { CvContent } from '../cv-shared/types'

export const CV_ELEGANT_LAYOUTS = LAYOUTS
export const buildCvElegant = (key: string, style: TemplateStyle, content: CvContent) => buildLayout(key, style, content)
