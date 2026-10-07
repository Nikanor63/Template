import { forwardRef } from 'react'
import type { CvDesign } from '@/lib/cv/types'
import { CvElementContent, elementBoxStyle } from './cv-element'

type PageDesign = Pick<CvDesign, 'width' | 'height' | 'background' | 'elements'>

export const CvPage = forwardRef<HTMLDivElement, { design: PageDesign; scale?: number; className?: string }>(
  function CvPage({ design, scale = 1, className }, ref) {
    return (
      <div
        className={className}
        style={{ width: design.width * scale, height: design.height * scale, overflow: 'hidden', position: 'relative' }}
      >
        <div
          ref={ref}
          style={{
            width: design.width,
            height: design.height,
            background: design.background,
            position: 'relative',
            overflow: 'hidden',
            transform: scale === 1 ? undefined : `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {design.elements
            .filter((el) => !el.hidden)
            .map((el) => (
              <div key={el.id} style={elementBoxStyle(el)}>
                <CvElementContent el={el} />
              </div>
            ))}
        </div>
      </div>
    )
  },
)
