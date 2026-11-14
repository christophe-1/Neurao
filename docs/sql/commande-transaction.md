# Enregistrement d'une commande en SQL : la transaction

Deuxième requête du projet réécrite en SQL à la main, après la recherche paginée (`recherche-paginee.md`). L'application passe par Sequelize ; ce document montre la même transaction écrite en SQL, puis en Node.js sans ORM avec `mysql2` (la façon de faire du projet « bibliothèque » du cours), et enfin le SQL que Sequelize envoie réellement.

Route concernée : `POST /api/orders` (connexion obligatoire). Code : `SequelizeOrderRepository.create`.

Les sections suivantes montrent une commande d'un seul produit, pour rester lisibles. Depuis l'arrivée du panier, une commande peut contenir plusieurs produits : voir la dernière section, « Une commande de plusieurs produits ».

## Ce que fait la transaction

Une commande touche trois tables. Les trois écritures doivent réussir ensemble ou être annulées ensemble.

| Étape | Requête                                  | Pourquoi                                                         |
| ----- | ---------------------------------------- | ---------------------------------------------------------------- |
| 1     | `START TRANSACTION`                      | rien n'est définitif avant `COMMIT`                              |
| 2     | `SELECT stock … FOR UPDATE`              | lit le stock **et verrouille** la ligne du produit               |
| 3     | si le stock est trop bas : `ROLLBACK`    | on annule et on libère le verrou                                 |
| 4     | `INSERT INTO orders`                     | la commande, avec l'adresse recopiée                             |
| 5     | `INSERT INTO order_items`                | la ligne, avec le prix, la TVA et le nom recopiés (cahier, §6.2) |
| 6     | `UPDATE products SET stock = stock - 2`  | MySQL calcule le nouveau stock à partir de la valeur réelle      |
| 7     | `COMMIT` (ou `ROLLBACK` en cas d'erreur) | tout est enregistré, ou rien                                     |

## Requêtes écrites à la main

Commande de 2 « Coffret découverte gommes » (produit 100, 34,90 €), livrée par Colissimo (mode 4, 4,90 €) :

```sql
START TRANSACTION;

SELECT stock FROM products WHERE id = 100 FOR UPDATE;
-- stock = 15, au moins 2 : on continue. Sinon : ROLLBACK;

INSERT INTO orders (number, status, shipping_cost_cents, total_cents,
  shipping_name, shipping_address, shipping_postal_code, shipping_city, shipping_country_code,
  billing_name, billing_address, billing_postal_code, billing_city, billing_country_code,
  user_id, shipping_method_id, created_at, updated_at)
VALUES ('NEU-1794652800000', 'pending', 490, 7470,
  'Client Test', '1 rue de Test', '13000', 'Marseille', 'FR',
  'Client Test', '1 rue de Test', '13000', 'Marseille', 'FR',
  25, 4, NOW(), NOW());

INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents, vat_rate_bp, product_name)
VALUES (LAST_INSERT_ID(), 100, 2, 3490, 550, 'Coffret découverte gommes');

UPDATE products SET stock = stock - 2, updated_at = NOW() WHERE id = 100;

COMMIT;
```

Total : 2 × 3 490 + 490 = 7 470 centimes. `LAST_INSERT_ID()` renvoie l'`id` que MySQL vient de donner à la commande : la ligne de commande en a besoin.

Résultat après le `COMMIT` :

| id  | number            | total_cents | order_id (ligne) | quantity | stock |
| --- | ----------------- | ----------- | ---------------- | -------- | ----- |
| 1   | NEU-1794652800000 | 7470        | 1                | 2        | 13    |

Le choix « continuer ou annuler » après le `SELECT` n'est pas écrit en SQL : c'est l'application qui lit le stock et décide (le `if` du repository).

## Deux clients achètent les derniers articles en même temps

Test fait avec deux terminaux MySQL. Stock du produit 100 mis à 3 ; le client A achète les 3, le client B arrive pendant que A est en cours.

Terminal A :

```sql
START TRANSACTION;
SELECT stock FROM products WHERE id = 100 FOR UPDATE;  -- 3
-- A réfléchit 5 secondes (DO SLEEP(5))
UPDATE products SET stock = stock - 3, updated_at = NOW() WHERE id = 100;
COMMIT;
```

Terminal B, lancé une seconde après A :

```sql
START TRANSACTION;
SELECT stock FROM products WHERE id = 100 FOR UPDATE;
ROLLBACK;
```

| Heure        | Terminal A                    | Terminal B                                        |
| ------------ | ----------------------------- | ------------------------------------------------- |
| ≈ 10:38:08   | verrouille la ligne, lit 3    |                                                   |
| 10:38:09.446 |                               | demande la ligne : **attend**                     |
| 10:38:13.45  | `COMMIT` : le verrou est levé | obtient aussitôt la ligne, lit **0** → `ROLLBACK` |

B a attendu 4 secondes, puis a lu le stock **après** la vente de A. Il n'y a pas de « départage » au hasard ni à l'heure : c'est le premier qui obtient le verrou qui passe. Dans l'API, B reçoit `409 Produit indisponible ou stock insuffisant`. Sans `FOR UPDATE`, B aurait lu 3 en même temps que A, et les deux auraient vendu les mêmes articles.

## Oublier la transaction sur une requête

Avec Sequelize, une requête n'entre dans la transaction que si on lui passe `{ transaction }`. Sans cette option, elle part sur **une autre connexion** du pool, hors de la transaction.

Test : la commande est insérée dans une transaction pas encore validée (terminal A), puis la ligne de commande est insérée depuis une autre connexion (terminal B), comme si on avait oublié `{ transaction }` sur `OrderItemModel.create`.

```text
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
```

La clé étrangère `order_items.order_id` oblige MySQL à vérifier que la commande existe. Or cette commande est verrouillée par la transaction A, qui n'est pas validée : B attend, puis abandonne (50 secondes par défaut, `innodb_lock_wait_timeout` ; 4 secondes dans le test). Dans l'API, la requête resterait bloquée 50 secondes, puis le `catch` annulerait tout et le client recevrait une erreur 500. Après l'annulation : aucune commande, aucune ligne, stock inchangé.

Oublier `{ transaction }` sur le `decrement` donnerait le même blocage, pour la même raison : la ligne du produit est verrouillée par `FOR UPDATE`.

## Version Node.js sans ORM (`mysql2`)

Dans le projet « bibliothèque » du cours, les transactions passent par un helper `withTransactional` : il prend une connexion du pool, ouvre la transaction, valide ou annule, et rend la connexion. La version ci-dessous fait la même chose sans helper, pour la comparer ligne à ligne avec le repository Sequelize.

```js
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_APP_USER,
  password: process.env.DB_APP_PASSWORD,
  database: process.env.DB_NAME,
})

/** Saves an order with plain SQL and mysql2, inside a transaction. */
async function createOrder({
  number,
  userId,
  product,
  quantity,
  shippingMethod,
  totalCents,
  address,
}) {
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const [rows] = await connection.query('SELECT stock FROM products WHERE id = ? FOR UPDATE', [
      product.id,
    ])
    if (rows[0].stock < quantity) {
      await connection.rollback()
      return null
    }

    const [orderResult] = await connection.query(
      `INSERT INTO orders (number, status, shipping_cost_cents, total_cents,
         shipping_name, shipping_address, shipping_postal_code, shipping_city, shipping_country_code,
         billing_name, billing_address, billing_postal_code, billing_city, billing_country_code,
         user_id, shipping_method_id, created_at, updated_at)
       VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        number,
        shippingMethod.priceCents,
        totalCents,
        address.fullName,
        address.address,
        address.postalCode,
        address.city,
        address.countryCode,
        address.fullName,
        address.address,
        address.postalCode,
        address.city,
        address.countryCode,
        userId,
        shippingMethod.id,
      ],
    )

    await connection.query(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents, vat_rate_bp, product_name)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        orderResult.insertId,
        product.id,
        quantity,
        product.unitPriceCents,
        product.vatRateBp,
        product.name,
      ],
    )

    await connection.query(
      'UPDATE products SET stock = stock - ?, updated_at = NOW() WHERE id = ?',
      [quantity, product.id],
    )

    await connection.commit()
    return { id: orderResult.insertId, number, status: 'pending', totalCents }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}
