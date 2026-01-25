# Pasio Padel Club

## Vision & Objectifs

### Pourquoi ce projet ?
Remplacer le site Wix actuel (pasiopadelclub.com) qui est un one-page non responsive, avec réservation uniquement via app mobile. Le nouveau site doit être **LA référence** pour réserver un terrain de padel à Bayonne.

### Objectifs business
- **SEO local** → Être #1 sur "padel bayonne", "réserver padel pays basque"
- **Conversion** → Réservation en moins de 3 clics
- **Rétention** → Système de crédits avec bonus pour fidéliser
- **App download** → Promouvoir l'app existante pour les habitués
- **Autonomie** → Admin dashboard pour gérer sans développeur

### Cible
- **Primaire** : Joueurs de padel du Pays Basque (20-50 ans)
- **Secondaire** : Touristes, débutants curieux, familles (court kids)

### Roadmap long terme
1. ✅ Site web responsive avec réservation + paiement
2. 🔄 Admin dashboard complet
3. 📋 Refonte app iOS/Android (basée sur ce nouveau backend)

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

## Business Rules

- Réservation jusqu'à **10 jours** à l'avance
- Annulation possible
- Réservation créée **uniquement après paiement** (webhook Stripe)
- Prix stockés en **centimes** (6000 = 60€)
- Crédits : packs prépayés avec bonus, expiration après X mois
- Créneaux 90min : 8h, 9h30, 11h, 12h30, 14h, 15h30, 17h, 18h30, 20h
- Créneaux 60min : toutes les heures de 8h à 21h

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | TanStack Start (React 19, SSR, Nitro) |
| Routing | TanStack Router (file-based) |
| Data | TanStack Query + TanStack Form |
| Database | Drizzle ORM + Neon (Postgres serverless) |
| Auth | Better Auth (email/password) |
| Payments | Stripe (checkout, webhooks, refunds) |
| Email | Resend + React Email |
| UI | Tailwind 4 + Radix UI + shadcn/ui |
| Animation | Framer Motion |
| Dates | date-fns + @date-fns/tz (timezone Paris) |
| Validation | Zod |

---

## Infrastructure

| Service | Usage |
|---------|-------|
| **Railway** | Hébergement (Node.js, auto-deploy depuis main) |
| **Neon** | Base de données Postgres serverless |
| **Stripe** | Paiements (checkout sessions + webhooks) |
| **Resend** | Emails transactionnels |

### Environnement
- **Staging (actuel)** : https://pasiopadelclub-production.up.railway.app (Railway)
  > ⚠️ TEMPORAIRE : Pré-production pour remplacer l'ancien site Wix. Sera migré vers pasiopadelclub.fr.
- **Production (futur)** : pasiopadelclub.fr
- **Dev** : localhost:3000
- **Emails preview** : localhost:3001

---

## Project Structure

```
src/
├── server/      → Server functions RPC (auth, bookings, slots, checkout, wallet, users)
├── routes/      → Pages TanStack Router (file-based)
├── components/  → UI components (ui/, kibo-ui/, animate-ui/ = NE PAS MODIFIER)
├── constants/   → Types, queries, schemas, configs
├── helpers/     → Utils pures (dates, nombres, strings, slots)
├── utils/       → Logique métier (booking, wallet, stripe)
├── db/          → Schema Drizzle + seeds
├── emails/      → Templates React Email
├── lib/         → Config (auth, stripe, resend, middleware)
└── env/         → Variables d'environnement
```

### Route Groups
- `_public__root/` → Pages publiques (Navbar/Footer)
- `_auth/` → Pages auth (connexion, inscription)
- `_authenticated/` → Pages protégées (mon-compte)
- `_admin/` → Pages admin (role check)

---

## Database Tables

- **user** → Utilisateurs (Better Auth + champs custom : firstName, lastName, phone, role, isBlocked)
- **session**, **account**, **verification** → Better Auth
- **court** → Terrains (type, location, capacity, duration, price en cents)
- **booking** → Réservations (userId, courtId, startAt, endAt, status, paymentType)
- **blockedSlot** → Créneaux bloqués par admin
- **creditPack** → Packs de crédits à acheter
- **walletTransaction** → Mouvements de crédits (achat, paiement, remboursement, expiration)

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
| `/better-auth` | Guide d'intégration Better Auth (session, OAuth, plugins) |
| `/frontend-accessibility` | Construire des interfaces accessibles (WCAG, ARIA, clavier) |

---

## MCP Servers

| MCP | Usage |
|-----|-------|
| **Context7** | Documentation des librairies externes (TanStack, Drizzle, Better Auth, Stripe...) |
| **shadcn** | Installer et explorer les composants shadcn/ui |
| **Kibo UI** | Composants custom du design system |
| **Resend** | Gestion des emails et domaines via l'API Resend |
| **Railway** | Gestion du déploiement et des services Railway |

### Lire la documentation
Avant d'utiliser une librairie externe, TOUJOURS consulter Context7 :
1. `resolve-library-id` → Trouver l'ID de la librairie
2. `query-docs` → Chercher la doc spécifique

---

## Workflow

**Avant chaque tâche :**
1. Vérifier `.claude/plan.md`
2. Lire, relire plusieurs fois s'il le fait les règles sur `.claude/rules/*.md`
3. Consulter Context7 pour les libs externes

**Après chaque tâche :**
1. Lancer `code-simplifier:code-simplifier` (obligatoire)
2. Relire les règles du projet `.claude/rules/*.md` (obligatoire)
3. Lancer `npm run lint:fix`
4. Mettre à jour le plan `[x]` si nécessaire

**Règle plan.md :**
- Le plan contient **uniquement la roadmap features** (fonctionnalités à développer)
- **JAMAIS d'audits** (sécurité, performance, accessibilité) dans le plan
- Les audits sont des snapshots ponctuels, pas une roadmap → les résultats restent dans le contexte de la conversation

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
| `npm run db:generate` | Génère les migrations Drizzle à partir du schema |
| `npm run db:migrate` | Applique les migrations en base de données |
| `npm run db:push` | Pousse le schema directement en base (dev uniquement) |
| `npm run db:studio` | Ouvre Drizzle Studio pour explorer la base de données |
| `npm run db:seed` | Peuple la base avec les données initiales (courts) |
| `npm run db:seed:credit-packs` | Peuple la base avec les packs de crédits |
| `npm run email:dev` | Lance le serveur de preview des emails sur le port 3001 |
| `npm run email:export` | Exporte les templates d'emails en HTML statique |
| `npm run deps` | Met à jour les dépendances (minor/patch) |
| `npm run deps:major` | Met à jour les dépendances (major) |
| `npm run clean` | Nettoie les dossiers de build et cache |

---

## Plan Status

Voir `.claude/plan.md` pour le détail complet.