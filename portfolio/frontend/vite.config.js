import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
  plugins: [svelte()],

  resolve: {
    alias: {
      '$lib':    path.resolve('./src/lib'),
      '$styles': path.resolve('./src/styles'),
    }
  },

  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE || 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  }
})
