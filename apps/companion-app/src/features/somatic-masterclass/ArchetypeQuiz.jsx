import React, { useState } from 'react';
import { BookOpen, Sword, Smile, Heart, ChevronRight, Check } from 'lucide-react';
import { vvSet } from '../../lib/storage';
import { STORAGE_KEYS } from '../../lib/storageKeys';

const QUESTIONS = [
  {
    id: 'goal',
    text: 'When you hold the guitar, what is your primary goal?',
    options: [
      { text: 'To understand how the music works mathematically.', type: 'sage', icon: BookOpen },
      { text: 'To conquer a difficult piece and master it.', type: 'hero', icon: Sword },
      { text: 'To improvise and tell a story that makes people smile.', type: 'jester', icon: Smile },
      { text: 'To feel the resonance in my chest and find peace.', type: 'caregiver', icon: Heart },
    ]
  },
  {
    id: 'mistake',
    text: 'When you make a mistake, how do you react?',
    options: [
      { text: 'Analyze what went wrong and fix the mechanics.', type: 'sage', icon: BookOpen },
      { text: 'Push through and try again with more intensity.', type: 'hero', icon: Sword },
      { text: 'Turn it into a jazz note and laugh it off.', type: 'jester', icon: Smile },
      { text: 'Pause, take a deep breath, and release the tension.', type: 'caregiver', icon: Heart },
    ]
  },
  {
    id: 'scale',
    text: 'What does the "C-Scale" represent to you?',
    options: [
      { text: 'A grid of interlocking geometric shapes.', type: 'sage', icon: BookOpen },
      { text: 'The foundation I must master to advance.', type: 'hero', icon: Sword },
      { text: 'A playground of notes to mix and match.', type: 'jester', icon: Smile },
      { text: 'A series of deep emotional signatures.', type: 'caregiver', icon: Heart },
    ]
  },
  {
    id: 'practice',
    text: 'How do you prefer to practice?',
    options: [
      { text: 'With a metronome, perfecting one measure at a time.', type: 'sage', icon: BookOpen },
      { text: 'Setting a goal and pushing my physical limits.', type: 'hero', icon: Sword },
      { text: 'Without rules, just jamming and seeing what happens.', type: 'jester', icon: Smile },
      { text: 'In a quiet room, eyes closed, listening deeply.', type: 'caregiver', icon: Heart },
    ]
  }
];

const ARCHETYPE_RESULTS = {
  sage: { title: 'The Sage', desc: 'You seek understanding. The Troubadour will guide you with analytical depth and geometric precision.', color: '#3498db' },
  hero: { title: 'The Hero', desc: 'You seek mastery. The Troubadour will push your limits and challenge you to conquer the fretboard.', color: '#e74c3c' },
  jester: { title: 'The Jester', desc: 'You seek expression. The Troubadour will encourage your creativity and playful improvisation.', color: '#f39c12' },
  caregiver: { title: 'The Caregiver', desc: 'You seek resonance. The Troubadour will guide your somatic awareness and emotional connection.', color: '#2ecc71' }
};

export default function ArchetypeQuiz({ onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({ sage: 0, hero: 0, jester: 0, caregiver: 0 });
  const [result, setResult] = useState(null);

  const handleSelect = (type) => {
    const nextScores = { ...scores, [type]: scores[type] + 1 };
    setScores(nextScores);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Calculate winner
      const winner = Object.keys(nextScores).reduce((a, b) => nextScores[a] > nextScores[b] ? a : b);
      setResult(winner);
      // Save to localStorage so Troubadour prompt can read it
      vvSet(STORAGE_KEYS.ARCHETYPE, winner);
    }
  };

  if (result) {
    const resData = ARCHETYPE_RESULTS[result];
    return (
      <div className="glass-card max-w-[600px] w-full mx-auto p-8 rounded-2xl">
        <div className="text-center py-10 px-5">
          <h2 className="m-0 mb-4 font-heading text-[2.5rem] font-normal" style={{ color: resData.color }}>{resData.title}</h2>
          <p className="text-[1.1rem] text-white/70 leading-[1.6] m-0 mb-8">{resData.desc}</p>
          <button 
            className="premium-button inline-flex items-center gap-2 py-3 px-6 rounded-lg border bg-black/20 cursor-pointer font-mono text-[0.9rem] transition-all duration-200" 
            onClick={() => onComplete && onComplete(result)}
            style={{ borderColor: resData.color, color: resData.color }}
          >
            Embrace Your Voice <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[currentQ];

  return (
    <div className="glass-card max-w-[600px] w-full mx-auto p-8 rounded-2xl">
      <div className="mb-6">
        <span className="block text-[0.75rem] font-mono text-white/40 uppercase tracking-[0.1em] mb-2">Question {currentQ + 1} of {QUESTIONS.length}</span>
        <div className="h-1 bg-white/[0.05] rounded overflow-hidden">
          <div className="h-full bg-cf-gold transition-[width] duration-300 ease-out" style={{ width: `${((currentQ) / QUESTIONS.length) * 100}%` }} />
        </div>
      </div>

      <h3 className="m-0 mb-6 font-heading text-[1.8rem] text-vv-text font-normal">{q.text}</h3>

      <div className="flex flex-col gap-3">
        {q.options.map((opt, i) => {
          const Icon = opt.icon;
          return (
            <button
              key={i}
              onClick={() => handleSelect(opt.type)}
              className="hover-glow flex items-center gap-4 py-4 px-5 bg-white/[0.02] border border-white/[0.08] rounded-xl cursor-pointer text-left transition-all duration-200 ease-out"
            >
              <Icon size={20} className="text-white/40 shrink-0" />
              <span className="text-[0.95rem] text-white/80 font-sans leading-[1.4]">{opt.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
