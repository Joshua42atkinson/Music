// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : WalkingModeEngine.jsx                               ║
// ║ WHAT    : The 4-On/4-Off audio LitRPG interval trainer        ║
// ║ WHY     : To train the "Inner Ear" in silence while walking   ║
// ║ WHO     : Student (mobile, headphones, screen off)            ║
// ║ OWNS    : Interval timer, TTS narration, pitch validation     ║
// ║ NEEDS   : usePitchDetector, troubadour.js, Web Speech API     ║
// ║ RULES   : Must work completely offline. Audio cues only.      ║
// ║ FIX AT  : App.jsx route '/walking' → WalkingModeEngine.jsx    ║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                    ║
// ╚═══════════════════════════════════════════════════════════════╝

import React, { useState, useEffect, useRef } from 'react';
import usePitchDetector from '../hooks/usePitchDetector';
import { TROUBADOUR } from '../data/adventures/troubadour';
import { playReferenceTone, playPling } from '../audio/audioEngine';

// Map high-fidelity TROUBADOUR adventure to the linear Walking Mode scenes
const TROUBADOUR_DATA = {
  scenes: Object.keys(TROUBADOUR.scenes).reduce((acc, key) => {
    const s = TROUBADOUR.scenes[key];
    acc[key] = {
      id: s.id,
      text: (s.setting?.en || "") + " " + (s.mentorLine?.en || ""),
      choices: s.choices?.map(c => ({
        next: c.leadsTo
      })) || []
    };
    return acc;
  }, {})
};

// Duration constants (in seconds). For testing, we keep them short if needed, but defaults are 4 mins.
const DURATION_ON = 240;  // 4 minutes
const DURATION_OFF = 240; // 4 minutes

