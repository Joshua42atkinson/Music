import { Wllama } from '@wllama/wllama/esm/index.js';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('Testing Wllama model loading under Node.js...');
  const modelPath = path.resolve('public/models/LFM2.5-1.2B-Instruct-Q4_K_M.gguf');
  if (!fs.existsSync(modelPath)) {
    console.error(`Model file not found at ${modelPath}`);
    process.exit(1);
  }
  console.log(`Found model file at ${modelPath} (${(fs.statSync(modelPath).size / (1024*1024)).toFixed(2)} MB)`);
  
  // Wllama in Node needs node-compatible wasm paths or mock path.
  // Let's verify we can import and construct Wllama.
  try {
    const wllama = new Wllama({
      'single-thread/wllama.wasm': 'https://cdn.jsdelivr.net/npm/@wllama/wllama@3.4.1/wasm/wllama.wasm',
      'single-thread/wllama.js': 'https://cdn.jsdelivr.net/npm/@wllama/wllama@3.4.1/wasm/wllama.js',
    });
    console.log('Wllama constructed successfully in Node environment.');
  } catch (err) {
    console.error('Wllama construction error:', err);
  }
}

main();
