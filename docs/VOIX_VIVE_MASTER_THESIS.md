# VOIX VIVE: MASTER THESIS & ARCHITECTURE BLUEPRINT (10/10 SPEC)

> [!IMPORTANT]
> **THE SINGLE SOURCE OF TRUTH**
> This document consolidates the entire intellectual property, pedagogical framework, hardware constraints, and software architecture of the Voix Vive project. Any future AI agents or developers must read this document first.

---

## 1. THE PEDAGOGICAL FRAMEWORK (The Maturation Map)

### 1.1 The Core Philosophy: "Ego as Egg & Shell"
The curriculum bridges somatic trauma treatment, body-centered awareness, neurology, and psychology with guitar learning. We provide temporary structure for systematic growth until the learner outgrows it. Sound must make a physical, emotional impression—learners must pause between notes to observe their internal state.

### 1.2 The Pedagogical Loop (Somatic Studio Prompter)
Every interaction must adhere to the Isomorphic Pedagogy loop, forming a strict Directed Acyclic Graph (DAG) progression:
1. **BE (Somatic Centering):** Anchor breath and release physical tension. (Requires BE-score ≥ 0.85 via breath/posture analysis).
2. **DO (Active Imagination):** Visualize pitch internally before execution. (PitchRoom requires ≤ 5 cents average error).
3. **PLAY (Unscripted Fun):** Open improvisation.
4. **PRODUCE (Share):** Reflect and log the artifact in the FHEAL workbook.

### 1.3 The C-Scale Foundation & 1-4-44 Logic
The journey maps the first five frets across all six strings, bypassing the cognitive overload of the full 12-fret chromatic system.
*   **Stage 1: The Open Map:** Matching the 5th fret to the open strings below it.
*   **Stage 2: The C-Scale Seed:** Fret 0-5 Diatonic mapping (White keys only).
*   **Stage 3: The "Pothole" & Triads:** 
    *   Navigating the G→B glitch: In standard tuning, the G-to-B string transition is a Major 3rd (not a Perfect 4th). The UI must visually warn the user of this "Pothole".
    *   Understanding the supporting beams (1, 3, 5 scale degrees).
*   **Stage 4: CAGED System:** The Rosetta Stone—5 interlocking chord shapes moving up the neck.

---

## 2. THE TRUEBADOUR AI PERSONA (System 1)

### 2.1 Narrative & Mystical Context
The Truebadour is a 33B local model that acts as a Socratic, mystical guide. Its persona is rooted in:
*   Robert Fludd's 1617 Rosicrucian cosmology (The Divine Monochord).
*   Pythagorean mathematics ("Number Five").
*   Leibniz's "Unconscious arithmetic in music".
*   Dream Yoga and somatic awareness.

### 2.2 Socratic Rules of Engagement
*   **No Direct Answers:** The Truebadour never spoon-feeds music theory. If asked "Is this note right?", it must reply with a somatic inquiry (e.g., *"What does correctness feel like in your jaw today? Over."*)
*   **Jungian Archetype Coloring:** Prompting language shifts based on the user's archetype (Sage = analytical, Jester = playful, Caregiver = gentle, Hero = action-oriented).
*   **Ghost Train Detection:** If the user logs 3+ "frustrated" BE check-ins, the AI enters *Maintenance Mode*, shifting to emotional triage rather than technical progression.

---

## 3. THE CORE CLAIMS & RED HAT SAFETY GATES

### 3.1 The Four Core Claims
1. **Geometric String Mastery:** The system teaches the guitar neck as a continuous geometric coordinate plane.
2. **Somatic Acoustic Validation:** The system validates playing in real-time using acoustic pitch validation.
3. **Psychophysiological Pacing:** The system monitors the student's nervous system and dynamically adjusts curriculum pacing (The "Friction" penalty).
4. **Spatial Fretboard Anchoring:** The system projects the coordinate plane directly onto the physical instrument via OpenXR-compatible consumer AR glasses (Google Android XR / XREAL Project Aura).

### 3.2 "Red Hat" Safety Testing Gates
A feature cannot proceed to production unless it passes these strict testing gates:

| Gate | Requirement | Testing Methodology |
| :--- | :--- | :--- |
| **Gate 1: Acoustic Latency** | Pitch detection processing and visual render must be `< 25ms`. | Profile WASM Autocorrelation loop under load. |
| **Gate 2: Biometric Privacy** | All HRV/Breath data must remain strictly on-device. | Network packet sniffing; block external API egress. |
| **Gate 3: Spatial Drift** | The digital AR fretboard must not drift more than `2mm` from the physical wood. | Android XR depth-sensor SLAM stress testing in Bevy. |
| **Gate 4: AR Compatibility** | The AR Passthrough must achieve 90Hz native on OpenXR-compatible consumer glasses. | Deploy Bevy build to XREAL Project Aura via Android XR; measure frame drops. |

