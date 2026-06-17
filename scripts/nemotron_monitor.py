#!/usr/bin/env python3
"""
VOIX VIVE — Workflow Monitor & Auto-Apply
Watches the nemotron_output/ folder, tracks what's done,
then triggers the implementor once analysis is ready.

This script is the CONDUCTOR of the full pipeline:
  1. Watches Phase 1 (analysis) progress
  2. When enough analysis is done, launches Phase 2 (implementation)
  3. Writes a STATUS.md Joshua can read at any time

Usage: python3 nemotron_monitor.py
"""
import os, time, subprocess, datetime
from pathlib import Path
import json

PROJECT_ROOT = Path("/home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass")
OUTPUT_DIR   = PROJECT_ROOT / "nemotron_output"
IMPL_DIR     = OUTPUT_DIR / "impl"
STATUS_FILE  = OUTPUT_DIR / "STATUS.md"

def get_analysis_sessions_done():
    done = []
    for f in OUTPUT_DIR.glob("[0-9][0-9]_*.md"):
        n = int(f.name[:2])
        done.append(n)
    return sorted(done)

def get_impl_sessions_done():
    done = []
    for f in IMPL_DIR.glob("impl_[0-9][0-9]_*.md"):
        n = int(f.name.split("_")[1])
        done.append(n)
    return sorted(done)

def is_analysis_running():
    result = subprocess.run(
        ["pgrep", "-f", "nemotron_orchestrator"],
        capture_output=True, text=True
    )
    return bool(result.stdout.strip())

def is_impl_running():
    result = subprocess.run(
        ["pgrep", "-f", "nemotron_implementor"],
        capture_output=True, text=True
    )
    return bool(result.stdout.strip())

