# Pasio Padel Club - Plan de Développement

## Vue d'ensemble

Site de réservation de terrains de padel pour le club Pasio Padel Club situé à **Anglet** (20 rue Alfred de Vigny, 64600 Anglet). L'objectif est de permettre aux utilisateurs de réserver et payer un créneau en ligne, avec un SEO optimisé pour la visibilité locale.

**Domaine de production :** pasiopadelclub.fr

---

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 19, TanStack Start avec Tanstack Router (SSR), Tailwind CSS 4, Shadcn, Vite |
| Backend | Convex |
| Authentification | Convex Auth (email/mot de passe) |
| Paiement | Polar |
| Emails transactionnels | Resend (templates React Email brandés) |
| Hébergement | Railway |
| Tests | Vitest (unitaires + intégration), pas de E2E |

---

## Structure des Terrains

### Semi-couverts (extérieur)
| Terrain | Joueurs | Durée | Prix | Créneaux |
|---------|---------|-------|------|----------|
| Double A | 4 | 90 min | 60€ | 8h, 9h30, 11h, 12h30, 14h, 15h30, 17h, 18h30, 20h |
| Double B | 4 | 90 min | 60€ | 8h, 9h30, 11h, 12h30, 14h, 15h30, 17h, 18h30, 20h |

### Couverts (intérieur)
| Terrain | Joueurs | Durée | Prix | Créneaux |
|---------|---------|-------|------|----------|
| Double C | 4 | 90 min | 60€ | 8h, 9h30, 11h, 12h30, 14h, 15h30, 17h, 18h30, 20h |
| Double D | 4 | 90 min | 60€ | 8h, 9h30, 11h, 12h30, 14h, 15h30, 17h, 18h30, 20h |
| Simple | 2 | 60 min | 30€ | 8h, 9h, 10h, 11h, 12h, 13h, 14h, 15h, 16h, 17h, 18h, 19h, 20h, 21h |
| Kids | 2 | 60 min | 15€ | 8h, 9h, 10h, 11h, 12h, 13h, 14h, 15h, 16h, 17h, 18h, 19h, 20h, 21h |

