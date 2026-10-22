import geoip from 'geoip-lite';

/**
 * Lieu affiché sur le portfolio selon la zone du visiteur. L'IP n'est utilisée qu'ici, en
 * mémoire, le temps de la résolution geoip : elle n'est ni stockée ni journalisée.
 */
export function displayLocationFor(ip: string): string {
  return geoip.lookup(ip)?.country === 'CA' ? 'Montréal, QC' : 'France';
}
