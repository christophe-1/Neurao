# Neurao

Site e-commerce de compléments alimentaires naturels, avec son back-office.

Projet réalisé dans le cadre du titre professionnel Développeur Web et Web Mobile (DWWM), lors d'un stage chez Nutri-Logics.

## Stack technique

| Partie | Technologies |
|---|---|
| Site (`apps/web`) | Next.js 16 (App Router), React 19 |
| API (`apps/api`) | Node.js, Express 5, Sequelize 6 |
| Base de données | MySQL 8.4, dans Docker |
| Stockage clé/valeur | Redis 8, dans Docker (panier des visiteurs) |
| Code partagé (`packages/shared`) | constantes communes au site et à l'API |

## Structure du dépôt

```
neurao/
├── apps/
│   ├── web/              le site (Next.js)
│   └── api/              l'API (Express, Sequelize)
├── packages/
│   └── shared/           le code commun au site et à l'API
├── docker-compose.yml    MySQL et Redis
├── .env.example          le modèle des variables d'environnement
└── package.json          déclare les espaces de travail npm
```

Le dépôt est un monorepo : une seule installation à la racine, un seul `node_modules` et un seul `package-lock.json`.

## Prérequis

- Node.js 20.9 ou plus récent
- Docker et Docker Compose
- Les ports 3307 et 6379 libres (MySQL est publié sur 3307 pour ne pas entrer en conflit avec un MySQL local sur 3306 ; Redis utilise son port standard, 6379)

## Installation

1. Cloner le dépôt et entrer dans le dossier :

   ```bash
   git clone git@github.com:christophe-1/Neurao.git
   cd Neurao
   ```

2. Créer le fichier `.env` à partir du modèle, puis renseigner `DB_PASSWORD` et `DB_ROOT_PASSWORD` :

   ```bash
   cp .env.example .env
   ```

   Pour générer un mot de passe : `openssl rand -hex 24`. Les mots de passe doivent être choisis avant le premier démarrage de la base : MySQL ne les lit qu'à l'initialisation.

3. Installer les dépendances, à la racine uniquement :

   ```bash
   npm install
   ```

4. Démarrer MySQL et Redis, puis attendre l'état `healthy` pour les deux :

   ```bash
   docker compose up -d
   docker compose ps
   ```

5. Jouer les migrations :

   ```bash
   npm run db:migrate -w apps/api
   ```

6. Lancer l'API et le site, chacun dans son terminal :

   ```bash
   npm run dev:api
   npm run dev:web
   ```

| Application | Adresse |
|---|---|
| Site | http://localhost:3000 |
| API | http://localhost:4000/api/health |

## Scripts

### À la racine

| Commande | Effet |
|---|---|
| `npm run dev:web` | lance le site en développement |
| `npm run dev:api` | lance l'API en développement, avec relance automatique |
| `npm run lint` | vérifie la qualité du code dans tous les paquets |

### Base de données (API)

| Commande | Effet |
|---|---|
| `npm run db:migrate -w apps/api` | joue les migrations qui ne l'ont pas encore été |
| `npm run db:migrate:undo -w apps/api` | annule la dernière migration |
| `npm run db:migrate:status -w apps/api` | liste les migrations jouées et en attente |
| `npm run db:migration:generate -w apps/api -- --name <nom>` | crée un fichier de migration vide, à renommer en `.cjs` |

### Docker

| Commande | Effet |
|---|---|
| `docker compose up -d` | démarre MySQL et Redis en arrière-plan |
| `docker compose ps` | affiche l'état des conteneurs |
| `docker compose down` | arrête les conteneurs, les données de MySQL sont conservées |
| `docker compose down -v` | arrête les conteneurs et efface toutes les données de MySQL |
| `docker compose exec redis redis-cli ping` | vérifie que Redis répond (`PONG`) |

## Variables d'environnement

Un seul fichier `.env`, à la racine, lu par l'API et par Docker. Il n'est jamais versionné.

| Variable | Rôle |
|---|---|
| `PORT` | port de l'API |
| `WEB_ORIGIN` | adresse du site, autorisée par CORS à appeler l'API |
| `DB_HOST`, `DB_PORT` | adresse de la base, vue depuis la machine |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD` | base et compte utilisés par l'application |
| `DB_ROOT_PASSWORD` | mot de passe administrateur de MySQL, utilisé par le conteneur |
| `REDIS_HOST`, `REDIS_PORT` | adresse de Redis, vue depuis la machine |