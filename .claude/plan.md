# Pasio Padel Club - Plan de Développement

## Vue d'ensemble

Site de réservation de terrains de padel pour le club Pasio Padel Club situé à Biarritz. L'objectif est de permettre aux utilisateurs de réserver et payer un créneau en ligne, avec un SEO optimisé pour la visibilité locale.

---

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 19, TanStack Start avec Tanstack Router (SSR), Tailwind CSS 4, Shadcn, Vite |
| Backend | Convex |
| Authentification | BetterAuth (email/mot de passe) |
| Paiement | Polar |
| Emails transactionnels | Resend |
| Hébergement | Railway |

---

## Structure des Terrains

### Semi-couverts (extérieur)
| Terrain | Joueurs | Durée | Prix |
|---------|---------|-------|------|
| Double A | 4 | 90 min | 60€ |
| Double B | 4 | 90 min | 60€ |

### Couverts (intérieur)
| Terrain | Joueurs | Durée | Prix |
|---------|---------|-------|------|
| Double C | 4 | 90 min | 60€ |
| Double D | 4 | 90 min | 60€ |
| Simple | 2 | 60 min | 30€ |
| Kids | 2 | 60 min | 15€ |

**Total : 6 terrains** (terrain "Kids" ouvert à tous)

---

## Règles de Réservation

- **Type** : Location de terrain uniquement (pas de cours avec coach)
- **Paiement** : Immédiat et obligatoire via Polar
- **Annulation** : Autorisée uniquement si effectuée au moins 24 heures avant le créneau réservé (remboursement intégral)
- **Limite par utilisateur** : Maximum 2 réservations actives simultanément
- **Anticipation** : Réservation possible jusqu'à 10 jours à l'avance
- **Horaires** : 8h - 22h tous les jours
- **Tarification** : Prix fixes

---

## Modèle de Données Convex

