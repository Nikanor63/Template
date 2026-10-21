import type { ShapeElement } from './types'

export type BlockShape = NonNullable<ShapeElement['shape']>

/** Formes prêtes à être insérées dans le CV et personnalisées dans Style. */
export const SHAPE_BLOCKS: { shape: BlockShape; label: string }[] = [
  { shape: 'rectangle', label: 'Rectangle' },
  { shape: 'circle', label: 'Cercle' },
  { shape: 'wave', label: 'Vague' },
]

export function createShapeBlock(
  shape: BlockShape,
  options: { x: number; y: number; w: number; h: number; fill?: string; id?: string },
): ShapeElement {
  return {
    id: options.id ?? `shape_${Date.now().toString(36)}`,
    type: shape === 'circle' ? 'circle' : 'rect',
    shape,
    name: SHAPE_BLOCKS.find((item) => item.shape === shape)?.label ?? 'Forme',
    x: options.x,
    y: options.y,
    w: options.w,
    h: options.h,
    rotation: 0,
    opacity: 1,
    fill: options.fill ?? '#5CAFE7',
    stroke: 'transparent',
    strokeWidth: 0,
    radius: shape === 'circle' ? 9999 : 0,
    waveAmplitude: 20,
    waveCount: 2,
    wavePhase: 0,
  }
}

/** SVG path indépendant des dimensions CSS pour des blocs étirables sans déformation visuelle du tracé. */
export function getShapePath(amplitude = 20, count = 2, phase = 0) {
  const boundedAmplitude = Math.max(0, Math.min(42, amplitude))
  const boundedCount = Math.max(1, Math.min(8, Math.round(count)))
  const boundedPhase = Math.max(0, Math.min(100, phase)) / 100
  const samples = 48
  const wave = Array.from({ length: samples + 1 }, (_, index) => {
    const x = (index / samples) * 1000
    const y = 280 + Math.sin((index / samples) * Math.PI * 2 * boundedCount + boundedPhase * Math.PI * 2) * boundedAmplitude * 10
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  return `M ${wave.join(' L ')} L 1000 1000 L 0 1000 Z`
}

/** SVG d'un carré ou d'un cercle avec une déformation réglable sur chaque côté. */
export function getSideDeformedPath(
  shape: 'rectangle' | 'circle',
  sides: { top: number; right: number; bottom: number; left: number },
  count = 2,
) {
  const waves = Math.max(1, Math.min(8, Math.round(count)))
  const amplitude = (value: number) => Math.max(0, Math.min(35, value)) * 3
  const top = amplitude(sides.top)
  const right = amplitude(sides.right)
  const bottom = amplitude(sides.bottom)
  const left = amplitude(sides.left)
  const ripple = (progress: number) => Math.sin(progress * Math.PI * 2 * waves)

  if (shape === 'circle') {
    const points = Array.from({ length: 161 }, (_, index) => {
      const angle = (index / 160) * Math.PI * 2
      const degrees = (angle * 180 / Math.PI + 360) % 360
      const sector = Math.floor(((degrees + 45) % 360) / 90)
      const progress = (((degrees + 45) % 90) / 90)
      const sideAmplitude = [right, bottom, left, top][sector]
      const radius = 460 + sideAmplitude * ripple(progress)
      return `${(500 + Math.cos(angle) * radius).toFixed(1)},${(500 + Math.sin(angle) * radius).toFixed(1)}`
    })
    return `M ${points.join(' L ')} Z`
  }

  const steps = 24
  const points: string[] = []
  for (let index = 0; index <= steps; index++) {
    const progress = index / steps
    points.push(`${(progress * 1000).toFixed(1)},${(-top * ripple(progress)).toFixed(1)}`)
  }
  for (let index = 1; index <= steps; index++) {
    const progress = index / steps
    points.push(`${(1000 + right * ripple(progress)).toFixed(1)},${(progress * 1000).toFixed(1)}`)
  }
  for (let index = 1; index <= steps; index++) {
    const progress = index / steps
    points.push(`${((1 - progress) * 1000).toFixed(1)},${(1000 + bottom * ripple(progress)).toFixed(1)}`)
  }
  for (let index = 1; index < steps; index++) {
    const progress = index / steps
    points.push(`${(-left * ripple(progress)).toFixed(1)},${((1 - progress) * 1000).toFixed(1)}`)
  }
  return `M ${points.join(' L ')} Z`
}
