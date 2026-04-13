# ── Stage 1 : Build frontend ──────────────────────────────────────────────────
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ── Stage 2 : Build backend ───────────────────────────────────────────────────
FROM node:22-alpine AS backend-builder

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./

# Générer le client Prisma
RUN npx prisma generate

# Compiler TypeScript
RUN npm run build

# ── Stage 3 : Image de production ─────────────────────────────────────────────
FROM node:22-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

# Copier le build backend
COPY --from=backend-builder /app/backend/dist         ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/package.json ./backend/package.json
COPY --from=backend-builder /app/backend/prisma       ./backend/prisma

# Copier le build frontend (servi par Express)
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

EXPOSE 3000

# Lancer les migrations puis le serveur
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
