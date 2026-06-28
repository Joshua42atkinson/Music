import json
import re

files = [
    "docs/references/transcript_may21.json",
    "docs/references/transcript_may27.json"
]

cuss_words = ["fuck", "shit", "bitch", "damn", "asshole", "crap"]

def has_cussing(text):
    return any(re.search(r'\b' + cw + r'\b', text, re.IGNORECASE) for cw in cuss_words)

for f in files:
    with open(f, 'r') as fp:
        segs = json.load(fp)
    
    print(f"\n--- Analysis of {f} ---")
    total_duration = segs[-1]['end'] if segs else 0
    print(f"Total Duration: {total_duration / 60:.2f} minutes")
    
    cuss_count = 0
    clean_blocks = []
    
    current_block_start = 0
    current_block_text = ""
    
    for s in segs:
        text = s['text']
        if has_cussing(text):
            cuss_count += 1
            if s['start'] - current_block_start > 60: # at least 1 minute of clean audio
                clean_blocks.append((current_block_start, s['start'], current_block_text))
            
            # Reset block after cuss
            current_block_start = s['end']
            current_block_text = ""
        else:
            current_block_text += " " + text
    
    # Add final block
    if total_duration - current_block_start > 60:
        clean_blocks.append((current_block_start, total_duration, current_block_text))
        
    print(f"Total Cuss Words Found: {cuss_count}")
    print(f"Clean continuous blocks (>1 min): {len(clean_blocks)}")
    for block in clean_blocks:
        duration = (block[1] - block[0]) / 60
        print(f"  [{block[0]:.2f} - {block[1]:.2f}] - {duration:.2f} minutes clean")
