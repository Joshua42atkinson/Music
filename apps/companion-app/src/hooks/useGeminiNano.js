import { devWarn } from '../lib/devLog';
import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { devError } from '../lib/devLog';

// Determine if we are in Tauri or the Web
const isTauri = () => typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined;

export function useGeminiNano() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);

  const askNano = useCallback(async (prompt, fallbackApiKey = null) => {
    setLoading(true);
    setError(null);
    try {
      let res = '';
      
      if (isTauri()) {
        res = await invoke('plugin:aicore|ask_gemini_nano', { prompt });
        
        if (res === '[NANO_UNSUPPORTED]') {
           devWarn('[Gemini Nano] Device unsupported, attempting cloud fallback...');
           if (!fallbackApiKey) {
             throw new Error('NANO_UNSUPPORTED'); // Let the UI catch this to prompt for an API key
           }
           
           // Cloud Fallback execution
           const genAI = new GoogleGenerativeAI(fallbackApiKey);
           const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
           const result = await model.generateContent(prompt);
           res = result.response.text();
        }
      } else {
        // Web execution defaults to cloud
        if (!fallbackApiKey) {
           throw new Error('NANO_UNSUPPORTED'); 
        }
        const genAI = new GoogleGenerativeAI(fallbackApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        res = result.response.text();
      }

      setResponse(res);
      return res;
    } catch (err) {
      devError('[Gemini Nano]', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    askNano,
    loading,
    response,
    error
  };
}
