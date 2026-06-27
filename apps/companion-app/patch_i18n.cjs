const fs = require('fs');

const updateLocale = (file, additions) => {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.translation = { ...data.translation, ...additions };
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

updateLocale('src/locales/en.json', {
  "mastery_0": "Encountered",
  "mastery_1": "Experienced",
  "mastery_2": "Owned",
  "mastery_3": "Mastered",
  "heroStage_0": "Call to Adventure",
  "heroStage_1": "Refusal of the Call",
  "heroStage_2": "Meeting the Mentor",
  "heroStage_3": "Crossing the Threshold",
  "heroStage_4": "Tests, Allies, Enemies",
  "heroStage_5": "Approach to the Cave",
  "heroStage_6": "The Ordeal",
  "heroStage_7": "The Reward",
  "heroStage_8": "The Road Back",
  "heroStage_9": "The Resurrection",
  "heroStage_10": "Return with the Elixir",
  "heroStage_11": "Master of Two Worlds"
});

updateLocale('src/locales/fr.json', {
  "mastery_0": "Rencontré",
  "mastery_1": "Expérimenté",
  "mastery_2": "Acquis",
  "mastery_3": "Maîtrisé",
  "heroStage_0": "L'appel de l'aventure",
  "heroStage_1": "Le refus de l'appel",
  "heroStage_2": "La rencontre avec le mentor",
  "heroStage_3": "Le passage du premier seuil",
  "heroStage_4": "Tests, alliés et ennemis",
  "heroStage_5": "L'approche de la caverne",
  "heroStage_6": "L'épreuve suprême",
  "heroStage_7": "La récompense",
  "heroStage_8": "Le chemin du retour",
  "heroStage_9": "La résurrection",
  "heroStage_10": "Le retour avec l'élixir",
  "heroStage_11": "Maître des deux mondes"
});
