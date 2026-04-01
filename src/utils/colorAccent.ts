/** Subtle accent per garment color for card edge glow */
const FALLBACK = '#c45c3e'

const MAP: Record<string, string> = {
  black: '#2d2d2d',
  blue: '#1d4ed8',
  red: '#c41e3a',
  green: '#15803d',
  pink: '#db2777',
  white: '#94a3b8',
  grey: '#64748b',
  gray: '#64748b',
  purple: '#7c3aed',
  yellow: '#ca8a04',
}

export function accentForColor(colorName: string): string {
  const k = colorName.trim().toLowerCase()
  return MAP[k] ?? FALLBACK
}
