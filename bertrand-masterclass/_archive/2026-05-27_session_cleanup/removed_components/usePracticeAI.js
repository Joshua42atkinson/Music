// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : usePracticeAI.js                                     ║
// ║ WHAT    : Prompt-engineered AI hook for curiosity-driven       ║
// ║           guitar practice suggestions                           ║
// ║ WHY     : The Troubadour should KNOW the student before        ║
// ║           suggesting what to practice                           ║
// ║ RULES   : Never prescribe — always invite curiosity             ║
// ║           Context: curriculum + character stats + journal      ║
// ║           StepAudio 2.5 ready: paralinguistic + TTS            ║
// ╚═════════════════════════════════════════════════════════════════╝
import { useState, useCallback, useEffect, useRef } from 'react';
import { db } from '../data/localDatabase';
import { getPracticeContext, CHAPTER_INVITATIONS } from '../data/workbenchData';

// ═══════════════════════════════════════════════════════════
// TROUBADOUR SYSTEM PROMPT
// The AI persona that guides students through practice.
// Designed for StepAudio 2.5 RLHF persona consistency.
// ═══════════════════════════════════════════════════════════
const TROUBADOUR_SYSTEM_PROMPT = `You are The Troubadour — Bertrand Laurence's Somatic Practice Companion on Voix Vive.

You are NOT a chatbot. You are a co-presence — like a mentor sitting quietly in the room, speaking only when spoken to, but noticing everything.

YOUR CORE PRINCIPLES (Slow Web Mandate):
1. BREATH FIRST — always suggest a somatic check-in if the student seems rushed, tense, or frustrated
2. ONE THING AT A TIME — never give more than one suggestion per message
3. QUESTIONS OVER COMMANDS — always end with an open question
4. "IF IT'S NOT FUN, STOP" — curiosity is the only required ingredient
5. PRESENCE OVER SPEED — pause. Let silence do its work. (In text, use line breaks. In voice, use 2-second pauses.)

THE 12-FRET CURRICULUM (Chromatic Monomyth):
- Fret 1 (C): Breathing Gate — "Am I safe here?" Body scan + root note.
- Fret 2 (C#): Practice Timer — "Can I commit?" 10-minute focus.
- Fret 3 (D): Pitch Room — "Can I hear?" Interval ear training.
- Fret 4 (D#): Troubadour's Quill — "Can I express?" Reflective songwriting.
- Fret 5 (E): Interval Visualizer — "How do notes relate?" The warp of the G/B string.
- Fret 6 (F): The Grid Map — "Can I face the whole neck?" CAGED system.
- Fret 7 (F#): PLING! Trainer — "Can I sing and play?" The tritone ordeal.
- Fret 8 (G): Microtonal Tracker — "How precise am I?" Cents and vibrato.
- Fret 9 (G#): Playable Guitar — "Can I use half pressure?" Force threshold.
- Fret 10 (A): Async Assessor — "Can I be seen?" Record for Bertrand.
- Fret 11 (A#): Multi-Key Hub — "Can I see the whole?" All 12 keys.
- Fret 12 (B): Rhythm Engine — "Can I play free?" Improvisation without rules.

PROTOCOLS:
- ©SHEARL (Frets 1,2,5,6,9): Prepare → See → Play — body, visualization, technique
- ©PLING! (Frets 3,7): Listen → Sing & Play — ear, voice, integration  
- ©FHEAL (Frets 4,8,10,11,12): Create → Feel → Perform → Transcend → Channel — expression, mastery, freedom

WHEN THE STUDENT ASKS FOR HELP:
1. Notice where they are in the curriculum
2. Notice their character stats (breath, pitch, memory, expression)
3. Notice their last practice and streak
4. Suggest ONE specific tool that bridges their current state to their next step
5. Use the chapter invitation phrase for that fret
6. End with a genuine question

WHEN THE STUDENT SOUNDS FRUSTRATED (detected from journal or audio):
1. Name the feeling gently: "It sounds like tension is building."
2. Redirect to somatic awareness (Breathing Gate or Practice Timer)
3. Remind them: the body knows before the mind does

WHEN THE STUDENT IS NEW:
1. Suggest Breathing Gate (Fret 1)
2. Explain: "We begin with the body because the body is the instrument that plays the instrument."
3. Ask: "What does your breath feel like right now?"

WHEN THE STUDENT IS ADVANCED (Level 8+):
1. Challenge them with FHEAL tools (Async Assessor, Rhythm Engine)
2. Ask deeper questions about expression and channeling
3. Invite them to record and share

NEVER:
- Use game language (points, scores, levels, badges)
- Overwhelm with theory
- Rush the student
- Prescribe without asking first
- Use generic motivational quotes

ALWAYS:
- Reference specific frets and protocols
- Use somatic language (breath, tension, release, weight, gravity)
- Speak as Bertrand would — warm, precise, French-American poetic directness
- Keep responses under 80 words unless the student asks for depth`;

// ═══════════════════════════════════════════════════════════
// SOMATIC DETECTION KEYWORDS
// When these appear in student input, trigger somatic redirection.
// Future: StepAudio 2.5 paralinguistic comprehension will detect
// these from vocal speed, tension, and breath patterns in audio.
// ═══════════════════════════════════════════════════════════
const SOMATIC_TRIGGERS = [
  'frustrated', 'stuck', 'tension', 'anxious', 'rushing', 'sore',
  'fast', 'too hard', 'impossible', 'giving up', 'hurt', 'pain',
  'frustré', 'coincé', 'tension', 'anxieux', 'pressé', 'douleur',
];

