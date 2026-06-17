---
title: 04_pearl_player
status: archive
tags: []
date: 2026-06-14
---
## 🎯 PEARL Audit – **PlayerPortal.jsx**  
*Online guitar academy “Voix Vive” – mentor‑connection hub for student recordings & reflection.*

---  

### 1️⃣ PEARL Header (summary per pillar)

| Pillar | Observation | Impact |
|--------|-------------|--------|
| **Perspective** | The page centers the *student as observer* (“The Player is the one who observes”). UI avoids gamification, keeps focus on vulnerability & mentor dialogue. Strong alignment with somatic‑first pedagogy. | High – reinforces brand promise; differentiates from LMS‑style platforms. |
| **Engineering** | Heavy use of IndexedDB (`db.recordings`, `db.outbox`, `db.journal`), Supabase/R2 sync, lazy‑loaded service modules, memoized timelines. Works offline → online sync is solid but scattered across several effect hooks. | Medium‑High – functional but risk of stale state if sync fails; could benefit from a unified data‑layer hook. |
| **Aesthetic** | Dark‑toned, muted earth palette with Lucide icons; generous whitespace; hero cards use subtle borders & background tints. Visual hierarchy is clear (header → profile bar → workload banner → hero section). No decorative flourishes that distract from core actions. | High – feels contemplative, matches “mirror” metaphor. |
| **Research** | Uses locale hook, traction data, completed frets, streak/practice minutes from ScaffoldingProvider. Pulls journal & submissions for timeline. All data‑driven UI elements are present but not surfaced as insights (e.g., no trend charts). | Medium – data is collected; opportunity to surface reflective metrics. |
| **Layout** | Single‑column layout on desktop; responsive stacking of tabs and cards works but hero section can feel cramped on narrow screens (<360 px). Tab bar uses underline indicator; active tab color contrast could be stronger for accessibility. | Medium – layout is functional; minor tweaks improve readability & touch targets. |

---  

### 2️⃣ Feature Inventory (every interactive element)

| Area | Element | Type | State / Behavior |
|------|---------|------|------------------|
| Header | **Back button** (`navigate('/')`) | Button – icon only | Navigates to home |
| Profile Bar | **Student name** (text) | Static display (clickable? no) | Shows `studentName` |
|  | **Frets explored** (text) | Static display | Shows count of completed frets |
|  | **Day streak** (icon + number) | Static display | Shows `streak` |
|  | **Practice minutes** (icon + number) | Static display | Shows `practiceMinutes` |
|  | **Recordings count** (icon + number) | Static display | Shows `submissions.length` |
| Workload Banner | **AlertCircle icon** | Static (color changes) | Visual cue of mentor availability |
|  | **Workload message** (text) | Static | Shows `workload.message` |
|  | **Alternative text‑back hint** (conditional) | Static | Shown when `workload.alternative === 'text-back'` |
| Hero Section – Record for Bertrand | **Video icon** | Static | — |
|  | **“Record for Bertrand” heading** | Static | — |
|  | **Subtitle** | Static | — |
|  | **Description paragraph** | Static | — |
|  | **Start Recording button** (`Mic` + text) | Button – toggles `showRecorder` | Opens `PracticeRecorder` modal |
| Hero Section – Guided Session | **Wind icon** (styled card) | Static | — |
|  | **Guided 15‑Minute Session heading** | Static | — |
|  | **Subtitle** | Static | — |
|  | **Description paragraph** | Static | — |
|  | **Start Guided Session button** (`Wind` + text) | Button – toggles `showStructuredRecorder` | Opens `StructuredPracticeRecorder` modal |
| Pending Reviews Card (conditional) | **AlertCircle icon** | Static | — |
|  | **Text showing count of unreviewed submissions** | Static | — |
| Tab Bar | **Your Loom** (`Heart`) | Button – sets `activeTab='loom'` | Shows `<TroubadourLoom />` |
|  | **Submissions** (`Send`) | Button – sets `activeTab='submissions'` | Lists submissions |
|  | **Bertrand's Library** (`Film`) | Button – sets `activeTab='library'` | Shows video library grid |
|  | **Your Timeline** (`Calendar`) | Button – sets `activeTab='timeline'` | Shows unified timeline |
| Submissions Tab (when active) | **Empty state illustration** (`Video` icon) | Static | — |
|  | **Submission cards** (each recording) | Clickable card → calls `playRecording(sub)` | Plays video/audio from IndexedDB outbox; on hover changes border color |
| Library Tab (when active) – *not shown in snippet but implied* | Likely maps over `VIDEO_LIBRARY` array, each item clickable to play/video modal. | — | — |
| Timeline Tab (when active) | Renders items from `timeline` memo (submissions + journal entries). Each item likely displays title, timestamp, type‑specific badge. | — | — |
| Modals (implicit) | **PracticeRecorder** & **StructuredPracticeRecorder** components (imported) – triggered by `showRecorder` / `showStructuredRecorder`. | Modal UI (not in file) | Handles recording, saving, then calls `handleRecordingSaved` / `handleStructuredSaved`. |
| Video Playback (triggered from submission card) | **playRecording(sub)** → creates blob URL, sets `selectedVideo`, shows modal (not shown). Close via `closeVideoModal()` which revokes URL. | — | — |

