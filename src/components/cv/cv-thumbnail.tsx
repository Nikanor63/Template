'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import type { CvDesign } from '@/lib/cv/types'
import { CvPage } from './cv-page'

type PageDesign = Pick<CvDesign, 'width' | 'height' | 'background' | 'elements'>

export function CvThumbnail({ design, thumbnail, alt }: { design: PageDesign; thumbnail?: string; alt: string }) {
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
      className="relative w-full overflow-hidden bg-white"
      style={{ aspectRatio: `${design.width} / ${design.height}` }}
    >
      {thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        scale > 0 && <CvPage design={design} scale={scale} className="pointer-events-none select-none" />
      )}
    </div>
  )
}
