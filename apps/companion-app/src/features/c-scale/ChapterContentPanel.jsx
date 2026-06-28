import { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, Lightbulb, AlertTriangle, Calendar, Wrench, ChevronDown, ChevronUp, Ear, ExternalLink, Volume2, Square } from 'lucide-react';
import { PROTOCOLS, STUDIO_RESOURCES } from '../../data/cScaleCurriculum';
import { devLog } from '../../lib/devLog';

export default function ChapterContentPanel({ chapter }) {
  const [expandedSection, setExpandedSection] = useState('deepDive');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // ── Bertrand Speaks: Web Speech API TTS ──────────────────
  const speakContent = useCallback(() => {
    if (!chapter?.bePhase) return;

    // If already speaking, stop
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // If audio snippet exists, play that instead
    if (audioRef.current && chapter.bePhase.audioSnippet) {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsSpeaking(false);
        return;
      }
      audioRef.current.play();
      setIsSpeaking(true);
      return;
    }

    // Fall back to Web Speech API
    const text = `${chapter.bePhase.title}. ${chapter.bePhase.content} ${chapter.bePhase.action || ''}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 0.9;
    utterance.volume = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    devLog('[ChapterContentPanel] Speaking chapter content via Web Speech API');
  }, [chapter, isSpeaking]);

  // Stop speaking when chapter changes
  useEffect(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [chapter?.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

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
          <div className="flex items-center gap-2 mb-3">
            <Ear size={16} style={{ color: chapter.color }} />
            <h3 className="m-0 text-[0.9rem] font-heading" style={{ color: chapter.color }}>
              {chapter.bePhase.title}
            </h3>
          </div>
          <p className="m-0 text-[0.9rem] md:text-[1rem] text-white/75 leading-relaxed">
            {chapter.bePhase.content}
          </p>
          {chapter.bePhase.action && (
            <p className="mt-3 text-[0.8rem] text-white/40 italic border-l-2 pl-3" style={{ borderColor: `${chapter.color}40` }}>
              {chapter.bePhase.action}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3">
            {chapter.bePhase.audioSnippet && (
              <audio
                ref={audioRef}
                className="flex-1 h-8"
                src={chapter.bePhase.audioSnippet}
                preload="none"
                onEnded={() => setIsSpeaking(false)}
              />
            )}
            <button
              onClick={speakContent}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[0.75rem] font-mono transition-all cursor-pointer"
              style={{
                borderColor: `${chapter.color}44`,
                color: isSpeaking ? '#fff' : chapter.color,
                backgroundColor: isSpeaking ? `${chapter.color}33` : `${chapter.color}11`,
              }}
            >
              {isSpeaking ? <Square size={12} /> : <Volume2 size={12} />}
              {isSpeaking ? 'Stop' : 'Hear Bertrand'}
            </button>
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
