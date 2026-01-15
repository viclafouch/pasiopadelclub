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
- Use `Entity['field']` pattern to extract field types from entities
- NEVER manually type `string` or `number` for DB fields - derive from schema
- Types defined in `src/constants/types.ts` must reference Drizzle types

### Trust TypeScript Inference (CRITICAL)
- **NEVER type function return types** - trust inference
- **Use `as const satisfies Type`** for arrays/objects - combines literal preservation + type validation
- **NEVER use `: Type`** on literals - use `satisfies` instead
- Only exception for `: Type`: uninitialized variables or generic parameters

### Async/Await
- Always handle promise rejections
- Avoid floating promises (unhandled)