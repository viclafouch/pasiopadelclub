/* eslint-disable no-await-in-loop */
import { v } from 'convex/values'
import { mutation } from './_generated/server'

export const seedCourts = mutation({
  args: {},
  handler: async (context) => {
    const courtsData = [
      {
        name: 'Court N°1',
        type: 'double' as const,
        location: 'indoor' as const,
        capacity: 4 as const,
        duration: 90 as const,
        price: 60,
        isActive: true
      },
      {
        name: 'Court N°2',
        type: 'double' as const,
        location: 'indoor' as const,
        capacity: 4 as const,
        duration: 90 as const,
        price: 60,
        isActive: true
      },
      {
        name: 'Court N°3',
        type: 'double' as const,
        location: 'outdoor' as const,
        capacity: 4 as const,
        duration: 90 as const,
        price: 60,
        isActive: true
      },
      {
        name: 'Court N°4',
        type: 'double' as const,
        location: 'outdoor' as const,
        capacity: 4 as const,
        duration: 90 as const,
        price: 60,
        isActive: true
      },
      {
        name: 'Simple N°1',
        type: 'simple' as const,
        location: 'indoor' as const,
        capacity: 2 as const,
        duration: 60 as const,
        price: 30,
        isActive: true
      },
      {
        name: 'Court Kids',
        type: 'kids' as const,
        location: 'indoor' as const,
        capacity: 2 as const,
        duration: 60 as const,
        price: 15,
        isActive: true
      }
    ]

    let inserted = 0
    let skipped = 0

    for (const courtData of courtsData) {
      const existing = await context.db
        .query('courts')
        .filter((item) => {
          return item.eq(item.field('name'), courtData.name)
        })
        .first()

      if (!existing) {
        await context.db.insert('courts', courtData)
        inserted += 1
      } else {
        skipped += 1
      }
    }

    return {
      success: true,
      message: `Courts initialized: ${inserted} inserted, ${skipped} already existed`
    }
  }
})

export const createTestUser = mutation({
  args: {},
  handler: async (context) => {
    const identity = await context.auth.getUserIdentity()

    if (identity === null) {
      throw new Error("Non authentifié - connectez-vous d'abord")
    }

    const existingUser = await context.db
      .query('users')
      .withIndex('by_clerkId', (indexQuery) => {
        return indexQuery.eq('clerkId', identity.subject)
      })
      .first()

    if (existingUser) {
      return {
        success: true,
        message: 'Utilisateur existe déjà',
        userId: existingUser._id
      }
    }

    const userId = await context.db.insert('users', {
      clerkId: identity.subject,
      role: 'user',
      isBlocked: false,
      isAnonymized: false,
      createdAt: Date.now()
    })

    return {
      success: true,
      message: 'Utilisateur créé',
      userId
    }
  }
})

export const seedTestBookings = mutation({
  args: { userId: v.id('users') },
  handler: async (context, args) => {
    const user = await context.db.get(args.userId)

    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }

    const courts = await context.db.query('courts').collect()

    if (courts.length === 0) {
      throw new Error('Aucun terrain - exécutez seedCourts')
    }

    const doubleCourt = courts.find((court) => {
      return court.type === 'double'
    })
    const simpleCourt = courts.find((court) => {
      return court.type === 'simple'
    })

    if (!doubleCourt || !simpleCourt) {
      throw new Error('Courts double et simple requis')
    }

    const tomorrow10h = new Date()
    tomorrow10h.setDate(tomorrow10h.getDate() + 1)
    tomorrow10h.setHours(10, 0, 0, 0)

    const tomorrow1130 = new Date(tomorrow10h)
    tomorrow1130.setHours(11, 30, 0, 0)

    const nextWeek14h = new Date()
    nextWeek14h.setDate(nextWeek14h.getDate() + 7)
    nextWeek14h.setHours(14, 0, 0, 0)

    const nextWeek15h = new Date(nextWeek14h)
    nextWeek15h.setHours(15, 0, 0, 0)

    const testBookings = [
      {
        userId: user._id,
        courtId: doubleCourt._id,
        startAt: tomorrow10h.getTime(),
        endAt: tomorrow1130.getTime(),
        price: doubleCourt.price,
        polarPaymentId: 'test_payment_1',
        paymentType: 'online' as const,
        status: 'confirmed' as const,
        reminderSent: false,
        createdAt: Date.now()
      },
      {
        userId: user._id,
        courtId: simpleCourt._id,
        startAt: nextWeek14h.getTime(),
        endAt: nextWeek15h.getTime(),
        price: simpleCourt.price,
        polarPaymentId: 'test_payment_2',
        paymentType: 'online' as const,
        status: 'confirmed' as const,
        reminderSent: false,
        createdAt: Date.now()
      }
    ]

    for (const booking of testBookings) {
      await context.db.insert('bookings', booking)
    }

    return {
      success: true,
      message: `${testBookings.length} réservations de test créées`
    }
  }
})

export const promoteToAdmin = mutation({
  args: { userId: v.id('users'), adminSecret: v.string() },
  handler: async (context, args) => {
    const expectedSecret = process.env.ADMIN_PROMOTION_SECRET

    if (!expectedSecret || args.adminSecret !== expectedSecret) {
      throw new Error('Non autorisé')
    }

    const user = await context.db.get(args.userId)

    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }

    if (user.role === 'admin') {
      return { success: false, message: 'Déjà admin' }
    }

    await context.db.patch(args.userId, { role: 'admin' })

    return { success: true, message: 'Promu admin' }
  }
})
