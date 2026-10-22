import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { getLocale } from '../utils/localize.js';
import { listExperiences } from '../services/content.js';

const router = Router();

const VALID_TYPES = new Set(['WORK', 'EDUCATION']);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { type } = req.query;
    if (type !== undefined && !VALID_TYPES.has(type as string)) {
      return res.status(400).json({ error: 'Type invalide. Valeurs acceptées: WORK, EDUCATION' });
    }

    res.json(await listExperiences(getLocale(req.query), type as 'WORK' | 'EDUCATION' | undefined));
  }),
);

export default router;
