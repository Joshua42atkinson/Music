import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Using dynamic imports or directly importing if type="module"
import frets from './src/data/chapterData.js';
import { generateSlides } from './src/data/slideGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, 'public');

console.log('🔍 Validating all slide images...');

let missingCount = 0;
let totalImages = 0;

frets.forEach(fret => {
  const slides = generateSlides(fret);
  
  slides.forEach(slide => {
    if (slide.image) {
      totalImages++;
      // image path looks like '/assets/slides/ch1/title.png'
      const physicalPath = path.join(PUBLIC_DIR, slide.image);
      
      if (!fs.existsSync(physicalPath)) {
        console.error(`❌ Missing Image for slide [${slide.id}]:`);
        console.error(`   Expected path: ${physicalPath}`);
        missingCount++;
      }
    }
  });
});

console.log('\n--- Validation Summary ---');
console.log(`Total images checked: ${totalImages}`);
if (missingCount > 0) {
  console.error(`❌ FAILED: ${missingCount} images are missing from the public folder.`);
  process.exit(1);
} else {
  console.log(`✅ SUCCESS: All slide images are correctly injected and present on disk.`);
  process.exit(0);
}
