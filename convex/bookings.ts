import { v } from 'convex/values'
import { internalMutation } from './_generated/server'
import { authenticatedMutation, authenticatedQuery } from './functions'

const MS_PER_HOUR = 1000 * 60 * 60
const CANCELLATION_DEADLINE_HOURS = 24
const MAX_ACTIVE_BOOKINGS = 2
const PENDING_BOOKING_TTL_MS = 15 * 60 * 1000

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

const matchIsValidSlot = (
  startAt: number,
  endAt: number,
  courtDuration: 60 | 90
) => {
  const startDate = new Date(startAt)
  const slots = courtDuration === 90 ? SLOTS_90_MIN : SLOTS_60_MIN

  const matchesSlot = slots.some((slot) => {
    return (
      startDate.getHours() === slot.hour &&
      startDate.getMinutes() === slot.minute
    )
  })

  if (!matchesSlot) {
    return false
  }

  const actualDurationMs = endAt - startAt
  const expectedDurationMs = courtDuration * 60 * 1000

  return actualDurationMs === expectedDurationMs
}

export const getUpcoming = authenticatedQuery({
  args: {},
  handler: async (context) => {
    const now = Date.now()

    const bookings = await context.db
      .query('bookings')
      .withIndex('by_userId_status', (indexQuery) => {
        return indexQuery
          .eq('userId', context.user._id)
          .eq('status', 'confirmed')
      })
      .collect()

    const upcomingBookings = bookings.filter((booking) => {
      return booking.startAt > now
    })

    const bookingsWithCourts = await Promise.all(
      upcomingBookings.map(async (booking) => {
        const court = await context.db.get(booking.courtId)

        if (!court) {
          return null
        }

        return { ...booking, court }
      })
    )

    return bookingsWithCourts
      .filter((booking) => {
        return booking !== null
      })
      .toSorted((first, second) => {
        return first.startAt - second.startAt
      })
  }
})

export const getPast = authenticatedQuery({
  args: { limit: v.optional(v.number()), cursor: v.optional(v.string()) },
  handler: async (context, args) => {
    const now = Date.now()

    const allBookings = await context.db
      .query('bookings')
      .withIndex('by_userId', (indexQuery) => {
        return indexQuery.eq('userId', context.user._id)
      })
      .collect()

    const pastBookings = allBookings.filter((booking) => {
      if (booking.status === 'cancelled') {
        return true
      }

      if (booking.status !== 'confirmed' && booking.status !== 'completed') {
        return false
      }

      return booking.endAt <= now
    })

    const sortedBookings = pastBookings.toSorted((first, second) => {
      return second.startAt - first.startAt
    })

    const pageSize = args.limit ?? 20
    const startIndex = args.cursor ? parseInt(args.cursor, 10) : 0
    const paginatedBookings = sortedBookings.slice(
      startIndex,
      startIndex + pageSize
    )

    const bookingsWithCourts = await Promise.all(
      paginatedBookings.map(async (booking) => {
        const court = await context.db.get(booking.courtId)

        if (!court) {
          return null
        }

        return { ...booking, court }
      })
    )

    const validBookings = bookingsWithCourts.filter((booking) => {
      return booking !== null
    })

    const hasMore = startIndex + pageSize < sortedBookings.length
    const nextCursor = hasMore ? String(startIndex + pageSize) : null

    return { bookings: validBookings, nextCursor }
  }
})

export const getActiveCount = authenticatedQuery({
  args: {},
  handler: async (context) => {
    const now = Date.now()

    const bookings = await context.db
      .query('bookings')
      .withIndex('by_userId_status', (indexQuery) => {
        return indexQuery
          .eq('userId', context.user._id)
          .eq('status', 'confirmed')
      })
      .collect()

    return bookings.filter((booking) => {
      return booking.startAt > now
    }).length
  }
})

export const cancel = authenticatedMutation({
  args: { bookingId: v.id('bookings') },
  handler: async (context, args) => {
    const booking = await context.db.get(args.bookingId)

    if (!booking) {
      throw new Error('Réservation non trouvée')
    }

    if (booking.userId !== context.user._id) {
      throw new Error('Non autorisé')
    }

    if (booking.status !== 'confirmed') {
      throw new Error('Cette réservation ne peut pas être annulée')
    }

    const hoursUntilBooking = (booking.startAt - Date.now()) / MS_PER_HOUR

    if (hoursUntilBooking < CANCELLATION_DEADLINE_HOURS) {
      throw new Error('Annulation impossible moins de 24h avant le créneau')
    }

    await context.db.patch(args.bookingId, { status: 'cancelled' })

    return { success: true }
  }
})

