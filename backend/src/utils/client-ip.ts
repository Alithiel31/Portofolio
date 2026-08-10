import type { Request } from 'express';

/**
 * Résolution de l'IP appelante.
 *
 * ⚠️ Cette valeur est volontairement éphémère : elle sert uniquement, le temps d'un handler,
 * à dériver un pays via geoip-lite ou à indexer le rate limiter (sous forme hashée).
 * Elle n'est jamais persistée en base ni écrite dans les logs.
 *
 * Chaîne de proxy réelle en production : Cloudflare → nginx (hôte) → nginx (conteneur) → Express.
 * `CF-Connecting-IP` est posé par Cloudflare et reste l'en-tête le plus fiable ; on retombe
 * sinon sur `req.ip`, qu'Express dérive de `X-Forwarded-For` (voir `app.set('trust proxy', …)`).
 *
 * Note : `CF-Connecting-IP` n'est digne de confiance que si l'origine n'est joignable qu'à
 * travers Cloudflare. Si le RPi est exposé en direct, restreindre l'accès aux plages d'IP
 * Cloudflare au niveau du pare-feu.
 */

const IPV4 = /^(\d{1,3}\.){3}\d{1,3}$/;

function looksLikeIp(value: string): boolean {
  return IPV4.test(value) || value.includes(':');
}

/** Ramène `::ffff:1.2.3.4` (IPv4 encapsulée en IPv6) à `1.2.3.4`, forme attendue par geoip-lite. */
function normalize(ip: string): string {
  const trimmed = ip.trim();
  return trimmed.startsWith('::ffff:') ? trimmed.slice(7) : trimmed;
}

export function getClientIp(req: Request): string {
  const header = req.headers['cf-connecting-ip'];
  const candidate = Array.isArray(header) ? header[0] : header;

  if (typeof candidate === 'string') {
    const normalized = normalize(candidate);
    if (normalized && looksLikeIp(normalized)) return normalized;
  }

  return normalize(req.ip ?? '');
}
