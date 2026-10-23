/**
 * Ce module choisit les photos de démonstration à partir des fichiers présents
 * dans `public/<catégorie>`, sans dépendre de leurs noms.
 */
import 'server-only'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { TEMPLATES, withTemplatePhoto } from './templates'
import type { CvTemplate } from './types'

const EXTENSIONS_IMAGES = ['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif']

/** Lit les images réellement présentes, quel que soit leur nom de fichier. */
function lirePhotosCategorie(categorie: string) {
  const dossier = path.join(process.cwd(), 'public', categorie)
  if (!existsSync(dossier)) return []
  return readdirSync(dossier)
    .filter((fichier) => EXTENSIONS_IMAGES.includes(path.extname(fichier).slice(1).toLowerCase()))
    .sort((nomA, nomB) => nomA.localeCompare(nomB))
}

function urlPhoto(categorie: string, fichier: string) {
  return `/${encodeURIComponent(categorie)}/${encodeURIComponent(fichier)}`
}

function choisirPhotoPourModele(modele: CvTemplate, fichiers: string[], categorieSource = modele.category) {
  if (!fichiers.length) return undefined
  let empreinte = 0
  for (const caractere of modele.id) empreinte = (empreinte * 31 + caractere.charCodeAt(0)) >>> 0
  return urlPhoto(categorieSource, fichiers[empreinte % fichiers.length])
}

/** Chaque catégorie utilise exclusivement les images de son dossier public. */
function photosDeCategorie(categorie: CvTemplate['category']) {
  const dossierImages = categorie
  return { fichiers: lirePhotosCategorie(dossierImages), categorieSource: dossierImages }
}

/** Recherche une miniature portant le slug de chaque modèle. */
export function getThumbnailMap() {
  const miniatures: Record<string, string> = {}
  const photosParCategorie = new Map(TEMPLATES.map((modele) => [modele.category, photosDeCategorie(modele.category)]))
  for (const modele of TEMPLATES) {
    const photosCategorie = photosParCategorie.get(modele.category)
    const photo = photosCategorie ? choisirPhotoPourModele(modele, photosCategorie.fichiers, photosCategorie.categorieSource) : undefined
    if (photo) miniatures[modele.id] = photo
    for (const extension of EXTENSIONS_IMAGES) {
      const fichier = path.join(process.cwd(), 'public', modele.category, `${modele.slug}.${extension}`)
      if (existsSync(fichier)) {
        miniatures[modele.id] = urlPhoto(modele.category, `${modele.slug}.${extension}`)
        break
      }
    }
  }
  return miniatures
}

export function getTemplatesWithPhotos(modeles: CvTemplate[] = TEMPLATES) {
  const photosParCategorie = new Map(modeles.map((modele) => [modele.category, photosDeCategorie(modele.category)]))
  return modeles.map((modele) => {
    const photosCategorie = photosParCategorie.get(modele.category)
    const photo = photosCategorie ? choisirPhotoPourModele(modele, photosCategorie.fichiers, photosCategorie.categorieSource) : undefined
    return photo ? withTemplatePhoto(modele, photo) : modele
  })
}
