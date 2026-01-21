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

- Max **2 réservations actives** par utilisateur
- Réservation jusqu'à **10 jours** à l'avance
- Annulation possible **24h+** avant (remboursement intégral)
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
- **Production** : pasiopadelclub.fr (Railway)
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

## Database Schema

### Enums
```
userRole       = ['user', 'admin']
courtType      = ['double', 'simple', 'kids']
courtLocation  = ['indoor', 'outdoor']
bookingStatus  = ['pending', 'confirmed', 'completed', 'cancelled', 'expired']
paymentType    = ['online', 'free', 'credit']
walletTransactionType = ['purchase', 'payment', 'refund', 'expiration']
```

### Tables
- **user** → Utilisateurs (Better Auth + champs custom : firstName, lastName, phone, role, isBlocked)
- **session**, **account**, **verification** → Better Auth
- **court** → Terrains (type, location, capacity, duration, price en cents)
- **booking** → Réservations (userId, courtId, startAt, endAt, status, paymentType)
- **blockedSlot** → Créneaux bloqués par admin
- **creditPack** → Packs de crédits à acheter
- **walletTransaction** → Mouvements de crédits (achat, paiement, remboursement, expiration)

---

## Rules (`.claude/rules/`)

TOUJOURS lire et respecter ces règles pour chaque ligne de code :

| Fichier | Contenu |
|---------|---------|
| `typescript.md` | No any, as const satisfies, trust inference, Drizzle = source of truth |
| `code-style.md` | Max 2 params, 30 lignes/fn, no mutations, no comments, naming conventions |
| `frontend.md` | React.useState, useMutation, no useCallback/useMemo, ternary over && |
| `comments.md` | Code auto-documenté, pas de commentaires |
| `testing.md` | BDD style (#given #when #then), mock externals |
| `git.md` | JAMAIS commit/push sans demande explicite |

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
| `/frontend-design` | Design UI/UX pour composants et pages |

---

## MCP Servers

| MCP | Usage |
|-----|-------|
| **Context7** | Documentation des librairies externes (TanStack, Drizzle, Better Auth, Stripe...) |
| **shadcn** | Composants UI disponibles et exemples |
| **Kibo UI** | Composants custom du design system |

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

```bash
npm run dev          # Serveur dev :3000
npm run build        # Build production
npm run lint:fix     # Fix lint
npm run db:push      # Push schema
npm run db:studio    # Drizzle Studio
npm run email:dev    # Preview emails :3001
```

---

## Plan Status

Voir `.claude/plan.md` pour le détail complet.

**Fait :** M0-6 (auth, booking, payments, credits, emails setup)

**En cours :**
- M7 : Emails → manque cron rappel 24h + formulaire contact
- M8 : Déploiement → cleanup env Polar + webhook URL Stripe

**À venir :** M9-13 (admin, SEO, tests, RGPD)
