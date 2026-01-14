import { httpRouter } from 'convex/server'
import { internal } from './_generated/api'
import type { Id } from './_generated/dataModel'
import { httpAction } from './_generated/server'

const http = httpRouter()

http.route({
  path: '/confirm-booking',
  method: 'POST',
  handler: httpAction(async (context, request) => {
    const authHeader = request.headers.get('Authorization')
    const expectedToken = process.env.WEBHOOK_AUTH_TOKEN

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { bookingId, polarPaymentId } = body as {
      bookingId: string
      polarPaymentId: string
    }

    if (!bookingId || !polarPaymentId) {
      return new Response('Missing required fields', { status: 400 })
    }

    const result = await context.runMutation(
      internal.bookings.confirmByPayment,
      {
        bookingId: bookingId as Id<'bookings'>,
        polarPaymentId
      }
    )

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  })
})

export default http
