# Journal de bord

Stage chez Nutri-Logics, du 28 septembre au 20 novembre 2026. Cinq lignes par jour : ce qui a été fait, ce que j'ai appris, ce qui m'a bloqué.

## Semaine 1

### Lundi 28 septembre 2026

- **Fait** : début du stage. Prise de connaissance du cahier des charges et du dépôt GitHub. Invitation en tant que collaborateur sur le dépôt, clonage, création de la branche `dev`.
- **Appris** : un token GitHub _fine-grained_ ne donne accès qu'aux dépôts de son propriétaire, jamais au dépôt personnel d'un autre compte, même en tant que collaborateur.
- **Bloqué** : le premier `git push` refusé avec une erreur 403. Résolu en générant une clé SSH ed25519 et en passant le dépôt distant en SSH (`git remote set-url`).

### Mardi 29 septembre 2026

- **Fait** : abandon de Create React App, qui n'est plus maintenu. Vite envisagé, puis Next.js retenu. Suppression des fichiers CRA et installation de Next.js 16 (App Router, dossier `src/`, JavaScript, CSS Modules).
- **Appris** : la différence entre une bibliothèque et un framework. React ne fait qu'afficher des composants ; Next ajoute le routage par fichiers, le rendu serveur et la compilation sans configuration.
- **Bloqué** : le port 3000 était occupé par un autre projet local, Next a démarré sur le 3001. Rien à corriger dans le dépôt.

### Mercredi 30 septembre 2026

- **Fait** : rédaction de la documentation d'initialisation du dépôt (historique, décisions techniques, arborescence). Première version du MCD de Neurao.
- **Appris** : documenter une décision au moment où on la prend (SSH plutôt que token, Next plutôt que CRA, CSS Modules plutôt que Tailwind) évite de devoir la reconstituer de mémoire avant la soutenance.
- **Bloqué** : choisir comment représenter le statut d'une commande dans le MCD (une entité à part ou un simple attribut).

### Jeudi 1er octobre 2026

- **Fait** : MCD et MLD en version 2. L'entité `ORDER_STATUS` est supprimée au profit d'un attribut `status` dans `orders` et dans `order_status_histories` (décision validée avec Christophe) : 11 tables au lieu de 12.
- **Appris** : les clés étrangères n'existent pas dans le MCD, elles naissent au passage au MLD. Les montants sont stockés en entiers, en centimes, pour éviter les erreurs d'arrondi.
- **Bloqué** : rien de bloquant.

### Vendredi 2 octobre 2026

- **Fait** : lecture du déroulé « Next.js, monorepo et Docker » de Christophe. Passage du dépôt en monorepo : site déplacé dans `apps/web` avec `git mv`, espaces de travail npm déclarés à la racine, un seul `package-lock.json`, `.gitignore` adapté. Création du paquet partagé `@neurao/shared`.
- **Appris** : `git mv` conserve l'historique d'un fichier déplacé, alors qu'un simple `mv` le fait apparaître comme supprimé puis recréé. L'option `-w` de npm exécute une commande dans un espace de travail sans changer de dossier.
- **Bloqué** : mes premières commandes sont parties dans le mauvais dépôt, car le terminal était resté dans un autre dossier. Nettoyé avec `rmdir` et `git branch -d`. Réflexe retenu : vérifier avec `pwd` avant toute série de commandes.

## Semaine 2

### Lundi 5 octobre 2026

- **Fait** : API Express minimale (`app.js` et `server.js` séparés, route `GET /api/health`, CORS, `.env` et `.env.example`). MySQL 8.4 dans Docker, publié sur le port 3307 avec un volume et un healthcheck. Adminer retiré au profit de l'onglet Database d'IntelliJ. Sequelize branché : `config.cjs`, `.sequelizerc.cjs`, scripts `db:*`.
- **Appris** : `3307:3306` relie la porte 3307 de ma machine à la porte 3306 du conteneur ; à l'intérieur du réseau Docker, un service se joint par son nom (`db`). Le `--` d'une commande npm transmet la suite des arguments au script.
- **Bloqué** : `sequelize-cli` plantait avec `require is not defined`, car `.sequelizerc` (sans extension) est lu comme un module ES quand le paquet est en `"type": "module"`. Deux solutions testées, l'option `.sequelizerc.cjs` + `--options-path` validée par Christophe. Relevé aussi une erreur de chemin dans la configuration (4 niveaux au lieu de 5 pour atteindre le `.env`).

