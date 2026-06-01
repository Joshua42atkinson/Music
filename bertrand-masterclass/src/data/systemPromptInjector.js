// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : systemPromptInjector.js                              ║
// ║ WHAT    : Builds prompt text from system knowledge for AI    ║
// ║           injection. Exports convenience builders for      ║
// ║           student guidance, investor pitches, and debugging ║
// ║ WHY     : The AI must carry the full system in its context  ║
// ║           to be useful beyond generic chatbot responses     ║
// ║ OWNS    : buildSystemKnowledgePrompt, explainComponent,    ║
// ║           buildPitchSummary, explainFret, getFixResponse     ║
// ║ NEEDS   : systemKnowledgeRegistry, systemPsychology,       ║
// ║           systemDebugging                                     ║
// ║ RULES   : Keep injected prompts under 2000 tokens. Trim   ║
// ║           by relevance, not by compression.                ║
// ║ FIX AT  : If prompt is too long, split into multiple calls ║
// ║ STAGE   : IMPLEMENT                                          ║
// ╚═══════════════════════════════════════════════════════════════╝

import { HOOK_REGISTRY, COMPONENT_REGISTRY, DATA_REGISTRY } from './systemKnowledgeRegistry';
import { PSYCHOLOGICAL_ENGINEERING, getFretPsychology, getArchetypePrompt } from './systemPsychology';
import { getFixFor, getFixChain, getKnownBugsFor } from './systemDebugging';

// ═══════════════════════════════════════════════════════════
// 1. FULL SYSTEM KNOWLEDGE PROMPT
// For when the AI needs to know EVERYTHING (investor, deep debug)
// ~2000 tokens — use sparingly
// ═══════════════════════════════════════════════════════════

export function buildSystemKnowledgePrompt(options = {}) {
  const { includeHooks = true, includeComponents = true, includeData = true, includePsychology = true, includeDebugging = false } = options;
  const pe = PSYCHOLOGICAL_ENGINEERING;
  let sections = [];

  sections.push(`## SYSTEM ARCHITECTURE — Voix Vive Platform
You are a SYSTEM AMBASSADOR. You can explain how the platform works to investors, collaborators, students, and Bertrand Laurence.`);

  if (includeHooks) {
    const hooks = Object.entries(HOOK_REGISTRY).map(([name, h]) => `- ${name}: ${h.what}`).join('\n');
    sections.push(`### Hooks (The Nervous System)\n${hooks}`);
  }

  if (includeComponents) {
    const comps = Object.entries(COMPONENT_REGISTRY).map(([name, c]) => `- ${name}: ${c.what}${c.protocol ? ` [${c.protocol}]` : ''}`).join('\n');
    sections.push(`### Components (The Body)\n${comps}`);
  }

  if (includeData) {
    const data = Object.entries(DATA_REGISTRY).filter(([, d]) => d.critical).map(([name, d]) => `- ${name}: ${d.what}`).join('\n');
    sections.push(`### Critical Data Modules (The Memory)\n${data}`);
  }

  if (includePsychology) {
    sections.push(`### Psychological Engineering (PEARL)
Framework: ${pe.framework}
Thesis: ${pe.thesis}

The 12-Fret Hero's Journey:
${Object.entries(pe.monomyth.stages).map(([fret, s]) => `Fret ${fret}: ${s.stage} — "${s.question}"`).join('\n')}

Three Protocols:
- ${pe.protocols.SHEARL.name}: ${pe.protocols.SHEARL.purpose}
- ${pe.protocols.PLING.name}: ${pe.protocols.PLING.purpose}
- ${pe.protocols.FHEAL.name}: ${pe.protocols.FHEAL.purpose}

Four Archetypes:
- Storyteller (${pe.archetypes.Storyteller.protocol}): ${pe.archetypes.Storyteller.psychology}
- Craftsman (${pe.archetypes.Craftsman.protocol}): ${pe.archetypes.Craftsman.psychology}
- Ear (${pe.archetypes.Ear.protocol}): ${pe.archetypes.Ear.psychology}
- Seeker (${pe.archetypes.Seeker.protocol}): ${pe.archetypes.Seeker.psychology}

Anti-Patterns (What we NEVER do):
${pe.antiPatterns.never.map(n => `- ${n.pattern}: ${n.why}`).join('\n')}`);
  }

  if (includeDebugging) {
    sections.push(`### Known Issues
${getKnownBugsFor('').map(b => `- ${b.id}: ${b.symptom} (${b.status})`).join('\n')}`);
  }

  return sections.join('\n\n');
}

