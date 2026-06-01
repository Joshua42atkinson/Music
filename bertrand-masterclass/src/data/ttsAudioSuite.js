// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : ttsAudioSuite.js                                    ║
// ║ WHAT    : TTS audio quality evaluation for ear training      ║
// ║ WHY     : The TTS sound must serve musical pedagogy           ║
// ║           — clear intervals, natural cadence, French tone   ║
// ║ STAGE   : TEST / QUALITY CONTROL                              ║
// ╚═══════════════════════════════════════════════════════════════╝

/**
 * TTS Audio Scoring Dimensions for Guitar Pedagogy.
 * These are perceptual qualities measured via Web Audio API analysis.
 */
export const TTS_SCORING_DIMENSIONS = {
  // ── Pitch Stability ───────────────────────────────────────────
  pitch_stability: {
    weight: 0.20,
    description: 'Consistent pitch across words, no unintended drifting',
    ideal_range: { min: 0.95, max: 1.0 }, // correlation coefficient
    why_matters: 'Musical terms ("Mi", "La", "Do") must have stable pitch references',
  },

  // ── French Vowel Clarity ──────────────────────────────────────
  french_vowel_clarity: {
    weight: 0.20,
    description: 'Distinct French vowels: é, è, ê, e, u, ou, o',
    ideal_range: { min: 0.85, max: 1.0 }, // formant distinctness
    why_matters: 'Musical French: "doigté", "corde", "accord" — vowels carry meaning',
  },

  // ── Cadence / Rhythm ──────────────────────────────────────────
  cadence_naturalness: {
    weight: 0.15,
    description: 'Pauses align with musical phrasing, not robotic equal spacing',
    ideal_range: { min: 0.7, max: 1.0 }, // variance in inter-word timing
    why_matters: 'Teaching phrases have natural musical rhythm: "Placez... [pause] ...votre doigt"',
  },

  // ── Consonant Crispness ───────────────────────────────────────
  consonant_crispness: {
    weight: 0.15,
    description: 'Plosives and fricatives are clear without being harsh',
    ideal_range: { min: 0.7, max: 1.0 }, // high-frequency energy ratio
    why_matters: 'Technical terms: "troisième", "quatre", "cinq" — numbers must be crisp',
  },

  // ── Dynamic Range ───────────────────────────────────────────
  dynamic_range: {
    weight: 0.15,
    description: 'Variation between whispered guidance and emphasized instruction',
    ideal_range: { min: 12, max: 24 }, // dB difference
    why_matters: 'Somatic whisper: "Respirez..." vs emphatic: "ÉCOUTEZ le Si!"',
  },

  // ── Speed Appropriateness ─────────────────────────────────────
  speed_appropriateness: {
    weight: 0.10,
    description: 'Tempo matches content type: slow for somatic, brisk for scale drills',
    ideal_range: { min: 0.8, max: 1.2 }, // normalized WPM
    why_matters: 'Ear training needs slower pace than casual conversation',
  },

  // ── Harmonic Richness ─────────────────────────────────────────
  harmonic_richness: {
    weight: 0.05,
    description: 'Overtones present, not thin or buzzy',
    ideal_range: { min: 0.6, max: 1.0 }, // harmonic-to-noise ratio
    why_matters: 'Rich voice is easier to listen to for long lessons',
  },
};

/**
 * Test phrases specifically designed to stress-test TTS for guitar pedagogy.
 */
export const TTS_AUDIO_TEST_CASES = [
  {
    id: 'audio-01',
    text: 'Do. Ré. Mi. Fa. Sol. La. Si. Do.',
    category: 'note_names',
    why: 'Musical note names must be perfectly intelligible',
    expected_duration: 4.0, // seconds
    expected_pauses: true, // pauses between notes
  },
  {
    id: 'audio-02',
    text: 'Placez votre index sur la troisième case de la corde de Mi aigu.',
    category: 'technical_french',
    why: 'French technical vocabulary must be clear',
    expected_duration: 5.0,
    expected_pauses: false,
  },
  {
    id: 'audio-03',
    text: 'Respirez profondément. Sentez la vibration dans votre poitrine.',
    category: 'somatic_whisper',
    why: 'Somatic guidance needs soft, calming delivery',
    expected_duration: 6.0,
    expected_pauses: true,
    expected_dynamic: 'soft',
  },
  {
    id: 'audio-04',
    text: 'Une tierce mineure. Un intervalle de trois demi-tons.',
    category: 'interval_theory',
    why: 'Music theory terms need precise pronunciation',
    expected_duration: 4.0,
    expected_pauses: true,
  },
  {
    id: 'audio-05',
    text: 'L\'accord de Do majeur septième. Do, Mi, Sol, Si.',
    category: 'chord_spelling',
    why: 'Chord tones spelled out must be distinct',
    expected_duration: 4.5,
    expected_pauses: true,
  },
  {
    id: 'audio-06',
    text: 'Jouez cela legato, avec du vibrato sur la note tenue.',
    category: 'italian_terms',
    why: 'Mixed Italian-French musical vocabulary',
    expected_duration: 4.0,
    expected_pauses: false,
  },
  {
    id: 'audio-07',
    text: 'Un, deux, trois, quatre. Un, deux, trois, quatre.',
    category: 'counting',
    why: 'Rhythmic counting needs metronomic precision',
    expected_duration: 4.0,
    expected_pauses: true,
    expected_tempo: 'steady',
  },
  {
    id: 'audio-08',
    text: 'Écoutez bien. La tension dans cette note vous guide vers la résolution.',
    category: 'emphasis_guidance',
    why: 'Emphasis words ("Écoutez", "tension") need dynamic contrast',
    expected_duration: 5.0,
    expected_dynamic: 'varied',
  },
];

