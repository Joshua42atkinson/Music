// ═══════════════════════════════════════════════════════════
// TROUBADOUR'S PLAYBOOK — D&D Player Handbook Data
// Static flavor text, bard level titles, quest descriptions,
// journal prompts, and stat definitions for the Playbook.
// ═══════════════════════════════════════════════════════════

// ── Bard Level Titles ──
// Maps bard level numbers to D&D-flavored rank titles.
export const BARD_LEVEL_TITLES = {
  1:  { en: 'Initiate',              fr: 'Initié' },
  2:  { en: 'Listener',              fr: 'Auditeur' },
  3:  { en: 'Apprentice Bard',       fr: 'Barde Apprenti' },
  4:  { en: 'Wandering Minstrel',    fr: 'Ménestrel Errant' },
  5:  { en: 'Somatic Adept',         fr: 'Adepte Somatique' },
  6:  { en: 'Journeyman Troubadour', fr: 'Troubadour Compagnon' },
  7:  { en: 'Resonance Weaver',      fr: 'Tisseur de Résonance' },
  8:  { en: 'Fretboard Sage',        fr: 'Sage du Manche' },
  9:  { en: 'Voice of the Grid',     fr: 'Voix de la Grille' },
  10: { en: 'Master of Two Worlds',  fr: 'Maître des Deux Mondes' },
};

export function getBardTitle(level, lang = 'en') {
  const clamped = Math.min(Math.max(level, 1), 10);
  return BARD_LEVEL_TITLES[clamped]?.[lang] || BARD_LEVEL_TITLES[clamped]?.en || 'Initiate';
}

// ── XP thresholds per level ──
export const XP_PER_LEVEL = [0, 0, 50, 120, 220, 350, 520, 730, 1000, 1350, 1800];

export function getXpForNextLevel(level) {
  const clamped = Math.min(level + 1, 10);
  return XP_PER_LEVEL[clamped] || 9999;
}

// ── Core Stats ──
// Derived from traction data — these are the "ability scores" of the Playbook.
export const CORE_STATS = [
  {
    id: 'breath',
    icon: '🫁',
    name: { en: 'Breath Control', fr: 'Contrôle du Souffle' },
    description: { en: 'Your ability to center yourself before playing', fr: 'Votre capacité à vous centrer avant de jouer' },
    source: 'breathingSessions', // traction key
  },
  {
    id: 'pitch',
    icon: '🎯',
    name: { en: 'Pitch Accuracy', fr: 'Justesse du Son' },
    description: { en: 'How precisely you hear and match pitch', fr: 'La précision avec laquelle vous entendez et reproduisez les sons' },
    source: 'pitchAccuracy', // averaged from fret traction
  },
  {
    id: 'rhythm',
    icon: '🥁',
    name: { en: 'Rhythm Sense', fr: 'Sens du Rythme' },
    description: { en: 'Your feel for tempo and groove', fr: 'Votre sens du tempo et du groove' },
    source: 'rhythmSessions',
  },
  {
    id: 'memory',
    icon: '🗺️',
    name: { en: 'Fretboard Memory', fr: 'Mémoire du Manche' },
    description: { en: 'How well you recall the geography of the neck', fr: 'Votre connaissance de la géographie du manche' },
    source: 'fretboardAccuracy',
  },
  {
    id: 'expression',
    icon: '✍️',
    name: { en: 'Creative Expression', fr: 'Expression Créative' },
    description: { en: 'Songs written, reflections shared, meaning made', fr: 'Chansons écrites, réflexions partagées, sens créé' },
    source: 'songsWritten',
  },
];

