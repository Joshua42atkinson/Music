import { devWarn } from './devLog';
// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : aiPreScreening.js                                    ║
// ║ WHAT    : AI pre-screening pipeline for video submissions      ║
// ║ WHY     : Gemini analyzes video → flags issues → draft review  ║
// ║           Reduces Bertrand's review time: 12 min → 5 min       ║
// ║ WHO     : Apprentice+ tier submissions                         ║
// ║ OWNS    : Video upload to Gemini, analysis, structured output  ║
// ║ NEEDS   : VITE_GEMINI_API_KEY, video Blob from PracticeRecorder║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚═══════════════════════════════════════════════════════════════╝

const GEMINI_MODEL = 'gemini-1.5-flash';
const FILE_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/files';

const PRE_SCREENING_PROMPT = `You are an expert guitar teacher's assistant analyzing a student's practice video. 

Watch the video carefully and provide a structured analysis in the following JSON format:

{
  "overallAssessment": "2-3 sentence summary of what you observed",
  "strengths": ["2-3 things the student is doing well"],
  "issues": [
    {
      "category": "timing" | "pitch" | "posture" | "technique" | "other",
      "severity": "low" | "medium" | "high",
      "timestamp": "MM:SS or null if general",
      "description": "What the issue is",
      "suggestion": "Specific corrective guidance"
    }
  ],
  "draftReview": "A 2-3 paragraph draft review written as if from the teacher, using supportive but honest language. Reference specific moments with timestamps.",
  "priorityFlags": ["1-2 items that need the teacher's immediate attention"],
  "estimatedLevel": "beginner" | "intermediate" | "advanced",
  "recommendedFocus": "What the student should focus on before their next submission"
}

Focus on:
- TIMING: Is the student rushing or dragging? Are transitions smooth?
- PITCH: Are notes clean? Any buzzing or muted strings?
- POSTURE: Hand position, wrist angle, body tension, breathing
- TECHNIQUE: Finger placement, pick grip, strumming consistency

Be specific with timestamps. Be honest but kind — the student is putting themselves out there.
Return ONLY the JSON, no markdown formatting.`;

/**
 * Upload a video file to Gemini's File API for processing.
 * Files are automatically deleted after 48 hours.
 * @param {Blob} videoBlob - The video file
 * @param {string} mimeType - e.g. 'video/webm'
 * @returns {Promise<{uri: string, mimeType: string}>}
 */
export async function uploadVideoToGemini(videoBlob, mimeType = 'video/webm') {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY not configured');

  const metadata = JSON.stringify({
    displayName: `voix-vive-submission-${Date.now()}`,
    mimeType,
  });

  const res = await fetch(
    `${FILE_API_BASE}?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: metadata,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `File upload failed: ${res.status}`);
  }

  const { file } = await res.json();

  // Upload the actual video data
  const uploadRes = await fetch(
    `${file.uri}?key=${apiKey}&uploadType=media`,
    {
      method: 'POST',
      headers: { 'Content-Type': mimeType },
      body: videoBlob,
    }
  );

  if (!uploadRes.ok) {
    throw new Error(`Video data upload failed: ${uploadRes.status}`);
  }

  return { uri: file.uri, mimeType };
}

/**
 * Wait for a Gemini file to become active (processed and ready).
 * @param {string} fileUri
 * @returns {Promise<void>}
 */
export async function waitForFileActive(fileUri) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const maxAttempts = 30;
  const delayMs = 2000;

  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${fileUri}?key=${apiKey}`);
    if (!res.ok) throw new Error(`File status check failed: ${res.status}`);
    const data = await res.json();
    if (data.state === 'ACTIVE') return;
    if (data.state === 'FAILED') throw new Error('Gemini file processing failed');
    await new Promise(r => setTimeout(r, delayMs));
  }
  throw new Error('Timed out waiting for Gemini file processing');
}

/**
 * Analyze a video submission using Gemini.
 * @param {Blob} videoBlob - The recorded video
 * @param {Object} context - { fretId, chapterName, emotionalState, locale }
 * @returns {Promise<Object>} Structured analysis (parsed JSON from Gemini)
 */
export async function analyzeVideoSubmission(videoBlob, context = {}) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    devWarn('[aiPreScreening] No VITE_GEMINI_API_KEY — returning mock analysis');
    return getMockAnalysis(context);
  }

  const mimeType = videoBlob.type || 'video/webm';

  // 1. Upload video to Gemini File API
  const { uri, mimeType: fileMimeType } = await uploadVideoToGemini(videoBlob, mimeType);

  // 2. Wait for processing
  await waitForFileActive(uri);

  // 3. Send analysis request
  const contextStr = context.chapterName
    ? `\n\nContext: The student is working on Chapter ${context.fretId || '?'} — ${context.chapterName}.`
    : '';
  const emotionStr = context.emotionalState
    ? ` They reported feeling: ${context.emotionalState}.`
    : '';
  const localeStr = context.locale === 'fr'
    ? ' Please write the draftReview in French.'
    : '';

  const prompt = PRE_SCREENING_PROMPT + contextStr + emotionStr + localeStr;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [
            { fileData: { fileUri: uri, mimeType: fileMimeType } },
            { text: prompt },
          ],
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Analysis failed: ${res.status}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  try {
    return JSON.parse(text);
  } catch {
    // If JSON parsing fails, wrap the text in a minimal structure
    return {
      overallAssessment: text || 'Analysis could not be parsed.',
      issues: [],
      draftReview: text,
      priorityFlags: [],
      raw: true,
    };
  }
}

/**
 * Delete a file from Gemini's File API (cleanup).
 * @param {string} fileUri
 */
export async function deleteGeminiFile(fileUri) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return;
  try {
    await fetch(`${fileUri}?key=${apiKey}`, { method: 'DELETE' });
  } catch {
    // Best effort cleanup
  }
}

/**
 * Mock analysis for development without API key.
 */
function getMockAnalysis(context = {}) {
  return {
    overallAssessment: 'The student shows engagement with the material. Hand position appears generally correct with some areas for refinement.',
    strengths: [
      'Consistent practice posture',
      'Clear effort toward the exercise',
    ],
    issues: [
      {
        category: 'timing',
        severity: 'low',
        timestamp: '00:15',
        description: 'Slight rush on the transition between chords',
        suggestion: 'Practice the transition slowly with a metronome at 60 BPM',
      },
      {
        category: 'posture',
        severity: 'medium',
        timestamp: null,
        description: 'Wrist angle appears tense during barre chords',
        suggestion: 'Relax the wrist and drop the shoulder before attempting barres',
      },
    ],
    draftReview: `I can see you're putting real work into this. The transition around 0:15 shows you're thinking ahead, which is good instinct — but let's slow that down. Try it at 60 BPM with a metronome until your fingers know where to land without rushing.\n\nYour wrist tension during the barre sections is the bigger thing I'd want to work on in our next session. Drop that shoulder, relax the wrist, and let the arm weight do the work rather than squeezing.\n\nOverall: good direction. Keep at it.`,
    priorityFlags: ['Wrist tension during barre chords'],
    estimatedLevel: 'intermediate',
    recommendedFocus: 'Slow transitions with metronome, wrist relaxation exercises',
    _mock: true,
  };
}
