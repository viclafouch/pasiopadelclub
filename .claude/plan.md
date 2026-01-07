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
| Authentification | BetterAuth (email/mot de passe) |
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

# MILESTONES

---

## Milestone 1 : Infrastructure & Configuration

### Objectif
Mettre en place les fondations techniques du projet : Convex, BetterAuth, et structure de routing.

### Tâches

#### 1.1 Configuration Convex
- [ ] Installer et configurer Convex
- [ ] Créer le schéma de base de données (users, courts, bookings, blockedSlots)
- [ ] Configurer les variables d'environnement
- [ ] Créer les fonctions de base (queries/mutations)

#### 1.2 Intégration BetterAuth
- [ ] Installer BetterAuth
- [ ] Configurer l'adaptateur Convex pour BetterAuth
- [ ] Créer les routes d'authentification API
- [ ] Configurer le middleware d'authentification
- [ ] Implémenter la vérification d'email obligatoire

#### 1.3 Structure de Routing
- [ ] Organiser les routes TanStack Router
  - Routes publiques : `/`, `/tarifs`, `/reservation`, `/galerie`, `/contact`, `/mentions-legales`, `/cgv`
  - Routes authentifiées : `/connexion`, `/inscription`, `/mon-compte`
  - Routes admin : `/admin/*`
- [ ] Créer les layouts (public, authenticated, admin)
- [ ] Configurer les guards de route (protection admin)

#### 1.4 Seed Data
- [ ] Créer un script pour insérer les 6 terrains de base
- [ ] Créer un compte admin initial

### Livrables
- Convex fonctionnel avec schéma complet
- Authentification email/mot de passe avec vérification email
- Structure de routing complète
- Base de données initialisée avec les terrains

---

## Milestone 2 : Pages Publiques Statiques

### Objectif
Créer les pages publiques du site qui ne nécessitent pas d'authentification ni de données dynamiques.

### Tâches

#### 2.1 Page Galerie
- [ ] Créer la route `/galerie`
- [ ] Intégrer les images statiques du club (dossier public/)
- [ ] Layout responsive avec grille d'images
- [ ] Lightbox pour agrandir les photos

#### 2.2 Page Contact
- [ ] Créer la route `/contact`
- [ ] Formulaire de contact public (nom, email, message) - sans CAPTCHA
- [ ] Afficher les informations pratiques (20 rue Alfred de Vigny, 64600 Anglet)
- [ ] Intégrer la carte existante
- [ ] Envoi d'email via Resend à l'admin

#### 2.3 Pages Légales
- [ ] Créer la route `/mentions-legales`
- [ ] Créer la route `/cgv`
- [ ] Templates de contenu (à compléter avec les vraies informations)

#### 2.4 Mise à jour Accueil
- [ ] Mettre à jour le hero avec les vraies informations du club
- [ ] Améliorer la section FAQ avec questions pertinentes
- [ ] Vérifier la cohérence des liens internes

### Livrables
- Page galerie avec photos du club
- Page contact fonctionnelle avec formulaire
- Pages mentions légales et CGV
- Accueil mis à jour

---

## Milestone 3 : Authentification Utilisateur

### Objectif
Implémenter le flux complet d'inscription et de connexion utilisateur.

### Tâches

#### 3.1 Page Inscription
- [ ] Créer la route `/inscription`
- [ ] Formulaire : email, mot de passe, confirmation mot de passe, prénom, nom, téléphone (obligatoire)
- [ ] Validation des champs (Zod)
- [ ] Gestion des erreurs (email déjà utilisé, etc.)
- [ ] Email de vérification obligatoire avant accès complet
- [ ] Redirection après inscription réussie

#### 3.2 Page Connexion
- [ ] Créer la route `/connexion`
- [ ] Formulaire : email, mot de passe
- [ ] Vérifier que l'email est validé avant connexion
- [ ] Option "Se souvenir de moi"
- [ ] Lien vers inscription
- [ ] Gestion des erreurs
- [ ] Redirection vers page précédente ou accueil

