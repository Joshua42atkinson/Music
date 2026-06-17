#!/usr/bin/env node

// Script to replace hardcoded colors with CSS variables
// Focus on gold color (#c9a96e) and its variants

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Color mappings
const colorMappings = {
  '#c9a96e': 'var(--cf-gold)',
  'rgba(201,169,110,': 'rgba(var(--cf-gold-rgb),', // Will need custom property
  'rgb(201,169,110)': 'var(--cf-gold)',
  '#8b7d5a': 'var(--cf-gold-dim)',
  'rgba(139,125,90,': 'rgba(var(--cf-gold-dim-rgb),',
  'rgb(139,125,90)': 'var(--cf-gold-dim)',
};

// Add RGB custom properties to index.css first
function addRGBProperties() {
  const indexCssPath = path.join(srcDir, 'index.css');
  let content = fs.readFileSync(indexCssPath, 'utf8');
  
  // Find the :root section and add RGB properties
  const rootSection = content.match(/:root \{[\s\S]*?\}/);
  if (rootSection) {
    const newRootSection = rootSection[0].replace(
      /(  --cf-gold: #c9a96e;)/,
      `$1\n  --cf-gold-rgb: 201, 169, 110;`
    ).replace(
      /(  --cf-gold-dim: #8b7d5a;)/,
      `$1\n  --cf-gold-dim-rgb: 139, 125, 90;`
    );
    
    content = content.replace(rootSection[0], newRootSection);
    fs.writeFileSync(indexCssPath, content, 'utf8');
    console.log('✅ Added RGB custom properties to index.css');
  }
}

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

function replaceColorsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const [hardcoded, variable] of Object.entries(colorMappings)) {
    if (content.includes(hardcoded)) {
      content = content.replace(new RegExp(hardcoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), variable);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated colors in: ${path.relative(srcDir, filePath)}`);
  }
  
  return modified;
}

// Main execution
console.log('🎨 Extracting design tokens...');

// First add RGB properties to CSS
addRGBProperties();

// Then replace colors in all files
const jsxFiles = findJsxFiles(srcDir);
let updatedCount = 0;

for (const file of jsxFiles) {
  if (replaceColorsInFile(file)) {
    updatedCount++;
  }
}

console.log(`\n🎉 Design token extraction complete!`);
console.log(`   Updated ${updatedCount} files`);
console.log(`   Replaced hardcoded colors with CSS variables`);
