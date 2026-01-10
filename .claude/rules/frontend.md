---
paths: "**/*.{ts,tsx}"
---

## Frontend design

### React
- Use `React.useState`, `React.useEffect`, etc. — never destructure React imports.
- **Use `useMutation`** for async operations (forms, API calls) instead of multiple `useState` and manual state management for loading/success/error.

### Libraries
- ALWAYS use shadcn components instead of raw HTML elements, `<Input>` instead of `<input>`,`<Textarea>` instead of `<textarea>`, etc.
- Do not update the code in the `src/components/ui` folder, just fix the linter errors.

### Accessibility (WCAG 2.1 AA)
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management
- ARIA attributes usage

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