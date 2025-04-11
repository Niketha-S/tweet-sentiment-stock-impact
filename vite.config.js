import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  base: '/tweet-sentiment-stock-impact/', // 👈 Add this line
  plugins: [svelte()],
})
