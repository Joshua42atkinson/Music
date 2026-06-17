import { SLIDE_DECKS } from '../src/data/slideDecks.js';
import frets from '../src/data/chapterData.js';
import { TIMELESS_SONG_SLIDES } from '../src/data/timelessSongSlides.js';
import {
  BARD_LEVEL_TITLES, XP_PER_LEVEL, CORE_STATS, QUEST_DATA,
  JOURNAL_PROMPTS, JOURNAL_MOODS, MASTERY_LEVELS, INTERVAL_BADGES, TRUEBADOUR_TYPES
} from '../src/data/playbookData.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'data');
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'slideDecks.json'), JSON.stringify(SLIDE_DECKS, null, 2));
fs.writeFileSync(path.join(outDir, 'chapterData.json'), JSON.stringify(frets, null, 2));
fs.writeFileSync(path.join(outDir, 'timelessSongSlides.json'), JSON.stringify(TIMELESS_SONG_SLIDES, null, 2));

const playbookStatic = {
  BARD_LEVEL_TITLES, XP_PER_LEVEL, CORE_STATS, QUEST_DATA,
  JOURNAL_PROMPTS, JOURNAL_MOODS, MASTERY_LEVELS, INTERVAL_BADGES, TRUEBADOUR_TYPES
};
fs.writeFileSync(path.join(outDir, 'playbookData.json'), JSON.stringify(playbookStatic, null, 2));

console.log('Static data converted to JSON successfully.');
console.log('  - public/data/slideDecks.json');
console.log('  - public/data/chapterData.json');
console.log('  - public/data/timelessSongSlides.json');
console.log('  - public/data/playbookData.json');
