import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { getLocale } from '../utils/localize.js';
import { getClientIp } from '../utils/client-ip.js';
import { displayLocationFor } from '../utils/location.js';
import {
  getProfile,
  listExperiences,
  listProjects,
  listServices,
  listSkillCategories,
} from '../services/content.js';

const router = Router();

/**
 * Tout le contenu de la page d'accueil en une réponse : une requête au lieu de six au
 * chargement, et le lieu affiché est déjà résolu (plus de bascule visible quand
 * /api/location répondait après /api/profile).
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const locale = getLocale(req.query);
    const [profile, experiences, skills, projects, services] = await Promise.all([
      getProfile(locale),
      listExperiences(locale),
      listSkillCategories(locale),
      listProjects(locale),
      listServices(locale),
    ]);
    if (!profile) return res.status(404).json({ error: 'Profil non trouvé' });

    const location = displayLocationFor(getClientIp(req));
    res.json({ profile, experiences, skills, projects, services, location });
  }),
);

export default router;
