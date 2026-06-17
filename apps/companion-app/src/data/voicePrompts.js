// ═══════════════════════════════════════════════════════════
// voicePrompts.js — Bertrand's Living Voice Curriculum
//
// Pre-written voice prompts for each fret's BE/DO/PLAY gates.
// These are spoken by CosyVoice in Bertrand's cloned voice
// at key curriculum moments — the voice IS the pedagogy.
//
// "The Musical Journey" — 12M Bible
//
// Structure: Each fret has prompts for three gates:
//   BE  — Somatic/embodied presence prompts
//   DO  — Technical fidelity guidance
//   PLAY — Creative expression encouragement
//
// Prompts are bilingual (en/fr) to honor the truebadour tradition.
// ═══════════════════════════════════════════════════════════

export const VOICE_PROMPTS = {
  // ── Fret 1: Root Note — The Foundation ──────────────────
  1: {
    interval: 'Root / Unison',
    theme: 'The Foundation',
    be: {
      en: "Close your eyes. Feel the weight of the guitar against your body. Before you play a single note, take three deep breaths. Let each breath go deeper than the last. The root note is not something you find. It is something you become. Over.",
      fr: "Fermez les yeux. Sentez le poids de la guitare contre votre corps. Avant de jouer une seule note, prenez trois respirations profondes. La note fondamentale n'est pas quelque chose que l'on trouve. C'est quelque chose que l'on devient. Terminé.",
    },
    do: {
      en: "Now pluck the open low E string. Let it ring. Do not rush. Listen to how the sound fills the room and then fades into silence. Your only job right now is to make that single note as pure and as beautiful as possible. Over.",
      fr: "Maintenant, pincez la corde Mi grave ouverte. Laissez-la résonner. N'ayez pas de hâte. Écoutez comment le son remplit la pièce puis s'efface dans le silence. Votre seul travail est de rendre cette note aussi pure que possible. Terminé.",
    },
    play: {
      en: "You have found your root. Now play it as if you are introducing yourself to an old friend. Let the note carry your name, your story, your breath. This is not a performance. This is a meeting. Over.",
      fr: "Vous avez trouvé votre fondamentale. Maintenant, jouez-la comme si vous vous présentez à un vieil ami. Laissez la note porter votre nom, votre histoire, votre souffle. Terminé.",
    },
  },

  // ── Fret 2: Minor 2nd — The Awakening ──────────────────
  2: {
    interval: 'Minor 2nd',
    theme: 'The Awakening',
    be: {
      en: "The minor second is the smallest step in music, but it carries the most tension. Before you play it, notice where you hold tension in your own body. Your jaw. Your shoulders. This interval is a mirror of your inner state. Over.",
      fr: "La seconde mineure est le plus petit pas en musique, mais elle porte la plus grande tension. Avant de la jouer, remarquez où vous tenez la tension dans votre propre corps. Votre mâchoire. Vos épaules. Cet intervalle est un miroir. Terminé.",
    },
    do: {
      en: "Play the open string, then fret one. Listen to the friction between those two notes. Do not try to make it beautiful. Let it be uncomfortable. Dissonance is not a mistake. It is the beginning of understanding. Over.",
      fr: "Jouez la corde ouverte, puis la première frette. Écoutez la friction entre ces deux notes. N'essayez pas de la rendre belle. Laissez-la être inconfortable. La dissonance n'est pas une erreur. Terminé.",
    },
    play: {
      en: "Now improvise with just two notes — the open string and the first fret. How many different emotions can you find in this smallest of intervals? Surprise me. Over.",
      fr: "Maintenant, improvisez avec seulement deux notes. Combien d'émotions différentes pouvez-vous trouver dans ce plus petit des intervalles? Surprenez-moi. Terminé.",
    },
  },

  // ── Fret 3: Major 2nd — The First Step ─────────────────
  3: {
    interval: 'Major 2nd',
    theme: 'The First Step',
    be: {
      en: "The major second is the first real step. A whole tone. Like stepping forward on a path. Before you play it, stand up. Feel your feet on the ground. Take one step forward. That physical movement — that is the major second. Over.",
      fr: "La seconde majeure est le premier vrai pas. Un ton entier. Comme avancer sur un chemin. Avant de la jouer, levez-vous. Sentez vos pieds sur le sol. Faites un pas en avant. Ce mouvement physique — c'est la seconde majeure. Terminé.",
    },
    do: {
      en: "Play the open string, then the second fret. Notice how much more relaxed this feels compared to the minor second. This is the sound of walking. Steady, confident, moving forward. Match that feeling in your body. Over.",
      fr: "Jouez la corde ouverte, puis la deuxième frette. Remarquez combien cela semble plus détendu que la seconde mineure. C'est le son de la marche. Stable, confiant. Terminé.",
    },
    play: {
      en: "Create a short melody using only the root and the major second. Make it sound like a journey beginning. Where is this path taking you? Over.",
      fr: "Créez une courte mélodie en utilisant seulement la fondamentale et la seconde majeure. Donnez-lui le son d'un voyage qui commence. Où ce chemin vous mène-t-il? Terminé.",
    },
  },

  // ── Fret 4: Minor 3rd — The Shadow ─────────────────────
  4: {
    interval: 'Minor 3rd',
    theme: 'The Shadow',
    be: {
      en: "The minor third is the voice of longing. Of minor keys. Of rain on a winter window. Before you play it, think of something bittersweet — a memory that makes you smile and ache at the same time. Hold that feeling. Over.",
      fr: "La tierce mineure est la voix du désir. Des tonalités mineures. De la pluie sur une fenêtre d'hiver. Avant de la jouer, pensez à quelque chose de doux-amer. Gardez ce sentiment. Terminé.",
    },
    do: {
      en: "Play the root, then the minor third. Hum along. Let your voice follow the guitar. When voice and string merge, you will feel the minor third not just in your ears but in your chest. That resonance is what we are seeking. Over.",
      fr: "Jouez la fondamentale, puis la tierce mineure. Fredonnez. Laissez votre voix suivre la guitare. Quand la voix et la corde fusionnent, vous sentirez la tierce mineure dans votre poitrine. Terminé.",
    },
    play: {
      en: "Write a four-note phrase that tells a story of something lost and something found. The minor third is your storyteller. Let it speak. Over.",
      fr: "Écrivez une phrase de quatre notes qui raconte l'histoire de quelque chose de perdu et de retrouvé. La tierce mineure est votre conteur. Terminé.",
    },
  },

  // ── Fret 5: Major 3rd — The Smile ─────────────────────
  5: {
    interval: 'Major 3rd',
    theme: 'The Smile',
    be: {
      en: "The major third is the sound of sunshine. Of opening a door to a garden. Smile. Literally. Smile right now, and hold it while you breathe. Your embouchure changes when you smile — and so does the music. Over.",
      fr: "La tierce majeure est le son du soleil. D'ouvrir une porte sur un jardin. Souriez. Littéralement. Souriez maintenant, et gardez ce sourire en respirant. Terminé.",
    },
    do: {
      en: "Play the major third and let it ring. Now sing it. The major third has a brightness that wants to expand. Do not contain it. Let the note open like a flower. Over.",
      fr: "Jouez la tierce majeure et laissez-la résonner. Maintenant chantez-la. La tierce majeure a une luminosité qui veut s'étendre. Ne la contenez pas. Terminé.",
    },
    play: {
      en: "Alternate between the minor third and the major third. Feel how one note changes everything. This is the power of a single semitone. This is music. Over.",
      fr: "Alternez entre la tierce mineure et la tierce majeure. Sentez comment une seule note change tout. C'est le pouvoir d'un demi-ton. C'est la musique. Terminé.",
    },
  },

  // ── Fret 6: Perfect 4th — The Question ─────────────────
  6: {
    interval: 'Perfect 4th',
    theme: 'The Question',
    be: {
      en: "The perfect fourth is the sound of a question being asked. Of a door opening onto the unknown. Before you play it, ask yourself a real question. Something you truly do not know the answer to. Hold that openness. Over.",
      fr: "La quarte juste est le son d'une question posée. D'une porte s'ouvrant sur l'inconnu. Avant de la jouer, posez-vous une vraie question. Quelque chose dont vous ne connaissez vraiment pas la réponse. Terminé.",
    },
    do: {
      en: "Play the root, then the perfect fourth. This is the interval that begins every hymn, every anthem. It reaches upward. Practice until the transition feels as natural as lifting your gaze. Over.",
      fr: "Jouez la fondamentale, puis la quarte juste. C'est l'intervalle qui commence chaque hymne, chaque anthem. Il s'élève. Pratiquez jusqu'à ce que la transition soit aussi naturelle que lever les yeux. Terminé.",
    },
    play: {
      en: "Compose a question using only the root and the perfect fourth. Then answer it with any interval you choose. A musical conversation with yourself. Over.",
      fr: "Composez une question en utilisant seulement la fondamentale et la quarte juste. Puis répondez-y avec l'intervalle de votre choix. Terminé.",
    },
  },

  // ── Fret 7: Tritone — The Devil's Interval ─────────────
  7: {
    interval: 'Tritone',
    theme: 'The Threshold',
    be: {
      en: "The tritone was once called the devil's interval. It was banned in medieval music. Why? Because it refuses to resolve. It sits in perfect tension. Before you play it, find that place in yourself that resists resolution. That is where growth lives. Over.",
      fr: "Le triton était autrefois appelé l'intervalle du diable. Il a été interdit dans la musique médiévale. Pourquoi? Parce qu'il refuse de se résoudre. Avant de le jouer, trouvez ce lieu en vous qui résiste à la résolution. C'est là que vit la croissance. Terminé.",
    },
    do: {
      en: "Play the root, then the tritone. Hold both notes. Do not resolve. Sit in the tension for ten full seconds. Notice what your body does — does it want to move? To escape? That impulse is the lesson. Over.",
      fr: "Jouez la fondamentale, puis le triton. Tenez les deux notes. Ne résolvez pas. Restez dans la tension pendant dix secondes complètes. Remarquez ce que fait votre corps. Terminé.",
    },
    play: {
      en: "Create a piece that lives entirely in the tritone. No resolution. No home. Let the listener sit in the beautiful discomfort of not knowing where the music will go. Over.",
      fr: "Créez une pièce qui vit entièrement dans le triton. Pas de résolution. Pas de chez-soi. Laissez l'auditeur dans le bel inconfort de ne pas savoir. Terminé.",
    },
  },

  // ── Fret 8: Perfect 5th — The Anchor ───────────────────
  8: {
    interval: 'Perfect 5th',
    theme: 'The Anchor',
    be: {
      en: "The perfect fifth. Three to two. The most consonant interval after the octave. It is the sound of stability. Of arriving. After the chaos of the tritone, this is the harbor. Breathe deeply. You have earned this rest. Over.",
      fr: "La quinte juste. Trois pour deux. L'intervalle le plus consonant après l'octave. C'est le son de la stabilité. De l'arrivée. Après le chaos du triton, voici le port. Respirez profondément. Terminé.",
    },
    do: {
      en: "Play a power chord — root and fifth together. This is the foundation of rock, of folk, of everything that makes music powerful. Feel the bones of the guitar vibrate through your body. Over.",
      fr: "Jouez un accord de puissance — fondamentale et quinte ensemble. C'est la base du rock, du folk, de tout ce qui rend la musique puissante. Sentez les os de la guitare vibrer. Terminé.",
    },
    play: {
      en: "Compose a short piece that begins with the tritone tension of Fret 7 and resolves into the perfect fifth of Fret 8. Tell the story of chaos finding peace. Over.",
      fr: "Composez une courte pièce qui commence avec la tension du triton et se résout dans la quinte juste. Racontez l'histoire du chaos trouvant la paix. Terminé.",
    },
  },

  // ── Frets 9-12 abbreviated for initial release ──────────
  9: {
    interval: 'Minor 6th', theme: 'The Longing',
    be: { en: "The minor sixth reaches upward with yearning. It is the sound of distance between two lovers. Before you play it, reach your arms above your head and stretch. Feel the longing in your muscles. Over.", fr: "La sixte mineure s'élève avec désir. C'est le son de la distance. Avant de la jouer, étirez vos bras au-dessus de votre tête. Terminé." },
    do: { en: "Play the minor sixth slowly. Let each repetition reveal a new shade of the same emotion. The best musicians find infinite colors in a single interval. Over.", fr: "Jouez la sixte mineure lentement. Laissez chaque répétition révéler une nouvelle nuance. Terminé." },
    play: { en: "Write a love letter in sound using the minor sixth as your only words. Over.", fr: "Écrivez une lettre d'amour en son en utilisant la sixte mineure comme vos seuls mots. Terminé." },
  },
  10: {
    interval: 'Major 6th', theme: 'The Dance',
    be: { en: "The major sixth has the buoyancy of a waltz. It lifts and swings. Before you play, sway your body gently side to side. Find the three-four rhythm in your bones. Over.", fr: "La sixte majeure a la légèreté d'une valse. Avant de jouer, balancez doucement votre corps. Trouvez le rythme dans vos os. Terminé." },
    do: { en: "Play the major sixth with a lilting rhythm. This interval wants to dance. Let it. Over.", fr: "Jouez la sixte majeure avec un rythme léger. Cet intervalle veut danser. Laissez-le. Terminé." },
    play: { en: "Compose a waltz using only intervals you have learned so far. The major sixth is your melody. Everything else is the harmony beneath your feet. Over.", fr: "Composez une valse en utilisant tous les intervalles appris. La sixte majeure est votre mélodie. Terminé." },
  },
  11: {
    interval: 'Minor 7th', theme: 'The Blues',
    be: { en: "The minor seventh is the soul of the blues. It bends. It cries. It laughs through tears. Before you play, think of the most honest thing you have ever said. That honesty — that is the minor seventh. Over.", fr: "La septième mineure est l'âme du blues. Elle plie. Elle pleure. Elle rit à travers les larmes. Pensez à la chose la plus honnête que vous ayez jamais dite. Terminé." },
    do: { en: "Play the minor seventh and bend into it from a half step below. Feel the string fight and then yield. That tension and release — that is the blues. Over.", fr: "Jouez la septième mineure et faites un bend depuis un demi-ton en dessous. Sentez la corde résister puis céder. Terminé." },
    play: { en: "Play a twelve-bar blues using everything you have learned. The minor seventh is your secret weapon. Let the guitar cry. Over.", fr: "Jouez un blues de douze mesures. La septième mineure est votre arme secrète. Laissez la guitare pleurer. Terminé." },
  },
  12: {
    interval: 'Major 7th', theme: 'The Home',
    be: { en: "The major seventh. One semitone from the octave. One step from coming full circle. You can feel the pull toward resolution. But do not resolve yet. Sit here, at the edge of completion, and savor how far you have come. You are not the same person who played the root note twelve months ago. Over.", fr: "La septième majeure. Un demi-ton de l'octave. Un pas pour boucler le cercle. Vous sentez l'attraction vers la résolution. Mais ne résolvez pas encore. Restez ici, au bord de l'achèvement. Terminé." },
    do: { en: "Play the full chromatic scale from root to major seventh. Slowly. One note per breath. Let each interval remind you of its lesson. Over.", fr: "Jouez la gamme chromatique complète de la fondamentale à la septième majeure. Lentement. Une note par respiration. Terminé." },
    play: { en: "Compose your capstone piece. Use every interval. Tell your story — from foundation to home. This is your truebadour's song. I am proud of you. Over.", fr: "Composez votre pièce maîtresse. Utilisez chaque intervalle. Racontez votre histoire. C'est votre chanson de truebadour. Je suis fier de vous. Terminé." },
  },
};

/**
 * Get the voice prompt for a specific fret and gate.
 * @param {number} fret - 1-12
 * @param {'be'|'do'|'play'} gate - The somatic gate
 * @param {string} locale - 'en' or 'fr'
 * @returns {string} The prompt text for CosyVoice to speak
 */
export function getVoicePrompt(fret, gate, locale = 'en') {
  const fretData = VOICE_PROMPTS[fret];
  if (!fretData) return null;
  const gateData = fretData[gate];
  if (!gateData) return null;
  return gateData[locale] || gateData['en'];
}

/**
 * Get all voice prompts for a fret (all gates).
 */
export function getFretVoicePrompts(fret, locale = 'en') {
  const fretData = VOICE_PROMPTS[fret];
  if (!fretData) return null;
  return {
    interval: fretData.interval,
    theme: fretData.theme,
    be: fretData.be[locale] || fretData.be['en'],
    do: fretData.do[locale] || fretData.do['en'],
    play: fretData.play[locale] || fretData.play['en'],
  };
}
