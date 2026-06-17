# Voix Vive — API Reference

Complete API documentation for hooks, components, and utilities.

---

## Table of Contents

1. [Hooks](#hooks)
2. [Components](#components)
3. [Context Providers](#context-providers)
4. [Utilities](#utilities)
5. [Types](#types)

---

## Hooks

### useBackendBridge

Central hook for backend communication. Routes to LM Studio (primary) → DaaS (fallback).

```typescript
import { useBackendBridge } from './hooks/useBackendBridge';

function MyComponent() {
  const {
    isDaaSConnected,      // boolean - DaaS server status
    isLMStudioConnected,  // boolean - LM Studio status
    activeBackend,        // 'lmstudio' | 'daas' | null
    lmStudioModel,        // ModelInfo | null
    askBertrand,          // (messages, options?) => Promise<Response>
    checkLMStudio,        // () => Promise<ConnectionStatus>
    refreshConnection,    // () => Promise<boolean>
    // ... database methods
  } = useBackendBridge();
}
```

**Parameters for askBertrand:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `messages` | `Message[]` | required | Array of chat messages |
| `options.temperature` | `number` | 0.7 | Sampling temperature |
| `options.max_tokens` | `number` | 4096 | Max response tokens |
| `options.maxContext` | `number` | 32768 | Context window size |
| `options.gpuLayers` | `number` | 999 | GPU offload layers |
| `options.stream` | `boolean` | false | Enable streaming |

**Returns:**
```typescript
{
  choices: [{
    message: {
      role: 'assistant',
      content: string
    }
  }]
}
```

---

### useLMStudio

Direct LM Studio integration hook. Use when you need full control over the AI.

```typescript
import { useLMStudio } from './hooks/useLMStudio';

function MyComponent() {
  const {
    isReady,              // boolean - connection status
    isLoading,            // boolean - request in progress
    error,                // string | null
    modelInfo,            // ModelInfo | null
    checkConnection,      // (baseUrl?) => Promise<Status>
    chatCompletion,     // (messages, options?) => Promise<Response>
    chatCompletionStream, // (messages, onChunk, options?) => Promise<Response>
    cancelRequest,      // () => void
  } = useLMStudio();
}
```

**chatCompletionStream Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `messages` | `Message[]` | Chat messages |
| `onChunk` | `(chunk, full) => void` | Callback for each chunk |
| `options.temperature` | `number` | Sampling temp |
| `options.max_tokens` | `number` | Max tokens |
| `options.maxContext` | `number` | Context size |
| `options.gpuLayers` | `number` | GPU layers |

---

### useLocale

Internationalization hook for English/French support.

```typescript
import { useLocale } from './hooks/useLocale';

function MyComponent() {
  const {
    locale,     // 'en' | 'fr'
    setLocale,  // (locale) => void
    t,          // (key) => string - translation function
    toggleLocale, // () => void
  } = useLocale();
  
  return <h1>{t('welcome')}</h1>;
}
```

**Translation File Structure:**
```javascript
// data/translations.js
export const translations = {
  en: {
    welcome: 'Welcome to Voix Vive',
    // ...
  },
  fr: {
    welcome: 'Bienvenue à Voix Vive',
    // ...
  }
};
```

---

### usePitchDetector

Real-time pitch detection from microphone input.

```typescript
import { usePitchDetector } from './hooks/usePitchDetector';

function MyComponent() {
  const {
    isListening,        // boolean
    pitch,             // number (Hz) | null
    note,              // string | null (e.g., "A4")
    cents,             // number (-50 to +50)
    error,             // string | null
    startListening,    // () => Promise<void>
    stopListening,     // () => void
  } = usePitchDetector({
    onPitchDetected: (pitch, note, cents) => {
      console.log(`Detected: ${note} (${cents} cents)`);
    }
  });
}
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onPitchDetected` | `function` | undefined | Callback on pitch detection |
| `minPitch` | `number` | 80 | Minimum detectable pitch (Hz) |
| `maxPitch` | `number` | 1000 | Maximum detectable pitch (Hz) |
| `threshold` | `number` | 0.1 | Detection threshold |

---

### useFlashTimer

Timer hook for "flash" exercises (visualization training).

```typescript
import { useFlashTimer } from './hooks/useFlashTimer';

function MyComponent() {
  const {
    timeLeft,          // number (seconds)
    isRunning,         // boolean
    isComplete,        // boolean
    progress,          // number (0-1)
    start,            // (duration) => void
    pause,            // () => void
    resume,           // () => void
    reset,            // () => void
  } = useFlashTimer();
}
```

---

## Components

### AIDeveloperChat

Full-page chat interface for AI-powered code modification.

```jsx
import AIDeveloperChat from './components/AIDeveloperChat';

<Route path="/ai-developer" element={<AIDeveloperChat />} />
```

**Features:**
- Natural language code requests
- Real-time streaming responses
- Pending approval queue sidebar
- Tool execution history
- Connection status monitoring

---

### VertiscaleEngine

Main practice game engine. Combines visualization, pitch detection, and scoring.

```jsx
import { VertiscaleEngine } from './game/VertiscaleEngine';

<VertiscaleEngine 
  mode="flash" | "imagine"
  fretId={5}
  onComplete={(score) => console.log(score)}
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `mode` | `'flash' \| 'imagine'` | Yes | Game mode |
| `fretId` | `number` | No | Starting fret (1-12) |
| `onComplete` | `(score) => void` | No | Completion callback |
| `onProgress` | `(progress) => void` | No | Progress callback |

---

### SongwritingCompanion

AI-powered songwriting assistant (Troubadour's Quill).

```jsx
import SongwritingCompanion from './components/SongwritingCompanion';

<SongwritingCompanion />
```

**Features:**
- Mood selection (6 presets)
- Custom theme input
- Context-aware lyrics (reads practice data)
- Save to songbook
- Edit generated lyrics

---

### FretboardExplorer

Interactive 14-fret guitar neck with scale overlays.

```jsx
import FretboardExplorer from './components/FretboardExplorer';

<FretboardExplorer
  showCAGED={true}
  scale="pentatonic"
  rootNote="C"
  onNoteClick={(note) => console.log(note)}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showCAGED` | `boolean` | false | Show CAGED system overlays |
| `scale` | `string` | null | Scale pattern name |
| `rootNote` | `string` | 'C' | Root note for scales |
| `onNoteClick` | `function` | null | Note click handler |

---

### BreathingGate

Somatic breathing exercise component.

```jsx
import BreathingGate from './components/BreathingGate';

<BreathingGate
  duration={120}  // seconds
  onComplete={() => console.log('Done')}
/>
```

---

### DigitalBinder

Student practice log and submission hub.

```jsx
import DigitalBinder from './components/DigitalBinder';

<DigitalBinder 
  studentId="student-123"
  showTools={true}
/>
```

---

## Context Providers

### ScaffoldingProvider

Global state provider for user progress, locale, and preferences.

```jsx
import { ScaffoldingProvider } from './components/ScaffoldingProvider';

<ScaffoldingProvider>
  <App />
</ScaffoldingProvider>
```

**Provides via useScaffolding():**

```typescript
interface ScaffoldingContext {
  // Locale
  locale: 'en' | 'fr';
  setLocale: (locale) => void;
  
  // Progress
  traction: TractionState;
  bardLevel: number;
  florins: number;
  
  // Stats
  practiceMinutes: number;
  streak: number;
  breathingSessions: number;
  
  // Audio
  audioMuted: boolean;
  toggleAudio: () => void;
  
  // Actions
  completeFret: (fretId, score) => void;
  earnFlorins: (amount) => void;
  logPractice: (minutes) => void;
}
```

---

## Utilities

### Audio Engine

```typescript
import { 
  initAudio, 
  playTone, 
  stopTone,
  setMasterVolume 
} from './audio/audioEngine';

// Initialize
await initAudio();

// Play a note
playTone('A4', 0.5);  // frequency or note name, duration

// Set volume
setMasterVolume(0.8);
```

### Local Database (Dexie)

```typescript
import { db } from './data/localDatabase';

// Add a journal entry
await db.journals.add({
  profileId: 1,
  date: new Date().toISOString(),
  fretId: 5,
  content: 'Practice notes...',
  mood: 'focused'
});

// Query entries
const recent = await db.journals
  .where('profileId')
  .equals(1)
  .reverse()
  .limit(10)
  .toArray();
```

**Database Schema:**

| Store | Schema | Description |
|-------|--------|-------------|
| `profiles` | `++id, name` | Student profiles |
| `sessions` | `++id, profileId, date` | Practice sessions |
| `journals` | `++id, profileId, date` | Journal entries |
| `songs` | `++id, profileId, title` | Saved songs |
| `logs` | `++id, student_name, timestamp` | Sync logs |
| `recordings` | `++id, profileId, createdAt` | Audio recordings |

---

## Types

### Core Types

```typescript
// User
interface User {
  id: string;
  name: string;
  email?: string;
  bardLevel: number;
  florins: number;
  createdAt: string;
}

// Fret Progress
interface FretProgress {
  traction: number;      // 0-100
  pitchAccuracy: number; // 0-100
  completionDate?: string;
  stars: number;        // 0-3
  attempts: number;
  bestScore: number;
}

// Chat
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  temperature?: number;
  max_tokens?: number;
  maxContext?: number;
  gpuLayers?: number;
  stream?: boolean;
}

// Curriculum
interface Chapter {
  id: number;
  title: { en: string; fr: string };
  heroStage: { en: string; fr: string };
  interval: { en: string; fr: string };
  coreMessage: { en: string; fr: string };
  slides: Slide[];
}

interface Slide {
  id: string;
  type: 'text' | 'image' | 'reflection' | 'practice';
  content: any;
}
```

---

## MCP Server API

### Endpoints

**Health Check**
```
GET /health
Response: { status: 'ok', requireApproval: true }
```

**List Tools**
```
GET /mcp/tools/list
Response: { tools: { [name]: ToolDefinition } }
```

**Call Tool**
```
POST /mcp/tools/call
Body: { name: string, parameters: object }
Response: { success: boolean, result: any }
```

**Chat with Context**
```
POST /chat
Body: { messages: Message[], tools?: string[] }
Response: ChatCompletion
```

**Pending Approvals**
```
GET /pending
Response: { pending: ApprovalRequest[] }
```

**Approve/Reject**
```
POST /approve/:id
POST /reject/:id
Response: { success: boolean }
```

### Tool Definitions

**read_file**
```typescript
{
  path: string;       // Relative path from project root
  offset?: number;    // Starting line
  limit?: number;     // Max lines to read
}
```

**edit_file**
```typescript
{
  path: string;
  old_string: string;  // Exact text to replace
  new_string: string;  // Replacement text
  description?: string;
}
```

**search_code**
```typescript
{
  query: string;
  path?: string;       // Subdirectory
  extensions?: string[]; // ['.js', '.jsx']
}
```

**run_command**
```typescript
{
  command: string;     // Whitelisted command
  cwd?: string;        // Working directory
}
```

---

## Error Handling

### Hook Error Patterns

```typescript
// All hooks follow this pattern:
const { error, isLoading, data } = useSomeHook();

if (isLoading) return <Loading />;
if (error) return <Error message={error} />;
return <Content data={data} />;
```

### Error Types

| Error | Cause | Resolution |
|-------|-------|------------|
| `LM Studio not connected` | Server not running | Start LM Studio, enable server |
| `Path outside project root` | Security violation | Use relative paths only |
| `Command not allowed` | Unsafe command | Use whitelisted commands |
| `No model loaded` | LM Studio has no model | Load Qwen Coder in LM Studio |
| `Microphone permission denied` | Browser blocked | Grant permission in browser |

---

**Maintained by:** Voix Vive Development Team  
**Last Updated:** 2026-05-25
