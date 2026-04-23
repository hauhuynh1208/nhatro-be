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
- **Package Management**: pnpm

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

Here is the recommended project structure for the NestJS application. When you create new modules, follow this structure to maintain consistency across the codebase.

```
.
├── dist/                   # Compiled JavaScript files
├── node_modules/           # Project dependencies
├── src/                    # Application source code
│   ├── app.controller.ts   # Root controller (optional)
│   ├── app.module.ts       # Root module of the application
│   ├── app.service.ts      # Root service (optional)
│   ├── main.ts             # Application entry point
│   │
│   ├── common/             # Shared components used across modules
│   │   ├── decorators/     # Custom decorators (e.g., @GetUser())
│   │   ├── dto/            # Common Data Transfer Objects
│   │   ├── filters/        # Exception filters (e.g., http-exception.filter.ts)
│   │   ├── guards/         # Authentication/Authorization guards (e.g., JwtAuthGuard)
│   │   ├── interceptors/   # Request/Response interceptors (e.g., logging.interceptor.ts)
│   │   └── pipes/          # Custom validation pipes
│   │
│   ├── config/             # Application configuration
│   │   ├── app/            # Application-specific config (port, environment)
│   │   ├── database/       # Database configuration
│   │   └── index.ts        # Main config loader (e.g., using @nestjs/config)
│   │
│   └── modules/            # Feature-based modules directory
│       │
│       ├── auth/           # Example: Authentication module
│       │   ├── dto/
│       │   │   ├── login.dto.ts
│       │   │   └── register.dto.ts
│       │   ├── strategies/ # Passport.js strategies (e.g., jwt.strategy.ts)
│       │   ├── auth.controller.ts
│       │   ├── auth.module.ts
│       │   └── auth.service.ts
│       │
│       ├── users/          # Example: Users module
│       │   ├── dto/
│       │   │   ├── create-user.dto.ts
│       │   │   └── update-user.dto.ts
│       │   ├── entities/
│       │   │   └── user.entity.ts
│       │   ├── users.controller.ts
│       │   ├── users.module.ts
│       │   └── users.service.ts
│       │
│       └── products/       # Example: Products module
│           ├── dto/
│           │   ├── create-product.dto.ts
│           │   └── update-product.dto.ts
│           ├── entities/
│           │   └── product.entity.ts
│           ├── products.controller.ts
│           ├── products.module.ts
│           └── products.service.ts
│
├── test/                   # End-to-end (e2e) tests
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── .eslintrc.js            # ESLint configuration
├── .gitignore              # Git ignore file
├── .prettierrc             # Prettier code formatter configuration
├── nest-cli.json           # NestJS CLI configuration
├── package.json            # Project dependencies and scripts
├── README.md               # Project documentation
└── tsconfig.json           # TypeScript compiler options
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
