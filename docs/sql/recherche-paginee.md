# Recherche paginée du catalogue en SQL

Première des trois requêtes du projet réécrites en SQL à la main. L'application passe entièrement par Sequelize (décision du 28 octobre avec Christophe) ; ce document montre ce que l'ORM envoie à MySQL, la même requête écrite à la main, et la façon dont chacune se protège de l'injection SQL.

Route concernée : `GET /api/products?category=&search=&page=` (étapes 2.3 et 2.4).

## Ce que fait la route

| Paramètre  | Effet                                                       |
| ---------- | ----------------------------------------------------------- |
| `category` | produits d'une catégorie, par son `slug` (jointure)         |
| `search`   | produits dont le nom contient le texte (`LIKE '%texte%'`)   |
| `page`     | 12 produits par page ; `OFFSET = (page - 1) × 12`           |
| toujours   | seulement les produits actifs (`is_active = true`), par nom |

La réponse contient la page de produits et le total qui correspond aux filtres, pour calculer le nombre de pages. Il faut donc deux requêtes :

| Requête | Rôle                                   | Particularités                    |
| ------- | -------------------------------------- | --------------------------------- |
| A       | la page : les produits à afficher      | `ORDER BY`, `LIMIT`, `OFFSET`     |
| B       | le total : combien de produits en tout | `COUNT(*)`, sans tri ni découpage |

La requête B n'a pas de `LIMIT` : on compte toutes les lignes qui correspondent aux filtres, pas celles d'une page. Avec `LIMIT 12`, le total ne pourrait jamais dépasser 12.

## Requêtes écrites à la main

### Cas 1 : `?category=gelules&search=focus` (page 1)

Requête A, la page :

```sql
SELECT p.id, p.name, p.unit_price_cents
FROM products AS p
INNER JOIN categories AS c ON c.id = p.category_id
WHERE p.is_active = true
  AND c.slug = 'gelules'
  AND p.name LIKE '%focus%'
ORDER BY p.name ASC
LIMIT 12
OFFSET 0;
```

| id  | name             | unit_price_cents |
| --- | ---------------- | ---------------- |
| 52  | Focus            | 2490             |
| 59  | Focus 30 gélules | 1490             |
| 60  | Focus 90 gélules | 3490             |

Requête B, le total :

```sql
SELECT COUNT(*) AS total
FROM products AS p
INNER JOIN categories AS c ON c.id = p.category_id
WHERE p.is_active = true
  AND c.slug = 'gelules'
  AND p.name LIKE '%focus%';
```

Résultat : `total = 3`, soit une page.

### Cas 2 : `?category=gommes&page=2`

Requête A, la page (on saute les 12 premières gommes) :

```sql
SELECT p.id, p.name, p.unit_price_cents
FROM products AS p
INNER JOIN categories AS c ON c.id = p.category_id
WHERE p.is_active = true
  AND c.slug = 'gommes'
ORDER BY p.name ASC
LIMIT 12
OFFSET 12;
```

| id  | name                           |
| --- | ------------------------------ |
| 79  | Vital Gummies cerise 60 gommes |
| 76  | Vital Gummies citron 30 gommes |
| 77  | Vital Gummies citron 60 gommes |

Requête B, le total :

```sql
SELECT COUNT(*) AS total
FROM products AS p
INNER JOIN categories AS c ON c.id = p.category_id
WHERE p.is_active = true
  AND c.slug = 'gommes';
```

Résultat : `total = 15`, soit deux pages (12 puis 3). La page 2 ne peut pas contenir plus de 3 lignes : `LIMIT` fixe un maximum, et il ne reste que 3 gommes après les 12 sautées.

## L'injection SQL

Si la requête était fabriquée en collant le texte reçu dans le SQL, un visiteur pourrait envoyer un morceau de requête au lieu d'une valeur. Avec la recherche `x' OR 1=1 OR p.name LIKE '`, la requête B devient :

```sql
SELECT COUNT(*) AS total
FROM products AS p
INNER JOIN categories AS c ON c.id = p.category_id
WHERE p.is_active = true
  AND c.slug = 'gelules'
  AND p.name LIKE '%x' OR 1=1 OR p.name LIKE '%';
```

Résultat : `total = 50`, au lieu de 3. L'apostrophe du visiteur ferme le texte, et `OR 1=1`, toujours vrai, annule toutes les conditions, y compris `is_active = true` : les 2 produits désactivés sont comptés.

## Version paramétrée (requête préparée)

La requête est envoyée à MySQL avec des `?` à la place des valeurs, puis les valeurs sont transmises à part. MySQL lit la structure de la requête avant de recevoir les valeurs : une valeur reste une valeur, quel que soit son contenu.

Requête A du cas 1 :

```sql
SET @category = 'gelules';
SET @search = '%focus%';
SET @page_size = 12;
SET @offset = 0;

PREPARE page_produits FROM '
  SELECT p.id, p.name, p.unit_price_cents
  FROM products AS p
  INNER JOIN categories AS c ON c.id = p.category_id
  WHERE p.is_active = true
    AND c.slug = ?
    AND p.name LIKE ?
  ORDER BY p.name ASC
  LIMIT ?
  OFFSET ?
';

EXECUTE page_produits USING @category, @search, @page_size, @offset;

DEALLOCATE PREPARE page_produits;
```

Résultat : les 3 mêmes lignes que la requête écrite en dur.

Les valeurs remplissent les `?` dans l'ordre où ils apparaissent. Avec un ordre faux (`USING @offset, @page_size, @category, @search`), MySQL refuse la requête (`ERROR 1210 Incorrect arguments to EXECUTE`), car `LIMIT` reçoit un texte. Inverser deux valeurs de même type ne provoque en revanche aucune erreur : la recherche renvoie simplement un mauvais résultat.

