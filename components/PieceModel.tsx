
import React from 'react';

interface PieceModelProps {
  type: string;
  color: 'w' | 'b';
  position: [number, number, number];
}

const PieceModel: React.FC<PieceModelProps> = ({ type, color, position }) => {
  const pieceColor = color === 'w' ? '#f7fafc' : '#171923';
  const metalness = 0.8;
  const roughness = 0.1;

  // Fix: Locally typed tags to bypass missing JSX intrinsic element definitions
  const Group = 'group' as any;
  const Mesh = 'mesh' as any;
  const CylinderGeometry = 'cylinderGeometry' as any;
  const SphereGeometry = 'sphereGeometry' as any;
  const BoxGeometry = 'boxGeometry' as any;
  const TorusGeometry = 'torusGeometry' as any;
  const MeshStandardMaterial = 'meshStandardMaterial' as any;

  const getGeometry = () => {
    switch (type) {
      case 'p': // Pawn
        return (
          <Group>
            <Mesh position={[0, 0.2, 0]} castShadow>
              <CylinderGeometry args={[0.25, 0.35, 0.4, 16]} />
              <MeshStandardMaterial color={pieceColor} metalness={metalness} roughness={roughness} />
            </Mesh>
            <Mesh position={[0, 0.5, 0]} castShadow>
              <SphereGeometry args={[0.2, 16, 16]} />
              <MeshStandardMaterial color={pieceColor} metalness={metalness} roughness={roughness} />
            </Mesh>
          </Group>
        );
      case 'r': // Rook
        return (
          <Group>
            <Mesh position={[0, 0.35, 0]} castShadow>
              <CylinderGeometry args={[0.35, 0.35, 0.7, 16]} />
              <MeshStandardMaterial color={pieceColor} metalness={metalness} roughness={roughness} />
            </Mesh>
            <Mesh position={[0, 0.7, 0]} castShadow>
              <BoxGeometry args={[0.5, 0.2, 0.5]} />
              <MeshStandardMaterial color={pieceColor} metalness={metalness} roughness={roughness} />
            </Mesh>
          </Group>
        );
      case 'n': // Knight
        return (
          <Group rotation={[0, color === 'w' ? Math.PI : 0, 0]}>
            <Mesh position={[0, 0.3, 0]} castShadow>
              <CylinderGeometry args={[0.3, 0.35, 0.6, 16]} />
              <MeshStandardMaterial color={pieceColor} metalness={metalness} roughness={roughness} />
            </Mesh>
            <Mesh position={[0, 0.7, 0.1]} rotation={[-0.5, 0, 0]} castShadow>
              <BoxGeometry args={[0.3, 0.5, 0.4]} />
              <MeshStandardMaterial color={pieceColor} metalness={metalness} roughness={roughness} />
            </Mesh>
          </Group>
        );
      case 'b': // Bishop
        return (
          <Group>
            <Mesh position={[0, 0.4, 0]} castShadow>
              <CylinderGeometry args={[0.25, 0.35, 0.8, 16]} />
              <MeshStandardMaterial color={pieceColor} metalness={metalness} roughness={roughness} />
            </Mesh>
            <Mesh position={[0, 0.85, 0]} castShadow>
              <SphereGeometry args={[0.15, 16, 16]} />
              <MeshStandardMaterial color={pieceColor} metalness={metalness} roughness={roughness} />
            </Mesh>
          </Group>
        );
      case 'q': // Queen
        return (
          <Group>
            <Mesh position={[0, 0.5, 0]} castShadow>
              <CylinderGeometry args={[0.3, 0.4, 1.0, 16]} />
              <MeshStandardMaterial color={pieceColor} metalness={metalness} roughness={roughness} />
            </Mesh>
            <Mesh position={[0, 1.05, 0]} castShadow>
              <SphereGeometry args={[0.25, 16, 16]} />
              <MeshStandardMaterial color={pieceColor} metalness={metalness} roughness={roughness} />
            </Mesh>
            <Mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <TorusGeometry args={[0.2, 0.05, 12, 24]} />
              <MeshStandardMaterial color={pieceColor} metalness={metalness} roughness={roughness} />
            </Mesh>
          </Group>
        );
      case 'k': // King
        return (
          <Group>
            <Mesh position={[0, 0.5, 0]} castShadow>
              <CylinderGeometry args={[0.3, 0.4, 1.0, 16]} />
              <MeshStandardMaterial color={pieceColor} metalness={metalness} roughness={roughness} />
            </Mesh>
            <Mesh position={[0, 1.1, 0]} castShadow>
              <BoxGeometry args={[0.4, 0.1, 0.4]} />
              <MeshStandardMaterial color={pieceColor} metalness={metalness} roughness={roughness} />
            </Mesh>
            <Mesh position={[0, 1.25, 0]} castShadow>
              <BoxGeometry args={[0.1, 0.3, 0.1]} />
              <MeshStandardMaterial color={pieceColor} metalness={metalness} roughness={roughness} />
            </Mesh>
            <Mesh position={[0, 1.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <BoxGeometry args={[0.1, 0.25, 0.1]} />
              <MeshStandardMaterial color={pieceColor} metalness={metalness} roughness={roughness} />
            </Mesh>
          </Group>
        );
      default:
        return null;
    }
  };

  return (
    <Group position={position}>
      {/* Base for all pieces */}
      <Mesh position={[0, 0, 0]} castShadow>
        <CylinderGeometry args={[0.4, 0.45, 0.1, 24]} />
        <MeshStandardMaterial color={pieceColor} metalness={metalness} roughness={roughness} />
      </Mesh>
      {getGeometry()}
    </Group>
  );
};

export default PieceModel;