// ── Compute stat value from traction ──
// Returns 1–20 (D&D ability score scale)
export function computeStatValue(statId, traction) {
  const frets = Object.values(traction.frets || {});
  switch (statId) {
    case 'breath':
      return Math.min(20, Math.max(1, Math.floor((traction.breathingSessions || 0) / 2) + 1));
    case 'pitch': {
      const pitches = frets.map(f => f.pitchAccuracy || 0).filter(p => p > 0);
      if (pitches.length === 0) return 1;
      const avg = pitches.reduce((a, b) => a + b, 0) / pitches.length;
      return Math.min(20, Math.max(1, Math.round(avg / 5)));
    }
    case 'rhythm':
      return Math.min(20, Math.max(1, Math.floor((traction.rhythmSessions || 0) / 3) + 1));
    case 'memory': {
      const tractions = frets.map(f => f.traction || 0);
      if (tractions.length === 0) return 1;
      const avg = tractions.reduce((a, b) => a + b, 0) / tractions.length;
      return Math.min(20, Math.max(1, Math.round(avg / 5)));
    }
    case 'expression':
      return Math.min(20, Math.max(1, Math.floor((traction.songsWritten || 0) + (traction.journalEntries || 0)) + 1));
    default:
      return 1;
  }
}

// ── Quest Descriptions (one per fret) ──
// Each fret is a "quest" in the Hero's Journey. The quest description is
// the D&D-style flavor text shown in the Quest Log.
export const QUEST_DATA = [
  {
    fretId: 1,
    quest: { en: 'The Call to Adventure', fr: 'L\'Appel à l\'Aventure' },
    flavor: {
      en: 'Before you can play, you must learn to breathe. The journey begins not with the guitar, but with you.',
      fr: 'Avant de pouvoir jouer, vous devez apprendre à respirer. Le voyage commence non pas avec la guitare, mais avec vous.',
    },
    reward: { en: 'Unlock: Breathing Gate', fr: 'Débloquer : Porte de Respiration' },
  },
  {
    fretId: 2,
    quest: { en: 'Refusal of the Call', fr: 'Le Refus de l\'Appel' },
    flavor: {
      en: 'Every musician resists at first. The Practice Timer teaches you to show up even when inspiration doesn\'t.',
      fr: 'Chaque musicien résiste au début. Le Chronomètre vous apprend à vous présenter même quand l\'inspiration manque.',
    },
    reward: { en: 'Unlock: Practice Timer', fr: 'Débloquer : Chronomètre' },
  },
  {
    fretId: 3,
    quest: { en: 'Meeting the Mentor', fr: 'La Rencontre du Mentor' },
    flavor: {
      en: 'In the Pitch Room, you meet the first true teacher: your own ear. Learn to listen before you play.',
      fr: 'Dans la Salle de Son, vous rencontrez le premier vrai professeur : votre propre oreille.',
    },
    reward: { en: 'Unlock: Pitch Room', fr: 'Débloquer : Salle de Son' },
  },
  {
    fretId: 4,
    quest: { en: 'Crossing the Threshold', fr: 'Le Passage du Seuil' },
    flavor: {
      en: 'You step beyond listening into creating. Troubadour awaits with quill in hand, ready to help you write your first song.',
      fr: 'Vous passez de l\'écoute à la création. Le Troubadour vous attend, plume à la main.',
    },
    reward: { en: 'Unlock: Troubadour\'s Quill', fr: 'Débloquer : Plume du Troubadour' },
  },
  {
    fretId: 5,
    quest: { en: 'Tests, Allies, Enemies', fr: 'Épreuves, Alliés, Ennemis' },
    flavor: {
      en: 'The intervals are your first real test. Some will feel like allies; others will challenge everything you know.',
      fr: 'Les intervalles sont votre première vraie épreuve. Certains seront des alliés, d\'autres des défis.',
    },
    reward: { en: 'Unlock: Interval Visualizer', fr: 'Débloquer : Visualiseur d\'Intervalles' },
  },
  {
    fretId: 6,
    quest: { en: 'Approach to the Inmost Cave', fr: 'L\'Approche de la Grotte' },
    flavor: {
      en: 'The Grid Map reveals the hidden geometry of the fretboard. Five shapes, one truth: CAGED.',
      fr: 'La Carte de Grille révèle la géométrie cachée du manche. Cinq formes, une vérité : CAGED.',
    },
    reward: { en: 'Unlock: The Grid Map', fr: 'Débloquer : La Carte de Grille' },
  },
  {
    fretId: 7,
    quest: { en: 'The Ordeal', fr: 'L\'Épreuve' },
    flavor: {
      en: 'PLING! — the moment voice meets string. Sing the note, find it on the guitar. This is the somatic crucible.',
      fr: 'PLING! — quand la voix rencontre la corde. Chantez la note, trouvez-la sur la guitare.',
    },
    reward: { en: 'Unlock: PLING! Trainer', fr: 'Débloquer : Entraîneur PLING!' },
  },
  {
    fretId: 8,
    quest: { en: 'The Reward', fr: 'La Récompense' },
    flavor: {
      en: 'Your ear has grown precise enough to hear cents. The Microtonal Tracker reveals the expressive nuance in every bend.',
      fr: 'Votre oreille est devenue assez précise. Le Tracker Microtonal révèle chaque nuance.',
    },
    reward: { en: 'Unlock: Microtonal Tracker', fr: 'Débloquer : Tracker Microtonal' },
  },
  {
    fretId: 9,
    quest: { en: 'The Road Back', fr: 'Le Chemin du Retour' },
    flavor: {
      en: 'The full 12-fret guitar neck unfolds before you. Every note is now a friend. Explore freely.',
      fr: 'Le manche complet se dévoile. Chaque note est désormais une amie. Explorez librement.',
    },
    reward: { en: 'Unlock: Playable Guitar', fr: 'Débloquer : Guitare Interactive' },
  },
  {
    fretId: 10,
    quest: { en: 'The Resurrection', fr: 'La Résurrection' },
    flavor: {
      en: 'Record yourself and send it to Bertrand. This is the moment you become accountable to your art.',
      fr: 'Enregistrez-vous et envoyez-le à Bertrand. C\'est le moment où vous devenez responsable de votre art.',
    },
    reward: { en: 'Unlock: Async Assessor', fr: 'Débloquer : Évaluateur Asynchrone' },
  },
  {
    fretId: 11,
    quest: { en: 'Return with the Elixir', fr: 'Le Retour avec l\'Élixir' },
    flavor: {
      en: 'You can now see any scale across all 12 keys simultaneously. The grid is alive in your mind.',
      fr: 'Vous pouvez maintenant voir chaque gamme dans les 12 tonalités simultanément.',
    },
    reward: { en: 'Unlock: Multi-Key Hub', fr: 'Débloquer : Hub Multi-Tonalité' },
  },
  {
    fretId: 12,
    quest: { en: 'Master of Two Worlds', fr: 'Maître des Deux Mondes' },
    flavor: {
      en: 'The final fret. You channel freely over backing tracks, voice and guitar united. The song and the player are one.',
      fr: 'La dernière frette. Vous improvisez librement, voix et guitare unies. Le chant et le joueur ne font qu\'un.',
    },
    reward: { en: 'Unlock: Rhythm Engine', fr: 'Débloquer : Moteur de Rythme' },
  },
];

