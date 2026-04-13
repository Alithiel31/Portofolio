// On tente de récupérer la variable Docker, sinon on force le localhost:3001
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function apiFetch(endpoint) {
  // On construit l'URL absolue pour éviter de taper sur le port 5173 du frontend
  const url = `${API_BASE}/api${endpoint}`;
  
  // Petit log de debug pour confirmer l'URL dans ta console de navigateur
  console.log(`[API Call]: ${url}`);

  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error(`Erreur API ${res.status} sur ${endpoint}`);
  }
  
  return res.json();
}

/**
 * Store réactif Svelte 5 (Runes)
 */
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

  // Premier chargement
  load();

  return {
    get data() { return data },
    get loading() { return loading },
    get error() { return error },
    reload: load,
  };
}