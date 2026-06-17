#!/usr/bin/env python3
# ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
# ║ FILE    : test-tts.py                                         ║
# ║ WHAT    : TTS evaluation suite for guitar teaching quality   ║
# ║ WHY     : Data-driven selection of the best TTS for revenue  ║
# ║ RUN     : python server/test-tts.py                          ║
# ╚═══════════════════════════════════════════════════════════════╝

import argparse
import base64
import io
import json
import os
import time
import wave
from pathlib import Path

import requests

# ── Test Cases: What a guitar teacher actually says ──────────────
TEST_PHRASES = {
    "french_guitar_terms": {
        "text": "Placez votre index sur la troisième case de la corde de Mi aigu."
        ,
        "why": "Core French guitar instruction vocabulary",
    },
    "italian_musical_terms": {
        "text": "Jouez ce passage legato, avec du vibrato sur la note tenue.",
        "why": "Mixed Italian/French musical terminology",
    },
    "somatic_guidance": {
        "text": "Respirez. Sentez la vibration dans votre poitrine. Laissez le son vous traverser.",
        "why": "Somatic/breath-based instruction — needs calming cadence",
    },
    "technical_instruction": {
        "text": "L'accord de Do majeur: doigt un sur la première case, corde de Si. Doigt deux, quatrième case, corde de Ré. Doigt trois, cinquième case, corde de La.",
        "why": "Multi-step technical instruction with numbers and positions",
    },
    "encouragement": {
        "text": "C'est bien. Encore une fois. Cette fois, écoutez la résonance entre les notes.",
        "why": "Short encouraging phrases — most common utterance type",
    },
    "long_lesson": {
        "text": "Aujourd'hui nous allons explorer le mode dorien. C'est un mode mineur avec une sixte majeure. Placez votre main au cinquième fret. Le mode dorien commence sur la note La. Jouez la gamme en montant: La, Si, Do, Ré, Mi, Fa dièse, Sol, La. Écoutez la couleur. Elle est plus lumineuse que le mode mineur naturel.",
        "why": "Long-form lesson — tests coherence and natural pauses",
    },
    "whisper_emphasis": {
        "text": "Écoutez bien. La tension dans cette note vous guide vers la résolution.",
        "why": "Needs whisper/soft emphasis capability",
    },
}

# ── Server Endpoints ───────────────────────────────────────────
DEFAULT_SERVER = "http://localhost:9999"


def generate_audio(server: str, text: str, voice: str = "default", emotion: str = None) -> dict:
    """Generate audio via the TTS server. Returns {wav_bytes, latency_ms, status}."""
    payload = {
        "model": "qwen3-tts-0.6b",
        "input": text,
        "voice": voice,
        "speed": 1.0,
        "response_format": "wav",
    }
    if emotion:
        payload["emotion"] = emotion

    start = time.time()
    try:
        resp = requests.post(
            f"{server}/v1/audio/speech",
            json=payload,
            timeout=60,
        )
        latency = (time.time() - start) * 1000

        if resp.status_code == 200:
            return {
                "wav_bytes": resp.content,
                "latency_ms": latency,
                "status": "ok",
                "headers": dict(resp.headers),
            }
        else:
            return {
                "wav_bytes": None,
                "latency_ms": latency,
                "status": f"error_{resp.status_code}",
                "error": resp.text,
            }
    except Exception as e:
        return {
            "wav_bytes": None,
            "latency_ms": (time.time() - start) * 1000,
            "status": "exception",
            "error": str(e),
        }


def save_wav(wav_bytes: bytes, path: str):
    """Save WAV bytes to file."""
    with open(path, "wb") as f:
        f.write(wav_bytes)


def get_audio_duration(wav_bytes: bytes) -> float:
    """Extract duration from WAV bytes."""
    try:
        with wave.open(io.BytesIO(wav_bytes), "rb") as wf:
            frames = wf.getnframes()
            rate = wf.getframerate()
            return frames / rate
    except Exception:
        return 0.0


