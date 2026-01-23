import type {
  AvailabilityFilter,
  CourtTypeFilter,
  LocationFilter
} from '@/constants/court'
import type { CourtWithSlots } from '@/constants/types'

type FilterCourtsParams = {
  courts: CourtWithSlots[]
  courtType: CourtTypeFilter
  location: LocationFilter
  availability: AvailabilityFilter
}

export const filterCourts = ({
  courts,
  courtType,
  location,
  availability
}: FilterCourtsParams) => {
  return courts
    .map((item) => {
      const filteredSlots =
        availability === 'available'
          ? item.slots.filter((slot) => {
              return slot.status === 'available' || slot.isOwnBooking
            })
          : item.slots

      return {
        ...item,
        slots: filteredSlots,
        hasAvailableSlot: filteredSlots.some((slot) => {
          return slot.status === 'available'
        })
      }
    })
    .filter((item) => {
      const matchesType = courtType === 'all' || item.court.type === courtType
      const matchesLocation =
        location === 'all' || item.court.location === location
      const hasSlots = availability === 'all' || item.slots.length > 0

      return matchesType && matchesLocation && hasSlots
    })
}
