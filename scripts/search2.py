import json
import re

files = [
    "docs/references/transcript_may21.json",
    "docs/references/transcript_may27.json"
]

keywords = [
    "pothole", "G to B", "break", "tuning", "fifth fret", "flavor", "spice", 
    "major 7", "red", "square", "root", "triangle", "instrument playing", "supporting beams"
]

for f in files:
    with open(f, 'r') as fp:
        segs = json.load(fp)
    print(f"\n--- {f} ---")
    for kw in keywords:
        found = False
        for i, s in enumerate(segs):
            if re.search(kw, s['text'], re.IGNORECASE):
                if not found:
                    print(f"\nKeyword: {kw}")
                    found = True
                
                # Print context (3 segments before and 3 after)
                start_idx = max(0, i - 3)
                end_idx = min(len(segs), i + 4)
                
                print(f"\nMatch around [{s['start']:.2f}]:")
                for j in range(start_idx, end_idx):
                    print(f"  [{segs[j]['start']:.2f} - {segs[j]['end']:.2f}] {segs[j]['text']}")
