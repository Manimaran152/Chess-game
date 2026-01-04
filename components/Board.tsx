
import React from 'react';
import { MeshProps } from '@react-three/fiber';

interface BoardProps {
  selectedSquare: string | null;
  validMoves: string[];
  lastMove: { from: string; to: string } | null;
  onSquareClick: (square: string) => void;
}

const Board: React.FC<BoardProps> = ({ selectedSquare, validMoves, lastMove, onSquareClick }) => {
  const squares = [];
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

  // Fix: Declare locally typed tags to bypass missing JSX intrinsic element definitions
  const Group = 'group' as any;
  const Mesh = 'mesh' as any;
  const BoxGeometry = 'boxGeometry' as any;
  const MeshStandardMaterial = 'meshStandardMaterial' as any;

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const square = `${files[f]}${ranks[r]}`;
      const isBlack = (f + r) % 2 === 0;
      const isSelected = selectedSquare === square;
      const isValidMove = validMoves.includes(square);
      const isLastMove = lastMove?.from === square || lastMove?.to === square;

      squares.push(
        <Square
          key={square}
          // Fix: Cast position to tuple to avoid generic number[] inference
          position={[f - 3.5, 0, 3.5 - r] as [number, number, number]}
          isBlack={isBlack}
          isSelected={isSelected}
          isValidMove={isValidMove}
          isLastMove={isLastMove}
          onClick={() => onSquareClick(square)}
        />
      );
    }
  }

  return (
    <Group>
      {/* Board Base */}
      <Mesh receiveShadow position={[0, -0.26, 0]}>
        <BoxGeometry args={[8.5, 0.5, 8.5]} />
        <MeshStandardMaterial color="#2d3748" metalness={0.5} roughness={0.2} />
      </Mesh>
      {squares}
    </Group>
  );
};

interface SquareProps extends MeshProps {
  isBlack: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  isLastMove: boolean;
  onClick: () => void;
  // Fix: Explicitly define position property as some environments may have broken MeshProps definitions
  position?: [number, number, number];
}

const Square: React.FC<SquareProps> = ({ isBlack, isSelected, isValidMove, isLastMove, onClick, ...props }) => {
  let color = isBlack ? '#1a202c' : '#edf2f7';
  
  if (isSelected) color = '#f6e05e';
  else if (isValidMove) color = '#68d391';
  else if (isLastMove) color = '#90cdf4';

  // Fix: Locally typed tags
  const Mesh = 'mesh' as any;
  const BoxGeometry = 'boxGeometry' as any;
  const MeshStandardMaterial = 'meshStandardMaterial' as any;

  return (
    <Mesh 
      {...props} 
      receiveShadow 
      onClick={(e: any) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <BoxGeometry args={[1, 0.1, 1]} />
      <MeshStandardMaterial 
        color={color} 
        roughness={0.3} 
        metalness={0.1}
        emissive={isValidMove ? '#22543d' : (isSelected ? '#744210' : '#000000')}
        emissiveIntensity={isValidMove || isSelected ? 0.5 : 0}
      />
    </Mesh>
  );
};

export default Board;
