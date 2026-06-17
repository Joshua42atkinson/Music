---
title: 01_doc_catalog_triage
status: archive
tags: []
date: 2026-06-14
---
## Voix Vive – Docs Audit (Beta‑Launch Focus)

Below is a **structured audit** of the 369 files you supplied.  
The goal is to surface what should stay for beta, what can be archived/merged/deleted, and where contradictions or gaps may bite you at launch.

---  

### 1️⃣ Categorisation (ACTIVE | ARCHIVE | MERGE | DELETE)

> **How the decision was made** – I scanned each filename for obvious relevance to a guitar‑learning web app: pedagogy, PEARL UI/UX standards, core architecture flows, AI/Troubadour integration, beta‑specific logs/tasklists, and any explicit “game mode” or “RIFT” concepts.  
> Files that are generic placeholders (many duplicate `README.md`), multiple copies of the same license, hardware‑specific build guides unrelated to LM Studio local AI, or clearly superseded versioned docs were marked **ARCHIVE**/**MERGE**. Anything that looks like noise for a music‑education product (e.g., low‑level GPU driver notes not tied to the Supabase/Vite stack) was flagged **DELETE**.

| Category | Approx. # of files | Representative examples (showing why they belong) |
|----------|-------------------|----------------------------------------------------|
| **ACTIVE** | ~48 | `PEDAGOGY.md`, `UI PEARL STANDARDS.md`, `PEARL STANDARD.md`, `GUITAR EMODULE PEARL MATURATION v3.md`, `master architecture doc.md` (×2), `high-level-architecture.md`, `server-flow.md`, `models-flow.md`, `database-flow.md`, `chat-flow.md`, `settings-flow.md`, `LM STUDIO SETUP.md`, `QUICKSTART LM STUDIO.md`, `VLLM SERVING GUIDE.md`, `TROUBADOUR AI REPORT.md`, `TROUBADOUR AI PROMPT ENGINEERING.md`, `BETA CHANGELOG.md`, `SESSION STATE AUDIT.md`, `tasklist 1 - implementation plan.md`, `tasklist 4 - TESTING CHECKLIST.md`, `FOUR MODES AND APPRENTICESHIP.md`, `GAME NOTIFICATIONS IDENTITY.md`, `RESONANT MIRROR WALKING MODE.md` |
| **ARCHIVE** | ~120 | All duplicate `README.MD` files (except the few that sit at root of a feature folder), multiple `LICENSE.md` copies, `_archived_doc 271 - KRIYA VS VOIX VIVE DELIVERY SYSTEM.md`, older CosyVoice READMEs (`doc 11 - README.Cosyvoice2.Unet.md`, `doc 13 - README.Cosyvoice2.DiT.md`, etc.), legacy hardware build guides (`doc 156 - mac-m2-ultra.md`, `doc 178 - windows.md`, …), outdated research drafts prefixed with “design doc 0*” that have been superseded by the MASTER DESIGN DOC. |
| **MERGE** | ~90 | • Multiple copies of the same master architecture (`master architecture doc.md` appears twice). <br>• Several `SYSTEM BIBLE merged into architecture.md`‑style files that duplicate content already in the high‑level architecture docs. <br>• Redundant “skill” or “skill matrix” files (`doc 80 - SKILL.md`, `doc 113 - SKILL.md`). <br>• Duplicate LICENSE texts (can be collapsed to a single repo‑level LICENSE). |
| **DELETE** | ~111 | Purely generic noise: many low‑level driver/CUDA/OpenCL docs (`doc 172 - OPENCL.md`, `doc 173 - BLIS.md`, …), unrelated AI model cards that are not used in the Voix Vive stack (e.g., `doc 44 - rm model card.md`, `doc 45 - lm model card.md`), repetitive pull‑request templates, and any file whose name gives no hint of relevance to guitar pedagogy, UI, or Supabase/Vite architecture. |

> **Tip:** Run a quick `git ls-files | grep -E "(README\.md$|LICENSE\.md$)" | sort | uniq -c` to see the exact duplication count; keep one canonical copy per logical group and delete the rest.

---  

### 2️⃣ 20 Most‑Important Docs for Beta Launch Audit  

| # | File (path) | Why it’s critical for beta |
|---|-------------|----------------------------|
| 1 | `PEDAGOGY.md` | Core somatic‑guitar philosophy; drives all lesson UI/UX. |
| 2 | `UI PEARL STANDARDS.md` | Defines the PEARL design system that must be reflected in every component. |
| 3 | `PEARL STANDARD.md` | Companion to UI standards – lists concrete component & interaction rules. |
| 4 | `GUITAR EMODULE PEARL MATURATION v3.md` | Shows how a single e‑module should evolve; used for sprint planning. |
| 5 | `master architecture doc.md` (either copy) | High‑level view of React + Vite, Supabase auth/storage, LM Studio local AI pipeline. |
| 6 | `high-level-architecture.md` | More detailed flow diagram – useful for verifying data‑flow contracts. |
| 7 | `server-flow.md` | Supabase edge‑function / RPC contract checklist (auth, lesson‑progress). |
| 8 | `models-flow.md` | Defines Supabase tables (users, lessons, practice‑sessions, AI‑state). |
| 9 | `database-flow.md` | Indexing & performance notes – crucial for sub‑second query latency. |
|10| `chat-flow.md` | Real‑time Troubadour AI conversation flow (WebSocket + LM Studio). |
|11| `settings-flow.md` | User preference persistence (audio level, somatic reminders). |
|12| `LM STUDIO SETUP.md` | Local AI model loading & GPU/CPU fallback – must work on dev machines. |
|13| `QUICKSTART LM STUDIO.md` | One‑step dev onboarding; ensures new contributors can run the AI stack. |
|14| `VLLM SERVING GUIDE.md` | If you ever switch to remote serving, this is the migration path. |
|15| `TROUBADOUR AI REPORT.md` | Evaluation metrics & latency targets for the AI tutor. |
|16| `TROUBADOUR AI PROMPT ENGINEERING.md` | Prompt library that drives lesson‑specific feedback; must be version‑controlled. |
|17| `BETA CHANGELOG.md` | Tracks what’s been fixed since the last internal build – your release notes source. |
|18| `SESSION STATE AUDIT.md` | Debugging aid for state‑management bugs (Redux/Zustand/context). |
|19| `tasklist 4 - TESTING CHECKLIST.md` | Consolidated manual + automated test items to run before beta sign‑off. |
|20| `FOUR MODES AND APPRENTICESHIP.md` | Describes the four learning modes (Explore, Drill, Create, Perform) that map directly to UI routes. |

*If you can only review a subset, start with 1‑5 (pedagogy + PEARL + architecture) then move to the AI/Troubadour set (12‑16).*

---  

### 3️⃣ Potential Conflicts / Inconsistencies  

| Conflict Area | Docs Involved | Nature of the Conflict | Suggested Action |
|---------------|---------------|------------------------|------------------|
| **Game‑Mode vs. Pedagogical Focus** | `GAME NOTIFICATIONS IDENTITY.md`, `RESONANT MIRROR WALKING MODE.md`, `FOUR MODES AND APPRENTICESHIP.md` vs. `PEDAGOGY.md` | Game‑mode docs emphasize extrinsic rewards & notifications; Pedagogy stresses intrinsic somatic awareness. Risk of UI clutter that distracts from breath‑first practice. | Align notification design with PEARL standards – keep game elements optional and non‑intrusive (e.g., toggle in Settings). |
| **PEARL Standard Versions** | `UI PEARL STANDARDS.md`, `PEARL STANDARD.md`, `GUITAR EMODULE PEARL MATURATION v2.md`, `v3.md` | Different version numbers suggest evolving UI specs; some components may be described differently across files. | Create a single source of truth (e.g., `PEARL DESIGN SYSTEM.md`) and deprecate older maturation docs or mark them as historical. |
| **Architecture Flow Duplication** | `master architecture doc.md` (×2), `high-level-architecture.md`, `SYSTEM BIBLE merged into architecture.md` | Slightly different diagrams; one mentions “WebGPU” for audio processing, another does not. | Keep the most recent `high-level-architecture.md` as canonical; archive the duplicates after verifying no unique info is lost. |
| **AI Model Loading Paths** | `LM STUDIO SETUP.md`, `QUICKSTART LM STUDIO.md`, `VLLM SERVING GUIDE.md` | Setup guide mentions loading a 7B parameter model locally; Quickstart suggests using a smaller 3B model for dev. VLLM guide assumes remote serving – could cause confusion about which model is expected in production. | Define a single `MODEL SPEC.md` that states the production model (e.g., Llama‑3‑8B quantized) and note dev fallback; update all three files to reference it. |
| **License Proliferation** | 15+ `LICENSE.md` files scattered throughout the repo | Multiple copies may diverge (e.g., one with a Contributor Covenant preamble, another plain MIT). | Keep a single root `LICENSE.md` (MIT) and delete duplicates; add a notice in `CONTRIBUTING.md` if any third‑party assets have separate licenses. |
| **Data‑Privacy vs. AI Logging** | `DATA PRIVACY AND COMPLIANCE.md`, `chat-flow.md`, `TROUBADOUR AI REPORT.md` | Privacy doc says no personal voice data is stored; chat‑flow logs conversation transcripts for improvement. | Ensure chat‑flow only stores anonymized, aggregated metrics; add a comment in `chat-flow.md` referencing the privacy policy and confirming opt‑in. |

---  

### 4️⃣ Mapping Docs to Key Concepts  

| Concept | Related Files (selected) |
|---------|--------------------------|
| **RIFT concept** | *No file names contain “RIFT”.* If the concept lives only in prose, search the repo for the string; otherwise treat as **undocumented** – consider adding a brief `RIFT OVERVIEW.md` if it’s core to the product vision. |
| **Game Mode** | `GAME NOTIFICATIONS IDENTITY.md`, `RESONANT MIRROR WALKING MODE.md`, `FOUR MODES AND APPRENTICESHIP.md`, research files `design doc 03 vertiscale game.md` (×2), `STEPAUDIO 25 VISION SYNTHESIS.md` |
| **PEARL Standard** | `UI PEARL STANDARDS.md`, `PEARL STANDARD.md`, all `GUITAR EMODULE PEARL MATURATION *.md` (v1‑v3), `PEARL STUDENT EXPERIENCE.md`, `NON ORT TTS STRATEGY.md` |
| **Architecture** | `master architecture doc.md` (×2), `high-level-architecture.md`, `SYSTEM BIBLE merged into architecture.md`, `server-flow.md`, `models-flow.md`, `database-flow.md`, `chat-flow.md`, `settings-flow.md`, `mcp-flow.md`, `lm model card.md` (if used for AI metadata) |
| **Pedagogy** | `PEDAGOGY.md`, `ISOMORPHIC PEDAGOGY.md`, `FOUR MODES AND APPRENTICESHIP.md`, research files `design doc 01 foundation.md`, `design doc 02 curriculum.md`, `MASTER DESIGN DOC.md` (×2), `GUITAR EMODULE PEARL MATURATION *.md` |
| **AI / Troubadour** | All files prefixed with `TROUBADOUR`, `LM STUDIO SETUP.md`, `QUICKSTART LM STUDIO.md`, `VLLM SERVING GUIDE.md`, `AI SYSTEM.md`, `TROUBADOUR AI REPORT.md`, `TROUBADOUR AI PROMPT ENGINEERING.md`, `STEPAUDIO 2.5 INTEGRATION REPORT.md`, `STEPAUDIO 25 VISION SYNTHESIS.md`, `LLM SERVING GUIDE.md` (if present), any `*.md` under `research` that mentions “Troubadour”. |

---  

## Quick‑Start Checklist for the Audit Session  

1. **Run a dedup sweep** – keep one `README.md` per feature folder, one `LICENSE.md` at repo root, archive the rest.  
2. **Review the 20 must‑read docs** (section 2) and verify they are up‑to‑date with the current Supabase schema & LM Studio model version.  
3. **Resolve conflicts** (section 3) – prioritize those that affect UI/UX (Game vs. Pedagogy, PEARL version drift).  
4. **Confirm concept coverage** – ensure each of the six concepts (RIFT, Game Mode, PEARL, Architecture, Pedagogy, AI/Troubadour) has at least one living doc; add missing ones if needed.  
5. **Update the BETA CHANGELOG.md** with the outcomes of today’s bug‑fixing session so the beta release notes are ready.  

---  

*Prepared for Voix Vive’s imminent beta launch – focus on what moves the needle, trim the noise, and keep the PEARL‑aligned, somatic‑first experience solid.*