
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';
export type GameMode = 'local' | 'ai' | 'remote';

export interface PieceInfo {
  type: PieceType;
  color: PieceColor;
  square: string;
}

export interface GameStatus {
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  turn: PieceColor;
  winner: PieceColor | 'draw' | null;
  mode: GameMode;
  aiThinking: boolean;
  roomId?: string;
}
