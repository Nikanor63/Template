/**
 * Ce module choisit les photos de démonstration à partir des fichiers présents
 * dans `public/<catégorie>`, sans dépendre de leurs noms.
 */
import 'server-only'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { TEMPLATES, withTemplatePhoto } from './templates'
import type { CvTemplate } from './types'

const EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp']

/** Lit les images réellement présentes, quel que soit leur nom de fichier. */
function getCategoryPhotos(category: CvTemplate['category']) {
  const directory = path.join(process.cwd(), 'public', category)
  if (!existsSync(directory)) return []
  return readdirSync(directory)
    .filter((file) => EXTENSIONS.includes(path.extname(file).slice(1).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
}

function photoUrl(category: CvTemplate['category'], file: string) {
  return `/${encodeURIComponent(category)}/${encodeURIComponent(file)}`
}

function photoFor(template: CvTemplate, files: string[]) {
  if (!files.length) return undefined
  let hash = 0
  for (const char of template.id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return photoUrl(template.category, files[hash % files.length])
}

/** Recherche une miniature portant le slug de chaque modèle. */
export function getThumbnailMap() {
  const map: Record<string, string> = {}
  const photosByCategory = new Map(TEMPLATES.map((template) => [template.category, getCategoryPhotos(template.category)]))
  for (const template of TEMPLATES) {
    const photo = photoFor(template, photosByCategory.get(template.category) ?? [])
    if (photo) map[template.id] = photo
    for (const ext of EXTENSIONS) {
      const file = path.join(process.cwd(), 'public', template.category, `${template.slug}.${ext}`)
      if (existsSync(file)) {
        map[template.id] = photoUrl(template.category, `${template.slug}.${ext}`)
        break
      }
    }
  }
  return map
}

export function getTemplatesWithPhotos(templates: CvTemplate[] = TEMPLATES) {
  const photosByCategory = new Map(templates.map((template) => [template.category, getCategoryPhotos(template.category)]))
  return templates.map((template) => {
    const photo = photoFor(template, photosByCategory.get(template.category) ?? [])
    return photo ? withTemplatePhoto(template, photo) : template
  })
}
