#!/bin/bash

set -e

echo "🚀 Setting up and starting Travel Logs..."

# --- Backend setup ---
if [ ! -d "vendor" ]; then
  echo "📦 Installing PHP dependencies..."
  composer install
fi

if [ ! -f ".env" ]; then
  echo "⚙️  Creating .env file..."
  cp .env.example .env
  php artisan key:generate
fi

if [ ! -f "database/database.sqlite" ]; then
  echo "🗄️  Creating SQLite database..."
  touch database/database.sqlite
fi

echo "🔄 Running migrations..."
php artisan migrate --force

# --- Frontend setup ---
cd react

if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

cd ..

# --- Cleanup on exit ---
cleanup() {
  echo ""
  echo "🛑 Stopping all services..."
  kill 0
}
trap cleanup EXIT INT TERM

# --- Start services ---
echo ""
echo "▶️  Starting services..."

php artisan serve &
php artisan queue:listen --tries=1 &
(cd react && npm run dev) &

echo ""
echo "✅ App is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop everything"
echo ""

wait

