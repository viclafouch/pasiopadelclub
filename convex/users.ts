import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const getCurrent = query({
  args: {},
  handler: async (context) => {
    const identity = await context.auth.getUserIdentity()

    if (identity === null) {
      return null
    }

    const user = await context.db
      .query('users')
      .withIndex('by_clerkId', (indexQuery) => {
        return indexQuery.eq('clerkId', identity.subject)
      })
      .first()

    return user
  }
})

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity()

    if (identity === null) {
      throw new Error('Unauthorized: Authentication required')
    }

    const currentUser = await context.db
      .query('users')
      .withIndex('by_clerkId', (indexQuery) => {
        return indexQuery.eq('clerkId', identity.subject)
      })
      .first()

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required')
    }

    return context.db
      .query('users')
      .withIndex('by_email', (indexQuery) => {
        return indexQuery.eq('email', args.email)
      })
      .first()
  }
})

export const getById = query({
  args: { userId: v.id('users') },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity()

    if (identity === null) {
      throw new Error('Unauthorized: Authentication required')
    }

    const currentUser = await context.db
      .query('users')
      .withIndex('by_clerkId', (indexQuery) => {
        return indexQuery.eq('clerkId', identity.subject)
      })
      .first()

    if (!currentUser) {
      throw new Error('Unauthorized: User not found')
    }

    const isOwnProfile = currentUser._id === args.userId
    const isAdmin = currentUser.role === 'admin'

    if (!isOwnProfile && !isAdmin) {
      throw new Error('Unauthorized: Cannot access other user profiles')
    }

    return context.db.get(args.userId)
  }
})

export const createOrUpdate = mutation({
  args: {
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string())
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity()

    if (identity === null) {
      throw new Error('Unauthorized: Authentication required')
    }

    const existingUser = await context.db
      .query('users')
      .withIndex('by_clerkId', (indexQuery) => {
        return indexQuery.eq('clerkId', identity.subject)
      })
      .first()

    if (existingUser) {
      await context.db.patch(existingUser._id, {
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName
      })

      return existingUser._id
    }

    return context.db.insert('users', {
      clerkId: identity.subject,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      role: 'user',
      isBlocked: false,
      isAnonymized: false,
      createdAt: Date.now()
    })
  }
})
