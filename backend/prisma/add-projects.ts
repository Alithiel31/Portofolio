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
      'Weather forecast app for Quebec, MVC architecture (Svelte 5 PWA + Express/TypeScript), published on the Google Play Store.',
    descriptionFr:
      "Application météo pour le Québec, en architecture MVC (Svelte 5 PWA + Express/TypeScript), publiée sur le Google Play Store.",
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
      'Dockerized vanilla Minecraft Java server, exposed via a playit.gg tunnel, with automated CI/CD through GitHub Actions.',
    descriptionFr:
      "Serveur Minecraft Java vanilla conteneurisé avec Docker, exposé via un tunnel playit.gg, avec CI/CD GitHub Actions.",
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
      'AI assistant that transcribes and structures audio recordings into Markdown notes via the Groq API (Python/FastAPI + React PWA).',
    descriptionFr:
      "Assistant IA qui transcrit et structure des enregistrements audio en notes Markdown via l'API Groq (Python/FastAPI + React PWA).",
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
      'Thyroid tracking app inspired by Clue: journal, blood tests and medication tracking, as a self-hosted React PWA.',
    descriptionFr:
      "Application de suivi thyroïdien inspirée de Clue : journal, analyses sanguines et médicaments, en PWA React auto-hébergée.",
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
      'Showcase site and internal management tool built during an internship, with Next.js 16 and an Express/TypeScript backend.',
    descriptionFr:
      "Site vitrine et outil de gestion interne développé en stage, avec Next.js 16 et un backend Express/TypeScript.",
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
      'End-of-studies project in a 4-person team, agile sprints: 3-tier app with SvelteKit, Express/Node.js and PostgreSQL.',
    descriptionFr:
      "Projet de fin d'études en équipe de 4, en sprints agiles : app 3-tier avec SvelteKit, Express/Node.js et PostgreSQL.",
    techStack: 'SvelteKit, TypeScript, Express, Node.js, PostgreSQL, Prisma, Docker',
    imageUrl: '/screenshots/skillfusion.png',
    githubUrl: 'https://github.com/Alithiel31/SkillFusion',
    demoUrl: 'https://skillfusion.alithiel31.dev',
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
