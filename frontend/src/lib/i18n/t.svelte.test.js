import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('t()', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('resolves a nested key in the current locale', async () => {
    const { locale } = await import('../stores/locale.svelte.js');
    const { t } = await import('./t.svelte.js');
    locale.set('fr');
    expect(t('nav.contact')).toBe('Contact');
    locale.set('en');
    expect(t('nav.contact')).toBe('Contact');
  });

  it('falls back to the key itself when the path does not exist', async () => {
    const { t } = await import('./t.svelte.js');
    expect(t('nope.missing')).toBe('nope.missing');
  });

  it('falls back to english for an unsupported locale', async () => {
    const { locale } = await import('../stores/locale.svelte.js');
    const { t } = await import('./t.svelte.js');
    const before = t('hero.downloadCv');
    locale.set('de');
    expect(t('hero.downloadCv')).toBe(before);
  });
});
