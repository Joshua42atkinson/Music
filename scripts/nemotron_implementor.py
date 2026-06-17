#!/usr/bin/env python3
"""
VOIX VIVE — Nemotron Implementation Orchestrator (Phase 2)
Reads the Phase 1 analysis reports and asks Nemotron to produce 
ACTUAL CODE CHANGES — diffs, new files, specific edits.

Run AFTER nemotron_orchestrator.py has completed at least sessions 01-07.

Output: nemotron_output/impl_XX_*.md — each file contains:
  - A summary of what to change
  - Exact code to write (full file contents or unified diffs)
  - Build verification steps

Usage: python3 nemotron_implementor.py
"""

import os, json, time, datetime, sys
from pathlib import Path
import urllib.request

LM_STUDIO_URL  = "http://127.0.0.1:1234/v1/chat/completions"
MODEL          = "nemotron-3-super-120b-a12b"
PROJECT_ROOT   = Path("/home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass")
SRC_DIR        = PROJECT_ROOT / "src"
OUTPUT_DIR     = PROJECT_ROOT / "nemotron_output"
IMPL_DIR       = OUTPUT_DIR / "impl"
MAX_TOKENS     = 16384
TEMP           = 0.2   # Very low temp for code writing

IMPL_DIR.mkdir(exist_ok=True)
LOG_FILE = IMPL_DIR / f"impl_run_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.log"

def log(msg):
    ts = datetime.datetime.now().strftime("%H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def ask_nemotron(system_prompt, user_prompt, label):
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_prompt},
        ],
        "max_tokens": MAX_TOKENS,
        "temperature": TEMP,
        "stream": False,
    }
    data = json.dumps(payload).encode("utf-8")
    req  = urllib.request.Request(LM_STUDIO_URL, data=data,
                                   headers={"Content-Type": "application/json"},
                                   method="POST")
    log(f"  → Nemotron: {label}")
    try:
        with urllib.request.urlopen(req, timeout=600) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            msg    = result["choices"][0]["message"]
            content = msg.get("content", "").strip() or msg.get("reasoning_content", "").strip()
            log(f"  ✓ {len(content)} chars")
            return content
    except Exception as e:
        log(f"  ✗ ERROR: {e}")
        return f"ERROR: {e}"

def save(filename, content):
    path = IMPL_DIR / filename
    path.write_text(content)
    log(f"  💾 {path}")
    return path

def read_file(path, max_chars=30000):
    try:
        return Path(path).read_text(errors="replace")[:max_chars]
    except:
        return ""

def read_report(n):
    """Read a Phase 1 analysis report by session number."""
    files = list(OUTPUT_DIR.glob(f"{n:02d}_*.md"))
    if files:
        return files[0].read_text()[:12000]
    return ""

# ── SYSTEM PROMPT ───────────────────────────────────────────────────────────
SYSTEM = """You are a senior React/Vite engineer writing production code for 
Voix Vive — a somatic guitar academy web app.

RULES:
1. Output ONLY complete, working code — no pseudocode, no "..." placeholders
2. For new files: output the complete file content
3. For edits: output the complete modified file (not a diff) unless it's huge
4. For huge files (>300 lines): output a clear unified diff with enough context
5. Every JSX file MUST start with a PEARL header comment block
6. Follow the existing code style (single quotes, arrow functions, inline styles or CSS classes)
7. Always test for null/undefined before accessing nested properties
8. Build must pass: `npx vite build`

PEARL header format for every new/modified file:
// ╔══ VOIX VIVE ═══════════════════════════════════════════════════╗
// ║ FILE    : filename.jsx                                         ║
// ║ WHAT    : [concrete one-sentence description]                  ║
// ║ WHY     : [pedagogical/architectural reason it exists]         ║
// ║ WHO     : [student / Bertrand / developer / invisible]         ║
// ║ OWNS    : [state, data, or UI this file is responsible for]    ║
// ║ NEEDS   : [exact hook/store/component imports it depends on]   ║
// ║ RULES   : [what must never be changed without a reason]        ║
// ║ FIX AT  : [debugging chain]                                    ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚════════════════════════════════════════════════════════════════╝
"""