#### 3.3 Récupération de mot de passe
- [ ] Formulaire "Mot de passe oublié"
- [ ] Email de réinitialisation via Resend
- [ ] Page de réinitialisation avec nouveau mot de passe

#### 3.4 Gestion de session
- [ ] Afficher l'état connecté/déconnecté dans la navbar
- [ ] Bouton de déconnexion
- [ ] Protection des routes authentifiées

### Livrables
- Flux d'inscription complet avec vérification email
- Flux de connexion complet
- Récupération de mot de passe
- Navbar dynamique selon état de connexion

---

## Milestone 4 : Espace Utilisateur

### Objectif
Créer l'espace personnel de l'utilisateur pour gérer son profil et voir ses réservations.

### Tâches

#### 4.1 Dashboard Utilisateur
- [ ] Créer la route `/mon-compte`
- [ ] Afficher les réservations à venir (prochains créneaux)
- [ ] Indicateur du nombre de réservations actives (X/2)

#### 4.2 Annulation de Réservation
- [ ] Bouton d'annulation sur chaque réservation à venir (si > 24h avant)
- [ ] Afficher un message d'erreur si < 24h avant le créneau
- [ ] Modale de confirmation avant annulation
- [ ] Vérification côté serveur du délai de 24h minimum
- [ ] Déclenchement du remboursement via Polar
- [ ] Mise à jour du statut de la réservation en "cancelled"
- [ ] Envoi d'email de confirmation d'annulation

#### 4.3 Historique des Réservations
- [ ] Liste des réservations passées
- [ ] Détails : date (format JJ/MM/AAAA), terrain, durée, prix payé
- [ ] Pagination ou infinite scroll

#### 4.4 Gestion du Profil
- [ ] Afficher les informations du compte
- [ ] Modifier : prénom, nom, téléphone
- [ ] Modifier le mot de passe (ancien + nouveau)
- [ ] Email non modifiable (identifiant)

#### 4.5 Suppression de compte
- [ ] Bouton de demande de suppression
- [ ] Modale de confirmation
- [ ] Anonymisation des données (pas de suppression complète)
- [ ] Désactivation du compte

### Livrables
- Dashboard utilisateur avec réservations à venir
- Historique complet des réservations
- Modification du profil et mot de passe
- Suppression/anonymisation de compte

---

## Milestone 5 : Système de Réservation (Frontend)

### Objectif
Créer l'interface de réservation permettant aux utilisateurs de voir les créneaux disponibles et d'en sélectionner un.

### Tâches

#### 5.1 Page de Réservation
- [ ] Créer la route `/reservation`
- [ ] Sélecteur de date (10 prochains jours)
- [ ] Filtres par type de terrain (double, simple, kids) - dans drawer sur mobile
- [ ] Filtres par localisation (indoor, outdoor)
- [ ] Bandeau d'alerte si limite 2/2 atteinte

#### 5.2 Liste des Créneaux
- [ ] Afficher les créneaux disponibles pour la date sélectionnée
- [ ] Grouper par terrain
- [ ] États visuels : disponible, complet, bloqué, passé (grisé)
- [ ] Afficher les créneaux passés de la journée en grisé
- [ ] Afficher prix et durée pour chaque créneau
- [ ] Info-bulle sur terrain Kids : "Ouvert à tous"

#### 5.3 Sélection et Récapitulatif
- [ ] Au clic sur un créneau → vérifier si connecté
- [ ] Si non connecté → redirection connexion avec retour
- [ ] Vérifier limite de 2 réservations actives
- [ ] Afficher modale/page récapitulatif avant paiement

#### 5.4 Logique de Disponibilité (Convex)
- [ ] Query pour récupérer les créneaux disponibles par date
- [ ] Prendre en compte les réservations existantes
- [ ] Prendre en compte les blocages admin
- [ ] Générer les créneaux selon grilles horaires par durée :
  - 90 min : 8h, 9h30, 11h, 12h30, 14h, 15h30, 17h, 18h30, 20h
  - 60 min : 8h, 9h, 10h, 11h, 12h, 13h, 14h, 15h, 16h, 17h, 18h, 19h, 20h, 21h

