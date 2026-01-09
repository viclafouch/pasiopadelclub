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
- Use types from libraries as possible
- NEVER recreate types that exist in schemas or libraries

### Async/Await
- Always handle promise rejections
- Avoid floating promises (unhandled)