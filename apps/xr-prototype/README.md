# Voix Vive XR — Spatial Guitar Academy

> **Android XR Developer Catalyst Program — Prototype**
> *Offline-capable, audio-first spatial computing platform for guitar education*

[![Prototype Status](https://img.shields.io/badge/Prototype-WebXR%20Live-brightgreen)](https://github.com/joshua42atkinson/music)
[![Android XR](https://img.shields.io/badge/Android%20XR-Scaffold%20Ready-blue)](./android-xr)
[![License](https://img.shields.io/badge/License-Proprietary-lightgrey)]()

---

## ▶ Quick Start (No Build Required)

The WebXR prototype runs as a **static site** — no npm install, no build step.

### Option A: Local Server (Fastest)

```bash
cd apps/xr-prototype
python3 -m http.server 8080
# Open http://localhost:8080 in Chrome (desktop or Android)
```

### Option B: Direct File Access

Open `apps/xr-prototype/index.html` in a WebXR-compatible browser.

### Option C: GitHub Pages (for reviewer access)

```bash
# From repo root, deploy the prototype to GitHub Pages
git subtree push --prefix apps/xr-prototype origin gh-pages
```

Then share: `https://joshua42atkinson.github.io/music/`

---

## What You'll See

### Desktop Preview Mode
- A **3D holographic guitar fretboard** floating in space (drag to rotate, scroll to zoom)
- Click **"Start Listening"** → play your guitar or sing → notes light up in real-time
- Select different **scales** (C Major, A Minor, G Major, etc.) — scale notes glow blue, root notes glow gold
- Switch between **BE / DO / PLAY** practice modes (fretboard repositions)

### AR Passthrough Mode (ARCore / WebXR Device)
- Click **"Enter AR"** → the fretboard overlays on your real environment via camera passthrough
- Hold your phone over your guitar — the holographic fretboard floats over the physical neck
- Play notes → potholes illuminate on the virtual fretboard in real-time
- **Spatial audio** — feedback tones are positioned in 3D space at the fret location
- **Hand tracking** — fingertip joints rendered as gold spheres (when supported)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Voix Vive XR Architecture                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐    ┌──────────────────────────────────┐│
│  │  WebXR Prototype │    │  Android XR (Jetpack XR)        ││
│  │  (This Repo)     │    │  (android-xr/ scaffold)         ││
│  │                  │    │                                  ││
│  │  Three.js + WebXR│    │  Kotlin + OpenGLES + Oboe       ││
│  │  ↓               │    │  ↓                               ││
│  │  YIN Pitch Det.  │    │  YIN Pitch Det. (Oboe)          ││
│  │  ↓               │    │  ↓                               ││
│  │  3D Fretboard    │    │  3D Fretboard (OpenGLES)        ││
│  │  ↓               │    │  ↓                               ││
│  │  Spatial Audio   │    │  Spatial Audio (Oboe)           ││
│  │  ↓               │    │  ↓                               ││
│  │  WebXR Session   │    │  XR Session (Jetpack XR)        ││
│  │  (immersive-ar)  │    │  (libopenxr.google.so)          ││
│  └─────────────────┘    └──────────────────────────────────┘│
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Companion App (Production PWA — 224 tests passing)     ││
│  │  React + Vite + Tauri 2 + Web Audio + Gemini AI        ││
│  │  → The 2D version that's already built and working      ││
│  │  → Walkthrough: https://youtu.be/czyY0ZE2n3U           ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Spatial Engine (Rust/Bevy — scaffold)                  ││
│  │  Bevy 0.14 + bevy_mod_openxr + WebSocket IPC            ││
│  │  → The native XR engine targeting Android XR OpenXR     ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features Demonstrated

### 1. Real-Time Pitch Detection (YIN Algorithm)
- **Algorithm:** YIN autocorrelation with parabolic interpolation
- **Latency:** < 50ms (Web Audio API), < 20ms target (Oboe on Android)
- **Range:** 60Hz – 1200Hz (covers guitar open E2 to high E4 + harmonics)
- **Accuracy:** ±5 cents with parabolic interpolation
- **Source:** Ported from the production companion app (`src/audio/pitchDetection.js`)

### 2. Holographic Fretboard Overlay
- 6 strings × 12 frets = 78 note positions ("potholes")
- Logarithmic fret spacing (matches real guitar geometry)
- Standard tuning: E2 A2 D3 G3 B3 E4
- Scale highlighting: root notes (gold), scale notes (blue), non-scale (hidden)
- Active note animation: potholes pulse and glow when pitch is detected

### 3. Spatial Audio Feedback
- Web Audio API `PannerNode` with HRTF panning model
- When a note is detected, a tone plays at the 3D position of the matching fretboard pothole
- Listener position updates from XR camera pose in AR mode
- Creates an immersive audio-visual feedback loop

### 4. BE / DO / PLAY Curriculum Modes
The Voix Vive curriculum uses a three-phase practice cycle:
- **BE** — Observation & somatic check-in. Fretboard at eye level, focus on breathing
- **DO** — Mechanics & "The Pling" (picking technique). Fretboard zoomed to right-hand area
- **PLAY** — Flow state with AI backing band. Fretboard at comfortable playing position

### 5. WebXR AR Passthrough
- `immersive-ar` session with camera passthrough
- Optional features: hand-tracking, hit-test, anchors
- Desktop fallback: OrbitControls for 3D preview without AR hardware

### 6. Hand Tracking (When Available)
- OpenXR hand joint rendering (25 joints per hand)
- Gold spheres at fingertip positions
- Future: fret position detection from index fingertip pose

---

## File Structure

```
apps/xr-prototype/
├── index.html              # WebXR entry point (static, no build)
├── style.css               # Voix Vive themed UI
├── js/
│   ├── main.js             # App bootstrap, Three.js scene, WebXR session
│   ├── fretboard.js        # 3D fretboard geometry + note visualization
│   ├── pitch-detection.js  # YIN algorithm + microphone management
│   ├── spatial-audio.js    # 3D positioned audio feedback
│   └── ui.js               # HUD overlay manager
├── android-xr/             # Native Android XR project scaffold
│   ├── settings.gradle.kts
│   ├── build.gradle.kts
│   ├── gradle.properties
│   └── app/
│       ├── build.gradle.kts          # Jetpack XR + Oboe + ML Kit deps
│       └── src/main/
│           ├── AndroidManifest.xml   # XR feature declarations
│           └── java/com/voixvive/xr/
│               ├── MainActivity.kt           # XR session lifecycle
│               ├── XrFretboardRenderer.kt     # OpenGLES fretboard renderer
│               └── PitchDetectionEngine.kt    # Oboe + YIN pitch detection
└── README.md               # This file
```

---

## Android XR Migration Path

The WebXR prototype demonstrates the concept. The `android-xr/` scaffold shows the native implementation path:

| Feature | WebXR Prototype | Android XR Native |
|---|---|---|
| Rendering | Three.js (WebGL) | OpenGLES 3.0 |
| XR Runtime | WebXR API | Jetpack XR (`libopenxr.google.so`) |
| Pitch Detection | Web Audio API (YIN) | Oboe (YIN, < 20ms latency) |
| Spatial Audio | Web Audio PannerNode | Oboe + AAudio |
| Hand Tracking | WebXR Hand API | OpenXR hand joints |
| AI Coaching | Gemini Flash (cloud) | Gemini Nano (on-device, ML Kit GenAI) |
| Passthrough | WebXR `immersive-ar` | Jetpack XR PassthroughCameraActivity |
| Distribution | GitHub Pages / PWA | Google Play Store |

### Why WebXR First?
1. **Zero friction for reviewers** — open a URL, no Android Studio needed
2. **Same spatial concepts** — WebXR → OpenXR is a direct mapping
3. **Proves the use case** — pitch detection + 3D fretboard + spatial audio all work today
4. **The companion app is already a PWA** — WebXR is the natural extension

### Android XR SDK Dependencies
```kotlin
// Jetpack XR — spatial computing
implementation("androidx.xr:scenecore:1.0.0-alpha01")
implementation("androidx.xr:openxr:1.0.0-alpha01")

// ML Kit GenAI — Gemini Nano on-device AI
implementation("com.google.mlkit:genai:1.0.0")

// Oboe — low-latency audio for pitch detection
implementation("com.google.oboe:oboe:1.9.0")
```

---

## The Market Problem We Solve

The guitar learning market is **$398M** and dominated by 2D screen-based apps (Yousician, Fender Play). These apps force students to break physical connection with their instrument to stare at a screen. This induces:

- **Physical tension** (neck strain, poor posture)
- **Cognitive load** (split attention between screen and instrument)
- **Context switching** (look at screen → look at hands → look at screen)

This violates the core pedagogical principle of the Voix Vive curriculum: **"Tension is the enemy."**

### Android XR Solution
Spatial computing projects the instructional environment **over the physical instrument**. The student looks at their actual hands, not a screen. The holographic fretboard overlays directly on the real guitar neck.

---

## Team

| Role | Name | Background |
|---|---|---|
| **Sovereign AI Architect** | Joshua Atkinson | USMC Firefighting Chief (17 yrs), M.S. Learning Design & Technology (Purdue), 70% Disabled Veteran. Specialist in zero-cloud, offline-first AI architectures. |
| **Clinical Lead** | Anthony Atkinson | PhD Nurse Leadership, Combat Medic, 100% Disabled Veteran. (Medical XR pivot — Phase 2) |

### Why This Team?
- **Pedagogical expertise:** Master's degree in Learning Design & Technology from Purdue
- **Operational discipline:** 17 years managing $13M budgets and cross-functional teams in the USMC
- **Technical capability:** The 2D version of Voix Vive is already built and functional (224 tests, production PWA, Tauri Android config)
- **Veteran advantage:** Service-Disabled Veteran-Owned Small Business (SDVOSB) status provides priority access to DoD SBIR grants ($250K Phase I, $1M+ Phase II) for the medical XR pivot

---

## Roadmap

### Phase 1: Catalyst Prototype (This Repo)
- [x] WebXR prototype with pitch detection + 3D fretboard
- [x] Android XR project scaffold (Jetpack XR + Oboe + ML Kit)
- [x] Spatial audio feedback
- [ ] Android XR emulator testing (requires Android Studio + XR plugin)
- [ ] Native OpenGLES fretboard renderer implementation
- [ ] Gemini Nano integration (Troubadour AI coaching)

### Phase 2: Dev Kit Validation (With Catalyst Hardware)
- [ ] Spatial anchor calibration (align virtual fretboard to physical guitar)
- [ ] Hand tracking → fret position detection (index fingertip pose)
- [ ] Oboe pitch detection latency validation (< 20ms target)
- [ ] Gemini Nano on-device AI coaching (Socratic method, Bertrand's teaching style)
- [ ] Full BE/DO/PLAY mode transitions with spatial UI panels

### Phase 3: Play Store Launch
- [ ] Google Play Store listing with XR category
- [ ] Subscription tiers (Free → Community → Apprentice → Journeyman → Master)
- [ ] Video review submission (AI pre-screening → human mentor review)
- [ ] Multi-language support (EN/FR — companion app already has 700/700 i18n keys)

### Phase 4: Medical XR Pivot (SDVOSB)
- [ ] DoD Phase I SBIR grant application ($250K)
- [ ] Biofeedback layer (HRV gating from Voix Vive)
- [ ] VR environments for PTSD psychedelic integration
- [ ] VA SimLEARN network partnership

---

## Technical Details

### Pitch Detection: YIN Algorithm
The YIN (de Cheveigné & Kawahara, 2002) algorithm provides robust fundamental frequency detection:

1. **Difference function** — squared error between signal and time-shifted copy
2. **Cumulative mean normalized difference** — normalizes for amplitude
3. **Absolute threshold** — finds first dip below 0.15 (confident pitch)
4. **Parabolic interpolation** — sub-sample precision for ±5 cent accuracy

This is the same algorithm used in the production companion app, validated with 224 passing tests.

### Spatial Audio: HRTF Panning
The Web Audio `PannerNode` uses Head-Related Transfer Functions (HRTF) to simulate 3D audio:
- Sound source position = fretboard pothole world position
- Listener position = XR camera pose (updated each frame in AR mode)
- Distance model: inverse (closer = louder)
- Creates the illusion that feedback tones emanate from the physical fret location

### WebXR Session Features
```javascript
// Requested optional features for the AR session
{
  optionalFeatures: ['hand-tracking', 'hit-test', 'anchors']
}
```

- **hand-tracking:** 25 joints per hand for fret position detection
- **hit-test:** tap to place fretboard on a real surface
- **anchors:** lock fretboard to real-world position (survives headset repositioning)

---

## Companion App (Already Built)

The 2D version of Voix Vive is a production-ready PWA:

| Metric | Status |
|---|---|
| Tests | 224/224 passing |
| Lint | 0 errors |
| i18n | 700/700 EN/FR key parity |
| PWA | Configured (manifest, service worker) |
| Tauri Android | Configured (`src-tauri/tauri.conf.json`) |
| Google OAuth → Gemini | Complete (zero API cost) |
| Hands-free voice nav | Complete (17 commands, EN/FR) |
| AI pre-screening | Complete (Gemini video analysis) |

**Walkthrough video:** https://youtu.be/czyY0ZE2n3U

---

## License

Proprietary. © 2026 Joshua Atkinson. All rights reserved.

---

*Built for the Google Android XR Developer Catalyst Program.*
*Submission date: June 30, 2026*
