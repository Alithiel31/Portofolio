# Portfolio Fullstack — Svelte 5 · Express · Prisma · PostgreSQL

Portfolio personnel fullstack avec interface bilingue (FR/EN), sections animées en stacking cards, formulaire de contact et déploiement Railway.

---

## Stack

| Couche | Technologie |
|--------|------------|
| Frontend | Svelte 5, Vite, SCSS |
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma |
| Base de données | PostgreSQL 16 |
| Email | Resend |
| Conteneur | Docker + Docker Compose |
| Hébergement | Railway |

---

## Démarrage local

### Prérequis

- Docker + Docker Compose
- Node.js 22+

### 1. Cloner le repo

```bash
git clone <votre-repo>
cd portfolio
```

### 2. Variables d'environnement

```bash
cp backend/.env.example backend/.env
```

Éditer `backend/.env` et renseigner au minimum :

```env
DATABASE_URL="postgresql://portfolio:portfolio_dev@localhost:5432/portfolio"
NODE_ENV="development"
PORT=3000

# Formulaire de contact (optionnel en local)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
CONTACT_EMAIL="votre@email.com"
```

> Sans `RESEND_API_KEY` et `CONTACT_EMAIL`, le formulaire de contact retournera une erreur 503 — le reste du portfolio fonctionne normalement.

### 3. Lancer avec Docker Compose

```bash
npm run dev
# équivalent à : docker compose -f docker-compose.dev.yml up
```

Docker va automatiquement :

1. Démarrer PostgreSQL sur le port `5434`
2. Pousser le schéma Prisma (`db push`)
3. Seeder la BDD avec les données initiales
4. Lancer le backend sur `http://localhost:3001`
5. Lancer le frontend Vite sur `http://localhost:5173`

> **Note Windows** : le backend est exposé sur `3001` (et non `3000`) pour éviter les conflits de port. Le frontend pointe automatiquement dessus via `VITE_API_URL`.

### 4. Prisma Studio (interface BDD visuelle)

```bash
npm run db:studio
# → http://localhost:5555
```

---

## Structure du projet

```
portfolio/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Modèles BDD
│   │   └── seed.ts              # Données initiales (idempotent)
│   ├── src/
│   │   ├── index.ts             # Entry point Express + route contact
│   │   ├── prisma.ts            # Client Prisma singleton
│   │   └── routes/
│   │       ├── profile.ts
│   │       ├── experiences.ts
│   │       ├── skills.ts
│   │       ├── projects.ts
│   │       └── services.ts
│   └── .env.example
├── frontend/
│   └── src/
│       ├── App.svelte            # Stacking cards + navigation
│       ├── main.js
│       └── lib/
│           ├── stores/
│           │   └── api.svelte.js # Fetch store réactif
│           ├── i18n/
│           │   ├── en.js         # Traductions anglais
│           │   ├── fr.js         # Traductions français
│           │   └── t.svelte.js   # Store de langue
│           ├── components/
│           │   ├── HeroSection.svelte
│           │   ├── SkillsSection.svelte
│           │   ├── ExperienceSection.svelte
│           │   ├── ProjectsSection.svelte
│           │   ├── ServicesSection.svelte
│           │   ├── ContactSection.svelte
│           │   ├── NavDots.svelte
│           │   └── LoadingSpinner.svelte
│           └── styles/
│               ├── global.scss
│               └── _section.scss
├── docker/
│   └── Dockerfile.dev
├── Dockerfile                    # Multi-stage build prod
├── docker-compose.dev.yml
├── railway.toml
└── package.json
```

---

## API Endpoints

```
GET  /api/health                       → Statut du serveur
GET  /api/profile                      → Profil + réseaux sociaux
GET  /api/experiences                  → Toutes les expériences
GET  /api/experiences?type=WORK        → Filtrer : emplois
GET  /api/experiences?type=EDUCATION   → Filtrer : formations
GET  /api/skills                       → Catégories + compétences
GET  /api/projects                     → Tous les projets
GET  /api/projects?featured=true       → Projets mis en avant
GET  /api/projects/:id                 → Un projet par ID
GET  /api/services                     → Services proposés
POST /api/contact                      → Envoi du formulaire de contact
```

**Rate limit contact :** 5 requêtes par IP toutes les 15 minutes.

---

## Modifier le contenu

### En local — Prisma Studio

```bash
npm run db:studio
# → http://localhost:5555
```

Interface web pour éditer toutes les tables directement.

### En production — Railway Dashboard

1. Railway → votre projet → service PostgreSQL → onglet **Data**
2. Utiliser l'onglet **Tables** pour éditer les données

### En production — Prisma Studio connecté à la prod

```bash
# Remplacer DATABASE_URL dans backend/.env par l'URL Railway, puis :
npm run db:studio
```

---

## Déploiement Railway

### 1. Initialiser Railway

```bash
npm install -g @railway/cli
railway login
railway init
```

### 2. Ajouter PostgreSQL

Dans le dashboard Railway : **New → Database → PostgreSQL**

Railway injecte automatiquement `DATABASE_URL` dans votre service.

### 3. Variables d'environnement

Dans **Settings → Variables** de votre service, ajouter :

```env
NODE_ENV=production
FRONTEND_URL=https://votre-portfolio.up.railway.app
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=votre@email.com
```

> `DATABASE_URL` est injectée automatiquement par le plugin PostgreSQL, ne pas la redéfinir.

### 4. Déployer

```bash
railway up
```

Ou connecter le repo GitHub pour le déploiement automatique à chaque push sur `main`.

### 5. Seeder la BDD de production

```bash
# Une seule fois après le premier déploiement
railway run npm run db:seed
```

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance tout en local (Docker Compose) |
| `npm run dev:backend` | Backend seul (hors Docker) |
| `npm run dev:frontend` | Frontend seul (hors Docker) |
| `npm run build` | Build production du frontend |
| `npm run db:migrate` | Applique les migrations Prisma |
| `npm run db:seed` | Insère les données initiales |
| `npm run db:studio` | Ouvre Prisma Studio |

---

## Développement — modifier le schéma BDD

```bash
# 1. Modifier backend/prisma/schema.prisma
# 2. Créer une migration
cd backend
npx prisma migrate dev --name nom_de_la_migration
```
