# Pasio Padel Club - Plan de Développement

## Vue d'ensemble

Site de réservation de terrains de padel pour le club Pasio Padel Club situé à **Anglet** (20 rue Alfred de Vigny, 64600 Anglet). L'objectif est de permettre aux utilisateurs de réserver et payer un créneau en ligne, avec un SEO optimisé pour la visibilité locale.

**Domaine de production :** pasiopadelclub.fr

---

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 19, TanStack Start avec Tanstack Router (SSR), Tailwind CSS 4, Shadcn, Vite |
| Backend | Drizzle ORM + Neon (Postgres serverless) |
| Authentification | Better Auth (avec plugin Polar) |
| Paiement | Polar (intégré via Better Auth) |
| Emails transactionnels | Resend (templates React Email brandés) |
| Hébergement | Railway |
| Tests | Vitest (unitaires + intégration), pas de E2E |

---

## Structure des Terrains

### Couverts (intérieur)
| Terrain | Joueurs | Durée | Prix | Créneaux |
|---------|---------|-------|------|----------|
| Court N°1 | 4 | 90 min | 60€ | 8h, 9h30, 11h, 12h30, 14h, 15h30, 17h, 18h30, 20h |
| Court N°2 | 4 | 90 min | 60€ | 8h, 9h30, 11h, 12h30, 14h, 15h30, 17h, 18h30, 20h |
| Simple N°1 | 2 | 60 min | 30€ | 8h, 9h, 10h, 11h, 12h, 13h, 14h, 15h, 16h, 17h, 18h, 19h, 20h, 21h |
| Court Kids | 2 | 60 min | 15€ | 8h, 9h, 10h, 11h, 12h, 13h, 14h, 15h, 16h, 17h, 18h, 19h, 20h, 21h |

### Semi-couverts (extérieur)
| Terrain | Joueurs | Durée | Prix | Créneaux |
|---------|---------|-------|------|----------|
| Court N°3 | 4 | 90 min | 60€ | 8h, 9h30, 11h, 12h30, 14h, 15h30, 17h, 18h30, 20h |
| Court N°4 | 4 | 90 min | 60€ | 8h, 9h30, 11h, 12h30, 14h, 15h30, 17h, 18h30, 20h |

