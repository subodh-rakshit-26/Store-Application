import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages project site base path: https://<user>.github.io/Store-Application/
  base: '/Store-Application/',
  plugins: [react()],
})