// ── Journal Prompts (per fret, curated by design) ──
// Shown after a student completes a tool session on the matching fret.
export const JOURNAL_PROMPTS = {
  1: [
    { en: 'How does your body feel after breathing? Where did you notice tension?', fr: 'Comment votre corps se sent-il après la respiration ? Où avez-vous remarqué des tensions ?' },
    { en: 'What thought kept coming back during the breathing gate?', fr: 'Quelle pensée revenait pendant la porte de respiration ?' },
  ],
  2: [
    { en: 'Did you practice today even though you didn\'t feel like it? What happened?', fr: 'Avez-vous pratiqué aujourd\'hui même sans en avoir envie ? Que s\'est-il passé ?' },
    { en: 'What is the hardest part about showing up consistently?', fr: 'Quelle est la partie la plus difficile de la régularité ?' },
  ],
  3: [
    { en: 'What did you hear when you listened to the interval? Did it remind you of anything?', fr: 'Qu\'avez-vous entendu en écoutant l\'intervalle ? Cela vous a-t-il rappelé quelque chose ?' },
    { en: 'Close your eyes and hum the interval. What color does it feel like?', fr: 'Fermez les yeux et fredonnez l\'intervalle. Quelle couleur évoque-t-il ?' },
  ],
  4: [
    { en: 'What theme feels most alive in your life right now? Could it become a song?', fr: 'Quel thème est le plus vivant dans votre vie en ce moment ? Pourrait-il devenir une chanson ?' },
    { en: 'If your guitar could speak, what would it say to you today?', fr: 'Si votre guitare pouvait parler, que vous dirait-elle aujourd\'hui ?' },
  ],
  5: [
    { en: 'Which interval felt like an ally? Which one challenged you?', fr: 'Quel intervalle vous a semblé être un allié ? Lequel vous a défié ?' },
    { en: 'Can you hear the difference between a major and minor third with your eyes closed?', fr: 'Pouvez-vous distinguer une tierce majeure d\'une tierce mineure les yeux fermés ?' },
  ],
  6: [
    { en: 'Which CAGED shape feels most natural to your hand?', fr: 'Quelle forme CAGED est la plus naturelle pour votre main ?' },
    { en: 'Can you see a chord shape in your mind before your fingers touch the strings?', fr: 'Pouvez-vous visualiser un accord avant que vos doigts ne touchent les cordes ?' },
  ],
  7: [
    { en: 'When you sang the note and found it on the guitar, what happened in your body?', fr: 'Quand vous avez chanté la note et l\'avez trouvée sur la guitare, que s\'est-il passé dans votre corps ?' },
    { en: 'Did you feel the moment your voice and the string became the same thing?', fr: 'Avez-vous senti le moment où votre voix et la corde ne faisaient qu\'un ?' },
  ],
  8: [
    { en: 'What does it feel like to bend a note and hear the pitch shift in real time?', fr: 'Que ressentez-vous en faisant un bend et en entendant le pitch changer en temps réel ?' },
    { en: 'Describe the difference between "close enough" and "exactly right."', fr: 'Décrivez la différence entre "presque juste" et "parfaitement juste."' },
  ],
  9: [
    { en: 'The whole neck is visible now. Does it feel smaller or larger than when you started?', fr: 'Le manche entier est visible maintenant. Semble-t-il plus petit ou plus grand qu\'au début ?' },
    { en: 'Pick a random fret and play. What came out? Was it what you expected?', fr: 'Choisissez une frette au hasard et jouez. Qu\'en est-il sorti ? Était-ce ce que vous attendiez ?' },
  ],
  10: [
    { en: 'What was it like to hear yourself played back? What surprised you?', fr: 'Qu\'avez-vous ressenti en vous réécoutant ? Qu\'est-ce qui vous a surpris ?' },
    { en: 'If Bertrand could see you play right now, what would he notice first?', fr: 'Si Bertrand pouvait vous voir jouer maintenant, que remarquerait-il en premier ?' },
  ],
  11: [
    { en: 'You can see all 12 keys at once. Does music feel less like a mystery now, or more?', fr: 'Vous voyez les 12 tonalités d\'un coup. La musique semble-t-elle moins mystérieuse maintenant, ou plus ?' },
    { en: 'Pick two keys and play the same melody in both. How did it change?', fr: 'Choisissez deux tonalités et jouez la même mélodie. Comment a-t-elle changé ?' },
  ],
  12: [
    { en: 'You have completed the 12-Fret journey. Who are you now that you weren\'t at Fret 1?', fr: 'Vous avez terminé le voyage des 12 frettes. Qui êtes-vous maintenant que vous n\'étiez pas à la Frette 1 ?' },
    { en: 'Write a single sentence that captures your entire journey. This is your Troubadour\'s Motto.', fr: 'Écrivez une seule phrase qui résume tout votre voyage. C\'est votre Devise de Troubadour.' },
  ],
};

