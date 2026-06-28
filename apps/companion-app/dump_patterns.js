import { VERTISCALE_PATTERNS, resolvePattern } from './src/data/vertiscalePatterns.js';
import fs from 'fs';

const dump = VERTISCALE_PATTERNS.map(p => resolvePattern(p.id));
fs.writeFileSync('../spatial-engine/vertiscale_patterns.json', JSON.stringify(dump, null, 2));
console.log('Dumped to vertiscale_patterns.json');
