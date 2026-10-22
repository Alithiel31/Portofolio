import prisma from '../prisma.js';
import { localizeFields, type Locale } from '../utils/localize.js';

/**
 * Lecture du contenu du portfolio, localisé. Partagé entre les routes unitaires
 * (/api/profile, /api/projects…) et l'agrégat /api/portfolio, pour qu'une seule requête
 * Prisma et une seule règle de localisation existent par type de contenu.
 */

export async function getProfile(locale: Locale) {
  const profile = await prisma.profile.findFirst({
    include: { socialLinks: { orderBy: { order: 'asc' } } },
  });
  return profile ? localizeFields(profile, locale, ['title', 'bio']) : null;
}

export async function listExperiences(locale: Locale, type?: 'WORK' | 'EDUCATION') {
  const experiences = await prisma.experience.findMany({
    where: type ? { type } : undefined,
    orderBy: { order: 'asc' },
    take: 100,
  });
  return experiences.map((e) => localizeFields(e, locale, ['title', 'description']));
}

export async function listSkillCategories(locale: Locale) {
  const categories = await prisma.skillCategory.findMany({
    include: { skills: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
    take: 100,
  });
  return categories.map((c) => ({
    ...c,
    name: locale === 'fr' && c.nameFr ? c.nameFr : c.name,
    nameFr: undefined,
  }));
}

export async function listProjects(locale: Locale, { featured = false } = {}) {
  const projects = await prisma.project.findMany({
    where: featured ? { featured: true } : undefined,
    orderBy: { order: 'asc' },
    take: 100,
  });
  return projects.map((p) => localizeFields(p, locale, ['title', 'description']));
}

export async function listServices(locale: Locale) {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' }, take: 100 });
  return services.map((s) => localizeFields(s, locale, ['title', 'description']));
}
