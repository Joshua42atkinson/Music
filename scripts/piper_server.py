import io
import wave
from fastapi import FastAPI
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from piper import PiperVoice

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model_path = "scratch/piper_training/exported_model/bertrand.onnx"
config_path = "scratch/piper_training/exported_model/bertrand.onnx.json"

import os
import sys
import piper_phonemize

# espeak-ng has a bug where it expects the data path to either contain phontab directly
# or have an espeak-ng-data subfolder. piper_phonemize default path is broken on some systems.
# We create a stable directory structure and monkeypatch phonemize to use it.
hack_dir = os.path.join(os.getcwd(), "scratch/espeak_data_hack")
os.makedirs(hack_dir, exist_ok=True)
hack_symlink = os.path.join(hack_dir, "espeak-ng-data")
if not os.path.exists(hack_symlink):
    real_data = os.path.join(os.getcwd(), "scratch/piper_training/.venv_piper/lib/python3.10/site-packages/piper_phonemize/espeak-ng-data")
    os.symlink(real_data, hack_symlink)

import piper.voice
orig_phonemize_espeak = piper.voice.phonemize_espeak
def patched_phonemize_espeak(text, voice, data_path=None):
    return orig_phonemize_espeak(text, voice, data_path=hack_dir)

piper.voice.phonemize_espeak = patched_phonemize_espeak

try:
    voice = PiperVoice.load(model_path, config_path)
    print(f"Loaded Piper voice from {model_path}")
except Exception as e:
    print(f"Failed to load Piper voice: {e}")
    voice = None

class TTSRequest(BaseModel):
    text: str

@app.post("/tts")
def tts_endpoint(req: TTSRequest):
    if not voice:
        return Response("Voice model not loaded", status_code=500)
    
    out_io = io.BytesIO()
    
    # Synthesize audio to memory
    with wave.open(out_io, "wb") as wav_file:
        voice.synthesize(req.text, wav_file)
        
    out_io.seek(0)
    return Response(content=out_io.read(), media_type="audio/wav")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
