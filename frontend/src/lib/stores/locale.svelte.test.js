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

  it('set() ignores unsupported locales', async () => {
    setNavigatorLanguage('en-US');
    const { locale } = await import('./locale.svelte.js');
    locale.set('de');
    expect(locale.current).toBe('en');
    expect(localStorage.getItem('locale')).toBeNull();
  });
});
