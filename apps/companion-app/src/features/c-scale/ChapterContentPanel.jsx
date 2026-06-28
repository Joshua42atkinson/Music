import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Lightbulb, AlertTriangle, Calendar, Wrench, ChevronDown, ChevronUp, Ear, ExternalLink, Volume2, Square } from 'lucide-react';
import { PROTOCOLS, STUDIO_RESOURCES } from '../../data/cScaleCurriculum';
import { devLog } from '../../lib/devLog';

export default function ChapterContentPanel({ chapter }) {
  const [expandedSection, setExpandedSection] = useState('deepDive');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const [isContinuousPlay, setIsContinuousPlay] = useState(false);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // ── Media Session API for Lock Screen & Headphones ──────────
  useEffect(() => {
    if ('mediaSession' in navigator && chapter) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: chapter.title,
        artist: 'Bertrand Laurence',
        album: 'The C Scale Journey',
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        window.dispatchEvent(new CustomEvent('voixvive:ai_command', { detail: { action: 'previous' } }));
      });

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        window.dispatchEvent(new CustomEvent('voixvive:ai_command', { detail: { action: 'next' } }));
      });
    }
  }, [chapter]);

  // ── Auto-Play logic for Continuous Mode ──────────────────────
  useEffect(() => {
    if (isContinuousPlay && audioRef.current && chapter?.bePhase?.audioSnippet) {
      // Slight delay ensures the DOM audio src is updated before play()
      const timer = setTimeout(() => {
        audioRef.current.play().then(() => setIsSpeaking(true)).catch((e) => devLog('Autoplay prevented:', e));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [chapter?.id, isContinuousPlay]);

  // ── Bertrand Speaks: Web Speech API TTS ──────────────────
  const speakContent = useCallback(() => {
    if (!chapter?.bePhase) return;

    // If already speaking, stop
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    // If audio snippet exists, play that instead
    if (audioRef.current && chapter.bePhase.audioSnippet) {
      audioRef.current.play();
      setIsSpeaking(true);
      return;
    }

    // Fall back to Web Speech API
    const title = isFr && chapter.bePhase.titleFr ? chapter.bePhase.titleFr : chapter.bePhase.title;
    const content = isFr && chapter.bePhase.contentFr ? chapter.bePhase.contentFr : chapter.bePhase.content;
    const action = isFr && chapter.bePhase.actionFr ? chapter.bePhase.actionFr : chapter.bePhase.action;
    const text = `${title}. ${content} ${action || ''}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 0.9;
    utterance.volume = 0.9;
    utterance.onend = () => {
      setIsSpeaking(false);
      if (isContinuousPlay) window.dispatchEvent(new CustomEvent('voixvive:ai_command', { detail: { action: 'next' } }));
    };
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    devLog('[ChapterContentPanel] Speaking chapter content via Web Speech API');
  }, [chapter, isSpeaking, isContinuousPlay]);

  // Stop speaking when chapter changes (unless continuous play is active)
  useEffect(() => {
    if (!isContinuousPlay) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [chapter?.id, isContinuousPlay]);

  // Cleanup on unmount
  useEffect(() => {
    const handleInterrupt = () => {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
    
    window.addEventListener('voixvive:ai_interrupt', handleInterrupt);
    
    return () => {
      window.removeEventListener('voixvive:ai_interrupt', handleInterrupt);
      window.speechSynthesis?.cancel();
    };
  }, []);

  const handleAudioEnded = () => {
    setIsSpeaking(false);
    if (isContinuousPlay) {
      window.dispatchEvent(new CustomEvent('voixvive:ai_command', { detail: { action: 'next' } }));
    }
  };

  const protocol = chapter.protocol ? PROTOCOLS[chapter.protocol] : null;

  const sections = [
    { id: 'deepDive', icon: BookOpen, label: 'Deep Dive', content: chapter.deepDive },
    { id: 'practiceTips', icon: Lightbulb, label: 'Practice Tips', content: chapter.practiceTips, isList: true },
    { id: 'commonMistakes', icon: AlertTriangle, label: 'Common Mistakes', content: chapter.commonMistakes, isList: true },
    { id: 'practicePlan', icon: Calendar, label: 'Practice Plan', content: chapter.practicePlan },
  ];

  return (
    <div className="px-[18px] md:px-[27px] py-[27px] md:py-[40px] border-b border-white/5 flex-1 flex flex-col gap-[18px] overflow-y-auto">
      {/* BE Phase — Bertrand's teaching */}
      {chapter.bePhase && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-[18px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Ear size={16} style={{ color: chapter.color }} />
              <h3 className="m-0 text-[0.9rem] font-heading" style={{ color: chapter.color }}>
                {isFr && chapter.bePhase.titleFr ? chapter.bePhase.titleFr : chapter.bePhase.title}
              </h3>
            </div>
            
            <button
              onClick={() => setIsContinuousPlay(!isContinuousPlay)}
              className={`px-3 py-1 rounded-full text-[0.7rem] font-mono tracking-wider transition-all border flex items-center gap-1.5 ${isContinuousPlay ? 'bg-[var(--vv-gold)]/20 border-[var(--vv-gold)]/50 text-[var(--vv-gold)]' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
              title="Continuous Play / Headless Mode"
            >
              <div className={`w-2 h-2 rounded-full ${isContinuousPlay ? 'bg-[var(--vv-gold)] animate-pulse' : 'bg-white/30'}`} />
              HEADLESS
            </button>
          </div>
          <p className="m-0 text-[0.9rem] md:text-[1rem] text-white/75 leading-relaxed">
            {isFr && chapter.bePhase.contentFr ? chapter.bePhase.contentFr : chapter.bePhase.content}
          </p>
          {(isFr && chapter.bePhase.actionFr ? chapter.bePhase.actionFr : chapter.bePhase.action) && (
            <p className="mt-3 text-[0.8rem] text-white/40 italic border-l-2 pl-3" style={{ borderColor: `${chapter.color}40` }}>
              {isFr && chapter.bePhase.actionFr ? chapter.bePhase.actionFr : chapter.bePhase.action}
            </p>
          )}
          <div className="mt-4 flex flex-col gap-3">
            {(isFr && chapter.bePhase.audioSnippetFr ? chapter.bePhase.audioSnippetFr : chapter.bePhase.audioSnippet) && (
              <audio
                ref={audioRef}
                className="w-full h-10 rounded-lg outline-none"
                src={isFr && chapter.bePhase.audioSnippetFr ? chapter.bePhase.audioSnippetFr : chapter.bePhase.audioSnippet}
                controls
                controlsList="nodownload"
                preload="metadata"
                onPlay={() => setIsSpeaking(true)}
                onPause={() => setIsSpeaking(false)}
                onEnded={handleAudioEnded}
                style={{ filter: 'invert(0.9) sepia(1) hue-rotate(180deg) opacity(0.8)' }} // Custom styling for native audio player to match dark theme loosely
              />
            )}
          </div>
        </div>
      )}

      {/* Collapsible content sections */}
      {sections.filter(s => s.content).map((section) => {
        const Icon = section.icon;
        const isOpen = expandedSection === section.id;
        return (
          <div key={section.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-[18px] cursor-pointer transition-all hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-2">
                <Icon size={16} style={{ color: chapter.color }} />
                <span className="text-[0.85rem] font-semibold text-white/80">{section.label}</span>
              </div>
              {isOpen ? <ChevronUp size={16} className="text-white/30" /> : <ChevronDown size={16} className="text-white/30" />}
            </button>
            {isOpen && (
              <div className="px-[18px] pb-[18px]">
                {section.isList ? (
                  <ul className="m-0 p-0 list-none flex flex-col gap-2">
                    {section.content.map((item, i) => (
                      <li key={i} className="text-[0.85rem] text-white/65 leading-relaxed flex gap-2">
                        <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full" style={{ background: chapter.color }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="m-0 text-[0.85rem] text-white/65 leading-relaxed">{section.content}</p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Protocol */}
      {protocol && (
        <div className="rounded-xl border p-[18px]" style={{ borderColor: `${chapter.color}30`, background: `${chapter.color}08` }}>
          <div className="flex items-center gap-2 mb-2">
            <Wrench size={16} style={{ color: chapter.color }} />
            <h3 className="m-0 text-[0.85rem] font-heading" style={{ color: chapter.color }}>
              {protocol.label}
            </h3>
          </div>
          <p className="m-0 text-[0.8rem] text-white/55 leading-relaxed">{protocol.desc}</p>
        </div>
      )}

      {/* Studio Resources */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-[18px]">
        <div className="flex items-center gap-2 mb-3">
          <ExternalLink size={16} style={{ color: chapter.color }} />
          <h3 className="m-0 text-[0.85rem] font-semibold text-white/80">Studio Resources</h3>
        </div>
        <div className="flex flex-col gap-2">
          {STUDIO_RESOURCES.map((resource, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full" style={{ background: chapter.color }} />
              {resource.url ? (
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-[0.8rem] text-white/60 hover:text-white/90 transition-colors">
                  {resource.label} — {resource.desc}
                </a>
              ) : (
                <span className="text-[0.8rem] text-white/50">
                  {resource.label} — {resource.desc}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* DO Phase — call to action */}
      {chapter.doPhase && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-[18px] flex flex-col items-center text-center gap-3">
          <p className="m-0 text-[0.9rem] text-white/70 font-light">
            {chapter.doPhase.instruction}
          </p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('voixvive:open_truebadour'))}
            className="px-6 py-3 rounded-full font-mono text-[0.8rem] uppercase tracking-[0.15em] transition-all cursor-pointer"
            style={{
              backgroundColor: `${chapter.color}26`,
              borderColor: `${chapter.color}66`,
              color: chapter.color,
              borderWidth: '1px',
              borderStyle: 'solid',
              boxShadow: `0 0 20px ${chapter.color}33`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${chapter.color}40`; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${chapter.color}26`; }}
          >
            Summon Mentor
          </button>
        </div>
      )}
    </div>
  );
}
