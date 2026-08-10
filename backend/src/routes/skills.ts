import { Router } from 'express';
import prisma from '../prisma.js';
import { asyncHandler } from '../utils/async-handler.js';
import { getLocale } from '../utils/localize.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const locale = getLocale(req.query);
    const categories = await prisma.skillCategory.findMany({
      include: { skills: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
      take: 100,
    });
    res.json(
      categories.map((c) => ({
        ...c,
        name: locale === 'fr' && c.nameFr ? c.nameFr : c.name,
        nameFr: undefined,
      })),
    );
  }),
);

export default router;
