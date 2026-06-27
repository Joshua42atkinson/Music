import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { BookOpen, AlertTriangle } from 'lucide-react';
import thesisRaw from '../../../../docs/VOIX_VIVE_MASTER_THESIS.md?raw';
import { devError } from '../lib/devLog';

export default function BlueprintHub() {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setContent(thesisRaw);
    } catch (err) {
      setError('Failed to load the Blueprint Thesis. Ensure the file exists in /docs/VOIX_VIVE_MASTER_THESIS.md');
      devError(err);
    }
  }, []);

  return (
    <div className="mesh-bg min-h-[100svh] bg-transparent text-[#e8dcc8] font-sans pt-20 pb-10 flex flex-col">
      <div className="px-10 mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="m-0 font-heading text-[2.5rem] font-normal text-vv-text">The Master Blueprint</h1>
          <p className="mt-2 font-mono text-[0.8rem] tracking-[0.1em] uppercase text-cf-gold/60">Architecture & Pedagogy</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="glass-card flex items-center gap-2 py-2 px-4 rounded-lg border border-cf-gold/40 bg-cf-gold/[0.05]">
            <BookOpen size={16} color="var(--cf-gold)" />
            <span className="text-cf-gold text-[0.8rem] font-mono">
              10/10 Spec Loaded
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-8 px-10 flex-1">
        <div className="glass-card flex-1 flex flex-col rounded-2xl p-10 overflow-y-auto max-h-[calc(100vh-180px)]">
          {error ? (
            <div className="flex items-center gap-3 text-[#e74c3c] bg-[rgba(231,76,60,0.1)] border border-[rgba(231,76,60,0.3)] p-6 rounded-xl font-mono">
              <AlertTriangle size={24} color="#e74c3c" />
              <p>{error}</p>
            </div>
          ) : (
            <div className="prose prose-invert prose-lg max-w-none" style={{
              '--tw-prose-headings': '#f0e6d2',
              '--tw-prose-body': 'rgba(255,255,255,0.7)',
              '--tw-prose-links': 'var(--cf-gold)',
              '--tw-prose-bold': '#ffffff',
              '--tw-prose-quotes': 'var(--cf-gold-dim)',
              '--tw-prose-quote-borders': 'var(--cf-gold)',
              '--tw-prose-code': 'var(--cf-gold)',
            }}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
