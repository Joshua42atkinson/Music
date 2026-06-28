import { Compass, Music, Zap, Layers, Activity, Eye, Focus, Shield, TriangleAlert, Sun, Orbit, Sparkles } from 'lucide-react';

/** 20 consecutive pitch-matches within ±25 cents constitutes exercise completion. */
export const PITCH_DETECTION_THRESHOLD = 20;

export const FIVE_PILLARS = [
  { id: 'theory', label: 'Theory', labelFr: 'Théorie', desc: 'Western Harmony, C Scale, intervals, formulas' },
  { id: 'fretboard', label: 'Fretboard Logic', labelFr: 'Logique de la Touche', desc: 'String relationships, CAGED, maps, vertiscales' },
  { id: 'ear', label: 'Ear Training', labelFr: 'Oreille', desc: 'Name that tune, audiation, FHEAL — Hear/See/Play/Feel' },
  { id: 'body', label: 'Body Mechanics', labelFr: 'Mécanique Corporelle', desc: 'Holding/releasing, fascia, breath, posture, Qigong' },
  { id: 'performance', label: 'Performance', labelFr: 'Performance', desc: 'Silent Protocol, 3x clean, improvise, proclaim yourself a musician' },
];

export const PROTOCOLS = {
  silentProtocol: {
    label: 'Silent Protocol',
    desc: 'Perform 3x without a single mistake. Practice before bed for best neuropathways. Visualize a perfect, easy stage performance before sleep.',
  },
  gimmeABuzz: {
    label: 'Protocol #1: Gimme a Buzz',
    desc: 'Proper fretting. Buzz is information. Listen to what the string tells you about your finger pressure and placement.',
  },
  fingerStylePluck: {
    label: 'Protocol #2: Finger-style Pluck & Release',
    desc: 'Pluck and release. Rest vs. free stroke. The hand must be relaxed. Tension is the enemy of tone.',
  },
};

export const STUDIO_RESOURCES = [
  { label: 'Interval Song Chart (Ear Master)', url: 'https://www.earmaster.com/products/free-tools/interval-song-chart-generator.html', desc: 'Hear intervals using songs you already know.' },
  { label: 'Cymatics: Sound Patterns', url: null, desc: 'Visual proof that frequency creates geometry — the physical basis of Pythagorean ratios.' },
  { label: 'Vertiscales (Fretboard Maps)', url: null, desc: 'Bertrand\'s original vertical scale worksheets — see scales as columns, not lines.' },
  { label: 'CAGED System Intro', url: null, desc: 'Bertrand\'s visual guide to the CAGED chord shape system.' },
  { label: 'Movable 1-2 Scale', url: null, desc: 'Moveable scale shapes that work in any key.' },
  { label: 'Harmony Grid Notes', url: null, desc: 'Map out song structures and chord relationships.' },
];