### users
```typescript
{
  _id: Id<"users">,
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  role: "user" | "admin",
  isBlocked: boolean,
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
  polarPaymentId: string,
  status: "confirmed" | "completed" | "cancelled",
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
- Authentification email/mot de passe opérationnelle
- Structure de routing complète
- Base de données initialisée avec les terrains

---

## Milestone 2 : Pages Publiques Statiques

### Objectif
Créer les pages publiques du site qui ne nécessitent pas d'authentification ni de données dynamiques.

### Tâches

#### 2.1 Page Galerie
- [ ] Créer la route `/galerie`
- [ ] Intégrer les images statiques du club
- [ ] Layout responsive avec grille d'images
- [ ] Lightbox pour agrandir les photos

#### 2.2 Page Contact
- [ ] Créer la route `/contact`
- [ ] Formulaire de contact (nom, email, message)
- [ ] Afficher les informations pratiques (adresse, téléphone, horaires)
- [ ] Intégrer la carte existante
- [ ] Envoi d'email via Resend

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
- [ ] Formulaire : email, mot de passe, confirmation mot de passe, prénom, nom, téléphone
- [ ] Validation des champs (Zod)
- [ ] Gestion des erreurs (email déjà utilisé, etc.)
- [ ] Redirection après inscription réussie

#### 3.2 Page Connexion
- [ ] Créer la route `/connexion`
- [ ] Formulaire : email, mot de passe
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
- Flux d'inscription complet
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
- [ ] Bouton d'annulation sur chaque réservation à venir
- [ ] Afficher un message d'erreur si > 24h avant le créneau, impossible dans ce cas.
- [ ] Modale de confirmation avant annulation
- [ ] Vérification côté serveur du délai de 24h minimum
- [ ] Déclenchement du remboursement via Polar
- [ ] Mise à jour du statut de la réservation en "cancelled"
- [ ] Envoi d'email de confirmation d'annulation

#### 4.3 Historique des Réservations
- [ ] Liste des réservations passées
- [ ] Détails : date, terrain, durée, prix payé
- [ ] Pagination ou infinite scroll

#### 4.3 Gestion du Profil
- [ ] Afficher les informations du compte
- [ ] Modifier : prénom, nom, téléphone
- [ ] Modifier le mot de passe (ancien + nouveau)
- [ ] Email non modifiable (identifiant)

### Livrables
- Dashboard utilisateur avec réservations à venir
- Historique complet des réservations
- Modification du profil et mot de passe

---

## Milestone 5 : Système de Réservation (Frontend)

### Objectif
Créer l'interface de réservation permettant aux utilisateurs de voir les créneaux disponibles et d'en sélectionner un.

### Tâches

#### 5.1 Page de Réservation
- [ ] Créer la route `/reservation`
- [ ] Sélecteur de date (10 prochains jours)
- [ ] Filtres par type de terrain (double, simple, kids)
- [ ] Filtres par localisation (indoor, outdoor)

#### 5.2 Liste des Créneaux
- [ ] Afficher les créneaux disponibles pour la date sélectionnée
- [ ] Grouper par terrain
- [ ] États visuels : disponible, complet, bloqué
- [ ] Afficher prix et durée pour chaque créneau

#### 5.3 Sélection et Récapitulatif
- [ ] Au clic sur un créneau → vérifier si connecté
- [ ] Si non connecté → redirection connexion avec retour
- [ ] Vérifier limite de 2 réservations actives
- [ ] Afficher modale/page récapitulatif avant paiement

#### 5.4 Logique de Disponibilité (Convex)
- [ ] Query pour récupérer les créneaux disponibles par date
- [ ] Prendre en compte les réservations existantes
- [ ] Prendre en compte les blocages admin
- [ ] Générer les créneaux selon horaires (8h-22h) et durée terrain

### Livrables
- Interface de réservation complète
- Filtres fonctionnels
- Logique de disponibilité
- Récapitulatif avant paiement

---

## Milestone 6 : Intégration Paiement Polar

### Objectif
Intégrer Polar pour le paiement en ligne et la confirmation automatique des réservations.

### Tâches

#### 6.1 Configuration Polar
- [ ] Configurer les clés API Polar (environnement dev/prod)
- [ ] Créer les produits/prix correspondant aux tarifs
- [ ] Configurer les webhooks Polar

#### 6.2 Initiation du Paiement
- [ ] Créer une mutation Convex pour initier une session de paiement
- [ ] Stocker une réservation en état "pending"
- [ ] Rediriger vers Polar Checkout

#### 6.3 Webhooks Polar
- [ ] Endpoint API pour recevoir les webhooks
- [ ] Vérifier la signature du webhook
- [ ] Sur paiement réussi : confirmer la réservation
- [ ] Sur échec : supprimer la réservation pending

#### 6.4 Pages de Retour
- [ ] Page succès (`/reservation/success`)
- [ ] Page échec (`/reservation/echec`)
- [ ] Redirection appropriée depuis Polar

### Livrables
- Paiement Polar fonctionnel
- Webhooks configurés et sécurisés
- Réservations créées automatiquement après paiement
- Pages de confirmation/erreur

---

## Milestone 7 : Emails Transactionnels

### Objectif
Implémenter les emails de confirmation et de rappel via Resend.

### Tâches

#### 7.1 Configuration Resend
- [ ] Configurer les clés API Resend
- [ ] Vérifier le domaine d'envoi
- [ ] Créer les templates email (React Email ou HTML)

#### 7.2 Email de Confirmation
- [ ] Template : logo, détails réservation, infos club
- [ ] Envoi automatique après création de la réservation
- [ ] Contenu : terrain, date, heure, durée, prix payé

#### 7.3 Email de Rappel
- [ ] Template : rappel amical avec détails
- [ ] Créer une scheduled function Convex (cron)
- [ ] Envoyer 24h avant le créneau
- [ ] Gérer les réservations déjà rappelées

#### 7.4 Email Contact
- [ ] Envoyer le formulaire de contact à l'admin
- [ ] Copie à l'expéditeur (optionnel)

### Livrables
- Email de confirmation automatique
- Système de rappel 24h avant
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
- [ ] Statistiques clés : réservations du jour, de la semaine, du mois
- [ ] Revenus par période
- [ ] Graphique simple d'évolution
- [ ] Liste des 5 dernières réservations

### Livrables
- Accès admin sécurisé
- Layout admin complet
- Dashboard avec statistiques

---

## Milestone 9 : Dashboard Admin - Gestion

### Objectif
Implémenter les fonctionnalités de gestion complète pour l'administrateur.

### Tâches

#### 9.1 Gestion des Réservations
- [ ] Liste paginée des réservations
- [ ] Filtres : date, terrain, utilisateur, statut
- [ ] Détail d'une réservation
- [ ] Export CSV (optionnel)

#### 9.2 Gestion des Terrains
- [ ] Liste des 6 terrains
- [ ] Activer/désactiver un terrain
- [ ] Voir les statistiques par terrain

#### 9.3 Gestion des Utilisateurs
- [ ] Liste des utilisateurs inscrits
- [ ] Recherche par email/nom
- [ ] Voir les réservations d'un utilisateur
- [ ] Bloquer/débloquer un utilisateur

#### 9.4 Système de Blocage de Créneaux
- [ ] Interface pour créer un blocage
- [ ] Sélection : date, heure début, heure fin, terrain(s), raison
- [ ] Le blocage impacte tous les créneaux qui chevauchent la plage
- [ ] Liste des blocages actifs
- [ ] Supprimer un blocage

### Livrables
- Gestion complète des réservations
- Gestion des terrains
- Gestion des utilisateurs
- Système de blocage flexible

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
- [ ] Créer humans.txt (optionnel)

#### 10.4 Performance
- [ ] Optimiser les images (WebP, dimensions appropriées)
- [ ] Lazy loading des images
- [ ] Vérifier le bundle size
- [ ] Tests Lighthouse (cible : 90+ partout)

#### 10.5 Google My Business
- [ ] Ajouter le lien vers GMB dans le footer
- [ ] Vérifier la cohérence NAP (Name, Address, Phone)

### Livrables
- Métadonnées complètes sur toutes les pages
- Schema.org intégré
- Sitemap et robots.txt
- Score Lighthouse 90+

---

## Milestone 11 : Tests & Qualité

### Objectif
S'assurer de la fiabilité du système avec des tests appropriés.

### Tâches

#### 11.1 Tests Unitaires
- [ ] Tests des fonctions utilitaires
- [ ] Tests des validations Zod
- [ ] Tests des calculs de créneaux

#### 11.2 Tests d'Intégration
- [ ] Tests des mutations Convex
- [ ] Tests des queries Convex
- [ ] Tests du flux d'authentification

#### 11.3 Tests E2E (optionnel)
- [ ] Flux de réservation complet
- [ ] Flux d'inscription/connexion
- [ ] Actions admin

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
- [ ] Configurer le domaine personnalisé
- [ ] SSL/HTTPS automatique

#### 12.2 Configuration Convex Production
- [ ] Créer l'environnement de production Convex
- [ ] Migrer le schéma
- [ ] Seed les données de production (terrains)

#### 12.3 Configuration Services
- [ ] Polar en mode production
- [ ] Resend avec domaine vérifié
- [ ] BetterAuth en production

#### 12.4 Monitoring
- [ ] Configurer les logs
- [ ] Alertes en cas d'erreur
- [ ] Monitoring des performances

#### 12.5 Go Live
- [ ] Tests finaux en staging
- [ ] Mise en production
- [ ] Vérification post-déploiement
- [ ] Backup de la base de données

### Livrables
- Site déployé sur Railway
- Domaine configuré avec HTTPS
- Monitoring en place
- Documentation de déploiement

---

## Questions Ouvertes

1. Quelles couleurs exactes pour la charte graphique ?
2. Adresse physique exacte du club pour les pages légales ?
3. Templates emails : design personnalisé ou simple texte ?
4. Le rappel doit-il être envoyé 24h avant ou autre délai ?
5. Y a-t-il des photos existantes pour la galerie ?
