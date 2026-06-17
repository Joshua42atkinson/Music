import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false,
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'assets/**/*'],
      manifest: {
        name: 'Voix Vive Academy',
        short_name: 'Voix Vive',
        description: 'Sovereign Whole-Person Music Academy',
        theme_color: '#050508',
        background_color: '#050508',
        display: 'standalone',
        icons: [
          {
            src: 'assets/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'assets/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Only cache app shell + small assets — NOT audio/video/models
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
        globIgnores: [
          '**/*.gguf',
          '**/*.mp3',
          '**/*.mp4',
          '**/*.wav',
          '**/*.ogg',
          '**/*.m4a',
          '**/*.pdf',
          '**/*.jpg',
          '**/*.jpeg',
          'models/**',
          'training/**',
          'assets/slides/**',
          'assets/downloads/**',
          'assets/adventures/**',
          'assets/test_clips/**',
          'assets/bertrand_ref*',
          'assets/home_audio*',
        ],
        maximumFileSizeToCacheInBytes: 3_000_000, // 3 MB — blocks Kokoro WASM from precache
        runtimeCaching: [
          {
            // Audio: cache-first, max 20 entries, 30 days
            urlPattern: /\.(?:mp3|wav|ogg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
    })
  ],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — loads first, cached aggressively
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
          // Heavy ML/AI libs — only loaded when AI features are triggered
          'ai-transformers': ['@huggingface/transformers', 'onnxruntime-web'],
          'ai-wllama': ['@wllama/wllama'],
          'ai-kokoro': ['kokoro-js'],
          // Music theory utilities
          'music-theory': ['@tonaljs/tonal'],
        },
      },
    },
  },
  server: {
    headers: {
      // Required for SharedArrayBuffer (ONNX runtime threaded WASM)
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      // Content Security Policy (mirrors index.html meta tag)
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'wasm-unsafe-eval' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self' ws: wss: http://localhost:* https://localhost:*; worker-src 'self' blob:; manifest-src 'self'; frame-src 'self';",
    },
    watch: {
      ignored: ['**/training/**', '**/llama_cpp/**', '**/.venv/**', '**/scratch/**'],
    },
    fs: {
      allow: ['../..']
    },
  },
})
