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

## AI Model
- **In-browser (wllama):** Liquid AI LFM2.5 8B GGUF (primary) — already in `useWllamaTroubadour.js`
  - Fallback: LFM2.5-1.2B-Instruct (already configured)
  - Fallback: LFM2.5-350M (already configured)
- **Local sidecar:** LFM2.5 8B on Android minitrinity app
- **Dev/testing:** LM Studio localhost:1234 (nemotron, gemma, g3-storyteller available)
- **Context window target:** 100K+ tokens — load full student journal + notes + curriculum

## Hosting & Business Model
- **Hosting:** Webapp only (Vite/React, deployed static)
- **Cost to student:** Free forever (AI + curriculum)
- **Revenue:** Human mentorship tiers only (Bertrand's time)
  - Tip Jar $5 / Quick Question / Video Review $35 / Live Zoom $65 / Capstone $100
- **No Bertrand server:** Zero backend cost. localStorage → IndexedDB → Supabase (optional sync)
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
- Engine: `usePlayerState.js` — wired into TroubadourProvider

## Troubadour Behavior (from 12M Bible)
- **Not a chatbot.** A Socratic sonic midwife.
- **Never lectures.** Only asks questions.
- **3-sentence limit + "Over."** — contemplative container.
- **Responds to what the student ACTUALLY SAID** — not generic coaching.
- **Biofeedback-aware:** responds differently based on Tone (clean/low signal).
- **Distortion protocol:** At `distorted` state — one open question about music, not technique.
- **Polarity per fret:** Yin frets (2,4,7,9,11) = contemplative. Yang (3,5,10) = energetic. Balanced = Socratic.

## Branding & Naming
- **App name:** Voix Vive ("Living Voice")
- **AI companion:** Troubadour (red guitar widget)
- **Tool hub:** Binder (blue book widget)
- **Widgets:** openRift() = Troubadour, openBinder() = Binder
- **NO Trinity terms in UI:** No Coal/Steam/Shadow/Dissonance. Guitar terms only.
- **Feedback email:** joshua42atkinson@gmail.com

## Source of Truth Documents (read in this order)
1. `docs/product/plain_overview.md` — The layman's elevator pitch and target audience (Dual-Market Strategy).
2. `docs/engineering/ARCHITECTURE.md` — Technical map of the React app and state management.
3. `docs/pedagogy/12M.md` — THE primary pedagogy bible for the Somatic Masterclass track.
4. `docs/product/roadmap.md` — The living to-do list and execution phases.

## What NOT to do
- ❌ Do NOT re-discuss model choice
- ❌ Do NOT suggest Qwen, Phi, Llama, or other models
- ❌ Do NOT add Trinity/Coal/Steam/Shadow terminology to UI
- ❌ Do NOT add complexity to the learner-facing layer
- ❌ Do NOT drift into planning when execution is needed
- ❌ Do NOT rebuild things that already exist — audit first
