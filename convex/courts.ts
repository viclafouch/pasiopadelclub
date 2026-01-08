import { v } from 'convex/values'
import { query } from './_generated/server'

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('courts').collect()
  }
})

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('courts')
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect()
  }
})

export const getById = query({
  args: { courtId: v.id('courts') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.courtId)
  }
})
