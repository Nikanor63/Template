import 'server-only'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { TEMPLATES, withTemplatePhoto } from './templates'
import type { CvTemplate, TemplateCategory } from './types'

const EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp']

export function getThumbnailMap() {
  const map: Record<string, string> = {}
  for (const template of TEMPLATES) {
    for (const ext of EXTENSIONS) {
      const file = path.join(process.cwd(), 'public', template.category, `${template.slug}.${ext}`)
      if (existsSync(file)) {
        map[template.id] = `/${encodeURIComponent(template.category)}/${template.slug}.${ext}`
        break
      }
    }
  }
  return map
}

export function getCategoryPortraits() {
  const map: Partial<Record<TemplateCategory, string[]>> = {}
  const categories = Array.from(new Set(TEMPLATES.map((template) => template.category)))
  for (const category of categories) {
    const folder = path.join(process.cwd(), 'public', category)
    if (!existsSync(folder)) continue
    map[category] = readdirSync(folder, { withFileTypes: true })
      .filter((entry) => entry.isFile() && /^(photo|portrait|profil|headshot)([-_.]|$)/i.test(entry.name))
      .filter((entry) => /\.(png|jpe?g|webp)$/i.test(entry.name))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
      .map((entry) => `/${encodeURIComponent(category)}/${encodeURIComponent(entry.name)}`)
  }
  return map
}

export function getTemplatesWithPhotos(templates: CvTemplate[] = TEMPLATES) {
  const portraits = getCategoryPortraits()
  return templates.map((template) => {
    const options = portraits[template.category] ?? []
    if (options.length === 0) return template
    const selection = [...template.id].reduce((sum, character) => sum + character.charCodeAt(0), 0) % options.length
    return withTemplatePhoto(template, options[selection])
  })
}
