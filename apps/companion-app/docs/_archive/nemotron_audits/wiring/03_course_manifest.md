---
title: 03_course_manifest
status: archive
tags: []
date: 2026-06-14
---
**Reasoning:**  
I created an array of 12 module objects—one for each fret (or semitone) within an octave starting from the root note. Each object includes a unique `id` (`fret-1` … `fret-12`), a descriptive title, a concise description, learning objectives written with Bloom’s Taxonomy verbs, an estimated completion time, and prerequisite IDs that point to the immediately preceding module (except for the first). All strings use single quotes to match the requested style.

```javascript
// src/data/courseManifest.js

const courseManifest = [
  {
    id: 'fret-1',
    title: 'The Root Note',
    description: 'Introduce the concept of root notes on each string and how they relate to chord construction.',
    objectives: [
      'Identify every occurrence of a chosen pitch (e.g., C) across all six strings.',
      'Demonstrate playing an open‑position major triad using that note as its tonal center.'
    ],
    estimatedTime: '45 minutes',
    prerequisites: []
  },
  {
    id: 'fret-2',
    title: 'Minor Second Interval (♭2)',
    description: 'Explore the sound and finger placement of a half‑step above the root note.',
    objectives: [
      'Identify minor seconds on every string by ear.',
      'Demonstrate playing chromatic passages that use only adjacent frets.'
    ],
    estimatedTime: '40 minutes',
    prerequisites: ['fret-1']
  },
  {
    id: 'fret-3',
    title: 'Major Second Interval (2)',
    description: 'Study the whole‑step above the root and its role in melodic movement.',
    objectives: [
      'Identify major seconds on each string both visually and aurally.',
      'Demonstrate simple two‑note motifs that outline a major second.'
    ],
    estimatedTime: '40 minutes',
    prerequisites: ['fret-2']
  },
  {
    id: 'fret-4',
    title: 'Minor Third Interval (♭3)',
    description: 'Learn the melancholic quality of a minor third and its use in minor chords.',
    objectives: [
      'Identify minor‑third shapes on all strings.',
      'Demonstrate forming a basic minor triad using the root, ♭3, and perfect fifth.'
    ],
    estimatedTime: '45 minutes',
    prerequisites: ['fret-3']
  },
  {
    id: 'fret-5',
    title: 'Major Third Interval (3)',
    description: 'Examine the bright sound of a major third and its place in major chords.',
    objectives: [
      'Identify major‑third locations on each string.',
      'Demonstrate building an open‑position C, G or D chord using root–major 3rd–perfect fifth.'
    ],
    estimatedTime: '45 minutes',
    prerequisites: ['fret-4']
  },
  {
    id: 'fret-6',
    title: 'Perfect Fourth Interval (4)',
    description: 'Investigate the stable, consonant sound of a perfect fourth and its role in sus chords.',
    objectives: [
      'Identify perfect‑fourth intervals on every string.',
      'Demonstrate playing suspended‑second/suspended‑four voicings.'
    ],
    estimatedTime: '40 minutes',
    prerequisites: ['fret-5']
  },
  {
    id: 'fret-7',
    title: 'Tritone / Augmented Fourth (♯4/♭5)',
    description: 'Explore the dissonant tritone, its resolution tendencies and use in blues/jazz.',
    objectives: [
      'Identify tritone shapes on each string.',
      'Demonstrate resolving a ♯4 to a perfect fifth or minor sixth.'
    ],
    estimatedTime: '45 minutes',
    prerequisites: ['fret-6']
  },
  {
    id: 'fret-8',
    title: 'Perfect Fifth Interval (5)',
    description: 'Study the power‑chord foundation of the perfect fifth and its harmonic stability.',
    objectives: [
      'Identify perfect‑fifth shapes across all strings.',
      'Demonstrate forming movable power chords using root + fifth.'
    ],
    estimatedTime: '40 minutes',
    prerequisites: ['fret-7']
  },
  {
    id: 'fret-9',
    title: 'Minor Sixth Interval (♭6)',
    description: 'Learn the warm, slightly dark color of a minor sixth and its use in minor‑six chords.',
    objectives: [
      'Identify minor‑sixth locations on each string.',
      'Demonstrate playing an Am6 shape using root–minor 3rd–5th–♭6.'
    ],
    estimatedTime: '40 minutes',
    prerequisites: ['fret-8']
  },
  {
    id: 'fret-10',
    title: 'Major Sixth Interval (6)',
    description: 'Examine the uplifting quality of a major sixth and its appearance in add‑6 chords.',
    objectives: [
      'Identify major‑sixth shapes on every string.',
      'Demonstrate constructing an open Cadd9 or G6 voicing.'
    ],
    estimatedTime: '40 minutes',
    prerequisites: ['fret-9']
  },
  {
    id: 'fret-11',
    title: 'Minor Seventh Interval (♭7)',
    description: 'Study the bluesy flavor of a minor seventh and its role in dominant‑seventh chords.',
    objectives: [
      'Identify ♭7 positions on each string.',
      'Demonstrate forming movable 7th chord shapes using root–3rd–5th–♭7.'
    ],
    estimatedTime: '45 minutes',
    prerequisites: ['fret-10']
  },
  {
    id: 'fret-12',
    title: 'Major Seventh Interval (7)',
    description: 'Explore the dreamy sound of a major seventh and its use in maj7 chords.',
    objectives: [
      'Identify major‑seventh locations on every string.',
      'Demonstrate playing an open Cmaj7 shape using root–3rd–5th–7.'
    ],
    estimatedTime: '40 minutes',
    prerequisites: ['fret-11']
  }
];

export default courseManifest;
```