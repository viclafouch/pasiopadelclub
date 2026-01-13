import { v } from 'convex/values'
import type { QueryCtx } from './_generated/server'
import { mutation, query } from './_generated/server'
import { authenticatedMutation } from './functions'

const findUserByClerkId = async (db: QueryCtx['db'], clerkId: string) => {
  return db
    .query('users')
    .withIndex('by_clerkId', (indexQuery) => {
      return indexQuery.eq('clerkId', clerkId)
    })
    .first()
}

export const getCurrent = query({
  args: {},
  handler: async (context) => {
    const identity = await context.auth.getUserIdentity()

    if (identity === null) {
      return null
    }

    const user = await findUserByClerkId(context.db, identity.subject)

    return {
      _id: user?._id ?? null,
      clerkId: identity.subject,
      email: identity.email ?? '',
      firstName: identity.givenName ?? null,
      lastName: identity.familyName ?? null,
      phone: user?.phone ?? null,
      role: user?.role ?? ('user' as const),
      isBlocked: user?.isBlocked ?? false
    }
  }
})

export const updatePhone = mutation({
  args: { phone: v.string() },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity()

    if (identity === null) {
      throw new Error('Non authentifié')
    }

    const user = await findUserByClerkId(context.db, identity.subject)

    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }

    await context.db.patch(user._id, { phone: args.phone })

    return { success: true }
  }
})

export const getById = query({
  args: { userId: v.id('users') },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity()

    if (identity === null) {
      throw new Error('Non authentifié')
    }

    const currentUser = await findUserByClerkId(context.db, identity.subject)

    if (!currentUser) {
      throw new Error('Utilisateur non trouvé')
    }

    const isOwnProfile = currentUser._id === args.userId
    const isAdmin = currentUser.role === 'admin'

    if (!isOwnProfile && !isAdmin) {
      throw new Error('Accès non autorisé')
    }

    return context.db.get(args.userId)
  }
})

export const setRole = mutation({
  args: {
    userId: v.id('users'),
    role: v.union(v.literal('user'), v.literal('admin'))
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity()

    if (identity === null) {
      throw new Error('Non authentifié')
    }

    const currentUser = await findUserByClerkId(context.db, identity.subject)

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Accès admin requis')
    }

    await context.db.patch(args.userId, { role: args.role })

    return { success: true }
  }
})

export const setBlocked = mutation({
  args: { userId: v.id('users'), isBlocked: v.boolean() },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity()

    if (identity === null) {
      throw new Error('Non authentifié')
    }

    const currentUser = await findUserByClerkId(context.db, identity.subject)

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Accès admin requis')
    }

    await context.db.patch(args.userId, { isBlocked: args.isBlocked })

    return { success: true }
  }
})

export const anonymize = authenticatedMutation({
  args: {},
  handler: async (context) => {
    await context.db.patch(context.user._id, {
      isAnonymized: true,
      phone: undefined
    })

    return { success: true }
  }
})

export const exportMyData = authenticatedMutation({
  args: {},
  handler: async (context) => {
    const bookings = await context.db
      .query('bookings')
      .withIndex('by_userId', (indexQuery) => {
        return indexQuery.eq('userId', context.user._id)
      })
      .collect()

    const bookingsWithCourts = await Promise.all(
      bookings.map(async (booking) => {
        const court = await context.db.get(booking.courtId)

        return {
          date: new Date(booking.startAt).toISOString(),
          startAt: new Date(booking.startAt).toISOString(),
          endAt: new Date(booking.endAt).toISOString(),
          court: court?.name ?? 'Terrain supprimé',
          courtType: court?.type ?? null,
          price: booking.price,
          status: booking.status,
          createdAt: new Date(booking.createdAt).toISOString()
        }
      })
    )

    return {
      profile: {
        email: context.user.email,
        firstName: context.user.firstName,
        lastName: context.user.lastName,
        phone: context.user.phone
      },
      bookings: bookingsWithCourts,
      exportedAt: new Date().toISOString()
    }
  }
})
