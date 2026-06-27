import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Mic, MicOff, Paperclip, Play, Video, File, X, Image as ImageIcon } from 'lucide-react';
import { searchChunks, buildContextBlock } from '../../../data/ragStore';
import { devError } from '../../../lib/devLog';

export default function StudyChat({
  locale,
  chatStream,
  buildSystemPrompt,
  traction,
  bardLevel,
  currentFret,
  currentPhase,
  playerModifier,
  voiceRecording,
  toggleVoice,
  voiceInputText
}) {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: locale === 'fr' 
      ? 'Bonjour ! Je suis là pour vous aider à étudier plus rapidement.' 
      : 'Hello! I am here to help you study quickly.'
  }]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [attachments, setAttachments] = useState([]);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const scaleMap = { small: 0.85, normal: 1, large: 1.25 };
  const scale = scaleMap['normal'];
  const tSize = (base) => `${base * scale}rem`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);
  
  useEffect(() => {
    if (voiceInputText && !voiceRecording) {
       setInput(voiceInputText);
    }
  }, [voiceInputText, voiceRecording]);

  const handleSend = async () => {
    const text = input.trim();
    if ((!text && attachments.length === 0) || isStreaming) return;
    
    setInput('');
    setIsStreaming(true);

    const userMsg = { role: 'user', content: text, attachments: [...attachments] };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setAttachments([]);

    try {
      const attachmentContext = userMsg.attachments.length > 0 
        ? `[User attached ${userMsg.attachments.length} media files]` 
        : '';
        
      const promptText = attachmentContext ? `${text}\n${attachmentContext}` : text;
      
      const ragChunks = await searchChunks(promptText, { topK: 3, locale, filter: { fret: currentFret } });
      const ragContext = buildContextBlock(ragChunks);
      
      const systemPrompt = buildSystemPrompt(ragContext);
      
      // Pass history without attachments inside the API call content
      const chatHistory = newMessages.map(m => ({ role: m.role, content: m.role === 'user' && m.attachments?.length > 0 && m.content ? `${m.content}\n[User attached ${m.attachments.length} media files]` : m.content }));
      
      const chatMessages = [
        { role: 'system', content: systemPrompt },
        ...chatHistory
      ];

      const result = await chatStream(
        chatMessages,
        null,
        { autoPlay: true, max_tokens: 256, temperature: 0.7, mode: 'chat', locale, traction, bardLevel, currentFret, currentPhase, playerModifier }
      );

      const assistantMessage = result?.choices?.[0]?.message?.content;
      if (assistantMessage) {
        setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
      } else {
         setMessages(prev => [...prev, { role: 'assistant', content: locale === 'fr' ? 'Désolé, erreur de réponse.' : 'Sorry, response error.' }]);
      }
    } catch (err) {
      devError(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network Error.' }]);
    } finally {
      setIsStreaming(false);
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

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className={`border-b border-white/10 pb-2 mb-1 flex justify-between items-center`}>
        <span className={`text-base font-mono uppercase tracking-widest text-emerald-400`}>
          {locale === 'fr' ? 'Chat d\'étude' : 'Study Chat'}
        </span>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
        {messages.map((msg, i) => (
          <div key={i} className="max-w-[85%] rounded-lg py-2.5 px-3" style={{
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
            <p className="m-0" style={{
                fontSize: tSize(0.95),
                color: msg.role === 'user' ? '#a7f3d0' : 'rgba(255,255,255,0.9)',
                fontFamily: msg.role === 'user' ? 'JetBrains Mono, monospace' : 'Cormorant Garamond, serif'
            }}>
              {msg.content}
            </p>
          </div>
        ))}
        {isStreaming && (
            <div className="self-start bg-white/[0.05] rounded-lg py-2.5 px-3 border border-white/10">
                <span style={{ animation: 'pulse 1s infinite', color: 'rgba(255,255,255,0.5)' }}>● ● ●</span>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Attachment Staging */}
      {attachments.length > 0 && (
        <div className="flex gap-1.5 py-1 flex-wrap">
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
      <div className="flex gap-1.5 mt-1">
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
          disabled={isStreaming || voiceRecording}
          title="Attach media or slide"
          className="w-11 h-11 rounded-lg shrink-0 bg-white/[0.05] border border-white/10 text-white/50 flex items-center justify-center"
          style={{ cursor: isStreaming ? 'default' : 'pointer' }}
        >
          <Paperclip size={20} />
        </button>

        <input
          type="text" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={voiceRecording
            ? (locale === 'fr' ? 'Écoute…' : 'Listening…')
            : (locale === 'fr' ? 'Message…' : 'Message…')}
          disabled={isStreaming || voiceRecording}
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
          title={voiceRecording ? 'Stop recording' : 'Record voice'}
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
          onClick={handleSend}
          disabled={isStreaming || (!input.trim() && attachments.length === 0) || voiceRecording}
          className="w-11 h-11 rounded-lg shrink-0 border border-[rgba(16,185,129,0.3)] text-[#a7f3d0] flex items-center justify-center"
          style={{
            background: isStreaming || (!input.trim() && attachments.length === 0) || voiceRecording ? 'rgba(255,255,255,0.05)' : 'rgba(16, 185, 129, 0.2)',
            cursor: isStreaming || (!input.trim() && attachments.length === 0) || voiceRecording ? 'default' : 'pointer',
          }}
        >
          <Send size={22} />
        </button>
      </div>
    </div>
  );
}
