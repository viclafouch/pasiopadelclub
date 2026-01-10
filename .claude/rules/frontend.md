---
paths: "**/*.{ts,tsx}"
---

## Frontend design

### Libraries
- Use shadcn as possible. If you need a create a component, check if it's already available in the library, example with a Button, modal, tooltip, etc.

### Accessibility (WCAG 2.1 AA)
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management
- ARIA attributes usage

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