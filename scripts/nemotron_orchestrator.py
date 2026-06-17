#!/usr/bin/env python3
"""
VOIX VIVE — Nemotron Autonomous Orchestrator
Runs ~20 analysis sessions against the Nemotron-3-Super-120B model via LM Studio
while Joshua is on a walk. Outputs structured reports to nemotron_output/

Usage: python3 nemotron_orchestrator.py
"""

import os, json, time, glob, datetime, textwrap, sys
from pathlib import Path
import urllib.request, urllib.error

# ── Config ──────────────────────────────────────────────────────────────────
LM_STUDIO_URL  = "http://127.0.0.1:1234/v1/chat/completions"
MODEL          = "nemotron-3-super-120b-a12b"
PROJECT_ROOT   = Path("/home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass")
DOCS_DIR       = PROJECT_ROOT / "docs_organized"
SRC_DIR        = PROJECT_ROOT / "src"
OUTPUT_DIR     = PROJECT_ROOT / "nemotron_output"
MAX_TOKENS     = 16384
TEMP           = 0.3   # Low temp = precise, structured analysis

OUTPUT_DIR.mkdir(exist_ok=True)
LOG_FILE       = OUTPUT_DIR / f"run_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.log"

# ── Helpers ──────────────────────────────────────────────────────────────────
def log(msg):
    ts = datetime.datetime.now().strftime("%H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def ask_nemotron(system_prompt: str, user_prompt: str, session_name: str) -> str:
    """Send a prompt to Nemotron, return the response text."""
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
    req  = urllib.request.Request(
        LM_STUDIO_URL,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    log(f"  → Sending to Nemotron: {session_name}")
    try:
        with urllib.request.urlopen(req, timeout=600) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            msg = result["choices"][0]["message"]
            # Nemotron is a reasoning model: real answer in 'content', 
            # internal chain-of-thought in 'reasoning_content'
            content = msg.get("content", "").strip()
            if not content:
                # fallback: use reasoning output if content is empty
                content = msg.get("reasoning_content", "").strip()
            log(f"  ✓ Got response ({len(content)} chars)")
            return content
    except Exception as e:
        log(f"  ✗ ERROR: {e}")
        return f"ERROR: {e}"

def save_output(filename: str, content: str):
    path = OUTPUT_DIR / filename
    with open(path, "w") as f:
        f.write(content)
    log(f"  💾 Saved: {path}")

def read_file_safe(path, max_chars=80000):
    try:
        text = Path(path).read_text(errors="replace")
        return text[:max_chars]
    except:
        return ""

def collect_src_files(pattern="**/*.jsx", max_files=40, max_chars_each=6000):
    """Collect source files into one digest string."""
    files = sorted(SRC_DIR.glob(pattern))[:max_files]
    chunks = []
    for f in files:
        rel = f.relative_to(PROJECT_ROOT)
        content = read_file_safe(f, max_chars_each)
        chunks.append(f"\n{'='*60}\n# FILE: {rel}\n{'='*60}\n{content}")
    return "\n".join(chunks)

def collect_key_docs(keywords, max_docs=15, max_chars_each=5000):
    """Collect docs matching keywords."""
    all_docs = list(DOCS_DIR.glob("*.md"))
    matched = []
    for doc in all_docs:
        name = doc.name.lower()
        if any(k.lower() in name for k in keywords):
            matched.append(doc)
    matched = matched[:max_docs]
    chunks = []
    for f in matched:
        content = read_file_safe(f, max_chars_each)
        chunks.append(f"\n{'='*60}\n# DOC: {f.name}\n{'='*60}\n{content}")
    return "\n".join(chunks)

def collect_all_doc_names():
    """Just the names of all docs for cataloguing."""
    docs = sorted(DOCS_DIR.glob("*.md"))
    return "\n".join(d.name for d in docs)

# ── SYSTEM PROMPT ─────────────────────────────────────────────────────────────
SYSTEM = """You are a senior full-stack software architect and UX strategist 
auditing Voix Vive — an online guitar academy web app for Maestro Bertrand Laurence.

Context:
- Stack: React + Vite, Framer Motion, Supabase, LM Studio local AI
- Design system: PEARL (Perspective · Engineering · Aesthetic · Research · Layout)
- Pedagogical framework: Somatic guitar learning — breath-first, body-aware
- Target: Beat Brightspace/Blackboard for music education UX
- Beta launch: imminent, after bug fixing session today

Your job: produce SPECIFIC, ACTIONABLE, CODE-READY recommendations.
- No fluff. No generic advice.
- Reference actual file names and component names when known.
- Format output as clean Markdown with clear headers.
- Prioritize by impact for beta launch.
"""

# ═══════════════════════════════════════════════════════════════════════════════
# SESSION DEFINITIONS
# Each session = (output_filename, description, build_prompt_fn)
# ═══════════════════════════════════════════════════════════════════════════════

def run_session_01():
    """Full doc catalog + priority triage"""
    log("SESSION 01: Doc catalog + triage")
    doc_names = collect_all_doc_names()
    prompt = f"""Here are all 369 documents in the Voix Vive docs_organized folder:

{doc_names}

Tasks:
1. Categorize these into: ACTIVE (still relevant), ARCHIVE (outdated/superseded), MERGE (redundant with another), DELETE (noise/irrelevant for a guitar app)
2. Identify the 20 most important docs for a beta launch audit
3. Flag any docs that seem to conflict with each other
4. Note which docs relate to: RIFT concept, game mode, PEARL standard, architecture, pedagogy, AI/Troubadour

Output as structured Markdown with tables."""
    result = ask_nemotron(SYSTEM, prompt, "Doc Catalog")
    save_output("01_doc_catalog_triage.md", result)

def run_session_02():
    """Route architecture audit"""
    log("SESSION 02: Route architecture audit")
    routes = """Current App.jsx routes:
/ → LandingScreen
/onboarding → Onboarding
/song → OrientationHub  
/guitar/map → MaturationMap
/player → PlayerPortal
/workbook → Workbook (was /playbook)
/privacy, /terms → Legal
/studio → StudioPage
/studio/prompter → SomaticStudioPrompter
/summary → CurriculumSummary
/ai-developer → AIDeveloperChat
/game → VertiscaleEngine
/adventure → AdventurePlayer
/auth/callback → AuthCallback
/monomyth → ChromaticMonomyth
/mentor → MentorDashboard (auth-guarded)
/poc → ResonantMirrorPOC
/walking → WalkingModeEngine
/human-octave → HumanOctaveLibrary
/community → CommunityHub
/inner-circle → MentorshipBlog"""

    prompt = f"""{routes}

USER CONTEXT: The user said: "some pages have ALOT going on, and the user is overwhelmed."
They want 5 primary destinations: Home, Song (lesson), Player (practice), Playbook/Binder (academy), RIFT (jam/creative)

Tasks:
1. Audit each route: is it essential for beta? Should it be a sub-route, a modal, or killed?
2. Propose the clean 5-destination navigation structure
3. Identify which routes are "hidden features" that should be moved to a developer panel
4. Map which current routes map to the new RIFT concept
5. Recommend which routes to REMOVE before beta launch (with rationale)
6. Design the URL structure for the new 5-destination architecture

Be specific and decisive. This is a beta cleanup."""
    result = ask_nemotron(SYSTEM, prompt, "Route Architecture")
    save_output("02_route_architecture_audit.md", result)

def run_session_03():
    """PEARL audit — Landing + Song pages"""
    log("SESSION 03: PEARL audit — Landing + Song")
    landing = collect_src_files("**/LandingScreen*", max_files=3, max_chars_each=15000)
    song    = collect_src_files("**/OrientationHub*", max_files=3, max_chars_each=15000)
    prompt = f"""Audit the Landing and Song (OrientationHub) pages using PEARL:
P = Perspective (what role does this play?)
E = Engineering (what does it do technically?)
A = Aesthetic (visual/UX intent)
R = Research (pedagogical backing)
L = Layout (what connects to/from this)

SOURCE CODE:
{landing}
{song}

For each page:
1. PEARL header (as it should be written in the file)
2. What is WORKING well (keep/protect)
3. What is CLUTTERED or CONFUSING for a first-time guitar student
4. 3 specific UI improvements for beta
5. What to REMOVE before launch
6. Cognitive load score: 1-10 (1=simple, 10=overwhelming)

The user said "the landing page and song class are dope" — confirm why and what makes them strong."""
    result = ask_nemotron(SYSTEM, prompt, "PEARL Landing+Song")
    save_output("03_pearl_landing_song.md", result)

def run_session_04():
    """PEARL audit — Player page"""
    log("SESSION 04: PEARL audit — Player")
    player = collect_src_files("**/PlayerPortal*", max_files=3, max_chars_each=20000)
    prompt = f"""Audit the PlayerPortal page using PEARL framework.

SOURCE CODE:
{player}

1. PEARL header for PlayerPortal
2. Feature inventory: list every interactive element
3. Cognitive load score and rationale
4. What should be PRIMARY (always visible) vs SECONDARY (one tap away) vs HIDDEN (developer only)
5. 5 specific improvements for beta
6. What features belong in RIFT vs Player?
7. How does this compare to: GarageBand, Yousician, JamPlay UX?"""
    result = ask_nemotron(SYSTEM, prompt, "PEARL Player")
    save_output("04_pearl_player.md", result)

def run_session_05():
    """PEARL audit — Workbook/Playbook (Academy)"""
    log("SESSION 05: PEARL audit — Workbook")
    workbook = collect_src_files("**/Workbook*", max_files=2, max_chars_each=15000)
    charsheet = collect_src_files("**/CharacterSheet*", max_files=2, max_chars_each=10000)
    prompt = f"""Audit the Workbook/Academy section using PEARL.

SOURCE:
{workbook}
{charsheet}

1. PEARL headers for Workbook and CharacterSheet
2. List EVERY tab/panel/section currently in the Workbook
3. For each: KEEP / SIMPLIFY / MOVE / DELETE with rationale
4. What does Brightspace do better here?
5. What does this app do BETTER than Brightspace?
6. Design a simplified Workbook that has max 4 clear tabs
7. Where does the "Troubadour Binder" widget fit vs what's in Workbook?
8. Cognitive load score for current Workbook"""
    result = ask_nemotron(SYSTEM, prompt, "PEARL Workbook")
    save_output("05_pearl_workbook.md", result)

def run_session_06():
    """RIFT page architecture design"""
    log("SESSION 06: RIFT page architecture")
    rift_src = collect_src_files("**/Rift*", max_files=5, max_chars_each=10000)
    human_octave = read_file_safe(SRC_DIR / "components" / "HumanOctaveLibrary.jsx", 10000)
    adventure = collect_src_files("**/Adventure*", max_files=3, max_chars_each=8000)
    prompt = f"""Design the new RIFT page for Voix Vive.

User's vision: "RIFT as the 5th destination — guitar 'rift' is a cool sound and 
our 'octave as harmony of all people' works. The Troubadour Guitar widget goes here 
(creative/jam side). The Troubadour Binder is for the academy side."

Currently existing RIFT-adjacent code:
{rift_src}

HumanOctaveLibrary (potential RIFT content):
{human_octave[:5000]}

AdventurePlayer:
{adventure}

Design:
1. RIFT page purpose statement (one sentence)
2. PEARL header for /rift route
3. Feature list: what belongs in RIFT? (from existing routes that should be consolidated here)
4. "Troubadour Guitar" widget spec: what does it do, what does it look like?
5. How RIFT differs from Player (practice) and Song (lesson)
6. RIFT as community hub: what social/sharing features make sense?
7. The RiftChat component — where does it live after extraction from TroubadourWidget?
8. Navigation: how do users move between the 5 destinations?"""
    result = ask_nemotron(SYSTEM, prompt, "RIFT Architecture")
    save_output("06_rift_page_design.md", result)

def run_session_07():
    """Widget split — Troubadour Guitar vs Troubadour Binder"""
    log("SESSION 07: Widget split design")
    troubadour = read_file_safe(SRC_DIR / "components" / "TroubadourWidget.jsx", 30000)
    book = read_file_safe(SRC_DIR / "components" / "BookWidget.jsx", 30000)
    prompt = f"""The user wants to split the current two ambient widgets into:
- "Troubadour Guitar" (red pill → creative, jam, RIFT-side)
- "Troubadour Binder" (blue pill → academy, progress, Workbook-side)

Current TroubadourWidget.jsx (AI chat, voice, music):
{troubadour[:20000]}

Current BookWidget.jsx (navigation, audio, save/load):
{book[:20000]}

Design the split:
1. What features go in "Troubadour Guitar" widget?
2. What features go in "Troubadour Binder" widget?
3. Where does RiftChat go after extraction?
4. What shared state do both widgets need from ScaffoldingProvider?
5. Which widget should be visible on which routes?
6. New icon/visual metaphor for each widget
7. Write the PEARL header for each new widget
8. Estimate refactoring effort (hours) and complexity
9. What to do about TroubadourChat vs StudyChat vs RiftChat — consolidate or keep separate?"""
    result = ask_nemotron(SYSTEM, prompt, "Widget Split")
    save_output("07_widget_split_design.md", result)

def run_session_08():
    """Game mode analysis — VertiscaleEngine + AdventurePlayer"""
    log("SESSION 08: Game mode analysis")
    game = collect_src_files("**/Vertiscale*", max_files=2, max_chars_each=15000)
    adventure = collect_src_files("**/Adventure*", max_files=2, max_chars_each=15000)
    walking = collect_src_files("**/Walking*", max_files=2, max_chars_each=10000)
    prompt = f"""Analyze the game modes as a mechanism to guide student focus and instruction.

User's vision: "The game is to manage the focus of the user."

VertiscaleEngine:
{game}

AdventurePlayer:  
{adventure}

WalkingModeEngine:
{walking[:8000]}

Analysis:
1. How does each game mode currently guide user focus?
2. What pedagogical outcomes does each game mode serve?
3. Are these SEPARATE pages or should they be modes within one game system?
4. How do they integrate with the Fret/Traction progression system?
5. Compare to Duolingo's gamification — what's better/worse here?
6. Design a unified game dashboard that unifies these three engines
7. What game mechanics are MISSING that would keep students coming back daily?
8. Where in the 5-destination nav does game content live?
9. Should there be a "/game" top-level destination or is game EMBEDDED in every page?"""
    result = ask_nemotron(SYSTEM, prompt, "Game Mode Analysis")
    save_output("08_game_mode_analysis.md", result)

def run_session_09():
    """LMS competitive analysis — Brightspace/Blackboard gap audit"""
    log("SESSION 09: LMS competitive gap analysis")
    scaffolding = read_file_safe(SRC_DIR / "components" / "ScaffoldingProvider.jsx", 15000)
    prompt = f"""Competitive analysis: Voix Vive vs Brightspace vs Blackboard vs Coursera vs Yousician.

ScaffoldingProvider (core state):
{scaffolding}

Current Voix Vive feature inventory (from routes):
- Landing (/) - public marketing
- Onboarding (/onboarding) - new student setup
- Song (/song) - lesson orientation hub
- Player (/player) - practice portal
- Workbook (/workbook) - progress tracking, character sheet
- Studio (/studio) - recording sessions
- Game (/game) - VertiscaleEngine
- Adventure (/adventure) - gamified practice
- Community (/community) - social hub
- Mentor dashboard (/mentor) - Bertrand's admin view
- Inner Circle (/inner-circle) - blog/mentorship

Gap analysis:
1. What does Brightspace have that Voix Vive MUST add for beta?
2. What does Blackboard have that Voix Vive should SKIP (wrong for music)?
3. What does Yousician do that should inspire Voix Vive?
4. What does Coursera do for community that we're missing?
5. Create a feature matrix: Voix Vive vs competitors (✓ = has it, ✗ = missing, ★ = better)
6. Top 10 missing features ranked by student impact
7. What is Voix Vive's 3 unique unfair advantages?"""
    result = ask_nemotron(SYSTEM, prompt, "LMS Competitive Gap")
    save_output("09_lms_competitive_gap.md", result)

def run_session_10():
    """Mentor dashboard + student submission flow"""
    log("SESSION 10: Mentor dashboard + submission flow")
    mentor = collect_src_files("**/Mentor*", max_files=5, max_chars_each=10000)
    prompt = f"""Audit Bertrand's mentor dashboard and the student→mentor submission flow.

MENTOR FILES:
{mentor}

Context: Bertrand needs to:
- See student recordings/submissions
- Leave audio/video feedback
- Track each student's fret progression
- Manage his coaching tiers (free/journeyman/master)
- Run live sessions or post async video lessons

Analysis:
1. What does the current mentor dashboard actually do?
2. What is broken or missing for Bertrand to run his academy?
3. Design a clean mentor inbox — what does Bertrand see when he logs in?
4. Student submission flow: record → submit → Bertrand reviews → feedback → student sees it
5. What notifications does Bertrand need?
6. What does the "Inner Circle" (/inner-circle) provide vs mentor dashboard?
7. Priority order: what to build first for mentor experience at beta?
8. PEARL headers for MentorDashboard and MentorVideoRecorder"""
    result = ask_nemotron(SYSTEM, prompt, "Mentor Dashboard")
    save_output("10_mentor_dashboard_audit.md", result)

def run_session_11():
    """Onboarding funnel redesign"""
    log("SESSION 11: Onboarding funnel")
    onboarding = collect_src_files("**/Onboarding*", max_files=3, max_chars_each=20000)
    prompt = f"""Redesign the onboarding funnel for Voix Vive.

CURRENT ONBOARDING CODE:
{onboarding}

Context: "The first 5 minutes must be magical and guided."

Audit and redesign:
1. Map every step in the current onboarding
2. What is the MINIMUM viable onboarding? (what's essential vs optional)
3. When do students feel "I can do this!" — design for that moment
4. How does the somatic philosophy (breath-first) appear in onboarding?
5. Should Bertrand's face/voice appear in onboarding? How?
6. Mobile-first: what does onboarding look like on a phone?
7. Design a 5-step onboarding that ends with the student playing their first note
8. How does onboarding connect to the fret/traction system?
9. What data should be collected in onboarding to personalize the experience?"""
    result = ask_nemotron(SYSTEM, prompt, "Onboarding Funnel")
    save_output("11_onboarding_redesign.md", result)

def run_session_12():
    """Mobile-first audit"""
    log("SESSION 12: Mobile-first audit")
    css = read_file_safe(SRC_DIR / "index.css", 20000)
    book_partial = read_file_safe(SRC_DIR / "components" / "BookWidget.jsx", 15000)
    prompt = f"""Mobile-first audit for Voix Vive. Guitar students use phones constantly.

index.css (design system):
{css[:15000]}

BookWidget sample (representative component):
{book_partial[:10000]}

Audit:
1. Is the current CSS mobile-first or desktop-first? Evidence?
2. Which components will BREAK on 375px wide (iPhone SE)?
3. Which components are UNUSABLE with one hand (guitarist holds guitar in other hand)?
4. Touch target audit: are buttons >= 44px?
5. Typography: readable at arm's length on a music stand?
6. Design the "guitar player mode" — landscape phone while practicing
7. Top 5 mobile UX failures to fix before beta
8. Viewport and meta tag recommendations
9. PWA installability — does the manifest support home screen install?"""
    result = ask_nemotron(SYSTEM, prompt, "Mobile First")
    save_output("12_mobile_first_audit.md", result)

def run_session_13():
    """Breathing Gate + Somatic pedagogy implementation"""
    log("SESSION 13: Somatic pedagogy audit")
    breathing = collect_src_files("**/Breathing*", max_files=3, max_chars_each=12000)
    practice = collect_src_files("**/Practice*", max_files=3, max_chars_each=12000)
    pearl_doc = read_file_safe(DOCS_DIR / "doc 267 - PEARL STANDARD.md", 8000)
    prompt = f"""Audit somatic pedagogy implementation across the app.

User's framework: Breath → Body → Sound → Music (not theory-first)
Key concepts: PLING! (sonic resonance), SHEARL (frictionless gliding), Bard Levels

BreathingGate:
{breathing}

PracticeTimer / StructuredPracticeRecorder:
{practice}

PEARL Standard:
{pearl_doc}

Audit:
1. Where does the somatic philosophy APPEAR in the UI? Where is it ABSENT?
2. Does the breathing gate actually gate the lesson or is it skippable?
3. Is PLING! explained and demonstrated before students are asked to do it?
4. How does breath work connect to the game (VertiscaleEngine)?
5. What somatic cues are missing before each lesson phase?
6. Design a "somatic thread" — the pedagogical spine that runs through all 5 destinations
7. PEARL headers for BreathingGate and SomaticStudioPrompter
8. What would make Bertrand's somatic method UNIQUE vs any other guitar app?"""
    result = ask_nemotron(SYSTEM, prompt, "Somatic Pedagogy")
    save_output("13_somatic_pedagogy_audit.md", result)

def run_session_14():
    """AI integration audit — TroubadourAI, LM Studio, Kokoro"""
    log("SESSION 14: AI integration audit")
    ai_hook = read_file_safe(SRC_DIR / "hooks" / "useTroubadourAI.js", 20000)
    troubadour_chat = read_file_safe(SRC_DIR / "components" / "troubadour" / "TroubadourChat.jsx", 15000)
    prompt = f"""Audit the AI integration in Voix Vive.

useTroubadourAI.js (LM Studio integration):
{ai_hook}

TroubadourChat.jsx:
{troubadour_chat}

Audit:
1. How does the AI currently connect to LM Studio? What happens when it's offline?
2. What is the AI's actual persona/prompt — is Bertrand's voice consistent?
3. Does the AI know the student's fret level, traction, and bard level?
4. What AI features work offline vs require connection?
5. Voice: Kokoro TTS integration — how mature is it?
6. What AI responses would be most valuable for beta students? Rank top 5.
7. Design "Bertrand mode" — AI that sounds like and thinks like Maestro Bertrand
8. What safety guardrails are needed for an AI guitar coach?
9. Cost model: if 100 students use this daily, what's the compute load?"""
    result = ask_nemotron(SYSTEM, prompt, "AI Integration")
    save_output("14_ai_integration_audit.md", result)

def run_session_15():
    """Data model + Supabase schema audit"""
    log("SESSION 15: Data model audit")
    data_files = collect_src_files("**/data/**/*.js", max_files=10, max_chars_each=8000)
    lib_files  = collect_src_files("**/lib/**/*.js", max_files=8, max_chars_each=8000)
    prompt = f"""Audit the data model and Supabase schema.

Data files:
{data_files}

Lib files (Supabase/R2/Drive):
{lib_files}

Audit:
1. What tables/collections exist in Supabase?
2. What data is stored locally (localStorage) vs cloud?
3. Is the traction/fret data model scalable to 1000 students?
4. What data is missing for a complete student profile?
5. GDPR/privacy: what personal data is stored and how is it protected?
6. Offline-first: does the app work without internet? What breaks?
7. The .voixvive save file format — document its schema
8. What analytics/events should be tracked for beta?
9. Design the Supabase schema additions needed for: 
   - RIFT community posts
   - Mentor feedback/submissions
   - Cohort/class scheduling"""
    result = ask_nemotron(SYSTEM, prompt, "Data Model")
    save_output("15_data_model_audit.md", result)

def run_session_16():
    """Performance and PWA audit"""
    log("SESSION 16: Performance + PWA")
    vite_config = read_file_safe(PROJECT_ROOT / "vite.config.js", 5000)
    pkg = read_file_safe(PROJECT_ROOT / "package.json", 5000)
    prompt = f"""Performance and PWA audit for Voix Vive.

vite.config.js:
{vite_config}

package.json:
{pkg}

Build output: 
- dist/assets/index-8jmdMCyk.js: 671.94 kB (gzip: 244.65 kB) 
- dist/assets/ai-kokoro-zRXehzrI.js: 2,207.70 kB (gzip: 916.38 kB) — WAY too large
- PWA: generateSW mode, 495 entries precached (144MB!)

Critical issues:
1. The 2.2MB ai-kokoro chunk is a WASM blob — should it be lazy loaded?
2. 144MB precache is insane for a PWA — what should actually be precached?
3. Code splitting opportunities — which routes should be lazy-imported?
4. Recommendations for manualChunks in rollupOptions
5. Core Web Vitals: what likely scores LCP, CLS, INP?
6. Audio files in public/assets — how large are they? Should they be CDN-hosted?
7. Write the optimized vite.config.js changes
8. Service worker strategy: what should be cache-first vs network-first?"""
    result = ask_nemotron(SYSTEM, prompt, "Performance")
    save_output("16_performance_pwa_audit.md", result)

def run_session_17():
    """ScaffoldingProvider + state management audit"""  
    log("SESSION 17: State management audit")
    scaffolding = read_file_safe(SRC_DIR / "components" / "ScaffoldingProvider.jsx", 25000)
    prompt = f"""Audit the global state management in ScaffoldingProvider.

ScaffoldingProvider.jsx:
{scaffolding}

Audit:
1. What state lives in ScaffoldingProvider? List every piece.
2. What state SHOULD be global vs local-component?
3. Are there any infinite render loops or cascade renders? (ESLint flagged some)
4. Supabase sync: when does traction get saved? Is there a race condition?
5. What happens when two devices share the same account?
6. Is the context API sufficient or should this use Zustand/Jotai?
7. Performance: how many re-renders does a typical user session cause?
8. Design the RIFT-extended state: what new fields are needed for community features?
9. Write the corrected useEffect patterns to fix the cascading render warnings"""
    result = ask_nemotron(SYSTEM, prompt, "State Management")
    save_output("17_state_management_audit.md", result)

def run_session_18():
    """SEO + public landing page strategy"""
    log("SESSION 18: SEO + landing strategy")
    landing_files = collect_src_files("**/Landing*", max_files=3, max_chars_each=15000)
    prompt = f"""SEO and public-facing strategy for Voix Vive.

Landing page files:
{landing_files}

Context: voix-vive.com is the public URL. Beta launch imminent.

SEO audit:
1. What <title>, <meta description>, <og:> tags are present?
2. Structured data (schema.org) opportunities for a music academy
3. Key search terms: "online guitar lessons", "somatic guitar", "guitar for adults" — how to target?
4. What landing page sections convert visitors to signups?
5. What does the ideal landing page hero section contain?
6. Social sharing: what does the OG preview look like when shared on Twitter/LinkedIn?
7. Is the app indexed (or should it be noindexed until launch)?
8. Backlink strategy: where should Bertrand post to drive traffic?
9. Write the complete <head> tag for index.html
10. A/B test ideas: what 3 elements should be tested first for conversion?"""
    result = ask_nemotron(SYSTEM, prompt, "SEO Strategy")
    save_output("18_seo_landing_strategy.md", result)

def run_session_19():
    """Beta launch checklist"""
    log("SESSION 19: Beta launch checklist")
    # Collect outputs from previous sessions to synthesize
    prev_outputs = []
    for f in sorted(OUTPUT_DIR.glob("0[1-9]_*.md"))[:8]:
        prev_outputs.append(f"=== {f.name} ===\n{read_file_safe(f, 3000)}")
    
    prompt = f"""Create a complete beta launch checklist for Voix Vive.

Previous session findings (summary):
{chr(10).join(prev_outputs[:4])}

Known fixes completed today:
- TroubadourWidget: removed undefined cosyvoice reference
- BookWidget: fixed broken CSS string in settings panel
- CharacterSheet: added missing save/load function imports
- MentorVideoRecorder: fixed hoisting bug
- SomaticStudioPrompter: fixed hoisting bug
- Build: clean ✓ pushed to GitHub

Create:
1. MUST HAVE before public beta (P0) — app-breaking issues
2. SHOULD HAVE before beta (P1) — UX/learning flow issues
3. NICE TO HAVE for beta (P2) — polish
4. POST-BETA roadmap items (future sprints)
5. Who does what: Joshua (dev) vs Bertrand (content) vs AI agents (automated)
6. Deployment checklist: what env vars, secrets, domains need to be verified?
7. Beta user communication: what email do the first 10 students get?
8. Success metrics: how will you know beta is working?"""
    result = ask_nemotron(SYSTEM, prompt, "Beta Checklist")
    save_output("19_beta_launch_checklist.md", result)

def run_session_20():
    """Master implementation plan — the PEARL roadmap"""
    log("SESSION 20: Master PEARL roadmap")
    # Read all generated outputs
    all_outputs = []
    for f in sorted(OUTPUT_DIR.glob("[0-1][0-9]_*.md")):
        content = read_file_safe(f, 2000)
        all_outputs.append(f"=== {f.name} ===\n{content[:1500]}")
    
    prompt = f"""Synthesize all 19 analysis sessions into a single Master Implementation Plan.

Session summaries:
{chr(10).join(all_outputs)}

USER GOALS:
- "The best guitar app in the world"
- 5-destination nav: Home, Song, Player, Playbook/Binder, RIFT
- Troubadour Guitar + Troubadour Binder as the two ambient widgets
- PEARL standard on all files
- Beat Brightspace for music education UX
- Somatic learning as the pedagogical spine

Produce: THE MASTER VOIX VIVE BETA → V1.0 ROADMAP

Structure:
## Phase 1: Beta Stabilization (this week)
## Phase 2: RIFT Launch (next 2 weeks)  
## Phase 3: Academy Polish (month 2)
## Phase 4: Community + Mentor (month 3)
## Phase 5: V1.0 Launch (month 4)

For each phase:
- Goal statement
- Specific files to create/modify/delete
- AI agent tasks (what Nemotron can do autonomously)
- Human tasks (Joshua + Bertrand only)
- Success criteria

Also produce:
- The 10 PEARL headers that need writing most urgently
- The 5 routes to DELETE before beta
- The single most important UX change for user retention"""
    result = ask_nemotron(SYSTEM, prompt, "Master Roadmap")
    save_output("20_master_pearl_roadmap.md", result)

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN RUNNER
# ═══════════════════════════════════════════════════════════════════════════════

def run_session_21():
    """12M Bible Cross-Reference Audit"""
    log("SESSION 21: 12M Bible Cross-Reference Audit")
    bible = read_file_safe("docs/ai/12M_bible.md", max_chars=40000)
    curriculum = read_file_safe("src/data/chapterData.js", max_chars=20000)
    prompt = f"""Audit the Voix Vive curriculum against the 12M Bible.
12M BIBLE CONTEXT:
{bible}
---
CURRICULUM DATA:
{curriculum}
---
Tasks:
1. Identify pedagogical gaps where the curriculum does not fully align with the 12M Bible's philosophy.
2. Provide a structured JSON patch recommending updates to the chapterData.js (new slides, altered texts, missing concepts).
3. Ensure somatic breathing and physical awareness are integrated into any missing frets.
"""
    result = ask_nemotron(SYSTEM, prompt, "12M Bible Audit")
    save_output("21_12m_bible_audit.md", result)

def run_session_22():
    """The Liquid-Ready RAG Chunking"""
    log("SESSION 22: Liquid-Ready RAG Chunking")
    docs = collect_key_docs(["bible", "architecture", "pedagogy"], max_docs=5, max_chars_each=15000)
    prompt = f"""Slice and optimize the following documentation for Nomic embeddings (RAG).
SOURCE DOCS:
{docs}
---
Tasks:
1. Read the provided documentation.
2. Slice the content into highly optimized, context-rich Markdown chunks specifically designed for vector embedding retrieval.
3. Each chunk should have a clear header, standalone context, and be no longer than 500 words.
4. Output the chunks sequentially.
"""
    result = ask_nemotron(SYSTEM, prompt, "RAG Chunking")
    save_output("22_rag_chunking.md", result)

def run_session_23():
    """Gamification & Economy Stress Test"""
    log("SESSION 23: Gamification & Economy Stress Test")
    economy = read_file_safe("src/hooks/usePlayerState.js", max_chars=20000)
    map_code = read_file_safe("src/components/MaturationMap.jsx", max_chars=15000)
    prompt = f"""Stress test the guitar economy and gamification logic.
ECONOMY CODE (usePlayerState.js):
{economy}
---
MAP CODE (MaturationMap.jsx):
{map_code}
---
Tasks:
1. Simulate a 10,000-step student progression through the economy (XP, Resonance, Tone).
2. Identify any mathematical exploits, edge cases, or imbalances where a user could farm XP without learning.
3. Provide a structured list of recommended formula adjustments or rate-limits to prevent exploits.
4. Evaluate if the XP scale matches the 12-fret journey appropriately.
"""
    result = ask_nemotron(SYSTEM, prompt, "Economy Stress Test")
    save_output("23_economy_stress_test.md", result)

SESSIONS = [
    run_session_01,
    run_session_02,
    run_session_03,
    run_session_04,
    run_session_05,
    run_session_06,
    run_session_07,
    run_session_08,
    run_session_09,
    run_session_10,
    run_session_11,
    run_session_12,
    run_session_13,
    run_session_14,
    run_session_15,
    run_session_16,
    run_session_17,
    run_session_18,
    run_session_19,
    run_session_20,
    run_session_21,
    run_session_22,
    run_session_23,
]

if __name__ == "__main__":
    start = time.time()
    log("=" * 60)
    log("VOIX VIVE — Nemotron Autonomous Orchestrator")
    log(f"Model: {MODEL}")
    log(f"Sessions: {len(SESSIONS)}")
    log(f"Output: {OUTPUT_DIR}")
    log("=" * 60)

    # Quick API test
    log("Testing LM Studio connection...")
    test = ask_nemotron("You are helpful.", "Reply with exactly: NEMOTRON_READY", "Connection test")
    if "ERROR" in test:
        log(f"FATAL: Cannot reach LM Studio. {test}")
        sys.exit(1)
    log(f"LM Studio OK: {test[:50]}")

    completed = []
    failed    = []
    skipped   = []

    for i, session_fn in enumerate(SESSIONS, 1):
        # Check if output already exists — skip if so (resume support)
        expected_file = OUTPUT_DIR / f"{i:02d}_*.md"
        already_done  = list(OUTPUT_DIR.glob(f"{i:02d}_*.md"))
        if already_done:
            log(f"⏭  Session {i:02d} already done ({already_done[0].name}) — skipping")
            skipped.append(session_fn.__name__)
            continue

        log(f"\n{'─'*50}")
        log(f"STARTING SESSION {i:02d}/{len(SESSIONS)}: {session_fn.__name__}")
        log(f"{'─'*50}")
        try:
            session_fn()
            completed.append(session_fn.__name__)
            log(f"✓ Session {i:02d} complete")
        except Exception as e:
            log(f"✗ Session {i:02d} FAILED: {e}")
            failed.append((session_fn.__name__, str(e)))
        
        # Brief pause between sessions to not hammer the API
        if i < len(SESSIONS):
            time.sleep(2)

    elapsed = time.time() - start
    log(f"\n{'='*60}")
    log(f"ORCHESTRATOR COMPLETE")
    log(f"Elapsed: {elapsed/60:.1f} minutes")
    log(f"Completed: {len(completed)}/{len(SESSIONS)}")
    if failed:
        log(f"Failed: {[f[0] for f in failed]}")
    log(f"Results: {OUTPUT_DIR}/")
    log(f"{'='*60}")
    
    # Write final summary index
    summary = f"""# Nemotron Orchestrator Run — {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}

## Results
- **Model**: {MODEL}
- **Sessions**: {len(completed)}/{len(SESSIONS)} completed  
- **Elapsed**: {elapsed/60:.1f} minutes
- **Output dir**: `nemotron_output/`

## Files Generated
"""
    for f in sorted(OUTPUT_DIR.glob("[0-9]*.md")):
        summary += f"- [{f.name}]({f.name})\n"
    
    if failed:
        summary += "\n## Failed Sessions\n"
        for name, err in failed:
            summary += f"- {name}: {err}\n"
    
    save_output("00_INDEX.md", summary)
    log("Done. Check nemotron_output/00_INDEX.md for all results.")

