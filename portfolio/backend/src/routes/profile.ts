import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const profile = await prisma.profile.findFirst({
      include: {
        socialLinks: { orderBy: { order: 'asc' } }
      }
    })
    if (!profile) return res.status(404).json({ error: 'Profil non trouvé' })
    res.json(profile)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
