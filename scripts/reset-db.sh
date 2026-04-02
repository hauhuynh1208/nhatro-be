#!/bin/bash

# Reset database: drops all application tables and the migrations tracking table.
# Prerequisite: Docker PostgreSQL container must be running.
#   docker-compose up -d

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

set -o allexport
source .env
set +o allexport

export PGPASSWORD="$DB_PASSWORD"

echo ""
echo "🗑️  nhatro-be Database Reset"
echo "============================="
echo "   Host:     $DB_HOST:$DB_PORT"
echo "   Database: $DB_DATABASE"
echo ""
echo "⚠️  This will DROP ALL TABLES and ALL DATA!"
read -p "   Continue? (y/N): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted."
  exit 0
fi

echo ""
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_DATABASE" <<-SQL
  DROP TABLE IF EXISTS "audit_logs"     CASCADE;
  DROP TABLE IF EXISTS "refresh_tokens" CASCADE;
  DROP TABLE IF EXISTS "users"          CASCADE;
  DROP TABLE IF EXISTS "migrations"     CASCADE;
  DROP TYPE  IF EXISTS "audit_event_type_enum" CASCADE;
  DROP TYPE  IF EXISTS "user_role_enum"        CASCADE;
SQL

echo "✅ All tables dropped successfully"
echo ""
