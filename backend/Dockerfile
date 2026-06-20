# ── deps : dépendances complètes (dev + prod) ─────────────────────────────────
FROM node:22-alpine AS deps
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── development : tsx --watch, montage de volume ──────────────────────────────
FROM deps AS development
COPY . .
RUN npx prisma generate
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ── build : compile TypeScript → dist/ ────────────────────────────────────────
FROM deps AS build
COPY . .
RUN npx prisma generate && npm run build

# ── production : image minimale ───────────────────────────────────────────────
FROM node:22-alpine AS production
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/prisma ./prisma
RUN npx prisma generate
COPY --from=build /app/dist ./dist
ENV NODE_ENV=production
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]