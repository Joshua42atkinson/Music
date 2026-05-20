#!/bin/bash
# ═══════════════════════════════════════════════════════════
# train_in_container.sh — Run fine-tuning inside the ROCm 7.13 container
# This bypasses the gfx1151 kernel issue in PyTorch ROCm 6.3
# ═══════════════════════════════════════════════════════════

set -e

TRAINING_DIR="/home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/training"
CONTAINER_IMAGE="docker.io/kyuz0/vllm-therock-gfx1151:latest"

echo "🎸 Troubadour's Quill — Container Fine-Tuning"
echo "  Container: $CONTAINER_IMAGE"
echo "  Training data: $TRAINING_DIR/voix_vive_training.jsonl"
echo ""

podman run --rm \
  --device /dev/kfd \
  --device /dev/dri/card1 \
  --device /dev/dri/renderD128 \
  --security-opt seccomp=unconfined \
  --group-add keep-groups \
  --ipc=host \
  -e HSA_ENABLE_SDMA=0 \
  -v "$TRAINING_DIR":/workspace \
  "$CONTAINER_IMAGE" \
  bash -c '
set -e
cd /workspace

echo "📦 Installing training dependencies..."
pip install -q --upgrade transformers trl datasets 2>&1 | tail -2
pip install -q --upgrade git+https://github.com/huggingface/peft.git 2>&1 | tail -2

echo ""
echo "🎸 Starting fine-tuning..."
python3 finetune.py "$@"
' -- "$@"