### Livrables
- Interface de réservation complète
- Filtres fonctionnels (drawer mobile)
- Logique de disponibilité avec grilles indépendantes
- Récapitulatif avant paiement

---

## Milestone 6 : Intégration Paiement Polar

### Objectif
Intégrer Polar pour le paiement en ligne et la confirmation automatique des réservations.

### Tâches

#### 6.1 Configuration Polar
- [ ] Configurer les clés API Polar (environnement dev/prod)
- [ ] Créer les produits/prix correspondant aux tarifs (60€, 30€, 15€)
- [ ] Configurer les webhooks Polar

#### 6.2 Initiation du Paiement
- [ ] Créer une mutation Convex pour initier une session de paiement
- [ ] Stocker une réservation en état "pending"
- [ ] Rediriger vers Polar Checkout

#### 6.3 Webhooks Polar
- [ ] Endpoint API pour recevoir les webhooks
- [ ] Vérifier la signature du webhook
- [ ] Sur paiement réussi : confirmer la réservation (status: "confirmed")
- [ ] Sur échec : supprimer la réservation pending

#### 6.4 Pages de Retour
- [ ] Page succès (`/reservation/success`)
- [ ] Page échec (`/reservation/echec`) avec message simple
- [ ] Redirection appropriée depuis Polar

#### 6.5 Remboursements
- [ ] Mutation pour déclencher un remboursement via API Polar
- [ ] Utilisé lors des annulations utilisateur (> 24h)
- [ ] Utilisé lors des blocages admin sur créneaux existants
- [ ] Utilisé lors du blocage d'un utilisateur

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

### Tâches

#### 7.1 Configuration Resend
- [ ] Configurer les clés API Resend
- [ ] Vérifier le domaine d'envoi (pasiopadelclub.fr)
- [ ] Créer les templates email avec React Email (brandés : logo, couleurs)
- [ ] Implémenter retry automatique 3x (1min, 5min, 15min)

#### 7.2 Email de Confirmation de réservation
- [ ] Template brandé : logo, détails réservation, infos club
- [ ] Envoi automatique après confirmation de la réservation
- [ ] Contenu : terrain, date (JJ/MM/AAAA), heure, durée, prix payé

#### 7.3 Email de Rappel
- [ ] Template : rappel amical avec détails
- [ ] Créer une scheduled function Convex (cron)
- [ ] Envoyer exactement 24h avant le créneau
- [ ] Marquer `reminderSent: true` pour éviter les doublons

#### 7.4 Email d'Annulation
- [ ] Template : confirmation d'annulation avec détails du remboursement
- [ ] Envoi automatique après annulation

#### 7.5 Email de Vérification
- [ ] Template : lien de vérification d'email
- [ ] Envoi à l'inscription

#### 7.6 Email Contact
- [ ] Envoyer le formulaire de contact à l'admin
- [ ] Pas de copie à l'expéditeur

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

### Tâches

#### 8.1 Authentification Admin
- [ ] Middleware de protection des routes `/admin/*`
- [ ] Vérification du rôle "admin"
- [ ] Redirection si non autorisé

#### 8.2 Layout Admin
- [ ] Sidebar navigation (Dashboard, Réservations, Terrains, Utilisateurs, Blocages)
- [ ] Header avec nom admin et déconnexion
- [ ] Design distinct de la partie publique

#### 8.3 Dashboard Principal
- [ ] Statistiques basiques : réservations du jour, de la semaine, du mois
- [ ] Revenus totaux par période (jour, semaine, mois)
- [ ] Liste des 5 dernières réservations

### Livrables
- Accès admin sécurisé
- Layout admin complet
- Dashboard avec statistiques basiques

---

## Milestone 9 : Dashboard Admin - Gestion

### Objectif
Implémenter les fonctionnalités de gestion complète pour l'administrateur.

