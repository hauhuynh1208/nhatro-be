#!/bin/bash

# Database setup: migrate + seed
# Prerequisite: Docker PostgreSQL container must be running
#   docker-compose up -d

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "🏠 nhatro-be Database Setup"
echo "============================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "📝 Creating .env from .env.example..."
  cp .env.example .env
  echo "✅ .env created — review and update credentials if needed"
  echo ""
fi

# Load environment variables
set -o allexport
source .env
set +o allexport

echo "📦 Configuration:"
echo "   Host:     $DB_HOST:$DB_PORT"
echo "   Database: $DB_DATABASE"
echo "   User:     $DB_USERNAME"
echo ""

# Step 1: Migrate
echo "🔄 Step 1/2: Running migrations..."
pnpm migration:run
echo "✅ Migrations completed"
echo ""

# Step 2: Seed
echo "🌱 Step 2/2: Seeding admin user..."
pnpm seed
echo ""

echo "============================================="
echo "✅ Database setup completed!"
echo "============================================="
echo ""
echo "🔑 Admin Credentials:"
echo "   Email:    admin@nhatro.com"
echo "   Password: Admin@123"
echo "   ⚠️  Change this password after first login!"
echo ""
echo "Next step: pnpm start:dev"
echo ""
