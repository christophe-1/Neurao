# Jeu d'essai Postman

La collection `neurao-api.postman_collection.json` rejoue le jeu d'essai de l'API dans le Runner de Postman : catalogue, inscription, connexion, routes protégées (401, 403, 204).

Toutes les commandes se lancent depuis la racine du dépôt, avec les conteneurs démarrés (`docker compose up -d`) et l'API lancée (`npm run dev:api`).

## Une seule fois : créer le compte admin de test

L'inscription donne toujours le rôle `customer`. Le compte admin de test est donc créé par l'API, puis promu en root :

```bash
curl -X POST http://localhost:4000/api/auth/register -H 'Content-Type: application/json' -d '{"email":"admin.essai@example.com","password":"lune-du-soir-2026","firstName":"Alex","lastName":"Admin"}'
```

```bash
docker compose exec -T db sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" -e "UPDATE users SET role_id = (SELECT id FROM roles WHERE code = \"admin\") WHERE email = \"admin.essai@example.com\";"'
```

## Avant chaque passage du Runner : remettre la base en état

Le passage crée le compte `jeu.essai@example.com` et désactive le produit « Focus ». `neurao_app` n'a pas le droit `DELETE`, le nettoyage se fait donc en root :

```bash
docker compose exec -T db sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" -e "DELETE FROM users WHERE email = \"jeu.essai@example.com\"; UPDATE products SET is_active = 1 WHERE name = \"Focus\";"'
```

Ces comptes et mots de passe ne servent qu'au jeu d'essai sur une base locale.
