#!/usr/bin/env node

// Script to add keyboard accessibility to onClick handlers
// Finds button/interactive elements with onClick but no onKeyDown

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function findJsxFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findJsxFiles(fullPath));
    } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

function fixKeyboardAccessibility(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let modified = false;
  let newLines = [...lines];
  
  // Pattern to find onClick handlers without keyboard handlers
  // This is a simplified approach - in production, you'd want a proper AST parser
  for (let i = 0; i < newLines.length; i++) {
    const line = newLines[i];
    
    // Skip if already has keyboard handlers
    if (line.includes('onKeyDown=') || line.includes('onKeyPress=') || line.includes('onKeyUp=')) {
      continue;
    }
    
    // Look for onClick in button/interactive elements
    if (line.includes('onClick=')) {
      // Extract the onClick handler
      const onClickMatch = line.match(/onClick={([^}]+)}/);
      if (onClickMatch) {
        const handler = onClickMatch[1];
        
        // Add onKeyDown handler after onClick
        const onKeyDownLine = `          onKeyDown={(e) => e.key === 'Enter' && ${handler}}`;
        
        // Insert after the onClick line
        newLines.splice(i + 1, 0, onKeyDownLine);
        modified = true;
        i++; // Skip the line we just added
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    console.log(`Fixed keyboard accessibility in: ${filePath}`);
  }
  
  return modified;
}

// Main execution
const jsxFiles = findJsxFiles(srcDir);
let fixedCount = 0;

console.log('Scanning for keyboard accessibility issues...');

for (const file of jsxFiles) {
  if (fixKeyboardAccessibility(file)) {
    fixedCount++;
  }
}

console.log(`\nFixed keyboard accessibility in ${fixedCount} files.`);
