# Neurao

E-commerce website for the neuraO range of natural food supplements, built as a monorepo with a Next.js front end and an Express API.

Project made for the French professional title _Développeur Web et Web Mobile_ (DWWM), during an internship at Nutri-Logics.

## Features (version 1)

- **Catalogue**: paginated product list, search by name, product page with photo, price and description.
- **Accounts**: sign-up, login and logout. Passwords are hashed with bcrypt; sessions are stored in Redis and identified by an `httpOnly` cookie.
- **Cart**: add, change the quantity (10 at most per product) and remove products. The cart is kept in the browser (`localStorage`), so it survives a page reload.
- **Order**: delivery address form, then `POST /api/orders` for logged-in users. Prices are read from the database, and the order, its lines and the new stocks are saved in one transaction. The order waits for its payment (online payment is planned for version 2).
- **Back-office**: page `/admin` for the roles `admin` and `manager`. It lists every product, active or not, and deactivates or reactivates one in a click.
- **Front end**: header that knows if the user is logged in, forms validated with the same Zod schemas as the API, legal notice and privacy policy pages.

### API routes

| Method and path                      | Access                | Role                                         |
| ------------------------------------ | --------------------- | -------------------------------------------- |
| `GET /api/products`                  | public                | one page of the catalogue (category, search) |
| `GET /api/products/:id`              | public                | one active product                           |
| `GET /api/categories`                | public                | the categories                               |
| `POST /api/auth/register`            | public                | creates a `customer` account                 |
| `POST /api/auth/login`               | public                | opens a session                              |
| `POST /api/auth/logout`              | public                | closes the session                           |
| `GET /api/auth/me`                   | logged in             | the current user                             |
| `POST /api/orders`                   | logged in             | places an order                              |
| `GET /api/products/admin`            | `admin` and `manager` | every product, active and inactive           |
| `PATCH /api/products/:id/deactivate` | `admin` and `manager` | hides a product from the catalogue (204)     |
| `PATCH /api/products/:id/activate`   | `admin` and `manager` | puts a product back in the catalogue (204)   |

Without a session, a protected route answers 401. With a session but without the right role, it answers 403.

## Tech stack

| Part                            | Technologies                                                |
| ------------------------------- | ----------------------------------------------------------- |
| Website (`apps/web`)            | Next.js 16 (App Router), React 19, TanStack Query, Zustand  |
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

### Production build of the website

```bash
npm run build -w apps/web
npm run start -w apps/web
```

The development mode is slower and shows the Next.js tools; use the production build to measure performance (Lighthouse).

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

43 automated tests, run with Vitest:

- **API (34 tests)**: unit tests of the domain, the use cases (including the order) and the middlewares, with fake repositories; integration tests of the product and order routes with Supertest. The integration tests need MySQL to be running.
- **Website (9 tests)**: React Testing Library in jsdom: product card, product display helpers, sign-up form with a too short password (no request sent), refused login (vague message shown), cart (quantities added, never more than 10).
- **Postman**: the collection in `docs/postman/` replays the test data set in 40 requests: catalogue, sign-up, login, protected routes, order and back-office (200, 201, 204, 400, 401, 403, 404, 409). See [docs/postman/README.md](docs/postman/README.md) to prepare the test accounts and reset the data before each run.

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
- Order prices read from the database, never from the request. The stock row is locked during the order transaction, so two orders cannot sell the same last unit.
- Back-office protected on the API by `requireAuth` and `requireRole`; hiding the link in the header is only a convenience.
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

- Online payment.
- Account page and order history.
- Back-office: create and edit products, follow the orders, a card layout for small screens.
- Sliding session expiry, and logout from every device.
- Real hosting with HTTPS.
