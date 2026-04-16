import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Neon Nights (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Cybernetic Pulse (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Digital Horizon (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <section className="bg-card-bg border border-border rounded-2xl p-5 relative overflow-hidden flex flex-col h-full">
      <span className="text-[10px] uppercase tracking-[2px] text-muted mb-4 block">Current Stream</span>
      
      <div className="w-full aspect-square bg-gradient-to-tr from-[#1a1a1a] to-[#333] rounded-xl mb-5 flex items-center justify-center relative">
        <div className="w-[60%] h-[60%] border-4 border-neon-blue rounded-full opacity-50"></div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg mb-1 font-bold truncate">{TRACKS[currentTrackIndex].title}</h2>
        <p className="text-muted text-sm">Neural Core AI // Synthwave</p>
      </div>

      <audio
        ref={audioRef}
        src={TRACKS[currentTrackIndex].url}
        onEnded={skipForward}
      />

      <div className="w-full h-1 bg-[#222] my-3 rounded-sm relative">
         <div className="absolute left-0 top-0 h-full w-[35%] bg-neon-blue shadow-[0_0_8px_var(--color-neon-blue)]"></div>
      </div>

      <div className="flex justify-between items-center mt-auto mb-4">
        <button onClick={skipBack} className="bg-transparent border border-border text-text px-4 py-2 cursor-pointer rounded-lg font-inherit text-xs hover:border-neon-blue">
          PREV
        </button>
        <button 
          onClick={togglePlay} 
          className="bg-text text-bg font-bold border-none px-6 py-2.5 cursor-pointer rounded-lg font-inherit text-xs hover:bg-neon-blue hover:text-bg"
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
        <button onClick={skipForward} className="bg-transparent border border-border text-text px-4 py-2 cursor-pointer rounded-lg font-inherit text-xs hover:border-neon-blue">
          NEXT
        </button>
      </div>

      <div className="flex items-center gap-3 w-full">
        <button onClick={toggleMute} className="text-muted hover:text-neon-blue transition-colors">
          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="flex-1 h-1 bg-[#222] rounded-lg appearance-none cursor-pointer accent-neon-blue"
        />
      </div>
    </section>
  );
}
