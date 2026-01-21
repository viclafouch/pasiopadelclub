---
paths: "**/*.{ts,tsx}"
---

## TypeScript Rules

### Naming Conventions
- Prefer type over interface
- camelCase for functions, variables, methods
- SCREAMING_SNAKE_CASE for constants
- kebab-case for file names

### Type Safety
- NO `any`, `as any` and excluding files from `tsconfig.json`
- NO `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`
- Prefer `unknown` over `any` when type is truly unknown
- NEVER recreate types that exist in schemas or libraries
- **Reuse existing types** from libraries, React, schemas, or internal code for precision and autocompletion

### Single Source of Truth (Drizzle)
- **Drizzle schema is THE source of truth** for all database-related types
- Extract field types from entities using indexed access types
- NEVER manually type primitives for DB fields - derive from schema
- Types in constants must reference Drizzle types

### Trust TypeScript Inference (CRITICAL)
- **NEVER type function return types** - trust inference
- **Use `as const satisfies` for constant arrays/objects only** - combines literal preservation + type validation
- **Avoid explicit type annotations on literals** - use satisfies instead
- Only exception: uninitialized variables or generic parameters

### Constants Pattern (MANDATORY)
- **Arrays and Objects ONLY** - use `as const satisfies Type`
- **Primitives (number, string, boolean)** - NO `as const satisfies`, just assign directly
- Arrays: `[...] as const satisfies Type[]` (no `readonly` needed, `as const` handles it)
- Objects/Records: `{...} as const satisfies Record<Key, Value>`
- Numbers/Strings: `const MAX_COUNT = 10` (simple assignment, no `as const`)

### Async/Await & Error Handling (CRITICAL)
- **Every promise must have error handling** - no unhandled rejections
- **Backend**: wrap async calls in try/catch, throw with French message and appropriate HTTP status
- **Frontend**: every mutation/async operation must display errors to user via `getErrorMessage()`
- **Order matters**: operations that can fail externally must run BEFORE irreversible mutations
- **User-facing errors**: always in French, always displayed in UI
- **Never use `void`** for fire-and-forget promises - use `.catch(console.error)` instead