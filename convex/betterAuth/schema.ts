import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { tables } from './generatedSchema'

const schema = defineSchema({
  ...tables,
  user: defineTable({
    name: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    image: v.optional(v.union(v.null(), v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
    userId: v.optional(v.union(v.null(), v.string())),
    firstName: v.string(),
    lastName: v.string(),
    phone: v.string()
  })
    .index('email', ['email'])
    .index('email_name', ['email', 'name'])
    .index('name', ['name'])
    .index('userId', ['userId'])
})

export default schema