Requête B du cas 1, avec la recherche normale puis celle de l'injection :

```sql
SET @category = 'gelules';
SET @search = '%focus%';

PREPARE total_produits FROM '
  SELECT COUNT(*) AS total
  FROM products AS p
  INNER JOIN categories AS c ON c.id = p.category_id
  WHERE p.is_active = true
    AND c.slug = ?
    AND p.name LIKE ?
';

EXECUTE total_produits USING @category, @search;

SET @search = '%x\' OR 1=1 OR p.name LIKE \'%';
EXECUTE total_produits USING @category, @search;

DEALLOCATE PREPARE total_produits;
```

| Recherche                      | Total |
| ------------------------------ | ----- |
| `%focus%`                      | 3     |
| `%x' OR 1=1 OR p.name LIKE '%` | 0     |

Avec la requête préparée, le texte de l'injection est cherché lettre pour lettre dans les noms. Aucun produit ne le contient.

## Le SQL généré par Sequelize

Le repository (`SequelizeProductRepository.findAll`) appelle `findAndCountAll` :

```js
ProductModel.findAndCountAll({
  where,
  include: [{ model: CategoryModel, attributes: [], where: categoryWhere }],
  order: [['name', 'ASC']],
  limit: filters.limit,
  offset: filters.offset,
})
```

Avec `logging: console.log` dans `sequelize.js`, `GET /api/products?category=gelules&search=focus` affiche deux requêtes (le total, puis la page) :

```sql
SELECT count(`Product`.`id`) AS `count`
FROM `products` AS `Product`
INNER JOIN `categories` AS `Category`
  ON `Product`.`category_id` = `Category`.`id` AND `Category`.`slug` = 'gelules'
WHERE `Product`.`name` LIKE '%focus%' AND `Product`.`is_active` = true;
```

```sql
SELECT `Product`.`id`, `Product`.`reference`, `Product`.`name`, `Product`.`slug`,
  `Product`.`description`, `Product`.`unit_price_cents` AS `unitPriceCents`,
  `Product`.`vat_rate_bp` AS `vatRateBp`, `Product`.`image`, `Product`.`stock`,
  `Product`.`is_active` AS `isActive`, `Product`.`category_id` AS `categoryId`,
  `Product`.`created_at` AS `createdAt`, `Product`.`updated_at` AS `updatedAt`
FROM `products` AS `Product`
INNER JOIN `categories` AS `Category`
  ON `Product`.`category_id` = `Category`.`id` AND `Category`.`slug` = 'gelules'
WHERE `Product`.`name` LIKE '%focus%' AND `Product`.`is_active` = true
ORDER BY `Product`.`name` ASC
LIMIT 0, 12;
```

Les requêtes sont mises en forme sur plusieurs lignes ici ; le terminal les affiche sur une seule.

## Comparaison

| Point           | Requête à la main      | Sequelize                                | Effet sur le résultat                                                                |
| --------------- | ---------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------ |
| Noms            | `p.name`               | `` `Product`.`name` ``                   | aucun ; les accents graves protègent un nom qui serait un mot réservé de SQL         |
| Comptage        | `COUNT(*)`             | `count(Product.id)`                      | aucun ; `id` n'est jamais `NULL`                                                     |
| Catégorie       | dans le `WHERE`        | dans le `ON` de la jointure              | aucun avec `INNER JOIN` ; Sequelize la place là car elle est écrite dans l'`include` |
| Ordre des `AND` | `is_active` en premier | `is_active` en dernier                   | aucun                                                                                |
| Colonnes        | 3 colonnes             | les 13 colonnes, renommées en camelCase  | Sequelize lit tout ce que l'entité `Product` attend (`underscored: true`)            |
| Découpage       | `LIMIT 12 OFFSET 0`    | `LIMIT 0, 12`                            | aucun ; forme courte de MySQL, `LIMIT offset, nombre`                                |
| Valeurs         | requête préparée (`?`) | valeurs échappées, écrites dans le texte | les deux protègent de l'injection (voir ci-dessous)                                  |

Les deux versions renvoient les mêmes lignes et le même total pour les deux cas.

## Comment Sequelize se protège de l'injection

Sequelize 6 avec MySQL n'envoie pas de `?` : il échappe chaque valeur avant de l'écrire dans la requête. Avec la recherche de l'injection, le terminal affiche :

```sql
WHERE `Product`.`name` LIKE '%x\' OR 1=1 OR p.name LIKE \'%'
```

Chaque apostrophe de la valeur est précédée d'une barre oblique inverse (`\'`) : elle devient un caractère du texte et ne le termine plus. MySQL reçoit une seule valeur, cherche ce texte lettre pour lettre, et la route renvoie `total: 0`.

| Technique        | Qui sépare la valeur du code                       | Utilisée par                                           |
| ---------------- | -------------------------------------------------- | ------------------------------------------------------ |
| Requête préparée | MySQL, qui reçoit la requête et les valeurs à part | `PREPARE` / `EXECUTE`, ou l'option `bind` de Sequelize |
| Échappement      | la bibliothèque, avant l'envoi                     | Sequelize par défaut (`where`)                         |

Dans les deux cas, la règle est la même : une valeur reçue ne doit jamais être collée telle quelle dans une requête. La validation Zod (étape 2.4) ajoute une limite en amont : la recherche fait 100 caractères au plus et la page doit être un entier supérieur ou égal à 1.
