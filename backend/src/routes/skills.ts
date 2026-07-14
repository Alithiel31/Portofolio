import { Router } from 'express';
import prisma from '../prisma.js';
import { getLocale } from '../utils/localize.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const locale = getLocale(_req.query);
    const categories = await prisma.skillCategory.findMany({
      include: { skills: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });
    res.json(
      categories.map((c) => ({
        ...c,
        name: locale === 'fr' && c.nameFr ? c.nameFr : c.name,
        nameFr: undefined,
      })),
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
