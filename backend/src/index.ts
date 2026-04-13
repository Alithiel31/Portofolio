import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import path from 'path'
import { fileURLToPath } from 'url'
import { Resend } from 'resend';

import profileRouter    from './routes/profile.js'
import experienceRouter from './routes/experiences.js'
import skillsRouter     from './routes/skills.js'
import projectsRouter   from './routes/projects.js'
import servicesRouter   from './routes/services.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000
const isProd = process.env.NODE_ENV === 'production'
const resend = new Resend(process.env.RESEND_API_KEY);



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

// ── Mail service ────────────────────────────────────────────────────────────────

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>', 
      to: 'jacques.duchamplecheval@gmail.com',
      subject: `Nouveau message de ${name}`,
      html: `<p><strong>Nom:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'envoi" });
  }
});

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
