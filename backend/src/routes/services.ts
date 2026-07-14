import { Router } from 'express';
import prisma from '../prisma.js';
import { getLocale, localizeFields } from '../utils/localize.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const locale = getLocale(req.query);
    const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
    res.json(services.map((s) => localizeFields(s, locale, ['title', 'description'])));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
