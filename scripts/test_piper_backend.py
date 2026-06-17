import os
import sys

# Append the piper path to make sure we don't import from the wrong place
import piper_phonemize
print("piper_phonemize module path:", piper_phonemize.__file__)

# Print what it uses as default
print("Default _DIR:", piper_phonemize._DIR)

orig_phonemize = piper_phonemize.phonemize_espeak
def patched_phonemize(text, voice, data_path=None):
    correct_path = os.path.join(os.getcwd(), "scratch/test_dir")
    print(f"Calling phonemize with data_path={correct_path}")
    return orig_phonemize(text, voice, data_path=correct_path)

piper_phonemize.phonemize_espeak = patched_phonemize

try:
    from piper import PiperVoice
    voice = PiperVoice.load("scratch/piper_training/exported_model/bertrand.onnx", "scratch/piper_training/exported_model/bertrand.onnx.json")
    print("Voice loaded!")
    
    # Try generating audio
    import wave
    with wave.open("test_audio.wav", "w") as f:
        voice.synthesize("Hello world", f)
    print("Audio synthesized successfully!")
except Exception as e:
    import traceback
    traceback.print_exc()
