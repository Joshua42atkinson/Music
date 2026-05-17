import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Changed from '/Daydream-website/' to '/' for Vercel
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
