import { desc, eq } from 'drizzle-orm'
import { updateProfileSchema } from '@/constants/schemas'
import { db } from '@/db'
import { booking, session, user, walletTransaction } from '@/db/schema'
import { authMiddleware } from '@/lib/middleware'
import { anonymizeUser } from '@/utils/user'
import { createServerFn } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'

export const updateProfileFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(updateProfileSchema)
  .handler(async ({ data, context }) => {
    const { firstName, lastName, phone } = data

    await db
      .update(user)
      .set({
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        phone: phone || null,
        updatedAt: new Date()
      })
      .where(eq(user.id, context.session.user.id))

    return { success: true }
  })

export const anonymizeAccountFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await anonymizeUser(context.session.user.id)

    return { success: true }
  })

export const exportMyDataFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.session.user.id

    const [currentUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1)

    if (!currentUser) {
      setResponseStatus(404)
      throw new Error('Utilisateur introuvable')
    }

    const [userBookings, userTransactions, userSessions] = await Promise.all([
      db.select().from(booking).where(eq(booking.userId, userId)),
      db
        .select()
        .from(walletTransaction)
        .where(eq(walletTransaction.userId, userId)),
      db
        .select()
        .from(session)
        .where(eq(session.userId, userId))
        .orderBy(desc(session.createdAt))
        .limit(10)
    ])

    return {
      user: {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone,
        createdAt: currentUser.createdAt,
        updatedAt: currentUser.updatedAt
      },
      bookings: userBookings.map((userBooking) => {
        return {
          id: userBooking.id,
          courtId: userBooking.courtId,
          startAt: userBooking.startAt,
          endAt: userBooking.endAt,
          price: userBooking.price,
          status: userBooking.status,
          createdAt: userBooking.createdAt
        }
      }),
      walletTransactions: userTransactions.map((transaction) => {
        return {
          id: transaction.id,
          type: transaction.type,
          amountCents: transaction.amountCents,
          description: transaction.description,
          expiresAt: transaction.expiresAt,
          createdAt: transaction.createdAt
        }
      }),
      recentSessions: userSessions.map((userSession) => {
        return {
          ipAddress: userSession.ipAddress,
          userAgent: userSession.userAgent,
          createdAt: userSession.createdAt,
          expiresAt: userSession.expiresAt
        }
      })
    }
  })
