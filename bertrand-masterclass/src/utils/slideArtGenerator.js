// ═══════════════════════════════════════════════════════════
// SLIDE ART GENERATOR — Deterministic SVG artwork per slide
// Every slide gets a unique image generated from its data.
// No external files needed. Memoized for performance.
// ═══════════════════════════════════════════════════════════

const SVG_NS = 'http://www.w3.org/2000/svg';
const VIEW_W = 800;
const VIEW_H = 450;

// ── Color utilities ──
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 200, g: 169, b: 110 };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function fadeColor(hex, opacity) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${opacity})`;
}

function lighten(hex, amount = 40) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    Math.min(255, r + amount),
    Math.min(255, g + amount),
    Math.min(255, b + amount)
  );
}

// ── Deterministic pseudo-random from string seed ──
function seededRandom(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) {
    s = ((s << 5) - s + seed.charCodeAt(i)) | 0;
  }
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s & 0x7fffffff) / 0x7fffffff;
  };
}

// ── Geometric patterns by musical ratio ──
const RATIO_PATTERNS = {
  '1:1': { sides: 1, name: 'Unison' },
  '16:15': { sides: 2, name: 'Minor 2nd' },
  '9:8': { sides: 3, name: 'Major 2nd' },
  '6:5': { sides: 3, name: 'Minor 3rd' },
  '5:4': { sides: 5, name: 'Major 3rd' },
  '4:3': { sides: 4, name: 'Perfect 4th' },
  '√2:1': { sides: 2, name: 'Tritone' },
  '3:2': { sides: 5, name: 'Perfect 5th' },
};

function getPatternForFret(fretId) {
  const ratios = ['1:1', '16:15', '9:8', '6:5', '5:4', '4:3', '√2:1', '3:2'];
  return RATIO_PATTERNS[ratios[fretId - 1]] || { sides: fretId, name: 'Interval' };
}

// ── SVG Builder helpers ──
function svgWrap(content, defs = '') {
  return `<svg xmlns="${SVG_NS}" viewBox="0 0 ${VIEW_W} ${VIEW_H}" width="${VIEW_W}" height="${VIEW_H}">` +
    `<defs>${defs}</defs>` +
    content +
    `</svg>`;
}

function encodeSvg(svg) {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// ── Background ──
function makeBackground(accent, seedRand) {
  const dark = '#080810';
  const mid = fadeColor(accent, 0.03 + seedRand() * 0.04);
  const cx = 300 + seedRand() * 200;
  const cy = 150 + seedRand() * 150;
  const r = 250 + seedRand() * 150;
  return `<rect width="100%" height="100%" fill="${dark}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${mid}"/>` +
    `<circle cx="${800 - cx}" cy="${450 - cy}" r="${r * 0.6}" fill="${fadeColor(accent, 0.02)}"/>`;
}

// ── Grid lines (subtle) ──
function makeGrid(seedRand) {
  let lines = '';
  const spacing = 40 + Math.floor(seedRand() * 20);
  for (let y = 0; y < VIEW_H; y += spacing) {
    lines += `<line x1="0" y1="${y}" x2="${VIEW_W}" y2="${y}" stroke="rgba(255,255,255,0.015)" stroke-width="1"/>`;
  }
  return lines;
}

// ── Central geometric motif ──
function makeGeometricMotif(cx, cy, radius, sides, accent, seedRand, isYin) {
  let shape = '';
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
    points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
  }

  if (sides === 1) {
    // Unison — single circle with rings
    shape += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${fadeColor(accent, 0.3)}" stroke-width="2"/>`;
    shape += `<circle cx="${cx}" cy="${cy}" r="${radius * 0.6}" fill="none" stroke="${fadeColor(accent, 0.2)}" stroke-width="1"/>`;
    shape += `<circle cx="${cx}" cy="${cy}" r="${radius * 0.25}" fill="${fadeColor(accent, 0.15)}"/>`;
  } else if (sides === 2) {
    // Two overlapping circles (2nd intervals / tritone)
    const offset = radius * 0.5;
    shape += `<circle cx="${cx - offset}" cy="${cy}" r="${radius}" fill="none" stroke="${fadeColor(accent, 0.25)}" stroke-width="1.5"/>`;
    shape += `<circle cx="${cx + offset}" cy="${cy}" r="${radius}" fill="none" stroke="${fadeColor(accent, 0.25)}" stroke-width="1.5"/>`;
    if (!isYin) {
      shape += `<line x1="${cx - offset}" y1="${cy}" x2="${cx + offset}" y2="${cy}" stroke="${fadeColor(accent, 0.4)}" stroke-width="2"/>`;
    }
  } else {
    // Polygon
    const pts = points.map(p => p.join(',')).join(' ');
    shape += `<polygon points="${pts}" fill="none" stroke="${fadeColor(accent, 0.3)}" stroke-width="1.5"/>`;
    // Inner connections for star-like effect on odd sides
    if (sides >= 3 && !isYin) {
      for (let i = 0; i < sides; i++) {
        const j = (i + 2) % sides;
        shape += `<line x1="${points[i][0]}" y1="${points[i][1]}" x2="${points[j][0]}" y2="${points[j][1]}" stroke="${fadeColor(accent, 0.12)}" stroke-width="0.5"/>`;
      }
    }
  }

  // Orbital dots
  const dotCount = 6 + Math.floor(seedRand() * 8);
  for (let i = 0; i < dotCount; i++) {
    const angle = seedRand() * Math.PI * 2;
    const dist = radius * (0.3 + seedRand() * 0.8);
    const dx = cx + dist * Math.cos(angle);
    const dy = cy + dist * Math.sin(angle);
    const dotR = 1 + seedRand() * 2;
    shape += `<circle cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" r="${dotR.toFixed(1)}" fill="${fadeColor(accent, 0.2 + seedRand() * 0.3)}"/>`;
  }

  return shape;
}

