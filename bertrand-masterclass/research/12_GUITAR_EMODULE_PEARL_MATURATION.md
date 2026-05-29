# Guitar eModule: The Pearl & Maturation Map
## Voix Vive — Unified Interactive Learning Architecture
### *All Tools. All Games. All Paths. One Module.*

> **Version:** 1.7 — Login Fix + StepAudio Pivot + TCG Removed (2026-05-27)
> **Author:** Joshua Atkinson (Platform Architect)
> **SME:** Bertrand Laurence
> **Design Framework:** ADDIECRAPEYE + PEARL + 12-Fret Monomyth + DAG eModule
> **Status:** Phase 1 ✅ Complete. Phase 2 ✅ Core Complete. Phase 3 🔄 In Progress (StepAudio local inference pivot). Current blockers: Google OAuth `drive.file` scope needs Google Cloud Console config (10 min, deferred post-meeting).
> **Template Mode:** voix-vive.com is now a reusable platform architecture for multiple instructors.

---

## The Problem We Solved (And The New Problem We Have)

**What we built:** A rich ecosystem of pedagogical content spread across routes, components, and game engines:
- `/guitar` → GuitarWorkbench (tool hub, AI chat)
- `/playbook` → Troubadour's Playbook (Character, Quests, Songbook, Journal)
- `/player` → PlayerPortal (video submissions, mentor connection)
- `/studio` → StudioPage (pricing, mentorship services)
- `/game` → Vertiscale Engine (✅ routed, needs browser testing)
- `/adventure` → AdventurePlayer (✅ routed, needs browser testing)

**What broke:** The `/player` portal replaced `MentorTools`, which means Bertrand's pricing, Digital Binder, and mentor dashboard are no longer visible to students who land on `/player`. ~~The Vertiscale Engine has no route.~~ ✅ FIXED 2026-05-27: `/game` and `/adventure` routes added. ~~The Adventure is trapped inside the game engine.~~ ✅ FIXED: AdventurePlayer is now standalone at `/adventure`.

**What we need:** One unified **Guitar eModule** that makes ALL content accessible through intentional navigation, preserves the pedagogical flow, and provides a "no AI" fallback path for every feature.

---

## I. THE PEARL — Multi-Stakeholder Perspective Check

Before any architectural decision, PEARL asks:

| Stakeholder | Need | How This Module Serves It |
|-------------|------|---------------------------|
| **Student** | I want to learn guitar without feeling lost or judged | The Maturation Map shows exactly where they are, what to do next, and why. No dead ends. |
| **Mentor (Bertrand)** | I want to see student progress and convert browsers to students | The mentor view shows engagement data, submission queue, and pricing — all in one place. |
| **Engineer** | I want to add features without breaking the 12-fret map | Every new feature MUST map to a fret/protocol. The architecture enforces this. |
| **Gift-Giver** | I want to buy this for someone and know what they get | The StudioPage is accessible from every portal. Pricing is never hidden. |

---

## II. THE MATURATION MAP — Student Journey Architecture

The Maturation Map replaces the current portal confusion with a single, clear progression:

