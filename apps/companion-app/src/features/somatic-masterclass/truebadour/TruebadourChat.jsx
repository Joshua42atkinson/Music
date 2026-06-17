import React, { useState } from 'react';
import { Mic, MicOff, Send, Play, CheckCircle2, Clock, Volume2, Download } from 'lucide-react';

export default function TruebadourChat({
  locale, detectedEmotion, inbox = [], guideStreaming, guideEndRef,
  pendingTool: _pendingTool, confirmToolCall: _confirmToolCall, cancelToolCall: _cancelToolCall,
  guideInputRef, guideInput, setGuideInput, sendGuideMessage, voiceRecording, toggleVoice,
  notifications = [], textPrefs = { size: 'normal', color: 'purple' }, playReview, downloadReview
}) {
  const scaleMap = { small: 0.85, normal: 1, large: 1.25 };
  const scale = scaleMap[textPrefs.size] || 1;
  const tSize = (base) => `${base * scale}rem`;

  const colorThemes = {
    purple: { userText: '#c4b5fd', userBg: 'rgba(139,92,246,0.12)', userBorder: 'rgba(139,92,246,0.25)', highlight: 'text-violet-400', border: 'border-violet-500/20' },
    lime:   { userText: '#a3e635', userBg: 'rgba(132,204,22,0.12)',  userBorder: 'rgba(132,204,22,0.25)',  highlight: 'text-lime-400',   border: 'border-lime-500/20' },
    orange: { userText: '#fb923c', userBg: 'rgba(249,115,22,0.12)',  userBorder: 'rgba(249,115,22,0.25)',  highlight: 'text-orange-400', border: 'border-orange-500/20' },
  };
  const theme = colorThemes[textPrefs.color] || colorThemes.purple;
  
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="flex flex-col gap-2 mt-2.5">
      <div className={`border-b ${theme.border} pb-2 mb-1 flex justify-between items-center`}>
        <span className={`text-base font-mono uppercase tracking-widest ${theme.highlight}`}>
          {locale === 'fr' ? 'Évaluations' : 'Review Inbox'}
        </span>
        {detectedEmotion && (
          <span className="text-sm font-mono uppercase px-2 py-0.5 rounded-full border border-violet-500/30 text-violet-300">
            State: {detectedEmotion}
          </span>
        )}
      </div>
      
      {/* Inbox List */}
      <div className="max-h-[220px] overflow-y-auto flex flex-col gap-2 pr-1">
        {inbox.length === 0 && (
          <div className="flex flex-col gap-1.5 items-center opacity-60 mt-5">
            <Clock size={32} />
            <p className="font-mono text-center" style={{ fontSize: tSize(0.95) }}>
              {locale === 'fr'
                ? "Aucune évaluation. Soumettez une question ou un enregistrement."
                : "No reviews yet. Submit a question or recording to Bertrand."}
            </p>
          </div>
        )}

        {inbox.map((item) => (
          <div key={item.id} className="bg-white/[0.05] border border-white/10 rounded-lg p-3 flex flex-col gap-2">
            {/* Submission Preview */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <span className="text-white/40 font-mono uppercase" style={{ fontSize: tSize(0.75) }}>
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
                <p className="font-mono mt-1" style={{ fontSize: tSize(1.05), color: theme.userText }}>
                  "{item.prompt}"
                </p>
              </div>
            </div>

            {/* Status / Review Player */}
            {item.status === 'pending' ? (
              <div className="flex items-center gap-1.5 text-[#fbbf24] font-mono mt-1" style={{ fontSize: tSize(0.85) }}>
                <Clock size={16} className="animate-pulse" />
                <span>{locale === 'fr' ? 'Bertrand évalue...' : 'Bertrand is evaluating...'}</span>
              </div>
            ) : (
              <div className="mt-1">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      setExpandedId(expandedId === item.id ? null : item.id);
                      if (expandedId !== item.id) playReview(item.response);
                    }}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-md font-mono cursor-pointer flex-1"
                    style={{
                      background: theme.userBg, border: `1px solid ${theme.userBorder}`,
                      color: theme.userText, fontSize: tSize(0.85),
                    }}
                  >
                    <Volume2 size={16} />
                    <span>{locale === 'fr' ? 'Écouter l\'évaluation' : 'Play Review'}</span>
                  </button>
                  <button
                    onClick={() => downloadReview && downloadReview(item.response)}
                    className="flex items-center justify-center bg-white/[0.05] border border-white/10 text-white/50 py-1.5 px-3 rounded-md cursor-pointer"
                    title={locale === 'fr' ? 'Télécharger l\'audio' : 'Download Audio'}
                  >
                    <Download size={16} />
                  </button>
                </div>

                {expandedId === item.id && (
                  <p className="font-heading leading-[1.5] bg-black/30 p-3 rounded-md mt-2 italic"
                    style={{ fontSize: tSize(1.05), color: 'rgba(255,255,255,0.85)' }}>
                    {item.response}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        {/* System Notifications */}
        {notifications.map(n => (
          <div key={n.id} className="rounded-lg py-2 px-3 cursor-pointer mt-1" style={{
            background: n.type === 'alert' ? 'rgba(239,68,68,0.1)' : 'rgba(139,92,246,0.15)',
            border: `1px solid ${n.type === 'alert' ? 'rgba(239,68,68,0.3)' : 'rgba(139,92,246,0.4)'}`,
          }} onClick={n.action}>
            <div className="font-bold font-mono" style={{ fontSize: tSize(0.85), color: n.type === 'alert' ? '#fca5a5' : '#c4b5fd' }}>
              🔔 {n.title}
            </div>
          </div>
        ))}
        <div ref={guideEndRef} />
      </div>
      
      {/* Input */}
      <div className="flex gap-1.5 mt-1">
        <input
          type="text" ref={guideInputRef} value={guideInput}
          onChange={e => setGuideInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendGuideMessage()}
          placeholder={voiceRecording
            ? (locale === 'fr' ? 'Écoute…' : 'Recording submission…')
            : (locale === 'fr' ? 'Soumettre une question…' : 'Submit a question…')}
          disabled={guideStreaming || voiceRecording}
          data-testid="chat-input"
          className="flex-1 rounded-lg py-2.5 px-3.5 font-mono outline-none"
          style={{
            background: voiceRecording ? 'rgba(204,85,85,0.06)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${voiceRecording ? 'rgba(204,85,85,0.2)' : 'rgba(255,255,255,0.1)'}`,
            color: voiceRecording ? 'rgba(204,85,85,0.6)' : 'rgba(255,255,255,0.8)',
            fontSize: tSize(1.05),
          }}
        />
        {/* Mic button */}
        <button
          onClick={toggleVoice}
          title={voiceRecording ? 'Stop recording' : 'Record submission'}
          className="w-11 h-11 rounded-lg shrink-0 cursor-pointer flex items-center justify-center transition-all duration-200"
          style={{
            background: voiceRecording ? 'rgba(204,85,85,0.2)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${voiceRecording ? 'rgba(204,85,85,0.4)' : 'rgba(255,255,255,0.1)'}`,
            color: voiceRecording ? '#cc5555' : 'rgba(255,255,255,0.4)',
            animation: voiceRecording ? 'pulseMic 1.5s ease-in-out infinite' : 'none',
          }}
        >
          {voiceRecording ? <Mic size={24} /> : <MicOff size={24} />}
        </button>
        <button
          onClick={sendGuideMessage}
          disabled={guideStreaming || !guideInput.trim() || voiceRecording}
          className="w-11 h-11 rounded-lg shrink-0 border border-[rgba(139,92,246,0.3)] text-[#c4b5fd] flex items-center justify-center"
          style={{
            background: guideStreaming || !guideInput.trim() || voiceRecording ? 'rgba(255,255,255,0.05)' : 'rgba(139,92,246,0.2)',
            cursor: guideStreaming || !guideInput.trim() || voiceRecording ? 'default' : 'pointer',
          }}
        >
          <Send size={22} />
        </button>
      </div>
    </div>
  );
}
