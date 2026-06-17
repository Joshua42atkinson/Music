#!/bin/bash
BRAIN_DIR="/home/joshua-atkinson/.gemini/antigravity/brain/68a01661-8ac4-4c5b-9e43-385f8d286d63"
ASSETS_DIR="/home/joshua-atkinson/antigravity/daydream-website/bertrand-masterclass/public/assets/slides"

for ch in {8..12}; do
    mkdir -p "$ASSETS_DIR/ch$ch"
    echo "Processing Chapter $ch..."
    
    # We want to map things like ch8_title_12345.png -> ch8/title.png
    for file in "$BRAIN_DIR"/ch${ch}_*.png; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            # Extract the part between chN_ and _TIMESTAMP.png
            # Example: ch8_yang_intro_123.png
            # remove prefix: yang_intro_123.png
            no_prefix=${filename#ch${ch}_}
            # remove suffix: yang_intro
            name=${no_prefix%_*.png}
            
            # handle dashes. My prompts used underscores (yang_intro) but we need dashes (yang-intro, yin-0, exercise-0)
            name=$(echo "$name" | tr '_' '-')
            
            echo "Copying $filename to $ASSETS_DIR/ch$ch/$name.png"
            cp "$file" "$ASSETS_DIR/ch$ch/$name.png"
        fi
    done
done
