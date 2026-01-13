---
paths: "**/*.{ts,tsx}"
---

## Frontend design

### React
- Use `React.useState`, `React.useEffect`, etc. — never destructure React imports.
- **Use `useMutation`** for async operations (forms, API calls) instead of multiple `useState` and manual state management for loading/success/error.
- **NEVER use `useCallback` or `useMemo`** unless you have a proven performance problem. These are premature optimizations that add complexity without benefit in 99% of cases. Only valid uses:
  - Passing callbacks to heavily memoized child components (`React.memo`)
  - Expensive computations that are measurably slow (profile first)
  - Dependencies in `useEffect` that would cause infinite loops without memoization

### Libraries
- ALWAYS use shadcn components instead of raw HTML elements, `<Input>` instead of `<input>`,`<Textarea>` instead of `<textarea>`, etc.
- Do not update the code in the `src/components/ui` folder, just fix the linter errors.

### TanStack Query
- **Never destructure** `useQuery`/`useSuspenseQuery` results - use inferred types
- Name variables with `*Query` suffix: `const currentUserQuery = useSuspenseQuery(...)`
- Access data via `query.data`, status via `query.isPending`, etc.

### Forms
- **TanStack Form** for form state management
- **Zod** for validation schemas
- **useMutation** (TanStack Query) for submission

### Accessibility (WCAG 2.1 AA)
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management
- ARIA attributes usage

### UX Patterns
- **Never disable buttons** - always allow clicks, explain constraints in dialog/feedback
- Show "why not" instead of blocking - users understand context better than silent disabled states

### JSX Size Limit
- **Max 200 lines** for components with specific logic (forms, modals, interactive features)
- Split into sub-components when exceeded (e.g., FormField, SuccessState, etc.)
- Static content pages (mentions légales, CGV) are exempt

### Separation of Concerns
- Each file has **one clear responsibility**
- Extract logic into dedicated files organized by domain (`components/auth/`, `hooks/`, `lib/`)
- Keep entry points minimal - they orchestrate, not implement

### Component Architecture
- Reusable component patterns
- Props API design
- State management decisions
- Composition vs inheritance
- Error boundary placement

### Responsive Design
- Mobile-first approach
- Breakpoint strategy
- Touch-friendly interactions
- Drawer patterns (mobile filters)
- Adaptive layouts

### Performance
- Core Web Vitals optimization
- Bundle size management
- Lazy loading strategies
- Image optimization
- Font loading

### Tailwind CSS
- **No arbitrary values in components** (e.g., `font-[Bricolage_Grotesque]`, `text-[14px]`)
- Define custom utilities in global CSS (`app.css`) and reuse them
- Keep styling consistent: one source of truth for design tokens (fonts, colors, spacing)
- If a value is used more than once, it should be a utility class or CSS variable

### Animations (Framer Motion)
- **Use Framer Motion** for all UI animations - no CSS transitions for interactive elements
- **AnimatePresence** for enter/exit animations (notifications, modals, toasts)
- **layout prop** for smooth layout shifts when elements appear/disappear
- **Prefer `motion` components** over CSS animations for:
  - Notifications and alerts (slide in/out)
  - Modal/dialog transitions
  - List item additions/removals
  - Page transitions
  - Hover/tap interactions
- **Respect `prefers-reduced-motion`** - use `useReducedMotion()` hook
- **Standard durations**: 0.2s (fast), 0.3s (normal), 0.5s (slow)
- **Standard easings**: `[0.4, 0, 0.2, 1]` (ease-out), `[0.4, 0, 1, 1]` (ease-in)