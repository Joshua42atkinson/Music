const fs = require('fs');

const playbook = JSON.parse(fs.readFileSync('public/data/playbookData.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const fr = JSON.parse(fs.readFileSync('src/locales/fr.json', 'utf8'));

// Bard Levels
for (const [level, titles] of Object.entries(playbook.BARD_LEVEL_TITLES)) {
  en.translation[`bardLevel_${level}`] = titles.en;
  fr.translation[`bardLevel_${level}`] = titles.fr;
}

// Quests
for (const quest of playbook.QUEST_DATA) {
  en.translation[`quest_${quest.fretId}_title`] = quest.quest.en;
  fr.translation[`quest_${quest.fretId}_title`] = quest.quest.fr;
  en.translation[`quest_${quest.fretId}_flavor`] = quest.flavor.en;
  fr.translation[`quest_${quest.fretId}_flavor`] = quest.flavor.fr;
  en.translation[`quest_${quest.fretId}_reward`] = quest.reward.en;
  fr.translation[`quest_${quest.fretId}_reward`] = quest.reward.fr;
}

// Custom strings for MentorDashboard & DigitalBinder
en.translation['desktopAppPreviewText'] = "Running in preview mode. Launch the Voix Vive Masterclass Desktop App on your computer to unlock SQLite local storage, auto-detected local AI models (LM Studio / Ollama), and full DaaS sync.";
fr.translation['desktopAppPreviewText'] = "Fonctionne en mode aperçu. Lancez l'application de bureau Voix Vive Masterclass pour débloquer le stockage local SQLite, la détection des modèles IA locaux (LM Studio / Ollama), et la synchronisation DaaS complète.";

en.translation['stampPlingText'] = "\n\n🎸 {{somaticPling}} Metaphor: 'Ensure you listen for the absolute PLING! resonance—feel the note ring out fully with zero somatic grip.'";
fr.translation['stampPlingText'] = "\n\n🎸 Métaphore du {{somaticPling}} : 'Assurez-vous d'écouter la résonance absolue du PLING—ressentez la note résonner pleinement sans aucune crispation somatique.'";

en.translation['stampShearlText'] = "\n\n🕊️ {{somaticShearl}} Metaphor: 'Apply the SHEARL glide here—let your fingers glide horizontally like a feather, bypassing frets without neck friction.'";
fr.translation['stampShearlText'] = "\n\n🕊️ Métaphore du {{somaticShearl}} : 'Appliquez le glissement du CISAILLEMENT ici—laissez vos doigts glisser horizontalement comme une plume, en contournant les frettes sans friction du manche.'";

en.translation['stampFhealText'] = "\n\n🕯️ {{somaticFheal}} Metaphor: 'Try the FHEAL recovery—drop your left shoulder down, let the hand breathe, and allow your muscle memory to speak.'";
fr.translation['stampFhealText'] = "\n\n🕯️ Métaphore de la {{somaticFheal}} : 'Essayez la récupération de la GUÉRISON—relâchez votre épaule gauche, laissez la main respirer et laissez votre mémoire musculaire s'exprimer.'";

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/fr.json', JSON.stringify(fr, null, 2));

console.log('Updated loc files!');

const workbench = {
  1:  { en: "Find your root note. Let the guitar find you.", fr: "Trouvez votre note fondamentale. Laissez la guitare vous trouver." },
  2:  { en: "You only need 10 minutes. Start.", fr: "Vous n'avez besoin que de 10 minutes. Commencez." },
  3:  { en: "The mentor was inside all along.", fr: "Le mentor était en vous depuis le début." },
  4:  { en: "What are you feeling right now? Write it down.", fr: "Que ressentez-vous en ce moment? Écrivez-le." },
  5:  { en: "Tap two notes. See the relationship.", fr: "Tapez deux notes. Voyez la relation." },
  6:  { en: "Face the whole neck. The map is in your hands.", fr: "Faites face à tout le manche. La carte est entre vos mains." },
  7:  { en: "Sing before you play. The mic does not lie.", fr: "Chantez avant de jouer. Le micro ne ment pas." },
  8:  { en: "See what was invisible. Your vibrato becomes intentional.", fr: "Voyez l'invisible. Votre vibrato devient intentionnel." },
  9:  { en: "Play with half pressure. Find the minimum force.", fr: "Jouez avec la moitié de la pression. Trouvez la force minimale." },
  10: { en: "Record yourself. Let Bertrand see you.", fr: "Enregistrez-vous. Laissez Bertrand vous voir." },
  11: { en: "See all 12 keys at once. Navigate like a room.", fr: "Voyez les 12 tonalités à la fois. Naviguez comme une pièce." },
  12: { en: "No rules. Just the instrument and the voice inside.", fr: "Pas de règles. Juste l'instrument et la voix intérieure." },
};

const en2 = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const fr2 = JSON.parse(fs.readFileSync('src/locales/fr.json', 'utf8'));

for (const [id, texts] of Object.entries(workbench)) {
  en2.translation[`chapter_${id}_invitation`] = texts.en;
  fr2.translation[`chapter_${id}_invitation`] = texts.fr;
}
fs.writeFileSync('src/locales/en.json', JSON.stringify(en2, null, 2));
fs.writeFileSync('src/locales/fr.json', JSON.stringify(fr2, null, 2));
console.log('Appended invitations');
