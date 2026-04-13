import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import path from 'path'
import { fileURLToPath } from 'url'

import profileRouter    from './routes/profile.js'
import experienceRouter from './routes/experiences.js'
import skillsRouter     from './routes/skills.js'
import projectsRouter   from './routes/projects.js'
import servicesRouter   from './routes/services.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000
const isProd = process.env.NODE_ENV === 'production'

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }))
app.use(compression())
app.use(cors({
  origin: isProd ? process.env.FRONTEND_URL || true : 'http://localhost:5173',
  methods: ['GET'],
}))
app.use(express.json())

// Logger minimal en dev
if (!isProd) {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`)
    next()
  })
}

// ── API Routes ────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV })
})

app.use('/api/profile',     profileRouter)
app.use('/api/experiences', experienceRouter)
app.use('/api/skills',      skillsRouter)
app.use('/api/projects',    projectsRouter)
app.use('/api/services',    servicesRouter)

// 404 pour les routes /api inconnues
app.use('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route API introuvable' })
})

// ── Serve Svelte build en production ─────────────────────────────────────────
if (isProd) {
  const distPath = path.join(__dirname, '../../frontend/dist')
  app.use(express.static(distPath))
  // SPA fallback — toutes les routes non-API renvoient index.html
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
} else {
  app.get('/', (_req, res) => {
    res.json({ message: 'API Portfolio — frontend sur http://localhost:5173' })
  })
}

// ── Gestionnaire d'erreurs global ─────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err.message)
  res.status(500).json({ error: isProd ? 'Erreur serveur' : err.message })
})

// ── Démarrage ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT} [${isProd ? 'production' : 'développement'}]`)
  if (!isProd) {
    console.log(`   API  → http://localhost:${PORT}/api/health`)
    console.log(`   App  → http://localhost:5173`)
  }
})
