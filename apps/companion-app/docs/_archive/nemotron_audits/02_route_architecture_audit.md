---
title: 02_route_architecture_audit
status: archive
tags: []
date: 2026-06-14
---
## Voix Vive – Beta‑Cleanup Audit & Navigation Redesign  
*Goal: shrink the public surface to **5 primary destinations** (Home, Song lessons, Player practice, Academy/Binder, RIFT jam/creative) while preserving core beta functionality and moving everything else into modals, sub‑routes or a hidden developer panel.*

---

### 1️⃣ Route Audit – What stays, what moves, what dies  

| Current Path | Component (file name) | Essential for Beta? | Recommended Treatment* | Rationale |
|--------------|-----------------------|---------------------|------------------------|-----------|
| **/**        | `LandingScreen.jsx`  | ✅ Yes – entry point & CTA to onboarding/lesson hub | Keep as top‑level Home (`/`). No change. |
| `/onboarding`| `Onboarding.jsx`     | ⚠️ Needed for first‑time users but **modal** is enough (no separate page) | Convert to a modal triggered from LandingScreen on first visit; keep route only as fallback (`/onboarding`) – hidden from nav. |
| `/song`      | `OrientationHub.jsx`  *(lesson hub)*   | ✅ Yes – core “Song” destination for beta lessons (choose song → lesson detail) | Keep top‑level **Song** at `/song`. Add optional sub‑route `:id` for individual lesson pages (`/song/:slug`). |
| `/guitar/map`| `MaturationMap.jsx`   *(theory map / advanced view)*  | ❌ Not needed in beta – belongs to creative exploration (RIFT) or dev panel. | Move under **RIFT** as a sub‑route: `/rift/theory` (`/rifttheory`?). Hide from primary nav; expose only inside RIFT hub if desired for power users later. |
| `/player`    | `PlayerPortal.jsx`   *(practice / play‑along)*  | ✅ Yes – core “Player” destination (metronome, backing tracks, recording) | Keep top‑level **Player** at `/player`. No sub‑routes needed now; internal state handles session selection. |
| `/workbook`  | `Workbook.jsx` *(was /playbook)*   → rename to Binder/Academy content hub (curriculum summary, PDFs, progress tracker)    | ✅ Yes – core “Academy/Binder” destination for beta curriculum & reference material | Rename route to **/binder** (more intuitive). Keep as top‑level binder. Inside: <br>• `/binder/curriculum` → `CurriculumSummary.jsx`<br>• `/binder/resources` → static PDF list<br>*(optional) /binder/community* if you want a lightweight forum view – otherwise move CommunityHub to dev panel or hide behind a “Learn More” link. |
| `/privacy`   | `PrivacyPolicy.jsx` (simple static)  | ⚠️ Legal required but low‑impact UI; can be footer link, not nav item. | Keep route for SEO/legal compliance (`/privacy`) **but remove from primary nav**; expose via footer modal/link. |
| `/terms`     | `TermsOfService.jsx` (simple static)  | Same as privacy – keep route, hide from nav. | See above. |
| `/studio`    | `StudioPage.jsx` *(overall studio landing)*   | ❌ Overlap with Player & Binder; not a distinct beta destination. | Remove or fold into **Player** (as “Studio” tab inside player) – keep route only as redirect to `/player`. |
| `/studio/prompter`  `SomaticStudioPrompter.jsx` *(guided somatic prompts)*   | ❌ Advanced/creative tool → belongs in RIFT or dev panel. | Move under **RIFT** (`/rift/prompter`) as a modal/sub‑page; hide from top nav. |
| `/summary`    `CurriculumSummary.jsx` (stand‑alone page)  | ✅ Content needed, but already part of Binder → duplicate. | Remove standalone route; keep component used inside `/binder/curriculum`. Delete `/summary` route file. |
| `/ai-developer`   `AIDeveloperChat.jsx` *(local LM Studio chat for devs)*    | ❌ Developer‑only tool – not for learners. | Move to **Developer Panel** (`/dev/ai-chat`) guarded by env var `VITE_ENABLE_DEV_PANEL=true`. Remove from public nav. |
| `/poc`       `ResonantMirrorPOC.jsx` *(experimental audio‑visual demo)*   | ❌ Proof‑of‑concept – dev/UX test only. | Same as above: hidden dev panel (`/dev/poc`). |
| `/game`      `VertiscaleEngine.jsx`  *(gamified practice / scoring mini‑game)*    | ✅ Creative/jam element → fits **RIFT** (jam/creative). | Nest under RIFT: `/rift/game`. Keep component; no top‑level nav entry. |
| `/adventure` `AdventurePlayer.jsx` *(narrative‑driven practice adventure)*   | Same as game – creative jam. | Nest under RIFT: `/rift/adventure`. |
| `/auth/callback`  (Supabase redirect)    | Internal auth handler – **must stay** for OAuth flow, but never appears in UI. | Keep route (`/auth/callback`) unchanged; no nav exposure. |
| `/monomyth`   `ChromaticMonomyth.jsx` *(deep theory / archetype mapping)*  | ❌ Advanced theory → dev panel or future RIFT extension (optional). | Hide in dev panel (`/dev/monomyth`). If you want a “theory explorer” for power users later, expose as `/rift/theory/monomyth` but not beta. |
| `/mentor`    `MentorDashboard.jsx` *(auth‑guarded instructor view)*   | ❌ Not needed for learner beta; instructor flow can be added post‑beta. | Guard route (`/mentor`) and hide from public nav; keep for future rollout. |
| `/inner-circle`  `MentorshipBlog.jsx` *(blog / community posts)*    | ❌ Nice‑to‑have but not core beta learner experience. | Move to dev panel or optional “Community” tab inside Binder (low priority). For now, kill route (`/inner-circle`). |
| `/community`   `CommunityHub.jsx`  *(forum / jam showcase)*      | ⚠️ Social features can be deferred; if you want a lightweight showcase, embed as a sub‑tab in Binder or RIFT. | Option A: keep as `/community` **but** remove from primary nav (footer link). <br>Option B: fold into `/binder/community` (simple list of posts) and delete standalone route. |
| `/walking`   `WalkingModeEngine.jsx` *(ambient walk‑through practice)*    | ❌ Experimental modal – not core beta. | Hide in dev panel (`/dev/walking`) or kill if no immediate plan. |
| `/human-octave`  `HumanOctaveLibrary.jsx` *(scale / interval library)*   | ❌ Reference library → could be part of Binder resources or RIFT theory explorer. | Move under **Binder** (`/binder/reference/octave`) *or* under **RIFT** (`/rift/theory/octave`). No top‑level nav needed. |
| `/ai-developer` (duplicate) – see above. |

