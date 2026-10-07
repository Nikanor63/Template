import type { CSSProperties } from 'react'
import { ICONS } from '@/lib/cv/icons'
import type { CvElement } from '@/lib/cv/types'

export function elementBoxStyle(el: CvElement): CSSProperties {
  return {
    position: 'absolute',
    left: el.x,
    top: el.y,
    width: el.w,
    height: el.h,
    transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
    opacity: el.opacity,
  }
}

export function textStyle(el: Extract<CvElement, { type: 'text' }>): CSSProperties {
  return {
    fontFamily: el.fontFamily,
    fontSize: el.fontSize,
    fontWeight: el.fontWeight,
    fontStyle: el.italic ? 'italic' : 'normal',
    textDecoration: el.underline ? 'underline' : 'none',
    textTransform: el.uppercase ? 'uppercase' : 'none',
    color: el.color,
    textAlign: el.align,
    lineHeight: el.lineHeight,
    letterSpacing: el.letterSpacing,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    width: '100%',
    margin: 0,
  }
}

export function CvElementContent({ el }: { el: CvElement }) {
  switch (el.type) {
    case 'text':
      return <p style={textStyle(el)}>{el.text}</p>
    case 'rect':
    case 'circle':
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: el.fill,
            borderRadius: el.type === 'circle' ? '9999px' : el.radius,
            border: el.strokeWidth ? `${el.strokeWidth}px solid ${el.stroke}` : undefined,
            boxSizing: 'border-box',
          }}
        />
      )
    case 'line':
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              borderTop: `${el.strokeWidth}px ${el.dashed ? 'dashed' : 'solid'} ${el.stroke}`,
            }}
          />
        </div>
      )
    case 'image':
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={el.src || '/placeholder.svg'}
          alt=""
          crossOrigin="anonymous"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: el.fit,
            borderRadius: el.radius >= 9999 ? '9999px' : el.radius,
            border: el.strokeWidth ? `${el.strokeWidth}px solid ${el.stroke}` : undefined,
            boxSizing: 'border-box',
            display: 'block',
          }}
        />
      )
    case 'icon': {
      const Icon = ICONS[el.icon] ?? ICONS.star
      return <Icon style={{ width: '100%', height: '100%', color: el.color }} strokeWidth={2} aria-hidden />
    }
  }
}
