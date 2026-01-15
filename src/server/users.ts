import { eq } from 'drizzle-orm'
import { updateProfileSchema } from '@/constants/schemas'
import { db } from '@/db'
import { booking, user } from '@/db/schema'
import { authMiddleware } from '@/lib/middleware'
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
    await db
      .update(user)
      .set({
        name: 'Utilisateur supprimé',
        firstName: 'Utilisateur',
        lastName: 'supprimé',
        email: `deleted-${context.session.user.id}@anonymized.local`,
        phone: null,
        emailVerified: false,
        isAnonymized: true,
        updatedAt: new Date()
      })
      .where(eq(user.id, context.session.user.id))

    return { success: true }
  })

export const exportMyDataFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const [currentUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, context.session.user.id))
      .limit(1)

    if (!currentUser) {
      setResponseStatus(404)
      throw new Error('Utilisateur introuvable')
    }

    const userBookings = await db
      .select()
      .from(booking)
      .where(eq(booking.userId, context.session.user.id))

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
      })
    }
  })
