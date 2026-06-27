---
title: decisions
status: active
tags: []
date: 2026-06-14
---
# Voix Vive — LOCKED DECISIONS
## Read this FIRST. These are not open for discussion.

> **Purpose:** Prevent scope fracture. Every session starts here.  
> **Rule:** If a decision is in this list, do NOT re-discuss it. Execute it.

---

## AI Model
- **In-browser (wllama):** Liquid AI LFM2.5 8B GGUF (primary) — already in `useWllamaTruebadour.js`
  - Fallback: LFM2.5-1.2B-Instruct (already configured)
  - Fallback: LFM2.5-350M (already configured)
- **Local sidecar:** LFM2.5 8B on Android minitrinity app
- **Dev/testing:** LM Studio localhost:1234 (nemotron, gemma, g3-storyteller available)
- **Context window target:** 100K+ tokens — load full student journal + notes + curriculum

## Hosting & Business Model
- **Hosting:** Webapp (Vite/React PWA) → Tauri Android APK → Google Play Store
- **Model:** MENTORSHIP MONETIZATION — AI makes content free, human attention is the premium. See `docs/VOIX_VIVE_BUSINESS_PLAN.md`.
  - **Free ($0):** All 12 chapters + wllama Truebadour (offline) + all tools. NO content gate. The funnel — habit formation.
  - **Community ($5/mo):** Gemini AI (cloud) + Guild community + Inner Circle blog + sync. Daily engagement.
  - **Apprentice ($100/mo):** Access to Bertrand's reviews — submit when ready (up to 4/mo). AI pre-screens, Bertrand adds judgment. Priority Q&A.
  - **Journeyman ($500/mo):** 4 scheduled live Zoom sessions (use them or lose them) + 4 async reviews + unlimited questions. Accountability tier.
  - **Master ($1000/mo):** 8 live sessions (2/week) + direct messaging + quarterly assessment. A relationship, not a service.
- **Revenue:** 100% to Bertrand. Joshua builds for free. Joshua's income comes from his own projects (daydream, Trinity, phonethagoras.com). If Bertrand pays Joshua later, that's between them.
- **Business metric:** LTV and churn, not hourly rate. Students pay for ACCESS, not per review. Like a gym membership — they keep paying because they MIGHT submit a video.
- **AI pre-screening:** Gemini analyzes every video submission first (flags timing, pitch, posture, generates draft review with timestamps). Bertrand reviews AI analysis + records 2-3 min feedback. Time per review: 12 min → 5 min. This is the scale solution.
- **Conversion strategy:** Upgrade prompts at emotional peaks (chapter completion, AI flagging technique issues, community engagement), not on a pricing page.
- **Video review format:** 5-minute student demos. With AI pre-screening: ~5 min/review. Without: ~12 min/review.
- **À la carte (non-subscribers):** Tip $5 / Quick Question $5 / Mini Critique $15 / Full Review $35 / Private Lesson $65 / Group Workshop $35
- **No Bertrand server:** Zero backend cost. localStorage → IndexedDB → Firebase Firestore (optional, opt-in sync via `voixvive_cloud_sync` flag + Google OAuth). Supabase was removed; its `src/lib/supabase.js` is now a null stub.
- **Payment:** Stripe (primary) — recurring billing via Stripe Subscriptions. Replace all mock URLs in `pricingData.js` with real Stripe Payment Links.
- **LMS parallel:** Brightspace/Blackboard via xAPI + LTI 1.3 (future sprint)

## Hands-Free Navigation
- **Goal:** Student props phone up, holds guitar, navigates entire practice session by voice.
- **STT:** Web Speech API `SpeechRecognition` — commands: next, previous, play, stop, record, ask, menu, back, practice.
  - **✅ Implemented:** `useVoiceNav.js` — continuous recognition, bilingual triggers (EN + FR), auto-restart on end.
  - **✅ UI:** `VoiceCommandBar.jsx` — floating mic button with pulse animation, listening indicator, help overlay, last command display.
  - **✅ Wired into:** `CScaleHub.jsx` with handlers for chapter navigation, mic toggle, Truebadour open, practice mode.
