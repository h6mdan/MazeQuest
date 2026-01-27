
export enum BlockCategory {
  MOTION = 'motion',
  CONTROL = 'control'
}

export enum BlockType {
  MOVE_UP = 'MOVE_UP',
  MOVE_DOWN = 'MOVE_DOWN',
  MOVE_LEFT = 'MOVE_LEFT',
  MOVE_RIGHT = 'MOVE_RIGHT',
  WAIT = 'WAIT'
}

export interface Block {
  id: string;
  type: BlockType;
  category: BlockCategory;
  label: string;
  icon: string;
}

export interface Script {
  id: string;
  blocks: Block[];
}

export interface Sprite {
  id: string;
  name: string;
  image: string;
  gridX: number;
  gridY: number;
  scripts: Script[];
  isMoving?: boolean;
}

export interface LevelTheme {
  name: string;
  wallIcon: string;
  goalIcon: string;
  floorBg: string;
  wallBg: string;
  accentColor: string;
  borderColor: string;
}

export interface Level {
  id: number;
  theme: LevelTheme;
  walls: { x: number, y: number }[];
  goal: { x: number, y: number };
  start: { x: number, y: number };
}

export type EditBrush = 'wall' | 'start' | 'goal';

export interface GameState {
  sprites: Sprite[];
  activeSpriteId: string;
  isRunning: boolean;
  level: Level;
  winStatus: 'playing' | 'won' | 'lost';
  isEditMode: boolean;
  editBrush: EditBrush;
}
