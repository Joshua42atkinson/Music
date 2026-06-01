// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : troubadourPrompt.test.js                           ║
// ║ WHAT    : Unit tests for Troubadour prompt generator         ║
// ║ WHY     : Validates dynamic archetype and polarity injection ║
// ║ STAGE   : TEST (AI+DAG Harmonization Phase B)                ║
// ╚═══════════════════════════════════════════════════════════════╝

import { describe, test, expect } from 'vitest';
import { buildTroubadourPrompt, buildChatPrompt, enforceOver } from '../troubadourPrompt';

describe('Troubadour Prompt Compiler', () => {
  test('should generate default prompt structure', () => {
    const prompt = buildTroubadourPrompt({});
    expect(prompt).toContain('You are the Troubadour');
    expect(prompt).toContain('STUDENT BARD ARCHETYPE');
  });

  test('should adapt tone for Yin vs Yang polarities based on fret', () => {
    const promptFret2 = buildTroubadourPrompt({ currentFret: 2 }); // Yin
    const promptFret3 = buildTroubadourPrompt({ currentFret: 3 }); // Yang

    expect(promptFret2).toContain('Yin');
    expect(promptFret3).toContain('Yang');
  });

  test('should inject the overridden Troubadour Type when selected', () => {
    const promptStoryteller = buildTroubadourPrompt({
      traction: { troubadourTypeOverride: 'storyteller' }
    });
    const promptCraftsman = buildTroubadourPrompt({
      traction: { troubadourTypeOverride: 'craftsman' }
    });

    expect(promptStoryteller).toContain('The Storyteller');
    expect(promptCraftsman).toContain('The Craftsman');
  });

  test('chat prompt is natural and does not force Over', () => {
    const prompt = buildChatPrompt({});
    expect(prompt).toContain('helpful guitar tutor');
    expect(prompt).toContain('not a character');
    // Prompt tells the AI NOT to say Over
    expect(prompt).toContain('Do NOT say "Over."');
    expect(prompt).toContain('Answer questions directly');
  });

  test('should enforce the Over. terminal protocol in troubadour mode', () => {
    expect(enforceOver('Hello student')).toBe('Hello student Over.');
    expect(enforceOver('Hello student Over')).toBe('Hello student Over.');
    expect(enforceOver('Hello student Over.')).toBe('Hello student Over.');
  });

  test('chat mode does not enforce Over', () => {
    expect(enforceOver('Hello student', 'chat')).toBe('Hello student');
    expect(enforceOver('Hello student Over.', 'chat')).toBe('Hello student Over.');
  });
});
