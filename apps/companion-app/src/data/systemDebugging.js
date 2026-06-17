// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : systemDebugging.js                                   ║
// ║ WHAT    : How-to-fix knowledge base for every component.     ║
// ║           Common issues, error patterns, and debug chains.    ║
// ║ WHY     : The AI must diagnose and guide fixes for students, ║
// ║           developers, and Bertrand without guessing.          ║
// ║ OWNS    : FIX_AT chains, symptom→cause→fix mappings,        ║
// ║           known bugs and workarounds                          ║
// ║ NEEDS   : systemKnowledgeRegistry.js for file references     ║
// ║ RULES   : Every FIX_AT must be a real file that exists       ║
// ║ FIX AT  : If a fix does not work, escalate to Joshua.        ║
// ║ STAGE   : IMPLEMENT                                          ║
// ╚═══════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════
// SYMPTOM → CAUSE → FIX MAP
// Used by the AI to diagnose student-reported issues
// ═══════════════════════════════════════════════════════════

export const SYMPTOM_FIX_MAP = {
  // ── AI / Truebadour Issues ──
  'Truebadour is silent': {
    likelyCause: 'TTS not loaded, backend offline, or audio queue stuck',
    check: [
      'Is Kokoro ready? (check server light: purple = ready)',
      'Is wllama ready? (check server light: green = ready)',
      'Did student click the speaker icon to enable TTS?',
      'Is browser audio muted? (check OS volume)',
    ],
    fix: 'TruebadourWidget.jsx → speakTextInternal() → check kokoroRef.current.isReady → fallback to Web Speech API',
    fallback: 'If all TTS fails, text still appears in chat. Student can read.',
  },
  'Truebadour says "Over" in text chat': {
    likelyCause: 'Mode mismatch — truebadour voice mode active while typing',
    check: [
      'Is microphone active? (red dot = listening)',
      'Did student toggle voice mode by mistake?',
    ],
    fix: 'truebadourPrompt.js → enforceOver() → check mode param. If mode===chat, strip "Over."',
    code: 'enforceOver(text, "chat") should NOT append "Over."',
  },
  'Truebadour gives wrong fret advice': {
    likelyCause: 'Current node context stale or RAG injection failed',
    check: [
      'What is currentNodeId in useDAGProgress?',
      'Does tractionStore show correct currentFret?',
      'Is RAG_CONTEXT placeholder replaced in prompt?',
    ],
    fix: 'TruebadourWidget.jsx → buildChatPrompt() → verify currentFret/currentPhase passed correctly',
  },
  'AI responses are too long': {
    likelyCause: 'max_tokens too high or model ignoring instruction',
    check: [
      'What backend is active? (wllama vs remote)',
      'wllama max_tokens is 512. Remote might be higher.',
    ],
    fix: 'useTruebadourAI.js → chatStream() → enforce max_tokens limit per backend',
  },

  // ── LLM Backend Issues ──
  'Wllama shows "Init failed"': {
    likelyCause: 'Model file missing, browser storage full, or insufficient RAM',
    check: [
      'Does /models/LFM2.5-1.2B-Instruct-Q4_K_M.gguf exist in public/models/?',
      'Browser console: any 404 for the .gguf URL?',
      'Device RAM: need ~2GB free for 1.2B model',
    ],
    fix: 'useWllamaTruebadour.js → initEngine() → check retry count → if max retries, suggest 350m fallback',
    fallback: 'Load 350m model (~229MB) instead of 1.2b. Lower quality but works on low-RAM devices.',
  },
  'Wllama stuck at 0% loading': {
    likelyCause: 'Network blocked, CDN unreachable, or CORS issue',
    check: [
      'Can browser reach cdn.jsdelivr.net? (WASM assets)',
      'Any ad blocker blocking the CDN?',
    ],
    fix: 'useWllamaTruebadour.js → WASM_PATHS → try local fallback if CDN fails',
  },
  'LM Studio light is red': {
    likelyCause: 'LM Studio not running, wrong port, or model not loaded',
    check: [
      'Is LM Studio desktop app open?',
      'Is server running on port 1234? (check LM Studio settings)',
      'Is a model loaded in LM Studio?',
    ],
    fix: 'useLMStudio.js → health check → localhost:1234/v1/models → verify response',
  },
  'DaaS light is red': {
    likelyCause: 'Rust backend not running, port 8080 blocked, or build error',
    check: [
      'Is cargo run active in the backend directory?',
      'Is port 8080 already in use by another process?',
      'Any compilation errors in the Rust terminal?',
    ],
    fix: 'useBackendBridge.js → checkConnection() → DaaS API base → try fetchWithRetry on /health',
  },

  // ── TTS Issues ──
  'Kokoro TTS sounds robotic': {
    likelyCause: 'WebGPU not available, falling back to WASM (slower, less natural)',
    check: [
      'Is WebGPU enabled in browser flags? (chrome://flags)',
      'Browser console: any WebGPU error messages?',
    ],
    fix: 'useKokoroTTS.js → initTTS() → check WebGPU support → log backend used',
    note: 'WASM fallback is expected on non-WebGPU browsers. Quality is acceptable.',
  },
  'French voice sounds thin': {
    likelyCause: 'Kokoro SIWIS voice trained on <11 hours. Known limitation.',
    check: [
      'Is this the SIWIS voice (8073bf2d)?',
      'Is Qwen3-TTS server running for better French?',
    ],
    fix: 'useQwenTTS.js → if server ready, use Qwen3 for French instead of Kokoro',
    note: 'This is a known product gap. Qwen3-TTS is the planned fix.',
  },
  'TTS repeats or overlaps': {
    likelyCause: 'Audio queue not draining, or rapid-fire messages',
    check: [
      'Is audioQueueRef draining properly?',
      'Did student spam the send button?',
    ],
    fix: 'useTruebadourAI.js → speakTextInternal() → cancel() before new speak',
  },

  // ── Voice Input Issues ──
  'Microphone not working': {
    likelyCause: 'Permission denied, mic in use by another app, or browser blocked',
    check: [
      'Browser address bar: is mic permission granted?',
      'Is another tab using the microphone?',
      'Did student click "Block" on the permission prompt?',
    ],
    fix: 'useVoiceInput.js → startListening() → catch NotAllowedError → guide user to browser settings',
  },
  'Voice input mishears music terms': {
    likelyCause: 'Web Speech API not trained on music vocabulary. "Mi aigu" → "me ego"',
    check: [
      'Is locale set to fr-FR for French terms?',
      'Is student speaking clearly?',
    ],
    fix: 'useVoiceInput.js → set locale correctly → future: Whisper Base ONNX for music vocab',
    note: 'Known limitation of Web Speech API. Music terms are poorly recognized.',
  },

  // ── Curriculum / Progress Issues ──
  'Student stuck at same fret': {
    likelyCause: 'Prerequisites not met, traction insufficient, or DAG edge blocking',
    check: [
      'What is currentNodeId in localStorage (voix_vive_dag_progress)?',
      'What is traction for that fret in bard_traction?',
      'Are prerequisite nodes completed?',
    ],
    fix: 'useDAGProgress.js → isNodeUnlocked() → check prerequisites → tractionStore → per-fret traction',
  },
  'Progress lost after refresh': {
    likelyCause: 'localStorage cleared, private browsing mode, or storage quota exceeded',
    check: [
      'Is localStorage accessible? (try reading bard_traction key)',
      'Is student in incognito/private mode?',
      'Browser console: any QuotaExceededError?',
    ],
    fix: 'tractionStore.js → getTraction() → fallback to DEFAULT_TRACTION if localStorage fails',
    note: 'In private mode, localStorage is cleared on close. Student must use normal browsing.',
  },
  'Cannot unlock next fret': {
    likelyCause: 'Traction < 60 for current fret, or milestone prerequisites incomplete',
    check: [
      'Per-fret traction in bard_traction → frets → {fretNum}.traction',
      'Are all BE/DO/PLAY phases completed for current fret?',
      'Are all three pillars (class/guitar/workbook) progressed?',
    ],
    fix: 'dagEdges.js → isNodeUnlocked() → check prerequisite edges → traction thresholds',
  },

  // ── Tool Issues ──
  'Pitch detector shows no reading': {
    likelyCause: 'Mic not active, volume too low, or AudioContext suspended',
    check: [
      'Is mic permission granted?',
      'Is student humming loudly enough? (need RMS > 0.002)',
      'Browser console: AudioContext state === "suspended"?',
    ],
    fix: 'usePitchDetector.js → resumeAudio() → getAudioContext() → check state',
  },
  'Metronome drifts or stutters': {
    likelyCause: 'Using setInterval instead of AudioContext scheduler',
    check: [
      'Is useMetronome using Web Audio API scheduling?',
      'Is browser tab backgrounded? (background timers throttled)',
    ],
    fix: 'useMetronome.js → NEVER use setInterval → use AudioContext.currentTime + look-ahead',
    note: 'If tab is backgrounded, visual beat may stutter but audio stays precise.',
  },
  'Vertiscale game shows blank fretboard': {
    likelyCause: 'Scale pattern data not loaded, or FretboardExplorer dependency missing',
    check: [
      'Is FretboardExplorer mounted? Does it have scale data?',
      'Browser console: any import errors for scale patterns?',
    ],
    fix: 'VertiscaleEngine.jsx → check pattern library → ensure FretboardExplorer scale data loaded',
  },

  // ── Auth / Data Issues ──
  'PIN not working': {
    likelyCause: 'Wrong PIN, profile not created, or SQLite not reachable',
    check: [
      'Does localStorage have active_student_profile?',
      'Is DaaS running for PIN verification? (PIN stored in SQLite)',
    ],
    fix: 'useAuth.js → verifyPIN() → if DaaS offline, fallback to localStorage PIN hash',
  },
  'Cannot create profile': {
    likelyCause: 'localStorage full, or invalid name/PIN format',
    check: [
      'Browser console: any QuotaExceededError?',
      'Is PIN exactly 4 digits?',
    ],
    fix: 'useAuth.js → createProfile() → validate inputs → catch storage errors',
  },

  // ── Performance Issues ──
  'App is slow / laggy': {
    likelyCause: 'Too many re-renders, large RAG store, or memory leak in audio',
    check: [
      'React DevTools: any component re-rendering excessively?',
      'Memory tab: any AudioContext or Blob URLs not released?',
      'Is RAG store too large? (IndexedDB bloat)',
    ],
    fix: 'Profile with React DevTools → identify re-render culprit → memoize or useCallback',
  },
  'Battery drains quickly': {
    likelyCause: 'Mic always on, WebGPU always active, or animation loops running',
    check: [
      'Is microphone still listening after leaving PitchRoom/PlingTrainer?',
      'Are background animations (framer-motion) running unnecessarily?',
    ],
    fix: 'usePitchDetector.js → stopListening() on unmount → useEffect cleanup',
  },
};

