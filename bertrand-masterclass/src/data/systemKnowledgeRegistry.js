// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : systemKnowledgeRegistry.js                           ║
// ║ WHAT    : Registry of every hook, component, and data module  ║
// ║           in the platform for AI system knowledge             ║
// ║ WHY     : The AI must know what exists to explain/debug/guide ║
// ║ OWNS    : HOOK_REGISTRY, COMPONENT_REGISTRY, DATA_REGISTRY    ║
// ║ NEEDS   : Nothing — pure data module                          ║
// ║ RULES   : Every new file MUST be registered here            ║
// ║ FIX AT  : This file is the source of truth. If wrong, update  ║
// ║           the registry and the actual file.                  ║
// ║ STAGE   : IMPLEMENT                                          ║
// ╚═══════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════
// HOOK REGISTRY — React hooks that power the platform
// ═══════════════════════════════════════════════════════════
export const HOOK_REGISTRY = {
  useTroubadourAI: {
    file: 'src/hooks/useTroubadourAI.js',
    what: 'Unified AI orchestration: 6-tier LLM cascade + 3-tier TTS + voice input.',
    pedagogy: 'The Troubadour is the AI mentor. Routes to best brain (browser→server→offline).',
    stack: ['Souffle(offline)→Voix(wllama)→Chant(remote vLLM/StepAudio/llama.cpp/LM Studio)'],
    fixAt: 'useTroubadourAI.js → useWllamaTroubadour.js → /models/*.gguf',
  },
  useWllamaTroubadour: {
    file: 'src/hooks/useWllamaTroubadour.js',
    what: 'In-browser LLM inference using wllama with LFM2.5-1.2B-Instruct Q4_K_M.',
    pedagogy: 'Sovereign local-first: no internet. Student data never leaves browser.',
    stack: ['WebAssembly GGUF', 'LFM2.5-1.2B-Instruct (Liquid AI)', 'Q4_K_M quantization'],
    fixAt: 'useWllamaTroubadour.js → /public/models/ → wllama library',
  },
  useKokoroTTS: {
    file: 'src/hooks/useKokoroTTS.js',
    what: 'In-browser neural TTS using Kokoro-82M (#1 TTS Arena, 82M params).',
    pedagogy: '"Voix Vive"="Living Voice." Every response spoken aloud. Voice IS product.',
    stack: ['Kokoro-82M ONNX', 'WebGPU or WASM backend', '5 voices (4 EN + 1 FR SIWIS)'],
    fixAt: 'useKokoroTTS.js → kokoro-js → onnxruntime-web',
  },
  useQwenTTS: {
    file: 'src/hooks/useQwenTTS.js',
    what: 'Client for local Qwen3-TTS 0.6B server with voice cloning (10 languages).',
    pedagogy: 'Future: Bertrand voice cloned. Now: high-quality multilingual server TTS.',
    stack: ['Qwen3-TTS 0.6B', 'Voice reference upload', 'OpenAI-compatible /v1/audio/speech API'],
    fixAt: 'useQwenTTS.js → server/tts-server.py → localhost:9999',
  },
  useVoiceInput: {
    file: 'src/hooks/useVoiceInput.js',
    what: 'Hands-free voice input via Web Speech API with FR/EN locale switching.',
    pedagogy: 'Student holds guitar. Voice is only input during play. Cannot type.',
    stack: ['Web Speech API', 'Continuous recognition', 'Locale auto-switch'],
    fixAt: 'useVoiceInput.js → browser SpeechRecognition API → microphone permissions',
  },
  useBackendBridge: {
    file: 'src/hooks/useBackendBridge.js',
    what: 'Manages DaaS (:8080), LM Studio (:1234), StepAudio (:9998) connectivity.',
    pedagogy: 'Bridge connects student device to Bertrand teaching infrastructure.',
    stack: ['Axum REST API', 'Exponential backoff fetch', 'Health check polling'],
    fixAt: 'useBackendBridge.js → DaaS on port 8080 → Rust/Axum backend',
  },
  useDAGProgress: {
    file: 'src/hooks/useDAGProgress.js',
    what: 'React hook for traversing the 144-node 12-fret curriculum DAG.',
    pedagogy: 'Curriculum is a graph, not a line. Nodes unlock by prerequisites, not sequence.',
    stack: ['dagNodes.js', 'dagEdges.js', 'localStorage persistence'],
    fixAt: 'useDAGProgress.js → dagNodes.js → dagEdges.js → tractionStore.js',
  },
  useLocale: {
    file: 'src/hooks/useLocale.js',
    what: 'i18n hook with 500+ FR/EN translations for all UI text.',
    pedagogy: 'Bertrand teaches both languages. Platform must feel native in FR and EN.',
    stack: ['Inline translation object', 'Manual locale switching', 'No external i18n library'],
    fixAt: 'useLocale.js → individual component locale props',
  },
  usePitchDetector: {
    file: 'src/hooks/usePitchDetector.js',
    what: 'Shared mic + autocorrelation pitch detection (Hz, note name, cents deviation).',
    pedagogy: 'Mic is the teacher in PLING! phase. Student must sing before playing.',
    stack: ['AudioWorklet', 'Autocorrelation algorithm', 'Singleton AudioContext pattern'],
    fixAt: 'usePitchDetector.js → audioEngine.js → AudioWorklet processor',
  },
  useMetronome: {
    file: 'src/hooks/useMetronome.js',
    what: 'Precise metronome using Web Audio API (AudioContext scheduling, not setInterval).',
    pedagogy: 'Fret 4: "Can I surrender to time?" Metronome is mirror, not race.',
    stack: ['Web Audio API scheduler', 'Look-ahead timing', 'Visual beat indicator'],
    fixAt: 'useMetronome.js → audioEngine.js → Web Audio clock',
  },
  useFlashTimer: {
    file: 'src/hooks/useFlashTimer.js',
    what: 'Practice timer with flash-card interval display for Vertiscale Phase 1.',
    pedagogy: 'Fret 2: "Can I commit?" Timer reframes time from enemy to ally.',
    stack: ['requestAnimationFrame', 'performance.now()', 'Adaptive flash duration'],
    fixAt: 'useFlashTimer.js → VertiscaleEngine.jsx → scoreCalculator.js',
  },
  useAuth: {
    file: 'src/hooks/useAuth.js',
    what: 'Student auth with 4-digit PIN against local SQLite. Sovereign, no cloud.',
    pedagogy: 'Privacy IS pedagogy. No email. No cloud. Student owns their data.',
    stack: ['localStorage profile', 'SQLite PIN verification', 'Dexie/IndexedDB backup'],
    fixAt: 'useAuth.js → localStorage → localDatabase.js → SQLite (DaaS)',
  },
  useLMStudio: {
    file: 'src/hooks/useLMStudio.js',
    what: 'LM Studio integration for dev fallback (port 1234, Nemotron Super 1M context).',
    pedagogy: 'Development fallback. Not for students. Used for prompt testing.',
    stack: ['OpenAI-compatible API', 'Model discovery', 'Chat completion streaming'],
    fixAt: 'useLMStudio.js → LM Studio desktop app → localhost:1234',
  },
};

