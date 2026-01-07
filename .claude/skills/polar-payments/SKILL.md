---
name: polar-payments
description: Expert Polar payment integration. Use when implementing checkout, webhooks, or refunds for court reservations.
---

This skill guides Polar payment integration for Pasio Padel Club. Read `.claude/plan.md` for pricing and refund rules.

## Products

| Product | Price |
|---------|-------|
| Court Double | 60€ |
| Court Simple | 30€ |
| Court Kids | 15€ |

## Payment Flow

1. User selects slot → Create booking with `status: "pending"`
2. Initiate Polar Checkout session
3. Redirect to Polar
4. Webhook received → Update booking `status: "confirmed"` or delete if failed
5. Redirect to `/reservation/success` or `/reservation/echec`

## Webhooks

- Always verify signature with `POLAR_WEBHOOK_SECRET`
- Handle idempotency (webhooks may arrive multiple times)
- Respond 200 quickly, process async if needed
- Key events: `order.created` (payment success), `order.refunded`

## Refund Triggers

- User cancellation (> 24h before slot)
- Admin blocks slot with existing bookings
- Admin blocks user with future bookings

## Error Handling

- Polar down: Display "Paiement temporairement indisponible, réessayez plus tard"
- Log all Polar events for debugging
- Never expose API keys in client code
