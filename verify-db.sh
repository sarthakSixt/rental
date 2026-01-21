#!/bin/bash

# Database Verification Script
# This script helps verify your database setup

echo "🔍 Verifying Database Setup..."
echo ""

# Check if PostgreSQL is running
echo "1. Checking PostgreSQL status..."
if pg_isready -U s324429 > /dev/null 2>&1; then
    echo "   ✅ PostgreSQL is running"
else
    echo "   ❌ PostgreSQL is not running"
    echo "   Start it with: brew services start postgresql (macOS)"
    exit 1
fi

# Check if database exists
echo ""
echo "2. Checking if database exists..."
if psql -U s324429 -lqt | cut -d \| -f 1 | grep -qw carrental_db; then
    echo "   ✅ Database 'carrental_db' exists"
else
    echo "   ❌ Database 'carrental_db' does not exist"
    echo "   Create it with: psql -U s324429 -c 'CREATE DATABASE carrental_db;'"
    exit 1
fi

# Check tables
echo ""
echo "3. Checking tables..."
TABLES=$(psql -U s324429 -d carrental_db -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null)

if [ "$TABLES" -gt 0 ]; then
    echo "   ✅ Found $TABLES table(s)"
    
    # Check for specific tables
    echo ""
    echo "4. Checking specific tables..."
    
    TABLES_TO_CHECK=("users" "categories" "cars" "bookings" "payments" "pricing_plans")
    for table in "${TABLES_TO_CHECK[@]}"; do
        COUNT=$(psql -U s324429 -d carrental_db -t -c "SELECT COUNT(*) FROM $table;" 2>/dev/null | xargs)
        if [ "$?" -eq 0 ]; then
            echo "   ✅ $table: $COUNT rows"
        else
            echo "   ⚠️  $table: not found (will be created on first run)"
        fi
    done
else
    echo "   ⚠️  No tables found (will be created when backend starts)"
fi

echo ""
echo "✅ Database verification complete!"
echo ""
echo "Next steps:"
echo "1. Start backend: ./gradlew bootRun"
echo "2. Start frontend: cd frontend && npm run dev"
echo "3. Open: http://localhost:3000"
