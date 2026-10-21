'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import type { CvDesign } from '@/lib/cv-shared/types'
import { CvPage } from './cv-page'

type PageDesign = Pick<CvDesign, 'width' | 'height' | 'background' | 'elements'>

export function CvThumbnail({ design, alt }: { design: PageDesign; thumbnail?: string; alt: string }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useLayoutEffect(() => {
    const node = boxRef.current
    if (!node) return
    const update = () => setScale(node.clientWidth / design.width)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(node)
    return () => ro.disconnect()
  }, [design.width])

  return (
    <div
      ref={boxRef}
      role="img"
      aria-label={alt}
      className="relative w-full overflow-hidden bg-surface"
      style={{ aspectRatio: `${design.width} / ${design.height}` }}
    >
      {scale > 0 && <CvPage design={design} scale={scale} className="pointer-events-none select-none" />}
    </div>
  )
}
