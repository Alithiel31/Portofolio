import { PrismaClient, SkillType, ProjectStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Migration de production démarrée...\n');

  // ── Table PageView (idempotent) ─────────────────────────────────────────────
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "PageView" (
      "id"        SERIAL PRIMARY KEY,
      "page"      TEXT NOT NULL,
      "country"   TEXT,
      "region"    TEXT,
      "city"      TEXT,
      "zone"      TEXT,
      "referer"   TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Table PageView vérifiée\n');

  // ── Enum LEARNING (idempotent) ──────────────────────────────────────────────
  await prisma.$executeRawUnsafe(`ALTER TYPE "SkillType" ADD VALUE IF NOT EXISTS 'LEARNING'`);
  console.log('✅ Enum LEARNING vérifié\n');

  // ── Catégories ──────────────────────────────────────────────────────────────
  const catLang = await prisma.skillCategory.findFirst({ where: { name: 'Langages' } });
  const catBack = await prisma.skillCategory.findFirst({ where: { name: 'Backend' } });
  const catFront = await prisma.skillCategory.findFirst({ where: { name: 'Frontend' } });
  const catOps = await prisma.skillCategory.findFirst({ where: { name: 'DevOps' } });

  if (!catLang || !catBack || !catFront || !catOps) {
    throw new Error('Catégories de skills introuvables — vérifier la base de données.');
  }

  // ── Corrections des skills existants ────────────────────────────────────────

  // PHP → LEARNING dans Langages (order 3 — JS, TS, PHP)
  const php = await prisma.skill.findFirst({ where: { name: 'PHP' } });
  if (php) {
    await prisma.skill.update({
      where: { id: php.id },
      data: { type: SkillType.LEARNING, categoryId: catLang.id, order: 3 },
    });
    console.log('✅ PHP mis à jour : LEARNING dans Langages (order 3)');
  }

  // Python → Backend
  const python = await prisma.skill.findFirst({ where: { name: 'Python' } });
  if (python) {
    await prisma.skill.update({
      where: { id: python.id },
      data: { categoryId: catBack.id, order: 5 },
    });
    console.log('✅ Python déplacé : Backend (order 5)');
  }

  // SQL → Backend
  const sql = await prisma.skill.findFirst({ where: { name: 'SQL' } });
  if (sql) {
    await prisma.skill.update({
      where: { id: sql.id },
      data: { categoryId: catBack.id, order: 6 },
    });
    console.log('✅ SQL déplacé : Backend (order 6)');
  }

  // Sequelize → MAIN dans Backend
  const sequelize = await prisma.skill.findFirst({ where: { name: 'Sequelize' } });
  if (sequelize) {
    await prisma.skill.update({
      where: { id: sequelize.id },
      data: { type: SkillType.MAIN, categoryId: catBack.id, parent: null, order: 7 },
    });
    console.log('✅ Sequelize mis à jour : MAIN dans Backend (order 7)');
  }

  // Suppression de Redis
  const redis = await prisma.skill.findFirst({ where: { name: 'Redis' } });
  if (redis) {
    await prisma.skill.delete({ where: { id: redis.id } });
    console.log('✅ Redis supprimé');
  } else {
    console.log('⏭  Redis déjà absent');
  }

  // ── Skills manquants ────────────────────────────────────────────────────────

  const skillsToAdd = [
    { name: 'Prisma', type: SkillType.MAIN, order: 8, categoryId: catBack.id },
    { name: 'HTML', type: SkillType.MAIN, order: 6, categoryId: catFront.id },
    { name: 'YAML', type: SkillType.MAIN, order: 5, categoryId: catOps.id },
  ];

  console.log('');
  for (const skill of skillsToAdd) {
    const existing = await prisma.skill.findFirst({
      where: { name: skill.name, categoryId: skill.categoryId },
    });
    if (existing) {
      console.log(`⏭  Skill déjà présent : ${skill.name}`);
    } else {
      await prisma.skill.create({ data: skill });
      console.log(`✅ Skill ajouté : ${skill.name}`);
    }
  }

  // ── Projets (delete + recreate — idempotent, élimine les doublons) ────────────

  await prisma.project.deleteMany();
  console.log('\n🗑  Projets existants supprimés');

  await prisma.project.createMany({
    data: [
      {
        title: 'Portfolio Fullstack',
        description:
          'Ce portfolio — architecture Svelte 5 + Express + PostgreSQL, déployé sur Railway via Docker.',
        techStack: 'Svelte, TypeScript, Node.js, Prisma, PostgreSQL, Docker',
        imageUrl: '/screenshots/portfolio.png',
        githubUrl: 'https://github.com/Alithiel31/Portofolio',
        demoUrl: 'https://alithiel31.dev',
        featured: true,
        status: ProjectStatus.COMPLETED,
        order: 1,
      },
      {
        title: 'GenevaWillBeBlue',
        description:
          "Plateforme logistique et d'information pour l'événement de la communauté de jeu Ingress à Genève (juin 2026).",
        techStack: 'Svelte 5, TypeScript, SCSS, Sequelize, PostgreSQL, Railway',
        imageUrl: '/screenshots/geneva.png',
        githubUrl: 'https://github.com/Alithiel31/GenevaWillBeBlueV2',
        demoUrl: 'https://genevawillbebluev2-production.up.railway.app/',
        featured: true,
        status: ProjectStatus.COMPLETED,
        order: 2,
      },
      {
        title: 'SkillFusion',
        description:
          'Plateforme éducative DIY développée en équipe (méthode agile, Titre Professionnel). Architecture 3-tier complète : SvelteKit (Svelte 5 + runes), Express TypeScript, PostgreSQL/Prisma. 4 rôles utilisateurs, 8 tables, sécurité renforcée (Argon2, Zod, Helmet, rate-limiting, sanitization XSS).',
        techStack: 'SvelteKit, TypeScript, Express, PostgreSQL, Prisma, Docker, Railway',
        imageUrl: '/screenshots/skillfusion.png',
        githubUrl: 'https://github.com/Alithiel31/SkillFusion',
        demoUrl: 'https://skillfusion-client-production.up.railway.app/',
        featured: true,
        status: ProjectStatus.COMPLETED,
        order: 3,
      },
      {
        title: 'ParseAndCutV2',
        description:
          "Outil propulsé par l'IA utilisant l'API Groq pour transcrire et résumer des fichiers audio en fiches de synthèse professionnelles.",
        techStack: 'Python, JavaScript, HTML/CSS, Docker, GitHub Actions',
        imageUrl: '/screenshots/parseandcutv2.png',
        githubUrl: 'https://github.com/Alithiel31/ParseAndCutV2',
        demoUrl: 'https://parseandcut.alithiel31.dev/',
        featured: false,
        status: ProjectStatus.COMPLETED,
        order: 4,
      },
      {
        title: 'ThyFollow',
        description:
          "Application de suivi thyroïdien inspirée de Clue. Journal quotidien (énergie, humeur, symptômes), suivi des analyses sanguines avec graphiques d'évolution (TSH, FT4, FT3), gestion des médicaments et agenda médical.",
        techStack:
          'React 18, TypeScript, Express, PostgreSQL, Prisma, Zustand, TanStack Query, Recharts, Railway',
        imageUrl: '/screenshots/thyfollow.png',
        githubUrl: 'https://github.com/Alithiel31/ThyFollow',
        demoUrl: null,
        featured: false,
        status: ProjectStatus.IN_PROGRESS,
        order: 5,
      },
      {
        title: 'TheMachine',
        description:
          'Projet personnel fan-made : reproduction de l\'interface de "La Machine" de la série Person of Interest, connectée à l\'API Bluesky pour une surveillance en temps réel du réseau social.',
        techStack: 'JavaScript',
        imageUrl: '/screenshots/themachine.png',
        githubUrl: 'https://github.com/Alithiel31/TheMachine',
        demoUrl: null,
        featured: false,
        status: ProjectStatus.IN_PROGRESS,
        order: 6,
      },
    ],
  });
  console.log('✅ 6 projets recréés proprement');

  // ── Icônes Devicon sur les skills ──────────────────────────────────────────

  const D = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

  const skillIcons: Record<string, string | null> = {
    JavaScript: `${D}/javascript/javascript-original.svg`,
    TypeScript: `${D}/typescript/typescript-original.svg`,
    Python: `${D}/python/python-original.svg`,
    SQL: `${D}/postgresql/postgresql-original.svg`,
    PHP: `${D}/php/php-original.svg`,
    'Node.js': `${D}/nodejs/nodejs-original.svg`,
    Express: `${D}/express/express-original-wordmark.svg`,
    Fastify: `${D}/fastify/fastify-original.svg`,
    PostgreSQL: `${D}/postgresql/postgresql-original.svg`,
    Prisma: `${D}/prisma/prisma-original.svg`,
    Redis: `${D}/redis/redis-original.svg`,
    Sequelize: `${D}/sequelize/sequelize-original.svg`,
    Svelte: `${D}/svelte/svelte-original.svg`,
    SvelteKit: `${D}/svelte/svelte-original.svg`,
    React: `${D}/react/react-original.svg`,
    'Next.js': `${D}/nextjs/nextjs-original.svg`,
    'SCSS / CSS': `${D}/sass/sass-original.svg`,
    HTML: `${D}/html5/html5-original.svg`,
    Docker: `${D}/docker/docker-original.svg`,
    Railway: 'https://cdn.simpleicons.org/railway/ffffff',
    'Git / GitHub': `${D}/git/git-original.svg`,
    'CI/CD': `${D}/githubactions/githubactions-original.svg`,
    YAML: null,
  };

  console.log('\n🎨 Mise à jour des icônes skills...');
  for (const [name, iconUrl] of Object.entries(skillIcons)) {
    const updated = await prisma.skill.updateMany({ where: { name }, data: { iconUrl } });
    if (updated.count > 0) {
      console.log(`✅ Icône ajoutée : ${name}`);
    } else {
      console.log(`⏭  Skill non trouvé : ${name}`);
    }
  }

  console.log('\n🎉 Migration terminée avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur :', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
