#!/bin/bash

# Verify database setup: tables, migration record, and admin user
# Prerequisite: Docker PostgreSQL container must be running

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# Load environment variables
set -o allexport
source .env
set +o allexport

export PGPASSWORD="$DB_PASSWORD"

PSQL="psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_DATABASE"

PASS=0
FAIL=0

check() {
  local label="$1"
  local result="$2"
  local expected="$3"

  if echo "$result" | grep -q "$expected"; then
    echo "  ✅ $label"
    PASS=$((PASS + 1))
  else
    echo "  ❌ $label"
    echo "     expected to find: $expected"
    echo "     got: $result"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "🔍 nhatro-be Database Verification"
echo "====================================="
echo ""

# ── 1. Tables ────────────────────────────────────────────────────────────────
echo "📋 1. Tables"
TABLES=$($PSQL -c "\dt" 2>&1)
check "users table exists"          "$TABLES" "users"
check "refresh_tokens table exists" "$TABLES" "refresh_tokens"
check "audit_logs table exists"     "$TABLES" "audit_logs"
check "migrations table exists"     "$TABLES" "migrations"
echo ""

# ── 2. Migration record ──────────────────────────────────────────────────────
echo "🔄 2. Migration record"
MIGRATIONS=$($PSQL -c "SELECT name FROM migrations;" 2>&1)
check "InitialSchema migration recorded" "$MIGRATIONS" "InitialSchema1712005200000"
echo ""

# ── 3. Admin user ────────────────────────────────────────────────────────────
echo "👤 3. Admin user"
ADMIN=$($PSQL -c "SELECT email, role, \"isActive\", \"emailVerifiedAt\" FROM users WHERE email = 'admin@nhatro.com';" 2>&1)
check "admin user exists"           "$ADMIN" "admin@nhatro.com"
check "role is 1 (admin)"           "$ADMIN" "| *1 *|"
check "isActive is true"            "$ADMIN" "t"
check "emailVerifiedAt is set"      "$ADMIN" "2026"
echo ""

# ── Summary ──────────────────────────────────────────────────────────────────
echo "====================================="
TOTAL=$((PASS + FAIL))
if [ $FAIL -eq 0 ]; then
  echo "✅ All $TOTAL checks passed — database is correctly set up!"
else
  echo "❌ $FAIL/$TOTAL checks failed — review the output above"
  exit 1
fi
echo ""
