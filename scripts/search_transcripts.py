import json
import re

def search_json(filepath, keywords):
    with open(filepath, 'r') as f:
        segments = json.load(f)
    
    print(f"\n--- Searching {filepath} ---")
    for kw in keywords:
        print(f"\nKeyword: {kw}")
        for i, seg in enumerate(segments):
            if re.search(kw, seg['text'], re.IGNORECASE):
                # Print context (previous, current, next segment)
                start_idx = max(0, i - 1)
                end_idx = min(len(segments), i + 2)
                print(f"  Match at {seg['start']}s - {seg['end']}s:")
                for j in range(start_idx, end_idx):
                    print(f"    [{segments[j]['start']:.2f} -> {segments[j]['end']:.2f}] {segments[j]['text']}")
                print("-" * 40)

if __name__ == "__main__":
    files = [
        "docs/references/transcript_may21.json",
        "docs/references/transcript_may27.json"
    ]
    
    keywords = [
        r"\bpothole\b",
        r"\broot\b",
        r"instrument playing",
        r"\bcaged\b",
        r"major third",
        r"perfect fourth",
        r"\bnumbers\b",
        r"diatonic",
        r"sprinkle",
        r"supporting beams",
        r"map",
        r"fifth fret"
    ]
    
    for f in files:
        search_json(f, keywords)