// ── Mood Options (for journal entries) ──
export const JOURNAL_MOODS = [
  { id: 'focused',    emoji: '🎯', en: 'Focused',    fr: 'Concentré' },
  { id: 'calm',       emoji: '🧘', en: 'Calm',       fr: 'Calme' },
  { id: 'frustrated', emoji: '😤', en: 'Frustrated', fr: 'Frustré' },
  { id: 'inspired',   emoji: '✨', en: 'Inspired',   fr: 'Inspiré' },
  { id: 'curious',    emoji: '🔍', en: 'Curious',    fr: 'Curieux' },
];

// ═══════════════════════════════════════════════════════════
// INTERVAL MASTERY BADGES — Inspired by Trinity ARCANA
// MasteryLevel: Encountered → Experienced → Owned → Mastered
// Each interval from the Adventure maps to a badge the student
// earns by progressing through pitch gates and sung responses.
// ═══════════════════════════════════════════════════════════

export const MASTERY_LEVELS = [
  { id: 'encountered', icon: '🔮', stars: '★',    label: { en: 'Encountered', fr: 'Rencontré' },   color: '#5a6a80' },
  { id: 'experienced', icon: '⚡', stars: '★★',   label: { en: 'Experienced', fr: 'Expérimenté' }, color: '#7aaa88' },
  { id: 'owned',       icon: '🌟', stars: '★★★',  label: { en: 'Owned',       fr: 'Acquis' },       color: '#c9a96e' },
  { id: 'mastered',    icon: '👑', stars: '★★★★', label: { en: 'Mastered',    fr: 'Maîtrisé' },    color: '#e0d0aa' },
];

