#!/usr/bin/env python3
"""
VOIX VIVE — Nemotron Wiring Queue Orchestrator
Executes the tasks from the "NEMOTRON QUEUE" in sprint_board.md.
"""

import os, json, time, datetime, sys
from pathlib import Path
import urllib.request

LM_STUDIO_URL  = "http://127.0.0.1:1234/v1/chat/completions"
MODEL          = "nemotron-3-super-120b-a12b"
PROJECT_ROOT   = Path("/home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass")
SRC_DIR        = PROJECT_ROOT / "src"
OUTPUT_DIR     = PROJECT_ROOT / "nemotron_output" / "wiring"
MAX_TOKENS     = 16384
TEMP           = 0.2

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
LOG_FILE = OUTPUT_DIR / f"wiring_run_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.log"

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
    path = OUTPUT_DIR / filename
    path.write_text(content)
    log(f"  💾 {path}")
    return path

def read_file(path, max_chars=30000):
    try:
        return Path(path).read_text(errors="replace")[:max_chars]
    except Exception as e:
        log(f"Error reading file {path}: {e}")
        return ""

SYSTEM_PROMPT = """You are a senior React/Vite/LMS integration engineer writing code for 
Voix Vive — a somatic guitar academy web app.

RULES:
1. Output ONLY complete, working code — no pseudocode, no "..." placeholders
2. For new files: output the complete file content
3. For edits: output the complete modified file (not a diff) unless it's huge
4. Follow the existing code style (single quotes, arrow functions, inline styles or CSS classes)
5. Explain your reasoning briefly before outputting the code.
"""

def task_01_troubadour_modifier():
    log("TASK 01: Analyze troubadourPrompt.js to inject playerModifier")
    file_content = read_file(SRC_DIR / "data" / "troubadourPrompt.js")
    prompt = f"""## Current troubadourPrompt.js:
{file_content}

## Task:
The player state has a modifier property (from usePlayerState) that reflects the student's emotional state or tone based on the BE check-in. 
Propose exact modifications to `buildCompressedPrompt` and/or `buildTroubadourPrompt` to accept a `playerModifier` argument (string or object) and inject it into the system prompt.
The `playerModifier` might contain `tone` (e.g. 'tense', 'curious', 'frustrated').
Output the modified functions or file."""
    res = ask_nemotron(SYSTEM_PROMPT, prompt, "troubadourPrompt.js modifier injection")
    save("01_troubadour_modifier.md", res)

def task_02_be_workbook_audit():
    log("TASK 02: Audit BEWorkbook.jsx for check-in capture")
    file_content = read_file(SRC_DIR / "components" / "workbook" / "BEWorkbook.jsx")
    prompt = f"""## Current BEWorkbook.jsx:
{file_content}

## Task:
We need to wire the BE check-in so that when a student answers the mood/somatic question, it calls `recordBECheckIn(answer)`.
Identify the exact event and component in `BEWorkbook.jsx` where the check-in answer is captured.
Rewrite the relevant parts of the component to import `usePlayerState` and call `player.recordBECheckIn(answer)` at that exact event."""
    res = ask_nemotron(SYSTEM_PROMPT, prompt, "BEWorkbook.jsx event audit")
    save("02_be_workbook_audit.md", res)

def task_03_course_manifest():
    log("TASK 03: Draft courseManifest.js")
    prompt = """## Task:
Draft `src/data/courseManifest.js` which defines a 12-module structure (one per fret) suitable for exporting to Brightspace/Blackboard.
Each of the 12 modules must include:
- `id` (e.g., 'fret-1')
- `title` (e.g., 'The Root Note')
- `description`
- `objectives` (Array of strings using Bloom's Taxonomy verbs: e.g., 'Identify...', 'Demonstrate...', 'Analyze...')
- `estimatedTime` (e.g., '45 minutes')
- `prerequisites` (e.g., array of previous module IDs)

Output the complete JavaScript file exporting this array."""
    res = ask_nemotron(SYSTEM_PROMPT, prompt, "Draft courseManifest.js")
    save("03_course_manifest.md", res)

def task_04_xapi_draft():
    log("TASK 04: Draft xapi.js templates")
    prompt = """## Task:
Draft `src/utils/xapi.js`.
This file must export 5 function templates that construct exact xAPI 1.0.3 statement objects.
The 5 statements to fire are:
1. `recordAttemptedSession(actorId, fretId)`
2. `recordCompletedSession(actorId, fretId)`
3. `recordProgressedFret(actorId, fretId, newStarLevel)`
4. `recordExperiencedTroubadour(actorId, promptSnippet)`
5. `recordMasteredFret(actorId, fretId)`

Use standard xAPI verbs (http://adlnet.gov/expapi/verbs/...).
Output the complete JavaScript file."""
    res = ask_nemotron(SYSTEM_PROMPT, prompt, "Draft xapi.js")
    save("04_xapi_draft.md", res)

def task_05_maturation_map():
    log("TASK 05: Analyze MaturationMap.jsx to surface Voice")
    file_content = read_file(SRC_DIR / "components" / "MaturationMap.jsx")
    prompt = f"""## Current MaturationMap.jsx:
{file_content}

## Task:
"Voice" is the long-horizon XP / progression metric in Voix Vive.
Propose specific UI changes (and output the modified code) for `MaturationMap.jsx` to surface the student's "Voice" and "Resonance" clearly and beautifully on the map."""
    res = ask_nemotron(SYSTEM_PROMPT, prompt, "MaturationMap.jsx Voice surface")
    save("05_maturation_map_audit.md", res)

def task_06_xapi_lti_arch():
    log("TASK 06: Draft xAPI + LTI Architecture")
    prompt = """## Task:
Draft a high-level architecture document for integrating xAPI and LTI 1.3 into Voix Vive.
Specifically address:
- Can this be serverless (e.g. Supabase Edge Functions or Netlify Functions)?
- What is the minimal backend needed for LTI 1.3 launch and grade passback?
- How should the xAPI statements be batched or sent?
Provide a concrete architectural recommendation (e.g., markdown summary with sequence diagram or bullet points)."""
    res = ask_nemotron(SYSTEM_PROMPT, prompt, "xAPI + LTI Architecture")
    save("06_xapi_lti_architecture.md", res)

if __name__ == "__main__":
    log("Starting Nemotron Wiring Tasks Orchestration")
    task_01_troubadour_modifier()
    task_02_be_workbook_audit()
    task_03_course_manifest()
    task_04_xapi_draft()
    task_05_maturation_map()
    task_06_xapi_lti_arch()
    log("Finished all wiring tasks")
