// Utilitaire fetch générique avec gestion d'erreur
async function apiFetch(endpoint) {
  const res = await fetch(`/api${endpoint}`)
  if (!res.ok) throw new Error(`API ${endpoint} → ${res.status}`)
  return res.json()
}

// Crée un store réactif Svelte 5 pour n'importe quel endpoint
export function createApiStore(endpoint) {
  let data = $state(null)
  let loading = $state(true)
  let error = $state(null)

  async function load() {
    loading = true
    error = null
    try {
      data = await apiFetch(endpoint)
    } catch (e) {
      error = e.message
      console.error(`Store ${endpoint}:`, e)
    } finally {
      loading = false
    }
  }

  load()

  return {
    get data() { return data },
    get loading() { return loading },
    get error() { return error },
    reload: load,
  }
}
