import {
  customMutation,
  customQuery
} from 'convex-helpers/server/customFunctions'
import type { Id } from './_generated/dataModel'
import { mutation, query } from './_generated/server'

type AuthenticatedUser = {
  _id: Id<'users'>
  clerkId: string
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  role: 'user' | 'admin'
  isBlocked: boolean
}

/**
 * Query qui requiert une authentification.
 * Ajoute `user` au contexte avec les données Clerk + Convex fusionnées.
 */
export const authenticatedQuery = customQuery(query, {
  args: {},
  input: async (context) => {
    const identity = await context.auth.getUserIdentity()

    if (identity === null) {
      throw new Error('Non authentifié')
    }

    const dbUser = await context.db
      .query('users')
      .withIndex('by_clerkId', (indexQuery) => {
        return indexQuery.eq('clerkId', identity.subject)
      })
      .first()

    if (!dbUser) {
      throw new Error('Utilisateur non trouvé')
    }

    if (dbUser.isBlocked) {
      throw new Error('Compte bloqué')
    }

    const user: AuthenticatedUser = {
      _id: dbUser._id,
      clerkId: identity.subject,
      email: identity.email ?? '',
      firstName: identity.givenName ?? null,
      lastName: identity.familyName ?? null,
      phone: dbUser.phone ?? null,
      role: dbUser.role,
      isBlocked: dbUser.isBlocked
    }

    // eslint-disable-next-line id-denylist -- required by convex-helpers API
    return { ctx: { user }, args: {} }
  }
})

/**
 * Mutation qui requiert une authentification.
 * Ajoute `user` au contexte avec les données Clerk + Convex fusionnées.
 */
export const authenticatedMutation = customMutation(mutation, {
  args: {},
  input: async (context) => {
    const identity = await context.auth.getUserIdentity()

    if (identity === null) {
      throw new Error('Non authentifié')
    }

    const dbUser = await context.db
      .query('users')
      .withIndex('by_clerkId', (indexQuery) => {
        return indexQuery.eq('clerkId', identity.subject)
      })
      .first()

    if (!dbUser) {
      throw new Error('Utilisateur non trouvé')
    }

    if (dbUser.isBlocked) {
      throw new Error('Compte bloqué')
    }

    const user: AuthenticatedUser = {
      _id: dbUser._id,
      clerkId: identity.subject,
      email: identity.email ?? '',
      firstName: identity.givenName ?? null,
      lastName: identity.familyName ?? null,
      phone: dbUser.phone ?? null,
      role: dbUser.role,
      isBlocked: dbUser.isBlocked
    }

    // eslint-disable-next-line id-denylist -- required by convex-helpers API
    return { ctx: { user }, args: {} }
  }
})

/**
 * Query réservée aux admins.
 */
export const adminQuery = customQuery(query, {
  args: {},
  input: async (context) => {
    const identity = await context.auth.getUserIdentity()

    if (identity === null) {
      throw new Error('Non authentifié')
    }

    const dbUser = await context.db
      .query('users')
      .withIndex('by_clerkId', (indexQuery) => {
        return indexQuery.eq('clerkId', identity.subject)
      })
      .first()

    if (!dbUser) {
      throw new Error('Utilisateur non trouvé')
    }

    if (dbUser.role !== 'admin') {
      throw new Error('Accès admin requis')
    }

    const user: AuthenticatedUser = {
      _id: dbUser._id,
      clerkId: identity.subject,
      email: identity.email ?? '',
      firstName: identity.givenName ?? null,
      lastName: identity.familyName ?? null,
      phone: dbUser.phone ?? null,
      role: dbUser.role,
      isBlocked: dbUser.isBlocked
    }

    // eslint-disable-next-line id-denylist -- required by convex-helpers API
    return { ctx: { user }, args: {} }
  }
})

/**
 * Mutation réservée aux admins.
 */
export const adminMutation = customMutation(mutation, {
  args: {},
  input: async (context) => {
    const identity = await context.auth.getUserIdentity()

    if (identity === null) {
      throw new Error('Non authentifié')
    }

    const dbUser = await context.db
      .query('users')
      .withIndex('by_clerkId', (indexQuery) => {
        return indexQuery.eq('clerkId', identity.subject)
      })
      .first()

    if (!dbUser) {
      throw new Error('Utilisateur non trouvé')
    }

    if (dbUser.role !== 'admin') {
      throw new Error('Accès admin requis')
    }

    const user: AuthenticatedUser = {
      _id: dbUser._id,
      clerkId: identity.subject,
      email: identity.email ?? '',
      firstName: identity.givenName ?? null,
      lastName: identity.familyName ?? null,
      phone: dbUser.phone ?? null,
      role: dbUser.role,
      isBlocked: dbUser.isBlocked
    }

    // eslint-disable-next-line id-denylist -- required by convex-helpers API
    return { ctx: { user }, args: {} }
  }
})
