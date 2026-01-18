import { z } from 'zod'

const userUpdateDataSchema = z.object({
  emailVerified: z.boolean().optional(),
  email: z.string(),
  name: z.string()
})

export function parseUserUpdateData(data: unknown) {
  return userUpdateDataSchema.safeParse(data)
}

export function matchWasEmailVerified(previousData: unknown) {
  const result = z
    .object({ emailVerified: z.boolean() })
    .safeParse(previousData)

  return result.success && result.data.emailVerified
}
