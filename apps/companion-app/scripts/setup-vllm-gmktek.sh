#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# setup-vllm-gmktek.sh — Deploy Troubadour AI on GMKtek EVO X2
# Run this ON THE GMKTEK (SSH or direct) — not from your laptop
# ═══════════════════════════════════════════════════════════════════

set -e

echo "═══════════════════════════════════════════════════════════════"
echo "  Voix Vive — Troubadour AI Server Setup"
echo "  Target: GMKtek EVO X2 (AMD Strix Halo / 128GB RAM)"
echo "═══════════════════════════════════════════════════════════════"
echo

# ── Configuration ──────────────────────────────────────────────
MODEL_PATH="${MODEL_PATH:-/home/joshua/trinity-models/vllm/Step-Audio-R1.1}"
CONTAINER_NAME="${CONTAINER_NAME:-troubadour-vllm}"
HOST_PORT="${HOST_PORT:-8000}"
GPU_MEM_UTIL="${GPU_MEM_UTIL:-0.80}"
MAX_MODEL_LEN="${MAX_MODEL_LEN:-4096}"
MAX_NUM_SEQS="${MAX_NUM_SEQS:-64}"
MAX_NUM_BATCHED_TOKENS="${MAX_NUM_BATCHED_TOKENS:-8192}"
API_KEY="${VLLM_API_KEY:-}"  # Set this env var for production

echo "Model path:     $MODEL_PATH"
echo "Port:           $HOST_PORT"
echo "GPU util:       $GPU_MEM_UTIL"
echo "Max length:     $MAX_MODEL_LEN"
echo "Max seqs:       $MAX_NUM_SEQS"
echo "Batched tokens: $MAX_NUM_BATCHED_TOKENS"
echo "API key:        ${API_KEY:+set (hidden)}"
echo

# ── Prerequisites ──────────────────────────────────────────────
echo "[1/6] Checking prerequisites..."

if ! command -v podman &> /dev/null; then
    echo "ERROR: podman not found. Install first:"
    echo "  sudo apt-get install -y podman"
    exit 1
fi

if [ ! -d "$MODEL_PATH" ]; then
    echo "ERROR: Model directory not found: $MODEL_PATH"
    echo "Download Step-Audio-R1.1 first or set MODEL_PATH env var."
    exit 1
fi

echo "✓ podman found"
echo "✓ model found at $MODEL_PATH"

# ── Build / pull container ─────────────────────────────────────
echo
if ! podman image exists localhost/vllm-stepaudio-rocm:prod; then
    echo "[2/6] Container image not found. Building..."
    echo "(This may take 30+ minutes on first run)"
    echo "If you already built this for StepAudio testing, skip with:"
    echo "  export SKIP_BUILD=1"
    if [ -z "$SKIP_BUILD" ]; then
        # Build from the StepAudio Dockerfile we already have
        # Adjust path as needed
        if [ -f "/home/joshua/Workflow/Desktop/StepAudio/vllm-rocm/Dockerfile" ]; then
            podman build -t localhost/vllm-stepaudio-rocm:prod \
                -f /home/joshua/Workflow/Desktop/StepAudio/vllm-rocm/Dockerfile \
                /home/joshua/Workflow/Desktop/StepAudio/vllm-rocm
        else
            echo "WARNING: Dockerfile not found at expected path."
            echo "Attempting to pull from your local cache..."
        fi
    fi
else
    echo "[2/6] Container image already built ✓"
fi

# ── Cloudflare Tunnel (optional) ──────────────────────────────
echo
echo "[3/6] Checking Cloudflare Tunnel..."

if command -v cloudflared &> /dev/null; then
    echo "✓ cloudflared found"
    echo "  To expose this server to the internet:"
    echo "    cloudflared tunnel --url http://localhost:$HOST_PORT"
    echo "  Or create a permanent tunnel:"
    echo "    cloudflared tunnel create troubadour-ai"
else
    echo "⚠ cloudflared not found (optional)"
    echo "  Install for public access: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/"
fi

