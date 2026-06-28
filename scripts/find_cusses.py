import json
import re

files = [
    "docs/references/transcript_may21.json",
    "docs/references/transcript_may27.json"
]

cuss_words = ["fuck", "shit", "bitch", "damn", "asshole", "crap"]

def find_cussing(text):
    for cw in cuss_words:
        if re.search(r'\b' + cw + r'\b', text, re.IGNORECASE):
            return cw
    return None

for f in files:
    with open(f, 'r') as fp:
        segs = json.load(fp)
    
    print(f"\n--- Cuss Words in {f} ---")
    
    for s in segs:
        text = s['text']
        cw = find_cussing(text)
        if cw:
            print(f"[{s['start']:.2f} - {s['end']:.2f}] (Found '{cw}'): {text}")
