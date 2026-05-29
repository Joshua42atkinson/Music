import { useState, useEffect, useCallback } from 'react';

const DAAS_API_BASE = typeof window !== 'undefined'
  ? `http://${window.location.hostname}:8080/api`
  : 'http://localhost:8080/api';

// Production AI: StepAudio R1.1 (localhost:9998)
// Dev fallback: LM Studio (localhost:1234) with Nemotron
const LOCAL_AI_API_BASE = typeof window !== 'undefined'
  ? `http://${window.location.hostname}:9998/v1`
  : 'http://localhost:9998/v1';

const LMSTUDIO_DEV_API_BASE = typeof window !== 'undefined'
  ? `http://${window.location.hostname}:1234/v1`
  : 'http://localhost:1234/v1';

// Helper: Exponential Backoff Fetch
const fetchWithRetry = async (url, options = {}, retries = 3, backoff = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) return response;
    } catch (err) {
      if (i === retries - 1) throw err;
    }
    // Wait exponentially: 1s, 2s, 4s...
    await new Promise(resolve => setTimeout(resolve, backoff * Math.pow(2, i)));
  }
  throw new Error(`Max retries reached for ${url}`);
};

export function useBackendBridge() {
  const [isDaaSConnected, setIsDaaSConnected] = useState(false);
  const [isLMStudioConnected, setIsLMStudioConnected] = useState(false);
  const [activeBackend, setActiveBackend] = useState(null);
  const [availableBackends, setAvailableBackends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lmStudioModel, setLmStudioModel] = useState(null);

  // 1. Load Inference Router status
  const loadInferenceStatus = useCallback(async () => {
    try {
      const resp = await fetchWithRetry(`${DAAS_API_BASE}/inference/status`, {}, 2, 500);
      if (resp.ok) {
        const data = await resp.json();
        setActiveBackend(data.active_backend);
        setAvailableBackends(data.backends || []);
      }
    } catch (e) {
      console.error('Failed to load DaaS inference status:', e);
    }
  }, []);

  // 2. Check health of DaaS Axum Server on port 8080
  const checkConnection = useCallback(async (retries = 3) => {
    try {
      const resp = await fetchWithRetry(`${DAAS_API_BASE}/health`, {}, retries, 1000);
      if (resp.ok) {
        setIsDaaSConnected(true);
        // Load active LLM status
        await loadInferenceStatus();
        return true;
      }
    } catch {
      setIsDaaSConnected(false);
    }
    return false;
  }, [loadInferenceStatus]);

  // 2b. Check Local AI (StepAudio R1.1 on :9998, fallback to LM Studio on :1234 for dev)
  const checkLMStudio = useCallback(async () => {
    // Try StepAudio R1.1 (production AI) first
    try {
      const resp = await fetch(`${LOCAL_AI_API_BASE}/models`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (resp.ok) {
        const data = await resp.json();
        const hasModel = data.data && data.data.length > 0;
        setIsLMStudioConnected(hasModel);
        if (hasModel) {
          setLmStudioModel(data.data[0]);
          setActiveBackend('stepaudio-r1');
        }
        return hasModel ? { connected: true, model: data.data[0], backend: 'stepaudio-r1' } : { connected: false };
      }
    } catch (e) {
      // StepAudio not running, try LM Studio (dev fallback)
    }

    // Fallback: LM Studio on port 1234 (dev only, Nemotron)
    try {
      const resp = await fetch(`${LMSTUDIO_DEV_API_BASE}/models`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (resp.ok) {
        const data = await resp.json();
        const hasModel = data.data && data.data.length > 0;
        setIsLMStudioConnected(hasModel);
        if (hasModel) {
          setLmStudioModel(data.data[0]);
          setActiveBackend('lmstudio');
        }
        return hasModel ? { connected: true, model: data.data[0], backend: 'lmstudio' } : { connected: false };
      }
    } catch (e) {
      setIsLMStudioConnected(false);
      setLmStudioModel(null);
    }
    return { connected: false };
  }, []);

  // 3. Switch active LLM backend
  const switchBackend = async (name) => {
    if (!isDaaSConnected) return false;
    setLoading(true);
    try {
      const resp = await fetch(`${DAAS_API_BASE}/inference/switch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.success) {
          setActiveBackend(data.active_backend);
          await loadInferenceStatus();
          setLoading(false);
          return true;
        }
      }
    } catch (e) {
      console.error('Failed to switch backend:', e);
    }
    setLoading(false);
    return false;
  };

  // 4. Trigger auto-detection of local LLMs
  const detectBackends = async () => {
    if (!isDaaSConnected) return false;
    setLoading(true);
    try {
      const resp = await fetch(`${DAAS_API_BASE}/inference/detect`, {
        method: 'POST',
      });
      if (resp.ok) {
        const data = await resp.json();
        setAvailableBackends(data.backends || []);
        await loadInferenceStatus();
        setLoading(false);
        return true;
      }
    } catch (e) {
      console.error('Failed to detect LLM backends:', e);
    }
    setLoading(false);
    return false;
  };

  // 5. LLM Socratic Completions Proxy
  const askBertrand = async (messages, options = {}) => {
    // Try LM Studio first if connected
    if (isLMStudioConnected) {
      try {
        const payload = {
          model: 'loaded',
          messages: [
            {
              role: 'system',
              content: "You are Bertrand Laurence, a Somatic Mystic guitar instructor. You teach using Bertrand's Somatic Method: ©PLING!, ©SHEARL, ©FHEAL. You help students build fretboard visualization and neurological muscle memory. Respond with slow, contemplation-rich Socratic wisdom, focusing on somatic sensation (body, relaxation) and visualization rather than dry music theory. Never provide overwhelming chord grids; help them discover shapes in their mind."
            },
            ...messages
          ],
          temperature: options.temperature ?? 0.7,
          max_tokens: options.max_tokens ?? 4096,
          top_p: options.top_p ?? 0.9,
          top_k: options.top_k ?? 40,
          n_ctx: options.maxContext || 32768,
          n_gpu_layers: options.gpuLayers || 999,
          stream: options.stream ?? false,
        };

        const resp = await fetch(`${LOCAL_AI_API_BASE}/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (resp.ok) {
          return await resp.json();
        }
      } catch (e) {
        console.error('StepAudio R1.1 query failed:', e);
      }
    }

    // Fall back to DaaS server
    if (!isDaaSConnected) {
      return {
        choices: [{
          message: {
            role: 'assistant',
            content: "I am currently running in offline preview mode. Start your local AI (StepAudio R1.1 on port 9998, or LM Studio on port 1234 for dev) or the Voix Vive DaaS Desktop App (port 8080) to connect to my local LLM for real-time Socratic guitar instruction."
          }
        }]
      };
    }

    try {
      const payload = {
        model: 'active',
        messages: [
          {
            role: 'system',
            content: "You are Bertrand Laurence, a Somatic Mystic guitar instructor. You teach using Bertrand's Somatic Method: ©PLING!, ©SHEARL, ©FHEAL. You help students build fretboard visualization and neurological muscle memory. Respond with slow, contemplation-rich Socratic wisdom, focusing on somatic sensation (body, relaxation) and visualization rather than dry music theory. Never provide overwhelming chord grids; help them discover shapes in their mind."
          },
          ...messages
        ],
        temperature: 0.7,
      };

      const resp = await fetch(`${DAAS_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      console.error('DaaS Ask Bertrand query failed:', e);
    }

    return {
      choices: [{
        message: {
          role: 'assistant',
          content: "I ran into a connection issue with the local AI. Please verify that StepAudio R1.1 (port 9998), LM Studio (port 1234 for dev), or the DaaS server (port 8080) is running and active."
        }
      }]
    };
  };

  // 6. SQLite Student Profile operations
  const getProfiles = useCallback(async () => {
    if (!isDaaSConnected) return [];
    try {
      const resp = await fetch(`${DAAS_API_BASE}/db/profiles`);
      if (resp.ok) {
        const data = await resp.json();
        return data.profiles || [];
      }
    } catch (e) {
      console.error('Failed to fetch student profiles from SQLite:', e);
    }
    return [];
  }, [isDaaSConnected]);

  const getProfile = useCallback(async (name) => {
    if (!isDaaSConnected) return null;
    try {
      const url = name ? `${DAAS_API_BASE}/db/profile?name=${encodeURIComponent(name)}` : `${DAAS_API_BASE}/db/profile`;
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        return data.profile;
      }
    } catch (e) {
      console.error('Failed to get student profile from SQLite:', e);
    }
    return null;
  }, [isDaaSConnected]);

  const upsertProfile = useCallback(async (profile) => {
    if (!isDaaSConnected) return false;
    try {
      const resp = await fetch(`${DAAS_API_BASE}/db/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      return resp.ok;
    } catch (e) {
      console.error('Failed to upsert student profile to SQLite:', e);
    }
    return false;
  }, [isDaaSConnected]);

  // 7. SQLite Practice Logs operations
  const getLogs = useCallback(async (studentName) => {
    if (!isDaaSConnected) return [];
    try {
      const url = studentName ? `${DAAS_API_BASE}/db/logs?student_name=${encodeURIComponent(studentName)}` : `${DAAS_API_BASE}/db/logs`;
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        return data.logs || [];
      }
    } catch (e) {
      console.error('Failed to fetch practice logs from SQLite:', e);
    }
    return [];
  }, [isDaaSConnected]);

  const insertLog = useCallback(async (log) => {
    if (!isDaaSConnected) return false;
    try {
      const resp = await fetch(`${DAAS_API_BASE}/db/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      return resp.ok;
    } catch (e) {
      console.error('Failed to insert practice log into SQLite:', e);
    }
    return false;
  }, [isDaaSConnected]);



  const earnFlorins = useCallback(async (name, amount) => {
    if (!isDaaSConnected) return null;
    try {
      const resp = await fetch(`${DAAS_API_BASE}/db/profiles/earn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount }),
      });
      if (resp.ok) {
        const data = await resp.json();
        return data.florins;
      }
    } catch (e) {
      console.error('Failed to earn florins:', e);
    }
    return null;
  }, [isDaaSConnected]);

  const spendFlorins = useCallback(async (name, amount) => {
    if (!isDaaSConnected) return null;
    try {
      const resp = await fetch(`${DAAS_API_BASE}/db/profiles/spend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.success) return data.florins;
      }
    } catch (e) {
      console.error('Failed to spend florins:', e);
    }
    return null;
  }, [isDaaSConnected]);



  useEffect(() => {
    // Don't auto-connect - make it manual to prevent blocking
    // checkConnection will be called manually via refreshConnection
  }, []);

  return {
    isDaaSConnected,
    isLMStudioConnected,
    activeBackend,
    availableBackends,
    loading,
    lmStudioModel,
    switchBackend,
    detectBackends,
    askBertrand,
    getProfiles,
    getProfile,
    upsertProfile,
    getLogs,
    insertLog,
    verifyProfilePin: () => { console.warn('[VoixVive] verifyProfilePin is deprecated. Use Cloudflare Access.'); return false; },
    earnFlorins,
    spendFlorins,
    refreshConnection: checkConnection,
    checkLMStudio,
  };
}