```
┌─────────────────────────────────────────────────────────────────┐
│                    THE GUITAR eMODULE                              │
│              (Previously: /guitar + /playbook + /game)            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │   STUDIO    │    │  WORKBENCH  │    │   TROUBADOUR │        │
│  │  (Pricing)  │    │  (Practice)  │    │   (AI Widget) │       │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              THE MATURATION MAP (Hub)                     │  │
│  │                                                            │  │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │  │
│  │   │Frets 1-4│→ │Frets 5-8│→ │Frets 9-12│→ │Free Play │    │  │
│  │   │  ROOT   │  │ CHORDS  │  │  SONGS   │  │ (FHEAL)  │    │  │
│  │   └─────────┘  └─────────┘  └─────────┘  └─────────┘    │  │
│  │                                                            │  │
│  │   Each fret unlocks: Slides → Tool → Game → Journal      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │   PLAYBOOK  │    │  VERTISCALE │    │  ADVENTURE  │        │
│  │ (Identity)  │    │   (Game)    │    │  (Story)    │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### The Three Core Sections

**1. THE WORKBENCH** (`/guitar/workbench`)
- What: The 12 tools, suggested practice, quick actions
- AI mode: AI suggests the right tool based on curriculum position
- No-AI mode: Student sees the full tool grid, picks what they need
- Status: ✅ Built, working, chat unified into Troubadour widget

**2. THE MATURATION MAP** (`/guitar/map` or integrated into Workbench)
- What: Visual 12-fret journey showing progress, next step, and locked/unlocked content
- AI mode: AI guides the student to the next fret based on performance
- No-AI mode: Student self-navigates, unlocks frets by completing exercises
- Status: ⚠️ Partial — QuestLog exists but not as primary navigation

**3. THE PLAYBOOK** (`/guitar/playbook` or `/playbook`)
- What: Character sheet, quest log, songbook, journal
- AI mode: AI reviews journal entries, suggests reflections
- No-AI mode: Student writes, reads, self-reflects
- Status: ✅ Built, routed at `/playbook`, needs better integration

**4. THE VERTISCALE ENGINE** (`/guitar/game` or `/game`)
- What: The 3-phase game (Flash → Orbs → Freeplay)
- AI mode: AI narrates coaching cues, adapts difficulty
- No-AI mode: Pre-recorded coaching cues, static difficulty selection
- Status: ⚠️ Built but **NO ROUTE EXISTS** — completely inaccessible!

**5. THE ADVENTURE** (`/guitar/adventure` or `/adventure`)
- What: Troubadour CYOA — pitch-gated narrative with Bernard de Ventadorn
- AI mode: AI generates dynamic responses based on pitch performance
- No-AI mode: Branching narrative with pre-written coaching cues
- Status: ⚠️ Built inside VertiscaleEngine, needs standalone route

**6. THE STUDIO** (`/studio` — keep separate but link everywhere)
- What: Pricing, services, mentorship, gift certificates
- Status: ✅ Built, routed at `/studio`, must be linked from Player portal

---

## III. THE UNIFIED NAVIGATION — No Dead Ends

Every page must answer: "Where am I? What do I do next? How do I get help?"

### Global Navigation (Persistent)

```
┌────────────────────────────────────────┐
│ [🎸] Troubadour  │  Workbench  │  Map  │  Playbook  │  Studio  │
│  (AI Widget)      │             │       │            │  ($)     │
└────────────────────────────────────────┘
```

- **Troubadour widget** (top-left, always): AI chat + music + metronome
- **Workbench** (`/guitar`): Practice tools and suggested session
- **Map** (`/guitar#map` or new route): 12-fret progress visualization
- **Playbook** (`/playbook`): Character, quests, songbook, journal
- **Studio** (`/studio`): Pricing, book lessons, buy gift certificates

### Breadcrumb System

Every page below `/guitar` shows:
```
Voix Vive > Guitar > [Current Section] > [Current Tool/Fret]
```

---

## IV. ROUTING FIXES — What To Change Now

### Current State (Updated 2026-05-27)

| Route | Current | Should Be | Action |
|-------|---------|-----------|--------|
| `/guitar` | GuitarWorkbench | Workbench (keep) | ✅ OK |
| `/game` | VertiscaleEngine | VertiscaleEngine | ✅ ROUTED — needs browser test |
| `/adventure` | AdventurePlayer | AdventurePlayer | ✅ ROUTED — needs browser test |
| `/player` | PlayerPortal only | PlayerPortal + Studio content | 🔧 MERGE (Phase 1) |
| `/playbook` | PlaybookShell | PlaybookShell | ✅ OK |
| `/studio` | StudioPage | StudioPage | ✅ OK — back button added |

### Navigation Standardization (Phase 0 — Done)

Every page must have a back button and Voix Vive wordmark home button:

| Page | Back | Home | Status |
|------|------|------|--------|
| StudioPage | ✅ | ✅ | Done |
| PrivacyPolicy | ✅ | — | Done |
| TermsOfService | ✅ | — | Done |
| PlayerPortal | — | ✅ | Done |
| GuitarWorkbench | ✅ | ✅ | Done |
| OrientationHub | ✅ | ✅ | Done |
| PlaybookShell | ✅ | ✅ | Done |
| VertiscaleEngine | ✅ | ✅ | Done |
| AdventurePlayer | ✅ | ✅ | Done |

### Proposed New Routes

```javascript
// App.jsx additions:
<Route path="/guitar" element={<ErrorBoundary><GuitarWorkbench /></ErrorBoundary>} />
<Route path="/guitar/game" element={<ErrorBoundary><VertiscaleEngine /></ErrorBoundary>} />
<Route path="/guitar/adventure" element={<ErrorBoundary><AdventurePlayer /></ErrorBoundary>} />
<Route path="/game" element={<ErrorBoundary><VertiscaleEngine /></ErrorBoundary>} /> {/* legacy alias */}
<Route path="/adventure" element={<ErrorBoundary><AdventurePlayer /></ErrorBoundary>} /> {/* legacy alias */}
```

### PlayerPortal Fix

The `/player` portal should show:
1. **Student submissions** (existing PlayerPortal content)
2. **Mentor services** (StudioPage pricing cards)
3. **Video library** (placeholder → actual implementation)
4. **Book a session** link → `/studio`

Implementation: Embed `<StudioPage />` at the bottom of PlayerPortal, or create a tabbed interface: `[My Journey] [Submit] [Library] [Mentor Services]`

