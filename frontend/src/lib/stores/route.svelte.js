// Routeur minimal pour les pages légales.
//
// Le site reste une page unique (pile de cartes) ; ce store ne sert qu'à basculer entre
// l'accueil et les trois documents juridiques, qui ont besoin d'URLs partageables et
// indexables. Le fallback SPA de nginx.conf (`try_files $uri $uri/ /index.html`) garantit
// que ces chemins renvoient bien index.html en accès direct.

export const ROUTES = {
  HOME: '/',
  LEGAL: '/mentions-legales',
  PRIVACY: '/confidentialite',
  TERMS: '/cgu',
};

const KNOWN = new Set(Object.values(ROUTES));

/** Tout chemin inconnu retombe sur l'accueil : nginx sert déjà index.html partout. */
function normalize(pathname) {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return KNOWN.has(clean) ? clean : ROUTES.HOME;
}

let _path = $state(normalize(window.location.pathname));

window.addEventListener('popstate', () => {
  _path = normalize(window.location.pathname);
});

export const route = {
  get path() {
    return _path;
  },
  go(path) {
    const next = normalize(path);
    if (next === _path) return;
    window.history.pushState({}, '', next);
    _path = next;
    window.scrollTo(0, 0);
  },
};

/**
 * À poser sur les `<a>` internes : conserve un vrai href (clic milieu, ouverture dans un
 * nouvel onglet, indexation) tout en évitant le rechargement complet sur un clic normal.
 */
export function navigate(event, path) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
  event.preventDefault();
  route.go(path);
}
