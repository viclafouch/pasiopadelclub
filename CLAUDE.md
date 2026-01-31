# Pasio Padel Club

## Vision & Objectifs

### Pourquoi ce projet ?
Remplacer le site Wix actuel (pasiopadelclub.com) qui est un one-page non responsive, avec réservation uniquement via app mobile. Le nouveau site doit être **LA référence** pour trouver le club de padel à Bayonne.

> **Branche `production-v1`** — Site vitrine statique (pas de backend, pas d'auth, pas de paiements). Tous les CTAs de réservation redirigent vers l'application mobile. La branche `main` contient la version complète avec base de données, auth, Stripe et emails.

### Objectifs business
- **SEO local** → Être #1 sur "padel bayonne", "réserver padel pays basque"
- **App download** → Promouvoir l'app existante pour les habitués
- **Visibilité** → Présenter le club, les tarifs, les crédits, la galerie

### Cible
- **Primaire** : Joueurs de padel du Pays Basque (20-50 ans)
- **Secondaire** : Touristes, débutants curieux, familles (court kids)

---

## Club Info

| Info | Value |
|------|-------|
| Nom | Pasio Padel Club |
| Adresse | 24 rue Arnaud Detroyat, 64100 Bayonne |
| Téléphone | 05.59.42.81.33 |
| Email | pasio.padel.club@gmail.com |
| Horaires | 8h - 22h tous les jours |
| Domaine | pasiopadelclub.fr |

### Terrains (7 total)

| Court | Type | Lieu | Joueurs | Durée | Prix |
|-------|------|------|---------|-------|------|
| Court N°1 | double | indoor | 4 | 90 min | 60€ |
| Court N°2 | double | indoor | 4 | 90 min | 60€ |
| Court N°3 | double | semi-couvert | 4 | 90 min | 60€ |
| Court N°4 | double | semi-couvert | 4 | 90 min | 60€ |
| Simple N°1 | simple | indoor | 2 | 60 min | 30€ |
| Simple Initiation | simple | indoor | 2 | 60 min | 30€ |
| Court Kids | kids | indoor | 2 | 60 min | 15€ |

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | TanStack Start (React 19, SSR, Nitro) |
| Routing | TanStack Router (file-based) |
| Data | TanStack Query |
| UI | Tailwind 4 + Radix UI + shadcn/ui |
| Animation | Motion |
| Validation | Zod |

---

## Infrastructure

| Service | Usage |
|---------|-------|
| **Railway** | Hébergement (Node.js, auto-deploy depuis `production-v1`) |

### Environnement
- **Production** : pasiopadelclub.fr (Railway)
- **Dev** : localhost:3000

---

## Project Structure

```
src/
├── routes/      → Pages TanStack Router (file-based)
├── components/  → UI components (ui/, kibo-ui/, animate-ui/ = NE PAS MODIFIER)
├── constants/   → Configs, constantes app
├── helpers/     → Utils pures (nombres, strings)
├── lib/         → Utilitaires partagés (cn)
└── env/         → Variables d'environnement
```

### Route Group
- `_public__root/` → Pages publiques (Navbar/Footer)

### Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/tarifs` | Tarifs des terrains |
| `/credits` | Présentation des packs de crédits |
| `/galerie` | Galerie photos |
| `/contact` | Infos de contact + Google Maps |
| `/application` | Téléchargement app mobile |
| `/cgv` | Conditions générales de vente |
| `/mentions-legales` | Mentions légales |
| `/politique-confidentialite` | Politique de confidentialité |

---

## Rules (`.claude/rules/`)

TOUJOURS lire et respecter ces règles pour chaque ligne de code. Le contenu ci-dessous est un résumé, **consulter les fichiers pour les détails complets**.

| Fichier | Domaine |
|---------|---------|
| `typescript.md` | Règles du langage TypeScript (typage, inférence, patterns) |
| `code-style.md` | Style d'écriture du code (structure, nommage, organisation) |
| `frontend.md` | Développement frontend (React, TanStack, UI/UX, animations) |
| `comments.md` | Politique de commentaires (code auto-documenté) |
| `testing.md` | Règles de tests (structure BDD, mocking, couverture) |
| `git.md` | Workflow Git (commits, push, messages) |

---

## Agents

| Agent | Usage | Quand l'utiliser |
|-------|-------|------------------|
| `code-simplifier:code-simplifier` | Review et simplification du code | **Obligatoire** après chaque tâche |
| `Explore` | Recherche dans la codebase | Trouver des fichiers, comprendre le code |
| `Plan` | Planification d'implémentation | Tâches complexes multi-étapes |

---

## Skills

| Skill | Usage |
|-------|-------|
| `/frontend-design` | Créer des interfaces frontend de haute qualité |
| `/react-useeffect` | Auditer les composants React pour détecter les useEffect inutiles |
| `/frontend-accessibility` | Construire des interfaces accessibles (WCAG, ARIA, clavier) |

---

## MCP Servers

| MCP | Usage |
|-----|-------|
| **Context7** | Documentation des librairies externes (TanStack, Zod...) |
| **shadcn** | Installer et explorer les composants shadcn/ui |
| **Kibo UI** | Composants custom du design system |
| **Railway** | Gestion du déploiement et des services Railway |

### Lire la documentation
Avant d'utiliser une librairie externe, TOUJOURS consulter Context7 :
1. `resolve-library-id` → Trouver l'ID de la librairie
2. `query-docs` → Chercher la doc spécifique

---

## Workflow

**Avant chaque tâche :**
1. Lire, relire plusieurs fois les règles sur `.claude/rules/*.md`
2. Consulter Context7 pour les libs externes

**Après chaque tâche :**
1. Lancer `code-simplifier:code-simplifier` (obligatoire)
2. Relire les règles du projet `.claude/rules/*.md` (obligatoire)
3. Lancer `npm run lint:fix`

---

## Commands

> **IMPORTANT** : Ne JAMAIS lancer `npm run dev` — le serveur de développement est déjà lancé par l'utilisateur.

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement sur le port 3000 |
| `npm run build` | Compile l'application pour la production |
| `npm run start` | Démarre le serveur de production (après build) |
| `npm run lint:fix` | Vérifie TypeScript + ESLint et corrige automatiquement les erreurs |
| `npm run test` | Lance les tests unitaires avec Vitest |
| `npm run deps` | Met à jour les dépendances (minor/patch) |
| `npm run deps:major` | Met à jour les dépendances (major) |
| `npm run clean` | Nettoie les dossiers de build et cache |
