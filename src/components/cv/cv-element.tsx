import type { CSSProperties } from 'react'
import { ICONS } from '@/lib/cv-shared/icons'
import { getShapePath, getSideDeformedPath } from '@/lib/cv-shared/shape-blocks'
import type { CvElement } from '@/lib/cv-shared/types'

export function elementBoxStyle(el: CvElement): CSSProperties {
  return {
    position: 'absolute',
    left: el.x,
    top: el.y,
    width: el.w,
    height: el.h,
    transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
    opacity: el.opacity,
    overflow: el.type === 'image' ? 'hidden' : undefined,
    borderRadius: el.type === 'image' ? (el.radius >= 9999 ? '9999px' : el.radius) : undefined,
    border: el.type === 'image' && el.strokeWidth ? `${el.strokeWidth}px solid ${el.stroke}` : undefined,
    boxSizing: el.type === 'image' ? 'border-box' : undefined,
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
    case 'circle': {
      const shape = el.shape ?? (el.type === 'circle' ? 'circle' : 'rectangle')
      const sides = { top: el.deformTop ?? 0, right: el.deformRight ?? 0, bottom: el.deformBottom ?? 0, left: el.deformLeft ?? 0 }
      const hasSideDeformation = Object.values(sides).some((value) => value > 0)
      if ((shape !== 'rectangle' && shape !== 'circle') || hasSideDeformation) {
        const path = hasSideDeformation && (shape === 'rectangle' || shape === 'circle')
          ? getSideDeformedPath(shape, sides, el.waveCount)
          : el.customPath ?? getShapePath(el.waveAmplitude, el.waveCount, el.wavePhase)
        return (
          <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden style={{ overflow: 'visible' }}>
            <path d={path} fill={el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth} vectorEffect="non-scaling-stroke" />
          </svg>
        )
      }
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: el.fill,
            borderRadius: shape === 'circle' || el.radius >= 9999 ? '9999px' : Math.max(0, el.radius),
            border: el.strokeWidth ? `${el.strokeWidth}px solid ${el.stroke}` : undefined,
            boxSizing: 'border-box',
          }}
        />
      )
    }
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
            objectPosition: `${50 - Math.max(-50, Math.min(50, el.cropX ?? 0))}% ${50 - Math.max(-50, Math.min(50, el.cropY ?? 0))}%`,
            transformOrigin: 'center',
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
