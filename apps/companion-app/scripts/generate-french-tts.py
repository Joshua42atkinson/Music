import re
import os
from gtts import gTTS

CURRICULUM_PATH = os.path.join(os.path.dirname(__file__), '../src/data/cScaleCurriculum.js')
PUBLIC_DIR = os.path.join(os.path.dirname(__file__), '../public')

with open(CURRICULUM_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all contentFr and audioSnippetFr pairs
# pattern: contentFr:\s*'([^']*)'[\s\S]*?audioSnippetFr:\s*'([^']*)'
pattern = re.compile(r"contentFr:\s*'([^']*)'[\s\S]*?audioSnippetFr:\s*'([^']*)'")
matches = pattern.findall(content)

for text, audio_path in matches:
    # Ensure audio path is a relative path to public
    if audio_path.startswith('/'):
        audio_path = audio_path[1:]
    
    out_file = os.path.join(PUBLIC_DIR, audio_path)
    os.makedirs(os.path.dirname(out_file), exist_ok=True)
    
    # Fix escaped quotes in text
    clean_text = text.replace("\\'", "'")
    
    print(f"Generating {out_file}...")
    try:
        tts = gTTS(text=clean_text, lang='fr', slow=False)
        tts.save(out_file)
        print(f"Success: {out_file}")
    except Exception as e:
        print(f"Error generating {out_file}: {e}")

