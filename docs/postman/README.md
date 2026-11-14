# Jeu d'essai Postman

La collection `neurao-api.postman_collection.json` rejoue le jeu d'essai de l'API dans le Runner de Postman : catalogue, inscription, connexion, routes protégées (401, 403, 204) et commande (201, 400, 401, 409).

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

Le passage crée le compte `jeu.essai@example.com`, passe une commande avec ce compte et désactive le produit « Focus ». `neurao_app` n'a pas le droit `DELETE`, le nettoyage se fait donc en root. Dans l'ordre : le stock commandé est rendu aux produits, puis les lignes de commande, les commandes et le compte sont supprimés (les clés étrangères interdisent de supprimer un compte qui a des commandes), et « Focus » est réactivé :

```bash
docker compose exec -T db sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" -e "UPDATE products AS p SET p.stock = p.stock + (SELECT COALESCE(SUM(i.quantity), 0) FROM order_items AS i JOIN orders AS o ON o.id = i.order_id JOIN users AS u ON u.id = o.user_id WHERE u.email = \"jeu.essai@example.com\" AND i.product_id = p.id); DELETE i FROM order_items AS i JOIN orders AS o ON o.id = i.order_id JOIN users AS u ON u.id = o.user_id WHERE u.email = \"jeu.essai@example.com\"; DELETE o FROM orders AS o JOIN users AS u ON u.id = o.user_id WHERE u.email = \"jeu.essai@example.com\"; DELETE FROM users WHERE email = \"jeu.essai@example.com\"; UPDATE products SET is_active = 1 WHERE name = \"Focus\";"'
```

Ces comptes et mots de passe ne servent qu'au jeu d'essai sur une base locale.
