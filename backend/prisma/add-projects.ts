import { PrismaClient, ProjectStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Script idempotent : ajoute uniquement les projets listés ci-dessous s'ils
// n'existent pas déjà (par titleEn). Utile pour mettre à jour la base de
// production sans toucher aux projets existants (le seed normal est ignoré
// une fois la base initialisée).

const projectsToAdd = [
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
  {
    titleEn: 'QualiSite',
    titleFr: 'QualiSite',
    descriptionEn:
      'Showcase site & internal management tool for a company, built during an internship: public showcase, contact form, back-office (projects, services, contacts), PDF invoicing.',
    descriptionFr:
      "Site vitrine & outil de gestion interne pour une entreprise, développé en stage : vitrine publique, formulaire de contact, back-office (projets, services, contacts), facturation PDF.",
    techStack: 'Next.js 16, React 19, TypeScript, Express 5, Prisma, PostgreSQL, Docker',
    imageUrl: 'https://picsum.photos/seed/qualisite/800/400',
    githubUrl: 'https://github.com/QualiSite/QualiSiteV1',
    demoUrl: 'https://qualisite.alithiel31.dev',
    featured: true,
    status: ProjectStatus.COMPLETED,
    order: 10,
  },
  {
    titleEn: 'Minecraft-Serveur',
    titleFr: 'Minecraft-Serveur',
    descriptionEn:
      'Docker Compose deployment of a Minecraft Java vanilla server, exposed publicly via a playit.gg tunnel from a remote host.',
    descriptionFr:
      "Déploiement d'un serveur Minecraft Java vanilla via Docker Compose, avec tunnel playit.gg pour l'accès public depuis un hôte distant.",
    techStack: 'Docker, Docker Compose, playit.gg',
    imageUrl: 'https://picsum.photos/seed/minecraftserveur/800/400',
    githubUrl: 'https://github.com/Alithiel31/Minecraft-Serveur',
    demoUrl: null,
    featured: false,
    status: ProjectStatus.COMPLETED,
    order: 11,
  },
];

async function main() {
  console.log('🔄 Ajout des nouveaux projets...\n');

  for (const project of projectsToAdd) {
    const existing = await prisma.project.findFirst({ where: { titleEn: project.titleEn } });
    if (existing) {
      await prisma.project.update({ where: { id: existing.id }, data: project });
      console.log(`🔁 Déjà présent, mis à jour : ${project.titleEn}`);
    } else {
      await prisma.project.create({ data: project });
      console.log(`✅ Projet ajouté : ${project.titleEn}`);
    }
  }

  // ── ThyFollow : maintenant opérationnel, mise à jour statut + démo ──────────
  const thyFollow = await prisma.project.findFirst({ where: { titleEn: 'ThyFollow' } });
  if (thyFollow) {
    await prisma.project.update({
      where: { id: thyFollow.id },
      data: { status: ProjectStatus.COMPLETED, demoUrl: 'https://thyrotrack.alithiel31.dev/' },
    });
    console.log('✅ ThyFollow mis à jour : COMPLETED + demoUrl');
  } else {
    console.log('⏭  ThyFollow introuvable en base');
  }

  console.log('\n🎉 Terminé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur :', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
