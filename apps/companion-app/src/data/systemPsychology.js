// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : systemPsychology.js                                  ║
// ║ WHAT    : PEARL psychological engineering — the WHY behind   ║
// ║           every pedagogical choice in the platform          ║
// ║ WHY     : The AI must understand the psychological model to   ║
// ║           coach students, explain to investors, and debug   ║
// ║ OWNS    : Monomyth, protocols, archetypes, polarity, anti-  ║
// ║           patterns                                            ║
// ║ NEEDS   : Nothing — pure data module                          ║
// ║ RULES   : Every pedagogical claim must map to a code file   ║
// ║ FIX AT  : If psychology seems wrong, check the design doc at ║
// ║           research/10_MASTER_DESIGN_DOC.md                    ║
// ║ STAGE   : IMPLEMENT                                          ║
// ╚═══════════════════════════════════════════════════════════════╝

export const PSYCHOLOGICAL_ENGINEERING = {
  framework: 'PEARL (Psychological Engineering through Archetypal Role-Playing & Learning)',
  designer: 'Joshua Atkinson built this platform using psychological engineering principles.',
  thesis: 'The course is psychological transformation disguised as music education.',

  monomyth: {
    title: 'The Chromatic Monomyth',
    description: "Joseph Campbell's Hero's Journey mapped to 12 musical intervals. Each fret is a psychological stage.",
    stages: {
      1: {
        stage: 'Call to Adventure',
        question: 'Am I safe here?',
        fear: 'I might fail',
        breakthrough: 'Ventral vagal activation',
        tool: 'BreathingGate',
        protocol: 'SHEARL',
      },
      2: {
        stage: 'Refusal of the Call',
        question: 'Can I commit?',
        fear: "I don't have time",
        breakthrough: 'Time reframed as ally',
        tool: 'PracticeTimer',
        protocol: 'SHEARL',
      },
      3: {
        stage: 'Meeting the Mentor',
        question: 'Can I hear myself?',
        fear: 'I am tone deaf',
        breakthrough: 'The ear IS the teacher',
        tool: 'PitchRoom',
        protocol: 'PLING',
      },
      4: {
        stage: 'Crossing the Threshold',
        question: 'Can I surrender to time?',
        fear: 'I have no rhythm',
        breakthrough: 'Metronome is mirror',
        tool: 'Metronome',
        protocol: 'SHEARL',
      },
      5: {
        stage: 'Tests, Allies, Enemies',
        question: 'How do notes relate?',
        fear: 'Theory is too hard',
        breakthrough: 'G/B anomaly = map lies',
        tool: 'IntervalVisualizer',
        protocol: 'SHEARL',
      },
      6: {
        stage: 'Approach to Inmost Cave',
        question: 'Can I face the whole neck?',
        fear: 'Too many notes',
        breakthrough: 'CAGED = 5 shapes, one truth',
        tool: 'FretboardExplorer',
        protocol: 'SHEARL',
      },
      7: {
        stage: 'The Ordeal',
        question: 'Can I sing and play?',
        fear: 'My voice is bad',
        breakthrough: 'Voice and string are one',
        tool: 'PlingTrainer',
        protocol: 'PLING',
      },
      8: {
        stage: 'The Reward',
        question: 'How precise am I really?',
        fear: 'Close enough is fine',
        breakthrough: 'Sub-cent = intentional expression',
        tool: 'MicrotonalTracker',
        protocol: 'FHEAL',
      },
      9: {
        stage: 'The Road Back',
        question: 'Can I explore freely?',
        fear: 'I will get lost',
        breakthrough: 'Every note is a friend',
        tool: 'PlayableGuitar',
        protocol: 'SHEARL',
      },
      10: {
        stage: 'The Resurrection',
        question: 'Can I be seen?',
        fear: 'I sound bad recorded',
        breakthrough: 'Accountability to art',
        tool: 'PracticeRecorder',
        protocol: 'FHEAL',
      },
      11: {
        stage: 'Return with Elixir',
        question: 'Can I see the whole?',
        fear: '12 keys is too many',
        breakthrough: 'Keys are rooms in one house',
        tool: 'MultiKeyHub',
        protocol: 'FHEAL',
      },
      12: {
        stage: 'Master of Two Worlds',
        question: 'Can I play free?',
        fear: 'I need rules',
        breakthrough: 'Inner critic is silent',
        tool: 'RhythmEngine',
        protocol: 'FHEAL',
      },
    },
  },

  protocols: {
    SHEARL: {
      name: 'SHEARL',
      copyright: true,
      fullName: 'See / Hear / Feel',
      phase: 'BE (imagination)',
      purpose: 'Perceive pattern before placing fingers. Theory becomes Touch.',
      psychology: 'Activates prefrontal pattern-recognition BEFORE motor execution. Prevents mindless drilling.',
      tools: ['BreathingGate', 'PracticeTimer', 'IntervalVisualizer', 'FretboardExplorer', 'PlayableGuitar'],
      mantra: 'See the pattern. Hear the sound. Feel the shape. Then move.',
    },
    PLING: {
      name: 'PLING!',
      copyright: true,
      fullName: 'Sing Before You Play',
      phase: 'DO (audiation)',
      purpose: 'Vocal-motor integration. Voice leads fingers.',
      psychology: 'Hardwires vocal tract to motor cortex. Forces internal hearing before external execution.',
      tools: ['PitchRoom', 'PlingTrainer'],
      mantra: 'Sing the note. Find it on the guitar. The voice and string are one instrument.',
    },
    FHEAL: {
      name: 'FHEAL',
      copyright: true,
      fullName: 'Free Expression / Healing',
      phase: 'PLAY (expression)',
      purpose: 'Bypass inner critic. Creative impulse flows to instrument.',
      psychology: 'Deactivates analytical interference (prefrontal cortex inhibition). Where improvisation lives.',
      tools: ['MicrotonalTracker', 'PracticeRecorder', 'MultiKeyHub', 'RhythmEngine', 'SongwritingCompanion'],
      mantra: 'No wrong notes. Only the next note. Play free.',
    },
  },

  archetypes: {
    Storyteller: {
      protocol: 'FHEAL',
      psychology: 'Narrative cognition. Learns through story, lyric, emotional resonance.',
      coachingStyle: 'Poetic metaphor, story arcs, feeling-first. Ask "What feeling wants expression?"',
      danger: 'May avoid technical practice. Needs gentle structure.',
      color: '#d4783c',
      icon: 'scroll',
    },
    Craftsman: {
      protocol: 'SHEARL',
      psychology: 'Kinesthetic intelligence. Learns through hands, body, careful repetition.',
      coachingStyle: 'Concrete steps, body awareness, slow practice. Ask "What does my body already know?"',
      danger: 'May grind too hard. Needs permission to rest.',
      color: '#4a7eb5',
      icon: 'hammer',
    },
    Ear: {
      protocol: 'PLING',
      psychology: 'Auditory intelligence. Inner ear leads the way.',
      coachingStyle: 'Singing prompts, inner hearing, sound-first. Ask "Can you hear this before playing?"',
      danger: 'May neglect visual fretboard. Needs spatial grounding.',
      color: '#4a9e6e',
      icon: 'ear',
    },
    Seeker: {
      protocol: 'All three',
      psychology: 'Theoretical curiosity. Pattern and meaning draw deeper.',
      coachingStyle: 'Socratic questions, connections, why-framing. Ask "Why does this interval feel this way?"',
      danger: 'May over-intellectualize. Needs somatic grounding.',
      color: '#c4a43c',
      icon: 'compass',
    },
  },

  somaticPolarity: {
    Yin: {
      frets: [2, 4, 7, 9, 11],
      intervals: ['Minor 2nd', 'Minor 3rd', 'Tritone', 'Minor 6th', 'Minor 7th'],
      psychology: 'Introspective, emotional, questioning. Student turns inward.',
      coaching: 'Soft, contemplative, somatic. Ask what they FEEL. Value silence and pause.',
      examples: {
        2: 'Minor 2nd: Tense, questioning, yearning. The smallest step asks the biggest question.',
        4: 'Minor 3rd: Melancholic, deep, emotional. Evening light. Longing without destination.',
        7: 'Tritone: Crisis, tension, breakthrough. The devil interval. The moment everything changes.',
        9: 'Minor 6th: Nostalgic, distant, longing. Memory made audible.',
        11: 'Minor 7th: Winding, unresolved, coming back. Almost home, but not quite.',
      },
    },
    Yang: {
      frets: [3, 5, 10],
      intervals: ['Major 2nd', 'Major 3rd', 'Major 6th'],
      psychology: 'Active, directive, forward-moving. Student acts outward.',
      coaching: 'Energetic, specific instructions. Challenge them. Celebrate accuracy enthusiastically.',
      examples: {
        3: 'Major 2nd: Moving forward, hopeful. The journey begins with a single whole step.',
        5: 'Major 3rd: Bright, happy, resolved. The first chord you loved. Joy made physical.',
        10: 'Major 6th: Uplifting, aspiring, reaching. Hope that stretches toward the sky.',
      },
    },
    Balanced: {
      frets: [1, 6, 8, 12],
      intervals: ['Root', 'Perfect 4th', 'Perfect 5th', 'Major 7th / Octave'],
      psychology: 'Equilibrium, structural, mathematical. Student sees the architecture.',
      coaching: 'Socratic, neutral, architectural questions. Focus on intervals and symmetry.',
      examples: {
        1: 'Root: Grounded, stable, open. "I am here." The foundation of everything.',
        6: 'Perfect 4th: Open, suspended, searching. The question that feels like an answer.',
        8: 'Perfect 5th: Strong, stable, powerful. The power chord. Grounded authority.',
        12: 'Major 7th / Octave: Leading, expectant, arrival. The return home. Completion.',
      },
    },
  },

  antiPatterns: {
    description: 'What the platform AVOIDS because it triggers psychological harm in adult learners',
    never: [
      { pattern: 'Speed metrics or leaderboards', harm: 'comparison anxiety', why: 'Adults already compare themselves. Platform must be sanctuary.' },
      { pattern: 'Punitive streaks', harm: 'shame spirals', why: 'Missing one day should not feel like failure. Consistency is the goal, not perfection.' },
      { pattern: 'Progress bars that feel like a race', harm: 'impatience', why: 'The Slow Web Mandate. Progress must feel like growth, not a deadline.' },
      { pattern: 'Visible scores during FHEAL phase', harm: 're-engages inner critic', why: 'FHEAL specifically deactivates analytical brain. A score ruins it.' },
      { pattern: 'Complex theory before physical experience', harm: 'intellectual bypass', why: 'Theory is a map, not the territory. Play first, name later.' },
      { pattern: '"Wrong" feedback', harm: 'performance anxiety', why: 'Reframe or suggest. Never say "that is wrong." The body is learning, not failing.' },
      { pattern: 'Equipment recommendations before basic setup', harm: 'consumerism as avoidance', why: 'Buying gear feels like progress. It is not. The guitar they have is enough.' },
    ],
  },

  studentProfile: {
    targetAge: '30-65',
    priorExperience: 'Most have tried and stopped. Not lack of talent — wrong system.',
    commonFears: [
      'Fear of sounding bad, especially in front of others',
      'Impatience with their own hands — gap between intention and execution feels like failure',
      'Fragmented time — 10 minutes before dinner, 20 minutes on weekend',
      'Inner critic dominance — analytical mind interrupts creative one',
    ],
    whatWorks: [
      'Start with somatic safety, not technique',
      'Measure by presence and breath, not speed',
      'Theory as discovery, not prerequisite',
      'Internalize before externalize',
      'Scales as spatial stories, not drills',
    ],
  },
};

