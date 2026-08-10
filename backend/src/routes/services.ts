import { Router } from 'express';
import prisma from '../prisma.js';
import { asyncHandler } from '../utils/async-handler.js';
import { getLocale, localizeFields } from '../utils/localize.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const locale = getLocale(req.query);
    const services = await prisma.service.findMany({ orderBy: { order: 'asc' }, take: 100 });
    res.json(services.map((s) => localizeFields(s, locale, ['title', 'description'])));
  }),
);

export default router;