### Tâches

#### 9.1 Gestion des Réservations
- [ ] Liste paginée des réservations
- [ ] Filtres : date, terrain, utilisateur, statut
- [ ] Détail d'une réservation
- [ ] Création de réservation gratuite (paymentType: "free")

#### 9.2 Gestion des Terrains
- [ ] Liste des 6 terrains
- [ ] Activer/désactiver un terrain

#### 9.3 Gestion des Utilisateurs
- [ ] Liste des utilisateurs inscrits
- [ ] Recherche par email/nom
- [ ] Voir les réservations d'un utilisateur
- [ ] Bloquer/débloquer un utilisateur
- [ ] À la mise en blocage : annulation automatique + remboursement de toutes les réservations futures

#### 9.4 Système de Blocage de Créneaux
- [ ] Interface pour créer un blocage
- [ ] Sélection : date, heure début, heure fin, terrain(s), raison
- [ ] Affichage des réservations impactées avant confirmation
- [ ] Annulation automatique + remboursement des réservations concernées
- [ ] Email d'excuse aux utilisateurs impactés
- [ ] Liste des blocages actifs
- [ ] Supprimer un blocage

### Livrables
- Gestion complète des réservations
- Gestion des terrains
- Gestion des utilisateurs avec blocage
- Système de blocage avec annulation automatique

---

## Milestone 10 : SEO & Optimisation

### Objectif
Optimiser le site pour le référencement local et les performances.

### Tâches

#### 10.1 Métadonnées
- [ ] Title et description uniques par page
- [ ] Open Graph tags (og:title, og:description, og:image)
- [ ] Twitter Cards
- [ ] Canonical URLs

#### 10.2 Schema.org
- [ ] LocalBusiness pour le club
- [ ] SportsActivityLocation
- [ ] Intégration dans le head

#### 10.3 Fichiers SEO
- [ ] Générer sitemap.xml automatiquement
- [ ] Configurer robots.txt

#### 10.4 Performance
- [ ] Optimiser les images (WebP, dimensions appropriées)
- [ ] Lazy loading des images
- [ ] Vérifier le bundle size
- [ ] Tests Lighthouse (cible : 90+ partout)

#### 10.5 Google My Business
- [ ] Vérifier la cohérence NAP avec la fiche GMB existante
- [ ] Ajouter le lien vers GMB dans le footer

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

### Tâches

#### 11.1 Tests Unitaires (Vitest)
- [ ] Tests des fonctions utilitaires
- [ ] Tests des validations Zod
- [ ] Tests des calculs de créneaux (grilles 60min vs 90min)

#### 11.2 Tests d'Intégration
- [ ] Tests des mutations Convex
- [ ] Tests des queries Convex
- [ ] Tests du flux d'authentification

### Livrables
- Suite de tests unitaires
- Tests d'intégration Convex
- Couverture de code acceptable

---

## Milestone 12 : Déploiement & Production

### Objectif
Déployer le site en production sur Railway.

### Tâches

#### 12.1 Configuration Railway
- [ ] Créer le projet Railway
- [ ] Configurer les variables d'environnement de production
- [ ] Configurer le domaine pasiopadelclub.fr
- [ ] SSL/HTTPS automatique
- [ ] Déploiement direct depuis main (zero downtime)

#### 12.2 Configuration Convex Production
- [ ] Créer l'environnement de production Convex
- [ ] Migrer le schéma
- [ ] Seed les données de production (terrains)

#### 12.3 Configuration Services
- [ ] Polar en mode production
- [ ] Resend avec domaine pasiopadelclub.fr vérifié
- [ ] BetterAuth en production

#### 12.4 Monitoring
- [ ] Configurer les logs
- [ ] Alertes en cas d'erreur

#### 12.5 Go Live
- [ ] Vérification post-déploiement
- [ ] Vérifier cohérence avec fiche Google My Business

### Livrables
- Site déployé sur Railway
- Domaine pasiopadelclub.fr configuré avec HTTPS
- Monitoring en place

---