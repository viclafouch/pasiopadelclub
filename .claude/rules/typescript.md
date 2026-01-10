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

### Type Derivation
A derived type is a type computed from an existing source (constant, object, array, or another type) rather than manually duplicated.

**NEVER duplicate types that can be derived:**
- From constants: use `keyof typeof`, `typeof`, `ReturnType`, `Parameters`
- From arrays: use `typeof arr[number]`
- From existing types: use `Pick`, `Omit`, `Partial`, `Required`

This ensures type safety and single source of truth.

### Async/Await
- Always handle promise rejections
- Avoid floating promises (unhandled)