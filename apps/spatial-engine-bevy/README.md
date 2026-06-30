# Voix Vive XR — Spatial Guitar Academy (Bevy OpenXR)

> **Native Bevy 0.18 OpenXR engine for guitar education**
> *Built for XREAL Aura — optical see-through, hand tracking, real-time pitch detection*

---

## Target Device: XREAL Aura

| Spec | Value |
|---|---|
| **Display** | Optical see-through (OST) — Sony Micro-OLED, 1920×1200 per eye |
| **FOV** | 70° (virtually borderless) |
| **Weight** | < 95g |
| **Hand tracking** | World-facing cameras ×2 (XR_EXT_hand_tracking) |
| **Spatial anchoring** | 6DoF tracking |
| **Platform** | Android XR + Snapdragon Reality Elite + X1S Coprocessor |
| **Input** | Hands (pinch gesture), voice, touchpad on compute puck |
| **Launch** | Fall 2026 |

### How It Works for Guitar

The XREAL Aura is **optical see-through** — you see the real world directly through glass, not camera passthrough. This means:

1. **You see your real guitar and real hands** through the glass
2. **The holographic fretboard overlays** on top of your real fretboard
3. **Hand tracking cameras** detect your actual fingertip positions
4. **The system maps your fingertips to fret positions** in real-time
5. **Pitch detection** via microphone confirms the note you're playing
6. **No camera delay** — optical see-through has zero passthrough latency

This is the ideal form factor for guitar education: lightweight glasses, real-world visibility, and digital overlays that enhance (not replace) the physical instrument.

---

## Quick Start

### Desktop Emulator (No VR Headset Required)

```bash
cd apps/spatial-engine-bevy
cargo run --bin voix-vive-desktop --features desktop
```

Opens a 3D window with:
- Holographic guitar fretboard (6 strings × 12 frets, 78 note potholes)
- Zen Garden environment (trees, stones, warm sunlight)
- Third-eye anchored system menu (click "VV" to expand → BE/DO/PLAY)
- Real-time pitch detection via microphone (cpal + YIN algorithm)
- Note display panel showing detected note, cents deviation, frequency
- Mouse orbit camera (right-click drag to rotate, scroll to zoom)

### Native OpenXR (Vive Elite Pro / Monado)

```bash
cd apps/spatial-engine-bevy
cargo run --bin voix-vive-xr --features xr
```

Or use the launch script:
```bash
bash apps/spatial-engine-bevy/scripts/launch_xr.sh
```

Requires:
- Monado OpenXR runtime (installed: `libopenxr1-monado` 25.0.0)
- VR headset connected (HTC Vive Elite Pro detected via OpenXR)
- Microphone (for pitch detection)

### Android XR (Target Platform)

```bash
# Build APK (requires Android NDK + cargo-apk)
cargo apk build --features xr --target aarch64-linux-android
```

Package: `com.voixvive.xr` · SDK 30-36 · `aarch64-linux-android`

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Voix Vive XR — Bevy OpenXR Engine               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  src/bin/desktop.rs    → Desktop emulator (PanOrbitCamera)   │
│  src/bin/xr.rs         → Native OpenXR (immersive-ar)        │
│  src/lib.rs            → VoixViveXrPlugin + Android cdylib   │
│                                                              │
│  ┌─ Core XR Infrastructure (ported from TRINITY OS) ──────┐ │
│  │  spatial_ui.rs     → Render-to-texture 3D panels        │ │
│  │  widgets.rs        → Glass panels + holographic buttons │ │
│  │  xr_shell.rs       → XR environment (floor, lights)     │ │
│  │  interaction.rs    → Laser pointer + hit cursor         │ │
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─ Voix Vive Guitar Education ───────────────────────────┐ │
│  │  fretboard.rs      → 6×12 fretboard, scale highlighting│ │
│  │  pitch_detection.rs→ YIN algorithm + cpal audio input  │ │
│  │  spatial_audio.rs  → 3D positioned audio feedback      │ │
│  │  holographic_ui.rs → Note display + tuning panel       │ │
│  │  system_menu.rs    → BE/DO/PLAY curriculum modes       │ │
│  │  environment_mgr.rs→ Zen Garden / Studio / Stage       │ │
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─ AI + Sensor Fusion ───────────────────────────────────┐ │
│  │  truebadour_ai.rs  → Context window + AI bass response │ │
│  │  sensor_fusion.rs  → Hand velocity + Pling evaluation  │ │
│  │  audio_transducer.rs→ JSON token → audio playback      │ │
│  │  ipc.rs            → WebSocket IPC (port 8765)         │ │
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─ Curriculum Modes ─────────────────────────────────────┐ │
│  │  BE  → Observation & somatic check-in (Zen Garden)     │ │
│  │  DO  → Mechanics & The Pling (Studio)                  │ │
│  │  PLAY→ Flow with AI backing band (Stage)               │ │
│  └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Modules

