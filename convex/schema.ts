import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    email: v.string(),
    emailVerified: v.boolean(),
    firstName: v.string(),
    lastName: v.string(),
    phone: v.string(),
    role: v.union(v.literal('user'), v.literal('admin')),
    isBlocked: v.boolean(),
    isAnonymized: v.boolean(),
    createdAt: v.number()
  }).index('by_email', ['email']),

  courts: defineTable({
    name: v.string(),
    type: v.union(v.literal('double'), v.literal('simple'), v.literal('kids')),
    location: v.union(v.literal('indoor'), v.literal('outdoor')),
    capacity: v.union(v.literal(2), v.literal(4)),
    duration: v.union(v.literal(60), v.literal(90)),
    price: v.number(),
    isActive: v.boolean()
  }),

  bookings: defineTable({
    userId: v.id('users'),
    courtId: v.id('courts'),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    price: v.number(),
    polarPaymentId: v.union(v.string(), v.null()),
    paymentType: v.union(v.literal('online'), v.literal('free')),
    status: v.union(
      v.literal('pending'),
      v.literal('confirmed'),
      v.literal('completed'),
      v.literal('cancelled')
    ),
    reminderSent: v.boolean(),
    createdAt: v.number()
  })
    .index('by_date', ['date'])
    .index('by_userId', ['userId'])
    .index('by_courtId', ['courtId'])
    .index('by_status', ['status'])
    .index('by_userId_status', ['userId', 'status']),

  blockedSlots: defineTable({
    courtId: v.union(v.id('courts'), v.null()),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    reason: v.optional(v.string()),
    createdAt: v.number()
  })
    .index('by_date', ['date'])
    .index('by_courtId', ['courtId'])
})
