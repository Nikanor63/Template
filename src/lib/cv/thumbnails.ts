import 'server-only'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { TEMPLATES } from './templates'

const EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp']

/**
 * Looks for a custom preview image at public/<Catégorie>/<slug>.<ext>.
 * When none exists, the gallery renders a live preview from the template data.
 */
export function getThumbnailMap() {
  const map: Record<string, string> = {}
  for (const t of TEMPLATES) {
    for (const ext of EXTENSIONS) {
      const file = path.join(process.cwd(), 'public', t.category, `${t.slug}.${ext}`)
      if (existsSync(file)) {
        map[t.id] = `/${encodeURIComponent(t.category)}/${t.slug}.${ext}`
        break
      }
    }
  }
  return map
}
