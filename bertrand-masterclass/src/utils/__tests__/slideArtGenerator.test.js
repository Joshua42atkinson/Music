import { describe, it, expect, beforeEach } from 'vitest';
import { generateSlideImage, clearSlideImageCache } from '../slideArtGenerator';

describe('slideArtGenerator', () => {
  beforeEach(() => {
    clearSlideImageCache();
  });

  it('returns a data URL for any slide', () => {
    const url = generateSlideImage({
      id: '1-title',
      type: 'title',
      accent: '#ff6b6b',
      fretId: 1,
      title: { en: 'Test' },
    });
    expect(url).toMatch(/^data:image\/svg\+xml/);
  });

  it('returns deterministic output for the same slide', () => {
    const slide = { id: '2-quote', type: 'yin-quote', accent: '#ff8e53', fretId: 2 };
    const url1 = generateSlideImage(slide);
    const url2 = generateSlideImage(slide);
    expect(url1).toBe(url2);
  });

  it('produces different output for different slides', () => {
    const url1 = generateSlideImage({ id: 'a', type: 'title', accent: '#ff6b6b', fretId: 1 });
    const url2 = generateSlideImage({ id: 'b', type: 'title', accent: '#ff6b6b', fretId: 1 });
    expect(url1).not.toBe(url2);
  });

  it('handles all slide types without crashing', () => {
    const types = [
      'title', 'yin-philosophy', 'yin-quote', 'yin-concept', 'yin-meditation',
      'yang-instruction', 'yang-theory', 'yang-exercise', 'yang-fretboard',
      'fret-end', 'timeless-song'
    ];
    types.forEach(type => {
      const url = generateSlideImage({
        id: `test-${type}`,
        type,
        accent: '#c9a96e',
        fretId: 3,
        title: { en: 'Test Slide' },
        ratio: '5:4',
      });
      expect(url).toMatch(/^data:image\/svg\+xml/);
    });
  });

  it('caches results and returns same reference on second call', () => {
    const slide = { id: 'cache-test', type: 'title', accent: '#ff6b6b', fretId: 1 };
    const url1 = generateSlideImage(slide);
    const url2 = generateSlideImage(slide);
    expect(url1).toBe(url2);
  });
});
