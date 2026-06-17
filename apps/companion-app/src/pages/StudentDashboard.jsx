import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle2, Lock, PlayCircle, Sparkles, AudioWaveform, Mic, Guitar, UploadCloud, Users } from 'lucide-react';
import { useScaffolding } from '../components/ScaffoldingProvider';
import { advancePillar, setCurrentPillar } from '../data/tractionStore';
import { DashboardSkeleton } from '../components/Skeleton';
import { C_SCALE_CHAPTERS } from '../data/cScaleCurriculum';
import { getCognitivePrime } from '../data/harmonicData';
import PitchDetectorHUD from '../features/c-scale/PitchDetectorHUD';
import usePitchDetector from '../hooks/usePitchDetector';
import { useConversationalPracticeEngine } from '../features/somatic-masterclass/truebadour/useConversationalPracticeEngine';
import { droneEngine } from '../lib/audio/GenerativeDroneEngine';
import { useBevyIPC } from '../hooks/useBevyIPC';
import PracticeRecorder from '../components/PracticeRecorder';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { traction, updateTraction } = useScaffolding();
  const [isLoading, setIsLoading] = useState(true);

  // Pillar tracking
  const currentPillar = traction?.currentPillar || 'BE';
  
  // Chapter tracking
  const activeFretId = useMemo(() => {
    if (!traction?.fretsUnlocked || traction.fretsUnlocked.length === 0) return 1;
    return Math.min(12, Math.max(...traction.fretsUnlocked));
  }, [traction]);

  const activeChapter = useMemo(() => {
    return C_SCALE_CHAPTERS.find(c => c.id === activeFretId) || C_SCALE_CHAPTERS[0];
  }, [activeFretId]);

  const cognitivePrime = useMemo(() => getCognitivePrime(activeFretId), [activeFretId]);

  // Hook setups for DO & PLAY phases
  const { isListening, noteInfo, volume, startListening, stopListening } = usePitchDetector();
  const { isEyesFree, engineState, toggleEyesFree } = useConversationalPracticeEngine({ activeFretId });
  const [resonanceMode, setResonanceMode] = useState(false);
  const { isConnected, sendCommand } = useBevyIPC();

  // Handle Drone Engine state when stage changes or resonance mode toggles
  useEffect(() => {
    if (currentPillar === 'PLAY' && resonanceMode) {
      droneEngine.startDrone(activeFretId);
    } else {
      droneEngine.stopAll();
    }
    return () => droneEngine.stopAll();
  }, [activeFretId, resonanceMode, currentPillar]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAdvance = () => {
    updateTraction((prev) => advancePillar(prev));
  };

  const handleFinishChapter = () => {
    updateTraction((prev) => {
      // Unlock next fret if possible
      let newFretsUnlocked = prev.fretsUnlocked || [1];
      if (!newFretsUnlocked.includes(activeFretId + 1) && activeFretId < 12) {
        newFretsUnlocked = [...newFretsUnlocked, activeFretId + 1];
      }
      const nextState = { ...prev, fretsUnlocked: newFretsUnlocked };
      return setCurrentPillar(nextState, 'BE');
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[100svh] bg-[#050508] text-[#e8dcc8] font-sans pt-[100px] pb-[60px]">
        <div className="max-w-[800px] mx-auto px-6">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-[100svh] font-sans pt-[100px] pb-[60px] transition-colors duration-1000 ${resonanceMode ? 'bg-[#030201] shadow-[inset_0_0_150px_rgba(204,153,51,0.05)]' : 'bg-[#050508]'}`}>
      <div className="max-w-[800px] mx-auto px-6">
        
        {/* HEADER: GATED FOCUS */}
        <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6 gap-10 flex-wrap">
          <div>
            <h1 className="m-0 font-heading text-[2.5rem] font-normal text-vv-text">Chapter {activeChapter.id}: {activeChapter.title}</h1>
            <p className="mt-2 font-mono text-[0.85rem] tracking-[0.1em] uppercase text-cf-gold">
              Phase: {currentPillar}
            </p>
          </div>
          {/* Pillar Navigation Breadcrumbs */}
          <div className="flex gap-2 bg-white/5 p-2 rounded-xl">
            {['BE', 'DO', 'PLAY', 'PRODUCE'].map((pillar, idx) => {
              const isActive = currentPillar === pillar;
              const isPast = ['BE', 'DO', 'PLAY', 'PRODUCE'].indexOf(currentPillar) > idx;
              return (
                <div key={pillar} className={`px-4 py-1 rounded-lg font-mono text-[0.7rem] uppercase tracking-widest ${isActive ? 'bg-cf-gold text-black shadow-[0_0_10px_rgba(232,204,146,0.3)]' : isPast ? 'text-cf-gold/50' : 'text-white/20'}`}>
                  {pillar}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── PILLAR 1: BE (Instruction & Culture) ── */}
        {currentPillar === 'BE' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="rounded-2xl border border-cf-gold/20 bg-gradient-to-b from-cf-gold/[0.05] to-transparent overflow-hidden glass-card p-8">
              <span className="text-[3rem] mb-4 block">{activeChapter.icon || '🎵'}</span>
              <h2 className="m-0 mb-2 text-[1.8rem] font-heading text-vv-text">{activeChapter.bePhase?.title || activeChapter.subtitle}</h2>
              <p className="m-0 mb-6 text-[1.1rem] text-white/80 leading-[1.6]">{activeChapter.bePhase?.content || activeChapter.desc}</p>
              <div className="bg-black/40 border border-white/10 p-4 rounded-xl border-l-4 border-l-cf-gold">
                <p className="m-0 font-mono text-cf-gold text-[0.8rem] uppercase mb-2">Action Required</p>
                <p className="m-0 text-white/90">{activeChapter.bePhase?.action}</p>
              </div>
              {activeChapter.bePhase?.audioSnippet && (
                <div className="mt-4 bg-[#111115] border border-cf-gold/30 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cf-gold/20 flex items-center justify-center text-cf-gold">
                      <PlayCircle size={24} />
                    </div>
                    <div>
                      <p className="m-0 font-heading text-vv-cream text-[1.1rem]">The Master's Voice</p>
                      <p className="m-0 font-mono text-white/50 text-[0.7rem] uppercase">Audio Fragment Loaded</p>
                    </div>
                  </div>
                  <audio controls src={activeChapter.bePhase.audioSnippet} className="h-8 w-48 opacity-70 hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>

            {cognitivePrime && cognitivePrime.harmonicData && (
              <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] overflow-hidden glass-card group hover:border-cf-gold/30 transition-all duration-300">
                <div className="flex items-center gap-2 py-4 px-6 bg-black/20 border-b border-white/[0.05]">
                  <AudioWaveform size={16} color="#34d399" />
                  <span className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-white/60">Insight Unlocked: Pythagorean Physics</span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-4">
                    <div>
                      <div className="font-heading text-3xl text-vv-cream">{cognitivePrime.harmonicData.ratio}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-sans text-lg text-white/80">{cognitivePrime.harmonicData.label}</div>
                    </div>
                  </div>
                  <p className="m-0 mb-4 text-[0.9rem] text-white/80 leading-[1.6] italic border-l-2 border-cf-gold/40 pl-4">
                    "{cognitivePrime.harmonicData.pythagorean}"
                  </p>
                </div>
              </div>
            )}

            <button onClick={handleAdvance} className="mt-4 w-full py-5 rounded-xl bg-cf-gold text-black font-mono font-bold uppercase tracking-widest text-lg hover:bg-[#f5deb3] transition-colors shadow-[0_0_20px_rgba(232,204,146,0.2)]">
              I Understand. Proceed to DO.
            </button>
          </div>
        )}

        {/* ── PILLAR 2: DO (Active Imagination & Ear Training) ── */}
        {currentPillar === 'DO' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="rounded-2xl border border-[#4a8fe0]/30 bg-gradient-to-b from-[#4a8fe0]/[0.05] to-transparent overflow-hidden glass-card p-8">
              <Mic className="text-[#4a8fe0] mb-4" size={48} />
              <h2 className="m-0 mb-2 text-[1.8rem] font-heading text-vv-text">Active Imagination</h2>
              <p className="m-0 mb-6 text-[1.1rem] text-white/80 leading-[1.6]">
                Before touching the strings, you must hear the pitch in your mind and sing it. Engage the Truebadour loop for a hands-free somatic check.
              </p>
              
              <div className="flex flex-col gap-4">
                <button
                  onClick={toggleEyesFree}
                  className={`w-full py-4 rounded-xl font-mono font-bold uppercase tracking-widest transition-all ${isEyesFree ? 'bg-[#34d399] text-black shadow-[0_0_20px_rgba(52,211,153,0.3)]' : 'bg-black/50 border border-[#4a8fe0]/50 text-[#4a8fe0] hover:bg-[#4a8fe0]/10'}`}
                >
                  {isEyesFree ? `🎙️ Eyes-Free: ${engineState}` : '🎙️ Activate Truebadour Loop'}
                </button>

                <div className="bg-black/40 border border-white/10 p-6 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="m-0 font-mono text-white/50 text-[0.8rem] uppercase mb-1">Manual Pitch Check</p>
                    <p className="m-0 text-white/90">Sing the target note for Chapter {activeFretId}</p>
                  </div>
                  <PitchDetectorHUD
                    isListening={isListening}
                    noteInfo={noteInfo}
                    volume={volume}
                    onToggle={() => isListening ? stopListening() : startListening()}
                  />
                </div>
              </div>
            </div>

            <button onClick={handleAdvance} className="mt-4 w-full py-5 rounded-xl bg-[#4a8fe0] text-black font-mono font-bold uppercase tracking-widest text-lg hover:bg-[#5aa0f0] transition-colors shadow-[0_0_20px_rgba(74,143,224,0.2)]">
              I Hear It. Proceed to PLAY.
            </button>
          </div>
        )}

        {/* ── PILLAR 3: PLAY (Physical Execution) ── */}
        {currentPillar === 'PLAY' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="rounded-2xl border border-[#34d399]/30 bg-gradient-to-b from-[#34d399]/[0.05] to-transparent overflow-hidden glass-card p-8">
              <Guitar className="text-[#34d399] mb-4" size={48} />
              <h2 className="m-0 mb-2 text-[1.8rem] font-heading text-vv-text">Physical Execution</h2>
              <p className="m-0 mb-6 text-[1.1rem] text-white/80 leading-[1.6]">
                You have embodied the concept. You have heard the pitch. Now, let the strings vibrate.
              </p>
              
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setResonanceMode(!resonanceMode)}
                  className={`w-full py-4 rounded-xl font-mono font-bold uppercase tracking-widest transition-all border ${resonanceMode ? 'bg-[#34d399]/10 border-[#34d399] text-[#34d399] shadow-[0_0_20px_rgba(52,211,153,0.2)]' : 'bg-black/50 border-white/20 text-white/70 hover:border-white/50'}`}
                >
                  {resonanceMode ? '〰️ Resonance Drone Active' : '〰️ Activate Freestyle Resonance'}
                </button>

                <button
                  onClick={() => sendCommand('LAUNCH_C_SCALE', { 
                    friction: 1,
                    chapterId: activeChapter.id,
                    targetSequence: activeChapter.doPhase?.targetSequence,
                    instruction: activeChapter.doPhase?.instruction
                  })}
                  className="w-full py-4 rounded-xl font-mono font-bold uppercase tracking-widest transition-all bg-black/50 border border-[#2ecc71]/50 text-[#2ecc71] hover:bg-[#2ecc71]/10"
                >
                  {isConnected ? 'Launch XR Stream (Connected)' : 'Launch XR Stream'}
                </button>
              </div>

              <div className="mt-8 bg-black/40 border border-white/10 p-6 rounded-xl border-l-4 border-l-[#34d399]">
                <p className="m-0 font-mono text-[#34d399] text-[0.8rem] uppercase mb-2">The Instruction</p>
                <p className="m-0 text-white/90">{activeChapter.doPhase?.instruction}</p>
              </div>
            </div>

            <button onClick={handleAdvance} className="mt-4 w-full py-5 rounded-xl bg-[#34d399] text-black font-mono font-bold uppercase tracking-widest text-lg hover:bg-[#45e4aa] transition-colors shadow-[0_0_20px_rgba(52,211,153,0.2)]">
              I Have Mastered This. Proceed to PRODUCE.
            </button>
          </div>
        )}

        {/* ── PILLAR 4: PRODUCE (Async Submission & Community) ── */}
        {currentPillar === 'PRODUCE' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="rounded-2xl border border-[#9b59b6]/30 bg-gradient-to-b from-[#9b59b6]/[0.05] to-transparent overflow-hidden glass-card p-8">
              <UploadCloud className="text-[#9b59b6] mb-4" size={48} />
              <h2 className="m-0 mb-2 text-[1.8rem] font-heading text-vv-text">Share Your Resonance</h2>
              <p className="m-0 mb-6 text-[1.1rem] text-white/80 leading-[1.6]">
                Upload your practice video to Bertrand for async review, or enter the Riff Lounge to jam with the community.
              </p>
              
              <div className="flex flex-col gap-4">
                <PracticeRecorder 
                  chapterId={activeChapter.id} 
                  onComplete={handleFinishChapter} 
                />

                <button
                  onClick={() => navigate('/riff')}
                  className="w-full py-4 rounded-xl font-mono font-bold uppercase tracking-widest transition-all bg-black/50 border border-white/20 text-white hover:border-white/50 flex items-center justify-center gap-3 mt-4"
                >
                  <Users size={18} /> Enter the Riff Lounge
                </button>
              </div>
            </div>

            <button onClick={handleFinishChapter} className="mt-4 w-full py-5 rounded-xl bg-gradient-to-r from-cf-gold to-[#9b59b6] text-black font-mono font-bold uppercase tracking-widest text-lg transition-transform duration-200 hover:scale-[1.02] shadow-[0_0_25px_rgba(155,89,182,0.4)]">
              Skip Upload & Return to BE
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