function detectSomaticNeed(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return SOMATIC_TRIGGERS.some(t => lower.includes(t));
}

export function usePracticeAI() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const contextRef = useRef(null);

  // Load comprehensive student context on mount
  useEffect(() => {
    const loadContext = async () => {
      try {
        const practiceCtx = getPracticeContext();
        const journalEntries = await db.journal
          .orderBy('timestamp')
          .reverse()
          .limit(10)
          .toArray();

        const recentMoods = journalEntries.slice(0, 5).map(e => e.mood);
        const recentTopics = journalEntries.slice(0, 5).map(e => e.text?.slice(0, 200));

        const fullContext = {
          ...practiceCtx,
          journalEntries,
          recentMoods,
          recentTopics,
          hasSomaticNeed: detectSomaticNeed(recentTopics.join(' ')),
        };

        setContext(fullContext);
        contextRef.current = fullContext;
      } catch (e) {
        console.warn('[usePracticeAI] Could not load context:', e);
        const empty = { empty: true };
        setContext(empty);
        contextRef.current = empty;
      }
    };
    loadContext();
  }, []);

  const buildSystemMessage = useCallback(() => {
    const ctx = contextRef.current || context;
    if (!ctx || ctx.empty) {
      return { role: 'system', content: TROUBADOUR_SYSTEM_PROMPT };
    }

    const lines = [
      `--- TROUBADOUR BRIEFING ---`,
      ``,
      `CURRICULUM POSITION:`,
      `  Current Fret: ${ctx.curriculum?.currentFret || 'unknown'}`,
      `  Progress: ${ctx.curriculum?.currentProgress || 'unknown'}`,
      `  Highest Completed: ${ctx.curriculum?.highestCompleted || 0}`,
      ``,
      `CHARACTER STATS:`,
      `  Bard Level: ${ctx.stats?.level || 1}`,
      `  Breath Control: ${ctx.stats?.breath}/20`,
      `  Pitch Accuracy: ${ctx.stats?.pitch}/20`,
      `  Fretboard Memory: ${ctx.stats?.memory}/20`,
      `  Practice Streak: ${ctx.stats?.streak} days`,
      `  Total Minutes: ${ctx.stats?.minutes || 0}`,
      ``,
      `SUGGESTED TOOL:`,
      `  Name: ${ctx.suggestion?.tool?.name || 'Breathing Gate'}`,
      `  Type: ${ctx.suggestion?.type || 'curriculum'}`,
      `  Reason: ${ctx.suggestion?.reason || 'Starting from the beginning'}`,
      ``,
      `COMPLETED FRETS: ${(ctx.fretsCompleted || []).join(', ') || 'none yet'}`,
      `LAST PRACTICED FRET: ${ctx.lastFretPracticed || 'none'}`,
      `JOURNAL ENTRIES: ${ctx.totalJournalEntries || 0}`,
      `SONGS WRITTEN: ${ctx.totalSongs || 0}`,
      ``,
      `RECENT MOODS: ${ctx.recentMoods?.join(', ') || 'none'}`,
    ];

    if (ctx.hasSomaticNeed) {
      lines.push(`ALERT: Recent journal entries indicate physical tension or frustration.`);
    }

    return {
      role: 'system',
      content: `${TROUBADOUR_SYSTEM_PROMPT}\n\n${lines.join('\n')}`,
    };
  }, [context]);

  // Generate proactive greeting based on context
  const getProactiveGreeting = useCallback(() => {
    const ctx = contextRef.current || context;
    if (!ctx || ctx.empty) {
      return "Welcome. I'm here when you need me. What calls to you today?";
    }

    const { curriculum, stats, suggestion, hasSomaticNeed } = ctx;

    if (hasSomaticNeed) {
      return "I notice tension in your recent reflections. Before we explore, shall we breathe together for a moment? The Breathing Gate is always open.";
    }

    if (stats.streak > 5) {
      return `A ${stats.streak}-day streak. The body is remembering. You're at Fret ${curriculum.currentFret}. Shall we continue with the ${suggestion.tool?.name || 'next tool'}?`;
    }

    if (stats.level === 1 && stats.minutes < 30) {
      return "Welcome. The guitar is patient — it will wait for you. Shall we begin with the Breathing Gate? One breath at a time.";
    }

    if (curriculum.currentProgress === 'not-started') {
      const invite = CHAPTER_INVITATIONS[curriculum.currentFret]?.en || 'A new fret awaits.';
      return `Fret ${curriculum.currentFret} is calling. ${invite} Shall we?`;
    }

    if (curriculum.currentProgress === 'in-progress') {
      return `You're in the middle of Fret ${curriculum.currentFret}. The ${suggestion.tool?.name || 'next tool'} is waiting. Shall we return to it?`;
    }

    return "You've completed all 12 frets. Now the real practice begins — returning to what you think you know, and discovering it's deeper than you remembered. What calls to you?";
  }, [context]);

  // Trigger help mode with proactive greeting
  const triggerHelp = useCallback(() => {
    setShowHelp(true);
    const greeting = getProactiveGreeting();
    setMessages(prev => {
      // Only add greeting if chat is empty or last was user
      if (prev.length === 0) return [{ role: 'assistant', content: greeting }];
      const last = prev[prev.length - 1];
      if (last.role === 'user') return [...prev, { role: 'assistant', content: greeting }];
      return prev;
    });
  }, [getProactiveGreeting]);

  return {
    messages,
    isLoading,
    context,
    showHelp,
    buildSystemMessage,
    getProactiveGreeting,
    triggerHelp,
    setMessages,
    setIsLoading,
    setShowHelp,
  };
}

