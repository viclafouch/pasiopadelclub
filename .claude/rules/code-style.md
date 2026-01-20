## Code Style

Expert code simplification and review specialist. Enhances code clarity, consistency, and maintainability while preserving exact functionality. Prioritizes readable, explicit code over compact solutions.

## Scope

Analyze recently modified code and apply refinements. Focus on code touched in the current session unless instructed otherwise.

## Core Principles

### 1. Preserve Functionality
Never change what the code does - only how it does it. All original features, outputs, and behaviors must remain intact.

### 2. Clarity Over Brevity
- **Avoid nested ternaries** - prefer switch/if-else for multiple conditions
- Choose explicit code over compact one-liners
- Dense code is not better code

### 3. Maintain Balance
Avoid over-simplification that could:
- Reduce maintainability
- Create "clever" solutions hard to understand
- Combine too many concerns
- Remove helpful abstractions
- Prioritize "fewer lines" over readability

## Review Checklist

### Naming Conventions
- Variables: descriptive, meaningful names
- Booleans: `is*`, `has*`, `should*`, `can*`
- Boolean functions: `matchIs*`, `matchAs*`
- Event handlers: `handle*`, `on*`
- No single-letter variables
- No abbreviations unless universal (`id`, `url`, `api`)

### Self-Documented Code
- Code readable without comments
- Complex logic extracted into well-named functions
- Magic numbers replaced with named constants
- No comments - code should speak for itself

### JSX
- No empty lines between sibling JSX elements (blank lines are forbidden inside JSX blocks)

### Conditionals
- **Always use ternary** instead of `&&` for conditional expressions

### No Unnecessary Abstractions
**FORBIDDEN:**
- Wrapper functions that just call another function
- Re-exporting without transformation
- Abstractions "for future use"

**Justified when:**
- Adding error handling, logging, or transformation
- Combining multiple calls
- Providing simpler API for complex operations

### Function Parameters
- **Max 2 positional parameters** - use object destructuring beyond that
- Define a dedicated type for the params object (named `*Params`)
- Required properties first, optional last in type definition
- Destructure directly in function signature, not in body

### Code Structure
- Functions do one thing well
- Under 30 lines when possible
- Max 3 levels of nesting
- Early returns over nested conditions
- Group related code together

### Accessibility (Forms & Interactive Elements)
- Labels with `htmlFor`/`id` matching
- `aria-invalid`, `aria-describedby` on inputs
- `role="alert"` on error messages
- `aria-busy` on loading buttons
- `aria-hidden` on decorative icons

### No Mutations

Never mutate objects or arrays. Always return new instances.
Use `toSorted()`, `toReversed()`, spread operators, etc.

### Modern Web APIs
Always use native modern APIs (Intl, URLSearchParams, structuredClone, etc.) instead of manual implementations or libraries.

### Single Source of Truth

**NEVER duplicate constants, helpers, or types across files.**

**Global constants** (used across multiple features):
- `src/constants/` - One file per domain (`booking.ts`, `court.ts`)
- `src/constants/types.ts` - Shared types
- `src/helpers/` - Pure utility functions

**Component-specific constants** (used only by one component/feature):
- Co-locate with the component in a `constants.ts` file
- Example: `booking-modal/constants.ts` for modal-specific config
- Import with relative path: `from './constants'`

Before creating a constant or helper, search if it already exists.

### Helpers vs Utils

All utilities live in `src/` (shared by frontend and backend):

- `src/lib/` - Generic utilities (cn, etc.)
- `src/helpers/` - Generic pure functions (date formatting, string manipulation)
- `src/utils/` - Business utilities (booking logic, user logic, etc.)
- `src/constants/` - All constants, grouped by domain

`src/db/` contains Drizzle schema and database client.
`src/server/` contains server functions (TanStack Start).

**Rules:**
- Pure functions, no side effects
- One file per domain