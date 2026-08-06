import { locale } from '../stores/locale.svelte.js';
import { legal as en } from './en.js';
import { legal as fr } from './fr.js';
import { ROUTES } from '../stores/route.svelte.js';

const documents = { en, fr };

/** Quel document juridique correspond à quelle route. */
export const DOC_BY_ROUTE = {
  [ROUTES.LEGAL]: 'mentions',
  [ROUTES.PRIVACY]: 'privacy',
  [ROUTES.TERMS]: 'terms',
};

/**
 * Renvoie le document demandé dans la langue courante, avec sa date de mise à jour.
 * Repli sur l'anglais comme dans i18n/t.svelte.js.
 */
export function legalDoc(key) {
  const dict = documents[locale.current] ?? documents.en;
  const doc = dict[key];
  if (!doc) return null;
  return { ...doc, updated: dict.updated };
}
