import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { getLocale } from '../utils/localize.js';
import { getProfile } from '../services/content.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const profile = await getProfile(getLocale(req.query));
    if (!profile) return res.status(404).json({ error: 'Profil non trouvé' });
    res.json(profile);
  }),
);

export default router;
