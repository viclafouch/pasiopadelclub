---
paths: "**/*.{ts,tsx}"
---

## Convex Rules

### Type Aliases
Use reusable type aliases from `@/constants/types` instead of `Doc<'...'>` or `Id<'...'>`.

```typescript
// BAD
import type { Doc, Id } from '~/convex/_generated/dataModel'
const court: Doc<'courts'> = ...
const id: Id<'bookings'> = ...

// GOOD
import type { Court, BookingId } from '@/constants/types'
const court: Court = ...
const id: BookingId = ...
```
