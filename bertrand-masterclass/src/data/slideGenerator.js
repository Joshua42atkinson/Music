// ═══════════════════════════════════════════════════════════
// SLIDE GENERATOR — Converts chapterData into swipeable slides
// Each chapter becomes a deck of bite-sized phone-friendly slides
// ═══════════════════════════════════════════════════════════
import TIMELESS_SONG_SLIDES from './timelessSongSlides.js';

/**
 * Helper to construct a bilingual object or string depending on input type
 */
function constructBilingual(prefix, val, suffix = '') {
  if (typeof val === 'object' && val !== null) {
    return {
      en: `${prefix}${val.en || val.fr || ''}${suffix}`,
      fr: `${prefix}${val.fr || val.en || ''}${suffix}`
    };
  }
  return `${prefix}${val}${suffix}`;
}

/**
 * Generates an array of slide objects from a fret.
 * Each slide: { id, type, title, body, image, accent, fret }
 * Types: 'title' | 'yin-philosophy' | 'yin-quote' | 'yin-concept' | 'yin-meditation' | 'yang-instruction' | 'yang-exercise' | 'yang-fretboard' | 'fret-end'
 */
const SLIDE_IMAGES = {
  // ── Chapter 1: The Root Note (15 images) ──
  '1-title':      '/assets/slides/ch1/title.png',
  '1-yin-0':      '/assets/slides/ch1/yin-tension.png',
  '1-yin-1':      '/assets/slides/ch1/yin-alchemy.png',
  '1-quote':      '/assets/slides/ch1/quote.png',
  '1-concept-0':  '/assets/slides/ch1/concept-kinesthesis.png',
  '1-concept-1':  '/assets/slides/ch1/concept-fascia.png',
  '1-concept-2':  '/assets/slides/ch1/concept-vagal.png',
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
  '3-meditation': '/assets/slides/ch3/meditation.png',
  '3-quote':      '/assets/slides/ch3/quote.png',
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

  // ── Chapter 8: The Reward (10 images) ──
  '8-title':      '/assets/slides/ch8/title.png',
  '8-yin-0':      '/assets/slides/ch8/yin-0.png',
  '8-yin-1':      '/assets/slides/ch8/yin-1.png',
  '8-quote':      '/assets/slides/ch8/quote.png',
  '8-meditation': '/assets/slides/ch8/meditation.png',
  '8-yang-intro': '/assets/slides/ch8/yang-intro.png',
  '8-exercise-0': '/assets/slides/ch8/exercise-0.png',
  '8-exercise-1': '/assets/slides/ch8/exercise-1.png',
  '8-yang-power': '/assets/slides/ch8/yang-power.png',
  '8-fretboard':  '/assets/slides/ch8/fretboard.png',
  '8-end':        '/assets/slides/ch8/end.png',

  // ── Chapter 9: The Road Back (10 images) ──
  '9-title':      '/assets/slides/ch9/title.png',
  '9-yin-0':      '/assets/slides/ch9/yin-0.png',
  '9-yin-1':      '/assets/slides/ch9/yin-1.png',
  '9-quote':      '/assets/slides/ch9/quote.png',
  '9-meditation': '/assets/slides/ch9/meditation.png',
  '9-yang-intro': '/assets/slides/ch9/yang-intro.png',
  '9-exercise-0': '/assets/slides/ch9/exercise-0.png',
  '9-exercise-1': '/assets/slides/ch9/exercise-1.png',
  '9-yang-kinesthesis': '/assets/slides/ch9/yang-kinesthesis.png',
  '9-fretboard':  '/assets/slides/ch9/fretboard.png',
  '9-end':        '/assets/slides/ch9/end.png',

  // ── Chapter 10: The Resurrection (10 images) ──
  '10-title':      '/assets/slides/ch10/title.png',
  '10-yin-0':      '/assets/slides/ch10/yin-0.png',
  '10-yin-1':      '/assets/slides/ch10/yin-1.png',
  '10-quote':      '/assets/slides/ch10/quote.png',
  '10-meditation': '/assets/slides/ch10/meditation.png',
  '10-yang-intro': '/assets/slides/ch10/yang-intro.png',
  '10-exercise-0': '/assets/slides/ch10/exercise-0.png',
  '10-exercise-1': '/assets/slides/ch10/exercise-1.png',
  '10-yang-emotion': '/assets/slides/ch10/yang-emotion.png',
  '10-fretboard':  '/assets/slides/ch10/fretboard.png',
  '10-end':        '/assets/slides/ch10/end.png',

  // ── Chapter 11: The Elixir (10 images) ──
  '11-title':      '/assets/slides/ch11/title.png',
  '11-yin-0':      '/assets/slides/ch11/yin-0.png',
  '11-yin-1':      '/assets/slides/ch11/yin-1.png',
  '11-quote':      '/assets/slides/ch11/quote.png',
  '11-meditation': '/assets/slides/ch11/meditation.png',
  '11-yang-intro': '/assets/slides/ch11/yang-intro.png',
  '11-exercise-0': '/assets/slides/ch11/exercise-0.png',
  '11-exercise-1': '/assets/slides/ch11/exercise-1.png',
  '11-yang-stage': '/assets/slides/ch11/yang-stage.png',
  '11-fretboard':  '/assets/slides/ch11/fretboard.png',
  '11-end':        '/assets/slides/ch11/end.png',

  // ── Chapter 12: The Master (10 images) ──
  '12-title':      '/assets/slides/ch12/title.png',
  '12-yin-0':      '/assets/slides/ch12/yin-0.png',
  '12-yin-1':      '/assets/slides/ch12/yin-1.png',
  '12-quote':      '/assets/slides/ch12/quote.png',
  '12-meditation': '/assets/slides/ch12/meditation.png',
  '12-yang-intro': '/assets/slides/ch12/yang-intro.png',
  '12-exercise-0': '/assets/slides/ch12/exercise-0.png',
  '12-exercise-1': '/assets/slides/ch12/exercise-1.png',
  '12-yang-flow':  '/assets/slides/ch12/yang-flow.png',
  '12-fretboard':  '/assets/slides/ch12/fretboard.png',
  '12-end':        '/assets/slides/ch12/end.png',
};

