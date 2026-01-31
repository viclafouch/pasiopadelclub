type CourtLocation = 'indoor' | 'outdoor' | 'both'

export const LOCATION_LABELS = {
  indoor: 'Intérieur',
  outdoor: 'Semi-couvert',
  both: 'Intérieur & Semi-couvert'
} as const satisfies Record<CourtLocation, string>
