import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { type } = req.query
    const experiences = await prisma.experience.findMany({
      where: type ? { type: type as 'WORK' | 'EDUCATION' } : undefined,
      orderBy: { order: 'asc' },
    })
    res.json(experiences)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
