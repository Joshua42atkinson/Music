// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : AITestPage.jsx                                       ║
// ║ WHAT    : Standalone diagnostic for Mini Trinity AI stack      ║
// ║ WHY     : Step-by-step validation of each component            ║
// ║ ROUTE   : /ai-test                                             ║
// ╚════════════════════════════════════════════════════════════════╝
import React, { useState, useRef, useCallback } from 'react';


function Pip({ state }) {
  const colors = { pass: '#4ade80', fail: '#ef4444', loading: '#f59e0b', idle: 'rgba(255,255,255,0.1)' };
  const c = colors[state] || colors.idle;
  return <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c, boxShadow: state !== 'idle' ? `0 0 6px ${c}` : 'none', animation: state === 'loading' ? 'pulse 1s ease infinite' : 'none' }} />;
}

function ProgressBar({ pct }) {
  return (
    <div className="h-1 bg-white/[0.06] rounded mt-1.5 overflow-hidden">
      <div className="h-full rounded bg-gradient-to-r from-[#cc3333] to-[#ff6666] transition-[width] duration-300" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function AITestPage() {
  // ── Pre-checks (sync) ───────────────────────────────
  const sabAvail = typeof SharedArrayBuffer !== 'undefined';
  const coiAvail = typeof window !== 'undefined' && window.crossOriginIsolated;
  const wasmAvail = typeof WebAssembly === 'object';
  const workerAvail = typeof Worker === 'function';
  const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 100) : 'SSR';
  const mem = typeof navigator !== 'undefined' ? navigator.deviceMemory : '?';
  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : '?';

  // ── LLM state ───────────────────────────────────────
  const [llmState, setLlmState] = useState('idle');
  const [llmDetail, setLlmDetail] = useState('Not started');
  const [llmPct, setLlmPct] = useState(0);
  const wllamaRef = useRef(null);

  // ── TTS state ───────────────────────────────────────
  const [ttsState, setTtsState] = useState('idle');
  const [ttsDetail, setTtsDetail] = useState('Not started');
  const [ttsPct, setTtsPct] = useState(0);
  const kokoroRef = useRef(null);

  // ── Chat state ──────────────────────────────────────
  const [chatState, setChatState] = useState('idle');
  const [chatDetail, setChatDetail] = useState('Requires LLM first');
  const [chatOutput, setChatOutput] = useState('');

  // ── Speak state ─────────────────────────────────────
  const [speakState, setSpeakState] = useState('idle');
  const [speakDetail, setSpeakDetail] = useState('Requires TTS first');

  // ── Load LLM ────────────────────────────────────────
  const loadLLM = useCallback(async () => {
    setLlmState('loading');
    setLlmDetail('Importing @wllama/wllama...');
    setLlmPct(0);

    try {
      const { Wllama } = await import('@wllama/wllama/esm');
      setLlmDetail('Wllama imported ✓ — Creating instance...');

      const wl = new Wllama({
        'default': 'https://cdn.jsdelivr.net/npm/@wllama/wllama@3.4.1/esm/wasm/wllama.wasm'
      });
      const modelUrl = new URL('/models/LFM2.5-1.2B-Instruct-Q4_K_M.gguf', window.location.origin).href;
      setLlmDetail(`Instance created ✓\nModel: ${modelUrl}\nDownloading...`);

      const t0 = Date.now();
      await wl.loadModelFromUrl(modelUrl, {
        progressCallback: ({ loaded, total }) => {
          const pct = Math.round((loaded / total) * 100);
          setLlmPct(pct);
          setLlmDetail(`${(loaded / 1048576).toFixed(1)} / ${(total / 1048576).toFixed(1)} MB  (${pct}%)\n${((Date.now() - t0) / 1000).toFixed(0)}s elapsed`);
        },
        n_ctx: 2048,
        n_gpu_layers: 99,
      });

      wllamaRef.current = wl;
      setLlmState('pass');
      setLlmDetail(`Loaded in ${((Date.now() - t0) / 1000).toFixed(1)}s ✓`);
      setLlmPct(100);
    } catch (e) {
      setLlmState('fail');
      setLlmDetail(`FAILED: ${e.message}\n\n${e.stack?.substring(0, 400) || ''}`);
    }
  }, []);

  // ── Load TTS ────────────────────────────────────────
  const loadTTS = useCallback(async () => {
    setTtsState('loading');
    setTtsDetail('Importing kokoro-js...');
    setTtsPct(0);

    try {
      const { KokoroTTS } = await import('kokoro-js');
      setTtsDetail('KokoroTTS imported ✓\nLoading ONNX model (q8, WASM)...');

      const t0 = Date.now();
      const tts = await KokoroTTS.from_pretrained(
        'onnx-community/Kokoro-82M-v1.0-ONNX',
        {
          dtype: 'q8',
          device: 'wasm',
          progress_callback: (p) => {
            if (p.status === 'progress' && p.total) {
              const pct = Math.round((p.loaded / p.total) * 100);
              setTtsPct(pct);
              setTtsDetail(`${p.file || 'model'}: ${pct}%`);
            }
          }
        }
      );

      kokoroRef.current = tts;
      setTtsState('pass');
      setTtsDetail(`Loaded in ${((Date.now() - t0) / 1000).toFixed(1)}s ✓\nVoices: ${Object.keys(tts.voices).length}`);
      setTtsPct(100);
    } catch (e) {
      setTtsState('fail');
      setTtsDetail(`FAILED: ${e.message}\n\n${e.stack?.substring(0, 500) || ''}`);
    }
  }, []);

  // ── Chat Test ───────────────────────────────────────
  const testChat = useCallback(async () => {
    if (!wllamaRef.current) return;
    setChatState('loading');
    setChatDetail('Generating...');
    setChatOutput('⏳ Thinking...');

    try {
      const t0 = Date.now();
      const r = await wllamaRef.current.createChatCompletion({
        messages: [
          { role: 'system', content: 'You are a friendly guitar teacher. Keep answers under 50 words.' },
          { role: 'user', content: 'Hello, who are you?' }
        ],
        max_tokens: 128,
        temperature: 0.7,
      });
      const text = r.choices[0].message.content;
      setChatState('pass');
      setChatDetail(`Done in ${((Date.now() - t0) / 1000).toFixed(1)}s ✓`);
      setChatOutput(text);
    } catch (e) {
      setChatState('fail');
      setChatDetail(`FAILED: ${e.message}`);
      setChatOutput(`Error: ${e.message}`);
    }
  }, []);

  // ── Speak Test ──────────────────────────────────────
  const testSpeak = useCallback(async () => {
    if (!kokoroRef.current) return;
    setSpeakState('loading');
    setSpeakDetail('Generating audio...');

    try {
      const t0 = Date.now();
      const audio = await kokoroRef.current.generate(
        'The music is inside you.',
        { voice: 'am_adam', speed: 1.0 }
      );
      setSpeakDetail(`Generated in ${((Date.now() - t0) / 1000).toFixed(1)}s — Playing...`);

      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const buf = ctx.createBuffer(1, audio.audio.length, audio.sampling_rate);
      buf.getChannelData(0).set(audio.audio);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.onended = () => {
        setSpeakState('pass');
        setSpeakDetail(`Played ✓ | ${audio.sampling_rate}Hz | ${audio.audio.length} samples`);
      };
      src.start(0);
    } catch (e) {
      setSpeakState('fail');
      setSpeakDetail(`FAILED: ${e.message}`);
    }
  }, []);

  return (
    <div className="font-mono bg-[#0a0a0f] text-[#e0d8c8] p-4 min-h-screen max-w-[600px] mx-auto">
      <h1 className="text-[1.1rem] text-[#cc3333] mb-1">🎸 MINI TRINITY DIAGNOSTIC</h1>
      <div className="text-[0.7rem] text-white/30 mb-4">Wllama (LLM) + Kokoro (TTS) + Web Speech (STT)</div>

      {/* 1. SharedArrayBuffer */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 mb-2.5">
        <div className="flex items-center gap-2 mb-1.5"><Pip state={sabAvail ? 'pass' : 'fail'} /><span className="text-[0.75rem] font-semibold">1. SharedArrayBuffer</span></div>
        <div className="text-[0.65rem] text-white/40 leading-[1.5] whitespace-pre-wrap break-all max-h-[200px] overflow-y-auto">{`SharedArrayBuffer: ${sabAvail}\ncrossOriginIsolated: ${coiAvail}\nUA: ${ua}`}</div>
      </div>

      {/* 2. WASM */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 mb-2.5">
        <div className="flex items-center gap-2 mb-1.5"><Pip state={wasmAvail && workerAvail ? 'pass' : 'fail'} /><span className="text-[0.75rem] font-semibold">2. WASM + Workers</span></div>
        <div className="text-[0.65rem] text-white/40 leading-[1.5] whitespace-pre-wrap break-all max-h-[200px] overflow-y-auto">{`WebAssembly: ${wasmAvail}\nWorkers: ${workerAvail}\nMemory: ${mem || '?'} GB\nCores: ${cores || '?'}`}</div>
      </div>

      {/* 3. STT */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 mb-2.5">
        <div className="flex items-center gap-2 mb-1.5"><Pip state={SR ? 'pass' : 'fail'} /><span className="text-[0.75rem] font-semibold">3. Web Speech API (STT)</span></div>
        <div className="text-[0.65rem] text-white/40 leading-[1.5] whitespace-pre-wrap break-all max-h-[200px] overflow-y-auto">{SR ? 'Available ✓' : 'NOT available'}</div>
      </div>

      {/* 4. LLM */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 mb-2.5">
        <div className="flex items-center gap-2 mb-1.5"><Pip state={llmState} /><span className="text-[0.75rem] font-semibold">4. Wllama LLM (698 MB)</span></div>
        <div className="text-[0.65rem] text-white/40 leading-[1.5] whitespace-pre-wrap break-all max-h-[200px] overflow-y-auto">{llmDetail}</div>
        <ProgressBar pct={llmPct} />
        <button className="w-full mt-2 py-2.5 px-5 rounded-lg border border-red-500/40 bg-red-500/[0.15] text-[#ff6666] font-mono text-[0.75rem] cursor-pointer" style={{ opacity: llmState === 'loading' || llmState === 'pass' ? 0.4 : 1 }} onClick={loadLLM} disabled={llmState === 'loading' || llmState === 'pass'}>
          {llmState === 'pass' ? '✓ LLM Ready' : llmState === 'loading' ? 'Loading...' : 'Load LLM'}
        </button>
      </div>

      {/* 5. TTS */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 mb-2.5">
        <div className="flex items-center gap-2 mb-1.5"><Pip state={ttsState} /><span className="text-[0.75rem] font-semibold">5. Kokoro TTS (82M ONNX)</span></div>
        <div className="text-[0.65rem] text-white/40 leading-[1.5] whitespace-pre-wrap break-all max-h-[200px] overflow-y-auto">{ttsDetail}</div>
        <ProgressBar pct={ttsPct} />
        <button className="w-full mt-2 py-2.5 px-5 rounded-lg border border-red-500/40 bg-red-500/[0.15] text-[#ff6666] font-mono text-[0.75rem] cursor-pointer" style={{ opacity: ttsState === 'loading' || ttsState === 'pass' ? 0.4 : 1 }} onClick={loadTTS} disabled={ttsState === 'loading' || ttsState === 'pass'}>
          {ttsState === 'pass' ? '✓ TTS Ready' : ttsState === 'loading' ? 'Loading...' : 'Load Kokoro TTS'}
        </button>
      </div>

      {/* 6. Chat */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 mb-2.5">
        <div className="flex items-center gap-2 mb-1.5"><Pip state={chatState} /><span className="text-[0.75rem] font-semibold">6. Chat Inference</span></div>
        <div className="text-[0.65rem] text-white/40 leading-[1.5] whitespace-pre-wrap break-all max-h-[200px] overflow-y-auto">{chatDetail}</div>
        <button className="w-full mt-2 py-2.5 px-5 rounded-lg border border-red-500/40 bg-red-500/[0.15] text-[#ff6666] font-mono text-[0.75rem] cursor-pointer" style={{ opacity: llmState !== 'pass' || chatState === 'loading' ? 0.4 : 1 }} onClick={testChat} disabled={llmState !== 'pass' || chatState === 'loading'}>
          {chatState === 'pass' ? '✓ Chat Works' : chatState === 'loading' ? 'Generating...' : 'Send: "Hello, who are you?"'}
        </button>
        {chatOutput && <div className="bg-black/30 border border-red-500/20 rounded-lg p-2.5 min-h-[60px] text-[0.7rem] text-cf-gold leading-[1.5] mt-2">{chatOutput}</div>}
      </div>

      {/* 7. Speak */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 mb-2.5">
        <div className="flex items-center gap-2 mb-1.5"><Pip state={speakState} /><span className="text-[0.75rem] font-semibold">7. TTS Speak</span></div>
        <div className="text-[0.65rem] text-white/40 leading-[1.5] whitespace-pre-wrap break-all max-h-[200px] overflow-y-auto">{speakDetail}</div>
        <button className="w-full mt-2 py-2.5 px-5 rounded-lg border border-red-500/40 bg-red-500/[0.15] text-[#ff6666] font-mono text-[0.75rem] cursor-pointer" style={{ opacity: ttsState !== 'pass' || speakState === 'loading' ? 0.4 : 1 }} onClick={testSpeak} disabled={ttsState !== 'pass' || speakState === 'loading'}>
          {speakState === 'pass' ? '✓ Play Again' : speakState === 'loading' ? 'Playing...' : 'Speak: "You are an instrument"'}
        </button>
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
    </div>
  );
}
