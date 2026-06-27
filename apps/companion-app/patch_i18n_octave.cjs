const fs = require('fs');

const updateLocale = (file, additions) => {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.translation = { ...data.translation, ...additions };
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

updateLocale('src/locales/en.json', {
  "octaveMicError": "Microphone access denied or not found.",
  "octaveTitle": "The Human Octave",
  "octaveSubtitle": "Sound speaks for itself.",
  "octaveListening": "Listening to the void...",
  "octaveSilent": "The library is silent.",
  "octavePushFirst": "Be the first to push a frequency.",
  "octavePreview": "Preview Track",
  "octavePushing": "Pushing...",
  "octavePush": "Push to Octave"
});

updateLocale('src/locales/fr.json', {
  "octaveMicError": "Accès au microphone refusé ou introuvable.",
  "octaveTitle": "L'Octave Humaine",
  "octaveSubtitle": "Le son parle de lui-même.",
  "octaveListening": "À l'écoute du vide...",
  "octaveSilent": "La bibliothèque est silencieuse.",
  "octavePushFirst": "Soyez le premier à pousser une fréquence.",
  "octavePreview": "Prévisualiser la piste",
  "octavePushing": "Envoi...",
  "octavePush": "Pousser vers l'Octave"
});
