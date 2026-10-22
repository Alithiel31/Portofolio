import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import fallbackEn from './lib/data/fallback.en.json';

// Avant l'import d'App : les stores de langue et de mesure d'audience lisent le stockage au
// chargement du module. (Pas de vi.resetModules : il dupliquerait le runtime Svelte.)
localStorage.setItem('analytics-opt-out', '1');
localStorage.setItem('locale', 'en');
const { default: App } = await import('./App.svelte');

function jsonResponse(body, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(body), { status }));
}

describe('App', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads the whole home page with a single /api/portfolio call', async () => {
    const fetchMock = vi.fn((_url) =>
      jsonResponse({ ...fallbackEn, profile: { ...fallbackEn.profile, name: 'From API' } }),
    );
    vi.stubGlobal('fetch', fetchMock);
    render(App);

    expect(await screen.findAllByText('From API')).not.toHaveLength(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe('/api/portfolio?locale=en');
  });

  it('falls back to the bundled content instead of an error screen when the API is down', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))),
    );
    const { container } = render(App);

    expect(await screen.findAllByText(fallbackEn.profile.name)).not.toHaveLength(0);
    await waitFor(() => expect(container.querySelector('#projects')).not.toBeNull());
    expect(container.querySelector('.api-error')).toBeNull();
  });
});