---

## V. THE "NO AI" MODE — Pedagogical Fallback

Every AI-driven feature must have a "no AI" fallback. This is not a downgrade — it is the primary mode for many students.

### Feature Matrix

| Feature | AI Mode | No-AI Mode | Implementation |
|---------|---------|------------|----------------|
| Tool suggestion | AI picks based on context | Student picks from grid | Workbench already supports both |
| Chat | Live LM Studio streaming | Pre-written FAQ + guided prompts | Troubadour widget: static prompts when offline |
| Game coaching | Dynamic AI-generated cues | Pre-written cue library | AdventurePlayer has `coachingCues` object |
| Progress feedback | AI-generated impressions | Stat boxes + progress bars | CharacterSheet + QuestLog |
| Journal reflection | AI analyzes entries | Guided prompts only | JournalEntry has prompt rotation |
| Adventure narrative | AI branches dynamically | Static branching tree | `TROUBADOUR` data object in `adventures/troubadour.js` |

### The "Troubadour Offline" Experience

When LM Studio is not running:
1. Chat input becomes a **guided prompt selector** ("I feel stuck", "My fingers hurt", "What should I practice?")
2. Responses are pre-written from Bertrand's actual teaching philosophy
3. The "Ask the Troubadour" button still works — it just uses the static knowledge base
4. Server status light turns amber (not red) — "Troubadour is reading. He'll respond when you're ready."

---

## VI. PERSISTENCE STRATEGY — Supabase + Google Auth

### Current State: Local-Only

Data lives in:
- `localStorage` (traction, streak, settings)
- `IndexedDB` via Dexie (journal, sessions, submissions, songs)
- **Problem:** Students lose data when switching devices. Bertrand can't see aggregate progress.

### Target Architecture: Supabase

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Student PWA   │────→│   Supabase      │←────│  Mentor Dashboard│
│  (React/Vite)   │     │  (Postgres +    │     │  (React/Vite)    │
│                 │     │   Auth + RL)    │     │                  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │
         └────── local cache ────┘
              (Dexie/IndexedDB)
```

### Database Schema (Minimal Viable)

```sql
-- Profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users primary key,
  display_name text,
  created_at timestamptz default now(),
  bard_level int default 1,
  practice_minutes int default 0,
  streak int default 0
);

-- Traction (12-fret progress)
create table traction (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  fret_id int not null,
  traction_pct int default 0,
  attempts int default 0,
  completed boolean default false,
  updated_at timestamptz default now()
);

-- Journal entries
create table journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  fret_id int,
  content text,
  mood text,
  created_at timestamptz default now()
);

-- Video submissions (async assessor)
create table submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  exercise_name text,
  video_url text,
  duration int,
  reviewed boolean default false,
  feedback text,
  created_at timestamptz default now()
);

-- Vertiscale sessions
create table vertiscale_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  phase int,
  pattern_id text,
  consistency_ratio float,
  round_count int,
  successful boolean,
  created_at timestamptz default now()
);

-- Songs (songbook)
create table songs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  title text,
  lyrics text,
  chords text,
  created_at timestamptz default now()
);
```

### Row Level Security (RLS)

```sql
-- Students can only read/write their own data
alter table traction enable row level security;
create policy "Users can only access their own traction"
  on traction for all
  using (auth.uid() = user_id);

-- Mentor (Bertrand) can read all submissions
-- TODO: Add mentor role to profiles table
```

### Google Auth Implementation

1. **Supabase Dashboard:** Enable Google OAuth provider
2. **Google Cloud Console:** Create OAuth 2.0 credentials
3. **Redirect URI:** `https://voix-vive.com/auth/v1/callback`
4. **Code:**

```javascript
// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth hook
export function useAuth() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user);
    });
    return () => listener.subscription.unsubscribe();
  }, []);
  
  const signInWithGoogle = () => supabase.auth.signInWithOAuth({ provider: 'google' });
  const signOut = () => supabase.auth.signOut();
  
  return { user, signInWithGoogle, signOut };
}
```

### Migration Strategy (Preserve Local Data)

```javascript
// On first login:
async function migrateLocalToCloud(userId) {
  // 1. Read all localStorage + IndexedDB
  const localTraction = loadTraction();
  const localJournal = await db.journal.toArray();
  const localSongs = await db.songs.toArray();
  
  // 2. Upload to Supabase
  await supabase.from('traction').upsert(
    Object.entries(localTraction.frets || {}).map(([fretId, data]) => ({
      user_id: userId,
      fret_id: parseInt(fretId),
      traction_pct: data.traction || 0,
      attempts: data.attempts || 0,
      completed: (data.traction || 0) >= 60,
    }))
  );
  
  await supabase.from('journal_entries').insert(
    localJournal.map(entry => ({
      user_id: userId,
      fret_id: entry.fretId,
      content: entry.content,
      mood: entry.mood,
      created_at: entry.timestamp,
    }))
  );
  
  // 3. Mark migration complete
  localStorage.setItem('voixvive_migrated', 'true');
}
```

