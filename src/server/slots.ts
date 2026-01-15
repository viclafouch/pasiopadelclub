import { and, eq, gte, lt } from 'drizzle-orm'
import {
  CLOSING_HOUR,
  MINUTES_PER_HOUR,
  MS_PER_MINUTE,
  OPENING_HOUR
} from '@/constants/booking'
import { getSlotsByDateSchema } from '@/constants/schemas'
import type { Booking, CourtWithSlots, User } from '@/constants/types'
import { db } from '@/db'
import { blockedSlot, booking, court } from '@/db/schema'
import { parseDateKey } from '@/helpers/date'
import { createServerFn } from '@tanstack/react-start'

type TimeRange = Pick<Booking, 'startAt' | 'endAt'>
type BookingRange = Pick<Booking, 'startAt' | 'endAt' | 'userId'>

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

const computeSlotInfo = (
  startAt: number,
  endAt: number,
  now: number,
  bookings: BookingRange[],
  blockedSlots: TimeRange[],
  currentUserId: User['id'] | undefined
) => {
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

const generateSlotsForCourt = (
  courtData: typeof court.$inferSelect,
  baseDate: Date,
  existingBookings: BookingRange[],
  existingBlockedSlots: TimeRange[],
  currentUserId: User['id'] | undefined
) => {
  const now = Date.now()
  const durationMinutes = courtData.duration

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
    const { status, isOwnBooking } = computeSlotInfo(
      startAt,
      endAt,
      now,
      existingBookings,
      existingBlockedSlots,
      currentUserId
    )

    return { startAt, endAt, status, isOwnBooking }
  })
}

export const getSlotsByDateFn = createServerFn({ method: 'GET' })
  .inputValidator(getSlotsByDateSchema)
  .handler(async ({ data }) => {
    const { date, currentUserId } = data
    const baseDate = parseDateKey(date)

    const startOfDay = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      0,
      0,
      0,
      0
    )
    const endOfDay = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      23,
      59,
      59,
      999
    )

    const [courts, bookings, blockedSlots] = await Promise.all([
      db
        .select()
        .from(court)
        .where(eq(court.isActive, true))
        .orderBy(court.name),
      db
        .select({
          courtId: booking.courtId,
          userId: booking.userId,
          startAt: booking.startAt,
          endAt: booking.endAt
        })
        .from(booking)
        .where(
          and(
            gte(booking.startAt, startOfDay),
            lt(booking.startAt, endOfDay),
            eq(booking.status, 'confirmed')
          )
        ),
      db
        .select({
          courtId: blockedSlot.courtId,
          startAt: blockedSlot.startAt,
          endAt: blockedSlot.endAt
        })
        .from(blockedSlot)
        .where(
          and(
            gte(blockedSlot.startAt, startOfDay),
            lt(blockedSlot.startAt, endOfDay)
          )
        )
    ])

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

    const courtsWithSlots: CourtWithSlots[] = courts.map((courtData) => {
      const courtBookings = bookingsByCourtId.get(courtData.id) ?? []
      const courtBlocked = blockedByCourtId.get(courtData.id) ?? []

      return {
        court: courtData,
        slots: generateSlotsForCourt(
          courtData,
          baseDate,
          courtBookings,
          [...courtBlocked, ...globalBlocked],
          currentUserId
        )
      }
    })

    return courtsWithSlots
  })
