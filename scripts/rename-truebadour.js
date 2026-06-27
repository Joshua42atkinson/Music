import fs from 'fs/promises';
import path from 'path';

async function walk(dir) {
  let results = [];
  const list = await fs.readdir(dir);
  for (let file of list) {
    file = path.join(dir, file);
    const stat = await fs.stat(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist') && !file.includes('.gemini') && !file.includes('.vite')) {
        results.push(file); // include dir for renaming
        results = results.concat(await walk(file));
      }
    } else {
      if (
        file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.json') ||
        file.endsWith('.html') || file.endsWith('.md') || file.endsWith('.css')
      ) {
        results.push(file);
      }
    }
  }
  return results;
}

async function run() {
  const allPaths = await walk(path.join(process.cwd(), 'src'));
  
  // First, rename files and directories from bottom up to avoid path invalidation
  allPaths.sort((a, b) => b.length - a.length);

  for (const p of allPaths) {
    const basename = path.basename(p);
    let newBasename = basename;
    
    // Exact casing
    newBasename = newBasename.replace(/Troubadour/g, 'Truebadour');
    newBasename = newBasename.replace(/troubadour/g, 'truebadour');
    newBasename = newBasename.replace(/TROUBADOUR/g, 'TRUEBADOUR');

    if (newBasename !== basename) {
      const dir = path.dirname(p);
      const newPath = path.join(dir, newBasename);
      console.log(`Renaming: ${p} -> ${newPath}`);
      await fs.rename(p, newPath);
    }
  }

  // Now, grab all files again after rename and do text replacement
  const newAllPaths = await walk(path.join(process.cwd(), 'src'));
  
  for (const p of newAllPaths) {
    const stat = await fs.stat(p);
    if (!stat.isDirectory()) {
      const content = await fs.readFile(p, 'utf8');
      
      let newContent = content.replace(/Troubadour/g, 'Truebadour');
      newContent = newContent.replace(/troubadour/g, 'truebadour');
      newContent = newContent.replace(/TROUBADOUR/g, 'TRUEBADOUR');
      
      if (newContent !== content) {
        console.log(`Updating content: ${p}`);
        await fs.writeFile(p, newContent, 'utf8');
      }
    }
  }
  console.log('Done!');
}

run().catch(console.error);