\* **Treatment legend**  
- **Keep as top‑level** → remains one of the 5 primary destinations.  
- **Modal / first‑time flow** → component stays but accessed via modal, not a separate page in nav.  
- **Sub‑route of new destination** → nested under one of the 5 hubs (e.g., `/rift/game`).  
- **Hidden developer panel** → moved under a dev‑only prefix (`/dev/*`) guarded by feature flag; not shipped to production beta unless explicitly enabled.  
- **Kill / remove** → delete file & route; no beta impact.

---

### 2️⃣ The Clean 5‑Destination Navigation Structure  

| Destination | Public URL (top‑level) | Core Component(s) | Quick Description |
|-------------|------------------------|-------------------|-------------------|
| **Home**    | `/`                    | `LandingScreen.jsx` | Hero CTA → Onboarding modal → jump to Song or Player. |
| **Song**    | `/song`                | `OrientationHub.jsx` (lesson hub) + optional `/song/:slug` for detail view | Browse curriculum songs, pick a lesson, launch into Player or view theory. |
| **Player**  | `/player`              | `PlayerPortal.jsx` | Practice space: metronome, backing tracks, recording, somatic prompts (imported from RIFT if needed). |
| **Binder / Academy** | `/binder` (renamed from `/workbook`) | `Workbook.jsx` (now `Binder.jsx`) + sub‑pages: <br>• `/binder/curriculum` → `CurriculumSummary.jsx`<br>• `/binder/resources` → PDF list<br>*(optional) `/binder/community`* | Central repository: lesson PDFs, progress tracker, reference library, lightweight community feed. |
| **RIFT (Jam / Creative)** | `/rift`                | New container `RiftHub.jsx` that lazily loads creative modules: <br>• `/rift/game` → `VertiscaleEngine.jsx`<br>• `/rift/adventure` → `AdventurePlayer.jsx`<br>• `/rift/prompter` → `SomaticStudioPromplet.jsx`<br>• `/rift/theory` → optional theory explorer (MaturationMap, HumanOctaveLibrary) | Open‑ended creative playground: gamified challenges, adventure narratives, somatic prompts, theory sandbox – all under the “RIFT” banner. |

