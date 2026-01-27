
import { BlockType, BlockCategory, Level, LevelTheme } from './types';

export const GRID_SIZE = 10;
export const TILE_SIZE = 60;

export const CATEGORY_COLORS = {
  [BlockCategory.MOTION]: 'bg-indigo-500 border-indigo-700 hover:bg-indigo-600',
  [BlockCategory.CONTROL]: 'bg-orange-400 border-orange-600 hover:bg-orange-500',
};

export const BLOCK_METADATA = [
  { type: BlockType.MOVE_UP, category: BlockCategory.MOTION, label: 'Move Up', icon: '↑' },
  { type: BlockType.MOVE_DOWN, category: BlockCategory.MOTION, label: 'Move Down', icon: '↓' },
  { type: BlockType.MOVE_LEFT, category: BlockCategory.MOTION, label: 'Move Left', icon: '←' },
  { type: BlockType.MOVE_RIGHT, category: BlockCategory.MOTION, label: 'Move Right', icon: '→' },
];

const THEMES: Record<string, LevelTheme> = {
  forest: {
    name: 'Forest',
    wallIcon: '🌲',
    goalIcon: '🥚',
    floorBg: 'bg-[#064e3b]',
    wallBg: 'bg-[#065f46]',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-800'
  },
  space: {
    name: 'Cosmos',
    wallIcon: '☄️',
    goalIcon: '🛸',
    floorBg: 'bg-[#1e1b4b]',
    wallBg: 'bg-[#312e81]',
    accentColor: 'text-indigo-400',
    borderColor: 'border-indigo-900'
  },
  magma: {
    name: 'Volcano',
    wallIcon: '🌋',
    goalIcon: '💎',
    floorBg: 'bg-[#450a0a]',
    wallBg: 'bg-[#7f1d1d]',
    accentColor: 'text-orange-500',
    borderColor: 'border-red-900'
  }
};