---

## 4. THE DUAL-SYSTEM SOFTWARE ARCHITECTURE

### 4.1 System 1: The Theory Binder (React / Tauri)
The React application serves as the **Companion App** and **Theory Binder**. It runs on desktop/mobile and provides the UI, progression tracking, and the "C-Scale Hub".
*   **Aesthetics:** Utilizes Glassmorphism and Mesh Gradients to create a premium, immersive UI.
*   **Role:** Handles all text, video playback, portfolio management, and IP presentation.
*   **Data Sovereignty:** Uses Dexie.js for local IndexedDB storage, ensuring biometric and learning data remains strictly on the user's device.

### 4.2 System 3: The Spatial Player (Native Rust Bevy / OpenXR)
The primary AR experience is built natively in Rust using the **Bevy Engine**.
*   **Hardware Access:** By using `bevy_mod_openxr`, it targets OpenXR-compatible consumer AR glasses running Google's Android XR platform (XREAL Project Aura, launching late 2026).
*   **Android XR Bridge:** The Bevy engine runs as an Android native library, invoked via Tauri's Android entry point (`src-tauri/src/lib.rs`). The companion app (System 1) serves as the host; the spatial engine launches as a subsystem when AR mode is activated.
*   **Legacy Note:** Previous versions targeted HTC Vive XR Elite via WiVRn. This has been superseded by the Android XR / OpenXR pivot. The Vive-specific code paths remain in the spatial engine as reference implementations.

---

## 5. THE MONETIZATION PIPELINE: MENTORSHIP MONETIZATION
Voix Vive pioneers a model called **Mentorship Monetization** — a financial structure designed to keep human Subject Matter Experts (SMEs) employed in an economy where AI is replacing content creation, teaching, and knowledge work.

### 5.1 The Core Thesis: AI Makes Content Free, Human Attention Is Premium
*   **AI can teach you scales.** AI can generate exercises, transcribe music, and answer theory questions. This is now a commodity — it should be free or nearly free.
*   **AI cannot watch you play and tell you what you're doing wrong.** It cannot see the tension in your shoulder, the angle of your wrist, the hesitation in your phrasing. It cannot give you the look that says "you're ready for the next level."
*   **The human mentor is the irreplaceable element.** In an AI-displaced economy, the most valuable thing a human SME can sell is their **attention** — their eyes on your work, their ears on your playing, their judgment on your progress.
*   **Voix Vive monetizes that attention.** The content (curriculum, tools, AI) is the funnel — free or $5/month. The mentorship (Bertrand watching, listening, responding) is the premium product — $100 to $1000/month.

### 5.2 The Funnel: Curriculum → AI Habit → Mentorship Anchor

```
Chapter completion (free) → emotional peak → upgrade prompt
AI coaching (free/$5) → daily habit → "this needs human eyes"
Mentorship review ($100+) → Bertrand confirms/corrects AI
Student feels seen → stays subscribed → next chapter → cycle
```

**Key insight:** Students don't practice every day. They don't submit videos every day. They pay for **access** — the option to get Bertrand's eyes on their work when they're ready. Like a gym membership: you don't go daily, but you keep paying because you *might*.

**The business metric isn't Bertrand's hourly rate. It's LTV and churn.** A student who stays subscribed for 18 months at $100/mo generates $1,800 — even if they only submit 8 videos total. Retention > transaction count.

**AI Pre-Screening (the scale solution):** Gemini analyzes every video submission first — flags timing, pitch, posture issues, generates a draft review with timestamps. Bertrand reviews the AI analysis, adds his judgment, records 2-3 min of personalized feedback. His time drops from 12 min to ~5 min per review — 2.4x throughput.

### 5.3 The Five-Tier Model

| Tier | Price | What You're Buying | Bertrand's Time | His Effective Rate |
|---|---|---|---|---|
| **Free** | $0 | Content + offline AI (the funnel — habit formation) | 0 | — |
| **Community** | $5/mo | Cloud AI + community + blog (daily engagement) | 0 (blog is shared) | — |
| **Apprentice** | $100/mo | Access to Bertrand's reviews — submit when ready (up to 4/mo). AI pre-screens. | ~20 min (with AI) | **$300/hr** |
| **Journeyman** | $500/mo | 4 scheduled live Zoom sessions + 4 async reviews (accountability tier) | ~3.3 hrs | **$150/hr** |
| **Master** | $1000/mo | 8 live sessions (2/week) + direct messaging + quarterly assessment (relationship) | ~7.3 hrs | **$137/hr** |

