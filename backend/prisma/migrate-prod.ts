import { PrismaClient, SkillType, ProjectStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Migration de production démarrée...\n')

  // ── Skills manquants ────────────────────────────────────────────────────────

  const catLang  = await prisma.skillCategory.findFirst({ where: { name: 'Langages' } })
  const catBack  = await prisma.skillCategory.findFirst({ where: { name: 'Backend' } })
  const catFront = await prisma.skillCategory.findFirst({ where: { name: 'Frontend' } })
  const catOps   = await prisma.skillCategory.findFirst({ where: { name: 'DevOps' } })

  if (!catLang || !catBack || !catFront || !catOps) {
    throw new Error('Catégories de skills introuvables — vérifier la base de données.')
  }

  const skillsToAdd = [
    { name: 'PHP',       type: SkillType.MAIN,      order: 5, categoryId: catLang.id },
    { name: 'HTML',      type: SkillType.MAIN,      order: 6, categoryId: catFront.id },
    { name: 'YAML',      type: SkillType.MAIN,      order: 5, categoryId: catOps.id },
    { name: 'Sequelize', type: SkillType.FRAMEWORK, parent: 'Node.js', order: 7, categoryId: catBack.id },
  ]

  for (const skill of skillsToAdd) {
    const existing = await prisma.skill.findFirst({ where: { name: skill.name, categoryId: skill.categoryId } })
    if (existing) {
      console.log(`⏭  Skill déjà présent : ${skill.name}`)
    } else {
      await prisma.skill.create({ data: skill })
      console.log(`✅ Skill ajouté : ${skill.name}`)
    }
  }

  // ── Projets ─────────────────────────────────────────────────────────────────

  // Mise à jour du Portfolio Fullstack (order 1) — ajouter status COMPLETED
  await prisma.project.updateMany({
    where: { order: 1 },
    data: { status: ProjectStatus.COMPLETED },
  })
  console.log('\n✅ Projet 1 mis à jour : Portfolio Fullstack (status COMPLETED)')

  // Remplacement projet 2 : SaaS Analytics Dashboard → GenevaWillBeBlue
  await prisma.project.updateMany({
    where: { order: 2 },
    data: {
      title:       'GenevaWillBeBlue',
      description: "Plateforme logistique et d'information pour l'événement de la communauté de jeu Ingress à Genève (juin 2026).",
      techStack:   'Svelte 5, TypeScript, SCSS, Sequelize, PostgreSQL, Railway',
      imageUrl:    'https://picsum.photos/seed/geneva/800/400',
      githubUrl:   'https://github.com/Alithiel31/GenevaWillBeBlueV2',
      demoUrl:     'https://genevawillbebluev2-production.up.railway.app/',
      featured:    true,
      status:      ProjectStatus.COMPLETED,
    },
  })
  console.log('✅ Projet 2 remplacé : GenevaWillBeBlue')

  // Remplacement projet 3 : API REST Microservices → SkillFusion
  await prisma.project.updateMany({
    where: { order: 3 },
    data: {
      title:       'SkillFusion',
      description: "Plateforme éducative DIY développée en équipe (méthode agile, Titre Professionnel). Architecture 3-tier complète : SvelteKit (Svelte 5 + runes), Express TypeScript, PostgreSQL/Prisma. 4 rôles utilisateurs, 8 tables, sécurité renforcée (Argon2, Zod, Helmet, rate-limiting, sanitization XSS).",
      techStack:   'SvelteKit, TypeScript, Express, PostgreSQL, Prisma, Docker, Railway',
      imageUrl:    'https://picsum.photos/seed/skillfusion/800/400',
      githubUrl:   'https://github.com/Alithiel31/SkillFusion',
      demoUrl:     'https://skillfusion-client-production.up.railway.app/',
      featured:    true,
      status:      ProjectStatus.COMPLETED,
    },
  })
  console.log('✅ Projet 3 remplacé : SkillFusion')

  // Ajout des nouveaux projets (si absents)
  const newProjects = [
    {
      title:       'ParseAndCutV2',
      description: "Outil propulsé par l'IA utilisant l'API Groq pour transcrire et résumer des fichiers audio en fiches de synthèse professionnelles.",
      techStack:   'Python, JavaScript, HTML/CSS, Docker, GitHub Actions',
      imageUrl:    'https://picsum.photos/seed/parseandcut/800/400',
      githubUrl:   'https://github.com/Alithiel31/ParseAndCutV2',
      demoUrl:     'https://parseandcut.alithiel31.dev/',
      featured:    false,
      status:      ProjectStatus.COMPLETED,
      order:       4,
    },
    {
      title:       'ThyFollow',
      description: "Application de suivi thyroïdien inspirée de Clue. Journal quotidien (énergie, humeur, symptômes), suivi des analyses sanguines avec graphiques d'évolution (TSH, FT4, FT3), gestion des médicaments et agenda médical.",
      techStack:   'React 18, TypeScript, Express, PostgreSQL, Prisma, Zustand, TanStack Query, Recharts, Railway',
      imageUrl:    'https://picsum.photos/seed/thyfollow/800/400',
      githubUrl:   'https://github.com/Alithiel31/ThyFollow',
      demoUrl:     null,
      featured:    false,
      status:      ProjectStatus.IN_PROGRESS,
      order:       5,
    },
    {
      title:       'TheMachine',
      description: "Projet personnel fan-made : reproduction de l'interface de \"La Machine\" de la série Person of Interest, connectée à l'API Bluesky pour une surveillance en temps réel du réseau social.",
      techStack:   'JavaScript',
      imageUrl:    'https://picsum.photos/seed/themachine/800/400',
      githubUrl:   'https://github.com/Alithiel31/TheMachine',
      demoUrl:     null,
      featured:    false,
      status:      ProjectStatus.IN_PROGRESS,
      order:       6,
    },
  ]

  for (const project of newProjects) {
    const existing = await prisma.project.findFirst({ where: { order: project.order } })
    if (existing) {
      console.log(`⏭  Projet déjà présent à l'order ${project.order} : ${existing.title}`)
    } else {
      await prisma.project.create({ data: project })
      console.log(`✅ Projet ajouté : ${project.title}`)
    }
  }

  // ── Icônes Devicon sur les skills ──────────────────────────────────────────

  const D = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

  const skillIcons: Record<string, string | null> = {
    'JavaScript': `${D}/javascript/javascript-original.svg`,
    'TypeScript': `${D}/typescript/typescript-original.svg`,
    'Python':     `${D}/python/python-original.svg`,
    'SQL':        `${D}/postgresql/postgresql-original.svg`,
    'PHP':        `${D}/php/php-original.svg`,
    'Node.js':    `${D}/nodejs/nodejs-original.svg`,
    'Express':    `${D}/express/express-original-wordmark.svg`,
    'Fastify':    `${D}/fastify/fastify-original.svg`,
    'PostgreSQL': `${D}/postgresql/postgresql-original.svg`,
    'Prisma':     `${D}/prisma/prisma-original.svg`,
    'Redis':      `${D}/redis/redis-original.svg`,
    'Sequelize':  `${D}/sequelize/sequelize-original.svg`,
    'Svelte':     `${D}/svelte/svelte-original.svg`,
    'SvelteKit':  `${D}/svelte/svelte-original.svg`,
    'React':      `${D}/react/react-original.svg`,
    'Next.js':    `${D}/nextjs/nextjs-original.svg`,
    'SCSS / CSS': `${D}/sass/sass-original.svg`,
    'HTML':       `${D}/html5/html5-original.svg`,
    'Docker':     `${D}/docker/docker-original.svg`,
    'Railway':    null,
    'Git / GitHub': `${D}/git/git-original.svg`,
    'CI/CD':      `${D}/githubactions/githubactions-original.svg`,
    'YAML':       null,
  }

  console.log('\n🎨 Mise à jour des icônes skills...')
  for (const [name, iconUrl] of Object.entries(skillIcons)) {
    const updated = await prisma.skill.updateMany({ where: { name }, data: { iconUrl } })
    if (updated.count > 0) {
      console.log(`✅ Icône ajoutée : ${name}`)
    } else {
      console.log(`⏭  Skill non trouvé : ${name}`)
    }
  }

  console.log('\n🎉 Migration terminée avec succès !')
}

main()
  .catch(e => { console.error('❌ Erreur :', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