# ── ngrok fallback (optional) ─────────────────────────────────
if command -v ngrok &> /dev/null; then
    echo "✓ ngrok found (alternative to cloudflared)"
else
    echo "⚠ ngrok not found (optional alternative)"
fi

# ── Stop existing container ────────────────────────────────────
echo
echo "[4/6] Stopping existing container (if any)..."
podman stop "$CONTAINER_NAME" 2>/dev/null || true
podman rm "$CONTAINER_NAME" 2>/dev/null || true

# ── Start vLLM server ──────────────────────────────────────────
echo
echo "[5/6] Starting vLLM server..."
echo "  This will take 2-5 minutes to load the model into VRAM."
echo

podman run -d \
    --name "$CONTAINER_NAME" \
    --device /dev/dri \
    --device /dev/kfd \
    --group-add video \
    --group-add render \
    --privileged \
    -e HSA_OVERRIDE_GFX_VERSION=11.5.1 \
    -e VLLM_TARGET_DEVICE=rocm \
    -e VLLM_API_KEY="${API_KEY}" \
    -v "$MODEL_PATH:/model:ro" \
    -p "$HOST_PORT:8000" \
    localhost/vllm-stepaudio-rocm:prod \
    /model \
    --port 8000 \
    --max-model-len "$MAX_MODEL_LEN" \
    --gpu-memory-utilization "$GPU_MEM_UTIL" \
    --max-num-seqs "$MAX_NUM_SEQS" \
    --max-num-batched-tokens "$MAX_NUM_BATCHED_TOKENS" \
    --dtype bfloat16 \
    --trust-remote-code \
    --enable-prefix-caching \
    --enforce-eager

# ── Health check ───────────────────────────────────────────────
echo
echo "[6/6] Waiting for server to be ready..."

# Build curl command (with auth if API key is set)
CURL_OPTS="-s"
if [ -n "$API_KEY" ]; then
    CURL_OPTS="-s -H \"Authorization: Bearer $API_KEY\""
fi

for i in {1..60}; do
    if eval "curl $CURL_OPTS \"http://localhost:$HOST_PORT/v1/models\"" > /dev/null 2>&1; then
        echo
        echo "═══════════════════════════════════════════════════════════════"
        echo "  ✓ TROUBADOUR AI SERVER IS LIVE"
        echo "═══════════════════════════════════════════════════════════════"
        echo
        echo "  Local endpoint:  http://localhost:$HOST_PORT/v1"
        if [ -n "$API_KEY" ]; then
            echo "  Auth:            Bearer token required (API key set)"
            echo "  Health check:    curl -H \"Authorization: Bearer \$VLLM_API_KEY\" http://localhost:$HOST_PORT/v1/models"
        else
            echo "  ⚠ WARNING: No API key set. All endpoints are open."
            echo "  Health check:    curl http://localhost:$HOST_PORT/v1/models"
        fi
        echo
        echo "  ── SECURITY ──"
        echo "  vLLM has UNPROTECTED endpoints even with --api-key:"
        echo "    /invocations, /pause, /update_weights"
        echo "  REQUIRED: Put behind reverse proxy (nginx/Cloudflare)"
        echo "  that blocks everything except /v1/* before exposing publicly."
        echo
        echo "  To expose publicly (after reverse proxy is ready):"
        echo "    cloudflared tunnel --url http://localhost:$HOST_PORT"
        echo
        echo "  Add to Vercel env:"
        echo "    VITE_TROUBADOUR_API_URL=https://your-tunnel-url/v1"
        if [ -n "$API_KEY" ]; then
            echo "    VITE_TROUBADOUR_API_KEY=$API_KEY"
        fi
        echo
        echo "  View logs:         podman logs -f $CONTAINER_NAME"
        echo "  Stop:              podman stop $CONTAINER_NAME"
        echo
        exit 0
    fi
    echo -n "."
    sleep 2
done

echo
echo "ERROR: Server failed to start within 2 minutes."
echo "Check logs: podman logs $CONTAINER_NAME"
exit 1
