# Copilot Instructions for nhatro-be

## Project Overview

This is the backend service for the nhatro (rental housing) application, built with NestJS and TypeScript.

## Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript 6.x
- **Runtime**: Node.js
- **Database**: PostgreSQL with TypeORM (Docker)
- **Authentication**: JWT with Passport
- **Password Hashing**: bcrypt
- **Architecture**: Modular NestJS application

## Quick Setup Flow

1. `docker-compose up -d` — start PostgreSQL container (Docker, manual)
2. `pnpm migration:run` — create schema
3. `pnpm seed` — seed admin user

Combined: `pnpm db:setup` (migrate + seed) or `./scripts/setup.sh` for coloured output.

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Prefer interfaces over type aliases for object shapes
- Use explicit return types for all functions
- Avoid `any` type - use `unknown` or proper typing

### NestJS Conventions

- Follow NestJS modular architecture patterns
- Use decorators appropriately (`@Controller`, `@Injectable`, `@Module`, etc.)
- Organize code by feature modules
- Keep controllers thin - move business logic to services
- Use dependency injection for all service dependencies

### File Structure

- Controllers: Handle HTTP requests/responses only
- Services: Contain business logic
- DTOs: Use for request/response validation
- Entities: Database models
- Modules: Group related functionality

### Naming Conventions

- Files: Use kebab-case (e.g., `user.service.ts`, `auth.controller.ts`)
- Classes: Use PascalCase (e.g., `UserService`, `AuthController`)
- Methods/Variables: Use camelCase
- Constants: Use UPPER_SNAKE_CASE

## Development Commands

### Server

- `pnpm start:dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm format` - Format code with Prettier

### Docker (run manually — not in pnpm scripts)

```bash
docker-compose up -d    # start database
docker-compose down     # stop database
docker-compose logs -f  # view logs
```

### Database

- `pnpm db:setup` - Migrate + seed in one command
- `pnpm migration:run` - Run pending migrations
- `pnpm migration:revert` - Revert last migration
- `pnpm migration:generate -- src/database/migrations/Name` - Generate migration
- `pnpm seed` - Seed admin user

## Best Practices

- Always validate incoming data with DTOs
- Use proper HTTP status codes
- Implement proper error handling with NestJS exception filters
- Write clean, self-documenting code
- Keep functions small and focused
- Follow SOLID principles
- Never commit `.env` file - use `.env.example` for templates
- Always use migrations for database changes in production
- Hash passwords with bcrypt before storing
- Log authentication events to audit_log table
- Implement proper RBAC checks (role + ownership)
- Use refresh token rotation for enhanced security

## Project Structure

```
src/
├── app.module.ts              # Root module with TypeORM config
├── app.controller.ts          # Root controller
├── app.service.ts             # Root service
├── main.ts                    # Application entry point
├── config/                    # Configuration files
│   ├── database.config.ts     # TypeORM configuration
│   └── jwt.config.ts          # JWT configuration
├── entities/                  # TypeORM entities
│   ├── user.entity.ts         # User with RBAC (admin/seller/buyer)
│   ├── refresh-token.entity.ts # JWT refresh tokens
│   └── audit-log.entity.ts    # Authentication audit logs
├── common/                    # Shared code
│   └── enums/                 # Enums
│       ├── user-role.enum.ts  # User roles
│       └── audit-event-type.enum.ts # Audit event types
├── database/                  # Database related
│   ├── migrations/            # TypeORM migrations
│   └── seeds/                 # Database seeders
└── data-source.ts             # TypeORM DataSource for CLI
```

## When Adding New Features

1. Create a new module for the feature
2. Define DTOs for validation
3. Create service for business logic
4. Create controller for HTTP endpoints
5. Register module in app.module.ts
6. Add Swagger decorators to all controllers, DTOs, and endpoints (see [Swagger Documentation](#swagger-documentation))

## Code Review Checklist

- [ ] Proper TypeScript typing
- [ ] Error handling implemented
- [ ] Input validation with DTOs
- [ ] Follow NestJS conventions
- [ ] Code formatted with Prettier
- [ ] Database entities use proper decorators
- [ ] Migrations created for schema changes
- [ ] Authentication/authorization properly implemented
- [ ] Audit logs for sensitive operations
- [ ] Environment variables used for configuration
- [ ] No hardcoded secrets or credentials
- [ ] Swagger decorators added/updated for all new or modified endpoints, DTOs, and controllers

## Swagger Documentation

Every API endpoint **must** have complete Swagger documentation. This applies when creating new endpoints and when modifying existing ones.

### Required decorators

**Controllers:**

- `@ApiTags('tag-name')` — group endpoints in Swagger UI
- `@ApiBearerAuth()` — on controllers/endpoints that require JWT auth

**Endpoints:**

- `@ApiOperation({ summary: '...' })` — short description of what the endpoint does
- `@ApiResponse({ status: 200, description: '...', type: ResponseDto })` — document each possible response code
- `@ApiResponse({ status: 400, description: 'Bad Request' })` — include error responses
- `@ApiResponse({ status: 401, description: 'Unauthorized' })` — on protected endpoints

**DTOs:**

- `@ApiProperty({ description: '...', example: '...' })` — on every property of request/response DTOs
- `@ApiPropertyOptional(...)` — for optional properties

### Example

```typescript
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  create(@Body() dto: CreateUserDto): Promise<UserResponseDto> { ... }
}
```

```typescript
export class CreateUserDto {
  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
  })
  email: string;

  @ApiProperty({ description: "Password (min 8 chars)", example: "Secret@123" })
  password: string;
}
```

## Database & Authentication

### Database Setup

- **Docker Setup**: Run `./docker-setup.sh` for complete automated setup
- See `DATABASE.md` for detailed instructions
- PostgreSQL 12+ required
- TypeORM for database operations
- Migrations in `src/database/migrations/`
- Seeds in `src/database/seeds/`

### Default Admin User

- Email: `admin@nhatro.com`
- Password: `Admin@123`
- Role: `admin`
- ⚠️ Change password after first login

### User Roles (RBAC)

1. **admin** - Full system access, manage sellers and buyers
2. **seller** - Manage their own rental properties
3. **buyer** - Browse properties, make inquiries

### Authentication Flow

- **Login**: POST `/auth/login` → returns access token (JWT) + refresh token
- **Refresh**: POST `/auth/refresh` → rotate refresh token, return new access token
- **Logout**: POST `/auth/logout` → revoke refresh token
- **Password Reset**: POST `/auth/forgot-password` + POST `/auth/reset-password`

### Security Requirements

- Passwords hashed with bcrypt (10 rounds minimum)
- JWT access tokens: short-lived (15 minutes)
- Refresh tokens: longer-lived (7 days), single-use, rotation-based
- All auth events logged to `audit_logs` table
- Protected endpoints return 401 (unauthenticated) or 403 (unauthorized)
- Implement both role checks and resource ownership validation

### Entities

- `User` - email, password (hashed), role, profile info
- `RefreshToken` - token, userId, expiry, revocation status
- `AuditLog` - userId, eventType, IP, user agent, metadata

## Environment Variables

Required in `.env`:

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `JWT_SECRET`, `JWT_ACCESS_TOKEN_EXPIRATION`, `JWT_REFRESH_TOKEN_EXPIRATION`
- `NODE_ENV`, `PORT`, `BCRYPT_ROUNDS`
