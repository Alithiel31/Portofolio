import { PrismaClient, ProjectStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Script idempotent : fait converger la base vers exactement la liste ci-dessous
// (upsert par titleEn, puis suppression de tout projet en base qui n'y figure pas).
// Utile pour mettre à jour la base de production sans repasser par le seed complet
// (celui-ci est ignoré une fois la base initialisée).
//
// 2026-08 : sélection resserrée à 6 projets vitrine, choisis pour couvrir des
// stacks et compétences différentes (SvelteKit, React, Next.js, Python/IA, DevOps
// pur) plutôt que d'empiler tous les projets réalisés.

const projectsToKeep = [
  {
    titleEn: 'WeatherQC',
    titleFr: 'Météo Québec',
    descriptionEn:
      'Weather forecast app for Quebec with an MVC architecture: Svelte 5 PWA frontend and Express/TypeScript backend, self-hosted on a Raspberry Pi and published on the Google Play Store.',
    descriptionFr:
      "Application météo pour le Québec en architecture MVC : frontend Svelte 5 (PWA) et backend Express/TypeScript, auto-hébergée sur Raspberry Pi et publiée sur le Google Play Store.",
    techStack: 'Svelte 5, TypeScript, Express, Node.js, Docker, Nginx, Android/TWA, Google Play',
    imageUrl: '/screenshots/weatherqc.png',
    githubUrl: 'https://github.com/Alithiel31/WeatherQC',
    demoUrl: 'https://qcweather.alithiel31.dev',
    featured: true,
    status: ProjectStatus.COMPLETED,
    order: 1,
  },
  {
    titleEn: 'Minecraft-Serveur',
    titleFr: 'Minecraft-Serveur',
    descriptionEn:
      'Dockerized vanilla Minecraft Java server exposed publicly through a playit.gg tunnel, with automated CI/CD via GitHub Actions and full documentation for a community server.',
    descriptionFr:
      "Serveur Minecraft Java vanilla conteneurisé avec Docker, exposé publiquement via un tunnel playit.gg, avec CI/CD automatisée via GitHub Actions et documentation complète.",
    techStack: 'Docker, Docker Compose, GitHub Actions (CI/CD), playit.gg',
    imageUrl: '/screenshots/minecraft-serveur.jpg',
    githubUrl: 'https://github.com/Alithiel31/Minecraft-Serveur',
    demoUrl: null,
    featured: false,
    status: ProjectStatus.COMPLETED,
    order: 2,
  },
  {
    titleEn: 'ParseAndCutV2',
    titleFr: 'ParseAndCutV2',
    descriptionEn:
      'AI-powered study assistant that transcribes and structures audio recordings into Markdown notes via the Groq API, with a Python/FastAPI backend and a React + Vite PWA frontend.',
    descriptionFr:
      "Assistant IA de prise de notes qui transcrit et structure des enregistrements audio en notes Markdown via l'API Groq, avec un backend Python/FastAPI et un frontend React + Vite en PWA.",
    techStack: 'Python, FastAPI, Groq API, React, Vite, PWA, Docker',
    imageUrl: '/screenshots/parseandcutv2.png',
    githubUrl: 'https://github.com/Alithiel31/ParseAndCutV2',
    demoUrl: 'https://parseandcut.alithiel31.dev/',
    featured: false,
    status: ProjectStatus.COMPLETED,
    order: 3,
  },
  {
    titleEn: 'ThyFollow',
    titleFr: 'ThyFollow',
    descriptionEn:
      'Thyroid tracking app inspired by Clue, with a daily journal, blood test charts and medication management, built as a React + TypeScript PWA self-hosted on a Raspberry Pi.',
    descriptionFr:
      "Application de suivi thyroïdien inspirée de Clue, avec journal quotidien, graphiques d'analyses sanguines et gestion des médicaments, en PWA React + TypeScript auto-hébergée sur Raspberry Pi.",
    techStack: 'React, TypeScript, Express, Prisma, PostgreSQL, PWA, Docker',
    imageUrl: '/screenshots/thyfollow.png',
    githubUrl: 'https://github.com/Alithiel31/ThyFollow',
    demoUrl: 'https://thyrotrack.alithiel31.dev/',
    featured: true,
    status: ProjectStatus.COMPLETED,
    order: 4,
  },
  {
    titleEn: 'QualiSite',
    titleFr: 'QualiSite',
    descriptionEn:
      'Showcase site and internal management tool for a company, built during an internship, with a Next.js 16 frontend and an Express/TypeScript backend deployed behind Nginx.',
    descriptionFr:
      "Site vitrine et outil de gestion interne pour une entreprise, développé en stage, avec un frontend Next.js 16 et un backend Express/TypeScript déployé derrière Nginx.",
    techStack: 'Next.js, React, TypeScript, Express, Prisma, PostgreSQL, Docker, Nginx',
    imageUrl: '/screenshots/qualisite.png',
    githubUrl: 'https://github.com/QualiSite/QualiSiteV1',
    demoUrl: 'https://qualisite.alithiel31.dev',
    featured: true,
    status: ProjectStatus.COMPLETED,
    order: 5,
  },
  {
    titleEn: 'SkillFusion',
    titleFr: 'SkillFusion',
    descriptionEn:
      'End-of-studies project built in a 4-person team using agile sprints: a 3-tier MVC app with a SvelteKit frontend, an Express/Node.js API and PostgreSQL/Prisma.',
    descriptionFr:
      "Projet de fin d'études réalisé en équipe de 4, en sprints agiles : application 3-tier MVC avec frontend SvelteKit, API Express/Node.js et PostgreSQL/Prisma.",
    techStack: 'SvelteKit, TypeScript, Express, Node.js, PostgreSQL, Prisma, Docker',
    imageUrl: '/screenshots/skillfusion.png',
    githubUrl: 'https://github.com/Alithiel31/SkillFusion',
    demoUrl: 'https://skillfusion-client-production.up.railway.app/',
    featured: true,
    status: ProjectStatus.COMPLETED,
    order: 6,
  },
];

async function main() {
  console.log('🔄 Synchronisation des projets...\n');

  const keepTitles = projectsToKeep.map((p) => p.titleEn);

  for (const project of projectsToKeep) {
    const existing = await prisma.project.findFirst({ where: { titleEn: project.titleEn } });
    if (existing) {
      await prisma.project.update({ where: { id: existing.id }, data: project });
      console.log(`🔁 Mis à jour : ${project.titleEn}`);
    } else {
      await prisma.project.create({ data: project });
      console.log(`✅ Ajouté : ${project.titleEn}`);
    }
  }

  const { count } = await prisma.project.deleteMany({
    where: { titleEn: { notIn: keepTitles } },
  });
  if (count > 0) {
    console.log(`🗑️  Retirés : ${count} ancien(s) projet(s) hors sélection`);
  }

  console.log('\n🎉 Terminé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur :', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
