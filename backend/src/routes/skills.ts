import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { getLocale } from '../utils/localize.js';
import { listSkillCategories } from '../services/content.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await listSkillCategories(getLocale(req.query)));
  }),
);

export default router;
