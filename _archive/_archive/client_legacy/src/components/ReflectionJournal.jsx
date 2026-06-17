import React, { useState, useEffect } from 'react';
import { JournalService } from '../services/JournalService';

export default function ReflectionJournal({ stageId, questionId, question }) {
  const [reflection, setReflection] = useState('');
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    const savedText = JournalService.getReflection(stageId, questionId);
    if (savedText) {
      setReflection(savedText);
    } else {
      setReflection('');
    }
    setIsSaved(true);
  }, [stageId, questionId]);

  const handleChange = (e) => {
    setReflection(e.target.value);
    setIsSaved(false);
  };

  const handleBlur = () => {
    JournalService.saveReflection(stageId, questionId, reflection);
    setIsSaved(true);
  };

  return (
    <div className="w-full mt-12 text-left">
      <div className="flex items-center justify-between mb-3">
        <label htmlFor={`reflection-${questionId}`} className="font-mono text-xs tracking-[0.2em] uppercase text-cf-gold">
          Your Reflection
        </label>
        <span className={`text-xs font-mono transition-opacity duration-500 ${isSaved && reflection ? 'text-cf-muted opacity-100' : 'opacity-0'}`}>
          Saved to local journal
        </span>
      </div>
      <textarea
        id={`reflection-${questionId}`}
        value={reflection}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Type your thoughts here..."
        className="w-full h-48 p-6 bg-cf-void/50 border border-cf-border/50 rounded-sm text-cf-whisper placeholder-cf-muted/50 focus:outline-none focus:border-cf-gold/50 transition-colors resize-none leading-relaxed"
      />
    </div>
  );
}