```

Testée sur la base de développement (puis base remise en état) :

| Appel                           | Résultat                                                   |
| ------------------------------- | ---------------------------------------------------------- |
| quantité 1, stock suffisant     | `{ id, number, status: 'pending', totalCents }`, stock − 1 |
| quantité 999                    | `null`, rien d'enregistré                                  |
| numéro de commande déjà utilisé | erreur `ER_DUP_ENTRY` relancée par le `catch`, tout annulé |

Ici, rester dans la transaction veut dire utiliser **la même `connection`** pour chaque requête : une requête envoyée avec `pool.query` partirait sur une autre connexion, hors de la transaction. C'est l'équivalent de l'oubli de `{ transaction }` avec Sequelize.

## Le SQL généré par Sequelize

Avec la journalisation activée le temps du test, `SequelizeOrderRepository.create` (quantité 2) affiche :

```sql
START TRANSACTION;

SELECT `id`, `reference`, `name`, `slug`, `description`, `unit_price_cents` AS `unitPriceCents`,
  `vat_rate_bp` AS `vatRateBp`, `image`, `stock`, `is_active` AS `isActive`,
  `category_id` AS `categoryId`, `created_at` AS `createdAt`, `updated_at` AS `updatedAt`
FROM `products` AS `Product`
WHERE `Product`.`id` = 100 FOR UPDATE;