---

## VII. VOICE-FIRST AI — The Audio Experience

The user's vision: "The chat goal is an audio-based experience instead of text. Text minimized while AI voice conversation works."

### Why This Matters

Bertrand's method is **somatic and vocal**. Students who type about their practice are using the wrong channel. Speaking engages the same neural pathways as singing. A voice-based AI companion is not a feature — it is a pedagogical necessity.

### Implementation Phases

**Phase 1: Text-to-Speech (Immediate)**
- Browser TTS API reads AI responses aloud
- Student can click a "🔊 Speak" button on each response
- Voice: Use browser's native TTS with a warm, slow voice (adjust rate to 0.85)

**Phase 2: Speech-to-Text (Near-term)**
- Mic button in chat input
- Browser Web Speech API transcribes student speech
- Transcription appears in input field, can be edited before send

**Phase 3: Full Voice Conversation (Future)**
- Real-time voice AI (WebRTC + local LLM)
- Student speaks → AI responds with generated voice
- LM Studio with a voice model (e.g., Piper TTS)
- Or: Use a cloud voice API with Bertrand's consent

### Technical Stack for Voice

```
┌─────────────────────────────────────────┐
│           TROUBADOUR WIDGET              │
│  ┌─────────────────────────────────┐   │
│  │  [🎤] Speak  →  Speech-to-Text  │   │
│  │       "I'm stuck on the tritone" │   │
│  │                                  │   │
│  │  ┌──────────────────────────┐  │   │
│  │  │ The tritone lives between │  │   │
│  │  │ F and B. Sing it first... │  │   │
│  │  │                    [🔊]   │  │   │
│  │  └──────────────────────────┘  │   │
│  │                                  │   │
│  │  [🎵] Ambient  [🥁] Metronome  │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Code snippet for TTS:**
```javascript
function speak(text, rate = 0.85) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 0.95;
  utterance.voice = speechSynthesis.getVoices().find(v => v.name.includes('Google US English'));
  speechSynthesis.speak(utterance);
}
```

---

## VIII. IMPLEMENTATION CHECKLIST

### Phase 0: Stabilization (Current — May 27, 2026)

- [x] **Route the Vertiscale Engine** — `/game` added
- [x] **Route the Adventure** — `/adventure` added
- [x] **Build passes** — `npm run build` with zero errors
- [x] **Lint clean** — All three files fixed
- [x] **Troubadour widget** — Rename complete, purple theme, guitar icon, AI chat at bottom
- [x] **StudioPage navigation** — Back button + Voix Vive wordmark home
- [x] **Standardize navigation** — Back + home added to GuitarWorkbench, OrientationHub, PlaybookShell, VertiscaleEngine, AdventurePlayer
- [x] **Fix PlayerPortal** — Pricing cards removed, clean CTA to `/studio`
- [x] **Browser test all routes** — `/game`, `/adventure`, `/player`, `/guitar`, `/playbook`, `/song`, `/studio`
- [x] **Remove distracting homepage photo** — Floating Bertrand avatar removed from LandingScreen
- [x] **Add Pythagorean Legacy to all 12 frets** — chapterData.js now has `pythagoreanLegacy` with ratio, cents, bilingual hook
- [x] **Pythagorean Legacy slide in deck** — slideGenerator.js + SlideViewer.jsx render mathematical origin card after title
- [x] **Chromatic Monomyth reference chart** — `/monomyth` route with full 12-fret grid: interval, hero stage, ratio, cents; linked from OrientationHub nav

### Phase 1: Persistence ✅ COMPLETE (May 27, 2026)

**Prerequisites DONE:** ✅ Supabase project created (`fmaaihxhfgmqdmtmckmc`), schema deployed, Vercel env vars set.

- [x] **Supabase setup** — Project created, schema.sql deployed, RLS policies active
- [x] **Vercel deploy** — Live at `www.voix-vive.com` + `bertrand-masterclass.vercel.app`
- [x] **Google Auth** — OAuth 2.0 credentials created in Google Cloud Console; Client ID + Secret pasted into Supabase Auth → Providers
- [x] **Login/logout UI** — AuthButton component + useAuth hook built; placed in LandingScreen header
- [x] **Auth callback page** — `/auth/callback` route handles OAuth redirect, routes to `/song`
- [x] **Login test** — Google sign-in works (basic `openid email profile` scope) ✅ (2026-05-27)
  - Fix: `detectSessionInUrl: false` + manual hash parsing in AuthCallback
  - Fix: Full `sb_publishable_*` prefix required in VITE_SUPABASE_ANON_KEY
  - Fix: Removed `drive.file` scope from initial auth (was causing `invalid_scope` error)
  - Deferred: Re-enable `drive.file` after Google Cloud Console OAuth consent screen setup
- [x] **Anonymous mode banner** — "Sign in to save progress" shown on LandingScreen when not logged in
- [x] **ScaffoldingProvider sync** — Cloud when logged in, localStorage when not (wired + tested)
- [x] **Journal system** — Text entries sync to Supabase when logged in, IndexedDB fallback when not
- [x] **Video recorder** — Browser MediaRecorder + upload to Supabase Storage when logged in
- [x] **JournalFeed** — Loads from Supabase when logged in, IndexedDB fallback
- [x] **Schema updates** — `traction_data` JSONB in profiles, `entry_type` in journal_entries
- [ ] **Data migration** — Local → cloud on first login (preserves existing data)
- [ ] **Create `/guitar/map` route** — The Maturation Map as primary navigation
- [ ] **No-AI fallback** — Static prompt library when LM Studio is offline

### Phase 2: Google Drive Mentor Connect (IN PROGRESS — May 27, 2026)

**Architecture decision:** Videos stored in students' personal Google Drive (free, student-owned), shared with mentor. Supabase stores only metadata (file IDs, share status, review state). This keeps Supabase free tier viable forever.

**Blocker:** `drive.file` scope removed from auth flow to fix login. Re-enabling requires Google Cloud Console OAuth consent screen setup (10 min task, deferred post-Bertrand meeting).
**Prerequisites DONE:** ✅ Mentor email in env, `video_submissions` + `drive_config` tables in schema. `drive.file` scope code ready to re-enable.

- [x] **Google Drive OAuth code** — `drive.file` scope built + offline access ✅ (disabled pending Google Cloud Console setup)
- [x] **Student Drive folder** — Auto-create `Voix Vive Submissions` folder on upload ✅
- [x] **Auto-share with mentor** — Folder shared with `VITE_MENTOR_EMAIL` on creation ✅
- [x] **Video upload to Drive** — `uploadVideo()` multipart upload via Drive API ✅
- [x] **Video metadata in Supabase** — `video_submissions` table: `drive_file_id`, `drive_folder_id`, `web_view_link`, `reviewed` ✅
- [x] **Mentor review link** — `web_view_link` stored per submission, `getMentorSubmissions()` query ✅
- [x] **Drive template system** — `drive_config` table schema ready for multi-instructor reuse ✅
- [ ] **Bertrand response recording** — Screen recorder overlay for mentor to record video responses
- [x] **Google Calendar integration** — `calendarService.js` reads mentor free/busy, generates 30-min slots ✅
- [x] **Async review queue** — `schedulingService.js` with workload guard + text-back fallback ($5) ✅
- [x] **Structured Practice Recorder** — 15-min guided session in `/player` ✅
  - [x] Breathing Gate (2 min) — animated breath circle with prompts
  - [x] Warm-up (3 min) — fretboard prompts (open A → fret 2, 3, 5)
  - [x] Practice Session (8 min) — auto-rotating on-screen guidance
  - [x] Free Play (1 min) — blank screen, just play
  - [x] Emotional State Capture (30s) — text input: "What are you feeling?"
  - [x] Auto-save to Google Drive with emotional state metadata

### Phase 2b: Template Architecture (May 27, 2026)

**Goal:** Make voix-vive.com a reusable platform for any instructor.

- [ ] **Instructor config** — `instructors` table: name, email, bio, drive_folder_template, color_theme
- [ ] **White-label landing** — Instructor logo, colors, curriculum loaded from config
- [ ] **Multi-tenant auth** — Students auth once, can join multiple instructor programs
- [ ] **Curriculum import** — Instructors upload their 12-chapter structure as JSON
- [ ] **Mentor switcher** — Joshua can test as instructor → switch to student → verify flow
- [ ] **Stripe integration (deferred)** — When instructor wants paid coaching, Stripe Connect

### Phase 3: Voice + AI — StepAudio Local Inference (IN PROGRESS)

**Research Report:** `research/STEPAUDIO_2.5_INTEGRATION_REPORT.md` (May 27, 2026)
**Model:** Step-Audio-R1.1 (33B, 55GB+) — downloading to `/home/joshua/trinity-models/vllm/Step-Audio-R1.1/`
**Architecture:** React frontend → Java WebSocket middleware → Local vLLM-OMNI server (port 9999) on GMKtek EVO X2
**Pivot:** Moved from cloud API ($0/query principle) to local inference. vLLM-OMNI repo at `/home/joshua/trinity-models/vllm-omni/`. ROCm gfx1151 container exists but lacks omni extensions — needs rebuild or source compile.

**Frontend (React/Vite) — Phases 1-2 DONE:**
- [x] **AudioStreamingService interface** — `@/lib/audioStreamingService.js` ✅
  - `connect()`, `startRecording()`, `stopRecording()`, `sendTextMessage()`, `disconnect()`
  - Event callbacks: `onAudioReceived`, `onTextReceived`, `onParalinguistic`, `onConnectionChange`
- [x] **Voice mode in Troubadour widget** — `@/components/AmbientPlayer.jsx` ✅
  - Mic button next to chat input, pulsing red when recording
  - Server status light for "Voice" connection
  - Auto-connects to middleware on first mic press
- [ ] **Audio playback pipeline** — `AudioContext.decodeAudioData()` + BufferSource (partial — scaffolded)
- [ ] **Waveform visualizer** — Canvas-based amplitude visualization during AI speech

**Middleware (Java — Phases 3-5):**
- [x] **Jakarta WebSocket server** — `TroubadourServer.java` on port 8081 ✅
- [x] **Supabase JWT auth** — `JwtValidator.java` validates student token on connect ✅
- [ ] **Local vLLM outbound client** — Adapt `StepAudioClient.java` from WebSocket to HTTP (vLLM-OMNI OpenAI-compatible API)
- [ ] **Bidirectional relay** — Forward base64 audio + JSON events both directions
- [ ] **Paralinguistic interceptor** — `ParalinguisticInterceptor.java` parses emotion events, writes to Supabase ✅ (class exists, untested)

**Schema (DONE):**
- [x] **`troubadour_audio_sessions`** — session lifecycle, persona, fret_id, duration ✅
- [x] **`paralinguistic_events`** — emotion, confidence, timestamp_offset, intervention_triggered ✅

**Pedagogical Routing (Phase 7):**
- [ ] **Fatigue detection** → Pause Vertiscale → Redirect to Breathing Gate or Journal
- [ ] **Frustration detection** → Suggest easier fret, FHEAL free play, or rest
- [ ] **Confidence spike** → Unlock next fret, offer challenge
- [ ] **Bernard persona** — `/adventure` route with stable character via persona-specific RLHF

**Legacy fallbacks preserved:**
- LM Studio (port 1234) — local text AI when StepAudio offline
- DaaS server (port 8080) — Joshua's Axum inference router
- Static TROUBADOUR data — offline mode when all AI unavailable

### Phase 4: Digital Mirror (IN PROGRESS — May 27, 2026)

**Prerequisites:** Clarification on posture analysis (ML vs heuristics) — deferred until Phase 4 active development.

- [x] **Video journaling** — VideoRecorder component in Playbook Journal tab ✅
- [x] **Reflection prompts** — JournalEntry with mood + curated prompts per fret ✅
- [ ] **Self-review** — Playback with metronome overlay
- [ ] **Timeline view** — Submissions + journal + practice sessions in one feed (needs Drive integration first)

### Phase 5: Vercel + PWA (FAST-TRACKED — May 27, 2026)

**Prerequisites DONE:** ✅ Repo connected, `www.voix-vive.com` domain active, env vars configured.

- [x] **Production deploy** — Live at `www.voix-vive.com`
- [ ] **PWA manifest** — Installable, offline cache
- [ ] **Service worker** — Offline mode for core features

### Phase 5.5: Aesthetic & PEARL Harmonization (IN PROGRESS)

**Goal:** Ensure every route and component is compliant with the strict PEARL file header standard (`05_PEARL_STANDARD.md`) and visually aligns with the esoteric, sovereign "Slow Web" aesthetic.

- [ ] **PEARL Compliance Sweep** — Audit and apply headers to all core shells (`LandingScreen`, `GuitarWorkbench`, `PlaybookShell`).
- [ ] **Aesthetic Review** — Harmonize component styling, removing default generic UI elements in favor of thematic, immersive designs.

### Phase 6: Android (Moonshot — Revenue Gate: $2,500/mo)

**Prerequisites from you:** Open Android Studio (when I say so), choose Tauri vs Capacitor

- [ ] **Tauri mobile build** — Native Android app
- [ ] **Hardware integration** — Mic, haptics, local SQLite sync
- [ ] **Offline-first** — Full functionality without network

### Phase 7: Beyond (Vision)

- [ ] **Full voice conversation** — Real-time voice AI
- [ ] **Android XR** — Mixed reality Vertiscale
- [ ] **Multi-instructor** — Platform scales beyond Bertrand

---

## IX. CONTENT INVENTORY — What's Already Built

### ✅ Complete & Routed

| Feature | File | Route | Notes |
|---------|------|-------|-------|
| Landing Screen | `pages/LandingScreen.jsx` | `/` | 3 portals + admin |
| Guitar Workbench | `components/GuitarWorkbench.jsx` | `/guitar` | 12 tools, AI chat unified |
| Playbook | `components/playbook/PlaybookShell.jsx` | `/playbook` | Character, Quests, Songbook, Journal |
| Studio Page | `pages/StudioPage.jsx` | `/studio` | Pricing, services, downloads |
| Troubadour Widget | `components/AmbientPlayer.jsx` | Global | AI chat + music + metronome |
| Player Portal | `components/PlayerPortal.jsx` | `/player` | Submissions, library, guided session |
| Chromatic Monomyth | `pages/MonomythChart.jsx` | `/monomyth` | 12-fret reference grid |
| Auth System | `hooks/useAuth.js` + `pages/AuthCallback.jsx` | `/auth/callback` | Google OAuth, login-aware progress |
| Journal | `components/playbook/JournalEntry.jsx` | `/playbook` (Journal tab) | Text + mood + Supabase sync |
| Video Recorder | `components/playbook/VideoRecorder.jsx` | `/playbook` (Journal tab) | Google Drive upload (not Storage) |
| Structured Practice Recorder | `components/StructuredPracticeRecorder.jsx` | `/player` modal | 15-min guided session |
| Mentor Dashboard | `pages/MentorDashboard.jsx` | `/mentor` | Review queue, workload bar |
| Google Drive Service | `lib/driveService.js` | — | Upload, share, metadata index |
| Calendar Service | `lib/calendarService.js` | — | Free/busy, slot generation, booking |
| Scheduling Service | `lib/schedulingService.js` | — | Workload guard, text-back queue |

### ⚠️ Built But Unrouted

| Feature | File | Status | Action |
|---------|------|--------|--------|
| Digital Binder | `components/DigitalBinder.jsx` | Tool catalog | **DEPRECATED?** — Playbook replaces it |
| Text-Back UI | — | Service exists, no UI | Build form in PlayerPortal |
| Calendar Booking UI | — | Service exists, no UI | Build slot picker in PlayerPortal |

### 📋 Design Documents (Source of Truth)

| Document | Purpose |
|----------|---------|
| `10_MASTER_DESIGN_DOC.md` | Pedagogical philosophy, business model, IP |
| `10_design_doc_01_foundation.md` | ADDIECRAPEYE framework |
| `10_design_doc_02_curriculum.md` | 12-fret monomyth, tool mapping |
| `10_design_doc_03_vertiscale_game.md` | Game architecture, scoring |
| `10_design_doc_04_platform_and_business.md` | Tech stack, pricing |
| `09_master_architecture_doc.md` | System architecture |
| `TROUBADOUR_AI_REPORT.md` | AI integration research |
| **THIS DOCUMENT** | Unification blueprint |

---

## X. THE PROMISE

> *"You are an instrument playing an instrument. If I am playing the guitar — who is playing me?"*
> — Bertrand Laurence

The Guitar eModule is not a collection of features. It is a **living system** that mirrors the student's inner transformation:

- **Frets 1–4** (Safety): The student asks "Am I safe here?" → The platform answers with the Breathing Gate, the Practice Timer, and the warm purple glow of the Troubadour widget.
- **Frets 5–8** (Perception): The student asks "Can I hear myself?" → The platform answers with the Pitch Room, the Interval Visualizer, and the PLING! Trainer's mic gate.
- **Frets 9–12** (Mastery): The student asks "Can I play free?" → The platform answers with the Vertiscale Engine, the Adventure, and the Rhythm Engine's freeplay.
- **Beyond 12** (The Player): The student is no longer a student. They are a musician. The platform becomes a companion, not a teacher.

Every fret is a stage of becoming. Every tool is a question the student asks themselves. Every game is a mirror.

**This is the Pearl & Maturation Map.**

---

---

## Appendix B: Legal & IP Framework

### Ownership Structure (As Agreed)

| Layer | Owner | What It Is | Can License? |
|-------|-------|-----------|--------------|
| **Business / Studio** | Bertrand Laurence | `voix-vive.com` domain, student relationships, coaching revenue, lesson content | No — his personal asset |
| **Platform Code** | Joshua Atkinson | React/Vite app, Supabase schema, game engines, AI integration | Yes — framework can be licensed to other instructors |
| **Methodology** | Joshua Atkinson | ADDIECRAPEYE, PEARL, 12-Fret Monomyth mapping, Troubadour persona design | Yes — documented for academic and commercial use |
| **Curriculum Content** | Bertrand Laurence | Lesson text, exercises, philosophical framing, musical examples | No — his artistic IP |

### What Is NOT Documented (Action Required)

- ❌ **No written contract** between Joshua and Bertrand
- ❌ **No explicit license grant** for the platform code
- ❌ **No revenue-sharing agreement** for future licensing
- ❌ **No GDPR compliance statement** for EU students
- ❌ **No terms of service** governing student data use

### Recommended Next Steps (Non-Legal-Advice)

1. **Simple email agreement** between you and Bertrand:
   - "I gift the website code and infrastructure to your teaching business. I retain ownership of the ADDIECRAPEYE framework and platform architecture for potential future licensing. You retain all revenue from student coaching and lessons."
2. **Add to `/privacy` page:**
   - Where data is stored (Supabase, US servers)
   - What data is collected (name, email, progress, submissions)
   - Student rights (access, deletion)
3. **Add to `/terms` page:**
   - Platform is free for learning
   - Coaching is paid separately through Bertrand
   - No medical/physical therapy claims

### The Nonprofit Question (Deferred)

**Status:** Discussed but not pursued. Rationale: two-person operation, no grant funding yet, simple hosting costs covered by hobby tier. Revisit if:
- 3+ instructors want to use the platform
- Google for Education or arts foundation grant becomes available
- Revenue exceeds $2,500/mo and tax structure matters

---

## Appendix C: Bertrand's Checklist

### What Bertrand Needs to Do

- [x] **Test the live site** — `www.voix-vive.com` on his phone and computer ✅
- [x] **Try signing in with Google** — verify login flow works end-to-end ✅
- [ ] **Re-authenticate with Google Drive scope** — Deferred: needs Google Cloud Console OAuth consent screen setup first
- [ ] **Test video upload** — Record a practice video, confirm it lands in his Google Drive `Voix Vive Submissions` folder
- [ ] **Test structured practice session** — Try the 15-minute guided session on his phone
- [ ] **Visit `/mentor`** — Check the mentor dashboard, confirm submissions appear
- [ ] **Browse a chapter** — e.g., Fret 1 (The Root Note), swipe through slides
- [ ] **Check the Chromatic Monomyth chart** — `/monomyth`, see if the 12-fret grid resonates
- [ ] **Review his color/shape associations** — "For each of the 12 chromatic notes, what color and shape do you feel?"
- [ ] **Record a short welcome video** — 30–60 seconds for the landing page
- [ ] **Set his coaching prices** — Update `/studio` page with actual rates
- [ ] **Provide a bio + photo** — For the mentor section of the platform

### What We Need from Bertrand for Phase 2 (COMPLETE)

- [x] **Preference: `/mentor` dashboard or integrated?** — `/mentor` page built. Bertrand navigates directly.
- [x] **Submission review workflow** — Google Drive links in mentor dashboard. Bertrand clicks, reviews, types notes, marks reviewed.
- [ ] **Async coaching pricing** — Per submission? Monthly subscription? Bundled? (Still need decision)

### What We Need from Bertrand for the Brand

- [ ] **Color/shape mapping for 12 notes** — This unlocks: Chromatic Monomyth visual upgrades, personalized student avatars
- [ ] **Voice memo for Troubadour** — Record "Welcome, troubadour..." so the AI can clone his voice (Phase 3)
- [ ] **Favorite songs for each fret** — Real examples he uses in lessons, to replace placeholder content in Timeless Song slides

---

## Appendix A: The 12-Fret Tool Map (Sacred)

| Fret | Tone | Stage | Tool | Protocol | Game Phase |
|------|------|-------|------|----------|------------|
| 1 | C — Root | Call to Adventure | Breathing Gate | ©SHEARL | — |
| 2 | C# — m2 | Refusal of the Call | Practice Timer | ©SHEARL | — |
| 3 | D — M2 | Meeting the Mentor | Pitch Room | ©PLING! | — |
| 4 | D# — m3 | Crossing the Threshold | Metronome | ©SHEARL | — |
| 5 | E — M3 | Tests, Allies, Enemies | Interval Visualizer | ©SHEARL | — |
| 6 | F — P4 | Approach to the Inmost Cave | Fretboard Explorer | ©SHEARL | — |
| 7 | F# — TT | The Ordeal | PLING! Trainer | ©PLING! | — |
| 8 | G — P5 | The Reward | Microtonal Tracker | ©FHEAL | — |
| 9 | G# — m6 | The Road Back | **Vertiscale Engine** ⭐ | ©SHEARL | Phase 1: Flash |
| 10 | A — M6 | The Resurrection | Async Assessor | ©FHEAL | Phase 2: Orbs |
| 11 | A# — m7 | Return with the Elixir | Multi-Key Hub | ©FHEAL | Phase 3: Freeplay |
| 12 | B — M7 | Master of Two Worlds | Rhythm Engine | ©FHEAL | Adventure Mode |

---

*Document written 2026-05-27. Last reviewed 2026-05-27. Next review: after login testing and ScaffoldingProvider sync.*
