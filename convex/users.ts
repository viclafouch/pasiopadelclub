import { v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'
import { query } from './_generated/server'

export const getCurrent = query({
  args: {},
  handler: async (context) => {
    const userId = await getAuthUserId(context)

    if (userId === null) {
      return null
    }

    return context.db.get(userId)
  }
})

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (context, args) => {
    const userId = await getAuthUserId(context)

    if (userId === null) {
      throw new Error('Unauthorized: Authentication required')
    }

    const currentUser = await context.db.get(userId)

    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required')
    }

    return context.db
      .query('users')
      .withIndex('email', (item) => {
        return item.eq('email', args.email)
      })
      .first()
  }
})

export const getById = query({
  args: { userId: v.id('users') },
  handler: async (context, args) => {
    const currentUserId = await getAuthUserId(context)

    if (currentUserId === null) {
      throw new Error('Unauthorized: Authentication required')
    }

    const currentUser = await context.db.get(currentUserId)

    if (!currentUser) {
      throw new Error('Unauthorized: User not found')
    }

    const isOwnProfile = currentUserId === args.userId
    const isAdmin = currentUser.role === 'admin'

    if (!isOwnProfile && !isAdmin) {
      throw new Error('Unauthorized: Cannot access other user profiles')
    }

    return context.db.get(args.userId)
  }
})
