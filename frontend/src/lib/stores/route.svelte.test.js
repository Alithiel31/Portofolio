import { describe, it, expect, beforeEach, vi } from 'vitest';

async function freshRouteAt(path) {
  vi.resetModules();
  window.history.pushState({}, '', path);
  return import('./route.svelte.js');
}

describe('route store', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('adopts a known path present at load time', async () => {
    const { route, ROUTES } = await freshRouteAt('/cgu');
    expect(route.path).toBe(ROUTES.TERMS);
  });

  it('normalizes an unknown path at load time back to home', async () => {
    const { route, ROUTES } = await freshRouteAt('/does-not-exist');
    expect(route.path).toBe(ROUTES.HOME);
  });

  it('go() navigates to a known route and updates browser history', async () => {
    const { route, ROUTES } = await freshRouteAt('/');
    route.go(ROUTES.PRIVACY);
    expect(route.path).toBe(ROUTES.PRIVACY);
    expect(window.location.pathname).toBe(ROUTES.PRIVACY);
  });

  it('go() to an unknown path falls back to home', async () => {
    const { route, ROUTES } = await freshRouteAt('/');
    route.go('/unknown');
    expect(route.path).toBe(ROUTES.HOME);
  });

  it('reacts to popstate (browser back/forward)', async () => {
    const { route, ROUTES } = await freshRouteAt('/');
    window.history.pushState({}, '', ROUTES.LEGAL);
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(route.path).toBe(ROUTES.LEGAL);
  });

  describe('navigate()', () => {
    it('prevents default and navigates on a plain left click', async () => {
      const { route, ROUTES, navigate } = await freshRouteAt('/');
      const event = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, preventDefault: vi.fn() };
      navigate(event, ROUTES.LEGAL);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(route.path).toBe(ROUTES.LEGAL);
    });

    it('lets modified clicks (e.g. ctrl+click) open normally', async () => {
      const { route, ROUTES, navigate } = await freshRouteAt('/');
      const event = { button: 0, metaKey: false, ctrlKey: true, shiftKey: false, preventDefault: vi.fn() };
      navigate(event, ROUTES.LEGAL);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(route.path).toBe(ROUTES.HOME);
    });

    it('ignores non-left-button clicks', async () => {
      const { route, ROUTES, navigate } = await freshRouteAt('/');
      const event = { button: 1, metaKey: false, ctrlKey: false, shiftKey: false, preventDefault: vi.fn() };
      navigate(event, ROUTES.LEGAL);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(route.path).toBe(ROUTES.HOME);
    });
  });
});
