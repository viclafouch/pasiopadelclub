/* eslint-disable no-await-in-loop */
import { mutation } from './_generated/server'

export const seedCourts = mutation({
  args: {},
  handler: async (context) => {
    const courtsData = [
      {
        name: 'Double A',
        type: 'double' as const,
        location: 'outdoor' as const,
        capacity: 4 as const,
        duration: 90 as const,
        price: 60,
        isActive: true
      },
      {
        name: 'Double B',
        type: 'double' as const,
        location: 'outdoor' as const,
        capacity: 4 as const,
        duration: 90 as const,
        price: 60,
        isActive: true
      },
      {
        name: 'Double C',
        type: 'double' as const,
        location: 'indoor' as const,
        capacity: 4 as const,
        duration: 90 as const,
        price: 60,
        isActive: true
      },
      {
        name: 'Double D',
        type: 'double' as const,
        location: 'indoor' as const,
        capacity: 4 as const,
        duration: 90 as const,
        price: 60,
        isActive: true
      },
      {
        name: 'Simple',
        type: 'simple' as const,
        location: 'indoor' as const,
        capacity: 2 as const,
        duration: 60 as const,
        price: 30,
        isActive: true
      },
      {
        name: 'Kids',
        type: 'kids' as const,
        location: 'indoor' as const,
        capacity: 2 as const,
        duration: 60 as const,
        price: 15,
        isActive: true
      }
    ]

    let inserted = 0
    let skipped = 0

    for (const courtData of courtsData) {
      const existing = await context.db
        .query('courts')
        .filter((item) => {
          return item.eq(item.field('name'), courtData.name)
        })
        .first()

      if (!existing) {
        await context.db.insert('courts', courtData)
        inserted += 1
      } else {
        skipped += 1
      }
    }

    return {
      success: true,
      message: `Courts initialized: ${inserted} inserted, ${skipped} already existed`
    }
  }
})

export const seedAdmin = mutation({
  args: {},
  handler: async (context) => {
    const existingAdmin = await context.db
      .query('users')
      .withIndex('by_email', (indexQuery) => {
        return indexQuery.eq('email', 'admin@pasiopadelclub.fr')
      })
      .first()

    if (existingAdmin) {
      if (existingAdmin.role !== 'admin') {
        await context.db.patch(existingAdmin._id, { role: 'admin' })

        return { success: true, message: 'User promoted to admin' }
      }

      return { success: false, message: 'Admin already exists' }
    }

    return {
      success: false,
      message:
        'Create admin via signup form first, then run this to promote to admin role'
    }
  }
})
