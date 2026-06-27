# Voix Vive — Hands-Free Practice Coach Plan

Approved: build a hands-free, audio-sensitive phone coach for the C Scale journey.

## Goal

A student props their phone nearby, holds their guitar, and practices hands-free. The phone:

1. Listens for voice commands.
2. Hears the guitar via pitch detection.
3. Speaks back with coaching instructions and feedback.
4. Requires no screen touches during the practice session.

## Phase 1 — Continuous Voice Loop (this session)

Build a continuous-listening mode inside the C Scale hub.

### What to build

- `useHandsFreeCoach.js` hook
  - Owns microphone stream.
  - Runs a simple VAD using Web Audio RMS energy.
  - When speech is detected, starts Web Speech API STT.
  - After 1.5 s of silence, stops STT and processes the command.
  - Speaks the response via TTS.
  - Auto-restarts listening after the response.

- `HandsFreeCoachBar.jsx` component
  - Replaces or extends `VoiceCommandBar` in the C Scale hub.
  - Shows: idle, listening, processing, speaking, error.
  - One button to toggle the mode on/off.
  - Large touch target for start/stop only.

- Commands (v1)
  - `next` / `suivant` — advance exercise.
  - `repeat` / `répète` — replay current target.
  - `slower` / `lentement` — reduce playback tempo.
  - `faster` / `vite` — increase playback tempo.
  - `help` / `aide` — list available commands.
  - `stop` / `arrête` — stop hands-free mode.

### VAD algorithm (v1)

Use Web Audio `AnalyserNode` with 2048 FFT size.

```
rms = sqrt(sum(samples^2) / n)
if rms > 0.03 → speech likely
if rms < 0.015 for 1.5 s → silence
```

This is a simple energy gate. It will mis-trigger on loud guitar, but it is a fast starting point.

## Phase 2 — Guitar-Aware Listening (next session)

- Run `usePitchDetector` continuously in the background.
- Use the pitch detector to know when the student is playing guitar.
- When guitar is detected, suppress voice STT to avoid false commands.
- When a stable pitch is held for > 0.5 s, compare it to the expected target note.
- TTS feedback: "That's C", "Try a little higher", "Perfect".

## Phase 3 — Context-Aware Coach (next session)

- Coach knows the current C Scale stage and target note.
- After the student plays the target note, the coach says the next target.
- If the student is stuck, they can say "help" and the coach explains the current exercise.
- State machine: idle → listening → processing → responding → idle.

## Phase 4 — Phone Hardware Integration (next session)

- Keep the screen on during hands-free practice.
- Vibrate on command recognition and on beat/tempo markers.
- Route audio to headset if connected; default to speaker if not.
- Handle audio focus (pause music when listening, resume after).

## Success criteria

- A student can complete a C Scale exercise using only voice and guitar.
- The phone responds within 1 s of a voice command.
- The phone gives pitch feedback within 1 s of playing a note.
- No crashes on Android or PWA Safari.

## Risks

- Web Speech API may not work in all Android WebViews. Fallback: Whisper Base ONNX.
- Simple VAD will confuse guitar and voice. Fix in Phase 2 with pitch-aware gating.
- TTS voice quality varies. Use Kokoro for better voice if needed.

## Files to create / modify

- `src/hooks/useHandsFreeCoach.js` (new)
- `src/components/handsfree/HandsFreeCoachBar.jsx` (new)
- `src/features/c-scale/BeDoExercise.jsx` (add hands-free toggle)
- `src/pages/CScaleHub.jsx` (integrate the bar)
- `src/hooks/usePitchDetector.js` (already exists, integrate)
- `src/audio/audioEngine.js` (share microphone stream)

## Testing flow

1. Open the app on the phone.
2. Navigate to C Scale hub.
3. Tap the hands-free coach button.
4. Say "next" — should advance.
5. Say "repeat" — should replay.
6. Play a C note — should get pitch feedback.
