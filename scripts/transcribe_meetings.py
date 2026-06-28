import whisper
import json
import sys

def transcribe(file_path, output_json):
    print(f"Loading Whisper model (base.en) for {file_path}...")
    model = whisper.load_model("base.en")
    print("Transcribing...")
    result = model.transcribe(file_path, fp16=False)
    
    with open(output_json, 'w') as f:
        json.dump(result["segments"], f, indent=2)
    print(f"Saved transcript to {output_json}")

if __name__ == "__main__":
    files = [
        ("docs/references/May 21 at 1-43 PM.m4a", "docs/references/transcript_may21.json"),
        ("docs/references/May 27 at 6-20 PM.m4a", "docs/references/transcript_may27.json")
    ]
    for m4a, out in files:
        transcribe(m4a, out)
