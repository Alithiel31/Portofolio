import prisma from '../prisma.js';

/**
 * Purge automatique de la table PageView.
 *
 * La mesure d'audience du site est dispensée de consentement parce qu'elle reste strictement
 * interne, sans recoupement ni IP conservée — mais cette dispense suppose aussi une durée de
 * conservation bornée. Sans ce job, les lignes s'accumulaient indéfiniment et la politique de
 * confidentialité aurait annoncé une durée que le code ne respectait pas.
 *
 * Volontairement sans dépendance de planification : un `setInterval` suffit pour une tâche
 * quotidienne, à l'image du rate limiter maison qui purge lui aussi ses entrées à la main.
 */

const RETENTION_MONTHS = 25;
const INTERVAL_MS = 24 * 60 * 60 * 1000;

function cutoffDate(): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - RETENTION_MONTHS);
  return date;
}

export async function purgeExpiredPageViews(): Promise<number> {
  const { count } = await prisma.pageView.deleteMany({
    where: { createdAt: { lt: cutoffDate() } },
  });
  if (count > 0) {
    console.log(`[retention] ${count} PageView de plus de ${RETENTION_MONTHS} mois supprimées`);
  }
  return count;
}

/** Lance la purge au démarrage, puis une fois par jour. Renvoie de quoi arrêter le timer. */
export function startRetentionJob(): NodeJS.Timeout {
  void purgeExpiredPageViews().catch((err) =>
    console.error('[retention] purge initiale échouée', err),
  );

  const timer = setInterval(() => {
    void purgeExpiredPageViews().catch((err) =>
      console.error('[retention] purge périodique échouée', err),
    );
  }, INTERVAL_MS);

  // Ne pas maintenir le process en vie uniquement pour ce timer.
  timer.unref();
  return timer;
}
