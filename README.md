# 🧑‍💻 Portfolio V2

[![Node.js](https://img.shields.io/badge/Node.js-22+-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Svelte](https://img.shields.io/badge/Svelte-5-orange?logo=svelte)](https://svelte.dev/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue?logo=docker)](https://www.docker.com/)
[![Railway](https://img.shields.io/badge/Déployé-Railway-blueviolet?logo=railway)](https://railway.app/)

Portfolio personnel fullstack avec interface bilingue (FR/EN), sections animées en stacking cards, formulaire de contact et tracking visiteurs par géolocalisation IP.

---

## Fonctionnalités

| Fonctionnalité | Détail |
|---|---|
| 🌐 Bilingue FR/EN | Bascule de langue, contenu localisé depuis la BDD |
| 🃏 Stacking cards | Navigation par sections animées |
| 📬 Formulaire de contact | Envoi par email via Resend (rate limit : 5 req/IP/15 min) |
| 📍 Géolocalisation IP | Affiche Montréal ou France selon l'IP du visiteur |
| 📊 Tracking visiteurs | Enregistrement par page, pays, zone (Canada / Europe / Autre) |
| 📄 CV téléchargeable | PDF servi selon la langue active (FR ou EN) |
| 🔒 Sécurité | Helmet, CORS restreint, sanitisation HTML, rate limiter maison |

---

## Démarrage local (Docker)

C'est la méthode recommandée. Le `docker-compose.yml` lance PostgreSQL, le backend et le frontend en mode dev avec rechargement automatique.

**1. Configurer l'environnement**

```bash
cp backend/.env.example backend/.env
# Renseigner au minimum DATABASE_URL, NODE_ENV, PORT
```

**2. Lancer**

```bash
docker compose up --build
```

Docker va automatiquement :

1. Démarrer PostgreSQL sur le port `5434`
2. Pousser le schéma Prisma (`db push`)
3. Seeder la BDD avec les données initiales (idempotent)
4. Lancer le backend sur `http://localhost:3001`
5. Lancer le frontend Vite sur `http://localhost:5173`

> **Note Windows** : le backend est exposé sur `3001` pour éviter les conflits. Le proxy Vite redirige `/api` vers lui automatiquement.

**3. Prisma Studio (interface BDD visuelle)**

```bash
cd backend && npx prisma studio
# → http://localhost:5555
```

---

## Développement sans Docker

### Backend (port 3001)

```bash
cd backend && npm install
npm run dev        # rechargement auto (tsx --watch)
```

### Frontend (port 5173)

```bash
cd frontend && npm install
npm run dev
```

---

## Variables d'environnement

| Variable | Obligatoire | Défaut | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ | — | URL de connexion PostgreSQL |
| `NODE_ENV` | ❌ | `development` | Environnement (`production` en prod) |
| `PORT` | ❌ | `3000` | Port du backend |
| `FRONTEND_URL` | ❌ (prod) | — | URL du frontend pour le CORS |
| `RESEND_API_KEY` | ❌ | — | Clé Resend — requis pour le formulaire de contact |
| `CONTACT_EMAIL` | ❌ | — | Email de destination des messages de contact |

> Sans `RESEND_API_KEY` et `CONTACT_EMAIL`, le formulaire retourne une erreur 503 — le reste du portfolio fonctionne normalement.

---

## API Endpoints

| Route | Description |
|---|---|
| `GET /api/health` | Statut du serveur |
| `GET /api/profile` | Profil + réseaux sociaux |
| `GET /api/experiences` | Toutes les expériences |
| `GET /api/experiences?type=WORK` | Filtrer : emplois |
| `GET /api/experiences?type=EDUCATION` | Filtrer : formations |
| `GET /api/skills` | Catégories + compétences |
| `GET /api/projects` | Tous les projets |
| `GET /api/projects?featured=true` | Projets mis en avant |
| `GET /api/projects/:id` | Un projet par ID |
| `GET /api/services` | Services proposés |
| `GET /api/location` | Zone géographique du visiteur (Canada / France) |
| `GET /api/stats` | Stats visiteurs agrégées |
| `POST /api/contact` | Envoi du formulaire de contact |
| `POST /api/track` | Enregistrement d'une vue de page |

Tous les endpoints acceptent un paramètre `?lang=fr` ou `?lang=en` pour la localisation du contenu.

---

## Déploiement Railway

### 1. Initialiser Railway

```bash
npm install -g @railway/cli
railway login && railway init
```

### 2. Ajouter PostgreSQL

Dans le dashboard Railway : **New → Database → PostgreSQL**
Railway injecte automatiquement `DATABASE_URL` dans le service.

### 3. Variables d'environnement

Dans **Settings → Variables** du service backend :

```env
NODE_ENV=production
FRONTEND_URL=https://votre-portfolio.up.railway.app
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=votre@email.com
```

### 4. Déployer

```bash
railway up
```

Ou connecter le repo GitHub pour un déploiement automatique à chaque push sur `main`.

### 5. Seeder la BDD (première fois)

```bash
railway run npm run db:seed
```

---

## Structure

```
portfolio/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile                  # Multi-stage : dev · prod
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma           # Modèles BDD
│   │   ├── seed.ts                 # Données initiales (idempotent)
│   │   └── migrate-prod.ts         # Migration production
│   └── src/
│       ├── index.ts                # Point d'entrée Express
│       ├── prisma.ts               # Client Prisma singleton
│       └── routes/
│           ├── profile.ts
│           ├── experiences.ts
│           ├── skills.ts
│           ├── projects.ts
│           └── services.ts
└── frontend/
    ├── Dockerfile                  # Multi-stage : dev · prod (nginx)
    ├── index.html
    └── src/
        ├── App.svelte              # Stacking cards + navigation
        ├── main.js
        └── lib/
            ├── stores/
            │   └── api.svelte.js   # Fetch store réactif
            ├── i18n/
            │   ├── en.js
            │   ├── fr.js
            │   └── t.svelte.js     # Store de langue
            ├── components/
            │   ├── HeroSection.svelte
            │   ├── SkillsSection.svelte
            │   ├── ExperienceSection.svelte
            │   ├── ProjectsSection.svelte
            │   ├── ServicesSection.svelte
            │   ├── ContactSection.svelte
            │   ├── NavDots.svelte
            │   └── LoadingSpinner.svelte
            └── styles/
                ├── global.scss
                └── _section.scss
```

---

## Modifier le contenu

**En local** — via Prisma Studio :
```bash
cd backend && npx prisma studio
```

**En production** — via Railway Dashboard → service PostgreSQL → onglet **Data**, ou en pointant `DATABASE_URL` vers la prod et en lançant Prisma Studio localement.

---

## Stack

| Couche | Technologie |
|---|---|
| Frontend | Svelte 5 · Vite · SCSS |
| Backend | Express · Node.js 22+ · TypeScript 5.6 |
| ORM | Prisma 5 |
| Base de données | PostgreSQL 16 |
| Email | Resend |
| Géolocalisation | geoip-lite |
| Infra | Docker · Nginx (prod frontend) |
| Hébergement | Railway |

---

## License

MIT
