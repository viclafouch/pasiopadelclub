import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { court } from './schema'

config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle({ client: sql })

const courtsData = [
  {
    name: 'Court N°1',
    type: 'double' as const,
    location: 'indoor' as const,
    capacity: 4,
    duration: 90,
    price: 6000,
    isActive: true
  },
  {
    name: 'Court N°2',
    type: 'double' as const,
    location: 'indoor' as const,
    capacity: 4,
    duration: 90,
    price: 6000,
    isActive: true
  },
  {
    name: 'Court N°3',
    type: 'double' as const,
    location: 'outdoor' as const,
    capacity: 4,
    duration: 90,
    price: 6000,
    isActive: true
  },
  {
    name: 'Court N°4',
    type: 'double' as const,
    location: 'outdoor' as const,
    capacity: 4,
    duration: 90,
    price: 6000,
    isActive: true
  },
  {
    name: 'Simple N°1',
    type: 'simple' as const,
    location: 'indoor' as const,
    capacity: 2,
    duration: 60,
    price: 3000,
    isActive: true
  },
  {
    name: 'Simple Initiation',
    type: 'simple' as const,
    location: 'indoor' as const,
    capacity: 2,
    duration: 60,
    price: 3000,
    isActive: true
  },
  {
    name: 'Court Kids',
    type: 'kids' as const,
    location: 'indoor' as const,
    capacity: 2,
    duration: 60,
    price: 1500,
    isActive: true
  }
]

const main = async () => {
  // eslint-disable-next-line no-console
  console.log('Seeding courts...')

  const inserted = await db.insert(court).values(courtsData).returning()

  // eslint-disable-next-line no-console
  console.log(`Inserted ${inserted.length} courts`)
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
