# Dictionnaire de données

Modèle physique de la base Neurao (MySQL 8.4, moteur InnoDB, jeu de caractères `utf8mb4`), version 3. Il traduit le MLD V3 (`mld-v3.svg`) en types et contraintes MySQL. Les migrations Sequelize en sont la transcription exacte.

## Conventions

| Règle         | Application                                                                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Noms          | tables et colonnes en anglais, en `snake_case` ; tables au pluriel                                                                                                        |
| Clé primaire  | `id`, `INT UNSIGNED`, `AUTO_INCREMENT`                                                                                                                                    |
| Clé étrangère | `<entité>_id`, `INT UNSIGNED`, même type que la clé ciblée                                                                                                                |
| Suppression   | `ON DELETE RESTRICT` par défaut : une ligne référencée ne peut pas être supprimée. Les produits et les commandes ne sont jamais supprimés, on les désactive (`is_active`) |
| Montants      | entiers en **centimes**, `INT UNSIGNED` (`1990` = 19,90 €). Aucun nombre à virgule, donc aucune erreur d'arrondi                                                          |
| Taux de TVA   | entiers en **points de base**, `SMALLINT UNSIGNED` (`550` = 5,5 %, `2000` = 20 %)                                                                                         |
| Prix          | toutes taxes comprises (TTC)                                                                                                                                              |
| Horodatage    | `created_at` et `updated_at` (`DATETIME`, `NOT NULL`) sur les tables modifiables ; `created_at` seul sur les tables d'historique                                          |
| Booléens      | `BOOLEAN` (stocké par MySQL en `TINYINT(1)`)                                                                                                                              |
| Pays          | code ISO 3166-1 à deux lettres, `CHAR(2)`. Lot 1 : `FR` uniquement, contrôlé par la validation                                                                            |

Correspondance avec les types Sequelize utilisés dans les migrations :

| MySQL               | Sequelize                     |
| ------------------- | ----------------------------- |
| `INT UNSIGNED`      | `Sequelize.INTEGER.UNSIGNED`  |
| `SMALLINT UNSIGNED` | `Sequelize.SMALLINT.UNSIGNED` |
| `VARCHAR(n)`        | `Sequelize.STRING(n)`         |
| `CHAR(n)`           | `Sequelize.CHAR(n)`           |
| `TEXT`              | `Sequelize.TEXT`              |
| `BOOLEAN`           | `Sequelize.BOOLEAN`           |
| `DATETIME`          | `Sequelize.DATE`              |

## Tables

Ordre de création : des tables sans dépendance vers celles qui en dépendent. C'est aussi l'ordre des migrations.

```
roles ─► users ─┐
shipping_methods ┼─► orders ─┬─► order_items ◄─ products ◄─ categories
                 │           ├─► payments
                 └───────────┴─► order_status_histories
```

### 1. `roles`

Les rôles des utilisateurs : client, gestionnaire, administrateur.

| Colonne      | Type           | Contraintes          | Description                                                         |
| ------------ | -------------- | -------------------- | ------------------------------------------------------------------- |
| `id`         | `INT UNSIGNED` | PK, auto-incrément   | Identifiant                                                         |
| `code`       | `VARCHAR(20)`  | `NOT NULL`, `UNIQUE` | Code technique utilisé par le code : `customer`, `manager`, `admin` |
| `label`      | `VARCHAR(50)`  | `NOT NULL`           | Libellé affiché : « Client », « Gestionnaire », « Administrateur »  |
| `created_at` | `DATETIME`     | `NOT NULL`           | Date de création                                                    |
| `updated_at` | `DATETIME`     | `NOT NULL`           | Date de dernière modification                                       |

### 2. `users`

Les comptes : clients et personnel du back-office.

| Colonne         | Type           | Contraintes                             | Description                                                                   |
| --------------- | -------------- | --------------------------------------- | ----------------------------------------------------------------------------- |
| `id`            | `INT UNSIGNED` | PK, auto-incrément                      | Identifiant                                                                   |
| `email`         | `VARCHAR(255)` | `NOT NULL`, `UNIQUE`                    | Adresse e-mail, sert d'identifiant de connexion                               |
| `password_hash` | `VARCHAR(255)` | `NOT NULL`                              | Empreinte du mot de passe (argon2 ou bcrypt), jamais le mot de passe en clair |
| `first_name`    | `VARCHAR(100)` | `NOT NULL`                              | Prénom                                                                        |
| `last_name`     | `VARCHAR(100)` | `NOT NULL`                              | Nom                                                                           |
| `role_id`       | `INT UNSIGNED` | `NOT NULL`, FK → `roles.id`, `RESTRICT` | Rôle de l'utilisateur                                                         |
| `created_at`    | `DATETIME`     | `NOT NULL`                              | Date d'inscription                                                            |
| `updated_at`    | `DATETIME`     | `NOT NULL`                              | Date de dernière modification                                                 |