// ═══════════════════════════════════════════════════════════
// FIX_AT CHAINS — Where to start debugging for each file
// These mirror the PEARL header FIX_AT lines
// ═══════════════════════════════════════════════════════════

export const FIX_AT_CHAINS = {
  // AI Stack
  'useTruebadourAI.js': [
    'Check backend state: isReady, isLoading, error',
    'Check wllamaRef.current — is wllama loaded?',
    'Check kokoroRef.current — is TTS ready?',
    'Check voiceRef.current — is mic available?',
    'Look at chatStream() → which backend path taken?',
    'Check speakTextInternal() → which TTS tier fired?',
  ],
  'useWllamaTruebadour.js': [
    'Check /models/*.gguf exists in public/models/',
    'Check browser console for 404 on model URL',
    'Check localStorage vv_wllama_retries (max 3)',
    'Check device RAM — need ~2GB free',
    'Try 350m fallback model if 1.2b fails',
  ],
  'useKokoroTTS.js': [
    'Check WebGPU support: navigator.gpu !== undefined',
    'Check onnxruntime-web loaded without error',
    'Check kokoro-js import success',
    'Verify voice ID exists in VOICE_MAP',
    'Check audioQueueRef — is it draining?',
  ],
  'useQwenTTS.js': [
    'Is server running? curl http://localhost:9999/health',
    'Is qwen-tts installed? pip list | grep qwen',
    'Check server/tts-server.py for mock mode vs real',
    'Verify voice reference file exists in server/references/',
  ],
  'useVoiceInput.js': [
    'Check mic permission in browser settings',
    'Check SpeechRecognition API available (Chrome/Edge only)',
    'Check locale — is it set to correct language?',
    'Verify no other tab is using the microphone',
  ],
  'useBackendBridge.js': [
    'Is DaaS running? curl http://localhost:8080/api/health',
    'Is LM Studio running? curl http://localhost:1234/v1/models',
    'Check fetchWithRetry logs — any timeout?',
    'Verify network — is localhost reachable?',
  ],

  // Curriculum Stack
  'useDAGProgress.js': [
    'Check localStorage voix_vive_dag_progress',
    'Verify currentNodeId is valid in dagNodes.js',
    'Check tractionStore bard_traction → per-fret values',
    'Verify prerequisite edges in dagEdges.js',
    'Is sandboxMode enabled? (isolates progress)',
  ],
  'dagNodes.js': [
    'Verify node ID exists: getNodeById("fret-X-pillar-phase")',
    'Check truebadourPrompt field on the node',
    'Verify slideIds reference actual slide data',
  ],
  'dagEdges.js': [
    'Check isNodeUnlocked() — are all prerequisites met?',
    'Verify traction threshold (default 60) for unlocks',
    'Check getNextRecommendedNode() — is there a valid next?',
  ],
  'tractionStore.js': [
    'Read localStorage key "bard_traction"',
    'Check JSON validity — any parse errors?',
    'Verify per-fret traction values are numbers',
    'Check settings → sandboxMode, kidMode flags',
  ],

  // Tool Stack
  'usePitchDetector.js': [
    'Check AudioContext state — is it "running"?',
    'Check mic stream active — is _sharedStream non-null?',
    'Check RMS value — is it above 0.002 threshold?',
    'Verify AudioWorklet processor loaded without error',
    'Check if another component acquired the context first',
  ],
  'useMetronome.js': [
    'Check AudioContext state',
    'Verify NOT using setInterval (use AudioContext.currentTime)',
    'Check look-ahead scheduling logic',
    'Verify BPM is within valid range (20-300)',
  ],
  'audioEngine.js': [
    'Check getAudioContext() returns valid context',
    'Verify resumeAudio() handles browser autoplay policy',
    'Check AudioWorklet path — is .js file reachable?',
  ],

  // UI Stack
  'TruebadourWidget.jsx': [
    'Check aiBackend state — which backend is active?',
    'Verify refs wired: wllamaRef, kokoroRef, qwenRef, voiceRef',
    'Check RAG_CONTEXT placeholder replacement in messages',
    'Verify mode state: chat vs truebadour (Over. protocol)',
    'Check notification state — any stale notifications?',
  ],
  'PlayerPortal.jsx': [
    'Check tractionStore → bardLevel, streak, completedFrets',
    'Verify CharacterSheet data — are stats computed?',
    'Check nextRecommended node from useDAGProgress',
    'Verify Truebadour Type override in settings',
  ],
  'SlideViewer.jsx': [
    'Check current slide ID exists in slide data',
    'Verify audio cues are reachable (not 404)',
    'Check slide transition animations not blocking input',
    'Verify references panel data loaded',
  ],
};

