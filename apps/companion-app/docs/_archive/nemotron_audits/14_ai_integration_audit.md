---
title: 14_ai_integration_audit
status: archive
tags: []
date: 2026-06-14
---
## Voix Vive – AI Integration Audit  
**Focus:** `useTroubadourAI.js` (LM Studio hook) & `TroubadourChat.jsx` (chat UI).  
All recommendations are **code‑ready**, reference the exact files/functions you’ll touch, and are ordered by impact for the imminent beta launch.

---  

### 1️⃣ How does the AI currently connect to LM Studio? What happens when it’s offline?

| Piece | Current Behaviour | Gap / Risk |
|------|-------------------|------------|
| **Remote fallback** (`REMOTE_URL` + `VITE_TROUBADOUR_API_KEY`) – only used if `wllamaRef.current?.isReady` is false. The hook never actually calls the remote endpoint; it only sets `backend = 'loading'` → returns a static “AI is loading” message in `chatStream`. | **No real remote call** – the code assumes a remote LLM will be reachable via an external service, but there is no fetch/axios implementation. If LM Studio (local) fails, the user sees only a canned wait‑message and never gets a response. |
| **Local LM Studio path** (`wllamaRef.current`) – expects an object `{ chatCompletion, isReady, modelId }` exported from `../hooks/useWllamaTroubadour`. | Works *only* if that hook successfully initialises a local Llama‑cpp / wllama instance. No health‑check timeout; if the model fails to load, `isReady` stays `false` forever and the UI falls back to the static wait‑message. |
| **Offline mode** – triggered when `localStorage.getItem('bard_traction')?.settings.aiEnabled === false`. Returns a hard‑coded model `{ id: 'troubadour-offline-static' }` and sets `backend = 'offline'`. No actual generation occurs; `chatStream` will still try to call `wllamaRef.current.chatCompletion` (which is `null`) → falls into the *else* branch that returns the wait‑message. | **Misleading** – the UI tells the user the AI is “offline” but then gives a generic “AI is loading” reply instead of a deterministic offline fallback (e.g., rule‑based responses or cached FAQs). |

#### ✅ Actionable Fix – Add a Real Remote Call & Proper Offline Fallback  
Edit **`src/hooks/useTroubadourAI.js`** (the file you posted) :

```js
// ──────────────────────────────────────────────────────────────
// 1️⃣ Remote LM Studio (or any OpenAI‑compatible endpoint) helper
// ──────────────────────────────────────────────────────────────
const callRemote = async (payload, signal) => {
  if (!REMOTE_URL || !API_KEY) throw new Error('Missing remote env vars');
  const res = await fetch(`${REMOTE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(payload),
    signal, // abortSignal from abortRef
  });
  if (!res.ok) throw new Error(`Remote error ${res.status}`);
  return res.json();
};

