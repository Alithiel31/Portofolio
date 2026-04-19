import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { featured } = req.query
    const projects = await prisma.project.findMany({
      where: featured === 'true' ? { featured: true } : undefined,
      orderBy: { order: 'asc' },
    })
    res.json(projects)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID invalide' })
  }
  try {
    const project = await prisma.project.findUnique({ where: { id } })
    if (!project) return res.status(404).json({ error: 'Projet non trouvé' })
    res.json(project)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
