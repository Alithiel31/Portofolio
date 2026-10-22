import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prisma from '../src/prisma.js';
import type { Locale } from '../src/utils/localize.js';
import {
  getProfile,
  listExperiences,
  listProjects,
  listServices,
  listSkillCategories,
} from '../src/services/content.js';

// Fige le contenu de la base dans frontend/src/lib/data/fallback.{fr,en}.json, au format exact
// de GET /api/portfolio. Le frontend l'affiche si l'API est injoignable, au lieu d'un écran
// d'erreur. À relancer après toute modification du contenu en base :
//   DATABASE_URL=… npm run export:fallback

const OUT_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../frontend/src/lib/data',
);

async function snapshot(locale: Locale) {
  const [profile, experiences, skills, projects, services] = await Promise.all([
    getProfile(locale),
    listExperiences(locale),
    listSkillCategories(locale),
    listProjects(locale),
    listServices(locale),
  ]);
  if (!profile) throw new Error('Aucun profil en base : lancer le seed avant l’export.');
  // Sans IP de visiteur, le lieu affiché est celui du profil.
  return { profile, experiences, skills, projects, services, location: profile.location ?? null };
}

for (const locale of ['fr', 'en'] as const) {
  const file = path.join(OUT_DIR, `fallback.${locale}.json`);
  await writeFile(file, JSON.stringify(await snapshot(locale), null, 2) + '\n');
  console.log(`✅ ${path.relative(process.cwd(), file)}`);
}

await prisma.$disconnect();
