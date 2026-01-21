# Pasio Padel Club - Plan de Développement

## Vue d'ensemble

Site de réservation de terrains de padel pour le club Pasio Padel Club situé à **Bayonne** (24 rue Arnaud Detroyat, 64100 Bayonne). L'objectif est de permettre aux utilisateurs de réserver et payer un créneau en ligne, avec un SEO optimisé pour la visibilité locale.

**Domaine de production :** pasiopadelclub.fr

---

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 19, TanStack Start avec Tanstack Router (SSR), Tailwind CSS 4, Shadcn, Vite |
| Backend | Drizzle ORM + Neon (Postgres serverless) |
| Authentification | Better Auth |
| Paiement | Stripe (SDK direct, paiements one-time) |
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

**Total : 7 terrains**
- Terrain "Kids" : ouvert à tous (info-bulle explicative dans l'interface)
- Grilles horaires indépendantes par durée (90 min vs 60 min)

---

## Règles de Réservation

- **Type** : Location de terrain uniquement (pas de cours avec coach)
- **Paiement** : Immédiat et obligatoire via Stripe Checkout
- **Création booking** : Uniquement après confirmation paiement (webhook Stripe `checkout.session.completed`)
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
- Site en français uniquement (anglais prévu plus tard)
- Toutes les erreurs doivent s'afficher en français

---

## Spécifications UX/UI

### Inscription & Authentification
- **Better Auth email/password** : Inscription classique
- **Téléphone optionnel** : Champ non requis à l'inscription

### Page de Réservation
- **Mobile** : Grille de créneaux en plein écran
- **Créneaux passés** : Affichés grisés pour voir l'occupation de la journée complète
- **Limite atteinte (2/2)** : Affichage complet avec bandeau d'alerte permanent rappelant la limite
- **Mes réservations** : Créneaux réservés par l'utilisateur connecté en bleu (couleur `info`) avec texte "Réservé par vous"

### Gestion des erreurs
- **Stripe indisponible** : Message simple "Paiement temporairement indisponible, réessayez plus tard"
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
  stripePaymentId: string | null,  // Stripe PaymentIntent ID
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

## Milestone 0 : Migration Neon + Drizzle + Better Auth ✅

Migration de Convex + Clerk vers Neon (Postgres) + Drizzle ORM + Better Auth pour SSR.

- [x] Setup Drizzle + Neon (schema, migrations, seed terrains)
- [x] Setup Better Auth avec Drizzle adapter
- [x] Migration des routes et queries
- [x] Cleanup packages Convex/Clerk

---

## Milestones 1-4 : Pages Publiques, Auth, Espace Utilisateur ✅

- [x] Pages publiques (Galerie, Contact, Tarifs, Mentions légales, CGV)
- [x] Authentification Better Auth (inscription, connexion)
- [x] Espace utilisateur (profil, réservations, historique, annulation, export RGPD)

---

## Milestone 5 : Système de Réservation ✅

- [x] Page `/reservation` avec URL state (date)
- [x] DaySelector sticky avec 10 jours, prefetch on hover
- [x] Groupes par type de terrain (double, simple, kids)
- [x] SlotCard avec status (available, booked, blocked, past)
- [x] BookingSummaryModal avec récapitulatif
- [x] Vérification limite 2 réservations actives
- [x] "Réservé par vous" (créneaux user en bleu info)

---

## Milestone 6 : Paiement Polar ✅ (remplacé par Stripe)

> **Note** : Polar remplacé par Stripe - voir Milestone 6.5

---

## Milestone 6.5 : Migration Polar → Stripe ✅

- [x] SDK Stripe installé, `src/lib/stripe.server.ts` créé
- [x] `src/server/checkout.ts` avec `createCheckoutSessionFn`
- [x] `src/routes/api/webhooks/stripe.ts` (signature, idempotence, booking)
- [x] Schema DB: `stripePaymentId` (plus de polarPaymentId)
- [x] `src/utils/stripe.ts` avec `safeRefund()`
- [x] Booking modal appelle server function Stripe
- [x] Cleanup Polar complet (packages, fichiers, références)
- [x] Tests webhook OK

---

## Milestone 6.6 : Système de Crédits/Wallet ✅

Système de prépaiement par crédits avec bonus et expiration.

- [x] Schema DB: `creditPack`, `walletTransaction`
- [x] `src/server/wallet.ts` (balance, transactions, packs, expiration)
- [x] `src/server/credits-checkout.ts` (achat crédits via Stripe)
- [x] `src/server/credit-payment.ts` (payer réservation avec crédits)
- [x] `src/utils/wallet.ts` (getUserBalance)
- [x] `src/components/credit-pack-card.tsx`, `credit-balance-section.tsx`
- [x] Route `/credits` (page publique achat packs)
- [x] Tab "Crédits" dans mon-compte (solde, historique)
- [x] Booking modal: choix paiement carte vs crédits
- [x] Webhook Stripe gère achat crédits
- [x] Seed 3 packs (Starter, Pro, Premium)

---

## Milestone 7 : Emails Transactionnels ✅

- [x] Configuration Resend (`src/lib/resend.server.ts`)
- [x] Templates React Email: vérification, bienvenue, confirmation, rappel 24h, annulation
- [x] Intégration Better Auth (vérification email, bienvenue après validation)
- [x] Intégration booking (confirmation webhook, annulation)
- [x] Cron rappel 24h avant créneaux
- [x] Email contact (formulaire)

---

## Milestone 7.5 : i18n Français ✅

- [x] Erreurs Better Auth traduites (`src/helpers/auth-errors.ts`)
- [x] Validation Zod en FR
- [x] Traduction erreurs Stripe (`src/helpers/stripe-errors.ts`)

---

## Milestone 8 : Déploiement Railway ✅

- [x] Configuration Railway avec Railpack
- [x] Variables d'environnement (Neon, Better Auth, Stripe)
- [x] Timezone serveur (Paris)
- [x] Package-lock.json sync
- [x] Invalidation cache TanStack Query après paiement
- [x] Supprimer env vars Polar sur Railway (POLAR_ACCESS_TOKEN, POLAR_WEBHOOK_SECRET)
- [x] Configurer webhook URL Stripe sur Dashboard (production)

---

## Milestone 8.5 : Contenu manquant (vs ancien site)

Éléments présents sur pasiopadelclub.com à ajouter :

### Footer complet ✅
- [x] Adresse complète : **24 rue Arnaud Detroyat, 64100 Bayonne, France**
- [x] Téléphone : **05.59.42.81.33**
- [x] Email : **pasio.padel.club@gmail.com**
- [x] Lien Facebook : **https://www.facebook.com/profile.php?id=61582670787439**
- [x] Lien Instagram : **https://www.instagram.com/pasio_padel_club/**

### Homepage - Section Features ✅
- [x] Section "Tout pour votre confort" avec 6 blocs features émojis
- [x] 🏟️ Piste panoramique (4 doubles · 1 simple · 1 kids)
- [x] 📹 Vidéo de vos matchs (téléchargement gratuit)
- [x] 🍹 Bar & espace convivial
- [x] 💆 Presso-thérapie (sur réservation)
- [x] 🎾 Location de matériel (à partir de 3€)
- [x] 🚿 Vestiaires & douches (accès inclus)

### Page Tarifs - Informations manquantes ✅
- [x] Prix par personne (déjà affiché)
- [x] Mention location raquettes 3€ ajoutée sous les cartes de prix

### URLs App Stores (corriger constants)
- [x] App Store : `https://apps.apple.com/fr/app/pasio-padel-club/id6752693886`
- [x] Google Play : `https://play.google.com/store/apps/details?id=com.livexperience.pasiopadelclub`

---

## Milestone 8.6 : Auth complet + RGPD critique

### Pages auth manquantes
- [x] Page `/mot-de-passe-oublie` (formulaire demande de reset)
- [x] Page `/reinitialiser-mot-de-passe` (définir nouveau mot de passe avec token)
- [x] Lien "Mot de passe oublié ?" sur page `/connexion`
- [x] Template email dédié reset password (ResetPasswordEmail)

### RGPD critique (pré-lancement)
- [ ] Checkbox consentement explicite à l'inscription (CNIL obligatoire)
- [ ] Mention collecte IP/UserAgent dans politique de confidentialité
- [ ] Notice technique sous formulaire inscription

---

## Milestones 9-13 : À venir

- **M9-10** : Dashboard admin (stats, blocage créneaux/users, réservations manuelles)
- **M11** : SEO (Schema.org, Google My Business)
- **M12** : Tests (Vitest)
- **M13** : RGPD (compléments)
  - [x] Anonymisation compte (implémenté)
  - [x] Suppression compte (implémenté)
  - [x] Export données JSON (implémenté) ⚠️ **À maintenir à jour** si nouvelles données ajoutées
  - [x] Page politique de confidentialité
  - [ ] Cron suppression automatique données > 3 ans (data retention)
  - [ ] Vérifier région Railway = Europe (ou documenter transferts hors-UE)
  - [ ] Vérifier région Neon = Europe (ou documenter transferts hors-UE)
  - [ ] Plan de réponse en cas de violation de données

---

## Milestones futures (post-lancement)

- **M14** : Page Enseignement/Cours (lancement prévu 12/2025)
  - **Titre** : "Cours de Padel À Venir 12/2025"
  - **Sous-titre** : "Pour les enfants et les adultes"
  - **Description** : "Au club, on vous propose des super profs de padel, passionnés et pédagogues, pour tous les niveaux : que vous soyez débutant ou joueur confirmé, nos coachs s'adaptent à votre jeu et à vos objectifs. Cours d'initiation, perfectionnement ou entraînement intensif. Leur objectif : vous faire progresser tout en prenant plaisir sur le terrain."
  - **Slogan** : "Prendre des cours c'est la base !!"
  - **Section "Notre équipe"** : 6 placeholders "Futur(e) prof ?" avec liens sociaux (Facebook, Twitter, LinkedIn)
  - **Section "Nos clients"** (partenaires) : balle de match, CA Pyrénées Gascogne, NOTED, GOAN, MOWI
- **M15** : Newsletter (inscription footer + emails marketing)
  - **Titre** : "Restons Connectés"
  - **Champs** : Email (requis) + Checkbox "Yes, subscribe me to your newsletter." (requis)
  - **Bouton** : "Subscribe"
- **M16** : Section partenaires/sponsors (peut être intégrée à M14)
  - Logos : balle de match, CA Pyrénées Gascogne, NOTED, GOAN, MOWI

