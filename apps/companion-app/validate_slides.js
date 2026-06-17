import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSlides } from './src/data/slideGenerator.js';
import CHAPTER_DATA from './src/data/chapterData.js';
import { TIMELESS_SONG_SLIDES } from './src/data/timelessSongSlides.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, 'public');

let totalSlides = 0;
let missingMappings = [];
let missingFiles = [];

// Check regular chapter slides
CHAPTER_DATA.forEach(fret => {
  const slides = generateSlides(fret);
  slides.forEach(slide => {
    totalSlides++;
    if (!slide.image) {
      missingMappings.push(`Slide ID: ${slide.id} (Type: ${slide.type}) from Fret ${fret.id}`);
    } else {
      // image paths look like '/assets/slides/ch1/title.png'
      const imagePath = path.join(PUBLIC_DIR, slide.image);
      if (!fs.existsSync(imagePath)) {
        missingFiles.push(`File missing on disk: ${slide.image} (for Slide ID: ${slide.id})`);
      }
    }
  });
});

// Check timeless song slides
Object.values(TIMELESS_SONG_SLIDES).flat().forEach(slide => {
  totalSlides++;
  if (!slide.image) {
    missingMappings.push(`Timeless Song Slide ID: ${slide.id}`);
  } else {
    const imagePath = path.join(PUBLIC_DIR, slide.image);
    if (!fs.existsSync(imagePath)) {
      missingFiles.push(`File missing on disk: ${slide.image} (for Timeless Song Slide ID: ${slide.id})`);
    }
  }
});

console.log(`Total Slides Checked: ${totalSlides}`);
console.log(`\n--- Missing Mappings (Image is null) ---`);
if (missingMappings.length === 0) {
  console.log("None! All slides have an image mapped.");
} else {
  missingMappings.forEach(m => console.log(m));
}

console.log(`\n--- Missing Files (Image mapped but file not on disk) ---`);
if (missingFiles.length === 0) {
  console.log("None! All mapped image files exist on disk.");
} else {
  missingFiles.forEach(m => console.log(m));
}
