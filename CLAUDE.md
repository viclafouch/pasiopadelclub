# Pasio Padel Club - Project Guidelines

## Project Overview

Site vitrine pour **Pasio Padel Club**, un club de padel situé à Anglet, France.

### Le Club

**Pasio Padel Club** est un centre sportif dédié au padel, un sport de raquette qui combine des éléments du tennis et du squash, joué en double sur un court fermé avec des parois vitrées. Le club propose une expérience premium avec des installations modernes et une accessibilité maximale.

**Informations pratiques :**
- **Adresse :** 20 rue Alfred de Vigny, 64600 Anglet
- **Téléphone :** 09 71 11 79 28
- **Email :** contact@pasiopadelclub.fr
- **Instagram :** @pasio_padel_club
- **Horaires :** Ouvert 7j/7, de 8h00 à 22h00

### Tarification

| Formule | Durée | Joueurs | Prix | Par personne |
|---------|-------|---------|------|--------------|
| Court Double | 90 min | 4 | 60€ | 15€ |
| Court Simple | 60 min | 2 | 30€ | 15€ |
| Court Kids | 60 min | 2 | 15€ | 7.50€ |

### Services proposés

- **Réservation de courts** : Via le système en ligne ou par téléphone
- **Location de matériel** : Raquettes disponibles à la location
- **Cours et coaching** : Leçons collectives et privées disponibles
- **Application mobile** : "Pasio Padel Club" disponible sur Google Play et App Store

### Pages du site

1. **Accueil (`/`)** : Page principale avec hero section, présentation du club, section de réservation avec vidéo, FAQ complète, carte de localisation et footer
2. **Tarifs (`/tarifs`)** : Grille tarifaire détaillée avec les différentes formules de réservation et liens vers l'application mobile

### Fonctionnalités actuelles

- Navigation responsive avec navbar fixe (variantes dark/light)
- Hero section plein écran avec indicateur de statut animé (ouverture)
- Section FAQ avec markup schema.org pour le SEO
- Carte Google Maps intégrée pour la localisation
- Système de notation étoiles (avis Google)
- Design moderne avec effets visuels (backdrop blur, gradients animés, transitions)
- Typographies : Satoshi, Bricolage Grotesque, Inter
- Palette de couleurs : fond sombre avec accent vert primaire (#009869)

## Workflow

### Plan Management
- Before starting any task, always check the current plan in `.claude/plan.md` file & update it if necessary
- If the plan needs updates based on new requirements or decisions, update it before implementation
- Keep the plan synchronized with actual implementation progress

### Design Tasks
- For any design-related questions or implementations (UI components, layouts, styling, visual elements), use the `/frontend-design` skill
- This ensures consistent, production-grade frontend interfaces with high design quality

### Form Tasks
- For implementing forms (contact, login, signup, profile, reservation, admin), use the `/forms` skill
- This ensures consistent patterns with TanStack Form, Zod validation, accessibility, and proper error handling

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

### Types
- **NEVER create manual types that duplicate database schemas or library types**
- Use `Doc<'tableName'>` from `convex/_generated/dataModel` for Convex document types
- Reuse types from libraries (BetterAuth, Convex, etc.) instead of recreating them
- If a type comes from the database, it must be derived from the schema, not hardcoded