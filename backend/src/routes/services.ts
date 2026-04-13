import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' }
    })
    res.json(services)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
