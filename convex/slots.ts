import { v } from 'convex/values'
import type { Doc } from './_generated/dataModel'
import { query } from './_generated/server'

type SlotStatus = 'available' | 'booked' | 'blocked' | 'past'

type Slot = {
  startAt: number
  endAt: number
  status: SlotStatus
}

type CourtWithSlots = {
  court: Doc<'courts'>
  slots: Slot[]
}

const parseDateString = (dateString: string) => {
  const parts = dateString.split('-')
  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])

  return { year, month, day }
}

const SLOTS_90_MIN = [
  { hour: 8, minute: 0 },
  { hour: 9, minute: 30 },
  { hour: 11, minute: 0 },
  { hour: 12, minute: 30 },
  { hour: 14, minute: 0 },
  { hour: 15, minute: 30 },
  { hour: 17, minute: 0 },
  { hour: 18, minute: 30 },
  { hour: 20, minute: 0 }
] as const

const SLOTS_60_MIN = [
  { hour: 8, minute: 0 },
  { hour: 9, minute: 0 },
  { hour: 10, minute: 0 },
  { hour: 11, minute: 0 },
  { hour: 12, minute: 0 },
  { hour: 13, minute: 0 },
  { hour: 14, minute: 0 },
  { hour: 15, minute: 0 },
  { hour: 16, minute: 0 },
  { hour: 17, minute: 0 },
  { hour: 18, minute: 0 },
  { hour: 19, minute: 0 },
  { hour: 20, minute: 0 },
  { hour: 21, minute: 0 }
] as const

const generateTimestamps = (
  dateString: string,
  slotTimes: readonly { hour: number; minute: number }[],
  durationMinutes: number
) => {
  const { year, month, day } = parseDateString(dateString)

  return slotTimes.map((slot) => {
    const startDate = new Date(year, month - 1, day, slot.hour, slot.minute)
    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000)

    return {
      startAt: startDate.getTime(),
      endAt: endDate.getTime()
    }
  })
}

const matchIsSlotBooked = (
  slotStart: number,
  slotEnd: number,
  bookings: Doc<'bookings'>[]
) => {
  return bookings.some((booking) => {
    return (
      booking.status === 'confirmed' &&
      booking.startAt < slotEnd &&
      booking.endAt > slotStart
    )
  })
}

const matchIsSlotBlocked = (
  slotStart: number,
  slotEnd: number,
  blockedSlots: Doc<'blockedSlots'>[]
) => {
  return blockedSlots.some((blocked) => {
    return blocked.startAt < slotEnd && blocked.endAt > slotStart
  })
}

export const getByDate = query({
  args: {
    date: v.string(),
    type: v.optional(
      v.union(v.literal('double'), v.literal('simple'), v.literal('kids'))
    ),
    location: v.optional(v.union(v.literal('indoor'), v.literal('outdoor')))
  },
  handler: async (context, args) => {
    const now = Date.now()

    const courtsQuery = context.db.query('courts').filter((court) => {
      return court.eq(court.field('isActive'), true)
    })

    const allCourts = await courtsQuery.collect()

    const filteredCourts = allCourts.filter((court) => {
      if (args.type && court.type !== args.type) {
        return false
      }

      if (args.location && court.location !== args.location) {
        return false
      }

      return true
    })

    const { year, month, day } = parseDateString(args.date)
    const dayStart = new Date(year, month - 1, day, 0, 0, 0).getTime()
    const dayEnd = new Date(year, month - 1, day, 23, 59, 59, 999).getTime()

    const dayBookings = await context.db
      .query('bookings')
      .withIndex('by_startAt', (indexQuery) => {
        return indexQuery.gte('startAt', dayStart).lte('startAt', dayEnd)
      })
      .collect()

    const dayBlockedSlots = await context.db
      .query('blockedSlots')
      .withIndex('by_startAt', (indexQuery) => {
        return indexQuery.gte('startAt', dayStart).lte('startAt', dayEnd)
      })
      .collect()

    const courtsWithSlots: CourtWithSlots[] = filteredCourts.map((court) => {
      const slotTimes = court.duration === 90 ? SLOTS_90_MIN : SLOTS_60_MIN
      const timestamps = generateTimestamps(
        args.date,
        slotTimes,
        court.duration
      )

      const courtBookings = dayBookings.filter((booking) => {
        return booking.courtId === court._id
      })

      const courtBlockedSlots = dayBlockedSlots.filter((blocked) => {
        return blocked.courtId === null || blocked.courtId === court._id
      })

      const slots: Slot[] = timestamps.map((timestamp) => {
        let status: SlotStatus = 'available'

        if (timestamp.startAt < now) {
          status = 'past'
        } else if (
          matchIsSlotBlocked(
            timestamp.startAt,
            timestamp.endAt,
            courtBlockedSlots
          )
        ) {
          status = 'blocked'
        } else if (
          matchIsSlotBooked(timestamp.startAt, timestamp.endAt, courtBookings)
        ) {
          status = 'booked'
        }

        return {
          startAt: timestamp.startAt,
          endAt: timestamp.endAt,
          status
        }
      })

      return { court, slots }
    })

    return courtsWithSlots
  }
})
