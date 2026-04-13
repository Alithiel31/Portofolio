import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const categories = await prisma.skillCategory.findMany({
      include: { skills: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    })
    res.json(categories)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