export const C_SCALE_CHAPTERS = [
  {
    id: 'chapter-1',
    key: 'ch1',
    title: 'The Supporting Beams (1-3-5)',
    subtitle: 'Protein, Greens, and Starch',
    desc: 'Do not just scale. Learn the supporting beams of Western Harmony.',
    icon: Music,
    color: '#4A90D9',
    ratio: '1:1',
    bePhase: {
      title: 'The Foundation of Harmony',
      content: 'The 1-3-5 are the supporting beams of Western Harmony. Most people know the 1-3-5 because they are doing chords. We are meeting you where you are. This is your protein, your greens, and your starch — there is no flavor yet, but it is the core of everything we do. From this basic triad, we increase complexity at the student\'s pace.',
      action: 'Visualize placing the 1, 3, and 5 together. Hear the fundamental triad in your inner ear.',
      audioSnippet: '/assets/audio/bertrand_supporting_beams.mp3'
    },
    deepDive: 'A triad is three notes stacked in thirds. The Root (1) gives the chord its name. The Major 3rd (3) gives it its emotional color — bright, happy, resolved. The Perfect 5th (5) gives it stability and power. Together, these three notes form the skeleton of every major chord you will ever play. Bertrand calls this your "protein, greens, and starch" — the nutritional base of all harmony. The Pythagorean ratio 1:1 represents the root as the fundamental frequency — everything else is measured against it.',
    practiceTips: [
      'Play C, E, G slowly. Listen to how each note adds a new color to the sound.',
      'Try playing them in different orders: 1-3-5, 1-5-3, 3-5-1. Notice how the emotion changes.',
      'Sing the root while playing the 3rd and 5th above it. Feel the harmony in your body.'
    ],
    commonMistakes: [
      'Rushing through the notes without listening to how they blend together.',
      'Pressing too hard — let the strings ring, do not strangle them.',
      'Skipping the audiation step. Always hear the chord in your head before you play it.'
    ],
    practicePlan: 'Spend 5 minutes daily playing the 1-3-5 in different positions on the neck. Close your eyes and identify each note by feel, not by looking.',
    doPhase: {
      instruction: 'Play the Root (1), Major 3rd (3), and Perfect 5th (5) to establish the structure.',
      type: 'sequence',
      targetSequence: [48, 52, 55] // C3, E3, G3
    },
    truebadourPrompt: "The user is exploring the foundational 1-3-5 triad. Emphasize that these are the supporting beams of harmony. Ask them to audiate the chord and tell you: what is the color of this chord?",
    pillar: 'theory',
    protocol: 'gimmeABuzz'
  },
  {
    id: 'chapter-2',
    key: 'ch2',
    title: 'Music By Numbers',
    subtitle: 'The Hook',
    desc: 'Bypass the pompous dogma. Numbers teach you music immediately.',
    icon: Zap,
    color: '#6B6BD9',
    ratio: '9:8',
    bePhase: {
      title: 'Geometric Meaning',
      content: 'There is no mythology here. There is no pompous academic dogma. If we assign numbers to the scale, you can make music right now. If C is 1, D is 2, E is 3... you already know millions of songs.',
      action: 'Close your eyes. Hear the relationship between the 1st note and the 5th note.',
      audioSnippet: '/assets/audio/bertrand_music_by_numbers.mp3'
    },
    deepDive: 'The Nashville Number System is used by professional studio musicians worldwide. Instead of reading chord names (C, F, G), they read numbers (1, 4, 5). This lets a musician transpose to any key instantly — if the singer needs a lower key, you just think in numbers and play in the new key. The Pythagorean ratio 9:8 represents a whole step (Major 2nd), the distance between C and D.',
    practiceTips: [
      'Pick a simple song you know by heart. Figure out the numbers. Play it in C.',
      'Now play the same numbers starting on a different root. Notice how the song stays the same.',
      'Practice calling out numbers while someone else plays. Train your ear to hear function, not just pitch.'
    ],
    commonMistakes: [
      'Confusing scale numbers with fret numbers. Scale numbers refer to positions in the scale, not frets.',
      'Forgetting that 8 is the octave — same note as 1, just higher.',
      'Trying to memorize note names instead of relationships. The power is in the numbers.'
    ],
    practicePlan: 'Learn one new song per week using only numbers. Write the numbers down, then play in 3 different keys.',
    doPhase: {
      instruction: 'Play the sequence: 1, 5, 4, 3, 2, 8, 5 (The Star Wars Theme).',
      type: 'sequence',
      targetSequence: [48, 55, 53, 52, 50, 60, 55] // C G F E D C(octave) G
    },
    truebadourPrompt: "The user just played the Star Wars theme using numbers. Validate how empowering it is to bypass academic dogma and play real music instantly.",
    pillar: 'theory'
  },
  {
    id: 'chapter-3',
    key: 'ch3',
    title: 'The Pothole',
    subtitle: 'The G-to-B Warp',
    desc: 'The geometry breaks here to allow chord shapes.',
    icon: TriangleAlert,
    color: '#9B59D9',
    ratio: '81:64',
    bePhase: {
      title: 'The Anomaly in the Matrix',
      content: 'You must understand the structure of your instrument. Between the G and B strings, the interval shrinks to a Major 3rd. It is a pothole. We need to compensate for that hole. If you forget it, your patterns break.',
      action: 'Visualize the 4th fret on the G string matching the open B string. This is the glitch.',
      audioSnippet: '/assets/audio/bertrand_the_pothole.mp3'
    },
    deepDive: 'Standard guitar tuning is E-A-D-G-B-E. Five of the six string pairs are tuned in Perfect 4ths (5 semitones). But the G-to-B pair is a Major 3rd (4 semitones). This was done so that full six-string chords are easier to finger. The trade-off: any scale pattern that crosses the G-B boundary must shift up one fret. This is the single most important structural fact about the guitar fretboard. The Pythagorean ratio 81:64 is the Major 3rd — the same interval that creates this pothole.',
    practiceTips: [
      'Play any scale pattern slowly. When you cross from G to B, say out loud: "shift up one."',
      'Practice the same lick entirely below the G string, then entirely above the B string. Feel the difference.',
      'Use the Fretboard Explorer to visualize the gap. It never goes away.'
    ],
    commonMistakes: [
      'Forgetting the shift and playing the pattern wrong. It will sound off — trust your ear.',
      'Trying to avoid crossing strings. You must cross — it is the nature of the instrument.',
      'Memorizing patterns visually without understanding why the shift happens.'
    ],
    practicePlan: 'Daily: play the C scale across all 6 strings, saying "shift" each time you cross G-to-B. 10 repetitions.',
    doPhase: {
      instruction: 'Play Fret 4 on the G string. Then play the Open B string. Listen to the matching frequencies.',
      type: 'match-unison',
      targetPairs: [{ lowerStr: 3, fret: 4, upperStr: 2 }]
    }
  },
  {
    id: 'chapter-4',
    key: 'ch4',
    title: 'The 7th',
    subtitle: 'Adding the Flavor',
    desc: 'Sprinkle the 7th. Taste the tension.',
    icon: Sun,
    color: '#D959B5',
    ratio: '243:128',
    bePhase: {
      title: 'Sprinkle the Flavor',
      content: 'You have your protein, greens, and starch (1-3-5). But what if we sprinkle the 7? You have to taste it. Allow sound to make an impression on you. The 7th begs to resolve to the root.',
      action: 'Play the 7th in your mind. Feel the tension. Now let it resolve.',
      audioSnippet: '/assets/audio/bertrand_sprinkle_the_flavor.mp3'
    },
    deepDive: 'The Major 7th is the most expressive note in the scale. It creates tension because it is only a half-step below the root — it wants to resolve. In jazz, the Major 7th chord (Cmaj7) is the sound of sophistication and longing. In pop, it adds color to an otherwise plain major chord. Bertrand recommends using the Ear Master interval song chart to connect this interval to songs you already know. The Pythagorean ratio 243:128 is the Major 7th — the most complex ratio in the scale, which is why it sounds the most tense and yearning.',
    practiceTips: [
      'Play a C major chord, then add B. Hear how the chord changes from "happy" to "wistful."',
      'Play B alone, let it ring, then play C. Feel the gravitational pull.',
      'Try the same with the minor 7th (Bb). Notice how different the emotion becomes — bluesy instead of longing.'
    ],
    commonMistakes: [
      'Rushing past the tension. Sit with the 7th. Let it hang. That discomfort is the point.',
      'Confusing Major 7th with the dominant 7th (flat 7). They are completely different emotions.',
      'Not resolving. The 7th is a question — the root is the answer.'
    ],
    practicePlan: 'Daily: play the 1-3-5-7 arpeggio slowly. Hold the 7th for 2 beats, then resolve to the root. Listen for the story.',
    doPhase: {
      instruction: 'Play B (The 7th), let it hang for a second, then play C (The Root) to resolve.',
      type: 'sequence',
      targetSequence: [59, 60] // B3, C4
    },
    truebadourPrompt: "The user is exploring the Major 7th (B) resolving to the Root (C). Ask them: What is the story of this tension? What is the color of the sky if this interval was a movie scene?",
    pillar: 'ear'
  },
  {
    id: 'chapter-5',
    key: 'ch5',
    title: 'The Open Strings',
    subtitle: 'The Void & The Physical Box',
    desc: 'Breathe. Feel the instrument. Do not force anything yet.',
    icon: Activity,
    color: '#D9596B',
    ratio: '2:1',
    bePhase: {
      title: 'The Body is the First Instrument',
      content: 'Before you can tune the strings, you must tune yourself. Notice any tension in your shoulders, your jaw, your breath. The open strings represent the un-fretted void. Understand standard tuning: E, A, D, G, B, E.',
      action: 'Close your eyes. Take a deep breath. Picture the 6 strings vibrating freely.',
      audioSnippet: '/assets/audio/bertrand_body_first_instrument.mp3'
    },
    deepDive: 'Standard tuning from low to high is E2-A2-D3-G3-B3-E4. Each string is named after its open note. The Pythagorean ratio 2:1 is the octave — the most fundamental relationship in music. When you play an open string and then fret the 12th fret, you hear the same note doubled in frequency. This is the foundation of all fretboard geometry. Bertrand teaches that the guitar and voice should be integrated — the guitar becomes your voice coach, and your voice becomes your guitar instructor. Sing each open string as you play it to build this connection.',
    practiceTips: [
      'Play each open string slowly. Say its name out loud: "E, A, D, G, B, E."',
      'Notice the physical sensation of each string — the low E vibrates in your chest, the high E in your face.',
      'With eyes closed, have a friend play a random open string. Identify it by feel and sound.'
    ],
    commonMistakes: [
      'Playing with tense shoulders. Stop. Shake them out. Start again.',
      'Not breathing. Holding breath while playing creates tension everywhere.',
      'Skipping the body scan. Your body is the resonator — if it is tight, the sound is tight.'
    ],
    practicePlan: 'Before every practice session: 2 minutes of body scan (shoulders, jaw, breath), then play all 6 open strings slowly with full attention.',
    pillar: 'body',
    doPhase: {
      instruction: 'Play all 6 open strings, one by one. Maintain completely relaxed shoulders.',
      type: 'open-strings'
    }
  },
  {
    id: 'chapter-6',
    key: 'ch6',
    title: 'The 5th Fret Unison',
    subtitle: 'The Tuning Anchor',
    desc: 'The guitar is a relative instrument. Anchor the 5th fret.',
    icon: Compass,
    color: '#D96B59',
    ratio: '4:3',
    bePhase: {
      title: 'The Perfect 4th Overlap',
      content: 'Standard tuning is mostly in Perfect 4ths. This means that pressing the 5th fret of the Low E string creates the exact same pitch as the open A string below it. Visualize this geometric relationship.',
      action: 'Imagine pressing the 5th fret on the thickest string. Hear the pitch in your head. Now imagine the next string ringing openly. They are the same.',
      audioSnippet: '/assets/audio/bertrand_tuning_anchor.mp3'
    },
    deepDive: 'The 5th fret unison is how guitarists tune by ear. Because five of the six string pairs are Perfect 4ths apart, the 5th fret of each string matches the next open string. The exception is G-to-B, where the 4th fret (not 5th) matches. The Pythagorean ratio 4:3 is the Perfect 4th — the interval that defines the guitar\'s tuning geometry. Bertrand uses his "Vertiscales" worksheets to visualize these vertical relationships on the fretboard.',
    practiceTips: [
      'Play the 5th fret on low E, then the open A. They should sound identical. Listen for beats if they are slightly off.',
      'Tune your entire guitar using only this method. Do not use a tuner.',
      'Play harmonics at the 5th fret and 7th fret of adjacent strings. They should ring in unison.'
    ],
    commonMistakes: [
      'Forgetting the G-B exception. The 4th fret on G matches open B, not the 5th.',
      'Pressing too hard on the 5th fret, which bends the pitch sharp.',
      'Not listening for beats. If you hear a wobble, the notes are not matched.'
    ],
    practicePlan: 'Tune your guitar by ear daily before using a tuner to check. Goal: get within 5 cents of correct on every string.',
    doPhase: {
      instruction: 'Play Fret 5 on the Low E string, then play the Open A string. Listen to the unison.',
      type: 'match-unison',
      targetPairs: [{ lowerStr: 6, fret: 5, upperStr: 5 }]
    }
  },
  {
    id: 'chapter-7',
    key: 'ch7',
    title: 'The Root Note (C)',
    subtitle: 'Establishing Home Base',
    desc: 'Find the gravitational center of the C Scale.',
    icon: Focus,
    color: '#D99B59',
    ratio: '1:1',
    bePhase: {
      title: 'The Foundation of Harmony',
      content: 'The Root is "home". Every other note pushes or pulls towards the root. On the guitar, C is located on the 3rd Fret of the A string. This is our anchor for everything that follows.',
      action: 'Sing a strong, grounded note. Call it "C". Now visualize your finger landing on the 3rd fret of the A string.',
      audioSnippet: '/assets/audio/bertrand_root_note.mp3'
    },
    deepDive: 'The root note is the gravitational center of the scale. Every other note in the C major scale (D, E, F, G, A, B) has a relationship to C — some stable (G the 5th, E the 3rd), some tense (B the 7th, F the 4th). Finding C on the A string 3rd fret is your home base. From here, you can map the entire fretboard. The Pythagorean ratio 1:1 — the root is the reference frequency from which all other ratios are derived.',
    practiceTips: [
      'Find C on every string. There are at least 5 different C notes on the fretboard within reach.',
      'Play C, then close your eyes. Find it again by feel.',
      'Sing C before you play it. If your voice finds it, your fingers will follow.'
    ],
    commonMistakes: [
      'Not anchoring to the root. Without a home base, every note feels lost.',
      'Looking at the fretboard instead of feeling it. Trust your hand.',
      'Playing C too quietly. The root deserves authority — play it with confidence.'
    ],
    practicePlan: 'Daily: find C on 3 different strings and 3 different frets. Play each one and confirm by ear that it is the same note.',
    doPhase: {
      instruction: 'Play the C on the A string, Fret 3. Let it ring out.',
      type: 'find-note',
      targetMidi: 48 // C3
    },
    truebadourPrompt: "The user is finding the Root note C. Encourage them to feel grounded. Explain that this is the center of gravity, the home base for all other notes.",
    pillar: 'fretboard',
    droneConfig: { fretId: 1 }
  },
  {
    id: 'chapter-8',
    key: 'ch8',
    title: 'The Whole Step',
    subtitle: 'Moving from C to D',
    desc: 'Two frets equal one whole step.',
    icon: Eye,
    color: '#D9C959',
    ratio: '9:8',
    bePhase: {
      title: 'The Diatonic Measurement',
      content: 'A "Whole Step" is simply two frets on the guitar. To get from C (1) to D (2), we move up exactly one whole step.',
      action: 'Visualize the space of two frets on the A string. Hear the Root, then hear the note a whole step higher in your mind.',
      audioSnippet: '/assets/audio/bertrand_whole_step.mp3'
    },
    deepDive: 'The C Major scale has a specific pattern of whole steps (W) and half steps (H): W-W-H-W-W-W-H. This pattern is what makes it "major." Every major scale in every key follows this same pattern. On the guitar, a whole step = 2 frets, a half step = 1 fret. The Pythagorean ratio 9:8 is the whole step — the distance between C and D, or any two adjacent scale tones separated by a whole step.',
    practiceTips: [
      'Play C to D slowly. Then play D to E. Both are whole steps. Feel the consistency.',
      'Now play E to F. That is a half step — only 1 fret. Feel the difference.',
      'Say the pattern out loud as you play: "whole, whole, half, whole, whole, whole, half."'
    ],
    commonMistakes: [
      'Confusing whole steps and half steps. Half steps happen between E-F and B-C only in major scales.',
      'Sliding instead of lifting. For scale practice, lift and place — do not slide.',
      'Not memorizing the W-W-H-W-W-W-H pattern. It is the DNA of all major scales.'
    ],
    practicePlan: 'Daily: play the C major scale slowly while saying each interval (whole or half) out loud. 5 repetitions.',
    doPhase: {
      instruction: 'Play C (A string, Fret 3), then slide up to play D (A string, Fret 5).',
      type: 'sequence',
      targetSequence: [48, 50] // C3, D3
    }
  },
  {
    id: 'chapter-9',
    key: 'ch9',
    title: 'The 1-4-44 Stack',
    subtitle: 'The Vertical Geometry',
    desc: 'The Perfect 4th sits directly above the root.',
    icon: Layers,
    color: '#B5D959',
    ratio: '4:3',
    bePhase: {
      title: 'The Power of the 4th',
      content: 'Because the strings are tuned in 4ths, the note directly "above" the root (on the same fret, higher pitched string) is the Perfect 4th. C is on the A string. Directly above it on the D string is F.',
      action: 'Imagine placing your finger flat across two strings at the 3rd fret. You are pressing C and F simultaneously.',
      audioSnippet: '/assets/audio/bertrand_vertical_geometry.mp3'
    },
    deepDive: 'The Perfect 4th is the most geometrically powerful interval on the guitar because the instrument is tuned in 4ths. This means that any note played on a given fret has its Perfect 4th directly above it on the next string (same fret). The exception: crossing from G to B, where you must shift up one fret. Bertrand calls these vertical relationships "Vertiscales" — his original term for seeing scales as vertical columns rather than horizontal lines. The Pythagorean ratio 4:3 is the Perfect 4th — the inversion of the Perfect 5th (3:2). Together, 4:3 and 3:2 define the geometry of the fretboard.',
    practiceTips: [
      'Play C on the A string 3rd fret. Without moving your finger horizontally, play the D string 3rd fret. That is F — your Perfect 4th.',
      'Now do the same from F to Bb. Same geometry, different starting point.',
      'Practice barre chords: press two strings at the same fret. You are playing a root and a 4th.'
    ],
    commonMistakes: [
      'Forgetting the G-B shift. The 4th above G is C, but it is on the 5th fret of the G string, not the 3rd.',
      'Moving your hand to find the 4th. It is directly above — same fret, next string.',
      'Not hearing the relationship. The 4th sounds suspended, like it wants to resolve somewhere.'
    ],
    practicePlan: 'Daily: find the 4th of every note in the C scale using the vertical geometry. 5 minutes.',
    doPhase: {
      instruction: 'Play C (A string, Fret 3), then immediately play F (D string, Fret 3).',
      type: 'sequence',
      targetSequence: [48, 53] // C3, F3
    }
  },
  {
    id: 'chapter-10',
    key: 'ch10',
    title: 'The Major 3rd (E)',
    subtitle: 'The Color of Brightness',
    desc: 'The interval that defines Major chords.',
    icon: Sun,
    color: '#59D96B',
    ratio: '81:64',
    bePhase: {
      title: 'The Emotional Pivot',
      content: 'The Major 3rd dictates whether a chord sounds happy (major) or sad (minor). From C, a whole step up from D brings us to E. You can find E on the D string, 2nd Fret. Notice the diagonal relationship to the root.',
      action: 'Audiate the brightness of a major third. Hum "Root... Third".',
      audioSnippet: '/assets/audio/bertrand_major_third.mp3'
    },
    deepDive: 'The Major 3rd is the defining interval of major tonality. Lower it by one fret (a half step) and it becomes a minor 3rd — the sound of sadness, blues, and introspection. This single semitone change is the most emotionally significant move in all of Western music. Bertrand combines ear training with interval recognition games — using songs you already know to identify intervals instantly. The Pythagorean ratio 81:64 is the Major 3rd — a complex ratio that produces the bright, open sound we associate with happiness and resolution.',
    practiceTips: [
      'Play C and E together (major). Then play C and Eb together (minor). Feel the emotional shift.',
      'Find E on every string. It is the 3rd of C — your emotional color note.',
      'Play a C major chord, then change just the 3rd to Eb. You just made C minor. One note, new world.'
    ],
    commonMistakes: [
      'Not noticing the diagonal. E is not directly above C — it is one fret back. This is because of the pothole.',
      'Confusing Major 3rd with Perfect 4th. The 3rd is emotional, the 4th is structural.',
      'Playing the 3rd too quietly. It is the color — let it sing.'
    ],
    practicePlan: 'Daily: play major and minor triads back to back. Focus on the emotional difference. 5 minutes.',
    doPhase: {
      instruction: 'Play C (A string, Fret 3), then play E (D string, Fret 2). Hear the brightness.',
      type: 'sequence',
      targetSequence: [48, 52] // C3, E3
    },
    truebadourPrompt: "The user is exploring the Major 3rd (E). Emphasize the emotional quality of this interval. It is the color of brightness and the defining interval of major chords.",
    pillar: 'ear',
    droneConfig: { fretId: 5 }
  },
  {
    id: 'chapter-11',
    key: 'ch11',
    title: 'The Full Octave Map',
    subtitle: 'Navigating Frets 0-5',
    desc: 'Connect all the pieces into one continuous scale.',
    icon: Orbit,
    color: '#59D9B5',
    ratio: '2:1',
    bePhase: {
      title: 'The Diatonic Network',
      content: 'The C Major Scale is completely laid out across the first five frets of your guitar. There are no sharps and no flats. Just pure diatonic movement.',
      action: 'Visualize the full grid from low E to high E. Your fingers know where to go.',
      audioSnippet: '/assets/audio/bertrand_diatonic_map.mp3'
    },
    deepDive: 'The C Major scale is the only major scale with no sharps or flats: C-D-E-F-G-A-B-C. Across frets 0-5, every note is available on every string. This makes C Major the perfect key for learning the fretboard. Once you can see the map in C, you can transpose it to any key by shifting the pattern. The Pythagorean ratio 2:1 is the octave — the scale spans exactly one octave from C to the next C.',
    practiceTips: [
      'Play the scale ascending: C-D-E-F-G-A-B-C. Then descending: C-B-A-G-F-E-D-C.',
      'Play it on one string only. Then on two strings. Then across all six.',
      'Close your eyes and play it. If you get lost, find C and start again.'
    ],
    commonMistakes: [
      'Playing too fast. Speed comes later. Accuracy and tone first.',
      'Not using all fingers. Each finger owns a fret in the 0-5 position.',
      'Forgetting the G-B shift when crossing strings. Always adjust.'
    ],
    practicePlan: 'Daily: play the C major scale 5 times ascending, 5 times descending, 5 times with eyes closed. Track your accuracy.',
    doPhase: {
      instruction: 'Play any 5 notes in the C Major scale to prove you know the map.',
      type: 'scale-hunt',
      requiredCount: 5,
      validMidis: [40, 41, 43, 45, 47, 48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67] // E2 to G4 in C major
    }
  },
  {
    id: 'chapter-12',
    key: 'ch12',
    title: 'The CAGED Seed',
    subtitle: 'The System Unlocked',
    desc: 'See the fractal nature of the fretboard.',
    icon: Sparkles,
    color: '#59C9D9',
    ratio: '3:2',
    bePhase: {
      title: 'Transposition',
      content: 'The shape you just played for C Major can be slid up the neck. To do this, your index finger must act as the "nut" of the guitar (a barre chord). This is the secret of the CAGED system.',
      action: 'Visualize taking the open C shape, shifting it two frets up, and barring the 2nd fret. You just played a D Major chord.',
      audioSnippet: '/assets/audio/bertrand_caged_seed.mp3'
    },
    deepDive: 'CAGED is an acronym for five open chord shapes: C, A, G, E, D. Each shape can be barred and moved up the neck to create the same chord type in a different key. The C shape barred at fret 2 gives you D major. Barred at fret 4 gives you E major. This is the fractal nature of the fretboard — the same geometry repeats at every fret. Bertrand teaches CAGED as the gateway to transposition — once you see the shapes, you can play in any key. The Pythagorean ratio 3:2 is the Perfect 5th — the interval that connects the C and G shapes in the CAGED system.',
    practiceTips: [
      'Play an open C chord. Now barre fret 2 and play the same shape. You just played D.',
      'Find all 5 CAGED shapes for C major. They are scattered across the neck.',
      'Play the same chord using 3 different shapes. Same notes, different voicings.'
    ],
    commonMistakes: [
      'Not pressing hard enough on the barre. The barre must be clean — check each string rings.',
      'Forgetting which shape you are in. Name the shape before you play it.',
      'Avoiding barre chords because they are hard. They are hard because you avoid them.'
    ],
    practicePlan: 'Daily: practice one CAGED shape per day (5-day cycle). Barre at frets 2, 5, 7, 10. Build finger strength gradually.',
    doPhase: {
      instruction: 'Play a C chord. You have completed the C Scale journey.',
      type: 'triad',
      targetSequence: [48, 52, 55, 60, 64] // Basic C chord notes (C3, E3, G3, C4, E4)
    }
  }
];
