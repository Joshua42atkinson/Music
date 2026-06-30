# Voix Vive XR — Audio & AI Maturation Map

**Sound as the Nervous System of the App**

---

## The Audio-First Thesis

Guitar pedagogy is fundamentally audio pedagogy. The student's ear is the primary instrument. Everything visual — fretboard overlays, potholes, hand tracking — exists to serve the ear. If the audio pipeline is wrong, the app is wrong.

Voix Vive already has a deep audio stack built across three platforms. The question is: what does "mature" mean when that stack runs on XREAL Aura hardware, powered by Android XR's spatial audio engine, with Gemini Nano on-device AI?

---

## Part 1: Hardware Reality

### XREAL Aura Audio Hardware

| Component | Specification | What It Means for Us |
|---|---|---|
| **Speakers** | Sound by Bose — open-ear drivers in temple arms | User hears app audio AND their real guitar simultaneously. No ear canal blockage. Critical for a guitar teaching app — you must hear your own instrument. |
| **Speaker type** | Open-ear (bone conduction adjacent, but actually air-conduction directed toward ear canal) | Ambient sound passes through. User hears room acoustics + guitar + app overlay. This is correct for our use case. |
| **Speaker tuning** | Bose EQ profile | Warm, balanced frequency response. Good for drone tones and TTS clarity. Not studio monitor quality, but adequate for pedagogy. |
| **Frequency response** | ~20Hz–20kHz (typical open-ear XR range) | Covers full guitar range (E2 = 82Hz to E6 = 1319Hz). Drone engine root at C2 (65Hz) may be slightly weak — consider C3 (131Hz) as XR drone root. |
| **Impedance** | Not published. Driven by X1S spatial coprocessor DAC. | Not relevant for app development — the Android audio framework handles routing. We never drive the speakers directly. |
| **Microphone array** | 4-microphone array on glasses frame | Beamforming for voice capture. Also captures guitar audio, but with more room coloration than a close-mic. |
| **Compute puck audio** | Snapdragon Reality Elite handles audio processing | Enough DSP for real-time pitch detection + spatial audio rendering + AI inference simultaneously. |
| **Spatial audio engine** | Android XR spatial audio (via Jetpack SceneCore) | Full 3D positional audio. Sound can emanate from any point in space. Ambisonic sound fields supported (AmbiX format, 1st/2nd/3rd order). Dolby Atmos supported. |

### What This Hardware Enables That No Other Platform Can

1. **Hear your real guitar + spatial drone simultaneously** — Open-ear speakers mean the user hears their actual acoustic guitar AND the app's generative drone at the same time, in the same space. The drone comes from the virtual fretboard position. The guitar comes from the user's hands. The brain fuses them. This is what Bertrand calls "resonance" — and it's now physically real.

2. **4-mic array captures guitar + voice** — The microphone array on the glasses frame is ~15-20cm from the guitar soundhole (when guitar is held in playing position). This is actually a decent mic distance for pitch detection — close enough to isolate the guitar, far enough to capture room acoustics. The beamforming can potentially isolate the guitar from the user's voice.

3. **Spatial positioning of every sound** — Each pothole on the fretboard can emit its own tone. The root note drone comes from the 1st fret position. The 5th comes from the 5th fret. The student hears the geometry of harmony as spatial audio. This is literally Pythagorean geometry rendered as sound in 3D space.

### What We Can't Do

- **Can't output to external speakers** — No 3.5mm jack on glasses. USB-C on compute puck could theoretically route to external DAC, but that's not the use case. We're locked to the Bose open-ear drivers.
- **Can't get studio-quality guitar capture** — The 4-mic array is optimized for voice, not guitar. Pitch detection will work (YIN is robust), but recording quality for Bertrand's review will be phone-mic quality. Students who want high-quality recording should use a separate USB mic.
- **Can't do haptic audio feedback** — No vibration motor in glasses. Audio-only feedback channel.
- **Low bass limitation** — Open-ear drivers have limited low-end. C2 drone (65Hz) may be barely audible. We should shift drone root to C3 (131Hz) for XR.

---

## Part 2: Existing Audio Feature Audit

We have audio code across three platforms. Here's everything that exists:

### A. Pitch Detection (3 implementations)

