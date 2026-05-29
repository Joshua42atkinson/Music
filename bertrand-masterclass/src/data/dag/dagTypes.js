// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : dagTypes.js                                         ║
// ║ WHAT    : TypeScript-style JSDoc types for the DAG system    ║
// ║ WHY     : Single source of truth for node shapes              ║
// ║ STAGE   : IMPLEMENT (AI+DAG Harmonization Phase A)           ║
// ╚═══════════════════════════════════════════════════════════════╝

/**
 * @typedef {Object} DAGNode
 * @property {string} id - e.g., "fret-3-class-be"
 * @property {'class'|'guitar'|'workbook'} pillar
 * @property {number} fret - 1-12
 * @property {'be'|'do'|'play'|'all'} phase - BE→DO→PLAY phase
 * @property {'slide'|'tool'|'game'|'journal'|'submission'|'milestone'|'reflection'} type
 * @property {string} title
 * @property {string} description
 * @property {string} troubadourPrompt - What the AI says to introduce this node
 * @property {string[]} prerequisites - Node IDs that must be completed before unlock
 * @property {string[]} suggestedAfter - Nodes that make this "recommended" (yellow glow)
 * @property {number} xpValue - Intrinsic value for Bard Level (1-25)
 * @property {string} [yinContent] - Theory/imaginative aspect
 * @property {string} [yangContent] - Physical/kinesthetic aspect
 * @property {string} [audioCue] - Sound effect or music cue
 * @property {number} estimatedMinutes - How long this node takes
 * @property {string} [toolId] - e.g., "pitch-room", "metronome"
 * @property {Object} [toolConfig] - Tool-specific settings
 * @property {string[]} [slideIds] - Array of slide IDs
 * @property {string} [journalPrompt] - Reflection question
 * @property {'video'|'audio'|'text'} [submissionType]
 */

/**
 * @typedef {Object} DAGEdge
 * @property {string} from - Source node ID
 * @property {string} to - Target node ID
 * @property {'prerequisite'|'suggested'|'unlocks'} type
 */

/**
 * @typedef {Object} DAGProgress
 * @property {string} currentNodeId - Where the student is right now
 * @property {string[]} completedNodes - All completed node IDs
 * @property {string[]} unlockedNodes - All unlocked node IDs
 * @property {string[]} recommendedNodes - Nodes with yellow glow
 * @property {Object} phaseStates - Per-node BE/DO/PLAY completion
 * @property {string[]} pathHistory - Breadcrumb trail of visited nodes
 */

/**
 * @typedef {Object} PhaseState
 * @property {boolean} beCompleted
 * @property {boolean} doCompleted
 * @property {boolean} playCompleted
 * @property {number} beAttempts
 * @property {number} doAttempts
 * @property {number} playAttempts
 * @property {string} lastAccessed - ISO timestamp
 */

export {};
