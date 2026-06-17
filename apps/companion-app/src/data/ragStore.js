// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : ragStore.js                                        ║
// ║ WHAT    : In-browser RAG vector store for curriculum search  ║
// ║ WHY     : Retrieve relevant curriculum context for the AI  ║
// ║           before generating responses. Scales to videos.     ║
// ║ ARCH    : Mini Trinity Pillar #2 (Embedding)                 ║
// ║           Current: Keyword + metadata scoring (Souffle tier) ║
// ║           Future: nomic-embed-text via ONNX (~30MB) for     ║
// ║           semantic vector search over all 211 slides + video ║
// ║           transcripts. The embedding model completes the     ║
// ║           Mini Trinity: LLM + Embedding + TTS.               ║
// ║ STORAGE : IndexedDB (persistent across sessions)             ║
// ║ STAGE   : IMPLEMENT (preparing for video transcript scale)   ║
// ╚═══════════════════════════════════════════════════════════════╝

// ── Mini Trinity: Embedding Model Config (future) ──────────────
// When activated, this replaces keyword scoring with semantic vector search.
// The nomic-embed-text model runs in-browser via ONNX Runtime Web (~30MB).
const EMBEDDING_CONFIG = {
  model: 'nomic-ai/nomic-embed-text-v1.5-ONNX',
  dimensions: 768,
  maxInputTokens: 8192,
  quantization: 'q4',     // ~30 MB download
  enabled: false,          // ← flip to true when embedding model is loaded
};

const DB_NAME = 'voixvive_rag';
const DB_VERSION = 1;
const CHUNKS_STORE = 'chunks';
const INDEX_STORE = 'index_metadata';

// ── IndexedDB helpers ──────────────────────────────────────────
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(CHUNKS_STORE)) {
        db.createObjectStore(CHUNKS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(INDEX_STORE)) {
        db.createObjectStore(INDEX_STORE, { keyPath: 'key' });
      }
    };
  });
}

