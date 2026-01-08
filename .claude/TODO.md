# Pasio Padel Club - TODO List

> **IMPORTANT - Workflow obligatoire pour chaque tâche :**
>
> 1. **Implémenter** la tâche
> 2. **Lancer `/code-review`** pour valider le code (obligatoire)
> 3. **Lancer `npm run lint --fix`** et corriger toutes les erreurs restantes
> 4. **Une fois tout validé**, cocher la tâche `[x]`
> 5. **Passer à la tâche suivante**
>
> ⚠️ **Ne jamais marquer une tâche comme terminée sans passer par `/code-review` et ne jamais sauter de tâche**

Liste complète des tâches à effectuer, splitées au maximum pour un contexte cohérent.

---

## Milestone 1 : Infrastructure & Configuration

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

### 1.2 Intégration BetterAuth
- [x] Installer BetterAuth (`npm install better-auth@1.4.9`)
- [x] Installer adaptateur Convex BetterAuth (`@convex-dev/better-auth`)
- [x] Créer `convex/auth.ts` - configuration serveur
- [x] Créer `src/lib/auth-client.ts` - configuration client
- [x] Créer route API `/api/auth/$`
- [x] Configurer provider email/password
- [x] Activer vérification email obligatoire
- [x] Configurer ConvexBetterAuthProvider dans `__root.tsx`
- [x] ~~Créer hook `useAuth()` pour le client~~ (non nécessaire, utiliser `authClient` directement)
- [x] ~~Créer hook `useSession()` pour le client~~ (non nécessaire, utiliser `authClient.useSession()` directement)

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

---

## Milestone 2 : Pages Publiques Statiques

### 2.1 Page Galerie
- [ ] Créer route `/galerie/index.tsx`
- [ ] Ajouter images statiques dans `public/gallery/`
- [ ] Créer composant `GalleryGrid` responsive
- [ ] Créer composant `Lightbox` pour agrandir
- [ ] Implémenter navigation clavier dans lightbox
- [ ] Ajouter métadonnées SEO page galerie

### 2.2 Page Contact
- [ ] Créer route `/contact/index.tsx`
- [ ] Créer composant `ContactForm` (nom, email, message)
- [ ] Ajouter validation Zod sur le formulaire
- [ ] Afficher adresse : 20 rue Alfred de Vigny, 64600 Anglet
- [ ] Afficher téléphone : 09 71 11 79 28
- [ ] Afficher email : contact@pasiopadelclub.fr
- [ ] Afficher horaires : 8h-22h, 7j/7
- [ ] Intégrer composant Map existant
- [ ] Créer `convex/contact.ts` - mutation pour envoyer email
- [ ] Créer action Resend pour email contact
- [ ] Afficher message succès après envoi
- [ ] Ajouter métadonnées SEO page contact

### 2.3 Pages Légales
- [ ] Créer route `/mentions-legales/index.tsx`
- [ ] Créer template contenu mentions légales
- [ ] Créer route `/cgv/index.tsx`
- [ ] Créer template contenu CGV
- [ ] Ajouter liens footer vers pages légales

### 2.4 Mise à jour Accueil
- [ ] Mettre à jour hero avec vraies infos club
- [ ] Vérifier/améliorer section FAQ
- [ ] Vérifier cohérence liens internes navbar
- [ ] Vérifier cohérence liens footer
- [ ] Ajouter lien vers page réservation

---

## Milestone 3 : Authentification Utilisateur

### 3.1 Page Inscription
- [ ] Créer route `/inscription/index.tsx`
- [ ] Créer composant `SignupForm`
- [ ] Champ email avec validation
- [ ] Champ mot de passe avec validation (min 8 chars)
- [ ] Champ confirmation mot de passe
- [ ] Champ prénom (obligatoire)
- [ ] Champ nom (obligatoire)
- [ ] Champ téléphone (obligatoire, format FR)
- [ ] Créer schéma Zod validation inscription
- [ ] Afficher erreurs de validation
- [ ] Gérer erreur "email déjà utilisé"
- [ ] Appeler BetterAuth signup
- [ ] Afficher message "vérifiez votre email"
- [ ] Rediriger vers page de confirmation

### 3.2 Page Connexion
- [ ] Créer route `/connexion/index.tsx`
- [ ] Créer composant `LoginForm`
- [ ] Champ email
- [ ] Champ mot de passe
- [ ] Checkbox "Se souvenir de moi"
- [ ] Lien vers `/inscription`
- [ ] Lien vers "Mot de passe oublié"
- [ ] Créer schéma Zod validation connexion
- [ ] Gérer erreur "email non vérifié"
- [ ] Gérer erreur "identifiants invalides"
- [ ] Rediriger vers page précédente après connexion
- [ ] Rediriger vers accueil si pas de page précédente

### 3.3 Récupération mot de passe
- [ ] Créer route `/mot-de-passe-oublie/index.tsx`
- [ ] Créer composant `ForgotPasswordForm`
- [ ] Envoyer email réinitialisation via BetterAuth
- [ ] Créer template email réinitialisation
- [ ] Créer route `/reset-password/index.tsx`
- [ ] Créer composant `ResetPasswordForm`
- [ ] Valider token de réinitialisation
- [ ] Mettre à jour mot de passe
- [ ] Rediriger vers connexion après succès

### 3.4 Gestion de session
- [ ] Mettre à jour navbar - afficher état connecté
- [ ] Afficher nom utilisateur si connecté
- [ ] Ajouter bouton "Mon compte" si connecté
- [ ] Ajouter bouton "Déconnexion" si connecté
- [ ] Afficher boutons "Connexion/Inscription" si déconnecté
- [ ] Implémenter fonction déconnexion
- [ ] Rediriger vers accueil après déconnexion

---

## Milestone 4 : Espace Utilisateur

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

---

## Milestone 5 : Système de Réservation (Frontend)

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

---

## Milestone 6 : Intégration Paiement Polar

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

---

## Milestone 7 : Emails Transactionnels

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

---

## Milestone 8 : Dashboard Admin - Base

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

---

## Milestone 9 : Dashboard Admin - Gestion

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

---

## Milestone 10 : SEO & Optimisation

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

---

## Milestone 11 : Tests & Qualité

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

---

## Milestone 12 : Déploiement & Production

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
- [ ] Configurer BetterAuth prod

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
