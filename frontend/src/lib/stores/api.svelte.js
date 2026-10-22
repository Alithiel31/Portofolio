import { locale } from './locale.svelte.js';

// En prod : URL relative (même domaine qu'Express). En dev : proxy Vite → port 3001.
const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function apiFetch(endpoint) {
  const url = `${API_BASE}/api${endpoint}?locale=${locale.current}`;
  if (import.meta.env.DEV) console.log(`[API Call]: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur API ${res.status} sur ${endpoint}`);
  const data = await res.json();
  // Un backend qui répond 200 avec un corps vide/malformé ne doit pas se propager tel quel :
  // les composants s'attendent tous à un objet ou un tableau, jamais à null/undefined.
  if (data == null) throw new Error(`Réponse vide de l'API sur ${endpoint}`);
  return data;
}

/**
 * @param {string} endpoint
 * @param {{ fallback?: (locale: string) => Promise<unknown> }} [options]
 *   `fallback` : données de repli chargées si l'API échoue. Le store expose alors ces données
 *   sans erreur, avec `degraded` à true, plutôt qu'un écran d'erreur.
 */
export function createApiStore(endpoint, { fallback } = {}) {
  let data = $state(null);
  let loading = $state(true);
  let error = $state(null);
  let degraded = $state(false);

  async function load() {
    loading = true;
    error = null;
    try {
      data = await apiFetch(endpoint);
      degraded = false;
    } catch (e) {
      console.error(`Erreur Store ${endpoint}:`, e);
      try {
        if (!fallback) throw e;
        data = await fallback(locale.current);
        degraded = true;
      } catch {
        error = e.message;
      }
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    locale.current;
    load();
  });

  return {
    get data() {
      return data;
    },
    get loading() {
      return loading;
    },
    get error() {
      return error;
    },
    get degraded() {
      return degraded;
    },
    reload: load,
  };
}