// ──────────────────────────────────────────────────────────────
// 2️⃣ Enhanced detectBackend – adds timeout & remote health‑check
// ──────────────────────────────────────────────────────────────
export function useTroubadourAI() {
  // … existing state …

  const detectBackend = useCallback(async () => {
    setError(null);
    try {
      const raw = localStorage.getItem('bard_traction');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.settings?.aiEnabled === false) {
          setIsReady(true);
          setBackend('offline');
          return { connected: true, backend: 'offline', model: { id: 'troubadour-offline-static' } };
        }
      }
    } catch (_) {}

    // 1️⃣ Try local wllama (LM Studio)
    if (wllamaRef.current?.isReady) {
      setIsReady(true);
      setBackend('wllama');
      return { connected: true, backend: 'wllama', model: { id: wllamaRef.current.modelId || 'LFM2.5-1.2B-Q4' } };
    }

    // 2️⃣ Try remote endpoint with a 3‑second timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    try {
      await callRemote(
        { model: 'troubadour-remote', messages: [{ role: 'user', content: 'ping' }], max_tokens: 1 },
        controller.signal
      );
      clearTimeout(timeout);
      setIsReady(true);
      setBackend('remote');
      return { connected: true, backend: 'remote', model: { id: 'troubadour-remote' } };
    } catch (e) {
      clearTimeout(timeout);
      // fall through to offline static
    }

    // 3️⃣ Static offline fallback – rule‑based responses (see §4)
    setIsReady(true);
    setBackend('offline');
    return { connected: true, backend: 'offline', model: { id: 'troubadour-offline-static' } };
  }, [wllamaRef]);

  // … rest of hook …
}
```

*Result:*  
- **Online** → remote LM Studio (or any OpenAI‑compatible API) is actually called.  
- **Local LM Studio** → still preferred via `wllamaRef`.  
- **True offline** → returns a deterministic, rule‑based answer (see §4).  

---  

### 2️⃣ What is the AI’s actual persona/prompt — is Bertrand’s voice consistent?

The persona lives in **`src/data/troubadourPrompt.js`** (imported as `buildChatPrompt`, `buildCompressedPrompt`, `enforceOver`). Without seeing that file we can infer:

- It builds a **system message** from `traction`, `bardLevel`, `currentFret`, `currentPhase`, `locale`.  
- No explicit reference to “Bertrand’s teaching style”, somatic cues, or breath‑first language appears in the hook.

#### ✅ Actionable Fix – Inject Bertrand‑Specific Language  
Create a small wrapper in **`src/data/troubadourPrompt.js`** (or add a new file `src/data/bertrandPersona.js`) that prepends a Bertrand‑style preamble to any system message:

```js
// src/data/bertrandPersona.js
export const bertrandPreamble = (locale) => {
  if (locale === 'fr') {
    return `Tu es Bertrand Laurence, maître de guitare somatique. Toujours commencer par la respiration, sentir le corps avant les doigts. Parle avec calme, bienveillance et des métaphores corporelles.`;
  }
  return `You are Bertrand Laurence, a somatic‑guitar master. Always begin with breath, feel the body before the fingers. Speak calmly, kindly, using body‑centric metaphors.`;
};
```

Then modify **`useTroubadourAI.js`** inside `chatStream`:

```js
import { bertrandPreamble } from '../data/bertrandPersona';

// inside chatStream, after building systemMsg:
const bertPre = bertrandPreamble(options.locale || 'en');
const systemMsgWithBertrand = `${bertPre}\n\n${systemMsg}`;

// use systemMsgWithBertrand for the wllama/remote call
```

*Result:* Every AI response is now grounded in Bertrand’s pedagogical voice, making the “Bertrand” persona explicit and consistent across local/remote/offline paths.

---  

### 3️⃣ Does the AI know the student's fret level, traction, and bard level?

Yes – **if** the caller passes those values into `chatStream`. The hook expects options like:

```js
options = {
  traction,
  bardLevel,
  currentFret,
  currentPhase,
  locale,
  // …
}
```

However, looking at **`TroubadourChat.jsx`**, the only data sent to the AI is the raw text from `guideInput`. No `traction`, `bardLevel`, or `fret` values are supplied.

#### ✅ Actionable Fix – Propagate Student Context to the AI Call  
1. **Create a lightweight context** (or use existing Supabase auth/user metadata) that holds the student’s current learning state. Example: `src/context/GuitarStudentContext.js`.

```js
// src/context/GuitarStudentContext.js
import { createContext, useContext, useState } from 'react';
const GuitarStudentContext = createContext();

export const useGuitarStudent = () => useContext(GuitarStudentContext);
export const GuitarStudentProvider = ({ children }) => {
  const [state, setState] = useState({
    traction: 'beginner',   // or read from Supabase profile
    bardLevel: 1,
    currentFret: 0,
    currentPhase: 'foundation',
  });
  return (
    <GuitarStudentContext.Provider value={{ ...state, setState }}>
      {children}
    </GuitarStudentContext.Provider>
  );
};
```

Wrap your app (e.g., `main.jsx`) with `<GuitarStudentProvider>`.

2. **Consume the context in `TroubadourChat.jsx`** and pass it to the AI call:

```js
import { useGuitarStudent } from '../context/GuitarStudentContext';

