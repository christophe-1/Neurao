# Droits MySQL, sauvegarde et restauration

Toutes les commandes se lancent depuis la racine du projet, avec les conteneurs démarrés (`docker compose up -d`).

## 1. Les comptes MySQL

Chaque compte n'a que les droits dont il a besoin (principe du moindre privilège).

| Compte | Utilisé par | Quand | Droits |
|---|---|---|---|
| `root` | l'administrateur, à la main | rarement | tous : créer des comptes, donner des droits, sauvegarder, restaurer |
| `neurao` | `npm run db:migrate` et `db:seed` | quand le schéma change | tous, mais seulement sur la base `neurao` (créé par Docker au premier démarrage) |
| `neurao_app` | l'API | en permanence | `SELECT`, `INSERT`, `UPDATE` sur `neurao.*`, rien d'autre |

L'API est la seule partie exposée à Internet : c'est elle qui a le compte le plus limité. Elle n'a pas `DELETE`, car un produit est désactivé (`is_active = false`) au lieu d'être supprimé. Dans `apps/api/src/infrastructure/database/config.cjs`, la configuration `development` (compte `neurao`) sert aux migrations, et la configuration `app` (compte `neurao_app`) sert à l'API.

### Créer ou mettre à jour le compte de l'API

1. Ajouter `DB_APP_USER` et `DB_APP_PASSWORD` dans `.env` (voir `.env.example`). Pour générer un mot de passe : `openssl rand -hex 24`.
2. Ouvrir une console SQL connectée en `root` (port 3307), y copier le contenu de `infra/mysql/create-app-user.sql`, remplacer `MOT_DE_PASSE` par la valeur de `DB_APP_PASSWORD` **dans la console uniquement**, puis exécuter.
3. Vérifier :

```sql
SHOW GRANTS FOR 'neurao_app'@'%';
-- GRANT USAGE ON *.* TO `neurao_app`@`%`
-- GRANT SELECT, INSERT, UPDATE ON `neurao`.* TO `neurao_app`@`%`
```

Le script est relançable : `IF NOT EXISTS` évite l'erreur si le compte existe, `ALTER USER` remet le mot de passe, `REVOKE` retire tout avant le `GRANT`.

### Test de sécurité (6 novembre 2026)

Connecté en `neurao_app`, comme le serait un attaquant qui aurait volé le compte de l'API :

| Requête | Résultat attendu | Résultat obtenu |
|---|---|---|
| `SELECT COUNT(*) FROM products;` | autorisé | 50 |
| `DROP TABLE test_securite;` | refusé | `ERROR 1142: DROP command denied to user 'neurao_app'` |
| `DELETE FROM products WHERE 1 = 0;` | refusé | `ERROR 1142: DELETE command denied to user 'neurao_app'` |

Le test vise une table qui n'existe pas et une condition toujours fausse : si la protection avait échoué, aucune donnée n'aurait été perdue.

## 2. Sauvegarder

```bash
docker compose exec -T db sh -c 'mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" --single-transaction neurao' > backups/neurao-AAAA-MM-JJ.sql
```

- `mysqldump` est exécuté dans le conteneur : même version que le serveur, rien à installer, même commande en production.
- `$MYSQL_ROOT_PASSWORD` est lu dans le conteneur (apostrophes de `sh -c`) : le mot de passe n'est jamais tapé.
- `--single-transaction` prend une copie cohérente sans bloquer la base.
- Le fichier contient des `CREATE TABLE` puis des `INSERT INTO`.

Le dossier `backups/` est ignoré par Git : une sauvegarde contient toutes les données, y compris les données personnelles des clients, et ne doit jamais être publiée.

## 3. Restaurer

```bash
docker compose exec -T db sh -c 'mysql -u root -p"$MYSQL_ROOT_PASSWORD" neurao' < backups/neurao-AAAA-MM-JJ.sql
```

`mysql` rejoue les commandes du fichier : chaque table est supprimée puis recréée avec ses lignes. **Tout ce qui a été écrit après la sauvegarde est perdu.**

### Test de restauration (6 novembre 2026)

1. Sauvegarde : `backups/neurao-2026-11-06.sql` (34 Ko).
2. Dégradation volontaire avec le compte de l'API : `UPDATE products SET name = 'PIRATÉ' WHERE id = 100;` — l'API affiche « PIRATÉ ».
3. Restauration avec la commande ci-dessus.
4. Vérification : `GET /api/products/100` affiche de nouveau « Coffret découverte gommes ».

## 4. Limites et pistes en production

- Une restauration ramène la base à l'heure de la sauvegarde : plus les sauvegardes sont fréquentes, moins on perd de données. En production : une sauvegarde automatique chaque nuit (tâche planifiée `cron`), avec plusieurs jours conservés.
- Une copie doit être rangée hors du serveur, sinon une panne du serveur emporte aussi les sauvegardes.
- Pour ne rien perdre entre deux sauvegardes, MySQL peut rejouer son journal binaire (binlog) jusqu'à une heure précise : restauration à un instant donné, non mise en place dans ce projet.
