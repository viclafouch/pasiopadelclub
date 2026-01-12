import type { Court } from '@/constants/types'

export const getLocationLabel = (location: Court['location']) => {
  return location === 'indoor' ? 'Intérieur' : 'Extérieur'
}

export const getCourtTypeLabel = (courtType: Court['type']) => {
  if (courtType === 'kids') {
    return 'Kids (ouvert à tous)'
  }

  if (courtType === 'simple') {
    return 'Simple'
  }

  return 'Double'
}
