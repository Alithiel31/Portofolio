import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';
import geoip from 'geoip-lite';
import prisma from './prisma.js';
import { getClientIp } from './utils/client-ip.js';
import { asyncHandler } from './utils/async-handler.js';
import { createRateLimiter } from './utils/rate-limit.js';

import profileRouter from './routes/profile.js';
import experienceRouter from './routes/experiences.js';
import skillsRouter from './routes/skills.js';
import projectsRouter from './routes/projects.js';
import servicesRouter from './routes/services.js';

const EU_COUNTRIES = new Set([
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'CH',
  'NO',
  'IS',
  'GB',
  'UA',
  'RS',
  'BA',
  'AL',
  'MK',
  'ME',
  'MD',
  'BY',
]);

function deriveZone(country?: string | null): string {
  if (!country) return 'Autre';
  if (country === 'CA') return 'Canada';
  if (EU_COUNTRIES.has(country)) return 'Europe';
  return 'Autre';
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Chaîne de proxy : Cloudflare → nginx (hôte) → nginx (conteneur) → Express.
// Le nombre de sauts varie selon l'environnement (docker compose local vs prod) ; on fait donc
// confiance à toute la chaîne, l'origine n'étant joignable qu'à travers les reverse proxies.
// L'IP ainsi résolue reste éphémère — voir utils/client-ip.ts.
app.set('trust proxy', true);

const PORT = Number(process.env.PORT) || 3001;
const isProd = process.env.NODE_ENV === 'production';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL;
const STATS_TOKEN = process.env.STATS_TOKEN;

if (!RESEND_API_KEY)
  console.warn('[WARN] RESEND_API_KEY non défini — le formulaire de contact ne fonctionnera pas');
if (!CONTACT_EMAIL)
  console.warn('[WARN] CONTACT_EMAIL non défini — le formulaire de contact ne fonctionnera pas');
if (!STATS_TOKEN) console.warn('[WARN] STATS_TOKEN non défini — /api/stats restera fermé (404)');

// Le constructeur Resend jette si la clé est absente : l'instancier inconditionnellement faisait
// planter le serveur au démarrage, alors que seul le formulaire de contact devrait être dégradé
// (POST /api/contact répond alors 503).
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Formulaire de contact : 5 envois par IP par tranche de 15 minutes.
const checkContactRateLimit = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 5 });

// Tracking : garde-fou anti-spam pour éviter qu'on gonfle la table PageView à la main.
const checkTrackRateLimit = createRateLimiter({ windowMs: 60 * 1000, max: 20 });

/** Comparaison à temps constant, pour ne pas laisser fuiter le secret octet par octet. */
function matchesStatsToken(provided: string | undefined): boolean {
  if (!STATS_TOKEN || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(STATS_TOKEN);
  return a.length === b.length && timingSafeEqual(a, b);
}

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
        connectSrc: ["'self'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
  }),
);
app.use(compression());

app.use(
  cors({
    origin: isProd ? process.env.FRONTEND_URL || false : 'http://localhost:5173',
    methods: ['GET', 'POST'],
  }),
);

app.use(express.json({ limit: '10kb' }));

// ── Geolocation ───────────────────────────────────────────────────────────────
// L'IP sert uniquement à la résolution geoip, en mémoire, le temps de la requête.
app.get('/api/location', (req, res) => {
  const geo = geoip.lookup(getClientIp(req));
  const isCanada = geo?.country === 'CA';
  res.json({ location: isCanada ? 'Montréal, QC' : 'France' });
});

// ── Visitor tracking ─────────────────────────────────────────────────────────
// Seuls le pays et la zone dérivée sont conservés : ni IP, ni ville, ni région.
app.post(
  '/api/track',
  asyncHandler(async (req, res) => {
    if (!checkTrackRateLimit(getClientIp(req))) {
      return res.status(429).json({ ok: false });
    }

    const geo = geoip.lookup(getClientIp(req));
    const page = typeof req.body.page === 'string' ? req.body.page.slice(0, 200) : '/';
    const referer = typeof req.body.referer === 'string' ? req.body.referer.slice(0, 500) : null;

    await prisma.pageView.create({
      data: {
        page,
        country: geo?.country ?? null,
        zone: deriveZone(geo?.country),
        referer,
      },
    });
    res.json({ ok: true });
  }),
);

