import { devWarn } from '../lib/devLog';
import React, { useState, useEffect, useCallback } from 'react';
import { Feather, BookOpen, Sparkles, Save, Star, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useBackendBridge } from '../hooks/useBackendBridge';
import { useScaffolding } from './ScaffoldingProvider';
import { useLocale } from '../hooks/useLocale';
import { db } from '../data/localDatabase';
import frets from '../data/chapterData';
import { devError } from '../lib/devLog';

// ═══════════════════════════════════════════════════════════
// TRUEBADOUR'S QUILL — AI Songwriting Companion (Fret 4)
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
  const { locale, t } = useLocale();
  const { isDaaSConnected, isLMStudioConnected, lmStudioModel, askBertrand } = useBackendBridge();
  const { traction, practiceMinutes, streak, breathingSessions, bardLevel } = useScaffolding();
  
  // LM Studio takes priority over DaaS for AI features
  const aiConnected = isLMStudioConnected || isDaaSConnected;

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
      devWarn('[Quill] Failed to load songs:', e);
    }
  };

  // Load saved songs from IndexedDB on mount
  useEffect(() => {
    const init = async () => {
      try {
        const songs = await db.songs.orderBy('timestamp').reverse().toArray();
        setSavedSongs(songs);
      } catch (e) {
        devWarn('[Quill] Failed to load songs:', e);
      }
    };
    init();
  }, []);

  // Build a rich context prompt from the student's practice data + curriculum
  const buildPrompt = useCallback(() => {
    const mood = SONG_MOODS.find(m => m.id === selectedMood);
    const fretData = Object.values(traction?.frets || {});
    const completedFrets = fretData.filter(f => f.traction >= 60).length;
    const avgPitch = fretData.length > 0
      ? Math.round(fretData.reduce((s, f) => s + (f.pitchAccuracy || 0), 0) / fretData.length)
      : 0;

    // Build curriculum context from actual chapterData
    const curriculumSummary = buildCurriculumContext(traction?.frets || {}, locale);

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
        content: `You are the Truebadour's Quill, a sovereign AI songwriting companion embedded in the Voix Vive Masterclass — Bertrand Laurence's somatic guitar pedagogy platform. You help guitar students write deeply personal songs inspired by their practice journey.

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
${locale === 'fr' ? '- Write the lyrics in French.' : '- Write the lyrics in English.'}`
      },
      {
        role: 'user',
        content: `Here is my practice journey so far: ${context}\n\nPlease write me a ${mood?.en || 'reflective'} song inspired by my musical growth. ${customTheme ? `Theme: "${customTheme}"` : 'Choose a theme that connects to the chapters I have worked through.'}`
      }
    ];
  }, [selectedMood, customTheme, traction, bardLevel, practiceMinutes, streak, breathingSessions, locale]);

  const handleGenerate = async () => {
    if (!aiConnected) return;
    setIsGenerating(true);
    setEditableLyrics('');
    setSongTitle('');
    setSaveConfirm(false);

    try {
      const messages = buildPrompt();
      const response = await askBertrand(messages, {
        max_tokens: 2048,
        temperature: 0.8,
        maxContext: 32768,
        gpuLayers: 999,
      });
      const content = response?.choices?.[0]?.message?.content || '';
      setEditableLyrics(content);

      // Auto-generate a title from the first line or chorus
      const firstLine = content.split('\n').find(l => l.trim() && !l.startsWith('['));
      setSongTitle(firstLine?.trim()?.slice(0, 50) || t('untitled'));
    } catch (e) {
      devError('[Quill] Generation failed:', e);
      setEditableLyrics(t('generationError'));
    }
    setIsGenerating(false);
  };

  const handleSave = async () => {
    if (!editableLyrics.trim()) return;
    try {
      await db.songs.add({
        title: songTitle || t('untitled'),
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
      devError('[Quill] Failed to save song:', e);
    }
  };

  const handleDeleteSong = async (id) => {
    if (!window.confirm('Are you sure you want to delete this song? This cannot be undone.')) return;
    try {
      await db.songs.delete(id);
      await loadSongs();
    } catch (e) {
      devError('[Quill] Failed to delete song:', e);
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
      devError('[Quill] Failed to toggle favorite:', e);
    }
  };

  return (
    <div className="p-5 max-w-[640px] mx-auto text-[#e8edf2]">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full mx-auto mb-3 bg-[rgba(123,106,170,0.15)] border border-[rgba(123,106,170,0.3)] flex items-center justify-center">
          <Feather size={24} className="text-[#7b6aaa]" />
        </div>
        <h2 className="font-heading text-[1.5rem] font-semibold m-0 mb-1">
          {t('truebadourQuill')}
        </h2>
        <p className="text-[0.75rem] text-white/40 font-mono">
          {t('songwritingPoweredBy')}
        </p>
      </div>

      {/* Offline fallback */}
      {!aiConnected && (
        <div className="p-5 rounded-xl text-center bg-white/[0.03] border border-white/[0.08] mb-4">
          <Sparkles size={20} className="text-cf-gold/50 mb-2 mx-auto" />
          <p className="text-[0.85rem] text-white/50 leading-[1.6]">
            {t('connectForSongwriting')}
          </p>
          <p className="text-[0.7rem] text-white/30 mt-2">
            LM Studio (port 1234) or DaaS Server (port 8080)
          </p>
        </div>
      )}

      {/* LM Studio connected indicator */}
      {isLMStudioConnected && lmStudioModel && (
        <div className="py-3 px-4 rounded-xl mb-4 bg-[rgba(122,170,136,0.1)] border border-[rgba(122,170,136,0.2)] flex items-center gap-2">
          <span className="text-[0.75rem] text-[#7aaa88]">
            ⚡ Powered by {lmStudioModel.id?.split('/').pop() || 'LM Studio'}
          </span>
        </div>
      )}

      {/* Mood Selector */}
      <div className="mb-4">
        <label className="block text-[0.65rem] font-mono text-white/35 tracking-[0.08em] uppercase mb-2">
          {t('mood')}
        </label>
        <div className="flex flex-wrap gap-2">
          {SONG_MOODS.map(mood => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className="py-1.5 px-3.5 rounded-[20px] text-[0.8rem] cursor-pointer transition-all duration-200"
              style={{
                border: `1px solid ${selectedMood === mood.id ? 'rgba(123,106,170,0.6)' : 'rgba(255,255,255,0.08)'}`,
                background: selectedMood === mood.id ? 'rgba(123,106,170,0.15)' : 'rgba(255,255,255,0.03)',
                color: selectedMood === mood.id ? '#b09cd8' : 'rgba(255,255,255,0.5)',
              }}
            >
              {mood.emoji} {locale === 'fr' ? mood.fr : mood.en}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Theme */}
      <div className="mb-4">
        <label className="block text-[0.65rem] font-mono text-white/35 tracking-[0.08em] uppercase mb-2">
          {t('themeOptional')}
        </label>
        <input
          type="text"
          value={customTheme}
          onChange={(e) => setCustomTheme(e.target.value)}
          placeholder={t('themePlaceholder')}
          className="w-full py-2.5 px-3.5 rounded-xl text-[0.85rem] bg-white/[0.04] border border-white/10 text-[#e8edf2] outline-none focus:border-white/20 transition-colors font-body"
        />
      </div>

      {/* Practice Context Preview */}
      <div className="py-3 px-4 rounded-xl mb-4 bg-cf-gold/5 border border-cf-gold/15 text-[0.75rem] text-cf-gold/70 font-mono">
        <BookOpen size={14} className="mr-1.5 align-middle inline" />
        {t('context')}
        Bard Lv.{bardLevel} · {practiceMinutes}{t('min')} · {streak}{t('daySuffix')} · {breathingSessions} {t('breaths')}
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!aiConnected || isGenerating}
        className="w-full py-3.5 rounded-xl text-[0.9rem] font-semibold mb-5 flex items-center justify-center gap-2 transition-all duration-300"
        style={{
          cursor: aiConnected ? 'pointer' : 'not-allowed',
          background: aiConnected
            ? 'linear-gradient(135deg, rgba(123,106,170,0.3) 0%, rgba(123,106,170,0.1) 100%)'
            : 'rgba(255,255,255,0.03)',
          border: `1px solid ${aiConnected ? 'rgba(123,106,170,0.4)' : 'rgba(255,255,255,0.08)'}`,
          color: aiConnected ? '#b09cd8' : 'rgba(255,255,255,0.2)',
        }}
      >
        {isGenerating ? (
          <>
            <span style={{ animation: 'loadBreath 2s ease-in-out infinite' }}>✍️</span>
            {t('composing')}
          </>
        ) : (
          <>
            <Feather size={18} />
            {t('invokeQuill')}
          </>
        )}
      </button>

      {/* Generated/Editable Lyrics */}
      {editableLyrics && (
        <div className="mb-5">
          <label className="block text-[0.65rem] font-mono text-white/35 tracking-[0.08em] uppercase mb-2">
            {t('songTitle')}
          </label>
          <input
            type="text"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            className="w-full py-2.5 px-3.5 rounded-xl text-[1rem] bg-white/[0.04] border border-white/10 text-[#e8edf2] outline-none mb-3 font-heading font-semibold focus:border-white/20 transition-colors"
          />

          <label className="block text-[0.65rem] font-mono text-white/35 tracking-[0.08em] uppercase mb-2">
            {t('lyricsEditable')}
          </label>
          <textarea
            value={editableLyrics}
            onChange={(e) => setEditableLyrics(e.target.value)}
            rows={16}
            className="w-full p-4 rounded-xl text-[0.9rem] leading-[1.8] bg-white/[0.04] border border-[rgba(123,106,170,0.2)] text-[#e8edf2] outline-none resize-y font-quote focus:border-[rgba(123,106,170,0.4)] transition-colors"
          />

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl mt-3 text-[0.85rem] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-300"
            style={{
              background: saveConfirm ? 'rgba(122,170,136,0.2)' : 'rgba(var(--cf-gold-rgb),0.15)',
              border: `1px solid ${saveConfirm ? 'rgba(122,170,136,0.4)' : 'rgba(var(--cf-gold-rgb),0.3)'}`,
              color: saveConfirm ? '#7aaa88' : 'var(--cf-gold)',
            }}
          >
            <Save size={16} />
            {saveConfirm
              ? t('savedToSongbook')
              : t('saveToSongbook')
            }
          </button>
        </div>
      )}

      {/* Songbook Archive */}
      {savedSongs.length > 0 && (
        <div>
          <button
            onClick={() => setShowSongbook(!showSongbook)}
            className="w-full py-3 rounded-xl text-[0.8rem] bg-white/[0.03] border border-white/[0.08] text-white/50 cursor-pointer flex items-center justify-center gap-2 font-mono uppercase tracking-[0.08em] hover:bg-white/[0.06] transition-colors"
          >
            <BookOpen size={14} />
            {locale === 'fr' ? `Recueil de Chansons (${savedSongs.length})` : `Songbook (${savedSongs.length})`}
            {showSongbook ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showSongbook && (
            <div className="mt-3 flex flex-col gap-2">
              {savedSongs.map(song => (
                <div
                  key={song.id}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-heading text-[1rem] font-semibold m-0 text-[#e8edf2]">
                      {song.title}
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleFavorite(song.id)}
                        className="bg-transparent border-none cursor-pointer p-1 hover:opacity-80 transition-opacity"
                        style={{ color: song.isFavorite ? 'var(--cf-gold)' : 'rgba(255,255,255,0.2)' }}
                      >
                        <Star size={14} fill={song.isFavorite ? 'var(--cf-gold)' : 'none'} />
                      </button>
                      <button
                        onClick={() => handleDeleteSong(song.id)}
                        className="bg-transparent border-none cursor-pointer p-1 hover:opacity-80 transition-opacity"
                        style={{ color: 'rgba(255,100,100,0.4)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-[0.7rem] text-white/30 mb-2 font-mono">
                    {new Date(song.timestamp).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })} · Bard Lv.{song.bardLevel || '?'} · {SONG_MOODS.find(m => m.id === song.mood)?.emoji || '🎵'}
                  </p>
                  <pre className="whitespace-pre-wrap text-[0.8rem] leading-[1.6] text-white/55 m-0 max-h-[200px] overflow-auto font-quote">
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
                    className="mt-2 py-1.5 px-3 rounded-lg text-[0.7rem] bg-[rgba(123,106,170,0.1)] border border-[rgba(123,106,170,0.2)] text-[#b09cd8] cursor-pointer font-mono hover:bg-[rgba(123,106,170,0.2)] transition-colors"
                  >
                    {t('resumeEditing')}
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
