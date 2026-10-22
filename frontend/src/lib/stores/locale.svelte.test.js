import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

function setNavigatorLanguage(lang) {
  Object.defineProperty(window.navigator, 'language', {
    value: lang,
    configurable: true,
  });
}

describe('locale store', () => {
  const originalLanguage = window.navigator.language;

  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
    document.head.innerHTML = '<link rel="canonical" href="https://alithiel31.dev/" />';
    vi.resetModules();
  });

  afterEach(() => {
    setNavigatorLanguage(originalLanguage);
  });

  it('defaults to en when nothing saved and the browser language is unsupported', async () => {
    setNavigatorLanguage('de');
    const { locale } = await import('./locale.svelte.js');
    expect(locale.current).toBe('en');
  });

  it('picks up the browser language when supported', async () => {
    setNavigatorLanguage('fr-FR');
    const { locale } = await import('./locale.svelte.js');
    expect(locale.current).toBe('fr');
  });

  it('prefers a previously saved locale over the browser language', async () => {
    localStorage.setItem('locale', 'fr');
    setNavigatorLanguage('en-US');
    const { locale } = await import('./locale.svelte.js');
    expect(locale.current).toBe('fr');
  });

  it('set() switches the current locale and persists it', async () => {
    setNavigatorLanguage('en-US');
    const { locale } = await import('./locale.svelte.js');
    locale.set('fr');
    expect(locale.current).toBe('fr');
    expect(localStorage.getItem('locale')).toBe('fr');
  });

  it('keeps <html lang> in sync with the current locale', async () => {
    setNavigatorLanguage('fr-FR');
    const { locale } = await import('./locale.svelte.js');
    expect(document.documentElement.lang).toBe('fr');
    locale.set('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('falls back to the browser language when localStorage is unavailable', async () => {
    setNavigatorLanguage('fr-FR');
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    const { locale } = await import('./locale.svelte.js');
    expect(locale.current).toBe('fr');
    spy.mockRestore();
  });

  it('set() does not throw and still switches when localStorage.setItem throws', async () => {
    setNavigatorLanguage('en-US');
    const { locale } = await import('./locale.svelte.js');
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError');
    });
    expect(() => locale.set('fr')).not.toThrow();
    expect(locale.current).toBe('fr');
    expect(document.documentElement.lang).toBe('fr');
    spy.mockRestore();
  });

  it('?lang= wins over localStorage and the browser language', async () => {
    localStorage.setItem('locale', 'fr');
    setNavigatorLanguage('fr-FR');
    window.history.replaceState({}, '', '/?lang=en');
    const { locale } = await import('./locale.svelte.js');
    expect(locale.current).toBe('en');
    expect(document.querySelector('link[rel="canonical"]').getAttribute('href')).toBe(
      'https://alithiel31.dev/?lang=en',
    );
  });

  it('ignores an unsupported ?lang= value and keeps the canonical untouched', async () => {
    setNavigatorLanguage('fr-FR');
    window.history.replaceState({}, '', '/?lang=de');
    const { locale } = await import('./locale.svelte.js');
    expect(locale.current).toBe('fr');
    expect(document.querySelector('link[rel="canonical"]').getAttribute('href')).toBe(
      'https://alithiel31.dev/',
    );
  });

  it('set() reflects the language in the home URL and the canonical', async () => {
    setNavigatorLanguage('en-US');
    const { locale } = await import('./locale.svelte.js');
    locale.set('fr');
    expect(window.location.search).toBe('?lang=fr');
    expect(document.querySelector('link[rel="canonical"]').getAttribute('href')).toBe(
      'https://alithiel31.dev/?lang=fr',
    );
  });

  it('set() leaves the URL of a legal page alone', async () => {
    setNavigatorLanguage('en-US');
    window.history.replaceState({}, '', '/cgu');
    const { locale } = await import('./locale.svelte.js');
    locale.set('fr');
    expect(window.location.pathname + window.location.search).toBe('/cgu');
  });

  it('set() ignores unsupported locales', async () => {
    setNavigatorLanguage('en-US');
    const { locale } = await import('./locale.svelte.js');
    locale.set('de');
    expect(locale.current).toBe('en');
    expect(localStorage.getItem('locale')).toBeNull();
  });
});
