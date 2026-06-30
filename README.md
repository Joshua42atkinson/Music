# Voix Vive

Voix Vive: Somatic Music Education in the Age of Generative AI.

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-blue?style=for-the-badge)](https://voix-vive.pages.dev)
[![XR Prototype](https://img.shields.io/badge/XR%20Prototype-WebXR%20Live-brightgreen?style=for-the-badge)](./apps/xr-prototype)

Live URL: [https://voix-vive.pages.dev](https://voix-vive.pages.dev)

[![10-Minute Walkthrough](https://img.shields.io/badge/Watch-10%20Min%20Walkthrough-red?style=for-the-badge&logo=youtube)](https://youtu.be/czyY0ZE2n3U)

## Voix Vive XR — Spatial Guitar Academy (Android XR Prototype)

A WebXR prototype demonstrating the spatial computing vision for Android XR. Projects a holographic guitar fretboard over the user's physical instrument using AR passthrough, with real-time pitch detection and spatial audio feedback.

**Quick start (no build required):**
```bash
cd apps/xr-prototype
python3 -m http.server 8080
# Open http://localhost:8080 in Chrome
```

Includes:
- WebXR AR passthrough with 3D fretboard overlay
- YIN pitch detection (real-time, from microphone)
- Spatial audio feedback (3D positioned tones)
- BE/DO/PLAY curriculum mode system
- Android XR native scaffold (Kotlin/Jetpack XR + Oboe + ML Kit)

See [`apps/xr-prototype/README.md`](./apps/xr-prototype/README.md) for full documentation.

## Maturation Maps

Strategic planning documents for the XR app's development trajectory, aligned with Bertrand's pedagogy and XREAL Aura hardware capabilities. These are living documents — reference them in future workflows for context on architecture decisions, feature priorities, and the BE/DO/PLAY pedagogical model.

- [`docs/XR_MATURATION_MAP.md`](./docs/XR_MATURATION_MAP.md) — Full 6-phase maturation map: scaffold → first light → guitar alignment → curriculum in space → Truebadour AI coach → somatic layer → performance & connection. Includes chapter-to-XR-feature matrix, API usage map, competitive landscape, and risk assessment.
- [`docs/XR_AUDIO_MATURATION.md`](./docs/XR_AUDIO_MATURATION.md) — Audio-focused deep dive: XREAL Aura hardware (Bose open-ear speakers, 4-mic array), audit of all 8 existing audio systems, audio architecture pipeline, sound design philosophy, and what "mature" means for the student, Bertrand, and Google.
