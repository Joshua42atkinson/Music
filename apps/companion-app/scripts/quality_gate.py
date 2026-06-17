#!/usr/bin/env python3
"""
╔══ VOIX VIVE — VISUAL QUALITY GATE ════════════════════════════════╗
║  quality_gate.py                                                  ║
║  Pipeline: Chrome screenshot → Vision model → Nemotron judge      ║
║                                                                   ║
║  Usage:                                                           ║
║    python3 scripts/quality_gate.py [url] [page_name]             ║
║    python3 scripts/quality_gate.py http://localhost:5173/ landing ║
║    python3 scripts/quality_gate.py http://localhost:5173/riff riff║
║                                                                   ║
║  Models (swap VISION_MODEL when you load gemma-4-e2b):           ║
║    VISION_MODEL   = "gemma-4-e2b"    ← small, fast, multimodal  ║
║    REASONING_MODEL = nemotron-120b   ← 1M ctx, reasoning        ║
╚═══════════════════════════════════════════════════════════════════╝
"""

import base64, json, sys, subprocess, datetime, urllib.request, urllib.error
from pathlib import Path

# ── Config — swap VISION_MODEL when gemma-4-e2b is loaded ─────────
LM_BASE         = "http://localhost:1234"
VISION_MODEL    = "gemma-4-e2b"              # load this in LM Studio (small!)
REASONING_MODEL = "nemotron-3-super-120b-a12b"

SITE_URL   = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:5173/"
PAGE_NAME  = sys.argv[2] if len(sys.argv) > 2 else "landing"
REPORT_DIR = Path(__file__).parent.parent / "nemotron_output" / "quality_gates"
REPORT_DIR.mkdir(parents=True, exist_ok=True)
TIMESTAMP  = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
SHOT_PATH  = REPORT_DIR / f"{PAGE_NAME}_{TIMESTAMP}.png"


# ── 1. Screenshot via headless Chrome ─────────────────────────────
def take_screenshot(url: str, out: Path) -> bool:
    result = subprocess.run([
        "google-chrome", "--headless=new",
        f"--screenshot={out}",
        "--window-size=1280,900",
        "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
        url
    ], capture_output=True, timeout=20)
    return out.exists() and out.stat().st_size > 1000


# ── 2. Parse LM Studio response (handles both API formats) ────────
def parse_response(d: dict) -> str:
    """Handles OpenAI-compat AND native LM Studio response formats."""
    # Native format: {output: [{type: 'message'|'reasoning', content: ...}]}
    if "output" in d:
        parts = d["output"]
        # prefer 'message' type, fall back to 'reasoning'
        for p in parts:
            if p.get("type") == "message":
                return p.get("content", "").strip()
        for p in parts:
            if p.get("type") == "reasoning":
                return p.get("content", "").strip()
        return ""
    # OpenAI-compat format: {choices: [{message: {content, reasoning_content}}]}
    if "choices" in d:
        msg = d["choices"][0]["message"]
        return (msg.get("content") or msg.get("reasoning_content") or "").strip()
    return str(d)


# ── 3. Unified LM call — tries OpenAI format, falls back to native ─
def lm_call(model: str, messages: list, max_tokens=500, thinking=False) -> str:
    # Build OpenAI-compat payload (supports vision image_url content)
    payload = {
        "model": model,
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": 1.0,
        "top_p": 0.95,
    }
    if model == REASONING_MODEL:
        payload["extra_body"] = {
            "chat_template_kwargs": {"enable_thinking": thinking}
        }
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        f"{LM_BASE}/v1/chat/completions",
        data=data, headers={"Content-Type": "application/json"}, method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            return parse_response(json.loads(resp.read()))
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        return f"ERROR {e.code}: {body[:300]}"
    except Exception as e:
        return f"ERROR: {e}"

# Alias for clarity
oai_call = lm_call


# ── 3. Gemma-4-e2b vision audit ───────────────────────────────────
VISION_PROMPT = (
    f"UX audit of this '{PAGE_NAME}' page from a guitar academy called Voix Vive.\n"
    "Brand: dark background, gold accents, premium/mystical feel.\n\n"
    "Report:\n"
    "SEES: [2 sentences describing the page]\n"
    "OVERWHELM: [1-5 score + 1-sentence reason]\n"
    "PROBLEMS: [top 3 visual/UX issues, numbered]\n"
    "STRENGTHS: [top 2 things working well]\n"
    "BRAND_FIT: [STRONG / MODERATE / WEAK + why]\n"
)

