import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause, Volume2, VolumeX, Disc3 } from 'lucide-react';

// Default playlists for Bertrand's genres (using generic royalty-free/public domain IDs as placeholders)
const PLAYLISTS = {
  Classical: ['j3nBOM1D8vU', 'm9H4Wl_o8g8', 'yKj22o0v9Z4'], // Classical Guitar
  Jazz: ['rp5wz1u7E2g', '5YvbdE4KjJg'], // Jazz Guitar
  Bluegrass: ['z_0679_k2pA', '1z43j81B-x4'] // Acoustic/Bluegrass
};

export default function AmbientPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentGenre, setCurrentGenre] = useState('Classical');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const playerRef = useRef(null);

  const currentVideoId = PLAYLISTS[currentGenre][currentTrackIndex];

  // Global pause listener (so other components like instructional videos can pause the ambient music)
  useEffect(() => {
    const handleGlobalPause = () => {
      if (playerRef.current && isPlaying) {
        playerRef.current.internalPlayer.pauseVideo();
        setIsPlaying(false);
      }
    };
    window.addEventListener('ambient:pause', handleGlobalPause);
    return () => window.removeEventListener('ambient:pause', handleGlobalPause);
  }, [isPlaying]);

  const onReady = (event) => {
    playerRef.current = event.target;
    event.target.setVolume(isMuted ? 0 : 30); // Ambient music should be quiet (30%)
  };

  const onEnd = () => {
    // Loop through playlist
    const playlist = PLAYLISTS[currentGenre];
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.setVolume(30);
    } else {
      playerRef.current.setVolume(0);
    }
    setIsMuted(!isMuted);
  };

  const changeGenre = (genre) => {
    setCurrentGenre(genre);
    setCurrentTrackIndex(0);
    if (playerRef.current && isPlaying) {
      // The video ID will change via state, YouTube component will re-render
    }
  };

  return (
    <>
      {/* Invisible YouTube Player */}
      <div className="hidden">
        <YouTube
          videoId={currentVideoId}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              modestbranding: 1,
              playsinline: 1,
            },
          }}
          onReady={onReady}
          onEnd={onEnd}
          onStateChange={(e) => {
            // If YouTube pauses it internally, sync our state
            if (e.data === YouTube.PlayerState.PAUSED) setIsPlaying(false);
            if (e.data === YouTube.PlayerState.PLAYING) setIsPlaying(true);
          }}
        />
      </div>

      {/* Floating Tuning Peg UI */}
      <div className="fixed top-4 left-4 z-50 flex items-start gap-2">
        <button
          onClick={() => setShowControls(!showControls)}
          className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border shadow-lg transition-all ${
            isPlaying 
              ? 'bg-cf-gold/20 border-cf-gold/50 shadow-[0_0_15px_rgba(201,169,110,0.3)] animate-pulse' 
              : 'bg-black/60 border-white/10 hover:bg-black/80'
          }`}
          title="Ambient Resonance Engine"
        >
          <Disc3 size={18} className={`${isPlaying ? 'text-cf-gold animate-spin-slow' : 'text-cf-slate'}`} />
        </button>

        {/* Expanded Controls Panel */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              className="bg-[#12100e]/90 backdrop-blur-xl border border-cf-gold/20 rounded-2xl p-4 shadow-2xl min-w-[200px]"
            >
              <div className="flex items-center justify-between mb-4 border-b border-cf-gold/10 pb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-cf-gold">Resonance</span>
                <button onClick={toggleMute} className="text-cf-slate hover:text-white transition-colors">
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                {Object.keys(PLAYLISTS).map(genre => (
                  <button
                    key={genre}
                    onClick={() => changeGenre(genre)}
                    className={`flex-1 py-1 text-[10px] font-mono uppercase rounded border transition-colors ${
                      currentGenre === genre 
                        ? 'bg-cf-gold text-cf-void border-cf-gold' 
                        : 'bg-transparent text-cf-slate border-cf-slate/30 hover:border-cf-slate'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center">
                <button 
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-cf-gold/10 flex items-center justify-center text-cf-gold border border-cf-gold/30 hover:bg-cf-gold/20 transition-all"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </>
  );
}