def write_status():
    analysis_done  = get_analysis_sessions_done()
    impl_done      = get_impl_sessions_done()
    analysis_names = {
        1:  "Doc catalog + triage",
        2:  "Route architecture audit",
        3:  "PEARL audit — Landing + Song",
        4:  "PEARL audit — Player",
        5:  "PEARL audit — Workbook/Binder",
        6:  "RIFT page design",
        7:  "Widget split (Guitar vs Binder)",
        8:  "Game mode analysis",
        9:  "LMS competitive gap",
        10: "Mentor dashboard",
        11: "Onboarding redesign",
        12: "Mobile-first audit",
        13: "Somatic pedagogy",
        14: "AI integration",
        15: "Data model",
        16: "Performance + PWA",
        17: "State management",
        18: "SEO + landing",
        19: "Beta launch checklist",
        20: "Master PEARL roadmap",
    }
    impl_names = {
        1: "App.jsx 5-destination routes",
        2: "RiftHub.jsx new page",
        3: "PrimaryNav.jsx bottom/top nav",
        4: "Workbook → Binder rename",
        5: "PEARL headers — critical files",
        6: "Dead route cleanup",
        7: "Quality assessment",
    }
    
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    lines = [
        f"# Voix Vive — Nemotron Pipeline Status",
        f"*Last updated: {ts}*",
        f"",
        f"## Phase 1: Analysis ({len(analysis_done)}/20 complete)",
        f"",
    ]
    for n in range(1, 21):
        name  = analysis_names.get(n, f"Session {n:02d}")
        check = "✅" if n in analysis_done else ("🔄 *Running*" if (is_analysis_running() and n == min(set(range(1,21)) - set(analysis_done), default=21)) else "⏳")
        fpath = list(OUTPUT_DIR.glob(f"{n:02d}_*.md"))
        size  = f"({fpath[0].stat().st_size // 1000}k chars)" if fpath else ""
        lines.append(f"- {check} **{n:02d}** — {name} {size}")
    
    lines += [
        f"",
        f"## Phase 2: Implementation ({len(impl_done)}/7 complete)",
        f"",
    ]
    for n in range(1, 8):
        name  = impl_names.get(n, f"Impl {n:02d}")
        check = "✅" if n in impl_done else ("🔄 *Running*" if (is_impl_running() and n == min(set(range(1,8)) - set(impl_done), default=8)) else "⏳")
        fpath = list(IMPL_DIR.glob(f"impl_{n:02d}_*.md"))
        size  = f"({fpath[0].stat().st_size // 1000}k chars)" if fpath else ""
        lines.append(f"- {check} **{n:02d}** — {name} {size}")
    
    lines += [
        f"",
        f"## Key Findings So Far",
        f"",
    ]
    
    # Pull highlights from completed reports
    if 2 in analysis_done:
        lines += [
            f"### Route Architecture (Session 02)",
            f"- **Kill before beta**: `/summary`, `/inner-circle`, `/studio` standalone",
            f"- **Move to /rift**: `/game`, `/adventure`, `/studio/prompter`, `/guitar/map`",
            f"- **Rename**: `/workbook` → `/binder`",
            f"- **New**: `/rift` → RiftHub.jsx",
            f"- **5-nav**: Home · Song · Player · Binder · RIFT",
            f"",
        ]
    if 1 in analysis_done:
        lines += [
            f"### Doc Triage (Session 01)",
            f"- ~30 ACTIVE docs (keep/use for beta)",
            f"- ~260 MERGE (duplicate READMEs/LICENSEs — pure noise)",
            f"- ~60 DELETE (CUDA/Docker/Android guides — irrelevant to web app)",
            f"",
        ]
    
    # Check for completed impl files and summarize
    for n in impl_done:
        name = impl_names.get(n, f"Impl {n:02d}")
        fpath = list(IMPL_DIR.glob(f"impl_{n:02d}_*.md"))
        if fpath:
            preview = fpath[0].read_text()[:300].replace("\n", " ")
            lines.append(f"### Impl {n:02d}: {name}")
            lines.append(f"> {preview}...")
            lines.append(f"")
    
    lines += [
        f"",
        f"## Pipeline State",
        f"- Analysis orchestrator running: {'✅ Yes' if is_analysis_running() else '❌ No'}",
        f"- Implementation orchestrator running: {'✅ Yes' if is_impl_running() else '❌ No'}",
        f"",
        f"## Output Files",
        f"- Analysis: `nemotron_output/[01-20]_*.md`",
        f"- Implementation code: `nemotron_output/impl/impl_[01-07]_*.md`",
        f"- This file: `nemotron_output/STATUS.md`",
        f"",
        f"## What Joshua Needs To Do When Back",
        f"1. Read `nemotron_output/20_master_pearl_roadmap.md` (big picture)",
        f"2. Read `nemotron_output/impl/impl_07_quality_report.md` (review checklist)",
        f"3. Approve/reject each impl change — all code is in `impl/impl_0X_*.md`",
        f"4. Antigravity applies approved changes + runs `npx vite build`",
        f"5. Push to GitHub",
    ]
    
    STATUS_FILE.write_text("\n".join(lines))
    return len(analysis_done), len(impl_done)

def launch_implementor():
    """Launch Phase 2 if not already running and we have enough analysis done."""
    if is_impl_running():
        return
    IMPL_DIR.mkdir(exist_ok=True)
    log_file = IMPL_DIR / f"impl_launch_{datetime.datetime.now().strftime('%H%M%S')}.log"
    cmd = f"setsid python3 -u {PROJECT_ROOT}/nemotron_implementor.py >> {log_file} 2>&1 &"
    os.system(cmd)
    print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] 🚀 Launched Phase 2 implementor")

if __name__ == "__main__":
    print("📡 Monitor started — writing STATUS.md every 60s")
    check_count = 0
    while True:
        analysis_done, impl_done = write_status()
        check_count += 1
        ts = datetime.datetime.now().strftime("%H:%M:%S")
        print(f"[{ts}] Analysis: {analysis_done}/20  Impl: {impl_done}/7  "
              f"Analysis running: {is_analysis_running()}  Impl running: {is_impl_running()}")
        
        # Launch Phase 2 when we have sessions 01 and 02 done (route + doc analysis)
        if analysis_done >= 2 and not is_impl_running():
            print(f"[{ts}] ✅ Enough analysis done — launching Phase 2 implementor")
            launch_implementor()
        
        # If both are done, write final status and exit
        if analysis_done >= 20 and impl_done >= 7:
            write_status()
            print(f"[{ts}] 🏁 ALL DONE — check STATUS.md and impl/ folder")
            break
        
        time.sleep(60)