# ── IMPLEMENTATION SESSIONS ─────────────────────────────────────────────────

def impl_01_app_routes():
    """Rewrite App.jsx with clean 5-destination route structure"""
    log("IMPL 01: Rewrite App.jsx — 5-destination routes")
    
    analysis  = read_report(2)  # Route architecture audit
    app_jsx   = read_file(SRC_DIR / "App.jsx", 25000)
    
    already_done = list(IMPL_DIR.glob("impl_01_*.md"))
    if already_done:
        log(f"  ⏭ Already done: {already_done[0].name}")
        return
    
    prompt = f"""## Route Architecture Analysis (Nemotron Session 02):
{analysis}

## Current App.jsx:
{app_jsx}

## Task:
Rewrite App.jsx to implement the 5-destination architecture:
- / → Home (LandingScreen)
- /song → Song (OrientationHub) 
- /player → Player (PlayerPortal)
- /binder → Binder (renamed from Workbook)
- /rift → RIFT (new RiftHub component — create a PLACEHOLDER for now)

Rules:
1. Add lazy loading (React.lazy) for ALL route components
2. Add /binder as the new route (keep /workbook as a redirect to /binder)
3. Remove from public nav (keep routes but add comment "// DEV ONLY"):
   - /ai-developer, /poc, /monomyth, /walking, /human-octave
4. Move under /rift (using Navigate redirects for now, full nesting in next impl):
   - /game → redirect to /rift
   - /adventure → redirect to /rift  
   - /studio/prompter → redirect to /rift
5. Kill route: /summary (it lives inside /binder now) — redirect to /binder
6. Kill route: /inner-circle — redirect to /rift
7. Keep /auth/callback, /privacy, /terms, /mentor unchanged
8. Add a new simple 5-tab nav bar component inline in App.jsx (we'll extract it later)
9. PEARL header required

Output the COMPLETE new App.jsx file."""
    
    result = ask_nemotron(SYSTEM, prompt, "App.jsx rewrite")
    save("impl_01_app_routes.md", f"# IMPL 01: App.jsx Route Rewrite\n\n{result}")

def impl_02_rift_hub():
    """Create the new RiftHub.jsx placeholder page"""
    log("IMPL 02: Create RiftHub.jsx")
    
    analysis = read_report(6)  # RIFT page design
    
    already_done = list(IMPL_DIR.glob("impl_02_*.md"))
    if already_done:
        log(f"  ⏭ Already done: {already_done[0].name}")
        return

    rift_analysis = analysis if analysis else """
RIFT is the 5th destination: the creative/jam space.
Routes nested: /rift/game (VertiscaleEngine), /rift/adventure (AdventurePlayer),
/rift/prompter (SomaticStudioPrompter), /rift/theory (MaturationMap+HumanOctave)
Widget: Troubadour Guitar (creative AI side)
Vibe: open, electric, community, jam
"""
    vert_engine   = read_file(SRC_DIR / "game" / "VertiscaleEngine.jsx", 3000)

    prompt = f"""## RIFT Page Design Analysis:
{rift_analysis}

## Task:
Create a new file: src/pages/RiftHub.jsx

This is the RIFT destination — the creative/jam hub of Voix Vive.
For this first pass, create a beautiful landing page that:

1. Has a stunning hero with the word "RIFT" — dark, electric, guitar-energy aesthetic
2. Shows 4 cards linking to the sub-experiences:
   - 🎮 Game Mode → /rift/game (VertiscaleEngine)  
   - 🗺️ Adventure → /rift/adventure (AdventurePlayer)
   - 🎬 Somatic Studio → /rift/prompter (SomaticStudioPrompter)
   - 🌐 Theory Map → /rift/theory (MaturationMap)
3. Includes a "coming soon" Community Jam section at the bottom
4. Uses the existing dark aesthetic (background: #050508, gold accents #c9a96e)
5. Has smooth hover animations (use CSS, no framer-motion import needed for this page)
6. Is fully responsive (works on 375px mobile)
7. PEARL header required

Use ONLY inline styles or vanilla CSS — no Tailwind unless already in the project.
Output the COMPLETE RiftHub.jsx file."""
    
    result = ask_nemotron(SYSTEM, prompt, "RiftHub.jsx")
    save("impl_02_rift_hub.md", f"# IMPL 02: RiftHub.jsx\n\n{result}")