// ═══════════════════════════════════════════════════════════
// KNOWN BUGS AND WORKAROUNDS
// Honest list of current issues and temporary fixes
// ═══════════════════════════════════════════════════════════

export const KNOWN_BUGS = [
  {
    id: 'BUG-001',
    symptom: 'BiometricSanctum is a simulation stub',
    status: 'ACCEPTED',
    workaround: 'Component shows visualizer but no real EEG data. Marked as "future" in UI.',
    fixETA: 'Phase 3 (Android XR) — requires BLE hardware',
    file: 'src/components/BiometricSanctum.jsx',
  },
  {
    id: 'BUG-002',
    symptom: 'French TTS voice (SIWIS) is thin and low quality',
    status: 'MITIGATED',
    workaround: 'Use Qwen3-TTS server when available. Falls back to SIWIS.',
    fixETA: 'Requires French voice cloning data or better FR model',
    file: 'src/hooks/useKokoroTTS.js',
  },
  {
    id: 'BUG-003',
    symptom: 'RAG uses keyword matching, not semantic search',
    status: 'ACCEPTED',
    workaround: 'Keyword scoring works for exact matches. "interval" finds interval content.',
    fixETA: 'Needs nomic-embed or similar embedding model (adds ORT dependency)',
    file: 'src/data/ragStore.js',
  },
  {
    id: 'BUG-004',
    symptom: 'Web Speech API mishears music terms',
    status: 'ACCEPTED',
    workaround: 'Student can type instead. French locale helps but is not perfect.',
    fixETA: 'Whisper Base ONNX (adds ORT dependency)',
    file: 'src/hooks/useVoiceInput.js',
  },
  {
    id: 'BUG-005',
    symptom: 'Wllama model file not included in repo',
    status: 'BLOCKING',
    workaround: 'None — must download LFM2.5 GGUF to /public/models/',
    fixETA: 'Immediate — download from HuggingFace',
    file: '/public/models/',
  },
  {
    id: 'BUG-006',
    symptom: 'Qwen3-TTS server requires manual install',
    status: 'BLOCKING',
    workaround: 'Server runs in mock mode (generates tones) when qwen-tts not installed.',
    fixETA: 'pip install qwen-tts on AMD machine',
    file: 'server/tts-server.py',
  },
  {
    id: 'BUG-007',
    symptom: 'TruebadourWidget is a monolith (~600 lines)',
    status: 'TECH_DEBT',
    workaround: 'Extracted hooks to separate files. Widget still large but manageable.',
    fixETA: 'Ongoing refactoring — split into sub-components',
    file: 'src/components/TruebadourWidget.jsx',
  },
  {
    id: 'BUG-008',
    symptom: 'No automated CI for quality tests',
    status: 'ACCEPTED',
    workaround: 'Tests run manually via npm test. 168 tests passing.',
    fixETA: 'Add GitHub Actions workflow',
    file: 'package.json → scripts.test',
  },
];

// ═══════════════════════════════════════════════════════════
// QUICK FIX FUNCTIONS — For AI to use in responses
// ═══════════════════════════════════════════════════════════

export function getFixFor(symptom) {
  return SYMPTOM_FIX_MAP[symptom] || {
    likelyCause: 'Unknown — symptom not in database yet.',
    check: ['Check browser console for errors', 'Check network tab for failed requests'],
    fix: 'Escalate to Joshua with browser console logs and reproduction steps.',
  };
}

export function getFixChain(fileName) {
  return FIX_AT_CHAINS[fileName] || [
    `No debug chain recorded for ${fileName}.`,
    'Check the PEARL header in the file itself.',
    'Check imports and follow dependency chain manually.',
  ];
}

export function getKnownBugsFor(fileName) {
  return KNOWN_BUGS.filter(b => b.file.includes(fileName));
}
