# Database Setup Guide

## Quick Start with Docker (Recommended) 🐳

### Prerequisites

- Docker and Docker Compose installed

### One-Command Setup

```bash
./docker-setup.sh
```

This automated script handles the complete flow:

1. ✅ Start PostgreSQL Docker container
2. ✅ Wait for database to be ready
3. ✅ Run all migrations
4. ✅ Seed admin user

**Default Admin Credentials:**

- Email: `admin@nhatro.com`
- Password: `Admin@123`
- ⚠️ **Change this password after first login!**

### Docker Commands

```bash
# Start database container
pnpm docker:up

# Stop database container
pnpm docker:down

# View database logs
pnpm docker:logs

# Complete setup (if not using script)
pnpm docker:setup
```

The PostgreSQL database runs on `localhost:5432` with persistent storage via Docker volume.

---

## Alternative Setup: Local PostgreSQL

### Prerequisites

- PostgreSQL 12 or higher installed
- PostgreSQL service running

### 1. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE nhatro;

# Create user (optional, if not using default postgres user)
CREATE USER nhatro_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nhatro TO nhatro_user;

# Exit psql
\q
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the database credentials:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres  # or nhatro_user
DB_PASSWORD=postgres  # your database password
DB_DATABASE=nhatro
```

### 3. Run Migrations & Seed

```bash
# Run all pending migrations
pnpm migration:run

# Seed admin user
pnpm seed
```

## Migration Commands

```bash
# Generate a new migration based on entity changes
pnpm migration:generate -- src/database/migrations/MigrationName

# Run pending migrations
pnpm migration:run

# Revert the last migration
pnpm migration:revert
```

## Database Seeding

### Initial Seed (Admin User)

The seed script creates an initial admin user for system management:

```bash
pnpm seed
```

**Admin Credentials:**

- Email: `admin@nhatro.com`
- Password: `Admin@123`
- Role: `admin`

The seeder is idempotent - it will skip creation if admin already exists.

### Adding Custom Seeds

For additional seed data (sellers, buyers, properties), create new seed files in `src/database/seeds/` and call them manually or add to the seed script.

## Setup Flow

The recommended setup follows this sequence:

```
1. Start Docker Container
   └─> docker-compose up -d
        └─> PostgreSQL running on localhost:5432
             └─> Health check passes

2. Run Migrations
   └─> pnpm migration:run
        └─> Creates: users, refresh_tokens, audit_logs tables
             └─> Schema ready

3. Seed Admin User
   └─> pnpm seed
        └─> Creates: admin@nhatro.com
             └─> Ready to login

4. Your Turn: Seed Additional Data
   └─> Sellers, buyers, properties, etc.
```

This ensures the database structure exists before seeding data.

## Database Schema

### Tables

1. **users** - Store user accounts with roles (admin, seller, buyer)
2. **refresh_tokens** - Manage JWT refresh tokens with rotation
3. **audit_logs** - Track authentication and authorization events

### User Roles

- `admin` - Full system access
- `seller` - Can manage their rental properties
- `buyer` - Can browse and inquire about properties

## Security Features

- Passwords are hashed using bcrypt (10 rounds by default)
- JWT tokens for authentication
- Refresh token rotation for enhanced security
- Audit logging for all auth events
- Role-based access control (RBAC)
- Resource ownership validation

## Development

In development mode, TypeORM synchronize is enabled. This automatically syncs entity changes to the database.

**Important:** Synchronize is disabled in production. Always use migrations for production deployments.

## Troubleshooting

### Docker Issues

**Container won't start:**

```bash
# Check Docker status
docker ps -a

# View container logs
pnpm docker:logs

# Restart container
docker-compose restart

# Clean restart (removes volume - data loss!)
docker-compose down -v
docker-compose up -d
```

**Port already in use:**

```bash
# Find what's using port 5432
lsof -i :5432

# Either stop that service or change DB_PORT in .env
```

### Cannot connect to database

**If using Docker:**

1. Ensure container is running: `docker ps`
2. Check container health: `docker-compose ps`
3. View logs: `pnpm docker:logs`

**If using local PostgreSQL:**

1. Ensure PostgreSQL is running: `pg_isready`
2. Check credentials in `.env`
3. Verify database exists: `psql -l`

### Migration errors

1. Check migration files for syntax errors
2. Ensure database is accessible
3. Check TypeORM configuration in `src/data-source.ts`
4. Verify entity decorators are correct

### Seeding errors

**Admin already exists:**

- This is normal - the seeder skips if admin exists

**Connection refused:**

- Ensure database is running and migrations have been executed

### Permission denied

For local PostgreSQL, grant proper permissions:

```sql
GRANT ALL PRIVILEGES ON DATABASE nhatro TO your_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
```