def impl_03_nav_component():
    """Create the 5-tab persistent nav bar"""
    log("IMPL 03: Create PrimaryNav.jsx")
    
    analysis = read_report(2)
    
    already_done = list(IMPL_DIR.glob("impl_03_*.md"))
    if already_done:
        log(f"  ⏭ Already done: {already_done[0].name}")
        return

    prompt = f"""## Route Analysis:
{analysis[:3000]}

## Task:
Create src/components/PrimaryNav.jsx — the 5-destination persistent bottom navigation.

Requirements:
1. Fixed bottom bar on mobile (position: fixed, bottom: 0)
2. Horizontal top bar on desktop (>=768px)  
3. 5 destinations with icons and labels:
   - 🏠 Home → /
   - 🎵 Song → /song
   - 🎸 Play → /player
   - 📖 Binder → /binder
   - ⚡ Rift → /rift
4. Active state: highlight current route (use useLocation from react-router-dom)
5. Style: dark glass — backdrop-filter: blur(20px), semi-transparent dark bg
6. Gold (#c9a96e) accent for active item
7. Smooth transition on active change
8. Hidden on: / (landing) and /onboarding (full-screen experiences)
9. PEARL header required

Output the COMPLETE PrimaryNav.jsx file."""
    
    result = ask_nemotron(SYSTEM, prompt, "PrimaryNav.jsx")
    save("impl_03_primary_nav.md", f"# IMPL 03: PrimaryNav.jsx\n\n{result}")

def impl_04_binder_rename():
    """Rename Workbook → Binder, update imports"""
    log("IMPL 04: Workbook → Binder rename plan")
    
    already_done = list(IMPL_DIR.glob("impl_04_*.md"))
    if already_done:
        log(f"  ⏭ Already done: {already_done[0].name}")
        return
    
    workbook = read_file(SRC_DIR / "components" / "Workbook.jsx", 8000)
    analysis = read_report(5)  # Workbook PEARL audit
    
    route_snippet = (
        '<Route path="/binder" element={<ErrorBoundary><Binder /></ErrorBoundary>} />\n'
        '   <Route path="/workbook" element={<Navigate to="/binder" replace />} />'
    )
    prompt = (
        f"## Workbook Audit:\n{analysis[:4000]}\n\n"
        f"## Current Workbook.jsx (first 8000 chars):\n{workbook}\n\n"
        "## Task:\n"
        'The Workbook is being renamed to "Binder" across the app. Produce:\n\n'
        "1. A shell command to copy/rename the file:\n"
        "   ```bash\n   cp src/components/Workbook.jsx src/components/Binder.jsx\n   ```\n\n"
        "2. The PEARL header to ADD at the top of the new Binder.jsx\n"
        "   (just the header block — don't rewrite the whole file)\n\n"
        "3. A list of ALL files that import Workbook that need to be updated:\n"
        "   - Check: App.jsx, any index files, any other components\n\n"
        "4. The exact sed/grep commands to update imports:\n"
        "   ```bash\n   sed -i 's/from.*Workbook/from \".\\/Binder\"/g' src/App.jsx\n   ```\n\n"
        f"5. The new route entry for App.jsx:\n   ```jsx\n   {route_snippet}\n   ```\n\n"
        '6. The tab label inside Binder.jsx: change any "Playbook" or "Workbook" '
        'references in the UI text to "Binder"\n\n'
        "Output as a clear step-by-step implementation guide with exact commands."
    )
    
    result = ask_nemotron(SYSTEM, prompt, "Binder rename")
    save("impl_04_binder_rename.md", f"# IMPL 04: Workbook → Binder Rename\n\n{result}")

