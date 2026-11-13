# Neurao

E-commerce website for the neuraO range of natural food supplements, built as a monorepo with a Next.js front end and an Express API.

Project made for the French professional title _Développeur Web et Web Mobile_ (DWWM), during an internship at Nutri-Logics.

## Features (version 1)

- **Catalogue**: paginated product list, product page with photo, price and description.
- **Accounts**: sign-up, login and logout. Passwords are hashed with bcrypt; sessions are stored in Redis and identified by an `httpOnly` cookie.
- **Protected routes**: `GET /api/auth/me` for logged-in users, and an admin route that deactivates a product (`PATCH /api/products/:id/deactivate`, roles `admin` and `manager`).
- **Front end**: header that knows if the user is logged in, login and sign-up forms validated with the same Zod schemas as the API, legal notice and privacy policy pages.

The back-office screens, the cart and the order are planned for version 2 (see [Roadmap](#roadmap)).

## Tech stack

| Part                            | Technologies                                                |
| ------------------------------- | ----------------------------------------------------------- |
| Website (`apps/web`)            | Next.js 16 (App Router), React 19, TanStack Query           |
| API (`apps/api`)                | Node.js, Express 5, Sequelize 6, bcrypt                     |
| Database                        | MySQL 8.4, in Docker                                        |
| Sessions                        | Redis 8, in Docker                                          |
| Shared code (`packages/shared`) | Zod validation schemas used by both the website and the API |
| Tests                           | Vitest, Supertest, React Testing Library, Postman           |

## Architecture

```
Browser ──► Next.js (port 3000) ──► Express API (port 4000) ──► MySQL / Redis
             pages + rewrites          routes → controllers → use cases → repositories
```

- The browser only talks to Next.js. A rewrite forwards every `/api/...` request to the API, so the session cookie stays on one address and no CORS credentials are needed.
- The API follows layers: `http` (routes, middlewares, controllers), `application` (use cases), `domain` (business classes and rules) and `infrastructure` (Sequelize and Redis repositories). Repositories are passed to controllers and use cases as parameters, so unit tests can give them fake ones.

## Repository structure

```
neurao/
├── apps/
│   ├── web/              the website (Next.js)
│   └── api/              the API (Express, Sequelize)
├── packages/
│   └── shared/           Zod schemas shared by the website and the API
├── infra/mysql/          SQL script that creates the limited MySQL account of the API
├── docs/                 design (MERISE, mock-ups), SQL notes, Postman collection, logbook
├── docker-compose.yml    MySQL and Redis
├── .env.example          template of the environment variables
└── package.json          npm workspaces
```

This is a monorepo: one install at the root, one `node_modules` and one `package-lock.json`.

## Requirements

- Node.js 20.9 or later
- Docker and Docker Compose
- Free ports 3307 and 6379 (MySQL is published on 3307 to avoid a conflict with a local MySQL on 3306; Redis uses its standard port)

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:christophe-1/Neurao.git
   cd Neurao
   ```

2. Create the `.env` file from the template and fill in the passwords (for example with `openssl rand -hex 24`). MySQL only reads them when the database is created for the first time.

   ```bash
   cp .env.example .env
   ```

3. Create the `.env.local` file of the website:

   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

4. Install the dependencies, at the root only:

   ```bash
   npm install
   ```

5. Start MySQL and Redis, then wait until both are `healthy`:

   ```bash
   docker compose up -d
   docker compose ps
   ```

6. Create the tables and load the catalogue:

   ```bash
   npm run db:migrate -w apps/api
   npm run db:seed -w apps/api
   ```

7. Create the limited MySQL account used by the API (`SELECT`, `INSERT`, `UPDATE` only): run `infra/mysql/create-app-user.sql` as root, after replacing the password placeholder with the value of `DB_APP_PASSWORD`. Never commit the real password.

8. Start the API and the website, each in its own terminal:

   ```bash
   npm run dev:api
   npm run dev:web
   ```

| Application | Address                          |
| ----------- | -------------------------------- |
| Website     | http://localhost:3000            |
| API         | http://localhost:4000/api/health |

## Scripts

### At the root

| Command                | Effect                                     |
| ---------------------- | ------------------------------------------ |
| `npm run dev:web`      | starts the website in development mode     |
| `npm run dev:api`      | starts the API in development mode (watch) |
| `npm run lint`         | runs ESLint in every package               |
| `npm run format:check` | checks the formatting with Prettier        |
| `npm test -w apps/api` | runs the API tests                         |
| `npm test -w apps/web` | runs the website tests                     |

### Database (API)

| Command                                 | Effect                                                  |
| --------------------------------------- | ------------------------------------------------------- |
| `npm run db:migrate -w apps/api`        | runs the pending migrations                             |
| `npm run db:migrate:undo -w apps/api`   | reverts the last migration                              |
| `npm run db:migrate:status -w apps/api` | lists the done and pending migrations                   |
| `npm run db:seed -w apps/api`           | loads the roles, the shipping methods and the catalogue |

### Docker

| Command                                    | Effect                                              |
| ------------------------------------------ | --------------------------------------------------- |
| `docker compose up -d`                     | starts MySQL and Redis in the background            |
| `docker compose ps`                        | shows the state of the containers                   |
| `docker compose down`                      | stops the containers and keeps the MySQL data       |
| `docker compose down -v`                   | stops the containers and deletes all the MySQL data |
| `docker compose exec redis redis-cli ping` | checks that Redis answers (`PONG`)                  |

## Tests

- **API**: unit tests of the domain, the use cases and the middlewares (fake repositories), and integration tests of the product routes with Supertest. The integration tests need MySQL to be running.
- **Website**: React Testing Library in jsdom: product card, sign-up form with a too short password (no request sent), refused login (vague message shown).
- **Postman**: the collection in `docs/postman/` replays the test data set (catalogue, sign-up, login, 401, 403, 204). See [docs/postman/README.md](docs/postman/README.md) to prepare the test admin account and reset the data before each run.

## Environment variables

`.env` at the root is read by the API and by Docker. `apps/web/.env.local` is read by Next.js. Neither is ever committed; the `.env.example` files list the expected names.

| Variable                             | Role                                                      |
| ------------------------------------ | --------------------------------------------------------- |
| `PORT`                               | port of the API                                           |
| `WEB_ORIGIN`                         | address of the website, allowed by CORS                   |
| `DB_HOST`, `DB_PORT`                 | address of MySQL, seen from the machine                   |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`  | database and account used by the migrations and the seeds |
| `DB_APP_USER`, `DB_APP_PASSWORD`     | limited account used by the API                           |
| `DB_ROOT_PASSWORD`                   | MySQL administrator password, used by the container       |
| `REDIS_HOST`, `REDIS_PORT`           | address of Redis, seen from the machine                   |
| `API_URL` (in `apps/web/.env.local`) | address of the API, used by the Next.js rewrite           |

## Security

- Passwords hashed with bcrypt; at least 15 characters (NIST SP 800-63B), at most 72 bytes.
- Session id: 32 random bytes, stored in Redis with a 2-hour expiry; cookie `httpOnly`, `sameSite: 'lax'`, `secure` in production.
- Same error message for an unknown email and a wrong password (no account enumeration).
- Role never taken from the request: every new account is a `customer`.
- Validation with Zod on the API, even when the website already checked the form.
- Limited MySQL account for the API (no `DELETE`, no `DROP`); products are deactivated instead of deleted.
- Central error middleware: the client gets a neutral 500, the details stay in the server logs.
- Dependencies checked with `npm audit`. Two moderate issues remain in `uuid` (used inside Sequelize): the only proposed fix would downgrade Sequelize to version 3, and the affected option is not used by the project.

## Documentation

- `docs/conception/`: MERISE models (MCD, MLD), mock-ups and screen flow.
- `docs/sql/`: paginated search query, backup and restore.
- `docs/postman/`: Postman collection and how to run it.
- `docs/journal.md`: daily logbook of the project (in French).

## Roadmap

Version 2:

- Back-office screens: product list, edit and deactivate.
- Cart and order, with a database transaction that locks the stock.
- Account page and order history.
- Sliding session expiry, and logout from every device.
- Real hosting with HTTPS.
