import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col p-6 font-mono w-full max-w-[1024px] mx-auto h-[768px] overflow-hidden">
      <header className="flex justify-between items-center mb-6 px-2">
        <div className="text-2xl font-bold tracking-[4px] uppercase text-neon-green drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">
          NEON-SYNTH
        </div>
        <div className="text-xs px-3 py-1 border border-neon-blue rounded-full text-neon-blue uppercase">
          System Online // 128 BPM
        </div>
      </header>

      <main className="grid grid-cols-[300px_1fr_300px] grid-rows-[420px_160px] gap-5 flex-grow">
        <MusicPlayer />
        <SnakeGame />
        
        {/* Stats Card */}
        <section className="bg-card-bg border border-border rounded-2xl p-5 relative overflow-hidden col-start-3 row-start-1">
            <span className="text-[10px] uppercase tracking-[2px] text-muted mb-4 block">Game Metrics</span>
            <div className="mb-8">
                <div className="text-xs text-muted uppercase">Score</div>
                <div className="text-5xl font-bold text-neon-purple drop-shadow-[0_0_15px_rgba(188,19,254,0.4)]">0420</div>
            </div>
            <div className="mb-8">
                <div className="text-xs text-muted uppercase">High Score</div>
                <div className="text-5xl font-bold text-neon-blue drop-shadow-[0_0_15px_rgba(0,243,255,0.4)]">1250</div>
            </div>
            <div className="mb-8">
                <div className="text-xs text-muted uppercase">Multiplier</div>
                <div className="text-2xl font-bold text-text">x2.5</div>
            </div>
        </section>

        {/* Tracklist Card */}
        <section className="col-span-3 row-start-2 grid grid-cols-3 gap-5 bg-transparent border-none p-0">
            <div className="bg-card-bg border border-neon-blue rounded-xl p-4 flex items-center gap-4 shadow-[0_0_10px_rgba(0,243,255,0.1)]">
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-neon-purple to-neon-blue"></div>
                <div>
                    <div className="text-sm font-bold">ELECTRIC DREAMS</div>
                    <div className="text-[10px] text-muted">PLAYING</div>
                </div>
            </div>
            <div className="bg-card-bg border border-border rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-[#333] to-[#555]"></div>
                <div>
                    <div className="text-sm font-bold">CYBER PULSE</div>
                    <div className="text-[10px] text-muted">UP NEXT</div>
                </div>
            </div>
            <div className="bg-card-bg border border-border rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-[#333] to-[#555]"></div>
                <div>
                    <div className="text-sm font-bold">GLITCH GARDEN</div>
                    <div className="text-[10px] text-muted">QUEUED</div>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
