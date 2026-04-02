# nhatro-be

NestJS backend for the nhatro (rental housing) application with PostgreSQL and TypeORM.

## Features

- 🔐 JWT Authentication with refresh token rotation
- 👥 Role-Based Access Control (RBAC): admin, seller, buyer
- 🗃️ PostgreSQL database with TypeORM
- 📝 Audit logging for authentication events
- 🔒 Password hashing with bcrypt
- 🚀 NestJS modular architecture
- 🐳 Docker support for easy setup

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment file and configure
cp .env.example .env

# 3. Start the database (Docker)
docker-compose up -d

# 4. Set up database (migrate + seed)
pnpm db:setup
# or step by step:
#   pnpm migration:run
#   pnpm seed

# 5. Start development server
pnpm start:dev
```

**Default admin:** `admin@nhatro.com` / `Admin@123` — change after first login!

## Detailed Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env if you need different database credentials
```

### 3. Start the Database

This project uses Docker for PostgreSQL:

```bash
docker-compose up -d
```

Verify it's running:

```bash
docker-compose ps
```

> See [DATABASE.md](DATABASE.md) for troubleshooting.

### 4. Set Up Database

```bash
# Option A: migrate + seed in one command
pnpm db:setup

# Option B: run separately (useful when you only need one)
pnpm migration:run   # create/update schema
pnpm seed           # seed admin user
```

The setup script with friendlier output is also available:

```bash
./scripts/setup.sh
```

**Default Admin Credentials:**

- Email: `admin@nhatro.com`
- Password: `Admin@123`
- ⚠️ Change this password after first login!

### 5. Verify Database Setup

After running `pnpm db:setup`, always verify the setup completed correctly:

```bash
./scripts/verify-db.sh
```

Expected output:

```
✅ users table exists
✅ refresh_tokens table exists
✅ audit_logs table exists
✅ migrations table exists
✅ InitialSchema migration recorded
✅ admin user exists
✅ role is admin
✅ isActive is true
✅ emailVerifiedAt is set

✅ All 9 checks passed — database is correctly set up!
```

If any check fails, see [DATABASE.md](DATABASE.md) for troubleshooting.

### 6. Start Development Server

```bash
pnpm start:dev
```

The server will start on `http://localhost:3000`

## Available Scripts

### Development

- `pnpm start:dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm format` - Format code with Prettier

### Database

- `pnpm db:setup` - Migrate + seed in one command
- `pnpm migration:run` - Run pending migrations
- `pnpm migration:revert` - Revert the last migration
- `pnpm migration:generate -- src/database/migrations/Name` - Generate a migration from entity changes
- `pnpm seed` - Seed admin user

### Docker (run manually — not in pnpm scripts)

```bash
docker-compose up -d      # start database
docker-compose down       # stop database
docker-compose logs -f    # view logs
```

## Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript 6.x
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Password Hashing**: bcrypt

## Project Structure

```
src/
├── app.module.ts              # Root module with TypeORM config
├── config/                    # Configuration files
│   ├── database.config.ts     # Database configuration
│   └── jwt.config.ts          # JWT configuration
├── entities/                  # TypeORM entities
│   ├── user.entity.ts         # User model with RBAC
│   ├── refresh-token.entity.ts # Refresh tokens
│   └── audit-log.entity.ts    # Audit logs
├── common/enums/              # Enumerations
└── database/migrations/       # Database migrations
```

## User Roles

- **admin** - Full system access, manage sellers and buyers
- **seller** - Manage their own rental properties
- **buyer** - Browse properties, make inquiries

## Environment Variables

Required variables in `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nhatro

# JWT
JWT_SECRET=your-secret-key
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d

# Application
NODE_ENV=development
PORT=3000
BCRYPT_ROUNDS=10
```

## Documentation

- [DATABASE.md](DATABASE.md) - Database setup and schema documentation
- [.github/copilot-instructions.md](.github/copilot-instructions.md) - Coding standards and conventions

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT access tokens (short-lived)
- ✅ Refresh token rotation
- ✅ Audit logging for auth events
- ✅ Role-based access control
- ✅ Resource ownership validation

## Next Steps

1. Implement authentication module (login, logout, password reset)
2. Create guards for RBAC enforcement
3. Add DTOs for request validation
4. Implement business logic modules (houses, inquiries, etc.)
