# Journal de bord

Stage chez Nutri-Logics, du 28 septembre au 20 novembre 2026. Cinq lignes par jour : ce qui a été fait, ce que j'ai appris, ce qui m'a bloqué.

## Semaine 1

### Lundi 28 septembre 2026

- **Fait** : début du stage. Prise de connaissance du cahier des charges et du dépôt GitHub. Invitation en tant que collaborateur sur le dépôt, clonage, création de la branche `dev`.
- **Appris** : un token GitHub *fine-grained* ne donne accès qu'aux dépôts de son propriétaire, jamais au dépôt personnel d'un autre compte, même en tant que collaborateur.
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
