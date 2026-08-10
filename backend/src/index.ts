import prisma from './prisma.js';
import { app } from './app.js';
import { startRetentionJob } from './utils/retention.js';

const PORT = Number(process.env.PORT) || 3001;
const isProd = process.env.NODE_ENV === 'production';

// ── Lancement du serveur ──────────────────────────────────────────────────────
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('------------------------------------------------------------');
  console.log(`🚀 SERVER IS LIVE!`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Mode: ${isProd ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`🔗 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log('------------------------------------------------------------');
});

// Purge des PageView au-delà de 25 mois : condition de la dispense de consentement annoncée
// dans la politique de confidentialité.
startRetentionJob();

// ── Arrêt gracieux ────────────────────────────────────────────────────────────
// `deploy.yml` recrée les conteneurs à chaque push sur main : on ferme proprement les connexions
// en cours et le pool Prisma plutôt que de se faire SIGKILL au bout du délai de grâce Docker.
let shuttingDown = false;
for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`\n${signal} reçu — arrêt en cours…`);

    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });

    // `server.close()` attend la fermeture de chaque connexion : sans ça, un simple onglet
    // ouvert en keep-alive suffirait à faire traîner l'arrêt jusqu'au délai de grâce Docker.
    server.closeIdleConnections();

    // Filet de sécurité pour les requêtes encore en vol.
    setTimeout(() => {
      server.closeAllConnections();
      process.exit(1);
    }, 10_000).unref();
  });
}
