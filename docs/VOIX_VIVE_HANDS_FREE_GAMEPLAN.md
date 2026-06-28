# Voix Vive — Hands-Free & C Scale Class Game Plan
> **Created:** 2026-06-28
> **Goal:** Make the app usable 100% by voice — student props phone, holds guitar, never touches the screen.

---

## 1. Current State — What We Have

### Voice Infrastructure (3 separate systems, not unified)

| System | File | What It Does | Status |
|---|---|---|---|
| `useVoiceNav.js` | Continuous STT + TTS | Always-on speech recognition, command matching (next/prev/play/stop/ask/menu/practice/read/help/close) | ✅ Works, but NOT wired into CScaleHub |
| `useHandsFreeCoach.js` | VAD-gated STT + TTS | Energy-based voice activity detection → STT → command → TTS response | ✅ Works (fixed this session), wired into CScaleHub via HandsFreeCoachBar |
| `TruebadourProvider.jsx` | Kokoro TTS + AI chat | Neural TTS (Kokoro 82M) + AI backend detection (Gemini Nano → WebGPU → Cloud) | ✅ Works, but not connected to hands-free coach |

### The Problem: Three Disconnected Voice Systems

```
useVoiceNav.js     → NOT used in CScaleHub (orphaned)
useHandsFreeCoach  → Uses Web Speech API TTS (robotic voice)
TruebadourProvider → Has Kokoro neural TTS (Bertrand's voice)
                     ↑ NOT connected to hands-free coach
```

**The hands-free coach speaks with the browser's robotic voice, not Bertrand's voice.** The `ttsSpeak` prop passed to `useHandsFreeCoach` does connect to `TruebadourProvider.speak`, but only if Kokoro is loaded. If Kokoro isn't loaded, it falls back to Web Speech API.

### C Scale Class Content

| Component | Status |
|---|---|
| 12 chapters with deepDive, practiceTips, commonMistakes, practicePlan | ✅ Done this session |
| Audio snippets (12/12 MP3s) | ✅ Done this session |
| ChapterContentPanel with collapsible sections | ✅ Done this session |
| "Hear Bertrand" button (audio + Web Speech fallback) | ✅ Done this session |
| Studio Resources (Bertrand's teaching aids) | ✅ Done this session |
| Protocols (Silent, Gimme a Buzz, Finger-style) | ✅ Done this session |
| Back button navigation | ✅ Done this session |
| Hands-free bug fix (stale closures, timeout) | ✅ Done this session |

### TTS Pipeline (4 layers, partially connected)

| Layer | Engine | Quality | Status |
|---|---|---|---|
| 1. Pre-recorded MP3s | ffmpeg flite (placeholder) / Bertrand real recordings | Best | ✅ 12 files exist |
| 2. Kokoro 82M (in-browser) | Neural TTS, WebGPU/WASM | Good | ✅ Installed, model at `local-models/models/kokoro` |
| 3. CosyVoice2 0.5B (server) | Zero-shot voice clone from Bertrand ref audio | Best (cloned) | ❌ Server broken (venv pip/SSL issues) |
| 4. Web Speech API | Browser built-in | Robot voice | ✅ Always available fallback |
| 5. StepAudio 2.5 TTS (cloud API) | Contextual TTS with voice cloning + emotion control | Best (cloud) | ❌ Not integrated (needs API key) |
| 6. StepAudio R1.1 33B (vLLM server) | Full conversational AI + voice | Best (local server) | ❌ Not running (needs GMKtek or Strix Halo) |

---

## 2. What's Broken / Missing

### A. Hands-Free Coach Gaps

1. **No "read" command** — The hands-free coach (`useHandsFreeCoach.js`) has commands: next, previous, repeat, slower, faster, play, help, stop. But NO "read" command to read chapter content aloud. The student can't hear the lesson text without tapping "Hear Bertrand."

2. **No "ask" / "summon mentor" command** — Can't summon the Truebadour AI by voice. The `help` command dispatches `voixvive:open_truebadour` but there's no dedicated "ask" command in the COMMANDS map.

3. **No "practice" command** — Can't enter practice mode by voice.

4. **No chapter content reading** — When you navigate to a chapter, nothing is read aloud. The student has to look at the screen.

5. **No "menu" / "home" command** — Can't navigate to dashboard by voice (the handlers have `menu` and `home` but the COMMANDS map in `useHandsFreeCoach.js` doesn't include them).

