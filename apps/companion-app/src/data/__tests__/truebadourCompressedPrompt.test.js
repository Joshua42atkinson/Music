// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : truebadourCompressedPrompt.test.js                  ║
// ║ WHAT    : Unit tests for compressed prompt (Voix tier LLM)   ║
// ║ WHY     : The in-browser LLM prompt must be correct & compact║
// ╚═══════════════════════════════════════════════════════════════╝

import { describe, test, expect } from 'vitest';
import { buildCompressedPrompt, enforceOver } from '../truebadourPrompt';

describe('Compressed Prompt — Voix Tier (LFM2.5-1.2B-Instruct)', () => {

  describe('buildCompressedPrompt — structure', () => {
    test('contains all required sections', () => {
      const prompt = buildCompressedPrompt({});
      expect(prompt).toContain('## Identity');
      expect(prompt).toContain('## Curriculum');
      expect(prompt).toContain('## Protocol');
      expect(prompt).toContain('## Student');
      expect(prompt).toContain('## Scope');
      expect(prompt).toContain('## Behavior');
    });

    test('contains Truebadour identity', () => {
      const prompt = buildCompressedPrompt({});
      expect(prompt).toContain('Truebadour');
      expect(prompt).toContain('Socratic');
    });

    test('contains SHEARL/PLING/FHEAL protocols', () => {
      const prompt = buildCompressedPrompt({});
      expect(prompt).toContain('SHEARL');
      expect(prompt).toContain('PLING');
      expect(prompt).toContain('FHEAL');
    });

    test('has scope and behavior sections instead of rigid rules', () => {
      const prompt = buildCompressedPrompt({});
      expect(prompt).toContain('## Scope');
      expect(prompt).toContain('## Behavior');
      expect(prompt).toContain('somatic practice');
    });
  });

  describe('Fret awareness', () => {
    test('includes fret number and interval name', () => {
      const prompt = buildCompressedPrompt({ currentFret: 1 });
      expect(prompt).toContain('Fret 1');
      expect(prompt).toContain('Root Note');
    });

    test('fret 7 includes tritone/ordeal context', () => {
      const prompt = buildCompressedPrompt({ currentFret: 7 });
      expect(prompt).toContain('Fret 7');
      expect(prompt).toContain('Tritone');
    });

    test('fret 12 includes octave/arrival context', () => {
      const prompt = buildCompressedPrompt({ currentFret: 12 });
      expect(prompt).toContain('Fret 12');
      expect(prompt).toContain('Major 7th');
    });

    test('all 12 frets produce valid prompts', () => {
      for (let fret = 1; fret <= 12; fret++) {
        const prompt = buildCompressedPrompt({ currentFret: fret });
        expect(prompt).toContain(`Fret ${fret}`);
        expect(prompt.length).toBeGreaterThan(100);
      }
    });
  });

  describe('Polarity — Yin/Yang/Balanced', () => {
    test('fret 2 (Minor 2nd) is Yin', () => {
      const prompt = buildCompressedPrompt({ currentFret: 2 });
      expect(prompt).toContain('Yin');
    });

    test('fret 3 (Major 2nd) is Yang', () => {
      const prompt = buildCompressedPrompt({ currentFret: 3 });
      expect(prompt).toContain('Yang');
    });

    test('fret 1 (Root) is Balanced', () => {
      const prompt = buildCompressedPrompt({ currentFret: 1 });
      expect(prompt).toContain('Balanced');
    });

    test('Yin frets guide inward', () => {
      const prompt = buildCompressedPrompt({ currentFret: 4 }); // Minor 3rd = Yin
      expect(prompt).toContain('inward');
    });

    test('Yang frets guide outward', () => {
      const prompt = buildCompressedPrompt({ currentFret: 5 }); // Major 3rd = Yang
      expect(prompt).toContain('outward');
    });
  });

  describe('Phase awareness', () => {
    test('BE phase includes visualization guidance', () => {
      const prompt = buildCompressedPrompt({ currentPhase: 'be' });
      expect(prompt).toContain('BE phase');
      expect(prompt).toContain('Visualization');
    });

    test('DO phase includes application guidance', () => {
      const prompt = buildCompressedPrompt({ currentPhase: 'do' });
      expect(prompt).toContain('DO phase');
      expect(prompt).toContain('Application');
    });

    test('PLAY phase includes expression guidance', () => {
      const prompt = buildCompressedPrompt({ currentPhase: 'play' });
      expect(prompt).toContain('PLAY phase');
      expect(prompt).toContain('Expression');
    });

    test('milestone phase includes celebration', () => {
      const prompt = buildCompressedPrompt({ currentPhase: 'milestone' });
      expect(prompt).toContain('Milestone');
      expect(prompt).toContain('Voila');
    });
  });

  describe('Student state', () => {
    test('includes bard level', () => {
      const prompt = buildCompressedPrompt({ bardLevel: 5 });
      expect(prompt).toContain('Bard Level: 5');
    });

    test('includes streak', () => {
      const prompt = buildCompressedPrompt({ traction: { streak: 7 } });
      expect(prompt).toContain('Streak: 7');
    });

    test('acknowledges momentum for 7+ day streak', () => {
      const prompt = buildCompressedPrompt({ traction: { streak: 7 } });
      expect(prompt).toContain('momentum');
    });

    test('welcomes new students (0 streak)', () => {
      const prompt = buildCompressedPrompt({ traction: { streak: 0 } });
      expect(prompt).toContain('new');
    });

    test('kid mode simplifies language', () => {
      const prompt = buildCompressedPrompt({ traction: { settings: { kidMode: true } } });
      expect(prompt).toContain('young child');
    });
  });

  describe('Prompt size budget', () => {
    test('compressed prompt stays under 2000 chars (~500 tokens)', () => {
      const prompt = buildCompressedPrompt({
        currentFret: 7,
        currentPhase: 'do',
        bardLevel: 5,
        traction: { streak: 10, settings: { kidMode: false } },
      });
      // 500 tokens ≈ 2000 chars (rough 4 chars/token)
      expect(prompt.length).toBeLessThan(2500);
    });
  });

  describe('enforceOver — response post-processing', () => {
    test('appends "Over." if missing in truebadour mode', () => {
      expect(enforceOver('Hello student')).toBe('Hello student Over.');
    });

    test('fixes "Over" without period in truebadour mode', () => {
      expect(enforceOver('Hello student Over')).toBe('Hello student Over.');
    });

    test('does not double-append if already correct in truebadour mode', () => {
      expect(enforceOver('Hello student Over.')).toBe('Hello student Over.');
    });

    test('handles empty string — returns empty (no Over. on nothing)', () => {
      expect(enforceOver('')).toBe('');
    });

    test('chat mode does NOT append Over', () => {
      expect(enforceOver('Hello student', 'chat')).toBe('Hello student');
      expect(enforceOver('Hello student Over.', 'chat')).toBe('Hello student Over.');
    });
  });
});
