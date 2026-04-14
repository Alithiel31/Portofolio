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

// Conversion explicite du PORT pour TypeScript et Railway
const PORT = Number(process.env.PORT) || 3000
const isProd = process.env.NODE_ENV === 'production'
const resend = new Resend(process.env.RESEND_API_KEY)

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // Géré par le frontend ou désactivé pour simplifier le déploiement
}))
app.use(compression())

app.use(cors({
  origin: isProd ? process.env.FRONTEND_URL || true : 'http://localhost:5173',
  methods: ['GET', 'POST'],
}))

app.use(express.json())

// ── Healthcheck (Crucial pour Railway : DOIT être avant les autres routes) ────
app.get('/api/health', (_req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV 
  })
})

// ── Mail service ────────────────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body

  try {
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>', 
      to: 'jacques.duchamplecheval@gmail.com',
      subject: `Nouveau message de ${name}`,
      html: `<p><strong>Nom:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`
    })
    res.status(200).json({ success: true })
  } catch (error) {
    console.error("Resend Error:", error)
    res.status(500).json({ error: "Erreur lors de l'envoi" })
  }
})

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/profile',     profileRouter)
app.use('/api/experiences', experienceRouter)
app.use('/api/skills',      skillsRouter)
app.use('/api/projects',    projectsRouter)
app.use('/api/services',    servicesRouter)

// ── Serve Svelte build en production ─────────────────────────────────────────
if (isProd) {
  // On pointe vers le dossier dist du frontend buildé
  const distPath = path.join(__dirname, '../../frontend/dist')
  
  console.log(`[Production] Serving static files from: ${distPath}`)
  
  app.use(express.static(distPath))
  
  app.get('*', (req, res, next) => {
    // Si la route commence par /api mais n'a pas été trouvée ci-dessus
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' })
    }
    // Sinon, on sert le frontend (SPA Fallback)
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

// ── Lancement du serveur ──────────────────────────────────────────────────────
// L'hôte '0.0.0.0' est INDISPENSABLE pour que Railway puisse binder le port
app.listen(PORT, '0.0.0.0', () => {
  console.log('------------------------------------------------------------')
  console.log(`🚀 SERVER IS LIVE!`)
  console.log(`📡 Port: ${PORT}`)
  console.log(`🌍 Mode: ${isProd ? 'PRODUCTION' : 'DEVELOPMENT'}`)
  console.log(`🔗 Healthcheck: http://localhost:${PORT}/api/health`)
  console.log('------------------------------------------------------------')
})