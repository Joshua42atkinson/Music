#!/usr/bin/env python3
# ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
# ║ FILE    : tts-server.py                                       ║
# ║ WHAT    : Local Qwen3-TTS 0.6B voice cloning server          ║
# ║ WHY     : Revenue feature — Bertrand's voice in the browser  ║
# ║ RUN     : python server/tts-server.py --model Qwen3-TTS-0.6B ║
# ║ API     : OpenAI-compatible /v1/audio/speech                 ║
# ║ PORT    : 9999 (default)                                      ║
# ╚═══════════════════════════════════════════════════════════════╝

import argparse
import base64
import io
import os
import sys
import tempfile
import time
import wave
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import uvicorn

# ── Optional: Qwen3-TTS imports ────────────────────────────────
# pip install -U qwen-tts
# If not installed, server starts in "mock mode" for testing
try:
    from qwen_tts import QwenTTS
    QWEN_AVAILABLE = True
except ImportError:
    QWEN_AVAILABLE = False
    print("[WARN] qwen-tts not installed. Running in MOCK mode.")
    print("       Install: pip install -U qwen-tts")

# ── Configuration ────────────────────────────────────────────────
DEFAULT_PORT = 9999
DEFAULT_MODEL = "Qwen/Qwen3-TTS-12Hz-0.6B-Base"
REFERENCE_DIR = os.path.join(os.path.dirname(__file__), "references")
os.makedirs(REFERENCE_DIR, exist_ok=True)

# ── FastAPI App ────────────────────────────────────────────────
app = FastAPI(title="Voix Vive TTS Server", version="1.0.0")

# Global model instance (loaded once at startup)
tts_model = None


class TTSRequest(BaseModel):
    model: str = "qwen3-tts-0.6b"
    input: str
    voice: Optional[str] = None  # "bertrand" or "default"
    speed: float = 1.0
    response_format: str = "mp3"  # mp3, wav, pcm
    # Qwen3-TTS specific
    emotion: Optional[str] = None  # "calm", "excited", "whisper"
    reference_audio: Optional[str] = None  # base64-encoded WAV


class TTSHealth(BaseModel):
    status: str
    model_loaded: bool
    qwen_available: bool
    version: str


# ── Model Loading ──────────────────────────────────────────────
def load_model(model_name: str = DEFAULT_MODEL):
    global tts_model
    if not QWEN_AVAILABLE:
        print("[MOCK] No Qwen3-TTS installed. Audio will be silent placeholders.")
        return False

    try:
        print(f"[TTS] Loading {model_name}...")
        tts_model = QwenTTS.from_pretrained(model_name)
        print("[TTS] Model loaded successfully.")
        return True
    except Exception as e:
        print(f"[TTS] Failed to load model: {e}")
        return False


# ── Audio Helpers ──────────────────────────────────────────────
def pcm_to_wav(pcm_bytes: bytes, sample_rate: int = 24000) -> bytes:
    """Convert raw PCM float32 to WAV bytes."""
    import numpy as np
    samples = np.frombuffer(pcm_bytes, dtype=np.float32)
    # Normalize to 16-bit PCM
    samples_int16 = (samples * 32767).astype(np.int16)

    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(samples_int16.tobytes())
    return buf.getvalue()


def mock_generate(text: str) -> bytes:
    """Generate a mock WAV for testing when Qwen3 is not installed."""
    import numpy as np
    duration = min(3.0, max(0.5, len(text) * 0.08))  # ~80ms per char
    sample_rate = 24000
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    # A pleasant chord-like tone (C major)
    freq = 261.63  # Middle C
    tone = np.sin(2 * np.pi * freq * t) * 0.3
    tone += np.sin(2 * np.pi * 329.63 * t) * 0.2  # E
    tone += np.sin(2 * np.pi * 392.00 * t) * 0.2  # G
    # Fade in/out
    fade_len = int(0.1 * sample_rate)
    tone[:fade_len] *= np.linspace(0, 1, fade_len)
    tone[-fade_len:] *= np.linspace(1, 0, fade_len)
    samples_int16 = (tone * 32767).astype(np.int16)

    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(samples_int16.tobytes())
    return buf.getvalue()


# ── API Endpoints ──────────────────────────────────────────────
@app.get("/health", response_model=TTSHealth)
def health():
    return TTSHealth(
        status="ok",
        model_loaded=tts_model is not None,
        qwen_available=QWEN_AVAILABLE,
        version="1.0.0",
    )


@app.post("/v1/audio/speech")
def create_speech(req: TTSRequest):
    """OpenAI-compatible audio generation endpoint."""
    if not req.input or not req.input.strip():
        raise HTTPException(status_code=400, detail="input text is required")

    start_time = time.time()

    # Handle voice cloning reference
    reference_path = None
    if req.voice == "bertrand":
        ref_file = os.path.join(REFERENCE_DIR, "bertrand.wav")
        if os.path.exists(ref_file):
            reference_path = ref_file
    elif req.reference_audio:
        # Decode base64 reference audio to temp file
        try:
            audio_data = base64.b64decode(req.reference_audio)
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
                f.write(audio_data)
                reference_path = f.name
        except Exception:
            pass

    try:
        if tts_model and QWEN_AVAILABLE:
            # Real Qwen3-TTS generation
            # TODO: adapt to actual qwen-tts API when installed
            result = tts_model.generate(
                text=req.input,
                ref_audio=reference_path,
                speed=req.speed,
            )
            audio_bytes = pcm_to_wav(result["audio"], result.get("sample_rate", 24000))
        else:
            # Mock mode for testing
            audio_bytes = mock_generate(req.input)

        gen_time = time.time() - start_time
        print(f"[TTS] Generated {len(req.input)} chars in {gen_time:.2f}s")

        media_type = "audio/mpeg" if req.response_format == "mp3" else "audio/wav"
        return StreamingResponse(
            io.BytesIO(audio_bytes),
            media_type=media_type,
            headers={
                "X-Generation-Time": f"{gen_time:.3f}",
                "X-Model": "qwen3-tts-0.6b" if tts_model else "mock",
            },
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {e}")
    finally:
        # Clean up temp reference files
        if reference_path and reference_path.startswith(tempfile.gettempdir()):
            try:
                os.unlink(reference_path)
            except OSError:
                pass


@app.post("/v1/references/upload")
def upload_reference(
    name: str = Query(..., description="Voice name, e.g. 'bertrand'"),
    audio_b64: str = Query(..., description="Base64-encoded WAV audio"),
):
    """Upload a voice reference sample for cloning."""
    try:
        audio_data = base64.b64decode(audio_b64)
        out_path = os.path.join(REFERENCE_DIR, f"{name}.wav")
        with open(out_path, "wb") as f:
            f.write(audio_data)
        return {"status": "ok", "voice": name, "path": out_path}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Upload failed: {e}")


@app.get("/v1/references/list")
def list_references():
    """List available voice references."""
    refs = []
    for f in os.listdir(REFERENCE_DIR):
        if f.endswith(".wav"):
            refs.append(f.replace(".wav", ""))
    return {"references": refs}


# ── Main ───────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Voix Vive TTS Server")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="Model name or path")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help="Server port")
    parser.add_argument("--host", default="127.0.0.1", help="Bind host")
    parser.add_argument("--mock", action="store_true", help="Force mock mode")
    args = parser.parse_args()

    if not args.mock:
        load_model(args.model)
    else:
        print("[TTS] Mock mode enabled. No model loaded.")

    print(f"[TTS] Starting server on http://{args.host}:{args.port}")
    uvicorn.run(app, host=args.host, port=args.port, log_level="info")
