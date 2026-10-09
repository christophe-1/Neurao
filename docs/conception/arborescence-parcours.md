# Arborescence et parcours utilisateur

Ce document décrit les pages du site Neurao et les chemins que suivent ses utilisateurs pour atteindre leurs objectifs. Il sert de base aux maquettes et au schéma d'enchaînement. Les références B1 à B23 et A1 à A11 renvoient aux besoins du cahier des charges (§4 et §5).

## 1. Arborescence

Dans Next.js (App Router), chaque adresse correspond à un dossier de `apps/web/src/app/` contenant un `page.js`. Les parties variables de l'adresse sont entre crochets.

### Boutique

```
/                                   Accueil
├── /categories/[slug]              Produits d'une catégorie, paginés (?page=2)
├── /search                         Résultats de recherche (?q=omega&page=2)
├── /products/[slug]                Fiche produit
├── /cart                           Panier
├── /checkout                       Tunnel de commande (connexion requise)
│   ├── /checkout/addresses         Étape 1 : adresses de livraison et de facturation
│   ├── /checkout/shipping          Étape 2 : mode de livraison
│   ├── /checkout/payment           Étape 3 : récapitulatif, puis paiement chez le prestataire
│   └── /checkout/confirmation      Confirmation après le paiement
├── /login                          Connexion
├── /register                       Inscription
├── /forgot-password                Demande de réinitialisation du mot de passe
├── /reset-password                 Nouveau mot de passe (?token=…)
├── /account                        Espace client : profil (connexion requise)
│   └── /account/orders             Historique des commandes
│       └── /account/orders/[number]   Détail et suivi d'une commande
├── /legal-notice                   Mentions légales
├── /terms                          Conditions générales de vente
├── /privacy                        Politique de confidentialité
└── /cookies                        Gestion des cookies
```

### Back-office

Accessible uniquement aux comptes internes. Aucun lien n'y mène depuis la boutique.

```
/admin                              Redirige vers /admin/orders
├── /admin/login                    Connexion des comptes internes
├── /admin/orders                   Commandes, filtrées par statut et par date
│   └── /admin/orders/[number]      Détail, changement de statut, annulation
├── /admin/products                 Produits : recherche, filtres, pagination
│   ├── /admin/products/new         Création d'un produit
│   └── /admin/products/[id]        Modification ou désactivation d'un produit
├── /admin/categories               Catégories : création, modification, ordre d'affichage
├── /admin/stock                    Stock de chaque produit et ajustement manuel
├── /admin/customers                Comptes clients
│   └── /admin/customers/[id]       Détail d'un compte client
└── /admin/users                    Comptes internes et rôles (administrateur seulement)
```

### Fichiers techniques

| Adresse | Rôle |
| --- | --- |
| `/sitemap.xml` | liste des pages publiques pour les moteurs de recherche (§9.3) |
| `/robots.txt` | indique aux moteurs de recherche ce qu'ils peuvent explorer (le back-office est exclu) |
| page 404 (`not-found.js`) | adresse inexistante |

### Tableau des pages

| Page | Adresse | Accès | Besoins couverts |
| --- | --- | --- | --- |
| Accueil | `/` | public | B1 |
| Catégorie | `/categories/[slug]` | public | B2, B5 |
| Recherche | `/search` | public | B3, B5 |
| Fiche produit | `/products/[slug]` | public | B4, B5, B7 |
| Panier | `/cart` | public | B7 à B12 |
| Tunnel : adresses | `/checkout/addresses` | client | B13, B14 |
| Tunnel : livraison | `/checkout/shipping` | client | B13, B15 |
| Tunnel : paiement | `/checkout/payment` | client | B13, B16 |
| Confirmation | `/checkout/confirmation` | client | B17 |
| Connexion | `/login` | public | B20, B11 |
| Inscription | `/register` | public | B19 |
| Mot de passe oublié | `/forgot-password`, `/reset-password` | public | B21 |
| Profil | `/account` | client | B22 |
| Commandes du client | `/account/orders`, `/account/orders/[number]` | client | B18, B23 |
| Pages légales | `/legal-notice`, `/terms`, `/privacy`, `/cookies` | public | §3.1, §7.3 |
| Commandes (back-office) | `/admin/orders`, `/admin/orders/[number]` | gestionnaire, administrateur | A6 à A9 |
| Produits (back-office) | `/admin/products…` | gestionnaire, administrateur | A1, A3 |
| Catégories (back-office) | `/admin/categories` | gestionnaire, administrateur | A2 |
| Stock (back-office) | `/admin/stock` | gestionnaire, administrateur | A4, A5 |
| Clients (back-office) | `/admin/customers…` | gestionnaire, administrateur | A10 |
| Comptes internes | `/admin/users` | administrateur | A11 |

### Choix d'adresses

