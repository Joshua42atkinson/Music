import fs from 'fs';
import path from 'path';
import frets from '../src/data/chapterData.js';
import { generateSlides } from '../src/data/slideGenerator.js';

const __dirname = path.resolve();

console.log('--- STARTING SLIDE IMAGE INTEGRITY CHECK ---');

let totalSlides = 0;
let slidesWithImages = 0;
let slidesWithMissingImages = 0;
let slidesWithProceduralFallbacks = 0;

const missingImagesList = [];

frets.forEach(fret => {
  const slides = generateSlides(fret);
  console.log(`\nFret ${fret.id} - ${fret.title.en}: ${slides.length} slides generated`);
  
  slides.forEach((slide, index) => {
    totalSlides++;
    const imagePath = slide.image;
    
    if (imagePath) {
      slidesWithImages++;
      // Check if image file exists on disk
      const fullPath = path.join(__dirname, 'public', imagePath);
      const exists = fs.existsSync(fullPath);
      
      if (!exists) {
        slidesWithMissingImages++;
        console.log(`  [MISSING FILE] Slide ${index} (${slide.id}): type="${slide.type}", title="${slide.title ? (slide.title.en || slide.title) : ''}"`);
        console.log(`                 Linked Path: ${imagePath}`);
        missingImagesList.push({
          fretId: fret.id,
          slideId: slide.id,
          type: slide.type,
          title: slide.title ? (slide.title.en || slide.title) : '',
          linkedPath: imagePath,
          reason: 'File does not exist on disk'
        });
      } else {
        // Exists
      }
    } else {
      slidesWithProceduralFallbacks++;
      console.log(`  [NO LINKED IMAGE] Slide ${index} (${slide.id}): type="${slide.type}", title="${slide.title ? (slide.title.en || slide.title) : ''}" -> Falls back to procedural art`);
      missingImagesList.push({
        fretId: fret.id,
        slideId: slide.id,
        type: slide.type,
        title: slide.title ? (slide.title.en || slide.title) : '',
        linkedPath: null,
        reason: 'No mapped image path'
      });
    }
  });
});

console.log('\n--- SUMMARY ---');
console.log(`Total Slides Generated: ${totalSlides}`);
console.log(`Slides with Linked Images: ${slidesWithImages}`);
console.log(`Slides with Procedural Fallbacks (No Image): ${slidesWithProceduralFallbacks}`);
console.log(`Slides with Broken Image Links (Missing Files): ${slidesWithMissingImages}`);
console.log(`----------------`);
