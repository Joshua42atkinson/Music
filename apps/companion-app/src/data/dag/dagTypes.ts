// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : dagTypes.ts                                         ║
// ║ WHAT    : TypeScript types for the DAG system                ║
// ║ WHY     : Single source of truth for node shapes              ║
// ║ STAGE   : IMPLEMENT (AI+DAG Harmonization Phase A)           ║
// ╚═══════════════════════════════════════════════════════════════╝

export type Pillar = 'class' | 'guitar' | 'workbook';
export type Phase = 'be' | 'do' | 'play' | 'all';
export type NodeType = 'slide' | 'tool' | 'game' | 'journal' | 'submission' | 'milestone' | 'reflection';
export type SubmissionType = 'video' | 'audio' | 'text';
export type EdgeType = 'prerequisite' | 'suggested' | 'unlocks';

export interface DAGNode {
  id: string;
  pillar: Pillar;
  fret: number;
  phase: Phase;
  type: NodeType;
  title: string;
  description: string;
  truebadourPrompt: string;
  prerequisites: string[];
  suggestedAfter: string[];
  xpValue: number;
  yinContent?: string;
  yangContent?: string;
  audioCue?: string;
  estimatedMinutes: number;
  toolId?: string;
  toolConfig?: Record<string, unknown>;
  slideIds?: string[];
  journalPrompt?: string;
  submissionType?: SubmissionType;
  isLocked?: boolean;
  lockedReason?: string;
}

export interface DAGEdge {
  from: string;
  to: string;
  type: EdgeType;
}

export interface DAGProgress {
  currentNodeId: string;
  completedNodes: string[];
  unlockedNodes: string[];
  recommendedNodes: string[];
  phaseStates: Record<string, PhaseState>;
  pathHistory: string[];
}

export interface PhaseState {
  beCompleted: boolean;
  doCompleted: boolean;
  playCompleted: boolean;
  beAttempts: number;
  doAttempts: number;
  playAttempts: number;
  lastAccessed: string;
}

export interface FretMeta {
  interval: string;
  character: string;
  ratio: string;
  cents: number;
  hzExample: string;
  emotion: string;
  sheddingPrompt: string;
}
