import React, { useMemo } from 'react';
import * as THREE from 'three';
import { D } from './dimensions';
import { useCSG } from './CSGMesh';

// Flat-6 boxer engine - horizontally opposed
// 3 cylinders on each side (left and right)
export default function Engine({ pistonOffset = 0 }) {
  const bore = D.engine.bore;
  const stroke = D.engine.stroke;
  const cylCount = D.engine.cylinders;

  // CSG engine block with hollow bores
  const blockGeo = useCSG(
    {
      geometry: new THREE.BoxGeometry(0.45, 0.18, 0.55),
      material: new THREE.MeshStandardMaterial({
        color: '#888888',
        metalness: 0.6,
        roughness: 0.4,
      }),
    },
    // Subtract 6 cylinder bores
    [
      // Left bank (3 cylinders)
      ...Array.from({ length: 3 }, (_, i) => ({
        geometry: new THREE.CylinderGeometry(bore / 2, bore / 2, 0.2, 16),
        position: [-0.12 + i * 0.12, 0, 0.15],
        rotation: [Math.PI / 2, 0, 0],
      })),
      // Right bank (3 cylinders)
      ...Array.from({ length: 3 }, (_, i) => ({
        geometry: new THREE.CylinderGeometry(bore / 2, bore / 2, 0.2, 16),
        position: [-0.12 + i * 0.12, 0, -0.15],
        rotation: [Math.PI / 2, 0, 0],
      })),
    ]
  );

  return (
    <group position={[D.rearAxleX - 0.25, D.rearWheelY + 0.05, 0]}>
      {/* Engine block */}
      <mesh geometry={blockGeo}>
        <meshStandardMaterial color="#888888" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Cylinder heads - left bank */}
      <mesh position={[0, 0, 0.30]}>
        <boxGeometry args={[0.42, 0.10, 0.08]} />
        <meshStandardMaterial color="#777777" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Cylinder heads - right bank */}
      <mesh position={[0, 0, -0.30]}>
        <boxGeometry args={[0.42, 0.10, 0.08]} />
        <meshStandardMaterial color="#777777" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Valve covers with fins (air-cooled heritage look) */}
      {[1, -1].map((side) => (
        <group key={side}>
          <mesh position={[0, 0.02, side * 0.35]}>
            <boxGeometry args={[0.40, 0.04, 0.04]} />
            <meshStandardMaterial color="#444444" metalness={0.4} roughness={0.5} />
          </mesh>
          {/* Cooling fins */}
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={i} position={[-0.16 + i * 0.045, 0.04, side * 0.35]}>
              <boxGeometry args={[0.003, 0.015, 0.06]} />
              <meshStandardMaterial color="#555555" metalness={0.5} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Pistons - animated, alternating for boxer */}
      {Array.from({ length: 3 }, (_, i) => {
        const offset = Math.sin(pistonOffset + (i * Math.PI * 2) / 3) * stroke / 2;
        const oppositeOffset = -offset; // Boxer: opposite banks are 180 degrees out
        return (
          <React.Fragment key={i}>
            {/* Left piston */}
            <mesh position={[-0.12 + i * 0.12, 0, 0.15 + offset]}>
              <cylinderGeometry args={[bore / 2 - 0.003, bore / 2 - 0.003, 0.04, 16]} />
              <meshStandardMaterial color="#AAAAAA" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Right piston */}
            <mesh position={[-0.12 + i * 0.12, 0, -0.15 + oppositeOffset]}>
              <cylinderGeometry args={[bore / 2 - 0.003, bore / 2 - 0.003, 0.04, 16]} />
              <meshStandardMaterial color="#AAAAAA" metalness={0.8} roughness={0.2} />
            </mesh>
          </React.Fragment>
        );
      })}

      {/* Intake plenum on top */}
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[0.35, 0.08, 0.25]} />
        <meshStandardMaterial color="#333333" roughness={0.7} />
      </mesh>

      {/* Individual throttle bodies (GT3 special - 6 ITBs!) */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[-0.12 + (i % 3) * 0.12, 0.10, i < 3 ? 0.18 : -0.18]}>
          <cylinderGeometry args={[0.02, 0.025, 0.06, 12]} />
          <meshStandardMaterial color="#555555" metalness={0.5} roughness={0.3} />
        </mesh>
      ))}

      {/* Oil sump */}
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[0.35, 0.06, 0.30]} />
        <meshStandardMaterial color="#444444" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Alternator */}
      <mesh position={[0.20, -0.05, 0.20]}>
        <cylinderGeometry args={[0.04, 0.04, 0.05, 16]} />
        <meshStandardMaterial color="#555555" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Serpentine belt pulleys */}
      {[
        [0.22, -0.02, 0.20],
        [0.22, -0.08, 0.20],
        [0.15, -0.08, 0.20],
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <torusGeometry args={[0.025, 0.005, 8, 16]} />
          <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.2} />
        </mesh>
      ))}

      {/* Exhaust manifold stubs */}
      {Array.from({ length: 3 }, (_, i) => (
        <React.Fragment key={i}>
          <mesh position={[-0.12 + i * 0.12, -0.08, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.06, 12]} />
            <meshStandardMaterial color="#995533" metalness={0.5} roughness={0.6} />
          </mesh>
          <mesh position={[-0.12 + i * 0.12, -0.08, -0.32]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.06, 12]} />
            <meshStandardMaterial color="#995533" metalness={0.5} roughness={0.6} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
}
