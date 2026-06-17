#!/usr/bin/env node
// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ SCRIPT  : injectNemotronPrompts.js                           ║
// ║ WHAT    : Parse Nemotron-generated JSON → inject into dagNodes║
// ║ WHY     : Raw Nemotron output has syntax errors & needs       ║
// ║           validation before entering production code            ║
// ║ USAGE   : node scripts/injectNemotronPrompts.js               ║
// ╚═══════════════════════════════════════════════════════════════╝

const fs = require('fs');
const path = require('path');

const GENERATED_DIR = path.join(__dirname, '..', 'src', 'data', 'dag', 'generated');
const DAG_NODES_PATH = path.join(__dirname, '..', 'src', 'data', 'dag', 'dagNodes.js');

// FRET_METADATA for validation
const FRET_METADATA = {
  1: { interval: 'Root Note', character: 'The Foundation', ratio: '1:1', cents: 0, hzExample: '82.41 Hz (E2)', emotion: 'Grounded, stable, open' },
  2: { interval: 'Minor 2nd', character: 'The Awakening', ratio: '16:15', cents: 111.7, hzExample: '87.31 Hz (F2)', emotion: 'Tense, questioning, yearning' },
  3: { interval: 'Major 2nd', character: 'The Journey', ratio: '9:8', cents: 203.9, hzExample: '92.50 Hz (F#2)', emotion: 'Moving forward, hopeful' },
  4: { interval: 'Minor 3rd', character: 'The Sorrow', ratio: '6:5', cents: 315.6, hzExample: '103.83 Hz (G#2)', emotion: 'Melancholic, deep, soulful' },
  5: { interval: 'Major 3rd', character: 'The Joy', ratio: '5:4', cents: 386.3, hzExample: '110.00 Hz (A2)', emotion: 'Bright, warm, celebratory' },
  6: { interval: 'Perfect 4th', character: 'The Strength', ratio: '4:3', cents: 498.0, hzExample: '123.47 Hz (B2)', emotion: 'Stable, powerful, grounded' },
  7: { interval: 'Tritone', character: 'The Mystery', ratio: '45:32', cents: 590.2, hzExample: '138.59 Hz (C#3)', emotion: 'Tense, mysterious, unresolved' },
  8: { interval: 'Perfect 5th', character: 'The Power', ratio: '3:2', cents: 701.9, hzExample: '146.83 Hz (D3)', emotion: 'Strong, heroic, triumphant' },
  9: { interval: 'Minor 6th', character: 'The Longing', ratio: '8:5', cents: 813.7, hzExample: '164.81 Hz (E3)', emotion: 'Nostalgic, yearning, tender' },
  10: { interval: 'Major 6th', character: 'The Love', ratio: '5:3', cents: 884.4, hzExample: '174.61 Hz (F3)', emotion: 'Warm, loving, harmonious' },
  11: { interval: 'Minor 7th', character: 'The Blues', ratio: '16:9', cents: 996.1, hzExample: '196.00 Hz (G3)', emotion: 'Soulful, earthy, grounded' },
  12: { interval: 'Major 7th', character: 'The Lead', ratio: '15:8', cents: 1088.3, hzExample: '207.65 Hz (G#3)', emotion: 'Leading, striving, reaching' },
};

const PHASE_ORDER = ['be', 'do', 'play'];
const PILLARS = ['class', 'guitar', 'workbook'];

function sanitizePrompt(raw) {
  if (!raw) return '';
  let s = String(raw);
  // Remove double "Over."
  s = s.replace(/Over\.\s*Over\./g, 'Over.');
  // Fix triple Over
  s = s.replace(/Over\.\s*Over\.\s*Over\./g, 'Over.');
  // Remove leading/trailing whitespace
  s = s.trim();
  return s;
}