async function put(storeName, data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(data);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

async function _get(storeName, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

async function getAll(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

async function clearStore(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

// ── Chunking ───────────────────────────────────────────────────
/**
 * Split text into semantic chunks.
 * Simple: split by paragraphs, respecting max length.
 * Future: sentence-level chunking with overlap.
 */
export function chunkText(text, { maxLength = 500, overlap = 50 } = {}) {
  if (!text || text.length <= maxLength) return [text.trim()];

  const chunks = [];
  const paragraphs = text.split(/\n\s*\n/);

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    if (trimmed.length <= maxLength) {
      chunks.push(trimmed);
      continue;
    }
    // Split long paragraphs by sentences
    const sentences = trimmed.match(/[^.!?]+[.!?]+/g) || [trimmed];
    let current = '';
    for (const sentence of sentences) {
      if ((current + sentence).length > maxLength && current) {
        chunks.push(current.trim());
        current = sentence;
      } else {
        current += sentence;
      }
    }
    if (current) chunks.push(current.trim());
  }

  // Add overlap for context continuity (internal marker, stripped at retrieval time)
  const withOverlap = [];
  for (let i = 0; i < chunks.length; i++) {
    let chunk = chunks[i];
    if (i > 0 && overlap > 0) {
      const prevEnd = chunks[i - 1].slice(-overlap);
      // Use a marker that we can strip during retrieval — keeps semantic continuity
      // without confusing the AI with visible [...] artifacts
      chunk = `<!--overlap-->${prevEnd}<!--/overlap-->${chunk}`;
    }
    withOverlap.push(chunk);
  }

  return withOverlap;
}

// ── Keyword scoring (Souffle tier — no ML needed) ─────────────
/**
 * Score a chunk against a query using keyword overlap + metadata.
 * Returns relevance score (0 to 1).
 */
function scoreChunk(chunk, query, _locale = 'en') {
  const qWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const cText = (chunk.text || chunk).toLowerCase();
  const cWords = cText.split(/\s+/);

  let matches = 0;
  for (const qw of qWords) {
    // Exact match
    if (cText.includes(qw)) matches += 1;
    // Prefix match (for partial words)
    else if (cWords.some(cw => cw.startsWith(qw) || qw.startsWith(cw))) matches += 0.5;
  }

  const textScore = qWords.length > 0 ? matches / qWords.length : 0;

  // Metadata bonus
  let metaScore = 0;
  if (chunk.metadata) {
    const { fret, phase, type, tags = [] } = chunk.metadata;
    const qLower = query.toLowerCase();
    if (fret && qLower.includes(`fret ${fret}`)) metaScore += 0.3;
    if (phase && qLower.includes(phase.toLowerCase())) metaScore += 0.2;
    if (type && qLower.includes(type.toLowerCase())) metaScore += 0.1;
    for (const tag of tags) {
      if (qLower.includes(tag.toLowerCase())) metaScore += 0.15;
    }
  }

  // Title bonus (if query matches title heavily)
  if (chunk.metadata?.title) {
    const titleWords = chunk.metadata.title.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const titleMatches = titleWords.filter(tw => qWords.some(qw => tw.includes(qw) || qw.includes(tw))).length;
    metaScore += (titleMatches / Math.max(titleWords.length, 1)) * 0.4;
  }

  return Math.min(1, textScore + metaScore);
}

// ── Core RAG API ───────────────────────────────────────────────

/**
 * Add a document chunk to the vector store.
 * @param {string} id - Unique chunk ID
 * @param {string} text - Chunk text content
 * @param {object} metadata - { source, fret, phase, type, title, tags, timestamp }
 */
export async function addChunk(id, text, metadata = {}) {
  const chunks = chunkText(text);
  for (let i = 0; i < chunks.length; i++) {
    const chunkId = chunks.length === 1 ? id : `${id}::${i}`;
    await put(CHUNKS_STORE, {
      id: chunkId,
      text: chunks[i],
      metadata: {
        ...metadata,
        chunkIndex: i,
        totalChunks: chunks.length,
        indexedAt: Date.now(),
      },
    });
  }
}

/**
 * Search for relevant chunks given a query.
 * @param {string} query - User's question
 * @param {object} options - { topK: 3, locale: 'en', filter: { fret, phase } }
 * @returns {Array<{id, text, metadata, score}>}
 */
export async function searchChunks(query, { topK = 3, locale = 'en', filter = {} } = {}) {
  const allChunks = await getAll(CHUNKS_STORE);

  // Filter by metadata if specified
  let candidates = allChunks;
  if (filter.fret !== undefined) {
    candidates = candidates.filter(c => c.metadata?.fret === filter.fret);
  }
  if (filter.phase) {
    candidates = candidates.filter(c => c.metadata?.phase === filter.phase);
  }
  if (filter.type) {
    candidates = candidates.filter(c => c.metadata?.type === filter.type);
  }

  // Score and rank, then deduplicate by source+title
  const scored = candidates
    .map(chunk => ({ ...chunk, score: scoreChunk(chunk, query, locale) }))
    .filter(c => c.score > 0.1) // Minimum relevance threshold
    .sort((a, b) => b.score - a.score);

  // Deduplicate: prefer highest-scored chunk per source+title combo
  const seen = new Set();
  const deduped = [];
  for (const chunk of scored) {
    const key = `${chunk.metadata?.source || 'unknown'}::${chunk.metadata?.title || chunk.id}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(chunk);
    }
    if (deduped.length >= topK) break;
  }

  return deduped;
}

/**
 * Get all indexed chunk metadata (for debugging/admin).
 */
export async function listIndexedSources() {
  const chunks = await getAll(CHUNKS_STORE);
  const sources = new Map();
  for (const chunk of chunks) {
    const source = chunk.metadata?.source || 'unknown';
    if (!sources.has(source)) {
      sources.set(source, { count: 0, chunks: 0 });
    }
    sources.get(source).count += 1;
    sources.get(source).chunks += chunk.metadata?.totalChunks || 1;
  }
  return Array.from(sources.entries()).map(([source, data]) => ({ source, ...data }));
}

/**
 * Clear all indexed chunks.
 */
export async function clearAllChunks() {
  await clearStore(CHUNKS_STORE);
}

/**
 * Export all RAG data for save states.
 */
export async function exportRagData() {
  const chunks = await getAll(CHUNKS_STORE);
  const index = await getAll(INDEX_STORE);
  return { chunks, index };
}

/**
 * Import RAG data from save states.
 */
export async function importRagData(data) {
  if (data?.chunks) {
    await clearStore(CHUNKS_STORE);
    for (const chunk of data.chunks) {
      await put(CHUNKS_STORE, chunk);
    }
  }
  if (data?.index) {
    await clearStore(INDEX_STORE);
    for (const item of data.index) {
      await put(INDEX_STORE, item);
    }
  }
}

/**
 * Check if RAG store has any data.
 */
export async function hasIndexedData() {
  const chunks = await getAll(CHUNKS_STORE);
  return chunks.length > 0;
}

// ── Context builder ────────────────────────────────────────────
/**
 * Build a context string from retrieved chunks for prompt injection.
 * @param {Array} chunks - Retrieved chunks from searchChunks
 * @returns {string} Formatted context block
 */
export function buildContextBlock(chunks) {
  if (!chunks || chunks.length === 0) return '';

  const lines = chunks.map((c, i) => {
    const meta = c.metadata || {};
    const source = meta.source ? `[${meta.source}]` : '';
    const loc = meta.fret ? ` Fret ${meta.fret}` : '';
    const ph = meta.phase ? ` ${meta.phase.toUpperCase()}` : '';
    // Strip overlap markers before injecting into prompt
    const cleanText = (c.text || '').replace(/<!--overlap-->.*?<!--\/overlap-->/gs, '');
    return `${i + 1}${source}${loc}${ph}: ${cleanText}`;
  });

  return `## Relevant Curriculum Context\n${lines.join('\n\n')}\n\n---\n`;
}
