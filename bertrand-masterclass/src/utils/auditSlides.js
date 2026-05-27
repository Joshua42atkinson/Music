import frets from '../data/chapterData.js';
import { generateSlides } from '../data/slideGenerator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const slidesDir = path.join(__dirname, '../../public/assets/slides');

const audit = [];

frets.forEach(fret => {
  const slides = generateSlides(fret);
  const chDir = path.join(slidesDir, `ch${fret.id}`);
  let diskFiles = [];
  try {
    diskFiles = fs.readdirSync(chDir)
      .filter(f => f.endsWith('.png'))
      .map(f => f.replace('.png', ''));
  } catch(e) {}

  const mappedSlides = slides.filter(s => s.image);
  const usedImgNames = mappedSlides.map(s => path.basename(s.image).replace('.png', ''));
  const unusedOnDisk = diskFiles.filter(f => !usedImgNames.includes(f) && !f.startsWith('timeless'));
  const missing = usedImgNames.filter(f => {
    const full = path.join(chDir, f + '.png');
    return !fs.existsSync(full);
  });

  const noImageSlides = slides.filter(s => !s.image).map(s => ({ type: s.type, id: s.id }));

  audit.push({
    chapter: fret.id,
    note: fret.note,
    title: typeof fret.title === 'object' ? fret.title.en : fret.title,
    totalSlides: slides.length,
    mappedImages: mappedSlides.length,
    missingFiles: missing,
    unusedFiles: unusedOnDisk,
    noImageSlides: noImageSlides,
  });
});

// Print report
console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║     SLIDE IMAGE AUDIT — Quality Control Overview             ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

let totalMissing = 0;
let totalUnused = 0;
let totalNoImage = 0;

audit.forEach(a => {
  const hasIssues = a.missingFiles.length > 0 || a.unusedFiles.length > 0 || a.noImageSlides.length > 0;
  if (!hasIssues) {
    console.log(`✅ Ch${a.chapter} · ${a.note} — ${a.totalSlides} slides, all images mapped correctly`);
    return;
  }

  console.log(`\n⚠️  Ch${a.chapter} · ${a.note} — "${a.title}"`);
  console.log(`   Total slides: ${a.totalSlides} · Mapped images: ${a.mappedImages}`);

  if (a.missingFiles.length > 0) {
    console.log(`   ❌ MISSING files (mapped but not on disk): ${a.missingFiles.join(', ')}`);
    totalMissing += a.missingFiles.length;
  }
  if (a.unusedFiles.length > 0) {
    console.log(`   🗑️  UNUSED files (on disk but never shown): ${a.unusedFiles.join(', ')}`);
    totalUnused += a.unusedFiles.length;
  }
  if (a.noImageSlides.length > 0) {
    console.log(`   ⚪ NO IMAGE (slides that show gradient fallback):`);
    a.noImageSlides.forEach(s => {
      console.log(`       · ${s.id} (${s.type})`);
    });
    totalNoImage += a.noImageSlides.length;
  }
});

console.log(`\n══════════════════════════════════════════════════════════════════`);
console.log(`SUMMARY: ${totalMissing} missing files · ${totalUnused} unused files · ${totalNoImage} slides without images`);
console.log(`══════════════════════════════════════════════════════════════════\n`);

export default audit;
