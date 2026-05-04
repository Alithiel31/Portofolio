import { Router } from 'express'
import prisma from '../prisma.js'
import { getLocale, localizeFields } from '../utils/localize.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const locale = getLocale(req.query)
    const { type } = req.query
    const experiences = await prisma.experience.findMany({
      where: type ? { type: type as 'WORK' | 'EDUCATION' } : undefined,
      orderBy: { order: 'asc' },
    })
    res.json(experiences.map(e => localizeFields(e, locale, ['title', 'description'])))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