// ── Yin-specific flowing elements ──
function makeYinElements(cx, cy, accent, seedRand) {
  let el = '';
  // Flowing sine-wave lines
  for (let i = 0; i < 3; i++) {
    const yBase = 80 + i * 120;
    let d = `M 0,${yBase}`;
    for (let x = 0; x <= VIEW_W; x += 20) {
      const y = yBase + Math.sin(x * 0.02 + i) * (15 + seedRand() * 20);
      d += ` L ${x},${y.toFixed(1)}`;
    }
    el += `<path d="${d}" fill="none" stroke="${fadeColor(accent, 0.06 + seedRand() * 0.06)}" stroke-width="1"/>`;
  }
  // Soft large circles
  for (let i = 0; i < 2; i++) {
    const r = 80 + seedRand() * 100;
    const x = seedRand() * VIEW_W;
    const y = seedRand() * VIEW_H;
    el += `<circle cx="${x}" cy="${y}" r="${r}" fill="${fadeColor(accent, 0.03)}"/>`;
  }
  return el;
}

// ── Yang-specific structured elements ──
function makeYangElements(accent, seedRand) {
  let el = '';
  // Horizontal fret-like lines
  for (let i = 0; i < 6; i++) {
    const y = 100 + i * 50;
    el += `<line x1="50" y1="${y}" x2="${VIEW_W - 50}" y2="${y}" stroke="${fadeColor(accent, 0.08)}" stroke-width="1"/>`;
  }
  // Vertical string-like lines
  for (let i = 0; i < 4; i++) {
    const x = 200 + i * 150;
    el += `<line x1="${x}" y1="50" x2="${x}" y2="${VIEW_H - 50}" stroke="${fadeColor(accent, 0.06)}" stroke-width="0.5"/>`;
  }
  return el;
}

// ── Quote decoration ──
function makeQuoteDecoration(accent) {
  const fade = fadeColor(accent, 0.15);
  return `<text x="60" y="100" font-family="serif" font-size="120" fill="${fade}" font-style="italic">"</text>` +
    `<text x="${VIEW_W - 100}" y="${VIEW_H - 60}" font-family="serif" font-size="120" fill="${fade}" font-style="italic">"</text>`;
}

// ── Meditation breathing circle ──
function makeMeditationCircle(cx, cy, radius, accent) {
  return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${fadeColor(accent, 0.2)}" stroke-width="1">` +
    `<animate attributeName="r" values="${radius * 0.8};${radius};${radius * 0.8}" dur="4s" repeatCount="indefinite"/>` +
    `</circle>` +
    `<circle cx="${cx}" cy="${cy}" r="${radius * 0.5}" fill="${fadeColor(accent, 0.08)}"/>`;
}

