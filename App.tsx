
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Sprite, Block, BlockType, BlockCategory, Level } from './types';
import { BLOCK_METADATA, LEVELS, SOUND_SAMPLES, GRID_SIZE } from './constants';
import BlockPalette from './components/BlockPalette';
import Workspace from './components/Workspace';
import Stage from './components/Stage';

const MillionCodersIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="20" r="12" fill="#F97316" />
    <path d="M20 55 L50 35 L80 55 L50 75 Z" fill="none" stroke="#F97316" strokeWidth="8" strokeLinejoin="round" />
  </svg>
);

const MillionCodersLogo: React.FC<{ className?: string, compact?: boolean }> = ({ className = "", compact = false }) => (
  <div className={`flex flex-col items-center ${className}`}>
    <MillionCodersIcon className={`${compact ? 'w-10 h-10' : 'w-16 h-16'} mb-2`} />
    <div className="flex flex-col items-center leading-none">
      <span className={`${compact ? 'text-xl' : 'text-4xl'} font-black text-white tracking-tighter`}>MILLION</span>
      <div className="flex items-center gap-1 mt-0.5">
        <span className={`${compact ? 'text-xl' : 'text-4xl'} font-black text-white tracking-tighter`}>COD</span>
        <div className={`flex flex-col ${compact ? 'gap-[2px] py-0.5' : 'gap-[3px] py-1'}`}>
          <div className={`${compact ? 'w-3 h-[3px]' : 'w-6 h-[5px]'} bg-[#F97316] rounded-full`}></div>
          <div className={`${compact ? 'w-3 h-[3px]' : 'w-6 h-[5px]'} bg-[#F97316] rounded-full`}></div>
          <div className={`${compact ? 'w-3 h-[3px]' : 'w-6 h-[5px]'} bg-[#F97316] rounded-full`}></div>
        </div>
        <span className={`${compact ? 'text-xl' : 'text-4xl'} font-black text-white tracking-tighter`}>RS</span>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const [view, setView] = useState<'menu' | 'game'>('menu');
  const [isMuted, setIsMuted] = useState(false);
  const [allLevels] = useState<Level[]>(() => JSON.parse(JSON.stringify(LEVELS)));

  const [gameState, setGameState] = useState<GameState & { isBlockedId?: string | null }>({
    sprites: [
      {
        id: 'player-1',
        name: 'Hen',
        image: '🐔',
        gridX: allLevels[0].start.x,
        gridY: allLevels[0].start.y,
        scripts: [{ id: 'main', blocks: [] }],
        isMoving: false
      },
    ],
    activeSpriteId: 'player-1',
    isRunning: false,
    level: JSON.parse(JSON.stringify(allLevels[0])),
    winStatus: 'playing',
    isBlockedId: null,
    isEditMode: false,
    editBrush: 'wall'
  });

  const [history, setHistory] = useState<Block[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const playSound = useCallback((soundName: keyof typeof SOUND_SAMPLES) => {
    if (isMuted) return null;
    const audio = new Audio(SOUND_SAMPLES[soundName]);
    audio.volume = (soundName === 'win' || soundName === 'fail') ? 1.0 : 0.8;
    audio.play().catch(() => {});
    return audio;
  }, [isMuted]);

  const stopBGM = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
    }
  }, []);

  const startBGM = useCallback(() => {
    if (isMuted) return;
    if (!bgmRef.current) {
      bgmRef.current = new Audio(SOUND_SAMPLES.bgm);
      bgmRef.current.loop = true;
      bgmRef.current.volume = 0.2;
    }
    bgmRef.current.play().catch(() => {});
  }, [isMuted]);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (newMuted) stopBGM();
    else if (gameState.isRunning) startBGM();
  };

  const isWall = useCallback((x: number, y: number) => {
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return true;
    return gameState.level.walls.some(w => w.x === x && w.y === y);
  }, [gameState.level.walls]);

  const runAction = useCallback(async (spriteId: string, block: Block): Promise<{ x: number, y: number }> => {
    setActiveBlockId(block.id);
    const soundsMap: Record<BlockType, string | undefined> = {
  [BlockType.MOVE_UP]: 'up',
  [BlockType.MOVE_DOWN]: 'down',
  [BlockType.MOVE_LEFT]: 'left',
  [BlockType.MOVE_RIGHT]: 'right',
  [BlockType.WAIT]: undefined, // ✅ ADD THIS
};

    if (soundsMap[block.type]) playSound(soundsMap[block.type] as any);

    let finalX = 0, finalY = 0;
    setGameState(prev => {
      const sprite = prev.sprites.find(s => s.id === spriteId);
      if (!sprite) return prev;
      let tx = sprite.gridX, ty = sprite.gridY;
      if (block.type === BlockType.MOVE_UP) ty -= 1;
      else if (block.type === BlockType.MOVE_DOWN) ty += 1;
      else if (block.type === BlockType.MOVE_LEFT) tx -= 1;
      else if (block.type === BlockType.MOVE_RIGHT) tx += 1;

      if (!isWall(tx, ty)) {
        finalX = tx; finalY = ty;
        return { ...prev, sprites: prev.sprites.map(s => s.id === spriteId ? { ...s, gridX: tx, gridY: ty, isMoving: true } : s), isBlockedId: null };
      } else {
        finalX = sprite.gridX; finalY = sprite.gridY;
        return { ...prev, isBlockedId: spriteId };
      }
    });

    await new Promise(r => setTimeout(r, 400));
    setGameState(prev => ({ ...prev, isBlockedId: null, sprites: prev.sprites.map(s => s.id === spriteId ? { ...s, isMoving: false } : s) }));
    setActiveBlockId(null);
    await new Promise(r => setTimeout(r, 50)); 
    return { x: finalX, y: finalY };
  }, [isWall, playSound]);

  const handleRunSequence = useCallback(async () => {
    if (gameState.isRunning || gameState.winStatus !== 'playing') return;
    const sprite = gameState.sprites.find(s => s.id === gameState.activeSpriteId);
    if (!sprite || sprite.scripts[0].blocks.length === 0) return;

    startBGM();
    setGameState(prev => ({ ...prev, isRunning: true }));
    let won = false;
    for (const block of sprite.scripts[0].blocks) {
      const currentPos = await runAction(sprite.id, block);
      if (currentPos.x === gameState.level.goal.x && currentPos.y === gameState.level.goal.y) { won = true; break; }
    }
    stopBGM();
    if (won) {
      playSound('win');
      await new Promise(r => setTimeout(r, 800));
      setGameState(prev => ({ ...prev, isRunning: false, winStatus: 'won' }));
    } else {
      playSound('fail');
      setGameState(prev => ({ ...prev, isRunning: false, winStatus: 'lost' }));
    }
  }, [gameState.isRunning, gameState.winStatus, gameState.activeSpriteId, gameState.sprites, gameState.level.goal, runAction, playSound, startBGM, stopBGM]);

  const updateBlocksWithHistory = useCallback((newBlocks: Block[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBlocks);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setGameState(prev => ({ ...prev, sprites: prev.sprites.map(s => s.id === prev.activeSpriteId ? { ...s, scripts: [{ ...s.scripts[0], blocks: newBlocks }] } : s) }));
  }, [history, historyIndex, gameState.activeSpriteId]);

  const handleAddBlock = (type: BlockType, category: BlockCategory) => {
    const meta = BLOCK_METADATA.find(m => m.type === type);
    if (!meta || gameState.winStatus !== 'playing' || gameState.isRunning) return;
    const newBlock: Block = { id: `b-${Date.now()}-${Math.random()}`, type, category, label: meta.label, icon: meta.icon };
    const currentSprite = gameState.sprites.find(s => s.id === gameState.activeSpriteId);
    if (!currentSprite) return;
    updateBlocksWithHistory([...currentSprite.scripts[0].blocks, newBlock]);
    playSound('pop');
  };

  const handleUndo = useCallback(() => {
    if (historyIndex > 0 && !gameState.isRunning) {
      const prevBlocks = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setGameState(prev => ({ ...prev, sprites: prev.sprites.map(s => s.id === prev.activeSpriteId ? { ...s, scripts: [{ ...s.scripts[0], blocks: prevBlocks }] } : s) }));
      playSound('pop');
    }
  }, [historyIndex, history, gameState.isRunning, gameState.activeSpriteId, playSound]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1 && !gameState.isRunning) {
      const nextBlocks = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setGameState(prev => ({ ...prev, sprites: prev.sprites.map(s => s.id === prev.activeSpriteId ? { ...s, scripts: [{ ...s.scripts[0], blocks: nextBlocks }] } : s) }));
      playSound('pop');
    }
  }, [historyIndex, history, gameState.isRunning, gameState.activeSpriteId, playSound]);

  const clearWorkspace = () => { if (!gameState.isRunning) { updateBlocksWithHistory([]); playSound('pop'); } };

  const resetGame = useCallback(() => {
    stopBGM();
    setGameState(prev => ({ ...prev, winStatus: 'playing', isRunning: false, isBlockedId: null, sprites: prev.sprites.map(s => ({ ...s, gridX: prev.level.start.x, gridY: prev.level.start.y, isMoving: false, scripts: s.scripts.map(scr => ({ ...scr, blocks: [] })) })) }));
    setHistory([[]]);
    setHistoryIndex(0);
  }, [stopBGM]);

  const loadLevel = (level: Level) => {
    if (gameState.isRunning) return;
    stopBGM();
    playSound('pop');
    const levelCopy = JSON.parse(JSON.stringify(allLevels.find(l => l.id === level.id) || level));
    setGameState(prev => ({ ...prev, level: levelCopy, winStatus: 'playing', isRunning: false, isBlockedId: null, sprites: prev.sprites.map(s => ({ ...s, gridX: levelCopy.start.x, gridY: levelCopy.start.y, isMoving: false, scripts: s.scripts.map(scr => ({ ...scr, blocks: [] })) })) }));
    setHistory([[]]);
    setHistoryIndex(0);
    setView('game');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view === 'menu') return;
      if (e.key === 'Enter') handleRunSequence();
      if (e.key === 'Escape') resetGame();
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); handleUndo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) { e.preventDefault(); handleRedo(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); stopBGM(); };
  }, [view, handleRunSequence, resetGame, stopBGM, handleUndo, handleRedo]);

  if (view === 'menu') {
    return (
      <div className="h-screen w-screen bg-[#020617] flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Animated Mesh Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/5 blur-[120px] rounded-full animate-pulse delay-700" />
          {/* Floating Code Particles */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="absolute text-indigo-400 font-mono text-xl animate-[float_10s_linear_infinite]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${10 + Math.random() * 20}s`
                }}
              >
                {['{ }', '[ ]', '=>', 'func', 'var', 'let'][i % 6]}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-12 left-12 scale-75 origin-top-left z-20">
          <MillionCodersLogo compact={true} />
        </div>

        <div className="z-10 text-center flex flex-col items-center max-w-4xl">
          <div className="mb-16 flex flex-col items-center group cursor-default">
             <h1 className="text-[120px] font-black text-white tracking-tight px-4 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] leading-tight transition-transform group-hover:scale-105 duration-500">
               <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500">MazeQuest</span>
             </h1>
             <div className="h-1.5 w-64 bg-gradient-to-r from-transparent via-indigo-500 to-transparent -mt-2 mb-2 shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
             <p className="text-indigo-400 font-bold uppercase tracking-[0.6em] text-sm opacity-80">Visual Logic Engine</p>
          </div>
          
          <div className="flex flex-col gap-10 w-full max-w-md">
            <button 
              onClick={() => loadLevel(allLevels[0])}
              className="relative group bg-white text-indigo-950 py-6 px-16 rounded-[40px] font-black text-3xl shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all hover:scale-110 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">START ADVENTURE</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] shadow-2xl">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] mb-6">World Selection</p>
              <div className="flex gap-6 justify-center">
                {allLevels.map(l => (
                  <button
                    key={l.id}
                    onClick={() => loadLevel(l)}
                    className={`
                      w-20 h-20 rounded-3xl border-2 font-black text-2xl transition-all flex flex-col items-center justify-center gap-1
                      ${gameState.level.id === l.id 
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] scale-110' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20 hover:text-white'}
                    `}
                  >
                    <span className="text-xs opacity-50 font-bold tracking-tighter">LVL</span>
                    {l.id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="absolute bottom-10 text-slate-500 font-bold text-xs uppercase tracking-[0.4em] z-20">
          Powered by Million Coders
        </footer>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes float {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.1; }
            90% { opacity: 0.1; }
            100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
          }
        `}} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-300 font-medium overflow-hidden select-none">
      <header className={`bg-[#0f172a] border-b ${gameState.level.theme.borderColor} p-4 flex justify-between items-center shadow-2xl z-20`}>
        <div className="flex items-center gap-6">
          <div onClick={() => { resetGame(); setView('menu'); }} className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
            <MillionCodersIcon className="w-10 h-10 shadow-lg" />
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">Million Coders</h1>
              <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${gameState.level.theme.accentColor}`}>MazeQuest • {gameState.level.theme.name}</p>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-700 mx-2" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mr-2">Level</span>
            <div className="flex bg-slate-800 p-1 rounded-full gap-1 shadow-inner">
              {allLevels.map(l => (
                <button
                  key={l.id}
                  onClick={() => loadLevel(l)}
                  disabled={gameState.isRunning}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${gameState.level.id === l.id ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'} ${gameState.isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {l.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => { resetGame(); setView('menu'); }} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors bg-slate-800 px-5 py-2.5 rounded-full">Menu</button>
          <button onClick={toggleMute} className={`p-3 rounded-full transition-all hover:bg-slate-700 flex items-center justify-center ${isMuted ? 'text-slate-500' : 'text-indigo-400'}`}>
            {isMuted ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                     : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>}
          </button>
          <div className="flex gap-3">
            {gameState.winStatus === 'playing' ? (
              <button onClick={handleRunSequence} disabled={gameState.isRunning} className={`px-8 py-3 rounded-full font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg ${gameState.isRunning ? 'bg-slate-700 opacity-50 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400 text-white ring-4 ring-green-500/20'}`}>
                <span>{gameState.isRunning ? '🏃 MOVING...' : '🏁 RUN CODE'}</span>
              </button>
            ) : (
              <button onClick={resetGame} className="px-8 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-full font-bold shadow-lg transition-all active:scale-95 ring-4 ring-indigo-500/20">🔄 RESET (Esc)</button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex p-4 gap-4 overflow-hidden relative">
        <div className="w-64 flex flex-col gap-4">
           <div className="bg-[#1e293b] rounded-3xl p-5 flex-1 border border-slate-800 flex flex-col shadow-xl">
              <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Action Blocks</h2>
              <BlockPalette onBlockClick={handleAddBlock} />
           </div>
        </div>
        <div className="flex-1 bg-[#020617] rounded-[40px] border border-slate-800 relative overflow-hidden flex items-center justify-center shadow-[inset_0_0_100px_rgba(0,0,0,1)]">
           <div className="p-10 scale-90">
             <Stage gameState={gameState as any} />
           </div>
           {gameState.winStatus === 'won' && (
             <div className="absolute inset-0 bg-green-500/30 backdrop-blur-xl flex flex-col items-center justify-center z-50 transition-all duration-700">
                <div className="text-[140px] mb-4 animate-bounce">🏆</div>
                <h2 className="text-7xl font-black text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] text-center italic">QUEST COMPLETE!</h2>
                <div className="flex gap-4 mt-12">
                  <button onClick={resetGame} className="px-12 py-5 bg-white text-green-700 rounded-full font-black hover:scale-105 active:scale-95 transition-transform shadow-2xl text-xl">REPLAY</button>
                  {gameState.level.id < allLevels.length && (
                    <button onClick={() => loadLevel(allLevels[gameState.level.id])} className="px-12 py-5 bg-indigo-600 text-white rounded-full font-black hover:scale-105 active:scale-95 transition-transform shadow-2xl text-xl ring-4 ring-indigo-500/20">NEXT WORLD</button>
                  )}
                </div>
             </div>
           )}
           {gameState.winStatus === 'lost' && !gameState.isRunning && (
             <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-red-600 text-white px-12 py-5 rounded-full font-black shadow-2xl animate-bounce z-50 border-4 border-white/20 uppercase tracking-tighter text-lg">
               Path Blocked! Try Again! 🧩
             </div>
           )}
        </div>
        <div className="w-80 bg-[#1e293b] rounded-3xl border border-slate-800 flex flex-col overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#253247]">
            <h2 className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Logic Queue</h2>
            <div className="flex gap-2">
              <button onClick={handleUndo} disabled={historyIndex === 0 || gameState.isRunning} className="text-[9px] font-black bg-slate-800 px-3 py-1 rounded-full uppercase text-slate-400 hover:text-white transition-colors disabled:opacity-30">Undo</button>
              <button onClick={handleRedo} disabled={historyIndex >= history.length - 1 || gameState.isRunning} className="text-[9px] font-black bg-slate-800 px-3 py-1 rounded-full uppercase text-slate-400 hover:text-white transition-colors disabled:opacity-30">Redo</button>
              <button onClick={clearWorkspace} disabled={gameState.isRunning} className="text-[9px] font-black bg-slate-800 px-3 py-1 rounded-full uppercase text-slate-500 hover:text-red-400 transition-colors disabled:opacity-30">Clear</button>
            </div>
          </div>
          <Workspace sprite={gameState.sprites.find(s => s.id === gameState.activeSpriteId) || gameState.sprites[0]} activeBlockId={activeBlockId} />
        </div>
      </main>
    </div>
  );
};

export default App;