| Platform | File | Algorithm | Latency | Status |
|---|---|---|---|---|
| **Companion App (PWA)** | `usePitchDetector.js` | Autocorrelation + harmonic correction | ~20-40ms (Web Audio API) | Production, 108 tests passing |
| **Bevy Desktop** | `pitch_detection.rs` | YIN (full implementation, parabolic interpolation) | ~10-20ms (cpal, 48kHz) | Working, scaffold-level |
| **Android XR (Kotlin)** | `PitchDetectionEngine.kt` | YIN (same algorithm, Oboe) | <20ms target (Oboe low-latency) | Code complete, untested on hardware |

**What we detect:**
- Fundamental frequency (Hz) — YIN/autocorrelation
- MIDI note number — `69 + 12 * log2(freq / 440)`
- Note name + octave — C, C#, D... with octave number
- Cents deviation — how far sharp/flat from equal temperament
- Volume (RMS) — 0-100 scale
- Breath state — 'free' | 'shallow' | 'held' (amplitude-based)

**Maturity gap:** The Kotlin/Oboe version is the right one for Aura, but it's never run on real hardware. The YIN threshold (0.15) and frequency range (60-1200Hz) may need tuning for the Aura's 4-mic array pickup pattern.

### B. Generative Drone Engine

**File:** `GenerativeDroneEngine.js` (companion app)

**What it does:**
- Generates continuous Pythagorean harmonic drones using Web Audio oscillators
- Root frequency: C2 (65.41Hz) — **needs to shift to C3 for Aura's open-ear speakers**
- Triangle wave (warm, soft) with LFO modulation (0.1Hz "breathing" effect)
- 3-second fade in, 2-second fade out
- Dynamic compression (threshold -24dB, ratio 12:1)
- Always plays root (1:1) beneath any interval drone
- Maps fret IDs to Pythagorean ratios from `harmonicData.js`

**The Pythagorean ratio data** (`harmonicData.js`):
- 12 intervals, each with: ratio (1:1, 16:15, 9:8, 6:5, 5:4, 4:3, √2:1, 3:2, 8:5, 5:3, 16:9, 2:1), label, physics note, Pythagorean context, resonance reveal text
- This is the soul of the app — every interval has a story that connects math to emotion to physical reality

**Maturity gap:** No Kotlin/port for Android XR. Needs to be reimplemented using Oboe or Android AudioTrack with real-time synthesis. The spatial positioning (drone emanates from fretboard position in 3D space) is not yet implemented.

### C. Spatial Audio (Bevy scaffold)

**File:** `spatial_audio.rs`

**What it does:**
- Sets up a `SpatialListener` at origin (updated to follow XR camera)
- Logs detected notes with frequency — "spatial positioning coming soon"
- 80ms throttle between feedback plays

**Maturity gap:** This is a stub. No actual spatial sound emission yet. The Android XR version should use `SpatialMediaPlayer` + `PointSourceParams` from Jetpack SceneCore, not Bevy's audio system.

### D. Sound Effects (audioEngine.js)

| Function | Sound | Waveform | Use Case |
|---|---|---|---|
| `playPling(freq)` | Bright pling | Triangle, 0.8s decay | Correct note hit — "PLING!" reward |
| `playReferenceTone(freq)` | Sustained tone | Sine, 2s decay | Reference pitch for ear training |
| `playPluckedString(freq, time)` | Plucked string sim | Triangle + sine, lowpass filter, 1s decay | Rhythm engine, backing track |
| `playMetronomeClick(isDownbeat, time, vol)` | Click | Square, 50ms | Metronome — 880Hz downbeat, 440Hz off-beat |

**Maturity gap:** All Web Audio API. Need Kotlin equivalents using `SoundPool` + `SpatialSoundPool` for positional audio on Aura.

### E. Metronome

**File:** `useMetronome.js`

**What it does:**
- Web Audio scheduler (lookahead 100ms, 25ms timer)
- BPM 40-240, time signatures 1-12 beats
- Tap tempo (averages last 5 taps)
- Volume control
- Downbeat accent (880Hz vs 440Hz)

**Maturity gap:** Needs Kotlin port. On Aura, metronome click should come from a fixed spatial position (e.g., slightly above and to the right of the fretboard — like a real metronome on a shelf).

### F. TTS / Voice (Bertrand's Voice)

**Files:** `useKokoroTTS.js`, `ttsAudioSuite.js`, `useCosyVoice.js`

