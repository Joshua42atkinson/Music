import { KokoroTTS } from "kokoro-js";
import fs from "fs";
import pkg from "wavefile";
const { WaveFile } = pkg;
import { execSync } from "child_process";
import path from "path";

async function main() {
  console.log("Loading KokoroTTS...");
  const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-ONNX", {
      dtype: "q8",
  });
  
  const textToRead = "Bonjour! Ceci est un test de la voix française pour le cours d'échelle do.";
  console.log("Generating audio...");
  
  try {
    const audio = await tts.generate(textToRead, {
        voice: "ff_siwis", 
    });
    
    const wav = new WaveFile();
    wav.fromScratch(1, audio.sampling_rate, '32f', audio.audio);
    
    const outPath = path.join(process.cwd(), `test_french.wav`);
    fs.writeFileSync(outPath, wav.toBuffer());
    console.log("Finished test_french.wav");
  } catch (err) {
    console.error("Error generating ff_siwis:", err.message);
  }
}

main().catch(console.error);