// ── Audio Analysis Helpers (Browser Web Audio API) ────────────

/**
 * Analyze audio buffer for TTS quality metrics.
 * Returns scores for each dimension.
 */
export function analyzeAudioBuffer(audioBuffer) {
  const data = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const duration = audioBuffer.duration;

  const analysis = {
    duration,
    sampleRate,
    rms: calculateRMS(data),
    dynamicRange_dB: calculateDynamicRange(data),
    pitchStability: calculatePitchStability(data, sampleRate),
    zeroCrossings: calculateZeroCrossingRate(data),
    spectralCentroid: estimateSpectralCentroid(data, sampleRate),
  };

  // Convert raw metrics to 1-5 scores
  return {
    raw: analysis,
    scores: {
      pitch_stability: scorePitchStability(analysis.pitchStability),
      dynamic_range: scoreDynamicRange(analysis.dynamicRange_dB),
      consonant_crispness: scoreConsonantCrispness(analysis.zeroCrossings, analysis.spectralCentroid),
      harmonic_richness: scoreHarmonicRichness(analysis.spectralCentroid),
      speed_appropriateness: scoreSpeed(duration, 20), // avg 20 chars
      // French and cadence require more sophisticated analysis (see below)
      french_vowel_clarity: null, // Requires FFT analysis
      cadence_naturalness: null,  // Requires pause detection
    },
  };
}

// ── Raw Metric Calculations ────────────────────────────────────

function calculateRMS(data) {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i] * data[i];
  }
  return Math.sqrt(sum / data.length);
}

function calculateDynamicRange(data) {
  let max = -Infinity;
  let min = Infinity;
  for (let i = 0; i < data.length; i++) {
    if (data[i] > max) max = data[i];
    if (data[i] < min) min = data[i];
  }
  const db = 20 * Math.log10(max / Math.max(min, 1e-10));
  return Math.max(0, db);
}

function calculatePitchStability(data, sampleRate) {
  // Simplified: measure zero-crossing consistency
  // Full implementation would use autocorrelation or YIN algorithm
  const frameSize = Math.floor(sampleRate * 0.025); // 25ms frames
  const hopSize = Math.floor(sampleRate * 0.01);      // 10ms hop
  const pitches = [];

  for (let i = 0; i + frameSize < data.length; i += hopSize) {
    const frame = data.slice(i, i + frameSize);
    const zcr = calculateZeroCrossingRate(frame);
    // Rough pitch estimate from ZCR (valid for voiced speech)
    if (zcr > 0.01 && zcr < 0.3) {
      pitches.push(zcr);
    }
  }

  if (pitches.length < 2) return 0;

  // Stability = low variance in pitch
  const mean = pitches.reduce((a, b) => a + b, 0) / pitches.length;
  const variance = pitches.reduce((sum, p) => sum + (p - mean) ** 2, 0) / pitches.length;
  return Math.max(0, 1 - variance * 10);
}

function calculateZeroCrossingRate(data) {
  let crossings = 0;
  for (let i = 1; i < data.length; i++) {
    if ((data[i] >= 0) !== (data[i - 1] >= 0)) {
      crossings++;
    }
  }
  return crossings / data.length;
}

function estimateSpectralCentroid(data, sampleRate) {
  // Simplified: high-frequency energy ratio
  // Full implementation would use FFT
  const blockSize = 256;
  let highEnergy = 0;
  let totalEnergy = 0;

  for (let i = 0; i < data.length; i++) {
    const energy = data[i] * data[i];
    totalEnergy += energy;
    // Approximate high-freq content by rapid changes
    if (i > 0) {
      const diff = Math.abs(data[i] - data[i - 1]);
      highEnergy += diff * diff;
    }
  }

  return totalEnergy > 0 ? highEnergy / totalEnergy : 0;
}

// ── Score Normalization ─────────────────────────────────────────

function scorePitchStability(stability) {
  if (stability >= 0.95) return 5;
  if (stability >= 0.85) return 4;
  if (stability >= 0.70) return 3;
  if (stability >= 0.50) return 2;
  return 1;
}

