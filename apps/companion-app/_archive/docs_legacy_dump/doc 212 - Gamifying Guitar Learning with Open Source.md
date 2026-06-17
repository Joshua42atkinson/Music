# **Architecture and Integration Analysis: Gamifying Voix Vive under Apache 2.0**

## **Pedagogical Foundations and Gamified Hero's Journey**

The development of the *Voix Vive* platform represents a systematic integration of somatic music pedagogy, instructional systems design, and web-based software architecture.1 Designed as an instructional tool for the curriculum of master guitarist and vocalist Bertrand Laurence, the platform utilizes a freemium marketing strategy.1 The foundational core of this strategy is a completely free, 12-chapter "Living Textbook" structured around a fusion of the mythological monomyth (the Hero's Journey) and the western chromatic scale.1

The pedagogical design is rooted in the somatic axiom that the musician is an instrument playing an instrument, requiring a dual-coding methodology that addresses both internal and external actions 1:

* **Yin (The Invisible Domain):** Focuses on cognitive music theory, ear training, breathing, and emotional storytelling.1  
* **Yang (The Visible Domain):** Addresses physical mechanics, fretboard geometry, kinesthetic muscle memory, and active technique.1

This dual-coding model is applied through three proprietary training protocols designed by the subject matter expert 1:

* **©SHEARL (See / Hear / Feel):** This protocol connects cognitive fretboard theory to tactile kinesthesis and physical execution.1  
* **©PLING\! (Sing & Play):** A vocal-motor coordination protocol that syncs the student's vocal tract to their motor cortex, reinforcing pitch internalization.1  
* **©FHEAL (Hear / Feel):** Designed to train the student to bypass logical, analytical interference, allowing direct translation of creative impulse to the instrument.1

To translate this somatic framework into a web-based game, the software must measure and reward slow-practice intervals and muscle relaxation, which are required for physical myelination.1 Standard gaming mechanisms that prioritize speed must be replaced with metrics focused on temporal control and finger placement accuracy.1

| Chromatic Tone | Monomyth Stage | Somatic Focus | Telemetry Constraints & Requirements |
| :---- | :---- | :---- | :---- |
| **C** | Call to Adventure | Somatic Baseline | Initial calibration of the microphone and setup of the practice environment 1 |
| **C\#** | Refusal of the Call | Tension Mitigation | Monitoring input signal variance to detect physical strain during slow play 1 |
| **D** | Meeting the Mentor | Listening & Pitch Alignment | Tuning verification and pitch accuracy checks 1 |
| **D\#** | Crossing the Threshold | Tactile Fretboard Contact | Single-string accuracy and coordinate mapping 1 |
| **E** | Tests, Allies, Enemies | Interval Visualization | Tracking intervals via visual prompts 1 |
| **F** | Approach to the Inmost Cave | Spatial Chord Shifting | Tracking spatial movement across CAGED chord shapes 1 |
| **F\#** | The Ordeal | Vocal-Motor Integration | Dual audio tracking to check vocal and guitar alignment 1 |
| **G** | The Reward | Expressive Interpretation | Pitch-bending tracking and microtonal variance detection 1 |
| **G\#** | The Road Back | Spatial Integration | Speed-gated vertical and horizontal scale tracking 1 |
| **A** | The Resurrection | Async Mastery Assessment | Audio/video capture of performance for evaluation 1 |
| **A\#** | Return with the Elixir | Multi-Key Fluency | Advanced scale transitions across CAGED positions 1 |
| **B** | Master of Two Worlds | Dynamic Creative Agency | Free-form improvisation tracking over backing tracks 1 |

The transition through these chromatic monomyth stages is managed by the application's core rendering system, visible in the active deployment at https://bertrand-masterclass.vercel.app/.1 Integrating these milestones into a game requires connecting the web-based user interface to real-time audio and input processing engines.2

### **Self-Evaluated Quality Gates & Dueling the Self**

In contrast to traditional rhythm games that score the player against a rigid, pre-recorded track, the *Voix Vive* platform implements self-evaluated quality gates. The student competes against their own prior performance:
* **Dueling the Self:** The platform records the student's sessions. During a "duel," the student plays along with their own historical recording, attempting to improve tone, relaxation, or pacing.
* **Pacing Control:** The user decides the tempo and areas of improvement rather than the system dictating "correct" speed.
* **Instructor Notifications:** Scheduled practice reminders and asynchronous evaluation feedback are delivered via the "Troubadour" interface and read aloud using Bertrand's localized AI voice clone. These notifications help students integrate practice into their daily lives, including mental practice sessions without the guitar.


## ---

**Open-Source Rhythm Games and Fretboard Engines**

To implement the gamified "Hero's Journey" on the web, developers can utilize open-source codebases and libraries in JavaScript, TypeScript, and Rust to manage rhythm tracking and fretboard visualization.4

### **Rhythmic Tracking Frameworks**

Rhythmic play requires timing-based tracking engines that can be adapted to process physical guitar inputs.2

* **JS-Hero (jhedev96 / JS-Hero):** A 3D musical browser game built with Three.js and vanilla JavaScript.2 The engine maps user inputs to a timed note track.2 The note tracks are represented in a JSON schema where each note object contains a measure (![][image1]), a beat (![][image2]), and a fretboard position (![][image3]) 2:  
  ![][image4]  
  This data structure can be used to sequence custom finger-placement exercises. To adapt this keyboard-driven game to a physical guitar, the input event listeners (traditionally 'A', 'S', 'D', 'F', 'G') must be bound to the output of a real-time pitch detection system.2  
* **GuitarHeroJS (detalhe/GuitarHeroJS):** A 3D rhythm game built on Three.js that features a scrolling fretboard, color-coded notes, and real-time particle effects.7 While still in early development, its support for sustained note coordinates provides a baseline for evaluating sustained tones, which is a key technical focus in Bertrand Laurence's somatic training.1  
* **javascript-hero (inlineblock/javascript-hero):** A timeline-based rendering engine that uses D3.js, Backbone, and Underscore.9 It operates locally without heavy server requirements.9 However, its dependency on older libraries makes it less compatible with modern, fast-rendering UI frameworks.1  
* **chart-hero (nb48 / chart-hero):** A TypeScript and Angular-based web application designed for editing music charts for rhythm games.10 Powered by Howler.js, it provides an interface for syncing audio tracks with custom-authored notes.10 This tool can be used to generate custom lessons for the *Voix Vive* curriculum, allowing the developer to author and edit somatic practice tracks.  
* **chorus (Paturages / chorus):** A repository scraper and search indexer for rhythm game song charts.4 It is a useful resource for analyzing standardized charting formats.

### **Fretboard Visualization and Geometry Engines**

Fretboard visualizers map finger placements, intervals, and CAGED shapes onto a virtual instrument neck.6

* **FretPath (reinterpretcat / fretpath):** A browser-based learning application built with raw HTML, CSS, and JavaScript.12 It runs offline as a progressive web app (PWA) and offers a structured learning path.12 Its feature set includes a CAGED visualization model, interval ear training, chord progression play-alongs, an interactive fretboard explorer, and a notation/score editor with support for importing Guitar Pro files.12  
* **fretboard-js (joelle-o-world / fretboard-js):** A JavaScript library designed for fretted string instruments.11 It uses a programmatic HandPosition class to represent the finger-neck interface.11 The data structure maps four finger coordinates to string-fret pairs and tracks open-string activity 11:  
  ![][image5]  
  It supports vector rendering via LilyPond and can generate MIDI outputs.11 This library is highly compatible with the ©SHEARL protocol, as it programmatically models correct left-hand finger alignment.1  
* **GuitarJs (naiquevin / GuitarJs):** A lightweight library that maps scales, chord voicings, and intervals across a standard 24-fret, 6-string fretboard.13 It allows programmatic queries to identify chord voicings (e.g., major, minor, diminished, augmented) and can locate all physical instances of a target note across the fretboard.13  
* **guitar (radzionc / guitar):** An interactive fretboard viewer built with TypeScript and Next.js.6 It displays a 15-fret, 6-string fretboard in standard tuning, highlighting root notes, scales, and CAGED systems.6  
* **fretboarder (cheap-glitch / fretboarder):** A visualization tool designed to render scales, arpeggios, and chord diagrams.14 It supports custom tunings and varying string counts, making it adaptable for different fretted instruments.14

| Repository | Tech Stack | Primary Function | Core Data Model / API |
| :---- | :---- | :---- | :---- |
| **JS-Hero** 2 | Vanilla JS, Three.js | 3D Rhythm Engine | Time-measure note arrays 2 |
| **GuitarHeroJS** 7 | Vanilla JS, Three.js | 3D Rhythm Engine | Polyphonic input tracking 7 |
| **chart-hero** 10 | TypeScript, Angular, Howler.js | Note Charting Utility | Interactive event timeline mapping 10 |
| **FretPath** 12 | Vanilla JS, HTML5 Canvas | Learning Path & Score Editor | LocalStorage progress state, GP importer 12 |
| **fretboard-js** 11 | JavaScript | Hand Position Modeler | Structural finger coordinate arrays 11 |
| **GuitarJs** 13 | JavaScript | Chord Voicing Queries | Fretboard mapping arrays 13 |
| **guitar** 6 | TypeScript, Next.js | Static Fretboard Diagrams | CAGED state variables 6 |

## ---

**Audio Processing and Low-Latency Pitch Detection**

To support interactive somatic protocols like ©PLING\!, the web application must process microphone input in real time to provide feedback on pitch accuracy.1

### **Mathematical Foundations of Pitch Tracking**

Pitch detection algorithms calculate the fundamental frequency (![][image6]) of an incoming audio signal. To identify the specific note and octave being played, this frequency (![][image7]) in Hertz is mapped to a MIDI note value (![][image8]) using a standard logarithmic formula:

![][image9]  
For real-time web audio applications, time-domain algorithms are typically favored over pure frequency-domain Fourier transforms because of their lower computational overhead and better resolution at lower frequencies.8 Autocorrelation is a common method for this type of analysis.15 The autocorrelation function (![][image10]) of a discrete signal ![][image11] with a lag ![][image12] is calculated as:

![][image13]  
By locating the first major peak in the autocorrelation output where ![][image14], the period of the fundamental frequency can be extracted.15 The YIN algorithm builds upon this approach, using a cumulative mean normalized difference function to minimize octave-doubling errors.16

For guitar analysis, capturing the low E string (![][image15]) requires a buffer size (![][image16]) of at least 2048 or 4096 samples at a ![][image17] sample rate to ensure a full wave period is recorded.3 This introduces a latency of:

![][image18]  
To reduce this latency to approximately ![][image19], specialized algorithms combine time-domain and frequency-domain analysis.19 This approach uses the physical properties of vibrating strings to estimate pitch from partial wave cycles.19

### **Audio Engine Architectures**

Executing DSP calculations on the browser's main thread can cause UI lag and audio stuttering.20 To prevent this, developers can offload audio processing to a background thread using the Web Audio API's AudioWorklet system.16

┌────────────────────────────────────────────────────────┐  
│               BaseAudioContext (Web Audio)             │  
│  ┌──────────────────────┐      ┌────────────────────┐  │  
│  │ MediaStreamAudioSource│ ───► │  AudioWorkletNode  │  │  
│  └──────────────────────┘      └─────────┬──────────┘  │  
└──────────────────────────────────────────┼─────────────┘  
                                           │ (Interleaved f32 Blocks)  
                                           ▼ (Audio Thread)  
┌────────────────────────────────────────────────────────┐  
│                  AudioWorkletProcessor                 │  
│  ┌──────────────────────────────────────────────────┐  │  
│  │                 WASM Shared Memory               │  │  
│  │  ┌──────────────────┐      ┌──────────────────┐  │  │  
│  │  │  Input Buffer    │ ───► │  DSP Algorithms  │  │  │  
│  │  │  (Ring Buffer)   │      │  (Autocorrelation│  │  │  
│  │  └──────────────────┘      │   / YIN / MPM)   │  │  │  
│  │                            └──────────┬───────┘  │  │  
│  └───────────────────────────────────────┼──────────┘  │  
└──────────────────────────────────────────┼─────────────┘  
                                           │ (Computed Pitch & Velocity)  
                                           ▼ (PostMessage Transfer)  
┌────────────────────────────────────────────────────────┐  
│                   Main UI Thread (React)               │  
│  ┌──────────────────────────────────────────────────┐  │  
│  │  Fretboard Explorer Visual Updates / UI State    │  │  
│  └──────────────────────────────────────────────────┘  │  
└────────────────────────────────────────────────────────┘

Compiling Rust to WebAssembly (WASM) allows the pitch-detection engine to run in a garbage-collection-free environment, which helps maintain stable frame rates on the main thread.5

* **pitch-detection-app (alesgenova / pitch-detection-app):** An open-source application using Rust, WebAssembly, and React.5 It processes microphone signals in real time using a dedicated Rust pitch-detection library.5 This architecture uses wasm-pack and TypeScript to bridge the browser's web audio stream to the compiled Rust layer.5  
* **autopitch (paramako / autopitch):** A lightweight, zero-dependency Rust library designed for real-time pitch detection.17 It avoids heap allocations during the active detection phase, making it highly suitable for the memory constraints of a WASM-based AudioWorkletProcessor.17  
* **pitchlite (sevagh / pitchlite):** A C++ library compiled to WASM that runs the McLeod Pitch Method (MPM) and YIN algorithms.3 It uses a ring buffer to collect 128-sample slices and runs real FFTs using KissFFT.3 This allows it to compute pitch variations with sub-chunk timing resolution.3  
* **clawdio (whoisryosuke / clawdio):** A JavaScript library designed to run Rust-based audio effects in web-audio worklets.22 It manages low-level memory allocation, exposing clean APIs for nodes like low-pass filters and noise generators.24 This framework can be extended to support real-time pitch and envelope tracking.24  
* **Glicol (chaosprint / glicol):** A graph-oriented music live-coding language and audio DSP library written in Rust.26 Running via WASM, AudioWorklets, and SharedArrayBuffers, it achieves near-native, GC-free performance.20 Its declarative syntax and graph structure can generate interactive backing tracks that dynamically alter their composition, key, or tempo based on real-time pitch detection.27

| Library | Primary Language | Algorithm | WASM Execution Context |
| :---- | :---- | :---- | :---- |
| **pitch-detection-app** 5 | TypeScript, Rust | YIN, Autocorrelation | React state updates via main thread bridge 5 |
| **autopitch** 17 | Rust | Autocorrelation | Zero-allocation, real-time audio thread 17 |
| **pitchlite** 3 | C++, JavaScript | MPM, YIN | 128-sample ring buffer, AudioWorklet 3 |
| **clawdio** 24 | TypeScript, Rust | Custom DSP | Modular Web Audio effect routing 24 |
| **Glicol** 27 | Rust, JavaScript | Graph Synth | Multi-threaded SharedArrayBuffer engine 20 |

## ---

**Cross-Platform Compilation for Android and Standalone VR**

The *Voix Vive* platform is designed for cross-platform deployment, with a roadmap that includes web browsers, native mobile applications, and virtual reality (VR) environments.1 This cross-platform approach is supported by the developer's background as a full-stack systems engineer working with Rust, React, and Bevy.1

### **Native Android Packaging**

To compile the web application for Android, developers can choose between a native WebView shell or a consolidated Rust-centric engine.28

* **Tauri v2:** A framework that compiles web applications to Linux, macOS, Windows, Android, and iOS from a single codebase.29 Tauri uses the operating system's native Webview renderer to keep the binary footprint exceptionally small (![][image20] for simple apps).29 Developers write front-end code in standard frameworks like React, and implement core logic in Rust, connecting the two via a secure inter-process communication (IPC) bridge.29 This architecture allows the application to utilize low-latency, native Android audio APIs, which helps reduce overall latency during pitch tracking.30  
* **Bevy Engine:** A data-driven, open-source game engine built in Rust using a parallel Entity Component System (ECS).32 Bevy supports cross-platform compilation to WebAssembly, iOS, and Android.33 By utilizing bevy-in-app, developers can run a Bevy instance inside a standard native Android SurfaceView.35 This allows the integration of high-performance 3D visualizers directly alongside standard web views.35

When compiling a Bevy application for mobile or the web, developers must organize the code within a library crate structure (lib.rs) configured as a dynamic system library (cdylib).28 This allows the code to be compiled into a system library (.so file) for Android or packaged for WebAssembly.28

Ini, TOML

\# Cargo.toml configuration for Android and WASM target compilation  
\[lib\]  
name \= "breakout"  
crate-type \= \["cdylib", "rlib"\]

\[package.metadata.android\]  
package \= "com.voixvive.masterclass"  
apk\_name \= "VoixViveMasterclass"  
build\_targets \= \["aarch64-linux-android"\]

\[package.metadata.android.sdk\]  
min\_sdk\_version \= 21  
target\_sdk\_version \= 33

In the main entry point, the Bevy application logic is separated to support both local execution and compiled target runs 28:

Rust

// main.rs \- Entry point for local desktop execution  
fn main() {  
    breakout::run\_game();  
}

Rust

// lib.rs \- Core game library compiled for WASM and Android NDK targets  
use bevy::prelude::\*;  
use bevy::asset::AssetMetaCheck;

\#\[bevy\_main\]  
fn main() {  
    run\_game();  
}

pub fn run\_game() {  
    let mut app \= App::new();  
      
    // Disable asset meta checks to prevent loading errors on WASM targets  
    app.insert\_resource(AssetMetaCheck::Never);  
      
    app.add\_plugins(DefaultPlugins)  
      .run();  
}

The compiled Android application can then be deployed to a connected test device using standard build tools 28:

Bash

\# Compile and run the Bevy library on a connected Android device or emulator  
cargo apk run \-p breakout \--lib

### **Virtual Reality (VR) Implementation**

For the VR Masterclass, the developer can choose between browser-based WebXR or native OpenXR compiled via Bevy.1

* **WebXR (A-Frame / Three.js):** WebXR operates directly in compatible browsers without requiring an app store download.36 A-Frame provides a declarative, HTML-based entity-component framework built on top of Three.js.38 It handles basic rendering, tracked controllers, and 3D spatialized audio.38 For basic video streaming (including large, 50 GB 360° masterclass files), WebXR combined with a high-performance Rust-based backend (such as an Axum server) provides a low-latency streaming pipeline.37  
* **Native OpenXR (Bevy / Rust):** For standalone VR headsets like the Meta Quest 3, compiling native code using OpenXR provides better performance and lower latency.39 The community crate bevy\_oxr (and its underlying backend bevy\_mod\_openxr) provides the primary OpenXR interface for Bevy.41 This architecture compiles directly to an Android APK, using native Vulkan drivers to reduce latency.33

WebXR via Three.js or A-Frame is currently the more stable path for web-based VR deployments, as Bevy's WebXR support is still early in development, with the official bevy\_mod\_webxr crate remaining in an experimental state.43

## ---

**Legal and Licensing Topology**

The developer intends to publish the *Voix Vive* platform under the Apache 2.0 open-source license.1 When building under this license, the legal implications and compatibility of all dependencies must be verified.45

                ┌────────────────────────────────────┐  
                │          Apache 2.0 Code           │  
                │        (Voix Vive Project)         │  
                └─────────────────┬──────────────────┘  
                                  │  
                                  ├────────────────────────────────────┐  
                                  ▼                                    ▼  
                ┌──────────────────────────────────┐ ┌──────────────────────────────────┐  
                │      Permissive Integration      │ │       Copyleft Integration       │  
                ├──────────────────────────────────┤ ├──────────────────────────────────┤  
                │ \- MIT (JS Hero, Glicol)   │ │ \- GPLv3 (Compatible) \[47\]     │  
                │ \- BSD (Attribution only)  │ │ \- GPLv2 (Incompatible)    │  
                └──────────────────────────────────┘ └──────────────────────────────────┘

### **The Apache 2.0 License Framework**

The Apache 2.0 license is a permissive open-source license that allows users to freely use, modify, and distribute the software for any purpose, including commercial applications, without paying royalties.46 However, unlike simpler permissive licenses like MIT, Apache 2.0 provides critical legal protections:

* **Explicit Patent Grant:** Every contributor to an Apache 2.0 project explicitly grants a patent license to the users of the software.46 This means if a contributor writes an algorithm (e.g., a custom pitch-detection resonator) that is patented, they cannot later sue users of the software for patent infringement.46  
* **Defensive Patent Termination:** If a user files a patent lawsuit against any contributor claiming that the software infringes their patents, the user's patent licenses granted under Apache 2.0 are immediately terminated.46 This defensive clause discourages patent trolling and litigious behavior.49  
* **Trademark Limitations:** The license explicitly states that users are not granted any rights to use the trademarks, service marks, or logos of the licensor.46 This protects Bertrand Laurence's brand identity, including proprietary marks such as ©SHEARL, ©PLING\!, and ©FHEAL, even if the software running them is open-source.1  
* **Attribution and Modification Requirements:** Anyone distributing modified versions of Apache 2.0-licensed software must include a copy of the license, original copyright notices, and a clear statement describing any significant changes made to the original files.46

### **Dependency Compatibility Mapping**

The choice of Apache 2.0 for the *Voix Vive* codebase determines which third-party open-source components can be integrated.

* **MIT and BSD Compatibility:** The MIT and BSD licenses are permissive and fully compatible with Apache 2.0.45 Code from libraries such as JS-Hero (MIT) 4, fretboard-js (MIT) 11, FretPath (MIT/Apache) 12, and Glicol (MIT) 27 can be modified and integrated directly into the Apache 2.0 project.  
* **GPLv3 Compatibility:** The Free Software Foundation (FSF) and the Apache Software Foundation (ASF) agree that Apache 2.0 is compatible with GNU GPLv3.47 This compatibility means developers can combine Apache 2.0 code with GPLv3 code.47 However, the combined derivative work must be distributed under the more restrictive GPLv3 license.45 If the developer wishes to keep *Voix Vive* strictly under Apache 2.0 (allowing proprietary commercial wrappers), GPLv3 components should be kept as separate, dynamically linked services rather than compiled directly into the codebase.  
* **GPLv2 Incompatibility:** Apache 2.0 is fundamentally incompatible with GNU GPLv2.45 GPLv2 does not contain patent termination or indemnification clauses, and its strict "no further restrictions" term interprets the modern patent protections of Apache 2.0 as unauthorized additional restrictions.45 Consequently, code from a GPLv2-only repository cannot be combined with Apache 2.0 code in a single compiled program.45

| Component / Library | Source License | Integration Status into Apache 2.0 codebase | Operational Precaution Required |
| :---- | :---- | :---- | :---- |
| **JS-Hero** 4 | MIT | Fully Compatible 45 | Retain copyright header and license text 48 |
| **FretPath** 50 | Apache 2.0 | Fully Compatible 45 | Document changes in modified files 46 |
| **fretboard-js** 11 | MIT | Fully Compatible 45 | Include MIT license text in attribution 48 |
| **pitchlite** 18 | MIT | Fully Compatible 45 | Preserve original copyright notice 48 |
| **Polyphonic Pitch Detector** 19 | GPLv3 | Incompatible for strict Apache 2.0 distribution | Must isolate in separate service; linking forces copyleft GPLv3 45 |
| **Glicol Core** 27 | MIT | Fully Compatible 45 | Maintain MIT credit notices in compiled bundles 48 |

## ---

**Recommended Architectural Roadmap for Voix Vive**

To deliver the gamified *Voix Vive* platform, the architecture should be structured into three developmental tiers:

┌────────────────────────────────────────────────────────────────────────┐  
│                        Voix Vive React Frontend                        │  
├───────────────────────────────────┬────────────────────────────────────┤  
│           Web Deployment          │          Android WebView           │  
│        (Vercel, PWA Caching)      │          (Tauri v2 Wrapper)        │  
│                │                  │                 │                  │  
│                ▼                  │                 ▼                  │  
│        Standard Chrome/Safari     │        Native Android OS API       │  
│        (Web Audio API, WASM)      │       (Low-latency input/output)   │  
└───────────────────────────────────┴────────────────────────────────────┘  
                                 │  
                                 ├────────────────────────────────────┐  
                                 ▼                                    ▼  
┌──────────────────────────────────────────────────┐ ┌──────────────────────────────────┐  
│              Immersive WebXR Layer               │ │            Native VR Layer       │  
│             (A-Frame / Three.js 3D)              │ │        (Bevy ECS \+ OpenXR)       │  
├──────────────────────────────────────────────────┤ ├──────────────────────────────────┤  
│ \- No-install VR Classroom                        │ │ \- High-performance Quest APK     │  
│ \- Spatialized 3D audio streams                   │ │ \- Physics-based hand tracking    │  
│ \- Cross-device browser runtime                   │ │ \- Haptic somatic breathing guides│  
└──────────────────────────────────────────────────┘ └──────────────────────────────────┘

### **Tier 1: Browser-Based React Application (Immediate Focus)**

The web application should serve as the primary marketing and educational entry point.1 To keep user friction minimal, all features must execute directly in standard browsers without plugins.12

* **Fretboard Explorer Integration:** The developer should expand the existing virtual fretboard at https://bertrand-masterclass.vercel.app/ by integrating the scale-rendering systems of FretPath.1 This provides offline-ready, PWA-cached fretboard maps of intervals and CAGED systems.12  
* **Web Audio DSP Pipeline:** To support the ©PLING\! vocal-to-guitar validation protocol, the system should use a compiled WebAssembly background thread.1 By packaging the zero-allocation autopitch library or the pitchlite ring-buffer system into an AudioWorkletProcessor, the application can track pitch variations in real time.3 This isolates calculation overhead on a dedicated audio thread, keeping the main thread free for UI rendering.21  
* **Gamified Rhythmic Timing Engine:** The interactive "play" elements of the Hero's Journey should use a timing engine based on the JSON track structure of JS-Hero.2 This allows standard exercises to be mapped to a scrollable note lane.2 The output of the WASM pitch detector should be used to simulate key-presses, creating a game-like experience where correct pitch and timing advance the user through the curriculum.2

### **Tier 2: Mobile Compilations via Tauri v2 (Medium Term)**

To target Android and iOS, the developer should compile the web codebase using **Tauri v2** rather than a standard mobile WebView shell.29

* This architecture wraps the React-WASM frontend inside a native container, keeping the binary size small.29  
* It exposes native Rust system bindings, allowing direct access to native Android audio recording APIs for lower latency during pitch tracking.30  
* It provides a secure, offline environment for running the fine-tuned, on-device **Gemma 4** "Ask Bertrand" AI model, avoiding recurring cloud hosting fees.1

### **Tier 3: Standalone Virtual Reality (Long Term)**

For the VR Masterclass, the implementation should be divided into two distinct delivery models 1:

* **Browser-Based WebXR (A-Frame):** For immediate accessibility, the platform should use A-Frame to render 3D classroom models and stream 360° videos directly to browsers, using spatialized audio to guide breathing exercises.37  
* **Native Bevy OpenXR Engine:** For high-performance rendering, the developer should use the Bevy game engine and compile directly to standalone VR headsets using the bevy\_oxr OpenXR backend.39 Hand-tracking inputs can map physical finger positions to the virtual guitar neck, programmatically validated by the HandPosition mechanics of fretboard-js.11 Standalone controller haptics can be used to provide physical feedback to guide somatic breathing and support correct left-hand alignment.1

#### **Works cited**

1. ROADMAP.md  
2. jhedev96/JS-Hero: JavaScript Guitar Hero \- GitHub, accessed May 17, 2026, [https://github.com/jhedev96/JS-Hero](https://github.com/jhedev96/JS-Hero)  
3. sevagh/pitchlite: realtime pitch tracking in WebAssembly with AudioWorklet \- GitHub, accessed May 17, 2026, [https://github.com/sevagh/pitchlite](https://github.com/sevagh/pitchlite)  
4. guitar-hero · GitHub Topics, accessed May 17, 2026, [https://github.com/topics/guitar-hero?l=javascript](https://github.com/topics/guitar-hero?l=javascript)  
5. GitHub \- alesgenova/pitch-detection-app: A rust / webassembly / react app to detect the pitch of audio signals in real time, accessed May 17, 2026, [https://github.com/alesgenova/pitch-detection-app](https://github.com/alesgenova/pitch-detection-app)  
6. Guitar Scales and Pentatonics Fretboard Viewer \- GitHub, accessed May 17, 2026, [https://github.com/radzionc/guitar](https://github.com/radzionc/guitar)  
7. GitHub \- detalhe/GuitarHeroJS: Web-based Guitar Hero clone using Three.js., accessed May 17, 2026, [https://github.com/detalhe/GuitarHeroJS](https://github.com/detalhe/GuitarHeroJS)  
8. dgvai/webaudio-pitch-tuner \- GitHub, accessed May 17, 2026, [https://github.com/dgvai/webaudio-pitch-tuner](https://github.com/dgvai/webaudio-pitch-tuner)  
9. GitHub \- inlineblock/javascript-hero: JavaScript engine for a "GuitarHero" like games. Uses D3js, backbone, and underscore. Less is used for compiling CSS., accessed May 17, 2026, [https://github.com/inlineblock/javascript-hero](https://github.com/inlineblock/javascript-hero)  
10. guitar-hero · GitHub Topics, accessed May 17, 2026, [https://github.com/topics/guitar-hero](https://github.com/topics/guitar-hero)  
11. joelle-o-world/fretboard-js: A javascript library for solving problems related to fretted string instruments. \- GitHub, accessed May 17, 2026, [https://github.com/joelle-o-world/fretboard-js](https://github.com/joelle-o-world/fretboard-js)  
12. I built FretPath — a free pure html/js/css app for learning guitar fretboard, theory, and ear training \- Reddit, accessed May 17, 2026, [https://www.reddit.com/r/LearnGuitar/comments/1sca9f0/i\_built\_fretpath\_a\_free\_pure\_htmljscss\_app\_for/](https://www.reddit.com/r/LearnGuitar/comments/1sca9f0/i_built_fretpath_a_free_pure_htmljscss_app_for/)  
13. naiquevin/GuitarJs: A small javascript library for guitar notes, scales, chords \- GitHub, accessed May 17, 2026, [https://github.com/naiquevin/GuitarJs](https://github.com/naiquevin/GuitarJs)  
14. fretboard · GitHub Topics, accessed May 17, 2026, [https://github.com/topics/fretboard?l=javascript\&o=asc\&s=stars](https://github.com/topics/fretboard?l=javascript&o=asc&s=stars)  
15. omar-diop/perfect-pitch: A simple web based tuner \- GitHub, accessed May 17, 2026, [https://github.com/omar-diop/perfect-pitch](https://github.com/omar-diop/perfect-pitch)  
16. pitch-detection · GitHub Topics, accessed May 17, 2026, [https://github.com/topics/pitch-detection?o=asc\&s=stars](https://github.com/topics/pitch-detection?o=asc&s=stars)  
17. GitHub \- paramako/autopitch: A modular pitch detection library for Rust. Fast, zero-dependency, real-time ready., accessed May 17, 2026, [https://github.com/paramako/autopitch](https://github.com/paramako/autopitch)  
18. sevagh/pitch-detection: autocorrelation-based O(NlogN) pitch detection \- GitHub, accessed May 17, 2026, [https://github.com/sevagh/pitch-detection](https://github.com/sevagh/pitch-detection)  
19. luciamarock/Polyphonic-Pitch-Detector-for-guitars \- GitHub, accessed May 17, 2026, [https://github.com/luciamarock/Polyphonic-Pitch-Detector-for-guitars](https://github.com/luciamarock/Polyphonic-Pitch-Detector-for-guitars)  
20. Whole Rust Audio Engine as one Single Web Audio Node: A 2MB, GC-Free, Memory-Safe, and Easy-to-Use Audio Library on NPM for Browsers : r/javascript \- Reddit, accessed May 17, 2026, [https://www.reddit.com/r/javascript/comments/u9jpzp/whole\_rust\_audio\_engine\_as\_one\_single\_web\_audio/](https://www.reddit.com/r/javascript/comments/u9jpzp/whole_rust_audio_engine_as_one_single_web_audio/)  
21. JamieBeverley/wasm-audio-worklet: Template/PoC repo for Rust \- GitHub, accessed May 17, 2026, [https://github.com/JamieBeverley/wasm-audio-worklet](https://github.com/JamieBeverley/wasm-audio-worklet)  
22. Web Audio Effect Library with Rust and WASM \- Ryosuke, accessed May 17, 2026, [https://whoisryosuke.com/blog/2025/web-audio-effect-library-with-rust-and-wasm/](https://whoisryosuke.com/blog/2025/web-audio-effect-library-with-rust-and-wasm/)  
23. audio-analysis · GitHub Topics, accessed May 17, 2026, [https://github.com/topics/audio-analysis?l=rust](https://github.com/topics/audio-analysis?l=rust)  
24. GitHub \- whoisryosuke/clawdio: Web Audio effects using Audio Worklets and Rust \+ WASM, accessed May 17, 2026, [https://github.com/whoisryosuke/clawdio](https://github.com/whoisryosuke/clawdio)  
25. Clawdio \- Web Audio effects and filters, accessed May 17, 2026, [https://whoisryosuke.github.io/clawdio/](https://whoisryosuke.github.io/clawdio/)  
26. Glicol \- GitHub, accessed May 17, 2026, [https://github.com/glicol](https://github.com/glicol)  
27. GitHub \- chaosprint/glicol: Graph-oriented live coding language and music/audio DSP library written in Rust, accessed May 17, 2026, [https://github.com/chaosprint/glicol](https://github.com/chaosprint/glicol)  
28. Deploy a Bevy Game to Android and Publish to Itch.io with WASM \- Erik Horton, accessed May 17, 2026, [https://blog.erikhorton.com/2024/03/31/deploy-bevy-to-android-and-wasm.html](https://blog.erikhorton.com/2024/03/31/deploy-bevy-to-android-and-wasm.html)  
29. Tauri 2.0 | Tauri, accessed May 17, 2026, [https://v2.tauri.app/](https://v2.tauri.app/)  
30. Develop \- Tauri, accessed May 17, 2026, [https://v2.tauri.app/develop/](https://v2.tauri.app/develop/)  
31. Prerequisites | Tauri, accessed May 17, 2026, [https://v2.tauri.app/start/prerequisites/](https://v2.tauri.app/start/prerequisites/)  
32. Bevy in 2025: Rust's Game Engine Taking Over Indie Dev | by Sreeved Vp \- Medium, accessed May 17, 2026, [https://medium.com/solo-devs/bevy-in-2025-rusts-game-engine-taking-over-indie-dev-caec2ae50c09](https://medium.com/solo-devs/bevy-in-2025-rusts-game-engine-taking-over-indie-dev-caec2ae50c09)  
33. Bevy Engine, accessed May 17, 2026, [https://bevy.org/](https://bevy.org/)  
34. Bevy on Different Platforms \- Unofficial Bevy Cheat Book, accessed May 17, 2026, [https://bevy-cheatbook.github.io/platforms.html](https://bevy-cheatbook.github.io/platforms.html)  
35. jinleili/bevy-in-app: Integrate the Bevy engine into existing iOS / Android apps. \- GitHub, accessed May 17, 2026, [https://github.com/jinleili/bevy-in-app](https://github.com/jinleili/bevy-in-app)  
36. Building with WebXR | Meta Horizon OS Developers, accessed May 17, 2026, [https://developers.meta.com/horizon/develop/web/](https://developers.meta.com/horizon/develop/web/)  
37. Video streaming app for VR headset using rust and webxr \- Lean Deep Tech blog, accessed May 17, 2026, [https://leandeep.com/video-streaming-app-for-vr-headset-using-rust-and-webxr/](https://leandeep.com/video-streaming-app-for-vr-headset-using-rust-and-webxr/)  
38. GitHub \- aframevr/aframe: :a: Web framework for building virtual reality experiences., accessed May 17, 2026, [https://github.com/aframevr/aframe?locale=en-US](https://github.com/aframevr/aframe?locale=en-US)  
39. blaind/xrbevy: Proof-of-concept of getting OpenXR rendering support for Bevy game engine using gfx-rs abstractions \- GitHub, accessed May 17, 2026, [https://github.com/blaind/xrbevy](https://github.com/blaind/xrbevy)  
40. Excellent Game Engine but mostly worthless without VR · bevyengine bevy · Discussion \#21495 \- GitHub, accessed May 17, 2026, [https://github.com/bevyengine/bevy/discussions/21495](https://github.com/bevyengine/bevy/discussions/21495)  
41. awtterpip/bevy\_oxr \- GitHub, accessed May 17, 2026, [https://github.com/awtterpip/bevy\_oxr](https://github.com/awtterpip/bevy_oxr)  
42. bevy\_mod\_openxr \- crates.io: Rust Package Registry, accessed May 17, 2026, [https://crates.io/crates/bevy\_mod\_openxr](https://crates.io/crates/bevy_mod_openxr)  
43. bevy\_mod\_webxr \- crates.io: Rust Package Registry, accessed May 17, 2026, [https://crates.io/crates/bevy\_mod\_webxr](https://crates.io/crates/bevy_mod_webxr)  
44. Internal Bevy XR Crates · bevyengine bevy · Discussion \#8896 \- GitHub, accessed May 17, 2026, [https://github.com/bevyengine/bevy/discussions/8896](https://github.com/bevyengine/bevy/discussions/8896)  
45. Understanding Open Source Licenses: GPL, MIT, Apache Compared \- credativ®, accessed May 17, 2026, [https://www.credativ.de/en/blog/credativ-inside/understanding-open-source-licenses-gpl-mit-apache-compared/](https://www.credativ.de/en/blog/credativ-inside/understanding-open-source-licenses-gpl-mit-apache-compared/)  
46. Open Source Licenses 101: Apache License 2.0 | FOSSA Blog, accessed May 17, 2026, [https://fossa.com/blog/open-source-licenses-101-apache-license-2-0/](https://fossa.com/blog/open-source-licenses-101-apache-license-2-0/)  
47. Apache License v2.0 and GPL Compatibility, accessed May 17, 2026, [https://www.apache.org/licenses/GPL-compatibility.html](https://www.apache.org/licenses/GPL-compatibility.html)  
48. Apache License \- Wikipedia, accessed May 17, 2026, [https://en.wikipedia.org/wiki/Apache\_License](https://en.wikipedia.org/wiki/Apache_License)  
49. Favorite Permissive License: Apache 2.0 or MIT? : r/opensource \- Reddit, accessed May 17, 2026, [https://www.reddit.com/r/opensource/comments/1q80yea/favorite\_permissive\_license\_apache\_20\_or\_mit/](https://www.reddit.com/r/opensource/comments/1q80yea/favorite_permissive_license_apache_20_or_mit/)  
50. PeakBI/ds-reinterpretcat-vrp: A Vehicle Routing Problem solver \- GitHub, accessed May 17, 2026, [https://github.com/PeakBI/ds-reinterpretcat-vrp](https://github.com/PeakBI/ds-reinterpretcat-vrp)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAZCAYAAADXPsWXAAABAElEQVR4Xu3SsUpCcRTH8RMhISSBOdWSQ+9hzZIQEblVW+0OLU6Oaj6Bo0iDEYQQNqRQLVEtvUG4N0vY93j+fzjchnqA+4PPcM75e+7lfxVJk+b/2ccTRlhHCbe4wxBZNHCFF3Sxqj+MKWCCDL7whr7YMk0PNzgM9RbmqIV6kQucYjMMH7Di5m0cuFrfSs81XU+KyKEahhU/JONEvSt27ijRX+RSbJh3PV0+c7WmhW+xa/iVZ7wmentii2OW8YnrUG9jKQ7XxJ7YiY0QvQ+/ZCfU8ZIfxd1fOQz1yT7v+HD1sdi5DbFF524mJ5hK4tuL/SfqrtY7GuAeZ66fJs2f+QG8PS9Q8t2RxQAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAbCAYAAACwRpUzAAAAhElEQVR4XmNgGOQgHYj3owvCwCkgPoguCAI8QPwbiLvQJUDAAYj/A7E3smAvVBAdKyCpYdgAxBeRBZDBOyCeiS4IApoMEKOS0CVAACQIktRClwCBOUD8AomvA8QsMM51IF4NZQsD8T6YBAjcB+I+BojqZQxofk0D4gdAfAWIE5ElRjwAAJuIGnYYO8QLAAAAAElFTkSuQmCC>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAZCAYAAAAiwE4nAAABoElEQVR4Xu2UyytHQRTHTx6RCIWSspMNGytJZKEsLKwUWdlJWShKHiuy5k/wSCmSZ7FSlGfEgpT8IhZSwkKx4Pu9Zw5zr7X6Le6nPjVzzmnuvWdmrkhMTEyy0AS34Qksh+1wC07CXK+OZMFxuAsP4TlsDlWIFMEZeCqaX4KZluRgX3Sha/gMJ2A6vINTVghK4DGcd3nSAr9goxWBAzgC02AxfILdluyAvaIP/IDrlgArosUkQ3ShCzc2uOgLXPZifIFqN66Dn7DekqUwDzaIFnZZAly6WCoccuNOL09S4Bs882KsuxVtZasXDzEsWljmxTjnF3HRhGgHsr08qRKt8zsz52Imz8IfNuFVJMbiUdGDw/FeOB0wKJprc/NC0f0tgH3wEb673A/ch1cJHxByL7oAScDV31QAv9ZaZ+zASm8+Bo+8eQA32NqXL/oC3Cu2yxiQ8AvkwFnRB3Bs8KoYFaJr1nixgH7RB/aI3q+E6D74cB/50DXR9t+IXp/oPeU9XhT96mlYG04rG/AhGvwv2D4e64Vo4r/wjy//IjExycU3ZtVenlFi4ocAAAAASUVORK5CYII=>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAAqCAYAAAAOCwd9AAAEeUlEQVR4Xu3cWchtYxgA4M88DyEiypCxlBDKUEgpUSKSOudCkqG4MYYioVAy5YJcCGW4IFNIiSTDheFKoRAZSggXEu/bWuuc7//O3uff+5f/3/t4nnrbe73f2utf/7cv9tv63rVKAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAICVtHvEYxGvtANsMO6JuCNi53YAAJh9e0X8GHF2Wdkf8z8jdqu2L4rYoX+/S8Qx1dhyObBNzJEjSjentYMivi/z/X8BwP/ShRF/t8lldnXpzmHPKvdVH09HnFvlF/NbxMttckqfRDxUunPatBmbF3+U0d9r5m5tkwDAbMsrWaN+2JfLPhHvlXULtoer99PI49zUJpcoj7VZm5wDOadPltHfa+Zua5MAwGy7tIz+YX834pmIkyNejHg14sR+7KmINyOO7rdH2S5i3zbZOC/igf59nkMuzw4ejbg54suI16v8OLn8l8eoY5yT2sQY0xRsD0Z8HLFT6QqiryMuq8aPjHg84vPSzV8WVYNc+s3PfxDxVpVvXRmxbZtsDHP6RBk9B5nLXjYAYI7cWNb9YT+udP1kmc/CKXvb7ivdEuUjZe0y4Tv96yh3lq7oW58scHbs37cFWxY8h0RsHvF86QqhxWRxlfuuzxkRf5XJ+vXynCZdEr2qdMfOOTq1dEVhPa+/RJwTsUnpllu/qcayGM6CLc//oyrfyuPd1SYbw5yOK9h+L93fBwDmwPER30ac3g6EwyKuKwt/8J+N+LWsveKUr3mlaKnamwjagq22f+kKuMVkL9yxbfJfyHPKgnFSOR95ZTFlY39+fovSzfOWw07hlH5skO+/i7i4TF4gjlLP6biCLV1Rur93ZjsAAMyevIqWdw1e0g6El0p3VWiQTeyZG+RVpAuq7WlkUfJ+k6sLtix6sq9t6357j358sWImr64tts80pinYNo74odrOpcn8/Or+tXZDk7u/3854o8pPo53TcQVbfte5fFz3CwIAM+7yMvqHPXO5zFdvD1dwspDKuzHT9f1ra5Ietloefygi8qrUodXY+WXhnY312OCEsvb/yEI0C75xpulhq6+MpVz2zEdmtNpewFx6zN6/VU1+WCodiuS6NzD3zc+NM0kP2+DtMv57vb1NAgCzbdxdopk7vNr+qXT9V2m/0o1nH9gLa/ZYaJIetloeb+9qOxvns+jLhvwPI7bq89tE/BxxWr89GJYZc7/nIs5aOLzGpD1sG5XuePWz4VLmcmm4lTcUDPO4a+kKse37+GLYKXxaFt6lmVfU8m+lvEK2uhpr5fEX62Eb5LHGfa8KNgCYM7PwHLalWMlnid3SJko3h9e0yRmU57mScwcALEH2oc1jwZaPG1kpr7WJ0s3hpEutKynPMx+XAgDMkeyJyiW7o9qBGXZtm1hG95aFNyLk89WyCBpilh0Q8VnEwe0AADD7si8se6naOzfZcNxdume9TXrXKwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8B/4BtAzOzAGVr5MAAAAASUVORK5CYII=>

[image5]: <data:image/png;base64,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>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAaCAYAAABRqrc5AAABG0lEQVR4XmNgGAWkAk8g3gHEiegSxAJJIP4ExDlA/ApNjmhQAMT/gVgWiH3R5IgGu4H4ProgKYARiN8B8Rp0CWKAKgPEC+iYLBDMANEchi5BCmhmgBiiiS5BCtgIxJ+BmAldgljAzwBxxWQkMX0gvsKAMLQXiDMR0pjAjQFiSDKSWAsQL0HixwDxKSQ+BihjgBhihCS2FIhnIfEDGCBJACdYDMTvgZgVSWwtEM9A4oNSMMgiUHrCCq4D8TI0sblAPBuJH8iAJT+BAukBEGszQGyIRJFlYKgG4uVIfFCuPoLEB4PLDBAvZADxUQZUr4CAIRBfBGIWKH8iENcgpCEgFIh3AfF0BkgRgA2kA/F6BkgsrQBiXlTpUUB1AADp9jUCkYqltgAAAABJRU5ErkJggg==>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAYCAYAAADOMhxqAAAAoklEQVR4XmNgGN7gNhBPAeKlQPwfiA1QpTEBSJEnENcDcTEQM6JKYwKQBlF0QXzgJroANiACxL8YIKbD8F8gFkZWhA0YAnEDuiA+kAzEgeiC+MAkIFZEF8QFmID4E7ogPqDNAPEs0SCWgUQNPQwkajgAxMfRBdEBKBgfA7E6EH8G4gpUaUxwlgGiMBGIrwExP6o0JggA4l1APAOIldHkhh0AANRsHM6MVNFkAAAAAElFTkSuQmCC>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAYCAYAAADOMhxqAAAAuUlEQVR4Xu3QsQrBURTH8VNKibIZLLIYpKxGpXgDpZREGW2eRf1HnsBiEMmilEUewGI1KAML33vPTecR/sP/V5/hnN+9d7giSeKULs44ooQ6Vjhhas75ZLBBCjdcsQ7dDF9UwuwzwBhpvHBBPnRD0QvNMPuURQ+4pSsnppvjg5zZ/bPH3cxt0Qf6YS6azr/wxtLsIjyRRQ0L00lH9LWR2W2xE/0U9wlV00kPDxTMroWD6Fc3zD5JDPIDZjkfg+YRLzEAAAAASUVORK5CYII=>

[image9]: <data:image/png;base64,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>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAZCAYAAADaILXQAAABMElEQVR4Xu2UPUhCYRSGX6QWCwTdHIogdNfV2cbGBseoRomaxUEhCAJpqRZrKYSWoKGtIYKIBomWVleHoCUQIt/D+cjPY8P9aXDwgYd7fc/lXD33eIEZ08AH/fnDL3pL10eXRqNAH022SA+gNzoytVBc0DUbkhJGvyRraoHp0aQNSQva+NgWgrIKbeCTpvv0m57RhfFycDYx+TDFG+hYYnGO8W8u43mmHTrn5ZGQeX+arAq94YbJQ5GHNrkz+aHLmyYPxTa0Sd3kDy7fM3korqBNyiaXf6fkFfc54wzMPO1Dm8jq+by7fIsm6DX0NZCibXpJd2kNOsJfiphcO39bhBy9p6/0iTZcLo2W6AvdoSf01NVis+yOA7riF/6TN+888jvHIqOS9exCRxJrm2ZMOUOxnEaPtyLTSwAAAABJRU5ErkJggg==>

[image11]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAZCAYAAAC/zUevAAACAklEQVR4Xu2WT0gVURTGTyZh5aJNBKEVJILQIrC/EGJaFGG4FKWCVi6ibGsp0cY0xUiwTdAuxCAqDcQs3IoriXZBuS6pRauCqO/z3Pe88zVj+d5bxfvBb3G/c2bede6dO5qV+c+4q0EGnXBYw1JwDY5puA7jGhTLWfgObtaC+V/9AVZLvgW2S1Yw5+EXuFULYBv8AV9oIfALXtSwEJ7ACQ0DJ81/iEuVxiKc0TDHUTgLF8wbe+F0yI5EfWQF3pBs3vzH1atxE7gDP0u2yn44B/eEMTfbEKyHH+HTkBP28uZdURbzynypKrQQuGR+/S4tPIMN0fgh3AnPmV9wJaq1howbU6mE3y05aaXN/PoDWjgo4/cyjuGm5E10iUiTee26FiJOmPe0aCEm97izOG1eP6YFcNO8dkgLEcfNe3ifTLotOYndcHs0bjSvn4myHK/hV1s7O2rtz7XPLfHhOOTa89B5HsZTlpwEx3XReJ95vSPKSJX5fpgMY27Mebg33+FcML9+Rxw2h5CvDh8VXx+OeZN+OJLvdDbBT7BPcp6OP82/D+wZgLcTHQ4znqYJeOo9Mj9A3sAaeB++hD2W/qo9tvQDh5Nehm/hrWQpD1/hrINuQ1yG3yx9gn+D153SsBD4fVg2/1BtlCUNiuWB/fv/E+SeBqWAG3BUwwz41AY1LFMmjd86zmNS6YBD+gAAAABJRU5ErkJggg==>

[image12]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAYCAYAAAAs7gcTAAAAaklEQVR4XmNgGAX0BCxA3A/E34H4PxbcAlPICMSLgPg0ENcBcS0QP4XSMGwMU1wIxL0wDhCIAvErJD5ekA7E+9EFsQF+IP4FxInoEthACAPEQ9roEtjAHCD+BMRM6BLYwGognoAuOAroCwA2UBTYW2q3zQAAAABJRU5ErkJggg==>

[image13]: <data:image/png;base64,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>

[image14]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAZCAYAAABOxhwiAAABrklEQVR4Xu2VzSsFYRSHj4SQfJQFiZKUjYWVlaJ8rFAsFGXBQlEiVr52KGQtKSEsxFJhYamwYCEbG4rkL7AQv9OZmfvO6WrujBGL96mne+/v3Joz77zvGSKLxfKX1MNzeAXHYLqv+k9pgW/O93J4B/cS5XjYgUuwSBci0g4/4aCR1TrZhJHFQgM8gJMwR9XCMkvSZLeRlTnZqZFRBlyF705RO5X4ayBt8JBkZaLewDrJdTuMrNjJHt0gDW7BS5I7nYEvzqcrP6awNMJtuAgrVC0I3su6cd6GnL26AZ/WZa9MVAKfjd8/pQ7uwiPYSrJQQfAN68YLncxbcc0wPNFhDJTCBXivC0ngbctNdhqZu1V4NCbljPxPIA6ySQ7tE8kBDmKapMleI+ORyNmxkXnkww/YpwsRyYPj8BbOw0p/+VuaSZocMTLecpzNGZlHD0mxWhdCUkBygRs4CnP95UD4DflAMl1cBkh6qzIyj00yTm0EeHrwFLmGQzDTXw4FTzLeWkwWySLw1EsKn/wVHaYAvxx4717ALkptcqRCDdyHa7Bf1WJhAzbp0GKxWCy/zhdgylMp39zNzQAAAABJRU5ErkJggg==>

[image15]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAAAXCAYAAACGcCj3AAADrUlEQVR4Xu2YWahOURTHl1kyzzzoepVMeeBF5MFcMkTI9GAID8YX4iJDmQkpIoQHU4oyvijKPGQebpHhQYhSSPz/1t737rO+853vuPdyPZxf/bvfXmuf8+1v7b3XXvuKZGRkZGRkxDMCOgadgpZADaPu3/SCLkGfoYdQ86g7NTOhm9YY0AhqYY0xcKw/Y3TY+Q/E+M46X5UyEjoKNXXtXdAVqFZpD5E+0EtoMNQMmgc9hhoHfdLQDvoA3bUO0Fn0vU+gxcaXxH7RYO6wDrBZ1HfEOqqK2qIDmmHsb6Ax7jODxD4MRMvSHmr7BNUMbEmMhbZCb6F7xufhTuN7i409Cb6Tz6yzDrBS1LfH2P+IQdB56Kvoikj6wXOsIYZnUjbgGtBQ6DVU3/nbQD9cn47ORtj+LtGdkA/uBK5q/q3sgG+T/AFfJRUMeBeoBFotGnjmpMvObuFEMFUUYpaU5bhr0G2oW6SHSA+ot7GxP1NPGrZDo93n/yHg3NG0cyFx5zI9sn0w7ET2Qu2NbYho0DdARc7GQ4eHxzTXLoQfALVP0uVm9u1njTH0hM4E7aSADxd975/kcB/wJO3xnR3F0AmorWsz6EyPXX0Hz1prcFQXDVqJ6BewklgY6ZGfJqIn/lTRSeLzV0WrhXxMEt0ZaeC7wkWSFPB/tcJ5mI4K2uzjz6y/Sh3oOjQ5sN0QHQB/SBydRFdDWuabdpqAL7WOBMoT8AVQB/eZqe5Q4MthBfQF+iaFD81F1mBgTcxDkzvEw5X9CLoT2DxcqS+gKdaRB/bnQRxS2QGvSJXCIoCxZEnMGHSPukWGQeeggaJVBHMdDy5uj2pBP9JaCh+amyT+MsDqxgaFJeF9aHxg2y3RybJMl2gutbpQ1vU3PuDLjD2J8qxwwoXKdEc/aSVa/UXgKVrX2DhLDDorjAmi1QQHzlTBAysJ5v13kntrXANtDNqcXA6OAfTUk9wLTF9oorGFNBD9gfY5jw/4cutIwAd8vXVIcsB5HtLHjEF4k85JLbOtwcFVxtXPKuaV6KFQFHbIA4N2EroFDXA2Thqv8AwO4Upgn4+iu4GrkqUjU1p4g2Nl5Ov1/oE9hBNL/wPrcIwT9XP8adkp+swW6xBd9fTxNhriv+ei6O9j/I5L/DsqHX7ZXOi06E5hzeyDTZjXOLg4cQV5eAFiGnovuZPNieVEcdL8s89FS1lPSeCjmL44wfxXQhysrOx4qDT/S3nq2lw4tHEsbBc68zIyMjIyMjIyqphfZFQX4m3z7okAAAAASUVORK5CYII=>

[image16]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAZCAYAAAA8CX6UAAAA/klEQVR4XmNgGAWkAkkg/o+G7ZHknbDIdyDJY4BoIH7EAFG4AFWKQQyId0HFlVGlMMFJIGYB4pUMEMOQAScQ30ETwwokgHgrlO3CgGmQDRAvRBPDCkKAuArKZgTiq0BsiZBmKAPiZCQ+TtDPAAlUGCgC4rlI/PVArI7ExwlA4cONxBcG4m9QGuTCG0hyOAEPEB9BF2SAhFMpEFsA8RI0OazAG4i70AUZIAbdBuIKIE5Hk8MK2oHYF10QCC4wQAx7BsRaaHJYwTEg5kMXBIIsBohBL9Al0AE/EKcA8UcoGx2ADP8ExMvQJZCBKwNm/ulDUQEB04E4Dl1wFIwCagIAD7AyaQ5YTVQAAAAASUVORK5CYII=>

[image17]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAAAXCAYAAACh3qkfAAADUUlEQVR4Xu2XSehOYRTGH0OGzBlK5imJhSiFkmFDLIhkiP6hCAtZEEVSxiTzuCAibIRkYYwiZEqUYoNYKEIREufpnPf+7z3uwGWl+6un7nvO+b773uc7933fD6ioqKj4/1gquu6DKQwVNfNBR08fMOqLVoguiG6KTor6JiqU6aJzoquia6LxyfQvsPZHig5b3sepY5YrzUfRLR90NBDdF7X0CaGDaCx0Ip9djvCzZ6AmNbLYEtEX0ZBQJCwTPRZ1svEw0QfR4qgim6NQM7b7BNQ85vb4RBlmQyeVZ1hvaJ4P3cLl4jyCmuBhR730QeGQ6JOosWgT9KH6JCqAORYf7uIemsG6NT4h7IDmNvvEn9Ja9ADFhl0WDRSdQnqHBdIMY3dxsg9dnGyB5kaILtp1+0QFMNHiK13csxdat9Yn8A8N2y+agHzDZqL2RmUM6wGd7G0XJxuhuamiZ3bdKlEBjLP4Lhf3lDGMSwjj7HI2zlsb18RqIgZDXzGSZRjNuStqauMiw9hFvHmc/sg2bB00t1D0xq69YWMsftzFPcGwPHnDLolWQ5cEwpo7oiZRhcEdi+tKRxtnGcZJsAMDRYaldRjXpCzD2A3MLYCucWmGjbZ40c5WpsO4ibWxa5rEDusaZWMsFy2KjdMMi3dg4HcM++pibaGTZad6NkBzU0T37Do8QIC7L+M7XdxTxrCDsWtuQDNi44hu0DNXvVjMG+Y7MFDGMN6Hk33i4mQrNDdSdN6uuyQqgEkWX+Xinr/ZJedC84Q/GD2KmA9NZum0qF9KPC6e29KgYd98ELrLvvNB4Qh0zeOPwLWE3z0gUQHMszhfzTzKdBjhQZsN89zGNdAzYi78Mv9KpsHXpqjDvvsgdBK8B3fMQB3oIZWmkV5Qs2dFFQo7hw9T18U9wbD1PoFsw7jY37DcKIvR8JpQkAU/kLbGePiAfo0J0ICnUMOauxzhsYDHmMBk0WvUnurJNOg8Gtq4s+g99GhRxAGkm0J4X+a2ufg+iweT24leIOd+PLXzdeGHKD5w2hrAG76C1nAnORvLcRdld/LVCt/DV5YH0TjsEHYPH4hdxUXcr5GE6xnncEK0G/r/NY+y/yW7x8ZXoGsofxyOB/GDFRUVFRUVFXn8BDu6GQEysju4AAAAAElFTkSuQmCC>

[image18]: <data:image/png;base64,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>

[image19]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAXCAYAAABNq8wJAAACI0lEQVR4Xu2WP0iVURjG38IGc7FArCVRcGgIygSJqIZEBANBRQ0aIshBCGlRGkTaMsEidfDPcEOkcBEFEU0Q+wcNRYROEYJNEQguDkro83TOx33P+c797ugdvh/8hvOc937feTnnnntFUlJSQlT5geUxvKrGJ+A9+FRlx0YpvAlfwT1vLmITHnoyu6iLjpvXYhYWgos954eFRlIDG/C8HxYaSQ38gJ1wHn6Ev2G3UxHnk5gjyWfWwodwBGZgGayAM/Ad/AKf/f+USw98L+b9s/C5O+2SkdwNfIODatwhprZdZT634KSYOjbTaPM/8DNchBds1mzrbtsxaRNTS4rhBBzNTsdJ2oEaPwA/xexEEl1inqmbX7FZncq4I8zGVTYEt9T4OnypxjGSGgixKvnrowa4YxFLNjupsjM2y6isyWZseBheUnNBcjXAc/gXtnj5goTrNTz3rGlVGRs4UGPCq9xvgDywOd2Hd91pl1wNvBGTD3g5v8yhek20AL8BLkYTNTCtsnoxP6w8/3fgV7gNi1SNQ64G+uAYPKUybv8u/KWyENERytfAWYk3wPPer8a8BFhTojKHtxJu4LSYW+SayrgbXESDykLwLwifeV9lH+A/cRfC24h1vKYj2EB0CxG+k591qBZzz+5I9qyxyL+TK+EUXBdzZy/DK05FnDUxC+Uz2ewcvGHHlIt7BJ+I+/7v8DJ8AXvFfIkpf0PKJSUlJaUgOAI2c45fViYr8QAAAABJRU5ErkJggg==>

[image20]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAAAXCAYAAAB3e3N6AAAD80lEQVR4Xu2Xa6hWRRSGl11IuqmIRlCo0AXBG2am9KOQQEoKi6ifpxL9JSoKamkdUiy7CZWpWQSVUZSV/TmSlkJllmKZYTe6kYlJoEkgpESup7XmnNnL2d85YIbCfuCFPe/Mty9r1qyZT6ShoaGh4VTiRtU7qo2q20MfDFAtV72v2qEaWO3+lzNVC8TusVW1TjWyMuJ4OlT/BL2e9V9a6Ic1BT9ql6qPj//fWKb6UTVUdYfqqFSDcInqK9UD3j5b9atYgBN4BI8JOde9maojnSNa87Lr/NihTFP9ITZRI0LfU2KBWxx8gvi42Hun9zmpkEl7VN+qerk3VrVK1c/bfcWC+6q3E9+oPsraZOK+rJ1YrbowmgVWqB4J3jDVh6pBwc95SCyY98UOh74XopmYJLbU/lLNEQtIHfS34gaxh70dOzImiI0hwDlb3CeTyEquyYLIUtVN0SzwjFSDeZVYucizv8TDYs8mayPpvdpiB4xS/ST2ggSVh/FRpbp0luqtaAbmiz3sWdVC1Qdi9yYbE3f5mCczD95z/3LVEL/+vDLCaFdNiWYBgvmoX1+jOiD2jd1Rl5nU9PWqe4PfCTWFF8+5RbVNrO4Ndu8isfpFrWkFv+FFfhF7KEudCeJ+qc7M8DExmBvcHyc2yXXBZJLmRrMAwaTGEUjqN/f7TFqvPFgiNpZSxbsn/S02IbU8Fg3nDNV0sazlxn9KixnJWCk2/kvpqpm3upd+P9XbdcEcr7rSr+uCOS+aBTgpkO07xRKGVcI92cRaUbfMe4s9+13pWc0+YRaJvchLmUem4e329m3efrpzhLHJ/ctU/f36i8oI40HVPdEsQGb+LF2riwk6LLb5XeteibpgJuh7M5oJ0pqHcOTobgO6PxoBspmHPZF5Y9zb7+3rvB13xE/cZ9ZZGVx/XxlhsJpujmYBdvO48qiD3Pc7KR+ZoK5mJuhLk16BLGEpsDtyc85928XOhmmZJi5WrQ1e5GqxB/EhCZYt3tfevkCsbMQdn8Dly3qz6lDWTjAJpQN+JN+AEuzGZDvvQxko0dNgjo4dr4nVgpzhYv9I2DTaVNeLBZcPJTDdwb8EjlqJyWIPZ3NKPK/6QSwDE4yZnbV5Nt4VmQelOlqCYMbMBDYkViH3nhj6oCfB5A/GcSt4VjQcPpKspfbtFdssBlVG1MN5jrJxp7fZCQlufjxiFXysujvzPlWdk7WB7MnLASeN37N2K55TvRhN5w2xoJCl54U+ShR97cEH3vc3aV1z/3M4mFM+2NXZlDijRgguuzInALIofhQwqWw2fOArYuPiUS7SIV1LMSn/b85ZOfYD949+1EHp/tDf0NDQ0NDQcNpxDN7BCqkvY/UyAAAAAElFTkSuQmCC>