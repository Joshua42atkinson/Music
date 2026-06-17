import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Save, Loader2, Play } from 'lucide-react';

const STORAGE_KEY = 'bertrand-homework-feedback';

export default function FeedbackPanel({ slideId, onNext }) {
  const [styleScore, setStyleScore] = useState(null);
  const [approval, setApproval] = useState(null);
  const [comment, setComment] = useState('');
  
  const [isDictating, setIsDictating] = useState(false);
  const [transcription, setTranscription] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const recognitionRef = useRef(null);

  // Load existing feedback when slide changes
  useEffect(() => {
    // Reset defaults first
    setStyleScore(null);
    setApproval(null);
    setComment('');
    setTranscription('');
    setSaveStatus(null);
    setIsDictating(false);

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const feedbackArray = JSON.parse(stored);
        const existing = feedbackArray.find(item => item.slideId === slideId);
        if (existing) {
          setStyleScore(existing.styleScore || null);
          setApproval(existing.approval || null);
          setComment(existing.comment || '');
          setTranscription(existing.transcription || '');
        }
      }
    } catch (e) {
      console.error("Failed to load local storage feedback", e);
    }
  }, [slideId]);

  // Setup Web Speech API for STT
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscription(prev => {
          // simple way to avoid repeating text, just overwrite the last dictated portion
          // For simplicity in this demo, we'll just append it to a clean transcription state
          // but continuous=true appends it itself. Let's just use final transcripts to be clean.
          let finalTranscript = prev;
          if (event.results[event.results.length - 1].isFinal) {
             return prev + ' ' + event.results[event.results.length - 1][0].transcript;
          }
          return prev;
        });
      };
    }
  }, []);

  const startDictation = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsDictating(true);
      } catch (e) {
        console.error(e);
      }
    } else {
      alert("Speech recognition not supported in this browser.");
    }
  };

  const stopDictation = () => {
    if (recognitionRef.current && isDictating) {
      recognitionRef.current.stop();
    }
    setIsDictating(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      const payload = {
        slideId,
        styleScore,
        approval,
        comment,
        transcription: transcription.trim(),
        timestamp: new Date().toISOString()
      };

      const stored = localStorage.getItem(STORAGE_KEY);
      let feedbackArray = [];
      if (stored) {
        feedbackArray = JSON.parse(stored);
      }

      // Remove existing for this slide if present, then append
      feedbackArray = feedbackArray.filter(item => item.slideId !== slideId);
      feedbackArray.push(payload);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbackArray));
      
      setSaveStatus('success');
      setTimeout(() => {
        onNext();
      }, 1000);
      
    } catch (error) {
      console.error(error);
      setSaveStatus('error');
      alert(`Save failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full max-w-5xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      
      {/* Left Column: Feedback Buttons */}
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <p className="text-sm text-slate-400 mb-2 font-medium">Style/Voice Match (1-10)</p>
          <div className="flex flex-wrap gap-1">
            {[1,2,3,4,5,6,7,8,9,10].map(score => (
              <button
                key={score}
                onClick={() => setStyleScore(styleScore === score ? null : score)}
                className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors border ${styleScore === score ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
              >
                {score}
              </button>
            ))}
          </div>
        </div>

        <div>
           <p className="text-sm text-slate-400 mb-2 font-medium">Final Verdict</p>
           <div className="flex gap-2">
             <button
               onClick={() => setApproval('Approve')}
               className={`flex-1 p-3 rounded-lg font-bold transition-colors border ${approval === 'Approve' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700'}`}
             >
               Approve
             </button>
             <button
               onClick={() => setApproval('Disapprove')}
               className={`flex-1 p-3 rounded-lg font-bold transition-colors border ${approval === 'Disapprove' ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-800 border-slate-700 text-rose-400 hover:bg-slate-700'}`}
             >
               Disapprove
             </button>
           </div>
        </div>
      </div>

      {/* Middle Column: Voice / Audio */}
      <div className="flex-1 flex flex-col gap-2">
        <p className="text-sm text-slate-400 font-medium">Dictate Notes (STT)</p>
        
        <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 p-3 overflow-y-auto text-sm text-slate-300 min-h-[100px]">
          {transcription || <span className="text-slate-600 italic">Press dictate and speak your notes...</span>}
        </div>

        <div className="flex gap-2 items-center">
          {!isDictating ? (
             <button onClick={startDictation} className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white py-2 rounded-lg font-medium transition-colors">
               <Mic size={18} /> Start Dictation
             </button>
          ) : (
             <button onClick={stopDictation} className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium transition-colors animate-pulse">
               <Square size={18} /> Stop Dictation
             </button>
          )}
        </div>
      </div>

      {/* Right Column: Text & Save */}
      <div className="flex-1 flex flex-col gap-2">
         <p className="text-sm text-slate-400 font-medium">Written Comments</p>
         <textarea 
           value={comment}
           onChange={(e) => setComment(e.target.value)}
           placeholder="Add any extra notes here..."
           className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 resize-none focus:outline-none focus:border-indigo-500"
         />
         <button 
           onClick={handleSave}
           disabled={isSaving}
           className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${saveStatus === 'success' ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50'}`}
         >
           {isSaving ? <Loader2 className="animate-spin" size={20} /> : (saveStatus === 'success' ? 'Saved!' : <><Save size={20} /> Save & Next</>)}
         </button>
      </div>

    </div>
  );
}
