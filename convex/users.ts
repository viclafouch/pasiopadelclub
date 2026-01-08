import { v } from 'convex/values'
import { query } from './_generated/server'
import { authComponent } from './auth'

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.getAuthUser(ctx)
  }
})

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
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
    return await ctx.db.get(args.userId)
  }
})
