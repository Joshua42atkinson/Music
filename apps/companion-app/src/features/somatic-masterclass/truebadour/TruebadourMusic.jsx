import React from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, Music } from 'lucide-react';

export default function TruebadourMusic({ 
  t, localize, hasError, track, isPlaying, isMuted, volume, currentTime, duration, progress, TRACKS,
  toggleMusic, toggleMute, handleVol, skipTrack, formatTime 
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3 border-b border-violet-500/20 pb-2">
        <span className="text-base font-mono uppercase tracking-widest text-violet-400">
          {t('nowPlaying')}
        </span>
        <button onClick={toggleMute} className="text-cf-slate hover:text-white transition-colors">
          {isMuted ? <VolumeX size={21} /> : <Volume2 size={21} />}
        </button>
      </div>

      {hasError ? (
        <p className="text-base text-white/30 text-center py-4 font-mono">
          {t('noAudioFile')}
        </p>
      ) : (
        <>
          <div className="mb-3">
            <div className="text-lg text-white font-medium truncate">{localize(track.title)}</div>
            <div className="text-base text-cf-slate font-mono uppercase tracking-wider">{track.artist}</div>
          </div>
          <div className="mb-3">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-1">
              <div className="h-full bg-violet-400/70 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-sm text-cf-slate font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mb-3">
            <button onClick={toggleMusic}
              className="w-12 h-12 rounded-full bg-violet-500/15 flex items-center justify-center text-violet-300 border border-violet-500/35 hover:bg-violet-500/25 transition-all">
              {isPlaying ? <Pause size={30} /> : <Play size={30} className="ml-1" />}
            </button>
            {TRACKS.length > 1 && (
              <button onClick={skipTrack}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-cf-slate hover:text-white transition-colors">
                <SkipForward size={21} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Music size={15} className="text-cf-slate flex-shrink-0" />
            <input type="range" min="0" max="1" step="0.05" value={volume}
              onChange={e => handleVol(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-400"
            />
            <span className="text-sm text-cf-slate font-mono w-6 text-right">{Math.round(volume * 100)}</span>
          </div>
        </>
      )}
    </div>
  );
}
