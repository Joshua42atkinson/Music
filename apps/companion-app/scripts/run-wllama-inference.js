import { Wllama } from '@wllama/wllama/esm/index.js';
import fs from 'fs';
import path from 'path';

// ── Define WASM paths for wllama ──
// Use the CDN or local Vite server paths
const WASM_PATHS = {
  'single-thread/wllama.wasm': 'https://cdn.jsdelivr.net/npm/@wllama/wllama@3.4.1/wasm/wllama.wasm',
  'single-thread/wllama.js': 'https://cdn.jsdelivr.net/npm/@wllama/wllama@3.4.1/wasm/wllama.js',
  'multi-thread/wllama.wasm': 'https://cdn.jsdelivr.net/npm/@wllama/wllama@3.4.1/wasm/wllama.wasm',
  'multi-thread/wllama.js': 'https://cdn.jsdelivr.net/npm/@wllama/wllama@3.4.1/wasm/wllama.js',
};

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║ VOIX VIVE — Local Liquid Model (LFM2.5-1.2B) Node Inference   ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');

  const modelPath = path.resolve('public/models/LFM2.5-1.2B-Instruct-Q4_K_M.gguf');
  if (!fs.existsSync(modelPath)) {
    console.error(`❌ Model file not found at: ${modelPath}`);
    process.exit(1);
  }

  const modelSizeMb = (fs.statSync(modelPath).size / (1024 * 1024)).toFixed(2);
  console.log(`✓ Located LFM2.5 GGUF model: ${modelPath} (${modelSizeMb} MB)`);

  try {
    console.log('\n[1/3] Initializing Wllama WebAssembly Runtime...');
    const wllama = new Wllama(WASM_PATHS);

    console.log('\n[2/3] Loading LFM2.5 GGUF into memory...');
    // We can load from a local HTTP url served by Vite!
    const localUrl = 'http://localhost:5173/models/LFM2.5-1.2B-Instruct-Q4_K_M.gguf';
    console.log(`Fetching model from local dev server: ${localUrl}`);

    await wllama.loadModelFromUrl(localUrl, {
      useCache: false,
      progressCallback: ({ loaded, total }) => {
        const pct = Math.round((loaded / total) * 100);
        process.stdout.write(`\rLoading GGUF: ${pct}% (${(loaded / (1024*1024)).toFixed(1)}MB / ${(total / (1024*1024)).toFixed(1)}MB)`);
      },
    });
    console.log('\n✓ Model loaded successfully!');

    console.log('\n[3/3] Executing chat inference...');
    
    // Construct a standard Troubadour Prompt
    const systemPrompt = `You are the Troubadour, a sovereign local-first Socratic music mentor.
Keep answers extremely concise, poetic, and focused on somatic practice.
Always end your final sentence in Troubadour mode with 'Over.'

CURRENT ENVIRONMENT:
Fret: 2 (Minor 2nd)
Polarity: Yin (Inward, reflective, slow, deep breathing)
Phase: DO (Humming the interval, feeling vocal cord vibrations)
Archetype: The Storyteller`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'How do I start feeling the Minor 2nd interval on Fret 2?' }
    ];

    console.log('\n------------------ SYSTEM PROMPT ------------------');
    console.log(systemPrompt);
    console.log('---------------------------------------------------');
    console.log('\nUSER: "How do I start feeling the Minor 2nd interval on Fret 2?"');
    console.log('\nTroubadour is thinking...');

    const response = await wllama.createChatCompletion({
      messages,
      max_tokens: 150,
      temperature: 0.1,
      top_k: 50,
      top_p: 0.9,
      penalty_repeat: 1.05,
    });

    const reply = response.choices[0].message.content;
    console.log('\n------------------ TROUBADOUR REPLY ------------------');
    console.log(reply);
    console.log('------------------------------------------------------');

    await wllama.unloadModel();
    console.log('\n✓ Model unloaded successfully. Test complete!');
  } catch (err) {
    console.error('\n❌ Inference run failed:', err);
    process.exit(1);
  }
}

main();