---  

### 3️⃣ Cognitive Load Score & Rationale  

| Dimension | Rating (1‑5) | Why |
|-----------|--------------|-----|
| **Intrinsic Load** (complexity of the task) | **2** | Core task: record a video → submit → wait for feedback. Straightforward, no branching workflows. |
| **Extraneous Load** (poor UI that adds effort) | **3** | Multiple modals, scattered data‑loading effects, and duplicated “reload submissions” logic increase mental overhead. The tab bar adds a layer of navigation before seeing content. |
| **Germane Load** (effort toward learning/reflection) | **4** | Timeline, journal, and workload banner encourage reflection; the design invites the student to think about their practice. |

**Overall Cognitive Load:** **≈ 3.0 / 5** – moderate. The page is usable but could be streamlined to lower extraneous load (especially around data sync & modal management) while preserving germane load for reflective learning.

---  

### 4️⃣ Primary / Secondary / Hidden Classification  

| Classification | Elements (always visible / one tap / dev‑only) |
|----------------|-----------------------------------------------|
| **PRIMARY** (always visible, core to the “Record for Bertrand” flow) | • Header (back button + title)  <br>• Profile bar (quick stats – optional but always present) <br>• Workload banner (if mentor availability matters) <br>• Hero section: **Record for Bertrand** card (icon, title, description, **Start Recording** button) |
| **SECONDARY** (one tap away from primary view) | • Tab bar (Loom / Submissions / Library / Timeline)  <br>• Guided Session card (secondary CTA) <br>• Pending reviews notice <br>• Submission list / library grid / timeline view (each accessed via a tab) |
| **HIDDEN** (developer‑only, debug, or rarely needed) | • Legacy localStorage fallback parsing (commented as “Legacy fallback”)  <br>• Console warnings for missing tables (`[PlayerPortal] No recordings table:`)  <br>• Outbox sync to R2 (runs silently in `useEffect`)  <br>• Cloud submission loaders (Drive, Supabase) – they run in background; user never sees them unless they fail. |

---  

### 5️⃣ Five Specific, Actionable Improvements for Beta  