def run_tests(server: str, output_dir: str, voice: str = "default"):
    """Run all test phrases and generate report."""
    os.makedirs(output_dir, exist_ok=True)
    results = []

    print(f"\n{'='*60}")
    print(f"  VOIX VIVE TTS EVALUATION")
    print(f"  Server: {server}")
    print(f"  Voice:  {voice}")
    print(f"{'='*60}\n")

    for test_id, test in TEST_PHRASES.items():
        text = test["text"]
        why = test["why"]

        print(f"Test: {test_id}")
        print(f"  Text: {text[:60]}...")
        print(f"  Why:  {why}")

        result = generate_audio(server, text, voice=voice)

        if result["status"] == "ok":
            duration = get_audio_duration(result["wav_bytes"])
            rtf = duration / (len(text) * 0.08) if text else 0  # rough chars/sec

            out_path = os.path.join(output_dir, f"{test_id}_{voice}.wav")
            save_wav(result["wav_bytes"], out_path)

            print(f"  Latency: {result['latency_ms']:.0f}ms")
            print(f"  Audio:   {duration:.2f}s")
            print(f"  Saved:   {out_path}")

            results.append({
                "test_id": test_id,
                "text_length": len(text),
                "latency_ms": result["latency_ms"],
                "audio_duration_s": duration,
                "status": "ok",
                "output_path": out_path,
            })
        else:
            print(f"  FAILED: {result['status']} — {result.get('error', 'unknown')}")
            results.append({
                "test_id": test_id,
                "text_length": len(text),
                "latency_ms": result["latency_ms"],
                "status": result["status"],
                "error": result.get("error"),
            })

        print()

    # Summary
    total = len(results)
    passed = sum(1 for r in results if r["status"] == "ok")
    avg_latency = sum(r["latency_ms"] for r in results if r["status"] == "ok") / max(passed, 1)

    print(f"{'='*60}")
    print(f"  SUMMARY")
    print(f"{'='*60}")
    print(f"  Tests run:    {total}")
    print(f"  Passed:       {passed}/{total}")
    print(f"  Avg latency:  {avg_latency:.0f}ms")
    print(f"  Output dir:   {output_dir}")
    print(f"{'='*60}\n")

    # Save JSON report
    report_path = os.path.join(output_dir, "report.json")
    with open(report_path, "w") as f:
        json.dump({
            "server": server,
            "voice": voice,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
            "summary": {
                "total": total,
                "passed": passed,
                "avg_latency_ms": avg_latency,
            },
            "results": results,
        }, f, indent=2)
    print(f"Report saved: {report_path}")

    return results


def run_voice_clone_test(server: str, output_dir: str, reference_path: str):
    """Test voice cloning with a reference audio sample."""
    if not os.path.exists(reference_path):
        print(f"[WARN] Reference audio not found: {reference_path}")
        print("       Skipping voice clone test.")
        return

    print(f"\n{'='*60}")
    print(f"  VOICE CLONE TEST")
    print(f"  Reference: {reference_path}")
    print(f"{'='*60}\n")

    # Upload reference
    with open(reference_path, "rb") as f:
        audio_b64 = base64.b64encode(f.read()).decode()

    resp = requests.post(
        f"{server}/v1/references/upload?name=bertrand&audio_b64={audio_b64}",
        timeout=10,
    )
    if resp.ok:
        print("Reference uploaded successfully.")
    else:
        print(f"Upload failed: {resp.status_code}")
        return

    # Generate with cloned voice
    test_text = "Bonjour. Je suis votre guide pour la guitare."
    result = generate_audio(server, test_text, voice="bertrand")

    if result["status"] == "ok":
        out_path = os.path.join(output_dir, "voice_clone_bertrand.wav")
        save_wav(result["wav_bytes"], out_path)
        print(f"Cloned voice saved: {out_path}")
    else:
        print(f"Voice clone failed: {result['status']}")


# ── Main ───────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Voix Vive TTS Evaluation")
    parser.add_argument("--server", default=DEFAULT_SERVER, help="TTS server URL")
    parser.add_argument("--output", default="server/test-output", help="Output directory")
    parser.add_argument("--voice", default="default", help="Voice preset")
    parser.add_argument("--clone-ref", help="Path to reference WAV for voice cloning test")
    args = parser.parse_args()

    # Run standard tests
    run_tests(args.server, args.output, args.voice)

    # Run voice clone test if reference provided
    if args.clone_ref:
        run_voice_clone_test(args.server, args.output, args.clone_ref)
