import { PrismaClient, ExperienceType, SkillType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
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
      photoUrl: 'https://avatars.githubusercontent.com/u/583231',
      email: 'contact@jacques.dev',
      location: 'Paris, France',
      cvUrl: '/cv.pdf',
      socialLinks: {
        create: [
          { platform: 'GitHub',   url: 'https://github.com',   icon: 'bxl-github',   order: 1 },
          { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'bxl-linkedin', order: 2 },
          { platform: 'Twitter',  url: 'https://twitter.com',  icon: 'bxl-twitter',  order: 3 },
        ]
      }
    }
  })

  await prisma.experience.createMany({
    data: [
      { year: '2024 – Présent', title: 'Lead Développeur Full Stack', company: 'TechCorp Paris',       description: 'Architecture et développement d\'une plateforme SaaS B2B. Management d\'une équipe de 4 développeurs.', type: ExperienceType.WORK,      order: 1 },
      { year: '2022 – 2024',    title: 'Développeur Full Stack',      company: 'Agence Digitale Lyon', description: 'Développement de solutions web sur mesure pour des clients grands comptes. Stack React / Node.js / PostgreSQL.', type: ExperienceType.WORK,      order: 2 },
      { year: '2021 – 2022',    title: 'Développeur Frontend',        company: 'Startup Fintech',      description: 'Refonte complète du dashboard client. Amélioration des performances de 60%.', type: ExperienceType.WORK,      order: 3 },
      { year: '2019 – 2021',    title: 'Master Informatique',         company: 'Université de Paris',  description: 'Spécialisation en génie logiciel et systèmes distribués. Mention Très Bien.', type: ExperienceType.EDUCATION, order: 4 },
      { year: '2016 – 2019',    title: 'Licence Informatique',        company: 'IUT de Bordeaux',      description: 'Formation généraliste en informatique avec spécialisation développement web.', type: ExperienceType.EDUCATION, order: 5 },
    ]
  })

  const catLang = await prisma.skillCategory.create({ data: { name: 'Langages', icon: 'bx-code-alt', order: 1 } })
  const catBack = await prisma.skillCategory.create({ data: { name: 'Backend',   icon: 'bx-server',   order: 2 } })
  const catFront = await prisma.skillCategory.create({ data: { name: 'Frontend', icon: 'bx-palette',  order: 3 } })
  const catOps   = await prisma.skillCategory.create({ data: { name: 'DevOps',   icon: 'bx-cloud',    order: 4 } })

  await prisma.skill.createMany({
    data: [
      { name: 'JavaScript',  type: SkillType.MAIN,      order: 1, categoryId: catLang.id },
      { name: 'TypeScript',  type: SkillType.MAIN,      order: 2, categoryId: catLang.id },
      { name: 'Python',      type: SkillType.MAIN,      order: 3, categoryId: catLang.id },
      { name: 'SQL',         type: SkillType.MAIN,      order: 4, categoryId: catLang.id },

      { name: 'Node.js',     type: SkillType.MAIN,      order: 1, categoryId: catBack.id },
      { name: 'Express',     type: SkillType.FRAMEWORK, parent: 'Node.js', order: 2, categoryId: catBack.id },
      { name: 'Fastify',     type: SkillType.FRAMEWORK, parent: 'Node.js', order: 3, categoryId: catBack.id },
      { name: 'PostgreSQL',  type: SkillType.MAIN,      order: 4, categoryId: catBack.id },
      { name: 'Prisma',      type: SkillType.FRAMEWORK, parent: 'PostgreSQL', order: 5, categoryId: catBack.id },
      { name: 'Redis',       type: SkillType.MAIN,      order: 6, categoryId: catBack.id },

      { name: 'Svelte',      type: SkillType.MAIN,      order: 1, categoryId: catFront.id },
      { name: 'SvelteKit',   type: SkillType.FRAMEWORK, parent: 'Svelte', order: 2, categoryId: catFront.id },
      { name: 'React',       type: SkillType.MAIN,      order: 3, categoryId: catFront.id },
      { name: 'Next.js',     type: SkillType.FRAMEWORK, parent: 'React', order: 4, categoryId: catFront.id },
      { name: 'SCSS / CSS',  type: SkillType.MAIN,      order: 5, categoryId: catFront.id },

      { name: 'Docker',      type: SkillType.MAIN,      order: 1, categoryId: catOps.id },
      { name: 'Railway',     type: SkillType.MAIN,      order: 2, categoryId: catOps.id },
      { name: 'Git / GitHub',type: SkillType.MAIN,      order: 3, categoryId: catOps.id },
      { name: 'CI/CD',       type: SkillType.MAIN,      order: 4, categoryId: catOps.id },
    ]
  })

  await prisma.project.createMany({
    data: [
      {
        title: 'Portfolio Fullstack',
        description: 'Ce portfolio — architecture Svelte + Express + PostgreSQL, déployé sur Railway via Docker.',
        techStack: 'Svelte, Node.js, Prisma, PostgreSQL, Docker',
        imageUrl: 'https://picsum.photos/seed/portfolio/800/400',
        githubUrl: 'https://github.com',
        demoUrl: 'https://example.com',
        featured: true,
        order: 1,
      },
      {
        title: 'SaaS Analytics Dashboard',
        description: 'Tableau de bord temps réel pour le suivi de métriques business. Graphiques interactifs, alertes configurables.',
        techStack: 'React, Next.js, TypeScript, Recharts, Redis',
        imageUrl: 'https://picsum.photos/seed/dashboard/800/400',
        demoUrl: 'https://example.com',
        featured: true,
        order: 2,
      },
      {
        title: 'API REST Microservices',
        description: 'Architecture microservices pour une plateforme e-commerce. Gestion des commandes, stocks, paiements.',
        techStack: 'Node.js, Fastify, PostgreSQL, Docker, RabbitMQ',
        imageUrl: 'https://picsum.photos/seed/api/800/400',
        githubUrl: 'https://github.com',
        featured: false,
        order: 3,
      },
    ]
  })

  await prisma.service.createMany({
    data: [
      { title: 'Développement Web',     description: 'Conception et développement d\'applications web modernes, performantes et responsive. Du MVP à la production.', icon: 'bx-code-block',  order: 1 },
      { title: 'Architecture Backend',  description: 'Design d\'APIs REST robustes, modélisation BDD, optimisation des performances et scalabilité.', icon: 'bx-server',       order: 2 },
      { title: 'Conseil Technique',     description: 'Audit de code, choix technologiques, accompagnement d\'équipes dans leurs projets de transformation digitale.', icon: 'bx-bulb',         order: 3 },
      { title: 'DevOps & Déploiement', description: 'Mise en place de pipelines CI/CD, containerisation Docker, déploiement cloud et monitoring.', icon: 'bx-cloud-upload', order: 4 },
    ]
  })

  console.log(`✅ Seed terminé — profil "${profile.name}" créé`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