**Nav UI suggestion** (top bar or side drawer):  
```
[ Home ] [ Song ] [ Player ] [ Binder ] [ RIFT ]
```
*No dropdowns needed for beta; each destination lands on its hub page.*

---

### 3️⃣ Hidden Features → Developer Panel  

Create a **dev‑only** area (e.g., `/dev/*`) that is only rendered when `import.meta.env.VITE_ENABLE_DEV_PANEL === 'true'` (set via `.env` for local/dev builds).  

| Dev Path | Component | Purpose |
|----------|-----------|---------|
| `/dev/ai-chat` | `AIDeveloperChat.jsx` | Local LM Studio chat for prompt engineering / debugging. |
| `/dev/poc` | `ResonantMirrorPOC.jsx` | Audio‑visual proof‑of‑concept experiments. |
| `/dev/monomyth` | `ChromaticMonomyth.jsx` | Deep theory / archetype mapping (future). |
| `/dev/walking` | `WalkingModeEngine.jsx` | Ambient walk‑through mode (experimental). |
| `/dev/studio-prompter` | `SomaticStudioPrompter.jsx` | Somatic prompting tool (if you want to keep it for internal testing). |

All other routes listed above that are **not** in the 5‑dest list should either be removed (`kill`) or redirected to one of the five hubs (see mapping below).

---

### 4️⃣ Mapping Current Routes → RIFT Concept  

| Original Route | Component | RIFT Sub‑path (suggested) | Notes |
|----------------|-----------|--------------------------|-------|
| `/game`        | `VertiscaleEngine.jsx`      | `/rift/game`            | Core gamified jam – stays inside RIFT. |
| `/adventure`   | `AdventurePlayer.jsx`       | `/rift/adventure`       | Narrative‑driven creative practice. |
| `/studio/prompter` | `SomaticStudioPrompter.jsx` | `/rift/prompter`      | Somatic breathing / posture prompts – creative aid. |
| `/guitar/map`  | `MaturationMap.jsx`         | `/rift/theory/maturation` (or `/rift/theory`) | Theory map – optional “deep dive” inside RIFT. |
| `/human-octave`| `HumanOctaveLibrary.jsx`    | `/rift/reference/octave`| Scale/interval library – reference for jam. |
| *(optional)*   | *Future theory explorer*     | `/rift/theory`        | Placeholder for any additional theory widgets (e.g., circle of fifths). |

All RIFT sub‑routes are **lazy‑loaded** via `React.lazy` inside `RiftHub.jsx` to keep the initial bundle small.

---

### 5️⃣ Routes to REMOVE Before Beta (with rationale)

