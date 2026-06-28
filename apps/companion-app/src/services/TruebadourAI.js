import { GoogleGenAI } from '@google/genai';
import { C_SCALE_CHAPTERS } from '../data/cScaleCurriculum';
import { devLog, devError } from '../lib/devLog';

let aiInstance = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      devError('Missing VITE_GEMINI_API_KEY in environment!');
      return null;
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function askTruebadour(transcript) {
  const ai = getAI();
  if (!ai) {
    return "I am sorry, but my brain is not connected. Please add the Gemini API key.";
  }

  devLog('[TruebadourAI] Asking Gemini:', transcript);

  const context = C_SCALE_CHAPTERS.map(ch => 
    `Chapter ${ch.title}:\n${ch.bePhase.content}\n${ch.deepDive}`
  ).join('\n\n');

  const systemInstruction = `
You are Bertrand Laurence, the Truebadour, a master guitar instructor teaching the C Scale Masterclass.
The user is talking to you hands-free via speech-to-text.

Persona Guidelines:
- You speak in concise, poetic analogies.
- You emphasize feeling the instrument and the geometry of music.
- Do NOT use markdown, bullet points, or complex formatting. Your response will be spoken aloud via Text-to-Speech.
- Keep your answers short (1-3 sentences) so they sound natural in a conversation.

Curriculum Context:
${context}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: transcript,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || "I have no words right now.";
    devLog('[TruebadourAI] Reply:', reply);
    return reply;
  } catch (error) {
    devError('[TruebadourAI] Error generating response:', error);
    return "I lost my train of thought. Let's try that again.";
  }
}