export const LEVELS: Level[] = [
  {
    "id": 1,
    "theme": THEMES.forest,
    "start": { "x": 1, "y": 1 },
    "goal": { "x": 3, "y": 1 },
    "walls": [
      {"x": 0, "y": 0}, {"x": 1, "y": 0}, {"x": 2, "y": 0}, {"x": 3, "y": 0}, {"x": 4, "y": 0}, {"x": 5, "y": 0}, {"x": 6, "y": 0}, {"x": 7, "y": 0}, {"x": 8, "y": 0}, {"x": 9, "y": 0},
      {"x": 0, "y": 9}, {"x": 1, "y": 9}, {"x": 2, "y": 9}, {"x": 3, "y": 9}, {"x": 4, "y": 9}, {"x": 5, "y": 9}, {"x": 6, "y": 9}, {"x": 7, "y": 9}, {"x": 8, "y": 9}, {"x": 9, "y": 9},
      {"x": 0, "y": 1}, {"x": 0, "y": 2}, {"x": 0, "y": 3}, {"x": 0, "y": 4}, {"x": 0, "y": 5}, {"x": 0, "y": 6}, {"x": 0, "y": 7}, {"x": 0, "y": 8},
      {"x": 9, "y": 1}, {"x": 9, "y": 2}, {"x": 9, "y": 3}, {"x": 9, "y": 4}, {"x": 9, "y": 5}, {"x": 9, "y": 6}, {"x": 9, "y": 7}, {"x": 9, "y": 8},
      {"x": 2, "y": 2}, {"x": 2, "y": 4}, {"x": 3, "y": 4}, {"x": 1, "y": 6}, {"x": 2, "y": 6}, {"x": 8, "y": 6}, {"x": 2, "y": 3}, {"x": 5, "y": 7},
      {"x": 5, "y": 8}, {"x": 8, "y": 7}, {"x": 4, "y": 7}, {"x": 2, "y": 1}, {"x": 8, "y": 8}, {"x": 8, "y": 5}, {"x": 8, "y": 4}, {"x": 8, "y": 3},
      {"x": 8, "y": 2}, {"x": 6, "y": 5}, {"x": 6, "y": 4}, {"x": 6, "y": 2}, {"x": 6, "y": 1}
    ]
  },
  {
    "id": 2,
    "theme": THEMES.space,
    "start": { "x": 1, "y": 1 },
    "goal": { "x": 8, "y": 8 },
    "walls": [
      {"x": 0, "y": 0}, {"x": 1, "y": 0}, {"x": 2, "y": 0}, {"x": 4, "y": 0}, {"x": 5, "y": 0}, {"x": 6, "y": 0}, {"x": 7, "y": 0}, {"x": 8, "y": 0}, {"x": 9, "y": 0},
      {"x": 0, "y": 9}, {"x": 1, "y": 9}, {"x": 2, "y": 9}, {"x": 4, "y": 9}, {"x": 5, "y": 9}, {"x": 6, "y": 9}, {"x": 7, "y": 9}, {"x": 8, "y": 9}, {"x": 9, "y": 9},
      {"x": 0, "y": 1}, {"x": 0, "y": 2}, {"x": 0, "y": 3}, {"x": 0, "y": 4}, {"x": 0, "y": 5}, {"x": 0, "y": 6}, {"x": 0, "y": 7}, {"x": 0, "y": 8},
      {"x": 9, "y": 1}, {"x": 9, "y": 2}, {"x": 9, "y": 3}, {"x": 9, "y": 4}, {"x": 9, "y": 5}, {"x": 9, "y": 6}, {"x": 9, "y": 7}, {"x": 9, "y": 8},
      {"x": 8, "y": 1}, {"x": 1, "y": 3}, {"x": 2, "y": 4}, {"x": 3, "y": 5}, {"x": 4, "y": 6}, {"x": 5, "y": 7}, {"x": 6, "y": 8}, {"x": 2, "y": 1},
      {"x": 3, "y": 2}, {"x": 4, "y": 3}, {"x": 5, "y": 4}, {"x": 6, "y": 5}, {"x": 7, "y": 6}, {"x": 8, "y": 7}, {"x": 7, "y": 4}, {"x": 8, "y": 5},
      {"x": 6, "y": 3}, {"x": 5, "y": 2}, {"x": 4, "y": 1}, {"x": 6, "y": 1}, {"x": 7, "y": 2}, {"x": 8, "y": 3}, {"x": 1, "y": 5}, {"x": 2, "y": 6},
      {"x": 1, "y": 7}, {"x": 2, "y": 8}, {"x": 3, "y": 7}, {"x": 4, "y": 8}, {"x": 3, "y": 0}
    ]
  },
  {
    "id": 3,
    "theme": THEMES.magma,
    "start": { "x": 8, "y": 1 },
    "goal": { "x": 4, "y": 3 },
    "walls": [
      {"x": 0, "y": 0}, {"x": 1, "y": 0}, {"x": 2, "y": 0}, {"x": 3, "y": 0}, {"x": 5, "y": 0}, {"x": 6, "y": 0}, {"x": 7, "y": 0}, {"x": 8, "y": 0}, {"x": 9, "y": 0},
      {"x": 0, "y": 9}, {"x": 1, "y": 9}, {"x": 2, "y": 9}, {"x": 3, "y": 9}, {"x": 4, "y": 9}, {"x": 6, "y": 9}, {"x": 7, "y": 9}, {"x": 8, "y": 9}, {"x": 9, "y": 9},
      {"x": 0, "y": 1}, {"x": 0, "y": 2}, {"x": 0, "y": 3}, {"x": 0, "y": 4}, {"x": 0, "y": 5}, {"x": 0, "y": 6}, {"x": 0, "y": 7}, {"x": 0, "y": 8},
      {"x": 9, "y": 1}, {"x": 9, "y": 2}, {"x": 9, "y": 3}, {"x": 9, "y": 4}, {"x": 9, "y": 5}, {"x": 9, "y": 6}, {"x": 9, "y": 7}, {"x": 9, "y": 8},
      {"x": 7, "y": 1}, {"x": 7, "y": 2}, {"x": 7, "y": 3}, {"x": 7, "y": 4}, {"x": 7, "y": 5}, {"x": 7, "y": 6}, {"x": 7, "y": 7}, {"x": 6, "y": 7}, {"x": 5, "y": 7}, {"x": 4, "y": 7}, {"x": 3, "y": 7}, {"x": 2, "y": 7}, {"x": 2, "y": 6}, {"x": 2, "y": 5}, {"x": 2, "y": 4}, {"x": 2, "y": 3}, {"x": 2, "y": 2}, {"x": 3, "y": 2}, {"x": 4, "y": 2}, {"x": 5, "y": 2}, {"x": 5, "y": 3}, {"x": 5, "y": 4}, {"x": 5, "y": 5}
    ]
  }
];

// Character sprite templates for selection
export const SPRITE_TEMPLATES = [
  { name: 'Hen', image: '🐔' },
  { name: 'Chick', image: '🐥' },
  { name: 'Hamster', image: '🐹' },
  { name: 'Robot', image: '🤖' },
  { name: 'Frog', image: '🐸' },
];

// Audio asset configuration
export const SOUND_SAMPLES = {
  up: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  down: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  left: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  right: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  fail: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
  pop: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  bgm: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
};
