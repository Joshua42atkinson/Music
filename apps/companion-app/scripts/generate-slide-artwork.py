#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════
Voix Vive — Slide Artwork Batch Generator
Uses LongCat-Image via diffusers to generate intentional,
curated artwork for each slide based on the manifest.

Prerequisites:
  pip install diffusers transformers accelerate

Run overnight:
  python3 scripts/generate-slide-artwork.py

Hardware: AMD Strix Halo (ROCm 6.3) — 128GB unified RAM
Model: meituan-longcat/LongCat-Image (~6GB, auto-downloaded)
═══════════════════════════════════════════════════════════════
"""

import json
import os
import sys
import time
from pathlib import Path

# ── Configuration ────────────────────────────────────────────────
MANIFEST_PATH = Path(__file__).parent / "slideArtManifest.json"
PROJECT_ROOT = Path(__file__).parent.parent
OUTPUT_DIR = PROJECT_ROOT / "public" / "assets" / "slides"
# ═══════════════════════════════════════════════════════════════════
# LOCAL MODEL CONFIGURATION
# The user MUST provide a local model path. We NEVER auto-download.
# Set this env var before running:
#   export LONGCAT_MODEL_PATH=/path/to/LongCat-Image
# Or use ComfyUI models directory:
#   export LONGCAT_MODEL_PATH=$HOME/ComfyUI/models/diffusers/LongCat-Image
# ═══════════════════════════════════════════════════════════════════

MODEL_ID = os.environ.get("LONGCAT_MODEL_PATH", "")
if not MODEL_ID:
    print("ERROR: LONGCAT_MODEL_PATH environment variable not set.")
    print("  export LONGCAT_MODEL_PATH=/path/to/your/LongCat-Image")
    print("  # Or symlink your existing ComfyUI model:")
    print("  # ln -s ~/ComfyUI/models/diffusers/LongCat-Image $MODEL_PATH")
    sys.exit(1)

# ROCm detection — Strix Halo should handle this fine
DEVICE = "cuda"  # ROCm reports as CUDA in PyTorch
DTYPE = "bfloat16"
WIDTH = 1344
HEIGHT = 768
STEPS = 35
CFG = 4.0


def load_manifest():
    with open(MANIFEST_PATH, "r") as f:
        return json.load(f)


def ensure_dirs(slides):
    """Create output directories for all slide paths."""
    for slide in slides:
        path = PROJECT_ROOT / slide["path"]
        path.parent.mkdir(parents=True, exist_ok=True)


def build_prompt(slide, style):
    """Assemble the final prompt with style guide prefix."""
    base = slide.get("prompt", "")
    prefix = style.get("prefix", "")
    # Ensure no double-prefix if prompt already starts with it
    if base.startswith(prefix.strip().rstrip(",")):
        return base
    return f"{prefix} {base}"


def generate_image(pipe, prompt, negative, output_path, seed=-1):
    """Generate a single image and save it."""
    import torch

    generator = torch.Generator("cpu").manual_seed(seed if seed >= 0 else int(time.time()))

    result = pipe(
        prompt,
        negative_prompt=negative,
        width=WIDTH,
        height=HEIGHT,
        num_inference_steps=STEPS,
        guidance_scale=CFG,
        num_images_per_prompt=1,
        generator=generator,
        enable_cfg_renorm=True,
        enable_prompt_rewrite=True,
    )

    image = result.images[0]
    image.save(output_path)
    return output_path


def generate_with_supervision(pipe, slide, style, idx, total):
    """Generate with quality supervision — retry on failure."""
    prompt = build_prompt(slide, style)
    negative = style.get("negative", "")
    output_path = PROJECT_ROOT / slide["path"]
    max_retries = 3

    for attempt in range(max_retries):
        try:
            print(f"  [{idx+1}/{total}] Generating: {slide['id']} (attempt {attempt+1}/{max_retries})")
            print(f"    Prompt: {prompt[:120]}...")
            generate_image(pipe, prompt, negative, str(output_path), seed=slide.get("seed", -1))
            print(f"    ✓ Saved: {output_path}")
            return True
        except Exception as e:
            print(f"    ✗ Error: {e}")
            if attempt < max_retries - 1:
                wait = 2 ** attempt
                print(f"    Retrying in {wait}s...")
                time.sleep(wait)
            else:
                print(f"    FAILED after {max_retries} attempts. Skipping.")
                return False


def quality_check(output_path):
    """Basic quality gate: file exists, non-empty, reasonable size."""
    if not output_path.exists():
        return False, "File not created"
    size = output_path.stat().st_size
    if size < 10_000:
        return False, f"File too small ({size} bytes)"
    if size > 50_000_000:
        return False, f"File unexpectedly large ({size} bytes)"
    return True, f"OK ({size // 1024}KB)"


def main():
    print("═══════════════════════════════════════════════════════════════")
    print("  Voix Vive — Slide Artwork Overnight Generator")
    print("  Model: LongCat-Image via diffusers")
    print("  Device: AMD Strix Halo (ROCm)")
    print("═══════════════════════════════════════════════════════════════\n")

    # ── Check dependencies ─────────────────────────────────────
    try:
        import torch
        import diffusers
        print(f"✓ PyTorch: {torch.__version__}")
        print(f"✓ Diffusers: {diffusers.__version__}")
        print(f"✓ ROCm/HIP: {torch.version.hip if hasattr(torch.version, 'hip') else 'N/A'}")
        print(f"✓ CUDA available: {torch.cuda.is_available()}")
    except ImportError as e:
        print(f"✗ Missing dependency: {e}")
        print("  Install with: pip install diffusers transformers accelerate")
        sys.exit(1)

    # ── Load manifest ────────────────────────────────────────────
    manifest = load_manifest()
    style = manifest["_styleGuide"]
    slides = manifest["slides"]
    total = len(slides)

    print(f"\n📋 Manifest loaded: {total} slides to generate")
    print(f"   Output root: {OUTPUT_DIR}")

    # ── Ensure directories ───────────────────────────────────────
    ensure_dirs(slides)

    # ── Load model ───────────────────────────────────────────────
    print(f"\n🔄 Loading LongCat-Image model from:")
    print(f"   {MODEL_ID}")
    print(f"   (Local model only — no downloads)")
    start = time.time()

    from diffusers import LongCatImagePipeline
    import torch

    pipe = LongCatImagePipeline.from_pretrained(
        MODEL_ID,
        torch_dtype=torch.bfloat16,
        local_files_only=True,  # NEVER download — fail if missing
    )

    # Strix Halo has 128GB unified RAM; try GPU first, fall back to CPU offload
    try:
        pipe = pipe.to(DEVICE, torch.bfloat16)
        print("   ✓ Model loaded on GPU (fast)")
    except RuntimeError as e:
        print(f"   ⚠ GPU load failed: {e}")
        print("   → Using CPU offload (slower but works on 128GB RAM)")
        pipe.enable_model_cpu_offload()

    load_time = time.time() - start
    print(f"   Model ready in {load_time:.1f}s\n")

    # ── Generate ─────────────────────────────────────────────────
    success = 0
    failed = 0
    skipped = 0
    start_batch = time.time()

    for i, slide in enumerate(slides):
        output_path = PROJECT_ROOT / slide["path"]

        # Skip if already exists and looks valid
        ok, msg = quality_check(output_path)
        if ok:
            print(f"  [{i+1}/{total}] ⏭ SKIP (exists): {slide['id']} — {msg}")
            skipped += 1
            continue

        if generate_with_supervision(pipe, slide, style, i, total):
            ok, msg = quality_check(output_path)
            if ok:
                success += 1
            else:
                print(f"    ⚠ Quality check failed: {msg}")
                failed += 1
        else:
            failed += 1

        # Small pause between generations to prevent thermal throttling
        time.sleep(2)

    # ── Summary ──────────────────────────────────────────────────
    elapsed = time.time() - start_batch
    print("\n═══════════════════════════════════════════════════════════════")
    print("  BATCH COMPLETE")
    print(f"  Generated: {success} | Skipped: {skipped} | Failed: {failed}")
    print(f"  Total time: {elapsed/60:.1f} minutes")
    print(f"  Avg per image: {elapsed/max(success,1):.1f}s")
    print("═══════════════════════════════════════════════════════════════")

    if failed > 0:
        print(f"\n⚠ {failed} images failed. Re-run to retry.")
        sys.exit(1)


if __name__ == "__main__":
    main()
