const fs = require('fs');

const updateLocale = (file, additions) => {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.translation = { ...data.translation, ...additions };
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

updateLocale('src/locales/en.json', {
  "multiKeySubtitle": "©FHEAL · Multi-Key Fluency",
  "multiKeyTitle": "Multi-Key Hub",
  "multiKeyDesc": "See any scale across all 12 keys at once. Tap a key to explore its full pattern.",
  "scale_major": "Major",
  "scale_minor": "Natural Minor",
  "scale_pentatonicMajor": "Major Penta",
  "scale_pentatonicMinor": "Minor Penta",
  "scale_blues": "Blues",
  "scale_dorian": "Dorian",
  "scale_mixolydian": "Mixolydian"
});

updateLocale('src/locales/fr.json', {
  "multiKeySubtitle": "©FHEAL · Fluidité Multi-Tonalité",
  "multiKeyTitle": "Hub Multi-Tonalité",
  "multiKeyDesc": "Voir n'importe quelle gamme sur les 12 tonalités à la fois. Touchez une tonalité pour explorer son motif complet.",
  "scale_major": "Majeure",
  "scale_minor": "Mineure naturelle",
  "scale_pentatonicMajor": "Penta Majeure",
  "scale_pentatonicMinor": "Penta Mineure",
  "scale_blues": "Blues",
  "scale_dorian": "Dorien",
  "scale_mixolydian": "Mixolydien"
});
