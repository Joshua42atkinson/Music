import React from 'react';
import ArchetypeQuiz from '../features/somatic-masterclass/ArchetypeQuiz';
import { useNavigate } from 'react-router-dom';

export default function ArchetypePage() {
  const navigate = useNavigate();

  return (
    <div className="mesh-bg min-h-[100svh] bg-transparent text-[#e8dcc8] font-sans pt-20 pb-10 flex flex-col">
      <div className="px-10 mb-6 text-center">
        <h1 className="m-0 font-heading text-[2.5rem] font-normal text-vv-text">Discover Your Voice</h1>
        <p className="mt-2 font-mono text-[0.8rem] tracking-[0.1em] uppercase text-cf-gold/60">The Troubadour adapts to your archetype.</p>
      </div>
      <div className="flex px-10 flex-1">
        <ArchetypeQuiz onComplete={() => navigate('/binder')} />
      </div>
    </div>
  );
}