**What we have:**
- Kokoro TTS — on-device neural TTS (WASM), EN + FR voices
- CosyVoice — cloud-based TTS with voice cloning potential
- TTS Audio Suite — quality scoring system with 6 dimensions:
  - Pitch stability (weight 0.20) — musical terms need stable pitch
  - French vowel clarity (0.20) — é, è, ê, u, ou distinctness
  - Cadence naturalness (0.15) — pauses align with musical phrasing
  - Consonant crispness (0.15) — plosives clear without harshness
  - Dynamic range (0.15) — whisper to emphasis, 12-24dB
  - Speed appropriateness (0.10) — slow for somatic, brisk for drills
  - Harmonic richness (0.05) — overtones, not thin/buzzy
- Test phrases for guitar pedagogy: "Do. Ré. Mi. Fa. Sol. La. Si. Do."

**Maturity gap:** On Aura, we have three TTS paths:
1. **Android TextToSpeech** — built-in, low quality, but zero latency and always available
2. **Gemini Live API** — real-time speech-to-speech, natural voice, function calling
3. **Pre-generated Kokoro/CosyVoice audio** — highest quality, cached as audio files

The mature approach: pre-generate Bertrand's chapter content as audio files (Kokoro/CosyVoice), cache them on device. Use Gemini Live for real-time coaching conversation. Use Android TTS as fallback.

### G. Breath Detection

**File:** `usePitchDetector.js` (lines 100-158)

**What it does:**
- RMS amplitude monitoring: `rms < 0.008` = breath held
- Three states: 'free' (normal), 'shallow' (300ms low), 'held' (1000ms low)
- Used in DailyCalibration somatic gate

**DailyCalibration.jsx** (lines 117-179) adds:
- Vocal "A" tone detection (110Hz or octave)
- Amplitude variance tracking (tension/tremor detection)
- 4 seconds of stable hum required to pass
- Mean successive difference > 3.2 = tension detected → "Lower shoulders, open throat, ground breath"

**Maturity gap:** On Aura, breath detection via 4-mic array is actually *better* — the mics are on the glasses frame, closer to the user's mouth/nose than a phone on a stand. We can potentially detect actual breath sounds (not just silence = held breath). But the current algorithm is amplitude-based, not spectral. A more mature version would use spectral analysis to distinguish breath noise from silence.

### H. PitchRoom (Interval Training)

**File:** `PitchRoom.jsx`

**What it does:**
- 12 intervals (minor 2nd through octave)
- Plays reference tone, student matches on guitar
- Live frequency display with match progress (0-100%)
- 20 consecutive pitch matches within ±25 cents = DO gate pass
- Audiation pause (Edwin Gordon method) — 4 second silence between reference and student play
- Voice prompts via CosyVoice for DO gate instructions

**Maturity gap:** This is the most pedagogically sophisticated audio feature. In XR, the reference tone should come from a spatial position (the target pothole), and the student's matched note should visually + audibly converge on that position. The audiation pause becomes a somatic moment — the student visualizes the sound in silence, then plays.

---

## Part 3: What "Mature" Means — Three Perspectives

### For the Student

**Mature audio means the ear leads and the eye follows.**

| Level | What the Student Experiences |
|---|---|
| **Immature** | Student looks at fretboard overlay, sees pothole light up, hears a click. Visual-dominant. Like a video game. |
| **Maturing** | Student hears drone from fretboard position, hears their guitar blend with it, sees potholes pulse in sync with the beat frequencies. Audio-visual fusion. |
| **Mature** | Student closes eyes. The Truebadour speaks. The drone fills the room. The student plays and *hears* whether they're in tune — the pothole visual is confirmation, not guidance. The ear is the primary instrument. The glasses are training wheels for the ear. |
| **Transcendent** | Student closes eyes. The glasses stay on — the ears take over. Plays in silence, hearing the intervals in their inner ear (audiation). The app trained the ear; the ear no longer needs the visuals. This is Bertrand's ultimate goal. |

**The paradox of mature audio XR:** The app succeeds when the student doesn't need it anymore. Every audio feature should be designed to make itself unnecessary. The drone trains intonation until the student's ear does it alone. The pitch detection trains accuracy until the student's fingers know. The TTS coaches until the student's inner voice guides.

### For the Client (Bertrand)

**Mature audio means Bertrand's pedagogy is encoded in sound, not just text.**