### Mardi 6 octobre 2026

- **Fait** : comparaison du MLD avec l'exercice de migration. Choix des types et contraintes du MPD pour `categories`, `products` et `product_categories`. Analyse de la TVA pour une vente dans quatre pays. Correction du nom du paquet de l'API dans le lockfile. Trois demandes de fusion acceptées dans `dev`.
- **Appris** : en mode strict, MySQL refuse qu'une colonne `UNSIGNED` devienne négative, ce qui empêche la survente au niveau de la base. Le taux de TVA dépend du pays de livraison et de la catégorie fiscale du produit, pas du produit seul.
- **Bloqué** : la relation produit-catégorie (plusieurs-à-plusieurs dans mon MLD, un-à-plusieurs dans l'exercice) et la vente en Suisse (hors UE, en francs suisses) attendent une décision avec Christophe et le client.

### Mercredi 7 octobre 2026

- **Fait** : nettoyage de la démo Next : police Outfit, `lang="fr"`, titre et description de la page, page d'accueil Neurao, suppression des fichiers de démo. README du projet avec la procédure d'installation. Mise en place de ce journal.
- **Appris** : `next/font` crée une variable CSS au moment de l'exécution ; IntelliJ la signale comme introuvable alors que le navigateur l'applique bien. Un texte de site de compléments alimentaires est encadré par le règlement européen sur les allégations de santé.
- **Bloqué** : rien de bloquant. Les textes de la page d'accueil restent à faire valider par Nutri-Logics.

### Jeudi 8 octobre 2026

- **Fait** : MCD et MLD en version 3 après les décisions de Christophe : un produit appartient à une seule catégorie, clés primaires `id`, clés étrangères `<entité>_id`, prix TTC en centimes et taux de TVA en points de base. 9 tables, exportées dans `docs/conception/` avec le dictionnaire de données. Migrations `create-categories` et `create-products`, jouées puis annulées et rejouées pour vérifier le retour arrière. Veille sur les scripts d'installation npm.
- **Appris** : une clé étrangère en `RESTRICT` empêche de supprimer une catégorie qui contient encore des produits (erreur 1451) et d'ajouter un produit dans une catégorie qui n'existe pas (erreur 1452). Stocker un taux de 5,5 % sous la forme de l'entier 550 évite les nombres à virgule.
- **Bloqué** : rien de bloquant. Le lot 1 est limité à la France en euros, ce qui met de côté la question de la Suisse.

### Vendredi 9 octobre 2026

- **Fait** : Redis dans Docker avec son healthcheck. ESLint et Prettier sur tout le monorepo. Modèles Sequelize `Category` et `Product` avec leur association, vérifiés par une requête avec jointure et un test dans une transaction annulée. Arborescence du site et sept parcours utilisateur. Préparation de l'expression des besoins à l'oral. La phase 0 est terminée.
- **Appris** : une migration décrit la table dans la base, un modèle décrit comment le code la manipule ; les deux doivent rester d'accord. Avec `underscored: true`, Sequelize écrit `categoryId` dans le code et `category_id` dans la base.
- **Bloqué** : trois écarts relevés dans le cahier des charges, à trancher avec Christophe : six statuts de commande au §6.3 contre quatre dans le code, l'ajustement manuel du stock (A5) marqué essentiel mais prévu au lot 3, et le jeton de réinitialisation du mot de passe absent du modèle de données.

### Dimanche 11 octobre 2026

- **Fait** : conception visuelle dans Figma, dans l'ordre wireframes, maquettes puis prototype. Wireframes des 28 pages en bureau et en mobile, maquettes aux couleurs de neuraO (56 écrans), prototype cliquable de 37 écrans et schéma d'enchaînement. Exports et choix de conception rangés dans `docs/conception/maquettes.md`.
- **Appris** : vérifier le contraste avant de valider une couleur. Le brun du texte sur le bouton miel ne donnait que 3,2:1 ; un brun plus foncé atteint 6,1:1. Comparer plusieurs variantes côte à côte (polices, pied de page, carte produit mobile) rend le choix plus rapide et plus facile à justifier.
- **Bloqué** : pas de photo pour les flacons d'Oméga-3 et de D3 ni de couverture définitive pour le livre : visuels provisoires en attendant.

## Semaine 3

### Lundi 12 octobre 2026

- **Fait** : migrations des sept tables restantes du MLD (rôles, utilisateurs, modes de livraison, commandes, lignes de commande, paiements, historique des statuts), jouées, annulées une par une puis rejouées. Seeder des rôles, des modes de livraison et d'un catalogue de 50 produits répartis dans les quatre catégories. Fusion des demandes sur les maquettes et sur les migrations. Début de l'étape des couches de l'API.
- **Appris** : l'ordre des migrations suit les dépendances, car une clé étrangère ne peut viser qu'une table qui existe déjà. Par défaut, Sequelize ne retient pas les seeders joués : l'option `seederStorage` les enregistre dans une table, ce qui évite d'insérer deux fois les mêmes données.
- **Bloqué** : trois questions posées à Christophe : qui écrit le seeder, comment stocker l'âge minimal d'un produit (le filtre par âge des maquettes n'a pas de colonne dans le MLD), et où placer la règle de livraison offerte dès 75 €.

### Mardi 13 octobre 2026

- **Fait** : remise à niveau en JavaScript avant d'écrire la couche domaine, avec des exercices dans mon bac à sable : classes, constructeur, objet passé en paramètre, méthodes, conditions et levée d'erreurs.
- **Appris** : le `!` s'applique avant `===`, donc `!x === true` ne veut pas dire « x n'est pas vrai » ; il faut écrire `x !== true`. Pour passer de « ce qui est valide » à « ce que je refuse », on inverse chaque condition et on échange ET et OU.
- **Bloqué** : j'ai eu du mal à traduire une règle en condition. Je fais désormais tourner la condition à la main sur un exemple avant d'exécuter.

### Mercredi 14 octobre 2026

- **Fait** : fin des exercices sur la validation et sur `export` / `import`. Préparation de l'entité `Product` du domaine.
- **Appris** : il faut tester les bornes : mes cas de test étaient tous loin de la limite, et aucun n'a vu que `age <= 0` refusait 0 à tort. Un export par défaut s'importe sans accolades, un export nommé avec ; l'erreur « does not provide an export named 'default' » vient d'un mélange des deux.
- **Bloqué** : rien de bloquant.

### Jeudi 15 octobre 2026

- **Fait** : exercices sur la copie d'objets avec `...` et sur `try` / `catch`, pour pouvoir tester l'entité `Product` sans répéter ses onze champs à chaque cas.
- **Appris** : `{ ...modele, stock: 0 }` crée un nouvel objet sans modifier l'original, et la dernière valeur écrite l'emporte. `try` / `catch` attrape une erreur sans arrêter le programme, ce qui permet d'enchaîner plusieurs cas de test.
- **Bloqué** : je ne me sentais pas prêt à écrire le fichier de test d'un coup ; je l'ai découpé en petits exercices.

### Vendredi 16 octobre 2026

- **Fait** : fin des exercices sur `try` / `catch`, début du fichier de test de l'entité `Product` (un produit modèle, puis un cas par règle). Point d'étape du vendredi : étape 2.1 terminée, étape 2.2 en cours.
- **Appris** : une erreur de syntaxe empêche tout le fichier de s'exécuter, alors qu'une erreur d'exécution laisse passer ce qui précède. `MODULE_NOT_FOUND` signale un fichier introuvable, souvent une faute dans le nom.
- **Bloqué** : rien de bloquant.

### Dimanche 18 octobre 2026

- **Fait** : test de l'entité `Product` terminé, onze cas, tous conformes à mes prévisions : prix et stock négatifs, à zéro ou non entiers, `isActive` invalide, et les trois cas de disponibilité.
- **Appris** : un test n'a de valeur que si chaque vérification a au moins un cas qui la déclenche, et si l'on teste les bornes (un stock à 0 est valide, c'est un produit en rupture). `console.log` sert au déroulé normal, `console.error` aux anomalies.
- **Bloqué** : IntelliJ signalait `isAvailable()` comme introuvable, car le fichier de test était hors du projet ; l'exécution avec Node a confirmé que la méthode existait.

## Semaine 4

### Lundi 19 octobre 2026

- **Fait** : exercices sur `async` / `await` et `.map()` avec une base simulée, puis écriture du repository Sequelize des produits : `findAll` (produits actifs triés par nom) et `findById` (un produit ou `null`). Testé sur la vraie base : 48 produits actifs, le bon produit retrouvé par son identifiant, `null` pour un identifiant inexistant.
- **Appris** : une lecture en base renvoie une promesse qu'il faut attendre avec `await`. `.map()` transforme chaque ligne lue en entité `Product`. Avec l'option `raw: true`, Sequelize renvoie `isActive` sous la forme `1` au lieu de `true`, et l'entité le refuse : c'est un exemple concret de l'utilité des vérifications dans la classe.
- **Bloqué** : j'ai eu du mal à assembler la fonction qui transforme une liste ; suivre les données étape par étape, en affichant chaque résultat, m'a débloqué.

### Mardi 20 octobre 2026

- **Fait** : nettoyage et commit de l'entité `Product` et de son repository. Exercice sur l'injection de dépendance : deux dépôts différents (une base simulée et un dépôt de test écrit à la main) donnés tour à tour à la même fonction.
- **Appris** : un cas d'usage ne fabrique pas son repository, il le reçoit en paramètre. La même fonction marche alors avec la vraie base comme avec un faux dépôt de test, sans changer une ligne.
- **Bloqué** : je confondais renvoyer l'objet déjà obtenu et en fabriquer un nouveau, et j'oubliais de ranger le résultat d'un appel dans une variable avant de l'afficher.

### Mercredi 21 octobre 2026

- **Fait** : écriture des cas d'usage `getProduct` (un produit désactivé est invisible pour le visiteur) et `listProducts`.
- **Appris** : avec `||`, JavaScript s'arrête dès qu'une condition est vraie ; tester `null` en premier évite de lire une propriété sur `null`. La règle « produit désactivé » porte sur `isActive`, pas sur la disponibilité : un produit en rupture doit rester visible.
- **Bloqué** : la notion de cas d'usage restait floue ; la décrire comme une action d'un utilisateur (« Camille ouvre la fiche de D3 ») l'a rendue concrète. Dans IntelliJ, la table n'apparaissait pas : il fallait rafraîchir la connexion et chercher `products`, au pluriel.

### Jeudi 22 octobre 2026

- **Fait** : tests des deux cas d'usage sur la vraie base, tous conformes à mes prévisions. Plan de l'architecture de l'API et du trajet d'une requête, comparé avec l'organisation habituelle de Christophe (handlers, séparation commandes et requêtes) ; il a validé l'architecture en couches. Exercices sur les paramètres et les callbacks.
- **Appris** : un paramètre est une case vide remplie au moment de l'appel ; ce qui varie ou ce qu'on veut pouvoir remplacer devient un paramètre. Un callback est une fonction donnée à quelqu'un d'autre, qui l'appelle et remplit ses paramètres. `lancerBombe(bombeAEau())` donne le résultat de la fonction au lieu de la fonction elle-même.
- **Bloqué** : le callback restait flou ; écrire mon propre exemple, puis suivre la valeur contenue dans le paramètre, m'a débloqué.

### Vendredi 23 octobre 2026

- **Fait** : contrôleur des produits (`ProductController`) qui reçoit le repository dans son constructeur, avec la méthode `getOne` : 200 et le produit en JSON, ou 404. Testé de bout en bout avec un faux Express : contrôleur, cas d'usage, repository et base. Point d'étape du vendredi.
- **Appris** : tout ce qui vient de l'adresse est du texte (`'58'`), on le convertit en nombre dès l'entrée. Pour utiliser la méthode d'un objet, il faut l'objet, pas sa classe : seul le fichier qui fabrique le repository a besoin de l'importer.
- **Bloqué** : un fichier mal nommé (`ProductControllers.js`) a provoqué une erreur `MODULE_NOT_FOUND`.

### Dimanche 25 octobre 2026

- **Fait** : méthode `getAll` du contrôleur, constantes des codes HTTP, routeur des produits (point d'assemblage qui crée le repository et le contrôleur) et branchement dans `app.js`. L'API répond dans le navigateur : `GET /api/products` et `GET /api/products/:id`. Demande de fusion de l'étape 2.2 ouverte.
- **Appris** : j'ai traduit moi-même la requête de Sequelize en SQL (`WHERE is_active = true ORDER BY name ASC`) pour vérifier le résultat dans la base. Le lint vérifie la forme du code, pas le sens : une faute (`OK: 20`) n'est apparue qu'en relançant les tests ; `git commit --amend` corrige le dernier commit tant qu'il n'est pas poussé. `/api/products/abc` renvoie 500 au lieu de 400 : l'identifiant doit être validé à l'entrée.
- **Bloqué** : un import écrit avec une majuscule (`ProductRoutes.js`) marchait sur macOS mais aurait cassé sous Linux ; le chemin doit reprendre le nom du fichier lettre pour lettre.
