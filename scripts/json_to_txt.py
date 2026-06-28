import json

for filename in ["docs/references/transcript_may21.json", "docs/references/transcript_may27.json"]:
    with open(filename, 'r') as f:
        data = json.load(f)
    
    out_name = filename.replace('.json', '.txt')
    with open(out_name, 'w') as f_out:
        for seg in data:
            f_out.write(f"[{seg['start']:.2f} - {seg['end']:.2f}] {seg['text']}\n")