function buildNode(fret, pillar, phase, promptData) {
  const meta = FRET_METADATA[fret];
  const pillarLabel = pillar === 'class' ? 'Class' : pillar === 'guitar' ? 'Guitar' : 'Workbook';
  const phaseLabel = phase === 'be' ? 'BE' : phase === 'do' ? 'DO' : 'PLAY';

  const baseId = `fret-${fret}-${pillar}-${phase}`;

  // Determine prerequisites based on pillar and phase
  const prerequisites = [];
  if (phase === 'do') {
    prerequisites.push(`fret-${fret}-${pillar}-be`);
  } else if (phase === 'play') {
    prerequisites.push(`fret-${fret}-${pillar}-do`);
  }
  // class pillar BE has no prerequisites (first node)
  if (pillar !== 'class' && phase === 'be') {
    // Guitar and workbook BE require class BE first
    prerequisites.push(`fret-${fret}-class-be`);
  }

  // Determine type based on pillar + phase
  let type = 'slide';
  if (pillar === 'guitar') {
    type = phase === 'be' ? 'tool' : 'game';
  } else if (pillar === 'workbook') {
    type = phase === 'play' ? 'submission' : 'journal';
  }

  // Determine toolId for guitar pillar
  const toolIds = { 1: 'breathing-gate', 3: 'pitch-room', 6: 'fretboard-explorer', 7: 'pling-trainer', 9: 'vertiscale-engine' };

  const node = {
    id: baseId,
    pillar,
    fret,
    phase,
    type,
    title: `${meta.interval} — ${pillarLabel} ${phaseLabel}`,
    description: promptData.description || `${phaseLabel} phase for ${meta.interval} (${pillarLabel})`,
    troubadourPrompt: sanitizePrompt(promptData.prompt),
    prerequisites,
    suggestedAfter: [],
    xpValue: phase === 'be' ? 10 : phase === 'do' ? 15 : 20,
    estimatedMinutes: phase === 'be' ? 5 : phase === 'do' ? 5 : 10,
  };

  if (pillar === 'guitar' && toolIds[fret]) {
    node.toolId = toolIds[fret];
  }

  return node;
}

function buildMilestoneNode(fret) {
  const meta = FRET_METADATA[fret];
  return {
    id: `fret-${fret}-class-milestone`,
    pillar: 'class',
    fret,
    phase: 'all',
    type: 'milestone',
    title: `Fret ${fret} Complete — ${meta.character}`,
    description: `You have imagined, heard, and played the ${meta.interval.toLowerCase()}.`,
    troubadourPrompt: `Voilà. Fret ${fret} — complete. You are an instrument playing an instrument. The ${meta.interval.toLowerCase()} is now part of your vocabulary. Bravo. Over.`,
    prerequisites: [`fret-${fret}-class-be`, `fret-${fret}-class-do`, `fret-${fret}-class-play`],
    suggestedAfter: fret < 12 ? [`fret-${fret + 1}-class-be`] : [],
    xpValue: 25,
    estimatedMinutes: 2,
    audioCue: 'completion-chime',
  };
}

function buildReflectionNode(fret, prompt) {
  const meta = FRET_METADATA[fret];
  return {
    id: `fret-${fret}-workbook-reflection`,
    pillar: 'workbook',
    fret,
    phase: 'all',
    type: 'reflection',
    title: `FHEAL — ${meta.character}`,
    description: 'No judgment. Just observation. The inner critic has no place here.',
    troubadourPrompt: sanitizePrompt(prompt),
    prerequisites: [`fret-${fret}-workbook-be`, `fret-${fret}-workbook-do`, `fret-${fret}-workbook-play`],
    suggestedAfter: [],
    xpValue: 15,
    journalPrompt: 'Without judging good or bad, describe what happened in this session in three words.',
    estimatedMinutes: 2,
  };
}

function parseNemotronFile(fretNum) {
  const filePath = path.join(GENERATED_DIR, `fret_${fretNum}_prompts.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  Missing: ${filePath}`);
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    console.error(`  ❌ JSON parse error in fret_${fretNum}: ${e.message}`);
    return null;
  }

  const content = parsed.choices?.[0]?.message?.content;
  if (!content) {
    console.warn(`  ⚠️  No content in fret_${fretNum}`);
    return null;
  }

  // Parse the inner JSON string (some files have whitespace before the {)
  let inner;
  try {
    inner = JSON.parse(content.trim());
  } catch (e) {
    console.error(`  ❌ Inner JSON parse error in fret_${fretNum}: ${e.message}`);
    return null;
  }

  // Validate required keys
  const required = ['class-be', 'class-do', 'class-play', 'class-milestone',
    'guitar-be', 'guitar-do', 'guitar-play',
    'workbook-be', 'workbook-do', 'workbook-play', 'workbook-reflection'];

  const missing = required.filter(k => !(k in inner));
  if (missing.length > 0) {
    console.warn(`  ⚠️  Missing keys in fret_${fretNum}: ${missing.join(', ')}`);
  }

  return inner;
}

