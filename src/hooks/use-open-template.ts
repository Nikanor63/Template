'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useLibrary } from '@/lib/store/library'
import type { CvTemplate } from '@/lib/cv/types'

export function useOpenTemplate() {
  const router = useRouter()
  const createFromTemplate = useLibrary((s) => s.createFromTemplate)
  return useCallback(
    (template: CvTemplate) => {
      const id = createFromTemplate(template)
      router.push(`/editeur/${id}`)
    },
    [createFromTemplate, router],
  )
}
