import { mutation } from './_generated/server'

export const seedCourts = mutation({
  args: {},
  handler: async (ctx) => {
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
      const existing = await ctx.db
        .query('courts')
        .filter((q) => q.eq(q.field('name'), courtData.name))
        .first()

      if (!existing) {
        await ctx.db.insert('courts', courtData)
        inserted++
      } else {
        skipped++
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
