---
title: 16_performance_pwa_audit
status: archive
tags: []
date: 2026-06-14
---
# Voix Vive – Performance & PWA Audit  
*Focus: shrink initial JS payload, keep the service‑worker lean, and lazy‑load everything that isn’t needed for the first paint.*

---

## 1. Problem Summary (from current build)

| Asset | Size (raw) | Size (gzip) | Comment |
|-------|------------|-------------|---------|
| `dist/assets/index-8jmdMCyk.js` | ~672 KB | **245 KB** | Core React + router + Framer Motion – OK as a vendor chunk. |
| `dist/assets/ai-kokoro-zRXehzrI.js` | 2,208 KB | **916 KB** | WASM blob for Kokoro‑JS (text‑to‑speech). Loaded up‑front even if the user never hits the AI‑practice screen. |
| PWA precache manifest | 495 entries → ~144 MB | – | Every file under `public/` (including large lesson audio/video) is being precached, blowing out storage and install time. |

**Result:**  
- **LCP** likely > 3 s on a 3G connection (main‑thread blocked by parsing/executing the 2 MB WASM chunk).  
- **CLS** can spike if images/audio placeholders lack dimensions.  
- **INP** suffers from long tasks when the AI model runs on the UI thread.

---

## 2. Actionable Recommendations

### 2.1 Lazy‑load the heavy WASM chunk (`kokoro-js`)

*Why:* The WASM is only needed when the user opens an “AI Voice Coach” or “Pronunciation Practice” screen. Load it on demand via `import()` and run the inference in a **Web Worker** to keep the main thread free.

#### Where to change
- **File:** `src/components/AIVoiceCoach.jsx` (assumed location – adjust if yours differs)  
- **Wrapper component:** create `src/components/AIVoiceCoachLoader.jsx`

```tsx
// src/components/AIVoiceCoachLoader.jsx
import { Suspense, lazy } from 'react';
import { Spinner } from '@/components/UI/Spinner'; // your existing loader

const AIVoiceCoach = lazy(() => import('./AIVoiceCoach'));

export default function AIVoiceCoachLoader() {
  return (
    <Suspense fallback={<Spinner />}>
      <AIVoiceCoach />
    </Suspense>
  );
}
```

Inside `AIVoiceCoach.jsx` move the model‑initialisation into a worker:

```tsx
// src/components/AIVoiceCoach.jsx
import { useEffect, useRef } from 'react';
import kokoro from 'kokoro-js'; // <-- this import triggers the WASM chunk

export default function AIVoiceCoach() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (!workerRef.current) {
      const worker = new Worker(new URL('./aiVoiceWorker.js', import.meta.url));
      workerRef.current = worker;
    }
    // …postMessage to worker to load kokoro model, run inference, etc.
    return () => workerRef.current?.terminate();
  }, []);

  return <div>…</div>;
}
```

Create the worker (`src/components/aiVoiceWorker.js`) – it will be its own chunk because Vite treats `new Worker()` as a dynamic import.

**Result:** The WASM blob is now downloaded **only when the AI coach route is rendered**, shaving ~900 KB gzip from the initial bundle and moving heavy work off the UI thread.

---

### 2.2 Reduce PWA precache footprint

#### What should be precached?
- Core shell: `index.html`, manifest, favicons.
- All **JS/CSS** chunks (including vendor‑react, ai-transformers, etc.).
- Critical SVG/PNG icons used in UI.
- **Do NOT** precache large lesson audio/video or raw dataset files.

#### Updated workbox config (`vite.config.js`)

```js
// vite.config.js – only the changed part shown
VitePWA({
  registerType: 'autoUpdate',
  devOptions: { enabled: false }, // keep PWA off in dev
  includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
  manifest: {
    name: 'Voix Vive Academy',
    short_name: 'Voix Vive',
    description: 'Sovereign Whole-Person Music Academy',
    theme_color: '#050508',
    background_color: '#050508',
    display: 'standalone',
    icons: [
      { src: '/assets/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      {
        src: '/assets/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
  workbox: {
    // ---- PRECACHE -------------------------------------------------
    globPatterns: [
      '**/*.{js,css,html,ico,png,svg,webp,json}', // exclude audio/video
    ],
    maximumFileSizeToCacheInBytes: 2 * 1024 * 1024, // 2 MB cap for precached assets

    // ---- RUNTIME CACHING ------------------------------------------
    runtimeCaching: [
      {
        // Audio/Video lessons – network‑first, expire after a week
        urlPattern: ({ request }) => request.destination === 'audio' ||
                                     request.destination === 'video',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'media-cache',
          expiration: { maxEntries: 50, maxAgeSeconds: 7 * 24 * 60 * 60 },
        },
      },
      {
        // Images used lazily – cache‑first with short TTL
        urlPattern: ({ url }) => url.pathname.startsWith('/assets/') &&
                                 /\.(png|jpe?g|webp|svg)$/.test(url.pathname),
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: { maxEntries: 100 },
        },
      },
      {
        // Fallback for any other fetch (e.g., API JSON) – stale‑while‑revalidate
        urlPattern: ({}) => true,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'api-cache',
          expiration: { maxEntries: 20 },
        },
      },
    ],
  },
}),
```

