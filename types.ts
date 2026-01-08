
export enum Category {
  GEOGRAPHY = 'Geografía',
  ENTERTAINMENT = 'Entretenimiento',
  HISTORY = 'Historia',
  ART = 'Arte',
  SCIENCE = 'Ciencia',
  SPORTS = 'Deporte'
}

export const CategoryColors: Record<Category, string> = {
  [Category.GEOGRAPHY]: '#3b82f6', // blue
  [Category.ENTERTAINMENT]: '#eab308', // yellow
  [Category.HISTORY]: '#f97316', // orange
  [Category.ART]: '#d946ef', // fuchsia
  [Category.SCIENCE]: '#22c55e', // green
  [Category.SPORTS]: '#ef4444'  // red
};

export type Difficulty = 'fácil' | 'intermedia' | 'extrema';

export interface Player {
  id: number;
  name: string;
  avatar: string;
  position: number;
  tokens: Category[];
  color: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export type GameState = 'setup' | 'playing' | 'question' | 'result' | 'finished';
