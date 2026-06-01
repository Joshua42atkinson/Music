// ═══════════════════════════════════════════════════════════
// TROUBADOUR OFFLINE — Static prompt library
// When all AI backends are offline, the Troubadour still speaks.
// These are pre-written responses from Bertrand's actual pedagogy.
// ═══════════════════════════════════════════════════════════
//
// LAYER 1: WHISPER — The Offline Guru
// Kriya principle: the workbook must work without the guru present.
// Every student gets this. No server, no download, no AI toggle.
// ═══════════════════════════════════════════════════════════

// Pattern: [keyword] → response
// The chat input is matched against keywords. Best match wins.

export const OFFLINE_RESPONSES = [
  {
    keywords: ['hello', 'hi', 'hey', 'bonjour', 'salut'],
    response: 'Welcome, troubadour. I am resting now, but my teaching lives in every slide, every tool, and every breath you take. Pick up the guitar. The first note is always the right one. Over.',
  },
  {
    keywords: ['stuck', 'help', 'confused', 'lost', 'don\'t understand'],
    response: 'When you feel stuck, do not push. Breathe. The body knows the answer before the mind names it. Play one note — any note — and listen to how it dies. That decay is your teacher. Over.',
  },
  {
    keywords: ['practice', 'how long', 'every day', 'schedule', 'routine'],
    response: 'Twenty minutes is enough. Better twenty minutes with attention than two hours with distraction. The body remembers what the mind forgets. Come back tomorrow. Over.',
  },
  {
    keywords: ['pain', 'hurt', 'fingers', 'hand', 'wrist', 'sore'],
    response: 'Pain is a messenger, not an enemy. If your hand hurts, stop. Check your shoulder — tension travels. Shake your hand like a wet dog. The guitar will wait. Your body will not. Over.',
  },
  {
    keywords: ['tension', 'stress', 'anxious', 'nervous', 'tight'],
    response: 'Tension is the enemy of sound. Before you play, stand tall. Inhale for four. Exhale for six. Let your jaw hang open. Now pick up the guitar. You are different now. Over.',
  },
  {
    keywords: ['speed', 'fast', 'slow', 'tempo', 'rush', 'hurry'],
    response: 'Speed is the last thing you need. The metronome is not a race — it is a mirror. Can you play this slowly? Can you play it so slowly that it becomes beautiful? That is the question. Over.',
  },
  {
    keywords: ['barre', 'bar chord', 'f barre', 'b minor'],
    response: 'The barre is not a grip — it is a distribution. The index finger lays flat like a bridge, not presses like a clamp. Roll your finger slightly to the side. Breathe. The string will speak when you stop forcing it. Over.',
  },
  {
    keywords: ['sing', 'voice', 'vocal', 'hum', 'pitch', 'tone deaf'],
    response: 'You are not tone deaf. You have forgotten how to listen. Hum a note — any note — then find it on the guitar. The voice and the fretboard are the same instrument. Your body is the bridge. Over.',
  },
  {
    keywords: ['theory', 'why', 'how does', 'what is', 'explain', 'understand'],
    response: 'Theory is a map, not the territory. The fretboard is the territory. Play first, name later. Pythagoras did not name the octave before he heard it. Your ears are older than your vocabulary. Over.',
  },
  {
    keywords: ['motivation', 'discipline', 'lazy', 'procrastinate', 'can\'t start'],
    response: 'Discipline is a lie told by people who do not love what they do. Do not force yourself to practice. Remember why you picked up the guitar. Was it a song? A feeling? A person? Start there. Over.',
  },
  {
    keywords: ['fret', 'note', 'interval', 'semitone', 'half step', 'whole step'],
    response: 'The fret is a doorway, not a destination. Each fret is a ratio, a relationship, a question. The first fret asks: what is the smallest step? The twelfth fret asks: can you hear yourself coming home? Over.',
  },
  {
    keywords: ['scale', 'major', 'minor', 'pentatonic', 'mode'],
    response: 'A scale is not a pattern to memorize. It is a family of sounds that want to be together. Play the major scale slowly. Listen to which notes pull and which rest. The scale is already singing — you are just joining in. Over.',
  },
  {
    keywords: ['chord', 'strum', 'progression', 'change', 'switch'],
    response: 'The chord change is where music lives. Not in the chord, but in the space between. Can you change from C to G without looking? Not because you are fast — because you have made friends with both shapes. Over.',
  },
  {
    keywords: ['recording', 'hear myself', 'listen back', 'sound bad'],
    response: 'Your playing always sounds worse to you than to anyone else. The recording does not lie — but it also does not judge. Listen once. Note one thing. Change that one thing. Record again. That is the practice. Over.',
  },
  {
    keywords: ['stage fright', 'performance', 'nervous', 'audience', 'play for'],
    response: 'The audience is not listening to you. They are listening to themselves through you. Your job is not to impress. Your job is to be present. The breath before the first note is the performance. Over.',
  },
  {
    keywords: ['bertrand', 'teacher', 'mentor', 'lesson', 'coach'],
    response: 'Bertrand is a mentor, not a judge. He will meet you where you are — not where you think you should be. Book a session when you are ready. Until then, the fretboard is your teacher. Over.',
  },
  {
    keywords: ['thank', 'thanks', 'merci', 'grateful', 'appreciate'],
    response: 'Gratitude is the first note of every song. Thank yourself for showing up today. The guitar does not care if you are perfect. It cares if you are present. Over.',
  },
  {
    keywords: ['goodbye', 'bye', 'au revoir', 'see you', 'later'],
    response: 'The song continues even when you put down the guitar. Listen for it in traffic, in rain, in your own breathing. You are never not practicing. Over.',
  },
  {
    keywords: ['tritone', 'devil', 'diabolus', 'augmented fourth', 'diminished fifth'],
    response: 'The tritone is not the devil. It is the question that refuses to resolve. Play F to B. Let it hang. Feel the itch? That is music asking you to pay attention. The answer is breath. Over.',
  },
  {
    keywords: ['breath', 'breathe', 'relax', 'calm', 'center'],
    response: 'The breath is the metronome beneath the metronome. Before you play, breathe. While you play, breathe. When you stop, breathe. The guitar is an instrument. You are the instrument. Over.',
  },

  // ── Fret-specific prompts (Whisper tier enrichment) ──────────
  // These give the offline Troubadour awareness of the 12-fret journey
  // even without an LLM. Each fret gets a somatic coaching prompt.

  {
    keywords: ['fret 1', 'root note', 'open string', 'foundation', 'beginning', 'start'],
    response: 'The root note is not a place on the neck. It is the place inside you that says "I am here." Play the open low E. Let it vibrate through your body. What does it feel like? Over.',
  },
  {
    keywords: ['fret 2', 'minor 2nd', 'semitone', 'half step', 'awakening'],
    response: 'The smallest step on the guitar is the largest step in music. One fret. C to C#. The world tilts. Play it slowly. Listen to the tension. That is the Minor 2nd — the awakening. Over.',
  },
  {
    keywords: ['fret 3', 'major 2nd', 'whole step', 'whole tone', 'journey'],
    response: 'The Major 2nd is the first step of the journey. C to D. It moves forward. It has hope. Play it and walk. The fretboard is a road. Over.',
  },
  {
    keywords: ['fret 4', 'minor 3rd', 'sad', 'melancholy', 'longing', 'sorrow'],
    response: 'The Minor 3rd is the sound of longing. C to Eb. It is the color of evening light. Play it and feel the melancholy. Do not rush past it. The sadness is the teacher. Over.',
  },
  {
    keywords: ['fret 5', 'major 3rd', 'happy', 'bright', 'joy', 'sunshine'],
    response: 'The Major 3rd is the sound of joy. C to E. It is the first chord you ever loved. Play it and smile. The guitar is smiling with you. Over.',
  },
  {
    keywords: ['fret 6', 'perfect 4th', 'question', 'suspended', 'searching', 'maiden'],
    response: 'The Perfect 4th is a question that hangs in the air. C to F. It does not resolve. It searches. Play it and wait. The answer is coming. But not yet. Over.',
  },
  {
    keywords: ['fret 7', 'tritone', 'ordeal', 'crisis', 'breakthrough', 'devil\'s interval'],
    response: 'Fret 7 is the ordeal. The tritone. C to F#. It is the crisis that makes you or breaks you. Play it. Sit in the discomfort. The breakthrough is on the other side. Over.',
  },
  {
    keywords: ['fret 8', 'perfect 5th', 'power', 'strength', 'stable', 'grounded'],
    response: 'The Perfect 5th is power. C to G. It is the most stable interval after the octave. Play it and feel the ground beneath you. You are standing on something real. Over.',
  },
  {
    keywords: ['fret 9', 'minor 6th', 'memory', 'nostalgia', 'distant', 'far away'],
    response: 'The Minor 6th is the sound of memory. C to Ab. It is the interval of nostalgia — of looking back at something beautiful and far away. Play it. What do you remember? Over.',
  },
  {
    keywords: ['fret 10', 'major 6th', 'hope', 'uplifting', 'aspiring', 'reaching'],
    response: 'The Major 6th is the sound of hope. C to A. It reaches upward without strain. Play it and feel your chest open. The next note is always possible. Over.',
  },
  {
    keywords: ['fret 11', 'minor 7th', 'return', 'winding', 'unresolved', 'coming back'],
    response: 'The Minor 7th is the return that is not yet complete. C to Bb. It is winding, unresolved, coming back but not quite home. Play it and feel the pull. Home is one fret away. Over.',
  },
  {
    keywords: ['fret 12', 'major 7th', 'octave', 'home', 'arrival', 'completion'],
    response: 'The Major 7th is almost home. C to B. One more half step and you arrive at the octave — the same note, transformed. Play it. You have walked the entire chromatic path. Voila. Over.',
  },

  // ── Phase-specific prompts (BE/DO/PLAY awareness) ──────────

  {
    keywords: ['imagine', 'visualize', 'see it', 'picture', 'be phase', 'inner fretboard'],
    response: 'Close your eyes. The Inner Fretboard is not on the guitar — it is in you. See the pattern before you touch the strings. What would be the scene in the movie? Over.',
  },
  {
    keywords: ['hum', 'sing', 'audiate', 'hear it', 'do phase', 'inner ear', 'pling'],
    response: 'Before you play, sing. The voice knows the pitch before the finger finds the fret. Hum the note. Then find it. The ear is the true instrument. Over.',
  },
  {
    keywords: ['play', 'start now', 'do it', 'action', 'play phase', 'fheal', 'free'],
    response: 'Start now. Be active in the process. Do not wait for permission. The guitar will teach you if you listen. Play what you are saying. So it becomes one thing. Over.',
  },
  {
    keywords: ['milestone', 'complete', 'done', 'finished', 'bravo', 'celebrate'],
    response: 'Voila. You have arrived. The interval is conquered. Not because you played it perfectly — because you stayed with it. Breathe. Trust the process. Over.',
  },

  // ── Protocol-specific prompts ────────────────────────────────

  {
    keywords: ['shearl', 'flash', 'imagine mode', 'see hear feel', 'pattern'],
    response: 'SHEARL: See the pattern. Hear the sound. Feel the shape in your hand. The flash will disappear — but the impression remains. Do not guess. Remember. Over.',
  },
  {
    keywords: ['pling', 'sing and play', 'voice and guitar', 'audiate'],
    response: 'PLING: Sing the pitch before you play it. Your voice and the guitar are one instrument. If you can sing it, you can play it. If you cannot sing it, you are not hearing it yet. Over.',
  },
  {
    keywords: ['fheal', 'free playing', 'express', 'no critic', 'creative'],
    response: 'FHEAL: Play without the inner critic. There is no wrong note — only the next note. Express freely. The music is already inside you. Let it out. Over.',
  },
];

