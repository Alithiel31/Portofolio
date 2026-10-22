const SUPPORTED = ['fr', 'en'];
const DEFAULT = 'en';

// Stockage indisponible (mode privé strict, cookies bloqués) : getItem/setItem lèvent. La langue
// doit rester utilisable pour la session en cours, comme pour analytics.svelte.js.
function readSaved() {
  try {
    return localStorage.getItem('locale');
  } catch {
    return null;
  }
}

function detect() {
  const saved = readSaved();
  if (saved && SUPPORTED.includes(saved)) return saved;
  const lang = navigator.language?.slice(0, 2);
  return SUPPORTED.includes(lang) ? lang : DEFAULT;
}

const initial = detect();
let _locale = $state(initial);
document.documentElement.lang = initial;

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
  },
};
