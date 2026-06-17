const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define roots
const searchRoot = '/home/joshua/Workflow/Other/Bertrand-Masterclass';
const destDir = '/home/joshua/Workflow/Other/Bertrand-Masterclass/Music/bertrand-masterclass/docs_organized';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Find all MD files in the entire workspace, excluding the destination folder
const findCmd = `find ${searchRoot} -name "*.md" -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/.windsurf/*" -not -path "*/docs_organized/*"`;
let files = [];
try {
  files = execSync(findCmd, { encoding: 'utf-8' }).split('\n').filter(Boolean);
} catch(e) {
  // if no files found
}

// Find existing counters by looking at what's already in destDir
const existingFiles = fs.readdirSync(destDir);
const counters = {
  tasklist: 1,
  log: 1,
  research: 1,
  doc: 1
};

existingFiles.forEach(file => {
  const match = file.match(/^([a-z]+)\s(\d+)\s-/i);
  if (match) {
    const type = match[1].toLowerCase();
    const num = parseInt(match[2], 10);
    if (counters[type] && num >= counters[type]) {
      counters[type] = num + 1;
    }
  }
});

files.forEach(file => {
  const basename = path.basename(file, '.md');
  const lowerName = basename.toLowerCase();
  
  // Categorize
  let type = 'doc';
  if (lowerName.includes('roadmap') || lowerName.includes('plan') || lowerName.includes('checklist') || lowerName.includes('task')) {
    type = 'tasklist';
  } else if (lowerName.includes('log') || lowerName.includes('review') || lowerName.includes('audit')) {
    type = 'log';
  } else if (file.includes('/research/') || lowerName.includes('spec') || lowerName.includes('design') || lowerName.includes('analysis') || lowerName.includes('research')) {
    type = 'research';
  }

  // Clean subject
  let subject = basename.replace(/_/g, ' ').replace(/^\d+\s*/, '').trim();
  if (!subject) subject = basename;

  const newName = `${type} ${counters[type]} - ${subject}.md`;
  const destPath = path.join(destDir, newName);
  
  // Move file
  console.log(`Moving: ${file.replace(searchRoot, '')} -> ${newName}`);
  try {
    fs.renameSync(file, destPath);
    counters[type]++;
  } catch(e) {
    console.error(`Failed to move ${file}`);
  }
});

console.log('Done organizing remaining documents.');
