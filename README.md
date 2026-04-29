# Nhatro Backend

Backend service for the **nhatro** (rental housing) application, built with [NestJS](https://nestjs.com/) and TypeScript.

## Tech Stack

| Technology     | Version | Purpose                                  |
| -------------- | ------- | ---------------------------------------- |
| NestJS         | 11.x    | Backend framework                        |
| TypeScript     | 5.x     | Language                                 |
| PostgreSQL     | 16      | Database                                 |
| TypeORM        | 0.3.x   | ORM / migrations                         |
| JWT + Passport | —       | Authentication (access + refresh tokens) |
| bcrypt         | 5.x     | Password hashing                         |
| Swagger        | 11.x    | API documentation                        |
| pnpm           | latest  | Package manager                          |
| Docker         | —       | Local database                           |

---

## Prerequisites

Before you start, make sure the following tools are installed:

- **Node.js** ≥ 20 — [nodejs.org](https://nodejs.org)
- **pnpm** — install with `npm install -g pnpm`
- **Docker & Docker Compose** — [docker.com](https://www.docker.com)

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd nhatro-be
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Application
NODE_ENV=development
PORT=3000

# Database (matches docker-compose defaults)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nhatro
DB_SSL=false

# JWT — change these secrets before deploying!
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=7d
```

> **Security**: Never commit `.env` to version control. Only `.env.example` should be tracked.

---

## Start the Database

Start a local PostgreSQL instance using Docker Compose:

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container named `nhatro-postgres` on port `5432`.

To stop it:

```bash
docker compose down
```

To stop and remove data volumes:

```bash
docker compose down -v
```

---

## Running the Application

### Development (with hot-reload)

```bash
pnpm start:dev
```

### Debug mode

```bash
pnpm start:debug
```

### Production

```bash
pnpm build
pnpm start:prod
```

Once running, the API is available at:

- **API base URL**: `http://localhost:3000/api/v1`
- **Swagger docs**: `http://localhost:3000/api/docs`
- **Health check**: `http://localhost:3000/api/v1/health`

---

## Database Migrations

> `synchronize` is always `false`. Use migrations in all environments.

### Generate a migration

```bash
pnpm migration:generate src/database/migrations/MigrationName
```

### Run pending migrations

```bash
pnpm migration:run
```

### Revert the last migration

```bash
pnpm migration:revert
```

---

## Testing

### Unit tests

```bash
pnpm test
```

### Unit tests with coverage

```bash
pnpm test:cov
```

### End-to-end (e2e) tests

```bash
pnpm test:e2e
```

---

## Project Structure

```
src/
├── main.ts                        # Application entry point
├── app.module.ts                  # Root module
├── app.controller.ts              # Health check endpoint
├── app.service.ts
│
├── common/                        # Shared utilities
│   ├── decorators/                # @GetUser(), @Roles()
│   ├── dto/                       # Pagination DTOs
│   ├── filters/                   # HTTP exception filter
│   ├── guards/                    # JwtAuthGuard, RolesGuard
│   └── interceptors/              # LoggingInterceptor
│
├── config/
│   ├── app/app.config.ts          # App-level config
│   └── database/
│       └── database.config.ts     # TypeORM factory
│
├── database/
│   ├── data-source.ts             # CLI data source for migrations
│   └── migrations/                # Generated migration files
│
├── entities/                      # TypeORM entity classes
│   ├── user.entity.ts
│   ├── buyer.entity.ts
│   ├── variable.entity.ts
│   ├── formula.entity.ts
│   ├── usage-record.entity.ts
│   ├── submission.entity.ts
│   ├── replacement-request.entity.ts
│   ├── sheet-config.entity.ts
│   ├── sheet-config-column.entity.ts
│   ├── bill.entity.ts
│   ├── bill-line-item.entity.ts
│   ├── payment.entity.ts
│   └── audit-log.entity.ts
│
└── modules/
    ├── auth/                      # Authentication (register, login, refresh, logout)
    │   ├── dto/
    │   ├── strategies/jwt.strategy.ts
    │   ├── auth.controller.ts
    │   ├── auth.module.ts
    │   └── auth.service.ts
    │
    └── users/                     # User management
        ├── dto/
        ├── entities/user.entity.ts
        ├── users.controller.ts
        ├── users.module.ts
        └── users.service.ts
```

---

## API Endpoints

### Auth

| Method | Endpoint                | Auth required | Description              |
| ------ | ----------------------- | :-----------: | ------------------------ |
| POST   | `/api/v1/auth/register` |      No       | Register a new user      |
| POST   | `/api/v1/auth/login`    |      No       | Login, returns tokens    |
| POST   | `/api/v1/auth/logout`   |      Yes      | Invalidate refresh token |
| POST   | `/api/v1/auth/refresh`  |      No       | Refresh access token     |

### Users

| Method | Endpoint            | Role required | Description              |
| ------ | ------------------- | :-----------: | ------------------------ |
| GET    | `/api/v1/users/me`  |      Any      | Get current user profile |
| GET    | `/api/v1/users`     |     Admin     | List all users           |
| GET    | `/api/v1/users/:id` |     Admin     | Get user by ID           |
| PATCH  | `/api/v1/users/:id` |      Any      | Update user              |
| DELETE | `/api/v1/users/:id` |     Admin     | Delete user              |

Full interactive documentation is available at `http://localhost:3000/api/docs`.

---

## Code Style

Lint and format checks:

```bash
pnpm lint
pnpm format
```

The project uses ESLint with TypeScript rules and Prettier for formatting.

---

## Environment Variables Reference

| Variable                 | Default       | Description                            |
| ------------------------ | ------------- | -------------------------------------- |
| `NODE_ENV`               | `development` | Runtime environment                    |
| `PORT`                   | `3000`        | HTTP server port                       |
| `DB_HOST`                | `localhost`   | PostgreSQL host                        |
| `DB_PORT`                | `5432`        | PostgreSQL port                        |
| `DB_USERNAME`            | `postgres`    | Database username                      |
| `DB_PASSWORD`            | `postgres`    | Database password                      |
| `DB_NAME`                | `nhatro`      | Database name                          |
| `DB_SSL`                 | `false`       | Enable SSL for DB connection           |
| `JWT_SECRET`             | —             | **Required** Secret for access tokens  |
| `JWT_EXPIRES_IN`         | `15m`         | Access token expiry                    |
| `JWT_REFRESH_SECRET`     | —             | **Required** Secret for refresh tokens |
| `JWT_REFRESH_EXPIRES_IN` | `7d`          | Refresh token expiry                   |
