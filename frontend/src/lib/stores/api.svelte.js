import { locale } from './locale.svelte.js';

// En prod : URL relative (même domaine qu'Express). En dev : proxy Vite → port 3001.
const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function apiFetch(endpoint) {
  const url = `${API_BASE}/api${endpoint}?locale=${locale.current}`;
  if (import.meta.env.DEV) console.log(`[API Call]: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur API ${res.status} sur ${endpoint}`);
  return res.json();
}

export function createApiStore(endpoint) {
  let data = $state(null);
  let loading = $state(true);
  let error = $state(null);

  async function load() {
    loading = true;
    error = null;
    try {
      data = await apiFetch(endpoint);
    } catch (e) {
      error = e.message;
      console.error(`Erreur Store ${endpoint}:`, e);
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
    reload: load,
  };
}