### 3. `shipping_methods`

Les modes de livraison proposés au client.

| Colonne       | Type           | Contraintes               | Description                                                               |
| ------------- | -------------- | ------------------------- | ------------------------------------------------------------------------- |
| `id`          | `INT UNSIGNED` | PK, auto-incrément        | Identifiant                                                               |
| `name`        | `VARCHAR(100)` | `NOT NULL`                | Nom affiché : « Colissimo », « Point relais »…                            |
| `price_cents` | `INT UNSIGNED` | `NOT NULL`                | Frais de livraison TTC, en centimes                                       |
| `is_active`   | `BOOLEAN`      | `NOT NULL`, défaut `TRUE` | Mode proposé ou non au client. Un mode déjà utilisé n'est jamais supprimé |
| `created_at`  | `DATETIME`     | `NOT NULL`                | Date de création                                                          |
| `updated_at`  | `DATETIME`     | `NOT NULL`                | Date de dernière modification                                             |

### 4. `categories`

Les catégories du catalogue.

| Colonne      | Type                | Contraintes            | Description                                                                                        |
| ------------ | ------------------- | ---------------------- | -------------------------------------------------------------------------------------------------- |
| `id`         | `INT UNSIGNED`      | PK, auto-incrément     | Identifiant                                                                                        |
| `name`       | `VARCHAR(100)`      | `NOT NULL`, `UNIQUE`   | Nom affiché : « Oméga 3 », « Vitamines »…                                                          |
| `slug`       | `VARCHAR(100)`      | `NOT NULL`, `UNIQUE`   | Version du nom utilisable dans une adresse : `omega-3`. Même longueur que `name`, dont il est tiré |
| `position`   | `SMALLINT UNSIGNED` | `NOT NULL`, défaut `0` | Ordre d'affichage. À position égale, tri par nom                                                   |
| `created_at` | `DATETIME`          | `NOT NULL`             | Date de création                                                                                   |
| `updated_at` | `DATETIME`          | `NOT NULL`             | Date de dernière modification                                                                      |

### 5. `products`

Les produits vendus.