def impl_05_pearl_headers_urgent():
    """Generate PEARL headers for the 10 most critical files"""
    log("IMPL 05: PEARL headers for critical files")
    
    already_done = list(IMPL_DIR.glob("impl_05_*.md"))
    if already_done:
        log(f"  ⏭ Already done: {already_done[0].name}")
        return
    
    # Collect the 10 most critical files
    critical_files = {
        "App.jsx":                  SRC_DIR / "App.jsx",
        "ScaffoldingProvider.jsx":  SRC_DIR / "components" / "ScaffoldingProvider.jsx",
        "TroubadourWidget.jsx":     SRC_DIR / "components" / "TroubadourWidget.jsx",
        "BookWidget.jsx":           SRC_DIR / "components" / "BookWidget.jsx",
        "PlayerPortal.jsx":         SRC_DIR / "components" / "PlayerPortal.jsx",
        "OrientationHub.jsx":       SRC_DIR / "pages" / "OrientationHub.jsx",
        "LandingScreen.jsx":        SRC_DIR / "pages" / "LandingScreen.jsx",
        "CharacterSheet.jsx":       SRC_DIR / "components" / "playbook" / "CharacterSheet.jsx",
        "useTroubadourAI.js":       SRC_DIR / "hooks" / "useTroubadourAI.js",
        "saveState.js":             SRC_DIR / "data" / "saveState.js",
    }
    
    headers_needed = []
    for name, path in critical_files.items():
        content = read_file(path, 2000)
        has_pearl = "╔══ VOIX VIVE" in content
        if not has_pearl:
            headers_needed.append((name, content[:1500]))
    
    if not headers_needed:
        save("impl_05_pearl_headers.md", "# All critical files already have PEARL headers ✓")
        return
    
    files_str = "\n\n".join([
        f"### {name}\n```jsx\n{snippet}\n```" 
        for name, snippet in headers_needed
    ])
    
    prompt = f"""Generate PEARL header blocks for these files that are missing them.

PEARL format:
// ╔══ VOIX VIVE ═══════════════════════════════════════════════════╗
// ║ FILE    : filename.jsx                                         ║
// ║ WHAT    : [verb-first concrete description]                    ║
// ║ WHY     : [pedagogical/architectural reason]                   ║
// ║ WHO     : [student / Bertrand / developer / invisible]         ║
// ║ OWNS    : [state/data/UI owned by this file]                   ║
// ║ NEEDS   : [exact imports it depends on]                        ║
// ║ RULES   : [what must never change without documented reason]   ║
// ║ FIX AT  : [debugging entry point]                              ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚════════════════════════════════════════════════════════════════╝

FILES NEEDING HEADERS:
{files_str}

For each file, output ONLY the exact header block to prepend.
Make each header SPECIFIC to that file — not generic boilerplate."""
    
    result = ask_nemotron(SYSTEM, prompt, "PEARL headers")
    save("impl_05_pearl_headers.md", f"# IMPL 05: PEARL Headers\n\n{result}")

def impl_06_dead_route_cleanup():
    """Generate the exact code to remove/redirect dead routes"""
    log("IMPL 06: Dead route cleanup script")
    
    already_done = list(IMPL_DIR.glob("impl_06_*.md"))
    if already_done:
        log(f"  ⏭ Already done: {already_done[0].name}")
        return
    
    analysis = read_report(2)
    app_jsx  = read_file(SRC_DIR / "App.jsx", 15000)
    
    prompt = (
        f"## Route Audit (Session 02):\n{analysis[:5000]}\n\n"
        f"## Current App.jsx:\n{app_jsx}\n\n"
        "## Task:\nProduce a bash script that:\n\n"
        "1. Backs up App.jsx before changes:\n"
        "   ```bash\n   cp src/App.jsx src/App.jsx.bak\n   ```\n\n"
        "2. Lists EXACTLY which route lines to remove/change (with line numbers from the current file shown above)\n\n"
        "3. Routes to REDIRECT (add Navigate) before beta:\n"
        "   - /summary -> /binder\n"
        "   - /inner-circle -> /rift\n"
        "   - /studio -> /player\n"
        "   - /workbook -> /binder\n"
        "   - /game -> /rift\n"
        "   - /adventure -> /rift\n\n"
        "4. Routes to mark DEV_ONLY (wrap in import.meta.env check):\n"
        "   - /ai-developer\n   - /poc\n   - /walking\n   - /monomyth\n   - /human-octave\n\n"
        "5. Produce the final complete minimal App.jsx routes section\n"
        "   (just the Routes block, not the whole file)\n\n"
        "Be precise — this goes directly into the codebase."
    )
    
    result = ask_nemotron(SYSTEM, prompt, "Dead route cleanup")
    save("impl_06_dead_routes.md", f"# IMPL 06: Dead Route Cleanup\n\n{result}")

