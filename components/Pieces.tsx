
import React from 'react';
import { Chess } from 'chess.js';
import PieceModel from './PieceModel';

interface PiecesProps {
  game: Chess;
}

const Pieces: React.FC<PiecesProps> = ({ game }) => {
  const pieces = [];
  const board = game.board();

  // Fix: Declare locally typed tag
  const Group = 'group' as any;

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (piece) {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
        const square = `${files[f]}${ranks[r]}`;
        
        pieces.push(
          <PieceModel
            key={`${square}-${piece.type}-${piece.color}`}
            type={piece.type}
            color={piece.color}
            position={[f - 3.5, 0.05, r - 3.5]}
          />
        );
      }
    }
  }

  return <Group>{pieces}</Group>;
};

export default Pieces;
