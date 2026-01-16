import {
  CLOSING_HOUR,
  MINUTES_PER_HOUR,
  MS_PER_MINUTE,
  OPENING_HOUR
} from '@/constants/booking'
import type { Booking, Court, CourtWithSlots, User } from '@/constants/types'

type TimeRange = Pick<Booking, 'startAt' | 'endAt'>
type BookingRange = Pick<Booking, 'startAt' | 'endAt' | 'userId'>
type BlockedSlotWithCourtId = TimeRange & { courtId: Court['id'] | null }

const matchIsOverlapping = (
  startAt: number,
  endAt: number,
  ranges: TimeRange[]
) => {
  return ranges.some((range) => {
    return range.startAt.getTime() < endAt && range.endAt.getTime() > startAt
  })
}

const findOverlappingBooking = (
  startAt: number,
  endAt: number,
  bookings: BookingRange[]
) => {
  return bookings.find((item) => {
    return item.startAt.getTime() < endAt && item.endAt.getTime() > startAt
  })
}

type ComputeSlotInfoParams = {
  startAt: number
  endAt: number
  now: number
  bookings: BookingRange[]
  blockedSlots: TimeRange[]
  currentUserId?: User['id']
}

const computeSlotInfo = ({
  startAt,
  endAt,
  now,
  bookings,
  blockedSlots,
  currentUserId
}: ComputeSlotInfoParams) => {
  if (startAt < now) {
    return { status: 'past' as const, isOwnBooking: false }
  }

  const overlappingBooking = findOverlappingBooking(startAt, endAt, bookings)

  if (overlappingBooking) {
    const isOwnBooking = overlappingBooking.userId === currentUserId

    return { status: 'booked' as const, isOwnBooking }
  }

  if (matchIsOverlapping(startAt, endAt, blockedSlots)) {
    return { status: 'blocked' as const, isOwnBooking: false }
  }

  return { status: 'available' as const, isOwnBooking: false }
}

type GenerateSlotsParams = {
  court: Court
  baseDate: Date
  bookings: BookingRange[]
  blockedSlots: TimeRange[]
  currentUserId?: User['id']
}

const generateSlotsForCourt = ({
  court,
  baseDate,
  bookings,
  blockedSlots,
  currentUserId
}: GenerateSlotsParams) => {
  const now = Date.now()
  const durationMinutes = court.duration

  const availableMinutes = (CLOSING_HOUR - OPENING_HOUR) * MINUTES_PER_HOUR
  const slotCount = Math.floor(availableMinutes / durationMinutes)

  const openingTimestamp = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    OPENING_HOUR,
    0,
    0,
    0
  ).getTime()

  const durationMs = durationMinutes * MS_PER_MINUTE

  return Array.from({ length: slotCount }, (_, index) => {
    const startAt = openingTimestamp + index * durationMs
    const endAt = startAt + durationMs
    const { status, isOwnBooking } = computeSlotInfo({
      startAt,
      endAt,
      now,
      bookings,
      blockedSlots,
      currentUserId
    })

    return { startAt, endAt, status, isOwnBooking }
  })
}

type BuildCourtsWithSlotsParams = {
  courts: Court[]
  bookings: (BookingRange & { courtId: Court['id'] })[]
  blockedSlots: BlockedSlotWithCourtId[]
  baseDate: Date
  currentUserId: User['id'] | undefined
}

export const buildCourtsWithSlots = ({
  courts,
  bookings,
  blockedSlots,
  baseDate,
  currentUserId
}: BuildCourtsWithSlotsParams): CourtWithSlots[] => {
  const bookingsByCourtId = Map.groupBy(bookings, (item) => {
    return item.courtId
  })
  const blockedWithCourtId = blockedSlots.filter((slot) => {
    return slot.courtId !== null
  })
  const blockedByCourtId = Map.groupBy(blockedWithCourtId, (slot) => {
    return slot.courtId
  })
  const globalBlocked = blockedSlots.filter((slot) => {
    return slot.courtId === null
  })

  return courts.map((court) => {
    const courtBookings = bookingsByCourtId.get(court.id) ?? []
    const courtBlocked = blockedByCourtId.get(court.id) ?? []
    const slots = generateSlotsForCourt({
      court,
      baseDate,
      bookings: courtBookings,
      blockedSlots: [...courtBlocked, ...globalBlocked],
      currentUserId
    })
    const hasAvailableSlot = slots.some((slot) => {
      return slot.status === 'available'
    })

    return { court, slots, hasAvailableSlot }
  })
}
