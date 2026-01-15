/* eslint-disable no-console */
import { and, eq, gt, lt } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { booking, court, user } from '@/db/schema'
import { serverEnv } from '@/env/server'
import { Webhooks } from '@polar-sh/tanstack-start'
import { createFileRoute } from '@tanstack/react-router'

const slotDataSchema = z.object({
  courtId: z.uuid(),
  startAt: z.number(),
  endAt: z.number()
})

const maskEmail = (email: string) => {
  const [local, domain] = email.split('@')

  return `${local?.[0] ?? '?'}***@${domain}`
}

const maskId = (id: string) => {
  return `${id.slice(0, 8)}...`
}

const webhookHandler = Webhooks({
  webhookSecret: serverEnv.POLAR_WEBHOOK_SECRET,
  onOrderPaid: async (payload) => {
    const { metadata, id: polarPaymentId, customer } = payload.data

    if (!metadata?.referenceId) {
      console.error('[Webhook] Missing referenceId')

      return
    }

    if (!customer?.email) {
      console.error('[Webhook] Missing customer email')

      return
    }

    const slotDataResult = slotDataSchema.safeParse(
      JSON.parse(metadata.referenceId as string)
    )

    if (!slotDataResult.success) {
      console.error('[Webhook] Invalid referenceId format')

      return
    }

    const { courtId, startAt, endAt } = slotDataResult.data
    const startDate = new Date(startAt)
    const endDate = new Date(endAt)

    const [existingPayment] = await db
      .select({ id: booking.id })
      .from(booking)
      .where(eq(booking.polarPaymentId, polarPaymentId))
      .limit(1)

    if (existingPayment) {
      console.log(
        '[Webhook] Payment already processed:',
        maskId(polarPaymentId)
      )

      return
    }

    const [[userData], [courtData], existingBookings] = await Promise.all([
      db.select().from(user).where(eq(user.email, customer.email)).limit(1),
      db.select().from(court).where(eq(court.id, courtId)).limit(1),
      db
        .select({ id: booking.id })
        .from(booking)
        .where(
          and(
            eq(booking.courtId, courtId),
            eq(booking.status, 'confirmed'),
            lt(booking.startAt, endDate),
            gt(booking.endAt, startDate)
          )
        )
        .limit(1)
    ])

    if (!userData) {
      console.error('[Webhook] User not found:', maskEmail(customer.email))

      return
    }

    if (!courtData) {
      console.error('[Webhook] Court not found:', maskId(courtId))

      return
    }

    if (existingBookings.length > 0) {
      console.error('[Webhook] Slot conflict - manual refund needed:', {
        courtId: maskId(courtId),
        paymentId: maskId(polarPaymentId)
      })

      return
    }

    try {
      const [newBooking] = await db
        .insert(booking)
        .values({
          userId: userData.id,
          courtId,
          startAt: startDate,
          endAt: endDate,
          price: courtData.price,
          paymentType: 'online',
          status: 'confirmed',
          polarPaymentId
        })
        .returning()

      console.log('[Webhook] Booking created:', maskId(newBooking?.id ?? ''))
    } catch (error) {
      const isUniqueViolation =
        error instanceof Error && error.message.includes('unique')

      if (isUniqueViolation) {
        console.log(
          '[Webhook] Duplicate payment ignored:',
          maskId(polarPaymentId)
        )

        return
      }

      throw error
    }
  }
})

export const Route = createFileRoute('/api/webhooks/polar')({
  server: {
    handlers: {
      POST: webhookHandler
    }
  }
})
