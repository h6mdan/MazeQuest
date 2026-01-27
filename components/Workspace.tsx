
import React from 'react';
import { Sprite } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface WorkspaceProps {
  sprite: Sprite;
  activeBlockId: string | null;
}

const Workspace: React.FC<WorkspaceProps> = ({ sprite, activeBlockId }) => {
  const blocks = sprite.scripts[0]?.blocks || [];

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center gap-2 bg-[#161E2E]">
      {blocks.length === 0 ? (
        <div className="mt-12 text-center opacity-20">
          <div className="text-5xl mb-4">🧱</div>
          <p className="text-xs font-bold uppercase tracking-widest">Queue is empty</p>
        </div>
      ) : (
        blocks.map((block, idx) => (
          <div 
            key={block.id}
            className={`
              w-full p-4 rounded-2xl flex items-center gap-4 font-bold border-b-4
              transition-all duration-300
              ${activeBlockId === block.id ? 'bg-white text-indigo-900 scale-105 shadow-2xl ring-4 ring-indigo-500/50' : `${CATEGORY_COLORS[block.category]} text-white opacity-80`}
            `}
          >
            <span className="text-[10px] opacity-50">#{idx + 1}</span>
            <span className="text-xl">{block.icon}</span>
            <span className="text-xs uppercase tracking-tight flex-1">{block.label}</span>
            {activeBlockId === block.id && <span className="animate-pulse text-indigo-500">▶</span>}
          </div>
        ))
      )}
      <div className="h-20 w-px bg-slate-800 mt-4" />
    </div>
  );
};

export default Workspace;