export function generateSlides(fret) {
  const slides = [];
  const accent = fret.color;
  const base = { accent, fretId: fret.id, fretTitle: fret.title };

  // 1. Title slide
  slides.push({
    ...base,
    id: `${fret.id}-title`,
    type: 'title',
    label: constructBilingual(`FRET ${fret.fret} · `, fret.interval),
    title: fret.title,
    subtitle: fret.subtitle,
    body: fret.coreMessage,
    meta: {
      en: `${fret.note} · ${typeof fret.interval === 'object' ? fret.interval.en : fret.interval}`,
      fr: `${fret.note} · ${typeof fret.interval === 'object' ? fret.interval.fr : fret.interval}`
    },
    icon: fret.icon,
    image: SLIDE_IMAGES[`${fret.id}-title`] || null
  });

  // 2. Pythagorean Legacy slide — mathematical origin of the interval
  if (fret.pythagoreanLegacy) {
    const pl = fret.pythagoreanLegacy;
    slides.push({
      ...base,
      id: `${fret.id}-pythagorean`,
      type: 'pythagorean-legacy',
      label: { en: '◈ PYTHAGOREAN LEGACY', fr: '◈ HÉRITAGE PYTHAGORICIEN' },
      title: { en: 'The Mathematics of Sound', fr: 'Les Mathématiques du Son' },
      hook: pl.hook,
      ratio: pl.ratio,
      cents: pl.cents,
      image: SLIDE_IMAGES[`${fret.id}-pythagorean`] || null
    });
  }

  // 3. Yin Philosophy slides — split into paragraphs
  const rawPhilosophy = typeof fret.yin.philosophy === 'object' 
    ? fret.yin.philosophy
    : { en: fret.yin.philosophy, fr: fret.yin.philosophy };

  const enParas = rawPhilosophy.en.split('\n\n');
  const frParas = rawPhilosophy.fr.split('\n\n');
  
  // We match indices. If count varies, fallback gracefully
  const maxParas = Math.max(enParas.length, frParas.length);
  for (let i = 0; i < maxParas; i++) {
    slides.push({
      ...base,
      id: `${fret.id}-yin-${i}`,
      type: 'yin-philosophy',
      label: constructBilingual(`☽ YIN · `, fret.act),
      title: i === 0 ? fret.yin.title : null,
      body: {
        en: enParas[i] || '',
        fr: frParas[i] || ''
      },
      image: SLIDE_IMAGES[`${fret.id}-yin-${i}`] || null
    });
  }

  // 4. Yin Quote slide
  if (fret.yin.quote) {
    slides.push({
      ...base,
      id: `${fret.id}-quote`,
      type: 'yin-quote',
      label: { en: '☽ WISDOM', fr: '☽ SAGESSE' },
      title: null,
      quote: fret.yin.quote.text,
      author: fret.yin.quote.author,
      image: SLIDE_IMAGES[`${fret.id}-quote`] || null
    });
  }

  // 5. Yin Concept slides (one per concept)
  if (fret.yin.concepts?.length) {
    fret.yin.concepts.forEach((concept, i) => {
      slides.push({
        ...base,
        id: `${fret.id}-concept-${i}`,
        type: 'yin-concept',
        label: { en: '☽ KEY CONCEPT', fr: '☽ CONCEPT CLÉ' },
        title: concept.term,
        body: concept.definition,
        image: SLIDE_IMAGES[`${fret.id}-concept-${i}`] || null
      });
    });
  }

  // 6. Yin Meditation slide
  if (fret.yin.meditation) {
    slides.push({
      ...base,
      id: `${fret.id}-meditation`,
      type: 'yin-meditation',
      label: { en: '☽ MEDITATION', fr: '☽ MÉDITATION' },
      title: { en: 'Pause & Reflect', fr: 'Pause & Réflexion' },
      body: fret.yin.meditation.prompt,
      duration: fret.yin.meditation.duration,
      image: SLIDE_IMAGES[`${fret.id}-meditation`] || null
    });
  }

  // 5.5 — The Timeless Song slides (history + POV + art)
  const timelessSlides = TIMELESS_SONG_SLIDES[fret.id];
  if (timelessSlides?.length) {
    timelessSlides.forEach(slide => {
      slides.push({ ...base, ...slide, accent: fret.color });
    });
  }

  // 5.6 Western Music & Guitar Theory Slide
  if (fret.westernTheory) {
    slides.push({
      ...base,
      id: `${fret.id}-western-theory`,
      type: 'yang-theory',
      label: { en: '⚙ HOW IT WORKS', fr: '⚙ COMMENT ÇA FONCTIONNE' },
      title: { en: 'The Grammar of Sound', fr: 'La Grammaire du Son' },
      musicGrammar: fret.westernTheory.musicGrammar,
      guitarGrammar: fret.westernTheory.guitarGrammar,
      image: SLIDE_IMAGES[`${fret.id}-western-theory`] || null
    });
  }

  // 7. Yang Instruction intro
  slides.push({
    ...base,
    id: `${fret.id}-yang-intro`,
    type: 'yang-instruction',
    label: constructBilingual(`☀ YANG · `, fret.pillar),
    title: fret.yang.title,
    body: fret.yang.instruction,
    image: SLIDE_IMAGES[`${fret.id}-yang-intro`] || null
  });

  // 8. Yang Exercise slides (one per exercise)
  if (fret.yang.exercises?.length) {
    fret.yang.exercises.forEach((exercise, i) => {
      slides.push({
        ...base,
        id: `${fret.id}-exercise-${i}`,
        type: 'yang-exercise',
        label: { en: `☀ EXERCISE ${i + 1}`, fr: `☀ EXERCICE ${i + 1}` },
        title: exercise.name,
        steps: exercise.steps,
        image: SLIDE_IMAGES[`${fret.id}-exercise-${i}`] || null
      });
    });
  }

  // 9. Fretboard focus slide
  if (fret.yang.fretboardFocus && fret.yang.exercises?.length > 0) {
    const ff = fret.yang.fretboardFocus;
    slides.push({
      ...base,
      id: `${fret.id}-fretboard`,
      type: 'yang-fretboard',
      label: { en: '☀ FRETBOARD FOCUS', fr: '☀ FOCUS SUR LA TOUCHE' },
      title: { en: 'Your Practice Zone', fr: 'Votre Zone de Pratique' },
      body: {
        en: `Frets ${ff.startFret}–${ff.endFret} · Pattern: ${ff.pattern}`,
        fr: `Frettes ${ff.startFret}–${ff.endFret} · Schéma : ${ff.pattern}`
      },
      fretboardFocus: ff,
      image: SLIDE_IMAGES[`${fret.id}-fretboard`] || null
    });
  }

  // 10. Chapter end slide
  slides.push({
    ...base,
    id: `${fret.id}-end`,
    type: 'fret-end',
    label: {
      en: `FRET ${fret.id} COMPLETE`,
      fr: `FRETTE ${fret.id} TERMINÉE`
    },
    title: fret.title,
    body: {
      en: `You have completed "${typeof fret.title === 'object' ? fret.title.en : fret.title}." When you are ready, proceed to the next fret.`,
      fr: `Vous avez terminé "${typeof fret.title === 'object' ? fret.title.fr : fret.title}." Quand vous êtes prêt, passez à la frette suivante.`
    },
    icon: fret.icon,
    image: SLIDE_IMAGES[`${fret.id}-end`] || null
  });


  return slides;
}

export default generateSlides;
