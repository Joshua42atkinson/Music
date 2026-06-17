---
description: Voix Vive Living Roadmap — dual-market alignment, core loop completion, and deployment.
---

# Voix Vive — Living Roadmap
> **This file is the single source of truth for what comes next.**
> Updated: 2026-06-14
>
> **Rule:** No feature proceeds to the next phase until all items in the current phase are checked.

---

## ARCHITECTURAL CONTEXT
We have executed a major restructuring to support the **Dual-Market Strategy**. The codebase is now strictly separated between:
1. `src/features/audio-engine` & `vr-fretboard`: The mass-market, Gibson/Yousician competitor.
2. `src/features/somatic-masterclass`: The deep, opt-in TrueFire-style pedagogy.

---

## PHASE 1: DUAL-MARKET ROUTING & UX ALIGNMENT (Next)

**Goal:** Ensure the app physically functions as a dual-market platform. The Somatic Masterclass must be hidden behind an opt-in wall so casual users aren't overwhelmed with dogma.

### UI & Architecture
- [ ] Refactor `App.jsx` to introduce a clear `/masterclass` route.
- [ ] Remove forced AI / Troubadour widgets from the default Fretboard / Audio Engine screens.
- [ ] Create an onboarding splash screen that lets users select their path: "Start Playing" (AR) vs "Enter Masterclass" (Somatic).
- [ ] Clean up Navigation (NeckMenu) to reflect these two distinct domains.

### Gate to Phase 2
> **A user can open the app, tune their guitar, and play with zero philosophical prompts. A different user can explicitly opt-in to the Somatic Masterclass and access the Troubadour AI.**

---

## PHASE 2: CORE GAMEPLAY LOOP (Feature Parity)

**Goal:** Fulfill the missing Top 10 features needed to make the Audio AR experience highly competitive in the market.

### Features
- [ ] Build the "Peer-reviewed Jam Projects" module (async video/audio collaboration).
- [ ] Build "Exportable Reports" (PDF/Shareable Web Summaries of practice metrics).
- [ ] Polish the Metronome (visual syncing, advanced subdivisions).
- [ ] Finalize the Fretboard visualizer (animations, scale highlighting).

### Gate to Phase 3
> **The AR Audio experience has feature parity with industry leaders and includes our unique community and export offerings.**

---

## PHASE 3: BETA LAUNCH & QA

**Goal:** The site is live, performant, and stable for external beta testers.

### Deployment & Polish
- [ ] Implement Vercel deployment configurations.
- [ ] Ensure PWA installability.
- [ ] Lighthouse audit (target 90+ across all metrics).
- [ ] End-to-end testing of the Pitch Detection across Chrome/Safari.

### Gate to Final Release
> **App is live at voix-vive.com, installs as PWA, and Pitch Detection works flawlessly in production.**

---

## PHASE 4: ANDROID / NATIVE (Future)

**Goal:** Native Android app with hardware integration.

### Milestones
- [ ] Tauri or Capacitor build.
- [ ] Local database sync (SQLite on device, syncs to Supabase).
- [ ] Hardware integration: low-latency mic input, haptic feedback, offline mode.

---

*This roadmap lives in `docs/ppl/roadmap.md`. Update it every session.*
