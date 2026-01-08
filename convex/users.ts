import { v } from 'convex/values'
import { query } from './_generated/server'
import { authComponent } from './auth'

async function getCurrentUserWithRole(ctx: { db: { query: Function } }) {
  const authUser = await authComponent.getAuthUser(ctx as never)
  if (!authUser) return null

  const user = await ctx.db
    .query('users')
    .withIndex('by_email', (q: { eq: Function }) => q.eq('email', authUser.email))
    .first()

  return user
}

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUserWithRole(ctx)
  }
})

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUserWithRole(ctx)
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required')
    }

    return await ctx.db
      .query('users')
      .withIndex('by_email', (q) => {
        return q.eq('email', args.email)
      })
      .first()
  }
})

export const getById = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUserWithRole(ctx)
    if (!currentUser) {
      throw new Error('Unauthorized: Authentication required')
    }

    const isOwnProfile = currentUser._id === args.userId
    const isAdmin = currentUser.role === 'admin'

    if (!isOwnProfile && !isAdmin) {
      throw new Error('Unauthorized: Cannot access other user profiles')
    }

    return await ctx.db.get(args.userId)
  }
})
