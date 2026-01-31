# Pasio Padel Club - Production V1 (Site Vitrine)

## Vue d'ensemble

Site vitrine du club Pasio Padel Club situé à **Bayonne** (24 rue Arnaud Detroyat, 64100 Bayonne). Version statique sans backend, auth ni paiements. Tous les CTAs redirigent vers l'application mobile.

**Domaine de production :** pasiopadelclub.fr
**Branche :** `production-v1`

> La branche `main` contient la version complète avec base de données, authentification, paiements Stripe et emails transactionnels.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage (hero, features, booking section, app download, FAQ, stories, map) |
| `/tarifs` | Tarifs des terrains (doubles, simples, kids) |
| `/credits` | Présentation statique des packs de crédits (Starter, Pro, Premium) |
| `/galerie` | Galerie photos du club |
| `/contact` | Infos de contact + Google Maps |
| `/application` | Téléchargement de l'app mobile (App Store + Google Play) |
| `/cgv` | Conditions générales de vente |
| `/mentions-legales` | Mentions légales |
| `/politique-confidentialite` | Politique de confidentialité |

---

## Conventions

### Prix en centimes
Les prix des packs de crédits sont hardcodés en centimes et formatés en euros via `src/helpers/number.ts`.

| Pack | Prix | Crédits |
|------|------|---------|
| Starter | 15 000 (150€) | 16 000 (160€) |
| Pro | 30 000 (300€) | 33 000 (330€) |
| Premium | 50 000 (500€) | 57 500 (575€) |

### Langue
- Site en français uniquement

---

## SEO

- Schema.org LocalBusiness et SportsActivityLocation
- Meta tags optimisés par page
- Open Graph images

---

## Déploiement

- **Hébergement** : Railway (auto-deploy depuis `production-v1`)
- **Variable d'env** : `VITE_SITE_URL` uniquement
- **Zero downtime** géré par Railway

---

## Workflow

> **Workflow obligatoire pour chaque tâche :**
>
> 1. **Implémenter** la tâche
> 2. **Lancer `code-simplifier`** pour simplifier et valider le code (obligatoire)
> 3. **Lancer `npm run lint`** et corriger toutes les erreurs restantes
> 4. **NE COMMIT JAMAIS LES CHANGEMENTS TANT QUE L'UTILISATEUR N'A PAS ACCEPTÉ**
