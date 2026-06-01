# StepAudio 2.5 Realtime Integration — Voix Vive
## Executive Summary & Actionable Roadmap

> **Date:** May 27, 2026
> **Source:** Comprehensive research report on StepAudio 2.5 technical architecture
> **Status:** Frontend phases 1-2 complete. Middleware phases 3-5 pending.

---

## I. What StepAudio 2.5 Is

End-to-end multimodal voice AI. Audio in → audio out. No ASR/LLM/TTS pipeline.

| Capability | Score / Spec | Voix Vive Application |
|-----------|-------------|----------------------|
| Latency | Ultra-low (Dual-Brain Architecture) | Real-time feedback during practice |
| Persona retention | Million-scale persona RLHF | Bernard de Ventadorn never breaks character |
| Paralinguistic comprehension | 82.18 benchmark | Detect frustration → redirect to Journal |
| Voice cloning | Custom voice ID support | Bertrand's voice as the Troubadour |
| Protocol | `wss://api.stepfun.com/v1/realtime` | WebSocket, binary + JSON frames |

---

## II. Architecture (3-Tier)

```
┌─────────────────┐     WebSocket      ┌──────────────────┐     WebSocket      ┌─────────────────┐
│  React Frontend │  ───────────────►  │  Java Middleware │  ───────────────►  │  StepFun API    │
│  (Browser)      │  ◄───────────────  │  (Port 8081)     │  ◄───────────────  │  (Cloud)        │
└─────────────────┘                    └──────────────────┘                    └─────────────────┘
       │                                       │
       │  MediaRecorder (100ms chunks)         │  Supabase REST (service role key)
       │  AudioContext playback                │  JWT auth validation
       │  Canvas waveform visualizer          │  Paralinguistic interceptor
```

**Security:** API key NEVER touches the browser. Stored in Java middleware env var only.

---

## III. Implementation Status

### ✅ DONE — Frontend (Phases 1-2)

| File | What | Status |
|------|------|--------|
| `@/lib/audioStreamingService.js` | WebSocket abstraction, MediaRecorder, AudioContext playback | ✅ |
| `@/components/AmbientPlayer.jsx` | Mic button in chat, voice connection status light, pulsing recording indicator | ✅ |
| `@/supabase/schema.sql` | `troubadour_audio_sessions` + `paralinguistic_events` tables + RLS | ✅ |

### ⏳ PENDING — Middleware (Phases 3-5)

| Component | Technology | Effort |
|-----------|-----------|--------|
| Jakarta WebSocket server | `javax.websocket` or Spring Boot | 1 day |
| Supabase JWT validation | `java-jwt` library | 2 hours |
| StepFun outbound client | `OkHttp` WebSocket or Jakarta `ClientEndpoint` | 4 hours |
| Bidirectional relay | ByteBuffer + JSON forwarding | 4 hours |
| Paralinguistic interceptor | JSON parsing + Supabase REST | 2 hours |

### ⏳ PENDING — Frontend Polish (Phases 6-8)

| Feature | Status |
|---------|--------|
| Waveform visualizer (Canvas) | ⏳ |
| Dynamic persona injection (fret-based) | ⏳ |
| Pedagogical routing (fatigue → Breathing Gate) | ⏳ |
| Telemetry persistence from middleware | ⏳ |

---

## IV. Java Middleware Scaffold

See `middleware/StepAudioMiddleware.java` (create when building)

Key classes:
- `TroubadourClientEndpoint` — `@ServerEndpoint("/ws/troubadour")`, inbound from React
- `StepAudioWebSocketClient` — `@ClientEndpoint`, outbound to StepFun
- `SupabaseClient` — REST wrapper for telemetry writes

---

## V. Next Actions

1. **Build Java middleware** on GMKtek EVO X2 or deploy to Vercel/Render
2. **Set env var** `STEP_API_KEY` on middleware server (never in frontend)
3. **Set env var** `VITE_STEP_MIDDLEWARE_URL=wss://your-server.com/ws/troubadour`
4. **Test voice mode** — Click mic in Troubadour widget, speak, verify audio playback
5. **Monitor paralinguistic events** — Check Supabase `paralinguistic_events` table

---

## VI. Fallback Chain (Preserves "No-AI" Guarantee)

```
1. StepAudio 2.5 (voice) → Java middleware → StepFun cloud
2. LM Studio (text) → localhost:1234 → local LLM
3. DaaS (text) → localhost:8080 → Joshua's Axum router
4. Static TROUBADOUR → offline → pre-written coaching cues
```

If ANY layer fails, the next layer activates automatically. The student never sees a broken experience.
