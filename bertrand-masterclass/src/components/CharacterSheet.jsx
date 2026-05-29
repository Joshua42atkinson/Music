import { useState, useCallback } from 'react';
import { useScaffolding } from '../context/ScaffoldingProvider';

const TYPES = [
  {
    key: 'storyteller',
    name: 'The Storyteller',
    protocol: '©FHEAL',
    desc: 'Narrative, lyrical, emotional. You learn through story, metaphor, and feeling.',
    color: '#c9a96e',
    icon: '📖',
  },
  {
    key: 'craftsman',
    name: 'The Craftsman',
    protocol: '©SHEARL',
    desc: 'Kinesthetic, technique, precision. You learn through doing, repetition, and mastery.',
    color: '#6ec9a9',
    icon: '🔨',
  },
  {
    key: 'ear',
    name: 'The Ear',
    protocol: '©PLING!',
    desc: 'Audiation, listening, inner sound. You learn by hearing first, playing second.',
    color: '#6e8ac9',
    icon: '👂',
  },
  {
    key: 'seeker',
    name: 'The Seeker',
    protocol: 'All Three',
    desc: 'Theory, intellectual, curious. You learn by understanding the "why" behind everything.',
    color: '#c96e8a',
    icon: '🔍',
  },
];

export default function CharacterSheet({ onClose }) {
  const { traction, updateTraction } = useScaffolding();
  const current = traction.studentProfile?.troubadourType || null;
  const [selected, setSelected] = useState(current);
  const [saved, setSaved] = useState(false);

  const save = useCallback(() => {
    if (!selected) return;
    updateTraction(prev => ({
      ...prev,
      studentProfile: {
        ...prev.studentProfile,
        troubadourType: selected,
      },
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [selected, updateTraction]);

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 8, fontFamily: 'serif' }}>Discover Your Troubadour Type</h2>
      <p style={{ opacity: 0.7, marginBottom: 24 }}>
        How do you learn best? The Troubadour adapts to your nature.
      </p>

      <div style={{ display: 'grid', gap: 12 }}>
        {TYPES.map(t => (
          <button
            key={t.key}
            onClick={() => setSelected(t.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: 16,
              borderRadius: 12,
              border: selected === t.key ? `2px solid ${t.color}` : '2px solid rgba(255,255,255,0.1)',
              background: selected === t.key ? `${t.color}15` : 'rgba(255,255,255,0.03)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              color: 'inherit',
            }}
          >
            <span style={{ fontSize: 32 }}>{t.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{t.name}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: 2 }}>{t.protocol}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: 6 }}>{t.desc}</div>
            </div>
            {selected === t.key && (
              <span style={{ color: t.color, fontSize: 20 }}>✓</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'transparent',
              color: 'inherit',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        )}
        <button
          onClick={save}
          disabled={!selected || saved}
          style={{
            padding: '10px 24px',
            borderRadius: 8,
            border: 'none',
            background: saved ? '#2d5a3d' : '#c9a96e',
            color: '#0a0a0f',
            fontWeight: 600,
            cursor: selected && !saved ? 'pointer' : 'default',
            transition: 'all 0.2s',
          }}
        >
          {saved ? 'Saved!' : selected ? 'Save Selection' : 'Select a type'}
        </button>
      </div>
    </div>
  );
}