| Level | What Bertrand Gets |
|---|---|
| **Immature** | App shows text from curriculum. Bertrand's voice is absent. Feels like any other guitar app. |
| **Maturing** | Bertrand's voice (cloned via CosyVoice or recorded) reads chapter content. His phrases, his cadence, his French accent. Students hear *him*. |
| **Mature** | Bertrand's pedagogical ear is encoded in the AI. The Truebadour doesn't just read text — it *listens* like Bertrand. It detects the same things Bertrand detects: tension in the sound, rushing, poor intonation, lack of breath. It responds with Bertrand's vocabulary: "Respirez", "Écoutez", "Plus lentement." |
| **Transcendent** | Bertrand reviews AI pre-screened recordings. The audio quality is good enough (4-mic array + AI enhancement) that he can hear what he needs: pitch, rhythm, tone, tension. He records 2-3 minutes of feedback. The student hears Bertrand's actual voice in spatial audio, as if he's in the room. The mentorship scales without losing the human connection. |

**The business audio metric:** Bertrand's time per review goes from 12 min to 5 min because the AI pre-screen flags timestamps: "Pitch sharp at 0:23", "Rush at 0:45", "Tension audible at 1:12". Bertrand listens to those moments, records feedback, done. The audio pipeline is the monetization engine.

### For Google

**Mature audio means Voix Vive is the showcase app for Android XR's audio capabilities.**

| Level | What Google Sees |
|---|---|
| **Immature** | Another XR app with visual overlays. Doesn't demonstrate audio capabilities. |
| **Maturing** | App uses `SpatialMediaPlayer` + `PointSourceParams` for positional audio. Drones emanate from 3D fretboard positions. Demonstrates spatial audio API. |
| **Mature** | App uses the full Android XR audio stack: positional audio (pothole tones), ambisonic sound fields (practice environment ambience — Zen Garden, Studio, Stage), `SpatialSoundPool` for low-latency feedback, Oboe for sub-20ms pitch detection, Gemini Live API for real-time voice coaching. The app is the Android XR audio reference implementation. |
| **Transcendent** | Google features Voix Vive in Android XR developer conferences. "This is what spatial audio was built for — not for games, but for learning." The app demonstrates that Android XR's audio stack can serve education, not just entertainment. Google's investment in spatial audio APIs pays off in a market they didn't anticipate: music pedagogy. |

**The Google pitch:** "Simply Piano XR proved piano learning works in XR. Voix Vive XR proves guitar learning works better — because guitar needs spatial audio in ways piano doesn't. Piano keys are linear. Guitar strings are a 2D grid with a tuning anomaly. Our app uses positional audio to make that anomaly audible. Each string emits from its position in space. The G-to-B pothole is heard as a spatial discontinuity. This is something no flat-screen app can do."

---

## Part 4: The Audio Architecture for Aura

### Audio Pipeline (Mature State)

```
INPUT LAYER:
┌─────────────────────────────────────────────────────┐
│  4-Mic Array (Aura frame)                           │
│  ├── Beamforming → Voice isolation (for Gemini Live)│
│  ├── Raw capture → Oboe InputStream (48kHz, mono)   │
│  └── Room ambience → Ambisonic capture (future)     │
└──────────────────┬──────────────────────────────────┘
                   │
PROCESSING LAYER:
┌──────────────────▼──────────────────────────────────┐
│  Oboe Low-Latency Input (<20ms)                     │
│  ├── Ring Buffer (2048 samples)                     │
│  ├── YIN Pitch Detection → freq, MIDI, cents        │
│  ├── RMS Volume → 0-100                             │
│  ├── Breath State → free/shallow/held               │
│  ├── Tension Detection → amplitude variance         │
│  └── Fret Buzz Detection → inharmonicity (future)   │
└──────────────────┬──────────────────────────────────┘
                   │
AI LAYER:
┌──────────────────▼──────────────────────────────────┐
│  Gemini Nano (on-device, ML Kit GenAI)              │
│  ├── Context: current chapter + detected note +     │
│  │   cents deviation + breath state + tension       │
│  ├── Output: Socratic coaching prompt               │
│  └── Fallback: Firebase hybrid → Gemini Flash cloud │
│                                                     │
│  Gemini Live API (real-time voice)                  │
│  ├── Speech-to-speech conversation                  │
│  ├── Function calling: [TOOL:next_chapter] etc.     │
│  └── Voice = Bertrand clone (CosyVoice) or default  │
└──────────────────┬──────────────────────────────────┘
                   │
OUTPUT LAYER:
┌──────────────────▼──────────────────────────────────┐
│  Bose Open-Ear Speakers (Aura frame)                │
│  │                                                  │
│  ├── SpatialSoundPool (positional audio)            │
│  │   ├── Pothole tones → from fretboard positions   │
│  │   ├── Metronome click → from fixed spatial point │
│  │   └── Pling reward → from correct pothole        │
│  │                                                  │
│  ├── MediaPlayer + SoundFieldAttributes             │
│  │   └── Ambisonic environment (Zen/Studio/Stage)   │
│  │                                                  │
│  ├── AudioTrack (direct synthesis)                  │
│  │   └── Generative drone → from fretboard center   │
│  │                                                  │
│  └── TTS Pipeline                                   │
│      ├── Pre-cached Kokoro audio (chapter content)  │
│      ├── Gemini Live voice (real-time coaching)     │
│      └── Android TTS (fallback)                     │
└─────────────────────────────────────────────────────┘
```

