import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import path from 'path'
import { fileURLToPath } from 'url'
import { Resend } from 'resend'

import profileRouter     from './routes/profile.js'
import experienceRouter from './routes/experiences.js'
import skillsRouter     from './routes/skills.js'
import projectsRouter   from './routes/projects.js'
import servicesRouter   from './routes/services.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

const PORT = Number(process.env.PORT) || 3000
const isProd = process.env.NODE_ENV === 'production'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const CONTACT_EMAIL  = process.env.CONTACT_EMAIL

if (!RESEND_API_KEY) console.warn('[WARN] RESEND_API_KEY non défini — le formulaire de contact ne fonctionnera pas')
if (!CONTACT_EMAIL)  console.warn('[WARN] CONTACT_EMAIL non défini — le formulaire de contact ne fonctionnera pas')

const resend = new Resend(RESEND_API_KEY)

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Rate limiter: max 5 requêtes par IP par 15 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
function checkRateLimit(ip: string): boolean {
  const now      = Date.now()
  const windowMs = 15 * 60 * 1000
  const max      = 5
  const entry    = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= max) return false
  entry.count++
  return true
}

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'"],
      styleSrc:    ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://unpkg.com'],
      fontSrc:     ["'self'", 'https://fonts.gstatic.com', 'https://unpkg.com', 'data:'],
      imgSrc:      ["'self'", 'data:', 'https:'],
      connectSrc:  ["'self'"],
      baseUri:     ["'self'"],
      formAction:  ["'self'"],
    },
  },
}))
app.use(compression())

app.use(cors({
  origin: isProd ? (process.env.FRONTEND_URL || false) : 'http://localhost:5173',
  methods: ['GET', 'POST'],
}))

app.use(express.json({ limit: '10kb' }))

// ── Healthcheck ───────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  })
})

// ── Mail service ──────────────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const ip = req.ip ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Trop de requêtes. Réessayez dans 15 minutes.' })
  }

  const { name, email, message } = req.body
  if (
    !name || !email || !message ||
    typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string'
  ) {
    return res.status(400).json({ error: 'Champs invalides.' })
  }
  if (name.length > 100 || email.length > 200 || message.length > 2000) {
    return res.status(400).json({ error: 'Données trop longues.' })
  }

  if (!RESEND_API_KEY || !CONTACT_EMAIL) {
    return res.status(503).json({ error: 'Service de contact non configuré.' })
  }

  try {
    await resend.emails.send({
      from:    'Portfolio <onboarding@resend.dev>',
      to:      CONTACT_EMAIL,
      subject: `Nouveau message de ${escapeHtml(name)}`,
      html: `<p><strong>Nom:</strong> ${escapeHtml(name)}</p>
             <p><strong>Email:</strong> ${escapeHtml(email)}</p>
             <p><strong>Message:</strong> ${escapeHtml(message)}</p>`,
    })
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Resend Error:', error)
    res.status(500).json({ error: "Erreur lors de l'envoi" })
  }
})

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/profile',     profileRouter)
app.use('/api/experiences', experienceRouter)
app.use('/api/skills',      skillsRouter)
app.use('/api/projects',    projectsRouter)
app.use('/api/services',    servicesRouter)

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Erreur interne du serveur' })
})

// ── Serve Svelte build en production ──────────────────────────────────────────
if (isProd) {
  const distPath = path.join(__dirname, '../../frontend/dist')
  console.log(`[Production] Serving static files from: ${distPath}`)
  app.use(express.static(distPath))
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' })
    }
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

// ── Lancement du serveur ──────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log('------------------------------------------------------------')
  console.log(`🚀 SERVER IS LIVE!`)
  console.log(`📡 Port: ${PORT}`)
  console.log(`🌍 Mode: ${isProd ? 'PRODUCTION' : 'DEVELOPMENT'}`)
  console.log(`🔗 Healthcheck: http://localhost:${PORT}/api/health`)
  console.log('------------------------------------------------------------')
})