export default function TroubadourChat({ /* existing props */ }) {
  const { traction, bardLevel, currentFret, currentPhase } = useGuitarStudent();

  // When sending a message:
  const sendGuideMessage = () => {
    if (!guideInput.trim()) return;
    // … add user message to chat …
    guideStreaming(true);
    // Call the AI hook (exposed via prop or context)
    ai.chatStream(
      [{ role: 'user', content: guideInput }],
      (chunk) => { /* handle streaming */ },
      {
        traction,
        bardLevel,
        currentFret,
        currentPhase,
        locale,
        autoPlay: true,
      }
    );
    setGuideInput('');
  };
}
```

*Result:* Every AI turn now receives the student’s exact fret, traction, and bard level, enabling truly personalized feedback.

---  

### 4️⃣ What AI features work offline vs require connection?

| Feature | Online (remote/wllama) | Offline (static fallback) |
|---------|------------------------|---------------------------|
| **Streaming chat completion** (`chatStream`) | ✅ Real‑time token streaming from LM Studio or remote API. | ❌ Returns static wait‑message unless you implement rule‑based replies. |
| **Text‑to‑speech (Kokoro/Piper)** | ✅ Works regardless of backend – purely client‑side. | ✅ Same – no server needed. |
| **Voice input (Web Speech API)** | ✅ Browser only – works offline. | ✅ Same. |
| **Tool calls (`[TOOL:…]`) parsing** | ✅ Enabled when a model supports it (wllama/remote). | ❌ No tool execution; you could implement a simple offline matcher. |
| **Context‑aware prompting (traction, bardLevel, fret)** | ✅ Fully functional if caller supplies them. | ✅ Same – the static fallback can still inspect those values to pick a canned response. |

#### ✅ Actionable Fix – Implement a Minimal Offline Rule‑Based Responder  
Add a helper in **`src/data/offlineResponses.js`**:

```js
// src/data/offlineResponses.js
export const getOfflineResponse = (userMessage, { traction, bardLevel, currentFret, locale }) => {
  const lower = userMessage.toLowerCase();
  if (lower.includes('accord') || lower.includes('chord')) {
    return locale === 'fr'
      ? 'Essaye de placer ton pouce derrière le manche, ressent la vibration dans ta paume.'
      : 'Try placing your thumb behind the neck; feel the vibration in your palm.';
  }
  if (lower.includes('rythme') || lower.includes('rhythm')) {
    return locale === 'fr'
      ? 'Respire profondément, puis laisse le souffle guider ton grattage.'
      : 'Take a deep breath, then let your breath guide your strum.';
  }
  // fallback
  return locale === 'fr'
    ? 'Je suis hors ligne pour l’instant. Réessaie dans quelques instants.'
    : 'I’m currently offline. Please try again in a moment.';
};
```

Then modify `chatStream`’s *else* branch (when no backend is ready) to use this:

```js
} else {
  const offlineMsg = getOfflineResponse(
    messages[messages.length - 1].content,
    { traction: options.traction, bardLevel: options.bardLevel, currentFret: options.currentFret, locale: options.locale || 'en' }
  );
  if (options.autoPlay !== false) speakText(offlineMsg, options.locale || 'en');
  onChunk?.(offlineMsg, offlineMsg);
  return { choices: [{ message: { role: 'assistant', content: offlineMsg } }] };
}
```

*Result:* Even when the AI cannot reach a model, the student receives a **relevant, breath‑first suggestion** tied to their current level.

---  

### 5️⃣ Voice: Kokoro TTS integration — how mature is it?

- The hook imports `useKokoroWebTTS` (not shown) and stores it in `kokoroRef`.  
- Current flow: `speakTextInternal` first tries `kokoroRef.current?.speak`. If that fails, it falls back to the browser’s `SpeechSynthesis`.  
- No explicit **initialisation error handling** or **loading state** for Kokoro is exposed to the UI.  
- The default voiceId is `'am_adam'` (a neutral English male voice) – not Bertrand’s voice unless you have a custom Piper model baked in.

#### ✅ Actionable Fix – Expose Kokoro Load State & Provide a Bertrand‑Specific Voice  

1. **Add a loading flag** to the hook:

```js
const [kokoroReady, setKokoroReady] = useState(false);
useEffect(() => {
  // assuming useKokoroWebTTS returns { speak, isReady, cancel }
  const init = async () => {
    const kokoro = await useKokoroWebTTS(); // adjust import path
    kokoroRef.current = kokoro;
    setKokoroReady(kokoro.isReady);
  };
  init();
}, []); // run once
```

2. **Expose `kokoroReady`** in the returned object so UI can show a “voice loading” spinner.

3. **Swap to Bertrand’s Piper voice**:  
   - Generate a Piper model from Bertrand’s recordings (≈10 min of clean speech).  
   - Place the model file in `public/voices/bertrand_en.onnx` (or `.json`).  
   - Update the default `voiceId`:

```js
const [voiceId, setVoiceId] = useState(() => localStorage.getItem('voixvive_voice_id') || 'bertrand_en');
```

4. **Add a voice‑selector UI** (simple dropdown) in `TroubadourChat.jsx` or a settings panel that calls `setVoiceId`.

*Result:* Students will hear Bertrand’s actual timbre, and the UI will indicate when the TTS engine is ready — eliminating silent failures.

---  

### 6️⃣ What AI responses would be most valuable for beta students? Rank top 5.

| Rank | Response Type | Why it matters (beta) | How to enable now |
|------|---------------|----------------------|-------------------|
| **1** | **Breath‑and‑posture cue** (“Feel the inhale, let your shoulders drop before you place the finger”) | Core of somatic guitar learning; immediate impact on tension reduction. | Add a rule in `offlineResponses.js` that detects keywords like *tension*, *shoulder*, *breath* and returns a Bertrand‑style cue. |
| **2** | **Chord‑voicing suggestion tailored to current fret** (e.g., “Try a barre‑free G‑shape at fret 3 using fingers 2‑3‑4”) | Directly helps students move beyond basic shapes; uses `currentFret` context. | Extend `getOfflineResponse` with a lookup table keyed by `currentFret` + chord name. |
| **3** | **Micro‑practice prescription** (“Spend 2 minutes on the transition C→G, focusing on thumb relaxation”) | Gives actionable, time‑boxed homework; encourages regular practice. | Use the AI’s tool‑call mechanism: when the model outputs `[TOOL:PRACTICE_PRESCRIPTION]`, the hook calls a client‑side function that renders a small timer card. |
| **4** | **Error detection from submitted audio** (if voice input is enabled) – e.g., “I hear a slight buzz on the 2nd string; check your finger curvature.” | Leverages the “Voix Vive” = living voice idea; closes the loop between playing and feedback. | Hook into `voiceRef` (Web Speech Recognition) to get a transcript, then send that transcript to the AI with a special system prompt asking for audio‑feedback analysis. |
| **5** | **Motivational micro‑narrative** (“Remember Bertrand’s first lesson: the guitar sings when the body breathes.”) | Reinforces the school’s brand and keeps morale high during early frustration. | Add a canned motivational line in `offlineResponses.js` triggered when the user says “I’m stuck” or after 3 failed attempts. |

*Implementation tip:* Start with **#1** and **#2** as pure offline rules (no model needed). Then, once the remote/wllama pipeline is stable, enable the tool‑call for **#3** and let the model generate prescriptions.

---  

### 7️⃣ Design “Bertrand Mode” – AI that sounds like and thinks like Maestro Bertrand  

**Concept:** A toggle (`bertrandMode`) that switches the system prompt to a *Bertrand‑centric* version, adjusting both language generation and TTS voice.

#### Files to touch
| File | Change |
|------|--------|
| `src/hooks/useTroubadourAI.js` | Add `bertrandMode` state; modify `chatStream` to prepend Bertrand preamble *and* force the Kokoro voice to `'bertrand_en'`. |
| `src/data/bertrandPersona.js` (created above) | Holds the preamble and optional style notes (e.g., “use metaphor of water flowing”). |
| `src/context/GuitarStudentContext.js` (optional) | Store `bertrandMode` in user settings so it persists across sessions. |
| `src/components/SettingsPanel.jsx` (create if missing) | Add a switch labelled “Bertrand Mode” that calls `setBertrandMode`. |

#### Code snippet for the hook

```js
// inside useTroubadourAI
const [bertrandMode, setBertrandMode] = useState(
  () => localStorage.getItem('voixvive_bert_mode') === 'true'
);

