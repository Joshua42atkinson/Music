import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CURRICULUM_PATH = path.join(__dirname, '../src/data/cScaleCurriculum.js');

const curriculumContent = fs.readFileSync(CURRICULUM_PATH, 'utf-8');

// Use a regex to extract contentFr and audioSnippetFr
const regex = /contentFr:\s*'([^']*)'[\s\S]*?audioSnippetFr:\s*'([^']*)'/g;

let match;
while ((match = regex.exec(curriculumContent)) !== null) {
  const content = match[1];
  const audioFile = match[2]; // e.g. /assets/audio/bertrand_supporting_beams_fr.mp3
  
  // Create output path relative to public dir
  const outPath = path.join(__dirname, '../public', audioFile);
  
  // ensure dir exists
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  console.log(`Generating: ${audioFile}`);
  
  // use python gtts-cli (assuming it's in the .venv we just created)
  const gttsCmd = `../.venv/bin/gtts-cli "${content.replace(/"/g, '\\"')}" -l fr -o "${outPath}"`;
  
  try {
    execSync(gttsCmd);
    console.log(`Successfully created ${outPath}`);
  } catch (err) {
    console.error(`Error generating ${outPath}:`, err.message);
  }
}
