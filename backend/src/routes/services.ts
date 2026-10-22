import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { getLocale } from '../utils/localize.js';
import { listServices } from '../services/content.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await listServices(getLocale(req.query)));
  }),
);

export default router;
