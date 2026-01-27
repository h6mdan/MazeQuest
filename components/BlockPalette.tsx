
import React from 'react';
import { BLOCK_METADATA, CATEGORY_COLORS } from '../constants';
import { BlockCategory, BlockType } from '../types';

interface BlockPaletteProps {
  onBlockClick: (type: BlockType, category: BlockCategory) => void;
}

const BlockPalette: React.FC<BlockPaletteProps> = ({ onBlockClick }) => {
  return (
    <div className="flex flex-col gap-3">
      {BLOCK_METADATA.map(block => (
        <button
          key={block.type}
          onClick={() => onBlockClick(block.type, block.category)}
          className={`
            ${CATEGORY_COLORS[block.category]}
            text-white p-4 rounded-2xl shadow-lg font-black text-lg
            transition-all hover:-translate-y-1 hover:brightness-110 active:translate-y-1 
            flex items-center gap-4 group
          `}
        >
          <span className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">{block.icon}</span>
          <span className="text-sm uppercase tracking-tight">{block.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BlockPalette;
