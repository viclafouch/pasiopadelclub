import type { Court } from './types'

export const POLAR_PRODUCT_IDS = {
  double: 'f55d3e4f-559c-4d92-8ec0-c8c76c11826a',
  simple: 'ab98fefe-9d44-4819-9646-5b0e9723d2a9',
  kids: '93eb9d06-4059-4667-b66b-24351c329782'
} as const satisfies Record<Court['type'], string>
