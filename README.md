# Portfolio Fullstack — Svelte + Express + Prisma + PostgreSQL

## Stack

| Couche | Technologie |
|--------|------------|
| Frontend | Svelte 5, Vite, SCSS |
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma |
| Base de données | PostgreSQL |
| Conteneur | Docker + Docker Compose |
| Hébergement | Railway |

---

## Démarrage local

### Prérequis
- Docker + Docker Compose
- Node.js 22+

### 1. Cloner et installer

```bash
git clone <votre-repo>
cd portfolio
```

### 2. Variables d'environnement

```bash
cp backend/.env.example backend/.env
```

### 3. Lancer avec Docker Compose

```bash
npm run dev
# ou directement :
docker compose -f docker-compose.dev.yml up
```

Le compose va :
1. Démarrer PostgreSQL
2. Exécuter les migrations Prisma
3. Seeder la BDD avec des données de démo
4. Lancer le backend sur http://localhost:3000
5. Lancer le frontend Vite sur http://localhost:5173

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
│   │   ├── schema.prisma      # Modèles BDD
│   │   └── seed.ts            # Données initiales
│   └── src/
│       ├── index.ts           # Entry point Express
│       ├── prisma.ts          # Client Prisma singleton
│       └── routes/
│           ├── profile.ts
│           ├── experiences.ts
│           ├── skills.ts
│           ├── projects.ts
│           └── services.ts
├── frontend/
│   └── src/
│       ├── App.svelte         # Stacking cards + routing
│       ├── main.js
│       ├── lib/
│       │   ├── stores/
│       │   │   └── api.svelte.js   # Fetch store réactif
│       │   └── components/
│       │       ├── HeroSection.svelte
│       │       ├── SkillsSection.svelte
│       │       ├── ExperienceSection.svelte
│       │       ├── ProjectsSection.svelte
│       │       ├── ServicesSection.svelte
│       │       ├── ContactSection.svelte
│       │       ├── NavDots.svelte
│       │       └── LoadingSpinner.svelte
│       └── styles/
│           ├── global.scss
│           └── _section.scss
├── docker/
│   └── Dockerfile.dev
├── Dockerfile                 # Multi-stage prod
├── docker-compose.dev.yml
├── railway.toml
└── package.json
```

---

## API Endpoints

```
GET /api/health          → Status serveur
GET /api/profile         → Profil + réseaux sociaux
GET /api/experiences     → Toutes les expériences
GET /api/experiences?type=WORK      → Filtrer par type
GET /api/experiences?type=EDUCATION
GET /api/skills          → Catégories + compétences
GET /api/projects        → Tous les projets
GET /api/projects?featured=true    → Projets mis en avant
GET /api/projects/:id    → Un projet
GET /api/services        → Services proposés
```

---

## Modifier le contenu

### Via Prisma Studio (recommandé en local)

```bash
npm run db:studio
```

Ouvre une interface web sur http://localhost:5555 pour éditer toutes les tables.

### Via Railway Dashboard (en production)

1. Railway → votre projet → onglet **Data** (PostgreSQL plugin)
2. Utiliser l'onglet **Tables** pour éditer directement

### Via Prisma Studio connecté à la prod

```bash
# Dans backend/.env, mettre la DATABASE_URL de Railway
npx prisma studio
```

---

## Déploiement Railway

### 1. Créer le projet Railway

```bash
# Installer Railway CLI
npm install -g @railway/cli

railway login
railway init
```

### 2. Ajouter PostgreSQL

Dans le dashboard Railway :
- **New** → **Database** → **PostgreSQL**
- Railway injecte automatiquement `DATABASE_URL` dans votre service

### 3. Déployer

```bash
railway up
```

Ou connectez votre repo GitHub pour le déploiement automatique à chaque push.

### 4. Variables d'environnement Railway

Dans **Settings → Variables** de votre service, ajouter :

```
NODE_ENV=production
```

`DATABASE_URL` est injectée automatiquement par le plugin PostgreSQL.

### 5. Seeder la BDD de production

```bash
# Une seule fois après le premier déploiement
railway run npm run db:seed
```

---

## Ajouter un projet en production

```sql
-- Via Railway dashboard ou Prisma Studio connecté à la prod
INSERT INTO "Project" (title, description, "techStack", "imageUrl", "demoUrl", "githubUrl", featured, "order")
VALUES ('Mon nouveau projet', 'Description...', 'Svelte, Node.js', 'https://...', 'https://...', null, true, 4);
```

---

## Développement — modifier les modèles BDD

```bash
# Modifier backend/prisma/schema.prisma puis :
cd backend
npx prisma migrate dev --name nom_de_la_migration
```
