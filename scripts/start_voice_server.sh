#!/bin/bash
# start_voice_server.sh
# One-click startup script for the Voix Vive GPU Voice Server (F5-TTS)

echo "========================================================="
echo " Voix Vive — Local GPU Voice Server"
echo "========================================================="
echo ""
echo "Initializing Python environment..."

# Get the directory where the script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/scratch/cosyvoice_test"

# Activate the virtual environment
if [ -d "rocm_venv" ]; then
    source rocm_venv/bin/activate
else
    echo "Error: Virtual environment 'rocm_venv' not found."
    echo "Please ensure the server is fully installed."
    exit 1
fi

echo "Starting F5-TTS FastAPI Server on http://localhost:8000..."
python3 f5_server.py