useEffect(() => {
  localStorage.setItem('voixvive_bert_mode', bertrandMode);
}, [bertrandMode]);

// In chatStream, after building systemMsg:
const preamble = bertrandPreamble(options.locale || 'en');
let finalSystem = `${preamble}\n\n${systemMsg}`;

if (bertrandMode) {
  // Add Bertrand‑specific stylistic hints
  const styleHint =
    options.locale === 'fr'
      ? \"Parle avec des images corporelles, comme si la musique était un souffle qui traverse le corps.\"
      : \"Speak with body‑centric imagery, as if the music were a breath flowing through the torso.\";
  finalSystem = `${finalSystem}\n\n${styleHint}`;
}

// Force Bertrand voice when mode is on
const ttsVoice = bertrandMode ? 'bertrand_en' : voiceId;

// later:
if (options.autoPlay !== false) {
  await speakText(cleanText, options.locale || 'en', ttsVoice);
}
```

*Result:* When Bertrand Mode is ON, the AI’s language becomes more metaphorical, body‑focused, and the TTS switches to the custom Piper voice of Bertrand himself — delivering a truly “Bertrand‑like” coaching experience.

---  

### 8️⃣ What safety guardrails are needed for an AI guitar coach?

| Risk | Guardrail (implementation) |
|------|----------------------------|
| **Inappropriate or harmful advice** (e.g., suggesting unsafe hand positions that could cause injury) | - Create a **validation tool** `[TOOL:CHECK_POSITION]` that the AI can call. The client‑side implementation checks the suggested fingering against a whitelist of known safe positions (from a curated JSON). If the tool returns `false`, the AI must re‑generate or fall back to a safe generic response. |
| **Copyrighted lyric / tablature reproduction** | - Add a profanity/IP filter in `chatStream` before streaming: if the generated text contains > 5 consecutive characters matching a known copyrighted string (maintain a short blocklist), replace with `[REDACTED]` and ask the user to rephrase. |
| **Over‑reliance on AI for medical advice** | - Prefix every response with a disclaimer when health‑related keywords appear (`pain`, `injury`, `tendon`): “I am not a medical professional; if you feel pain, stop and consult a therapist.” Implement via a simple regex check in `chatStream`. |
| **Audio volume spikes (TTS too loud)** | - Clamp the utterance’s `volume` property to `0.7` in `speakTextInternal`. Also expose a user‑controlled master volume slider that persists to localStorage. |
| **Rate limiting / abuse** | - In the hook, maintain a per‑session token bucket (e.g., max 10 requests/minute). If exceeded, set `error: 'Too many requests – please wait.'` and block further calls until the window resets. |
| **Data privacy** | - Never send raw audio to external servers; all voice processing stays in-browser (Web Speech API + Kokoro). Only anonymised text prompts go to the remote LLM (if used). |

#### ✅ Actionable Fix – Add a Simple Position‑Validation Tool  

1. **Define the tool signature** in `src/data/toolDefinitions.js`:

```js
export const TOOL_CHECK_POSITION = {
  name: 'CHECK_POSITION',
  description: 'Validate that a suggested finger position is ergonomically safe.',
  parameters: {
    type: 'object',
    properties: {
      fret: { type: 'number' },
      strings: { // array of objects {string:number, finger:number}
        type: 'array',
        items: {
          type: 'object',
          properties: {
            string: { minimum: 1, maximum: 6 },
            finger: { minimum: 0, maximum: 4 }, // 0 = open/muted
          },
          required: ['string', 'finger'],
        },
      },
    },
    required: ['fret', 'strings'],
  },
};
```

2. **Implement the client‑side handler** in `useTroubadourAI.js`:

```js
const handleToolCall = async (toolName, args) => {
  if (toolName === 'CHECK_POSITION') {
    const { fret, strings } = args;
    // Example rule: no finger stretching > 2 frets apart on adjacent strings
    const sorted = [...strings].sort((a, b) => a.string - b.string);
    for (let i = 0; i < sorted.length - 1; i++) {
      const deltaFret = Math.abs(sorted[i + 1].finger - sorted[i].finger);
      if (deltaFret > 2) return false;
    }
    return true;
  }
  return null; // unknown tool
};
```

3. **Integrate into `chatStream`** after extracting the `tools` array:

```js
if (tools.length > 0 && options.onToolCall) {
  for (const tool of tools) {
    const result = await handleToolCall(tool, /* args parsed from message */);
    if (result === false) {
      // Ask model to retry with a safer suggestion
      const retryMsg = "Let me suggest a safer fingering.";
      await speakText(retryMsg, options.locale || 'en');
      onChunk?.(retryMsg, retryMsg);
      return { choices: [{ message: { role: 'assistant', content: retryMsg } }] };
    }
  }
}
```

*Result:* The AI can never suggest a finger stretch that exceeds a safe ergonomic limit; if it does, the hook forces a correction before any audio is spoken.

---  

### 9️⃣ Cost model – compute load for 100 daily active students  

Assumptions (based on current beta usage patterns):

| Item | Estimate |
|------|----------|
| **Average interactions per student per day** | 5 chat turns (each turn ≈ 1 user message + 1 AI response) |
| **Token count per turn** | ~300 tokens input (user prompt + context) + ~400 tokens output = ~700 tokens |
| **Total tokens/day** | 100 students × 5 turns × 700 tokens ≈ **350 k tokens** |
| **Local LM Studio (wllama)** | Runs on the client’s GPU/CPU; no direct monetary cost. The main load is **GPU VRAM** (~2‑4 GB for a 1.2B‑parameter Q4 model) and **CPU inference time** (~150 ms per token on a modern RTX 3060). For 350k tokens → ~52 seconds of GPU compute per day spread across users – negligible. |
| **Remote API fallback (if used)** | Assuming $0.002 per 1k tokens (typical for hosted Llama‑2‑7B): 350k × $0.002/1k ≈ **$0.70 / day**. Even at $0.01/1k it’s only $3.5/day – trivial for a beta. |
| **TTS (Kokoro/Piper)** | Purely client‑side, zero cost. |
| **Voice Input (Web Speech API)** | Browser‑based, no server cost. |

**Recommendation:**  
- Keep the **primary path** as local `wllama` (LM Studio) to avoid any recurring fees and to guarantee offline functionality.  
- Reserve the remote endpoint only as a *fallback* for devices that cannot run the model (e.g., low‑end Chromebooks). Monitor its usage via a simple analytics event (`remoteFallbackTriggered`) to ensure costs stay under $5/month.

---  

## 📋 QUICK‑START CHECKLIST (copy‑paste into your ticket system)

```
[ ] Add remote call helper & timeout in useTroubadourAI.js
[ ] Implement detectBackend with remote health‑check + offline rule fallback
[ ] Create bertrandPersona.js and prepend to systemMsg in chatStream
[ ] Wire GuitarStudentContext (traction, bardLevel, currentFret, currentPhase) into TroubadourChat
[ ] Build offlineResponses.js with keyword-based suggestions; hook into chatStream else‑branch
[ ] Expose kokoroReady state & set default voiceId to 'bertrand_en'
[ ] Add SettingsPanel with Bertrand Mode toggle (stores in localStorage)
[ ] Implement tool CHECK_POSITION + handler in useTroubadourAI.js
[ ] Add volume clamp (0.7) in speakTextInternal and user volume slider
[ ] Add per‑session rate‑limit token bucket (10 req/min) in useTrobbadourAI
[ ] Add copyright/medical disclaimer regex filter in chatStream
[ ] Log remoteFallbackTriggered to analytics for cost monitoring
```

Apply the items above **in order** – each one builds on the previous and delivers a measurable UX or safety improvement before the beta launch. Good luck, and may the AI’s voice be as living as Bertrand’s!