import { v } from 'convex/values'
import { authenticatedMutation, authenticatedQuery } from './functions'

const MS_PER_HOUR = 1000 * 60 * 60
const CANCELLATION_DEADLINE_HOURS = 24

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