| # | Recommendation | File / Location | Code‑Ready Sketch |
|---|----------------|-----------------|-------------------|
| **1** | **Unify data‑loading with a custom hook** (`usePlayerData`) to eliminate duplicated `useEffect` reload logic and centralize error handling. | Create `src/hooks/usePlayerData.js` | ```js\nexport function usePlayerData(userId) {\n  const [submissions, setSubmissions] = useState([]);\n  const [loading, setLoading] = useState(true);\n  useEffect(() => {\n    async function load() {\n      try {\n        // local + cloud merges (same as current)\n        const recs = await fetchAndMergeSubmissions(userId);\n        setSubmissions(recs);\n      } finally { setLoading(false); }\n    }\n    if (userId) load();\n  }, [userId]);\n  return { submissions, loading };\n}\n```<br>Then replace the large `useEffect` in `PlayerPortal.jsx` with `{ submissions, loading } = usePlayerData(user?.id);` and show a spinner when `loading`. |
| **2** | **Debounce & deduplicate submission reload** after a recording is saved to avoid rapid successive state updates. | In `handleRecordingSaved` / `handleStructuredSaved` (same file) | ```js\nconst handleRecordingSaved = useCallback(() => {\n  setShowRecorder(false);\n  // debounce 300ms\n  if (reloadTimer) clearTimeout(reloadTimer);\n  reloadTimer = setTimeout(async () => {\n    try {\n      const recs = await db.recordings.orderBy('timestamp').reverse().toArray();\n      setSubmissions(recs);\n    } catch (e) { console.warn(e); }\n  }, 300);\n}, [reloadTimer]);\n``` |
| **3** | **Improve accessibility of tab indicators** – increase contrast and add `aria‑selected`. | TabBar JSX (lines ~260‑285) | ```jsx\n<button\n  onClick={() => setActiveTab('loom')}\n  aria-selected={activeTab === 'loom'}\n  style={{ ...styles.tabBtn, borderBottomColor: activeTab === 'loom' ? '#c9a96e' : 'transparent', color: activeTab === 'loom' ? '#c9a96e' : 'rgba(255,255,255,0.3)' }}\n>\n  <Heart size={14} /> Your Loom\n</button>\n```<br>Also ensure the underline has a minimum 3:1 contrast against background (consider `#c9a96e` → `#e8dcc8` on dark). |
| **4** | **Lazy‑load heavy modals** (`PracticeRecorder`, `StructuredPracticeRecorder`) with React.lazy + Suspense to reduce initial JS bundle. | At top of file replace imports | ```js\nconst PracticeRecorder = React.lazy(() => import('./PracticeRecorder'));\nconst StructuredPracticeRecorder = React.lazy(() => import('./StructuredPracticeRecorder'));\n```\nThen wrap the modal rendering: <br>```jsx\n{showRecorder && (\n  <React.Suspense fallback={<div>Loading…</div>}>\n    <PracticeRecorder onSaved={handleRecordingSaved} />\n  </React.Suspense>\n)}\n``` |
| **5** | **Surface a quick insight metric** in the profile bar (e.g., “Average feedback latency”) to turn collected data into germane load. | ProfileBar JSX + new state from submissions | ```js\nconst avgLatency = useMemo(() => {\n  const reviewed = submissions.filter(s => s.reviewed && s.feedback);\n  if (!reviewed.length) return null;\n  const now = Date.now();\n  const total = reviewed.reduce((sum, s) => sum + (now - new Date(s.timestamp).getTime()), 0);\n  return Math.round(total / reviewed.length / (1000 * 60 * 60)); // hours\n}, [submissions]);\n```\nRender: <br>```jsx\n{avgLatency !== null && (\n  <div style={styles.profileStat}>\n    <MessageSquare size={14} style={{ color: 'rgba(201,169,110,0.5)' }} />\n    <span>{avgLatency}h</span>\n    <span>avg. feedback latency</span>\n  </div>\n)}\n``` |

---  

### 6️⃣ What Belongs in **RIFT** vs **Player**?  

*(Assuming RIFT is the “instructor/mentor” side of the app – not shown in the snippet but implied by product docs.)*

