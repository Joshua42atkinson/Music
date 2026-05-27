#!/bin/bash
# ═══════════════════════════════════════════════════════════
# StepAudio 2.5 Middleware — Build & Run Script
# ═══════════════════════════════════════════════════════════

set -e

cd "$(dirname "$0")"

echo "═══ Voix Vive StepAudio Middleware ═══"
echo ""

# Check env
if [ -f .env ]; then
    echo "📋 Loading .env..."
    export $(grep -v '^#' .env | xargs)
else
    echo "⚠️  No .env file found. Copy .env.example and fill in your keys."
    echo "   cp .env.example .env"
    echo ""
fi

# Validate required vars
if [ -z "$STEP_API_KEY" ]; then
    echo "❌ STEP_API_KEY not set. Add to .env or export directly."
    exit 1
fi

echo "🔨 Building with Maven..."
mvn clean package -q

echo ""
echo "🚀 Starting middleware on port ${PORT:-8081}..."
echo "   WebSocket: ws://localhost:${PORT:-8081}/ws/troubadour"
echo ""

# Run the shaded jar
java -jar target/stepaudio-middleware-1.0.0.jar
