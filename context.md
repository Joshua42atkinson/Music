# Voix Vive XR — Session Context & Turnover

**Date**: June 30, 2026
**Goal**: Submit to Google Android XR Developer Catalyst Program (deadline: today, 11:59 PM PDT)
**GitHub**: `github.com/joshua42atkinson/music` (pushed, commit `e1ed1b1`)
**Cloudflare**: `voix-vive.pages.dev` (companion app — may need rebuild)
**Target Device**: XREAL Aura (Android XR, optical see-through, hand tracking, Fall 2026 launch)

---

## The Goal

Build a spatial guitar academy for XREAL Aura glasses that:
1. Shows a holographic fretboard overlay on the user's real guitar
2. Tracks the user's actual hands via ARCore hand tracking (XR_EXT_hand_tracking)
3. Maps fingertips to fret positions in real-time
4. Detects pitch via microphone (YIN algorithm) and highlights the played note
5. Provides BE/DO/PLAY curriculum modes (somatic → mechanics → performance)

The Catalyst Program provides: XREAL Aura dev kits, non-recoupable grants, Google engineering support.
Applications close **today**. Selection notification by July 15, 2026.

---

## What We Built (Two Parallel Paths)

### Path 1: Bevy + OpenXR (`apps/spatial-engine-bevy/`)
Cross-platform Rust engine with desktop emulator for testing without hardware.

**Active and working:**
- `fretboard.rs` — 3D holographic fretboard (78 potholes, 6 strings × 12 frets, logarithmic spacing, inlay dots, headstock, glowing emissive materials, scale highlighting)
- `pitch_detection.rs` — YIN algorithm + cpal 48kHz microphone input (verified working — detects real guitar notes in real-time)
- `hand_tracking.rs` — OpenXR XR_EXT_hand_tracking scaffold (fingertip → fret mapping logic, desktop sine-wave fallback)
- `spatial_audio.rs` — SpatialListener positioned at camera, note feedback logging
- `environment_manager.rs` — Zen Garden / Studio / Stage scenes
- `modes.rs` — BE/DO/PLAY state machine with scene switching
- `xr_shell.rs` — XR environment setup (floor, lighting, tonemapping)
- `bin/desktop.rs` — Desktop emulator with PanOrbitCamera + on-screen note display overlay (96pt gold text, frequency, cents, tuning indicator)
- `bin/xr.rs` — Native OpenXR entry point (ALPHA_BLEND for optical see-through, ClearColor::NONE)

**Build status:** Clean, zero errors, zero warnings
**Run:** `cargo run --bin voix-vive-desktop --features desktop`

**Gated behind `extras` feature (code exists, needs Bevy 0.18 ParamSet fixes):**
- `system_menu.rs` — BE/DO/PLAY menu (B0001 query conflict with spatial_ui)
- `holographic_ui.rs` — Note display panel (B0001 conflict)
- `spatial_ui.rs` — Render-to-texture 3D panels
- `widgets.rs` — Glass panels + holographic buttons
- `interaction.rs` — Laser pointer + hit cursor
- `sensor_fusion.rs` — Hand velocity + Pling evaluation
- `truebadour_ai.rs` — AI bass response + context window
- `audio_transducer.rs` — Note → audio playback (needs audio asset)
- `ipc.rs` — WebSocket IPC server (needs tokio/warp)

### Path 2: Kotlin + Jetpack XR SDK (`apps/xr-prototype/android-xr/`)
Native Android XR app using Google's official SDK — this is what the Catalyst program wants to see.

**Files:**
- `MainActivity.kt` — `Session.create()`, `Config.setHandTracking(HandTrackingMode.BOTH)`, permission flow, Oboe pitch detection, Compose UI
- `HandTrackingManager.kt` — `Hand.left(session).state.collect()`, `HandJointType.INDEX_TIP` → fret position mapping, logarithmic fret spacing, proximity threshold, string detection
- `VoixViveXrApp.kt` — Compose spatial UI (72sp note display, frequency, cents/tuning, fret position card, hand tracking status, Voix Vive brand colors)
- `PitchDetectionEngine.kt` — Oboe low-latency 48kHz + YIN algorithm (complete, working)
- `XrFretboardRenderer.kt` — OpenGLES renderer scaffold (TODOs for actual draw calls)
- `build.gradle.kts` — Jetpack XR SDK DP4 (`androidx.xr:scenecore:1.0.0-alpha04`, `arcore`, `runtime`), Compose BOM, coroutines, Oboe
- `AndroidManifest.xml` — `HAND_TRACKING` permission (required), spatial anchoring feature, XR activity intent filter