| Colonne            | Type                | Contraintes                                  | Description                                                                                                                                                       |
| ------------------ | ------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`               | `INT UNSIGNED`      | PK, auto-incrément                           | Identifiant technique                                                                                                                                             |
| `reference`        | `VARCHAR(32)`       | `NOT NULL`, `UNIQUE`                         | Référence métier du produit (code article), courte et stable                                                                                                      |
| `name`             | `VARCHAR(100)`      | `NOT NULL`                                   | Nom affiché                                                                                                                                                       |
| `slug`             | `VARCHAR(100)`      | `NOT NULL`, `UNIQUE`                         | Adresse de la fiche produit, tirée du nom                                                                                                                         |
| `description`      | `TEXT`              | `NULL` autorisé                              | Description factuelle (composition, format, conseils d'utilisation). Longueur limitée par la validation, pas par la base                                          |
| `unit_price_cents` | `INT UNSIGNED`      | `NOT NULL`                                   | Prix de vente TTC, en centimes                                                                                                                                    |
| `vat_rate_bp`      | `SMALLINT UNSIGNED` | `NOT NULL`                                   | Taux de TVA du produit, en points de base (`550` = 5,5 %)                                                                                                         |
| `image`            | `VARCHAR(255)`      | `NULL` autorisé                              | Chemin de l'image du produit                                                                                                                                      |
| `stock`            | `INT UNSIGNED`      | `NOT NULL`, défaut `0`                       | Quantité disponible. `UNSIGNED` : MySQL refuse une valeur négative, dernier filet contre la survente. La vraie règle est vérifiée dans la transaction de commande |
| `is_active`        | `BOOLEAN`           | `NOT NULL`, défaut `TRUE`                    | Produit visible au catalogue. Distinct de « plus en stock »                                                                                                       |
| `category_id`      | `INT UNSIGNED`      | `NOT NULL`, FK → `categories.id`, `RESTRICT` | Catégorie du produit. Une catégorie qui contient des produits ne peut pas être supprimée                                                                          |
| `created_at`       | `DATETIME`          | `NOT NULL`                                   | Date de création                                                                                                                                                  |
| `updated_at`       | `DATETIME`          | `NOT NULL`                                   | Date de dernière modification                                                                                                                                     |

### 6. `orders`

Les commandes. Les adresses y sont recopiées au moment de la commande : une commande passée ne change plus si le client modifie son compte.

| Colonne                 | Type           | Contraintes                                        | Description                                                                                                                                              |
| ----------------------- | -------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                    | `INT UNSIGNED` | PK, auto-incrément                                 | Identifiant technique                                                                                                                                    |
| `number`                | `VARCHAR(20)`  | `NOT NULL`, `UNIQUE`                               | Numéro de commande communiqué au client                                                                                                                  |
| `status`                | `VARCHAR(20)`  | `NOT NULL`                                         | Statut courant : `pending`, `paid`, `shipped`, `cancelled`. Liste unique dans `@neurao/shared` (`ORDER_STATUSES`), transitions contrôlées par le domaine |
| `shipping_cost_cents`   | `INT UNSIGNED` | `NOT NULL`                                         | Frais de livraison TTC appliqués, en centimes (recopiés du mode de livraison)                                                                            |
| `total_cents`           | `INT UNSIGNED` | `NOT NULL`                                         | Montant total TTC de la commande, livraison comprise, en centimes                                                                                        |
| `shipping_name`         | `VARCHAR(200)` | `NOT NULL`                                         | Nom du destinataire                                                                                                                                      |
| `shipping_address`      | `VARCHAR(255)` | `NOT NULL`                                         | Adresse de livraison (numéro et rue)                                                                                                                     |
| `shipping_postal_code`  | `VARCHAR(10)`  | `NOT NULL`                                         | Code postal de livraison                                                                                                                                 |
| `shipping_city`         | `VARCHAR(100)` | `NOT NULL`                                         | Ville de livraison                                                                                                                                       |
| `shipping_country_code` | `CHAR(2)`      | `NOT NULL`                                         | Pays de livraison (`FR` au lot 1)                                                                                                                        |
| `billing_name`          | `VARCHAR(200)` | `NOT NULL`                                         | Nom de facturation                                                                                                                                       |
| `billing_address`       | `VARCHAR(255)` | `NOT NULL`                                         | Adresse de facturation                                                                                                                                   |
| `billing_postal_code`   | `VARCHAR(10)`  | `NOT NULL`                                         | Code postal de facturation                                                                                                                               |
| `billing_city`          | `VARCHAR(100)` | `NOT NULL`                                         | Ville de facturation                                                                                                                                     |
| `billing_country_code`  | `CHAR(2)`      | `NOT NULL`                                         | Pays de facturation                                                                                                                                      |
| `user_id`               | `INT UNSIGNED` | `NOT NULL`, FK → `users.id`, `RESTRICT`            | Client qui a passé la commande                                                                                                                           |
| `shipping_method_id`    | `INT UNSIGNED` | `NOT NULL`, FK → `shipping_methods.id`, `RESTRICT` | Mode de livraison choisi                                                                                                                                 |
| `created_at`            | `DATETIME`     | `NOT NULL`                                         | Date de la commande                                                                                                                                      |
| `updated_at`            | `DATETIME`     | `NOT NULL`                                         | Date de dernière modification (changement de statut)                                                                                                     |

### 7. `order_items`

Les lignes d'une commande. Le nom, le prix et le taux de TVA du produit y sont **figés** au moment de l'achat : modifier un produit ne modifie jamais une commande passée.

| Colonne            | Type                | Contraintes                                                                 | Description                                                                        |
| ------------------ | ------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `id`               | `INT UNSIGNED`      | PK, auto-incrément                                                          | Identifiant                                                                        |
| `order_id`         | `INT UNSIGNED`      | `NOT NULL`, FK → `orders.id`, `RESTRICT`, `UNIQUE (order_id, product_id)`   | Commande à laquelle appartient la ligne                                            |
| `product_id`       | `INT UNSIGNED`      | `NOT NULL`, FK → `products.id`, `RESTRICT`, `UNIQUE (order_id, product_id)` | Produit commandé. Un produit n'apparaît qu'une fois par commande, avec sa quantité |
| `quantity`         | `SMALLINT UNSIGNED` | `NOT NULL`                                                                  | Quantité commandée, au moins 1 (contrôlé par la validation)                        |
| `unit_price_cents` | `INT UNSIGNED`      | `NOT NULL`                                                                  | Prix unitaire TTC au moment de l'achat, en centimes                                |
| `vat_rate_bp`      | `SMALLINT UNSIGNED` | `NOT NULL`                                                                  | Taux de TVA au moment de l'achat, en points de base                                |
| `product_name`     | `VARCHAR(100)`      | `NOT NULL`                                                                  | Nom du produit au moment de l'achat                                                |

### 8. `payments`

Les paiements d'une commande. Une commande peut en avoir plusieurs (une tentative refusée, puis une acceptée).

| Colonne              | Type           | Contraintes                              | Description                                                                    |
| -------------------- | -------------- | ---------------------------------------- | ------------------------------------------------------------------------------ |
| `id`                 | `INT UNSIGNED` | PK, auto-incrément                       | Identifiant                                                                    |
| `provider_reference` | `VARCHAR(100)` | `NOT NULL`                               | Référence de la transaction chez le prestataire de paiement (simulé au lot 1)  |
| `amount_cents`       | `INT UNSIGNED` | `NOT NULL`                               | Montant payé TTC, en centimes                                                  |
| `provider_status`    | `VARCHAR(30)`  | `NOT NULL`                               | Statut renvoyé par le prestataire : accepté, refusé…                           |
| `received_at`        | `DATETIME`     | `NULL` autorisé                          | Date de confirmation du paiement. Vide tant que le paiement n'est pas confirmé |
| `order_id`           | `INT UNSIGNED` | `NOT NULL`, FK → `orders.id`, `RESTRICT` | Commande payée                                                                 |
| `created_at`         | `DATETIME`     | `NOT NULL`                               | Date de la tentative de paiement                                               |
| `updated_at`         | `DATETIME`     | `NOT NULL`                               | Date de dernière modification                                                  |

### 9. `order_status_histories`

L'historique des changements de statut d'une commande. Table d'historique : une ligne n'est jamais modifiée, d'où l'absence de `updated_at`.

| Colonne      | Type           | Contraintes                                  | Description                                                                                                                                                |
| ------------ | -------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`         | `INT UNSIGNED` | PK, auto-incrément                           | Identifiant                                                                                                                                                |
| `status`     | `VARCHAR(20)`  | `NOT NULL`                                   | Statut pris par la commande à ce moment (mêmes valeurs que `orders.status`)                                                                                |
| `order_id`   | `INT UNSIGNED` | `NOT NULL`, FK → `orders.id`, `RESTRICT`     | Commande concernée                                                                                                                                         |
| `user_id`    | `INT UNSIGNED` | `NULL` autorisé, FK → `users.id`, `SET NULL` | Personne qui a provoqué le changement (gestionnaire, client). Vide quand le changement est automatique (création de la commande, confirmation du paiement) |
| `created_at` | `DATETIME`     | `NOT NULL`                                   | Date du changement de statut                                                                                                                               |

