import React from 'react';
import { D } from './dimensions';

const glassMat = {
  color: '#88AABB',
  metalness: 0.1,
  roughness: 0.05,
  transparent: true,
  opacity: 0.35,
};

export default function Glass() {
  const halfL = D.length / 2;

  return (
    <group>
      {/* Windshield - curved, steeply raked */}
      <mesh
        position={[halfL - D.frontOverhang - 0.35, D.hoodHeight + 0.18, 0]}
        rotation={[0.38, 0, 0]}
      >
        <boxGeometry args={[0.85, 0.48, D.bodyWidth - 0.18]} />
        <meshPhysicalMaterial
          {...glassMat}
          transmission={0.6}
          thickness={0.01}
        />
      </mesh>

      {/* Rear window - smaller (engine below), sloped following roofline */}
      <mesh
        position={[D.rearAxleX + 0.55, D.roofHeight - 0.15, 0]}
        rotation={[-0.45, 0, 0]}
      >
        <boxGeometry args={[0.6, 0.35, D.bodyWidth - 0.22]} />
        <meshPhysicalMaterial
          {...glassMat}
          transmission={0.5}
          thickness={0.01}
        />
      </mesh>

      {/* Side windows - left */}
      <mesh
        position={[0.2, D.beltlineHeight + 0.12, D.bodyWidth / 2 + 0.005]}
        rotation={[0, 0, 0]}
      >
        <boxGeometry args={[1.1, 0.22, 0.003]} />
        <meshPhysicalMaterial {...glassMat} transmission={0.5} />
      </mesh>

      {/* Side windows - right */}
      <mesh
        position={[0.2, D.beltlineHeight + 0.12, -D.bodyWidth / 2 - 0.005]}
        rotation={[0, 0, 0]}
      >
        <boxGeometry args={[1.1, 0.22, 0.003]} />
        <meshPhysicalMaterial {...glassMat} transmission={0.5} />
      </mesh>

      {/* Quarter windows (rear triangle) - left */}
      <mesh
        position={[-0.35, D.beltlineHeight + 0.1, D.bodyWidth / 2 + 0.005]}
      >
        <boxGeometry args={[0.25, 0.15, 0.003]} />
        <meshPhysicalMaterial {...glassMat} transmission={0.4} />
      </mesh>

      {/* Quarter windows (rear triangle) - right */}
      <mesh
        position={[-0.35, D.beltlineHeight + 0.1, -D.bodyWidth / 2 - 0.005]}
      >
        <boxGeometry args={[0.25, 0.15, 0.003]} />
        <meshPhysicalMaterial {...glassMat} transmission={0.4} />
      </mesh>

      {/* A-pillar trim - left */}
      <mesh
        position={[halfL - D.frontOverhang - 0.1, D.hoodHeight + 0.28, D.bodyWidth / 2 - 0.03]}
        rotation={[0, 0, 0.3]}
      >
        <boxGeometry args={[0.03, 0.5, 0.03]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* A-pillar trim - right */}
      <mesh
        position={[halfL - D.frontOverhang - 0.1, D.hoodHeight + 0.28, -D.bodyWidth / 2 + 0.03]}
        rotation={[0, 0, 0.3]}
      >
        <boxGeometry args={[0.03, 0.5, 0.03]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* Roof panel (between glass) */}
      <mesh position={[0.05, D.roofHeight + 0.005, 0]}>
        <boxGeometry args={[0.9, 0.01, D.bodyWidth - 0.15]} />
        <meshStandardMaterial color="#111111" roughness={0.6} />
      </mesh>
    </group>
  );
}
