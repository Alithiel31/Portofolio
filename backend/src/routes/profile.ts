import { Router } from 'express';
import prisma from '../prisma.js';
import { asyncHandler } from '../utils/async-handler.js';
import { getLocale, localizeFields } from '../utils/localize.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const locale = getLocale(req.query);
    const profile = await prisma.profile.findFirst({
      include: { socialLinks: { orderBy: { order: 'asc' } } },
    });
    if (!profile) return res.status(404).json({ error: 'Profil non trouvé' });
    res.json(localizeFields(profile, locale, ['title', 'bio']));
  }),
);

export default router;
