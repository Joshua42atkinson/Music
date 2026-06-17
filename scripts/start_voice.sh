#!/bin/bash
# Starts the permanent Bertrand Voice Server (Piper TTS)
cd "$(dirname "$0")"

if [ ! -d "scratch/piper_training/.venv_piper" ]; then
    echo "Error: Piper environment not found."
    exit 1
fi

echo "Starting Bertrand's Living Voice..."
source scratch/piper_training/.venv_piper/bin/activate
export ESPEAK_DATA_PATH="$(pwd)/scratch/piper_training/.venv_piper/lib/python3.10/site-packages/piper_phonemize/espeak-ng-data"
export PIPER_ESPEAKNG_DATA_DIRECTORY="$(pwd)/scratch/piper_training/.venv_piper/lib/python3.10/site-packages/piper_phonemize/espeak-ng-data"
python piper_server.py