// ═══════════════════════════════════════════════════════════
// COMPONENT REGISTRY — UI components and their pedagogical roles
// ═══════════════════════════════════════════════════════════
export const COMPONENT_REGISTRY = {
  TroubadourWidget: {
    file: 'src/components/TroubadourWidget.jsx',
    what: 'Main AI UI panel. Wires all hooks, manages chat/voice, RAG injection.',
    pedagogy: 'Troubadour always available. No navigation. Mentor one tap away.',
    pillars: ['class', 'guitar', 'workbook'],
  },
  TroubadourLoom: {
    file: 'src/components/TroubadourLoom.jsx',
    what: 'AI "weaving" interface showing how responses are constructed from context.',
    pedagogy: 'Transparency builds trust. Student sees which nodes informed the AI.',
    pillars: ['class', 'guitar', 'workbook'],
  },
  AIDeveloperChat: {
    file: 'src/components/AIDeveloperChat.jsx',
    what: 'Developer AI chat for debugging, prompt testing, system admin.',
    pedagogy: 'Not for students. Used by Joshua and Bertrand to test AI.',
    pillars: [],
  },
  SlideViewer: {
    file: 'src/components/SlideViewer.jsx',
    what: 'The Living Textbook. 12-fret curriculum slides with audio and artwork.',
    pedagogy: 'The "Song" pillar. Theoretical foundation for each fret.',
    pillars: ['class'],
  },
  ChromaticMonomyth: {
    file: 'src/components/ChromaticMonomyth.jsx',
    what: 'Visual map of 12-fret Hero Journey showing progress as mythical quest.',
    pedagogy: 'Students see themselves as heroes, not students.',
    pillars: ['class', 'workbook'],
  },
  CurriculumSummary: {
    file: 'src/components/CurriculumSummary.jsx',
    what: 'Dashboard: completed nodes, next recommendations, overall progress.',
    pedagogy: 'Overview without comparison. "You completed 7/144" — not vs others.',
    pillars: ['workbook'],
  },
  BreathingGate: {
    file: 'src/components/BreathingGate.jsx',
    what: 'Fret 1: Somatic entry. 4-7-8 breathing with visual guide.',
    pedagogy: '"Am I safe here?" Ventral vagal activation before guitar.',
    protocol: 'SHEARL',
    pillars: ['guitar'],
  },
  PracticeTimer: {
    file: 'src/components/PracticeTimer.jsx',
    what: 'Fret 2: Commitment ritual. Timer reframes "no time" to "I choose this."',
    pedagogy: '"Can I commit?" Timer is ally, not prison guard.',
    protocol: 'SHEARL',
    pillars: ['guitar'],
  },
  PitchRoom: {
    file: 'src/components/PitchRoom.jsx',
    what: 'Fret 3: Ear awakening. Single-note pitch matching with feedback.',
    pedagogy: '"Can I hear myself?" First true teacher is own ear.',
    protocol: 'PLING',
    pillars: ['guitar'],
  },
  Metronome: {
    file: 'src/components/Metronome.jsx',
    what: 'Fret 4: Time surrender. Visual+audio metronome with subdivisions.',
    pedagogy: '"Can I surrender to time?" Mirror, not race.',
    protocol: 'SHEARL',
    pillars: ['guitar'],
  },
  IntervalVisualizer: {
    file: 'src/components/IntervalVisualizer.jsx',
    what: 'Fret 5: Relationship mapping. Major vs minor interval comparison.',
    pedagogy: '"How do notes relate?" The map lies — learn it anyway.',
    protocol: 'SHEARL',
    pillars: ['guitar'],
  },
  FretboardExplorer: {
    file: 'src/components/FretboardExplorer.jsx',
    what: 'Fret 6: The Grid Map. CAGED visualization across full fretboard.',
    pedagogy: '"Can I face the whole neck?" All six strings at once.',
    protocol: 'SHEARL',
    pillars: ['guitar'],
  },
  PlingTrainer: {
    file: 'src/components/PlingTrainer.jsx',
    what: 'Fret 7: Sing-before-play. Mic gate forces vocal confirmation before tap.',
    pedagogy: '"Can I sing and play?" Mic does not lie. Voice=string.',
    protocol: 'PLING',
    pillars: ['guitar'],
  },
  MicrotonalTracker: {
    file: 'src/components/MicrotonalTracker.jsx',
    what: 'Fret 8: Precision gift. Real-time cents deviation for bends.',
    pedagogy: '"How precise am I really?" Sub-cent reveals invisible.',
    protocol: 'FHEAL',
    pillars: ['guitar'],
  },
  MultiKeyHub: {
    file: 'src/components/MultiKeyHub.jsx',
    what: 'Fret 11: Fluency. See any scale across all 12 keys simultaneously.',
    pedagogy: '"Can I see the whole?" Keys are rooms in one house.',
    protocol: 'FHEAL',
    pillars: ['guitar'],
  },
  RhythmEngine: {
    file: 'src/components/RhythmEngine.jsx',
    what: 'Fret 12: Free improv over backing tracks with invisible tracking.',
    pedagogy: '"Can I play free?" No rules. Inner critic silent.',
    protocol: 'FHEAL',
    pillars: ['guitar'],
  },
  GuitarWorkbench: {
    file: 'src/components/GuitarWorkbench.jsx',
    what: 'Practice dashboard housing all tools, game, and progress.',
    pedagogy: 'The "Guitar" portal. One place for all practice.',
    pillars: ['guitar'],
  },
  PlayerPortal: {
    file: 'src/components/PlayerPortal.jsx',
    what: 'Student landing: profile, streak, bard level, next activity.',
    pedagogy: 'The "Player" portal. Student as character in own story.',
    pillars: ['workbook'],
  },
  PracticeRecorder: {
    file: 'src/components/PracticeRecorder.jsx',
    what: 'Fret 10: Record sessions, send to Bertrand for async review.',
    pedagogy: '"Can I be seen?" Practice visible to another person.',
    protocol: 'FHEAL',
    pillars: ['guitar', 'workbook'],
  },
  CoachingPortal: {
    file: 'src/components/CoachingPortal.jsx',
    what: 'Mentor dashboard for reviewing submissions and giving feedback.',
    pedagogy: 'Bertrand view. Async coaching scales his time.',
    pillars: [],
  },
  MentorDashboard: {
    file: 'src/components/MentorDashboard.jsx',
    what: 'Full mentor analytics: roster, progress, income tracking.',
    pedagogy: 'Business intelligence. Who needs attention? Who thrives?',
    pillars: [],
  },
  Onboarding: {
    file: 'src/components/Onboarding.jsx',
    what: 'New student orientation. PEARL assessment, instrument setup, first breath.',
    pedagogy: 'First impression. Must feel safe, welcoming, unhurried.',
    pillars: ['class', 'workbook'],
  },
  BetaGate: {
    file: 'src/components/BetaGate.jsx',
    what: 'Beta access control. Invitation code or waitlist.',
    pedagogy: 'Exclusivity creates care. Beta students are founding members.',
    pillars: [],
  },
  CharacterSheet: {
    file: 'src/components/CharacterSheet.jsx',
    what: 'D&D-style stats: Breath, Pitch, Rhythm, Memory, Expression (1-20 scale).',
    pedagogy: 'Gamification without competition. Stats describe, not rank.',
    pillars: ['workbook'],
  },
  DigitalBinder: {
    file: 'src/components/DigitalBinder.jsx',
    what: 'Course materials: Vertiscale PDFs, CAGED maps, printables.',
    pedagogy: 'Resources for students who learn through reading.',
    pillars: ['class'],
  },
  Glossary: {
    file: 'src/components/Glossary.jsx',
    what: 'Music theory glossary with fretboard-contextual definitions.',
    pedagogy: 'Theory as discovery, not prerequisite. Context first.',
    pillars: ['class'],
  },
  SongwritingCompanion: {
    file: 'src/components/SongwritingCompanion.jsx',
    what: 'Lyric + chord progression tool with emotional mood mapping.',
    pedagogy: 'FHEAL expression. Students write their own songs.',
    protocol: 'FHEAL',
    pillars: ['workbook'],
  },
  BiometricSanctum: {
    file: 'src/components/BiometricSanctum.jsx',
    what: 'EEG/heart rate visualization (future: real BLE hardware).',
    pedagogy: '"Your nervous system is learning too." Somatic feedback.',
    pillars: ['guitar'],
  },
};

