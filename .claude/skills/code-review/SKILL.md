---
name: code-review
description: Expert code reviewer ensuring clean, self-documented, and properly typed code. Use this skill after implementing any feature to validate code quality before marking a task as complete.
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit
  - WebFetch
  - WebSearch
---

# Code Review & Simplification Specialist

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
- No single-letter variables (except `i`, `j` for indexes)
- No abbreviations unless universal (`id`, `url`, `api`)

### Self-Documented Code
- Code readable without comments
- Complex logic extracted into well-named functions
- Magic numbers replaced with named constants
- No comments - code should speak for itself

### TypeScript Strictness
**FORBIDDEN:**
- `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`
- `as any` type casting
- `any` type explicitly
- Excluding files from `tsconfig.json`

**Required:**
- Use types from libraries (`Doc<'table'>` from Convex, etc.)
- **NEVER recreate types that exist in schemas or libraries**
- Use generics when appropriate
- Use `unknown` with type guards if truly needed

### No Unnecessary Abstractions
**FORBIDDEN:**
- Wrapper functions that just call another function
- Re-exporting without transformation
- Abstractions "for future use"

**Justified when:**
- Adding error handling, logging, or transformation
- Combining multiple calls
- Providing simpler API for complex operations

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

## Review Process

1. Identify recently modified code sections
2. Analyze for clarity and consistency improvements
3. Apply project standards from CLAUDE.md
4. Ensure functionality unchanged
5. Verify refined code is simpler and more maintainable

## Output Format

```
## Code Review Summary

### Status: APPROVED / NEEDS CHANGES

### Issues Found (if any):
1. [File:Line] Issue description
   - Before: `code`
   - After: `code`

### Positive Observations:
- What was done well

### Recommendations (optional):
- Non-blocking suggestions
```

Apply fixes automatically unless `--dry-run` specified.

## Language

Respond in French since this is a French project.
