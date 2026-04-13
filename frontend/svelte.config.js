import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess({
    scss: {
      // Cela permet à Sass de regarder dans le dossier src pour les imports
      includePaths: ['src'],
    },
  }),
}