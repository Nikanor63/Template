import { buildLayout, LAYOUTS } from '../cv-shared/builder'
import type { TemplateStyle } from '../cv-shared/builder'
import type { CvContent } from '../cv-shared/types'

export const CV_PROFESSIONNEL_LAYOUTS = LAYOUTS
export const buildCvProfessionnel = (key: string, style: TemplateStyle, content: CvContent) => buildLayout(key, style, content)