**Total : 6 terrains**
- Terrain "Kids" : ouvert à tous (info-bulle explicative dans l'interface)
- Grilles horaires indépendantes par durée (90 min vs 60 min)

---

## Règles de Réservation

- **Type** : Location de terrain uniquement (pas de cours avec coach)
- **Paiement** : Immédiat et obligatoire via Polar
- **Création booking** : Uniquement après confirmation paiement (webhook Polar `order.paid`)
- **Pas de blocage préventif** : Le créneau reste disponible jusqu'au paiement confirmé
- **Double-booking** : Très rare (~20 users), si ça arrive → remboursement manuel
- **Annulation** : Autorisée uniquement si effectuée au moins 24 heures avant le créneau réservé (remboursement intégral)
- **Limite par utilisateur** : Maximum 2 réservations actives simultanément
- **Anticipation** : Réservation possible jusqu'à 10 jours à l'avance
- **Horaires** : 8h - 22h tous les jours
- **Tarification** : Prix fixes
- **Format dates/heures** : Format français court (15/01/2025 - 14:30)

---

## Conventions de Données

### Prix en centimes
**Tous les prix sont stockés en centimes** dans la base de données et formatés en euros à l'affichage via les helpers de `src/helpers/number.ts`.

| Type | Stockage | Affichage |
|------|----------|-----------|
| Double | 6000 | 60 € |
| Simple | 3000 | 30 € |
| Kids | 1500 | 15 € |

### Langue
- Site en français uniquement
- Config i18n dans `src/i18n/config.ts` (préparé pour multi-langue futur)

---

## Spécifications UX/UI

### Inscription & Authentification
- **Better Auth email/password** : Inscription classique
- **Téléphone optionnel** : Champ non requis à l'inscription

### Page de Réservation
- **Mobile** : Grille de créneaux en plein écran
- **Créneaux passés** : Affichés grisés pour voir l'occupation de la journée complète
- **Limite atteinte (2/2)** : Affichage complet avec bandeau d'alerte permanent rappelant la limite

### Gestion des erreurs
- **Polar indisponible** : Message simple "Paiement temporairement indisponible, réessayez plus tard"
- **Échec email** : Retry automatique 3x avec délai croissant (1min, 5min, 15min). Après 3 échecs, log l'erreur

---

## Règles Admin

### Blocage utilisateur
- Quand un utilisateur est bloqué (`isBlocked: true`), toutes ses réservations futures sont **automatiquement annulées avec remboursement intégral**

### Blocage de créneaux
- Si l'admin bloque une plage horaire qui chevauche des réservations existantes, celles-ci sont **automatiquement annulées avec remboursement** et email d'excuse envoyé aux utilisateurs concernés

### Réservation manuelle admin
- L'admin peut créer une réservation **gratuite uniquement** (cas exceptionnels, blocage pour un client sans paiement)

### Statistiques
- Niveau basique : revenus du jour, semaine, mois. Pas de détail par terrain ou graphiques avancés

---

## Formulaire de Contact
- Accessible **sans connexion** (public)
- Pas de CAPTCHA (risque de spam accepté pour maximum d'accessibilité)

---

## Galerie Photos
- **Images statiques** stockées dans `public/`
- Mises à jour uniquement par un développeur
- Pas d'upload admin

---

## Compte Utilisateur

### Suppression de compte
- L'utilisateur peut demander la suppression de son compte
- **Anonymisation** : Le compte est désactivé, les données personnelles sont anonymisées mais l'historique des réservations reste (obligations comptables)

---

## Emails Transactionnels

### Design
- **Template brandé basique** : Logo, couleurs du club, mise en page propre avec React Email

### Email de rappel
- Envoyé **exactement 24h avant** l'heure du créneau (même si c'est à 3h du matin)

### Types d'emails
1. Confirmation de réservation
2. Rappel 24h avant
3. Confirmation d'annulation
4. Réinitialisation de mot de passe
5. Vérification d'email à l'inscription
6. Formulaire de contact (vers admin)

---

## SEO

- **Google My Business** : Fiche existante, vérifier la cohérence NAP (Name, Address, Phone)
- Schema.org LocalBusiness et SportsActivityLocation

---

## Déploiement

- **Stratégie** : Déploiement direct (push sur main = déploiement immédiat)
- **Maintenance** : Zero downtime géré par Railway, pas de page maintenance
- **Domaine** : pasiopadelclub.fr avec HTTPS automatique

---

## Modèle de Données (Drizzle/Postgres)

### users (Better Auth + champs custom)
```typescript
{
  id: uuid (PK),
  email: string,
  emailVerified: boolean,
  name: string,           // Better Auth requis
  firstName: string,
  lastName: string,
  phone: string | null,
  role: "user" | "admin",
  isBlocked: boolean,
  isAnonymized: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### courts
```typescript
{
  id: uuid (PK),
  name: string,
  type: "double" | "simple" | "kids",
  location: "indoor" | "outdoor",
  capacity: 2 | 4,
  duration: 60 | 90,
  price: number,        // en centimes (6000 = 60€)
  isActive: boolean,
  createdAt: timestamp
}
```

### bookings
```typescript
{
  id: uuid (PK),
  userId: uuid (FK users),
  courtId: uuid (FK courts),
  startAt: timestamp,
  endAt: timestamp,
  price: number,              // en centimes
  polarPaymentId: string | null,
  paymentType: "online" | "free",
  status: "confirmed" | "cancelled",  // PAS de "pending"
  createdAt: timestamp
}
```

### blockedSlots
```typescript
{
  id: uuid (PK),
  courtId: uuid (FK courts) | null,  // null = tous les terrains
  startAt: timestamp,
  endAt: timestamp,
  reason: string | null,
  createdAt: timestamp
}
```

---

# Workflow

> **IMPORTANT - Workflow obligatoire pour chaque tâche :**
>
> 1. **Implémenter** la tâche
> 2. **Lancer `code-simplifier`** pour simplifier et valider le code (obligatoire)
> 3. **Lancer `npm run lint`** et corriger toutes les erreurs restantes
> 4. **Une fois tout validé**, cocher la tâche `[x]`
> 5. **NE COMMIT JAMAIS LES CHANGEMENTS TANT QUE L'UTILISATEUR N'A PAS ACCEPTÉ**
> 6. **Attendre la demande explicite de l'utilisateur pour passer à la milestone suivante**

---

## Milestone 0 : Migration Neon + Drizzle + Better Auth ✅ COMPLÉTÉ

### Objectif
Migrer de Convex + Clerk vers Neon (Postgres) + Drizzle ORM + Better Auth pour un SSR propre sans loading states.

### 0.1 Setup Drizzle + Neon ✅
- [x] Créer compte Neon + projet "pasio-padel"
- [x] Ajouter `DATABASE_URL` dans `.env`
- [x] Installer `drizzle-orm` + `@neondatabase/serverless`
- [x] Installer `drizzle-kit` (dev)
- [x] Créer `drizzle.config.ts`
- [x] Créer `src/db/index.ts` - client Drizzle
- [x] Créer `src/db/schema.ts` - tables (users, courts, bookings, blockedSlots)
- [x] Première migration `npm run db:migrate`
- [x] Seed des terrains

### 0.2 Setup Better Auth ✅
- [x] Installer `better-auth`
- [x] Créer `src/lib/auth.ts` - config Better Auth + Drizzle adapter
- [x] Créer `src/lib/auth-client.ts` - client auth avec `polarClient()` plugin
- [x] Créer route API `/api/auth/$.ts` - handler auth
- [x] Configurer middleware TanStack Start pour sessions
- [x] Tables auth créées par Better Auth (user, session, account, verification)
- [x] Champs additionnels : firstName, lastName, phone, role, isBlocked, isAnonymized

### 0.3 Migration des routes ✅
- [x] Remplacer hooks Clerk par Better Auth hooks
- [x] Remplacer queries Convex par queries Drizzle
- [x] Migrer `_authenticated/route.tsx` - session serveur via beforeLoad
- [x] Migrer `_admin/route.tsx` - vérification rôle serveur
- [x] Migrer `_auth/route.tsx` - redirect si connecté
- [x] Migrer page réservation - queries Drizzle
- [x] Migrer page mon-compte - queries Drizzle

### 0.4 Cleanup ✅
- [x] Supprimer dossier `convex/`
- [x] Désinstaller packages Convex
- [x] Désinstaller packages Clerk
- [x] Supprimer providers Convex/Clerk de `__root.tsx`
- [x] Nettoyer env variables
- [x] Mettre à jour `src/env/server.ts` et `src/env/client.ts`

---

## Milestones 1-4 : Pages Publiques, Auth, Espace Utilisateur ✅ COMPLÉTÉS

Voir détails dans les commits précédents. Toutes les fonctionnalités de base sont implémentées :
- Pages publiques (Galerie, Contact, Tarifs, Mentions légales, CGV)
- Authentification Better Auth (inscription, connexion)
- Espace utilisateur (profil, réservations, historique, annulation, export RGPD)

---

## Milestone 5 : Système de Réservation (Frontend) ✅ COMPLÉTÉ

### 5.1-5.4 Interface de réservation ✅
- [x] Page `/reservation` avec URL state (date)
- [x] DaySelector sticky avec 10 jours, prefetch on hover
- [x] Groupes par type de terrain (double, simple, kids)
- [x] SlotCard avec status (available, booked, blocked, past)
- [x] BookingSummaryModal avec récapitulatif
- [x] Vérification limite 2 réservations actives
- [x] Redirection connexion si non authentifié

---

## Milestone 6 : Intégration Paiement Polar 🔄 EN COURS

### Objectif
Intégrer Polar pour le paiement en ligne via Better Auth plugin.

### 6.1 Configuration Polar ✅
- [x] Créer compte Polar (sandbox)
- [x] Configurer clés API dans `.env`
- [x] Créer produits Polar (double 60€, simple 30€, kids 15€)
- [x] Créer `src/constants/polar.ts` - product IDs
- [x] Configurer plugin `polar()` dans `src/lib/auth.ts`
- [x] Configurer plugin `polarClient()` dans `src/lib/auth-client.ts`
- [ ] Configurer webhook dans Polar dashboard (prod)

### 6.2 Flux de paiement (simplifié) 🔄
> **Approche choisie** : Pas de booking "pending". Le booking est créé uniquement à la confirmation de paiement.

- [x] `BookingSummaryModal` utilise `authClient.checkout({ slug, referenceId })`
- [x] Le `referenceId` contient les infos du slot (courtId, startAt, endAt) encodées
- [ ] Redirection automatique vers Polar Checkout
- [ ] Email pré-rempli grâce à `createCustomerOnSignUp: true`

### 6.3 Webhook Polar ✅
- [x] Route `/api/webhooks/polar.ts` créée
- [x] Gérer event `order.paid` :
  - [x] Décoder `metadata.referenceId` (courtId, startAt, endAt)
  - [x] Vérifier que le créneau est toujours disponible
  - [x] Créer le booking avec status "confirmed"
  - [x] Stocker `polarPaymentId` (unique constraint)
  - [ ] Déclencher email confirmation (M7)
- [x] Gérer conflit : log + alerte admin pour remboursement manuel
- [x] Idempotence : vérification paiement déjà traité
- [x] PII masqué dans les logs (emails, IDs)

### 6.4 Pages de Retour
- [x] Route `/reservation/success.tsx` créée
- [ ] Afficher récapitulatif réservation (fetch via checkout_id)
- [x] Route `/reservation/echec.tsx` créée
- [ ] Afficher message erreur + boutons retry/accueil

### 6.5 Remboursements
- [ ] Créer fonction `refundBooking` via API Polar
- [ ] Utiliser dans annulation utilisateur (> 24h)
- [ ] Utiliser dans blocage admin
- [ ] Utiliser dans blocage utilisateur

### Livrables attendus
- Paiement Polar via Better Auth plugin
- Booking créé uniquement après paiement confirmé
- Pas de gestion de status "pending"
- Email pré-rempli au checkout

---

## Milestone 7 : Emails Transactionnels

### Objectif
Implémenter les emails de confirmation et de rappel via Resend.

### 7.1 Configuration Resend
- [ ] Créer compte Resend
- [ ] Ajouter domaine pasiopadelclub.fr
- [ ] Vérifier DNS domaine
- [ ] Configurer clé API dans `.env`
- [ ] Créer `src/lib/resend.ts` - client
- [ ] Installer React Email
- [ ] Créer dossier `src/emails/`

### 7.2 Templates emails
- [ ] Créer template `BookingConfirmation.tsx`
- [ ] Créer template `BookingReminder.tsx`
- [ ] Créer template `BookingCancelled.tsx`
- [ ] Créer template `ContactForm.tsx`

### 7.3 Système de rappel
- [ ] Créer cron toutes les 15 minutes
- [ ] Query réservations à rappeler (24h avant)
- [ ] Envoyer email rappel

---

## Milestones 8-13 : Admin, SEO, Tests, RGPD, Déploiement

Ces milestones restent à implémenter après la finalisation du système de réservation et paiement.

Voir le plan détaillé dans les sections précédentes.

---

## État actuel du projet

### Complété ✅
- Infrastructure Neon + Drizzle (migration appliquée)
- Better Auth avec champs additionnels (firstName, lastName, phone, role)
- Plugin Polar Better Auth (serveur + client)
- Pages publiques et authentification
- Espace utilisateur complet
- Interface de réservation
- Modal récapitulatif avec checkout Better Auth + useMutation + error handling
- Webhook Polar `order.paid` avec idempotence et logs sécurisés
- Vérification `isBlocked` sur annulation booking
- Contrainte unique sur `polarPaymentId` (schéma mis à jour)
- Routes auth (connexion/inscription) avec invalidation cache/router

### En cours 🔄
- **Milestone 6** : Configurer webhook URL dans Polar dashboard (prod)
- Tester le flux complet de paiement end-to-end
- Pages success/echec à finaliser

### À faire
- Emails transactionnels (M7)
- Dashboard admin (M8-9)
- SEO & optimisation (M10)
- Tests & sécurité (M11)
- RGPD (M12)
- Déploiement (M13)
