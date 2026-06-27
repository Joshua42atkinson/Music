---
title: LOCKED_DECISIONS
status: active
tags: []
date: 2026-06-14
---
# Voix Vive — LOCKED DECISIONS
## Read this FIRST. These are not open for discussion.

> **Purpose:** Prevent scope fracture. Every session starts here.  
> **Rule:** If a decision is in this list, do NOT re-discuss it. Execute it.

---

## AI Model Architecture (Zero-Overhead Mentor Monetization)
- **Primary Browser Engine (Edge):** WebGPU (via `@mlc-ai/web-llm` or `window.ai`) for real-time, hardware-accelerated local inference.
- **Primary Models (Reasoning-First SLMs):** 
  - *Phi-4-mini (3.8B)* or *Llama 3.2 (3B)* running at Q4 quantization. (The ban on non-LFMs is lifted. Reasoning and Socratic nuance are the priority).
  - *Gemini Nano* (via `window.ai` on compatible Android/Chrome devices) for zero-download native edge inference.
- **Cloud Fallback (Tier 2):** Firebase Vertex AI (Gemini Flash) when local hardware cannot support WebGPU/Nano.
- **Audio-Native Horizon (Phase 2):** Architecture must be prepared to swap Text-LLMs for Audio-Native models (e.g., Gemma 4 E4B) to eliminate STT/TTS transcription latency and allow direct ingestion of guitar distortion/tone.
- **Context window target:** 100K+ tokens — load full student journal + notes + curriculum.

## Hosting & Business Model
- **Hosting:** Webapp only (Vite/React, deployed static)
- **Cost to student:** Free forever (AI + curriculum)
- **Revenue:** Human mentorship tiers only (Bertrand's time)
  - Tip Jar $5 / Quick Question / Video Review $35 / Live Zoom $65 / Capstone $100
- **No Bertrand server:** Zero backend cost. localStorage → IndexedDB → Firebase Firestore (optional, opt-in sync via `voixvive_cloud_sync` flag + Google OAuth). Supabase was removed; its `src/lib/supabase.js` is now a null stub.
- **LMS parallel:** Brightspace/Blackboard via xAPI + LTI 1.3 (future sprint)

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
- **AI companion:** Truebadour (red guitar widget) — **canonical spelling is "Truebadour"** (matches all code). Never "Troubadour". Env var is `VITE_TRUEBADOUR_API_KEY` (currently unused/removed).
- **Tool hub:** Binder (blue book widget)
- **Widgets:** openRift() = Truebadour, openBinder() = Binder
- **NO Trinity terms in UI:** No Coal/Steam/Shadow/Dissonance. Guitar terms only.
- **Feedback email:** joshua42atkinson@gmail.com

## Source of Truth Documents (read in this order)
1. `docs/product/plain_overview.md` — The layman's elevator pitch and target audience (Dual-Market Strategy).
2. `docs/engineering/ARCHITECTURE.md` — Technical map of the React app and state management.
3. `docs/pedagogy/12M.md` — THE primary pedagogy bible for the Somatic Masterclass track.
4. `docs/product/roadmap.md` — The living to-do list and execution phases.

## What NOT to do
- ❌ Do NOT use CPU-bound WebAssembly (e.g., `wllama`) for primary local inference. WebGPU is mandatory.
- ❌ Do NOT lock the architecture to a single model family. The best-in-class SLM (Small Language Model) wins.
- ❌ Do NOT add Trinity/Coal/Steam/Shadow terminology to UI
- ❌ Do NOT add complexity to the learner-facing layer
- ❌ Do NOT drift into planning when execution is needed
- ❌ Do NOT rebuild things that already exist — audit first
