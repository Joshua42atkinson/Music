// ═══════════════════════════════════════════════════════════
// STATIC DATA CACHE — Runtime fetch for /public/data/*.json
// Preloaded in main.jsx before React renders so all
// components can read synchronously from cache.
// ═══════════════════════════════════════════════════════════

const DATA_URLS = {
  slideDecks: '/data/slideDecks.json',
  chapterData: '/data/chapterData.json',
  timelessSongSlides: '/data/timelessSongSlides.json',
  playbookData: '/data/playbookData.json',
  dagNodes: '/data/dagNodes.json',
};

let cache = {
  slideDecks: null,
  chapterData: null,
  timelessSongSlides: null,
  playbookData: null,
  dagNodes: null,
};

let preloadPromise = null;

export async function preloadStaticData() {
  if (preloadPromise) return preloadPromise;
  preloadPromise = Promise.all([
    fetch(DATA_URLS.slideDecks).then(r => r.json()),
    fetch(DATA_URLS.chapterData).then(r => r.json()),
    fetch(DATA_URLS.timelessSongSlides).then(r => r.json()),
    fetch(DATA_URLS.playbookData).then(r => r.json()),
    fetch(DATA_URLS.dagNodes).then(r => r.json()),
  ]).then(([slideDecks, chapterData, timelessSongSlides, playbookData, dagNodes]) => {
    cache = { slideDecks, chapterData, timelessSongSlides, playbookData, dagNodes };
    return cache;
  });
  return preloadPromise;
}

export function getStaticData() {
  return cache;
}

export function getSlideDecks() {
  return cache.slideDecks;
}

export function getChapterData() {
  return cache.chapterData;
}

export function getTimelessSongSlides() {
  return cache.timelessSongSlides;
}

export function getPlaybookData() {
  return cache.playbookData;
}

export function getDAGNodes() {
  return cache.dagNodes?.nodes || [];
}

export function getFretMetadata() {
  return cache.dagNodes?.metadata || {};
}

// ── Test helper ──
export function __setCache(overrides) {
  cache = { ...cache, ...overrides };
}
