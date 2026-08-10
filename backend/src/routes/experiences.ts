import { Router } from 'express';
import prisma from '../prisma.js';
import { asyncHandler } from '../utils/async-handler.js';
import { getLocale, localizeFields } from '../utils/localize.js';

const router = Router();

const VALID_TYPES = new Set(['WORK', 'EDUCATION']);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { type } = req.query;
    if (type !== undefined && !VALID_TYPES.has(type as string)) {
      return res.status(400).json({ error: 'Type invalide. Valeurs acceptées: WORK, EDUCATION' });
    }

    const locale = getLocale(req.query);
    const experiences = await prisma.experience.findMany({
      where: type ? { type: type as 'WORK' | 'EDUCATION' } : undefined,
      orderBy: { order: 'asc' },
      take: 100,
    });
    res.json(experiences.map((e) => localizeFields(e, locale, ['title', 'description'])));
  }),
);

export default router;