> Bertrand's in-person rate is $65/hr. With AI pre-screening, his mentorship tiers pay **$137–$300/hr** — 2-4x his in-person rate, for digital work with zero commute. AI pre-screening is what makes this sustainable at scale.

### 5.4 Revenue: 100% to Bertrand

Voix Vive is built by Joshua Atkinson as a gift to Bertrand. **All subscription revenue goes to Bertrand.** Joshua's income comes from his own separate projects (daydream, Trinity, phonethagoras.com). If Bertrand chooses to compensate Joshua after the platform is generating revenue, that is entirely at Bertrand's discretion — it is not encoded in the pricing structure.

This is not a partnership. This is a developer building a tool for a teacher, for free, because the teacher's method deserves to reach more people.

### 5.5 À la Carte Services (Non-subscribers — Bertrand's Revenue)
*   **$5 Quick Question:** Text feedback within 24 hours.
*   **$15 Mini Critique:** 3-min video → focused feedback.
*   **$35 Full Video Review:** 15-min session → real-time reaction video.
*   **$65 Private Lesson:** Live 1-on-1 via Zoom or in-studio (Houlton, ME).
*   **$35 Group Workshop:** 90-min small group session.

### 5.6 Why This Model Matters Beyond Guitar
This is a **template for any human SME facing AI displacement**:
*   A yoga teacher could use the same model: free poses + $5 community + $100/mo weekly form checks + $500/mo live sessions.
*   A voice coach, a painting instructor, a writing mentor — any expert whose value is in **watching you do the thing and giving feedback**.
*   The platform provides AI tools (practice aids, progress tracking, content delivery). The mentor provides the irreplaceable human judgment.
*   **This is how we keep human experts employed when AI can do everything except care.**

---

## 6. THE GOOGLE-FIRST PLATFORM STRATEGY
Voix Vive is a Google-native application. The entire stack leverages Google's ecosystem:

| Layer | Google Service | Implementation |
| :--- | :--- | :--- |
| **AI** | Gemini (via Google AI / DeepMind) | `useGeminiTruebadour.js` — Truebadour cloud mode |
| **Auth** | Google OAuth (`@react-oauth/google`) | `useAuth.js` — one-tap sign-in for Android users |
| **Database** | Firebase (Auth + Firestore) | `firebase.js` — optional opt-in cloud sync |
| **Storage** | Google Drive | `driveService.js` — student video submissions |
| **Scheduling** | Google Calendar | `calendarService.js` — lesson scheduling |
| **Distribution** | Google Play Store (via Tauri Android) | PWA now → native APK → Play Store |
| **XR** | Android XR / Google Aurora | `apps/spatial-engine/` — Bevy/OpenXR targeting Android XR |

### 6.1 The Narrative
Google explored music interaction (Les Paul Guitar Doodle, 2011), conversational AI (Bard → Gemini, 2023), and spatial computing (Daydream, 2016-2021). Voix Vive converges all three into a single product: a Gemini-powered AI guitar guide, delivered through a PWA/Android app, with a path to Android XR for spatial fretboard overlay.

### 6.2 Funding Alignment
*   **Google Cloud for Startups (AI):** Up to $350K in Cloud credits — covers Gemini API, Firebase, hosting for 2 years.
*   **Google AI Futures Fund:** Rolling applications for equity investment in Gemini-based startups.
*   **Google Play Store:** Distribution to 3B+ Android users. 15% fee on first $1M revenue.

### 6.3 Android Deployment Path
1. **Now:** PWA — installable on Android via browser. Already functional.
2. **Next:** Tauri Android APK — native wrapper for Google Play Store. Tauri config already exists (`src-tauri/tauri.conf.json`).
3. **Future:** Android XR app — spatial fretboard overlay on XREAL Project Aura (late 2026). Bevy/OpenXR engine in `apps/spatial-engine/`.

### 6.4 Bilingual Advantage
Bertrand is bilingual (EN/FR). The app has full i18n infrastructure (`useLocale`, `en.json`, `fr.json`). French-speaking guitar market is underserved — no major competitor offers native French teaching content. Target regions: Quebec, France, Belgium, Switzerland, Francophone Africa.