INSERT INTO `orders` (`id`,`number`,`status`,`shipping_cost_cents`,`total_cents`,`shipping_name`,
  `shipping_address`,`shipping_postal_code`,`shipping_city`,`shipping_country_code`,`billing_name`,
  `billing_address`,`billing_postal_code`,`billing_city`,`billing_country_code`,`user_id`,
  `shipping_method_id`,`created_at`,`updated_at`)
VALUES (DEFAULT,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);

INSERT INTO `order_items` (`id`,`order_id`,`product_id`,`quantity`,`unit_price_cents`,`vat_rate_bp`,`product_name`)
VALUES (DEFAULT,?,?,?,?,?,?);

UPDATE `products` SET `stock`=`stock`- 2,`updated_at`='2026-11-14 10:37:38' WHERE `id` = 100;

COMMIT;
```

Les six requêtes portent le même identifiant de transaction dans le terminal : elles passent toutes par la même connexion.

## Comparaison

| Idée                        | SQL à la main         | `mysql2`                              | Sequelize                                         |
| --------------------------- | --------------------- | ------------------------------------- | ------------------------------------------------- |
| Ouvrir la transaction       | `START TRANSACTION`   | `connection.beginTransaction()`       | `sequelize.transaction()`                         |
| Rester dans la transaction  | même terminal         | même `connection`                     | `{ transaction }` sur chaque requête              |
| Verrouiller la ligne        | `FOR UPDATE`          | `FOR UPDATE` écrit dans la requête    | `lock: true`                                      |
| Id de la commande créée     | `LAST_INSERT_ID()`    | `orderResult.insertId`                | `orderRow.id`                                     |
| Retirer du stock            | `stock = stock - 2`   | `stock = stock - ?`                   | `decrement('stock', { by })`                      |
| Valider / annuler           | `COMMIT` / `ROLLBACK` | `commit()` / `rollback()`             | `commit()` / `rollback()`                         |
| Rendre la connexion au pool | —                     | `connection.release()` dans `finally` | fait par Sequelize au `commit` / `rollback`       |
| Valeurs envoyées            | écrites en dur        | `?` + tableau de valeurs              | `?` dans les `INSERT`, valeurs échappées ailleurs |

Différence notable avec la recherche paginée : pour un `INSERT`, Sequelize envoie des `?` et les valeurs à part (requête paramétrée), alors que pour un `SELECT` avec `where`, il échappe les valeurs et les écrit dans le texte. Les deux protègent de l'injection SQL.

## Une commande de plusieurs produits

Depuis l'arrivée du panier, `POST /api/orders` reçoit une liste `items` (de 1 à 20 produits, 1 à 10 de chacun). Le repository insère d'abord la commande, puis répète pour chaque ligne : verrou du produit, vérification du stock, insertion de la ligne, retrait du stock.

Test sur la base de développement : deux lignes, la première possible (1 coffret), la seconde impossible (999 Focus). Requêtes affichées par Sequelize :

```sql
START TRANSACTION;
INSERT INTO `orders` (…) VALUES (…);
SELECT … FROM `products` AS `Product` WHERE `Product`.`id` = 100 FOR UPDATE;
INSERT INTO `order_items` (…) VALUES (…);
UPDATE `products` SET `stock`=`stock`- 1 … WHERE `id` = 100;
SELECT … FROM `products` AS `Product` WHERE `Product`.`id` = 52 FOR UPDATE;
ROLLBACK;
```

Le stock de Focus est trop bas : le `ROLLBACK` annule **aussi** la commande, la première ligne et le stock du coffret, déjà écrits. Après le test : aucune commande, stock du coffret inchangé. Le repository renvoie `null`, l'API répond 409.

### Problème rencontré : le numéro de commande

Le numéro était d'abord `NEU-` suivi de l'heure en millisecondes (`Date.now()`). En lançant deux commandes en même temps pour le test de concurrence, l'une a reçu **500** au lieu de 409 : les deux commandes avaient eu la même milliseconde, donc le même numéro, refusé par la contrainte `UNIQUE` de `orders.number` (`ER_DUP_ENTRY`). Le verrou, lui, fonctionnait : rejoué directement sur le repository avec deux numéros différents, le test donne bien une commande et un `null`.

Correction : le numéro est maintenant tiré au hasard, comme l'identifiant de session (`randomBytes(4)`, soit 8 caractères hexadécimaux, par exemple `NEU-BFA23321`). La contrainte `UNIQUE` reste le dernier garde-fou. Après correction, trois essais de deux commandes simultanées sur les 3 derniers articles donnent chaque fois un 201 et un 409.

### Limites connues

| Cas                                                                                           | Effet                                                                                                                                             |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Le même produit deux fois dans `items` (impossible depuis le panier, qui fusionne les lignes) | la contrainte `UNIQUE (order_id, product_id)` refuse la seconde ligne : tout est annulé, réponse 500                                              |
| Deux commandes verrouillent les mêmes produits dans un ordre différent                        | MySQL détecte l'interblocage (deadlock) et annule l'une des deux transactions : réponse 500, aucune donnée incohérente ; le client peut réessayer |
