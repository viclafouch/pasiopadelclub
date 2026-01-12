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

### `satisfies` over Type Annotations
**ALWAYS use `satisfies`** instead of `: Type` for object/array literals to preserve literal types.

```typescript
// ❌ BAD - loses literal types
const OPTIONS: Intl.DateTimeFormatOptions = { day: '2-digit' }

// ✅ GOOD - validates AND preserves literal types
const OPTIONS = { day: '2-digit' } satisfies Intl.DateTimeFormatOptions
```

**Exceptions** (use `: Type`):
- Function return types when inference is wrong
- Variable declarations without initializer
- Generic type parameters

### Async/Await
- Always handle promise rejections
- Avoid floating promises (unhandled)