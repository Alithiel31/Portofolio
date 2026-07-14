import { PrismaClient, ExperienceType, SkillType, ProjectStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.profile.count();
  if (existing > 0) {
    console.log('✅ Base de données déjà initialisée, seed ignoré.');
    return;
  }

  console.log('🌱 Seeding database...');

  await prisma.socialLink.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();

  // ─── PROFILE ────────────────────────────────────────────────────────────────

  const profile = await prisma.profile.create({
    data: {
      name: 'Jacques Duchamplecheval',
      titleEn: 'Full Stack Developer',
      titleFr: 'Développeur Full Stack',
      bioEn:
        "I'm passionate about crafting modern interfaces and scalable architectures. I thrive on turning complex ideas into intuitive, elegant user experiences.",
      bioFr:
        "Passionné par la création d'interfaces modernes et d'architectures robustes. J'aime transformer des idées complexes en expériences utilisateur simples et élégantes.",
      photoUrl: 'https://github.com/Alithiel31.png',
      email: 'jacques.duchamplecheval@gmail.com',
      location: 'France',
      cvEn: '/cv-en.pdf',
      cvFr: '/cv-fr.pdf',
      socialLinks: {
        create: [
          {
            platform: 'GitHub',
            url: 'https://github.com/Alithiel31',
            icon: 'bxl-github',
            order: 1,
          },
          {
            platform: 'LinkedIn',
            url: 'https://linkedin.com/in/jacques-duchamplecheval',
            icon: 'bxl-linkedin',
            order: 2,
          },
        ],
      },
    },
  });

  // ─── EXPERIENCES ────────────────────────────────────────────────────────────

  await prisma.experience.createMany({
    data: [
      // WORK — plus récent en premier
      {
        year: '2022 - Present',
        titleEn: 'Pharmaceutical Production Technician (Granulation & Coating)',
        titleFr: 'Technicien de Production Pharmaceutique (Granulation & Enrobage)',
        company: 'Delpharm Gaillard',
        descriptionEn:
          'Managed production batches via EBR, oversaw granulation (supervisory control) and coating workshops, and performed level 1 maintenance. Certified MEWP operator for working at heights.',
        descriptionFr:
          "Gestion des lots de production via EBR, supervision des ateliers de granulation (contrôle superviseur) et d'enrobage, et maintenance de niveau 1. Certifié PEMP pour le travail en hauteur.",
        type: ExperienceType.WORK,
        order: 1,
      },
      {
        year: '2019 - 2022',
        titleEn: 'Butter Production Team Lead & Technical Instructor',
        titleFr: "Chef d'Équipe Production Beurre & Formateur Technique",
        company: 'E.N.I.L.V.',
        descriptionEn:
          'Expert in overseeing industrial-scale butter lines (Buttermaker) and cream ripening processes. I lead teams of up to 10 people, manage client/supplier quality standards, and coordinate bacteriological monitoring. As a dedicated technical mentor, I also supervise production consumables and lead the training and tutoring of apprentices and interns.',
        descriptionFr:
          "Expert dans la supervision des lignes de production de beurre à l'échelle industrielle (Buttermaker) et des processus de maturation de la crème. Je dirige des équipes jusqu'à 10 personnes, gère les standards qualité clients/fournisseurs et coordonne le suivi bactériologique. En tant que mentor technique engagé, je supervise également les consommables de production et dirige la formation et le tutorat des apprentis et stagiaires.",
        type: ExperienceType.WORK,
        order: 2,
      },
      {
        year: '2016 - 2019',
        titleEn: 'Engineering Assistant – Nuclear Division',
        titleFr: 'Assistant Ingénieur – Division Nucléaire',
        company: 'Optim Industries',
        descriptionEn:
          'Updating spare parts master data for the French nuclear fleet (NTAQ 07403), I collaborate with EDF project managers to ensure data compliance via SAP and SDIN. Additionally, I have served as the lead mentor for new hires for over a year.',
        descriptionFr:
          "Mise à jour des données de référence des pièces de rechange pour le parc nucléaire français (NTAQ 07403), en collaboration avec les chefs de projet EDF pour assurer la conformité des données via SAP et SDIN. J'ai également assuré le rôle de mentor principal pour les nouvelles recrues pendant plus d'un an.",
        type: ExperienceType.WORK,
        order: 3,
      },
      // EDUCATION — plus récent en premier
      {
        year: '2025 - 2026',
        titleEn: 'Attestation of Professional Studies (AEC) – Web Development & Web App Conception',
        titleFr:
          "Attestation d'Études Professionnelles (AEC) – Développement Web & Conception d'Applications",
        company: "O'Clock school",
        descriptionEn:
          'Completed an intensive professional program focused on full-stack web development and application design, mastering modern technologies through hands-on project experience and agile methodologies.',
        descriptionFr:
          "Programme professionnel intensif axé sur le développement web full-stack et la conception d'applications, maîtrisant les technologies modernes à travers une expérience pratique de projets et des méthodologies agiles.",
        type: ExperienceType.EDUCATION,
        order: 4,
      },
      {
        year: '2015 - 2016',
        titleEn: 'Bachelor of Professional Studies – Industrial Processes and Solids Production',
        titleFr:
          "Bachelor d'Études Professionnelles – Procédés Industriels et Production de Solides",
        company: 'Université Claude Bernard Lyon 1',
        descriptionEn:
          'Acquired practical expertise through a work-study program at KEM-ONE, focusing on process optimization, industrial filtration, and the application of 5S methodology.',
        descriptionFr:
          "Expertise pratique acquise en alternance chez KEM-ONE, axée sur l'optimisation des procédés, la filtration industrielle et l'application de la méthodologie 5S.",
        type: ExperienceType.EDUCATION,
        order: 5,
      },
      {
        year: '2013 - 2016',
        titleEn: 'College Technology Diploma – Chemical Engineering & Industrial Processes',
        titleFr: 'DUT Génie chimique, génie des procédés',
        company: 'Université Claude Bernard Lyon 1',
        descriptionEn:
          'Training in industrial processes: filtration, dissolution, and manufacturing. Mastery of laboratory techniques and 5S methods applied to chemical process engineering.',
        descriptionFr:
          'Formation aux procédés industriels : filtration, dissolution et fabrication. Maîtrise des techniques de laboratoire et des méthodes 5S appliquées au génie des procédés chimiques.',
        type: ExperienceType.EDUCATION,
        order: 6,
      },
    ],
  });

  // ─── SKILLS ─────────────────────────────────────────────────────────────────

  const catBack = await prisma.skillCategory.create({
    data: { name: 'Backend', icon: 'bx-server', order: 1 },
  });
  const catFront = await prisma.skillCategory.create({
    data: { name: 'Frontend', icon: 'bx-palette', order: 2 },
  });
  const catOps = await prisma.skillCategory.create({
    data: { name: 'DevOps', icon: 'bx-cloud', order: 3 },
  });

  const D = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

  await prisma.skill.createMany({
    data: [
      // Backend
      {
        name: 'JavaScript',
        type: SkillType.MAIN,
        iconUrl: `${D}/javascript/javascript-original.svg`,
        order: 1,
        categoryId: catBack.id,
      },
      {
        name: 'TypeScript',
        type: SkillType.MAIN,
        iconUrl: `${D}/typescript/typescript-original.svg`,
        order: 2,
        categoryId: catBack.id,
      },
      {
        name: 'Node.js',
        type: SkillType.MAIN,
        iconUrl: `${D}/nodejs/nodejs-original.svg`,
        order: 3,
        categoryId: catBack.id,
      },
      {
        name: 'Express',
        type: SkillType.FRAMEWORK,
        iconUrl: `${D}/express/express-original-wordmark.svg`,
        order: 4,
        categoryId: catBack.id,
        parent: 'Node.js',
      },
      {
        name: 'PostgreSQL',
        type: SkillType.MAIN,
        iconUrl: `${D}/postgresql/postgresql-original.svg`,
        order: 5,
        categoryId: catBack.id,
      },
      {
        name: 'Prisma',
        type: SkillType.FRAMEWORK,
        iconUrl: `${D}/prisma/prisma-original.svg`,
        order: 6,
        categoryId: catBack.id,
        parent: 'PostgreSQL',
      },
      {
        name: 'Sequelize',
        type: SkillType.FRAMEWORK,
        iconUrl: `${D}/sequelize/sequelize-original.svg`,
        order: 7,
        categoryId: catBack.id,
        parent: 'Node.js',
      },
      {
        name: 'Python',
        type: SkillType.MAIN,
        iconUrl: `${D}/python/python-original.svg`,
        order: 8,
        categoryId: catBack.id,
      },
      {
        name: 'SQL',
        type: SkillType.MAIN,
        iconUrl: `${D}/postgresql/postgresql-original.svg`,
        order: 9,
        categoryId: catBack.id,
      },
      {
        name: 'PHP',
        type: SkillType.LEARNING,
        iconUrl: `${D}/php/php-original.svg`,
        order: 10,
        categoryId: catBack.id,
      },

      // Frontend
      {
        name: 'JavaScript',
        type: SkillType.MAIN,
        iconUrl: `${D}/javascript/javascript-original.svg`,
        order: 1,
        categoryId: catFront.id,
      },
      {
        name: 'TypeScript',
        type: SkillType.MAIN,
        iconUrl: `${D}/typescript/typescript-original.svg`,
        order: 2,
        categoryId: catFront.id,
      },
      {
        name: 'Svelte',
        type: SkillType.MAIN,
        iconUrl: `${D}/svelte/svelte-original.svg`,
        order: 3,
        categoryId: catFront.id,
      },
      {
        name: 'SvelteKit',
        type: SkillType.FRAMEWORK,
        iconUrl: `${D}/svelte/svelte-original.svg`,
        order: 4,
        categoryId: catFront.id,
        parent: 'Svelte',
      },
      {
        name: 'React',
        type: SkillType.MAIN,
        iconUrl: `${D}/react/react-original.svg`,
        order: 5,
        categoryId: catFront.id,
      },
      {
        name: 'Next.js',
        type: SkillType.FRAMEWORK,
        iconUrl: `${D}/nextjs/nextjs-original.svg`,
        order: 6,
        categoryId: catFront.id,
        parent: 'React',
      },
      {
        name: 'SCSS / CSS',
        type: SkillType.MAIN,
        iconUrl: `${D}/sass/sass-original.svg`,
        order: 7,
        categoryId: catFront.id,
      },
      {
        name: 'HTML',
        type: SkillType.MAIN,
        iconUrl: `${D}/html5/html5-original.svg`,
        order: 8,
        categoryId: catFront.id,
      },

      // DevOps
      {
        name: 'Docker',
        type: SkillType.MAIN,
        iconUrl: `${D}/docker/docker-original.svg`,
        order: 1,
        categoryId: catOps.id,
      },
      {
        name: 'Railway',
        type: SkillType.MAIN,
        iconUrl: '/icons/railway.svg',
        order: 2,
        categoryId: catOps.id,
      },
      {
        name: 'Nginx',
        type: SkillType.MAIN,
        iconUrl: `${D}/nginx/nginx-original.svg`,
        order: 3,
        categoryId: catOps.id,
      },
      {
        name: 'Git / GitHub',
        type: SkillType.MAIN,
        iconUrl: `${D}/git/git-original.svg`,
        order: 4,
        categoryId: catOps.id,
      },
      {
        name: 'CI/CD',
        type: SkillType.MAIN,
        iconUrl: `${D}/githubactions/githubactions-original.svg`,
        order: 5,
        categoryId: catOps.id,
      },
      {
        name: 'YAML',
        type: SkillType.MAIN,
        iconUrl: '/icons/yaml.svg',
        order: 6,
        categoryId: catOps.id,
      },
    ],
  });

  // ─── PROJECTS ───────────────────────────────────────────────────────────────

  await prisma.project.createMany({
    data: [
      {
        titleEn: 'Fullstack Portfolio',
        titleFr: 'Portfolio Fullstack',
        descriptionEn:
          'This portfolio — Svelte + Express + PostgreSQL architecture, self-hosted on a Raspberry Pi via Docker, Nginx reverse proxy and Cloudflare tunnel.',
        descriptionFr:
          'Ce portfolio — architecture Svelte + Express + PostgreSQL, auto-hébergé sur Raspberry Pi via Docker, reverse proxy Nginx et tunnel Cloudflare.',
        techStack: 'Svelte, Node.js, Prisma, PostgreSQL, Docker, Nginx, Cloudflare',
        imageUrl: 'https://picsum.photos/seed/portfolio/800/400',
        githubUrl: 'https://github.com/Alithiel31/portofolio',
        demoUrl: 'https://alithiel31.dev',
        featured: true,
        status: ProjectStatus.COMPLETED,
        order: 1,
      },
      {
        titleEn: 'GenevaWillBeBlue',
        titleFr: 'GenevaWillBeBlue',
        descriptionEn:
          'Logistics and information platform for the Ingress gaming community event in Geneva (June 2026).',
        descriptionFr:
          "Plateforme logistique et d'information pour l'événement de la communauté de jeu Ingress à Genève (juin 2026).",
        techStack: 'Svelte 5, TypeScript, SCSS, Sequelize, PostgreSQL, Railway',
        imageUrl: 'https://picsum.photos/seed/geneva/800/400',
        githubUrl: 'https://github.com/Alithiel31/GenevaWillBeBlueV2',
        demoUrl: 'https://genevawillbebluev2-production.up.railway.app/',
        featured: true,
        status: ProjectStatus.COMPLETED,
        order: 2,
      },
      {
        titleEn: 'SkillFusion',
        titleFr: 'SkillFusion',
        descriptionEn:
          'DIY educational platform built in a team (agile, Professional Title). Full 3-tier architecture: SvelteKit (Svelte 5 + runes), Express TypeScript, PostgreSQL/Prisma. 4 user roles, 8 tables, hardened security (Argon2, Zod, Helmet, rate-limiting, XSS sanitization).',
        descriptionFr:
          'Plateforme éducative DIY développée en équipe (méthode agile, Titre Professionnel). Architecture 3-tier complète : SvelteKit (Svelte 5 + runes), Express TypeScript, PostgreSQL/Prisma. 4 rôles utilisateurs, 8 tables, sécurité renforcée (Argon2, Zod, Helmet, rate-limiting, sanitization XSS).',
        techStack: 'SvelteKit, TypeScript, Express, PostgreSQL, Prisma, Docker, Railway',
        imageUrl: 'https://picsum.photos/seed/skillfusion/800/400',
        githubUrl: 'https://github.com/Alithiel31/SkillFusion',
        demoUrl: 'https://skillfusion-client-production.up.railway.app/',
        featured: true,
        status: ProjectStatus.COMPLETED,
        order: 3,
      },
      {
        titleEn: 'WeatherQC',
        titleFr: 'Météo Québec',
        descriptionEn:
          'Weather forecast app for Quebec — hourly & 7-day forecasts, animated cloud/radar map, postal code search, and PWA support. Deployed on a Raspberry Pi via Docker, Nginx reverse proxy, and Cloudflare tunnel.',
        descriptionFr:
          'Application météo pour le Québec — prévisions horaires et sur 7 jours, carte animée nuages/radar, recherche par code postal et support PWA. Déployée sur Raspberry Pi via Docker, reverse proxy Nginx et tunnel Cloudflare.',
        techStack: 'Svelte 5, TypeScript, Express, Node.js, Docker, Nginx, Cloudflare',
        imageUrl: 'https://picsum.photos/seed/weatherqc/800/400',
        githubUrl: 'https://github.com/Alithiel31/WeatherQC',
        demoUrl: 'https://qcweather.alithiel31.dev',
        featured: true,
        status: ProjectStatus.COMPLETED,
        order: 4,
      },
      {
        titleEn: 'ParseAndCutV2',
        titleFr: 'ParseAndCutV2',
        descriptionEn:
          'AI-powered tool using the Groq API to transcribe and summarize audio files into professional summary sheets.',
        descriptionFr:
          "Outil propulsé par l'IA utilisant l'API Groq pour transcrire et résumer des fichiers audio en fiches de synthèse professionnelles.",
        techStack: 'Python, JavaScript, HTML/CSS, Docker, GitHub Actions',
        imageUrl: 'https://picsum.photos/seed/parseandcut/800/400',
        githubUrl: 'https://github.com/Alithiel31/ParseAndCutV2',
        demoUrl: 'https://parseandcut.alithiel31.dev/',
        featured: false,
        status: ProjectStatus.COMPLETED,
        order: 5,
      },
      {
        titleEn: 'ThyFollow',
        titleFr: 'ThyFollow',
        descriptionEn:
          'Thyroid tracking app inspired by Clue. Daily journal (energy, mood, symptoms), blood test tracking with evolution charts (TSH, FT4, FT3), medication management and medical calendar.',
        descriptionFr:
          "Application de suivi thyroïdien inspirée de Clue. Journal quotidien (énergie, humeur, symptômes), suivi des analyses sanguines avec graphiques d'évolution (TSH, FT4, FT3), gestion des médicaments et agenda médical.",
        techStack:
          'React 18, TypeScript, Express, PostgreSQL, Prisma, Zustand, TanStack Query, Recharts, Railway',
        imageUrl: 'https://picsum.photos/seed/thyfollow/800/400',
        githubUrl: 'https://github.com/Alithiel31/ThyFollow',
        demoUrl: 'https://thyrotrack.alithiel31.dev/',
        featured: false,
        status: ProjectStatus.COMPLETED,
        order: 6,
      },
      {
        titleEn: 'TheMachine',
        titleFr: 'TheMachine',
        descriptionEn:
          'Fan-made personal project: recreation of "The Machine" interface from the Person of Interest series, connected to the Bluesky API for real-time social network monitoring.',
        descriptionFr:
          'Projet personnel fan-made : reproduction de l\'interface de "La Machine" de la série Person of Interest, connectée à l\'API Bluesky pour une surveillance en temps réel du réseau social.',
        techStack: 'JavaScript',
        imageUrl: 'https://picsum.photos/seed/themachine/800/400',
        githubUrl: 'https://github.com/Alithiel31/TheMachine',
        demoUrl: null,
        featured: false,
        status: ProjectStatus.IN_PROGRESS,
        order: 7,
      },
      {
        titleEn: 'Le Fournil',
        titleFr: 'Le Fournil',
        descriptionEn:
          'PWA for bakery production management, driven by Excel spreadsheet import. Custom formula engine validates the import (788/788 formulas reproduced), optional AI sheet classification via Claude Haiku, fuzzy matching between recipes/weights and products.',
        descriptionFr:
          "PWA de gestion de production pour fournil, pilotée par injection de tableur Excel. Moteur de formules maison pour valider l'import (788/788 formules reproduites), classification IA optionnelle des feuilles via Claude Haiku, rapprochement flou entre recettes/poids et produits.",
        techStack:
          'SvelteKit, Svelte 5, TypeScript, Express, Prisma, PostgreSQL, Docker, Cloudflare Tunnel',
        imageUrl: 'https://picsum.photos/seed/fournilapp/800/400',
        githubUrl: 'https://github.com/Alithiel31/FournilApp',
        demoUrl: 'https://fournilapp.alithiel31.dev',
        featured: true,
        status: ProjectStatus.COMPLETED,
        order: 8,
      },
      {
        titleEn: 'J.Moulin Planner',
        titleFr: 'Planificateur J.Moulin',
        descriptionEn:
          'Collaborative planning tool with role-based access (Admin/TeamLead/TeamMate), team management, tasks with deadlines and fixed events on a shared timeline. Demo accounts — Admin: admin / admin123 · TeamLead: teamlead / lead123 · TeamMate: user1 / user123.',
        descriptionFr:
          "Outil de planification collaboratif avec gestion des rôles (Admin/TeamLead/TeamMate), gestion d'équipes, tâches avec deadlines et événements fixes sur une frise partagée. Comptes de démo — Admin : admin / admin123 · TeamLead : teamlead / lead123 · TeamMate : user1 / user123.",
        techStack:
          'SvelteKit, Svelte 5, Tailwind CSS, TypeScript, Express, Prisma, PostgreSQL, Docker, Nginx',
        imageUrl: 'https://picsum.photos/seed/jmoulinplanner/800/400',
        githubUrl: 'https://github.com/Alithiel31/J-Moulin-Planner',
        demoUrl: 'https://resplanner.alithiel31.dev/',
        featured: false,
        status: ProjectStatus.COMPLETED,
        order: 9,
      },
    ],
  });

  // ─── SERVICES ───────────────────────────────────────────────────────────────

  await prisma.service.createMany({
    data: [
      {
        titleEn: 'Web Development',
        titleFr: 'Développement Web',
        descriptionEn:
          'Design and development of modern, performant, responsive web applications. From MVP to production.',
        descriptionFr:
          "Conception et développement d'applications web modernes, performantes et responsive. Du MVP à la production.",
        icon: 'bx-code-block',
        order: 1,
      },
      {
        titleEn: 'Backend Architecture',
        titleFr: 'Architecture Backend',
        descriptionEn:
          'Design of robust REST APIs, database modeling, performance optimization and scalability.',
        descriptionFr:
          "Design d'APIs REST robustes, modélisation BDD, optimisation des performances et scalabilité.",
        icon: 'bx-server',
        order: 2,
      },
      {
        titleEn: 'Technical Consulting',
        titleFr: 'Conseil Technique',
        descriptionEn:
          'Code audits, technology stack decisions, and support for teams in their digital transformation projects.',
        descriptionFr:
          "Audit de code, choix technologiques, accompagnement d'équipes dans leurs projets de transformation digitale.",
        icon: 'bx-bulb',
        order: 3,
      },
      {
        titleEn: 'DevOps & Deployment',
        titleFr: 'DevOps & Déploiement',
        descriptionEn:
          'CI/CD pipeline setup, Docker containerization, and deployment — whether self-hosted or cloud-based.',
        descriptionFr:
          'Mise en place de pipelines CI/CD, containerisation Docker, et déploiement — auto-hébergé ou cloud.',
        icon: 'bx-cloud-upload',
        order: 4,
      },
    ],
  });

  console.log(`✅ Seed terminé — profil "${profile.name}" créé`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
