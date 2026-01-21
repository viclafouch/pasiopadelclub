/* eslint-disable camelcase */
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe.server'
import { createServerOnlyFn } from '@tanstack/react-start'

type RefundReason = 'duplicate' | 'fraudulent' | 'requested_by_customer'

type SafeRefundParams = {
  paymentIntentId: string
  amountCents?: number
  reason?: RefundReason
}

type SafeRefundResult =
  | { success: true }
  | { success: false; alreadyRefunded: true }
  | { success: false; alreadyRefunded: false; error: unknown }

export const safeRefund = createServerOnlyFn(
  async ({
    paymentIntentId,
    amountCents,
    reason = 'requested_by_customer'
  }: SafeRefundParams): Promise<SafeRefundResult> => {
    try {
      await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amountCents,
        reason
      })

      return { success: true }
    } catch (error) {
      const isAlreadyRefunded =
        error instanceof Stripe.errors.StripeInvalidRequestError &&
        error.code === 'charge_already_refunded'

      if (isAlreadyRefunded) {
        return { success: false, alreadyRefunded: true }
      }

      return { success: false, alreadyRefunded: false, error }
    }
  }
)
