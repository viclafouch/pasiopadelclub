import { sql } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['user', 'admin'])

export const courtTypeEnum = pgEnum('court_type', ['double', 'simple', 'kids'])

export const courtLocationEnum = pgEnum('court_location', ['indoor', 'outdoor'])

export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'expired'
])

export const paymentTypeEnum = pgEnum('payment_type', [
  'online',
  'free',
  'credit'
])

export const walletTransactionTypeEnum = pgEnum('wallet_transaction_type', [
  'purchase',
  'payment',
  'refund',
  'expiration'
])

export const user = pgTable('user', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: text('name').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  phone: text('phone'),
  role: userRoleEnum('role').notNull().default('user'),
  isBlocked: boolean('is_blocked').notNull().default(false),
  isAnonymized: boolean('is_anonymized').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => {
      return new Date()
    })
    .notNull()
})

export const session = pgTable(
  'session',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => {
        return new Date()
      })
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: uuid('user_id')
      .notNull()
      .references(
        () => {
          return user.id
        },
        { onDelete: 'cascade' }
      )
  },
  (table) => {
    return [index('session_userId_idx').on(table.userId)]
  }
)

export const account = pgTable(
  'account',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(
        () => {
          return user.id
        },
        { onDelete: 'cascade' }
      ),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => {
        return new Date()
      })
      .notNull()
  },
  (table) => {
    return [index('account_userId_idx').on(table.userId)]
  }
)

export const verification = pgTable(
  'verification',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => {
        return new Date()
      })
      .notNull()
  },
  (table) => {
    return [index('verification_identifier_idx').on(table.identifier)]
  }
)

export const court = pgTable('court', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: text('name').notNull(),
  type: courtTypeEnum('type').notNull(),
  location: courtLocationEnum('location').notNull(),
  capacity: integer('capacity').notNull(),
  duration: integer('duration').notNull(),
  price: integer('price').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const booking = pgTable(
  'booking',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => {
        return user.id
      }),
    courtId: uuid('court_id')
      .notNull()
      .references(() => {
        return court.id
      }),
    startAt: timestamp('start_at').notNull(),
    endAt: timestamp('end_at').notNull(),
    price: integer('price').notNull(),
    stripePaymentId: text('stripe_payment_id').unique(),
    creditTransactionId: uuid('credit_transaction_id'),
    paymentType: paymentTypeEnum('payment_type').notNull(),
    status: bookingStatusEnum('status').notNull().default('pending'),
    refundedAmountCents: integer('refunded_amount_cents'),
    reminderSent: boolean('reminder_sent').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull()
  },
  (table) => {
    return [
      index('booking_user_id_idx').on(table.userId),
      index('booking_court_id_idx').on(table.courtId),
      index('booking_start_at_idx').on(table.startAt),
      index('booking_status_idx').on(table.status),
      index('booking_user_status_idx').on(table.userId, table.status),
      index('booking_user_start_idx').on(table.userId, table.startAt.desc())
    ]
  }
)

export const blockedSlot = pgTable(
  'blocked_slot',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    courtId: uuid('court_id').references(() => {
      return court.id
    }),
    startAt: timestamp('start_at').notNull(),
    endAt: timestamp('end_at').notNull(),
    reason: text('reason'),
    createdAt: timestamp('created_at').defaultNow().notNull()
  },
  (table) => {
    return [
      index('blocked_slot_start_at_idx').on(table.startAt),
      index('blocked_slot_court_id_idx').on(table.courtId),
      index('blocked_slot_court_start_idx').on(table.courtId, table.startAt)
    ]
  }
)

export const creditPack = pgTable('credit_pack', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: text('name').notNull(),
  priceCents: integer('price_cents').notNull(),
  creditsCents: integer('credits_cents').notNull(),
  validityMonths: integer('validity_months').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const walletTransaction = pgTable(
  'wallet_transaction',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => {
        return user.id
      }),
    type: walletTransactionTypeEnum('type').notNull(),
    amountCents: integer('amount_cents').notNull(),
    balanceAfterCents: integer('balance_after_cents').notNull(),
    creditPackId: uuid('credit_pack_id').references(() => {
      return creditPack.id
    }),
    bookingId: uuid('booking_id').references(() => {
      return booking.id
    }),
    stripePaymentId: text('stripe_payment_id').unique(),
    expiresAt: timestamp('expires_at'),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull()
  },
  (table) => {
    return [
      index('wallet_transaction_user_id_idx').on(table.userId),
      index('wallet_transaction_expires_at_idx').on(table.expiresAt),
      index('wallet_transaction_user_type_idx').on(table.userId, table.type)
    ]
  }
)
