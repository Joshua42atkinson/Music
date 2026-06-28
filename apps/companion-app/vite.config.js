import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
const godotBridgePlugin = () => {
  let latestTelemetry = null;
  
  return {
    name: 'godot-telemetry-bridge',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Godot sends telemetry here
        if (req.url === '/api/vertiscale/sync' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              latestTelemetry = JSON.parse(body);
              console.log('Received Godot telemetry:', latestTelemetry);
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true }));
            } catch (e) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }
        
        // React polls this endpoint to get the latest telemetry
        if (req.url === '/api/vertiscale/latest' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify(latestTelemetry || {}));
          // Clear it after reading so we don't process it twice
          latestTelemetry = null;
          return;
        }
        
        next();
      });
    }
  };
};

const stripLargeWasm = () => ({
  name: 'strip-large-wasm',
  closeBundle() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const distAssets = path.resolve(__dirname, 'dist/assets');
    if (fs.existsSync(distAssets)) {
      for (const file of fs.readdirSync(distAssets)) {
        if (file.endsWith('.wasm')) {
          const filePath = path.join(distAssets, file);
          const size = fs.statSync(filePath).size;
          if (size > 25 * 1024 * 1024) {
            fs.unlinkSync(filePath);
            console.log(`[strip-large-wasm] Removed ${file} (${(size / 1024 / 1024).toFixed(1)}MB) — loading from CDN instead`);
          }
        }
      }
    }
  },
});

export default defineConfig({
  plugins: [
    react(),
    godotBridgePlugin(),
    stripLargeWasm(),
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
        maximumFileSizeToCacheInBytes: 10_000_000, // 10 MB — allow WebLLM (6MB) to be precached, block massive models
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
  optimizeDeps: {
    entries: ['index.html'],
  },
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
          'ai-webllm': ['@mlc-ai/web-llm'],
          'ai-kokoro': ['kokoro-js'],
          // Music theory utilities
          'music-theory': ['@tonaljs/tonal'],
          // 3D and Icons
          'vendor-3d': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
  server: {
    port: 1420,
    headers: {
      // Required for SharedArrayBuffer (ONNX runtime threaded WASM)
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      // Content Security Policy (mirrors index.html meta tag)
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self' ws: wss: http://localhost:* https://localhost:*; worker-src 'self' blob:; manifest-src 'self'; frame-src 'self';",
    },
    watch: {
      ignored: ['**/training/**', '**/llama_cpp/**', '**/.venv/**', '**/scratch/**', '**/.f5venv/**'],
    },
    fs: {
      allow: ['../..']
    },
  },
})