**Total : 6 terrains**
- Terrain "Kids" : ouvert à tous (info-bulle explicative dans l'interface)
- Grilles horaires indépendantes par durée (90 min vs 60 min)

---

## Règles de Réservation

- **Type** : Location de terrain uniquement (pas de cours avec coach)
- **Paiement** : Immédiat et obligatoire via Polar
- **Concurrence** : Réservation confirmée uniquement après paiement validé (webhook Polar). En cas de double-booking rare, frustration acceptée.
- **Annulation** : Autorisée uniquement si effectuée au moins 24 heures avant le créneau réservé (remboursement intégral)
- **Limite par utilisateur** : Maximum 2 réservations actives simultanément
- **Anticipation** : Réservation possible jusqu'à 10 jours à l'avance
- **Horaires** : 8h - 22h tous les jours
- **Tarification** : Prix fixes
- **Format dates/heures** : Format français court (15/01/2025 - 14:30)

---

## Spécifications UX/UI

### Inscription & Authentification
- **Vérification email obligatoire** : L'utilisateur reçoit un email de confirmation. Pas de réservation possible avant validation.
- **Téléphone obligatoire** : Champ requis dès l'inscription pour permettre au club de contacter le client.

### Page de Réservation
- **Mobile** : Filtres dans un drawer (panneau latéral) accessible via bouton. Grille de créneaux en plein écran.
- **Créneaux passés** : Affichés grisés pour voir l'occupation de la journée complète.
- **Limite atteinte (2/2)** : Affichage complet avec bandeau d'alerte permanent rappelant la limite.

### Gestion des erreurs
- **Polar indisponible** : Message simple "Paiement temporairement indisponible, réessayez plus tard".
- **Échec email** : Retry automatique 3x avec délai croissant (1min, 5min, 15min). Après 3 échecs, log l'erreur.

---

## Règles Admin

### Blocage utilisateur
- Quand un utilisateur est bloqué (`isBlocked: true`), toutes ses réservations futures sont **automatiquement annulées avec remboursement intégral**.

### Blocage de créneaux
- Si l'admin bloque une plage horaire qui chevauche des réservations existantes, celles-ci sont **automatiquement annulées avec remboursement** et email d'excuse envoyé aux utilisateurs concernés.

### Réservation manuelle admin
- L'admin peut créer une réservation **gratuite uniquement** (cas exceptionnels, blocage pour un client sans paiement).

### Statistiques
- Niveau basique : revenus du jour, semaine, mois. Pas de détail par terrain ou graphiques avancés.

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

## Modèle de Données Convex

### users
```typescript
{
  _id: Id<"users">,
  email: string,
  emailVerified: boolean,
  firstName: string,
  lastName: string,
  phone: string,
  role: "user" | "admin",
  isBlocked: boolean,
  isAnonymized: boolean,
  createdAt: number
}
```

### courts
```typescript
{
  _id: Id<"courts">,
  name: string,
  type: "double" | "simple" | "kids",
  location: "indoor" | "outdoor",
  capacity: 2 | 4,
  duration: 60 | 90,
  price: number,
  isActive: boolean
}
```

### bookings
```typescript
{
  _id: Id<"bookings">,
  userId: Id<"users">,
  courtId: Id<"courts">,
  date: string,
  startTime: string,
  endTime: string,
  price: number,
  polarPaymentId: string | null,
  paymentType: "online" | "free",
  status: "pending" | "confirmed" | "completed" | "cancelled",
  reminderSent: boolean,
  createdAt: number
}
```

### blockedSlots
```typescript
{
  _id: Id<"blockedSlots">,
  courtId: Id<"courts"> | null,
  date: string,
  startTime: string,
  endTime: string,
  reason?: string,
  createdAt: number
}
```

---

# Workflow

> **IMPORTANT - Workflow obligatoire pour chaque tâche :**
>
> 1. **Implémenter** la tâche
> 2. **Lancer `code-simplifier`** pour simplifier et valider le code (obligatoire)
>    - Vérifie le respect des règles `.claude/rules/` (TypeScript, comments, code-style, testing)
>    - Simplifie le code pour clarté et maintenabilité
> 3. **Lancer `npm run lint`** et corriger toutes les erreurs restantes
> 4. **Une fois tout validé**, cocher la tâche `[x]`
> 5. **Attendre la demande explicite de l'utilisateur pour passer à la milestone suivante**
>
> ⚠️ **Ne jamais marquer une tâche comme terminée sans passer par `code-simplifier` et ne jamais sauter de tâche**
> ⚠️ **Ne JAMAIS passer automatiquement à la milestone suivante - attendre la demande explicite de l'utilisateur**

---

## Milestone 1 : Infrastructure & Configuration

### Objectif
Mettre en place les fondations techniques du projet : Convex, Convex Auth, et structure de routing.

### 1.1 Configuration Convex
- [x] Installer Convex (`npm install convex`)
- [x] Initialiser Convex (`npx convex dev`)
- [x] Créer `convex/schema.ts` - table `users`
- [x] Créer `convex/schema.ts` - table `courts`
- [x] Créer `convex/schema.ts` - table `bookings`
- [x] Créer `convex/schema.ts` - table `blockedSlots`
- [x] Ajouter index `by_email` sur users
- [x] Ajouter index `by_date` sur bookings
- [x] Ajouter index `by_userId` sur bookings
- [x] Ajouter index `by_courtId` sur bookings
- [x] Configurer `.env.local` avec `CONVEX_DEPLOYMENT`
- [x] Créer `convex/courts.ts` - query `list`
- [x] Créer `convex/courts.ts` - query `getById`
- [x] Créer `convex/users.ts` - query `getByEmail`
- [x] Créer `convex/users.ts` - query `getCurrent`

### 1.2 Intégration Convex Auth
- [x] Désinstaller Better Auth (`npm uninstall better-auth @convex-dev/better-auth`)
- [x] Supprimer dossier `convex/betterAuth/`
- [x] Supprimer `convex/convex.config.ts` (système components)
- [x] Mettre à jour `convex/auth.config.ts` pour Convex Auth
- [x] Supprimer route API `/api/auth/$`
- [x] Installer Convex Auth (`npm install @convex-dev/auth @auth/core`)
- [x] Créer `convex/auth.ts` - configuration Convex Auth avec Password provider
- [x] Mettre à jour `convex/schema.ts` - ajouter `authTables`, unifier table `users`
- [x] Créer `convex/http.ts` - route HTTP pour auth
- [x] Supprimer `src/lib/auth-client.ts` (Convex Auth utilise `useAuthActions` directement)
- [x] Supprimer `src/lib/auth-server.ts` (plus nécessaire)
- [x] Configurer `ConvexAuthProvider` dans `router.tsx` (via Wrap)
- [x] Configurer variables env `AUTH_SECRET` et `JWT_PRIVATE_KEY`

### 1.3 Structure de Routing
- [x] Créer layout `_public__root.tsx` (existant, vérifier)
- [x] Créer layout `_authenticated.tsx`
- [x] Créer layout `_admin.tsx`
- [x] Créer route `/reservation/index.tsx` (placeholder)
- [x] Créer route `/galerie/index.tsx` (placeholder)
- [x] Créer route `/contact/index.tsx` (placeholder)
- [x] Créer route `/mentions-legales/index.tsx` (placeholder)
- [x] Créer route `/cgv/index.tsx` (placeholder)
- [x] Créer route `/connexion/index.tsx` (placeholder)
- [x] Créer route `/inscription/index.tsx` (placeholder)
- [x] Créer route `/mon-compte/index.tsx` (placeholder)
- [x] Créer route `/admin/index.tsx` (placeholder)
- [x] Configurer `beforeLoad` guard pour routes admin
- [x] Configurer `beforeLoad` guard pour routes authentifiées
- [x] Configurer redirection si non authentifié

### 1.4 Seed Data
- [x] Créer `convex/seed.ts` - fonction pour insérer terrains
- [x] Insérer terrain "Double A" (outdoor, 90min, 60€)
- [x] Insérer terrain "Double B" (outdoor, 90min, 60€)
- [x] Insérer terrain "Double C" (indoor, 90min, 60€)
- [x] Insérer terrain "Double D" (indoor, 90min, 60€)
- [x] Insérer terrain "Simple" (indoor, 60min, 30€)
- [x] Insérer terrain "Kids" (indoor, 60min, 15€)
- [x] Créer compte admin initial (email + mot de passe)
- [x] Exécuter seed en développement

### Livrables
- Convex fonctionnel avec schéma unifié (pas de component séparé)
- Authentification Convex Auth email/mot de passe
- Structure de routing complète
- Base de données initialisée avec les terrains

### 1.5 Améliorations Techniques (Planifiées)

> Ces améliorations ont été identifiées lors de l'audit du Milestone 1 et doivent être réalisées avant de continuer.

#### T3 Env - Gestion des variables d'environnement
- [x] Installer T3 Env (`npm install @t3-oss/env-core zod`)
- [x] Créer `src/env/server.ts` et `src/env/client.ts` avec validation Zod
- [x] Migrer `VITE_CONVEX_URL` (client)
- [x] Migrer `VITE_CONVEX_SITE_URL` (serveur)
- [x] Migrer `SITE_URL` (serveur - Convex)
- [x] Mettre à jour `convex/auth.ts` pour utiliser validation Zod (`convex/env.ts`)
- [x] ~~Mettre à jour `src/lib/auth-server.ts` pour utiliser T3 Env~~ (fichier supprimé - Convex Auth)

#### Index Convex manquant
- [x] Ajouter index composite `by_courtId_date` sur `blockedSlots` (nécessaire pour M5)

#### Architecture Frontend
- [x] Déplacer Navbar dans `_public__root/route.tsx` au lieu de la dupliquer dans chaque route
- [x] Renommer `tarifs.tsx` en `tarifs/index.tsx` pour cohérence

#### Optimisations Schema (à considérer pour M5)
- [ ] Évaluer migration `date: string` → `dateUnix: number` pour range queries
- [ ] Ajouter champs `updatedAt` et `paymentConfirmedAt` sur bookings

---

## Milestone 2 : Pages Publiques Statiques

### Objectif
Créer les pages publiques du site qui ne nécessitent pas d'authentification ni de données dynamiques.

### 2.1 Page Galerie
- [x] Créer route `/galerie/index.tsx`
- [x] Ajouter images statiques (placeholder Unsplash pour l'instant)
- [x] Créer composant `GalleryGrid` responsive avec filtres par catégorie
- [x] Créer composant `Lightbox` pour agrandir
- [x] Implémenter navigation clavier dans lightbox (Escape, ArrowLeft, ArrowRight)
- [x] Ajouter métadonnées SEO page galerie

### 2.2 Page Contact
- [x] Créer route `/contact/index.tsx`
- [x] Créer composant `ContactForm` (nom, email, message)
- [x] Ajouter validation Zod sur le formulaire
- [x] Afficher adresse : 20 rue Alfred de Vigny, 64600 Anglet
- [x] Afficher téléphone : 09 71 11 79 28
- [x] Afficher email : contact@pasiopadelclub.fr
- [x] Afficher horaires : 8h-22h, 7j/7
- [x] Intégrer Google Maps iframe
- [ ] Créer `convex/contact.ts` - mutation pour envoyer email (M7)
- [ ] Créer action Resend pour email contact (M7)
- [x] Afficher message succès après envoi (UI only, backend M7)
- [x] Ajouter métadonnées SEO page contact

### 2.3 Pages Légales
- [x] Créer route `/mentions-legales/index.tsx`
- [x] Créer template contenu mentions légales
- [x] Créer route `/cgv/index.tsx`
- [x] Créer template contenu CGV
- [x] Ajouter liens footer vers pages légales

### 2.4 Mise à jour Accueil
- [ ] Mettre à jour hero avec vraies infos club
- [ ] Vérifier/améliorer section FAQ
- [x] Vérifier cohérence liens internes navbar (Accueil, Tarifs, Galerie, Contact)
- [x] Vérifier cohérence liens footer (Tarifs, Galerie, Contact + CGV, Mentions légales)
- [ ] Ajouter lien vers page réservation

### 2.5 Page Tarifs
- [x] Créer route `/tarifs/index.tsx`
- [x] Créer 3 cartes tarifaires (une par prix)
- [x] **Carte principale "Double" (mise en avant)** : 60€, 90min, 4 joueurs, terrains A/B (outdoor) + C/D (indoor)
- [x] Carte secondaire "Simple" : 30€, 60min, 2 joueurs, indoor
- [x] Carte secondaire "Kids" : 15€, 60min, 2 joueurs, indoor + info-bulle "Ouvert à tous"
- [x] Design : carte Double plus grande/proéminente, Simple et Kids plus discrètes
- [x] Ajouter CTA "Réserver" vers page réservation
- [x] Ajouter métadonnées SEO page tarifs

### Livrables
- Page galerie avec photos du club
- Page contact fonctionnelle avec formulaire
- Pages mentions légales et CGV
- Page tarifs avec 3 cartes (Double mise en avant)
- Accueil mis à jour

---

## Milestone 3 : Authentification Utilisateur

### Objectif
Implémenter le flux complet d'inscription et de connexion utilisateur.

### 3.1 Page Inscription
- [x] Créer route `/inscription/index.tsx`
- [x] Créer composant `SignupForm`
- [x] Champ email avec validation
- [x] Champ mot de passe avec validation (min 8 chars)
- [x] Champ confirmation mot de passe
- [x] Champ prénom (obligatoire)
- [x] Champ nom (obligatoire)
- [x] Champ téléphone (obligatoire, format FR)
- [x] Créer schéma Zod validation inscription
- [x] Afficher erreurs de validation
- [x] Gérer erreur "email déjà utilisé"
- [x] Appeler Convex Auth signup via `signIn('password', { flow: 'signUp' })`
- [x] Afficher message "vérifiez votre email"
- [x] Rediriger vers page de confirmation

### 3.2 Page Connexion
- [x] Créer route `/connexion/index.tsx`
- [x] Créer composant `LoginForm`
- [x] Champ email
- [x] Champ mot de passe
- [x] Checkbox "Se souvenir de moi"
- [x] Lien vers `/inscription`
- [x] Lien vers "Mot de passe oublié"
- [x] Créer schéma Zod validation connexion
- [x] Gérer erreur "email non vérifié"
- [x] Gérer erreur "identifiants invalides"
- [x] Rediriger vers page précédente après connexion
- [x] Rediriger vers accueil si pas de page précédente

### 3.3 Récupération mot de passe
- [x] Créer route `/mot-de-passe-oublie/index.tsx`
- [x] Créer composant `ForgotPasswordForm` (flow 2 étapes: email → code+nouveau mdp)
- [x] Envoyer email réinitialisation via Convex Auth (Password provider avec reset)
- [x] Créer `convex/ResendOTPPasswordReset.ts` - provider OTP 8 chiffres
- [x] Créer composant partagé `FormField` pour éviter duplication code
- [x] Valider code OTP et mettre à jour mot de passe
- [x] Rediriger vers connexion après succès

### 3.4 Gestion de session
- [ ] Mettre à jour navbar - afficher état connecté
- [ ] Afficher nom utilisateur si connecté
- [ ] Ajouter bouton "Mon compte" si connecté
- [ ] Ajouter bouton "Déconnexion" si connecté
- [ ] Afficher boutons "Connexion/Inscription" si déconnecté
- [ ] Implémenter fonction déconnexion
- [ ] Rediriger vers accueil après déconnexion

### Livrables
- Flux d'inscription complet avec vérification email
- Flux de connexion complet
- Récupération de mot de passe
- Navbar dynamique selon état de connexion

---

## Milestone 4 : Espace Utilisateur

### Objectif
Créer l'espace personnel de l'utilisateur pour gérer son profil et voir ses réservations.

### 4.1 Dashboard Utilisateur
- [ ] Créer route `/mon-compte/index.tsx`
- [ ] Créer layout espace utilisateur
- [ ] Créer navigation espace utilisateur (tabs ou sidebar)
- [ ] Créer query `bookings.getUpcoming` (réservations à venir)
- [ ] Afficher liste réservations à venir
- [ ] Afficher compteur réservations actives (X/2)
- [ ] Afficher message si aucune réservation

### 4.2 Annulation de Réservation
- [ ] Créer composant `BookingCard` avec détails
- [ ] Ajouter bouton "Annuler" sur chaque réservation
- [ ] Calculer si annulation possible (> 24h)
- [ ] Désactiver bouton si < 24h
- [ ] Afficher tooltip "Annulation impossible < 24h"
- [ ] Créer composant `CancelBookingModal`
- [ ] Afficher détails réservation dans modale
- [ ] Créer mutation `bookings.cancel`
- [ ] Vérifier délai 24h côté serveur
- [ ] Appeler action remboursement Polar
- [ ] Mettre à jour status "cancelled"
- [ ] Envoyer email confirmation annulation
- [ ] Afficher message succès après annulation

### 4.3 Historique des Réservations
- [ ] Créer route `/mon-compte/historique.tsx`
- [ ] Créer query `bookings.getPast` (réservations passées)
- [ ] Afficher liste réservations passées
- [ ] Afficher date format JJ/MM/AAAA
- [ ] Afficher terrain, durée, prix payé
- [ ] Implémenter pagination (20 par page)
- [ ] Afficher message si aucun historique

### 4.4 Gestion du Profil
- [ ] Créer route `/mon-compte/profil.tsx`
- [ ] Afficher email (non modifiable)
- [ ] Créer formulaire modification prénom
- [ ] Créer formulaire modification nom
- [ ] Créer formulaire modification téléphone
- [ ] Créer mutation `users.updateProfile`
- [ ] Afficher message succès après modification
- [ ] Créer section "Changer mot de passe"
- [ ] Champ ancien mot de passe
- [ ] Champ nouveau mot de passe
- [ ] Champ confirmation nouveau mot de passe
- [ ] Valider ancien mot de passe côté serveur
- [ ] Afficher message succès après changement

### 4.5 Suppression de compte
- [ ] Ajouter section "Supprimer mon compte"
- [ ] Créer composant `DeleteAccountModal`
- [ ] Demander confirmation par mot de passe
- [ ] Créer mutation `users.anonymize`
- [ ] Anonymiser données personnelles
- [ ] Mettre `isAnonymized: true`
- [ ] Désactiver le compte
- [ ] Déconnecter l'utilisateur
- [ ] Rediriger vers accueil

### Livrables
- Dashboard utilisateur avec réservations à venir
- Historique complet des réservations
- Modification du profil et mot de passe
- Suppression/anonymisation de compte

---

## Milestone 5 : Système de Réservation (Frontend)

### Objectif
Créer l'interface de réservation permettant aux utilisateurs de voir les créneaux disponibles et d'en sélectionner un.

### 5.1 Page de Réservation
- [ ] Créer route `/reservation/index.tsx`
- [ ] Créer composant `DateSelector` (10 prochains jours)
- [ ] Afficher dates en format JJ/MM
- [ ] Marquer date sélectionnée
- [ ] Créer composant `FilterDrawer` (mobile)
- [ ] Bouton pour ouvrir drawer sur mobile
- [ ] Filtre par type (double, simple, kids)
- [ ] Filtre par localisation (indoor, outdoor)
- [ ] Créer composant `FilterBar` (desktop)
- [ ] Créer composant `LimitBanner` si 2/2 atteint
- [ ] Afficher bandeau d'alerte permanent

### 5.2 Liste des Créneaux
- [ ] Créer query `slots.getAvailable` (par date)
- [ ] Générer créneaux 90min pour terrains double
- [ ] Générer créneaux 60min pour terrains simple/kids
- [ ] Créer composant `CourtSection` (groupe par terrain)
- [ ] Créer composant `SlotCard`
- [ ] Style "available" (vert, cliquable)
- [ ] Style "booked" (rouge, non cliquable)
- [ ] Style "blocked" (gris hachuré)
- [ ] Style "past" (gris, non cliquable)
- [ ] Afficher heure début - heure fin
- [ ] Afficher prix sur chaque créneau
- [ ] Ajouter tooltip "Ouvert à tous" sur terrain Kids

### 5.3 Sélection et Récapitulatif
- [ ] Au clic sur créneau - vérifier si connecté
- [ ] Rediriger vers connexion si non connecté
- [ ] Stocker URL retour pour après connexion
- [ ] Vérifier limite 2 réservations actives
- [ ] Afficher erreur si limite atteinte
- [ ] Créer composant `BookingSummaryModal`
- [ ] Afficher terrain, date, heure, durée
- [ ] Afficher prix à payer
- [ ] Bouton "Payer" pour continuer
- [ ] Bouton "Annuler" pour fermer

### 5.4 Logique de Disponibilité (Convex)
- [ ] Créer `convex/slots.ts`
- [ ] Fonction génération créneaux 90min
- [ ] Fonction génération créneaux 60min
- [ ] Query `slots.getByDate` avec filtres
- [ ] Exclure réservations existantes (status confirmed)
- [ ] Exclure blocages admin
- [ ] Marquer créneaux passés (pour aujourd'hui)
- [ ] Ajouter index pour performances

### Livrables
- Interface de réservation complète
- Filtres fonctionnels (drawer mobile)
- Logique de disponibilité avec grilles indépendantes
- Récapitulatif avant paiement

---

## Milestone 6 : Intégration Paiement Polar

### Objectif
Intégrer Polar pour le paiement en ligne et la confirmation automatique des réservations.

### 6.1 Configuration Polar
- [ ] Créer compte Polar
- [ ] Configurer clés API dev dans `.env.local`
- [ ] Créer produit "Court Double" (60€)
- [ ] Créer produit "Court Simple" (30€)
- [ ] Créer produit "Court Kids" (15€)
- [ ] Configurer URL webhook
- [ ] Configurer URLs retour (success/cancel)

### 6.2 Initiation du Paiement
- [ ] Créer `src/lib/polar.ts` - client Polar
- [ ] Créer `convex/payments.ts`
- [ ] Créer mutation `bookings.initiate`
- [ ] Créer booking status "pending"
- [ ] Créer action `payments.createCheckout`
- [ ] Générer session Polar Checkout
- [ ] Retourner URL checkout
- [ ] Rediriger utilisateur vers Polar

### 6.3 Webhooks Polar
- [ ] Créer route API `/api/webhooks/polar.ts`
- [ ] Récupérer raw body pour signature
- [ ] Valider signature webhook
- [ ] Gérer event `order.created`
- [ ] Trouver booking par metadata
- [ ] Mettre à jour status "confirmed"
- [ ] Stocker `polarPaymentId`
- [ ] Déclencher email confirmation
- [ ] Gérer event `checkout.canceled`
- [ ] Supprimer booking pending
- [ ] Logger tous les events

### 6.4 Pages de Retour
- [ ] Créer route `/reservation/success.tsx`
- [ ] Afficher message confirmation
- [ ] Afficher récapitulatif réservation
- [ ] Bouton vers "Mes réservations"
- [ ] Créer route `/reservation/echec.tsx`
- [ ] Afficher message erreur simple
- [ ] Bouton "Réessayer"
- [ ] Bouton "Retour accueil"

### 6.5 Remboursements
- [ ] Créer action `payments.refund`
- [ ] Appeler API Polar refund
- [ ] Gérer erreurs remboursement
- [ ] Logger résultat remboursement
- [ ] Utiliser dans annulation utilisateur
- [ ] Utiliser dans blocage admin
- [ ] Utiliser dans blocage utilisateur

### Livrables
- Paiement Polar fonctionnel
- Webhooks configurés et sécurisés
- Réservations créées automatiquement après paiement
- Pages de confirmation/erreur
- Système de remboursement

---

## Milestone 7 : Emails Transactionnels

### Objectif
Implémenter les emails de confirmation et de rappel via Resend.

### 7.1 Configuration Resend
- [ ] Créer compte Resend
- [ ] Ajouter domaine pasiopadelclub.fr
- [ ] Vérifier DNS domaine
- [ ] Configurer clé API dans `.env.local`
- [ ] Créer `src/lib/resend.ts` - client
- [ ] Installer React Email
- [ ] Créer dossier `src/emails/`

### 7.2 Templates emails
- [ ] Créer composant `EmailHeader` (logo)
- [ ] Créer composant `EmailFooter` (coordonnées)
- [ ] Créer composant `EmailButton` (CTA)
- [ ] Créer composant `BookingDetails` (bloc réservation)
- [ ] Créer template `BookingConfirmation.tsx`
- [ ] Créer template `BookingReminder.tsx`
- [ ] Créer template `BookingCancelled.tsx`
- [ ] Créer template `BookingCancelledByAdmin.tsx`
- [ ] Créer template `EmailVerification.tsx`
- [ ] Créer template `PasswordReset.tsx`
- [ ] Créer template `ContactForm.tsx`

### 7.3 Actions d'envoi
- [ ] Créer `convex/emails.ts`
- [ ] Créer action `emails.send` avec retry 3x
- [ ] Implémenter délais retry (1min, 5min, 15min)
- [ ] Logger échecs après 3 tentatives
- [ ] Action `emails.sendBookingConfirmation`
- [ ] Action `emails.sendBookingReminder`
- [ ] Action `emails.sendBookingCancelled`
- [ ] Action `emails.sendEmailVerification`
- [ ] Action `emails.sendPasswordReset`
- [ ] Action `emails.sendContactForm`

### 7.4 Système de rappel
- [ ] Créer `convex/crons.ts`
- [ ] Configurer cron toutes les 15 minutes
- [ ] Query réservations à rappeler (24h avant)
- [ ] Filtrer `reminderSent: false`
- [ ] Envoyer email rappel
- [ ] Mettre `reminderSent: true`

### Livrables
- Emails brandés avec React Email
- Système de retry 3x
- Email de confirmation automatique
- Système de rappel 24h avant (exactement)
- Formulaire de contact fonctionnel

---

## Milestone 8 : Dashboard Admin - Base

### Objectif
Créer la structure du dashboard admin avec l'authentification et la vue d'ensemble.

### 8.1 Authentification Admin
- [ ] Créer middleware vérification rôle admin
- [ ] Appliquer sur toutes routes `/admin/*`
- [ ] Rediriger vers accueil si non admin
- [ ] Afficher message "Accès non autorisé"

### 8.2 Layout Admin
- [ ] Créer composant `AdminSidebar`
- [ ] Lien Dashboard
- [ ] Lien Réservations
- [ ] Lien Terrains
- [ ] Lien Utilisateurs
- [ ] Lien Blocages
- [ ] Créer composant `AdminHeader`
- [ ] Afficher nom admin
- [ ] Bouton déconnexion
- [ ] Créer layout `_admin.tsx` avec sidebar/header
- [ ] Style distinct de la partie publique

### 8.3 Dashboard Principal
- [ ] Créer route `/admin/index.tsx`
- [ ] Créer query `stats.getBookingsToday`
- [ ] Créer query `stats.getBookingsWeek`
- [ ] Créer query `stats.getBookingsMonth`
- [ ] Créer query `stats.getRevenueToday`
- [ ] Créer query `stats.getRevenueWeek`
- [ ] Créer query `stats.getRevenueMonth`
- [ ] Créer composant `StatCard`
- [ ] Afficher 6 stats (réservations + revenus)
- [ ] Créer query `bookings.getLatest(5)`
- [ ] Afficher liste 5 dernières réservations

### Livrables
- Accès admin sécurisé
- Layout admin complet
- Dashboard avec statistiques basiques

---

## Milestone 9 : Dashboard Admin - Gestion

### Objectif
Implémenter les fonctionnalités de gestion complète pour l'administrateur.

### 9.1 Gestion des Réservations
- [ ] Créer route `/admin/reservations/index.tsx`
- [ ] Créer query `bookings.listAdmin` avec pagination
- [ ] Créer composant `BookingsTable`
- [ ] Colonne date
- [ ] Colonne terrain
- [ ] Colonne utilisateur
- [ ] Colonne statut
- [ ] Colonne prix
- [ ] Créer filtres (date, terrain, statut)
- [ ] Créer route `/admin/reservations/[id].tsx`
- [ ] Afficher détails complets réservation
- [ ] Créer composant `CreateFreeBookingModal`
- [ ] Formulaire réservation gratuite
- [ ] Mutation `bookings.createFree`

### 9.2 Gestion des Terrains
- [ ] Créer route `/admin/terrains/index.tsx`
- [ ] Créer query `courts.listAdmin`
- [ ] Créer composant `CourtsTable`
- [ ] Afficher nom, type, localisation, prix, statut
- [ ] Créer toggle activer/désactiver
- [ ] Mutation `courts.toggleActive`

### 9.3 Gestion des Utilisateurs
- [ ] Créer route `/admin/utilisateurs/index.tsx`
- [ ] Créer query `users.listAdmin` avec pagination
- [ ] Créer composant `UsersTable`
- [ ] Colonne email
- [ ] Colonne nom complet
- [ ] Colonne téléphone
- [ ] Colonne statut (actif/bloqué)
- [ ] Créer recherche par email/nom
- [ ] Créer route `/admin/utilisateurs/[id].tsx`
- [ ] Afficher détails utilisateur
- [ ] Afficher ses réservations
- [ ] Créer bouton bloquer/débloquer
- [ ] Mutation `users.toggleBlock`
- [ ] Si blocage : annuler réservations futures
- [ ] Si blocage : déclencher remboursements
- [ ] Si blocage : envoyer emails

### 9.4 Système de Blocage de Créneaux
- [ ] Créer route `/admin/blocages/index.tsx`
- [ ] Créer query `blockedSlots.list`
- [ ] Créer composant `BlockedSlotsTable`
- [ ] Afficher date, heures, terrain(s), raison
- [ ] Créer composant `CreateBlockModal`
- [ ] Sélecteur date
- [ ] Sélecteur heure début
- [ ] Sélecteur heure fin
- [ ] Sélecteur terrain(s) ou tous
- [ ] Champ raison (optionnel)
- [ ] Query réservations impactées avant création
- [ ] Afficher liste réservations à annuler
- [ ] Demander confirmation
- [ ] Mutation `blockedSlots.create`
- [ ] Annuler réservations impactées
- [ ] Déclencher remboursements
- [ ] Envoyer emails d'excuse
- [ ] Créer bouton supprimer blocage
- [ ] Mutation `blockedSlots.delete`

### Livrables
- Gestion complète des réservations
- Gestion des terrains
- Gestion des utilisateurs avec blocage
- Système de blocage avec annulation automatique

---

## Milestone 10 : SEO & Optimisation

### Objectif
Optimiser le site pour le référencement local et les performances.

### 10.1 Métadonnées
- [ ] Créer composant `SEO` réutilisable
- [ ] Ajouter title unique par page
- [ ] Ajouter description unique par page
- [ ] Ajouter og:title par page
- [ ] Ajouter og:description par page
- [ ] Ajouter og:image par page
- [ ] Ajouter Twitter Cards
- [ ] Ajouter canonical URLs

### 10.2 Schema.org
- [ ] Créer JSON-LD LocalBusiness
- [ ] Nom : Pasio Padel Club
- [ ] Adresse : 20 rue Alfred de Vigny, 64600 Anglet
- [ ] Téléphone : 09 71 11 79 28
- [ ] Horaires : 8h-22h, 7j/7
- [ ] Créer JSON-LD SportsActivityLocation
- [ ] Intégrer dans `<head>` de chaque page

### 10.3 Fichiers SEO
- [ ] Créer `public/robots.txt`
- [ ] Configurer génération sitemap.xml
- [ ] Ajouter toutes les routes publiques

### 10.4 Performance
- [ ] Convertir images en WebP
- [ ] Définir dimensions appropriées
- [ ] Ajouter lazy loading images
- [ ] Analyser bundle size
- [ ] Optimiser imports
- [ ] Lancer audit Lighthouse
- [ ] Corriger problèmes Performance
- [ ] Corriger problèmes Accessibility
- [ ] Corriger problèmes Best Practices
- [ ] Corriger problèmes SEO
- [ ] Atteindre score 90+ partout

### 10.5 Google My Business
- [ ] Vérifier cohérence NAP avec fiche GMB
- [ ] Ajouter lien GMB dans footer

### Livrables
- Métadonnées complètes sur toutes les pages
- Schema.org intégré
- Sitemap et robots.txt
- Score Lighthouse 90+
- Cohérence avec fiche GMB

---

## Milestone 11 : Tests & Qualité

### Objectif
S'assurer de la fiabilité du système avec des tests appropriés.

### 11.1 Tests Unitaires (Vitest)
- [ ] Configurer Vitest
- [ ] Tests fonctions utilitaires dates
- [ ] Tests fonctions formatage prix
- [ ] Tests validations Zod inscription
- [ ] Tests validations Zod connexion
- [ ] Tests calcul créneaux 90min
- [ ] Tests calcul créneaux 60min
- [ ] Tests calcul disponibilité
- [ ] Tests vérification délai 24h

### 11.2 Tests d'Intégration
- [ ] Tests mutations Convex bookings
- [ ] Tests mutations Convex users
- [ ] Tests queries Convex slots
- [ ] Tests queries Convex stats
- [ ] Tests flux authentification

### Livrables
- Suite de tests unitaires
- Tests d'intégration Convex
- Couverture de code acceptable

---

## Milestone 12 : Déploiement & Production

### Objectif
Déployer le site en production sur Railway.

### 12.1 Configuration Railway
- [ ] Créer projet Railway
- [ ] Lier repository GitHub
- [ ] Configurer variables environnement prod
- [ ] Configurer domaine pasiopadelclub.fr
- [ ] Vérifier SSL/HTTPS automatique
- [ ] Configurer déploiement auto depuis main

### 12.2 Configuration Convex Production
- [ ] Créer environnement production Convex
- [ ] Configurer variables prod Convex
- [ ] Déployer schéma en production
- [ ] Exécuter seed terrains en prod
- [ ] Créer compte admin production

### 12.3 Configuration Services
- [ ] Configurer Polar mode production
- [ ] Mettre à jour clés API Polar
- [ ] Configurer webhook Polar prod
- [ ] Vérifier domaine Resend prod
- [ ] Mettre à jour clés API Resend
- [ ] Configurer Convex Auth prod (AUTH_SECRET)

### 12.4 Monitoring
- [ ] Configurer logs Railway
- [ ] Configurer alertes erreurs
- [ ] Vérifier logs Convex

### 12.5 Go Live
- [ ] Tests finaux complets
- [ ] Vérifier toutes les pages
- [ ] Tester flux réservation complet
- [ ] Tester flux paiement
- [ ] Tester emails
- [ ] Vérifier cohérence avec fiche GMB
- [ ] Annoncer mise en ligne

### Livrables
- Site déployé sur Railway
- Domaine pasiopadelclub.fr configuré avec HTTPS
- Monitoring en place
