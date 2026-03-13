import React from 'react';
import * as THREE from 'three';
import { D } from './dimensions';
import { useCSG } from './CSGMesh';

export default function Exhaust() {
  const halfL = D.length / 2;

  // Center-exit dual exhaust pipes with CSG hollow
  const leftPipeGeo = useCSG(
    {
      geometry: new THREE.CylinderGeometry(0.035, 0.035, 0.15, 24),
      material: new THREE.MeshStandardMaterial({
        color: '#888888',
        metalness: 0.8,
        roughness: 0.15,
      }),
    },
    [
      {
        geometry: new THREE.CylinderGeometry(0.028, 0.028, 0.16, 24),
      },
    ]
  );

  const rightPipeGeo = useCSG(
    {
      geometry: new THREE.CylinderGeometry(0.035, 0.035, 0.15, 24),
      material: new THREE.MeshStandardMaterial({
        color: '#888888',
        metalness: 0.8,
        roughness: 0.15,
      }),
    },
    [
      {
        geometry: new THREE.CylinderGeometry(0.028, 0.028, 0.16, 24),
      },
    ]
  );

  return (
    <group position={[-halfL + 0.01, D.groundClearance + 0.06, 0]}>
      {/* Center-exit dual exhaust (GT3 signature!) */}

      {/* Left pipe */}
      <group position={[0, 0, 0.06]} rotation={[0, 0, Math.PI / 2]}>
        <mesh geometry={leftPipeGeo}>
          <meshStandardMaterial
            color="#888888"
            metalness={0.85}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Right pipe */}
      <group position={[0, 0, -0.06]} rotation={[0, 0, Math.PI / 2]}>
        <mesh geometry={rightPipeGeo}>
          <meshStandardMaterial
            color="#888888"
            metalness={0.85}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Exhaust tip bezels (titanium finish) */}
      {[0.06, -0.06].map((z, i) => (
        <mesh key={i} position={[-0.06, 0, z]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.033, 0.004, 8, 24]} />
          <meshStandardMaterial
            color="#997755"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* Inner glow hint (heat) */}
      {[0.06, -0.06].map((z, i) => (
        <mesh key={`glow${i}`} position={[-0.04, 0, z]} rotation={[0, 0, Math.PI / 2]}>
          <circleGeometry args={[0.025, 16]} />
          <meshStandardMaterial
            color="#331100"
            emissive="#331100"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Connecting pipe routing (under car) */}
      <mesh position={[0.4, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 12]} />
        <meshStandardMaterial color="#555555" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Muffler body */}
      <mesh position={[0.6, -0.02, 0]}>
        <boxGeometry args={[0.30, 0.08, 0.25]} />
        <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Heat shield */}
      <mesh position={[0.6, 0.03, 0]}>
        <boxGeometry args={[0.28, 0.005, 0.23]} />
        <meshStandardMaterial color="#AA8855" metalness={0.3} roughness={0.7} />
      </mesh>
    </group>
  );
}
