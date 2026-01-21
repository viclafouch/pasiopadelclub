import { eq } from 'drizzle-orm'
import type { User } from '@/constants/types'
import { db } from '@/db'
import { user, walletTransaction } from '@/db/schema'
import { createServerOnlyFn } from '@tanstack/react-start'

export const anonymizeUser = createServerOnlyFn(async (userId: User['id']) => {
  await db
    .update(user)
    .set({
      name: 'Utilisateur supprime',
      firstName: 'Utilisateur',
      lastName: 'supprime',
      email: `deleted-${userId}@anonymized.local`,
      phone: null,
      emailVerified: false,
      isAnonymized: true,
      updatedAt: new Date()
    })
    .where(eq(user.id, userId))

  await db
    .update(walletTransaction)
    .set({ description: null })
    .where(eq(walletTransaction.userId, userId))
})