### Also on GitHub:
- `LICENSE` — Business Source License 1.1 (non-commercial OK, commercial requires license, converts to Apache 2.0 in 2030)
- `NOTICE` — Third-party license attributions (Bevy, OpenXR, React, Three.js, cpal, etc.)
- `apps/spatial-engine-bevy/README.md` — Full architecture, XREAL Aura spec, build instructions
- `apps/xr-prototype/` — WebXR prototype (Three.js) + Android XR scaffold
- `apps/companion-app/` — Existing PWA (React/Vite, deployed to Cloudflare)

---

## Where We Drifted

1. **Started with rapid WebXR prototype** (Three.js + WebXR API) — useful exploration but not what Catalyst wants
2. **Ported all TRINITY OS modules** — comprehensive but introduced B0001 Bevy query conflicts that took significant debugging time. Ended up gating 9 modules behind `extras` feature flag
3. **Spent time on VR tavern / Troubadour adventure** — creative vision but not needed for Catalyst submission. Correctly deferred to "coming soon"
4. **Bevy visual quality** — upgraded fretboard 3x scale, added inlay dots, headstock, brighter emissive materials, better camera angle. Was interrupted mid-edit but completed
5. **Desktop emulator on-screen overlay** — added 96pt note display, frequency, cents, tuning indicator for demo recording. Had to fix B0001 conflict with multiple Single<Text> queries
6. **Old XREAL glasses discussion** — user has XREAL Air/One (display-only, no hand tracking). Useful as monitor for desktop emulator but not for AR hand tracking. XREAL Aura (Fall 2026) is the target
7. **License discussion** — chose BSL 1.1, created LICENSE + NOTICE files

---

## What's Done

- [x] Bevy 0.18 spatial engine with 7 working plugins
- [x] Real-time pitch detection (YIN + cpal, verified detecting guitar notes)
- [x] 3D holographic fretboard (78 potholes, scale highlighting, inlay dots)
- [x] Hand tracking module (fingertip → fret mapping logic)
- [x] Desktop emulator with on-screen note overlay (demo-ready)
- [x] Native OpenXR binary for XR headsets
- [x] Kotlin Android XR app with real Jetpack XR SDK APIs
- [x] ARCore hand tracking manager (Hand.left/right, INDEX_TIP → fret)
- [x] Compose spatial UI (note display, fret position, tuning)
- [x] Oboe pitch detection engine (Kotlin)
- [x] AndroidManifest with HAND_TRACKING permission
- [x] BSL 1.1 license + third-party notices
- [x] README with XREAL Aura spec + architecture
- [x] Everything committed and pushed to GitHub

---

## What Needs To Happen Next

### For Catalyst Submission (today)

1. **Complete the Catalyst application form** at `g.co/dev/catalyst`
   - Form requires: project description, form factor choice (wired XR glasses), vertical, team info, funding needs, timeline
   - Link GitHub repo: `github.com/joshua42atkinson/music`
   - Link live site: `voix-vive.pages.dev`
   - Mention both paths: native Kotlin (Jetpack XR SDK) + Bevy OpenXR engine

2. **Record a demo video** (2-3 minutes)
   - OBS screen capture of desktop emulator: run `cargo run --bin voix-vive-desktop --features desktop`, play guitar, show note detection + fretboard lighting up
   - Camera footage: user wearing XREAL glasses playing guitar (shows form factor vision)
   - Quick cuts: code on GitHub, AndroidManifest, hand tracking module
   - Voiceover: explain XREAL Aura version with optical see-through + hand tracking

3. **Rebuild + deploy companion app to Cloudflare** (if needed)
   - `cd apps/companion-app && npm run build && npx wrangler pages deploy dist`
   - Ensures `voix-vive.pages.dev` is current

### Post-Submission (if accepted)

