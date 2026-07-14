const SUPPORTED = ['fr', 'en'];
const DEFAULT = 'en';

function detect() {
  const saved = localStorage.getItem('locale');
  if (saved && SUPPORTED.includes(saved)) return saved;
  const lang = navigator.language?.slice(0, 2);
  return SUPPORTED.includes(lang) ? lang : DEFAULT;
}

let _locale = $state(detect());

export const locale = {
  get current() {
    return _locale;
  },
  set(lang) {
    if (!SUPPORTED.includes(lang)) return;
    _locale = lang;
    localStorage.setItem('locale', lang);
  },
};
