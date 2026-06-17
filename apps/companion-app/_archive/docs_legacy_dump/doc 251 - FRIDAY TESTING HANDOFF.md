# FRIDAY TESTING HANDOFF: Voix Vive Engine & Video System

**Status:** The theoretical pedagogy is fully mapped. The Audio/Pitch physics have been proven in `ResonantMirrorPOC.jsx`. The LitRPG offline framework is built in `WalkingModeEngine.jsx`. 

**The Goal for Friday:** We need a closed-loop testable build. The user must be able to:
1. Open the app and perform the **Daily Calibration** (Guitar Tuner + Somatic Voice Check).
2. Enter the **Voix Vive Engine** (formerly Resonant Mirror/Walking Mode) to play a gamified audio interval lesson.
3. Finish the lesson and use the **Player Portal** to record and save a video artifact of their practice for Bertrand to review.

---

## What the Next AI Needs to Build (The Roadmap)

### 1. The "Daily Calibration" Gate (`src/game/DailyCalibration.jsx`)
- **What it is:** The mandatory startup sequence before lessons. Replaces the "woo woo" spiritual concepts with bio-mechanical terms, but achieves the same result.
- **Mechanic 1 (The Wood):** A standard 6-string tuner using `usePitchDetector`. The user must hit E A D G B E.
- **Mechanic 2 (The Player):** A somatic voice check. The user must hum an 'A' (110Hz) for 4 seconds. The AI must check the RMS (volume) to ensure the breath isn't shaking (tension detection).
- **Outcome:** Unlocks the main curriculum.

### 2. The Video Recording System (`src/components/PracticeRecorder.jsx` or similar)
- **What it is:** The "Player Portal" integration where students film themselves playing the lesson they just learned.
- **Mechanic:** Must access the user's webcam and microphone (`navigator.mediaDevices.getUserMedia({ video: true, audio: true })`).
- **Storage:** Must record a `.webm` or `.mp4` blob and save it locally (IndexedDB or LocalStorage) so it can be reviewed in the Mentor Dashboard. 
- **Requirement:** This proves the "funnel" concept. The app is the game; the video is what the Mentor charges $150/mo to critique.

### 3. Codebase-Wide Branding Unification
- Find and replace "Resonant Mirror" and "Walking Mode" with **"Voix Vive Engine"** in the UI to ensure professional, unified branding for Friday's test.

---

## EXACT PROMPT TO GIVE THE AI TOMORROW:

Copy and paste this exact prompt when you start your session tomorrow:

> **PROMPT FOR AI:**
> "Read `docs/10_FRIDAY_TESTING_HANDOFF.md`. We are preparing for a Friday test of the Voix Vive Engine. Our goal today is to close the loop on the user experience. First, build the `DailyCalibration.jsx` component that acts as our bio-mechanical 'Tuning the Wood / Tuning the Player' gate using the `usePitchDetector` physics we established yesterday. Then, verify and finalize the Video Recording system in the Player Portal so a user can record their physical practice and save it locally for Bertrand to review. Keep all code strictly offline-first and adhering to our PEARL standard. No woo-woo language; use strict somatic/mechanical terminology."