// ── End slide celebration ──
function makeEndCelebration(cx, cy, accent, seedRand) {
  let stars = '';
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const dist = 60 + seedRand() * 40;
    const x = cx + dist * Math.cos(angle);
    const y = cy + dist * Math.sin(angle);
    stars += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${2 + seedRand() * 3}" fill="${fadeColor(accent, 0.3 + seedRand() * 0.3)}"/>`;
  }
  return `<circle cx="${cx}" cy="${cy}" r="40" fill="none" stroke="${fadeColor(accent, 0.4)}" stroke-width="2"/>` +
    `<circle cx="${cx}" cy="${cy}" r="20" fill="${fadeColor(accent, 0.15)}"/>` +
    stars;
}

// ── Timeless song era motifs ──
const ERA_MOTIFS = {
  pythagoras: (accent) => `<text x="400" y="240" text-anchor="middle" font-family="serif" font-size="80" fill="${fadeColor(accent, 0.1)}">λ</text>`,
  troubadour: (accent) => `<text x="400" y="240" text-anchor="middle" font-family="serif" font-size="70" fill="${fadeColor(accent, 0.1)}">♪</text>`,
  boethius: (accent) => `<text x="400" y="240" text-anchor="middle" font-family="serif" font-size="70" fill="${fadeColor(accent, 0.1)}">✠</text>`,
  scriptorium: (accent) => `<text x="400" y="240" text-anchor="middle" font-family="serif" font-size="70" fill="${fadeColor(accent, 0.1)}">✍</text>`,
  guido: (accent) => `<text x="400" y="240" text-anchor="middle" font-family="serif" font-size="70" fill="${fadeColor(accent, 0.1)}">✋</text>`,
  solfege: (accent) => `<text x="400" y="240" text-anchor="middle" font-family="serif" font-size="70" fill="${fadeColor(accent, 0.1)}">♫</text>`,
  kepler: (accent) => `<circle cx="400" cy="225" r="60" fill="none" stroke="${fadeColor(accent, 0.15)}" stroke-width="1"/>` +
    `<circle cx="400" cy="225" r="40" fill="none" stroke="${fadeColor(accent, 0.1)}" stroke-width="1"/>` +
    `<circle cx="400" cy="225" r="20" fill="none" stroke="${fadeColor(accent, 0.15)}" stroke-width="1"/>`,
  mersenne: (accent) => `<text x="400" y="240" text-anchor="middle" font-family="serif" font-size="70" fill="${fadeColor(accent, 0.1)}">∿</text>`,
  cosmos: (accent) => `<text x="400" y="240" text-anchor="middle" font-family="serif" font-size="80" fill="${fadeColor(accent, 0.1)}">☽</text>`,
  luthier: (accent) => `<text x="400" y="240" text-anchor="middle" font-family="serif" font-size="70" fill="${fadeColor(accent, 0.1)}">🎸</text>`,
  machaut: (accent) => `<text x="400" y="240" text-anchor="middle" font-family="serif" font-size="70" fill="${fadeColor(accent, 0.1)}">⛪</text>`,
  instrument: (accent) => `<text x="400" y="240" text-anchor="middle" font-family="serif" font-size="70" fill="${fadeColor(accent, 0.1)}">⌘</text>`,
  diabolus: (accent) => `<text x="400" y="240" text-anchor="middle" font-family="serif" font-size="80" fill="${fadeColor(accent, 0.1)}">☿</text>`,
  ban: (accent) => `<text x="400" y="240" text-anchor="middle" font-family="serif" font-size="70" fill="${fadeColor(accent, 0.1)}">✕</text>`,
  avoided: (accent) => `<text x="400" y="240" text-anchor="middle" font-family="serif" font-size="70" fill="${fadeColor(accent, 0.1)}">?</text>`,
  rameau: (accent) => `<text x="400" y="240" text-anchor="middle" font-family="serif" font-size="70" fill="${fadeColor(accent, 0.1)}">𝄞</text>`,
  // Generic fallback
  default: (accent) => `<text x="400" y="240" text-anchor="middle" font-family="serif" font-size="60" fill="${fadeColor(accent, 0.1)}">∞</text>`,
};

function extractMotifKey(slideId) {
  const parts = slideId.split('-');
  const last = parts[parts.length - 1];
  return ERA_MOTIFS[last] ? last : 'default';
}

