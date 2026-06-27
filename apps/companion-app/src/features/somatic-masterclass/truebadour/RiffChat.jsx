import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Paperclip, Play, Video, File, X, Image as ImageIcon } from 'lucide-react';
import { devError } from '../../../lib/devLog';

export default function RiffChat({
  locale, chatStream, buildSystemPrompt,
  traction, bardLevel, currentFret, currentPhase,
  playerModifier,
  voiceRecording, toggleVoice, voiceInputText,
}) {
  const [messages, setMessages] = useState([
    { role: 'system', content: "Welcome to the Riff. This is your play and application mode. You can attach media and get immediate, fun feedback." }
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [attachments, setAttachments] = useState([]);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  useEffect(() => {
    if (voiceInputText && !voiceRecording) {
      handleSend(voiceInputText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceInputText, voiceRecording]);

  const handleSend = async (textOverride = null) => {
    const text = (typeof textOverride === 'string' ? textOverride : input).trim();
    if ((!text && attachments.length === 0) || streaming) return;
    
    setInput('');
    const userMsg = { role: 'user', content: text, attachments: [...attachments] };
    setMessages(prev => [...prev, userMsg]);
    setAttachments([]);
    
    setStreaming(true);

    // Add placeholder for assistant message
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
    
    try {
      const history = messages.filter(m => m.role !== 'system').slice(-6);
      // Optional: Handle attachments in the prompt context if needed
      const attachmentContext = userMsg.attachments.length > 0 
        ? `[User attached ${userMsg.attachments.length} media files]` 
        : '';
        
      const promptText = attachmentContext ? `${text}\n${attachmentContext}` : text;
      
      await chatStream(
        [
          { role: 'system', content: buildSystemPrompt('Game mode active. Be highly encouraging and focus on play and application.') },
          ...history,
          { role: 'user', content: promptText }
        ],
        (chunk, full) => {
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1].content = full;
            return next;
          });
        },
        { autoPlay: false, max_tokens: 300, temperature: 0.8, mode: 'chat', locale, traction, bardLevel, currentFret, currentPhase, playerModifier }
      );
    } catch (err) {
      devError(err);
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1].content = "Riff connection lost. Try again.";
        return next;
      });
    } finally {
      setStreaming(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const newAttachments = files.map(f => {
      const isVideo = f.type.startsWith('video/');
      const isAudio = f.type.startsWith('audio/');
      const isImage = f.type.startsWith('image/');
      let type = 'file';
      if (isVideo) type = 'video';
      else if (isAudio) type = 'audio';
      else if (isImage) type = 'image';
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        file: f,
        name: f.name,
        type,
        url: URL.createObjectURL(f)
      };
    });
    
    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = '';
  };

  const removeAttachment = (id) => {
    setAttachments(prev => {
      const att = prev.find(a => a.id === id);
      if (att && att.url) URL.revokeObjectURL(att.url);
      return prev.filter(a => a.id !== id);
    });
  };

  const tSize = (base) => `${base}rem`;

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 min-h-0">
        {messages.filter(m => m.role !== 'system').map((msg, i) => (
          <div key={i} className="max-w-[85%] rounded-xl py-2.5 px-3.5" style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            background: msg.role === 'user' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${msg.role === 'user' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.1)'}`,
          }}>
            {/* Attachments preview */}
            {msg.attachments && msg.attachments.length > 0 && (
              <div className="flex gap-2 flex-wrap" style={{ marginBottom: msg.content ? 8 : 0 }}>
                {msg.attachments.map(att => (
                  <div key={att.id} className="bg-black/30 rounded-md py-1 px-2 flex items-center gap-1.5 text-[0.75rem] text-[#a7f3d0]">
                    {att.type === 'video' ? <Video size={14} /> :
                     att.type === 'audio' ? <Play size={14} /> :
                     att.type === 'image' ? <ImageIcon size={14} /> :
                     <File size={14} />}
                    {att.name}
                  </div>
                ))}
              </div>
            )}

            <div className="leading-[1.5]" style={{
              fontSize: tSize(1.05), color: msg.role === 'user' ? '#a7f3d0' : 'rgba(255,255,255,0.85)',
              fontFamily: msg.role === 'user' ? 'JetBrains Mono, monospace' : 'Cormorant Garamond, serif',
              fontStyle: msg.role === 'user' ? 'normal' : 'italic'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {streaming && messages[messages.length-1].role === 'user' && (
          <div className="self-start text-[#10b981] font-mono text-[0.8rem]" style={{ animation: 'pulse 1s infinite' }}>
            Bertrand is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Staging */}
      {attachments.length > 0 && (
        <div className="flex gap-1.5 py-2 flex-wrap">
          {attachments.map(att => (
            <div key={att.id} className="bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] rounded-lg py-1 px-2 flex items-center gap-1.5 text-[0.75rem] text-[#a7f3d0]">
              {att.type === 'video' ? <Video size={14} /> :
               att.type === 'audio' ? <Play size={14} /> :
               att.type === 'image' ? <ImageIcon size={14} /> :
               <File size={14} />}
              <span className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                {att.name}
              </span>
              <button onClick={() => removeAttachment(att.id)} className="bg-transparent border-none text-[#10b981] cursor-pointer flex">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-1.5 mt-2">
        <input
          type="file"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,video/*,audio/*,.pdf,.md"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={streaming || voiceRecording}
          title="Attach media or video record"
          className="w-11 h-11 rounded-lg shrink-0 bg-white/[0.05] border border-white/10 text-white/50 flex items-center justify-center"
          style={{ cursor: streaming ? 'default' : 'pointer' }}
        >
          <Paperclip size={20} />
        </button>

        <input
          type="text" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={voiceRecording ? "Recording play..." : "Chat in Riff Mode..."}
          disabled={streaming || voiceRecording}
          className="flex-1 rounded-lg py-2.5 px-3.5 font-mono outline-none"
          style={{
            background: voiceRecording ? 'rgba(204,85,85,0.06)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${voiceRecording ? 'rgba(204,85,85,0.2)' : 'rgba(255,255,255,0.1)'}`,
            color: voiceRecording ? 'rgba(204,85,85,0.6)' : 'rgba(255,255,255,0.8)',
            fontSize: tSize(1.05),
          }}
        />

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
          onClick={() => handleSend()}
          disabled={streaming || (!input.trim() && attachments.length === 0) || voiceRecording}
          className="w-11 h-11 rounded-lg shrink-0 border border-[rgba(16,185,129,0.3)] text-[#10b981] flex items-center justify-center"
          style={{
            background: streaming || (!input.trim() && attachments.length === 0) || voiceRecording ? 'rgba(255,255,255,0.05)' : 'rgba(16, 185, 129, 0.2)',
            cursor: streaming || (!input.trim() && attachments.length === 0) || voiceRecording ? 'default' : 'pointer',
          }}
        >
          <Send size={22} />
        </button>
      </div>
    </div>
  );
}
