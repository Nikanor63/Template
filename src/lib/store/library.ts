'use client'

import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { uid } from '@/lib/cv/builder'
import type { CvDesign, CvTemplate } from '@/lib/cv/types'
import { PAGE_HEIGHT, PAGE_WIDTH } from '@/lib/cv/types'

interface LibraryState {
  favorites: string[]
  designs: Record<string, CvDesign>
  toggleFavorite: (templateId: string) => void
  createFromTemplate: (template: CvTemplate) => string
  createFromDesign: (design: Omit<CvDesign, 'id' | 'updatedAt'>) => string
  createBlank: () => string
  saveDesign: (design: CvDesign) => void
  removeDesign: (id: string) => void
  duplicateDesign: (id: string) => string | undefined
}

function cloneElements(elements: CvDesign['elements']) {
  return elements.map((el) => ({ ...el, id: uid(el.type) }))
}

export const useLibrary = create<LibraryState>()(
  persist(
    (set, get) => ({
      favorites: [],
      designs: {},
      toggleFavorite: (templateId) =>
        set((s) => ({
          favorites: s.favorites.includes(templateId)
            ? s.favorites.filter((f) => f !== templateId)
            : [...s.favorites, templateId],
        })),
      createFromDesign: (design) => {
        const id = uid('cv')
        const next: CvDesign = { ...design, id, elements: cloneElements(design.elements), updatedAt: Date.now() }
        set((s) => ({ designs: { ...s.designs, [id]: next } }))
        return id
      },
      createFromTemplate: (template) => get().createFromDesign({ ...template.design, templateId: template.id }),
      createBlank: () =>
        get().createFromDesign({
          name: 'CV sans titre',
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT,
          background: '#ffffff',
          elements: [],
        }),
      saveDesign: (design) =>
        set((s) => ({ designs: { ...s.designs, [design.id]: { ...design, updatedAt: Date.now() } } })),
      removeDesign: (id) =>
        set((s) => {
          const { [id]: _removed, ...rest } = s.designs
          return { designs: rest }
        }),
      duplicateDesign: (id) => {
        const d = get().designs[id]
        if (!d) return undefined
        return get().createFromDesign({ ...d, name: `${d.name} (copie)` })
      },
    }),
    { name: 'cvea-library', storage: createJSONStorage(() => localStorage) },
  ),
)

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    if (useLibrary.persist.hasHydrated()) setHydrated(true)
    return useLibrary.persist.onFinishHydration(() => setHydrated(true))
  }, [])
  return hydrated
}
