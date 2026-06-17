import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import frets from '../src/data/chapterData.js';
import { generateSlides } from '../src/data/slideGenerator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

const slideDecks = {};

for (const fret of frets) {
  const slides = generateSlides(fret);
  
  // Verify image paths
  for (const slide of slides) {
    if (slide.image) {
      const fullPath = path.join(PUBLIC_DIR, slide.image);
      if (!fs.existsSync(fullPath)) {
        console.warn(`Missing image for slide ${slide.id}: ${slide.image}`);
        slide.image = null;
      }
    }
  }
  
  slideDecks[fret.id] = slides;
}

const outputPath = path.join(PROJECT_ROOT, 'src', 'data', 'slideDecks.js');

const fileContent = `// ═══════════════════════════════════════════════════════════
// STATIC SLIDE DECKS
// This file replaces the dynamic slideGenerator.js.
// Every slide and its image path is explicitly defined here.
// If a slide has no image, its image property is explicitly null.
// ═══════════════════════════════════════════════════════════

export const SLIDE_DECKS = ${JSON.stringify(slideDecks, null, 2)};
`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log('Successfully baked slideDecks.js');
