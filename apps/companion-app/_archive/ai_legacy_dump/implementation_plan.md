# Voix Vive — Beta Launch Implementation Plan
*Synthesized from 20 Nemotron analysis sessions · June 2026*

---

## What Nemotron Found (The Honest Picture)

After 20 analysis sessions, the core verdict is: **the bones are exceptional, the connective tissue needs work.**

- **Landing Page**: World-class. Best-in-class compared to Brightspace/Blackboard.
- **Song/Lesson system**: Strong concept, strong UI — nearly ready.
- **Troubadour Widget**: Unique and powerful — just needed the bugs fixed (done ✅).
- **Everything else**: Onboarding unclear, navigation inconsistent, RIFT incomplete, SEO missing, AI routing broken (now fixed ✅).

> [!IMPORTANT]
> Items marked ✅ are already completed in this session. The plan below covers what remains.

---

## P0 — Critical Path (Beta Blockers)

These are showstoppers. Nothing ships without these.

---

### P0-1: Route Architecture — Stabilize 5 Destinations
**Source:** `02_route_architecture_audit.md`

The app has too many routes. Nemotron says: collapse to **5 primary destinations**.

| Destination | Route | Status |
|---|---|---|
| Home / Landing | `/` | ✅ Done |
| Song (Lessons) | `/song`, `/song/:slug` | ✅ Done |
| Player (Practice) | `/player` | ✅ Done |
| Binder (Academy) | `/binder` | ✅ Renamed from Workbook |
| RIFT (Community Jam) | `/rift` | ⚠️ Route exists, page incomplete |

**Dead routes to remove from `App.jsx`:**
- `/workbook` → redirect to `/binder` (add permanent redirect)
- `/inner-circle` → redirect to `/rift`
- `/orientation` → merge into onboarding modal
- Any dev-only routes — guard with `import.meta.env.DEV`

#### [MODIFY] [App.jsx](file:///home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/src/App.jsx)
- Add `<Navigate>` redirects for dead routes
- Add PEARL header

---

### P0-2: RIFT Hub Page — Build Complete Component
**Source:** `06_rift_page_design.md`, `impl/impl_02_rift_hub.md` (incomplete from Nemotron)

The RIFT page is the **5th home page** — guitar-culture community hub. Currently broken/incomplete.

**What it contains:**
- Hero: "Where riffs become harmony" with pulsing waveform
- Four experience cards: Troubadour Guitar Widget · Human Octave Feed · Live Jam Chat · Weekly Challenges
- AI backing tracks toggle (Blues/Rock/Flamenco)
- 60-second audio share buffer (MediaRecorder API)

