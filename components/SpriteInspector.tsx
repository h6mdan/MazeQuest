
import React from 'react';
import { Sprite } from '../types';

interface SpriteInspectorProps {
  sprite?: Sprite;
  updateSprite: (id: string, updates: Partial<Sprite>) => void;
}

const SpriteInspector: React.FC<SpriteInspectorProps> = ({ sprite, updateSprite }) => {
  if (!sprite) return null;

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-200 flex items-center justify-between gap-4">
      <div className="flex flex-col gap-1 flex-1">
        <label className="text-[10px] uppercase font-bold text-gray-400">Sprite Name</label>
        <input 
          type="text" 
          value={sprite.name} 
          onChange={(e) => updateSprite(sprite.id, { name: e.target.value })}
          className="bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-sm font-bold text-gray-600 outline-none focus:border-blue-300"
        />
      </div>

      <div className="flex gap-4">
        {/* Fix: replaced sprite.x with sprite.gridX */}
        <div className="flex flex-col items-center gap-1">
          <label className="text-[10px] uppercase font-bold text-gray-400">X</label>
          <input 
            type="number" 
            value={sprite.gridX} 
            onChange={(e) => updateSprite(sprite.id, { gridX: Number(e.target.value) })}
            className="w-12 bg-gray-50 border border-gray-100 rounded-lg py-1 text-center text-xs font-bold text-gray-600 outline-none"
          />
        </div>
        {/* Fix: replaced sprite.y with sprite.gridY */}
        <div className="flex flex-col items-center gap-1">
          <label className="text-[10px] uppercase font-bold text-gray-400">Y</label>
          <input 
            type="number" 
            value={sprite.gridY} 
            onChange={(e) => updateSprite(sprite.id, { gridY: Number(e.target.value) })}
            className="w-12 bg-gray-50 border border-gray-100 rounded-lg py-1 text-center text-xs font-bold text-gray-600 outline-none"
          />
        </div>
        {/* Removed non-existent fields: scale and rotation */}
      </div>
    </div>
  );
};

export default SpriteInspector;
