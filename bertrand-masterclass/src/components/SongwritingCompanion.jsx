import React, { useState, useEffect, useCallback } from 'react';
import { Feather, BookOpen, Sparkles, Save, Star, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useBackendBridge } from '../hooks/useBackendBridge';
import { useScaffolding } from './ScaffoldingProvider';
import { useLocale } from '../hooks/useLocale';
import { db } from '../data/localDatabase';
import frets from '../data/chapterData';

// ═══════════════════════════════════════════════════════════
// TROUBADOUR'S QUILL — AI Songwriting Companion (Fret 4)
// Reads from the student's practice journals, breathing sessions,
// pitch accuracy, traction history, AND the actual 12-fret
// Monomyth curriculum. The AI maps lyric themes to specific
// chapters in the student's journey.
// ═══════════════════════════════════════════════════════════

const SONG_MOODS = [
  { id: 'reflective', en: 'Reflective', fr: 'Réflectif', emoji: '🌙' },
  { id: 'triumphant', en: 'Triumphant', fr: 'Triomphant', emoji: '⚔️' },
  { id: 'melancholy', en: 'Melancholy', fr: 'Mélancolique', emoji: '🌧️' },
  { id: 'playful', en: 'Playful', fr: 'Espiègle', emoji: '🎭' },
  { id: 'sacred', en: 'Sacred', fr: 'Sacré', emoji: '🕯️' },
  { id: 'wandering', en: 'Wandering', fr: 'Errant', emoji: '🗺️' },
];

// Build a compact curriculum summary for the LLM
function buildCurriculumContext(tractionFrets, lang) {
  const l = lang === 'fr' ? 'fr' : 'en';
  return frets.map(ch => {
    const fretState = tractionFrets[ch.id];
    const traction = fretState?.traction || 0;
    const status = traction >= 60 ? 'MASTERED' : traction > 0 ? 'IN PROGRESS' : 'NOT STARTED';
    const title = typeof ch.title === 'object' ? ch.title[l] : ch.title;
    const heroStage = typeof ch.heroStage === 'object' ? ch.heroStage[l] : ch.heroStage;
    const core = typeof ch.coreMessage === 'object' ? ch.coreMessage[l] : ch.coreMessage;
    const interval = typeof ch.interval === 'object' ? ch.interval[l] : ch.interval;
    return `Fret ${ch.id} "${title}" (${interval}, ${heroStage}): ${status}. Core: "${core}"`;
  }).join('\n');
}

