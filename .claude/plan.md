# Pasio Padel Club - Plan de Développement

## Vue d'ensemble

Site de réservation de terrains de padel à **Anglet** (20 rue Alfred de Vigny, 64600 Anglet).

**Domaine :** pasiopadelclub.fr

---

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 19, TanStack Start (SSR), Tailwind CSS 4, Shadcn |
| Backend | Drizzle ORM + Neon (Postgres serverless) |
| Auth | Better Auth (plugin Polar) |
| Paiement | Polar |
| Emails | Resend + React Email |
| Hébergement | Railway |

---

## Terrains

| Terrain | Joueurs | Durée | Prix |
|---------|---------|-------|------|
| Court N°1, N°2, N°3, N°4 | 4 | 90 min | 60€ |
| Simple N°1 | 2 | 60 min | 30€ |
| Court Kids | 2 | 60 min | 15€ |

- Courts N°1-2 : intérieur / Courts N°3-4 : extérieur
- Kids : ouvert à tous (info-bulle)
- Horaires : 8h-22h tous les jours

---

## Règles Métier

### Réservation
- Paiement immédiat obligatoire via Polar
- Booking créé uniquement après paiement confirmé (webhook `order.paid`)
- Pas de blocage préventif du créneau
- Annulation : possible jusqu'à 24h avant (remboursement intégral)
- Limite : 2 réservations actives max par utilisateur
- Anticipation : jusqu'à 10 jours à l'avance

### Admin
- Blocage user → annulation auto + remboursement de ses réservations futures
- Blocage créneau → annulation auto + remboursement + email d'excuse
- Réservation manuelle gratuite uniquement

### Conventions
- Prix stockés en centimes (6000 = 60€)
- Site français uniquement, erreurs en FR
- Format dates : 15/01/2025 - 14:30

---

## Emails Transactionnels

1. Confirmation de réservation
2. Rappel 24h avant (cron toutes les 15min)
3. Confirmation d'annulation
4. Réinitialisation mot de passe
5. Vérification email
6. Formulaire contact → admin

---

## Modèle de Données

**users** : id, email, firstName, lastName, phone?, role, isBlocked, isAnonymized

**courts** : id, name, type (double/simple/kids), location (indoor/outdoor), capacity, duration, price

**bookings** : id, userId, courtId, startAt, endAt, price, polarPaymentId, paymentType (online/free), status (confirmed/cancelled)

**blockedSlots** : id, courtId (null = tous), startAt, endAt, reason?

---

# Workflow

> 1. Implémenter → 2. `code-simplifier` → 3. `npm run lint` → 4. Cocher [x]
> **NE JAMAIS COMMIT SANS ACCORD USER**

---

## M0 : Migration Neon + Drizzle + Better Auth ✅

- [x] Setup Drizzle + Neon (schema, migrations, seed)
- [x] Setup Better Auth (config, client, middleware, champs additionnels)
- [x] Migration routes (Clerk→Better Auth, Convex→Drizzle)
- [x] Cleanup (suppr convex/, clerk, providers)

---

## M1-4 : Pages Publiques, Auth, Espace Utilisateur ✅

- [x] Pages publiques (Galerie, Contact, Tarifs, Mentions légales, CGV)
- [x] Auth Better Auth (inscription, connexion)
- [x] Espace utilisateur (profil, réservations, historique, annulation, export RGPD)

---

## M5 : Système de Réservation (Frontend) ✅

- [x] Page `/reservation` avec URL state date, DaySelector sticky 10 jours
- [x] Grille créneaux par type (double, simple, kids) avec status (available, booked, blocked, past)
- [x] BookingSummaryModal + vérification limite 2 réservations
- [ ] **M5.5** : Créneaux "Réservé par vous" en bleu info (status `booked_by_user`)

---

## M6 : Intégration Paiement Polar 🔄

- [x] **6.1** : Config Polar sandbox (clés API, produits, plugins auth)
- [ ] **6.1** : Configurer webhook URL dans Polar dashboard (prod)
- [x] **6.2** : Flux paiement (`authClient.checkout` → redirect Polar → email pré-rempli)
- [x] **6.3** : Webhook `order.paid` (decode referenceId, vérifie dispo, crée booking, idempotence, PII masqué)
- [x] **6.4** : Pages success.tsx et echec.tsx créées
- [ ] **6.4** : Afficher récapitulatif réservation sur success (fetch via checkout_id)
- [ ] **6.5** : Remboursements via API Polar (annulation user, blocage admin/user)

---

## M7 : Emails Transactionnels

- [ ] **7.1** : Setup Resend (compte, domaine DNS, React Email)
- [ ] **7.2** : Templates (BookingConfirmation, BookingReminder, BookingCancelled, ContactForm)
- [ ] **7.3** : Cron rappel 24h avant

---

## M7.5 : i18n Français

- [x] **7.5.1** : Better Auth errors FR (`src/helpers/auth-errors.ts` + Alert component)
- [ ] **7.5.2** : Polar errors FR (`src/helpers/polar-errors.ts`)
- [x] **7.5.3** : Zod validations FR (tous les formulaires)

---

## M8-13 : À venir

- **M8-9** : Dashboard admin (users, bookings, blocages, stats basiques)
- **M10** : SEO (Schema.org, Google My Business)
- **M11** : Tests Vitest
- **M12** : RGPD (suppression compte → anonymisation)
- **M13** : Déploiement Railway

---

## État actuel

### Complété ✅
- Infrastructure complète (Neon, Drizzle, Better Auth, Polar)
- Pages publiques + Auth + Espace utilisateur
- Interface réservation + Modal paiement
- Webhook Polar fonctionnel
- i18n Better Auth + Zod

### En cours 🔄
- Configurer webhook Polar prod
- Page success.tsx : afficher récapitulatif
- Remboursements API Polar

### À faire
- M5.5 : "Réservé par vous"
- M7 : Emails
- M7.5.2 : Erreurs Polar FR
- M8-13 : Admin, SEO, Tests, RGPD, Deploy
