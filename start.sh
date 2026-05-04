#!/bin/bash

set -e

echo "🚀 Setting up and starting Travel Logs..."

# --- Dependency checks ---
command -v php >/dev/null 2>&1 || { echo "❌ PHP is not installed"; exit 1; }
command -v composer >/dev/null 2>&1 || { echo "❌ Composer is not installed"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is not installed"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is not installed"; exit 1; }

# --- Backend setup ---
if [ ! -d "vendor" ]; then
  echo "📦 Installing PHP dependencies..."
  composer install
fi

if [ ! -f ".env" ]; then
  echo "⚙️  Creating .env file..."
  cp .env.example .env
  php artisan key:generate --force
fi

if [ ! -f "database/database.sqlite" ]; then
  echo "🗄️  Creating SQLite database..."
  touch database/database.sqlite
fi

echo "🔄 Running migrations and seeding demo data..."
php artisan migrate:fresh --seed --force

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

php artisan serve --port=8000 &
php artisan queue:work --tries=1 &
(cd react && npm run dev) &

echo ""
echo "✅ App is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo ""
echo "🧠 Tip: Press Ctrl+C to stop all services"
echo ""

wait

