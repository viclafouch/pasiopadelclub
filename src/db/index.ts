import { drizzle } from 'drizzle-orm/neon-serverless'
import ws from 'ws'
import { serverEnv } from '@/env/server'
import { neonConfig, Pool } from '@neondatabase/serverless'
import * as schema from './schema'

neonConfig.webSocketConstructor = ws

const pool = new Pool({ connectionString: serverEnv.DATABASE_URL })

export const db = drizzle({ client: pool, schema })