export const initiate = authenticatedMutation({
  args: {
    courtId: v.id('courts'),
    startAt: v.number(),
    endAt: v.number()
  },
  handler: async (context, args) => {
    const now = Date.now()

    if (args.startAt < now) {
      throw new Error('Ce créneau est passé')
    }

    const court = await context.db.get(args.courtId)

    if (!court || !court.isActive) {
      throw new Error('Terrain non disponible')
    }

    const isValidSlot = matchIsValidSlot(
      args.startAt,
      args.endAt,
      court.duration as 60 | 90
    )

    if (!isValidSlot) {
      throw new Error('Créneau invalide')
    }

    const activeBookings = await context.db
      .query('bookings')
      .withIndex('by_userId_status', (indexQuery) => {
        return indexQuery
          .eq('userId', context.user._id)
          .eq('status', 'confirmed')
      })
      .collect()

    const upcomingCount = activeBookings.filter((booking) => {
      return booking.startAt > now
    }).length

    if (upcomingCount >= MAX_ACTIVE_BOOKINGS) {
      throw new Error('Limite de 2 réservations actives atteinte')
    }

    const existingBookings = await context.db
      .query('bookings')
      .withIndex('by_courtId', (indexQuery) => {
        return indexQuery.eq('courtId', args.courtId)
      })
      .filter((booking) => {
        return booking.and(
          booking.or(
            booking.eq(booking.field('status'), 'confirmed'),
            booking.eq(booking.field('status'), 'pending')
          ),
          booking.lt(booking.field('startAt'), args.endAt),
          booking.gt(booking.field('endAt'), args.startAt)
        )
      })
      .first()

    if (existingBookings) {
      throw new Error('Ce créneau est déjà réservé')
    }

    const blockedSlot = await context.db
      .query('blockedSlots')
      .withIndex('by_courtId_startAt', (indexQuery) => {
        return indexQuery.eq('courtId', args.courtId)
      })
      .filter((blocked) => {
        return blocked.and(
          blocked.lt(blocked.field('startAt'), args.endAt),
          blocked.gt(blocked.field('endAt'), args.startAt)
        )
      })
      .first()

    const globalBlockedSlot = await context.db
      .query('blockedSlots')
      .filter((blocked) => {
        return blocked.and(
          blocked.eq(blocked.field('courtId'), null),
          blocked.lt(blocked.field('startAt'), args.endAt),
          blocked.gt(blocked.field('endAt'), args.startAt)
        )
      })
      .first()

    if (blockedSlot || globalBlockedSlot) {
      throw new Error('Ce créneau est bloqué')
    }

    const bookingId = await context.db.insert('bookings', {
      userId: context.user._id,
      courtId: args.courtId,
      startAt: args.startAt,
      endAt: args.endAt,
      price: court.price,
      polarPaymentId: null,
      paymentType: 'online',
      status: 'pending',
      reminderSent: false,
      createdAt: now
    })

    const conflictingBooking = await context.db
      .query('bookings')
      .withIndex('by_courtId', (indexQuery) => {
        return indexQuery.eq('courtId', args.courtId)
      })
      .filter((booking) => {
        return booking.and(
          booking.neq(booking.field('_id'), bookingId),
          booking.or(
            booking.eq(booking.field('status'), 'confirmed'),
            booking.eq(booking.field('status'), 'pending')
          ),
          booking.lt(booking.field('startAt'), args.endAt),
          booking.gt(booking.field('endAt'), args.startAt),
          booking.lt(booking.field('_creationTime'), now)
        )
      })
      .first()

    if (conflictingBooking) {
      await context.db.delete(bookingId)
      throw new Error("Ce créneau vient d'être réservé")
    }

    return { bookingId, price: court.price, courtType: court.type }
  }
})

export const confirmByPayment = internalMutation({
  args: {
    bookingId: v.id('bookings'),
    polarPaymentId: v.string()
  },
  handler: async (context, args) => {
    const booking = await context.db.get(args.bookingId)

    if (!booking) {
      throw new Error('Réservation non trouvée')
    }

    if (booking.status !== 'pending') {
      return { success: false, reason: 'already_processed' }
    }

    await context.db.patch(args.bookingId, {
      status: 'confirmed',
      polarPaymentId: args.polarPaymentId
    })

    return { success: true }
  }
})

export const cleanupExpiredPending = internalMutation({
  args: {},
  handler: async (context) => {
    const now = Date.now()
    const cutoff = now - PENDING_BOOKING_TTL_MS

    const expiredBookings = await context.db
      .query('bookings')
      .filter((booking) => {
        return booking.and(
          booking.eq(booking.field('status'), 'pending'),
          booking.lt(booking.field('createdAt'), cutoff)
        )
      })
      .collect()

    await Promise.all(
      expiredBookings.map((booking) => {
        return context.db.patch(booking._id, { status: 'expired' })
      })
    )

    return { cleaned: expiredBookings.length }
  }
})