export const INTERVAL_BADGES = [
  {
    id: 'unison',
    interval: { en: 'Unison',      fr: 'Unisson' },
    note: 'A4',
    freq: 440,
    ratio: '1:1',
    sceneId: 'arrival',
    fretId: 1,
    symbol: '◆',
    color: '#c9a96e',
  },
  {
    id: 'major-2nd',
    interval: { en: 'Major 2nd',   fr: 'Seconde Maj.' },
    note: 'B4',
    freq: 493.88,
    ratio: '9:8',
    sceneId: 'great-hall',
    fretId: 2,
    symbol: '◇',
    color: '#7aaa88',
  },
  {
    id: 'minor-3rd',
    interval: { en: 'Minor 3rd',   fr: 'Tierce Min.' },
    note: 'C5',
    freq: 523.25,
    ratio: '6:5',
    sceneId: 'eleanor-question',
    fretId: 3,
    symbol: '△',
    color: '#7b6aaa',
  },
  {
    id: 'perfect-4th',
    interval: { en: 'Perfect 4th', fr: 'Quarte Juste' },
    note: 'D5',
    freq: 587.33,
    ratio: '4:3',
    sceneId: 'bernards-lesson',
    fretId: 5,
    symbol: '◇',
    color: '#5a90a0',
  },
  {
    id: 'tritone',
    interval: { en: 'Tritone',     fr: 'Triton' },
    note: 'Eb5',
    freq: 622.25,
    ratio: '√2:1',
    sceneId: 'rival-encounter',
    fretId: 7,
    symbol: '○',
    color: '#cc5555',
  },
  {
    id: 'perfect-5th',
    interval: { en: 'Perfect 5th', fr: 'Quinte Juste' },
    note: 'E5',
    freq: 659.25,
    ratio: '3:2',
    sceneId: 'eleanor-test',
    fretId: 9,
    symbol: '☆',
    color: '#c98a4e',
  },
  {
    id: 'octave',
    interval: { en: 'Octave',      fr: 'Octave' },
    note: 'A5',
    freq: 880,
    ratio: '2:1',
    sceneId: 'final-performance',
    fretId: 12,
    symbol: '◆',
    color: '#e8c44a',
  },
];

// ── Channel Attunements (from Trinity's Four Channels) ──
// Maps Voix Vive practice domains to Trinity's Mind/Heart/Body/Action
export const CHANNEL_ATTUNEMENTS = [
  {
    id: 'mind',
    channel: { en: 'Mind — The Sage',     fr: 'Esprit — Le Sage' },
    question: { en: 'What does this mean?', fr: 'Que signifie ceci ?' },
    color: '#4a9e6e',
    icon: '🟢',
    sources: ['slides', 'intervals'], // slide viewing + interval study
  },
  {
    id: 'heart',
    channel: { en: 'Heart — The Bard',     fr: 'Cœur — Le Barde' },
    question: { en: 'Where is the love here?', fr: 'Où est l\'amour ici ?' },
    color: '#d4783c',
    icon: '🟠',
    sources: ['songwriting', 'journal'], // creative expression
  },
  {
    id: 'body',
    channel: { en: 'Body — The Healer',    fr: 'Corps — Le Guérisseur' },
    question: { en: 'What is my body telling me?', fr: 'Que dit mon corps ?' },
    color: '#4a7eb5',
    icon: '🔵',
    sources: ['breathing', 'pitch'], // somatic + pitch work
  },
  {
    id: 'action',
    channel: { en: 'Action — The Builder', fr: 'Action — Le Bâtisseur' },
    question: { en: 'How do I make this real?', fr: 'Comment rendre cela réel ?' },
    color: '#c4a43c',
    icon: '🟡',
    sources: ['fretboard', 'recording'], // instrument mastery
  },
];

