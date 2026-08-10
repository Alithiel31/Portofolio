import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { compression } from 'vite-plugin-compression2';
import path from 'path';

export default defineConfig({
  plugins: [
    svelte(),
    // Pré-compresse les assets buildés en .gz ; nginx (gzip_static) les sert tels quels au
    // lieu de compresser à la volée à chaque requête — non négligeable sur le CPU limité
    // du Raspberry Pi qui héberge la prod.
    compression({ algorithms: ['gzip'], threshold: 1024 }),
  ],
  resolve: {
    alias: {
      // Ce raccourci dit à Vite : "$styles" = "src/lib/styles"
      $styles: path.resolve(__dirname, './src/styles'),
      $lib: path.resolve(__dirname, './src/lib'),
    },
  },
  server: {
    // En dev : proxy /api → Express (port 3001) pour éviter les problèmes CORS
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
