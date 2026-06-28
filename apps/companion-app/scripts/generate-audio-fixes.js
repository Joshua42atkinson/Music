import { KokoroTTS } from "kokoro-js";
import fs from "fs";
import pkg from "wavefile";
const { WaveFile } = pkg;
import { execSync } from "child_process";
import path from "path";

// Import the curriculum data
import { C_SCALE_CHAPTERS } from "../src/data/cScaleCurriculum.js";

async function main() {
  const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-ONNX", {
      dtype: "q8",
  });
  
  for (const chapter of C_SCALE_CHAPTERS) {
    // Generate the audio filename from the chapter title
    let safeName = chapter.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
    let fileName = `bertrand_${safeName}`;
    
    // Override a couple specific filenames to match existing codebase expectations
    if (chapter.id === 'chapter-1') fileName = 'bertrand_supporting_beams';
    if (chapter.id === 'chapter-3') fileName = 'bertrand_the_pothole';
    if (chapter.id === 'chapter-5') fileName = 'bertrand_body_first_instrument';
    
    const textToRead = chapter.bePhase.content;
    
    console.log(`Generating ${fileName}...`);
    const audio = await tts.generate(textToRead, {
        voice: "am_adam", // Using a placeholder male voice
    });
    
    const wav = new WaveFile();
    wav.fromScratch(1, audio.sampling_rate, '32f', audio.audio);
    
    const wavPath = path.join(process.cwd(), `./public/assets/audio/${fileName}.wav`);
    const mp3Path = path.join(process.cwd(), `./public/assets/audio/${fileName}.mp3`);
    
    fs.writeFileSync(wavPath, wav.toBuffer());
    
    // Convert to mp3 using ffmpeg
    execSync(`ffmpeg -y -i ${wavPath} -b:a 128k ${mp3Path}`);
    
    // Clean up wav
    fs.unlinkSync(wavPath);
    console.log(`Finished ${fileName}`);
  }
}

main().catch(console.error);