6. **TTS quality mismatch** — Hands-free coach uses Web Speech API robotic voice. Should use Kokoro (Bertrand's neural voice) when available.

7. **`useVoiceNav.js` is orphaned** — A more complete voice nav system exists but isn't used. It has `read`, `ask`, `menu`, `practice`, `close` commands that `useHandsFreeCoach` lacks.

### B. C Scale Class Gaps

1. **No auto-play on chapter entry** — When navigating to a chapter, the audio snippet doesn't auto-play. Student must press play.

2. **No progress tracking feedback** — `markComplete` was removed (unused). No voice feedback when a chapter is completed.

3. **No "what chapter am I on?" command** — Student can't ask where they are in the journey.

4. **No practice mode voice coach** — In practice mode, there's no voice guidance ("Now try the 5th fret...", "Great! Next exercise...").

### C. TTS / Bertrand Voice Gaps

1. **CosyVoice server broken** — Python venvs have pip/SSL issues. Model is downloaded, GPU works, but can't install dependencies.

2. **Kokoro ONNX runtime broken in Node** — `onnxruntime-node` has version mismatch (`VERS_1.24.3` not found). Can't generate audio files programmatically.

3. **No StepAudio 2.5 integration** — The cloud API has voice cloning with emotion control, contextual instructions, and streaming WebSocket. Not integrated.

4. **Audio files are flite placeholders** — The 12 MP3s we generated use ffmpeg's flite TTS (robotic voice). They need to be replaced with Bertrand's real voice (CosyVoice clone or StepAudio clone).

5. **No audio generation pipeline** — No script/tool to batch-generate Bertrand voice audio from text transcripts.

---

## 3. The Plan — 4 Tracks, Prioritized

### Track 1: Unify Hands-Free Voice System (2-3 hours)
**Goal:** One voice system that drives the entire UI by voice, using Bertrand's voice.

#### Step 1.1: Merge `useVoiceNav` commands into `useHandsFreeCoach` (30 min)
- Add missing commands to `useHandsFreeCoach.js` COMMANDS map:
  - `read` — reads current chapter content aloud
  - `ask` — summons Truebadour AI
  - `menu` / `home` — navigate to dashboard
  - `practice` — enter practice mode
  - `close` — exit practice mode
  - `record` — toggle pitch detector
  - `where` — "What chapter am I on?" (speaks chapter title + number)
- Delete or archive `useVoiceNav.js` (its functionality is absorbed)

#### Step 1.2: Wire Kokoro TTS as primary hands-free voice (30 min)
- In `HandsFreeCoachBar.jsx`, ensure `ttsSpeak` from `TruebadourProvider` is always passed
- In `useHandsFreeCoach.js`, the `speak` function already tries `ttsSpeak` first, then falls back to Web Speech API. Verify this works.
- Add auto-init: when hands-free mode starts, call `loadVoix()` to initialize Kokoro

#### Step 1.3: Add "read chapter" voice command (45 min)
- New `read` command handler in `CScaleHub.jsx`:
  - Reads `chapter.bePhase.title` + `chapter.bePhase.content` + `chapter.bePhase.action`
  - If audio snippet exists, play the MP3 instead of TTS
  - If no audio snippet, use Kokoro TTS (or Web Speech fallback)

#### Step 1.4: Add auto-speak on chapter navigation (30 min)
- When `activeStage` changes, auto-speak a brief intro:
  - "Chapter 3: The Major Third. The distance between do and mi."
  - Use Kokoro TTS (or play audio snippet if available)
- Only auto-speak if hands-free mode is active (don't surprise users)

#### Step 1.5: Add "where am I?" command (15 min)
- New `where` command:
  - "You are on Chapter 3 of 12: The Major Third. The distance between do and mi."

### Track 2: Bertrand Voice Audio Pipeline (2-3 hours)
**Goal:** Generate all 12 chapter audio snippets in Bertrand's cloned voice.

#### Step 2.1: Fix CosyVoice server OR pivot to StepAudio 2.5 API (1 hour)
**Option A: Fix CosyVoice** (if venv can be repaired)
- Create fresh venv: `python3 -m venv cosyvoice_fresh`
- Install deps: `pip install hyperpyyaml fastapi uvicorn torchaudio`
- Test server: `python server.py`
- If working, use it to generate all 12 audio files

**Option B: StepAudio 2.5 Cloud API** (recommended — faster, better quality)
- Sign up at platform.stepfun.ai
- Get API key
- Upload Bertrand's reference audio (`bertrand_ref_best.wav`)
- Use voice clone preview endpoint to generate audio
- StepAudio 2.5 supports: emotion control, speaking style, contextual instructions
- Cost: ~$0.05-0.10 per chapter (12 chapters = ~$1.20 total)

**Option C: F5-TTS** (already installed in venv)
- Try `f5_server.py` with the broken venv
- F5-TTS does zero-shot voice cloning from reference audio
- If venv works, generate audio files

#### Step 2.2: Write batch generation script (30 min)
- Create `scripts/generate_bertrand_audio.sh` (or `.py`)
- For each of the 12 chapters:
  - Read `bePhase.content` + `bePhase.action` from `cScaleCurriculum.js`
  - Send to TTS engine (CosyVoice server / StepAudio API / F5-TTS)
  - Save as `public/assets/audio/bertrand_[name].mp3`
- Include the 2 missing files (whole_step, vertical_geometry)

#### Step 2.3: Generate all 12 audio files (30 min)
- Run the batch script
- Verify all 12 files exist and sound like Bertrand
- Replace the flite placeholder files

#### Step 2.4: Generate practice coach audio snippets (1 hour)
- Write practice prompts for each chapter (encouragement, corrections):
  - "Great! Now try the 5th fret..."
  - "Listen for the unison..."
  - "Take a breath. Start when you're ready."
- Generate these as short MP3s (2-5 seconds each)
- Store in `public/assets/audio/coach/`

### Track 3: AI-Driven UI (2-3 hours)
**Goal:** The AI agent (Truebadour) can press buttons, navigate chapters, and control the UI on behalf of the student.

#### Step 3.1: Create voice command → UI action bridge (45 min)
- In `CScaleHub.jsx`, expose all UI actions as a single `voiceActions` object:
  ```js
  const voiceActions = {
    next: () => goToChapter(1),
    previous: () => goToChapter(-1),
    read: () => readChapterAloud(currentChapter),
    practice: () => setPracticeMode(true),
    close: () => setPracticeMode(false),
    play: () => startListening(),
    stop: () => stopListening(),
    resonance: () => setResonanceMode(!resonanceMode),
    ask: () => openTruebadour(),
    home: () => navigate('/dashboard'),
    where: () => speakChapterInfo(currentChapter),
    complete: () => markComplete(currentChapter.id),
  };
  ```
- Pass `voiceActions` as `handlers` to `HandsFreeCoachBar`

#### Step 3.2: Add Truebadour → UI control channel (45 min)
- When Truebadour AI responds, it can emit UI commands:
  - AI says "Let's try the next chapter" → dispatches `voixvive:navigate_next`
  - AI says "Start playing" → dispatches `voixvive:start_listening`
- Add event listeners in `CScaleHub.jsx` for AI-driven UI actions
- This lets the AI agent "press buttons" via voice

#### Step 3.3: Add chapter completion voice flow (30 min)
- When pitch detector matches target note for 3 seconds:
  - Auto-mark chapter complete
  - Bertrand's voice: "Excellent! You found the note. Shall we move to the next chapter?"
  - Student says "next" → navigates
  - Or student says "repeat" → stays

#### Step 3.4: Add practice mode voice coach (1 hour)
- In practice mode, periodic voice prompts:
  - "Take your time. Breathe."
  - "When you're ready, play the root note."
  - "Good! Now try the whole step."
- Use the practice coach audio snippets from Track 2
- Or use Kokoro TTS for dynamic prompts

### Track 4: StepAudio 2.5 Integration (Future — after ship)
**Goal:** Replace all TTS with StepAudio 2.5 for best quality.

#### Step 4.1: Add StepAudio 2.5 as TTS provider (2 hours)
- New hook: `useStepAudioTTS.js`
- API: `POST https://api.stepfun.ai/v1/audio/speech`
- Voice cloning: Upload Bertrand's reference, get `voice_id`
- Streaming: WebSocket for real-time conversation
- Emotion control: Use `instruction` field for teaching tone
- Fallback: Kokoro → Web Speech API

#### Step 4.2: Wire StepAudio into TruebadourProvider (30 min)
- Add as tier 1 TTS (above Kokoro)
- Auto-detect API key availability
- Fall back to Kokoro if no key / offline

#### Step 4.3: StepAudio R1.1 on GMKtek (Future)
- Use `setup-vllm-gmktek.sh` script (already written)
- Deploy StepAudio R1.1 33B on GMKtek EVO X2
- Full conversational AI with voice I/O
- WebSocket streaming via `audioStreamingService.js` (already built)

---

## 4. What We Can Do in the Next 4 Hours

### Hour 1: Unify Voice Commands
- [ ] Add missing commands to `useHandsFreeCoach.js` (read, ask, menu, practice, close, record, where)
- [ ] Wire all commands in `CScaleHub.jsx` voice handlers
- [ ] Add "read chapter" handler that plays audio or TTS
- [ ] Add "where am I?" handler

### Hour 2: Auto-Speak + Bertrand Voice
- [ ] Auto-speak chapter intro when navigating (if hands-free is active)
- [ ] Fix CosyVoice server OR set up StepAudio 2.5 API
- [ ] Generate 12 audio files in Bertrand's voice
- [ ] Replace flite placeholder files

### Hour 3: AI-Driven UI
- [ ] Expose all UI actions as voice commands
- [ ] Add Truebadour → UI event bridge
- [ ] Add chapter completion voice flow
- [ ] Add practice mode voice prompts

### Hour 4: Polish + Ship
- [ ] Test full hands-free flow: start → navigate → read → practice → complete → next
- [ ] Fix any bugs found during testing
- [ ] Run lint + build + tests
- [ ] Stage all files and commit

---

## 5. Architecture After This Plan

```
Student speaks
    ↓
useHandsFreeCoach (VAD + STT)
    ↓
Command matched (next, read, ask, practice, etc.)
    ↓
Handler executes in CScaleHub
    ↓
UI updates (chapter changes, practice mode opens, etc.)
    ↓
TTS responds in Bertrand's voice
    ↓
Kokoro 82M (in-browser) → Web Speech API (fallback)
    ↓
Future: StepAudio 2.5 (cloud) → CosyVoice (server) → Kokoro → Web Speech
```

### Voice Command Reference (After Unification)

| Command | EN Triggers | FR Triggers | Action |
|---|---|---|---|
| next | next, forward | suivant, avancer | Go to next chapter |
| previous | previous, back | précédent, reculer | Go to previous chapter |
| read | read, listen | lire, écouter | Read current chapter aloud |
| repeat | repeat, again | répète, recommence | Re-read current chapter |
| play | play, start | jouer, démarrer | Start pitch detector |
| stop | stop, pause | arrête, pause | Stop pitch detector + drone |
| practice | practice | pratiquer | Enter practice mode |
| close | close, exit | fermer, quitter | Exit practice mode |
| ask | ask, question | demander, question | Summon Truebadour AI |
| help | help, commands | aide, commandes | List available commands |
| where | where, status | où, statut | Speak current chapter info |
| menu | menu, home | menu, accueil | Navigate to dashboard |
| slower | slower, slow | lentement, ralenti | Slow down TTS |
| faster | faster, fast | vite, accélère | Speed up TTS |
| resonance | resonance, drone | résonance, drone | Toggle drone mode |
| complete | complete, done | terminé, fini | Mark chapter complete |

---

*This document is the hands-free implementation roadmap. Update after each session.*
