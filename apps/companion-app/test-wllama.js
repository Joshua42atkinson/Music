import { Wllama } from '@wllama/wllama/esm/index.js';
const config = { 'default': 'https://cdn.jsdelivr.net/npm/@wllama/wllama@3.4.1/wasm/wllama.wasm' };
console.log("Config passed:", config);
try {
  const w = new Wllama(config);
  console.log("Wllama created successfully");
} catch (e) {
  console.error("Error:", e);
}
