// ═══════════════════════════════════════════════════════════
// SLIDE GENERATOR — Converts chapterData into swipeable slides
// Each chapter becomes a deck of bite-sized phone-friendly slides
// ═══════════════════════════════════════════════════════════

/**
 * Generates an array of slide objects from a chapter.
 * Each slide: { id, type, title, body, image, accent, chapter }
 * Types: 'title' | 'yin-philosophy' | 'yin-quote' | 'yin-concept' | 'yin-meditation' | 'yang-instruction' | 'yang-exercise' | 'yang-fretboard' | 'chapter-end'
 */
/**
 * Per-slide image mapping.
 * Key: slideId, Value: path to image in /public/assets/slides/
 * Images are generated per chapter; chapters without images use gradient fallback.
 */
const SLIDE_IMAGES = {
  // ── Chapter 1: The Root Note (15 images) ──
  '1-title':      '/assets/slides/ch1/title.png',
  '1-yin-0':      '/assets/slides/ch1/yin-tension.png',
  '1-yin-1':      '/assets/slides/ch1/yin-alchemy.png',
  '1-quote':      '/assets/slides/ch1/quote.png',
  '1-concept-0':  '/assets/slides/ch1/concept-kinesthesis.png',
  '1-concept-1':  '/assets/slides/ch1/concept-fascia.png',
  '1-concept-2':  '/assets/slides/ch1/concept-sympathetic.png',
  '1-concept-3':  '/assets/slides/ch1/concept-vagal.png',
  '1-meditation': '/assets/slides/ch1/meditation.png',
  '1-yang-intro': '/assets/slides/ch1/yang-intro.png',
  '1-exercise-0': '/assets/slides/ch1/exercise-0.png',
  '1-exercise-1': '/assets/slides/ch1/exercise-1.png',
  '1-exercise-2': '/assets/slides/ch1/exercise-2.png',
  '1-fretboard':  '/assets/slides/ch1/fretboard.png',
  '1-end':        '/assets/slides/ch1/end.png',

  // ── Chapter 2: The Call (9 images) ──
  '2-title':      '/assets/slides/ch2/title.png',
  '2-yin-0':      '/assets/slides/ch2/yin-0.png',
  '2-quote':      '/assets/slides/ch2/quote.png',
  '2-meditation': '/assets/slides/ch2/meditation.png',
  '2-yang-intro': '/assets/slides/ch2/yang-intro.png',
  '2-exercise-0': '/assets/slides/ch2/exercise-0.png',
  '2-exercise-1': '/assets/slides/ch2/exercise-1.png',
  '2-fretboard':  '/assets/slides/ch2/fretboard.png',
  '2-end':        '/assets/slides/ch2/end.png',

  // ── Chapter 3: The Refusal (9 images) ──
  '3-title':      '/assets/slides/ch3/title.png',
  '3-yin-0':      '/assets/slides/ch3/yin-0.png',
  '3-quote':      '/assets/slides/ch3/quote.png',
  '3-meditation': '/assets/slides/ch3/meditation.png',
  '3-yang-intro': '/assets/slides/ch3/yang-intro.png',
  '3-exercise-0': '/assets/slides/ch3/exercise-0.png',
  '3-exercise-1': '/assets/slides/ch3/exercise-1.png',
  '3-fretboard':  '/assets/slides/ch3/fretboard.png',
  '3-end':        '/assets/slides/ch3/end.png',

  // ── Chapter 4: The Mentor (9 images) ──
  '4-title':      '/assets/slides/ch4/title.png',
  '4-yin-0':      '/assets/slides/ch4/yin-0.png',
  '4-quote':      '/assets/slides/ch4/quote.png',
  '4-meditation': '/assets/slides/ch4/meditation.png',
  '4-yang-intro': '/assets/slides/ch4/yang-intro.png',
  '4-exercise-0': '/assets/slides/ch4/exercise-0.png',
  '4-exercise-1': '/assets/slides/ch4/exercise-1.png',
  '4-fretboard':  '/assets/slides/ch4/fretboard.png',
  '4-end':        '/assets/slides/ch4/end.png',

  // ── Chapter 5: The Threshold (9 images) ──
  '5-title':      '/assets/slides/ch5/title.png',
  '5-yin-0':      '/assets/slides/ch5/yin-0.png',
  '5-quote':      '/assets/slides/ch5/quote.png',
  '5-meditation': '/assets/slides/ch5/meditation.png',
  '5-yang-intro': '/assets/slides/ch5/yang-intro.png',
  '5-exercise-0': '/assets/slides/ch5/exercise-0.png',
  '5-exercise-1': '/assets/slides/ch5/exercise-1.png',
  '5-fretboard':  '/assets/slides/ch5/fretboard.png',
  '5-end':        '/assets/slides/ch5/end.png',

  // ── Chapter 6: The Tests (9 images) ──
  '6-title':      '/assets/slides/ch6/title.png',
  '6-yin-0':      '/assets/slides/ch6/yin-0.png',
  '6-quote':      '/assets/slides/ch6/quote.png',
  '6-meditation': '/assets/slides/ch6/meditation.png',
  '6-yang-intro': '/assets/slides/ch6/yang-intro.png',
  '6-exercise-0': '/assets/slides/ch6/exercise-0.png',
  '6-exercise-1': '/assets/slides/ch6/exercise-1.png',
  '6-fretboard':  '/assets/slides/ch6/fretboard.png',
  '6-end':        '/assets/slides/ch6/end.png',

  // ── Chapter 7: The Inmost Cave (9 images) ──
  '7-title':      '/assets/slides/ch7/title.png',
  '7-yin-0':      '/assets/slides/ch7/yin-0.png',
  '7-quote':      '/assets/slides/ch7/quote.png',
  '7-meditation': '/assets/slides/ch7/meditation.png',
  '7-yang-intro': '/assets/slides/ch7/yang-intro.png',
  '7-exercise-0': '/assets/slides/ch7/exercise-0.png',
  '7-exercise-1': '/assets/slides/ch7/exercise-1.png',
  '7-fretboard':  '/assets/slides/ch7/fretboard.png',
  '7-end':        '/assets/slides/ch7/end.png',

  // ── Chapter 8: The Ordeal (9 images) ──
  '8-title':      '/assets/slides/ch8/title.png',
  '8-yin-0':      '/assets/slides/ch8/yin-0.png',
  '8-quote':      '/assets/slides/ch8/quote.png',
  '8-meditation': '/assets/slides/ch8/meditation.png',
  '8-yang-intro': '/assets/slides/ch8/yang-intro.png',
  '8-exercise-0': '/assets/slides/ch8/exercise-0.png',
  '8-exercise-1': '/assets/slides/ch8/exercise-1.png',
  '8-fretboard':  '/assets/slides/ch8/fretboard.png',
  '8-end':        '/assets/slides/ch8/end.png',

  // ── Chapter 9: The Sword (9 images) ──
  '9-title':      '/assets/slides/ch9/title.png',
  '9-yin-0':      '/assets/slides/ch9/yin-0.png',
  '9-quote':      '/assets/slides/ch9/quote.png',
  '9-meditation': '/assets/slides/ch9/meditation.png',
  '9-yang-intro': '/assets/slides/ch9/yang-intro.png',
  '9-exercise-0': '/assets/slides/ch9/exercise-0.png',
  '9-exercise-1': '/assets/slides/ch9/exercise-1.png',
  '9-fretboard':  '/assets/slides/ch9/fretboard.png',
  '9-end':        '/assets/slides/ch9/end.png',

  // ── Chapter 10: The Road Back (9 images) ──
  '10-title':      '/assets/slides/ch10/title.png',
  '10-yin-0':      '/assets/slides/ch10/yin-0.png',
  '10-quote':      '/assets/slides/ch10/quote.png',
  '10-meditation': '/assets/slides/ch10/meditation.png',
  '10-yang-intro': '/assets/slides/ch10/yang-intro.png',
  '10-exercise-0': '/assets/slides/ch10/exercise-0.png',
  '10-exercise-1': '/assets/slides/ch10/exercise-1.png',
  '10-fretboard':  '/assets/slides/ch10/fretboard.png',
  '10-end':        '/assets/slides/ch10/end.png',

  // ── Chapter 11: Resurrection (9 images) ──
  '11-title':      '/assets/slides/ch11/title.png',
  '11-yin-0':      '/assets/slides/ch11/yin-0.png',
  '11-quote':      '/assets/slides/ch11/quote.png',
  '11-meditation': '/assets/slides/ch11/meditation.png',
  '11-yang-intro': '/assets/slides/ch11/yang-intro.png',
  '11-exercise-0': '/assets/slides/ch11/exercise-0.png',
  '11-exercise-1': '/assets/slides/ch11/exercise-1.png',
  '11-fretboard':  '/assets/slides/ch11/fretboard.png',
  '11-end':        '/assets/slides/ch11/end.png',

  // ── Chapter 12: The Octave (9 images) ──
  '12-title':      '/assets/slides/ch12/title.png',
  '12-yin-0':      '/assets/slides/ch12/yin-0.png',
  '12-quote':      '/assets/slides/ch12/quote.png',
  '12-meditation': '/assets/slides/ch12/meditation.png',
  '12-yang-intro': '/assets/slides/ch12/yang-intro.png',
  '12-exercise-0': '/assets/slides/ch12/exercise-0.png',
  '12-exercise-1': '/assets/slides/ch12/exercise-1.png',
  '12-fretboard':  '/assets/slides/ch12/fretboard.png',
  '12-end':        '/assets/slides/ch12/end.png',
};

