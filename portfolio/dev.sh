#!/bin/sh
# Lance backend et frontend en parallèle sans Docker
# Usage : ./dev.sh
# Pré-requis : PostgreSQL local actif, DATABASE_URL dans backend/.env

if [ ! -f backend/.env ]; then
  echo "⚠️  backend/.env manquant — copie de .env.example"
  cp backend/.env.example backend/.env
fi

# Install deps si besoin
[ ! -d backend/node_modules ]  && (cd backend  && npm install)
[ ! -d frontend/node_modules ] && (cd frontend && npm install)

# Prisma
(cd backend && npx prisma generate && npx prisma migrate dev --name init 2>/dev/null; npx prisma db seed 2>/dev/null) &

# Backend
(cd backend && npm run dev) &
BACKEND_PID=$!

# Frontend
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "✅ Démarrage..."
echo "   Backend  → http://localhost:3000/api/health"
echo "   Frontend → http://localhost:5173"
echo ""
echo "Ctrl+C pour tout arrêter"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
