import { KokoroTTS } from "kokoro-js";
import fs from "fs";

async function main() {
  const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-ONNX", {
      dtype: "q8",
  });
  const audio = await tts.generate("Hello world, testing the voice.", {
      voice: "af_bella",
  });
  console.log(audio);
}
main().catch(console.error);
