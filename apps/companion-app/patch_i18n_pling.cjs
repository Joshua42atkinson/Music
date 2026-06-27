const fs = require('fs');

const updateLocale = (file, additions) => {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.translation = { ...data.translation, ...additions };
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

updateLocale('src/locales/en.json', {
  "plingTitle": "The PLING! Trainer",
  "plingDesc": "Sing a note. Let the Living Voice respond.",
  "plingMicError": "Please allow microphone access to use the PLING! trainer.",
  "plingMicInput": "Mic Input",
  "plingDetecting": "Detecting...",
  "plingWaiting": "Waiting",
  "plingOctave": "Octave",
  "plingFlat50": "-50 Flat",
  "plingInTune": "In Tune",
  "plingSharp50": "+50 Sharp",
  "plingPerfect": "Perfect Pitch",
  "plingFlat": "FLAT",
  "plingSharp": "SHARP",
  "plingCents": "cents",
  "plingWaitingPitch": "Waiting for pitch...",
  "plingStopMic": "Stop Listening",
  "plingStartMic": "Activate Microphone"
});

updateLocale('src/locales/fr.json', {
  "plingTitle": "L'Entraîneur PLING!",
  "plingDesc": "Chantez une note. Laissez la Voix Vivante répondre.",
  "plingMicError": "Veuillez autoriser l'accès au microphone.",
  "plingMicInput": "Entrée Micro",
  "plingDetecting": "Détection...",
  "plingWaiting": "En attente",
  "plingOctave": "Octave",
  "plingFlat50": "-50 Trop bas",
  "plingInTune": "Juste",
  "plingSharp50": "+50 Trop haut",
  "plingPerfect": "Parfait",
  "plingFlat": "TROP BAS",
  "plingSharp": "TROP HAUT",
  "plingCents": "cents",
  "plingWaitingPitch": "En attente de la voix...",
  "plingStopMic": "Arrêter d'écouter",
  "plingStartMic": "Activer le microphone"
});
