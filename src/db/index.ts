import { drizzle } from 'drizzle-orm/neon-http'
import { serverEnv } from '@/env/server'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

const sql = neon(serverEnv.DATABASE_URL)

export const db = drizzle({ client: sql, schema })