// Stats privées : sans STATS_TOKEN configuré, la route n'existe pas (404 plutôt qu'ouverte).
app.get(
  '/api/stats',
  asyncHandler(async (req, res) => {
    if (!STATS_TOKEN) return res.status(404).json({ error: 'Not found' });

    const provided = req.get('x-stats-token') ?? undefined;
    if (!matchesStatsToken(provided)) {
      return res.status(401).json({ error: 'Non autorisé' });
    }

    const [total, byZone, byCountry, byPage, recent] = await Promise.all([
      prisma.pageView.count(),
      prisma.pageView.groupBy({
        by: ['zone'],
        _count: true,
        orderBy: { _count: { zone: 'desc' } },
      }),
      prisma.pageView.groupBy({
        by: ['country'],
        _count: true,
        orderBy: { _count: { country: 'desc' } },
        take: 50,
      }),
      prisma.pageView.groupBy({
        by: ['page'],
        _count: true,
        orderBy: { _count: { page: 'desc' } },
        take: 50,
      }),
      prisma.pageView.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { createdAt: true, country: true, zone: true, referer: true },
      }),
    ]);

    res.json({
      total,
      byZone: Object.fromEntries(byZone.map((r) => [r.zone ?? 'Autre', r._count])),
      byCountry: Object.fromEntries(byCountry.map((r) => [r.country ?? '?', r._count])),
      byPage: Object.fromEntries(byPage.map((r) => [r.page, r._count])),
      recent,
    });
  }),
);

// ── Healthcheck ───────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// ── Mail service ──────────────────────────────────────────────────────────────
app.post(
  '/api/contact',
  asyncHandler(async (req, res) => {
    if (!checkContactRateLimit(getClientIp(req) || 'unknown')) {
      return res.status(429).json({ error: 'Trop de requêtes. Réessayez dans 15 minutes.' });
    }

    const { name, email, message } = req.body;
    if (
      !name ||
      !email ||
      !message ||
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof message !== 'string'
    ) {
      return res.status(400).json({ error: 'Champs invalides.' });
    }
    if (name.length > 100 || email.length > 200 || message.length > 2000) {
      return res.status(400).json({ error: 'Données trop longues.' });
    }

    if (!resend || !CONTACT_EMAIL) {
      return res.status(503).json({ error: 'Service de contact non configuré.' });
    }

    try {
      await resend.emails.send({
        from: 'Portfolio <contact@alithiel31.dev>',
        to: CONTACT_EMAIL,
        subject: `Nouveau message de ${escapeHtml(name)}`,
        html: `<p><strong>Nom:</strong> ${escapeHtml(name)}</p>
               <p><strong>Email:</strong> ${escapeHtml(email)}</p>
               <p><strong>Message:</strong> ${escapeHtml(message)}</p>`,
      });
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Resend Error:', error);
      res.status(500).json({ error: "Erreur lors de l'envoi" });
    }
  }),
);

// ── Static screenshots ────────────────────────────────────────────────────────
app.use('/screenshots', express.static(path.join(__dirname, '../public/screenshots')));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/profile', profileRouter);
app.use('/api/experiences', experienceRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/services', servicesRouter);

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// ── Lancement du serveur ──────────────────────────────────────────────────────
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('------------------------------------------------------------');
  console.log(`🚀 SERVER IS LIVE!`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Mode: ${isProd ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`🔗 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log('------------------------------------------------------------');
});

// ── Arrêt gracieux ────────────────────────────────────────────────────────────
// `deploy.yml` recrée les conteneurs à chaque push sur main : on ferme proprement les connexions
// en cours et le pool Prisma plutôt que de se faire SIGKILL au bout du délai de grâce Docker.
let shuttingDown = false;
for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`\n${signal} reçu — arrêt en cours…`);

    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });

    // `server.close()` attend la fermeture de chaque connexion : sans ça, un simple onglet
    // ouvert en keep-alive suffirait à faire traîner l'arrêt jusqu'au délai de grâce Docker.
    server.closeIdleConnections();

    // Filet de sécurité pour les requêtes encore en vol.
    setTimeout(() => {
      server.closeAllConnections();
      process.exit(1);
    }, 10_000).unref();
  });
}