### Core XR (Ported from TRINITY OS)

| Module | Description |
|---|---|
| `spatial_ui.rs` | Render-to-texture 3D panels with pointer drag + inertia physics |
| `widgets.rs` | Glassmorphism panels + holographic buttons (Voix Vive gold palette) |
| `xr_shell.rs` | XR environment setup: floor, directional sun, fill light, gold rim light |
| `interaction.rs` | Laser pointer + hit cursor for VR controller interaction |

### Guitar Education

| Module | Description |
|---|---|
| `fretboard.rs` | 6 strings × 12 frets = 78 note potholes. Logarithmic fret spacing. Standard tuning (E2-A2-D3-G3-B3-E4). Scale highlighting: root=gold, scale=blue, active=pulsing gold |
| `hand_tracking.rs` | OpenXR XR_EXT_hand tracking for XREAL Aura. Maps left hand index fingertip → fret position, right hand → picking position. Desktop fallback uses simulated sine wave. |
| `pitch_detection.rs` | YIN autocorrelation algorithm with parabolic interpolation. cpal 48kHz mono input. ±5 cent accuracy. 60Hz–1200Hz range |
| `spatial_audio.rs` | SpatialListener positioned at camera. Note feedback tones at 3D fretboard positions |
| `holographic_ui.rs` | Floating note display panel: note name (96pt), cents deviation, frequency, in-scale indicator |
| `system_menu.rs` | Third-eye anchored menu. Collapsed="VV" badge, expanded=BE/DO/PLAY buttons. Follows camera with lerp animation |
| `environment_manager.rs` | Three scenes: ZenGarden (trees, stones, warm sun), Studio (spotlight, dark floor), Stage (colored spotlights, backdrop) |

### AI + Sensor Fusion

| Module | Description |
|---|---|
| `truebadour_ai.rs` | Rolling context window (last 8 notes). Predicts bass response. Bounces Truebadour avatar on note detection |
| `sensor_fusion.rs` | Tracks right-hand velocity (OpenXR hand bones in XR, sine wave on desktop). Evaluates "Pling" quality (muted/aggressive/perfect) |
| `audio_transducer.rs` | Maps note names to pitch-shifted audio playback. Bevy 0.18 AudioPlayer + PlaybackSettings |
| `ipc.rs` | WebSocket server on port 8765. Bidirectional IPC with companion app. Message-based (Bevy 0.18 Message API) |
| `modes.rs` | BE/DO/PLAY state machine. Switches environment scenes on mode change |

---

## Build Commands

```bash
# Desktop emulator (fast iteration, no headset)
cargo run --bin voix-vive-desktop --features desktop

# Native OpenXR (Vive Elite Pro + Monado)
cargo run --bin voix-vive-xr --features xr

# Release build (optimized)
cargo build --release --bin voix-vive-desktop --features desktop
cargo build --release --bin voix-vive-xr --features xr

# Android XR APK (requires cargo-apk + NDK)
cargo apk build --features xr --target aarch64-linux-android
```

---

## Testing

### Desktop Emulator
1. Run `cargo run --bin voix-vive-desktop --features desktop`
2. A window opens showing the Zen Garden environment with the fretboard
3. Right-click drag to orbit, scroll to zoom
4. Allow microphone access — play guitar or sing
5. Notes light up on the fretboard in real-time
6. Click the "VV" badge (top-center) to open the BE/DO/PLAY menu

