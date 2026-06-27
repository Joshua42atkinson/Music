const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const filesWithLs = [];
walkDir(path.join(__dirname, '../src'), (filePath) => {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.ts')) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('localStorage.getItem') || content.includes('localStorage.setItem') || content.includes('localStorage.removeItem')) {
      filesWithLs.push(filePath);
    }
  }
});

console.log(filesWithLs.join('\n'));
