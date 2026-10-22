import { Router } from 'express';
import prisma from '../prisma.js';
import { asyncHandler } from '../utils/async-handler.js';
import { getLocale, localizeFields } from '../utils/localize.js';
import { listProjects } from '../services/content.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const featured = req.query.featured === 'true';
    res.json(await listProjects(getLocale(req.query), { featured }));
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    const locale = getLocale(req.query);
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: 'Projet non trouvé' });
    res.json(localizeFields(project, locale, ['title', 'description']));
  }),
);

export default router;
