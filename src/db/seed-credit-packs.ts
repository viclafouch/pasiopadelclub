import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { creditPack } from './schema'

config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle({ client: sql })

const creditPacksData = [
  {
    name: 'Starter',
    priceCents: 15000,
    creditsCents: 16000,
    validityMonths: 6,
    isActive: true
  },
  {
    name: 'Pro',
    priceCents: 30000,
    creditsCents: 33000,
    validityMonths: 12,
    isActive: true
  },
  {
    name: 'Premium',
    priceCents: 50000,
    creditsCents: 57500,
    validityMonths: 12,
    isActive: true
  }
]

const main = async () => {
  // eslint-disable-next-line no-console
  console.log('Seeding credit packs...')

  const inserted = await db
    .insert(creditPack)
    .values(creditPacksData)
    .returning()

  // eslint-disable-next-line no-console
  console.log(`Inserted ${inserted.length} credit packs`)
}

main()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Seed completed')
    process.exit(0)
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Seed failed:', error)
    process.exit(1)
  })