// ═══════════════════════════════════════════════════════════
// CONVENIENCE: Get a fret's full psychological context
// ═══════════════════════════════════════════════════════════

export function getFretPsychology(fretNum) {
  const pe = PSYCHOLOGICAL_ENGINEERING;
  const stage = pe.monomyth.stages[fretNum];
  if (!stage) return null;

  const polarityEntry = Object.entries(pe.somaticPolarity).find(([, p]) =>
    p.frets.includes(Number(fretNum))
  );
  const polarityName = polarityEntry ? polarityEntry[0] : 'Balanced';
  const polarityData = polarityEntry ? polarityEntry[1] : pe.somaticPolarity.Balanced;
  const polarityExample = polarityData.examples[fretNum] || '';

  const protocol = pe.protocols[stage.protocol];

  return {
    fret: fretNum,
    stage: stage.stage,
    question: stage.question,
    fear: stage.fear,
    breakthrough: stage.breakthrough,
    tool: stage.tool,
    protocol: stage.protocol,
    protocolFullName: protocol?.fullName || '',
    protocolPurpose: protocol?.purpose || '',
    polarity: polarityName,
    polarityPsychology: polarityData.psychology,
    polarityCoaching: polarityData.coaching,
    polarityExample,
  };
}

// ═══════════════════════════════════════════════════════════
// CONVENIENCE: Get archetype info for AI prompt injection
// ═══════════════════════════════════════════════════════════

export function getArchetypePrompt(archetypeName) {
  const archetype = PSYCHOLOGICAL_ENGINEERING.archetypes[archetypeName];
  if (!archetype) return '';
  return `${archetypeName}: ${archetype.psychology}. Coaching style: ${archetype.coachingStyle}. Watch for: ${archetype.danger}`;
}
