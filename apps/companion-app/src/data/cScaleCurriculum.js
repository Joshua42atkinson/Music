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

export const C_SCALE_CHAPTERS = [
  {
    id: 'chapter-1',
    key: 'ch1',
    title: 'The Supporting Beams (1-3-5)',
    subtitle: 'Protein, Greens, and Starch',
    desc: 'Do not just scale. Learn the supporting beams of Western Harmony.',
    icon: Music,
    color: '#3498db',
    bePhase: {
      title: 'The Foundation of Harmony',
      content: 'The 1-3-5 are the supporting beams of Western Harmony. Most people know the 1-3-5 because they are doing chords. We are meeting you where you are. This is your protein, your greens, and your starch — there is no flavor yet, but it is the core of everything we do. From this basic triad, we increase complexity at the student\'s pace.',
      action: 'Visualize placing the 1, 3, and 5 together. Hear the fundamental triad in your inner ear.',
      audioSnippet: '/assets/audio/bertrand_supporting_beams.mp3'
    },
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
    color: '#f1c40f',
    bePhase: {
      title: 'Geometric Meaning',
      content: 'There is no mythology here. There is no pompous academic dogma. If we assign numbers to the scale, you can make music right now. If C is 1, D is 2, E is 3... you already know millions of songs.',
      action: 'Close your eyes. Hear the relationship between the 1st note and the 5th note.',
      audioSnippet: '/assets/audio/bertrand_music_by_numbers.mp3'
    },
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
    color: '#e74c3c',
    bePhase: {
      title: 'The Anomaly in the Matrix',
      content: 'You must understand the structure of your instrument. Between the G and B strings, the interval shrinks to a Major 3rd. It is a pothole. We need to compensate for that hole. If you forget it, your patterns break.',
      action: 'Visualize the 4th fret on the G string matching the open B string. This is the glitch.',
      audioSnippet: '/assets/audio/bertrand_the_pothole.mp3'
    },
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
    color: '#9b59b6',
    bePhase: {
      title: 'Sprinkle the Flavor',
      content: 'You have your protein, greens, and starch (1-3-5). But what if we sprinkle the 7? You have to taste it. Allow sound to make an impression on you. The 7th begs to resolve to the root.',
      action: 'Play the 7th in your mind. Feel the tension. Now let it resolve.',
      audioSnippet: '/assets/audio/bertrand_sprinkle_the_flavor.mp3'
    },
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
    color: '#e74c3c',
    bePhase: {
      title: 'The Body is the First Instrument',
      content: 'Before you can tune the strings, you must tune yourself. Notice any tension in your shoulders, your jaw, your breath. The open strings represent the un-fretted void. Understand standard tuning: E, A, D, G, B, E.',
      action: 'Close your eyes. Take a deep breath. Picture the 6 strings vibrating freely.',
      audioSnippet: '/assets/audio/bertrand_body_first_instrument.mp3'
    },
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
    color: '#3498db',
    bePhase: {
      title: 'The Perfect 4th Overlap',
      content: 'Standard tuning is mostly in Perfect 4ths. This means that pressing the 5th fret of the Low E string creates the exact same pitch as the open A string below it. Visualize this geometric relationship.',
      action: 'Imagine pressing the 5th fret on the thickest string. Hear the pitch in your head. Now imagine the next string ringing openly. They are the same.',
      audioSnippet: '/assets/audio/bertrand_tuning_anchor.mp3'
    },
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
    color: '#e74c3c',
    bePhase: {
      title: 'The Foundation of Harmony',
      content: 'The Root is "home". Every other note pushes or pulls towards the root. On the guitar, C is located on the 3rd Fret of the A string. This is our anchor for everything that follows.',
      action: 'Sing a strong, grounded note. Call it "C". Now visualize your finger landing on the 3rd fret of the A string.',
      audioSnippet: '/assets/audio/bertrand_root_note.mp3'
    },
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
    color: '#2ecc71',
    bePhase: {
      title: 'The Diatonic Measurement',
      content: 'A "Whole Step" is simply two frets on the guitar. To get from C (1) to D (2), we move up exactly one whole step.',
      action: 'Visualize the space of two frets on the A string. Hear the Root, then hear the note a whole step higher in your mind.'
    },
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
    color: '#9b59b6',
    bePhase: {
      title: 'The Power of the 4th',
      content: 'Because the strings are tuned in 4ths, the note directly "above" the root (on the same fret, higher pitched string) is the Perfect 4th. C is on the A string. Directly above it on the D string is F.',
      action: 'Imagine placing your finger flat across two strings at the 3rd fret. You are pressing C and F simultaneously.'
    },
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
    color: '#f1c40f',
    bePhase: {
      title: 'The Emotional Pivot',
      content: 'The Major 3rd dictates whether a chord sounds happy (major) or sad (minor). From C, a whole step up from D brings us to E. You can find E on the D string, 2nd Fret. Notice the diagonal relationship to the root.',
      action: 'Audiate the brightness of a major third. Hum "Root... Third".',
      audioSnippet: '/assets/audio/bertrand_major_third.mp3'
    },
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
    color: '#1abc9c',
    bePhase: {
      title: 'The Diatonic Network',
      content: 'The C Major Scale is completely laid out across the first five frets of your guitar. There are no sharps and no flats. Just pure diatonic movement.',
      action: 'Visualize the full grid from low E to high E. Your fingers know where to go.',
      audioSnippet: '/assets/audio/bertrand_diatonic_map.mp3'
    },
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
    color: '#f39c12',
    bePhase: {
      title: 'Transposition',
      content: 'The shape you just played for C Major can be slid up the neck. To do this, your index finger must act as the "nut" of the guitar (a barre chord). This is the secret of the CAGED system.',
      action: 'Visualize taking the open C shape, shifting it two frets up, and barring the 2nd fret. You just played a D Major chord.',
      audioSnippet: '/assets/audio/bertrand_caged_seed.mp3'
    },
    doPhase: {
      instruction: 'Play a C chord. You have completed the C Scale journey.',
      type: 'triad',
      targetSequence: [48, 52, 55, 60, 64] // Basic C chord notes (C3, E3, G3, C4, E4)
    }
  }
];
