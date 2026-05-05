import { Router } from 'express'
import prisma from '../prisma.js'
import { getLocale, localizeFields } from '../utils/localize.js'

const router = Router()

const VALID_TYPES = new Set(['WORK', 'EDUCATION'])

router.get('/', async (req, res) => {
  const { type } = req.query
  if (type !== undefined && !VALID_TYPES.has(type as string)) {
    return res.status(400).json({ error: "Type invalide. Valeurs acceptées: WORK, EDUCATION" })
  }
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
