#!/bin/bash
# ════════════════════════════════════════════════════════════
# launch_xr.sh
# Voix Vive XR — Vive Elite Pro Launch Script
#
# Ensures Monado OpenXR runtime is available, then launches
# the native OpenXR binary with the fretboard + pitch detection.
# ════════════════════════════════════════════════════════════

cd "$(dirname "$0")/.."

echo "======================================================="
echo "  Voix Vive XR — Vive Elite Pro Launch"
echo "======================================================="

# Check Monado runtime
if ! ldconfig -p | grep -q libopenxr; then
    echo "⚠️  OpenXR loader not found. Install: sudo apt install libopenxr-loader1 libopenxr1-monado"
    exit 1
fi
echo "✅ OpenXR loader found"

# Check for active Monado service
if systemctl --user is-active monado 2>/dev/null | grep -q active; then
    echo "✅ Monado service running"
else
    echo "⚠️  Monado service not running. Attempting to start..."
    systemctl --user start monado 2>/dev/null || echo "  (Monado may auto-start when OpenXR session begins)"
fi

# Check for connected VR devices
if command -v monado-cli &>/dev/null; then
    echo "Checking for VR devices..."
    monado-cli probe 2>/dev/null || true
fi

echo ""
echo "🥽 Launching Voix Vive XR..."
echo "   - Fretboard: 6 strings × 12 frets (78 potholes)"
echo "   - Pitch detection: YIN algorithm (48kHz, cpal)"
echo "   - Environment: Zen Garden (default)"
echo "   - Menu: Click 'VV' badge → BE/DO/PLAY"
echo ""

# Launch the XR binary
cargo run --bin voix-vive-xr --features xr -- "$@"

echo ""
echo "🛑 Voix Vive XR session ended."