def impl_07_quality_report():
    """Generate final quality assessment of all impl work"""
    log("IMPL 07: Quality assessment")
    
    already_done = list(IMPL_DIR.glob("impl_07_*.md"))
    if already_done:
        log(f"  ⏭ Already done: {already_done[0].name}")
        return
    
    # Read all impl outputs
    impl_outputs = []
    for f in sorted(IMPL_DIR.glob("impl_0[1-6]_*.md")):
        impl_outputs.append(f"=== {f.name} ===\n{f.read_text()[:2000]}")
    
    available_analysis = []
    for f in sorted(OUTPUT_DIR.glob("[0-9][0-9]_*.md")):
        available_analysis.append(f.name)
    
    prompt = f"""Review all implementation work produced for Voix Vive beta launch.

## Implementation outputs:
{chr(10).join(impl_outputs)}

## Available analysis reports:
{chr(10).join(available_analysis)}

Produce a QUALITY ASSESSMENT:

### 1. Implementation Readiness Score (0-100)
Rate each impl task on: correctness, completeness, risk level

### 2. Dependency Order
In what order should these be applied? What depends on what?

### 3. Risk Assessment  
What could break? What to test first?

### 4. Missing implementations
What critical changes are NOT covered by impl_01-06 that need doing?

### 5. Joshua's Review Checklist
A simple ✓/? checklist Joshua can use to approve each change in 5 minutes

### 6. Recommended git commit message for this batch

### 7. "Is this better than Brightspace yet?" score for each page changed."""
    
    result = ask_nemotron(SYSTEM, prompt, "Quality Assessment")
    save("impl_07_quality_report.md", f"# IMPL 07: Quality Assessment\n\n{result}")

# ── MAIN ────────────────────────────────────────────────────────────────────

IMPL_SESSIONS = [
    impl_01_app_routes,
    impl_02_rift_hub,
    impl_03_nav_component,
    impl_04_binder_rename,
    impl_05_pearl_headers_urgent,
    impl_06_dead_route_cleanup,
    impl_07_quality_report,
]

if __name__ == "__main__":
    log("=" * 60)
    log("VOIX VIVE — Nemotron IMPLEMENTATION Orchestrator (Phase 2)")
    log(f"Output: {IMPL_DIR}")
    log("=" * 60)
    
    # Quick API check
    test_req = urllib.request.Request(
        LM_STUDIO_URL,
        data=json.dumps({"model": MODEL, "messages": [{"role":"user","content":"ping"}], 
                         "max_tokens": 5}).encode(),
        headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(test_req, timeout=30) as r:
            log("LM Studio: ✓ Connected")
    except Exception as e:
        log(f"LM Studio: ✗ {e}")
        sys.exit(1)
    
    completed, failed = [], []
    for i, fn in enumerate(IMPL_SESSIONS, 1):
        log(f"\n{'─'*50}")
        log(f"IMPL SESSION {i:02d}/{len(IMPL_SESSIONS)}: {fn.__name__}")
        log(f"{'─'*50}")
        try:
            fn()
            completed.append(fn.__name__)
            log(f"✓ impl_{i:02d} done")
        except Exception as e:
            log(f"✗ impl_{i:02d} FAILED: {e}")
            failed.append((fn.__name__, str(e)))
        time.sleep(2)
    
    log(f"\n{'='*60}")
    log(f"IMPLEMENTATION ORCHESTRATOR COMPLETE")
    log(f"Done: {len(completed)}/{len(IMPL_SESSIONS)}")
    if failed:
        log(f"Failed: {failed}")
    log(f"Review: {IMPL_DIR}/")
    log(f"{'='*60}")
