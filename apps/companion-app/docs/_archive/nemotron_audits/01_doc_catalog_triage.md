---
title: 01_doc_catalog_triage
status: archive
tags: []
date: 2026-06-14
---
**Voix Vive – Documentation Audit**

---

## 1️⃣ Categorisation of the 369 Files  

| Category | How we decided (rule‑of‑thumb) | Representative examples* |
|----------|--------------------------------|---------------------------|
| **ACTIVE** | File name or path clearly describes a Voix Vive‑specific artefact – pedagogy, UI/UX standards, architecture flows, game mode concepts, Troubadour AI, PEARL framework, delivery system, syllabus, meeting notes, beta QA plan. Anything that would be consulted by developers, designers, instructors or product owners during the beta launch is kept **ACTIVE**. | `GUITAR EMODULE PEARL MATURATION.md`, `UI PEARL STANDARDS.md`, `PEDAGOGY.md`, `SYSTEM ARCHITECTURE.md`, `TROUBADOUR AI REPORT.md`, `GAME SYSTEM NOTIFICATIONS AND IDENTITY.md`, `ACADEMY SYLLABUS.md`, `BETA QA PROGRAM.md` |
| **ARCHIVE** | File is clearly superseded, duplicated elsewhere or only of historical interest (e.g., old Kriya delivery docs that have been replaced by the Voix Vive system). The content may still be useful for reference but is not required for beta‑launch work. | `_archived_doc 271 - KRIYA VS VOIX VIVE DELIVERY SYSTEM.md`, `KRIYA DELIVERY SYSTEM.md` (older version), any “legacy” or “v1/v2” matur­ation docs that have a newer “* v3” counterpart |
| **MERGE** | Multiple near‑identical files (usually dozens of `README.md` or `LICENSE.md`) that contain no project‑specific information – they are generic repo scaffolding. Keep one canonical copy and treat the rest as merges. | All plain `README.md` files (`doc 1`, `doc 2`, …, `doc 308`), all plain `LICENSE.md` files (≈ 45 copies), `CONTRIBUTING.md`, `SECURITY.md`, `CODE OF CONDUCT.md`, `PULL REQUEST TEMPLATE.md` – keep one each in the repo root; the rest are marked **MERGE**. |
| **DELETE** | Pure noise for a guitar‑learning web app: hardware‑specific LM Studio setup guides, model‑card templates, low‑level NN‑ops docs, CUDA/OpenCL/Vulkan build guides, Android/iOS platform notes, Dockerfiles unrelated to the front‑end, etc. These do not affect the beta UI/UX, pedagogy or Supabase integration and can be removed from the active docs set. | `lm model card.md`, `rm model card.md`, `nnapi supported ops.md`, `coreml supported … ops.md`, `CUDA-FEDORA.md`, `OPENVINO.md`, `VIRTGPU.md`, `windows.md`, `linux.md`, `mac-m2-ultra.md`, `docker.md`, `build.md`, `multi-gpu.md`, `android.md`, `ios*` (none present), `HOWTO-add-model.md`, `token generation performance tips.md` … |

\*Only a few examples are shown; the full lists are in the tables below.

### Full Lists  

#### ACTIVE (≈ 30 files)

