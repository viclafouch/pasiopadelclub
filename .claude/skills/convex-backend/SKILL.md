---
name: convex-backend
description: Expert Convex backend development. Use when working on database schema, queries, mutations, actions, or scheduled functions in the convex/ directory.
---

This skill guides Convex backend development for Pasio Padel Club. Always read `.claude/plan.md` first for the data model and business rules.

## Schema

Four tables: `users`, `courts`, `bookings`, `blockedSlots`. See plan for complete TypeScript definitions.

## Patterns

- **Queries**: Read-only, no side effects. Use indexes for performance.
- **Mutations**: Validate inputs with `v.object()` or Zod. One mutation = one atomic transaction.
- **Actions**: External calls only (Polar, Resend). Never call actions from mutations directly.
- **Scheduled Functions**: Use `crons.ts` for recurring tasks (email reminders).

## Business Rules to Enforce

- Max 2 active reservations per user
- Bookings up to 10 days in advance
- Cancellation only if > 24h before slot
- User blocking triggers automatic cancellation + refund of all future bookings
- Admin slot blocking triggers automatic cancellation + refund of affected bookings

## Code Style

- Strict TypeScript, no `any`
- Use `ConvexError` for business errors
- Create indexes for frequent queries
- Validate at mutation boundaries
