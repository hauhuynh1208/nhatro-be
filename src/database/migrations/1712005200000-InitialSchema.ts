import { MigrationInterface, QueryRunner } from "typeorm";

// Combined migration: merges original InitialSchema + RoleColumnToSmallint.
// Role is stored as smallint from the start (1=admin, 2=seller, 3=buyer).
export class InitialSchema1712005200000 implements MigrationInterface {
  name = "InitialSchema1712005200000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table — role as smallint (1=admin, 2=seller, 3=buyer)
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "role" smallint NOT NULL DEFAULT 3,
        "firstName" character varying,
        "lastName" character varying,
        "phoneNumber" character varying,
        "isActive" boolean NOT NULL DEFAULT true,
        "emailVerifiedAt" TIMESTAMP,
        "passwordResetToken" character varying,
        "passwordResetExpires" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_users_email" ON "users" ("email");
    `);

    // Create refresh_tokens table
    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "token" character varying NOT NULL,
        "userId" uuid NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "isRevoked" boolean NOT NULL DEFAULT false,
        "replacedByToken" character varying,
        "ipAddress" character varying,
        "userAgent" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_refresh_tokens_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_refresh_tokens_userId" ON "refresh_tokens" ("userId");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_refresh_tokens_token" ON "refresh_tokens" ("token");
    `);

    await queryRunner.query(`
      ALTER TABLE "refresh_tokens"
      ADD CONSTRAINT "FK_refresh_tokens_userId"
      FOREIGN KEY ("userId")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION;
    `);

    // Create audit_logs table
    await queryRunner.query(`
      CREATE TYPE "audit_event_type_enum" AS ENUM(
        'login_success',
        'login_failed',
        'logout',
        'password_reset_requested',
        'password_reset_completed',
        'token_refreshed',
        'token_revoked',
        'unauthorized_access',
        'forbidden_access',
        'user_created'
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId" uuid,
        "email" character varying,
        "eventType" "audit_event_type_enum" NOT NULL,
        "ipAddress" character varying,
        "userAgent" character varying,
        "metadata" jsonb,
        "errorMessage" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_audit_logs_userId_createdAt" ON "audit_logs" ("userId", "createdAt");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_audit_logs_eventType_createdAt" ON "audit_logs" ("eventType", "createdAt");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_audit_logs_eventType_createdAt"`);
    await queryRunner.query(`DROP INDEX "IDX_audit_logs_userId_createdAt"`);
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TYPE "audit_event_type_enum"`);

    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_refresh_tokens_userId"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_refresh_tokens_token"`);
    await queryRunner.query(`DROP INDEX "IDX_refresh_tokens_userId"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);

    await queryRunner.query(`DROP INDEX "IDX_users_email"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
