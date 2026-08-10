# 🧑‍💻 Portfolio V2

[![Node.js](https://img.shields.io/badge/Node.js-22+-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Svelte](https://img.shields.io/badge/Svelte-5-orange?logo=svelte)](https://svelte.dev/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue?logo=docker)](https://www.docker.com/)
[![Nginx](https://img.shields.io/badge/Reverse%20proxy-Nginx-009639?logo=nginx)](https://nginx.org/)

Portfolio personnel fullstack avec interface bilingue (FR/EN), sections animées en stacking cards, formulaire de contact et statistiques de visite par zone géographique.

---

## Fonctionnalités

| Fonctionnalité | Détail |
|---|---|
| 🌐 Bilingue FR/EN | Bascule de langue, contenu localisé depuis la BDD |
| 🃏 Stacking cards | Navigation par sections animées |
| 📬 Formulaire de contact | Envoi par email via Resend (rate limit : 5 req/IP/15 min) |
| 📍 Géolocalisation | Affiche Montréal ou France selon la zone du visiteur |
| 📊 Statistiques de visite | Enregistrement par page, pays et zone (Canada / Europe / Autre) |
| 📄 CV téléchargeable | PDF servi selon la langue active (FR ou EN) |
| ⚖️ Pages légales | Mentions légales, politique de confidentialité et CGU, bilingues, sur de vraies URLs |
| 🔒 Sécurité | En-têtes CSP/HSTS via nginx, CORS restreint, sanitisation HTML, rate limiter à clé hashée |

### Données visiteurs — ce qui est réellement conservé

L'adresse IP **n'est jamais stockée**. Elle est résolue le temps d'une requête, en mémoire, pour
en dériver un pays via `geoip-lite`, puis abandonnée : elle n'apparaît ni en base ni dans les logs.
Le rate limiter lui-même n'indexe qu'un hash SHA-256 salé.

La table `PageView` ne contient que `page`, `country`, `zone`, `referer` et `createdAt` — pas de
colonne IP, et volontairement ni ville ni région, trop identifiantes pour l'usage visé. Le referer
est en outre réduit à son seul domaine d'origine : le chemin et les paramètres de l'URL référente
peuvent porter des identifiants (recherche, campagne, jeton de partage) sans rien apporter à une
statistique de provenance.

Ces lignes sont **purgées automatiquement au-delà de 25 mois** (`backend/src/utils/retention.ts`,
lancé au démarrage puis une fois par jour). C'est ce qui permet de rester dans la dispense de
consentement applicable à la mesure d'audience, et donc de se passer de bandeau. Un visiteur peut
malgré tout s'y opposer depuis la politique de confidentialité : la clé `analytics-opt-out` du
stockage local coupe l'appel à `/api/track`.

Aucune ressource n'est chargée depuis Google : la police Nunito est servie depuis
`frontend/public/fonts/`, au même titre que Boxicons. La CSP ne comporte donc plus aucune origine
`fonts.googleapis.com` ni `fonts.gstatic.com`.

### Pages légales

Trois documents, rédigés en FR et EN dans `frontend/src/lib/legal/`, rendus par un composant
générique et servis à `/mentions-legales`, `/confidentialite` et `/cgu`. Le routage est assuré par
un store minimal (`frontend/src/lib/stores/route.svelte.js`) — le fallback SPA de `nginx.conf`
rend les accès directs à ces URLs fonctionnels sans configuration supplémentaire.

Le contenu décrit les traitements tels qu'ils sont réellement implémentés ; toute modification du
formulaire de contact, du tracker ou des ressources tierces doit s'y répercuter.

---

## Démarrage local (Docker)

Le `docker-compose.yml` build les images **de production** : PostgreSQL, le backend compilé, et le
frontend servi par nginx. C'est la façon la plus fidèle de reproduire la prod ; pour du
développement au quotidien avec rechargement automatique, voir la section suivante.

**1. Configurer l'environnement**

```bash
cp backend/.env.example backend/.env
```

Le fichier d'exemple est fonctionnel tel quel — aucune édition n'est nécessaire pour démarrer.
Renseigner `RESEND_API_KEY` / `CONTACT_EMAIL` uniquement pour activer le formulaire de contact.

**2. Lancer**

```bash
docker compose up --build
```

Docker va :

1. Démarrer PostgreSQL (non exposé sur l'hôte, joignable par les autres services)
2. Appliquer les migrations Prisma (`prisma migrate deploy`) au démarrage du backend
3. Lancer le backend sur le port `3001` du réseau interne, avec healthcheck sur `/api/health`
4. Lancer nginx une fois le backend sain → **http://localhost:8080**

Le seed n'est pas automatique. Pour peupler la base :

```bash
docker compose exec backend npx prisma db seed
```

**3. Prisma Studio (interface BDD visuelle)**

```bash
cd backend && npx prisma studio
# → http://localhost:5555
```

> Prisma Studio tourne sur l'hôte : le `DATABASE_URL` doit alors pointer sur `localhost`, pas sur
> `postgres`. Voir la variante commentée dans `.env.example`.

---

## Développement sans Docker

Nécessite un PostgreSQL joignable et un `DATABASE_URL` pointant dessus.

### Backend (port 3001)

```bash
cd backend && npm install
npx prisma migrate deploy && npx prisma db seed
npm run dev        # rechargement auto (tsx --watch)
```

### Frontend (port 5173)

```bash
cd frontend && npm install
npm run dev        # le proxy Vite redirige /api vers http://localhost:3001
```

### Qualité

```bash
npm run lint       # ESLint (dans backend/ comme dans frontend/)
npm run format     # Prettier
npm test           # Vitest (dans backend/ comme dans frontend/)
npm run check      # svelte-check — frontend uniquement
```

Ces commandes tournent aussi en CI (`.github/workflows/ci.yml`), avec en plus
`prisma validate`, le build TypeScript et un build des images Docker de production.

---

## Variables d'environnement

Toutes ces variables vivent dans `backend/.env` (voir `backend/.env.example`, fonctionnel tel quel).
`docker-compose.yml` alimente **aussi** le service PostgreSQL depuis ce fichier.

| Variable | Obligatoire | Défaut | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ | — | URL de connexion PostgreSQL |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | ✅ (Docker) | — | Identifiants du conteneur PostgreSQL — doivent correspondre à `DATABASE_URL` |
| `NODE_ENV` | ❌ | `development` | Environnement (`production` en prod) |
| `PORT` | ❌ | `3001` | Port du backend — attendu tel quel par nginx et par le proxy Vite |
| `FRONTEND_URL` | ❌ (prod) | — | URL du frontend pour le CORS |
| `RESEND_API_KEY` | ❌ | — | Clé Resend — requis pour le formulaire de contact |
| `CONTACT_EMAIL` | ❌ | — | Email de destination des messages de contact |
| `STATS_TOKEN` | ❌ | — | Secret de lecture de `/api/stats`. Non défini ⇒ la route répond 404 |
| `RATE_LIMIT_SALT` | ❌ | aléatoire | Sel du hachage des clés du rate limiter |

Côté frontend, `VITE_API_URL` (voir `frontend/.env.example`) n'est utile que si l'API vit sur une
autre origine ; en dev comme en prod, le proxy s'en charge.

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
| `GET /api/stats` | Stats agrégées — **privé**, requiert l'en-tête `X-Stats-Token` |
| `POST /api/contact` | Envoi du formulaire de contact (5 req/IP/15 min) |
| `POST /api/track` | Enregistrement d'une vue de page (20 req/IP/min) |

Tous les endpoints acceptent un paramètre `?locale=fr` ou `?locale=en` pour la localisation du contenu.

Lecture des statistiques :

```bash
curl -H "X-Stats-Token: $STATS_TOKEN" https://votre-domaine.dev/api/stats
```

---

## Déploiement (Raspberry Pi)

L'hébergement est auto-géré : un Raspberry Pi fait tourner la stack Docker Compose, derrière
Cloudflare pour le TLS et le CDN.

### Chaîne de requête

```
Visiteur → Cloudflare → nginx (hôte) → nginx (conteneur frontend) ─┬─ /            → SPA statique
                                                                   ├─ /api/        → backend:3001
                                                                   └─ /screenshots/→ backend:3001
```

Les proxies propagent `X-Forwarded-For` et `CF-Connecting-IP` ; sans eux, le backend ne verrait
que l'IP interne du conteneur nginx (géolocalisation inopérante, rate limiter partagé par tout le
trafic).

> ⚠️ **Pré-requis pare-feu** : `CF-Connecting-IP` n'est fiable que si l'origine n'est joignable
> qu'à travers Cloudflare. Le pare-feu de l'hôte doit donc restreindre le trafic entrant sur les
> ports 80/443 aux plages IP publiées par Cloudflare (https://www.cloudflare.com/ips/). Sans
> cette restriction, un client atteignant le Pi directement peut forger cet en-tête et
> contourner le rate limiter de `/api/contact` et `/api/track`.

### Déploiement automatique

`.github/workflows/deploy.yml` tourne sur un runner self-hosted taggé `[self-hosted, rpi]`.
Il se déclenche une fois le workflow **CI** terminé avec succès sur `main` (`workflow_run`), ou
manuellement (`workflow_dispatch`) — pas directement sur chaque push : un push dont la CI échoue
ne déploie donc pas. Sur le Pi, il fait :

```bash
git fetch origin main && git reset --hard origin/main
docker compose up --build -d
```

Puis vérifie la santé du déploiement : poll de `/api/health` et `/` pendant jusqu'à 2 min 30. En
cas d'échec, le job dump les logs des conteneurs et échoue (sans rollback automatique). Une fois
la vérification passée :

```bash
docker image prune -f
```

### Mise en place initiale sur le Pi

```bash
git clone <repo> ~/Portofolio && cd ~/Portofolio
cp backend/.env.example backend/.env
```

Puis, dans `backend/.env` : `NODE_ENV=production`, `FRONTEND_URL=https://votre-domaine.dev`,
des identifiants PostgreSQL propres, `RESEND_API_KEY`, `CONTACT_EMAIL`, et de préférence
`STATS_TOKEN` + `RATE_LIMIT_SALT` (`openssl rand -base64 32`).

```bash
docker compose up --build -d
docker compose exec backend npx prisma db seed   # première fois seulement
```

Les migrations Prisma s'appliquent automatiquement au démarrage du backend
(`prisma migrate deploy`, dans le `CMD` du Dockerfile).

---

## Structure

```
portfolio/
├── docker-compose.yml
├── LICENSE
├── .github/
│   ├── dependabot.yml
│   └── workflows/                  # ci · codeql · deploy (RPi)
├── backend/
│   ├── Dockerfile                  # Multi-stage : deps · dev · build · prod
│   ├── .env.example
│   ├── public/screenshots/         # Images des projets, servies sur /screenshots
│   ├── prisma/
│   │   ├── schema.prisma           # Modèles BDD
│   │   ├── migrations/             # Source de vérité du schéma (migrate deploy)
│   │   ├── seed.ts                 # Données initiales (idempotent)
│   │   └── add-projects.ts         # Script d'ajout ponctuel
│   └── src/
│       ├── app.ts                  # Express : middlewares, location, track, stats, contact
│       ├── index.ts                # Bootstrap serveur (listen, arrêt gracieux)
│       ├── prisma.ts               # Client Prisma singleton
│       ├── utils/
│       │   ├── client-ip.ts        # Résolution d'IP éphémère (jamais persistée)
│       │   ├── rate-limit.ts       # Rate limiter en mémoire, clés hashées
│       │   ├── async-handler.ts    # Rebranche les rejets async sur next()
│       │   └── localize.ts         # Sélection des champs En/Fr
│       └── routes/                 # profile · experiences · skills · projects · services
└── frontend/
    ├── Dockerfile                  # Multi-stage : dev · build · prod (nginx)
    ├── nginx.conf                  # SPA, cache, proxys /api et /screenshots
    ├── security-headers.conf       # CSP, HSTS & co — inclus par nginx.conf
    ├── .env.example
    ├── index.html
    ├── public/                     # CV PDF, boxicons, icônes
    └── src/
        ├── App.svelte              # Stacking cards + navigation
        ├── main.js
        └── lib/
            ├── stores/
            │   ├── api.svelte.js   # Fetch store réactif
            │   ├── locale.svelte.js # Langue courante (localStorage + navigator)
            │   ├── route.svelte.js # Routeur minimal pour les pages légales
            │   └── analytics.svelte.js # Opt-out `/api/track` (clé `analytics-opt-out`)
            ├── i18n/
            │   ├── en.js
            │   ├── fr.js
            │   └── t.svelte.js     # Fonction de traduction réactive
            ├── legal/
            │   ├── en.js
            │   ├── fr.js
            │   └── index.svelte.js # Sélection du document légal actif
            ├── components/
            │   ├── HeroSection.svelte
            │   ├── SkillsSection.svelte
            │   ├── ExperienceSection.svelte
            │   ├── ProjectsSection.svelte
            │   ├── ServicesSection.svelte
            │   ├── ContactSection.svelte
            │   ├── NavDots.svelte
            │   ├── LoadingSpinner.svelte
            │   ├── LegalPage.svelte # Rendu générique des pages légales
            │   └── SiteFooter.svelte
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

**En production** — en pointant `DATABASE_URL` vers la base du Pi (via un tunnel SSH) et en lançant
Prisma Studio localement, ou directement sur le Pi :

```bash
docker compose exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
```

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
| CI/CD | GitHub Actions · CodeQL · Dependabot |
| Hébergement | Raspberry Pi auto-hébergé, derrière Cloudflare |

---

## License

MIT — voir [LICENSE](./LICENSE).
