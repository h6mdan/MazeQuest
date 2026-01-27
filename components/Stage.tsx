
import React from 'react';
import { GameState } from '../types';
import { GRID_SIZE, TILE_SIZE } from '../constants';

interface StageProps {
  gameState: GameState & { isBlockedId?: string | null };
}

const Stage: React.FC<StageProps> = ({ gameState }) => {
  const grid = Array.from({ length: GRID_SIZE }, (_, y) => 
    Array.from({ length: GRID_SIZE }, (_, x) => ({ x, y }))
  ).flat();

  const { theme } = gameState.level;

  return (
    <div 
      className={`relative ${theme.floorBg} shadow-[0_0_100px_rgba(0,0,0,1)] border-[12px] ${theme.borderColor} rounded-[40px] overflow-hidden`}
      style={{ 
        width: GRID_SIZE * TILE_SIZE, 
        height: GRID_SIZE * TILE_SIZE,
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`
      }}
    >
      {/* Grid Tiles */}
      {grid.map(tile => {
        const isWall = gameState.level.walls.some(w => w.x === tile.x && w.y === tile.y);
        const isGoal = gameState.level.goal.x === tile.x && gameState.level.goal.y === tile.y;
        const isStart = gameState.level.start.x === tile.x && gameState.level.start.y === tile.y;
        
        return (
          <div 
            key={`${tile.x}-${tile.y}`}
            className={`
              w-full h-full border-[0.5px] border-white/5 flex items-center justify-center relative transition-all duration-500
              ${isWall ? theme.wallBg : theme.floorBg}
            `}
          >
            {isWall && (
              <div className="absolute inset-0 flex items-center justify-center text-3xl select-none filter drop-shadow-md transform hover:scale-110 transition-transform">
                {theme.wallIcon}
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
              </div>
            )}
            
            {!isWall && !isGoal && !isStart && (
               <div className={`w-1 h-1 rounded-full opacity-20 ${theme.accentColor.replace('text', 'bg')}`} />
            )}
            
            {isGoal && (
              <div className="text-4xl animate-[pulse_1.5s_infinite] z-10 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
                {theme.goalIcon}
              </div>
            )}

            {isStart && !isWall && (
               <div className="absolute inset-0 bg-white/5 animate-pulse" />
            )}
          </div>
        );
      })}

      {/* The Hero */}
      {gameState.sprites.map(sprite => {
        const isBlocked = gameState.isBlockedId === sprite.id;
        
        return (
          <div
            key={sprite.id}
            className={`
              absolute transition-all ease-in-out duration-300 z-30 flex items-center justify-center
              ${isBlocked ? 'animate-[shake_0.4s_ease-in-out]' : ''}
            `}
            style={{
              width: TILE_SIZE,
              height: TILE_SIZE,
              left: sprite.gridX * TILE_SIZE,
              top: sprite.gridY * TILE_SIZE,
            }}
          >
            <div className={`
              relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300
              ${isBlocked ? 'ring-4 ring-red-500 scale-110 shadow-[0_0_30px_rgba(239,68,68,0.8)]' : ''}
            `}>
              <span className={`
                text-3xl select-none z-10 transition-transform duration-300
                ${isBlocked ? 'scale-90' : sprite.isMoving ? 'scale-125' : 'scale-100'}
              `}>
                {sprite.image}
              </span>
              
              <div className={`
                absolute inset-0 blur-xl rounded-full -z-10 transition-all duration-500
                ${isBlocked 
                  ? 'bg-red-500 opacity-100 scale-150' 
                  : sprite.isMoving 
                    ? 'bg-white/40 opacity-80 scale-125' 
                    : 'bg-indigo-500 opacity-20'
                }
              `} />
            </div>
          </div>
        );
      })}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
      `}} />
    </div>
  );
};

export default Stage;
