const SUPPORTED = ['fr', 'en'];
const DEFAULT = 'en';
const SITE = 'https://alithiel31.dev';

// Stockage indisponible (mode privé strict, cookies bloqués) : getItem/setItem lèvent. La langue
// doit rester utilisable pour la session en cours, comme pour analytics.svelte.js.
function readSaved() {
  try {
    return localStorage.getItem('locale');
  } catch {
    return null;
  }
}

/** `?lang=fr|en` : URL explicite par langue, celle que déclarent les balises hreflang. */
function readQuery() {
  return new URLSearchParams(window.location.search).get('lang');
}

function detect() {
  const fromQuery = readQuery();
  if (SUPPORTED.includes(fromQuery)) return fromQuery;
  const saved = readSaved();
  if (saved && SUPPORTED.includes(saved)) return saved;
  const lang = navigator.language?.slice(0, 2);
  return SUPPORTED.includes(lang) ? lang : DEFAULT;
}

/**
 * Sur l'accueil, aligne l'URL (`?lang=`) et la balise canonical sur la langue affichée : chaque
 * version linguistique a ainsi une URL propre et partageable, et la canonical d'une page
 * `?lang=en` ne la déclare plus doublon de `/` (ce qui contredirait les hreflang).
 */
function syncUrl(lang, { rewrite }) {
  if (window.location.pathname !== '/') return;
  if (rewrite) {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState(window.history.state, '', url);
  }
  if (!SUPPORTED.includes(readQuery())) return;
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${SITE}/?lang=${lang}`);
}

const initial = detect();
let _locale = $state(initial);
document.documentElement.lang = initial;
syncUrl(initial, { rewrite: false });

export const locale = {
  get current() {
    return _locale;
  },
  set(lang) {
    if (!SUPPORTED.includes(lang)) return;
    _locale = lang;
    try {
      localStorage.setItem('locale', lang);
    } catch {
      // Rien à persister : la langue choisie vaut pour la session en cours.
    }
    document.documentElement.lang = lang;
    syncUrl(lang, { rewrite: true });
  },
};
