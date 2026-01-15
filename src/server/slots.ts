import { and, eq, gte, lt } from 'drizzle-orm'
import {
  CLOSING_HOUR,
  MINUTES_PER_HOUR,
  MS_PER_MINUTE,
  OPENING_HOUR
} from '@/constants/booking'
import { getSlotsByDateSchema } from '@/constants/schemas'
import type { CourtWithSlots, Slot, SlotStatus } from '@/constants/types'
import { db } from '@/db'
import { blockedSlot, booking, court } from '@/db/schema'
import { parseDateKey } from '@/helpers/date'
import { createServerFn } from '@tanstack/react-start'

type TimeRange = { startAt: Date; endAt: Date }

const matchIsOverlapping = (
  startAt: number,
  endAt: number,
  ranges: TimeRange[]
) => {
  return ranges.some((range) => {
    return range.startAt.getTime() < endAt && range.endAt.getTime() > startAt
  })
}

const computeSlotStatus = (
  startAt: number,
  endAt: number,
  now: number,
  bookings: TimeRange[],
  blockedSlots: TimeRange[]
): SlotStatus => {
  if (startAt < now) {
    return 'past'
  }

  if (matchIsOverlapping(startAt, endAt, bookings)) {
    return 'booked'
  }

  if (matchIsOverlapping(startAt, endAt, blockedSlots)) {
    return 'blocked'
  }

  return 'available'
}

const generateSlotsForCourt = (
  courtData: typeof court.$inferSelect,
  baseDate: Date,
  existingBookings: TimeRange[],
  existingBlockedSlots: TimeRange[]
): Slot[] => {
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
    const status = computeSlotStatus(
      startAt,
      endAt,
      now,
      existingBookings,
      existingBlockedSlots
    )

    return { startAt, endAt, status }
  })
}

export const getSlotsByDateFn = createServerFn({ method: 'GET' })
  .inputValidator(getSlotsByDateSchema)
  .handler(async ({ data }) => {
    const baseDate = parseDateKey(data.date)

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
        slots: generateSlotsForCourt(courtData, baseDate, courtBookings, [
          ...courtBlocked,
          ...globalBlocked
        ])
      }
    })

    return courtsWithSlots
  })
