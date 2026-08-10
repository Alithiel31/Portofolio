import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';

afterEach(cleanup);

// jsdom ne l'implémente pas ; sans ce stub, chaque appel logue un avertissement bruyant.
window.scrollTo = () => {};