// ── Text overlays ──
function makeTextOverlay(title, subtitle, ratio, accent, seedRand) {
  let text = '';
  // Chapter / ratio label top-right
  if (ratio) {
    text += `<text x="${VIEW_W - 30}" y="40" text-anchor="end" font-family="monospace" font-size="14" fill="${fadeColor(accent, 0.5)}" letter-spacing="2">${ratio}</text>`;
  }
  // Subtle title at bottom
  if (title) {
    const shortTitle = typeof title === 'string' ? title : (title.en || title.fr || '');
    const display = shortTitle.length > 30 ? shortTitle.slice(0, 28) + '...' : shortTitle;
    text += `<text x="30" y="${VIEW_H - 30}" font-family="serif" font-size="18" fill="${fadeColor('#e8edf2', 0.25)}" font-style="italic">${escapeXml(display)}</text>`;
  }
  // Small "VOIX VIVE" watermark
  text += `<text x="${VIEW_W - 30}" y="${VIEW_H - 30}" text-anchor="end" font-family="monospace" font-size="10" fill="rgba(255,255,255,0.08)" letter-spacing="3">VOIX VIVE</text>`;
  return text;
}

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ═══════════════════════════════════════════════════════════
// MAIN EXPORT — Generate art for any slide
// ═══════════════════════════════════════════════════════════

const _cache = new Map();

export function generateSlideImage(slide) {
  const cacheKey = slide.id;
  if (_cache.has(cacheKey)) return _cache.get(cacheKey);

  const accent = slide.accent || '#c9a96e';
  const seed = slide.id + (slide.title?.en || slide.title || '');
  const rand = seededRandom(seed);

  const pattern = getPatternForFret(slide.fretId || 1);
  const isYin = slide.type?.startsWith('yin') || slide.type === 'timeless-song';
  const cx = VIEW_W / 2;
  const cy = VIEW_H / 2;
  const radius = 90 + rand() * 30;

  let content = '';
  let defs = '';

  // 1. Background
  content += makeBackground(accent, rand);
  content += makeGrid(rand);

  // 2. Type-specific content
  switch (slide.type) {
    case 'title': {
      content += makeGeometricMotif(cx, cy, radius, pattern.sides, accent, rand, false);
      // Large chapter numeral
      const numeral = slide.fretId || 1;
      content += `<text x="${cx}" y="${cy + 20}" text-anchor="middle" font-family="serif" font-size="140" fill="${fadeColor(accent, 0.08)}" font-weight="300">${numeral}</text>`;
      break;
    }

    case 'yin-philosophy':
    case 'yin-concept': {
      content += makeYinElements(cx, cy, accent, rand);
      content += makeGeometricMotif(cx, cy, radius * 0.7, pattern.sides, accent, rand, true);
      break;
    }

    case 'yin-quote': {
      content += makeYinElements(cx, cy, accent, rand);
      content += makeQuoteDecoration(accent);
      content += makeGeometricMotif(cx, cy, radius * 0.5, pattern.sides, accent, rand, true);
      break;
    }

    case 'yin-meditation': {
      content += makeYinElements(cx, cy, accent, rand);
      content += makeMeditationCircle(cx, cy, radius, accent);
      break;
    }

    case 'yang-instruction':
    case 'yang-theory':
    case 'yang-exercise': {
      content += makeYangElements(accent, rand);
      content += makeGeometricMotif(cx, cy, radius, pattern.sides, accent, rand, false);
      break;
    }

    case 'yang-fretboard': {
      content += makeYangElements(accent, rand);
      // Highlighted fret region
      const ff = slide.fretboardFocus;
      if (ff) {
        content += `<rect x="200" y="180" width="400" height="90" rx="4" fill="${fadeColor(accent, 0.06)}" stroke="${fadeColor(accent, 0.15)}"/>`;
        content += `<text x="400" y="230" text-anchor="middle" font-family="monospace" font-size="16" fill="${fadeColor(accent, 0.4)}">Frets ${ff.startFret}–${ff.endFret}</text>`;
      }
      break;
    }

    case 'fret-end': {
      content += makeEndCelebration(cx, cy, accent, rand);
      break;
    }

    case 'timeless-song': {
      content += makeYinElements(cx, cy, accent, rand);
      const motifKey = extractMotifKey(slide.id);
      content += ERA_MOTIFS[motifKey](accent);
      content += makeGeometricMotif(cx, cy, radius * 0.6, pattern.sides, accent, rand, true);
      break;
    }

    default: {
      content += makeGeometricMotif(cx, cy, radius, pattern.sides, accent, rand, isYin);
    }
  }

  // 3. Text overlay
  content += makeTextOverlay(slide.title, null, slide.ratio, accent, rand);

  const svg = svgWrap(content, defs);
  const dataUrl = encodeSvg(svg);
  _cache.set(cacheKey, dataUrl);
  return dataUrl;
}

export function clearSlideImageCache() {
  _cache.clear();
}

export default generateSlideImage;
