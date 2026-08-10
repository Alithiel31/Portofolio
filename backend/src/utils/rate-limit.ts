import { createHash, randomBytes } from 'node:crypto';

/**
 * Rate limiter en mémoire, à clé hashée.
 *
 * L'IP appelante n'est jamais conservée en clair : elle est hashée (SHA-256 salé) avant de servir
 * de clé, si bien qu'aucune adresse lisible ne subsiste dans le process. Le sel est fourni par
 * `RATE_LIMIT_SALT` ; à défaut, il est tiré aléatoirement au démarrage — les compteurs repartent
 * alors de zéro à chaque redémarrage, ce qui est acceptable pour un portfolio.
 *
 * Les entrées expirées sont purgées périodiquement : sans ça, la Map grossit indéfiniment,
 * une entrée par IP distincte, pour la durée de vie du process.
 */

const SALT = process.env.RATE_LIMIT_SALT || randomBytes(16).toString('hex');

function hashKey(ip: string): string {
  return createHash('sha256').update(SALT).update(ip).digest('base64url').slice(0, 22);
}

export interface RateLimitOptions {
  /** Durée de la fenêtre glissante, en millisecondes. */
  windowMs: number;
  /** Nombre de requêtes autorisées par fenêtre. */
  max: number;
}

/** Renvoie une fonction `check(ip)` → `true` si la requête passe, `false` si elle est limitée. */
export function createRateLimiter({ windowMs, max }: RateLimitOptions) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  let lastPurge = Date.now();

  function purge(now: number): void {
    for (const [key, entry] of hits) {
      if (now > entry.resetAt) hits.delete(key);
    }
    lastPurge = now;
  }

  return function check(ip: string): boolean {
    const now = Date.now();
    if (now - lastPurge > windowMs) purge(now);

    const key = hashKey(ip);
    const entry = hits.get(key);

    if (!entry || now > entry.resetAt) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    if (entry.count >= max) return false;

    entry.count++;
    return true;
  };
}
