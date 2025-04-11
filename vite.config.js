import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  base: '/tweet-sentiment-stock-impact/', // Ensure this is set for correct URL routing
  plugins: [svelte()],
  build: {
    outDir: 'dist', // Ensure the build output goes to the 'dist' folder
  }
})