export default function SongwritingCompanion() {
  const { isFrench } = useLocale();
  const { isDaaSConnected, askBertrand } = useBackendBridge();
  const { traction, practiceMinutes, streak, breathingSessions, bardLevel } = useScaffolding();

  const [selectedMood, setSelectedMood] = useState('reflective');
  const [customTheme, setCustomTheme] = useState('');
  const [editableLyrics, setEditableLyrics] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [songTitle, setSongTitle] = useState('');
  const [savedSongs, setSavedSongs] = useState([]);
  const [showSongbook, setShowSongbook] = useState(false);
  const [saveConfirm, setSaveConfirm] = useState(false);

  const loadSongs = async () => {
    try {
      const songs = await db.songs.orderBy('timestamp').reverse().toArray();
      setSavedSongs(songs);
    } catch (e) {
      console.warn('[Quill] Failed to load songs:', e);
    }
  };

  // Load saved songs from IndexedDB on mount
  useEffect(() => {
    const init = async () => {
      try {
        const songs = await db.songs.orderBy('timestamp').reverse().toArray();
        setSavedSongs(songs);
      } catch (e) {
        console.warn('[Quill] Failed to load songs:', e);
      }
    };
    init();
  }, []);

  // Build a rich context prompt from the student's practice data + curriculum
  const buildPrompt = useCallback(() => {
    const mood = SONG_MOODS.find(m => m.id === selectedMood);
    const fretData = Object.values(traction.frets || {});
    const completedFrets = fretData.filter(f => f.traction >= 60).length;
    const avgPitch = fretData.length > 0
      ? Math.round(fretData.reduce((s, f) => s + (f.pitchAccuracy || 0), 0) / fretData.length)
      : 0;

    // Build curriculum context from actual chapterData
    const curriculumSummary = buildCurriculumContext(traction.frets || {}, isFrench ? 'fr' : 'en');

    const context = [
      `The student is at Bard Level ${bardLevel}.`,
      `They have practiced for ${practiceMinutes} total minutes across ${streak} consecutive day(s).`,
      `They have completed ${breathingSessions} breathing gate sessions.`,
      `They have mastered ${completedFrets} of 12 frets on the Guitar Neck curriculum.`,
      avgPitch > 0 ? `Their average pitch accuracy is ${avgPitch}%.` : '',
      customTheme ? `The student wants to write about: "${customTheme}"` : '',
    ].filter(Boolean).join(' ');

    return [
      {
        role: 'system',
        content: `You are the Troubadour's Quill, a sovereign AI songwriting companion embedded in the Voix Vive Masterclass — Bertrand Laurence's somatic guitar pedagogy platform. You help guitar students write deeply personal songs inspired by their practice journey.

CURRICULUM CONTEXT — The student's 12-Fret Monomyth Journey:
${curriculumSummary}

INSTRUCTIONS:
- Write lyrics in a ${mood?.en || 'reflective'} mood.
- Use standard song structure tags: [Verse 1], [Chorus], [Verse 2], [Bridge], [Outro].
- Keep lyrics between 16-32 lines.
- Be poetic, personal, and draw from the student's specific practice data AND curriculum progress.
- Reference specific chapters and Hero's Journey stages from the curriculum above. For example, if the student mastered "The Ordeal" (Fret 7, Tritone), weave that into the lyrics.
- After the lyrics, add a brief "Journey Note" section explaining which frets/chapters inspired each section of the song.
- Never use generic placeholder lyrics.
${isFrench ? '- Write the lyrics in French.' : '- Write the lyrics in English.'}`
      },
      {
        role: 'user',
        content: `Here is my practice journey so far: ${context}\n\nPlease write me a ${mood?.en || 'reflective'} song inspired by my musical growth. ${customTheme ? `Theme: "${customTheme}"` : 'Choose a theme that connects to the chapters I have worked through.'}`
      }
    ];
  }, [selectedMood, customTheme, traction, bardLevel, practiceMinutes, streak, breathingSessions, isFrench]);

  const handleGenerate = async () => {
    if (!isDaaSConnected) return;
    setIsGenerating(true);
    setEditableLyrics('');
    setSongTitle('');
    setSaveConfirm(false);

    try {
      const messages = buildPrompt();
      const response = await askBertrand(messages);
      const content = response?.choices?.[0]?.message?.content || '';
      setEditableLyrics(content);

      // Auto-generate a title from the first line or chorus
      const firstLine = content.split('\n').find(l => l.trim() && !l.startsWith('['));
      setSongTitle(firstLine?.trim()?.slice(0, 50) || (isFrench ? 'Sans Titre' : 'Untitled'));
    } catch (e) {
      console.error('[Quill] Generation failed:', e);
      setEditableLyrics(isFrench ? '⚠️ Erreur de génération. Vérifiez la connexion DaaS.' : '⚠️ Generation error. Check DaaS connection.');
    }
    setIsGenerating(false);
  };

  const handleSave = async () => {
    if (!editableLyrics.trim()) return;
    try {
      await db.songs.add({
        title: songTitle || (isFrench ? 'Sans Titre' : 'Untitled'),
        lyrics: editableLyrics,
        mood: selectedMood,
        theme: customTheme,
        bardLevel,
        practiceMinutes,
        timestamp: new Date().toISOString(),
        isFavorite: false,
      });
      setSaveConfirm(true);
      await loadSongs();
      setTimeout(() => setSaveConfirm(false), 3000);
    } catch (e) {
      console.error('[Quill] Failed to save song:', e);
    }
  };

  const handleDeleteSong = async (id) => {
    try {
      await db.songs.delete(id);
      await loadSongs();
    } catch (e) {
      console.error('[Quill] Failed to delete song:', e);
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const song = await db.songs.get(id);
      if (song) {
        await db.songs.update(id, { isFavorite: !song.isFavorite });
        await loadSongs();
      }
    } catch (e) {
      console.error('[Quill] Failed to toggle favorite:', e);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '640px', margin: '0 auto', color: '#e8edf2' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 12px',
          background: 'rgba(123,106,170,0.15)', border: '1px solid rgba(123,106,170,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Feather size={24} style={{ color: '#7b6aaa' }} />
        </div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem',
          fontWeight: 600, margin: '0 0 4px',
        }}>
          {isFrench ? "Plume du Troubadour" : "Troubadour's Quill"}
        </h2>
        <p style={{
          fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {isFrench ? 'Écriture de chansons alimentée par votre journal' : 'Songwriting powered by your journal'}
        </p>
      </div>

      {/* Offline fallback */}
      {!isDaaSConnected && (
        <div style={{
          padding: '20px', borderRadius: '12px', textAlign: 'center',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '16px',
        }}>
          <Sparkles size={20} style={{ color: 'rgba(201,169,110,0.5)', marginBottom: '8px' }} />
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            {isFrench
              ? "Connectez l'application de bureau Voix Vive pour débloquer l'écriture de chansons IA. La Plume utilise votre LLM local pour générer des paroles personnalisées."
              : "Connect the Voix Vive Desktop App to unlock AI songwriting. The Quill uses your local LLM to generate personalized lyrics from your practice data."
            }
          </p>
        </div>
      )}

      {/* Mood Selector */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace",
          color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase',
          display: 'block', marginBottom: '8px',
        }}>
          {isFrench ? 'Humeur' : 'Mood'}
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {SONG_MOODS.map(mood => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              style={{
                padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem',
                border: `1px solid ${selectedMood === mood.id ? 'rgba(123,106,170,0.6)' : 'rgba(255,255,255,0.08)'}`,
                background: selectedMood === mood.id ? 'rgba(123,106,170,0.15)' : 'rgba(255,255,255,0.03)',
                color: selectedMood === mood.id ? '#b09cd8' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              {mood.emoji} {isFrench ? mood.fr : mood.en}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Theme */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace",
          color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase',
          display: 'block', marginBottom: '8px',
        }}>
          {isFrench ? 'Thème (optionnel)' : 'Theme (optional)'}
        </label>
        <input
          type="text"
          value={customTheme}
          onChange={(e) => setCustomTheme(e.target.value)}
          placeholder={isFrench ? 'Ex: ma première chanson, les étoiles, le voyage...' : 'e.g. my first song, the stars, the journey...'}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#e8edf2', outline: 'none', fontFamily: "'Inter', sans-serif",
          }}
        />
      </div>

      {/* Practice Context Preview */}
      <div style={{
        padding: '12px 16px', borderRadius: '10px', marginBottom: '16px',
        background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.15)',
        fontSize: '0.75rem', color: 'rgba(201,169,110,0.7)',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <BookOpen size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
        {isFrench ? 'Contexte: ' : 'Context: '}
        Bard Lv.{bardLevel} · {practiceMinutes}{isFrench ? ' min' : ' min'} · {streak} {isFrench ? 'jours' : 'day streak'} · {breathingSessions} {isFrench ? 'respirations' : 'breaths'}
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!isDaaSConnected || isGenerating}
        style={{
          width: '100%', padding: '14px', borderRadius: '12px', fontSize: '0.9rem',
          fontWeight: 600, cursor: isDaaSConnected ? 'pointer' : 'not-allowed',
          background: isDaaSConnected
            ? 'linear-gradient(135deg, rgba(123,106,170,0.3) 0%, rgba(123,106,170,0.1) 100%)'
            : 'rgba(255,255,255,0.03)',
          border: `1px solid ${isDaaSConnected ? 'rgba(123,106,170,0.4)' : 'rgba(255,255,255,0.08)'}`,
          color: isDaaSConnected ? '#b09cd8' : 'rgba(255,255,255,0.2)',
          transition: 'all 0.3s ease', marginBottom: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}
      >
        {isGenerating ? (
          <>
            <span style={{ animation: 'loadBreath 2s ease-in-out infinite' }}>✍️</span>
            {isFrench ? 'Le Troubadour compose...' : 'The Troubadour is composing...'}
          </>
        ) : (
          <>
            <Feather size={18} />
            {isFrench ? 'Invoquer la Plume' : 'Invoke the Quill'}
          </>
        )}
      </button>

      {/* Generated/Editable Lyrics */}
      {editableLyrics && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace",
            color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase',
            display: 'block', marginBottom: '8px',
          }}>
            {isFrench ? 'Titre' : 'Title'}
          </label>
          <input
            type="text"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '1rem',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#e8edf2', outline: 'none', marginBottom: '12px',
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 600,
            }}
          />

          <label style={{
            fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace",
            color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase',
            display: 'block', marginBottom: '8px',
          }}>
            {isFrench ? 'Paroles (modifiables)' : 'Lyrics (editable)'}
          </label>
          <textarea
            value={editableLyrics}
            onChange={(e) => setEditableLyrics(e.target.value)}
            rows={16}
            style={{
              width: '100%', padding: '16px', borderRadius: '12px', fontSize: '0.9rem',
              lineHeight: 1.8, background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(123,106,170,0.2)', color: '#e8edf2',
              outline: 'none', resize: 'vertical', fontFamily: "'EB Garamond', serif",
            }}
          />

          {/* Save Button */}
          <button
            onClick={handleSave}
            style={{
              width: '100%', padding: '12px', borderRadius: '10px', marginTop: '12px',
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              background: saveConfirm ? 'rgba(122,170,136,0.2)' : 'rgba(201,169,110,0.15)',
              border: `1px solid ${saveConfirm ? 'rgba(122,170,136,0.4)' : 'rgba(201,169,110,0.3)'}`,
              color: saveConfirm ? '#7aaa88' : '#c9a96e',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.3s ease',
            }}
          >
            <Save size={16} />
            {saveConfirm
              ? (isFrench ? '✓ Sauvegardé dans le Recueil !' : '✓ Saved to Songbook!')
              : (isFrench ? 'Sauvegarder dans le Recueil' : 'Save to Songbook')
            }
          </button>
        </div>
      )}

      {/* Songbook Archive */}
      {savedSongs.length > 0 && (
        <div>
          <button
            onClick={() => setShowSongbook(!showSongbook)}
            style={{
              width: '100%', padding: '12px', borderRadius: '10px', fontSize: '0.8rem',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            <BookOpen size={14} />
            {isFrench ? `Recueil de Chansons (${savedSongs.length})` : `Songbook (${savedSongs.length})`}
            {showSongbook ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showSongbook && (
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {savedSongs.map(song => (
                <div
                  key={song.id}
                  style={{
                    padding: '14px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{
                      fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem',
                      fontWeight: 600, margin: 0, color: '#e8edf2',
                    }}>
                      {song.title}
                    </h4>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleToggleFavorite(song.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                          color: song.isFavorite ? '#c9a96e' : 'rgba(255,255,255,0.2)',
                        }}
                      >
                        <Star size={14} fill={song.isFavorite ? '#c9a96e' : 'none'} />
                      </button>
                      <button
                        onClick={() => handleDeleteSong(song.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                          color: 'rgba(255,100,100,0.4)',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p style={{
                    fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', margin: '0 0 8px',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {new Date(song.timestamp).toLocaleDateString(isFrench ? 'fr-FR' : 'en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })} · Bard Lv.{song.bardLevel || '?'} · {SONG_MOODS.find(m => m.id === song.mood)?.emoji || '🎵'}
                  </p>
                  <pre style={{
                    whiteSpace: 'pre-wrap', fontSize: '0.8rem', lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.55)', margin: 0, maxHeight: '200px',
                    overflow: 'auto', fontFamily: "'EB Garamond', serif",
                  }}>
                    {song.lyrics}
                  </pre>
                  <button
                    onClick={() => {
                      setEditableLyrics(song.lyrics);
                      setSongTitle(song.title);
                      setSelectedMood(song.mood || 'reflective');
                      setCustomTheme(song.theme || '');
                      setShowSongbook(false);
                    }}
                    style={{
                      marginTop: '8px', padding: '6px 12px', borderRadius: '8px',
                      fontSize: '0.7rem', background: 'rgba(123,106,170,0.1)',
                      border: '1px solid rgba(123,106,170,0.2)', color: '#b09cd8',
                      cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {isFrench ? '✏️ Reprendre' : '✏️ Resume Editing'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
