---
name: Frontend Accessibility
description: Build accessible user interfaces using semantic HTML, ARIA attributes, keyboard navigation, and proper color contrast. Use this skill when creating or modifying UI components, implementing forms and interactive elements, working with navigation menus, building modals and dialogs, adding images and media content, writing JSX/HTML markup, ensuring keyboard accessibility, testing with screen readers, managing focus states, implementing proper heading hierarchies, providing alternative text for images, maintaining color contrast ratios, using ARIA labels and roles, or ensuring all interactive elements are keyboard-navigable. Apply this skill when building frontend components, reviewing UI accessibility, refactoring markup for better semantics, or implementing WCAG compliance requirements.
---

# Frontend Accessibility

## When to use this skill

- When creating or modifying any UI component files (e.g., `.tsx`, `.jsx`, `.vue`, `.svelte` files)
- When writing HTML or JSX markup for user interfaces
- When implementing forms with input fields, labels, and validation messages
- When building navigation menus, buttons, links, and interactive elements
- When creating modals, dialogs, tooltips, and overlay components
- When adding images, icons, or media content that needs alternative text
- When implementing keyboard navigation and focus management
- When using or adding ARIA attributes (aria-label, aria-describedby, role, etc.)
- When ensuring proper heading hierarchy (h1-h6) in page layouts
- When choosing colors and ensuring sufficient contrast ratios
- When testing components with screen readers
- When managing focus states for dynamic content and SPAs
- When reviewing components for WCAG compliance and accessibility standards

## Instructions

### Semantic HTML

Always use semantic HTML elements instead of generic divs:

- `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`, `<section>`, `<article>` for page structure
- `<button>` for clickable actions (not `<div onClick>`)
- `<a>` for navigation links
- `<ul>`, `<ol>`, `<li>` for lists
- `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>` for tabular data
- `<form>`, `<fieldset>`, `<legend>` for forms
- `<label>` associated with form inputs via `htmlFor`/`id`

### ARIA Attributes

Use ARIA attributes to enhance accessibility:

- `aria-label` for elements without visible text
- `aria-labelledby` to reference another element as label
- `aria-describedby` for additional descriptions (e.g., error messages)
- `aria-hidden="true"` for decorative elements
- `aria-expanded` for collapsible content
- `aria-current="page"` for current navigation item
- `aria-live` for dynamic content updates
- `aria-busy` for loading states
- `role` only when semantic HTML isn't sufficient

### Forms

- Every input MUST have an associated `<label>` with matching `htmlFor`/`id`
- Use `aria-invalid` on inputs with validation errors
- Use `aria-describedby` to link inputs to error messages
- Error messages should have `role="alert"`
- Loading buttons should have `aria-busy="true"`
- Required fields should have `aria-required="true"` or `required` attribute

### Keyboard Navigation

- All interactive elements must be focusable
- Use `tabIndex={0}` for custom interactive elements
- Use `tabIndex={-1}` for programmatically focusable elements
- Implement keyboard handlers: Enter/Space for buttons, Escape for closing modals
- Focus should be trapped within modals
- Focus should return to trigger element when modal closes

### Images and Icons

- Meaningful images: `<img alt="Description of image">`
- Decorative images: `<img alt="" aria-hidden="true">` or use CSS background
- Icons in buttons: `aria-hidden="true"` on icon, text in button (visible or sr-only)
- Icon-only buttons: `aria-label` on button describing the action

### Color and Contrast

- Text contrast ratio: minimum 4.5:1 for normal text, 3:1 for large text
- Don't rely solely on color to convey information
- Ensure focus indicators are visible
- Test with color blindness simulators

### Headings

- One `<h1>` per page
- Heading levels should not skip (h1 → h2 → h3, not h1 → h3)
- Use headings to create document outline
- Don't use headings just for styling

### Screen Reader Only Content

Use a utility class for visually hidden but screen reader accessible content:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Testing Checklist

- [ ] Navigate with keyboard only (Tab, Shift+Tab, Enter, Space, Escape, Arrow keys)
- [ ] Test with screen reader (VoiceOver, NVDA, JAWS)
- [ ] Check color contrast ratios
- [ ] Verify focus indicators are visible
- [ ] Ensure all interactive elements are reachable
- [ ] Test at 200% zoom
- [ ] Validate heading hierarchy