| Route | Reason for Removal |
|-------|--------------------|
| `/onboarding` (as standalone page) | Onboarding is a **modal** flow; keeping a separate page adds unnecessary navigation depth and can confuse users who land directly on it. Keep only as fallback (`/onboarding`) hidden from nav. |
| `/guitar/map` | Advanced theory map – not needed for core beta lessons; belongs under RIFT or dev panel. |
| `/studio` & `/studio/prompter` | Studio landing duplicates Player/Binder concepts; promper is a creative tool → move to RIFT/dev. |
| `/summary` (standalone) | Duplicates content already in Binder (`/binder/curriculum`). Remove to avoid SEO cannibalisation and extra bundle weight. |
| `/ai-developer` | Developer‑only AI chat – no value for learners; shift to dev panel. |
| `/poc` | Proof‑of‑concept experiment – not part of learner experience. |
| `/monomyth` | Advanced theory archetype – out of scope for beta; hide in dev panel or postpone. |
| `/mentor` & `/inner-circle` | Instructor‑focused and community blog – beyond MVP learner flow. Keep routes guarded but hidden from nav; can be re‑enabled later. |
| `/community` (as top‑level) | Social features can be deferred; if you want a placeholder, expose as a footer link or embed lightly inside Binder (`/binder/community`). Remove top‑level nav entry to keep 5 destinations clean. |
| `/walking` | Experimental ambient mode – not essential for beta; move to dev panel or discard. |

**Result:** After these removals the public route set shrinks to exactly the five hubs plus a few internal/fallback routes (`/auth/callback`, `/privacy`, `/terms`) that are invisible to the primary navigation.

---

### 6️⃣ Proposed URL Structure (post‑cleanup)

```
/
   └─ LandingScreen (Home)

/onboarding          ← fallback modal only (hidden from nav)

/song                ─► OrientationHub (lesson hub)
   └─ /song/:slug    ─► LessonDetail (lazy-loaded, optional)

/player              ─► PlayerPortal (practice space)

/binder              ─► Binder (Academy hub)
   ├─ /binder/curriculum ─► CurriculumSummary
   ├─ /binder/resources  ─► PDF/Resource list
   └─ /binder/community  ─► lightweight community view (optional)

/rift                ─► RiftHub (Jam/Creative playground)
   ├─ /rift/game          ─► VertiscaleEngine
   ├─ /rift/adventure     ─► AdventurePlayer
   ├─ /rift/prompter      ─► SomaticStudioPrompter
   ├─ /rift/theory        ─► (optional) Theory explorer (MaturationMap, HumanOctaveLibrary)
   └─ /rift/reference/octave ─► HumanOctaveLibrary

/auth/callback       ← Supabase OAuth redirect (internal)

/privacy             ← footer link only
/terms               ← footer link only

/dev/*              ← developer panel (guarded by VITE_ENABLE_DEV_PANEL flag)
```

*All lazy‑loaded components (`React.lazy`) keep the initial bundle < 200 KB gzipped for beta.*

---

### ✅ Quick Action Checklist for the Team  

1. **Rename** `/workbook` → `/binder` (update `Workbook.jsx` → `Binder.jsx`, adjust imports).  
2. **Create** `RiftHub.jsx` under `src/screens/` with lazy loads for game, adventure, prompter, theory/reference.  
3. **Move** components to their new locations (`VertiscaleEngine.jsx` stays where it is but import path changes in RiftHub).  
4. **Convert** `/onboarding` logic to a modal triggered from `LandingScreen` on first visit (store a flag in `localStorage`).  
5. **Strip out** nav links for all removed routes (`/studio`, `/summary`, `/ai-developer`, etc.). Keep the route definitions only if they serve as internal redirects or fallbacks; otherwise delete the files.  
6. **Add** dev‑panel guard: wrap `<DevPanelRoutes>` in `<>{import.meta.env.VITE_ENABLE_DEV_PANEL && <DevPanelRoutes/>}</>`.  
7. **Update** `App.jsx`/`router.js` to reflect the new top‑level paths (`/`, `/song`, `/player`, `/binder`, `/rift`). Keep `/auth/callback`, `/privacy`, `/terms` as low‑priority routes.  
8. **Run** bundle analysis (`vite build --mode beta`) → verify < 200 KB JS gzipped, no unused chunks.  
9. **QA**: test each of the five destinations on mobile & desktop; ensure modals (onboarding, privacy/terms) work via footer links or profile menu.  

---

**Result:** A lean, purpose‑driven navigation set that puts the learner’s journey front‑and‑center while preserving all creative and experimental capabilities behind the scenes for future iterations or internal testing. 🎸🚀