import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '$styles': path.resolve(__dirname, './src/lib/styles'),
      '$lib': path.resolve(__dirname, './src/lib')
    }
  },
  server: {
    // En dev : proxy /api → Express (port 3001) pour éviter les problèmes CORS
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})