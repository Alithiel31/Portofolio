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
      'Weather forecast app for Quebec, built with an MVC architecture — Svelte 5 (PWA) frontend, Express/TypeScript backend. Self-hosted on a Raspberry Pi and published on the Google Play Store as an Android TWA.',
    descriptionFr:
      "Application météo pour le Québec en architecture MVC — frontend Svelte 5 (PWA), backend Express/TypeScript. Auto-hébergée sur Raspberry Pi et publiée sur le Google Play Store (TWA Android).",
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
      'Dockerized vanilla Minecraft Java server, exposed publicly through a playit.gg tunnel. Automated CI/CD (GitHub Actions: compose validation, linting, secret scanning) and full documentation (README, troubleshooting, versioned changelog) for a community server.',
    descriptionFr:
      "Serveur Minecraft Java vanilla conteneurisé avec Docker, exposé publiquement via un tunnel playit.gg. CI/CD automatisée (GitHub Actions : validation compose, linting, scan de secrets) et documentation complète (README, dépannage, changelog versionné) pour un serveur communautaire.",
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
      'AI-powered study assistant that transcribes and structures audio recordings into Markdown notes via the Groq API (Whisper Large V3 + Llama 3.3 70B). Python/FastAPI backend, React + Vite PWA frontend packaged as an Android TWA.',
    descriptionFr:
      "Assistant IA de prise de notes : transcrit et structure des enregistrements audio en notes Markdown via l'API Groq (Whisper Large V3 + Llama 3.3 70B). Backend Python/FastAPI, frontend React + Vite en PWA, packagée en TWA Android.",
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
      'Thyroid tracking app inspired by Clue — daily journal, blood test tracking with evolution charts (TSH, FT4, FT3), medication management and medical calendar. React + TypeScript PWA, Express/Prisma/PostgreSQL backend, self-hosted on a Raspberry Pi.',
    descriptionFr:
      "Application de suivi thyroïdien inspirée de Clue. Journal quotidien, suivi des analyses sanguines avec graphiques d'évolution (TSH, FT4, FT3), gestion des médicaments et agenda médical. PWA React + TypeScript, backend Express/Prisma/PostgreSQL, auto-hébergée sur Raspberry Pi.",
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
      'Showcase site & internal management tool for a company, built during an internship: public showcase, contact form, back-office (projects, services, contacts), PDF invoicing. Next.js 16 (React 19) frontend, Express/TypeScript backend, deployed via Docker behind an Nginx reverse proxy.',
    descriptionFr:
      "Site vitrine & outil de gestion interne pour une entreprise, développé en stage : vitrine publique, formulaire de contact, back-office (projets, services, contacts), facturation PDF. Frontend Next.js 16 (React 19), backend Express/TypeScript, déployé via Docker derrière un reverse proxy Nginx.",
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
      'End-of-studies project built in a 4-person team using agile sprints. Full 3-tier MVC architecture — SvelteKit frontend, Express/Node.js API, PostgreSQL/Prisma — with 4 user roles and hardened security (Argon2, Zod, Helmet, rate-limiting).',
    descriptionFr:
      "Projet de fin d'études réalisé en équipe de 4, en sprints agiles (méthode agile, Titre Professionnel). Architecture 3-tier MVC complète — frontend SvelteKit, API Express/Node.js, PostgreSQL/Prisma — avec 4 rôles utilisateurs et sécurité renforcée (Argon2, Zod, Helmet, rate-limiting).",
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
