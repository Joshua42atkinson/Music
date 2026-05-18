import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { JournalService } from '../services/JournalService';
import { VIDEO_META } from './VideoHub';
import { STAGE_DATA } from '../data/videoData';

export default function JournalManifesto() {
  const [reflections, setReflections] = useState({});

  useEffect(() => {
    setReflections(JournalService.getAllReflections());
  }, []);

  const hasReflections = Object.keys(reflections).length > 0;

  // Helper to get structured data for rendering
  const getStructuredJournal = () => {
    const structured = [];
    const videoOrder = ['impact', 'authority', 'the-self'];

    videoOrder.forEach(videoId => {
      const video = VIDEO_META[videoId];
      const videoData = STAGE_DATA[videoId];
      if (!video || !videoData) return;

      const videoReflections = [];

      video.stages.forEach(stage => {
        const stageId = `${videoId}-${stage.number}`;
        const stageReflections = reflections[stageId];
        
        if (stageReflections) {
          const stageDetails = videoData.find(s => s.number === stage.number);
          
          const questionAnswers = [];
          
          if (stageReflections['meditation-0'] && stageReflections['meditation-0'].text) {
             questionAnswers.push({
               question: stageDetails?.meditations?.[0]?.question || 'Socratic Meditation 1',
               answer: stageReflections['meditation-0'].text,
               date: new Date(stageReflections['meditation-0'].timestamp).toLocaleDateString()
             });
          }
          if (stageReflections['meditation-1'] && stageReflections['meditation-1'].text) {
             questionAnswers.push({
               question: stageDetails?.meditations?.[1]?.question || 'Socratic Meditation 2',
               answer: stageReflections['meditation-1'].text,
               date: new Date(stageReflections['meditation-1'].timestamp).toLocaleDateString()
             });
          }

          if (questionAnswers.length > 0) {
            videoReflections.push({
              stageNumber: stage.number,
              powerWord: stage.power,
              qa: questionAnswers
            });
          }
        }
      });

      if (videoReflections.length > 0) {
        structured.push({
          videoId,
          videoTitle: video.title,
          stages: videoReflections
        });
      }
    });

    return structured;
  };

  const structuredData = getStructuredJournal();

  const handlePrint = () => {
    window.print();
  };

  const clearJournal = () => {
    if (window.confirm('Are you sure you want to clear your entire journal? This cannot be undone.')) {
      JournalService.clearJournal();
      setReflections({});
    }
  };

  return (
    <div className="min-h-screen bg-cf-void text-cf-ink font-sans">
      <Helmet>
        <title>Your Reflection Manifesto — The Conscious Framework</title>
      </Helmet>

      {/* Top Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-cf-void/90 backdrop-blur-md border-b border-cf-border print:hidden">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-cf-whisper hover:text-cf-gold transition-colors text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
            </svg>
            Return Home
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={clearJournal} className="text-xs text-cf-muted hover:text-red-400 transition-colors uppercase tracking-widest font-mono">
              Clear Journal
            </button>
            <button onClick={handlePrint} className="bg-cf-gold text-cf-void px-4 py-2 text-xs uppercase tracking-widest font-mono rounded-sm hover:bg-white transition-colors">
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      <div className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-20">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-cf-gold mb-4">
            The Conscious Framework
          </p>
          <h1 className="text-4xl md:text-5xl font-heading text-cf-ink-bright mb-6">
            Your Manifesto
          </h1>
          <p className="text-lg text-cf-whisper font-quote italic max-w-xl mx-auto">
            "The journey of a thousand miles begins with a single step." These are the steps you have taken.
          </p>
        </div>

        {!hasReflections || structuredData.length === 0 ? (
          <div className="text-center py-20 border border-cf-border/50 rounded-sm bg-cf-void/50">
            <p className="text-cf-muted mb-6">You have not recorded any reflections yet.</p>
            <Link to="/video/impact/1" className="text-cf-gold hover:underline">
              Begin Stage 01: The Setup
            </Link>
          </div>
        ) : (
          <div className="space-y-24">
            {structuredData.map((module) => (
              <div key={module.videoId} className="print-module">
                <h2 className="text-3xl font-heading text-cf-ink-bright mb-12 border-b border-cf-border pb-4">
                  Module: {module.videoTitle}
                </h2>
                
                <div className="space-y-16">
                  {module.stages.map((stage) => (
                    <div key={stage.stageNumber} className="pl-6 md:pl-10 border-l border-cf-border/50">
                      <h3 className="text-xl font-heading text-cf-gold mb-6">
                        Stage {String(stage.stageNumber).padStart(2, '0')} — {stage.powerWord}
                      </h3>
                      
                      <div className="space-y-10">
                        {stage.qa.map((qaItem, idx) => (
                          <div key={idx} className="print-qa-block">
                            <p className="text-sm font-quote italic text-cf-muted mb-4 border-l-2 border-cf-gold/30 pl-4">
                              {qaItem.question}
                            </p>
                            <div className="text-cf-whisper leading-relaxed whitespace-pre-wrap pl-4">
                              {qaItem.answer}
                            </div>
                            <p className="text-xs font-mono text-cf-border mt-4 pl-4">
                              Recorded on {qaItem.date}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {hasReflections && (
          <div className="mt-32 text-center border-t border-cf-border pt-12">
            <p className="font-heading text-xl text-cf-gold">The Architect of Empathy</p>
          </div>
        )}
      </div>
    </div>
  );
}