| Choix | Raison |
| --- | --- |
| `slug` dans les adresses des catégories et des produits (`/products/omega-3-1000`) plutôt que l'`id` | adresses lisibles et stables, exigées pour le référencement (§9.3) |
| Recherche et pagination dans les paramètres (`?q=…&page=2`) | elles survivent à un rafraîchissement et à un partage de lien (critère de recette du §4.1) |
| Le tunnel découpé en trois adresses | chaque étape a son adresse : le bouton « retour » du navigateur fonctionne, et l'étape en cours se retrouve après un rafraîchissement |
| Commandes désignées par leur numéro (`NEU-2026-000123`) côté client | c'est le numéro que le client connaît ; l'`id` technique n'est pas exposé |
| Adresses en anglais | cohérence avec le code (noms de dossiers, routes d'API) |

Ces adresses sont celles des **pages** du site (Next.js, port 3000). Les routes de l'**API** (Express, port 4000, par exemple `GET /api/products`) sont un autre sujet, documenté avec OpenAPI.

## 2. Parcours utilisateur

### P1 — Un visiteur achète un produit (B1 à B17)

Le parcours principal du site.

```
Accueil ─► Catégorie ─► Fiche produit ─► « Ajouter au panier » ─► Panier
                                                                    │
                                                         « Commander »
                                                                    │
                                              ┌─── déjà connecté ? ─┴─ non ──► Connexion ou inscription
                                              │                                      │
                                              │                     panier du visiteur repris dans le compte (B11)
                                              ▼                                      │
                         Étape 1 : adresses ◄─────────────────────────────────────────┘
                                │   (pré-remplies avec celles de la dernière commande, B14)
                                ▼
                         Étape 2 : mode de livraison
                                ▼
                         Étape 3 : récapitulatif ─► « Payer » ─► page de paiement du prestataire
                                                                    │
                                    ┌───────── paiement accepté ────┴──── paiement refusé ─────┐
                                    ▼                                                          ▼
                         Confirmation à l'écran                                 Retour à l'étape 3,
                         + e-mail de confirmation (B17)                         message explicite
```

Cas particuliers :

| Situation | Comportement attendu |
| --- | --- |
| Un produit du panier est devenu indisponible | la ligne est signalée dans le panier (B12) |
| Le stock devient insuffisant entre le panier et le paiement | la commande est refusée avec un message explicite, aucun stock négatif (§6.1) |
| Deux clients paient le dernier article en même temps | un seul obtient la commande, l'autre reçoit un refus clair (§6.1) |
| Le visiteur revient le lendemain sur le même navigateur | son panier est toujours là (B10) |

### P2 — Un visiteur cherche un produit précis (B3, B4, B5)

```
N'importe quelle page ─► barre de recherche « omega » ─► /search?q=omega
                                                             │
                              ┌──── des résultats ───────────┴──── aucun résultat ────┐
                              ▼                                                        ▼
                     Liste paginée ─► Fiche produit                        Message utile, avec un lien
                                          │                                vers les catégories (§4.1)
                       produit indisponible : bouton « Ajouter » désactivé (B5)
```

### P3 — Un client suit sa commande (B18, B23)

```
Connexion ─► Mon compte ─► Mes commandes ─► Commande NEU-2026-000123
                                                 │
                       statut actuel + historique daté des statuts,
                       produits, prix et adresses tels qu'au moment de l'achat
```

### P4 — Un client a oublié son mot de passe (B21)

```
Connexion ─► « Mot de passe oublié ? » ─► saisie de l'e-mail
                                               │
              message identique que le compte existe ou non (§6.5)
                                               │
                                     e-mail avec un lien (valable 1 heure, usage unique)
                                               │
                                     /reset-password?token=… ─► nouveau mot de passe ─► Connexion
```

### P5 — Un gestionnaire traite une commande (A6 à A9)

```
/admin/login ─► Commandes filtrées « payée » ─► Détail de la commande
                                                    │
                    ┌───────────────────────────────┼───────────────────────────────┐
                    ▼                               ▼                               ▼
          « En préparation »                « Expédiée »                    « Annuler »
                    │                               │                               │
         statut horodaté dans          plus annulable ensuite           possible seulement si
         l'historique (§6.3)                 (§6.3)                     non expédiée ; le stock
                                                                        est restitué (A9)

        Une transition non prévue (par exemple « livrée » → « payée ») est refusée par le serveur.
```

### P6 — Un gestionnaire met à jour le catalogue (A1 à A5)

```
/admin/products ─► recherche, filtres ─► « Nouveau produit » ou modification d'un produit
                                              │
                         référence, nom, catégorie, prix TTC, TVA, description, visuel
                                              │
                                  « Désactiver » plutôt que supprimer (A1)

/admin/stock ─► stock de chaque produit ─► ajustement manuel avec motif obligatoire (A5)
```

### P7 — Un administrateur crée un compte interne (A11)

```
/admin/login ─► Comptes internes ─► « Nouveau compte » ─► e-mail, nom, rôle (gestionnaire ou administrateur)
                                                                │
                                         ce menu n'apparaît pas pour un gestionnaire,
                                         et le serveur refuse l'accès à sa route
```

## 3. Questions ouvertes

| Point | À trancher |
| --- | --- |
| Statuts de commande | le cahier des charges en prévoit six (`en_attente_paiement`, `payee`, `en_preparation`, `expediee`, `livree`, `annulee`) ; `ORDER_STATUSES` n'en contient que quatre pour l'instant |
| Ajustement manuel du stock (A5) | marqué essentiel dans le cahier des charges, placé en lot 3 dans la feuille de route : la page `/admin/stock` dépend de cette décision |
| Lien de réinitialisation du mot de passe | où stocker le jeton à usage unique et à durée limitée (Redis, avec expiration, est une piste) |
