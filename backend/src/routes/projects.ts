import { Router } from 'express'
import prisma from '../prisma.js'
import { getLocale, localizeFields } from '../utils/localize.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const locale = getLocale(req.query)
    const { featured } = req.query
    const projects = await prisma.project.findMany({
      where: featured === 'true' ? { featured: true } : undefined,
      orderBy: { order: 'asc' },
    })
    res.json(projects.map(p => localizeFields(p, locale, ['title', 'description'])))
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
    const locale = getLocale(req.query)
    const project = await prisma.project.findUnique({
      where: { id: Number(req.params.id) }
    })
    if (!project) return res.status(404).json({ error: 'Projet non trouvé' })
    res.json(localizeFields(project, locale, ['title', 'description']))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