export default function WalkingModeEngine() {
  const [sessionState, setSessionState] = useState('IDLE'); // IDLE, NARRATING, LISTENING, SILENCE
  const [timeLeft, setTimeLeft] = useState(0);
  const [sceneId, setSceneId] = useState('arrival');
  const [logs, setLogs] = useState([]);
  
  const { isListening, pitch, volume, startListening, stopListening } = usePitchDetector();
  const timerRef = useRef(null);
  
  const log = (msg) => setLogs(prev => [...prev.slice(-4), msg]);


  // Phase Machine
  const handlePhaseTransition = () => {
    if (sessionState === 'NARRATING') {
      // Narration done, wait for the user to sing the interval
      setSessionState('LISTENING');
      setTimeLeft(30); // Give them 30 seconds to nail the pitch
      startListening();
      log("System: Listening for your voice...");
    } 
    else if (sessionState === 'LISTENING') {
      // Time up on listening, move to silence
      stopListening();
      setSessionState('SILENCE');
      setTimeLeft(DURATION_OFF);
      speak("Hold the note in your mind. Walk in silence for four minutes.");
      log("System: 4 Minutes of Silence (Inner Ear Training)");
    } 
    else if (sessionState === 'SILENCE') {
      // Silence over, back to narration (next scene)
      playPling(880); // Wake up chime
      advanceScene();
    }
  };

  // Narrate text using Web Speech API (Offline TTS)
  const speak = (text, callback) => {
    if (!window.speechSynthesis) return callback?.();
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    // Try to find a good English/French voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.toLowerCase().includes('en'));
    if (preferred) utterance.voice = preferred;
    
    utterance.rate = 0.9; // Speak slowly and calmly
    utterance.pitch = 0.8;
    
    utterance.onend = () => callback?.();
    window.speechSynthesis.speak(utterance);
  };

  const startSession = () => {
    setSceneId('arrival');
    playScene('arrival');
  };

  const playScene = (targetSceneId) => {
    const scene = TROUBADOUR_DATA.scenes[targetSceneId];
    if (!scene) {
      log("Journey Complete.");
      setSessionState('IDLE');
      return;
    }

    setSessionState('NARRATING');
    // We don't use strict 4 min timer for narration, we use the TTS duration, 
    // but we set a fallback timer just in case.
    setTimeLeft(DURATION_ON); 
    
    log(`Narrator: "${scene.text}"`);
    
    // 1. Play the Drone (A = 110Hz)
    playReferenceTone(110);
    
    // 2. Speak the text
    speak(scene.text, () => {
      // 3. If there's an interval prompt, ask for it
      speak("Now... sing the interval.", () => {
        handlePhaseTransition(); // Move to LISTENING
      });
    });
  };

  const advanceScene = () => {
    // Basic linear progression for the POC
    const scene = TROUBADOUR_DATA.scenes[sceneId];
    if (scene && scene.choices && scene.choices.length > 0) {
      // Take the first choice path
      const nextScene = scene.choices[0].next;
      setSceneId(nextScene);
      playScene(nextScene);
    } else {
      setSessionState('IDLE');
    }
  };

  // Handle timer tick
  useEffect(() => {
    if (sessionState === 'IDLE') return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handlePhaseTransition();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [sessionState]); // eslint-disable-line react-hooks/exhaustive-deps


  // Listen for the pitch hit
  useEffect(() => {
    if (sessionState === 'LISTENING' && pitch && volume > 10) {
      // For the POC, we just accept any solid sung pitch as a "hit"
      // In production, we compare `pitch` to the target interval ratio of the scene.
      log(`Detected Pitch: ${Math.round(pitch)}Hz!`);
      playPling(pitch * 1.5); // Reward chime (Perfect Fifth above their note)
      
      stopListening();
      setSessionState('SILENCE');
      setTimeLeft(DURATION_OFF);
      
      speak("Good. Now hold it in your mind. Walk in silence.");
      log("System: Pitch accepted. Entering Silence Phase.");
    }
  }, [pitch, volume, sessionState]);

  // Dev helpers
  const formatTime = (sec) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;
  
  return (
    <div className="min-h-screen bg-black text-slate-300 p-8 font-sans">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-amber-500 tracking-widest uppercase mb-2">Voix Vive Engine</h1>
          <p className="text-sm text-slate-500 uppercase tracking-widest">Screen Off. Eyes Open. Ears Awake.</p>
        </div>

        {/* Status Ring */}
        <div className="relative flex justify-center items-center h-64 w-64 mx-auto mb-12">
          {/* Animated rings based on state */}
          <div className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
            sessionState === 'IDLE' ? 'border-slate-800' :
            sessionState === 'NARRATING' ? 'border-blue-500/50 animate-pulse' :
            sessionState === 'LISTENING' ? 'border-amber-500 animate-spin-slow' :
            'border-emerald-900/30' // SILENCE
          }`}></div>
          
          <div className="text-center z-10">
            {sessionState === 'IDLE' ? (
              <button 
                onClick={startSession}
                className="w-32 h-32 rounded-full bg-amber-600/20 text-amber-500 hover:bg-amber-600/40 border border-amber-500/50 transition-all uppercase tracking-widest font-bold text-sm flex flex-col items-center justify-center gap-2"
              >
                <span>Start</span>
                <span>Walk</span>
              </button>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-4xl font-light text-white font-mono">{formatTime(timeLeft)}</span>
                <span className="text-xs uppercase tracking-widest text-slate-500 mt-2">{sessionState}</span>
                {sessionState === 'LISTENING' && pitch > 0 && (
                  <span className="text-amber-400 font-mono mt-4">{Math.round(pitch)} Hz</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Development / Log UI (Normally hidden in pocket) */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
          <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-800 pb-2">System Logs (Screen normally off)</h3>
          <div className="space-y-2 h-32 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? <p className="text-slate-700">Awaiting session start...</p> : 
              logs.map((msg, i) => (
                <p key={i} className={`${msg.startsWith('Narrator') ? 'text-blue-400' : msg.startsWith('Detected') ? 'text-amber-400' : 'text-slate-400'}`}>
                  {msg}
                </p>
              ))
            }
          </div>
        </div>
        
        {/* Fast Forward Dev Tool */}
        {sessionState !== 'IDLE' && (
           <button 
             onClick={() => setTimeLeft(2)} 
             className="mt-8 w-full py-3 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white rounded text-sm uppercase tracking-widest transition-colors"
           >
             [DEV] Fast Forward Phase
           </button>
        )}
        
      </div>
      <style>{`
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
