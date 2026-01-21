#!/bin/bash

# Quick Start Script for Car Rental Application
# This script helps you start both backend and frontend

echo "🚗 Car Rental Application - Quick Start"
echo "======================================"
echo ""

# Check if database is ready
echo "📊 Checking database..."
if ./verify-db.sh 2>/dev/null; then
    echo ""
else
    echo "⚠️  Database check failed. Please fix database issues first."
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Start backend
echo "🔧 Starting Backend (Spring Boot)..."
echo "   This will start on http://localhost:8080"
echo "   Press Ctrl+C to stop"
echo ""

# Check if backend is already running
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 8080 is already in use. Backend might already be running."
    echo ""
else
    # Start backend in background
    ./gradlew bootRun > backend.log 2>&1 &
    BACKEND_PID=$!
    echo "   Backend started (PID: $BACKEND_PID)"
    echo "   Logs: tail -f backend.log"
    
    # Wait for backend to start
    echo "   Waiting for backend to start..."
    for i in {1..30}; do
        if curl -s http://localhost:8080/api/categories > /dev/null 2>&1; then
            echo "   ✅ Backend is ready!"
            break
        fi
        sleep 1
    done
    echo ""
fi

# Start frontend
echo "🎨 Starting Frontend (React + Vite)..."
echo "   This will start on http://localhost:3000"
echo ""

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
    echo ""
fi

# Check if frontend is already running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 3000 is already in use. Frontend might already be running."
    echo ""
else
    echo "   Starting frontend..."
    npm run dev
fi

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    exit 0
}

trap cleanup SIGINT SIGTERM
