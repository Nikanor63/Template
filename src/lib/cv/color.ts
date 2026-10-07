function parse(hex: string) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6)
  const n = Number.parseInt(full, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function toHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`
}

export function mix(hex: string, target: string, amount: number) {
  const a = parse(hex)
  const b = parse(target)
  return toHex(a.r + (b.r - a.r) * amount, a.g + (b.g - a.g) * amount, a.b + (b.b - a.b) * amount)
}

export function isDark(hex: string) {
  if (!hex.startsWith('#')) return false
  const { r, g, b } = parse(hex)
  return (r * 299 + g * 587 + b * 114) / 1000 < 150
}

export function readableOn(hex: string) {
  return isDark(hex) ? '#ffffff' : '#14202e'
}
