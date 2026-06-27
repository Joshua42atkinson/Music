# Voix Vive — Technical Development Plan
> **Status:** Living document. Updated 2026-06-25 with Android XR + Gemini Nano research.
> **Runs parallel to `VOIX_VIVE_BUSINESS_PLAN.md`.** Better code = more sellable product.

---

## 1. Current State Assessment

### Companion App (React/PWA) — PRODUCTION READY
The web app is in good shape. Tech debt plan is **100% complete** (all 5 phases done, 108/108 tests passing).

| Area | Status | Evidence |
|---|---|---|
| Build | ✅ Passing | `npm run build` — zero errors |
| Tests | ✅ 221/221 | `npx vitest run` — all pass |
| Lint | ✅ Clean | `npm run lint` — zero warnings |
| Tech debt phases 1-5 | ✅ Complete | See `TECH_DEBT_PLAN.md` |
| PWA | ✅ Configured | Manifest, service worker, caching in `vite.config.js` |
| i18n (EN/FR) | ✅ Infrastructure | `useLocale` hook, `en.json`, `fr.json` |
| Google integrations | ✅ 7 services | Gemini, OAuth, Firebase, Drive, Calendar, PWA, Tauri |
| Pricing data | ⚠️ Mock URLs | `pricingData.js` has 5 tiers + à la carte, all Stripe links are mock |
| Paywall | ✅ Built | `MentorshipGate.jsx` uses `SUBSCRIPTION_TIERS`, `useAuth` persists tier |
| AI pre-screening | ✅ Built | `aiPreScreening.js` + `usePreScreening.js` + `PreScreeningResults.jsx` |
| Voice navigation | ✅ Built | `useVoiceNav.js` + `VoiceCommandBar.jsx` wired into `CScaleHub.jsx` |
| StudioPage i18n | ✅ Complete | 40+ keys in en.json/fr.json, bilingual FAQ |
| Email capture | ✅ Built | `EmailCapture.jsx` component |
| SEO/OG tags | ✅ Complete | JSON-LD updated to 5-tier model, OG locale alternates |

### Spatial Engine (Rust/Bevy) — SCAFFOLD
The engine has the right architecture but everything is placeholder.

| Module | Status | What Exists | What's Missing |
|---|---|---|---|
| `main.rs` | Scaffold | Bevy app + OpenXR feature flag | Android entry point, XR session lifecycle |
| `ipc.rs` | Working | WebSocket server on :8765, bidirectional | Needs Android IPC (Tauri commands or JNI) |
| `fretboard.rs` | Scaffold | 6×24 pothole grid, note name calc, pulse animation | Real guitar alignment, spatial anchoring, scale highlighting |
| `truebadour_ai.rs` | Scaffold | Context window (8 notes), avatar bounce | Gemini Nano integration, Socratic prompt, voice I/O |
| `modes.rs` | Scaffold | BE/DO/PLAY state machine, avatar spawn | Mode-specific visuals, transitions, DO zoom |
| `sensor_fusion.rs` | Scaffold | Hand tracking query (XR feature), velocity calc | Real OpenXR hand bones, acoustic latency measurement |
| `audio_transducer.rs` | Scaffold | Kira audio, pitch-shift playback | Real SoundFont, bass backing tracks, Gemini token → audio |

### Tauri Android Shell — MINIMAL
| Area | Status | Evidence |
|---|---|---|
| `tauri.conf.json` | ✅ Configured | Android target, debug suffix, icons |
| `Cargo.toml` | ✅ Dependencies | Tauri 2.11, log plugin |
| `lib.rs` | Minimal | Logging only — no custom commands, no JNI, no Android lifecycle |
| APK build | ❌ Not attempted | Needs Android SDK/NDK, `cargo tauri android init` |
| Play Store | ❌ Not started | Needs signing, listing, screenshots |

### NDK Hands-Free Spec — STRATEGIC DOC
`docs/VOIX_VIVE_NDK_HANDS_FREE_SPEC.md` exists with the right vision (Gemini Nano, STT/TTS, Oboe audio) but needs updating with 2026 Android XR and ML Kit GenAI API research.

---

## 2. The Two-Path XREAL Strategy

You have an XREAL Air 2 Ultra **today**. Project Aura (Android XR) ships **late 2026**. These are two different SDKs:

### Path A — XREAL SDK 3.0 (Today, Current Hardware)
- **SDK:** XREAL SDK 3.0 (Unity-based) or NRSDK (native Android)
- **Hardware:** Air 2 Ultra tethered to Snapdragon phone via USB-C
- **Features:** 6DoF tracking, hand tracking, spatial anchors, depth mesh
- **Limitation:** Unity-based, not Bevy. Would require porting the spatial engine to Unity OR building a separate AR layer.
- **Use case:** Prove the AR fretboard concept on real hardware now.