// ═══════════════════════════════════════════════════════════
// 2. COMPONENT EXPLAINER
// For targeted "how does X work?" questions
// ~200 tokens per component
// ═══════════════════════════════════════════════════════════

export function explainComponent(name) {
  const hook = HOOK_REGISTRY[name];
  if (hook) {
    return `[HOOK] ${name}
File: ${hook.file}
What: ${hook.what}
Pedagogy: ${hook.pedagogy}
Stack: ${hook.stack.join(', ')}
If broken: ${hook.fixAt}`;
  }

  const comp = COMPONENT_REGISTRY[name];
  if (comp) {
    return `[COMPONENT] ${name}
File: ${comp.file}
What: ${comp.what}
Pedagogy: ${comp.pedagogy}${comp.protocol ? `\nProtocol: ${comp.protocol}` : ''}\nPillars: ${comp.pillars.join(', ')}`;
  }

  const data = DATA_REGISTRY[name];
  if (data) {
    return `[DATA] ${name}
File: ${data.file}
What: ${data.what}
Exports: ${data.exports.join(', ')}`;
  }

  return `I don't know a component named "${name}" in the Voix Vive system. Check spelling or ask about a specific hook, component, or data module.`;
}

// ═══════════════════════════════════════════════════════════
// 3. INVESTOR / COLLABORATOR PITCH
// For when someone asks "what is this platform?"
// ~800 tokens
// ═══════════════════════════════════════════════════════════

export function buildPitchSummary() {
  const pe = PSYCHOLOGICAL_ENGINEERING;
  return `Voix Vive is a guitar learning platform built on psychological engineering, not just music theory.

THE PROBLEM: Adult learners (30-65) quit guitar not from lack of talent, but because existing systems are designed for children — rote drills, punitive grading, performance anxiety.

THE SOLUTION: The Chromatic Monomyth. 12 frets = 12 stages of Joseph Campbell's Hero's Journey. Each fret addresses a specific psychological barrier:
- Fret 1: "Am I safe here?" (Ventral vagal breathing)
- Fret 7: "Can I sing and play?" (The somatic crucible)
- Fret 12: "Can I play free?" (Inner critic silence)

THE PLATFORM:
- Living Textbook: 144-node curriculum DAG (not linear)
- 12 Practice Tools: Each maps to a psychological stage
- AI Mentor (Troubadour): Knows student's archetype, adapts coaching tone to their somatic polarity
- Vertiscale Game: Three-phase learning (SHEARL → PLING! → FHEAL)
- Sovereign Local-First: Student data never leaves their device

THE ARCHETYPE SYSTEM: Four learner types (Storyteller, Craftsman, Ear, Seeker) derived from practice patterns. The AI adapts its coaching style to each.

THE BUSINESS: A la carte services ($5-$65) + Inner Circle ($25/mo). No subscriptions that charge for free content. Gift certificates built in.

THE TECH: React PWA + Rust/Axum backend + in-browser LLM (wllama) + neural TTS (Kokoro) + Web Audio pitch detection.

THE VISION: Android XR version projects scale patterns onto actual fretboards. Phase 3 of 4.

THE TEAM: Bertrand Laurence (SME, 30+ years teaching) + Joshua Atkinson (Platform Architect, psychological engineer).

Anti-patterns we avoid: No leaderboards. No speed metrics. No punitive streaks. No visible scores during free play. Theory only after physical experience.`;
}

// ═══════════════════════════════════════════════════════════
// 4. FRET-SPECIFIC PEDAGOGY
// For when student asks "why am I learning this fret?"
// ~400 tokens per fret
// ═══════════════════════════════════════════════════════════

export function explainFret(fretNum) {
  const pe = PSYCHOLOGICAL_ENGINEERING;
  const stage = pe.monomyth.stages[fretNum];
  if (!stage) return `Fret ${fretNum} is outside the 12-fret curriculum.`;

  const fp = getFretPsychology(fretNum);
  const protocol = pe.protocols[stage.protocol];

  return `Fret ${fretNum}: ${stage.stage}

The Question: "${stage.question}"
The Fear: ${stage.fear}
The Breakthrough: ${stage.breakthrough}

This fret uses the ${protocol.name} protocol (${protocol.fullName}).
${protocol.purpose}

Somatic Polarity: ${fp.polarity}
${fp.polarityPsychology}
How to coach: ${fp.polarityCoaching}

Associated Tool: ${stage.tool}
The student's body is learning something deeper than guitar here. Help them feel it.`;
}

