import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'

const crons = cronJobs()

crons.interval(
  'cleanup expired pending bookings',
  { minutes: 5 },
  internal.bookings.cleanupExpiredPending
)

export default crons
