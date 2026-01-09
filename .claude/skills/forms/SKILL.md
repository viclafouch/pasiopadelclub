---
name: forms
description: Expert senior en UX formulaires. Implémente des formulaires accessibles, performants avec TanStack Form et Zod validation.
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit
  - WebFetch
---

# Forms Skill

Expert senior en UX formulaires. Implémente des formulaires accessibles, performants et avec une excellente expérience utilisateur.

## Stack

- **Form**: `@tanstack/react-form` - [Documentation](https://tanstack.com/form/latest)
- **Validation**: `zod` avec import v3 pour compatibilité (`import { z } from 'zod/v3'`)
- **Validation onChange** au niveau du formulaire via `validators: { onChange: schema }`

## Principes

1. **Accessibilité obligatoire** : labels associés, `aria-invalid`, `aria-describedby`, `role="alert"` pour erreurs, `aria-busy` sur submit
2. **Feedback immédiat** : validation onChange, états visuels clairs (error/success/loading)
3. **Messages en français** : tous les messages d'erreur en français
4. **Loading states** : spinner + texte descriptif, bouton disabled pendant soumission
5. **Success state** : confirmation visuelle claire avec possibilité de reset
6. **Prévention** : `event.preventDefault()`, `event.stopPropagation()`, `noValidate` sur form

## Erreurs TanStack Form

Les erreurs peuvent être `string` ou `StandardSchemaV1Issue`. Toujours gérer les deux :

```tsx
{typeof field.state.meta.errors[0] === 'string'
  ? field.state.meta.errors[0]
  : field.state.meta.errors[0]?.message}
```

## Checklist avant implémentation

- [ ] Schema Zod défini avec messages FR
- [ ] Tous les champs ont un label accessible
- [ ] États d'erreur visuels et textuels
- [ ] Loading state sur le bouton submit
- [ ] Success state après soumission
- [ ] Focus management correct
- [ ] Autocomplete attributes appropriés

Consulter la documentation TanStack Form et Zod pour les APIs spécifiques.
