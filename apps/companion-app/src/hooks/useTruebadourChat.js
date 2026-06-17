// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : useTruebadourChat.js                                 ║
// ║ WHAT    : Streaming chat completion routed to LM Studio or     ║
// ║           wllama (in-browser GGUF)                             ║
// ║ WHY     : Isolates backend-specific prompt building & error    ║
// ║           handling from the main AI orchestrator               ║
// ║ WHO     : useTruebadourAI                                      ║
// ║ OWNS    : chatStream()                                         ║
// ║ NEEDS   : backend, lmStudioRef, wllamaRef, speakText          ║
// ║ RULES   : Always fallback gracefully; never leave isLoading   ║
// ║           stuck.                                               ║
// ╚════════════════════════════════════════════════════════════════╝
import { useCallback } from 'react';
import { buildCompressedPrompt, buildChatPrompt, enforceOver } from '../data/truebadourPrompt';

export function useTruebadourChat({ backend, lmStudioRef, wllamaRef, speakText, setIsLoading }) {
  const chatStream = useCallback(async (messages, onChunk, options = {}) => {
    const autoPlay = options.autoPlay === true;

    // ── 1. LM Studio (Nemotron / any local model) ────────────────
    if (backend === 'lmstudio' && lmStudioRef.current?.connected) {
      try {
        setIsLoading(true);
        const payload = {
          model: lmStudioRef.current.model || 'loaded',
          messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.max_tokens ?? 512,
          stream: false,
        };
        const res = await fetch(`${lmStudioRef.current.url}/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(30000),
        });
        if (!res.ok) throw new Error(`LM Studio HTTP ${res.status}`);
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || '';
        onChunk?.(content, content);
        if (autoPlay) speakText(content, options.locale || 'en');
        if (options.onToolCall) {
          const toolMatches = content.match(/\[TOOL:([A-Z_]+)\]/g) || [];
          toolMatches.forEach(m => options.onToolCall(m.replace(/\[TOOL:|\]/g, '')));
        }
        setIsLoading(false);
        return { choices: [{ message: { role: 'assistant', content } }] };
      } catch (err) {
        console.warn('[VoixVive] LM Studio call failed:', err);
        setIsLoading(false);
        // fall through to wllama
      }
    }

    // ── 2. wllama (in-browser GGUF) ──────────────────────────────
    if (backend === 'wllama' && wllamaRef.current) {
      try {
        setIsLoading(true);
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
        const wllamaMessages = [
          { role: 'system', content: systemMsg },
          ...messages.slice(-10),
        ];
        const result = await wllamaRef.current.chatCompletion(wllamaMessages, {
          max_tokens: options.max_tokens || 512,
          temperature: options.temperature ?? 0.1,
          top_k: 50,
          min_p: 0.15,
          penalty_repeat: 1.05,
        });

        const extractTools = (text) => {
          const tools = [];
          const cleanText = text.replace(/\[TOOL:([A-Z_]+)\]/g, (match, toolName) => {
            tools.push(toolName);
            return '';
          }).trim();
          return { cleanText, tools };
        };

        const rawContent = result.choices[0].message.content;
        const content = isChatMode ? rawContent : enforceOver(rawContent, 'truebadour');
        const { cleanText, tools } = extractTools(content);

        setIsLoading(false);
        if (autoPlay) {
          speakText(cleanText, options.locale || 'en');
        }

        if (tools.length > 0 && options.onToolCall) {
          tools.forEach(tool => options.onToolCall(tool));
        }

        onChunk?.(content, content);
        return { choices: [{ message: { role: 'assistant', content, tools } }] };
      } catch (err) {
        console.warn('[VoixVive] wllama generation failed.', err);
        const errMsg = "My mind is clouded. The Liquid AI encountered an error.";
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
  }, [backend, lmStudioRef, wllamaRef, speakText]);

  return { chatStream };
}
