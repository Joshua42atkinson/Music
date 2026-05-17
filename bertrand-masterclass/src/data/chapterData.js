// ═══════════════════════════════════════════════════════════
// THE BARD'S HANDBOOK — 12-Fret Monomyth Curriculum
// Maps the Hero's Journey to the Western Chromatic Scale
// Each chapter = 1 semitone = 1 Hero's Journey stage
// Each chapter contains Yin (theory/meditation) + Yang (physical/fretboard) pages
// ═══════════════════════════════════════════════════════════

const chapters = [
  {
    id: 1,
    fret: 1,
    note: 'Root',
    interval: 'Unison',
    heroStage: 'The Ordinary World',
    title: 'The Root Note',
    subtitle: 'Booting the Hardware',
    act: 'I — Departure',
    icon: '🌱',
    color: '#ff6b6b',
    pillar: 'Technique & Body Intelligence',
    coreMessage: 'Trauma creates and keeps tension. You are fighting the instrument.',
    yin: {
      title: 'The Grip of Tension',
      philosophy: `You are an instrument playing an instrument. Before you tune the wooden box, you must tune the biological one. The body is your first instrument — your fascia, your breath, your nervous system. Physical tension on the fretboard is trapped psychological trauma. Every hunched shoulder, every locked jaw, every shallow breath is a wall between you and the music.\n\nThe ancient alchemists called this stage "Nigredo" — the blackening. You must first confront the chaos within before transmutation can begin. In the practice nook, this means sitting with the guitar and doing... nothing. Not playing. Breathing. Scanning. Listening to the silence between your heartbeats.`,
      quote: { text: 'The wound is the place where the Light enters you.', author: 'Rumi' },
      meditation: {
        prompt: 'Close your eyes. Hold the guitar against your body. Where do you feel resistance? Where does the wood press against tension you didn\'t know you carried?',
        duration: 60
      },
      concepts: [
        { term: 'Kinesthesis', definition: 'The awareness of the position and movement of the parts of the body by means of sensory organs in the muscles and joints.' },
        { term: 'Fascia', definition: 'The connective tissue web that surrounds every muscle, bone, and organ. It records and stores physical patterns — including tension from stress and trauma.' },
        { term: 'Sympathetic Nervous System', definition: 'The "fight or flight" state. When activated, fine motor control degrades. You cannot play with precision in this state.' },
        { term: 'Ventral Vagal State', definition: 'The "rest and digest" state. Social engagement, calm breathing, relaxed muscles. This is the prerequisite for Flow.' }
      ]
    },
    yang: {
      title: 'The Pre-Flight Check',
      instruction: `Before your fingers touch the strings, your body must be calibrated. This is not optional — it is the foundation upon which every note is built.\n\nThe Pre-Flight Check is a somatic ritual. Perform it every single time you sit down to practice. It takes two minutes. Those two minutes will save you hours of frustrated, tension-encoded repetition.`,
      exercises: [
        {
          name: 'The Body Scan',
          steps: [
            'Sit with your guitar in playing position',
            'Close your eyes and breathe deeply 3 times',
            'Scan from crown to toes: forehead → jaw → neck → shoulders → upper arms → forearms → wrists → fingers',
            'At each station, consciously release any tension you find',
            'Open your eyes. Your shoulders should be dropped. Your jaw should be unclenched.'
          ]
        },
        {
          name: 'The Breath Override (Wim Hof Simplified)',
          steps: [
            'Inhale deeply through the nose for 4 seconds',
            'Hold for 4 seconds',
            'Exhale slowly through the mouth for 6 seconds',
            'Repeat 4 cycles before touching the strings',
            'Notice: your heart rate has dropped. Your hands are warmer. You are in Ventral Vagal.'
          ]
        },
        {
          name: 'The Single Note Test',
          steps: [
            'Play one open E string with your picking hand',
            'Listen to the note decay completely into silence',
            'Play it again — but this time, notice your shoulders. Did they tense?',
            'Play it a third time with zero unnecessary tension anywhere in your body',
            'This is the standard. Every note you play should feel like this.'
          ]
        }
      ],
      fretboardFocus: { startFret: 0, endFret: 0, strings: [1, 2, 3, 4, 5, 6], pattern: 'open-strings' }
    }
  },
  {
    id: 2, fret: 2, note: 'C/C♯', interval: 'Minor 2nd',
    heroStage: 'Call to Adventure', title: 'The Call', subtitle: 'Who Is Playing Who?',
    act: 'I — Departure', icon: '📯', color: '#ff8e53', pillar: 'Body & Mind Intelligence',
    coreMessage: 'You are an instrument playing an instrument. If I am playing the guitar, who is playing me?',
    yin: { title: 'The Observer Within', philosophy: 'The Minor 2nd is dissonance — the first friction. It is the moment you realize something is wrong with how you have been practicing. The Call is the recognition that mindless repetition creates mindless playing.', quote: { text: 'The unexamined life is not worth living.', author: 'Socrates' }, meditation: { prompt: 'Who is the one watching you play? Not your hands — the one behind your eyes, observing.', duration: 45 }, concepts: [] },
    yang: { title: 'The Breathing Fretboard', instruction: 'Apply the Breath Override while fretting your first note on Fret 1. The goal is to prove that breathing directly changes your tone quality and hand tension.', exercises: [
        { name: 'Fret 1 Breath Sync', steps: ['Place your index finger on Fret 1, Low E string', 'Inhale for 4 seconds — do NOT strike the string yet', 'At the peak of your inhale, pluck the string gently', 'Exhale for 6 seconds while the note rings', 'Repeat on each string, one at a time. Notice how the note quality changes when you are calm.'] },
        { name: 'Tension Comparison Test', steps: ['Hunch your shoulders up to your ears deliberately', 'Fret and pluck the Low E at Fret 1 — listen to the tone', 'Now drop your shoulders completely and repeat the exact same note', 'Compare the two sounds. The relaxed version is clearer, fuller, and sustains longer', 'This is the proof that YOUR body affects the GUITAR\'s voice.'] }
      ], fretboardFocus: { startFret: 0, endFret: 2, strings: [1, 6], pattern: 'octave-e' } }
  },
  {
    id: 3, fret: 3, note: 'D', interval: 'Major 2nd',
    heroStage: 'Refusal of the Call', title: 'The Refusal', subtitle: 'The Left-Brain Interpreter',
    act: 'I — Departure', icon: '🚫', color: '#feca57', pillar: 'Creativity',
    coreMessage: 'Judgment and anticipation destroy flow. The ego must be silenced.',
    yin: { title: 'Silencing the Critic', philosophy: 'The Major 2nd steps further from home. The Left-Brain Interpreter floods you with doubt: "Too slow. Wrong note. You\'ll never get this." These are not truths — they are reflexive defense mechanisms of an ego afraid of vulnerability.', quote: { text: 'It is not the critic who counts.', author: 'Theodore Roosevelt' }, meditation: { prompt: 'Play a note. Any note. Now notice the voice that judges it. That voice is not you. Let it pass like a cloud.', duration: 45 }, concepts: [] },
    yang: { title: 'Wu Wei — The Art of Non-Action', instruction: 'Practice letting "wrong" notes exist without flinching. Play a scale and intentionally miss one note. Do not react. The goal is to decouple your emotional response from your physical execution.', exercises: [
        { name: 'The Deliberate Miss', steps: ['Play the notes on the Low E string: open, Fret 1, Fret 2, Fret 3', 'Repeat — but this time, deliberately play the wrong fret on the third note', 'Notice your body\'s reaction. Did your jaw clench? Did you flinch?', 'Play the "wrong" note again. Hold it. Let it exist without judgment', 'This is the beginning of creative freedom — mistakes are just information.'] },
        { name: 'The Slow Crawl', steps: ['Place your index finger on Fret 1, Low E', 'Move to Fret 2 with your middle finger — take 3 full seconds to make this move', 'Move to Fret 3 with your ring finger — 3 seconds again', 'The goal is NOT speed. The goal is zero wasted tension during the transition', 'If your shoulders rose during ANY move, start over. Practice TOO SLOW.'] }
      ], fretboardFocus: { startFret: 0, endFret: 3, strings: [1, 2, 5, 6], pattern: 'natural-notes' } }
  },
  {
    id: 4, fret: 4, note: 'D♯/E♭', interval: 'Minor 3rd',
    heroStage: 'Meeting the Mentor', title: 'The Mentor', subtitle: 'The Bard Class Initiation',
    act: 'I — Departure', icon: '🧙', color: '#48dbfb', pillar: 'All Five Pillars',
    coreMessage: 'Trust and obey. Follow the unfolding story. The mentor shows the path but cannot walk it for you.',
    yin: { title: 'Trust and Obey', philosophy: 'The Minor 3rd introduces emotion — it is the sound of melancholy, of depth. Here you meet the Mentor figure who shows you that music is not about perfection but about honest expression.', quote: { text: 'When the student is ready, the teacher appears.', author: 'Lao Tzu' }, meditation: { prompt: 'What brought you to the guitar? Not the practical reason — the real reason. The feeling you are chasing.', duration: 60 }, concepts: [] },
    yang: { title: 'The Minor Third Interval', instruction: 'Learn the sound and shape of the Minor 3rd on all six strings. This is the doorway to minor chords — the sound of depth. Use the PLING! protocol: sing the interval BEFORE you play it.', exercises: [
        { name: 'Sing Then Find (PLING!)', steps: ['Play the open Low E string — let it ring', 'Now SING the note that is 3 frets higher (G). Use your voice first', 'Once you can hear it clearly in your mind, fret the 3rd fret and check', 'Were you accurate? The gap between your voice and the fret IS your ear training gap', 'Repeat on every string. Your voice trains your ears faster than your fingers.'] },
        { name: 'The Minor Chord Discovery', steps: ['Play the open E string, then Fret 3 (G), then Fret 7 (B)', 'You just played the three notes of E minor — Root, Minor 3rd, Perfect 5th', 'Now strum all six strings of an open Em chord and listen for those three notes inside it', 'A chord is not a shape to memorize — it is a collection of intervals to HEAR', 'Close your eyes and strum Em. Can you hear the three individual voices?'] }
      ], fretboardFocus: { startFret: 0, endFret: 4, strings: [1, 2, 3, 4, 5, 6], pattern: 'minor-third' } }
  },
  {
    id: 5, fret: 5, note: 'E', interval: 'Major 3rd',
    heroStage: 'Crossing the Threshold', title: 'The Threshold', subtitle: 'The Grammar of Music',
    act: 'II — Initiation', icon: '🚪', color: '#0abde3', pillar: 'Music Theory',
    coreMessage: 'Theory is not rules; it is the geometry of sound. The fretboard is the grid where this geometry manifests.',
    yin: { title: 'The Universal Geometry', philosophy: 'The Major 3rd is brightness, resolution, warmth. You cross the threshold from "noodling" into understanding. Music Theory is not a rulebook — it is a map of the continent you are exploring.', quote: { text: 'Music is the arithmetic of sounds as optics is the geometry of light.', author: 'Claude Debussy' }, meditation: { prompt: 'Listen to a major chord. Where in your body do you feel its warmth? Music theory begins in the body, not the mind.', duration: 30 }, concepts: [] },
    yang: { title: 'Notes → Chords → Songs', instruction: 'Build your first Major chord from individual intervals. Understand WHY these three notes create "brightness." This is the Grammar of Music — not rules to memorize, but architecture to understand.', exercises: [
        { name: 'Build a Major Chord by Ear', steps: ['Play the open A string (Root)', 'Now play Fret 4 on the A string (C♯ — the Major 3rd). This is the "brightness"', 'Now play Fret 7 on the A string (E — the Perfect 5th). This is the "power"', 'Root + Major 3rd + Perfect 5th = Major chord. You built it from atoms.', 'Now strum an open A Major chord. Can you hear those three atoms inside the full chord?'] },
        { name: 'The SHEARL Triangle', steps: ['SEE: Look at the A Major chord shape. Notice the geometric pattern your fingers make', 'HEAR: Strum it. Let the brightness register in your chest, not just your ears', 'FEEL: Notice the physical sensation in your fretting hand — where is the effort?', 'Now reduce the effort by 50% while keeping the same volume', 'The chord should ring cleaner with LESS pressure. This is proper kinesthesis.'] }
      ], fretboardFocus: { startFret: 0, endFret: 5, strings: [1, 2, 3, 4, 5, 6], pattern: 'major-chord-tones' } }
  },
  {
    id: 6, fret: 6, note: 'F', interval: 'Perfect 4th',
    heroStage: 'Tests, Allies, Enemies', title: 'The Tests', subtitle: 'Fretboard Organization (SHEARL)',
    act: 'II — Initiation', icon: '⚔️', color: '#5f27cd', pillar: 'Music Theory & SHEARL',
    coreMessage: 'See how music shows up on the guitar. The SHEARL protocol: See it, Hear it, Feel it.',
    yin: { title: 'The SHEARL Protocol', philosophy: 'The Perfect 4th is the foundation of power chords and the backbone of rock. Here you face the Tests — the fretboard seems impossibly complex. But SHEARL reveals the hidden patterns: See the shape, Hear the interval, Feel the tension in your fingers.', quote: { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' }, meditation: { prompt: 'Look at the fretboard. Instead of seeing individual notes, try to see shapes. Patterns. Geometry repeating itself.', duration: 30 }, concepts: [] },
    yang: { title: 'The CAGED System', instruction: 'The fretboard is built on five repeating chord shapes: C, A, G, E, D. These shapes tile the entire neck like a mosaic. Once you SEE these patterns, the fretboard transforms from 150 random dots into 5 interlocking neighborhoods.', exercises: [
        { name: 'The Five Neighborhoods', steps: ['Play an open C chord. This is the C Shape — memorize its geometry', 'Slide that geometry up 2 frets (use a barre). Now it is a D chord in the C Shape', 'Play an open A chord. Different geometry, same function — a Major chord', 'Play open G, E, and D chords. Five shapes. Five neighborhoods.', 'These five shapes repeat from Fret 0 to Fret 12 and cover the ENTIRE neck.'] },
        { name: 'SHEARL the CAGED', steps: ['Pick any chord shape (start with E Shape)', 'SEE: Where are your fingers? Draw the shape in your mind', 'HEAR: Strum it. What does this voicing sound like compared to the open chord?', 'FEEL: Where does your hand need to stretch? Where is the tension?', 'Repeat with the next CAGED shape. Each has its own voice, its own personality.'] }
      ], fretboardFocus: { startFret: 0, endFret: 7, strings: [1, 2, 3, 4, 5, 6], pattern: 'caged-c-shape' } }
  },
  {
    id: 7, fret: 7, note: 'F♯/G♭', interval: 'Tritone',
    heroStage: 'Approach the Inmost Cave', title: 'The Inmost Cave', subtitle: 'Inner Ear Development',
    act: 'II — Initiation', icon: '🕳️', color: '#8854d0', pillar: 'Ear Training & PLING!',
    coreMessage: 'The Third Ear and musical imagination. If you cannot sing it, you cannot play it.',
    yin: { title: 'The Third Ear', philosophy: 'The Tritone — the Devil\'s Interval — is the exact midpoint of the octave. Maximum tension. Maximum dissonance. This is the Inmost Cave. Here you must develop the Inner Ear: the ability to hear music in your mind before your hands create it.', quote: { text: 'Music is the space between the notes.', author: 'Claude Debussy' }, meditation: { prompt: 'Hum a note. Any note. Now, without using the guitar, try to hear the note one step higher in your mind. Can you sing it?', duration: 45 }, concepts: [] },
    yang: { title: 'The PLING! Protocol', instruction: 'Sing it, then play it. Play what you sing, sing what you play. The PLING! protocol hardwires your vocal cords directly to your motor cortex. Your hands should NEVER execute what your inner ear has not already imagined.', exercises: [
        { name: 'Play What You Sing', steps: ['Hum any note — whatever comes naturally', 'Now find that exact note on the guitar. Hunt for it on the Low E string', 'When you find it, the guitar and your voice should create zero "beating" (wavering)', 'Repeat: hum a DIFFERENT note. Find it. Your ear is learning to lead your hands.', 'This is the PLING! loop: Voice → Ear → Hand → Guitar → Ear → Voice'] },
        { name: 'Sing What You Play', steps: ['Play the note at Fret 5, A string (that is a D note)', 'Now stop the string. Can you still hear the D in your head?', 'Sing it out loud. Match the pitch exactly.', 'Play the note again to check. How close were you?', 'This exercise builds your "inner ear" — the ability to generate music mentally before physically.'] }
      ], fretboardFocus: { startFret: 0, endFret: 7, strings: [1, 2, 3, 4, 5, 6], pattern: 'tritone' } }
  },
  {
    id: 8, fret: 8, note: 'G', interval: 'Perfect 5th',
    heroStage: 'The Supreme Ordeal', title: 'The Ordeal', subtitle: 'The True Move',
    act: 'II — Initiation', icon: '🔥', color: '#e74c3c', pillar: 'Technique',
    coreMessage: 'Overcoming the fear of a wrong note. The friction of the True Move.',
    yin: { title: 'The Art of the True Move', philosophy: 'The Perfect 5th is resolution, power, clarity. The Supreme Ordeal is confronting your fear of mistakes. A "wrong" note is not an error — it is information. The true Bard accepts it as Lore and fluidly resolves it without physical tension.', quote: { text: 'The master has failed more times than the beginner has tried.', author: 'Stephen McCranie' }, meditation: { prompt: 'Recall your worst musical mistake. The cringe you felt. Now realize: that moment taught your nervous system more than a thousand "correct" repetitions.', duration: 45 }, concepts: [] },
    yang: { title: 'Tension and Resolution', instruction: 'Play a dissonant interval. Hold it. Feel the tension in your body. Now resolve it to a consonant interval. Feel the release. This is the physics of music — and the physics of storytelling.', exercises: [
        { name: 'The Tension Hold', steps: ['Play Fret 6 and Fret 7 on the B and E strings simultaneously — a Minor 2nd', 'Hold the dissonance. Do NOT resolve it. Just sit with the uncomfortable sound', 'Notice your body: did your jaw tighten? Your breathing change?', 'Now slide one finger up one fret to create a Major 2nd. Feel the partial release.', 'Now play a Perfect 5th (open E + Fret 7 on A). Feel the total resolution. THIS is music.'] },
        { name: 'The Power Chord Ladder', steps: ['A power chord is Root + Perfect 5th. The most powerful sound in guitar.', 'Play the Low E open + A string Fret 2. This is an E5 power chord.', 'Slide the shape up one fret at a time, from Fret 1 to Fret 8', 'At each fret, hold the chord and BREATHE. Zero tension in your shoulders.', 'You just walked through 8 of the 12 Frets of the Monomyth in power chord form.'] }
      ], fretboardFocus: { startFret: 0, endFret: 8, strings: [1, 2, 3, 4, 5, 6], pattern: 'power-chord' } }
  },
  {
    id: 9, fret: 9, note: 'G♯/A♭', interval: 'Minor 6th',
    heroStage: 'Seizing the Sword', title: 'The Sword', subtitle: 'Proper Kinesthesis',
    act: 'III — Return', icon: '⚡', color: '#2ecc71', pillar: 'Technique & Creativity',
    coreMessage: 'Somatize the music. Be effortlessness and emotional honesty.',
    yin: { title: 'Effortless Mastery', philosophy: 'The Minor 6th is bittersweet beauty. Having survived the Ordeal, you seize the Sword — proper kinesthesis. This is not about playing harder or faster. It is about playing with the absolute minimum necessary force.', quote: { text: 'Mastery is not about adding, but about removing.', author: 'Kenny Werner' }, meditation: { prompt: 'Play your favorite chord. Now play it again using half the pressure. Now half again. Find the threshold where sound still rings but effort is minimal.', duration: 30 }, concepts: [] },
    yang: { title: 'The Microscopic Dance', instruction: 'Analyze the precise relationship between your fretting hand and striking hand under a microscope of attention. Minimum force, maximum clarity. This is what Bertrand calls proper kinesthesis.', exercises: [
        { name: 'The Pressure Threshold', steps: ['Fret a note at Fret 5, B string — press HARD', 'Play it. Listen to the tone quality', 'Now release pressure by tiny increments until the note just barely buzzes', 'Go back up ONE increment. This is your "threshold" — the minimum force for a clean note', 'Most beginners use 3x more pressure than needed. That excess IS your tension.'] },
        { name: 'Economy of Motion', steps: ['Play a 4-note sequence: Fret 5-6-7-8 on the B string, one finger per fret', 'Watch your fingers: how HIGH do they lift off the string between notes?', 'Now repeat, keeping each finger within 2mm of the string after release', 'Speed is a byproduct of small, efficient movements — not force', 'Practice this at half speed until the efficiency becomes unconscious.'] }
      ], fretboardFocus: { startFret: 0, endFret: 9, strings: [1, 2, 3, 4, 5, 6], pattern: 'economy-picking' } }
  },
  {
    id: 10, fret: 10, note: 'A', interval: 'Major 6th',
    heroStage: 'The Road Back', title: 'The Road Back', subtitle: 'Emotional Loading',
    act: 'III — Return', icon: '🛤️', color: '#f39c12', pillar: 'Performing',
    coreMessage: 'Conditioning the performance. What is the story? Who is your audience?',
    yin: { title: 'The Story Behind the Sound', philosophy: 'The Major 6th evokes nostalgia and longing. The Road Back is about bringing everything you\'ve learned back to the world. Music without story is just organized noise. Every performance needs emotional intention.', quote: { text: 'Where words fail, music speaks.', author: 'Hans Christian Andersen' }, meditation: { prompt: 'Think of someone you love. Now play a simple melody as if you were playing it only for them. What changes?', duration: 45 }, concepts: [] },
    yang: { title: 'Emotional Conditioning', instruction: 'Play the same 4-chord progression three times: once "for a child," once "at a funeral," once "at a celebration." Same notes — different story. This is the performing pillar in action.', exercises: [
        { name: 'The Three Stories', steps: ['Learn this progression: Am → F → C → G (simple open chords)', 'Play it once imagining a child falling asleep — soft, gentle, slow', 'Play it again imagining a memorial — heavy, reverent, with space between chords', 'Play it a third time as a celebration — bright, energetic, rhythmic', 'Same four chords. Three completely different performances. The difference was YOU.'] },
        { name: 'The Dedication', steps: ['Pick a person you love. Picture their face clearly.', 'Play any simple melody or chord progression — dedicate it silently to them', 'Notice what changes: your dynamics, your tempo, your touch', 'Now play the same thing with NO dedication — just mechanical execution', 'Hear the difference? Emotional intention is the invisible ingredient of great music.'] }
      ], fretboardFocus: { startFret: 0, endFret: 10, strings: [1, 2, 3, 4, 5, 6], pattern: 'chord-progression' } }
  },
  {
    id: 11, fret: 11, note: 'A♯/B♭', interval: 'Minor 7th',
    heroStage: 'Resurrection', title: 'Resurrection', subtitle: 'The Mirror of the Audience',
    act: 'III — Return', icon: '🪞', color: '#e056a0', pillar: 'Performing & Conditioning',
    coreMessage: 'Delivery and unshakable confidence. Performance anxiety is the final boss.',
    yin: { title: 'The Social Forge', philosophy: 'The Minor 7th is the penultimate tension — one half-step from resolution. Resurrection is the death of your old self as a player. Performance anxiety is the final dragon. The audience is not your enemy — it is a mirror reflecting your emotional truth.', quote: { text: 'Stage fright is the ego\'s last stand.', author: 'Bertrand Laurence' }, meditation: { prompt: 'Imagine 100 people watching you play. Feel the fear. Now realize: they are not judging your technique. They are feeling your energy. Give them permission to feel.', duration: 60 }, concepts: [] },
    yang: { title: 'Performing Under Fire', instruction: 'Play a piece you know well. Halfway through, introduce a deliberate distraction. Maintain your flow despite the chaos. Performance anxiety is the final dragon — and you slay it through exposure, not avoidance.', exercises: [
        { name: 'The Distraction Protocol', steps: ['Choose a piece you can play confidently from memory', 'Start playing. After 30 seconds, turn on the TV or a podcast at medium volume', 'Do NOT stop playing. Stay in the music despite the external noise', 'If you lose your place, do not restart. Improvise your way back.', 'Repeat until external noise no longer disrupts your internal narrative.'] },
        { name: 'The Mirror Performance', steps: ['Set up a mirror so you can see yourself playing', 'Play your piece while watching your own face and body', 'This triggers the same self-consciousness as a live audience', 'Notice where you tense up, where you look away, where you grimace', 'Keep playing. Accept the discomfort. The mirror is training you to perform openly.'] }
      ], fretboardFocus: { startFret: 0, endFret: 11, strings: [1, 2, 3, 4, 5, 6], pattern: 'full-scale' } }
  },
  {
    id: 12, fret: 12, note: 'Octave', interval: 'Octave',
    heroStage: 'Return with the Elixir', title: 'The Octave', subtitle: 'The Flow State',
    act: 'III — Return', icon: '♾️', color: '#00d2d3', pillar: 'All Five Pillars United',
    coreMessage: 'Surrender humbly to be "played" by the guitar. Welcome to the Flow State.',
    yin: { title: 'Metaphysical Surrender', philosophy: 'The Octave is the same note you started with — but vibrating at twice the frequency. You have returned home, but you are fundamentally changed. You no longer play the guitar; the guitar plays through you. This is Wu Wei — effortless action. This is the Flow State.', quote: { text: 'It does not shoot; It shoots.', author: 'Eugen Herrigel, Zen in the Art of Archery' }, meditation: { prompt: 'You started this journey with tension, doubt, and chaos. Feel how far you have come. Now pick up the guitar and play — not to practice, not to perform. Just to play.', duration: 90 }, concepts: [] },
    yang: { title: 'The Elixir — Free Play', instruction: 'No exercises. No rules. No fretboard map. Just you, the guitar, and the sound. This is what you trained for. Surrender.', exercises: [], fretboardFocus: { startFret: 0, endFret: 12, strings: [1, 2, 3, 4, 5, 6], pattern: 'full-chromatic' } }
  }
];

export default chapters;
export { chapters };
