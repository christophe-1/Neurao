import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Nos fichiers .js contiennent du JSX : Vite les ignore par défaut, on lui demande de les lire
  oxc: {
    include: /\.js$/,
    exclude: /node_modules/,
    lang: 'jsx',
    jsx: { runtime: 'automatic' },
  },
  resolve: {
    alias: { '@': new URL('./src', import.meta.url).pathname },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.js'],
  },
})
