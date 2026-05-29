// ═══════════════════════════════════════════════════════════
// TROUBADOUR OFFLINE — Static prompt library
// When all AI backends are offline, the Troubadour still speaks.
// These are pre-written responses from Bertrand's actual pedagogy.
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
];

// Fallback for unmatched input
export const OFFLINE_FALLBACK = 'I am resting now, but the teaching is always here. Try the PracticeJournal for a guided session, or explore the next unlocked fret in your workbook. Every note is a step. Over.';

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