4. **Fix Bevy 0.18 B0001 query conflicts** — use ParamSet in system_menu.rs and holographic_ui.rs to re-enable those plugins
5. **Implement OpenGLES draw calls** in `XrFretboardRenderer.kt` (currently has TODOs)
6. **Spatial anchor calibration** — align virtual fretboard to real guitar neck via hand tracking
7. **Gemini Nano AI coaching** — on-device Socratic dialogue with Bertrand (ML Kit GenAI)
8. **VR Tavern environment** — crowd mood reflecting player performance (coming soon)
9. **Troubadour adventure mode** — choose-your-own-adventure narrative (918-line story data exists)
10. **Biometric integration** — HRV gating, stress-level environment modulation

---

## Key Technical Decisions

| Decision | Rationale |
|---|---|
| Bevy 0.18 + OpenXR | Cross-platform, Rust safety, desktop emulator for testing without hardware |
| Kotlin + Jetpack XR SDK | What Google wants for Catalyst — native Android XR, ARCore hand tracking |
| BSL 1.1 license | IP protection + transparency for reviewers, converts to Apache 2.0 in 2030 |
| Gate extras behind feature flag | Keeps default build clean, preserves code for future |
| XREAL Aura as primary target | Optical see-through (see real guitar), hand tracking (fingertip → fret), lightweight (< 95g) |
| YIN algorithm for pitch detection | Proven accuracy for monophonic instruments, ±5 cent precision, 60-1200Hz range |
| Logarithmic fret spacing (rule of 17.817) | Matches real guitar geometry — frets get closer together up the neck |

---

## File Map

```
Bertrand-Masterclass/
├── LICENSE                          # BSL 1.1
├── NOTICE                           # Third-party attributions
├── README.md                        # Project overview
├── context.md                       # This file
├── apps/
│   ├── companion-app/               # React PWA (voix-vive.pages.dev)
│   ├── spatial-engine-bevy/         # Bevy OpenXR engine
│   │   ├── Cargo.toml               # Bevy 0.18, cpal, OpenXR deps
│   │   ├── AndroidManifest.xml      # Android XR config
│   │   ├── README.md                # Architecture + XREAL Aura spec
│   │   ├── scripts/launch_xr.sh     # Vive Elite Pro launch script
│   │   └── src/
│   │       ├── lib.rs               # 7 active plugins, extras gated
│   │       ├── bin/desktop.rs       # Desktop emulator + note overlay
│   │       ├── bin/xr.rs            # Native OpenXR entry (XREAL Aura)
│   │       ├── fretboard.rs         # 3D fretboard (78 potholes)
│   │       ├── pitch_detection.rs   # YIN + cpal (working)
│   │       ├── hand_tracking.rs     # Fingertip → fret mapping
│   │       ├── spatial_audio.rs     # SpatialListener + note feedback
│   │       ├── environment_manager.rs  # Zen Garden / Studio / Stage
│   │       ├── modes.rs             # BE/DO/PLAY state machine
│   │       ├── xr_shell.rs          # XR environment setup
│   │       └── [9 gated modules]    # Coming soon (extras feature)
│   └── xr-prototype/
│       ├── index.html               # WebXR prototype
│       ├── js/                      # Three.js modules
│       └── android-xr/              # Kotlin Jetpack XR app
│           ├── app/build.gradle.kts # Jetpack XR SDK DP4
│           └── app/src/main/java/com/voixvive/xr/
│               ├── MainActivity.kt          # Session + permissions + lifecycle
│               ├── HandTrackingManager.kt   # ARCore hand joints → fret
│               ├── VoixViveXrApp.kt          # Compose spatial UI
│               ├── PitchDetectionEngine.kt  # Oboe + YIN
│               └── XrFretboardRenderer.kt   # OpenGLES scaffold
```

---

## Build Commands

```bash
# Bevy desktop emulator (working now)
cd apps/spatial-engine-bevy
cargo run --bin voix-vive-desktop --features desktop

# Bevy native OpenXR (needs VR headset)
cargo run --bin voix-vive-xr --features xr

# Bevy with all extras (coming-soon modules)
cargo run --bin voix-vive-desktop --features "desktop,extras"

# Cloudflare deploy (companion app)
cd apps/companion-app
npm run build && npx wrangler pages deploy dist
```

---

## Contact

- **Joshua Atkinson** — joshua@voixvive.com
- **GitHub**: github.com/joshua42atkinson/music
- **Live site**: voix-vive.pages.dev
- **Program**: g.co/dev/catalyst (deadline: June 30, 2026, 11:59 PM PDT)