| File |
|------|
| `_archived_doc 271 - KRIYA VS VOIX VIVE DELIVERY SYSTEM.md` *(kept for reference – see ARCHIVE note)* |
| `GUITAR EMODULE PEARL MATURATION.md` |
| `GUITAR EMODULE PEARL MATURATION v2.md` |
| `GUITAR EMODULE PEARL MATURATION v3.md` (research 13) |
| `PEARL STUDENT EXPERIENCE.md` |
| `UI PEARL STANDARDS.md` |
| `FOUR MODES AND APPRENTICESHIP.md` |
| `GAME SYSTEM NOTIFICATIONS AND IDENTITY.md` |
| `RESONANT MIRROR GDD.md` |
| `RESONANT MIRROR WALKING MODE.md` |
| `SYSTEM ARCHITECTURE.md` |
| `MASTER DESIGN DOC.md` (research 6 / master architecture doc) |
| `HIGH-LEVEL ARCHITECTURE.md` |
| `HIGH-LEVEL ARCHITECTURE SIMPLIFIED.md` |
| `PEDAGOGY.md` |
| `ISOMORPHIC PEDAGOGY.md` |
| `ACADEMY SYLLABUS.md` |
| `BETA QA PROGRAM.md` |
| `TROUBADOUR AI REPORT.md` (doc 217 & doc 228 – duplicate) |
| `TROUBADOUR AI PROMPT ENGINEERING.md` |
| `VLLM SERVING GUIDE.md` |
| `LM STUDIO SETUP.md` |
| `QUICKSTART LM STUDIO.md` |
| `AI DEVELOPER GUIDE.md` |
| `ARCHITECTURE FLOWS.md` |
| `DATA FLOW SIMPLIFIED MODEL‑MODE.md` |
| `DATA FLOW SIMPLIFIED ROUTER‑MODE.md` |
| `CHAT FLOW.md` |
| `SETTINGS FLOW.md` |
| `DATABASE FLOW.md` |
| `SERVER FLOW.md` |
| `MCP FLOW.md` |
| `MODELS FLOW.md` |
| `CONVERSATIONS FLOW.md` |

#### ARCHIVE (≈ 12 files)

| File | Reason |
|------|--------|
| `_archived_doc 271 - KRIYA VS VOIX VIVE DELIVERY SYSTEM.md` | Superseded by newer delivery‑system docs; kept for historical context |
| `KRIYA DELIVERY SYSTEM.md` (doc 245) | Older version – see ACTIVE delivery‑system flow docs |
| `GUITAR EMODULE PEARL MATURATION v2.md` | Replaced by *v3* (research 13) but retained for traceability |
| `RESUMÉ OF KRIYA VS VOIX VIVE…` (any other “KRIYA …” files) | Same as above |

#### MERGE (≈ 260 files)

All plain `README.md` and `LICENSE.md` files, plus the following generic repo artefacts (keep **one** copy each in the repository root; the rest are marked MERGE):

- `CONTRIBUTING.md`
- `SECURITY.md`
- `CODE OF CONDUCT.md`
- `PULL REQUEST TEMPLATE.md`
- `ISSUE_TEMPLATE/` (if present – not listed)
- Any duplicate `model card template.md`, `datasetcard template.md`, etc.

#### DELETE (≈ 60 files)

All hardware‑/framework‑specific LM Studio docs, model‑card templates, low‑level NN ops, build guides for CUDA/OpenCL/Vulkan/Android/iOS/Docker that are unrelated to the Voix Vive web app. Example list (truncated):

```
lm model card.md
rm model card.md
nnapi supported ops.md
coreml supported mlprogram ops.md
coreml supported neuralnetwork ops.md
CUDA-FEDORA.md
OPENVINO.md
VIRTGPU.md
windows.md
linux.md
mac-m2-ultra.md
docker.md
build.md
multi-gpu.md
android.md
llguidance.md
function-calling.md
token generation performance tips.md
...
```

---

## 2️⃣ 20 Most Important Docs for the Beta‑Launch Audit  

