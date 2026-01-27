
import React from 'react';
import { GameState } from '../types';
import { SPRITE_TEMPLATES } from '../constants';

interface SpriteSelectorProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onAddSprite: () => void;
  onRemoveSprite: (id: string) => void;
}

const SpriteSelector: React.FC<SpriteSelectorProps> = ({ gameState, setGameState, onAddSprite, onRemoveSprite }) => {
  const cycleEmoji = (id: string) => {
    setGameState(prev => ({
      ...prev,
      sprites: prev.sprites.map(s => {
        if (s.id === id) {
          const currentIdx = SPRITE_TEMPLATES.findIndex(t => t.image === s.image);
          const nextIdx = (currentIdx + 1) % SPRITE_TEMPLATES.length;
          return { ...s, image: SPRITE_TEMPLATES[nextIdx].image };
        }
        return s;
      })
    }));
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onRemoveSprite(id);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 bg-slate-800/50 border-b border-slate-700/50 flex justify-between items-center">
        <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500">Sprite Library</span>
        <button 
          onClick={onAddSprite} 
          className="w-8 h-8 bg-indigo-500 hover:bg-indigo-400 text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 font-bold text-xl"
        >+</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-wrap gap-3 content-start bg-[#161E2E]">
        {gameState.sprites.map(sprite => (
          <div
            key={sprite.id}
            onClick={() => setGameState(p => ({ ...p, activeSpriteId: sprite.id }))}
            className={`
              w-24 h-28 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group relative
              ${gameState.activeSpriteId === sprite.id ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'}
            `}
          >
            <div 
              className="text-4xl hover:scale-110 transition-transform cursor-pointer drop-shadow-lg"
              onClick={(e) => { e.stopPropagation(); cycleEmoji(sprite.id); }}
              title="Click to change character"
            >
              {sprite.image}
            </div>
            <div className="text-[10px] font-bold text-slate-400 truncate w-full text-center px-2 uppercase tracking-tight">{sprite.name}</div>
            
            {gameState.sprites.length > 1 && (
              <button 
                onClick={(e) => handleRemove(e, sprite.id)}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500/80 hover:bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >✕</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpriteSelector;
