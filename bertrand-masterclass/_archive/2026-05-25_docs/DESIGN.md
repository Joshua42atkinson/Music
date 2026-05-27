# VOIX VIVE — System Design Document

> **Version:** 2.0  
> **Last Updated:** 2026-05-25  
> **Architecture:** React SPA + Tauri Desktop + Local AI (LM Studio)  

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Frontend Architecture](#2-frontend-architecture)
3. [State Management](#3-state-management)
4. [Data Layer](#4-data-layer)
5. [AI Integration](#5-ai-integration)
6. [Audio Engine](#6-audio-engine)
7. [Game Systems](#7-game-systems)
8. [Component Library](#8-component-library)
9. [Build & Deployment](#9-build--deployment)
10. [Security](#10-security)

---

## 1. Architecture Overview

### 1.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Browser    │  │   Tauri      │  │   Desktop    │              │
│  │   (React)    │  │   (Rust)     │  │   (Electron) │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                 │                        │
│         └─────────────────┴─────────────────┘                        │
│                           │                                          │
│                    ┌──────▼──────┐                                 │
│                    │  IndexedDB  │  ← Local data persistence      │
│                    └──────┬──────┘                                 │
└───────────────────────────┼────────────────────────────────────────┘
                            │
┌───────────────────────────┼────────────────────────────────────────┐
│                        AI LAYER (Local)                              │
├───────────────────────────┼────────────────────────────────────────┤
│                           │                                        │
│     ┌─────────────────────┼─────────────────────┐                   │
│     │                     │                     │                   │
│     ▼                     ▼                     ▼                   │
│ ┌──────────┐       ┌──────────┐       ┌──────────┐                │
│ │ LM Studio│       │  DaaS    │       │ WebLLM   │                │
│ │ (Port    │       │ (Port    │       │ (Browser │                │
│ │  1234)   │       │  8080)   │       │  WASM)   │                │
│ └────┬─────┘       └────┬─────┘       └────┬─────┘                │
│      │                  │                  │                       │
│      └──────────────────┴──────────────────┘                       │
│                           │                                        │
│                    ┌──────▼──────┐                                 │
│                    │ MCP Server  │  ← Code modification tools    │
│                    │ (Port 3001) │                                 │
│                    └─────────────┘                                 │
└────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Vercel  │  │  Stripe  │  │  GitHub  │  │  Cloud   │              │
│  │  (CDN)   │  │ (Payment)│  │  (Repo)  │  │  (Auth)  │              │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + Vite | UI framework and build tool |
| **Routing** | React Router v7 | Client-side navigation |
| **Styling** | Tailwind CSS + Custom CSS | Utility-first + bespoke design |
| **Animation** | Framer Motion | Page transitions and micro-interactions |
| **Icons** | Lucide React | Consistent iconography |
| **State** | React Context + Custom Hooks | Component state management |
| **Storage** | IndexedDB (Dexie) | Client-side database |
| **Audio** | Web Audio API + WebRTC | Real-time pitch detection |
| **Desktop** | Tauri v2 | Rust-based desktop wrapper |
| **AI** | LM Studio / Ollama / WebLLM | Local LLM inference |
| **Deployment** | Vercel | Static site hosting |

### 1.3 File Organization

```
bertrand-masterclass/
├── src/
│   ├── components/          # React components
│   │   ├── playbook/         # Playbook-specific components
│   │   └── ...
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Route-level components
│   ├── game/                 # Game engine components
│   ├── data/                 # Static data and curriculum
│   ├── audio/                # Audio engine
│   └── utils/                # Utility functions
├── src-tauri/                # Tauri desktop app
├── mcp-server/               # AI code modification server
├── public/                   # Static assets
├── docs/                     # Documentation
└── dist/                     # Build output
```

---

## 2. Frontend Architecture

### 2.1 Component Architecture

#### Component Hierarchy

```
App
├── Router
│   ├── LandingScreen         # Marketing funnel entry
│   ├── OrientationHub        # "The Song" - curriculum reader
│   ├── VertiscaleEngine      # "The Guitar" - practice game
│   ├── MentorTools           # "The Player" - self-care tools
│   ├── PlaybookShell         # Progress tracking
│   ├── StudioPage            # Business/services
│   ├── AIDeveloperChat       # AI modification interface
│   └── ...
├── ScaffoldingProvider       # Global state
├── AmbientPlayer             # Background audio
└── HealthPulse               # Health check indicator
```

#### Component Categories

| Category | Components | Responsibility |
|----------|------------|----------------|
| **Layout** | `LandingScreen`, `OrientationHub`, `PlaybookShell` | Page structure |
| **Game** | `VertiscaleEngine`, `OrbEngine`, `PitchGateUI` | Interactive practice |
| **Tools** | `FretboardExplorer`, `BreathingGate`, `PlingTrainer` | Practice utilities |
| **AI** | `AIDeveloperChat`, `SongwritingCompanion`, `CoachingPortal` | AI-powered features |
| **Data** | `DigitalBinder`, `JournalEntry`, `QuestLog` | Progress tracking |
| **Audio** | `AmbientPlayer`, `PitchRoom`, `PracticeRecorder` | Audio functionality |
| **Business** | `StudioPage`, `PricingCard` | Revenue features |

### 2.2 Routing Structure

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `LandingScreen` | Marketing funnel entry |
| `/song` | `OrientationHub` | 12-chapter curriculum reader |
| `/guitar` | `VertiscaleEngine` | Practice game engine |
| `/player` | `MentorTools` | Self-care and recording |
| `/playbook` | `PlaybookShell` | Progress dashboard |
| `/studio` | `StudioPage` | Services and booking |
| `/ai-developer` | `AIDeveloperChat` | AI modification interface |
| `/privacy` | `PrivacyPolicy` | Legal page |
| `/terms` | `TermsOfService` | Legal page |

---

## 3. State Management

### 3.1 State Architecture

```
┌─────────────────────────────────────┐
│      ScaffoldingProvider            │
│   (React Context + useReducer)      │
├─────────────────────────────────────┤
│  • Locale (en/fr)                   │
│  • Traction (12-fret progress)       │
│  • Practice Stats (time, streak)    │
│  • User Profile                     │
│  • Audio State (muted/unmuted)      │
└─────────────────────────────────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
┌────────┐  ┌──────────┐
│ Hooks  │  │IndexedDB │
│(local) │  │(persist) │
└────────┘  └──────────┘
```

### 3.2 Data Flow Patterns

#### Global State (ScaffoldingProvider)
Used for:
- User preferences (locale, audio)
- Progress tracking (traction across all frets)
- Session state (current user, streak)

#### Component State (useState)
Used for:
- UI state (modals open/closed, tabs)
- Form inputs
- Temporary selections

#### Persisted State (IndexedDB)
Used for:
- Practice logs
- Journal entries
- Saved songs
- User profiles
- Recording metadata

### 3.3 Scaffolding State Shape

```typescript
interface ScaffoldingState {
  // Localization
  locale: 'en' | 'fr';
  
  // User progress
  traction: {
    frets: Record<number, {
      traction: number;        // 0-100
      pitchAccuracy: number;   // 0-100
      completionDate?: string;
      stars: number;          // 0-3
    }>;
    overall: number;          // Average traction
  };
  
  // Practice stats
  practiceMinutes: number;
  streak: number;
  lastPracticeDate: string;
  breathingSessions: number;
  
  // Gamification
  bardLevel: number;
  florins: number;
  
  // Audio
  audioMuted: boolean;
  masterVolume: number;
}
```

---

## 4. Data Layer

### 4.1 IndexedDB Schema (Dexie)

```javascript
const db = new Dexie('VoixViveDB');

db.version(1).stores({
  // User profiles (students)
  profiles: '++id, name, createdAt, bardLevel, florins',
  
  // Practice sessions
  sessions: '++id, profileId, date, duration, fretId, score',
  
  // Journal entries
  journals: '++id, profileId, date, fretId, content, mood',
  
  // Songwriting
  songs: '++id, profileId, title, lyrics, mood, createdAt',
  
  // Practice logs (for DaaS sync)
  logs: '++id, student_name, timestamp, duration, fret',
  
  // Recordings
  recordings: '++id, profileId, blob, duration, createdAt',
});
```

### 4.2 Data Flow

```
User Action
    │
    ▼
┌─────────────┐
│ Component   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Hook      │ (useBackendBridge, etc.)
└──────┬──────┘
       │
       ├──────────────┐
       ▼              ▼
┌──────────┐  ┌──────────┐
│IndexedDB │  │ DaaS API │
│(Local)   │  │(Remote)  │
└──────────┘  └──────────┘
```

### 4.3 Synchronization Strategy

**Offline-First Design:**
1. All data written to IndexedDB first
2. Background sync attempts to push to DaaS
3. Conflicts resolved by timestamp (latest wins)
4. Queue system for offline operations

---

## 5. AI Integration

### 5.1 AI Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    AI PROVIDER LAYER                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  LM Studio   │  │  DaaS Server │  │   WebLLM     │     │
│  │  (Primary)   │  │  (Fallback)  │  │  (Browser)   │     │
│  │   Port 1234  │  │   Port 8080  │  │   WASM       │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │              │
│         └─────────────────┴─────────────────┘              │
│                           │                                │
│                    ┌──────▼──────┐                         │
│                    │useBackend   │                         │
│                    │   Bridge    │                         │
│                    └──────┬──────┘                         │
│                           │                                │
└───────────────────────────┼────────────────────────────────┘
                            │
┌───────────────────────────┼────────────────────────────────┐
│                    MCP SERVER (Port 3001)                  │
├───────────────────────────┼────────────────────────────────┤
│                           │                                │
│                    ┌──────▼──────┐                         │
│                    │  AI Tools   │                         │
│                    │             │                         │
│  ┌─────────────┐  │ ┌─────────┐ │  ┌─────────────┐        │
│  │ read_file   │◀─┤ │ Qwen    │─├─▶│ edit_file   │        │
│  │ search_code │◀─┤ │ Coder   │─├─▶│ create_file │        │
│  │ run_command │◀─┤ │ 32B     │─├─▶│ git_commit  │        │
│  └─────────────┘  │ └─────────┘ │  └─────────────┘        │
│                    └─────────────┘                         │
└───────────────────────────────────────────────────────────┘
```

### 5.2 AI Provider Priority

1. **LM Studio (Primary)** - Local GPU-accelerated inference
2. **DaaS Server (Secondary)** - Desktop app with embedded models
3. **WebLLM (Fallback)** - Browser-based WASM inference

### 5.3 MCP Tool Server

**Capabilities:**
- `read_file` - Read project files
- `edit_file` - Precise text replacement
- `create_file` - Create new files
- `search_code` - Grep across codebase
- `run_command` - Execute safe commands
- `git_commit` - Commit changes

**Safety:**
- All destructive operations require approval
- Automatic backups before edits
- Git integration for version control
- Restricted command whitelist

---

## 6. Audio Engine

### 6.1 Audio Architecture

```
┌────────────────────────────────────────────┐
│           Web Audio API Graph               │
├────────────────────────────────────────────┤
│                                            │
│  ┌─────────┐     ┌─────────┐     ┌─────┐ │
│  │  Input  │────▶│Analyzer │────▶│Gain │ │
│  │ (Mic)   │     │ (FFT)   │     │Node │ │
│  └─────────┘     └────┬────┘     └──┬──┘ │
│                       │              │    │
│                       ▼              ▼    │
│                ┌──────────┐    ┌────────┐│
│                │Pitch     │    │ Output ││
│                │Detector  │    │(Speakers)│
│                └──────────┘    └────────┘│
│                                            │
└────────────────────────────────────────────┘
```

### 6.2 Audio Components

| Component | Purpose | Technology |
|-----------|---------|------------|
| `audioEngine.js` | Core audio graph management | Web Audio API |
| `usePitchDetector.js` | Real-time pitch detection | WebRTC + Autocorrelation |
| `AmbientPlayer` | Background music playback | HTML5 Audio |
| `PlingTrainer` | Pitch training game | Pitch detection + UI |
| `PitchRoom` | Interval ear training | Oscillator + Detection |

### 6.3 Pitch Detection Algorithm

```javascript
// Autocorrelation-based pitch detection
function detectPitch(buffer, sampleRate) {
  // 1. Apply window function
  // 2. Compute autocorrelation
  // 3. Find peak (fundamental frequency)
  // 4. Convert to note name
  // 5. Calculate cents deviation
}
```

---

## 7. Game Systems

### 7.1 Vertiscale Engine Architecture

```
┌──────────────────────────────────────────────┐
│         VERTISCALE ENGINE                     │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Flash   │  │  Imagine │  │   Orb    │   │
│  │  Mode    │  │   Mode   │  │  Engine  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │          │
│       └─────────────┴─────────────┘          │
│                     │                        │
│              ┌──────▼──────┐                │
│              │  Pitch Gate  │                │
│              │  (Validation)│                │
│              └──────┬──────┘                │
│                     │                       │
│              ┌──────▼──────┐                │
│              │  Session    │                │
│              │   Logger    │                │
│              └─────────────┘                │
│                                              │
└──────────────────────────────────────────────┘
```

### 7.2 Game Components

| Component | Function |
|-----------|----------|
| `VertiscaleEngine` | Main game orchestrator |
| `OrbEngine` | Visual orb + pitch tracking |
| `PitchGateUI` | Pitch validation gate |
| `GameFretboard` | 4-string practice fretboard |
| `AdventurePlayer` | Narrative adventure mode |

### 7.3 Progression System

**Traction Calculation:**
```javascript
traction = weightedAverage({
  pitchAccuracy: 0.4,    // 40% weight
  completionTime: 0.3,   // 30% weight
  attempts: 0.2,        // 20% weight
  consistency: 0.1,     // 10% weight
});
```

---

## 8. Component Library

### 8.1 Design System

**Colors:**
```css
--cf-gold: #c9a96e;        /* Primary accent */
--cf-purple: #7b6aaa;      /* Secondary accent */
--cf-green: #7aaa88;       /* Success/health */
--cf-void: #0d0d14;        /* Background */
--cf-ink: #1a1a24;         /* Card backgrounds */
--cf-cream: #e8dcc8;       /* Primary text */
```

**Typography:**
- **Headings:** Cormorant Garamond (serif)
- **Body:** Inter (sans-serif)
- **Code/Labels:** JetBrains Mono (monospace)
- **Quotes:** EB Garamond (serif, italic)

**Spacing Scale:**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

### 8.2 Component Patterns

**Card Pattern:**
```jsx
<div className="bg-cf-ink/50 backdrop-blur-md rounded-2xl 
                border border-cf-gold/20 p-6">
  {/* Card content */}
</div>
```

**Button Pattern:**
```jsx
<button className="px-4 py-2 bg-cf-gold/20 border border-cf-gold/40 
                   rounded-lg text-cf-gold hover:bg-cf-gold/30 
                   transition-all duration-200">
  Action
</button>
```

---

## 9. Build & Deployment

### 9.1 Build Pipeline

```
Developer
    │
    ▼
┌──────────┐
│  Write   │
│   Code   │
└────┬─────┘
     │
     ▼
┌──────────┐
│   Vite   │  ← Dev server (HMR)
│   Dev    │
└────┬─────┘
     │
     ▼
┌──────────┐
│  Test    │
└────┬─────┘
     │
     ▼
┌──────────┐
│  Vite    │  ← Production build
│  Build   │
└────┬─────┘
     │
     ▼
┌──────────┐
│  Vercel  │  ← Deploy
└──────────┘
```

### 9.2 Deployment Strategy

**Production (Vercel):**
- Auto-deploy on push to main
- Domain: voix-vive.com
- Static site hosting
- Edge CDN

**Desktop (Tauri):**
- Build for Windows, macOS, Linux
- Bundles with local AI
- Distributed via GitHub Releases

**MCP Server:**
- Runs locally on Bertrand's machine
- Port 3001 (configurable)
- Requires LM Studio running

### 9.3 Environment Variables

```bash
# Development
VITE_DEV_MODE=true
VITE_API_BASE=http://localhost:8080

# Production
VITE_DEV_MODE=false
VITE_API_BASE=https://api.voix-vive.com

# MCP Server
PROJECT_ROOT=/path/to/project
LMSTUDIO_URL=http://localhost:1234/v1
MCP_PORT=3001
REQUIRE_APPROVAL=true
```

---

## 10. Security

### 10.1 Security Architecture

| Layer | Protection |
|-------|------------|
| **Transport** | HTTPS everywhere |
| **Auth** | Cloudflare Access (optional) |
| **Storage** | IndexedDB (client-side only) |
| **AI Access** | Local only (no cloud AI) |
| **Code Mod** | Approval required |
| **Commands** | Whitelist only |

### 10.2 MCP Server Security

- **Path Validation:** All file operations restricted to project root
- **Command Whitelist:** Only safe commands allowed
- **Approval Queue:** Destructive ops require manual approval
- **Git Backup:** All changes tracked and reversible
- **No Secrets:** Environment variables not accessible to AI

### 10.3 Data Privacy

- All student data stored locally (IndexedDB)
- No telemetry without explicit consent
- Audio recordings never leave device (unless explicitly shared)
- AI processing happens locally (no data to cloud)

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **CF** | Color Forge - the design system name |
| **DaaS** | Desktop as a Service - local server with SQLite |
| **MCP** | Model Context Protocol - AI tool calling standard |
| **LM Studio** | Local LLM inference application |
| **Vertiscale** | The main practice game engine |
| **Traction** | Progress metric (0-100) per fret |
| **Florins** | In-app currency for gamification |
| **©SHEARL** | Bertrand's relaxation protocol |
| **©PLING!** | Bertrand's pitch matching protocol |
| **©FHEAL** | Bertrand's full expression protocol |

## Appendix B: Related Documents

- `CONTEXT.md` - Project context and business strategy
- `ROADMAP.md` - Development phases and milestones
- `USER_EXPERIENCE_MAP.md` - User journey documentation
- `AI_DEVELOPER_GUIDE.md` - AI modification system
- `LM_STUDIO_SETUP.md` - LM Studio configuration
- `MEETING_PREP.md` - Stakeholder meeting notes
- `IP_ASSIGNMENT.md` - Intellectual property terms

---

**Document maintained by:** Joshua Atkinson  
**Last comprehensive review:** 2026-05-25
