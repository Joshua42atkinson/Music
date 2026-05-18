// ═══════════════════════════════════════════════════════════
// THE BARD'S HANDBOOK — 12-Fret Monomyth Curriculum
// Maps the Hero's Journey to the Western Chromatic Scale
// Each chapter = 1 semitone = 1 Hero's Journey stage
// ═══════════════════════════════════════════════════════════

const chapters = [
  {
    id: 1, fret: 1, note: 'Root', interval: 'Unison',
    heroStage: 'Call to Adventure', title: 'The Root Note', subtitle: 'Booting the Hardware',
    act: 'I — Departure', icon: '🌱', color: '#ff6b6b', pillar: 'Technique & Body Intelligence',
    coreMessage: 'Trauma creates and keeps tension. You are fighting the instrument.',
    westernTheory: {
      musicGrammar: 'The Root note is the foundation of Western Music. It is the center of gravity, the "home base" from which all other notes pull or push. Without a root, harmony has no context.',
      guitarGrammar: 'On the guitar, the root can be moved anywhere. Unlike a piano where "Middle C" is fixed, the guitar is a transposing instrument relative to its tuning. The open strings are just pre-fretted notes at Fret 0.'
    },
    yin: {
      title: 'The Grip of Tension',
      philosophy: `You are an instrument playing an instrument. Before you tune the wooden box, you must tune the biological one. The body is your first instrument — your fascia, your breath, your nervous system. Physical tension on the fretboard is trapped psychological trauma. Every hunched shoulder, every locked jaw, every shallow breath is a wall between you and the music.\n\nThe ancient alchemists called this stage "Nigredo" — the blackening. You must first confront the chaos within before transmutation can begin. In the practice nook, this means sitting with the guitar and doing... nothing. Not playing. Breathing. Scanning. Listening to the silence between your heartbeats.`,
      quote: { text: 'The wound is the place where the Light enters you.', author: 'Rumi' },
      meditation: { prompt: 'Close your eyes. Hold the guitar against your body. Where do you feel resistance?', duration: 60 },
      concepts: [
        { term: 'Kinesthesis', definition: 'The awareness of the position and movement of the parts of the body by means of sensory organs in the muscles and joints.' },
        { term: 'Fascia', definition: 'The connective tissue web that surrounds every muscle, bone, and organ. It records and stores physical patterns — including tension from stress and trauma.' },
        { term: 'Ventral Vagal State', definition: 'The "rest and digest" state. Social engagement, calm breathing, relaxed muscles. This is the prerequisite for Flow.' }
      ]
    },
    yang: {
      title: 'The Pre-Flight Check',
      instruction: `Before your fingers touch the strings, your body must be calibrated. This is not optional — it is the foundation upon which every note is built.`,
      exercises: [
        { name: 'The Body Scan', steps: ['Sit with your guitar', 'Close eyes, breathe deeply', 'Scan from crown to toes', 'Release tension', 'Open eyes. Shoulders dropped.'] },
        { name: 'The Single Note Test', steps: ['Play one open E string', 'Listen to decay', 'Play again — notice shoulders', 'Play without tension'] }
      ],
      fretboardFocus: { startFret: 0, endFret: 0, strings: [1, 2, 3, 4, 5, 6], pattern: 'open-strings' }
    }
  },
  {
    id: 2, fret: 2, note: 'C/C♯', interval: 'Minor 2nd',
    heroStage: 'Refusal of the Call', title: 'The Refusal', subtitle: 'Who Is Playing Who?',
    act: 'I — Departure', icon: '📯', color: '#ff8e53', pillar: 'Body & Mind Intelligence',
    coreMessage: 'You are an instrument playing an instrument. If I am playing the guitar, who is playing me?',
    westernTheory: {
      musicGrammar: 'The Minor 2nd (one semitone) is the smallest interval in Western music and creates the sharpest dissonance. It is the "rub" that demands resolution.',
      guitarGrammar: 'On the guitar, one fret equals one semitone (a Minor 2nd). This geometric absolute means any chord shape moved up one fret is raised by exactly one semitone.'
    },
    yin: { title: 'The Observer Within', philosophy: 'The Minor 2nd is dissonance — the first friction. It is the moment you realize something is wrong with how you have been practicing.', quote: { text: 'The unexamined life is not worth living.', author: 'Socrates' }, meditation: { prompt: 'Who is the one watching you play?', duration: 45 }, concepts: [] },
    yang: { title: 'The Breathing Fretboard', instruction: 'Apply the Breath Override while fretting your first note on Fret 1.', exercises: [
        { name: 'Tension Comparison Test', steps: ['Hunch shoulders deliberately', 'Play Low E Fret 1', 'Drop shoulders, repeat', 'Compare sounds'] }
      ], fretboardFocus: { startFret: 0, endFret: 2, strings: [1, 6], pattern: 'octave-e' } }
  },
  {
    id: 3, fret: 3, note: 'D', interval: 'Major 2nd',
    heroStage: 'Meeting the Mentor', title: 'The Mentor', subtitle: 'The Left-Brain Interpreter',
    act: 'I — Departure', icon: '🚫', color: '#feca57', pillar: 'Creativity',
    coreMessage: 'Judgment and anticipation destroy flow. The ego must be silenced.',
    westernTheory: {
      musicGrammar: 'The Major 2nd (two semitones, or a whole step) forms the building blocks of most diatonic scales (Major and Minor scales).',
      guitarGrammar: 'A whole step is two frets. Visually seeing whole steps and half steps on a single string is crucial to understanding scale architecture linearly before vertically.'
    },
    yin: { title: 'Silencing the Critic', philosophy: 'The Major 2nd steps further from home. The Left-Brain Interpreter floods you with doubt.', quote: { text: 'It is not the critic who counts.', author: 'Theodore Roosevelt' }, meditation: { prompt: 'Play a note. Notice the voice that judges it.', duration: 45 }, concepts: [] },
    yang: { title: 'Wu Wei — The Art of Non-Action', instruction: 'Practice letting "wrong" notes exist without flinching.', exercises: [
        { name: 'The Deliberate Miss', steps: ['Play a scale', 'Deliberately miss a note', 'Notice body reaction', 'Hold the wrong note without judgment'] }
      ], fretboardFocus: { startFret: 0, endFret: 3, strings: [1, 2, 5, 6], pattern: 'natural-notes' } }
  },
  {
    id: 4, fret: 4, note: 'D♯/E♭', interval: 'Minor 3rd',
    heroStage: 'Crossing the Threshold', title: 'The Threshold', subtitle: 'The Bard Class Initiation',
    act: 'I — Departure', icon: '🧙', color: '#48dbfb', pillar: 'All Five Pillars',
    coreMessage: 'Trust and obey. Follow the unfolding story. The mentor shows the path but cannot walk it for you.',
    westernTheory: {
      musicGrammar: 'The Minor 3rd (three semitones) is the defining interval of minor chords and the blues scale. It carries the emotional weight of melancholy or tension.',
      guitarGrammar: 'The minor third spans three frets on a single string, or an offset diagonal across adjacent strings (depending on the tuning interval of the strings).'
    },
    yin: { title: 'Trust and Obey', philosophy: 'The Minor 3rd introduces emotion — it is the sound of melancholy, of depth.', quote: { text: 'When the student is ready, the teacher appears.', author: 'Lao Tzu' }, meditation: { prompt: 'What brought you to the guitar? The feeling you are chasing.', duration: 60 }, concepts: [] },
    yang: { title: 'The Minor Third Interval', instruction: 'Learn the sound and shape of the Minor 3rd on all six strings.', exercises: [
        { name: 'Sing Then Find (PLING!)', steps: ['Play open Low E', 'Sing the note 3 frets higher', 'Fret it and check accuracy'] }
      ], fretboardFocus: { startFret: 0, endFret: 4, strings: [1, 2, 3, 4, 5, 6], pattern: 'minor-third' } }
  },
  {
    id: 5, fret: 5, note: 'E', interval: 'Major 3rd',
    heroStage: 'Tests, Allies, Enemies', title: 'The Tests', subtitle: 'The Grammar of Music',
    act: 'II — Initiation', icon: '🚪', color: '#0abde3', pillar: 'Music Theory',
    coreMessage: 'Theory is not rules; it is the geometry of sound. The fretboard is the grid where this geometry manifests.',
    westernTheory: {
      musicGrammar: 'The Major 3rd (four semitones) defines Major chords. It is the interval of brightness and resolution. A major chord is Root + Major 3rd + Perfect 5th.',
      guitarGrammar: 'Due to Standard Tuning (E-A-D-G-B-E), the guitar is tuned in Perfect 4ths EXCEPT between the G and B strings, which is a Major 3rd. This specific "warp" is what allows for ergonomic chord shapes.'
    },
    yin: { title: 'The Universal Geometry', philosophy: 'The Major 3rd is brightness, resolution, warmth. You cross the threshold from "noodling" into understanding.', quote: { text: 'Music is the arithmetic of sounds as optics is the geometry of light.', author: 'Claude Debussy' }, meditation: { prompt: 'Listen to a major chord. Where in your body do you feel its warmth?', duration: 30 }, concepts: [] },
    yang: { title: 'Notes → Chords → Songs', instruction: 'Build your first Major chord from individual intervals.', exercises: [
        { name: 'Build a Major Chord by Ear', steps: ['Play Root', 'Play Major 3rd (brightness)', 'Play Perfect 5th (power)', 'Strum together'] }
      ], fretboardFocus: { startFret: 0, endFret: 5, strings: [1, 2, 3, 4, 5, 6], pattern: 'major-chord-tones' } }
  },
  {
    id: 6, fret: 6, note: 'F', interval: 'Perfect 4th',
    heroStage: 'Approach to the Inmost Cave', title: 'The Approach', subtitle: 'Fretboard Organization (SHEARL)',
    act: 'II — Initiation', icon: '⚔️', color: '#5f27cd', pillar: 'Music Theory & SHEARL',
    coreMessage: 'See how music shows up on the guitar. The SHEARL protocol: See it, Hear it, Feel it.',
    westernTheory: {
      musicGrammar: 'The Perfect 4th (five semitones) is a highly stable, "open" interval. In classical counterpoint, it was often considered a dissonance requiring resolution, but in modern music it is the basis of quartal harmony.',
      guitarGrammar: 'The guitar is fundamentally a quartal instrument (tuned in fourths). Moving vertically (across strings) up the neck by one string at the same fret yields a Perfect 4th (except the G-to-B string warp).'
    },
    yin: { title: 'The SHEARL Protocol', philosophy: 'The Perfect 4th is the foundation of power chords and the backbone of rock. Here you face the Tests — the fretboard seems impossibly complex.', quote: { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' }, meditation: { prompt: 'Look at the fretboard. Try to see shapes. Patterns.', duration: 30 }, concepts: [] },
    yang: { title: 'The CAGED System', instruction: 'The fretboard is built on five repeating chord shapes: C, A, G, E, D.', exercises: [
        { name: 'The Five Neighborhoods', steps: ['Play open C', 'Barre up 2 frets', 'Play A, G, E, D shapes'] }
      ], fretboardFocus: { startFret: 0, endFret: 7, strings: [1, 2, 3, 4, 5, 6], pattern: 'caged-c-shape' } }
  },
  {
    id: 7, fret: 7, note: 'F♯/G♭', interval: 'Tritone',
    heroStage: 'The Ordeal', title: 'The Ordeal', subtitle: 'Inner Ear Development',
    act: 'II — Initiation', icon: '🕳️', color: '#8854d0', pillar: 'Ear Training & PLING!',
    coreMessage: 'The Third Ear and musical imagination. If you cannot sing it, you cannot play it.',
    westernTheory: {
      musicGrammar: 'The Tritone (six semitones) exactly splits the octave in half. Often called the "Devil in Music" historically, its extreme dissonance is the engine that drives Dominant 7th chords to resolve back home.',
      guitarGrammar: 'Because it splits the octave, the tritone shape is highly symmetrical on the fretboard. It is easily identifiable as a diagonal spanning adjacent strings.'
    },
    yin: { title: 'The Third Ear', philosophy: 'The Tritone is the exact midpoint of the octave. Maximum tension. Maximum dissonance. This is the Inmost Cave.', quote: { text: 'Music is the space between the notes.', author: 'Claude Debussy' }, meditation: { prompt: 'Hum a note. Try to hear the note one step higher in your mind.', duration: 45 }, concepts: [] },
    yang: { title: 'The PLING! Protocol', instruction: 'Sing it, then play it. Play what you sing, sing what you play.', exercises: [
        { name: 'Play What You Sing', steps: ['Hum a note', 'Find it on the guitar', 'Eliminate beating'] }
      ], fretboardFocus: { startFret: 0, endFret: 7, strings: [1, 2, 3, 4, 5, 6], pattern: 'tritone' } }
  },
  {
    id: 8, fret: 8, note: 'G', interval: 'Perfect 5th',
    heroStage: 'The Reward', title: 'The Reward', subtitle: 'The True Move',
    act: 'II — Initiation', icon: '🔥', color: '#e74c3c', pillar: 'Technique',
    coreMessage: 'Overcoming the fear of a wrong note. The friction of the True Move.',
    westernTheory: {
      musicGrammar: 'The Perfect 5th (seven semitones) is the most consonant interval after the octave. It is structurally integral, forming the power chord and anchoring the overtone series.',
      guitarGrammar: 'On the lower strings, the Perfect 5th is the classic "Power Chord" shape (Root + two frets up on the next string). This shape is a physical anchor for modern guitar playing.'
    },
    yin: { title: 'The Art of the True Move', philosophy: 'The Perfect 5th is resolution, power, clarity. The Supreme Ordeal is confronting your fear of mistakes.', quote: { text: 'The master has failed more times than the beginner has tried.', author: 'Stephen McCranie' }, meditation: { prompt: 'Recall your worst musical mistake. Realize it taught you.', duration: 45 }, concepts: [] },
    yang: { title: 'Tension and Resolution', instruction: 'Play a dissonant interval. Hold it. Feel the tension. Now resolve it.', exercises: [
        { name: 'The Power Chord Ladder', steps: ['Play E5 power chord', 'Slide up 1 fret at a time', 'Breathe at each fret'] }
      ], fretboardFocus: { startFret: 0, endFret: 8, strings: [1, 2, 3, 4, 5, 6], pattern: 'power-chord' } }
  },
  {
    id: 9, fret: 9, note: 'G♯/A♭', interval: 'Minor 6th',
    heroStage: 'The Road Back', title: 'The Road Back', subtitle: 'Proper Kinesthesis',
    act: 'III — Return', icon: '⚡', color: '#2ecc71', pillar: 'Technique & Creativity',
    coreMessage: 'Somatize the music. Be effortlessness and emotional honesty.',
    westernTheory: {
      musicGrammar: 'The Minor 6th (eight semitones) is an inversion of the Major 3rd. It has a beautiful, searching quality used frequently in romantic classical themes and cinematic scores.',
      guitarGrammar: 'Interval inversions mean you can find a Minor 6th by either going up 8 frets, or going down a Major 3rd (4 frets) and jumping up an octave. The guitar allows spatial manipulation of these intervals.'
    },
    yin: { title: 'Effortless Mastery', philosophy: 'The Minor 6th is bittersweet beauty. This is not about playing harder or faster. It is about playing with the absolute minimum necessary force.', quote: { text: 'Mastery is not about adding, but about removing.', author: 'Kenny Werner' }, meditation: { prompt: 'Play a chord. Use half the pressure. Find the threshold.', duration: 30 }, concepts: [] },
    yang: { title: 'The Microscopic Dance', instruction: 'Minimum force, maximum clarity. This is proper kinesthesis.', exercises: [
        { name: 'The Pressure Threshold', steps: ['Fret note hard', 'Release until buzzing', 'Add tiny amount of pressure'] }
      ], fretboardFocus: { startFret: 0, endFret: 9, strings: [1, 2, 3, 4, 5, 6], pattern: 'economy-picking' } }
  },
  {
    id: 10, fret: 10, note: 'A', interval: 'Major 6th',
    heroStage: 'The Resurrection', title: 'The Resurrection', subtitle: 'Emotional Loading',
    act: 'III — Return', icon: '🛤️', color: '#f39c12', pillar: 'Performing',
    coreMessage: 'Conditioning the performance. What is the story? Who is your audience?',
    westernTheory: {
      musicGrammar: 'The Major 6th (nine semitones) provides a feeling of wistful longing or expansive openness. It is famously the opening interval of the "NBC Chimes" or "My Bonnie Lies Over the Ocean".',
      guitarGrammar: 'Major 6th chords (Root, 3rd, 5th, 6th) are staples in jazz, swing, and country guitar. They function as stable "home" chords but with added color compared to a plain major triad.'
    },
    yin: { title: 'The Story Behind the Sound', philosophy: 'The Major 6th evokes nostalgia. Music without story is just organized noise. Every performance needs emotional intention.', quote: { text: 'Where words fail, music speaks.', author: 'Hans Christian Andersen' }, meditation: { prompt: 'Play a melody for someone you love.', duration: 45 }, concepts: [] },
    yang: { title: 'Emotional Conditioning', instruction: 'Same notes — different story. This is the performing pillar in action.', exercises: [
        { name: 'The Dedication', steps: ['Pick a person', 'Dedicate melody to them', 'Notice touch/tempo changes'] }
      ], fretboardFocus: { startFret: 0, endFret: 10, strings: [1, 2, 3, 4, 5, 6], pattern: 'chord-progression' } }
  },
  {
    id: 11, fret: 11, note: 'A♯/B♭', interval: 'Minor 7th',
    heroStage: 'Return with the Elixir', title: 'The Elixir', subtitle: 'The Mirror of the Audience',
    act: 'III — Return', icon: '🪞', color: '#e056a0', pillar: 'Performing & Conditioning',
    coreMessage: 'Delivery and unshakable confidence. Performance anxiety is the final boss.',
    westernTheory: {
      musicGrammar: 'The Minor 7th (ten semitones) is the crucial ingredient in Dominant 7th chords. It creates the bluesy "pull" that demands to resolve back to the root.',
      guitarGrammar: 'Visually, a Minor 7th is a whole step (2 frets) DOWN from the octave. This makes it incredibly easy to locate on the fretboard simply by finding the octave root and stepping back.'
    },
    yin: { title: 'The Social Forge', philosophy: 'The Minor 7th is the penultimate tension. The audience is not your enemy — it is a mirror reflecting your emotional truth.', quote: { text: 'Stage fright is the ego\'s last stand.', author: 'Bertrand Laurence' }, meditation: { prompt: 'Imagine an audience. Feel the fear. Give them permission to feel.', duration: 60 }, concepts: [] },
    yang: { title: 'Performing Under Fire', instruction: 'Maintain your flow despite the chaos. Performance anxiety is the final dragon.', exercises: [
        { name: 'The Distraction Protocol', steps: ['Play from memory', 'Turn on TV midway', 'Do not stop playing'] }
      ], fretboardFocus: { startFret: 0, endFret: 11, strings: [1, 2, 3, 4, 5, 6], pattern: 'full-scale' } }
  },
  {
    id: 12, fret: 12, note: 'B', interval: 'Major 7th / Octave',
    heroStage: 'Master of Two Worlds', title: 'The Master', subtitle: 'The Flow State',
    act: 'III — Return', icon: '♾️', color: '#00d2d3', pillar: 'All Five Pillars United',
    coreMessage: 'Surrender humbly to be "played" by the guitar. Welcome to the Flow State.',
    westernTheory: {
      musicGrammar: 'The Major 7th (eleven semitones) is severe dissonance pulling heavily to the octave. Once the Octave (12 semitones) is reached, the cycle is complete. The frequency is doubled, and a new world begins.',
      guitarGrammar: 'Fret 12 on the guitar is the physical midpoint of the string. Every note and shape that existed between Fret 0 and Fret 11 perfectly repeats itself from Fret 12 onwards.'
    },
    yin: { title: 'Metaphysical Surrender', philosophy: 'The Octave is the same note you started with — but vibrating at twice the frequency. You no longer play the guitar; the guitar plays through you.', quote: { text: 'It does not shoot; It shoots.', author: 'Eugen Herrigel' }, meditation: { prompt: 'Feel how far you have come. Pick up the guitar and just play.', duration: 90 }, concepts: [] },
    yang: { title: 'The Elixir — Free Play', instruction: 'No exercises. No rules. No fretboard map. Just you, the guitar, and the sound.', exercises: [], fretboardFocus: { startFret: 0, endFret: 12, strings: [1, 2, 3, 4, 5, 6], pattern: 'full-chromatic' } }
  }
];

export default chapters;
export { chapters };
