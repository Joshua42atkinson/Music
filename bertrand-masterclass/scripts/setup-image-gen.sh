#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# setup-image-gen.sh — One-time setup for LongCat-Image on AMD ROCm
# ═══════════════════════════════════════════════════════════════════

set -e

echo "═══════════════════════════════════════════════════════════════"
echo "  LongCat-Image Setup for AMD Strix Halo (ROCm)"
echo "═══════════════════════════════════════════════════════════════"
echo

# ── Check ROCm ─────────────────────────────────────────────────
echo "[1/3] Checking ROCm..."
if ! python3 -c "import torch; print(torch.version.hip)" 2>/dev/null | grep -q "6."; then
    echo "WARNING: ROCm not fully detected. Continuing anyway (CPU fallback works)."
else
    echo "✓ ROCm detected"
fi

# ── Install diffusers + transformers ────────────────────────────
echo
echo "[2/3] Installing Python dependencies..."
pip install --upgrade diffusers transformers accelerate

# ── Verify ───────────────────────────────────────────────────────
echo
echo "[3/3] Verifying installation..."
python3 -c "import diffusers; print(f'  diffusers: {diffusers.__version__}')"
python3 -c "import torch; print(f'  torch: {torch.__version__}')"

echo
echo "═══════════════════════════════════════════════════════════════"
echo "  ✓ Setup complete"
echo
echo "  To generate slide artwork overnight:"
echo "    python3 scripts/generate-slide-artwork.py"
echo
echo "  First run downloads ~6GB model from HuggingFace."
echo "  With 128GB RAM, CPU offload works if GPU OOMs."
echo "═══════════════════════════════════════════════════════════════"
