import { describe, it, expect } from 'vitest';
import { generateSlides } from '../slideGenerator';
import frets from '../chapterData';

describe('slideGenerator', () => {
  it('generates slides for all 12 chapters without errors', () => {
    frets.forEach(fret => {
      const slides = generateSlides(fret);
      expect(slides).toBeInstanceOf(Array);
      expect(slides.length).toBeGreaterThan(0);
    });
  });

  it('produces unique slide IDs within each chapter', () => {
    frets.forEach(fret => {
      const slides = generateSlides(fret);
      const ids = slides.map(s => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  it('always produces a title slide as the first slide', () => {
    frets.forEach(fret => {
      const slides = generateSlides(fret);
      expect(slides[0].type).toBe('title');
      expect(slides[0].id).toBe(`${fret.id}-title`);
    });
  });

  it('always produces an end slide as the last slide', () => {
    frets.forEach(fret => {
      const slides = generateSlides(fret);
      const last = slides[slides.length - 1];
      expect(last.type).toBe('fret-end');
      expect(last.id).toBe(`${fret.id}-end`);
    });
  });

  it('maps exercise images only for exercises that exist', () => {
    // Chapter 1 has 2 exercises — verify no orphaned image mapping
    const ch1 = frets.find(f => f.id === 1);
    const ch1Slides = generateSlides(ch1);
    const exerciseSlides = ch1Slides.filter(s => s.type === 'yang-exercise');
    expect(exerciseSlides.length).toBe(ch1.yang.exercises.length);
    expect(exerciseSlides.length).toBe(2);
  });

  it('handles chapters with exercises correctly', () => {
    const ch12 = frets.find(f => f.id === 12);
    const ch12Slides = generateSlides(ch12);
    const exerciseSlides = ch12Slides.filter(s => s.type === 'yang-exercise');
    expect(exerciseSlides.length).toBe(ch12.yang.exercises.length);
    expect(exerciseSlides.length).toBe(1);
  });

  it('assigns image property to every slide (may be null)', () => {
    frets.forEach(fret => {
      const slides = generateSlides(fret);
      slides.forEach(slide => {
        expect(slide).toHaveProperty('image');
        // image should be either a string path or null, never undefined
        expect(slide.image === null || typeof slide.image === 'string').toBe(true);
      });
    });
  });

  it('includes timeless-song slides when available', () => {
    frets.forEach(fret => {
      const slides = generateSlides(fret);
      const timelessSlides = slides.filter(s => s.type === 'timeless-song');
      // Every chapter should have 3 timeless-song slides
      expect(timelessSlides.length).toBe(3);
    });
  });

  it('includes western theory slide when data exists', () => {
    frets.forEach(fret => {
      const slides = generateSlides(fret);
      const theorySlides = slides.filter(s => s.type === 'yang-theory');
      if (fret.westernTheory) {
        expect(theorySlides.length).toBe(1);
      } else {
        expect(theorySlides.length).toBe(0);
      }
    });
  });
});