### Vive Elite Pro (OpenXR)
1. Ensure Monado runtime is running: `systemctl --user start monado`
2. Connect Vive Elite Pro via USB
3. Run `bash scripts/launch_xr.sh` or `cargo run --bin voix-vive-xr --features xr`
4. The fretboard appears floating in passthrough space
5. Hand tracking shows fingertip positions (when available)
6. Microphone input drives real-time note detection

---

## Coming Soon (Post-Funding)

These features are designed but not yet implemented in the XR engine:

- **VR Tavern Environment** — A medieval tavern scene where the crowd reacts to the player's mood and performance quality. Based on the existing `Tavern3DVisualizer.jsx` (companion app) which dynamically adjusts fire color, particle density, and ambient atmosphere based on pitch accuracy, breath state, and biometric stress levels.

- **Troubadour Adventure Mode** — A choose-your-own-adventure narrative game set in Eleanor of Aquitaine's court (1165 CE). The player progresses through scenes by singing or playing specific intervals (Unison → Octave). Includes 12+ branching scenes, bonus paths for sung responses, and multiple endings. Story data exists at `src/data/adventures/truebadour.js` (918 lines, bilingual EN/FR).

- **Gemini Nano AI Coaching** — On-device Socratic dialogue with "Bertrand" (the Troubadour mentor). Uses ML Kit GenAI for offline AI coaching during practice sessions.

- **Hand Tracking Fret Detection** — Index fingertip pose → fret position mapping. Detects which fret the student is pressing without requiring pitch detection.

- **Biometric Integration** — HRV gating (breath-state aware content unlocking), stress-level environment modulation, flow-index tracking.

- **Video Review Submission** — AI pre-screening → human mentor review pipeline.

---

## Technology Stack

| Component | Technology |
|---|---|
| Game Engine | Bevy 0.18.1 (ECS) |
| XR Runtime | bevy_mod_openxr 0.5 + OpenXR 1.1 |
| Audio Input | cpal 0.15 (cross-platform low-latency) |
| Pitch Detection | YIN algorithm (pure Rust) |
| IPC | WebSocket (warp + tokio) on port 8765 |
| Android Build | cargo-apk, NDK 30, aarch64-linux-android |
| XR Runtime (Linux) | Monado 25.0.0 |

---

## File Structure

```
apps/spatial-engine-bevy/
├── Cargo.toml              # Bevy 0.18 + OpenXR + cpal + Android config
├── AndroidManifest.xml     # Android XR feature declarations
├── scripts/
│   └── launch_xr.sh        # Vive Elite Pro launch script
└── src/
    ├── lib.rs              # Module registration + VoixViveXrPlugin
    ├── bin/
    │   ├── desktop.rs      # Desktop emulator entry point
    │   └── xr.rs           # Native OpenXR entry point
    ├── spatial_ui.rs       # 3D render-to-texture panels
    ├── widgets.rs          # Glass panels + holographic buttons
    ├── xr_shell.rs         # XR environment setup
    ├── interaction.rs      # Laser pointer + hit cursor
    ├── environment_manager.rs  # Zen Garden / Studio / Stage
    ├── system_menu.rs      # BE/DO/PLAY menu
    ├── holographic_ui.rs   # Note display panel
    ├── fretboard.rs        # 3D holographic fretboard
    ├── hand_tracking.rs    # XREAL Aura hand tracking (fingertip → fret)
    ├── pitch_detection.rs  # YIN + cpal audio input
    ├── spatial_audio.rs    # 3D positioned audio
    ├── modes.rs            # BE/DO/PLAY state machine
    ├── sensor_fusion.rs    # Hand velocity + Pling evaluation
    ├── truebadour_ai.rs    # AI bass response + context window
    ├── audio_transducer.rs # Note → audio playback
    └── ipc.rs              # WebSocket IPC server
```

---

## License

**Business Source License 1.1 (BSL)**

- **Copyright**: © 2026 Joshua Atkinson. All rights reserved.
- **Non-commercial use**: Permitted (personal learning, academic research, evaluation)
- **Commercial use**: Requires a commercial license — contact `joshua@voixvive.com`
- **Change Date**: 2030-06-30 — automatically converts to Apache 2.0
- **Full text**: See [LICENSE](../../LICENSE) file
- **Third-party notices**: See [NOTICE](../../NOTICE) file

*Built for the Google Android XR Developer Catalyst Program.*