- **TTS:** Web Speech API `SpeechSynthesis` — reads chapter titles, instructions, AI responses aloud.
  - **✅ Implemented:** `useVoiceNav.js` `speak()` — locale-aware voice selection (fr-FR / en-US), rate/pitch tuning.
- **UI:** Collapsible sections, minimal persistent chrome, practice-first layout. Large touch targets as fallback.
  - **✅ Implemented:** Practice mode in `CScaleHub.jsx` — hides header, sidebar, fretboard panel, and mobile bottom bar. Shows only chapter title + exit button + BeDoExercise content.
- **NDK path:** On Android (Tauri), Web Speech API works in WebView. Native Oboe for audio if latency > 50ms. See `docs/VOIX_VIVE_NDK_HANDS_FREE_SPEC.md`.

## Google-First Platform
- **AI default:** Gemini (cloud) is the default Truebadour. wllama (on-device) is the sovereign/offline fallback.
- **XR target:** Android XR / Google Aurora (XREAL Project Aura). Vive XR Elite / WiVRn is legacy.
- **Distribution:** PWA now → Tauri Android APK → Google Play Store
- **Funding:** Apply to Google Cloud for Startups ($350K credits) + Google AI Futures Fund (rolling)
- **Bilingual:** EN/FR is a core market advantage, not a feature. Bertrand records all videos in both languages.

## Pedagogy (from 12M Bible)
- **Session structure:** BE → DO → PLAY (always in this order, no skipping)
- **BE:** Somatic check-in. Sets Tone. 10 seconds. Required gate.
- **DO:** Skill work. Technique, ear training, fret drill.
- **PLAY:** Free expression. No grade. No wrong notes.
- **Progression:** 12 frets × 12 chapters. DAG-enforced. One fret per month recommended.
- **Mastery:** Geometric mean of BE+DO+PLAY scores. ≥0.80 = mastered.

## Guitar Economy (engine-only, learner never sees these words)
- **Tone** — presence/readiness (set by BE check-in)
- **Resonance** — momentum (builds with streak + session completions)
- **Buzz** — friction (drops on completion, rises on abandonment)
- **Voice** — long-horizon mastery (never resets)
- **Distortion** — signal health: `clean → breaking up → distorted → dialed in`
- Engine: `usePlayerState.js` — wired into TruebadourProvider

## Truebadour Behavior (from 12M Bible)
- **Not a chatbot.** A Socratic sonic midwife.
- **Never lectures.** Only asks questions.
- **3-sentence limit + "Over."** — contemplative container.
- **Responds to what the student ACTUALLY SAID** — not generic coaching.
- **Biofeedback-aware:** responds differently based on Tone (clean/low signal).
- **Distortion protocol:** At `distorted` state — one open question about music, not technique.
- **Polarity per fret:** Yin frets (2,4,7,9,11) = contemplative. Yang (3,5,10) = energetic. Balanced = Socratic.

## Branding & Naming
- **App name:** Voix Vive ("Living Voice")
- **AI companion:** Truebadour (red guitar widget)
- **Tool hub:** Binder (blue book widget)
- **Widgets:** openRift() = Truebadour, openBinder() = Binder
- **NO Trinity terms in UI:** No Coal/Steam/Shadow/Dissonance. Guitar terms only.
- **Feedback email:** joshua42atkinson@gmail.com

## Source of Truth Documents (read in this order)
1. `/home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/src/assets/12M.md` — THE primary bible (2072 lines)
2. `/home/joshua/Workflow/docs/archive_legacy/TRINITY_FANCY_BIBLE_IRON_ROAD_ERA.md` — gamification engine source (3251 lines)
3. `voixvive_gamification_meta.md` — translation map (this session)
4. `voixvive_plain_language.md` — student-facing explanation (this session)

## What NOT to do
- ❌ Do NOT re-discuss model choice
- ❌ Do NOT suggest Qwen, Phi, Llama, or other models
- ❌ Do NOT add Trinity/Coal/Steam/Shadow terminology to UI
- ❌ Do NOT add complexity to the learner-facing layer
- ❌ Do NOT drift into planning when execution is needed
- ❌ Do NOT rebuild things that already exist — audit first
