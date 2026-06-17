#!/bin/bash
# ══════════════════════════════════════════════════════════════
# Voix Vive — 2TB Drive Scaffold Script
# ══════════════════════════════════════════════════════════════

DRIVE_ROOT=${1:-"/Volumes/2TB_Drive"}

echo "🚀 Scaffolding 2TB Drive Architecture at: $DRIVE_ROOT"

# 1. Workspaces (Code)
mkdir -p "$DRIVE_ROOT/workspaces/react"
mkdir -p "$DRIVE_ROOT/workspaces/nextjs"
mkdir -p "$DRIVE_ROOT/workspaces/bevy_games"

# 2. Master Assets (Raw, non-git files)
mkdir -p "$DRIVE_ROOT/assets_master/images/comfyui_renders"
mkdir -p "$DRIVE_ROOT/assets_master/audio/raw_stems"
mkdir -p "$DRIVE_ROOT/assets_master/video/masterclass_raw"

# 3. AI Engine (Models, Vector DBs, Agent Memory)
mkdir -p "$DRIVE_ROOT/ai_engine/models/lm_studio"
mkdir -p "$DRIVE_ROOT/ai_engine/models/liquid_ai"
mkdir -p "$DRIVE_ROOT/ai_engine/models/kokoro_voices"
mkdir -p "$DRIVE_ROOT/ai_engine/vector_dbs/nomic"
mkdir -p "$DRIVE_ROOT/ai_engine/vector_dbs/chroma"
mkdir -p "$DRIVE_ROOT/ai_engine/agent_memory"

# 4. Overnight Audits (Nemotron Outputs)
mkdir -p "$DRIVE_ROOT/overnight_audits/archived"
mkdir -p "$DRIVE_ROOT/overnight_audits/latest"

echo "✅ 2TB Drive Scaffold Complete!"
echo "Run 'tree $DRIVE_ROOT' to see your new structure."
