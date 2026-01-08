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
    const courts = await ctx.db.query('courts').collect()

    return courts.filter((court) => {
      return court.isActive
    })
  }
})

export const getById = query({
  args: { courtId: v.id('courts') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.courtId)
  }
})
