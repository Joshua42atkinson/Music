// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : ragStore.test.js                                   ║
// ║ WHAT    : Unit tests for RAG vector store                    ║
// ║ WHY     : RAG retrieval must be correct before AI uses it    ║
// ║ STAGE   : TEST                                               ║
// ╚═══════════════════════════════════════════════════════════════╝

import { describe, test, expect } from 'vitest';
import { chunkText, buildContextBlock } from '../ragStore';

describe('RAG Store — chunkText', () => {
  test('returns single chunk for short text', () => {
    const chunks = chunkText('Hello world', { maxLength: 500 });
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe('Hello world');
  });

  test('splits long text by paragraphs', () => {
    const text = 'First paragraph.\n\nSecond paragraph with more content here.';
    const chunks = chunkText(text, { maxLength: 50 });
    expect(chunks.length).toBeGreaterThanOrEqual(2);
  });

  test('strips overlap markers from context block', () => {
    const chunks = [
      { text: 'First chunk <!--overlap-->overlap text<!--/overlap-->second chunk', metadata: { source: 'test' } }
    ];
    const block = buildContextBlock(chunks);
    expect(block).not.toContain('<!--overlap-->');
    expect(block).toContain('second chunk');
    expect(block).not.toContain('overlap text');
  });

  test('returns empty string for no chunks', () => {
    expect(buildContextBlock([])).toBe('');
    expect(buildContextBlock(null)).toBe('');
  });

  test('includes source and fret in context block', () => {
    const chunks = [
      { text: 'Play the minor 3rd slowly.', metadata: { source: 'dag-curriculum', fret: 4, phase: 'be', title: 'Test' } }
    ];
    const block = buildContextBlock(chunks);
    expect(block).toContain('[dag-curriculum]');
    expect(block).toContain('Fret 4');
    expect(block).toContain('BE');
  });
});
