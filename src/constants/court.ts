import type { Court } from './types'

type FilterOption<T extends string> = {
  value: T
  label: string
}

export type CourtTypeFilter = Court['type'] | 'all'
export type LocationFilter = Court['location'] | 'all'

export const COURT_TYPE_OPTIONS = [
  { value: 'all', label: 'Tous les types' },
  { value: 'double', label: 'Double' },
  { value: 'simple', label: 'Simple' },
  { value: 'kids', label: 'Kids' }
] as const satisfies FilterOption<CourtTypeFilter>[]

export const COURT_TYPE_OPTIONS_EXTENDED = [
  { value: 'all', label: 'Tous les types' },
  { value: 'double', label: 'Double (4 joueurs)' },
  { value: 'simple', label: 'Simple (2 joueurs)' },
  { value: 'kids', label: 'Kids (ouvert à tous)' }
] as const satisfies FilterOption<CourtTypeFilter>[]

export const LOCATION_OPTIONS = [
  { value: 'all', label: 'Tous les lieux' },
  { value: 'indoor', label: 'Intérieur' },
  { value: 'outdoor', label: 'Extérieur' }
] as const satisfies FilterOption<Court['location'] | 'all'>[]

export const LOCATION_OPTIONS_EXTENDED = [
  { value: 'all', label: 'Tous les lieux' },
  { value: 'indoor', label: 'Intérieur (couvert)' },
  { value: 'outdoor', label: 'Extérieur (semi-couvert)' }
] as const satisfies FilterOption<Court['location'] | 'all'>[]