function scoreDynamicRange(db) {
  if (db >= 20) return 5;
  if (db >= 15) return 4;
  if (db >= 10) return 3;
  if (db >= 6) return 2;
  return 1;
}

function scoreConsonantCrispness(zcr, centroid) {
  // High ZCR + moderate centroid = crisp consonants
  const score = (zcr * 5) + (centroid * 2);
  if (score >= 0.3) return 5;
  if (score >= 0.2) return 4;
  if (score >= 0.15) return 3;
  if (score >= 0.1) return 2;
  return 1;
}

function scoreHarmonicRichness(centroid) {
  if (centroid >= 0.5) return 5;
  if (centroid >= 0.4) return 4;
  if (centroid >= 0.3) return 3;
  if (centroid >= 0.2) return 2;
  return 1;
}

function scoreSpeed(duration, charCount) {
  const wpm = (charCount / 5) / (duration / 60);
  const normalized = wpm / 150; // 150 WPM is average
  if (normalized >= 0.8 && normalized <= 1.2) return 5;
  if (normalized >= 0.6 && normalized <= 1.4) return 4;
  if (normalized >= 0.4 && normalized <= 1.6) return 3;
  if (normalized >= 0.2 && normalized <= 2.0) return 2;
  return 1;
}

// ── Advanced Analysis (requires FFT) ───────────────────────────

/**
 * Detect pauses in audio for cadence analysis.
 * Returns array of { start, end, duration } for each pause.
 */
export function detectPauses(audioBuffer, thresholdDB = -40) {
  const data = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const frameSize = Math.floor(sampleRate * 0.01); // 10ms
  const threshold = Math.pow(10, thresholdDB / 20);

  const pauses = [];
  let inPause = false;
  let pauseStart = 0;

  for (let i = 0; i < data.length; i += frameSize) {
    const frame = data.slice(i, Math.min(i + frameSize, data.length));
    const rms = calculateRMS(frame);
    const isSilent = rms < threshold;

    if (isSilent && !inPause) {
      inPause = true;
      pauseStart = i / sampleRate;
    } else if (!isSilent && inPause) {
      inPause = false;
      const pauseEnd = i / sampleRate;
      const duration = pauseEnd - pauseStart;
      if (duration > 0.05) { // Only count pauses > 50ms
        pauses.push({ start: pauseStart, end: pauseEnd, duration });
      }
    }
  }

  return pauses;
}

/**
 * Calculate cadence naturalness score from pause pattern.
 */
export function scoreCadenceNaturalness(pauses, expectedPauses = true) {
  if (pauses.length === 0) return expectedPauses ? 1 : 3;

  // Natural speech has varied pause durations
  const durations = pauses.map(p => p.duration);
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  const variance = durations.reduce((sum, d) => sum + (d - avg) ** 2, 0) / durations.length;
  const cv = Math.sqrt(variance) / avg; // Coefficient of variation

  // Higher CV = more natural variation
  if (cv >= 0.5) return 5;
  if (cv >= 0.3) return 4;
  if (cv >= 0.2) return 3;
  if (cv >= 0.1) return 2;
  return 1;
}

// ── TTS Parameter Recommendations ─────────────────────────────

/**
 * Get recommended TTS parameters for different content types.
 */
export function getTTSParametersForCategory(category) {
  const presets = {
    note_names: {
      speed: 0.85,
      pitch: 1.0,
      pause_between_words: 0.15, // 150ms
      emphasis: 'moderate',
      why: 'Note names need time to register for ear training',
    },
    technical_french: {
      speed: 0.90,
      pitch: 1.0,
      pause_between_words: 0.05,
      emphasis: 'clear',
      why: 'Technical terms need clarity but flow naturally',
    },
    somatic_whisper: {
      speed: 0.70,
      pitch: 0.95,
      pause_between_words: 0.25,
      emphasis: 'soft',
      why: 'Somatic guidance needs slow, calming delivery',
    },
    interval_theory: {
      speed: 0.80,
      pitch: 1.0,
      pause_between_words: 0.12,
      emphasis: 'moderate',
      why: 'Theory concepts need processing time',
    },
    chord_spelling: {
      speed: 0.75,
      pitch: 1.0,
      pause_between_words: 0.18,
      emphasis: 'clear',
      why: 'Chord tones must be distinct and memorable',
    },
    counting: {
      speed: 1.0,
      pitch: 1.0,
      pause_between_words: 0.10,
      emphasis: 'steady',
      why: 'Counting needs metronomic precision',
    },
    emphasis_guidance: {
      speed: 0.85,
      pitch: 1.0,
      pause_between_words: 0.15,
      emphasis: 'dynamic', // varied
      why: 'Dynamic contrast for emphasis words',
    },
  };

  return presets[category] || presets.technical_french;
}