#### [MODIFY/BUILD] [RiftHub.jsx](file:///home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/src/components/RiftHub.jsx)
- Complete the JSX (Nemotron's version was cut off mid-file)
- Dark slate `#0f172a` base, emerald `#10b981` for community content, amber `#d4a855` for AI
- Framer Motion card hover scale animations

---

### P0-3: Primary Navigation — Complete & Fix Memory Leak
**Source:** `impl/impl_03_primary_nav.md` (missing cleanup + truncated JSX)

The nav component has a `resize` listener without cleanup (memory leak) and the JSX return was truncated by Nemotron.

#### [MODIFY/CREATE] [PrimaryNav.jsx](file:///home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/src/components/PrimaryNav.jsx)
- Add `return () => window.removeEventListener('resize', handleResize)` cleanup
- 5 nav items: Home · Song · Player · Binder · RIFT
- Active state: gold `#c9a96e`
- Hidden on `/` and `/onboarding`
- Bottom bar on mobile, top bar on desktop (≥768px)

---

### P0-4: Onboarding Modal — First-Time UX
**Source:** `11_onboarding_redesign.md`

First-time visitors see no onboarding. Nemotron says this is the #1 retention risk.

**3-step modal flow:**
1. Set practice goal (5 / 15 / 30 min/day)
2. Choose starter song (curated beginner picks)
3. Enable microphone for somatic check-in

**Trigger:** `localStorage.getItem('voixvive:onboarded')` — show modal if null.

#### [CREATE] [OnboardingModal.jsx](file:///home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/src/components/OnboardingModal.jsx)
#### [MODIFY] [App.jsx](file:///home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/src/App.jsx) — trigger modal on first visit

---

### P0-5: SEO — `index.html` Head Tags
**Source:** `18_seo_landing_strategy.md`

Current `index.html` has NO title, no meta description, no Open Graph. Zero social preview. Shared links look blank.

#### [MODIFY] [index.html](file:///home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/public/index.html)
```html
<title>Voix Vive — A Whole-Person Music Academy | 12 Frets · 12 Intervals · One Master</title>
<meta name="description" content="Learn guitar with Maestro Bertrand Laurence's somatic-first method. Voice-forward, breath-aware, 12-fret mastery. Free trial." />
<meta property="og:title" content="Voix Vive — Online Guitar Academy" />
<meta property="og:description" content="Somatic guitar lessons for adults. AI Troubadour mentor. Free trial." />
<meta property="og:image" content="/assets/og-card.png" />
<meta name="twitter:card" content="summary_large_image" />
```

---

## P1 — Launch Quality (Ship These Before Beta Users)

---

### P1-1: AI Routing — LM Studio Connected ✅
**Status: COMPLETE** — Fixed in this session. `chatStream` now routes to LM Studio (`localhost:1234`) when running, falls through to wllama, then shows loading state.

---

### P1-2: Voice Settings — Full Kokoro Panel ✅
**Status: COMPLETE** — Built in this session. `VoiceSettingsPanel.jsx`, `useVoicePreferences.js`, upgraded `useKokoroWebTTS.js` with pitch/volume/cancel.

---

### P1-3: Troubadour Widget Bugs ✅
**Status: COMPLETE** — Label fixed, double TTS fixed, voice button renamed.

---

### P1-4: Performance — Lazy-load Kokoro WASM
**Source:** `16_performance_pwa_audit.md`

Kokoro WASM (`2.2 MB`) loads upfront even when user never uses voice. This blocks LCP.

#### [MODIFY] [TroubadourProvider.jsx](file:///home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/src/hooks/TroubadourProvider.jsx)
- Don't import `useKokoroWebTTS` statically
- Use `React.lazy` + dynamic `import()` for Kokoro — only load when "Load AI Brain" clicked

#### [MODIFY] [vite.config.js](file:///home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/vite.config.js)
- Add `build.rollupOptions.output.manualChunks` to split kokoro into its own chunk

---

### P1-5: PWA Precache — Stop Caching 144 MB
**Source:** `16_performance_pwa_audit.md`

The PWA is precaching 496 entries including large audio/video files (~144 MB). This makes the first install impossibly slow.

#### [MODIFY] [vite.config.js](file:///home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/vite.config.js)
```js
// Add to VitePWA config:
workbox: {
  maximumFileSizeToCacheInBytes: 3_000_000, // 3 MB cap
  globIgnores: ['**/*.gguf', '**/*.mp3', '**/*.mp4', '**/*.wav', 'models/**'],
}
```

---

### P1-6: Mobile First — Touch Targets & Tap Zones
**Source:** `12_mobile_first_audit.md`

Multiple buttons are below 44px tap target. On mobile the widget is cramped.

Key fixes:
- All icon buttons → minimum `44×44px` touch target
- Troubadour widget panel → max-width 95vw on mobile
- Voice settings sliders → larger step + visual thumb size

---

### P1-7: Streak Protect Toast
**Source:** `19_beta_launch_checklist.md`

When a student misses a practice day, show a soft toast ("No streak broken — rest is part of the practice") rather than silently resetting.

#### [MODIFY] [PlayerPortal.jsx](file:///home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/src/components/PlayerPortal.jsx)

---

### P1-8: Feedback Button — "Report a Bug"
**Source:** `19_beta_launch_checklist.md`

Beta users need a way to surface issues immediately.

#### [CREATE] [FeedbackButton.jsx](file:///home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/src/components/FeedbackButton.jsx)
```jsx
<a href="mailto:support@voixvive.com?subject=Bug+Report&body=Page: {url}">
  🐛 Report Issue
</a>
```
- Floating button, bottom-right, hidden on landing page

---

## P2 — Post-Beta (Future Sprints)

| Item | Source | Sprint |
|---|---|---|
| Localize static strings (useLocale → en/fr JSON) | `19_beta_launch_checklist.md` | 2 |
| Download PDF button for Binder resources | `19_beta_launch_checklist.md` | 2 |
| RIFT: Duet/Stitch system (MediaRecorder + buffer) | `06_rift_page_design.md` | 3 |
| RIFT: Human Octave Feed (community posts) | `06_rift_page_design.md` | 3 |
| Game Mode: unify 3 game engines into 1 focus system | `08_game_mode_analysis.md` | 3 |
| Mentor Dashboard (analytics for Bertrand) | `10_mentor_dashboard_audit.md` | 4 |
| Adaptive Learning Paths (Troubadour + completion data) | `20_master_pearl_roadmap.md` | 4 |
| Community Jam Sessions (WebRTC) | `06_rift_page_design.md` | 5 |
| WCAG AA Accessibility Audit | `20_master_pearl_roadmap.md` | 8 |

---

## 12M Document — Changes to Apply

> [!NOTE]
> The "12M document" (master document for Bertrand) needs these updates after implementation:

**Add/Update sections:**
1. **5 Primary Destinations** — updated navigation map with RIFT as the 5th hub
2. **The Troubadour Widget** — rebrand from "Bertrand's Guide" → "The Troubadour"; voice settings catalog
3. **AI Architecture** — LM Studio routing, Kokoro TTS with 16 voices, French voice support
4. **RIFT Definition** — "Where riffs become harmony" — the creative/community counterpart to the Song/Lesson structure
5. **Beta Launch Checklist** — the success metrics (70% activation, 15min time-to-first-recording)
6. **Bertrand's Role at Beta** — review items that need his content approval (lesson metadata, somatic prompts, manifesto copy)

---

## Implementation Order

```
1. P0-5: SEO index.html (30 min, zero risk)
2. P0-1: App.jsx dead route cleanup + redirects (30 min)
3. P0-3: PrimaryNav.jsx complete + memory leak fix (1 hr)
4. P0-2: RiftHub.jsx full build (2 hr)
5. P0-4: OnboardingModal.jsx (1.5 hr)
6. P1-4+P1-5: vite.config lazy chunks + PWA fix (45 min)
7. P1-6: Mobile touch targets (45 min)
8. P1-7+P1-8: Streak toast + Feedback button (30 min)
9. Update 12M document
10. Push to GitHub
```

**Total estimate: ~8 hours of focused implementation**

---

## Verification Plan

After each P0 item:
- `npx vite build` — must pass with zero errors
- Browser test: visit each of the 5 routes, confirm no 404s
- Mobile test (Chrome DevTools 375px): nav, widget, touch targets

Before GitHub push:
- No `.env` in git history
- `SUPABASE_ANON_KEY` confirmed as publishable-only (✅ already verified)
- No console errors on fresh load
