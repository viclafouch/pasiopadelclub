---
paths: "**/*.{ts,tsx}"
---

## Senior Frontend Principles

### URL as State (Critical)
**The URL is the primary source of truth for shareable application state.**

Always persist to URL:
- Tab/panel selection
- Filters, sorting, pagination
- Modal/drawer open states (when shareable)
- Search queries
- Selected items

Benefits: bookmarkable, shareable, back/forward navigation works, SEO-friendly.

Use React state only for:
- Ephemeral UI (hover, focus, animations)
- Form input before submission
- Loading/error states

### Data Fetching Strategy
- **Prefetch visible content** (await in loader)
- **Background prefetch** for likely next actions (no await)
- **Never waterfall** - parallel requests when possible
- **Cache first** - leverage TanStack Query cache

### Performance Mindset
- Measure before optimizing (React DevTools, Lighthouse)
- Lazy load routes and heavy components
- Avoid layout shifts (skeleton matching final layout)
- Minimize re-renders (proper key usage, state colocation)

### Component Architecture
- **Colocation** - state lives closest to where it's used
- **Composition over props drilling** - use children, slots
- **Controlled components** for forms with external state
- **Uncontrolled + ref** for simple forms

### Accessibility by Default
- Semantic HTML first (`button`, `nav`, `main`, `article`)
- Keyboard navigation (focus management, tab order)
- ARIA only when HTML semantics insufficient
- Color contrast + motion preferences

### Error Boundaries
- Wrap route segments, not entire app
- Provide recovery actions (retry, reset, navigate)
- Log errors for debugging

### TypeScript Strictness
- No `any`, derive types from source of truth
- Validate external data at boundaries (API, URL params)
- Use discriminated unions for state machines
