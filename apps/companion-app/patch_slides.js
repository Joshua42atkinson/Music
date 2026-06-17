const fs = require('fs');

const dataPath = 'src/data/slideDecks.js';
let content = fs.readFileSync(dataPath, 'utf8');

const replacements = [
  { id: '1-yin-0', img: '/assets/slides/fret1_yin0.png' },
  { id: '1-yin-1', img: '/assets/slides/fret1_yin1.png' },
  { id: '1-shedding', img: '/assets/slides/fret1_shedding.png' },
  { id: '2-concept-0', img: '/assets/slides/fret2_concept0.png' },
  { id: '2-concept-1', img: '/assets/slides/fret2_concept1.png' },
  { id: '2-concept-2', img: '/assets/slides/fret2_concept2.png' },
  { id: '2-shedding', img: '/assets/slides/fret2_shedding.png' },
  { id: '3-concept-2', img: '/assets/slides/fret3_concept2.png' },
  { id: '3-shedding', img: '/assets/slides/fret3_shedding.png' },
  { id: '4-concept-1', img: '/assets/slides/fret4_concept1.png' },
  { id: '4-concept-2', img: '/assets/slides/fret4_concept2.png' },
  { id: '4-shedding', img: '/assets/slides/fret4_shedding.png' },
  { id: '5-concept-1', img: '/assets/slides/fret5_concept1.png' },
  { id: '5-concept-2', img: '/assets/slides/fret5_concept2.png' },
  { id: '5-shedding', img: '/assets/slides/fret5_shedding.png' },
  { id: '6-concept-1', img: '/assets/slides/fret6_concept1.png' },
  { id: '6-concept-2', img: '/assets/slides/fret6_concept2.png' },
  { id: '6-shedding', img: '/assets/slides/fret6_shedding.png' },
  { id: '7-concept-0', img: '/assets/slides/fret7_concept0.png' },
  { id: '7-concept-1', img: '/assets/slides/fret7_concept1.png' },
  { id: '7-concept-2', img: '/assets/slides/fret7_concept2.png' },
  { id: '7-shedding', img: '/assets/slides/fret7_shedding.png' },
  { id: '8-concept-1', img: '/assets/slides/fret8_concept1.png' },
  { id: '8-concept-2', img: '/assets/slides/fret8_concept2.png' },
  { id: '8-shedding', img: '/assets/slides/fret8_shedding.png' },
  { id: '9-concept-1', img: '/assets/slides/fret9_concept1.png' },
  { id: '9-concept-2', img: '/assets/slides/fret9_concept2.png' },
  { id: '9-shedding', img: '/assets/slides/fret9_shedding.png' },
  { id: '10-concept-1', img: '/assets/slides/fret10_concept1.png' },
  { id: '10-concept-2', img: '/assets/slides/fret10_concept2.png' },
  { id: '10-shedding', img: '/assets/slides/fret10_shedding.png' },
  { id: '11-concept-1', img: '/assets/slides/fret11_concept1.png' },
  { id: '11-concept-2', img: '/assets/slides/fret11_concept2.png' },
  { id: '11-shedding', img: '/assets/slides/fret11_shedding.png' },
  { id: '12-concept-1', img: '/assets/slides/fret12_concept1.png' },
  { id: '12-concept-2', img: '/assets/slides/fret12_concept2.png' },
  { id: '12-shedding', img: '/assets/slides/fret12_shedding.png' },
];

for (const { id, img } of replacements) {
  // Regex to find the block for the specific slide ID and replace its "image": null
  // We look for "id": "X", then some content, then "image": null
  const regex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?)"image":\\s*null`, 'g');
  if (!regex.test(content)) {
    console.log(`Failed to match or already replaced for ${id}`);
  } else {
    content = content.replace(regex, `$1"image": "${img}"`);
    console.log(`Replaced image for ${id}`);
  }
}

fs.writeFileSync(dataPath, content, 'utf8');
console.log('Done.');