// Fallback for unmatched input — fret-aware when possible
export const OFFLINE_FALLBACK = 'I am resting now, but the teaching is always here. Try the PracticeJournal for a guided session, or explore the next unlocked fret in your workbook. Every note is a step. Over.';

/**
 * Get a fret-aware offline prompt when no keyword matches.
 * Uses the student's current fret to give contextual guidance.
 */
export function getFretAwareFallback(currentFret = 1) {
  const fretPrompts = {
    1: 'You are at the Root Note. Play the open low E. Feel it vibrate through your body. The foundation is laid. Over.',
    2: 'You are at the Minor 2nd. The smallest step. Play C then C#. Listen to the tension. The awakening begins. Over.',
    3: 'You are at the Major 2nd. The journey starts. Play C then D. It moves forward. Trust the movement. Over.',
    4: 'You are at the Minor 3rd. The sound of longing. Play C then Eb. Sit with the melancholy. It is teaching you. Over.',
    5: 'You are at the Major 3rd. The sound of joy. Play C then E. The guitar is smiling with you. Over.',
    6: 'You are at the Perfect 4th. The question that hangs. Play C then F. Wait for the answer. It is coming. Over.',
    7: 'You are at the Tritone. The ordeal. Play C then F#. Sit in the discomfort. The breakthrough is near. Over.',
    8: 'You are at the Perfect 5th. Power and stability. Play C then G. Feel the ground beneath you. Over.',
    9: 'You are at the Minor 6th. The sound of memory. Play C then Ab. What do you remember? Over.',
    10: 'You are at the Major 6th. The sound of hope. Play C then A. Your chest opens. The next note is possible. Over.',
    11: 'You are at the Minor 7th. The return. Play C then Bb. Almost home. One fret away. Over.',
    12: 'You are at the Major 7th. Almost the octave. Play C then B. You have walked the entire chromatic path. Voila. Over.',
  };
  return fretPrompts[currentFret] || OFFLINE_FALLBACK;
}

/**
 * Find the best matching offline response for a user message.
 * Returns { matched: boolean, response: string }
 */
export function getOfflineResponse(input) {
  if (!input || typeof input !== 'string') {
    return { matched: false, response: OFFLINE_FALLBACK };
  }

  const lower = input.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of OFFLINE_RESPONSES) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += kw.length; // longer keywords = more specific = higher score
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0) {
    return { matched: true, response: bestMatch.response };
  }

  return { matched: false, response: OFFLINE_FALLBACK };
}
