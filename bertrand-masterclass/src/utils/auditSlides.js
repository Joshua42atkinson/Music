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
    // Recursively find all PNG files in chDir and chDir/timeless
    const getFiles = (dir) => {
      let results = [];
      const list = fs.readdirSync(dir);
      list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
          results = results.concat(getFiles(fullPath));
        } else if (file.endsWith('.png')) {
          results.push(fullPath);
        }
      });
      return results;
    };
    diskFiles = getFiles(chDir);
  } catch(e) {}

  const mappedSlides = slides.filter(s => s.image);
  const missing = [];
  const usedPaths = [];

  mappedSlides.forEach(s => {
    // Convert absolute web path /assets/slides/chX/... to actual disk path
    const relPath = s.image.replace(/^\/assets\/slides\//, '');
    const diskPath = path.join(slidesDir, relPath);
    usedPaths.push(diskPath);
    if (!fs.existsSync(diskPath)) {
      missing.push(s.id + ' -> ' + s.image);
    }
  });

  const unusedOnDisk = diskFiles
    .filter(filePath => !usedPaths.includes(filePath))
    .map(filePath => path.relative(chDir, filePath));

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