// ═══════════════════════════════════════════════════════════
// DATA MODULE REGISTRY — Pure data and utility modules
// ═══════════════════════════════════════════════════════════
export const DATA_REGISTRY = {
  troubadourPrompt: {
    file: 'src/data/troubadourPrompt.js',
    what: 'Builds DAG-aware system prompt with somatic polarity, archetypes, protocols.',
    exports: ['buildTroubadourPrompt', 'buildCompressedPrompt', 'buildChatPrompt', 'enforceOver'],
    critical: true,
  },
  troubadourOffline: {
    file: 'src/data/troubadourOffline.js',
    what: '20+ pre-written Bertrand quotes for when ALL AI backends are offline.',
    exports: ['getOfflineResponse', 'getFretAwareFallback', 'OFFLINE_RESPONSES'],
    critical: true,
  },
  playbookData: {
    file: 'src/data/playbookData.js',
    what: 'D&D stats, bard levels, troubadour archetypes, quests, journal prompts.',
    exports: ['BARD_LEVEL_TITLES', 'CORE_STATS', 'TROUBADOUR_TYPES', 'QUEST_DATA', 'JOURNAL_PROMPTS', 'computeTroubadourProfile'],
    critical: true,
  },
  dagNodes: {
    file: 'src/data/dag/dagNodes.js',
    what: '144-node curriculum DAG (12 frets x 3 pillars x 4 phases). Every node has troubadourPrompt.',
    exports: ['dagNodes', 'getNodeById', 'getNodesByFret', 'FRET_METADATA'],
    critical: true,
  },
  dagEdges: {
    file: 'src/data/dag/dagEdges.js',
    what: 'Prerequisite edges, unlock logic, recommendation engine for DAG.',
    exports: ['isNodeUnlocked', 'isNodeRecommended', 'getNextRecommendedNode', 'getNewlyUnlockedNodes'],
    critical: true,
  },
  ragStore: {
    file: 'src/data/ragStore.js',
    what: 'IndexedDB RAG retrieval. Keyword scoring + chunk building for AI prompts.',
    exports: ['searchChunks', 'buildContextBlock', 'addChunks'],
    critical: true,
  },
  curriculumIndexer: {
    file: 'src/data/curriculumIndexer.js',
    what: 'Indexes all 144 DAG nodes + offline quotes into RAG store on load.',
    exports: ['indexCurriculum'],
    critical: true,
  },
  tractionStore: {
    file: 'src/data/tractionStore.js',
    what: 'Student progress in localStorage: bardLevel, per-fret traction, streak.',
    exports: ['getTraction', 'setTraction', 'attemptDAGPhase', 'incrementSessionStat'],
    critical: true,
  },
  localDatabase: {
    file: 'src/data/localDatabase.js',
    what: 'Dexie/IndexedDB wrapper for offline-first sessions, journal, impressions.',
    exports: ['db', 'saveSession', 'getSessions', 'saveJournalEntry'],
    critical: true,
  },
  llmTestSuite: {
    file: 'src/data/llmTestSuite.js',
    what: '18 test cases with 7 scoring dimensions for automated LLM quality eval.',
    exports: ['LLM_TEST_SUITE', 'scoreResponse', 'runQualityReport'],
    critical: false,
  },
  ttsAudioSuite: {
    file: 'src/data/ttsAudioSuite.js',
    what: 'TTS audio quality evaluation with 6 dimensions and Web Audio analysis.',
    exports: ['TTS_AUDIO_TESTS', 'scoreTTSAudio'],
    critical: false,
  },
  promptVersioning: {
    file: 'src/data/promptVersioning.js',
    what: 'A/B prompt testing with regression detection and quality reports.',
    exports: ['savePromptVersion', 'runPromptABTest', 'detectRegression'],
    critical: false,
  },
  systemKnowledgeRegistry: {
    file: 'src/data/systemKnowledgeRegistry.js',
    what: 'This file. Registry of all hooks, components, and data modules.',
    exports: ['HOOK_REGISTRY', 'COMPONENT_REGISTRY', 'DATA_REGISTRY'],
    critical: false,
  },
};
