
import { Category } from './types';

// Definimos un tablero de 42 casillas (6 radios de 3 + 6 HQs + anillo de 18 + centro)
// Para simplificar la lógica de movimiento lineal manteniendo la estética visual compleja:
export const BOARD_SIZE = 36; 

export const CATEGORIES_ORDER = [
  Category.GEOGRAPHY,
  Category.ENTERTAINMENT,
  Category.HISTORY,
  Category.ART,
  Category.SCIENCE,
  Category.SPORTS
];

export const AVATARS = [
  '⚡', '🛡️', '🧬', '🔮', '🛰️', '🔥', '💧', '🌿', '💎', '👑'
];

export const PLAYER_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#22c55e', // green
  '#eab308', // yellow
  '#d946ef', // fuchsia
  '#f97316'  // orange
];
