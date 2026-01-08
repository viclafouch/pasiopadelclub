import { mutation } from './_generated/server'

export const seedCourts = mutation({
  args: {},
  handler: async (ctx) => {
    const existingCourts = await ctx.db.query('courts').collect()

    if (existingCourts.length > 0) {
      return { success: false, message: 'Courts already seeded' }
    }

    const courts = [
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

    for (const court of courts) {
      await ctx.db.insert('courts', court)
    }

    return { success: true, message: '6 courts seeded successfully' }
  }
})

export const seedAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const existingAdmin = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => {
        return q.eq('email', 'admin@pasiopadelclub.fr')
      })
      .first()

    if (existingAdmin) {
      return { success: false, message: 'Admin already exists' }
    }

    await ctx.db.insert('users', {
      email: 'admin@pasiopadelclub.fr',
      emailVerified: true,
      firstName: 'Admin',
      lastName: 'Pasio',
      phone: '0971117928',
      role: 'admin',
      isBlocked: false,
      isAnonymized: false,
      createdAt: Date.now()
    })

    return { success: true, message: 'Admin user created' }
  }
})