### Path B — Android XR SDK (Project Aura, Late 2026)
- **SDK:** Android XR SDK (Jetpack XR, OpenXR native)
- **Hardware:** Project Aura (standalone, Snapdragon XR, X1S chip)
- **Features:** Full Android XR platform, Play Store distribution, OpenXR 1.1
- **Advantage:** Bevy/OpenXR engine targets this directly — no Unity port needed
- **Use case:** Ship the real product. Be on Play Store day one.

### Recommendation
**Pursue Path B as primary, Path A as proof-of-concept.**

- The Bevy/OpenXR engine is architecturally correct for Android XR
- Porting to Unity (Path A) would throw away the Rust engine work
- The Android XR emulator works today — no hardware needed to start
- Apply for the **Android XR Developer Catalyst program** (Project Aura dev kits ship summer 2026)
- Use the Air 2 Ultra for informal testing via XREAL SDK if needed, but don't invest heavily in the Unity path

---

## 3. Gemini Nano Integration Plan

### What Gemini Nano Is
- On-device LLM built into Android OS via **AICore** system service
- Available through **ML Kit GenAI APIs** (high-level) or **AICore API** (lower-level)
- Runs on Snapdragon, Tensor, and Dimensity chips
- No cloud calls, zero latency, zero API cost
- Supports LoRA fine-tuning (could train on Bertrand's teaching style)

### How It Fits Voix Vive
| Layer | Current | With Gemini Nano |
|---|---|---|
| Truebadour AI (cloud) | Gemini 1.5 Flash via API | Gemini Nano on-device (free, instant) |
| Truebadour AI (offline) | wllama 800MB download | Gemini Nano (pre-installed, zero download) |
| Voice input | Web Speech API (browser) | Android SpeechRecognizer (native, continuous) |
| Voice output | Kokoro WASM / Web Speech | Android TTS with Bertrand voice model |
| Hands-free navigation | ✅ Built (PWA) | `useVoiceNav.js` — Web Speech API STT + TTS, EN/FR commands |
| Hands-free navigation (Android) | Not built | Native STT/TTS via Tauri plugins |

### ML Kit GenAI API Access
```kotlin
// Pseudocode — actual implementation in Tauri JNI bridge
val generativeModel = GenerativeModel(
    modelName = "gemini-nano",
    systemInstruction = "You are the Truebadour..."
)
val response = generativeModel.generateContent("My wrist hurts on this G chord.")
// Returns instantly, on-device, zero cost
```

### The Three-Tier AI Strategy (Updated)

| Tier | Engine | Cost | Latency | When |
|---|---|---|---|---|
| **Gemini Nano (on-device)** | AICore / ML Kit | $0 | <100ms | Android app, always available |
| **Gemini Flash (cloud)** | Gemini API | ~$0.075/1M tokens | ~500ms | PWA, or when Nano isn't available |
| **wllama (on-device WASM)** | Liquid LFM2.5 8B | $0 | ~2s first load | PWA offline mode, privacy-first users |

> **Gemini Nano replaces wllama as the Android offline mode.** No 800MB download. No browser RAM limits. Pre-installed by the OS. This is a massive UX win.

---

## 4. Development Tracks (Parallel)

### Track 1: Companion App Hardening (Ongoing)
> Goal: Ship a sellable PWA. This is what students subscribe to.

| Task | Priority | Effort | Status |
|---|---|---|---|
| Replace mock Stripe URLs with real Stripe Subscription links (5 tiers) | P0 | 1 hr | Blocked on LLC + Stripe account |
| Add subscription state to auth context (free/community/apprentice/journeyman/master) | P0 | 2 hrs | ✅ Done — `useAuth.js` persists tier to localStorage |
| Add video review submission UI (record 5-min demo → AI pre-screens → Bertrand's queue) | P0 | 3 hrs | Not started |
| Add AI pre-screening pipeline (Gemini analyzes video, flags issues, draft review w/ timestamps) | P0 | 4 hrs | ✅ Done — `aiPreScreening.js` + `usePreScreening.js` + `PreScreeningResults.jsx` |
| Gate Gemini Truebadour behind Community+ subscription (free = wllama, paid = Gemini) | P0 | 1 hr | `useGeminiTruebadour.js` exists, needs gating |
| Add upgrade prompts at emotional peaks (chapter completion, AI technique flags, community) | P1 | 2 hrs | Not started |
| i18n the StudioPage — add useLocale, translate all hardcoded English strings | P0 | 4 hrs | ✅ Done — 40+ keys in en.json/fr.json |
| Build PricingSection component — render SUBSCRIPTION_TIERS on StudioPage | P0 | 3 hrs | ✅ Done — renders dynamically on StudioPage |
| Fix MentorshipGate — use SUBSCRIPTION_TIERS instead of hardcoded old $1/$5 tiers | P0 | 2 hrs | ✅ Done — uses SUBSCRIPTION_TIERS with rank-based access |
| Build `useVoiceNav` hook — Web Speech API STT + TTS for hands-free navigation | P1 | 4 hrs | ✅ Done — `useVoiceNav.js` with EN/FR command matching |
| Build `VoiceCommandBar` component — floating mic + visual feedback | P1 | 2 hrs | ✅ Done — `VoiceCommandBar.jsx` with pulse animation |
| Refactor C-Scale screen — collapsible sections, minimal chrome, practice-first layout | P1 | 4 hrs | ✅ Done — practice mode in `CScaleHub.jsx` |
| Add live session scheduling UI (Journeyman+ — Zoom/calendar integration) | P1 | 4 hrs | Not started |
| Wire real video player for Bertrand's content | P1 | 2 hrs | SlideViewer exists, needs video loading |
| Add SEO + OG meta tags for social sharing | P1 | 1 hr | ✅ Done — JSON-LD 5-tier, OG locale alternates, Twitter image |
| Visual regression test (screenshot before/after) | P2 | 1 hr | Noted in tech debt plan, not done |
| French locale completeness audit | P1 | 2 hrs | Infrastructure exists, strings may be incomplete |

### Track 2: Tauri Android Build (Phase 4 of roadmap)
> Goal: Native Android APK for Google Play Store.

| Task | Priority | Effort | Status |
|---|---|---|---|
| Install Android SDK + NDK on dev machine | P1 | 1 hr | Not done |
| `cargo tauri android init` | P1 | 30 min | Not done |
| Build first APK (even if it's just the PWA in a wrapper) | P1 | 1 hr | Not done |
| Test pitch detection in Tauri WebView | P1 | 1 hr | May need native audio (Oboe) |
| Add Tauri commands for native features | P2 | Ongoing | `lib.rs` is minimal |
| Sign APK + create Play Store listing | P2 | 2 hrs | Not started |

### Track 3: Gemini Nano + Hands-Free (NDK Spec)
> Goal: 100% hands-free voice-controlled guitar instructor on Android.

| Task | Priority | Effort | Status |
|---|---|---|---|
| Update NDK spec with ML Kit GenAI API research | P1 | 30 min | This document |
| Prototype Gemini Nano via AICore in a test Android app | P2 | 4 hrs | Not started |
| Wire Android SpeechRecognizer (STT) via Tauri plugin | P2 | 4 hrs | Not started |
| Wire Android TTS via Tauri plugin | P2 | 2 hrs | Not started |
| Build Truebadour system prompt for Gemini Nano | P2 | 2 hrs | Prompt exists in `truebadourPrompt.js`, needs adaptation |
| Test LoRA fine-tuning on Bertrand's teaching transcripts | P3 | 8 hrs+ | Research phase |

### Track 4: Spatial Engine → Android XR (Future)
> Goal: AR fretboard overlay on Project Aura glasses.

| Task | Priority | Effort | Status |
|---|---|---|---|
| Apply for Android XR Developer Catalyst program | P1 | 1 hr | Not done |
| Set up Android XR emulator in Android Studio | P2 | 1 hr | Not done |
| Port Bevy engine to Android OpenXR target | P2 | Large | Engine is scaffold, needs real work |
| Implement real OpenXR hand tracking in `sensor_fusion.rs` | P3 | 4 hrs | Scaffold exists |
| Implement spatial anchoring (fretboard aligned to real guitar) | P3 | 8 hrs | Not started |
| Implement scale highlighting on fretboard | P3 | 4 hrs | Pothole grid exists, needs scale logic |
| Wire IPC bridge for Android (replace WebSocket with JNI/Tauri) | P3 | 4 hrs | WebSocket works for desktop, needs Android path |

---

## 5. Momentum Plan — What to Do This Week

### Session 1 (Today): Business + Code Prep
- [ ] Call Bertrand — ask him to record 3 chapter videos (EN + FR)
- [ ] Register LLC online (~$100, 30 min)
- [ ] In code: make Gemini the default Truebadour engine (flip the default in `TruebadourProvider.jsx`)

### Session 2: Paywall
- [ ] Create Stripe account
- [ ] Replace mock URLs in `pricingData.js` with real Stripe Payment Links
- [ ] Add paywall component — check `currentFret >= 4` → show payment gate
- [ ] Add "locked" visual state to chapter cards in `ChapterSidebar.jsx`

### Session 3: Android Foundation
- [ ] Install Android Studio + SDK + NDK
- [ ] Run `cargo tauri android init` in `src-tauri/`
- [ ] Build first APK — even if it's just the PWA in a native wrapper
- [ ] Test: does pitch detection work in the Tauri WebView? (This determines if we need Oboe)

### Session 4: Gemini Nano Prototype
- [ ] Apply for Android XR Developer Catalyst program
- [ ] Create a minimal Android test app with ML Kit GenAI API
- [ ] Send a Truebadour system prompt to Gemini Nano
- [ ] Measure latency and response quality

### Session 5: Video Integration
- [ ] Load Bertrand's first 3 videos into the app
- [ ] Wire video player to chapter progression
- [ ] Test the full flow: open app → free chapter 1 → watch video → try pitch detection → hit paywall on chapter 4

---

## 6. Key Technical Decisions

### Decision: Bevy/OpenXR stays as the AR engine
**Rationale:** The Rust/Bevy/OpenXR engine is architecturally correct for Android XR. Porting to Unity would discard existing work and add a new tech stack. Bevy 0.14 + `bevy_mod_openxr` 0.5 targets OpenXR 1.1, which Android XR supports.

**Risk:** Bevy is not listed as a "supported engine" by Android XR docs (only Unity and Unreal are). However, since Bevy uses OpenXR directly (not an engine-specific wrapper), it should work with the Android XR OpenXR runtime (`libopenxr.google.so`).

**Mitigation:** Validate on the Android XR emulator early. If Bevy doesn't work, fall back to a Unity thin layer that only renders the fretboard, with the companion app driving logic.

### Decision: Gemini Nano is the Android Truebadour default
**Rationale:** Pre-installed, zero download, zero cost, instant latency. Replaces the 800MB wllama download for Android users. The cloud Gemini Flash remains the PWA default.

**Risk:** Gemini Nano may not be available on all Android devices (requires Snapdragon/Tensor/Dimensity). ML Kit GenAI API handles fallback gracefully.

**Mitigation:** Three-tier fallback: Gemini Nano (Android on-device) → Gemini Flash (cloud) → wllama (PWA offline).

### Decision: WebSocket IPC → Tauri commands for Android
**Rationale:** The current WebSocket IPC (`ws://127.0.0.1:8765`) works for desktop (Bevy runs as separate process). On Android, the Bevy engine would run as a native library inside the Tauri app, so Tauri commands (JNI bridge) are more appropriate than a localhost WebSocket.

**Risk:** Requires rewriting the IPC layer. The React side (`useBevyIPC.jsx`) and the Rust side (`ipc.rs`) both need updates.

**Mitigation:** Abstract the IPC behind an interface. Desktop uses WebSocket, Android uses Tauri commands. The `IpcPayload` struct stays the same.

### Decision: Oboe/AAudio for Android pitch detection
**Rationale:** Web Audio API in a Tauri WebView may not meet the `< 25ms` latency requirement from the thesis. Android's native Oboe library provides low-latency audio input via C++.

**Risk:** Adds native code complexity. Requires JNI bridge from Tauri.

**Mitigation:** Test Web Audio in Tauri WebView first. If latency is acceptable (< 50ms), defer Oboe. If not, implement Oboe as a Tauri plugin.

---

## 7. Updated NDK Spec Summary

The existing `VOIX_VIVE_NDK_HANDS_FREE_SPEC.md` is directionally correct. Key updates based on 2026 research:

| Original Spec (2026-06-14) | Updated (2026-06-25) |
|---|---|
| "MiniTrinity JNI architecture" | Use **Tauri 2 Android** as the wrapper (already configured) |
| "Android's built-in AICore (Gemini Nano)" | Confirmed: **ML Kit GenAI APIs** provide high-level access to Gemini Nano via AICore. Available now. |
| "Android Native TTS" | Confirmed: Android `TextToSpeech` API + potential for custom Bertrand voice model |
| "Oboe C++ engine for pitch detection" | Confirmed: **Google Oboe** library is the standard for low-latency Android audio. Test WebView first, use Oboe if needed. |
| "Capacitor wrapper" | Use **Tauri** instead (already configured, Rust-native, better for Bevy integration) |
| No mention of Android XR | Add: **Android XR SDK** for Project Aura. OpenXR 1.1 via `libopenxr.google.so`. Bevy engine targets this directly. |
| No mention of XREAL SDK | Add: **XREAL SDK 3.0** available for Air 2 Ultra today (Unity-based). Use for proof-of-concept only. Primary target is Android XR / Project Aura. |

---

## 8. Regression Guard

> **Workspace note:** `package.json` lives at `apps/companion-app/package.json`. Run from workspace root:
> ```bash
> npm --prefix apps/companion-app run test
> npm --prefix apps/companion-app run build
> npm --prefix apps/companion-app run lint
> ```

Before any companion app changes:
1. `npx vitest run` — must pass 221/221
2. `npx vite build` — must succeed
3. `npx eslint src/` — must be clean

After changes, verify all three pass before committing.

---

*This document is the technical source of truth for development priorities. Update after every session.*