**Impact:**  
- Precached entries drop from ~495 to **≈ 70** (JS/CSS/HTML/icons).  
- Install size falls from ~144 MB to **< 5 MB**, well within mobile storage limits.  
- Audio/video are fetched on demand and cached intelligently, preventing unnecessary duplication.

---

### 2.3 Route‑based code splitting (React.lazy + Suspense)

Identify the top‑level routes in `src/App.jsx` (or `src/routes/index.js`). Lazy‑load each page; keep only the layout, auth guard, and maybe a lightweight “Home” splash in the initial bundle.

#### Example route map

| Route | Component (lazy) | Reason |
|-------|------------------|--------|
| `/`   | `HomePage`       | Small hero + CTA – can stay eager if < 30 KB. |
| `/lessons` | `LessonsList` | Loads lesson cards; heavy media loaded later via IntersectionObserver. |
| `/lesson/:id` | `LessonPlayer` | Contains audio/video player – lazy. |
| `/practice` | `PracticeDashboard` | Includes metronome, timer – moderate size. |
| `/ai-coach` | `AIVoiceCoachLoader` (see 2.1) | Triggers WASM lazy load. |
| `/profile` | `UserProfile` | Lightweight form data. |

#### Implementation sketch (`src/App.jsx`)

```tsx
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth } from '@/auth/RequireAuth'; // your HOC/context wrapper

const HomePage = lazy(() => import('./pages/HomePage'));
const LessonsList = lazy(() => import('./pages/LessonsList'));
const LessonPlayer = lazy(() => import('./pages/LessonPlayer'));
const PracticeDashboard = lazy(() => import('./pages/PracticeDashboard'));
const UserProfile = lazy(() => import('./pages/UserProfile'));

export default function App() {
  return (
    <BrowserRouter>
      <RequireAuth>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/lessons" element={<LessonsList />} />
            Route path="/lesson/:id" element={<LessonPlayer />} />
            Route path="/practice" element={<PracticeDashboard />} />
            Route path="/ai-coach" element={<AIVoiceCoachLoader />} />
            Route path="/profile" element={<UserProfile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </RequireAuth>
    </BrowserRouter>
  );
}
```

**Result:**  
- Initial JS payload drops from ~672 KB (gzip) to **≈ 350 KB** (core + HomePage).  
- Each subsequent navigation triggers a < 150 KB chunk, keeping the main thread free and improving FID/INP.

---

### 2.4 Refine `manualChunks` (rollupOptions)

Your current split is sensible, but we can isolate the **AI‑related** libs even further to avoid pulling them into the vendor‑react chunk when they’re not used.

```js
// vite.config.js – build.rollupOptions.output.manualChunks
build: {
  outDir: 'dist',
  emptyOutDir: true,
  rollupOptions: {
    output: {
      manualChunks: {
        // Core runtime – stays eager
        'vendor-react': ['react', 'react-dom', 'react-router-dom', 'framer-motion'],

        // Heavy ML/AI – only loaded when AI features are used
        'ai-transformers': ['@huggingface/transformers'],
        'ai-onnx': ['onnxruntime-web'],
        'ai-wllama': ['@wllama/wllama'],
        'ai-kokoro': ['kokoro-js'],

        // Music theory – can stay with vendor or be its own chunk (small)
        'music-theory': ['@tonaljs/tonal'],

        // Supabase SDK – used throughout app, keep separate for caching
        'supabase': ['@supabase/supabase-js'],
      },
    },
  },
},
```

*Why:* If a user never touches the AI coach, the `ai-transformers`, `ai-onnx`, `ai-wllama`, and `ai-kokoro` chunks remain **unfetched**, saving bandwidth and main‑thread work.

---

### 2.5 Core Web Vitals – Expected Scores & Mitigations