export function generateSlides(chapter) {
  const slides = [];
  const accent = chapter.color;
  const base = { accent, chapterId: chapter.id, chapterTitle: chapter.title };

  // 1. Title slide
  slides.push({
    ...base,
    id: `${chapter.id}-title`,
    type: 'title',
    label: `CHAPTER ${chapter.id} · FRET ${chapter.fret}`,
    title: chapter.title,
    subtitle: chapter.subtitle,
    body: chapter.coreMessage,
    meta: `${chapter.interval} · ${chapter.heroStage}`,
    icon: chapter.icon,
    image: SLIDE_IMAGES[`${chapter.id}-title`] || null
  });

  // 2. Yin Philosophy slides — split into paragraphs
  const yinParagraphs = chapter.yin.philosophy.split('\n\n');
  yinParagraphs.forEach((para, i) => {
    slides.push({
      ...base,
      id: `${chapter.id}-yin-${i}`,
      type: 'yin-philosophy',
      label: `☽ YIN · ${chapter.act}`,
      title: i === 0 ? chapter.yin.title : null,
      body: para,
      image: SLIDE_IMAGES[`${chapter.id}-yin-${i}`] || null
    });
  });

  // 3. Yin Quote slide
  if (chapter.yin.quote) {
    slides.push({
      ...base,
      id: `${chapter.id}-quote`,
      type: 'yin-quote',
      label: '☽ WISDOM',
      title: null,
      quote: chapter.yin.quote.text,
      author: chapter.yin.quote.author,
      image: SLIDE_IMAGES[`${chapter.id}-quote`] || null
    });
  }

  // 4. Yin Concept slides (one per concept)
  if (chapter.yin.concepts?.length) {
    chapter.yin.concepts.forEach((concept, i) => {
      slides.push({
        ...base,
        id: `${chapter.id}-concept-${i}`,
        type: 'yin-concept',
        label: '☽ KEY CONCEPT',
        title: concept.term,
        body: concept.definition,
        image: SLIDE_IMAGES[`${chapter.id}-concept-${i}`] || null
      });
    });
  }

  // 5. Yin Meditation slide
  if (chapter.yin.meditation) {
    slides.push({
      ...base,
      id: `${chapter.id}-meditation`,
      type: 'yin-meditation',
      label: '☽ MEDITATION',
      title: 'Pause & Reflect',
      body: chapter.yin.meditation.prompt,
      duration: chapter.yin.meditation.duration,
      image: SLIDE_IMAGES[`${chapter.id}-meditation`] || null
    });
  }

  // 5.5 Western Music & Guitar Theory Slide
  if (chapter.westernTheory) {
    slides.push({
      ...base,
      id: `${chapter.id}-western-theory`,
      type: 'yang-theory', // Mapping to the existing style but new content
      label: '⚙ HOW IT WORKS',
      title: 'The Grammar of Sound',
      musicGrammar: chapter.westernTheory.musicGrammar,
      guitarGrammar: chapter.westernTheory.guitarGrammar,
      image: SLIDE_IMAGES[`${chapter.id}-yang-intro`] || null // Reuse the yang-intro image for the theory slide
    });
  }

  // 6. Yang Instruction intro
  slides.push({
    ...base,
    id: `${chapter.id}-yang-intro`,
    type: 'yang-instruction',
    label: `☀ YANG · ${chapter.pillar}`,
    title: chapter.yang.title,
    body: chapter.yang.instruction,
    image: SLIDE_IMAGES[`${chapter.id}-yang-intro`] || null
  });

  // 7. Yang Exercise slides (one per exercise)
  if (chapter.yang.exercises?.length) {
    chapter.yang.exercises.forEach((exercise, i) => {
      slides.push({
        ...base,
        id: `${chapter.id}-exercise-${i}`,
        type: 'yang-exercise',
        label: `☀ EXERCISE ${i + 1}`,
        title: exercise.name,
        steps: exercise.steps,
        image: SLIDE_IMAGES[`${chapter.id}-exercise-${i}`] || null
      });
    });
  }

  // 8. Fretboard focus slide
  if (chapter.yang.fretboardFocus) {
    const ff = chapter.yang.fretboardFocus;
    slides.push({
      ...base,
      id: `${chapter.id}-fretboard`,
      type: 'yang-fretboard',
      label: '☀ FRETBOARD FOCUS',
      title: 'Your Practice Zone',
      body: `Frets ${ff.startFret}–${ff.endFret} · Pattern: ${ff.pattern}`,
      fretboardFocus: ff,
      image: SLIDE_IMAGES[`${chapter.id}-fretboard`] || null
    });
  }

  // 9. Chapter end slide
  slides.push({
    ...base,
    id: `${chapter.id}-end`,
    type: 'chapter-end',
    label: `CHAPTER ${chapter.id} COMPLETE`,
    title: chapter.title,
    body: `You have completed "${chapter.title}." When you are ready, proceed to the next fret.`,
    icon: chapter.icon,
    image: SLIDE_IMAGES[`${chapter.id}-end`] || null
  });

  return slides;
}

export default generateSlides;
