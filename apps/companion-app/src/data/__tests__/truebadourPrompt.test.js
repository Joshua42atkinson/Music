// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : truebadourPrompt.test.js                           ║
// ║ WHAT    : Unit tests for Truebadour prompt generator         ║
// ║ WHY     : Validates dynamic archetype and polarity injection ║
// ║ STAGE   : TEST (AI+DAG Harmonization Phase B)                ║
// ╚═══════════════════════════════════════════════════════════════╝

import { describe, test, expect } from 'vitest';
import { buildTruebadourPrompt, buildChatPrompt, enforceOver } from '../truebadourPrompt';

describe('Truebadour Prompt Compiler', () => {
  test('should generate default prompt structure', () => {
    const prompt = buildTruebadourPrompt({});
    expect(prompt).toContain('You are the Truebadour');
    expect(prompt).toContain('STUDENT BARD ARCHETYPE');
  });

  test('should adapt tone for Yin vs Yang polarities based on fret', () => {
    const promptFret2 = buildTruebadourPrompt({ currentFret: 2 }); // Yin
    const promptFret3 = buildTruebadourPrompt({ currentFret: 3 }); // Yang

    expect(promptFret2).toContain('Yin');
    expect(promptFret3).toContain('Yang');
  });

  test('should inject the overridden Truebadour Type when selected', () => {
    const promptStoryteller = buildTruebadourPrompt({
      traction: { truebadourTypeOverride: 'storyteller' }
    });
    const promptCraftsman = buildTruebadourPrompt({
      traction: { truebadourTypeOverride: 'craftsman' }
    });

    expect(promptStoryteller).toContain('The Storyteller');
    expect(promptCraftsman).toContain('The Craftsman');
  });

  test('chat prompt is natural and does not force Over', () => {
    const prompt = buildChatPrompt({});
    expect(prompt).toContain('warm and experienced guitar teacher');
    expect(prompt).toContain('not a character');
    // Prompt tells the AI NOT to say Over
    expect(prompt).toContain('Don\'t say "Over."');
    expect(prompt).toContain('Be conversational');
  });

  test('should enforce the Over. terminal protocol in truebadour mode', () => {
    expect(enforceOver('Hello student')).toBe('Hello student Over.');
    expect(enforceOver('Hello student Over')).toBe('Hello student Over.');
    expect(enforceOver('Hello student Over.')).toBe('Hello student Over.');
  });

  test('chat mode does not enforce Over', () => {
    expect(enforceOver('Hello student', 'chat')).toBe('Hello student');
    expect(enforceOver('Hello student Over.', 'chat')).toBe('Hello student Over.');
  });
});
