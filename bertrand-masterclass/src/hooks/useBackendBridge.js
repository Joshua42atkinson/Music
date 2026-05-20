import { useRef, useState, useEffect } from 'react';

const DAAS_API_BASE = typeof window !== 'undefined'
  ? `http://${window.location.hostname}:8080/api`
  : 'http://localhost:8080/api';

export function useBackendBridge() {
  const [isDaaSConnected, setIsDaaSConnected] = useState(false);
  const [activeBackend, setActiveBackend] = useState(null);
  const [availableBackends, setAvailableBackends] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Check health of DaaS Axum Server on port 8080
  const checkConnection = async () => {
    try {
      const resp = await fetch(`${DAAS_API_BASE}/health`);
      if (resp.ok) {
        setIsDaaSConnected(true);
        // Load active LLM status
        await loadInferenceStatus();
        return true;
      }
    } catch (_) {
      setIsDaaSConnected(false);
    }
    return false;
  };

  // 2. Load Inference Router status
  const loadInferenceStatus = async () => {
    try {
      const resp = await fetch(`${DAAS_API_BASE}/inference/status`);
      if (resp.ok) {
        const data = await resp.json();
        setActiveBackend(data.active_backend);
        setAvailableBackends(data.backends || []);
      }
    } catch (e) {
      console.error('Failed to load DaaS inference status:', e);
    }
  };

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
  const askBertrand = async (messages) => {
    if (!isDaaSConnected) {
      // Fallback message if DaaS isn't running
      return {
        choices: [{
          message: {
            role: 'assistant',
            content: "I am currently running in offline preview mode. Start the Voix Vive DaaS Desktop App to connect to my local LLM for real-time Socratic guitar instruction."
          }
        }]
      };
    }

    try {
      // Send formatting/Socratic temperature rules to LLM
      const payload = {
        model: "active", // server proxies to whatever model is currently active
        messages: [
          {
            role: "system",
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
          content: "I ran into a connection issue with the local AI. Please verify that your local LM Studio or Ollama model server is running and active."
        }
      }]
    };
  };

  // 6. SQLite Student Profile operations
  const getProfiles = async () => {
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
  };

  const getProfile = async (name) => {
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
  };

  const upsertProfile = async (profile) => {
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
  };

  // 7. SQLite Practice Logs operations
  const getLogs = async (studentName) => {
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
  };

  const insertLog = async (log) => {
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
  };

  const verifyProfilePin = async (name, pin) => {
    if (!isDaaSConnected) return false;
    try {
      const resp = await fetch(`${DAAS_API_BASE}/db/profiles/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, pin }),
      });
      if (resp.ok) {
        const data = await resp.json();
        return !!data.success;
      }
    } catch (e) {
      console.error('Failed to verify profile pin:', e);
    }
    return false;
  };

  const earnFlorins = async (name, amount) => {
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
  };

  const spendFlorins = async (name, amount) => {
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
  };

  const generateTroubadourBook = async (styleTarget, bookTitle) => {
    if (!isDaaSConnected) return null;
    try {
      const resp = await fetch(`${DAAS_API_BASE}/troubadour/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ style_target: styleTarget, book_title: bookTitle }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.success) return data.book;
      }
    } catch (e) {
      console.error('Failed to generate troubadour book:', e);
    }
    return null;
  };

  useEffect(() => {
    checkConnection();
    // Re-check health every 15 seconds
    const interval = setInterval(checkConnection, 15000);
    return () => clearInterval(interval);
  }, []);

  return {
    isDaaSConnected,
    activeBackend,
    availableBackends,
    loading,
    switchBackend,
    detectBackends,
    askBertrand,
    getProfiles,
    getProfile,
    upsertProfile,
    getLogs,
    insertLog,
    verifyProfilePin,
    earnFlorins,
    spendFlorins,
    generateTroubadourBook,
    refreshConnection: checkConnection,
  };
}