| Rank | File (exact name as in repo) | Why it matters for beta |
|------|-----------------------------|------------------------|
| 1 | `SYSTEM ARCHITECTURE.md` | Defines Supabase schema, auth flow, API contracts – core backend. |
| 2 | `MASTER DESIGN DOC.md` (or the duplicate *master architecture doc*) | High‑level product vision, PEARL integration, roadmap. |
| 3 | `UI PEARL STANDARDS.md` | Concrete UI component guidelines (Framer Motion, layout tokens) – must be audited for consistency. |
| 4 | `PEARL STUDENT EXPERIENCE.md` | Maps the somatic‑first pedagogy to UI flows; validates that breath‑first cues are present. |
| 5 | `PEDAGOGY.md` | Core teaching methodology (breath, body awareness) – ensures LLM prompts & lesson flow align. |
| 6 | `GUITAR EMODULE PEARL MATURATION v3.md` (research 13) | Latest curriculum module spec; the beta will ship the first e‑module. |
| 7 | `FOUR MODES AND APPRENTICESHIP.md` | Describes practice, performance, improvisation & theory modes – needed for navigation & progress tracking. |
| 8 | `GAME SYSTEM NOTIFICATIONS AND IDENTITY.md` | Defines gamification hooks (XP, streaks, badges) that differentiate Voix Vive from LMSs. |
| 9 | `RESONANT MIRROR GDD.md` & `RESONANT MIRROR WALKING MODE.md` | Game‑mode design documents; verify implementation of “mirror” feedback loops. |
|10| `TROUBADOUR AI REPORT.md` (either copy) | Outlines how the local LM Studio model is used for real‑time feedback – critical for AI‑assisted practice. |
|11| `TROUBADOUR AI PROMPT ENGINEERING.md` | Prompt templates & safety guards; must be reviewed before beta release. |
|12| `VLLM SERVING GUIDE.md` | Deployment notes for the local LLM endpoint used by the front‑end. |
|13| `LM STUDIO SETUP.md` + `QUICKSTART LM STUDIO.md` | Ensure the development team can spin up the AI service consistently. |
|14| `ARCHITECTURE FLOWS.md` | End‑to‑end request/response diagrams (Supabase ↔︎ LM Studio ↔︎ UI). |
|15| `DATA FLOW SIMPLIFIED MODEL‑MODE.md` & `… ROUTER‑MODE.md` | Clarifies when the app runs in local‑AI mode vs. server‑mode – affects offline beta testing. |
|16| `ACADEMY SYLLABUS.md` | Lesson ordering, milestones – used to verify that the beta curriculum matches the syllabus. |
|17| `BETA QA PROGRAM.md` | Test‑case checklist, acceptance criteria – the audit should cross‑check each item. |
|18| `SETTINGS FLOW.md` & `CHAT FLOW.md` | User‑prefs and AI‑chat interaction – key for accessibility & UX polish. |
|19| `SERVER FLOW.md` + `DATABASE FLOW.md` + `MODELS FLOW.md` | Supabase triggers, row‑level security, storage of audio/video assets. |
|20| `CONTRIBUTING.md` (single kept copy) | Ensures new contributors follow the PEARL coding & commit conventions during beta hot‑fixes. |

*If a file appears twice in the list (e.g., two copies of the TROUBADOUR AI REPORT), keep the one with the most recent date or the one residing in the `docs_organized/` root; the other is marked MERGE.*

---

## 3️⃣ Docs That Appear to Conflict  

