import React from 'react';
import { Volume2, VolumeX, Play, Pause, SkipForward, Music, Minus, Plus, Square } from 'lucide-react';

const BLUE = '#4488ff';

export default function SoundTab({ audio, metro, locale, tracks }) {
  return (
    <div>
      {/* Music player */}
      <div className="rounded-[14px] p-3.5 px-4 mb-3 bg-[rgba(68,136,255,0.06)] border border-[rgba(68,136,255,0.15)]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-[rgba(68,136,255,0.7)]">
            Now Playing
          </span>
          <button onClick={audio.toggleMute} className="bg-transparent border-0 cursor-pointer" style={{ color: audio.isMuted ? 'rgba(255,255,255,0.3)' : BLUE }}>
            {audio.isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        {audio.hasAudioError ? (
          <p className="text-white/25 text-[0.75rem] text-center py-3 font-mono">
            No audio file found
          </p>
        ) : (
          <>
            <div className="mb-2.5">
              <div className="text-[0.9rem] text-[#f0e6d2] font-medium mb-0.5">{audio.localize(audio.track.title, locale)}</div>
              <div className="text-[0.65rem] text-white/35 font-mono tracking-[0.08em] uppercase">{audio.track.artist}</div>
            </div>

            {/* Progress bar */}
            <div className="mb-2.5">
              <div className="h-[3px] bg-white/[0.08] rounded overflow-hidden mb-1">
                <div
                  className="h-full rounded transition-[width] duration-1000 linear"
                  style={{ width: `${audio.progress}%`, background: `linear-gradient(90deg, rgba(34,85,204,0.8), ${BLUE})` }}
                />
              </div>
              <div className="flex justify-between text-[0.6rem] text-white/25 font-mono">
                <span>{audio.formatTime(audio.currentTime)}</span>
                <span>{audio.formatTime(audio.duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <button
                onClick={audio.toggleMusic}
                className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
                style={{
                  background: `rgba(34,85,204,0.2)`,
                  border: `1px solid rgba(68,136,255,0.4)`,
                  color: BLUE,
                  boxShadow: audio.isPlaying ? `0 0 16px rgba(34,85,204,0.4)` : 'none',
                }}
              >
                {audio.isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
              </button>
              {tracks.length > 1 && (
                <button onClick={audio.skipTrack} className="bg-transparent border-0 text-white/30 cursor-pointer">
                  <SkipForward size={18} />
                </button>
              )}
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <Music size={12} className="text-white/20 shrink-0" />
              <input
                type="range" min={0} max={1} step={0.05} value={audio.volume}
                onChange={e => audio.handleVol(parseFloat(e.target.value))}
                className="flex-1 cursor-pointer accent-[#4488ff]"
              />
              <span className="text-[0.6rem] text-white/20 font-mono w-[22px] text-right">
                {Math.round(audio.volume * 100)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Metronome */}
      <div className="rounded-[14px] p-3.5 px-4 bg-[rgba(122,170,136,0.06)] border border-[rgba(122,170,136,0.15)]">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-[rgba(122,170,136,0.7)]">
            Metronome
          </span>
          {/* Beat dots */}
          <div className="flex gap-1">
            {Array.from({ length: metro.beats }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all duration-75"
                style={{
                  background: metro.currentBeat === i && metro.isPlaying
                    ? (i === 0 ? '#7aaa88' : 'rgba(122,170,136,0.6)')
                    : 'rgba(255,255,255,0.1)',
                  boxShadow: metro.currentBeat === i && metro.isPlaying ? '0 0 6px rgba(122,170,136,0.7)' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        <div className="text-center text-[2rem] font-mono text-[#f0e6d2] font-light mb-2.5">
          {metro.bpm} <span className="text-[0.7rem] text-white/30 tracking-[0.1em]">BPM</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => metro.setBpm(b => Math.max(40, b - 5))} className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] text-white/50 cursor-pointer flex items-center justify-center">
            <Minus size={14} />
          </button>
          <input
            type="range" min={40} max={208} value={metro.bpm}
            onChange={e => metro.setBpm(parseInt(e.target.value))}
            className="flex-1 cursor-pointer accent-[#7aaa88]"
          />
          <button onClick={() => metro.setBpm(b => Math.min(208, b + 5))} className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] text-white/50 cursor-pointer flex items-center justify-center">
            <Plus size={14} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button onClick={() => metro.setBeats(b => b === 4 ? 3 : 4)} className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white/50 text-[0.75rem] font-mono cursor-pointer">
            {metro.beats}/4
          </button>
          <button
            onClick={() => metro.setIsPlaying(!metro.isPlaying)}
            className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{
              background: metro.isPlaying ? 'rgba(122,170,136,0.2)' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${metro.isPlaying ? 'rgba(122,170,136,0.4)' : 'rgba(255,255,255,0.15)'}`,
              color: metro.isPlaying ? '#7aaa88' : '#f0e6d2',
              boxShadow: metro.isPlaying ? '0 0 14px rgba(122,170,136,0.3)' : 'none',
            }}
          >
            {metro.isPlaying ? <Square size={18} /> : <Play size={20} className="ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