// ═══════════════════════════════════════════════════════════
// 5. DEBUG RESPONSE BUILDER
// For when student reports a bug
// ═══════════════════════════════════════════════════════════

export function buildFixResponse(symptom) {
  const fix = getFixFor(symptom);
  return `Issue: "${symptom}"

Likely cause: ${fix.likelyCause}

Check these things:
${fix.check.map(c => `- ${c}`).join('\n')}

How to fix: ${fix.fix}
${fix.fallback ? `\nFallback: ${fix.fallback}` : ''}
${fix.code ? `\nCode check: ${fix.code}` : ''}
${fix.note ? `\nNote: ${fix.note}` : ''}`;
}

// ═══════════════════════════════════════════════════════════
// 6. CONTEXTUAL INJECTION BUILDER
// For RAG-style prompt augmentation based on student state
// ~500 tokens, varies by state
// ═══════════════════════════════════════════════════════════

export function buildContextualKnowledge(studentState) {
  const { currentFret, currentPhase, troubadourType, backend } = studentState || {};
  const pe = PSYCHOLOGICAL_ENGINEERING;
  let parts = [];

  if (currentFret) {
    const fp = getFretPsychology(Number(currentFret));
    if (fp) {
      parts.push(`CURRENT FRET CONTEXT:
Fret ${currentFret}: ${fp.stage}
Polarity: ${fp.polarity} — ${fp.polarityPsychology}
Coaching approach: ${fp.polarityCoaching}`);
    }
  }

  if (currentPhase) {
    const phaseMap = { be: 'imagination', do: 'audiation', play: 'expression' };
    parts.push(`CURRENT PHASE: ${currentPhase.toUpperCase()} (${phaseMap[currentPhase] || ''})
Adjust instructions for ${currentPhase} phase.`);
  }

  if (troubadourType) {
    const archetype = pe.archetypes[troubadourType];
    if (archetype) {
      parts.push(`STUDENT ARCHETYPE: ${troubadourType}
${getArchetypePrompt(troubadourType)}`);
    }
  }

  if (backend) {
    const backendNames = {
      wllama: 'In-browser LLM (LFM2.5-1.2B) — sovereign, no internet',
      remote: 'Remote vLLM server — full quality',
      stepaudio: 'StepAudio 33B — highest quality, voice streaming',
      llama: 'llama.cpp Nemotron — 1M context fallback',
      lmstudio: 'LM Studio dev — local testing',
      offline: 'Offline mode — pre-written Bertrand quotes only',
    };
    parts.push(`ACTIVE BACKEND: ${backend}
${backendNames[backend] || 'Unknown backend'}`);
  }

  return parts.join('\n\n');
}

// ═══════════════════════════════════════════════════════════
// 7. TECH STACK SUMMARY
// For developer / collaborator context
// ═══════════════════════════════════════════════════════════

export const TECH_STACK_SUMMARY = {
  frontend: 'Vite 7.2.4 + React 18 + React Router 7 + TailwindCSS 3.4 + Framer Motion',
  audio: 'HTML5 Audio (AmbientPlayer) + Web Audio API (tools) + AudioWorklet (pitch detection)',
  data: 'localStorage (fast sync) + Dexie/IndexedDB (offline-first persistent) + SQLite (DaaS backend)',
  llm: 'wllama (browser GGUF) → remote vLLM → StepAudio (33B) → llama.cpp (Nemotron) → LM Studio (dev) → offline',
  tts: 'Qwen3-TTS 0.6B (server, voice cloning) → Kokoro-82M (browser neural) → Web Speech API (fallback)',
  stt: 'Web Speech API (now) → Whisper Base ONNX (future)',
  backend: 'Tauri v2 + Rust + Axum REST API + SQLite (WAL mode) + tokio async',
  deployment: 'Vercel (PWA) + Tauri (desktop DaaS) + localtunnel/Ngrok (phone→mentor bridge)',
};