### Audio Latency Budget

| Path | Target | Current | Notes |
|---|---|---|---|
| Guitar → Pitch detect → Pothole light | <50ms | ~20ms (Oboe) | Oboe exclusive mode gives <20ms input. Renderer adds ~16ms (120Hz). |
| Guitar → Pitch detect → Pling sound | <80ms | ~20ms + SoundPool | SoundPool has ~10-20ms startup. Total ~40ms. |
| Voice → Gemini Live → TTS response | <500ms | Unknown | Depends on network. On-device Nano faster but limited. |
| Breath state change → UI update | <200ms | ~300ms | Amplitude windowing adds latency. Acceptable for somatic feedback. |
| Drone start → audible | <100ms | ~3s (fade in) | Intentional slow fade. Could be faster for user-initiated. |

---

## Part 5: The Audio Feature Maturation Map

### Phase 1 Audio — First Sound (Dev Kit → Month 2)

- [ ] Oboe pitch detection verified on Aura 4-mic array
- [ ] Calibrate YIN threshold for Aura mic pickup pattern
- [ ] Pothole pling via `SoundPool` (non-spatial first)
- [ ] Android TTS reads chapter title (fallback quality)
- [ ] Verify: can user hear real guitar + app audio simultaneously?

### Phase 2 Audio — Spatial Sound (Month 3 → 4)

- [ ] Port drone engine to Kotlin (AudioTrack real-time synthesis)
- [ ] Drone root shifted to C3 (131Hz) for open-ear speaker response
- [ ] `SpatialSoundPool.play()` — pothole tones from 3D positions
- [ ] `SpatialMediaPlayer` — drone from fretboard anchor entity
- [ ] Metronome click from fixed spatial position (virtual shelf)
- [ ] LFO breathing modulation on drone (0.1Hz, same as Web Audio version)
- [ ] Verify: does the student hear the G-to-B pothole as a spatial discontinuity?

### Phase 3 Audio — Bertrand's Voice (Month 5 → 6)

- [ ] Pre-generate all 12 chapters' BE phase content as Kokoro/CosyVoice audio
- [ ] Cache audio files on device (assets folder)
- [ ] Play BE phase audio via `MediaPlayer` (non-spatial, centered)
- [ ] DO phase: reference tones from target pothole positions
- [ ] PLAY phase: ambisonic environment (Studio ambience, 1st order AmbiX)
- [ ] Verify: does Bertrand's voice sound natural through Bose speakers?

### Phase 4 Audio — Truebadour Speaks (Month 7 → 8)

- [ ] Gemini Live API integration for real-time voice conversation
- [ ] Beamforming on 4-mic array to isolate voice from guitar
- [ ] Function calling: voice commands navigate chapters, toggle drone, start/stop metronome
- [ ] Context injection: "Student just played {note} at {cents} cents. Breath state: {state}. Chapter: {n}."
- [ ] Gemini Nano on-device fallback (ML Kit GenAI Prompt API)
- [ ] Verify: can student have a 30-second voice conversation while holding guitar, hands-free?

### Phase 5 Audio — Somatic Sound (Month 9 → 10)

- [ ] Spectral breath detection (not just amplitude — detect breath noise spectrum)
- [ ] Drone pulse synchronized to detected breathing rhythm
- [ ] Tension sonification: hand tracking jitter → subtle dissonance in drone
- [ ] Silent Protocol audio verification: 3x clean, pitch detection confirms each
- [ ] Beat frequency visualization: when student is out of tune, audible beating between guitar and drone
- [ ] Verify: can the student hear when they're in tune (beating stops) with eyes closed?

### Phase 6 Audio — Performance Space (Month 11 → 12)

