import { PrismaClient, ExperienceType, SkillType, ProjectStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const existing = await prisma.profile.count()
  if (existing > 0) {
    console.log('✅ Base de données déjà initialisée, seed ignoré.')
    return
  }

  console.log('🌱 Seeding database...')

  await prisma.socialLink.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.experience.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.skillCategory.deleteMany()
  await prisma.project.deleteMany()
  await prisma.service.deleteMany()

  const profile = await prisma.profile.create({
    data: {
      name: 'Jacques Duchamplecheval',
      title: 'Développeur Full Stack',
      bio: 'Passionné par la création d\'interfaces modernes et d\'architectures robustes. J\'aime transformer des idées complexes en expériences utilisateur simples et élégantes.',
      photoUrl: 'https://github.com/Alithiel31.png',
      email: 'jacques.duchamplecheval@gmail.com',
      location: 'France',
      cvUrl: '/cv.pdf',
      socialLinks: {
        create: [
          { platform: 'GitHub', url: 'https://github.com/Alithiel31', icon: 'bxl-github', order: 1 },
          { platform: 'LinkedIn', url: 'https://linkedin.com/in/jacques-duchamplecheval', icon: 'bxl-linkedin', order: 2 },
        ]
      }
    }
  })

  await prisma.experience.createMany({
    data: [
      { year: '2024 - Présent', title: 'Lead Développeur Full Stack', company: 'TechCorp Paris', description: 'Architecture et développement d\'une plateforme SaaS B2B. Management d\'une équipe de 4 développeurs.', type: ExperienceType.WORK, order: 1 },
      { year: '2022 - 2024', title: 'Développeur Full Stack', company: 'Agence Digitale Lyon', description: 'Développement de solutions web sur mesure pour des clients grands comptes. Stack React / Node.js / PostgreSQL.', type: ExperienceType.WORK, order: 2 },
      { year: '2021 - 2022', title: 'Développeur Frontend', company: 'Startup Fintech', description: 'Refonte complète du dashboard client. Amélioration des performances de 60%.', type: ExperienceType.WORK, order: 3 },
      { year: '2019 - 2021', title: 'Master Informatique', company: 'Université de Paris', description: 'Spécialisation en génie logiciel et systèmes distribués. Mention Très Bien.', type: ExperienceType.EDUCATION, order: 4 },
      { year: '2016 - 2019', title: 'Licence Informatique', company: 'IUT de Bordeaux', description: 'Formation généraliste en informatique avec spécialisation développement web.', type: ExperienceType.EDUCATION, order: 5 },
    ]
  })

  const catLang  = await prisma.skillCategory.create({ data: { name: 'Langages',  icon: 'bx-code-alt', order: 1 } })
  const catBack  = await prisma.skillCategory.create({ data: { name: 'Backend',   icon: 'bx-server',   order: 2 } })
  const catFront = await prisma.skillCategory.create({ data: { name: 'Frontend',  icon: 'bx-palette',  order: 3 } })
  const catOps   = await prisma.skillCategory.create({ data: { name: 'DevOps',    icon: 'bx-cloud',    order: 4 } })

  await prisma.skill.createMany({
    data: [
      { name: 'JavaScript', type: SkillType.MAIN,      order: 1, categoryId: catLang.id },
      { name: 'TypeScript', type: SkillType.MAIN,      order: 2, categoryId: catLang.id },
      { name: 'Python',     type: SkillType.MAIN,      order: 3, categoryId: catLang.id },
      { name: 'SQL',        type: SkillType.MAIN,      order: 4, categoryId: catLang.id },
      { name: 'PHP',        type: SkillType.MAIN,      order: 5, categoryId: catLang.id },

      { name: 'Node.js',    type: SkillType.MAIN,      order: 1, categoryId: catBack.id },
      { name: 'Express',    type: SkillType.FRAMEWORK, parent: 'Node.js',    order: 2, categoryId: catBack.id },
      { name: 'Fastify',    type: SkillType.FRAMEWORK, parent: 'Node.js',    order: 3, categoryId: catBack.id },
      { name: 'PostgreSQL', type: SkillType.MAIN,      order: 4, categoryId: catBack.id },
      { name: 'Prisma',     type: SkillType.FRAMEWORK, parent: 'PostgreSQL', order: 5, categoryId: catBack.id },
      { name: 'Redis',      type: SkillType.MAIN,      order: 6, categoryId: catBack.id },
      { name: 'Sequelize',  type: SkillType.FRAMEWORK, parent: 'Node.js',    order: 7, categoryId: catBack.id },

      { name: 'Svelte',     type: SkillType.MAIN,      order: 1, categoryId: catFront.id },
      { name: 'SvelteKit',  type: SkillType.FRAMEWORK, parent: 'Svelte',     order: 2, categoryId: catFront.id },
      { name: 'React',      type: SkillType.MAIN,      order: 3, categoryId: catFront.id },
      { name: 'Next.js',    type: SkillType.FRAMEWORK, parent: 'React',      order: 4, categoryId: catFront.id },
      { name: 'SCSS / CSS', type: SkillType.MAIN,      order: 5, categoryId: catFront.id },
      { name: 'HTML',       type: SkillType.MAIN,      order: 6, categoryId: catFront.id },

      { name: 'Docker',     type: SkillType.MAIN,      order: 1, categoryId: catOps.id },
      { name: 'Railway',    type: SkillType.MAIN,      order: 2, categoryId: catOps.id },
      { name: 'Git / GitHub', type: SkillType.MAIN,    order: 3, categoryId: catOps.id },
      { name: 'CI/CD',      type: SkillType.MAIN,      order: 4, categoryId: catOps.id },
      { name: 'YAML',       type: SkillType.MAIN,      order: 5, categoryId: catOps.id },
    ]
  })

  await prisma.project.createMany({
    data: [
      {
        title: 'Portfolio Fullstack',
        description: 'Ce portfolio — architecture Svelte + Express + PostgreSQL, déployé sur Railway via Docker.',
        techStack: 'Svelte, Node.js, Prisma, PostgreSQL, Docker',
        imageUrl: 'https://picsum.photos/seed/portfolio/800/400',
        githubUrl: 'https://github.com/Alithiel31/portofolio',
        demoUrl: null,
        featured: true,
        order: 1,
      },
      {
        title: 'GenevaWillBeBlue',
        description: 'Plateforme logistique et d\'information pour l\'événement de la communauté de jeu Ingress à Genève (juin 2026).',
        techStack: 'Svelte 5, TypeScript, SCSS, Sequelize, PostgreSQL, Railway',
        imageUrl: 'https://picsum.photos/seed/geneva/800/400',
        githubUrl: 'https://github.com/Alithiel31/GenevaWillBeBlueV2',
        demoUrl: 'https://genevawillbebluev2-production.up.railway.app/',
        featured: true,
        order: 2,
      },
      {
        title: 'SkillFusion',
        description: 'Plateforme éducative DIY développée en équipe (méthode agile, Titre Professionnel). Architecture 3-tier complète : SvelteKit (Svelte 5 + runes), Express TypeScript, PostgreSQL/Prisma. 4 rôles utilisateurs, 8 tables, sécurité renforcée (Argon2, Zod, Helmet, rate-limiting, sanitization XSS).',
        techStack: 'SvelteKit, TypeScript, Express, PostgreSQL, Prisma, Docker, Railway',
        imageUrl: 'https://picsum.photos/seed/skillfusion/800/400',
        githubUrl: 'https://github.com/Alithiel31/SkillFusion',
        demoUrl: 'https://skillfusion-client-production.up.railway.app/',
        featured: true,
        order: 3,
      },
      {
        title: 'ParseAndCutV2',
        description: 'Outil propulsé par l\'IA utilisant l\'API Groq pour transcrire et résumer des fichiers audio en fiches de synthèse professionnelles.',
        techStack: 'Python, JavaScript, HTML/CSS, Docker, GitHub Actions',
        imageUrl: 'https://picsum.photos/seed/parseandcut/800/400',
        githubUrl: 'https://github.com/Alithiel31/ParseAndCutV2',
        demoUrl: 'https://parseandcut.alithiel31.dev/',
        featured: false,
        status: ProjectStatus.COMPLETED,
        order: 4,
      },
      {
        title: 'ThyFollow',
        description: 'Application de suivi thyroïdien inspirée de Clue. Journal quotidien (énergie, humeur, symptômes), suivi des analyses sanguines avec graphiques d\'évolution (TSH, FT4, FT3), gestion des médicaments et agenda médical.',
        techStack: 'React 18, TypeScript, Express, PostgreSQL, Prisma, Zustand, TanStack Query, Recharts, Railway',
        imageUrl: 'https://picsum.photos/seed/thyfollow/800/400',
        githubUrl: 'https://github.com/Alithiel31/ThyFollow',
        demoUrl: null,
        featured: false,
        status: ProjectStatus.IN_PROGRESS,
        order: 5,
      },
      {
        title: 'TheMachine',
        description: 'Projet personnel fan-made : reproduction de l\'interface de "La Machine" de la série Person of Interest, connectée à l\'API Bluesky pour une surveillance en temps réel du réseau social.',
        techStack: 'JavaScript',
        imageUrl: 'https://picsum.photos/seed/themachine/800/400',
        githubUrl: 'https://github.com/Alithiel31/TheMachine',
        demoUrl: null,
        featured: false,
        status: ProjectStatus.IN_PROGRESS,
        order: 6,
      },
    ]
  })

  await prisma.service.createMany({
    data: [
      { title: 'Développement Web',     description: 'Conception et développement d\'applications web modernes, performantes et responsive. Du MVP à la production.', icon: 'bx-code-block',   order: 1 },
      { title: 'Architecture Backend',  description: 'Design d\'APIs REST robustes, modélisation BDD, optimisation des performances et scalabilité.',                 icon: 'bx-server',       order: 2 },
      { title: 'Conseil Technique',     description: 'Audit de code, choix technologiques, accompagnement d\'équipes dans leurs projets de transformation digitale.',  icon: 'bx-bulb',         order: 3 },
      { title: 'DevOps & Déploiement', description: 'Mise en place de pipelines CI/CD, containerisation Docker, déploiement cloud et monitoring.',                   icon: 'bx-cloud-upload', order: 4 },
    ]
  })

  console.log(`✅ Seed terminé — profil "${profile.name}" créé`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
