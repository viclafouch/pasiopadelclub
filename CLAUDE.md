# Pasio Padel Club - Project Guidelines

## Project Overview

Site vitrine pour un club de padel utilisant React 19, TanStack Router avec SSR, Tailwind CSS 4, et Vite.

## Global Standards

### Language & Naming
- Use English for the entire codebase (variable names, function names, file names, documentation), except for user-facing content which may be in French.
- Do not write comments. They are not needed.
- Boolean variables must follow: `^(is|has)[A-Z]([A-Za-z0-9]?)+` (e.g., `isActive`, `hasError`)
- Functions returning boolean must follow: `^(matchIs|matchAs)[A-Z]([A-Za-z0-9]?)+`

### Code Style
- Write code that reads like natural language
- Prefer explicit over implicit when it aids understanding
- Use meaningful variable and function names
- Keep functions small and focused on single responsibilities
- Export only what needs to be public
- Organize by feature, not by technical layer

### Error Handling
- Handle errors gracefully with clear messages
- Fail fast when appropriate, recover gracefully when possible
- Use Result types or proper error boundaries
- Validate at system boundaries with runtime checks

## TypeScript

- Use strict TypeScript configuration
- For complex objects/arrays, use `as const` or `as const satisfies T` to preserve literal types
- Prefer simple, clear type definitions over complex ones
- Use union types and discriminated unions for clarity
- Let TypeScript infer types when obvious
- Prefer `const` assertions for immutable data
- Use Zod or similar for runtime validation

Example:
```typescript
import type { LinkOptions } from '@tanstack/react-router'

const navLinks = [
  { linkOptions: { to: '/' }, label: 'Accueil' },
  { linkOptions: { to: '/tarifs' }, label: 'Tarifs' }
] as const satisfies { linkOptions: LinkOptions; label: string }[]
```

## React

- Always add `import React from 'react'` at the top of JSX files
- Always use the `React.` prefix for all React exports (e.g., `React.useState`, `React.useEffect`, `React.ReactNode`)
- Do not insert empty lines in JSX - elements must be written without blank lines between them
- When creating props for a component, always create the type like:
  ```typescript
  type ComponentNameProps = { ... }
  ```

## Tailwind CSS (v4)

### General
- Use Tailwind utility classes for consistent styling, custom CSS only for special cases
- Organize classes logically: layout, spacing, color, typography
- Use responsive variants (sm:, md:, lg:) and state variants (hover:, focus:, dark:)
- Use container queries with `@container`, `@max-*`, `@min-*` for adaptive layouts

### Configuration
- Use `@theme` directive for custom design tokens
- Prefer `oklch` color format for better gamut support
- Use `@utility` directive for custom utilities
- Use `@source` only when necessary

### Accessibility
- Pair Tailwind utilities with appropriate ARIA attributes
- Use `aria-hidden="true"` or `role="presentation"` with `hidden` or `sr-only`

## Dependencies & Configuration

- Keep dependencies minimal and purposeful
- Prefer stable, well-maintained packages
- Avoid dependencies for simple functionality
- Use exact versions for critical dependencies
- Make script names intuitive and consistent
