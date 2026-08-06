# ── development : vite dev server avec hot-reload ─────────────────────────────
FROM node:22-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# ── build : vite build → dist/ ────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── production : nginx sert les fichiers statiques ────────────────────────────
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Snippet `include` par nginx.conf dans chaque bloc qui pose ses propres en-têtes.
# Hors de conf.d/ : nginx y auto-inclut tout *.conf au niveau http, ce qui appliquerait
# aussi ces en-têtes globalement et rendrait la configuration ambiguë.
COPY security-headers.conf /etc/nginx/snippets/security-headers.conf
EXPOSE 80