- [ ] AI backing band: generative bass + drums + chord pads in key of current chapter
- [ ] Each backing instrument positioned in 3D space (bass left, drums behind, chords right)
- [ ] Recording: 4-mic array capture + pitch detection data + hand tracking data
- [ ] AI pre-screen: Gemini analyzes recording, flags timestamps for Bertrand
- [ ] Bertrand feedback: recorded as audio, played back spatially (as if he's in the room)
- [ ] Ambisonic environments: Zen Garden (BE), Studio (DO), Stage (PLAY) — 3rd order AmbiX
- [ ] Verify: does the full BE → DO → PLAY → Record → Review cycle work end-to-end?

---

## Part 6: The Sound Design Philosophy

### What Each Sound Must Do

| Sound | Pedagogical Purpose | Design Principle |
|---|---|---|
| **Drone** | Train intonation by providing a reference pitch that the student matches | Warm, continuous, never distracting. Triangle wave with slow LFO. Should feel like a room, not a speaker. |
| **Pothole pling** | Reward correct note identification | Bright but short. Should feel like a bell, not a buzzer. Triangle wave, 0.8s decay. Never harsh. |
| **Reference tone** | Provide target pitch for ear training | Pure sine wave, 2s sustain. Should feel like a tuning fork, not a synth. |
| **Metronome click** | Provide tempo framework | Square wave, 50ms. Downbeat 880Hz, off-beat 440Hz. Should feel like a woodblock, not a beep. |
| **TTS (Bertrand)** | Deliver pedagogical content in the teacher's voice | Pre-generated, high quality. Cadence must match Bertrand's actual speaking rhythm. Pauses at musical phrase boundaries. |
| **Truebadour (Gemini Live)** | Real-time coaching conversation | Natural conversational latency. Must not interrupt student's playing. Should pause when guitar audio is detected (ducking). |
| **Ambisonic environment** | Set the emotional context for BE/DO/PLAY | Subtle, never foreground. Zen Garden = water + wind. Studio = quiet room tone. Stage = ambient crowd murmur. |
| **Backing band** | Provide musical context for PLAY mode | Generative, adaptive to student's tempo. Should feel like musicians listening and responding, not a fixed track. |

### The Golden Rule

**Every sound the app produces must make the student a better listener.** If a sound teaches dependency (student can't play without it), it's wrong. If a sound trains the ear (student hears the skill internally after enough repetitions), it's right.

This is Bertrand's pedagogy encoded as audio design:

- The drone trains intonation → eventually the student hears the beating internally
- The reference tone trains audiation → eventually the student hears the pitch before playing
- The metronome trains rhythm → eventually the student feels the pulse internally
- The TTS trains vocabulary → eventually the student coaches themselves
- The spatial audio trains harmonic geometry → eventually the student hears intervals as spatial relationships

**The app is a hearing aid. Not for the deaf — for the untrained ear.**

---

## Part 7: The Google Play Store Audio Strategy

### Android XR Audio Feature Checklist (for Play Store featuring)

| Feature | Status | Priority |
|---|---|---|
| `SpatialMediaPlayer` + `PointSourceParams` | Not implemented | High — Phase 2 |
| `SpatialSoundPool` | Not implemented | High — Phase 2 |
| `SoundFieldAttributes` (ambisonics) | Not implemented | Medium — Phase 3 |
| Oboe low-latency input | Implemented, untested | High — Phase 1 |
| `AudioAttributes` with `CONTENT_TYPE_MUSIC` | Not set | High — Phase 1 |
| `spatialCapabilities` check | Not implemented | High — Phase 1 |
| Gemini Live API | Not implemented | High — Phase 4 |
| ML Kit GenAI (Gemini Nano) | Not implemented | High — Phase 4 |
| Dolby Atmos support | Not applicable | N/A |
| 4-mic beamforming | Not implemented | Medium — Phase 4 |

### The Play Store Pitch

> **Voix Vive XR** is the first guitar pedagogy app built for Android XR. It uses the XREAL Aura's 4-microphone array for real-time pitch detection, Bose-tuned open-ear speakers for simultaneous guitar + app audio, and Android XR's spatial audio engine to render Pythagorean harmonic ratios as 3D sound. Every note on the fretboard emits from its physical position in space. The generative drone engine produces Pythagorean interval ratios that the student matches by ear. Gemini Nano provides on-device AI coaching in the teacher's voice, hands-free, offline. The app trains the ear to hear what the eye sees — and eventually to hear without seeing at all.

---

*This document is the audio layer of the XR Maturation Map. It should be read alongside `XR_MATURATION_MAP.md` for the full picture.*
