import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      // Ce raccourci dit à Vite : "$styles" = "src/lib/styles"
      '$styles': path.resolve(__dirname, './src/styles'),
      '$lib': path.resolve(__dirname, './src/lib')
    }
  }
})