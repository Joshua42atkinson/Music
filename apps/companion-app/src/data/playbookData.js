import { getPlaybookData } from './staticData';
import { vvGet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

const _pb = getPlaybookData();

// ── Re-export static data for backward compat ──
export const BARD_LEVEL_TITLES = _pb.BARD_LEVEL_TITLES;
export const XP_PER_LEVEL      = _pb.XP_PER_LEVEL;
export const CORE_STATS        = _pb.CORE_STATS;
export const QUEST_DATA        = _pb.QUEST_DATA;
export const JOURNAL_PROMPTS    = _pb.JOURNAL_PROMPTS;
export const JOURNAL_MOODS     = _pb.JOURNAL_MOODS;
export const MASTERY_LEVELS    = _pb.MASTERY_LEVELS;
export const INTERVAL_BADGES   = _pb.INTERVAL_BADGES;
export const TRUEBADOUR_TYPES  = _pb.TRUEBADOUR_TYPES;

// ── Bard Level Titles ──
export function getBardTitle(level, lang = 'en') {
  const clamped = Math.min(Math.max(level, 1), 10);
  return BARD_LEVEL_TITLES[clamped]?.[lang] || BARD_LEVEL_TITLES[clamped]?.en || 'Initiate';
}

// ── XP thresholds per level ──
export function getXpForNextLevel(level) {
  const clamped = Math.min(level + 1, 10);
  return XP_PER_LEVEL[clamped] || 9999;
}

// ── Compute stat value from traction ──
export function computeStatValue(statId, traction) {
  const frets = Object.values(traction?.frets || {});
  switch (statId) {
    case 'breath':
      return Math.min(20, Math.max(1, Math.floor((traction.breathingSessions || 0) / 2) + 1));
    case 'pitch': {
      const pitches = frets.map(f => f.pitchAccuracy || 0).filter(p => p > 0);
      if (pitches.length === 0) return 1;
      const avg = pitches.reduce((a, b) => a + b, 0) / pitches.length;
      return Math.min(20, Math.max(1, Math.round(avg / 5)));
    }
    case 'rhythm':
      return Math.min(20, Math.max(1, Math.floor((traction.rhythmSessions || 0) / 3) + 1));
    case 'memory': {
      const tractions = frets.map(f => f.traction || 0);
      if (tractions.length === 0) return 1;
      const avg = tractions.reduce((a, b) => a + b, 0) / tractions.length;
      return Math.min(20, Math.max(1, Math.round(avg / 5)));
    }
    case 'expression':
      return Math.min(20, Math.max(1, Math.floor((traction.songsWritten || 0) + (traction.journalEntries || 0)) + 1));
    default:
      return 1;
  }
}

// ── Compute interval mastery from adventure session data ──
export function getIntervalMastery() {
  const badges = {};
  INTERVAL_BADGES.forEach(b => { badges[b.id] = 'none'; });

  try {
    const raw = vvGet(STORAGE_KEYS.ADVENTURE_SESSION);
    if (!raw) return badges;
    const session = JSON.parse(raw);
    if (!session?.session?.history) return badges;

    const history = session.session.history;

    INTERVAL_BADGES.forEach(badge => {
      const visits = history.filter(h => h.sceneId === badge.sceneId);
      if (visits.length === 0) return;
      badges[badge.id] = 'encountered';
      const passedPitch = visits.some(v => v.pitchAccuracy === 'passed');
      if (passedPitch) badges[badge.id] = 'experienced';
      const sang = visits.some(v => v.singingScore !== null && v.singingScore > 0);
      if (passedPitch && sang) badges[badge.id] = 'owned';
      const highSing = visits.some(v => v.singingScore !== null && v.singingScore >= 0.7);
      const bonus = visits.some(v => v.branchType === 'bonus');
      if (passedPitch && highSing && bonus) badges[badge.id] = 'mastered';
    });
  } catch {
    // localStorage not available
  }

  return badges;
}

// ── computeTruebadourProfile ──
export function computeTruebadourProfile(traction) {
  const clamp = (v) => Math.min(1.0, Math.max(0.0, v));
  const bump = 0.05;

  const expressive = (traction.journalEntries || 0) + (traction.songsWritten || 0) + (traction.adventureSessions || 0);
  const storyteller = clamp(expressive * bump * 2);

  const kinesthetic = (traction.breathingSessions || 0) + (traction.rhythmSessions || 0) + (traction.recordingsSent || 0);
  const craftsman = clamp(kinesthetic * bump * 2);

  const audiation = (traction.pitchSessions || 0) + (traction.plingSessions || 0);
  const ear = clamp(audiation * bump * 2);

  const theoretical = Object.values(traction?.frets || {})
    .reduce((sum, f) => sum + (f.yinCompleted ? 1 : 0), 0) / 12;
  const seeker = clamp(theoretical);

  const scores = [
    { id: 'storyteller', val: storyteller },
    { id: 'craftsman',   val: craftsman },
    { id: 'ear',         val: ear },
    { id: 'seeker',      val: seeker },
  ];
  const dominant = scores.reduce((a, b) => a.val >= b.val ? a : b);
  const totalEngagement = storyteller + craftsman + ear + seeker;
  const dominantType = totalEngagement < 0.05
    ? TRUEBADOUR_TYPES.find(t => t.id === 'seeker')
    : TRUEBADOUR_TYPES.find(t => t.id === dominant.id);

  return { storyteller, craftsman, ear, seeker, dominantType };
}