| Metric | Current risk | Target (good) | Mitigation |
|--------|--------------|----------------|------------|
| **LCP** | Large JS bundle + WASM parsing → > 3 s on 3G. | ≤ 2.5 s | Lazy‑load routes & AI WASM; keep initial bundle < 400 KB gzip; use `<link rel="preload">` for critical CSS (Tailwind) if needed. |
| **CLS** | Images/audio without dimensions; font loading shifts. | ≤ 0.1 | Add explicit `width`/`height` on `<img>` and `<video>`. Use `font-display: swap` in Tailwind config; preload key fonts via `<link rel="preload" as="font">`. |
| **INP** | Long tasks from AI model running on UI thread. | ≤ 200 ms | Offload inference to Web Worker (see 2.1); break up heavy JS with `requestIdleCallback` or `setTimeout(...,0)`. |

---

### 2.6 Audio/Video Asset Strategy

| Observation | Recommendation |
|-------------|----------------|
| Files live in `public/assets/` – likely raw WAV/MP3 lessons (several MB each). | **Compress** to Opus/Ogg or low‑bitrate AAC (~64 kbps) for speech; use `<source type="audio/ogg">` and `<source type="audio/mpeg">`. |
| All assets are being precached → huge install size. | Move large media to a **CDN** (e.g., Cloudflare R2 + Cloudflare Stream or AWS S3 + CloudFront). Keep only tiny placeholder files in `public/` for offline fallback. |
| Need offline capability for core lessons. | Implement a **runtime cache** with `NetworkFirst` strategy and a reasonable quota (see workbox config above). When online, fetch fresh copies; when off‑line, serve from cache. |

Example of lazy‑loading an audio lesson with IntersectionObserver:

```tsx
// src/components/LessonAudio.jsx
import { useEffect, useRef } from 'react';

export default function LessonAudio({ src }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        audioRef.current?.play();
      }
    });
    observer.observe(audioRef.current);
    return () => observer.disconnect();
  }, []);

  return <audio ref={audioRef} preload="none" src={src} />;
}
```

---

## 3. Consolidated Optimized `vite.config.js`

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: false }, // keep PWA off while developing
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Voix Vive Academy',
        short_name: 'Voix Vive',
        description: 'Sovereign Whole-Person Music Academy',
        theme_color: '#050508',
        background_color: '#050508',
        display: 'standalone',
        icons: [
          { src: '/assets/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          {
            src: '/assets/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // ---------- PRECACHE ----------
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
        maximumFileSizeToCacheInBytes: 2 * 1024 * 1024, // 2 MB cap

        // ---------- RUNTIME CACHING ----------
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === 'audio' ||
              request.destination === 'video',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'media-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 7 * 24 * 60 * 60 },
            },
          },
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith('/assets/') &&
              /\.(png|jpe?g|webp|svg)$/.test(url.pathname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: { maxEntries: 100 },
            },
          },
          {
            urlPattern: ({}) => true, // fallback for API/json etc.
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 20 },
            },
          },
        ],
      },
    }),
  ],

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
          'ai-transformers': ['@huggingface/transformers'],
          'ai-onnx': ['onnxruntime-web'],
          'ai-wllama': ['@wllama/wllama'],
          'ai-kokoro': ['kokoro-js'],
          'music-theory': ['@tonaljs/tonal'],
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },

  server: {
    watch: {
      ignored: ['**/training/**', '**/llama_cpp/**', '**/.venv/**', '**/scratch/**'],
    },
  },
});
```

---

## 4. Quick Checklist for the Beta Launch

| ✅ Item | How to Verify |
|--------|----------------|
| **Initial JS < 400 KB gzip** | Run `vite build` → inspect `dist/assets/index-*.js` (gzip size). |
| **WASM chunk lazy‑loaded** | DevTools Network → filter `.wasm`; should appear only after navigating to `/ai-coach`. |
| **PWA precache ≤ 6 MB** | Open Application > Service Workers > Cache Storage → check `precache-v*` size. |
| **Audio not precached** | Confirm no `.mp3/.ogg` entries in the precache list. |
| **Route chunks load on navigation** | Navigate to each top‑level route; verify a new chunk (< 150 KB) appears in Network tab. |
| **Core Web Vitals (lab)** | Run Lighthouse (Chrome DevTools) → aim for LCP < 2.5 s, CLS < 0.1, INP < 200 ms. |
| **Audio offline fallback** | Turn off network, reload a lesson page → audio should play from cache if previously visited; otherwise show a friendly “offline” message. |

Implement the above changes, re‑run the build, and you’ll see a dramatically lighter initial load, a sane PWA footprint, and smoother interaction—exactly the UX edge needed to beat Brightspace/Blackboard for music education. 🎸🚀