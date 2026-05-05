import { Router } from 'express'
import prisma from '../prisma.js'
import { getLocale, localizeFields } from '../utils/localize.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const locale = getLocale(req.query)
    const profile = await prisma.profile.findFirst({
      include: { socialLinks: { orderBy: { order: 'asc' } } }
    })
    if (!profile) return res.status(404).json({ error: 'Profil non trouvé' })
    res.json(localizeFields(profile, locale, ['title', 'bio']))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
