import { and, eq, gte, lt } from 'drizzle-orm'
import { getSlotsByDateSchema } from '@/constants/schemas'
import { db } from '@/db'
import { blockedSlot, booking, court } from '@/db/schema'
import { parseDateKey } from '@/helpers/date'
import { buildCourtsWithSlots } from '@/helpers/slots'
import { auth } from '@/lib/auth'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

export const getSlotsByDateFn = createServerFn({ method: 'GET' })
  .inputValidator(getSlotsByDateSchema)
  .handler(async ({ data }) => {
    const { date } = data
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    const currentUserId = session?.user.id
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

    return buildCourtsWithSlots({
      courts,
      bookings,
      blockedSlots,
      baseDate,
      currentUserId
    })
  })
