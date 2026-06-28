import { devLog, devWarn } from './devLog';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Stream a Gemini chat completion using the student's own Google OAuth token.
 * This means the student's Google AI quota pays for the request — zero API cost for us.
 *
 * @param {string} accessToken — Google OAuth access token with generative-language scope
 * @param {string} model — e.g. 'gemini-2.5-flash'
 * @param {string} systemInstruction — system prompt
 * @param {Array} contents — [{ role: 'user'|'model', parts: [{ text }] }]
 * @param {object} generationConfig — { temperature, topP, topK, maxOutputTokens }
 * @param {function} onChunk — called with (fullText, deltaText) on each SSE chunk
 * @returns {Promise<string>} — full response text
 */
export async function streamGeminiWithOAuth(
  accessToken,
  model = 'gemini-2.5-flash',
  systemInstruction,
  contents,
  generationConfig = { temperature: 0.7, topP: 0.95, topK: 64, maxOutputTokens: 8192 },
  onChunk = null
) {
  const url = `${GEMINI_BASE}/models/${model}:streamGenerateContent?alt=sse`;

  const body = {
    contents,
    generationConfig,
  };

  if (systemInstruction) {
    body.system_instruction = { parts: [{ text: systemInstruction }] };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Gemini OAuth request failed: ${res.status} ${errText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (!data || data === '[DONE]') continue;

      try {
        const json = JSON.parse(data);
        const parts = json.candidates?.[0]?.content?.parts || [];
        const delta = parts.map(p => p.text || '').join('');
        if (delta) {
          fullText += delta;
          onChunk?.(fullText, delta);
        }
      } catch (e) {
        devWarn('[geminiOAuth] SSE parse error:', e);
      }
    }
  }

  devLog('[geminiOAuth] Stream complete, length:', fullText.length);
  return fullText;
}

/**
 * Check if an OAuth token can access the Gemini API.
 * Does a minimal listModels call.
 */
export async function canUseGeminiOAuth(accessToken) {
  try {
    const res = await fetch(`${GEMINI_BASE}/models?pageSize=1`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}
