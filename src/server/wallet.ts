import { and, desc, eq, gt, sql } from 'drizzle-orm'
import { db } from '@/db'
import { creditPack, walletTransaction } from '@/db/schema'
import { nowParis } from '@/helpers/date'
import { authMiddleware } from '@/lib/middleware'
import { getUserBalance } from '@/utils/wallet'
import { createServerFn } from '@tanstack/react-start'

export const getUserBalanceFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return getUserBalance(context.session.user.id)
  })

export const getWalletTransactionsFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const transactions = await db
      .select()
      .from(walletTransaction)
      .leftJoin(creditPack, eq(walletTransaction.creditPackId, creditPack.id))
      .where(eq(walletTransaction.userId, context.session.user.id))
      .orderBy(desc(walletTransaction.createdAt))
      .limit(50)

    return transactions.map((row) => {
      return {
        ...row.wallet_transaction,
        creditPack: row.credit_pack
      }
    })
  })

export const getCreditPacksFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const packs = await db
      .select()
      .from(creditPack)
      .where(eq(creditPack.isActive, true))
      .orderBy(creditPack.priceCents)

    return packs
  }
)

export const getNextExpiringCreditsFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const now = nowParis()

    const [result] = await db
      .select({
        expiresAt: walletTransaction.expiresAt,
        amount: sql<number>`SUM(${walletTransaction.amountCents}) FILTER (WHERE ${walletTransaction.expiresAt} = (
          SELECT MIN(${walletTransaction.expiresAt})
          FROM ${walletTransaction}
          WHERE ${walletTransaction.userId} = ${context.session.user.id}
          AND ${walletTransaction.expiresAt} > ${now}
          AND ${walletTransaction.amountCents} > 0
        ))`
      })
      .from(walletTransaction)
      .where(
        and(
          eq(walletTransaction.userId, context.session.user.id),
          gt(walletTransaction.expiresAt, now),
          gt(walletTransaction.amountCents, 0)
        )
      )
      .groupBy(walletTransaction.expiresAt)
      .orderBy(walletTransaction.expiresAt)
      .limit(1)

    if (!result?.expiresAt || !result.amount) {
      return null
    }

    return {
      expiresAt: result.expiresAt,
      amountCents: Number(result.amount)
    }
  })