// ── Compute interval mastery from adventure session data ──
// Reads the saved adventure session from localStorage
export function getIntervalMastery() {
  const badges = {};

  // Initialize all badges as not-yet-encountered
  INTERVAL_BADGES.forEach(b => { badges[b.id] = 'none'; });

  try {
    const raw = localStorage.getItem('voix_vive_adventure_session');
    if (!raw) return badges;
    const session = JSON.parse(raw);
    if (!session?.session?.history) return badges;

    const history = session.session.history;
    const accuracy = session.session.totalPitchAttempts > 0
      ? session.session.accuratePitchCount / session.session.totalPitchAttempts
      : 0;

    // Map scenes visited → badge mastery levels
    INTERVAL_BADGES.forEach(badge => {
      const visits = history.filter(h => h.sceneId === badge.sceneId);
      if (visits.length === 0) return;

      // Encountered: saw the scene
      badges[badge.id] = 'encountered';

      // Experienced: passed the pitch gate in that scene
      const passedPitch = visits.some(v => v.pitchAccuracy === 'passed');
      if (passedPitch) badges[badge.id] = 'experienced';

      // Owned: passed pitch gate + sang a response
      const sang = visits.some(v => v.singingScore !== null && v.singingScore > 0);
      if (passedPitch && sang) badges[badge.id] = 'owned';

      // Mastered: passed pitch + sang with high score + found bonus branch
      const highSing = visits.some(v => v.singingScore !== null && v.singingScore >= 0.7);
      const bonus = visits.some(v => v.branchType === 'bonus');
      if (passedPitch && highSing && bonus) badges[badge.id] = 'mastered';
    });
  } catch {
    // localStorage not available
  }

  return badges;
}

// ── Compute channel attunement from traction data ──
// Returns { mind: 0-1, heart: 0-1, body: 0-1, action: 0-1 }
export function computeAttunement(traction) {
  const bump = 0.05; // Trinity uses 0.05 per engagement
  const clamp = (v) => Math.min(1.0, Math.max(0.0, v));

  // Mind: slides viewed, intervals explored
  const slidesViewed = Object.values(traction.frets || {})
    .reduce((sum, f) => sum + (f.traction || 0), 0) / 100;
  const mind = clamp(slidesViewed * bump * 4);

  // Heart: songs written, journal entries
  const creative = (traction.songsWritten || 0) + (traction.journalEntries || 0);
  const heart = clamp(creative * bump * 2);

  // Body: breathing sessions, pitch accuracy
  const somatic = (traction.breathingSessions || 0) + (traction.pitchSessions || 0);
  const body = clamp(somatic * bump * 2);

  // Action: fretboard practice, recordings submitted
  const practice = (traction.rhythmSessions || 0) + (traction.recordingsSent || 0);
  const action = clamp(practice * bump * 2);

  // Derive emergent class (same as Trinity's update_class)
  const scores = [
    { val: mind,   label: { en: 'The Oracle',     fr: "L'Oracle" } },
    { val: heart,  label: { en: 'The Bard',       fr: 'Le Barde' } },
    { val: body,   label: { en: 'The Cultivator',  fr: 'Le Cultivateur' } },
    { val: action, label: { en: 'The Templar',     fr: 'Le Templier' } },
  ];
  const dominant = scores.reduce((a, b) => a.val >= b.val ? a : b);
  const totalEngagement = mind + heart + body + action;
  const emergentClass = totalEngagement < 0.1
    ? { en: 'Newcomer', fr: 'Nouveau Venu' }
    : dominant.label;

  return { mind, heart, body, action, emergentClass };
}
