import express from 'express'
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
app.use(helmet({
  contentSecurityPolicy: false, // Géré par le frontend
}))
app.use(compression())
app.use(cors({
  origin: isProd ? process.env.FRONTEND_URL || true : 'http://localhost:5173',
  methods: ['GET'],
}))
app.use(express.json())

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/profile',     profileRouter)
app.use('/api/experiences', experienceRouter)
app.use('/api/skills',      skillsRouter)
app.use('/api/projects',    projectsRouter)
app.use('/api/services',    servicesRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── Serve Svelte build en production ─────────────────────────────────────────
if (isProd) {
  const distPath = path.join(__dirname, '../../frontend/dist')
  app.use(express.static(distPath))
  // SPA fallback
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} [${isProd ? 'production' : 'development'}]`)
})