| Concern | Player (Student) | RIFT (Mentor/Bertrand) |
|---------|------------------|------------------------|
| **Core UI** | Recording, submitting, viewing personal library/timeline, journaling. | Review queue, annotating submissions, sending feedback, managing workload settings. |
| **Data Ownership** | Local recordings (`db.recordings`), personal journal, traction/fret progress. | Supabase `submissions` table (mentor‑side), feedback entries, mentor availability (`workload`). |
| **Navigation Tabs** | Loom (personal reflections), Submissions (my recordings), Library (Bertrand’s videos), Timeline (combined). | Inbox (new submissions), Reviewed (completed feedback), Settings (availability, pricing), Library (same video catalog for reference). |
| **Modals** | `PracticeRecorder`, `StructuredPracticeRecorder`. | Feedback editor (text + audio/video annotation), scheduling modal (set availability). |
| **Analytics** | Streak, practice minutes, completed frets, journal mood trends. | Submission volume per day, average response time, student retention metrics. |

*Any feature that lets the mentor *act on* a submission (annotate, approve, schedule) belongs in RIFT; anything that is purely *student‑centric* (recording, personal reflection, viewing own timeline) stays in Player.*

---  

### 7️⃣ UX Comparison – GarageBand, Yousician, JamPlay  

| Dimension | Voix Vive – PlayerPortal | GarageBand (iOS/macOS) | Yousician | JamPlay |
|-----------|--------------------------|------------------------|-----------|---------|
| **Primary Goal** | Async mentor feedback + reflective practice. | Music creation / multitrack recording. | Interactive lesson flow with real‑time feedback. | Video‑based course library + downloadable tabs. |
| **Onboarding Flow** | Minimal – straight to “Record for Bertrand”. | Project template chooser; can feel overwhelming for beginners. | Guided path, skill‑tree, immediate play‑along. | Course catalog browse; requires selecting a series before playing. |
| **Cognitive Load** | Moderate (focus on one action). | High (many tracks, effects, mixing UI). | Low‑Medium (structured lessons but many UI elements: timer, score, avatar). | Medium (video player + sidebar navigation). |
| **Reflection Tools** | Journal entries, timeline of submissions + mood. | No built‑in reflection; relies on external notes. | Practice stats (streaks, scores) but no free‑form journal. | Limited – course completion badges only. |
| **Mentor Interaction** | Async video review by a specific human mentor. | None (self‑directed). | AI‑driven real‑time feedback; limited human interaction. | Instructor videos only; no personal feedback loop. |
| **Design Aesthetic** | Dark, earthy, contemplative, icon‑heavy (Lucide). | Dark workspace with colorful waveform tracks; professional DAW feel. | Bright, gamified, cartoon‑like avatars and progress bars. | Clean, video‑focused, neutral background; less personality. |
| **Offline / Sync** | IndexedDB + Supabase/R2 sync – works offline then uploads. | Primarily online (iCloud optional). | Requires internet for lesson streaming & AI feedback. | Videos stream; downloadable for offline (paid). |
| **Unique Strength** | Somatic, breath‑first pedagogy + human mentor loop. | Powerful multitrack recording & mixing. | Adaptive real‑time note detection & gamification. | Massive library of song lessons from varied artists. |

**Takeaway:**  
- Voix Vive’s *player* experience is deliberately **simpler and more contemplative** than GarageBand (which targets producers) and less gamified than Yousician, aligning with its somatic‑first, mentor‑centric philosophy.  
- Compared to JamPlay, it adds a **personal feedback loop** and reflective journaling that JamPlay lacks, giving it a stronger “coach” feel despite being asynchronous.

---  

## ✅ Summary for Beta Launch  

1. **Extract data loading into `usePlayerData`** – reduces bugs, centralizes loading states.  
2. **Debounce submission reloads** after recordings to avoid thrashing UI.  
3. **Boost tab accessibility** (ARIA + contrast).  
4. **Lazy‑load heavy recorder modals** with React.lazy/Suspense for faster initial paint.  
5. **Add a lightweight insight metric** (average feedback latency) in the profile bar to turn collected data into germane load and reinforce the reflective loop.  

Implementing these five items will lower extraneous load, improve perceived performance, and make the PlayerPortal feel more polished and *mentor‑ready* for the beta launch. 🎸🚀