# Voix Vive — Architecture Flows & Data Management

Detailed documentation of data flows, state management patterns, and component interactions.

---

## Table of Contents

1. [Data Flow Overview](#1-data-flow-overview)
2. [State Management Architecture](#2-state-management-architecture)
3. [Component Communication Patterns](#3-component-communication-patterns)
4. [AI Integration Flow](#4-ai-integration-flow)
5. [Audio Processing Pipeline](#5-audio-processing-pipeline)
6. [Game State Machine](#6-game-state-machine)
7. [Database Operations](#7-database-operations)
8. [Build & Deployment Pipeline](#8-build--deployment-pipeline)

---

## 1. Data Flow Overview

### 1.1 High-Level Data Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        DATA LAYERS                              │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   UI State   │  │  App State   │  │   Server     │         │
│  │  (useState)  │  │  (Context)   │  │   (API)      │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                 │                 │
│         └─────────────────┴─────────────────┘                   │
│                           │                                    │
│                    ┌──────▼──────┐                           │
│                    │  IndexedDB  │  ← Single source of truth │
│                    │  (Client)   │                            │
│                    └──────┬──────┘                           │
│                           │                                    │
│              ┌────────────┼────────────┐                      │
│              ▼            ▼            ▼                       │
│        ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│        │ Session │  │  User   │  │  Sync   │                 │
│        │  Data   │  │  Data   │  │  Queue  │                 │
│        └─────────┘  └─────────┘  └─────────┘                 │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### 1.2 Data Flow Principles

1. **Single Source of Truth:** IndexedDB is the primary data store
2. **Optimistic Updates:** UI updates immediately, syncs in background
3. **Offline-First:** All features work without network
4. **Conflict Resolution:** Last-write-wins with timestamps
5. **Event-Driven:** State changes propagate via Context

---

## 2. State Management Architecture

### 2.1 State Categories

| Category | Scope | Persistence | Example |
|----------|-------|-------------|---------|
| **UI State** | Component | None | Modal open/closed |
| **Session State** | Multiple components | Session storage | Current exercise |
| **App State** | Global | IndexedDB | User progress |
| **Server State** | Global | IndexedDB + Server | Sync queue |

### 2.2 ScaffoldingProvider State Tree

```
ScaffoldingProvider
├── LocaleState
│   ├── locale: 'en' | 'fr'
│   └── setLocale: (locale) => void
│
├── ProgressState
│   ├── traction: {
│   │   ├── frets: {
│   │   │   ├── [1]: { traction, pitchAccuracy, stars, completionDate }
│   │   │   ├── [2]: { ... }
│   │   │   └── ... (12 frets)
│   │   │   }
│   │   └── overall: number
│   │   }
│   ├── bardLevel: number
│   └── florins: number
│
├── StatsState
│   ├── practiceMinutes: number
│   ├── streak: number
│   ├── lastPracticeDate: ISOString
│   └── breathingSessions: number
│
├── AudioState
│   ├── audioMuted: boolean
│   └── masterVolume: number
│
└── Actions
    ├── completeFret(fretId, score)
    ├── earnFlorins(amount)
    ├── spendFlorins(amount)
    ├── logPractice(minutes)
    └── toggleAudio()
```

### 2.3 State Update Flow

```
User Action
    │
    ▼
┌─────────────┐
│   Action    │ (e.g., completeFret)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Reducer   │ ← Updates state immutably
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Context   │ ← Notifies subscribers
└──────┬──────┘
       │
       ├──────────────┐
       ▼              ▼
┌────────────┐  ┌────────────┐
│   React    │  │  IndexedDB │
│ Re-render  │  │   Persist  │
└────────────┘  └────────────┘
       │
       ▼
┌────────────┐
│ Background │ ← Sync to server (if online)
│    Sync    │
└────────────┘
```

### 2.4 State Persistence Example

```javascript
// When user completes a fret
function completeFret(fretId, score) {
  // 1. Update local state immediately
  dispatch({
    type: 'COMPLETE_FRET',
    payload: { fretId, score, timestamp: Date.now() }
  });
  
  // 2. Persist to IndexedDB
  db.sessions.add({
    fretId,
    score,
    duration: score.timeSpent,
    timestamp: new Date().toISOString(),
  });
  
  // 3. Queue for server sync
  syncQueue.push({
    type: 'SESSION_COMPLETE',
    data: { fretId, score },
    timestamp: Date.now(),
  });
  
  // 4. Check for level up
  if (shouldLevelUp(getState())) {
    dispatch({ type: 'LEVEL_UP' });
  }
}
```

---

## 3. Component Communication Patterns

### 3.1 Prop Drilling vs Context

**Use Props for:**
- Presentational components
- 1-2 levels deep
- Static configuration

**Use Context for:**
- Global state (locale, user)
- Deep component trees
- Frequently accessed data

### 3.2 Custom Event System

For decoupled component communication:

```javascript
// Event Bus for game events
const gameEvents = new EventTarget();

// Publishing
function onPitchDetected(pitch) {
  gameEvents.dispatchEvent(new CustomEvent('pitch:detected', {
    detail: { pitch, note, cents }
  }));
}

// Subscribing
useEffect(() => {
  const handler = (e) => {
    const { pitch, note, cents } = e.detail;
    updateOrbPosition(cents);
  };
  
  gameEvents.addEventListener('pitch:detected', handler);
  return () => gameEvents.removeEventListener('pitch:detected', handler);
}, []);
```

### 3.3 Hook-Based Communication

```javascript
// Custom hook for shared game state
function useGameSession() {
  const [session, setSession] = useState(null);
  
  const startSession = useCallback((config) => {
    const session = createSession(config);
    setSession(session);
    return session;
  }, []);
  
  const endSession = useCallback((score) => {
    if (session) {
      session.complete(score);
      saveSession(session);
      setSession(null);
    }
  }, [session]);
  
  return { session, startSession, endSession };
}
```

---

## 4. AI Integration Flow

### 4.1 AI Request Lifecycle

```
User Request
    │
    ▼
┌─────────────────┐
│  AIDeveloperChat │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ useBackendBridge │ ← Routes to available AI
└────────┬────────┘
         │
         ├──────────────────┐
         ▼                  ▼
┌────────────────┐  ┌────────────────┐
│   LM Studio    │  │  DaaS Server   │
│  (Port 1234)   │  │  (Port 8080)   │
└────────┬───────┘  └────────┬───────┘
         │                    │
         └────────┬───────────┘
                  ▼
┌─────────────────────────────┐
│      Qwen Coder 32B         │
│   (Local GPU Inference)     │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│        AI Decision          │
│  ┌─────────────────────┐     │
│  │ Tool needed? ──Yes──┼─────┼──▶ MCP Server
│  │                     │     │    (Port 3001)
│  │ No ────────────────┼──────▶ Direct response
│  └─────────────────────┘     │
└─────────────────────────────┘
              │
              ▼
┌─────────────────────────────┐
│      Response to User       │
└─────────────────────────────┘
```

### 4.2 MCP Tool Execution Flow

```
AI Decides to Edit File
    │
    ▼
┌─────────────────┐
│   MCP Request   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Server.js     │
│  edit_file tool │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Approval Check │
└────────┬────────┘
         │
         ├───────▶ Yes ───▶ Execute Edit
         │                        │
         │                        ▼
         │              ┌─────────────────┐
         │              │  Create Backup  │
         │              │  Apply Changes  │
         │              │  Git Commit     │
         │              └─────────────────┘
         │
         └───────▶ No ────▶ Queue for Approval
                                   │
                                   ▼
                         ┌─────────────────┐
                         │  AIDeveloperChat │
                         │  Approval UI    │
                         └─────────────────┘
```

### 4.3 Streaming Response Flow

```javascript
// For real-time AI responses
async function streamResponse(messages, onChunk) {
  const response = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      messages, 
      stream: true  // Enable streaming
    }),
  });
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        const content = data.choices[0].delta.content || '';
        fullContent += content;
        onChunk(content, fullContent);  // Update UI
      }
    }
  }
  
  return fullContent;
}
```

---

## 5. Audio Processing Pipeline

### 5.1 Real-Time Audio Chain

```
Microphone Input
      │
      ▼
┌─────────────────┐
│ MediaStream API │ ← getUserMedia()
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ AudioContext    │ ← Web Audio API
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ AnalyserNode    │ ← FFT analysis
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Buffer (2048)  │ ← Sample data
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│   Pitch Detection       │
│  ┌─────────────────┐    │
│  │ Autocorrelation │    │
│  │ Peak Detection  │    │
│  │ Frequency Calc  │    │
│  └─────────────────┘    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│   Note Conversion       │
│  ┌─────────────────┐    │
│  │ Hz to MIDI    │    │
│  │ MIDI to Name  │    │
│  │ Cents Calc    │    │
│  └─────────────────┘    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│   Event Dispatch        │
│   (pitch:detected)      │
└─────────────────────────┘
```

### 5.2 Audio Performance Optimization

```javascript
// Optimized audio loop
class AudioProcessor {
  constructor() {
    this.bufferSize = 2048;
    this.analyser = null;
    this.isProcessing = false;
  }
  
  async init() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioContext = new AudioContext({ sampleRate: 44100 });
    
    const source = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = this.bufferSize;
    
    source.connect(this.analyser);
    // Don't connect to destination (no feedback)
    
    this.process();
  }
  
  process() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    
    const buffer = new Float32Array(this.analyser.fftSize);
    
    const loop = () => {
      if (!this.analyser) return;
      
      this.analyser.getFloatTimeDomainData(buffer);
      const pitch = this.detectPitch(buffer);
      
      if (pitch) {
        dispatchEvent(new CustomEvent('pitch', { detail: pitch }));
      }
      
      requestAnimationFrame(loop);
    };
    
    loop();
  }
  
  detectPitch(buffer) {
    // Autocorrelation algorithm
    const threshold = 0.1;
    const maxSamples = Math.floor(buffer.length / 2);
    let bestOffset = -1;
    let bestCorrelation = 0;
    
    for (let offset = 0; offset < maxSamples; offset++) {
      let correlation = 0;
      
      for (let i = 0; i < maxSamples; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + offset]);
      }
      
      if (correlation < bestCorrelation || bestCorrelation === 0) {
        bestCorrelation = correlation;
        bestOffset = offset;
      }
    }
    
    if (bestCorrelation > threshold) {
      const frequency = this.audioContext.sampleRate / bestOffset;
      return frequency;
    }
    
    return null;
  }
}
```

---

## 6. Game State Machine

### 6.1 Vertiscale Engine States

```
┌───────────────────────────────────────────────────────┐
│                  GAME STATES                        │
├───────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────┐                                          │
│  │  IDLE   │◀─────────────────────────────────┐      │
│  └────┬────┘                                  │      │
│       │ start()                                │      │
│       ▼                                         │      │
│  ┌─────────────┐    success()   ┌──────────┐    │      │
│  │  COUNTDOWN  │───────────────▶│ FLASHING │    │      │
│  └─────────────┘                └────┬─────┘    │      │
│       │ cancel()                     │          │      │
│       ▼                    pitch_hit() │          │      │
│  ┌─────────────┐                     │          │      │
│  │  COMPLETE   │◀────────────────────┘          │      │
│  └─────────────┘                                 │      │
│       │                                           │      │
│       ▼                                           │      │
│  ┌─────────────┐                                  │      │
│  │   SCORE     │─────────restart()───────────────┘      │
│  │   SCREEN    │                                       │
│  └─────────────┘                                       │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### 6.2 State Transitions

| Current State | Event | Next State | Action |
|---------------|-------|------------|--------|
| `IDLE` | `start()` | `COUNTDOWN` | Start 3-2-1 countdown |
| `COUNTDOWN` | `countdown_complete` | `FLASHING` | Show fret flash |
| `FLASHING` | `pitch_hit` | `FEEDBACK` | Show accuracy |
| `FEEDBACK` | `continue` | `FLASHING` | Next fret |
| `FLASHING` | `session_complete` | `COMPLETE` | Calculate score |
| `COMPLETE` | `show_scores` | `SCORE_SCREEN` | Display results |
| `SCORE_SCREEN` | `restart()` | `IDLE` | Reset and wait |
| Any | `cancel()` | `IDLE` | Abort session |

### 6.3 Score Calculation

```javascript
function calculateScore(session) {
  const metrics = {
    accuracy: session.hits.filter(h => h.cents < 10).length / session.hits.length,
    speed: Math.min(1, session.targetNotes / session.totalTime),
    consistency: 1 - (standardDeviation(session.hits.map(h => h.cents)) / 50),
    completion: session.notesHit / session.targetNotes,
  };
  
  const weightedScore = 
    metrics.accuracy * 0.4 +
    metrics.speed * 0.2 +
    metrics.consistency * 0.2 +
    metrics.completion * 0.2;
  
  return {
    raw: weightedScore * 100,
    stars: Math.floor(weightedScore * 3),
    traction: Math.min(100, session.fret.traction + (weightedScore * 10)),
  };
}
```

---

## 7. Database Operations

### 7.1 CRUD Patterns

```javascript
// CREATE
async function createJournalEntry(entry) {
  const id = await db.journals.add({
    ...entry,
    createdAt: new Date().toISOString(),
  });
  
  // Optimistic UI update
  dispatch({ type: 'ADD_JOURNAL', payload: { id, ...entry } });
  
  return id;
}

// READ
async function getJournalEntries(profileId, limit = 10) {
  return await db.journals
    .where('profileId')
    .equals(profileId)
    .reverse()
    .limit(limit)
    .toArray();
}

// UPDATE
async function updateJournalEntry(id, updates) {
  await db.journals.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  
  dispatch({ type: 'UPDATE_JOURNAL', payload: { id, ...updates } });
}

// DELETE
async function deleteJournalEntry(id) {
  await db.journals.delete(id);
  dispatch({ type: 'DELETE_JOURNAL', payload: { id } });
}
```

### 7.2 Complex Queries

```javascript
// Get practice stats for date range
async function getPracticeStats(startDate, endDate) {
  return await db.sessions
    .where('date')
    .between(startDate, endDate)
    .toArray()
    .then(sessions => ({
      totalMinutes: sessions.reduce((sum, s) => sum + s.duration, 0),
      sessionsCount: sessions.length,
      averageScore: sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length,
      fretsPracticed: [...new Set(sessions.map(s => s.fretId))],
    }));
}

// Get streak calculation
async function calculateStreak(profileId) {
  const sessions = await db.sessions
    .where({ profileId })
    .reverse()
    .toArray();
  
  let streak = 0;
  let lastDate = new Date();
  
  for (const session of sessions) {
    const sessionDate = new Date(session.date);
    const diffDays = Math.floor((lastDate - sessionDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      streak++;
      lastDate = sessionDate;
    } else {
      break;
    }
  }
  
  return streak;
}
```

### 7.3 Data Migration

```javascript
// Database versioning with Dexie
const db = new Dexie('VoixViveDB');

// Version 1
 db.version(1).stores({
   profiles: '++id, name',
   sessions: '++id, profileId, date',
 });

// Version 2 - Add journals
 db.version(2).stores({
   journals: '++id, profileId, date, fretId',
 }).upgrade(tx => {
   // Migration logic
   return tx.table('profiles').toCollection().modify(profile => {
     profile.bardLevel = profile.bardLevel || 1;
   });
 });

// Version 3 - Add songs
 db.version(3).stores({
   songs: '++id, profileId, title, createdAt',
 });
```

---

## 8. Build & Deployment Pipeline

### 8.1 Development Workflow

```
Developer
    │
    ▼
┌─────────────────┐
│  Local Changes  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  npm run dev    │  ← Vite HMR server
│  (localhost)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Test Changes   │
│  Browser +      │
│  DevTools       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  git commit     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  git push       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  GitHub         │
│  (Trigger CI)   │
└─────────────────┘
```

### 8.2 CI/CD Pipeline

```
Git Push to Main
      │
      ▼
┌─────────────────┐
│  GitHub Actions │
│  (CI Triggered) │
└────────┬────────┘
         │
         ├──────────┐
         │          │
         ▼          ▼
┌─────────────────┐  ┌─────────────────┐
│  Build Test     │  │  Lint Check     │
│  npm run build  │  │  npm run lint   │
└────────┬────────┘  └────────┬────────┘
         │                   │
         └─────────┬─────────┘
                   │
                   ▼
         ┌─────────────────┐
         │  All Passed?      │
         └────────┬────────┘
                  │
         ┌────────┴────────┐
         ▼                 ▼
┌─────────────────┐  ┌─────────────────┐
│  Yes            │  │  No             │
│  Deploy to      │  │  Fail Build     │
│  Vercel         │  │  Notify Dev     │
└─────────────────┘  └─────────────────┘
```

### 8.3 Deployment Configurations

**Vercel (Production):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm ci",
  "env": {
    "VITE_API_BASE": "https://api.voix-vive.com"
  }
}
```

**Tauri (Desktop):**
```json
{
  "build": {
    "beforeBuildCommand": "npm run build",
    "beforeDevCommand": "npm run dev",
    "frontendDist": "../dist"
  },
  "bundle": {
    "active": true,
    "targets": ["deb", "msi", "dmg"],
    "identifier": "com.voixvive.app"
  }
}
```

---

## Appendix: Event Reference

### Global Events

| Event Name | Payload | Description |
|------------|---------|-------------|
| `pitch:detected` | `{ pitch, note, cents }` | Real-time pitch detection |
| `fret:complete` | `{ fretId, score }` | Fret exercise completed |
| `level:up` | `{ oldLevel, newLevel }` | User leveled up |
| `session:start` | `{ sessionId, config }` | Practice session started |
| `session:end` | `{ sessionId, duration }` | Practice session ended |
| `audio:mute` | `{ muted }` | Audio muted/unmuted |
| `locale:change` | `{ locale }` | Language changed |

### Custom Hooks Events

| Hook | Events |
|------|--------|
| `usePitchDetector` | `pitch:detected`, `pitch:started`, `pitch:stopped` |
| `useFlashTimer` | `timer:complete`, `timer:tick` |
| `useGameSession` | `session:start`, `session:end`, `session:score` |

---

**Document maintained by:** Voix Vive Development Team  
**Last Updated:** 2026-05-25