## Index

Les clés primaires et les contraintes `UNIQUE` créent chacune un index. MySQL crée aussi un index sur chaque clé étrangère.

| Table         | Index unique             |
| ------------- | ------------------------ |
| `roles`       | `code`                   |
| `users`       | `email`                  |
| `categories`  | `name` ; `slug`          |
| `products`    | `reference` ; `slug`     |
| `orders`      | `number`                 |
| `order_items` | `(order_id, product_id)` |

## Choix retenus

| Point                                                         | Choix                                                     | Raison                                                                                                                        | Alternative écartée                                                                              |
| ------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Type de `orders.status`                                       | `VARCHAR(20)`                                             | la liste des statuts n'existe qu'à un endroit, `ORDER_STATUSES` dans `@neurao/shared`, et le domaine contrôle les transitions | `ENUM` MySQL : la liste existerait en double, et chaque nouveau statut demanderait une migration |
| Format de `products.reference`                                | `VARCHAR(32)`, format libre                               | les données du projet sont fictives                                                                                           | imposer le format réel des références Nutri-Logics                                               |
| Format de `orders.number`                                     | `NEU-2026-000123` (préfixe, année, numéro sur 6 chiffres) | lisible par le client et le service client, l'année aide au classement                                                        | numéro purement chiffré                                                                          |
| `order_status_histories.user_id` à la suppression d'un compte | `SET NULL`                                                | l'historique de la commande est conservé, seul l'auteur devient inconnu                                                       | `RESTRICT` : un compte ayant agi sur une commande ne pourrait plus être supprimé                 |

## Hors périmètre du lot 1

- Vente hors de France, multi-devise et TVA par pays de livraison : exclus par le cahier des charges (§3.2). Évolution possible : des classes fiscales et un taux par pays de livraison (voir le journal, 6 octobre).
- Ajustement manuel du stock (lot 3, A5) : une future table `stock_adjustments`, avec une colonne `reason`.
