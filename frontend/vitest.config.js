import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $styles: path.resolve(__dirname, './src/styles'),
      $lib: path.resolve(__dirname, './src/lib'),
    },
    // Svelte 5 expose des points d'entrée distincts client/serveur ; sans forcer la
    // condition `browser`, Vitest résout côté serveur et les composants ne montent pas.
    conditions: process.env.VITEST ? ['browser'] : [],
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js'],
    setupFiles: ['./src/test-setup.js'],
  },
});