def vision_audit(img_path: Path) -> str:
    with open(img_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    return oai_call(VISION_MODEL, [{
        "role": "user",
        "content": [
            {"type": "text", "text": VISION_PROMPT},
            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}}
        ]
    }], max_tokens=400)


# ── 4. Nemotron quality gate ──────────────────────────────────────
GATE_SYSTEM = """You are the quality gate for Voix Vive, a somatic guitar academy.
Brand: #050508 bg, #c9a96e gold, Cormorant Garamond serif, 5 destinations: Home/Song/Player/Binder/RIFF.
Core: Troubadour widget (red guitar icon, AI voice).

Given a visual audit, output EXACTLY this — no extra text:

DRIFT: [on-brand or drifting — 1 sentence]
OVERWHELM: CALM | MODERATE | HIGH

FIX 1: [src/path/File.jsx] — [exact change needed]
FIX 2: [src/path/File.jsx] — [exact change needed]
FIX 3: [src/path/File.jsx] — [exact change needed]

GATE: PASS ✅  or  FAIL ❌
REASON: [1 sentence]"""

def nemotron_gate(vision_report: str) -> str:
    return oai_call(REASONING_MODEL, [
        {"role": "system", "content": GATE_SYSTEM},
        {"role": "user",   "content": f"Visual audit for page '{PAGE_NAME}':\n\n{vision_report}"}
    ], max_tokens=400, thinking=False)


# ── 5. Save markdown report ───────────────────────────────────────
def save_report(vision: str, gate: str) -> Path:
    path = REPORT_DIR / f"{PAGE_NAME}_{TIMESTAMP}_report.md"
    path.write_text(f"""# 🎸 Voix Vive Quality Gate: `{PAGE_NAME}`
*{TIMESTAMP} | {SITE_URL}*

![Screenshot]({SHOT_PATH})

## 👁 Gemma-4 Vision Audit
{vision}

## 🧠 Nemotron Quality Gate
{gate}
""")
    return path


# ── Main ──────────────────────────────────────────────────────────
def main():
    print(f"\n🎸 Voix Vive Quality Gate — {PAGE_NAME} @ {SITE_URL}")
    print("─" * 60)

    # Check vision model is loaded
    try:
        models_req = urllib.request.urlopen(f"{LM_BASE}/v1/models", timeout=3)
        models = [m["id"] for m in json.loads(models_req.read())["data"]]
        if VISION_MODEL not in models:
            print(f"⚠️  Vision model '{VISION_MODEL}' not loaded in LM Studio.")
            print(f"   Load it, then re-run. Available: {models}")
            print(f"   Tip: gemma-4-e2b is small (~1.5GB) and works alongside Nemotron.")
            sys.exit(2)
        print(f"✅ Vision:    {VISION_MODEL}")
        print(f"✅ Reasoning: {REASONING_MODEL}")
    except Exception as e:
        print(f"❌ LM Studio not reachable: {e}")
        sys.exit(1)

    # Screenshot
    print(f"\n📸 Screenshotting {SITE_URL}...")
    if not take_screenshot(SITE_URL, SHOT_PATH):
        print("❌ Screenshot failed — is dev server running? (npm run dev)")
        sys.exit(1)
    print(f"   {SHOT_PATH} ({SHOT_PATH.stat().st_size // 1024}KB)")

    # Vision
    print(f"\n👁  {VISION_MODEL} analyzing...")
    vision = vision_audit(SHOT_PATH)
    print(vision)

    # Gate
    print(f"\n🧠 Nemotron quality gate...")
    gate = nemotron_gate(vision)
    print(gate)

    # Save
    report = save_report(vision, gate)
    print(f"\n📄 Report: {report}")

    # Exit code for CI/scripts
    sys.exit(1 if ("FAIL" in gate and "PASS" not in gate) else 0)


if __name__ == "__main__":
    main()
