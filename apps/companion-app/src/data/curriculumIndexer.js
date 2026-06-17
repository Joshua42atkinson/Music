// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : curriculumIndexer.js                               ║
// ║ WHAT    : Index all curriculum content into RAG store        ║
// ║ WHY     : Makes curriculum searchable for AI context retrieval ║
// ║ RUN     : Called once on app init, or manually via settings  ║
// ║ STAGE   : IMPLEMENT                                          ║
// ╚═══════════════════════════════════════════════════════════════╝

import { addChunk, hasIndexedData, clearAllChunks } from './ragStore';
import { devLog } from '../lib/devLog';
import { vvGet, vvSet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

// ── Import curriculum data ─────────────────────────────────────
import { dagNodes } from './dag/dagNodes';

const INDEX_VERSION = 'v1';
const INDEX_VERSION_KEY = STORAGE_KEYS.RAG_VERSION;

/**
 * Index all DAG nodes (the 12-fret curriculum map).
 * Each node becomes one or more searchable chunks.
 */
async function indexDAGNodes() {
  for (const node of dagNodes) {
    const id = node.id;
    const metadata = {
      source: 'dag-curriculum',
      fret: node.fret,
      phase: node.phase,
      type: node.type,
      title: node.title?.en || node.title,
      tags: [
        ...(node.keywords?.en || node.keywords || []),
        node.interval,
        node.emotion,
        node.pillar,
      ].filter(Boolean),
    };

    // Main node content
    const mainText = [
      `${node.title?.en || node.title}.`,
      node.subtitle?.en || node.subtitle,
      node.description?.en || node.description,
      `Interval: ${node.interval}.`,
      `Emotion: ${node.emotion}.`,
      `Pillar: ${node.pillar}.`,
      node.somatic ? `Somatic: ${node.somatic}` : '',
    ].filter(Boolean).join('\n\n');

    await addChunk(`dag-${id}`, mainText, metadata);

    // Index each exercise if present
    if (node.exercises && Array.isArray(node.exercises)) {
      for (let i = 0; i < node.exercises.length; i++) {
        const ex = node.exercises[i];
        const exText = [
          `Exercise: ${ex.name?.en || ex.name}.`,
          ex.description?.en || ex.description,
          ex.instructions?.en || ex.instructions,
          ex.tool ? `Tool: ${ex.tool}` : '',
        ].filter(Boolean).join('\n\n');

        await addChunk(`dag-${id}-ex-${i}`, exText, {
          ...metadata,
          title: `${metadata.title} — ${ex.name?.en || ex.name}`,
          tags: [...metadata.tags, 'exercise', ex.tool].filter(Boolean),
        });
      }
    }
  }
}


/**
 * Index fret-aware fallback prompts.
 */
async function indexFretPrompts() {
  const fretPrompts = {
    1: 'Root Note — foundation, "I am here". Play the open low E. Feel it vibrate through your body.',
    2: 'Minor 2nd — awakening, smallest step, tension. Play C then C#. Listen to the tension.',
    3: 'Major 2nd — journey, forward motion, hope. Play C then D. Trust the movement.',
    4: 'Minor 3rd — longing, melancholy, evening light. Play C then Eb. Sit with the melancholy.',
    5: 'Major 3rd — joy, brightness, first chord you loved. Play C then E. The guitar smiles with you.',
    6: 'Perfect 4th — question, suspension, searching. Play C then F. Wait for the answer.',
    7: 'Tritone — ordeal, crisis, breakthrough. Play C then F#. Sit in the discomfort. Breakthrough is near.',
    8: 'Perfect 5th — power, stability, grounded. Play C then G. Feel the ground beneath you.',
    9: 'Minor 6th — memory, nostalgia, distance. Play C then Ab. What do you remember?',
    10: 'Major 6th — hope, aspiration, reaching upward. Play C then A. Your chest opens.',
    11: 'Minor 7th — return, almost home. Play C then Bb. Almost home. One fret away.',
    12: 'Major 7th — arrival, completion. Play C then B. You have walked the entire chromatic path.',
  };

  for (const [fret, text] of Object.entries(fretPrompts)) {
    await addChunk(`fret-fallback-${fret}`, text, {
      source: 'fret-guide',
      fret: parseInt(fret, 10),
      type: 'somatic-prompt',
      title: `Fret ${fret} guidance`,
      tags: ['interval', 'somatic', 'fret', `fret-${fret}`],
    });
  }
}

/**
 * Index all curriculum content. Safe to call multiple times —
 * only re-indexes if version changed or store is empty.
 */
export async function indexCurriculum(force = false) {
  const currentVersion = vvGet(INDEX_VERSION_KEY);
  const hasData = await hasIndexedData();

  if (!force && currentVersion === INDEX_VERSION && hasData) {
    devLog('[RAG] Curriculum already indexed at version', INDEX_VERSION);
    return { indexed: false, reason: 'already-up-to-date' };
  }

  devLog('[RAG] Indexing curriculum...');

  if (force || !hasData) {
    await clearAllChunks();
  }

  try {
    await indexDAGNodes();
    await indexFretPrompts();

    vvSet(INDEX_VERSION_KEY, INDEX_VERSION);
    devLog('[RAG] Curriculum indexed successfully.');
    return { indexed: true, version: INDEX_VERSION };
  } catch (err) {
    console.error('[RAG] Indexing failed:', err);
    return { indexed: false, error: err.message };
  }
}

/**
 * Re-index everything from scratch.
 */
export async function reindexCurriculum() {
  return indexCurriculum(true);
}