function generateFretNodes(fretNum, prompts) {
  const nodes = [];

  for (const pillar of PILLARS) {
    for (const phase of PHASE_ORDER) {
      const key = `${pillar}-${phase}`;
      const prompt = prompts[key];
      if (!prompt) {
        console.warn(`    ⚠️  Missing prompt for ${key}, using fallback`);
      }
      const node = buildNode(fretNum, pillar, phase, {
        prompt: prompt || `Explore the ${FRET_METADATA[fretNum].interval} in the ${pillar} pillar. ${phase.toUpperCase()} phase. Over.`,
      });
      nodes.push(node);
    }
  }

  // Milestone
  nodes.push(buildMilestoneNode(fretNum));

  // Reflection
  nodes.push(buildReflectionNode(fretNum, prompts['workbook-reflection']));

  return nodes;
}

function injectIntoDagNodes(generatedArrays) {
  let dagContent = fs.readFileSync(DAG_NODES_PATH, 'utf8');

  // Find the dagNodes export and replace it
  const exportRegex = /export const dagNodes = \[\n\s*\.\.\.FRET_1_NODES,\n\s*\/\/ Fret 2-12 will be added by Nemotron-generated content\n\s*\/\/ then validated and integrated by Cascade\n\s*\];/;

  const newExport = `export const dagNodes = [
  ...FRET_1_NODES,
${generatedArrays.map((_, i) => `  ...FRET_${i + 2}_NODES,`).join('\n')}
];`;

  if (!exportRegex.test(dagContent)) {
    // Try simpler pattern
    const simpleRegex = /export const dagNodes = \[\n\s*\.\.\.FRET_1_NODES,[\s\S]*?\];/;
    if (!simpleRegex.test(dagContent)) {
      console.error('❌ Could not find dagNodes export pattern');
      process.exit(1);
    }
    dagContent = dagContent.replace(simpleRegex, newExport);
  } else {
    dagContent = dagContent.replace(exportRegex, newExport);
  }

  // Append the generated arrays before the export
  const generatedCode = generatedArrays.map((nodes, i) => {
    const fretNum = i + 2;
    return `// ── FRET ${fretNum}: ${FRET_METADATA[fretNum]?.interval || 'Unknown'} ──

const FRET_${fretNum}_NODES = ${JSON.stringify(nodes, null, 2)};`;
  }).join('\n\n');

  // Insert generated arrays before the export
  dagContent = dagContent.replace(
    /(\/\/ ── LOOKUP FUNCTIONS ──)/,
    `${generatedCode}\n\n$1`
  );

  fs.writeFileSync(DAG_NODES_PATH, dagContent, 'utf8');
  console.log(`✅ Updated ${DAG_NODES_PATH}`);
}

// ── MAIN ──
console.log('🔧 Injecting Nemotron prompts into dagNodes.js...\n');

const allGenerated = [];
let successCount = 0;
let failCount = 0;

for (let fret = 2; fret <= 12; fret++) {
  process.stdout.write(`  Fret ${fret}... `);
  const prompts = parseNemotronFile(fret);
  if (prompts) {
    const nodes = generateFretNodes(fret, prompts);
    allGenerated.push(nodes);
    console.log(`✅ ${nodes.length} nodes`);
    successCount++;
  } else {
    // Use fallback nodes if Nemotron file is missing/broken
    const fallbackPrompts = {};
    const meta = FRET_METADATA[fret];
    for (const p of PILLARS) {
      for (const ph of PHASE_ORDER) {
        fallbackPrompts[`${p}-${ph}`] = `Explore the ${meta.interval} in the ${p} pillar. ${ph.toUpperCase()} phase. Over.`;
      }
    }
    fallbackPrompts['workbook-reflection'] = 'FHEAL: Feel, Hold, Embrace, Accept, Let go. Over.';
    fallbackPrompts['class-milestone'] = `Voilà. Fret ${fret} — complete. Bravo. Over.`;
    const nodes = generateFretNodes(fret, fallbackPrompts);
    allGenerated.push(nodes);
    console.log(`⚠️  fallback (${nodes.length} nodes)`);
    failCount++;
  }
}

console.log(`\n📊 Results: ${successCount} parsed, ${failCount} fallback`);
console.log(`📦 Total nodes to inject: ${allGenerated.reduce((s, n) => s + n.length, 0)}`);

injectIntoDagNodes(allGenerated);

console.log('\n🎉 Done! Run `npm run build` to verify.');
