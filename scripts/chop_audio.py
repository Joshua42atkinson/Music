import subprocess
import os

# Dictionary mapping output filename to (source_file, start_time, end_time)
cuts = {
    "bertrand_body_first_instrument.mp3": ("docs/references/May 21 at 1-43 PM.m4a", 547.52, 562.20),
    "bertrand_the_pothole.mp3": ("docs/references/May 27 at 6-20 PM.m4a", 1098.00, 1108.50),
    "bertrand_root_note.mp3": ("docs/references/May 27 at 6-20 PM.m4a", 2046.18, 2051.50),
    "bertrand_tuning_anchor.mp3": ("docs/references/May 27 at 6-20 PM.m4a", 2955.10, 2958.50),
    "bertrand_music_by_numbers.mp3": ("docs/references/May 27 at 6-20 PM.m4a", 3070.10, 3087.10),
    "bertrand_sprinkle_the_flavor.mp3": ("docs/references/May 27 at 6-20 PM.m4a", 3421.26, 3428.50),
    "bertrand_supporting_beams.mp3": ("docs/references/May 27 at 6-20 PM.m4a", 2401.46, 2409.50),
    "bertrand_major_third.mp3": ("docs/references/May 27 at 6-20 PM.m4a", 1668.26, 1678.50),
    "bertrand_diatonic_map.mp3": ("docs/references/May 27 at 6-20 PM.m4a", 3315.06, 3323.00),
}

out_dir = "apps/companion-app/public/assets/audio"

for out_file, (src, start, end) in cuts.items():
    out_path = os.path.join(out_dir, out_file)
    print(f"Creating {out_path} from {src} ({start}s to {end}s)")
    
    cmd = [
        "ffmpeg", "-y",
        "-i", src,
        "-ss", str(start),
        "-to", str(end),
        "-b:a", "192k",
        out_path
    ]
    
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

print("Audio chopping complete!")
