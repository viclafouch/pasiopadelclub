import { v } from 'convex/values'
import { query } from './_generated/server'

export const list = query({
  args: {},
  handler: async (context) => {
    return context.db.query('courts').collect()
  }
})

export const listActive = query({
  args: {},
  handler: async (context) => {
    return context.db
      .query('courts')
      .filter((item) => {
        return item.eq(item.field('isActive'), true)
      })
      .collect()
  }
})

export const getById = query({
  args: { courtId: v.id('courts') },
  handler: async (context, args) => {
    return context.db.get(args.courtId)
  }
})
