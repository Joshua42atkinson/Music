import { devWarn } from '../lib/devLog';
// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : useTruebadourChat.js                                 ║
// ║ WHAT    : Streaming chat completion routed to Firebase Gemini  ║
// ║ WHY     : Isolates backend-specific prompt building & error    ║
// ║           handling from the main AI orchestrator               ║
// ║ WHO     : useTruebadourAI                                      ║
// ║ OWNS    : chatStream()                                         ║
// ║ NEEDS   : backend, speakText                                   ║
// ║ RULES   : Always fallback gracefully; never leave isLoading   ║
// ║           stuck.                                               ║
// ╚════════════════════════════════════════════════════════════════╝
import { useCallback } from 'react';
import { buildCompressedPrompt, buildChatPrompt, enforceOver } from '../data/truebadourPrompt';
import { getWebLLMEngine } from '../lib/webllmEngine';

export function useTruebadourChat({ backend, speakText, setIsLoading }) {
  const chatStream = useCallback(async (messages, onChunk, options = {}) => {
    const autoPlay = options.autoPlay === true;

    const isChatMode = options.mode === 'chat';
    const systemMsg = isChatMode
      ? buildChatPrompt({
          traction: options.traction,
          bardLevel: options.bardLevel,
          currentFret: options.currentFret,
          currentPhase: options.currentPhase,
          locale: options.locale || 'en',
          playerModifier: options.playerModifier,
        })
      : buildCompressedPrompt({
          traction: options.traction,
          bardLevel: options.bardLevel,
          currentFret: options.currentFret,
          currentPhase: options.currentPhase,
          playerModifier: options.playerModifier,
        });

    // ── 0. Google Gemini Nano (Local Edge via window.ai) ─────────
    if (backend === 'nano') {
      try {
        setIsLoading(true);
        const session = await window.ai.createTextSession({
          systemPrompt: systemMsg
        });

        // Format history for Nano
        const chatHistoryStr = messages.filter(m => m.role !== 'system').map(m => {
           return `${m.role === 'assistant' ? 'Bertrand' : 'Student'}: ${m.content}`;
        }).join('\n');

        const stream = await session.promptStreaming(chatHistoryStr);
        let fullText = '';
        
        for await (const chunk of stream) {
          // window.ai promptStreaming yields accumulated text
          const delta = chunk.startsWith(fullText) ? chunk.slice(fullText.length) : chunk;
          fullText = chunk;
          onChunk?.(fullText, delta);
        }

        if (autoPlay) {
          speakText(fullText, options.locale || 'en');
        }

        const toolMatches = fullText.match(/\[TOOL:([A-Z_]+)\]/g) || [];
        if (toolMatches.length > 0 && options.onToolCall) {
          toolMatches.forEach(m => options.onToolCall(m.replace(/\[TOOL:|\]/g, '')));
        }

        session.destroy();
        setIsLoading(false);
        return { choices: [{ message: { role: 'assistant', content: fullText } }] };
      } catch (err) {
        devWarn('[VoixVive] Nano generation failed. User might need to download the model.', err);
        setIsLoading(false);
      }
    }

    // ── 1. WebGPU Local AI (WebLLM - Llama 3.2 3B) ─────────────────
    if (backend === 'webgpu') {
      try {
        setIsLoading(true);
        // We do not wait for a full progress bar here to avoid blocking UI unnecessarily,
        // but it will await the promise if not loaded.
        const engine = await getWebLLMEngine();
        
        // Format history for WebLLM OpenAI-compatible API
        const webLLMMessages = [
          { role: 'system', content: systemMsg },
          ...messages.filter(m => m.role !== 'system')
        ];

        const stream = await engine.chat.completions.create({
          messages: webLLMMessages,
          stream: true,
          temperature: 0.7,
        });

        let fullText = '';
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content || '';
          fullText += delta;
          onChunk?.(fullText, delta);
        }

        if (autoPlay) {
          speakText(fullText, options.locale || 'en');
        }

        const toolMatches = fullText.match(/\[TOOL:([A-Z_]+)\]/g) || [];
        if (toolMatches.length > 0 && options.onToolCall) {
          toolMatches.forEach(m => options.onToolCall(m.replace(/\[TOOL:|\]/g, '')));
        }

        setIsLoading(false);
        return { choices: [{ message: { role: 'assistant', content: fullText } }] };
      } catch (err) {
        devWarn('[VoixVive] WebGPU generation failed. Hardware may not support it.', err);
        setIsLoading(false);
      }
    }

    // ── 2. Firebase Vertex AI (Google Gemini Cloud) ────────────────
    if (backend === 'google') {
      try {
        setIsLoading(true);
        const { getCompanionModel } = await import('../lib/firebaseAI');
        const model = getCompanionModel('gemini-2.5-flash-latest', systemMsg);
        
        if (!model) throw new Error("Google Gemini Model could not be initialized");

        // Format history for Gemini (roles must be 'user' or 'model')
        const chatHistory = messages.filter(m => m.role !== 'system').map(m => ({
          role: m.role === 'assistant' ? 'model' : m.role,
          parts: [{ text: m.content }]
        }));

        const history = chatHistory.slice(0, -1);
        const latestMsg = chatHistory[chatHistory.length - 1]?.parts[0]?.text || '';

        const chat = model.startChat({ history });
        const result = await chat.sendMessageStream(latestMsg);

        let fullText = '';
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          fullText += chunkText;
          onChunk?.(fullText, chunkText);
        }

        // Handle text-to-speech if autoplay is enabled
        if (autoPlay) {
          speakText(fullText, options.locale || 'en');
        }

        // Handle any tool calls in the response 
        const toolMatches = fullText.match(/\[TOOL:([A-Z_]+)\]/g) || [];
        if (toolMatches.length > 0 && options.onToolCall) {
          toolMatches.forEach(m => options.onToolCall(m.replace(/\[TOOL:|\]/g, '')));
        }

        setIsLoading(false);
        return { choices: [{ message: { role: 'assistant', content: fullText } }] };
      } catch (err) {
        devWarn('[VoixVive] Google Gemini generation failed.', err);
        setIsLoading(false);
        const errMsg = "My mind is clouded. The AI encountered an error.";
        speakText(errMsg, options.locale || 'en');
        onChunk?.(errMsg, errMsg);
        return { choices: [{ message: { role: 'assistant', content: errMsg } }] };
      }
    }

    const waitMsg = options.locale === 'fr'
      ? "L'IA est en cours de chargement. Veuillez patienter un instant."
      : "The AI is currently loading. Please wait a moment for my mind to awaken.";

    speakText(waitMsg, options.locale || 'en');
    onChunk?.(waitMsg, waitMsg);
    return { choices: [{ message: { role: 'assistant', content: waitMsg } }] };
  }, [backend, speakText]);

  return { chatStream };
}