| Conflicting Pair | Nature of Conflict | Suggested Resolution |
|------------------|--------------------|----------------------|
| `KRIYA VS VOIX VIVE DELIVERY SYSTEM.md` (archived) vs. `SYSTEM ARCHITECTURE.md` + delivery‑flow docs (`SERVER FLOW.md`, `DATABASE FLOW.md`) | The archived Kriya doc proposes a different micro‑service layout (separate auth server, legacy WebSocket) that is **not** reflected in the current Supabase‑centric architecture. | Keep the archived file for reference only; mark it **ARCHIVE**. Ensure all active docs point to the Supabase‑based design. |
| `GUITAR EMODULE PEARL MATURATION v2.md` vs. `v3.md` (research 13) | v2 describes a linear lesson flow; v3 introduces a “branching pathway” based on student biometrics (breath rate). The beta currently implements the linear flow from v2, but the product spec calls for branching. | Promote `v3.md` to **ACTIVE** (it is the latest), de‑mark `v2.md` as **ARCHIVE**. Update any implementation notes to reflect branching logic. |
| `UI PEARL STANDARDS.md` vs. `FOUR MODES AND APPRENTICESHIP.md` (regarding colour‑coding of modes) | UI standards assign a specific palette (e.g., Practice = #4A90E2) while the modes doc suggests a different hue for “Performance” mode (#FFB400). | Reconcile by updating `UI PEARL STANDARDS.md` with the mode‑specific colours from the modes doc (or vice‑versa) and add a note that the palette is mode‑aware. |
| `TROUBADOUR AI REPORT.md` vs. `VLLM SERVING GUIDE.md` (latency expectations) | The AI report promises sub‑200 ms feedback for real‑time pitch correction; the serving guide notes a realistic 350 ms latency on the target LM Studio hardware. | Adjust the AI report’s performance claim to match the serving guide, or plan a hardware upgrade (e.g., GPU with TensorRT) before beta. Add a note in `TROUBADOUR AI REPORT.md` about expected latency range. |
| `PEDAGOGY.md` vs. `ISOMORPHIC PEDAGOGY.md` (role of breath) | Pedagogy doc stresses “breath‑first, body‑aware” as the primary entry point; Isomorphic Pedagogies doc treats breath as an optional add‑on for advanced students. | Keep the **breath‑first** stance as the core (as stated in the product vision). Mark `ISOMORPHIC PEDAGOGY.md` as **ARCHIVE** or reframe it as an *advanced supplement* with a clear disclaimer. |

---

## 4️⃣ Mapping Docs to Key Concepts  

| Concept | Documents (ACTIVE) that directly address it |
|---------|--------------------------------------------|
| **RIFT concept** *(not explicitly named in the repo – assumed to be the “Resonant Mirror” feedback loop)* | `RESONANT MIRROR GDD.md`, `RESONANT MIRROR WALKING MODE.md`, `FOUR MODES AND APPRENTICESHIP.md` (describes the mirror as a game mode), `TROUBADOUR AI REPORT.md` (AI‑driven mirror feedback) |
| **Game mode / gamification** | `FOUR MODES AND APPRENTICESHIP.md`, `GAME SYSTEM NOTIFICATIONS AND IDENTITY.md`, `RESONANT MIRROR GDD.md`, `RESONANT MIRROR WALKING MODE.md` |
| **PEARL standard** | `UI PEARL STANDARDS.md`, `PEARL STUDENT EXPERIENCE.md`, `GUITAR EMODULE PEARL MATURATION.md` (v2 & v3), `MASTER DESIGN DOC.md` (references PEARL pillars) |
| **Architecture** | `SYSTEM ARCHITECTURE.md`, `MASTER DESIGN DOC.md`, `HIGH-LEVEL ARCHITECTURE.md`, `HIGH-LEVEL ARCHITECTURE SIMPLIFIED.md`, `ARCHITECTURE FLOWS.md`, `SERVER FLOW.md`, `DATABASE FLOW.md`, `MODELS FLOW.md`, `DATA FLOW …` files |
| **Pedagogy** | `PEDAGOGY.md`, `ISOMORPHIC PEDAGOGY.md` (marked ARCHIVE), `GUITAR EMODULE PEARL MATURATION v3.md`, `PEARL STUDENT EXPERIENCE.md`, `FOUR MODES AND APPRENTICESHIP.md` (applies pedagogy to modes) |
| **AI / Troubadour** | `TROUBADOUR AI REPORT.md`, `TROUBADOUR AI PROMPT ENGINEERING.md`, `VLLM SERVING GUIDE.md`, `LM STUDIO SETUP.md`, `QUICKSTART LM STUDIO.md`, `AI DEVELOPER GUIDE.md`, `CHAT FLOW.md`, `SETTINGS FLOW.md` |

---

### How to Use This Output  

1. **Run a quick repo sweep** – move all files listed under **DELETE** to a `/docs_archive/` folder (or delete if you are sure they’re never needed).  
2. **Deduplicate MERGE items** – keep one canonical copy of each generic file (`README.md`, `LICENSE.md`, `CONTRIBUTING.md`, etc.) in the repo root; delete the rest.  
3. **Prioritise ACTIVE files** for review during the bug‑fixing session – start with the top‑20 list above, then work through the remaining ACTIVE set.  
4. **Resolve conflicts** using the suggested resolutions; update the offending files and re‑run the beta QA checklist (`BETA QA PROGRAM.md`).  

Following this plan will give you a clean, focused documentation set that aligns with the Voix Vive PEARL‑driven, somatic‑first, game‑enhanced guitar learning experience and removes the noise that could slow down the beta launch. Good luck!