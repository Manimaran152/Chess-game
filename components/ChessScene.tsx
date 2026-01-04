
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { Chess } from 'chess.js';
import Board from './Board';
import Pieces from './Pieces';

interface ChessSceneProps {
  game: Chess;
  selectedSquare: string | null;
  validMoves: string[];
  lastMove: { from: string; to: string } | null;
  onSquareClick: (square: string) => void;
}

const ChessScene: React.FC<ChessSceneProps> = ({ 
  game, 
  selectedSquare, 
  validMoves, 
  lastMove,
  onSquareClick 
}) => {
  // Fix: Declare locally typed tags to bypass missing JSX intrinsic element definitions for Three.js
  const AmbientLight = 'ambientLight' as any;
  const SpotLight = 'spotLight' as any;
  const PointLight = 'pointLight' as any;
  const Group = 'group' as any;
  const Color = 'color' as any;

  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 8, 8]} fov={45} />
      
      <OrbitControls 
        makeDefault
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2.1} 
        enablePan={false}
        dampingFactor={0.05}
        autoRotate={false}
      />

      <AmbientLight intensity={0.5} />
      <SpotLight 
        position={[10, 15, 10]} 
        angle={0.3} 
        penumbra={1} 
        intensity={2} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      <PointLight position={[-10, 5, -10]} intensity={0.5} />

      <Suspense fallback={null}>
        <Environment preset="city" />
        
        <Group position={[0, 0, 0]}>
          <Board 
            selectedSquare={selectedSquare} 
            validMoves={validMoves} 
            lastMove={lastMove}
            onSquareClick={onSquareClick}
          />
          <Pieces game={game} />
        </Group>

        <ContactShadows 
          position={[0, -0.01, 0]} 
          opacity={0.4} 
          scale={20} 
          blur={2} 
          far={4.5} 
        />
      </Suspense>

      <Color attach="background" args={['#0f172a']} />
    </Canvas>
  );
};

export default ChessScene;
